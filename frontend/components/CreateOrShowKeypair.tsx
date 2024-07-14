import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Keypair } from "@solana/web3.js";
import { extractED25519Seed, ed25519ToX25519, generateX25519PublicKey, convertPublicKeyToBase64 } from '../functions/prepare_keys';

type KeyPair = {
    public_key_x25519: string;
    private_key_x25519: string;
    public_key: string;
    private_key: string;
} | null;

const CreateOrShowKeypair: React.FC = () => {
    const [keyPair, setKeyPair] = useState<KeyPair>(null);
    const [showPrivateKey, setShowPrivateKey] = useState(false);
    const [showPrivateKeyX25519, setShowPrivateKeyX25519] = useState(false); // Aggiunto

    const token = localStorage.getItem('authToken');

    useEffect(() => {
        axios.get(`http://localhost:8000/getKeypair/${token}`)
            .then(response => {
                if (response.data) {
                    setKeyPair({
                        public_key_x25519: response.data.public_key_x25519,
                        private_key_x25519: response.data.private_key_x25519,
                        public_key: response.data.public_key,
                        private_key: response.data.private_key,
                    });
                    localStorage.setItem('private_key', response.data.private_key);
                    localStorage.setItem('private_key_x25519', response.data.private_key_x25519);
                } else {
                    console.log('L\'utente non ha ancora una coppia di chiavi.');
                }
            })
            .catch(error => {
                console.error('Si è verificato un errore durante il recupero della coppia di chiavi:', error);
            });
    }, []);

    const generateKeyPair = () => {
        const keys = Keypair.generate();

        const ed25519Seed = extractED25519Seed(keys);
        const x25519privateKey = ed25519ToX25519(ed25519Seed);

        const x25519PublicKey = convertPublicKeyToBase64(generateX25519PublicKey(x25519privateKey));
        // const x25519PublicKey = generateX25519PublicKey(x25519privateKey);

        const newKeyPair = {
            public_key_x25519: x25519PublicKey,
            private_key_x25519: Array.from(x25519privateKey).map((b: number) => b.toString(16).padStart(2, '0')).join(''),
            public_key: keys.publicKey.toString(),
            private_key: Array.from(keys.secretKey).map((b: number) => b.toString(16).padStart(2, '0')).join(''),
        };

        setKeyPair(newKeyPair);
        localStorage.setItem('private_key', newKeyPair.private_key);
        localStorage.setItem('private_key_x25519', newKeyPair.public_key_x25519);

        axios.post(`http://localhost:8000/addKeypair/${token}`, newKeyPair)
            .then(response => {
                console.log(response.data.message);
            })
            .catch(error => {
                console.error('Si è verificato un errore durante l\'invio della coppia di chiavi:', error);
            });
    };

    return (
        <div>
            {keyPair ? (
                <div>
                    <p>Public Key: {keyPair.public_key}</p>
                    <p onMouseOver={() => setShowPrivateKey(true)} 
                       onMouseOut={() => setShowPrivateKey(false)}>
                        Private Key: {showPrivateKey ? keyPair.private_key : '**********'}
                    </p>
                    <p>Public Key (X25519): {keyPair.public_key_x25519}</p>
                    <p onMouseOver={() => setShowPrivateKeyX25519(true)} 
                       onMouseOut={() => setShowPrivateKeyX25519(false)}>
                        Private Key (X25519): {showPrivateKeyX25519 ? keyPair.private_key_x25519 : '**********'}
                    </p>
                </div>
            ) : (
                <button onClick={generateKeyPair}>Generate Key Pair</button>
            )}
        </div>
    );
}

export default CreateOrShowKeypair;
export type { KeyPair };
