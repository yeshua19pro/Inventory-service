# All variables and configurations for the Microservice
from pydantic import field_validator
from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings): # this goes in the .env
    JWT_SECRET_KEY: str # For encription and user autentication
    JWT_ALGORITHM: str = "HS256" # Algorithm used for JWT encoding/decoding
    DATABASE_URL: str # Database connection URL
    CORS_ORIGINS: str = '' # Comma-separated list of allowed CORS origins / www my app com, allowed hosts
    INTERNAL_ACTION_TOKEN: str # Token for internal service communication
    ENVIRONMENT: str = "development" # Environment type: development, QA, production
    LIMITER_RATE: str = "1000/minute" # Rate limit for requests
    LIMITER_RETRY_AFTER: int = 10 # Retry after seconds when rate limit is exceeded
    
    @field_validator("CORS_ORIGINS", mode="plain")
    @classmethod
    def split_origins(cls, v: str): # Split comma-separated origins into a list
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",")] #Create variable 'origin'
        return v

    def get_cors_origins(self) -> list[str]: # Valid CORS origins list
        return self.CORS_ORIGINS if isinstance(self.CORS_ORIGINS, list) else []
    
    model_config = {
        "env_file": ".env"} # The .env file is in the same root directory
    
settings = Settings()