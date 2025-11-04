from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context
import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# ─────────────────────────────────────────────
# 1. Load .env from the services that I want to use (e.g: user_service)
# ─────────────────────────────────────────────

dotenv_path = Path(__file__).resolve().parents[2] / "BookStoreDSP2" / ".env"
load_dotenv(dotenv_path)
print(f" .env load from: {dotenv_path}")

# ─────────────────────────────────────────────
# 2. Get settings configuration
# ─────────────────────────────────────────────

from core.config import Settings
settings = Settings()

config = context.config
config.set_main_option("sqlalchemy.url", settings.DATABASE_URL.replace("+asyncpg", "")) # Alembic is sync only

# ─────────────────────────────────────────────
# 3. Logging
# ─────────────────────────────────────────────

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# ─────────────────────────────────────────────
# 4. Import models for metadata
# ─────────────────────────────────────────────

# Root to systems path
sys.path.append(str(Path(__file__).resolve().parents[2]))

from db.models import Base
target_metadata = Base.metadata

# ─────────────────────────────────────────────
# 5. offline mode
# ─────────────────────────────────────────────

def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()

# ─────────────────────────────────────────────
# 6. Online mode
# ─────────────────────────────────────────────

def run_migrations_online() -> None:
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()

# ─────────────────────────────────────────────
# 7. Execution
# ─────────────────────────────────────────────

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()