"""
Inventory Service for handling Stock operations such as restock and out of stock.
"""
from fastapi import HTTPException, status
from fastapi.responses import JSONResponse
from passlib.context import CryptContext # Library for hashing passwords
from jose import jwt # jose. (web tokens)
from datetime import datetime, timezone, timedelta, date # Time management
from sqlalchemy import update, and_ , func # For update queries
from sqlalchemy.ext.asyncio import AsyncSession # Async session for postgress
from sqlalchemy.future import select # Select for queries
from typing import Optional # Similar to 'Option T' in rust
from core.config import settings
from db.models.models import Book # User table structure
from uuid import UUID, uuid4 # UUID for tables ids
from utils.time import utc_now, utc_return_time_cast
from dateutil import parser
import random

# Context for hashing passwords
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto") # bycrypt algorithm based in SHA 256

def create_access_token(data: dict, expires_minutes: int = 60) -> str: # JWT creation, dictionaries, hashmaps
    """Create a JWT access token for a user."""
    to_encode = data.copy() # deep copy of data to encode
    now = utc_now()
    expires = now + timedelta(minutes=expires_minutes)
    to_encode.update({"exp": expires, "iat": now}) # expiration and issued at
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM) # token creation
    return encoded_jwt # token return

async def retrieve_book_data(db: AsyncSession, book_id: str):
    """Register a new user in the database."""
    existence_check = await db.execute(select(Book).where(Book.id == UUID(book_id))) # SELECT * FROM Book WHERE id =: book_id
    book = existence_check.scalar_one_or_none() # Check if a Book with this id exists and return None
    
    if not book:
        return None # Book with this name already exists
    
    return book
