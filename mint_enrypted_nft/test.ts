import { encryptWithPublicKey, decryptWithPrivateKey } from './encrypt.ts';
import { extractED25519Seed, ed25519ToX25519, generateX25519PublicKey } from './prepare_keys.ts';
import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import "dotenv/config";

// Initialize wallet and extract keys
const wallet = getKeypairFromEnvironment("SECRET_KEY");
const ed25519Seed = extractED25519Seed(wallet);
const x25519PrivateKey = ed25519ToX25519(ed25519Seed);
const x25519PublicKey = generateX25519PublicKey(x25519PrivateKey);

// Define the original message
const originalMessage = 'Questo è uno scherzo';

// Encrypt and decrypt the message using X25519 keys
const encryptedMessage = encryptWithPublicKey(x25519PublicKey, originalMessage);
const decryptedMessage = decryptWithPrivateKey(x25519PrivateKey, encryptedMessage);

console.log('Messaggio originale:', originalMessage);
console.log('Messaggio criptato:', encryptedMessage.ciphertext);
console.log('Messaggio decriptato:', decryptedMessage);