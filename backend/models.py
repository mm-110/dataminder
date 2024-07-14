from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String)
    password = Column(String)
    created_time = Column(DateTime(timezone=True), server_default=func.now())
    token = Column(String)

    keypair = relationship("Keypair", uselist=False, back_populates="user")
    nft_records = relationship("NFTRecord", back_populates="user")
    requests = relationship("Request", back_populates="requester")

class Keypair(Base):
    __tablename__ = "keypairs"

    id = Column(Integer, primary_key=True, index=True)
    public_key = Column(String)
    private_key = Column(String)
    public_key_x25519 = Column(String)
    private_key_x25519 = Column(String)
    user_id = Column(Integer, ForeignKey('users.id'))
    created_time = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="keypair")

class NFTRecord(Base):
    __tablename__ = "nft_records"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    mint_address = Column(String)
    uri = Column(String)
    user_id = Column(Integer, ForeignKey('users.id'))
    created_time = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="nft_records")
    requests = relationship("Request", back_populates="nft")

class Request(Base):
    __tablename__ = "requests"

    id = Column(Integer, primary_key=True, index=True)
    requester_id = Column(Integer, ForeignKey('users.id'))
    requester_pkx25519 = Column(String, ForeignKey('keypairs.public_key_x25519'))
    nft_id = Column(Integer, ForeignKey('nft_records.id'))
    created_time = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String, default='Forwarded')  # Aggiungi questo campo
    password_ciphertext = Column(String)  # Aggiungi questo campo
    password_nonce = Column(String)  # Aggiungi questo campo
    password_ephemeral_pk = Column(String)  # Aggiungi questo campo

    requester = relationship("User", back_populates="requests")
    nft = relationship("NFTRecord", back_populates="requests")


    