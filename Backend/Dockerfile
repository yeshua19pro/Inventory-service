# Dockerfile (FastAPI - copy to each Python microservice)
FROM python:3.11-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV POETRY_VIRTUALENVS_CREATE=false

WORKDIR /app

# --- dependencias del sistema (necesarias para asyncpg/psycopg2 u otras) ---
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements y instalar (más rápido para caching)
COPY requirements.txt /app/requirements.txt
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r /app/requirements.txt

# Copiar código
COPY . /app

# crear usuario no-root (opcional, buena práctica)
RUN useradd --create-home appuser && chown -R appuser:appuser /app
USER appuser

# Puerto por defecto del servicio (ajusta si usas otro)
ARG PORT=8020
EXPOSE ${PORT}

# Comando por defecto para producción (ajusta el module:app)
# - Usa proxy-headers si te pone un nginx/ingress delante
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8020", "--proxy-headers", "--workers", "1"]
