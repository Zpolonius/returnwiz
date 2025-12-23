from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 1. Vi bruger SQLite til lokal udvikling (det er bare en fil)
SQLALCHEMY_DATABASE_URL = "sqlite:///./returnwiz.db"

# HVIS du ville bruge PostgreSQL, ville det se sådan ud (men det kræver en server):
# SQLALCHEMY_DATABASE_URL = "postgresql://user:password@postgresserver/db"

# 2. Opret Engine
# "check_same_thread": False er nødvendigt KUN for SQLite
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
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