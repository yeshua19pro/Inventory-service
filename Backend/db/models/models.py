from sqlalchemy.orm import Mapped, mapped_column, relationship # object relational mapping, relationships between tables, tracking, consistency
from sqlalchemy import String, Integer, Float,  TIMESTAMP, func, ForeignKey,Index, CheckConstraint, Enum, Boolean  
from sqlalchemy.dialects.postgresql import UUID # specialized types for postgresql
import uuid 
from .base import Base # to know that all models inherit from base
from datetime import datetime 
from typing import Optional # Option 'T' in rust
from sqlalchemy.dialects.postgresql import JSONB # special type for amongodb like json
import enum
from typing import Dict, Any # dictionaries and any data type
from sqlalchemy.ext.mutable import MutableDict # to track changes in jsonb columns
from datetime import datetime, timedelta 

class Book(Base):
    __tablename__ = "books" # Table name in the database
    
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4) # Primary key with UUID
    image: Mapped[str] = mapped_column(String, nullable=False) # URL of the book image
    description: Mapped[str] = mapped_column(String, nullable=False) # Description of the book
    book_name: Mapped[str] = mapped_column(String, nullable=False) # Name of the book
    price: Mapped[float] = mapped_column(Float, nullable=False) # Price of the book
    author: Mapped[str] = mapped_column(String, nullable=False) # Author of the book
    stock: Mapped[int] = mapped_column(Integer, nullable=False) # Stock available
    publication_date: Mapped[Optional[datetime]] = mapped_column(TIMESTAMP, nullable=False) # Publication date
    book_type: Mapped[Optional[str]] = mapped_column(String, nullable=False) # Type or genre of the book
    book_metadata: Mapped[Dict[str, Any]] = mapped_column(MutableDict.as_mutable(JSONB), nullable=False) # Additional metadata in JSONB format