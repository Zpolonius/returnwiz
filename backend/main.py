from fastapi import FastAPI
from sqlalchemy import create_engine, text
import os
import time

app = FastAPI(title="ReturnWiz API")

# Hent database URL fra miljøvariabler (defineret i docker-compose)
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@db:5432/returnwiz")

@app.get("/")
def read_root():
    return {"message": "ReturnWiz Backend er online 🟢"}

@app.get("/health")
def health_check():
    """Tjekker om vi har forbindelse til databasen"""
    try:
        # Forsøg at forbinde til databasen
        engine = create_engine(DATABASE_URL)
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        return {"status": "healthy", "database": "connected 🟢"}
    except Exception as e:
        return {"status": "unhealthy", "database": f"failed 🔴: {str(e)}"}