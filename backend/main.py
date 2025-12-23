from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from database import engine, get_db
import models
import uuid

# Opret tabeller
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="ReturnWiz API")

# Dette tillader React (port 5173) at kalde Python (port 8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # Kun vores frontend må kalde
    allow_credentials=True,
    allow_methods=["*"], # Tillad alle metoder (GET, POST osv.)
    allow_headers=["*"],
)

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

    #endpoint til at håndtere retur request
    class ReturnItemRequest(BaseModel):
    id: str         # Shopify Line Item ID
    quantity: int
    reason: str
    product_name: str

class CreateReturnRequest(BaseModel):
    order_number: str
    email: str
    items: List[ReturnItemRequest]

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
        raise HTTPException(status_code=404, detail="Ordren blev ikke fundet. Tjek ordrenummer og email.")
        
    return order_data

@app.get("/tenants")
def read_tenants(db: Session = Depends(get_db)):
    return db.query(models.Tenant).all()

#Endpointet der gemmer i databasen med retur
@app.post("/returns")
def create_return(request: CreateReturnRequest, db: Session = Depends(get_db)):
    print(f"Modtager returordre for {request.order_number}")

    # A. Opret selve retursagen i DB
    # (Vi bruger en tilfældig Tenant ID her, da vi ikke har login systemet på plads endnu)
    # I produktion ville vi slå tenant op baseret på domænet.
    dummy_tenant_id = uuid.uuid4() 
    
    new_return = models.ReturnOrder(
        shopify_order_number=request.order_number,
        customer_email=request.email,
        # Vi faker et tracking nummer her, indtil vi kobler Bring på rigtigt
        tracking_number=f"TEST-TRACK-{uuid.uuid4().hex[:8].upper()}",
        label_url="https://www.bring.no/static/img/logo.png", # Placeholder
        status="CREATED",
        tenant_id=dummy_tenant_id 
    )
    db.add(new_return)
    db.commit() # Nu har retursagen et ID (new_return.id)
    db.refresh(new_return)

    # B. Gem de valgte varer i DB
    for item in request.items:
        db_item = models.ReturnItem(
            return_id=new_return.id,
            shopify_line_item_id=item.id,
            product_name=item.product_name,
            quantity=item.quantity,
            reason_code=item.reason
        )
        db.add(db_item)
    
    db.commit()

    return {
        "message": "Retursag oprettet",
        "return_id": new_return.id,
        "tracking_number": new_return.tracking_number
    }