from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from contextlib import asynccontextmanager
from core.config import settings

db_url = settings.DATABASE_URL
engine = create_async_engine(db_url, echo = True, pool_size = 10, max_overflow = 20) #deactivate echo in production

async_local_session = async_sessionmaker(bind = engine, expire_on_commit = False)

@asynccontextmanager
async def get_session_context(): # Restrained session context manager 'cause is using a decorator that changes the normal function behavior
    async with async_local_session() as session:
        yield session

async def get_session(): # Plain session
    async with async_local_session() as session:
        yield session