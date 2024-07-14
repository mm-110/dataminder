from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session, joinedload
from typing import List
from datetime import datetime

from utils import generate_random_string

import models
from database import SessionLocal, get_db  # Importa SessionLocal da main

# class NFTData(BaseModel):
#     public_key: str
#     nft_url: str

class UserData(BaseModel):
    username: str
    password: str

class UserKeyPair(BaseModel):
    public_key: str
    private_key: str
    public_key_x25519: str
    private_key_x25519: str

class NFTRecord(BaseModel):  # Modello Pydantic per i record
    name: str
    mint_address: str
    uri: str

class Request(BaseModel):
    requester_id: int
    nft_id: int
    status: str
    password_ciphertext: str
    password_nonce: str
    password_ephemeral_pk: str

class EncryptedPassword(BaseModel):
    ciphertext: str
    ephemeralPublicKey: str
    nonce: str

class PaymentStatus(BaseModel):
    status: str

router = APIRouter()

@router.post("/addRequest/{token:str}/{nft_id:int}")
def add_request(token: str, nft_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.token == token).first()
    if user is None:
        raise HTTPException(status_code=404, detail="Utente non trovato")
    nft_record = db.query(models.NFTRecord).filter(models.NFTRecord.id == nft_id).first()
    if nft_record is None:
        raise HTTPException(status_code=404, detail="NFT non trovato")
    request = models.Request(requester_id=user.id, requester_pkx25519=user.keypair.public_key_x25519, nft_id=nft_record.id)
    db.add(request)
    db.commit()

    # Ottieni tutti i record dal database
    all_records = db.query(models.Request).all()

    # Stampa tutti i record
    for i, record in enumerate(all_records):
        print(f'Index: {i}')
        print(f"Request ID: {record.id}")
        print(f"Requester ID: {record.requester_id}")
        print(f"Requester Public Key X25519: {record.requester_pkx25519}")
        print(f"NFT ID: {record.nft_id}")
        print(f"Created Time: {record.created_time}")
        print(f"Status: {record.status}")
        print(f"Password Ciphertext: {record.password_ciphertext}")
        print(f"Password Nonce: {record.password_nonce}")
        print(f"Password Ephemeral Public Key: {record.password_ephemeral_pk}")
        print("\n")

    return {"message": "Richiesta inserita con successo!"}

@router.get("/getForwardedRequests/{token:str}")
def get_forwarded_requests(token: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.token == token).first()
    if user is None:
        raise HTTPException(status_code=404, detail="Utente non trovato")
    requests = db.query(models.Request)\
        .options(joinedload(models.Request.nft).joinedload(models.NFTRecord.user).joinedload(models.User.keypair))\
        .filter(models.Request.requester_id == user.id).all()
    return requests

@router.get("/getReceivedRequests/{token:str}")
def get_received_requests(token: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.token == token).first()
    if user is None:
        raise HTTPException(status_code=404, detail="Utente non trovato")
    requests = db.query(models.Request)\
        .options(joinedload(models.Request.nft).joinedload(models.NFTRecord.user).joinedload(models.User.keypair))\
        .filter(models.NFTRecord.user_id == user.id).all()
    
    print("Received Requests from: ", requests[0].requester_pkx25519)

    return requests

@router.post("/sendEncryptedPassword/{token:str}/{request_id:int}")
def send_encrypted_password(token: str, request_id: int, encrypted_password: EncryptedPassword, db: Session = Depends(get_db)):

    user = db.query(models.User).filter(models.User.token == token).first()
    if user is None:
        raise HTTPException(status_code=404, detail="Utente non trovato")
    request = db.query(models.Request).filter(models.Request.id == request_id).first()
    if request is None:
        raise HTTPException(status_code=404, detail="Richiesta non trovata")
    request.status = "Accepted"
    request.password_ciphertext = encrypted_password.ciphertext
    request.password_nonce = encrypted_password.nonce
    request.password_ephemeral_pk = encrypted_password.ephemeralPublicKey
    db.add(request)
    db.commit()

    # Ottieni tutti i record dal database
    all_records = db.query(models.Request).all()

    # Stampa tutti i record
    for i, record in enumerate(all_records):
        print(f'Index: {i}')
        print(f"Request ID: {record.id}")
        print(f"Requester ID: {record.requester_id}")
        print(f"Requester Public Key X25519: {record.requester_pkx25519}")
        print(f"NFT ID: {record.nft_id}")
        print(f"Created Time: {record.created_time}")
        print(f"Status: {record.status}")
        print(f"Password Ciphertext: {record.password_ciphertext}")
        print(f"Password Nonce: {record.password_nonce}")
        print(f"Password Ephemeral Public Key: {record.password_ephemeral_pk}")
        print("\n")

    return {"message": "Password inviata con successo!"}

