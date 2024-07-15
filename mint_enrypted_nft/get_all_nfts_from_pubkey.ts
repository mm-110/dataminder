import "dotenv/config";
import { Metaplex, keypairIdentity, bundlrStorage, PublicKey } from "@metaplex-foundation/js";
import { airdropIfRequired, getKeypairFromEnvironment } from "@solana-developers/helpers";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("devnet"));

const keypair = getKeypairFromEnvironment("SECRET_KEY");
console.log(keypair.publicKey.toBase58());

const owner = new PublicKey("46MxAaTreYTuixjRuQn4JFoVDo4gzLg3dQ2HGHhffn3e");


// Check the balance of the account
const balance = await connection.getBalance(keypair.publicKey);
console.log(`Account balance: ${balance / 1e9} SOL`);


const metaplex = Metaplex.make(connection)
            .use(keypairIdentity(keypair))
            .use(
                bundlrStorage({
                    address: "https://devnet.irys.xyz",
                    providerUrl: "https://api.devnet.solana.com",
                    timeout: 60000,
                }),
            );
        console.log("Metaplex configurato.");

const allNFTs = await metaplex.nfts().findAllByOwner({owner: owner});
console.log(typeof allNFTs[0]);

if (allNFTs.length > 0) {
    for (let i = 0; i < allNFTs.length; i++) {
        const NFT = allNFTs[i];
        if (NFT.mintAddress) {
            console.log(NFT.mintAddress);
            const address = new PublicKey(NFT.mintAddress);
            console.log(address.toBase58());
        } else {
            console.log("La proprietà mintAddress è undefined.");
        }
    }
} else {
    console.log("L'array allNFTs è vuoto.");
}
// const airdropSignature = await connection.requestAirdrop(
//     keypair.publicKey,
//     1 * LAMPORTS_PER_SOL
// );

// console.log("Success. Transaction at https://explorer.solana.com/tx/" + airdropSignature + "?cluster=devnet");
