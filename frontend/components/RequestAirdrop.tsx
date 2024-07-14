import React, { useState, useEffect } from 'react';
import { Connection, clusterApiUrl, Keypair } from "@solana/web3.js";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { KeyPair } from "./CreateOrShowKeypair";

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

const RequestAirdrop: React.FC = () => {
    const [balance, setBalance] = useState<number | null>(null);
    const [keypair, setKeypair] = useState<Keypair | null>(null); // Aggiungi questa riga
    const connection = new Connection(clusterApiUrl("devnet"));

    useEffect(() => {
        const fetchBalance = async () => {
            const privateKey = localStorage.getItem('private_key');
            
            if (privateKey) {
                // La keypair esiste nel localStorage
                // Fai il parse della keypair
                
                const privateKeyBytes = hexStringToByte(privateKey);
                const keypair = Keypair.fromSecretKey(privateKeyBytes);
                setKeypair(keypair); // Aggiungi questa riga
                const balance = await connection.getBalance(keypair.publicKey);
                setBalance(balance / LAMPORTS_PER_SOL);
            } else {
                // La keypair non esiste nel localStorage
                // Crea o recupera la keypair qui
            }
        };
        fetchBalance();
    }, []);

    const requestAirdrop = async () => {
        if (keypair) {
            const airdropSignature = await connection.requestAirdrop(
                keypair.publicKey,
                1 * LAMPORTS_PER_SOL
            );
            const newBalance = await connection.getBalance(keypair.publicKey);
            setBalance(newBalance / LAMPORTS_PER_SOL);
            window.location.reload();
        }
    };

    return (
        <div>
            <p>Balance: {balance ? balance : 'No Balance Available...'}</p>
            <button onClick={requestAirdrop}>Request Airdrop</button>
        </div>
    );
}

export default RequestAirdrop;
export { hexStringToByte };