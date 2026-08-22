from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

DATABASE_URL = settings.database_url

# Standard SQLAlchemy engine configuration
# Note: For psycopg2-binary, connection URL should follow postgresql:// format
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency to yield database sessions to FastAPI route handlers
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
