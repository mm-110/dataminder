import { Connection, clusterApiUrl, Keypair } from "@solana/web3.js";
import { Metaplex, keypairIdentity, irysStorage, PublicKey } from "@metaplex-foundation/js";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link'

function GetAllNFTs() {
    const [records, setRecords] = useState([]);

    const token = localStorage.getItem('authToken');

    useEffect(() => {
        // Sostituisci con l'URL del tuo server e l'endpoint appropriato
        axios.get(`http://localhost:8000/getAllNftRecords/${token}`)
            .then(response => {
                setRecords(response.data);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }, []);

    const ForwardRequest = (id) => {
        axios.post(`http://localhost:8000/addRequest/${token}/${id}`)
            .then(response => {
                console.log(response.data.message);
             })
             .catch(error => {
                console.error('There was an error!', error);
             })
    };

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Owner</th>
                        <th>Name</th>
                        <th>Mint Address</th>
                        <th>URI</th>
                        <th>Action</th> {/* Aggiungi questa colonna */}
                    </tr>
                </thead>
                <tbody>
                    {records.map((record, index) => (
                        <tr key={index}>
                            <td>{record.id}</td>
                            <td>{record.user.keypair.public_key}</td>
                            <td>{record.name}</td>
                            <td>{record.mint_address}</td>
                            <td><a href={record.uri} target="_blank" rel="noopener noreferrer">{record.uri}</a></td>
                            <td>
                                <button onClick={() => ForwardRequest(record.id)}>Forward Request</button>
                            </td> {/* Aggiungi questo pulsante */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default GetAllNFTs;
