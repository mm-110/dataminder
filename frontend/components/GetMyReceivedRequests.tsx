import { Connection, clusterApiUrl, Keypair } from "@solana/web3.js";
import { Metaplex, keypairIdentity, irysStorage, PublicKey } from "@metaplex-foundation/js";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link'
import { decryptWithPassword, decryptWithPrivateKey, encryptWithPublicKey } from "../functions/encrypt";
import { convertBase64ToPublicKey } from "../functions/prepare_keys";

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

function GetMyReceivedRequests() {
    const [records, setRecords] = useState([]);

    const token = localStorage.getItem('authToken');

    useEffect(() => {
        // Sostituisci con l'URL del tuo server e l'endpoint appropriato
        axios.get(`http://localhost:8000/getReceivedRequests/${token}`)
            .then(response => {
                setRecords(response.data);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }, []);

    const handleAccept = async (recordId, recordRequesterPBX25519, nftUri, userToken) => {
        console.log(`Request ID: ${recordId}, User Token: ${userToken}`);

        const private_key_x25519 = localStorage.getItem('private_key_x25519');

        let response = await fetch(nftUri);
        let metadataJson = await response.json();
        const password = metadataJson.password;

        const privateKey = hexStringToByte(private_key_x25519);
        console.log("privateKey uint8 array", privateKey);
        // decryptedpassword = decryptWithPrivateKey(password, privateKey)
        const decryptedPassword = decryptWithPrivateKey(privateKey, password);
        console.log("decryptedPassword", decryptedPassword);

        const requester_public_key = convertBase64ToPublicKey(recordRequesterPBX25519);
        console.log("requester_public_key", requester_public_key);

        const encryptedPassword = encryptWithPublicKey(requester_public_key, decryptedPassword);
        console.log("encryptedPassword", encryptedPassword);

        axios.post(`http://localhost:8000/sendEncryptedPassword/${userToken}/${recordId}`, {
            ciphertext: encryptedPassword.ciphertext,
            ephemeralPublicKey: encryptedPassword.ephemeralPublicKey,
            nonce: encryptedPassword.nonce
        }) 
        .then(response => {
            console.log(response.data.message);
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
    };


    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>NFT NAME</th>
                        <th>NFT PUBLIC KEY REQUESTER</th>
                        <th>NFT PKX REQUESTER</th>
                        <th>NFT URI</th>
                        <th>STATUS</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {records.map((record, index) => (
                        console.log("record", record),
                        <tr key={index}>
                            <td>{record.id}</td>
                            <td>{record.nft.name}</td>
                            <td>{record.nft.user.keypair.public_key}</td>
                            <td>{record.requester_pkx25519}</td>
                            <td><a href={record.nft.uri} target="_blank" rel="noopener noreferrer">{record.nft.uri}</a></td>
                            <td>{record.status}</td>
                            <td>
                                <button onClick={() => handleAccept(record.id, record.requester_pkx25519, record.nft.uri, token)}>Accept</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default GetMyReceivedRequests;
