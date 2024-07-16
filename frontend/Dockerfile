# Usa un'immagine Node.js ufficiale come immagine base
FROM node:10.8.1

# Imposta la directory di lavoro nel container
WORKDIR /app

# Copia il file package.json nella directory di lavoro corrente
COPY package*.json ./

# Installa qualsiasi pacchetto necessario specificato in package.json
RUN npm install

# Copia il resto del codice sorgente del tuo progetto nella directory di lavoro
COPY . .

# Espone la porta 3000 del container
EXPOSE 3000

# Esegue il comando per avviare l'applicazione React
CMD ["npm", "run", "dev"]
