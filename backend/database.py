import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 1. Hent URL fra environment. 
# Best Practice: Vi fejler hellere tidligt, hvis variablen mangler i prod, 
# men tillader fallback til SQLite lokalt hvis ønsket.
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./returnwiz.db")

# 2. Konfigurer argumenter baseret på databasetypen
connect_args = {}
engine_kwargs = {}

if "sqlite" in SQLALCHEMY_DATABASE_URL:
    # SQLite specifik: Tillad tråde at dele connection
    connect_args["check_same_thread"] = False
else:
    # PostgreSQL / Produktion specifik:
    # pool_pre_ping=True er kritisk for at undgå "OperationalError: server closed the connection unexpectedly"
    # Dette tjekker om forbindelsen er i live før brug.
    engine_kwargs["pool_pre_ping"] = True
    engine_kwargs["pool_size"] = 10     # Standard er ofte 5, juster efter belastning
    engine_kwargs["max_overflow"] = 20  # Hvor mange ekstra forbindelser udover pool_size

# 3. Opret Engine med destrukturering af kwa    rgs
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args=connect_args,
    **engine_kwargs
)

# 4. Opret SessionLocal
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 5. Base klasse
Base = declarative_base()

# 6. Dependency Injection
def get_db():
    """
    Opretter en ny database session per request og sikrer lukning bagefter.
    Vigtigt for at undgå memory leaks og connection exhaustion.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()