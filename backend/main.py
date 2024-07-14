
from fastapi import FastAPI
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from routes import router  # Assicurati che il percorso sia corretto
from database import get_db
from fastapi.middleware.cors import CORSMiddleware
from models import Base  # Importa Base da models

DATABASE_URL = "sqlite:///./test.db"  # Usa il tuo URL del database

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

app = FastAPI()

# Crea tutte le tabelle
Base.metadata.create_all(bind=engine)

# Abilita CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permette tutte le origini
    allow_credentials=True,
    allow_methods=["*"],  # Permette tutti i metodi
    allow_headers=["*"],  # Permette tutte le intestazioni
)

app.include_router(router)

# @app.get("/")
# def read_root():
#     return {"Hello": "World"}
