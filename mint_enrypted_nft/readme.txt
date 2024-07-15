Passo 1 ) clonare la repo

Passo 2 ) npm install

passo 3 ) npx esrun generate_keypair.ts

Copia la sk ottenuta su terminale in un file .env creato e ponilo uguale a "SECRET_KEY"

SECRET_KEY='[
  160, 137, 155, 160, 249, 250,  97,   9, 108,  93, 232,
  207, 162, 190, 227,  43,  46, 156,  93,  54, 105, 113,
   34, 147, 228, 223, 226, 249, 120,  90, 188, 228,  25,
  147,  18, 224, 222, 145, 169, 242, 136,  27, 108, 180,
    0,  39, 229, 217, 113, 193, 168, 104,  96, 139,  15,
   98,  63,  99, 188,  13,  21,  61,  62, 149]'

passo 4 ) npx esrun airdrop.ts

passo 5 ) npx esrun get_public_key.ts

passo 6 ) npx esrun create_nft.ts

https://arweave.net/odm26jAHNI5b61QbKhkhByg4pToVRhqz9FR0lS5jBj0
PublicKey [PublicKey(Gyx4Eqgd9NHsXwa2rahdef1GWotimnawMgExFfXqT7Y7)] {
  _bn: <BN: ed7614bee983ca035ce78e9d21e5555f0a6ac5b866da0ee77ae7382aab1a9f34>
}

passo 7 ) npx esrun get_nft.ts

Prima di runnare serva mettere la PubKey dell' NFT nel programma

Gyx4Eqgd9NHsXwa2rahdef1GWotimnawMgExFfXqT7Y7

passo 8 ) npx esrun decrypt_nft.ts

Prima di runnare serva mettere la PubKey dell' NFT nel programma

Gyx4Eqgd9NHsXwa2rahdef1GWotimnawMgExFfXqT7Y7

A questo punto hai ottenuto quel che vi è in items.json utilizzando l'address dell' NFT e prendendo i metadati dal link arweve