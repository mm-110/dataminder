import { Connection, clusterApiUrl, Keypair } from "@solana/web3.js";
import { Metaplex, keypairIdentity, irysStorage, PublicKey } from "@metaplex-foundation/js";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link'

function GetMyNFTs() {
    const [records, setRecords] = useState([]);

    const token = localStorage.getItem('authToken');

    useEffect(() => {
        // Sostituisci con l'URL del tuo server e l'endpoint appropriato
        axios.get(`http://localhost:8000/getMyNftRecords/${token}`)
            .then(response => {
                setRecords(response.data);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }, []);

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Mint Address</th>
                        <th>URI</th>
                        <th>Created Time</th>
                        <th>Detail</th>
                    </tr>
                </thead>
                <tbody>
                    {records.map((record, index) => (
                        <tr key={index}>
                            <td>{record.id}</td>
                            <td>{record.name}</td>
                            <td>{record.mint_address}</td>
                            <td><a href={record.uri} target="_blank" rel="noopener noreferrer">{record.uri}</a></td>
                            <td>{record.created_time}</td>
                            <td>
                                <Link href={`/record/${record.id}`}>
                                    <a>Visualizza dettagli</a>
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default GetMyNFTs;
