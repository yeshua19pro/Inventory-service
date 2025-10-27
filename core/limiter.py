from slowapi import Limiter
from slowapi.util import get_remote_address
from core.config import settings

limiter = Limiter(
    key_func = get_remote_address, # ip from the request host 'Client host'
    default_limits = [settings.LIMITER_RATE], # Default rate limit: 1000 requests per minute
    headers_enabled = True, # Enable rate limit headers in responses
    retry_after = settings.LIMITER_RETRY_AFTER # Retry after 10 seconds if limit is exceeded
)