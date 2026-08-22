from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.config import settings
from app.db.database import get_db

app = FastAPI(title=settings.app_name)

@app.get("/health")
def health_check(db: Session = Depends(get_db)):
    try:
        # Execute basic query to verify connection to Supabase PostgreSQL database
        db.execute(text("SELECT 1"))
        return {
            "status": "healthy",
            "database": "connected",
            "environment": settings.environment
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e),
            "environment": settings.environment
        }
