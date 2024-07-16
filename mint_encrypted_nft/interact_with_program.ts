import fs from 'fs';

// Interazione con il contratto intelligente in JavaScript
const anchor = require('@project-serum/anchor');
const provider = anchor.Provider.local();

async function main() {
  // Leggi il programma di idl
  const idl = JSON.parse(fs.readFileSync('./target/idl/hello_world.json', 'utf8'));

  // Indirizzo del programma di deploy
  const programId = new anchor.web3.PublicKey('Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS');

  // Creare un client del programma
  const program = new anchor.Program(idl, programId, provider);

  // Generare l'account del messaggio
  let message = anchor.web3.Keypair.generate();

  // Creare una transazione
  const tx = await program.rpc.sayHello({
    accounts: {
      message: message.publicKey,
      user: provider.wallet.publicKey,
      owner: provider.wallet.publicKey,
    },
    signers: [message],
  });

  // Ottenere l'account del messaggio
  message = await program.account.message.fetch(message.publicKey);
  console.log('Message count:', message.count.toString());
}

main().then(console.log).catch(console.error);

/* if we dont have 

const fetch = require('node-fetch');

async function main() {
  // Carica l'IDL da un URL
  const idlUrl = 'https://example.com/path/to/hello_world.json';
  const response = await fetch(idlUrl);
  const idl = await response.json();

  // Il resto del codice rimane lo stesso...
}