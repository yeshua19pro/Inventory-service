# Export all classes and function to validate tokens and JWT
from fastapi import HTTPException, FastAPI, Depends, status, Header #Deploys for microservices, responses, intances of the main class, and middleware for endpoints, variable header
from fastapi.middleware.cors import CORSMiddleware
from jose import JWTError, jwt, ExpiredSignatureError #Json web token library management
from core.config import settings
import hmac, hashlib, base64 # Cryptographic libraries for validation
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials # subclass for Bearer, HTTPAuthorizationCredentials contains the token for Microservices

security = HTTPBearer() # Security scheme for Bearer token authentication
def validate_token (credentials: HTTPAuthorizationCredentials = Depends(security)) -> str: # Header in the message to grab its token
    token = credentials.credentials # Extract the token from the credentials
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM]) # Decode the JWT token using the secret key
        return payload # Return the decoded payload if successful
    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
        )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token or altered token",
        )
    
# internal token is used for internal service communication
async def validate_internal_action_token(x_internal_action_token: str = Header(...)): # Petition that's in a header
    expected_token = settings.INTERNAL_ACTION_TOKEN # Expected token from settings
    if x_internal_action_token != expected_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid internal action token",
        )

def configure_security(app: FastAPI):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=[""],
        allow_headers=[""],
    )