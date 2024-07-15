import * as web3 from '@solana/web3.js';
import nacl from 'tweetnacl';
import naclUtil from 'tweetnacl-util';
import "dotenv/config";
import crypto from 'crypto'

// Function to encrypt a message using the recipient's public key
export function encryptWithPublicKey(publicKey, message) {
  const nonce = nacl.randomBytes(nacl.box.nonceLength);
  const keyPair = nacl.box.keyPair();
  const sharedSecret = nacl.box.before(publicKey, keyPair.secretKey);

  const encryptedMessage = nacl.box.after(
    naclUtil.decodeUTF8(message),
    nonce,
    sharedSecret
  );

  return {
    ciphertext: naclUtil.encodeBase64(encryptedMessage),
    nonce: naclUtil.encodeBase64(nonce),
    ephemeralPublicKey: naclUtil.encodeBase64(keyPair.publicKey),
  };
}

// Function to decrypt a message using the recipient's private key
export function decryptWithPrivateKey(privateKey, encryptedMessage) {
  const nonce = naclUtil.decodeBase64(encryptedMessage.nonce);
  const ephemeralPublicKey = naclUtil.decodeBase64(encryptedMessage.ephemeralPublicKey);
  const ciphertext = naclUtil.decodeBase64(encryptedMessage.ciphertext);

  const sharedSecret = nacl.box.before(ephemeralPublicKey, privateKey);
  const decryptedMessage = nacl.box.open.after(ciphertext, nonce, sharedSecret);

  if (!decryptedMessage) {
    throw new Error('Decryption failed');
  }

  return naclUtil.encodeUTF8(decryptedMessage);
}

// Function to derive a key from the password
function getKeyFromPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha512');
}

// Function to encrypt data with a password
export function encryptWithPassword(text, password) {
  const algorithm = 'aes-256-cbc';
  const iv = crypto.randomBytes(16);
  const salt = crypto.randomBytes(16);
  const key = getKeyFromPassword(password, salt);

  let cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return {
      iv: iv.toString('hex'),
      encryptedData: encrypted,
      salt: salt.toString('hex')
  };
}

// Function to decrypt data with a password
export function decryptWithPassword(encryptedObj, password) {
  const algorithm = 'aes-256-cbc';
  const iv = Buffer.from(encryptedObj.iv, 'hex');
  const salt = Buffer.from(encryptedObj.salt, 'hex');
  const key = getKeyFromPassword(password, salt);

  let decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedObj.encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}