"""
Catalog Service for handling Books-related operations such as Filtering and displaying.
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
from models.catalog_service_models import FilterBooks, RegisterBook, TokenResponse # own fields for authenticated user
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

async def register_book(db: AsyncSession, registry_data: RegisterBook):
    """Register a new user in the database."""
    duplicate_check = await db.execute(select(Book).where(Book.book_name == registry_data.book_name.strip().lower())) # SELECT book_name FROM Book WHERE book_name =: book_name
    duplicate_check_result = duplicate_check.scalar_one_or_none() # Check if a Book with this name already exists and return None
    
    if duplicate_check_result:
        return None # Book with this name already exists
    
    publication_date = registry_data.publication_date
    if publication_date.tzinfo is not None:
        publication_date = publication_date.replace(tzinfo=None)
    
    new_book = Book(
        book_name = registry_data.book_name.strip().lower(),
        author = registry_data.author.strip(),
        book_type = registry_data.book_type.strip(),
        price = registry_data.price,
        publication_date = publication_date,
        description = registry_data.description.strip() if registry_data.description else None,
        stock = registry_data.stock,
        image = registry_data.image.strip(),
        book_metadata = { "book_name" : registry_data.book_name.strip().lower(),
        "author" : registry_data.author.strip(),
        "book_type" :registry_data.book_type.strip(),
        "price" : registry_data.price,
        "publication_date" : utc_return_time_cast(publication_date),
        "description" : registry_data.description.strip() if registry_data.description else None,
        "stock" : registry_data.stock,
        "image" : registry_data.image.strip(), 
        "rating": 0,
        "total_reviews": 0}
    )
    db.add(new_book)
    await db.commit()
    await db.refresh(new_book)
    return new_book

async def filter_book(db: AsyncSession, filter_data: FilterBooks):
    """Filter books based on provided criteria."""
    book_name = filter_data.book_name
    author = filter_data.author
    book_type = filter_data.book_type
    price = filter_data.price
    publication_date_start_date = None
    publication_date_end_date = None
    condicionals = []
    
    if filter_data.publication_date_start_date != "":
        publication_date_start_date = parser.parse(filter_data.publication_date_start_date) 
    
    if filter_data.publication_date_end_date != "":
        publication_date_end_date = parser.parse(filter_data.publication_date_end_date)
        
    if publication_date_start_date is not None:
        if publication_date_start_date.tzinfo is not None:
            publication_date_start_date = publication_date_start_date.replace(tzinfo=None)
    
    if publication_date_end_date is not None:    
        if publication_date_end_date.tzinfo is not None:
            publication_date_end_date = publication_date_end_date.replace(tzinfo=None)
    
    query = select(Book)
    if book_name:
        condicionals.append(Book.book_name == book_name.strip().lower())
    if author:
        condicionals.append(Book.author == author.strip().lower())
    if book_type:
        condicionals.append(Book.book_type == book_type.strip().lower())
    if price:
        condicionals.append(Book.price == price)
    if publication_date_start_date:
        try:
            condicionals.append(Book.publication_date >= publication_date_start_date)
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail = "Bad date format for publication_date_start_date. Use YYYY-MM-DD.")
    if publication_date_end_date:
        try:
            condicionals.append(Book.publication_date <= publication_date_end_date)
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail = "Bad date format for publication_date_start_date. Use YYYY-MM-DD.")
    if condicionals:
        query = query.where(and_(*condicionals)) # Apply all conditions using AND
    
    # query = query.where(Book.book_name == book_name.strip().lower() or Book.author == author.strip().lower()
    #                   or Book.book_type == book_type.strip().lower or (Book.publication_date > publication_date_start_date or publication_date_end_date )
    #                    or Book.price == price) 
    
    sort_map = { # mapping for sorting, points to column objects, so it can traduce it from type str to column object
        "book_name": Book.book_name, # book_name is being mapped to Book.book_name column
        "author": Book.author,
        "book_type": Book.book_type,
        "price": Book.price,
        "publication_date": Book.publication_date}
                                                      #default column to sort by
    order_column = sort_map.get(filter_data.group_by, Book.book_name) # Default to book_name if not specified, create a map to see what column the user wants to sort by
    
    if filter_data.asc_or_desc == "desc": #this is sent by the front-end, this is changing the word sent by the client, then we mapped to the appropiat sorting method
        query = query.order_by(order_column.desc())
    else:
        query = query.order_by(order_column.asc())
        
    offset = (filter_data.page - 1) * filter_data.limit # Pagination calculation, to know how much books to show per page
    query = query.offset(offset).limit(filter_data.limit) # limit again to pagination, limit of books per page offset = how many books to skip based on the page number
    
    result = await db.execute(query) 
    books = result.scalars().all() # Get all matching books in a list
    
    final_query  = select(func.count()).select_from(Book) # Count of the total queries for the front, so it can know how many pages to show
    if condicionals:
        final_query = final_query.where(and_(*condicionals)) # Apply all conditions using AND, count personalized for the filters for pagination in the front end
        
    total_result = await db.execute(final_query) 
    total_books = total_result.scalar() or 0 # Total number of books matching the criteria or 0 if none
    
    book_list = []
    for book in books: # extract book data to bytes, this is similar toString but for JsonResponse
        book_list.append({
            "book_name": book.book_name,
            "author": book.author,
            "book_type": book.book_type,
            "price": book.price,
            "publication_date": utc_return_time_cast(book.publication_date),
            "description": book.description,
            "stock": book.stock,
            "image": book.image
        })
    
    
    return {
            "total_books": total_books,
            "page": filter_data.page,
            "limit": filter_data.limit,
            "books": book_list
        }