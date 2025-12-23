import uuid
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from database import engine, get_db
import models
from uuid import UUID

# Opret tabeller
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="ReturnWiz API")

# Dette tillader React (port 5173) at kalde Python (port 8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
     # Kun vores frontend må kalde
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

class ReturnItemRequest(BaseModel):
    id: str         # Shopify Line Item ID
    quantity: int
    reason: str
    product_name: str

class OrderResponse(BaseModel):
    order_id: str
    order_number: str
    customer_email: str
    currency: str
    items: List[LineItemSchema]

class CreateReturnRequest(BaseModel):
    order_number: str
    email: str
    items: List[ReturnItemRequest]

# --- NYT SCHEMA TIL WEBSHOPS ---
class CreateTenantRequest(BaseModel):
    name: str
    email: str
    # Vi kunne tilføje password her senere, men nu holder vi det simpelt
# --- SCHEMAS TIL DASHBOARD (Læsning af data) ---
class ReturnItemResponse(BaseModel):
    product_name: str
    quantity: int
    reason_code: str
    
    class Config:
        # Dette fortæller Pydantic, at den må læse data fra en SQLAlchemy model
        from_attributes = True 

class ReturnOrderResponse(BaseModel):
    id: UUID
    shopify_order_number: str
    customer_email: str
    tracking_number: Optional[str] = None
    status: str
    items: List[ReturnItemResponse]

    class Config:
        from_attributes = True
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
    tenant = db.query(models.Tenant).first() 

    if not tenant:
        # Hvis databasen er tom (første kørsel), opretter vi en 'seed' tenant
        print("Ingen tenant fundet. Opretter 'Default Webshop'...")
        tenant = models.Tenant(
            
            name="Min Webshop", 
            email="shop@example.com"
        )
        db.add(tenant)
        db.commit()
        db.refresh(tenant)
    real_tenant_id = tenant.id

    new_return = models.ReturnOrder(
        shopify_order_number=request.order_number,
        customer_email=request.email,
        # Vi faker et tracking nummer her, indtil vi kobler Bring på rigtigt
        tracking_number=f"TEST-TRACK-{uuid.uuid4().hex[:8].upper()}",
        label_url="https://www.bring.no/static/img/logo.png", # Placeholder
        status="CREATED",
        tenant_id=real_tenant_id
    )
    db.add(new_return)
    db.commit() # Nu har retursagen et ID (new_return.id)
    db.refresh(new_return)

    # B. Gem de valgte varer i DB
    for item in request.items:
      if item.quantity > 0:
            db_item = models.ReturnItem(
                return_id=new_return.id,
                shopify_line_item_id=item.id,
                product_name=item.product_name,
                quantity=item.quantity,
                reason_code=item.reason
            )
            db.add(db_item)
    
    db.commit()

    print(f"Succes! Retursag {new_return.id} oprettet for {tenant.shop_name}")
    return {
        "message": "Retursag oprettet succesfuldt",
        "return_id": str(new_return.id), # Konverter UUID til string for sikker JSON
        "tracking_number": new_return.tracking_number,
        "tenant_used": tenant.shop_name
    }
# --- NYT ENDPOINT: OPRET WEBSHOP ---
@app.post("/tenants/register")
def register_tenant(request: CreateTenantRequest, db: Session = Depends(get_db)):
    # 1. Tjek om email allerede findes (Business Logic)
    existing_tenant = db.query(models.Tenant).filter(models.Tenant.email == request.email).first()
    if existing_tenant:
        raise HTTPException(status_code=400, detail="En shop med denne email findes allerede.")

    # 2. Opret ny tenant
    new_tenant = models.Tenant(
        shop_name=request.name,
        email=request.email
        # ID genereres automatisk af databasen/modellen
    )
    
    try:
        db.add(new_tenant)
        db.commit()
        db.refresh(new_tenant)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database fejl: {str(e)}")

    print(f"Ny shop oprettet: {new_tenant.shop_name} ({new_tenant.id})")
    
    return {
        "message": "Webshop oprettet succesfuldt!",
        "tenant_id": str(new_tenant.id),
        "name": new_tenant.shop_name
    }
# --- NYT ENDPOINT: HENT RETURSAGER (DASHBOARD) ---
@app.get("/returns", response_model=List[ReturnOrderResponse])
def read_returns(shop_email: Optional[str] = None, db: Session = Depends(get_db)):
    """
    Henter alle retursager. 
    Hvis 'shop_email' er angivet, filtrerer vi, så vi kun ser den shops ordrer.
    """
    query = db.query(models.ReturnOrder)
    
    if shop_email:
        # Vi joiner med Tenant tabellen for at filtrere på ejerens email
        query = query.join(models.Tenant).filter(models.Tenant.email == shop_email)
    
    results = query.all()
    return results