// src/services/api.ts

const API_BASE_URL = 'http://localhost:8000'; 

// --- TYPES (Matcher Backend Pydantic Models) ---

export interface LineItem {
  id: string;
  product_name: string;
  variant_name: string;
  image_url: string;
  price: number;
  quantity: number;
}

export interface OrderResponse {
  order_id: string;
  order_number: string;
  customer_email: string;
  currency: string;
  items: LineItem[];
}

export interface ReturnItemRequest {
  id: string;
  quantity: number;
  reason: string;
  product_name: string;
}

export interface CreateReturnRequest {
  order_number: string;
  email: string;
  items: ReturnItemRequest[];
}

export interface ReturnResponse {
  message: string;
  return_id: string;
  tracking_number: string;
  tenant_used: string;
}

// --- NYE TYPER TIL DASHBOARDET ---
export interface ReturnOrderListResponse {
    id: string;
    shopify_order_number: string;
    customer_email: string;
    tracking_number: string;
    status: string;
    items: {
        product_name: string;
        quantity: number;
        reason_code: string;
    }[];
}

// --- API SERVICE ---

export const api = {
  /**
   * Søger efter en ordre i backend (som mocker Shopify)
   */
  async searchOrder(orderNumber: string, email: string): Promise<OrderResponse> {
    const response = await fetch(`${API_BASE_URL}/returns/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_number: orderNumber, email }),
    });

    if (!response.ok) {
      throw new Error('Kunne ikke finde ordre. Tjek dine oplysninger.');
    }
    return response.json();
  },

  /**
   * Opretter retursagen og får tracking nummer tilbage
   */
  async createReturn(payload: CreateReturnRequest): Promise<ReturnResponse> {
    const response = await fetch(`${API_BASE_URL}/returns`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Fejl ved oprettelse af retursag.');
    }
    return response.json();
  },

  /**
   * Henter alle retursager til dashboardet (NY FUNKTION)
   */
  async getReturns(): Promise<ReturnOrderListResponse[]> {
    const response = await fetch(`${API_BASE_URL}/returns`);
    if (!response.ok) {
      throw new Error('Kunne ikke hente retursager');
    }
    return response.json();
  }
};