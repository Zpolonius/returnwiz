import { useState, useEffect } from 'react';
import './App.css';
import logo from './assets/logo.jpg';
import { OnboardingWizard } from './components/onboarding/OnboardingWizard';

// --- TYPES ---
interface LineItem { id: string; product_name: string; variant_name: string; image_url: string; price: number; quantity: number; }
interface OrderResponse { order_id: string; order_number: string; customer_email: string; items: LineItem[]; }
interface SuccessResponse { message: string; return_id: string; tracking_number: string; tenant_used: string; }
interface DashboardItem { product_name: string; quantity: number; reason_code: string; }
interface DashboardOrder { id: string; shopify_order_number: string; customer_email: string; tracking_number: string; status: string; items: DashboardItem[]; }

// --- HELPER: DOMAIN DETECTION ---
const getSubdomain = () => {
  const hostname = window.location.hostname; // f.eks. "myshop.returnwiz.local"
  const parts = hostname.split('.');

  // Hvis vi kører på localhost (uden punkter) eller "app" eller "www", er vi i ADMIN mode
  if (parts.length === 1 || parts[0] === 'localhost' || parts[0] === 'app' || parts[0] === 'www' || parts[0] === 'returnwiz') {
    return null; // Ingen shop-subdomæne = ADMIN
  }

  return parts[0]; // Returnerer "myshop"
};

