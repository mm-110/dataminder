import { Connection, clusterApiUrl, Keypair } from "@solana/web3.js";
import { Metaplex, keypairIdentity, irysStorage, PublicKey } from "@metaplex-foundation/js";
import React, { useState } from 'react';
import axios from 'axios';
import { hexStringToByte } from "./RequestAirdrop";

function LoadNFTs() {
    const connection = new Connection(clusterApiUrl("devnet"));
    const token = localStorage.getItem('authToken');
    const privateKey = localStorage.getItem('private_key');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        console.log("Retrivieng NFTs");
        event.preventDefault();
        if (privateKey) {
            console.log("private key found");
            const privateKeyBytes = hexStringToByte(privateKey);
            console.log(privateKeyBytes);
            const keypair = Keypair.fromSecretKey(privateKeyBytes);
            const metaplex = Metaplex.make(connection)
                .use(keypairIdentity(keypair))
                .use(
                    irysStorage({
                        address: 'https://devnet.irys.xyz',
                        providerUrl: 'https://api.devnet.solana.com',
                        timeout: 60000,
                    }),
                );
            const owner = new PublicKey(keypair.publicKey.toBase58().toString());
            const allNFTs = await metaplex.nfts().findAllByOwner({ owner : owner});
            console.log("NFT retrivied");
            console.log(allNFTs[0]);
            if (allNFTs.length > 0) {
                for (let i = 0; i < allNFTs.length; i++) {
                    const NFT = allNFTs[i];
                    if (NFT.mintAddress) {
                        console.log(NFT.mintAddress);
                        const address = new PublicKey(NFT.mintAddress);
                        console.log(address.toBase58());
                        console.log("URI: ", NFT.uri);
                        const nft = {
                            name: NFT.name,
                            mint_address: address.toBase58().toString(),
                            uri: NFT.uri,
                        }
                        axios.post(`http://localhost:8000/addNftRecord/${token}`, nft)
                            .then(response => {
                                console.log(response.data.message);
                            })
                            .catch(error => {
                                console.error('Si è verificato un errore nel caricamento del nft nel database');
                            });
                    } else {
                        console.log("Mint Address Not Found")
                    }
                }
            } else {
                console.log("L'array allNFTs è vuoto.");
            }
        }

        // axios.post(`http://localhost:8000/addKeypair/${token}`, newKeyPair)
        //     .then(response => {
        //         console.log(response.data.message);
        //     })
        //     .catch(error => {
        //         console.error('Si è verificato un errore durante l\'invio della coppia di chiavi:', error);
        //     });
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <button type="submit">Load NFTs</button>
            </form>
        </div>
    );
    
}

export default LoadNFTs;
