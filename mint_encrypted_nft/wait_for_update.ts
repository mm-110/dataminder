import {Metaplex, keypairIdentity, bundlrStorage, PublicKey } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, Keypair } from "@solana/web3.js";
import "dotenv/config";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";

const connection = new Connection(clusterApiUrl("devnet"));
const wallet = getKeypairFromEnvironment("SECRET_KEY");

const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(wallet))
    .use(
        bundlrStorage({
            address: "https://devnet.bundlr.network",
            providerUrl: "https://api.devnet.solana.com",
            timeout: 60000,
        }),
    );
const mintAddress = new PublicKey("FUJGPbdUVntpKNbMqNJL5D71qEuLR2GXX3Pj2HLD4jgt")

let oldValue = null;
let counter = 0;

const checkValue = async () => {
    console.log(counter)
    const nft = await metaplex.nfts().findByMint({mintAddress});
    let response = await fetch(nft.uri);
    console.log(nft.uri)
    let data = await response.json();
    let newValue = data.value;
    console.log('Valore recuperato: ', newValue)

    if (oldValue === null) {
        oldValue = newValue;
        console.log("Current value: ", newValue)
    } else if (oldValue !== newValue) {
        console.log(`Il valore è cambiato: ${newValue}`);
        clearInterval(intervalId);
        
    } else {
        console.log('Il valore è rimasto uguale');
    }

    counter += 1;
};

// Controlla il valore ogni 10 secondi per 20 secondi
const intervalId = setInterval(checkValue, 2000);
setTimeout(() => clearInterval(intervalId), 40000);