@router.post("/setPayed/{token:str}/{request_id:int}")
def set_record_payed(token: str, request_id: int, payment_status: PaymentStatus, db: Session = Depends(get_db)):

    user = db.query(models.User).filter(models.User.token == token).first()
    if user is None:
        raise HTTPException(status_code=404, detail="Utente non trovato")
    request = db.query(models.Request).filter(models.Request.id == request_id).first()
    if request is None:
        raise HTTPException(status_code=404, detail="Richiesta non trovata")
    request.status = payment_status.status
    db.add(request)
    db.commit()

    # Ottieni tutti i record dal database
    all_records = db.query(models.Request).all()

    # Stampa tutti i record
    for i, record in enumerate(all_records):
        print(f'Index: {i}')
        print(f"Request ID: {record.id}")
        print(f"Requester ID: {record.requester_id}")
        print(f"Requester Public Key X25519: {record.requester_pkx25519}")
        print(f"NFT ID: {record.nft_id}")
        print(f"Created Time: {record.created_time}")
        print(f"Status: {record.status}")
        print(f"Password Ciphertext: {record.password_ciphertext}")
        print(f"Password Nonce: {record.password_nonce}")
        print(f"Password Ephemeral Public Key: {record.password_ephemeral_pk}")
        print("\n")

    return {"message": "Stato aggiornato con successo!"} 

@router.get("/getPayedNftDetail/{token:str}/{request_id:int}")
def get_payed_nft_detail(token: str, request_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.token == token).first()
    if user is None:
        raise HTTPException(status_code=404, detail="Utente non trovato")
    
    # Esegui la query sul database per ottenere la richiesta e unirla con le informazioni dell'NFT
    request = db.query(models.Request)\
        .options(joinedload(models.Request.nft))\
        .filter(models.Request.id == request_id).first()
    
    if request is None:
        raise HTTPException(status_code=404, detail="Richiesta non trovata")

    
    print(f"Request ID: {request.id}")
    print(f"Requester ID: {request.requester_id}")
    print(f"Requester Public Key X25519: {request.requester_pkx25519}")
    print(f"NFT ID: {request.nft_id}")
    print(f"Created Time: {request.created_time}")
    print(f"Status: {request.status}")
    print(f"Password Ciphertext: {request.password_ciphertext}")
    print(f"Password Nonce: {request.password_nonce}")
    print(f"Password Ephemeral Public Key: {request.password_ephemeral_pk}")
    print(f"NFT Name: {request.nft.name}")
    print(f"NFT Mint Address: {request.nft.mint_address}")
    print(f"NFT URI: {request.nft.uri}")
    print("\n")
    return request
    

@router.post("/addUser")
def add_user(user_data: UserData, db: Session = Depends(get_db)):
    db_record = models.User(username=user_data.username, password=user_data.password)
    db.add(db_record)
    db.commit()

    # Ottieni tutti i record dal database
    all_records = db.query(models.User).all()

    # Stampa tutti i record
    for i, record in enumerate(all_records):
        print(f'Index: {i}')
        print(f"Username: {record.username}, Password: {record.password}")

    return {"message": "Record inserito con successo!"}

@router.post("/login")
def login(user_data: UserData, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == user_data.username).first()
    if user is None:
        raise HTTPException(status_code=404, detail="Utente non trovato")
    if user.password != user_data.password:
        raise HTTPException(status_code=403, detail="Password errata")
    user.token = generate_random_string()
    db.add(user)
    db.commit()
    return {"token": user.token}

