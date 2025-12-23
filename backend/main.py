from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import engine, get_db
import models

# Dette er magien: Denne linje opretter tabellerne i databasen hvis de ikke findes
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="ReturnWiz API")

@app.get("/")
def read_root():
    return {"message": "ReturnWiz API er online og databasen er synkroniseret 🟢"}

# Et test-endpoint for at se om vi kan skrive til databasen
@app.post("/test-db")
def test_create_tenant(db: Session = Depends(get_db)):
    # Opretter en falsk shop for at teste forbindelsen
    import uuid
    new_tenant = models.Tenant(
        shopify_domain=f"test-{uuid.uuid4()}.myshopify.com",
        shop_name="Min Test Butik",
        access_token="fake_token_123"
    )
    db.add(new_tenant)
    db.commit()
    db.refresh(new_tenant)
    return {"status": "Tenant created", "id": new_tenant.id, "domain": new_tenant.shopify_domain}


@app.get("/tenants")
def read_tenants(db: Session = Depends(get_db)):
    # Hent alle rækker fra 'tenants' tabellen
    tenants = db.query(models.Tenant).all()
    return tenants