function App() {
  // --- NAVIGATION STATE ---
  // Vi bestemmer view baseret på subdomænet ved start
  const subdomain = getSubdomain();
  const [view, setView] = useState<'CUSTOMER' | 'MERCHANT'>(subdomain ? 'CUSTOMER' : 'MERCHANT');

  // --- MERCHANT STATE ---
  const [merchantTab, setMerchantTab] = useState<'REGISTER' | 'DASHBOARD'>('DASHBOARD');
  const [shopName, setShopName] = useState('');
  const [shopEmail, setShopEmail] = useState('');
  const [shopSuccess, setShopSuccess] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [dashboardData, setDashboardData] = useState<DashboardOrder[]>([]);

  // --- CUSTOMER STATE ---
  const [step, setStep] = useState<'SEARCH' | 'SELECT' | 'SUCCESS'>('SEARCH');
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [orderData, setOrderData] = useState<OrderResponse | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [successData, setSuccessData] = useState<SuccessResponse | null>(null);

  // --- SHARED ---
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Sørg for at API URL er dynamisk hvis nødvendigt, men her hardcoder vi backend port
  const API_URL = 'http://127.0.0.1:8000';

  // --- ACTIONS: MERCHANT ---
  const handleRegisterShop = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError(''); setShopSuccess('');
    try {
      const response = await fetch(`${API_URL}/tenants/register`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: shopName, email: shopEmail }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail);

      // Vis linket til deres nye subdomæne
      const newUrl = `http://${shopName.toLowerCase().replace(/\s+/g, '')}.returnwiz.local:5173`;
      setShopSuccess(`Velkommen! Din returportal er klar på: ${newUrl}`);
      setShopName(''); setShopEmail('');
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };

  const handleFetchDashboard = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      const response = await fetch(`${API_URL}/returns?shop_email=${loginEmail}`);
      if (!response.ok) throw new Error('Ingen data fundet.');
      const data = await response.json();
      setDashboardData(data);
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  }

  // --- ACTIONS: CUSTOMER ---
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      const response = await fetch(`${API_URL}/returns/search`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_number: orderNumber, email: email }),
      });
      if (!response.ok) throw new Error('Ordre ikke fundet');
      const data = await response.json();
      setOrderData(data); setStep('SELECT');
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };

  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedIds);
    if (newSelection.has(id)) newSelection.delete(id); else newSelection.add(id);
    setSelectedIds(newSelection);
  };

  const handleSubmitReturn = async () => {
    if (selectedIds.size === 0) return; setLoading(true);
    const itemsToSend = orderData?.items.filter(i => selectedIds.has(i.id)).map(i => ({ id: i.id, product_name: i.product_name, quantity: 1, reason: 'NOT_SPECIFIED' }));
    try {
      const response = await fetch(`${API_URL}/returns`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_number: orderNumber, email: email, items: itemsToSend }),
      });
      if (!response.ok) throw new Error('Fejl');
      const result = await response.json();
      setSuccessData(result); setStep('SUCCESS');
    } catch (err: any) { alert(err.message); } finally { setLoading(false); }
  };

  return (
    <div className="container" style={{ maxWidth: view === 'MERCHANT' ? '100%' : '520px', padding: view === 'MERCHANT' ? '0' : '20px' }}>

      {/* HEADER */}
      <header className="header">
        <img src={logo} alt="ReturnWiz Logo" className="logo" />
        <h1>ReturnWiz</h1>
        {/* Subdomain Indicator */}
        {subdomain && <div style={{ color: 'var(--bring-green)', fontWeight: 'bold', marginTop: '5px' }}>{subdomain.toUpperCase()} PORTAL</div>}
      </header>

      {/* --- MERCHANT VIEW (ADMIN) --- */}
      {view === 'MERCHANT' && (
        <div className="card">
          <div style={{ display: 'flex', borderBottom: '1px solid #eee', marginBottom: '20px' }}>
            <div onClick={() => setMerchantTab('DASHBOARD')} style={{ padding: '10px 20px', cursor: 'pointer', borderBottom: merchantTab === 'DASHBOARD' ? '2px solid var(--bring-green)' : 'none', fontWeight: merchantTab === 'DASHBOARD' ? 'bold' : 'normal' }}>Dashboard</div>
            <div onClick={() => setMerchantTab('REGISTER')} style={{ padding: '10px 20px', cursor: 'pointer', borderBottom: merchantTab === 'REGISTER' ? '2px solid var(--bring-green)' : 'none', fontWeight: merchantTab === 'REGISTER' ? 'bold' : 'normal' }}>Opret Shop</div>
          </div>

          {merchantTab === 'REGISTER' && (
            <div className="py-8">
              <OnboardingWizard />
            </div>
          )}

          {merchantTab === 'DASHBOARD' && (
            <div>
              <form onSubmit={handleFetchDashboard} style={{ display: 'flex', gap: '10px', marginBottom: '20px', alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}><label>Log ind med Email:</label><input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="admin@..." required /></div>
                <button className="btn-primary" style={{ width: 'auto' }} disabled={loading}>Log Ind</button>
              </form>
              {dashboardData.length > 0 ? (
                <table style={{ width: '100%', fontSize: '14px' }}>
                  <thead><tr style={{ textAlign: 'left', color: '#888' }}><th>Ordre</th><th>Kunde</th><th>Status</th><th>Varer</th></tr></thead>
                  <tbody>
                    {dashboardData.map(order => (
                      <tr key={order.id} style={{ borderTop: '1px solid #eee' }}><td style={{ padding: '10px' }}>{order.shopify_order_number}</td><td>{order.customer_email}</td><td>{order.status}</td><td>{order.items.length} stk</td></tr>
                    ))}
                  </tbody>
                </table>
              ) : <p className="text-muted" style={{ textAlign: 'center' }}>Ingen ordrer fundet / Ikke logget ind.</p>}
            </div>
          )}
          {error && <div className="error-msg">{error}</div>}
        </div>
      )}

      {/* --- CUSTOMER VIEW (SUBDOMAIN) --- */}
      {view === 'CUSTOMER' && (
        <>
          {step === 'SEARCH' && (
            <div className="card">
              <h2>Returnering</h2>
              <p className="text-muted">Velkommen til <strong>{subdomain}</strong>s returportal.</p>
              <form onSubmit={handleSearch}>
                <div className="form-group"><label>Ordrenummer</label><input value={orderNumber} onChange={e => setOrderNumber(e.target.value)} placeholder="1001" required /></div>
                <div className="form-group"><label>Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required /></div>
                <button className="btn-primary" disabled={loading}>{loading ? '...' : 'Start'}</button>
              </form>
            </div>
          )}
          {step === 'SELECT' && orderData && (
            <div className="card">
              <h2>Vælg varer</h2>
              <div className="item-list">{orderData.items.map(item => (<div key={item.id} className={`item-card ${selectedIds.has(item.id) ? 'is-selected' : ''}`} onClick={() => toggleSelection(item.id)}><div className="checkbox-visual">{selectedIds.has(item.id) && '✓'}</div><img src={item.image_url} className="product-thumb" /><div><h3>{item.product_name}</h3><div className="text-muted">{item.variant_name}</div></div></div>))}</div>
              <div className="flex-gap"><button className="btn-secondary" onClick={() => setStep('SEARCH')}>Tilbage</button><button className="btn-primary" onClick={handleSubmitReturn} disabled={loading || selectedIds.size === 0}>Godkend Retur</button></div>
            </div>
          )}
          {step === 'SUCCESS' && successData && (
            <div className="card" style={{ textAlign: 'center' }}>
              <h2 style={{ color: 'var(--bring-green)' }}>Tak!</h2>
              <div className="success-box">{successData.tracking_number}</div>
              <button className="btn-primary" onClick={() => window.location.reload()}>Ny retur</button>
            </div>
          )}
          {error && <div className="error-msg">{error}</div>}
        </>
      )}
    </div>
  );
}

export default App;