import { Connection, clusterApiUrl, Keypair } from "@solana/web3.js";
import { Metaplex, keypairIdentity, irysStorage, PublicKey } from "@metaplex-foundation/js";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link'
import { decryptWithPassword, decryptWithPrivateKey } from "../functions/encrypt";
// import { hexStringToByte } from "./RequestAirdrop";

function hexStringToByte(str: string): Uint8Array {
    if (!str) {
        return new Uint8Array();
    }

    const a: number[] = [];
    for (let i = 0, len = str.length; i < len; i += 2) {
        a.push(parseInt(str.substr(i, 2), 16));
    }

    return new Uint8Array(a);
}

function GetPayedNFTDetail({ id }) {
    const [record, setRecord] = useState(null);
    const [metadata, setMetadata] = useState(null); // Aggiunto uno stato per i metadati
    const [loadingMetadata, setLoadingMetadata] = useState(false); // Aggiungi questo stato

    const token = localStorage.getItem('authToken');
    console.log("tokennnnnn", token);

    useEffect(() => {
        // Sostituisci con l'URL del tuo server e l'endpoint appropriato
        axios.get(`http://localhost:8000/getPayedNftDetail/${token}/${id}`)
            .then(response => {
                setRecord(response.data);
                console.log(response.data);
                getMetadata(response.data); // Chiamata a getMetadata
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }, [id]);

    const getMetadata = async (requestData) => { // Modificato per accettare uri come parametro
        setLoadingMetadata(true);
        let response = await fetch(requestData.nft.uri);
        let metadataJson = await response.json();

        const encryptedPassword = {
            ciphertext: requestData.password_ciphertext,
            nonce: requestData.password_nonce,
            ephemeralPublicKey: requestData.password_ephemeral_pk
        };
        
        
        console.log("encryptedpassword", encryptedPassword);
        const data = metadataJson.data;

        // recuperare la chiave privata x25519 dal localStorage
        const private_key_x25519 = localStorage.getItem('private_key_x25519');
        console.log("private_key_x25519", private_key_x25519);
        // convertirla in Uint8Array
        const privateKey = hexStringToByte(private_key_x25519);
        console.log("privateKey uint8 array", privateKey);
        // decryptedpassword = decryptWithPrivateKey(password, privateKey)
        const decryptedPassword = decryptWithPrivateKey(privateKey, encryptedPassword);
        console.log("decryptedPassword", decryptedPassword);
        // const decrypteddata = decryptWithPassword(data, decryptedpassword);

        const decryptJsonData = (data, password) => {
            const decryptedData = {};
            for (const key in data) {
                decryptedData[key] = decryptWithPassword(data[key], password);
            }
            return decryptedData;
        };
        const decryptedData = decryptJsonData(data, decryptedPassword);
        
        setMetadata(decryptedData); // Salvataggio dei metadati nello stato
        setLoadingMetadata(false); 
    }

    if (!record || loadingMetadata) {
        return <div>Loading...</div>
    }

    return (
        <div>
            <h1>Record</h1>
            <p>ID del record: {record.id}</p>
            <p>NFT ID: {record.nft_id}</p>

            {/* Aggiunto rendering dei metadati */}
            {metadata && <pre>{JSON.stringify(metadata, null, 2)}</pre>}
        </div>
    );
}
export default GetPayedNFTDetail;
