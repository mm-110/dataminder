import { encryptWithPublicKey, decryptWithPrivateKey } from './encrypt.ts';
import { extractED25519Seed, ed25519ToX25519, generateX25519PublicKey, loadPublicKeyFromJSON } from './prepare_keys.ts';
import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import "dotenv/config";
import { config } from 'dotenv';
import naclUtil from 'tweetnacl-util';
import fs from 'fs';

const filePath = './test_data/publicKey.json';
const publicKey = loadPublicKeyFromJSON(filePath);

// Define the original message
const originalMessage = 'Messaggio da criptare';

// Encrypt and decrypt the message using X25519 keys
const encryptedMessage = encryptWithPublicKey(publicKey, originalMessage);

// Save the encrypted message components to a JSON file
const encryptedMessageFilePath = './test_data/encryptedMessage.json';
fs.writeFileSync(encryptedMessageFilePath, JSON.stringify(encryptedMessage));

console.log('Messaggio originale:', originalMessage);
console.log('Messaggio criptato:', encryptedMessage.ciphertext);