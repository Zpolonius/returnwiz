from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

import os

# 1. Hent URL fra environment (Docker) eller brug SQLite som fallback
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./returnwiz.db")

# 2. Opret Engine
# "check_same_thread": False er nødvendigt KUN for SQLite
connect_args = {}
if "sqlite" in SQLALCHEMY_DATABASE_URL:
    connect_args["check_same_thread"] = False

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args=connect_args
)

# 3. Opret SessionLocal (Det er den vi bruger til at tale med DB)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 4. Base klasse til vores modeller
Base = declarative_base()

# 5. Dependency injection (Hjælpefunktion til at hente DB session)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()