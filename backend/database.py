from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Vi henter URL'en fra Docker miljøet, eller bruger en fallback til lokal test
SQLALCHEMY_DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql://user:password@localhost:5432/returnwiz"
)

# Opret "motoren"
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Opret en SessionLocal klasse. Hver gang vi skal tale med DB, laver vi en instans af denne.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base klassen som alle vores modeller skal arve fra
Base = declarative_base()

# Hjælpefunktion til at få en database session (bruges i API endpoints)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()