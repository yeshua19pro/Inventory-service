"""
Models for inventory service operations such as retrieve and stock.
Is the way to update the catalog and restock inventory
"""
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class BookStockUpdateModel(BaseModel):
    """Model for updating book stock."""
    stock: int
    modify_type: str  # 'increment' or 'decrement'