@router.post("/addKeypair/{token:str}")
def add_keypair(token: str, user_keypair: UserKeyPair, db: Session = Depends(get_db)):
    print(user_keypair)
    user = db.query(models.User).filter(models.User.token == token).first()
    if user is None:
        all_records = db.query(models.User).all()
        for i, record in enumerate(all_records):
            print(f'Index: {i}')
            print(f"Username: {record.username}, Password: {record.password}, Token: {record.token} ")
        raise HTTPException(status_code=404, detail="Utente non trovato")
    keypair = models.Keypair(public_key=user_keypair.public_key, private_key=user_keypair.private_key, public_key_x25519=user_keypair.public_key_x25519, private_key_x25519=user_keypair.private_key_x25519, user_id=user.id)
    db.add(keypair)
    db.commit()

    # Ottieni tutti i record dal database
    all_records = db.query(models.Keypair).all()
    for i, record in enumerate(all_records):
        print(f'Index: {i}')
        print(f"Public Key: {record.public_key}, Private Key: {record.private_key}")

    return {"message": "Coppia di chiavi inserita con successo!"}

@router.get("/getKeypair/{token:str}")
def get_keypair(token: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.token == token).first()
    if user is None:
        raise HTTPException(status_code=404, detail="Utente non trovato")
    keypair = db.query(models.Keypair).filter(models.Keypair.user_id == user.id).first()
    if keypair is None:
        raise HTTPException(status_code=404, detail="Coppia di chiavi non trovata")
    return {"public_key": keypair.public_key, "private_key": keypair.private_key, "public_key_x25519": keypair.public_key_x25519, "private_key_x25519": keypair.private_key_x25519}

@router.post("/addNftRecord/{token:str}")
def add_nft_record(token: str, nft_data: NFTRecord, db: Session = Depends(get_db)):
    print("API CALLED")
    user = db.query(models.User).filter(models.User.token == token).first()
    if user is None:
        raise HTTPException(status_code=404, detail="Utente non trovato")
    print(f"User calling api: {user.username}")

    # Verifica se l'indirizzo mint esiste già nel database
    existing_record = db.query(models.NFTRecord).filter(models.NFTRecord.mint_address == nft_data.mint_address).first()
    if existing_record is not None:
        print("Existing Record: ", existing_record.mint_address)
        raise HTTPException(status_code=400, detail="Questo NFT è già stato inserito")

    print("NFT non trovato")
    db_record = models.NFTRecord(name=nft_data.name, mint_address=nft_data.mint_address, uri=nft_data.uri, user_id=user.id)
    db.add(db_record)
    db.commit()
    print("NFT aggiunto")

    # Ottieni tutti i record dal database
    all_records = db.query(models.NFTRecord).all()

    # Stampa tutti i record
    for i, record in enumerate(all_records):
        print(f'Index: {i}')
        print(f"Mint address: {record.mint_address}, NFT Uri: {record.uri}")

    return {"message": "Record inserito con successo!"}

@router.get("/getMyNftRecords/{token:str}")
def get_nfts(token: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.token == token).first()
    if user is None:
        raise HTTPException(status_code=404, detail="Utente non trovato")
    nft_records = db.query(models.NFTRecord).filter(models.NFTRecord.user_id == user.id).all()
    return nft_records

@router.get("/getAllNftRecords/{token:str}")
def get_all_nfts(token: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.token == token).first()
    if user is None:
        raise HTTPException(status_code=404, detail="Utente non trovato")
    nft_records = db.query(models.NFTRecord)\
        .options(joinedload(models.NFTRecord.user).joinedload(models.User.keypair))\
        .filter(models.NFTRecord.user_id != user.id).all()
    return nft_records

@router.get("/displayNftRecord/{token:str}/{id:int}")
def display_nft(token: str, id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.token == token).first()
    if user is None:
        raise HTTPException(status_code=404, detail="Utente non trovato")

    # Recupera l'NFT che appartiene all'utente specificato e ha l'ID specificato
    nft_record = db.query(models.NFTRecord).filter(models.NFTRecord.user_id == user.id, models.NFTRecord.id == id).first()
    if nft_record is None:
        raise HTTPException(status_code=404, detail="Record non trovato")

    return nft_record