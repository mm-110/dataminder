import * as web3 from '@solana/web3.js';
import nacl from 'tweetnacl';
import naclUtil from 'tweetnacl-util';
import "dotenv/config";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";

// Get the Solana keypair from the environment variable
const wallet = getKeypairFromEnvironment("SECRET_KEY");

// Ensure the secret key is 32 bytes (ED25519 key pair)
const secretKey = new Uint8Array(wallet.secretKey);
if (secretKey.length !== 64) {
  throw new Error('Invalid secret key length, expected 64 bytes for ED25519 key pair');
}
const ed25519Seed = secretKey.slice(0, 32);

// Convert ED25519 to X25519 for key exchange
const ed25519ToX25519 = (edKey) => {
  const keyPair = nacl.sign.keyPair.fromSeed(edKey);
  return keyPair.secretKey.slice(0, 32);
};

// Get the public and private keys for X25519
const x25519PrivateKey = ed25519ToX25519(ed25519Seed);
const x25519PublicKey = nacl.scalarMult.base(x25519PrivateKey);

console.log(x25519PublicKey);
// Aggiunto per vedere la public key del wallet in .env
console.log(wallet.publicKey);

// console.log(typeof x25519PublicKey);