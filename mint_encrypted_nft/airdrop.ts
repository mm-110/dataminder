import "dotenv/config";
import { airdropIfRequired, getKeypairFromEnvironment } from "@solana-developers/helpers";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("devnet"));

const keypair = getKeypairFromEnvironment("SECRET_KEY");
console.log(keypair.publicKey.toBase58());


// Check the balance of the account
const balance = await connection.getBalance(keypair.publicKey);
console.log(`Account balance: ${balance / 1e9} SOL`);

// const airdropSignature = await connection.requestAirdrop(
//     keypair.publicKey,
//     1 * LAMPORTS_PER_SOL
// );

// console.log("Success. Transaction at https://explorer.solana.com/tx/" + airdropSignature + "?cluster=devnet");
