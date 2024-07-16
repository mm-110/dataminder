import { extractED25519Seed, ed25519ToX25519, generateX25519PublicKey, convertPublicKeyToBase64 } from './prepare_keys.ts';
import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import "dotenv/config";
import fs from 'fs';

// Initialize wallet and extract keys
const wallet = getKeypairFromEnvironment("SECRET_KEY");
const ed25519Seed = extractED25519Seed(wallet);
const x25519PrivateKey = ed25519ToX25519(ed25519Seed);
const x25519PublicKey = generateX25519PublicKey(x25519PrivateKey);
const publicKeyBase64 = convertPublicKeyToBase64(x25519PublicKey);

// Prepare the JSON object
const publicKeyJSON = {
    publicKey: publicKeyBase64
};

// Save the public key to a JSON file
const publicKeyFilePath = './test_data/publicKey.json';
fs.writeFileSync(publicKeyFilePath, JSON.stringify(publicKeyJSON, null, 2));

console.log(publicKeyBase64)