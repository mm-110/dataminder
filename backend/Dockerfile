# Usa un'immagine Python ufficiale come immagine base
FROM python:3.8

# Imposta la directory di lavoro nel container
WORKDIR /app

# Copia i file requirements.txt nella directory di lavoro corrente
COPY requirements.txt ./

# Installa qualsiasi pacchetto necessario specificato in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copia il resto del codice sorgente del tuo progetto nella directory di lavoro
COPY . .

# Espone la porta 8000 del container
EXPOSE 8000

# Esegue il comando per avviare il server FastAPI
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
