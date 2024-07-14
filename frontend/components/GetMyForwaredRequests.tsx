import { Connection, clusterApiUrl, Keypair, Transaction, SystemProgram, LAMPORTS_PER_SOL, sendAndConfirmTransaction } from "@solana/web3.js";
import { Metaplex, keypairIdentity, irysStorage, PublicKey } from "@metaplex-foundation/js";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link'

function hexStringToByte(str: string): Uint8Array {
    if (!str) {
        return new Uint8Array();
    }

    let a = [];
    for (let i = 0, len = str.length; i < len; i += 2) {
        a.push(parseInt(str.substr(i, 2), 16));
    }

    return new Uint8Array(a);
}

function GetMyForwardedRequests() {
    const [records, setRecords] = useState([]);

    const token = localStorage.getItem('authToken');

    useEffect(() => {
        // Sostituisci con l'URL del tuo server e l'endpoint appropriato
        axios.get(`http://localhost:8000/getForwardedRequests/${token}`)
            .then(response => {
                setRecords(response.data);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }, []);

    const handlePay = async (owner_public_key, recordId) => {

        const privateKey = localStorage.getItem('private_key');
        const privateKeyBytes = hexStringToByte(privateKey);
        const keypair = Keypair.fromSecretKey(privateKeyBytes);
        
        const connection = new Connection("https://api.devnet.solana.com", "confirmed");
        const transaction = new Transaction();
        const LAMPORTS_TO_SEND = 0.5 * LAMPORTS_PER_SOL;
        console.log("LAMPORTS_TO_SEND", LAMPORTS_TO_SEND);

        const sendSolInstruction = SystemProgram.transfer({
            fromPubkey: keypair.publicKey,
            toPubkey: owner_public_key,
            lamports: LAMPORTS_TO_SEND,
        });

        transaction.add(sendSolInstruction);

        const signature = await sendAndConfirmTransaction(connection, transaction, [
            keypair,
        ]);

        console.log('Transaction confirmed:', signature);

        const status = 'Payed';

        axios.post(`http://localhost:8000/setPayed/${token}/${recordId}`, {
            status: 'Payed'
        })
            .then(response => {
                console.log(response.data);
                window.location.reload();
            })
            .catch(error => {
                console.error('There was an error!', error);
        })
    }

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>NFT NAME</th>
                        <th>NFT PUBLIC KEY OWNER</th>
                        <th>NFT URI</th>
                        <th>STATUS</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {records.map((record, index) => (
                        <tr key={index}>
                            <td>{record.id}</td>
                            <td>{record.nft.name}</td>
                            <td>{record.nft.user.keypair.public_key}</td>
                            <td><a href={record.nft.uri} target="_blank" rel="noopener noreferrer">{record.nft.uri}</a></td>
                            <td>{record.status}</td>
                            <td>
                                {record.status === 'Accepted' ? 
                                    <button onClick={() => handlePay(record.nft.user.keypair.public_key, record.id)}>Pay</button> :
                                    (record.status === 'Payed' ? 
                                        <Link href={`/detail/${record.id}`}>Visualizza Dettagli</Link> : 
                                        <p>Il pagamento non è abilitato</p>
                                    )
                                }
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default GetMyForwardedRequests;
