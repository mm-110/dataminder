import { Metaplex, keypairIdentity, irysStorage, PublicKey } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, Keypair } from "@solana/web3.js";
import "dotenv/config";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";

// Aggiornato il programma perchè così si vedono tutti i campi accessibili tramite la variabile nft definita alla riga 32

async function main() {
    try {
        console.log("Inizio programma...");

        const connection = new Connection(clusterApiUrl("devnet"));
        console.log("Connessione a devnet creata.");

        const wallet = getKeypairFromEnvironment("SECRET_KEY");
        console.log("Portafoglio ottenuto dall'ambiente.");

        const metaplex = Metaplex.make(connection)
            .use(keypairIdentity(wallet))
            .use(
                irysStorage({
                    address: "https://devnet.irys.xyz",
                    providerUrl: "https://api.devnet.solana.com",
                    timeout: 60000,
                }),
            );
        console.log("Metaplex configurato.");

        const mintAddress = new PublicKey("Gyx4Eqgd9NHsXwa2rahdef1GWotimnawMgExFfXqT7Y7");
        console.log("Indirizzo di minting creato:", mintAddress.toString());

        const nft = await metaplex.nfts().findByMint({ mintAddress });
        console.log("NFT trovato:", nft);

        console.log("URI dei metadati dell'NFT:", nft.uri);

        const response = await fetch(nft.uri);
        const data = await response.json();
        console.log("Dati dei metadati dell'NFT:", data);
    } catch (error) {
        console.error("Errore:", error);
    }
}

main();
