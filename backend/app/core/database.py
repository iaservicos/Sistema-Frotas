from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from backend.app.core.config import settings

# Engine otimizado para o Supabase (PgBouncer pooler)
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,      # Evita conexões mortas no pooler
    pool_recycle=300,        # Recicla a cada 5 minutos
    pool_size=10,
    max_overflow=15,
    echo=False
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    """Dependência FastAPI para injetar a sessão do banco por requisição."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
