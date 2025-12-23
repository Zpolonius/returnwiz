from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from database import engine, get_db
import models

# Opret tabeller
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="ReturnWiz API")

# --- 1. DATAMODELLER (Schemas) ---
# Disse sikrer at data sendt frem og tilbage overholder reglerne

class OrderSearchRequest(BaseModel):
    order_number: str
    email: str

class LineItemSchema(BaseModel):
    id: str
    product_name: str
    variant_name: str
    image_url: str
    price: int # Pris i øre
    quantity: int

class OrderResponse(BaseModel):
    order_id: str
    order_number: str
    customer_email: str
    currency: str
    items: List[LineItemSchema]

# --- 2. MOCK SERVICE (Simulerer Shopify) ---
def mock_shopify_lookup(order_number: str, email: str):
    """
    Dette er en 'fake' adapter. I virkeligheden ville denne kalde Shopify API.
    Vi bruger den til at teste frontend-flowet.
    """
    # Vi lader som om ordrenr "1001" altid findes
    if order_number == "1001":
        return {
            "order_id": "gid://shopify/Order/123456789",
            "order_number": "1001",
            "customer_email": email, # Vi returnerer bare den email brugeren tastede
            "currency": "DKK",
            "items": [
                {
                    "id": "gid://shopify/LineItem/987654321",
                    "product_name": "Posten Bring T-Shirt",
                    "variant_name": "Large / Grøn",
                    "image_url": "https://via.placeholder.com/150/00CB00/FFFFFF?text=T-Shirt",
                    "price": 19900, # 199.00 kr
                    "quantity": 1
                },
                {
                    "id": "gid://shopify/LineItem/123123123",
                    "product_name": "Logistik Kasket",
                    "variant_name": "One-size",
                    "image_url": "https://via.placeholder.com/150/333333/FFFFFF?text=Cap",
                    "price": 9900, # 99.00 kr
                    "quantity": 2
                }
            ]
        }
    return None

# --- 3. ENDPOINTS ---

@app.get("/")
def read_root():
    return {"message": "ReturnWiz API er online 🟢"}

@app.post("/returns/search", response_model=OrderResponse)
def search_order(request: OrderSearchRequest):
    """
    Frontenden sender ordrenummer og email.
    Vi svarer med ordrens indhold (varer), så kunden kan vælge hvad der skal retur.
    """
    print(f"Søger efter ordre: {request.order_number} for {request.email}")
    
    order_data = mock_shopify_lookup(request.order_number, request.email)
    
    if not order_data:
        # Hvis ordren ikke findes, smid en 404 fejl (Not Found)
        raise HTTPException(status_code=404, detail="Ordren blev ikke fundet. Tjek nummer og email.")
        
    return order_data

@app.get("/tenants")
def read_tenants(db: Session = Depends(get_db)):
    return db.query(models.Tenant).all()