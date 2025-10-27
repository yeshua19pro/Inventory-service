from fastapi import APIRouter, HTTPException, Depends, Request, status # Constructor for router, request for ip directions
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession # Engine for postgress async
from services.inventory_service import retrieve_book_data, create_access_token # Auxiliar functions for routers
from core.security import validate_token, validate_internal_action_token
from models.inventory_service_models import BookStockUpdateModel
from db.session import get_session # Get async session for bd
from db.models.models import Book # Structure of the table
from core.limiter import limiter
from sqlalchemy.future import select # Select for queries
from uuid import UUID , uuid4 # UUID for tables ids
from datetime import datetime, timedelta, timezone # Time management
import random 
from utils.time import utc_now, utc_return_time_cast # Router functions for lesser verbouse text

router = APIRouter(prefix="/inventory", tags=["Inventory"]) # All endpoints will start with /catalog and tagged as Catalogs

@router.get("/check-book/{book_id}", status_code = status.HTTP_200_OK, include_in_schema=True) 
@limiter.limit("100/minute")
async def check_book_status_router (
    book_id: str,
    request: Request,
    token_data: dict = Depends(validate_token),
    db: AsyncSession = Depends(get_session) # Async session for bd
    ):
    """Endpoint to retrieve the whole catalog inventory."""
 
    book = await retrieve_book_data(db, book_id)
    
    token = create_access_token({
        "sub": token_data.get("sub"),
        "name": token_data.get("name"),
        "last_name": token_data.get("last_name", None),
        "role": token_data.get("role"),
        
        
    })
    if not book:
        return JSONResponse(
            status_code = status.HTTP_404_NOT_FOUND,
            content={"detail":"Book not found."}
        )
        
    return JSONResponse(
        status_code = status.HTTP_200_OK,
        content={
            "access_token": token,
            "token_type": "bearer",
            "book": {
            "id": str(book.id),
            "book_name": book.book_name,
            "author": book.author,
            "publication_date": utc_return_time_cast(book.publication_date),
            "book_type": book.book_type,
            "stock": book.stock,
            "metadata": book.book_metadata}}
    )
    
@router.post("/update-book/{book_id}", status_code = status.HTTP_200_OK, include_in_schema=True) 
@limiter.limit("10/minute")
async def restock_book_router (
    stock: BookStockUpdateModel,
    book_id: str,
    request: Request,
    token_data: dict = Depends(validate_token),
    db: AsyncSession = Depends(get_session) # Async session for bd
    ):
    """Endpoint to retrieve the whole catalog inventory."""
    if token_data.get("role") != "admin":
        return JSONResponse(
            status_code = status.HTTP_403_FORBIDDEN,
            content={"detail":"You do not have permission to perform this action."}
        )
        
    book = await retrieve_book_data(db, book_id)
    
    if not book:
        return JSONResponse(
            status_code = status.HTTP_404_NOT_FOUND,
            content={"detail":"Book not found."}
        )
        
    
    token = create_access_token({
        "sub": token_data.get("sub"),
        "name": token_data.get("name"),
        "last_name": token_data.get("last_name", None),
        "role": token_data.get("role"), 
    })
    

    if stock.modify_type == "increment":
        book.stock += stock.stock
        book.book_metadata["stock"] += stock.stock
    elif stock.modify_type == "decrement":
        if book.stock - stock.stock < 0:
            return JSONResponse(
                status_code = status.HTTP_400_BAD_REQUEST,
                content={"detail":"Insufficient stock to decrement."}
            )
        book.stock -= stock.stock
        book.book_metadata["stock"] -= stock.stock

    await db.commit()

    return JSONResponse(
        status_code = status.HTTP_200_OK,
        content={"access_token": token,
                 "token_type": "bearer", "detail":"Book stock updated successfully."}
    )
    
