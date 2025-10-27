from core.config import settings
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from core.config import settings
from core.security import configure_security
from routers import catalog_service_router
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from core.limiter import limiter 

app = FastAPI(
    title="Catalog service",
    description="Manages catalog for books filtering, metadata, etc",
    version="1.0.0"
)

# Middleware CORS allows request from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.get_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security and limiting, how much request per end point per second
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)
configure_security(app)

# Routers, all routers and empoints that are configured for this Microservice
app.include_router(catalog_service_router.router)

# Endpoints for health check and root, active status of the service
@app.get("/", include_in_schema=False)
@limiter.limit("5/minute")
async def root(request: Request):
    return JSONResponse(
        status_code=200,
        content={
            "message": "Auth Service online.",
            "status": "ok",
            "version": "1.0.0",
            "client_ip": request.client.host
        }
    )

@app.get("/health", include_in_schema=False)
@limiter.limit("5/minute")
async def health_check(request: Request):
    return JSONResponse(
        status_code=200,
        content={
            "status": "ok",
            "version": "1.0.0",
            "client_ip": request.client.host
        }
    )
