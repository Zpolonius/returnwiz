import { useState } from 'react';
import './App.css'; 
import logo from './assets/logo.jpg'; 

// --- TYPES ---
interface LineItem {
  id: string;
  product_name: string;
  variant_name: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface OrderResponse {
  order_id: string;
  order_number: string;
  customer_email: string;
  items: LineItem[];
}

interface SuccessResponse {
  message: string;
  return_id: string;
  tracking_number: string;
  tenant_used: string;
}

// Nye typer til Dashboard
interface DashboardItem {
    product_name: string;
    quantity: number;
    reason_code: string;
}

interface DashboardOrder {
    id: string;
    shopify_order_number: string;
    customer_email: string;
    tracking_number: string;
    status: string;
    items: DashboardItem[];
}

function App() {
  // --- GLOBAL NAVIGATION ---
  const [view, setView] = useState<'CUSTOMER' | 'MERCHANT'>('MERCHANT'); // Starter i Merchant for nemheds skyld nu

  // --- CUSTOMER STATE ---
  const [step, setStep] = useState<'SEARCH' | 'SELECT' | 'SUCCESS'>('SEARCH');
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [orderData, setOrderData] = useState<OrderResponse | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [successData, setSuccessData] = useState<SuccessResponse | null>(null);
  
  // --- MERCHANT STATE ---
  const [merchantTab, setMerchantTab] = useState<'REGISTER' | 'DASHBOARD'>('DASHBOARD');
  // Register
  const [shopName, setShopName] = useState('');
  const [shopEmail, setShopEmail] = useState('');
  const [shopSuccess, setShopSuccess] = useState('');
  // Dashboard
  const [loginEmail, setLoginEmail] = useState('');
  const [dashboardData, setDashboardData] = useState<DashboardOrder[]>([]);

  // --- SHARED UI ---
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ==============================
  // ACTIONS: KUNDE
  // ==============================
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const response = await fetch('http://127.0.0.1:8000/returns/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_number: orderNumber, email: email }),
      });
      if (!response.ok) throw new Error('Ordre ikke fundet (Prøv 1001)');
      const data = await response.json();
      setOrderData(data);
      setStep('SELECT'); 
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };

  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedIds);
    if (newSelection.has(id)) newSelection.delete(id);
    else newSelection.add(id);
    setSelectedIds(newSelection);
  };

  const handleSubmitReturn = async () => {
    if (selectedIds.size === 0) return;
    setLoading(true);
    const itemsToSend = orderData?.items.filter(i => selectedIds.has(i.id)).map(i => ({
        id: i.id, product_name: i.product_name, quantity: 1, reason: 'NOT_SPECIFIED' 
    }));
    try {
      const response = await fetch('http://127.0.0.1:8000/returns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_number: orderNumber, email: email, items: itemsToSend }),
      });
      if (!response.ok) throw new Error('Fejl ved oprettelse');
      const result = await response.json();
      setSuccessData(result);
      setStep('SUCCESS'); 
    } catch (err: any) { alert(err.message); } finally { setLoading(false); }
  };

  // ==============================
  // ACTIONS: MERCHANT
  // ==============================
  const handleRegisterShop = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(''); setShopSuccess('');
    try {
        const response = await fetch('http://127.0.0.1:8000/tenants/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: shopName, email: shopEmail }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || 'Fejl');
        setShopSuccess(`Velkommen ${data.name}! Din shop er oprettet.`);
        setShopName(''); setShopEmail('');
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };

  const handleFetchDashboard = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true); setError('');
      try {
          // Kalder vores nye endpoint med shop_email parameter
          const response = await fetch(`http://127.0.0.1:8000/returns?shop_email=${loginEmail}`);
          if (!response.ok) throw new Error('Kunne ikke hente data');
          const data = await response.json();
          setDashboardData(data);
      } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  }

  // ==============================
  // RENDER UI
  // ==============================
  return (
    <div className="container" style={{maxWidth: view === 'MERCHANT' && merchantTab === 'DASHBOARD' ? '800px' : '520px'}}>
      
      <header className="header" style={{position: 'relative'}}>
        <img src={logo} alt="ReturnWiz Logo" className="logo" />
        <h1>ReturnWiz</h1>
        
        <div style={{position: 'absolute', top: 0, right: 0}}>
            <button 
                onClick={() => setView(view === 'CUSTOMER' ? 'MERCHANT' : 'CUSTOMER')} 
                style={{fontSize: '12px', padding: '5px 10px', background: 'transparent', color: '#888', border: '1px solid #ddd'}}
            >
                {view === 'CUSTOMER' ? 'For Webshops' : 'For Kunder'}
            </button>
        </div>
      </header>

      {/* --- MERCHANT VIEW --- */}
      {view === 'MERCHANT' && (
        <div className="card">
            <div style={{display:'flex', borderBottom:'1px solid #eee', marginBottom:'20px'}}>
                <div 
                    onClick={() => setMerchantTab('DASHBOARD')}
                    style={{padding:'10px 20px', cursor:'pointer', borderBottom: merchantTab === 'DASHBOARD' ? '2px solid var(--bring-green)' : 'none', fontWeight: merchantTab === 'DASHBOARD' ? 'bold' : 'normal'}}
                >
                    Dashboard
                </div>
                <div 
                    onClick={() => setMerchantTab('REGISTER')}
                    style={{padding:'10px 20px', cursor:'pointer', borderBottom: merchantTab === 'REGISTER' ? '2px solid var(--bring-green)' : 'none', fontWeight: merchantTab === 'REGISTER' ? 'bold' : 'normal'}}
                >
                    Opret Shop
                </div>
            </div>

            {/* TAB: REGISTER */}
            {merchantTab === 'REGISTER' && (
                <form onSubmit={handleRegisterShop}>
                    <h2>Opret din Webshop 🛍️</h2>
                    <div className="form-group">
                        <label>Butiksnavn</label>
                        <input value={shopName} onChange={e => setShopName(e.target.value)} placeholder="Min Butik" required />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" value={shopEmail} onChange={e => setShopEmail(e.target.value)} placeholder="mail@butik.dk" required />
                    </div>
                    <button className="btn-primary" disabled={loading}>{loading ? 'Arbejder...' : 'Opret'}</button>
                    {shopSuccess && <div className="success-box" style={{marginTop:'20px'}}>✅ {shopSuccess}</div>}
                </form>
            )}

            {/* TAB: DASHBOARD */}
            {merchantTab === 'DASHBOARD' && (
                <div>
                    <form onSubmit={handleFetchDashboard} style={{display:'flex', gap:'10px', marginBottom:'20px', alignItems:'flex-end'}}>
                        <div style={{flex:1}}>
                            <label>Vis returer for (Email):</label>
                            <input 
                                type="email" 
                                value={loginEmail} 
                                onChange={e => setLoginEmail(e.target.value)} 
                                placeholder="Indtast din shop email..." 
                                required
                            />
                        </div>
                        <button className="btn-primary" style={{width:'auto'}} disabled={loading}>
                            {loading ? 'Henter...' : 'Hent Data'}
                        </button>
                    </form>

                    {dashboardData.length > 0 ? (
                        <table style={{width:'100%', borderCollapse:'collapse', fontSize:'14px'}}>
                            <thead>
                                <tr style={{textAlign:'left', borderBottom:'2px solid #eee', color:'#888'}}>
                                    <th style={{padding:'10px'}}>Ordre #</th>
                                    <th style={{padding:'10px'}}>Kunde</th>
                                    <th style={{padding:'10px'}}>Status</th>
                                    <th style={{padding:'10px'}}>Varer</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dashboardData.map(order => (
                                    <tr key={order.id} style={{borderBottom:'1px solid #eee'}}>
                                        <td style={{padding:'10px', fontWeight:'bold'}}>{order.shopify_order_number}</td>
                                        <td style={{padding:'10px'}}>{order.customer_email}</td>
                                        <td style={{padding:'10px'}}>
                                            <span style={{padding:'2px 8px', borderRadius:'10px', background:'#e6f4ea', color:'#1e4620', fontSize:'12px'}}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td style={{padding:'10px'}}>
                                            {order.items.map((i, idx) => (
                                                <div key={idx} style={{marginBottom:'2px'}}>
                                                    {i.quantity}x {i.product_name} <span style={{color:'#888', fontSize:'11px'}}>({i.reason_code})</span>
                                                </div>
                                            ))}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-muted" style={{textAlign:'center', marginTop:'40px'}}>
                            Ingen data fundet. Har du indtastet den rigtige email?
                        </p>
                    )}
                </div>
            )}
            
            {error && <div className="error-msg">{error}</div>}
        </div>
      )}

      {/* --- CUSTOMER VIEW --- */}
      {view === 'CUSTOMER' && (
        /* Her genbruger vi din eksisterende kunde-UI */
        <>
            {step === 'SEARCH' && (
                <div className="card">
                    <h2>Find din ordre</h2>
                    <form onSubmit={handleSearch}>
                        <div className="form-group"><label>Ordrenummer</label><input value={orderNumber} onChange={e => setOrderNumber(e.target.value)} placeholder="1001" required /></div>
                        <div className="form-group"><label>Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required /></div>
                        <button className="btn-primary" disabled={loading}>{loading ? '...' : 'Start Returnering'}</button>
                    </form>
                </div>
            )}
            {step === 'SELECT' && orderData && (
                <div className="card">
                    <h2>Vælg returvarer</h2>
                    <div className="item-list">
                        {orderData.items.map(item => (
                            <div key={item.id} className={`item-card ${selectedIds.has(item.id) ? 'is-selected' : ''}`} onClick={() => toggleSelection(item.id)}>
                                <div className="checkbox-visual">{selectedIds.has(item.id) && '✓'}</div>
                                <img src={item.image_url} className="product-thumb" alt="" />
                                <div><h3>{item.product_name}</h3><div className="text-muted">{item.variant_name}</div></div>
                            </div>
                        ))}
                    </div>
                    <div className="flex-gap">
                        <button className="btn-secondary" onClick={() => setStep('SEARCH')}>Tilbage</button>
                        <button className="btn-primary" onClick={handleSubmitReturn} disabled={loading || selectedIds.size===0}>Opret Retur</button>
                    </div>
                </div>
            )}
            {step === 'SUCCESS' && successData && (
                <div className="card" style={{textAlign:'center'}}>
                    <h2 style={{color:'var(--bring-green)'}}>Succes!</h2>
                    <div className="success-box">{successData.tracking_number}</div>
                    <button className="btn-primary" onClick={() => window.location.reload()}>Start forfra</button>
                </div>
            )}
        </>
      )}
    </div>
  );
}

export default App;