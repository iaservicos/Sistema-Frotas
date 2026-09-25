import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict
from sqlalchemy.engine import URL
from dotenv import load_dotenv

# Carrega .env da raiz do projeto
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
load_dotenv(os.path.join(BASE_DIR, ".env"))

class Settings(BaseSettings):
    model_config = SettingsConfigDict(case_sensitive=True, extra="ignore")

    PROJECT_NAME: str = "SGFrotas API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Configurações do Banco de Dados PostgreSQL (Supabase)
    POSTGRES_HOST: str = os.getenv("POSTGRES_HOST", "aws-1-us-east-1.pooler.supabase.com")
    POSTGRES_PORT: int = int(os.getenv("POSTGRES_PORT", "5432"))
    POSTGRES_DB: str = os.getenv("POSTGRES_DB", "postgres")
    POSTGRES_USER: str = os.getenv("POSTGRES_USER", "postgres.eychznasujcjfdupizfm")
    POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD", "Br@sil#$%2026")
    POSTGRES_SCHEMA: str = os.getenv("POSTGRES_SCHEMA", "public")
    
    # Montagem da URL SQLAlchemy estruturada e segura
    @property
    def DATABASE_URL(self) -> URL:
        return URL.create(
            drivername="postgresql+psycopg2",
            username=self.POSTGRES_USER,
            password=self.POSTGRES_PASSWORD,
            host=self.POSTGRES_HOST,
            port=self.POSTGRES_PORT,
            database=self.POSTGRES_DB,
            query={"sslmode": "require"}
        )

    # CORS para desenvolvimento
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    ]

settings = Settings()
