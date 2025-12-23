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

function App() {
  // --- NAVIGATION STATE ---
  // Vi styrer nu om vi ser 'CUSTOMER' (Retur) eller 'MERCHANT' (Opret shop)
  const [view, setView] = useState<'CUSTOMER' | 'MERCHANT'>('CUSTOMER');

  // --- CUSTOMER FLOW STATE ---
  const [step, setStep] = useState<'SEARCH' | 'SELECT' | 'SUCCESS'>('SEARCH');
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [orderData, setOrderData] = useState<OrderResponse | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [successData, setSuccessData] = useState<SuccessResponse | null>(null);
  
  // --- MERCHANT FLOW STATE ---
  const [shopName, setShopName] = useState('');
  const [shopEmail, setShopEmail] = useState('');
  const [shopSuccess, setShopSuccess] = useState('');

  // --- SHARED UI STATE ---
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ==============================
  // LOGIK: KUNDE (RETURNERING)
  // ==============================
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://127.0.0.1:8000/returns/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_number: orderNumber, email: email }),
      });

      if (!response.ok) throw new Error('Vi kunne ikke finde din ordre. Prøv "1001"');

      const data = await response.json();
      setOrderData(data);
      setStep('SELECT'); 
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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

    const itemsToSend = orderData?.items
      .filter(i => selectedIds.has(i.id))
      .map(i => ({
        id: i.id,
        product_name: i.product_name,
        quantity: 1, 
        reason: 'NOT_SPECIFIED' 
      }));

    try {
      const response = await fetch('http://127.0.0.1:8000/returns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_number: orderNumber,
          email: email,
          items: itemsToSend
        }),
      });

      if (!response.ok) throw new Error('Kunne ikke oprette retur');
      
      const result = await response.json();
      setSuccessData(result);
      setStep('SUCCESS'); 

    } catch (err: any) {
      alert("Fejl: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // LOGIK: MERCHANT (OPRET SHOP)
  // ==============================
  const handleRegisterShop = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setShopSuccess('');

    try {
        const response = await fetch('http://127.0.0.1:8000/tenants/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: shopName, email: shopEmail }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || 'Kunne ikke oprette shop');
        }

        setShopSuccess(`Velkommen ${data.name}! Din shop er oprettet.`);
        setShopName(''); // Reset form
        setShopEmail('');
    } catch (err: any) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
  };

  // ==============================
  // RENDER UI
  // ==============================
  return (
    <div className="container">
      
      {/* HEADER MED NAVIGATION */}
      <header className="header" style={{position: 'relative'}}>
        <img src={logo} alt="ReturnWiz Logo" className="logo" />
        <h1>ReturnWiz</h1>
        
        {/* Toggle Knap i hjørnet */}
        <div style={{position: 'absolute', top: 0, right: 0}}>
            {view === 'CUSTOMER' ? (
                <button 
                    onClick={() => setView('MERCHANT')} 
                    style={{fontSize: '12px', padding: '5px 10px', background: 'transparent', color: '#888', border: '1px solid #ddd'}}
                >
                    For Webshops
                </button>
            ) : (
                <button 
                    onClick={() => setView('CUSTOMER')} 
                    style={{fontSize: '12px', padding: '5px 10px', background: 'transparent', color: '#888', border: '1px solid #ddd'}}
                >
                    Tilbage til Retur
                </button>
            )}
        </div>
      </header>


      {/* --- MERCHANT VIEW (OPRET SHOP) --- */}
      {view === 'MERCHANT' && (
        <div className="card">
            <h2>Opret din Webshop 🛍️</h2>
            <p className="text-muted">Tilmeld dig ReturnWiz og lad os håndtere dine returvarer.</p>

            <form onSubmit={handleRegisterShop}>
                <div className="form-group">
                    <label>Butiksnavn</label>
                    <input 
                        value={shopName} 
                        onChange={e => setShopName(e.target.value)} 
                        placeholder="Min Seje Butik ApS" 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>Admin Email</label>
                    <input 
                        type="email"
                        value={shopEmail} 
                        onChange={e => setShopEmail(e.target.value)} 
                        placeholder="admin@minbutik.dk" 
                        required 
                    />
                </div>
                <button className="btn-primary" disabled={loading}>
                    {loading ? 'Opretter...' : 'Opret Webshop'}
                </button>
            </form>

            {shopSuccess && (
                <div className="success-box" style={{marginTop: '20px', borderColor: 'var(--bring-green)'}}>
                    ✅ {shopSuccess}
                </div>
            )}
            
            {error && <div className="error-msg">{error}</div>}
        </div>
      )}


      {/* --- CUSTOMER VIEW (RETURNERING) --- */}
      {view === 'CUSTOMER' && (
        <>
            {/* TRIN 1: SØG */}
            {step === 'SEARCH' && (
                <div className="card">
                <h2>Find din ordre</h2>
                <p className="text-muted">Indtast ordrenummer og e-mail.</p>
                
                <form onSubmit={handleSearch}>
                    <div className="form-group">
                    <label>Ordrenummer</label>
                    <input
                        value={orderNumber}
                        onChange={(e) => setOrderNumber(e.target.value)}
                        placeholder="F.eks. 1001"
                        required
                    />
                    </div>
                    <div className="form-group">
                    <label>E-mail</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                    />
                    </div>
                    
                    <button className="btn-primary" disabled={loading}>
                        {loading ? 'Leder...' : 'Start Returnering'}
                    </button>
                    {error && <div className="error-msg">{error}</div>}
                </form>
                </div>
            )}

            {/* TRIN 2: VÆLG VARER */}
            {step === 'SELECT' && orderData && (
                <div className="card">
                <h2>Hvad vil du returnere?</h2>
                <p className="text-muted">Klik på varerne for at vælge dem.</p>
                
                <div className="item-list">
                    {orderData.items.map((item) => {
                    const isSelected = selectedIds.has(item.id);
                    return (
                        <div 
                        key={item.id} 
                        className={`item-card ${isSelected ? 'is-selected' : ''}`}
                        onClick={() => toggleSelection(item.id)}
                        >
                        <div className="checkbox-visual">
                            {isSelected && '✓'}
                        </div>
                        
                        <img src={item.image_url} alt="" className="product-thumb" />
                        
                        <div className="item-info">
                            <h3>{item.product_name}</h3>
                            <div className="text-muted">{item.variant_name}</div>
                        </div>
                        </div>
                    );
                    })}
                </div>
                
                <div className="flex-gap">
                    <button className="btn-secondary" onClick={() => setStep('SEARCH')}>Tilbage</button>
                    <button 
                        className="btn-primary"
                        onClick={handleSubmitReturn} 
                        disabled={loading || selectedIds.size === 0} 
                    >
                    {loading ? 'Behandler...' : `Opret Retur (${selectedIds.size})`}
                    </button>
                </div>
                </div>
            )}

            {/* TRIN 3: SUCCESS */}
            {step === 'SUCCESS' && successData && (
                <div className="card" style={{textAlign: 'center'}}>
                <h2 style={{color: 'var(--bring-green)'}}>Tak for din retur!</h2>
                <p>Retursag oprettet.</p>
                
                <div className="success-box">
                    {successData.tracking_number}
                </div>

                <button className="btn-primary" onClick={() => window.location.reload()}>
                    Start forfra
                </button>
                </div>
            )}
        </>
      )}
    </div>
  );
}

export default App;