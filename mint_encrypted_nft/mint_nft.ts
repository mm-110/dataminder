import {Metaplex, keypairIdentity, bundlrStorage } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, Keypair, PublicKey } from "@solana/web3.js";
import "dotenv/config";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import fs from 'fs';
import { encryptWithPassword, encryptWithPublicKey } from "./encrypt";
import { extractED25519Seed, ed25519ToX25519, generateX25519PublicKey, convertPublicKeyToBase64, convertBase64ToPublicKey } from './prepare_keys.ts';

const publicKey = process.argv[2];
const publicKeyBs64 = process.argv[3];

const connection = new Connection(clusterApiUrl("devnet"));
const wallet = getKeypairFromEnvironment("SECRET_KEY");
// Here we have to get the password
const password = "aaaa"
// Prepare the public key for asymmetric encryption
// const ed25519Seed = extractED25519Seed(wallet);
// const x25519PrivateKey = ed25519ToX25519(ed25519Seed);
// const x25519PublicKey = generateX25519PublicKey(x25519PrivateKey);
const bs64 = publicKeyBs64;
const back = convertBase64ToPublicKey(bs64);
console.log(back)

const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(wallet))
    .use(
        bundlrStorage({
            address: "https://devnet.irys.xyz",
            providerUrl: "https://api.devnet.solana.com",
            timeout: 60000,
        }),
    );

// Function to ecnrypt JSON data
const encryptJsonData = (data, password) => {
    const encryptedData = {};
    for (const key in data) {
        encryptedData[key] = encryptWithPassword(data[key], password);
    }
    return encryptedData;
};

// Import the data in json format
const rawData = fs.readFileSync("./test_data/items.json", 'utf8');
const jsonData = JSON.parse(rawData);
// Extract the name of the NFT from JSON data
const nftName = jsonData.name;
// Remove the name property from the JSON data to avoid duplicate metadata fields
delete jsonData.name;
// Encrypt the JSON data
const encryptedJsonData = encryptJsonData(jsonData, password)
// Encrypt the password
const encryptedPassword = encryptWithPublicKey(back, password)
const dataStructure = {
    "data": encryptedJsonData,
    "password": encryptedPassword
}
// Create NFT's metadata
const {uri} = await metaplex.nfts().uploadMetadata(dataStructure)
console.log(uri);


const owner = new PublicKey(publicKey);

// Create NFT
const {nft} = await metaplex.nfts().create(
    {
        uri: uri,
        password: encryptedPassword,
        name: nftName,
        sellerFeeBasisPoints: 0,
        tokenOwner: owner
    },
    {
        commitment: "confirmed"
    },
);

console.log(nft.address);


///////////////////////////////////////////////////////////////////////////////

// SEND NFT

// ... (codice esistente)

// // Chiave pubblica del destinatario (sostituisci con la chiave corretta)
// const recipientPublicKey = "<inserisci la chiave pubblica del destinatario>";

// // ... (codice esistente)

// // Creazione dell'NFT
// const { nft } = await metaplex.nfts().create(
//     {
//         uri: uri,
//         name: nftName,
//         sellerFeeBasisPoints: 0,
//     },
//     {
//         // Aggiungi la chiave pubblica del destinatario
//         destination: recipientPublicKey,
//     }
// );

// console.log("NFT creato con successo:", nft);

// // ... (codice esistente)


// 3k9jQqM2QcLzbToXSPGwTApwrq7iimahiAGVHgQUCxtR