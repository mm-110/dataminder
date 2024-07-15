import { encryptWithPublicKey, decryptWithPrivateKey } from './encrypt.ts';
import { extractED25519Seed, ed25519ToX25519, generateX25519PublicKey } from './prepare_keys.ts';
import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import "dotenv/config";
import fs from 'fs';

// Initialize wallet and extract keys
const wallet = getKeypairFromEnvironment("SECRET_KEY");
const ed25519Seed = extractED25519Seed(wallet);
const x25519PrivateKey = ed25519ToX25519(ed25519Seed);

// Read the encrypted message components from the JSON file
const encryptedMessageFilePath = './test_data/encryptedMessage.json';
const encryptedMessageRaw = fs.readFileSync(encryptedMessageFilePath, 'utf8');
const encryptedMessageObj = JSON.parse(encryptedMessageRaw);

const decryptedMessage = decryptWithPrivateKey(x25519PrivateKey, encryptedMessageObj);

console.log('Messaggio decriptato:', decryptedMessage);