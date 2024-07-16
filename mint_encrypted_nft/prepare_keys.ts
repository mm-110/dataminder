import * as web3 from '@solana/web3.js';
import nacl from 'tweetnacl';
import naclUtil from 'tweetnacl-util';
import fs from 'fs';

// Ensure the secret key is 32 bytes (ED25519 key pair)
export function extractED25519Seed(wallet) {
  // Ensure the secret key is 32 bytes (ED25519 key pair)
  const secretKey = new Uint8Array(wallet.secretKey);
  if (secretKey.length !== 64) {
    throw new Error('Invalid secret key length, expected 64 bytes for ED25519 key pair');
  }
  return secretKey.slice(0, 32);
}

// Convert ED25519 to X25519 for key exchange
export function ed25519ToX25519(edKey) {
  const keyPair = nacl.sign.keyPair.fromSeed(edKey);
  return keyPair.secretKey.slice(0, 32);
}

export function generateX25519PublicKey(x25519PrivateKey) {
  return nacl.scalarMult.base(x25519PrivateKey);
}

export function convertPublicKeyToBase64(publicKey: Uint8Array): string {
  return naclUtil.encodeBase64(publicKey);
}

export function loadPublicKeyFromJSON(filePath: string): Uint8Array {
  const data = fs.readFileSync(filePath, 'utf8');
  const json = JSON.parse(data);
  const publicKey = json.publicKey;
  if (!publicKey) {
      throw new Error('publicKey not found in JSON file');
  }
  return naclUtil.decodeBase64(publicKey);
}