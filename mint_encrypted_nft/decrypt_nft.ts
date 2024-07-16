import { Metaplex, keypairIdentity, irysStorage, PublicKey } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, Keypair } from "@solana/web3.js";
import "dotenv/config";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import fetch from 'node-fetch'; // Make sure to install node-fetch if you haven't
import { decryptWithPassword } from "././encrypt"; // Import your decryption function

const connection = new Connection(clusterApiUrl("devnet"));
const wallet = getKeypairFromEnvironment("SECRET_KEY");

const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(wallet))
    .use(
        irysStorage({
            address: "https://devnet.irys.xyz",
            providerUrl: "https://api.devnet.solana.com",
            timeout: 60000,
        }),
    );

const mintAddress = new PublicKey("Gyx4Eqgd9NHsXwa2rahdef1GWotimnawMgExFfXqT7Y7");

const decryptJsonData = (data, password) => {
    const decryptedData = {};
    for (const key in data) {
        decryptedData[key] = decryptWithPassword(data[key], password);
    }
    return decryptedData;
};

const nft = await metaplex.nfts().findByMint({ mintAddress });
console.log("NFT URI:", nft.uri);

const response = await fetch(nft.uri);
if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
}

const encryptedData = await response.json();
console.log("Encrypted Data:", encryptedData);

// Here we have to get the password
const password = "aaaa";
const decryptedData = decryptJsonData(encryptedData, password);

console.log("Decrypted Data:", decryptedData);
