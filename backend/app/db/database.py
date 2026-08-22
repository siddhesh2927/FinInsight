from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

DATABASE_URL = settings.database_url

# Initialize engine and session only if DATABASE_URL is configured
if DATABASE_URL:
    engine = create_engine(DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
else:
    engine = None
    SessionLocal = None

Base = declarative_base()

# Dependency to yield database sessions to FastAPI route handlers
def get_db():
    if not SessionLocal:
        yield None
        return
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
