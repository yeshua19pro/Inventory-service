"""
Models for catalog service operations such as registration and book retrieval.
Is the way the data comes in and out of the service.
"""
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class RegisterBook(BaseModel):
    book_name: str
    author: str
    book_type: str
    price: float
    publication_date: datetime
    description: Optional[str] = None
    stock: int
    image: str
    
class FilterBooks(BaseModel):
    book_name: Optional[str] = None
    author: Optional[str] = None
    book_type: Optional[str] = None
    price: Optional[float] = None
    publication_date_start_date: Optional[str] = None
    publication_date_end_date: Optional[str] = None
    page: int = 1
    limit: int = 10
    group_by: Optional[str] = None
    asc_or_desc: Optional[str] = "asc"
    
class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    
class BookInfo(TokenResponse):
    book_info: dict