from sqlalchemy import Column, String, Integer, Boolean, ForeignKey, DateTime, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from database import Base

class Tenant(Base):
    __tablename__ = "tenants"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    shopify_domain = Column(String, unique=True, index=True, nullable=True)
    shop_name = Column(String)
    
    # Her gemmer vi tokens (I produktion skal disse krypteres!)
    access_token = Column(String, nullable=True) 
    
    # Firma info
    cvr_number = Column(String, nullable=True)

    # Bring Indstillinger
    bring_customer_number = Column(String, nullable=True)
    bring_api_key = Column(String, nullable=True)
    bring_api_user = Column(String, nullable=True) # ID/User for API

    # Branding
    logo_url = Column(String, nullable=True)
    banner_url = Column(String, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relation til retursager
    returns = relationship("ReturnOrder", back_populates="tenant")

class ReturnOrder(Base):
    __tablename__ = "returns"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"))
    
    # Shopify Data
    shopify_order_id = Column(String, index=True)
    shopify_order_number = Column(String)
    customer_email = Column(String)
    
    # Bring Data
    tracking_number = Column(String, unique=True, index=True, nullable=True)
    label_url = Column(Text, nullable=True)
    qr_code_url = Column(Text, nullable=True)
    
    # Status (CREATED, IN_TRANSIT, DELIVERED, REFUNDED)
    status = Column(String, default="CREATED", index=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationer
    tenant = relationship("Tenant", back_populates="returns")
    items = relationship("ReturnItem", back_populates="return_order")

class ReturnItem(Base):
    __tablename__ = "return_items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    return_id = Column(UUID(as_uuid=True), ForeignKey("returns.id"))
    
    shopify_line_item_id = Column(String)
    product_name = Column(String)
    quantity = Column(Integer)
    reason_code = Column(String) # f.eks. 'SIZE_TOO_SMALL'
    
    return_order = relationship("ReturnOrder", back_populates="items")