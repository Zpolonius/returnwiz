import { useState } from 'react';
import './App.css';

// Typer
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

function App() {
  // State til Flow
  const [step, setStep] = useState<'SEARCH' | 'SELECT' | 'SUCCESS'>('SEARCH');
  
  // Data State
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [orderData, setOrderData] = useState<OrderResponse | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  // UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState<any>(null);

  // 1. Søg efter ordre
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/returns/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_number: orderNumber, email: email }),
      });

      if (!response.ok) throw new Error('Ordren blev ikke fundet');

      const data = await response.json();
      setOrderData(data);
      setStep('SELECT'); // Gå til næste skærm
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 2. Håndter valg af vare (Checkbox)
  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedIds);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedIds(newSelection);
  };

  // 3. Indsend Retursag
  const handleSubmitReturn = async () => {
    if (selectedIds.size === 0) {
      alert("Du skal vælge mindst én vare!");
      return;
    }
    setLoading(true);

    // Find de fulde objekter for de valgte ID'er
    const itemsToSend = orderData?.items
      .filter(i => selectedIds.has(i.id))
      .map(i => ({
        id: i.id,
        product_name: i.product_name,
        quantity: 1, // Vi hardcoder 1 stk for nu for simpelhedens skyld
        reason: 'NOT_SPECIFIED'
      }));

    try {
      const response = await fetch('http://localhost:8000/returns', {
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
      setStep('SUCCESS'); // Gå til slut skærm

    } catch (err: any) {
      alert("Fejl: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>ReturnWiz 📦</h1>
      </header>

      {/* TRIN 1: SØG */}
      {step === 'SEARCH' && (
        <div className="card">
          <h2>Find din ordre</h2>
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
              <label>Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
              />
            </div>
            <button disabled={loading}>{loading ? 'Leder...' : 'Start Retur'}</button>
            {error && <p className="error-msg">{error}</p>}
          </form>
        </div>
      )}

      {/* TRIN 2: VÆLG VARER */}
      {step === 'SELECT' && orderData && (
        <div className="result-area">
          <h2>Vælg varer til retur</h2>
          <div className="item-list">
            {orderData.items.map((item) => {
              const isSelected = selectedIds.has(item.id);
              return (
                <div 
                  key={item.id} 
                  className={`item-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => toggleSelection(item.id)}
                  style={{cursor: 'pointer', border: isSelected ? '2px solid #00CB00' : '1px solid #eee'}}
                >
                  {/* Fake Checkbox */}
                  <div style={{
                    width: 20, height: 20, 
                    borderRadius: '50%', 
                    border: '2px solid #ddd',
                    background: isSelected ? '#00CB00' : 'white',
                    marginRight: 10
                  }} />
                  
                  <img src={item.image_url} alt="" width="50" />
                  <div className="item-info">
                    <h3>{item.product_name}</h3>
                    <span>{item.variant_name}</span>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div style={{marginTop: 20}}>
            <button onClick={handleSubmitReturn} disabled={loading} style={{opacity: selectedIds.size === 0 ? 0.5 : 1}}>
              {loading ? 'Opretter...' : `Returner ${selectedIds.size} varer`}
            </button>
            <button className="secondary-btn" onClick={() => setStep('SEARCH')}>Annuller</button>
          </div>
        </div>
      )}

      {/* TRIN 3: SUCCESS */}
      {step === 'SUCCESS' && successData && (
        <div className="card" style={{textAlign: 'center'}}>
          <h2 style={{color: '#00CB00'}}>Tak for din retur!</h2>
          <p>Din retursag er oprettet.</p>
          
          <div style={{background: '#f0f0f0', padding: 20, margin: '20px 0', borderRadius: 8}}>
            <strong>Tracking Nummer:</strong><br/>
            <span style={{fontSize: '1.2rem', fontFamily: 'monospace'}}>{successData.tracking_number}</span>
          </div>

          <p>Vis dette nummer i pakkeshoppen, eller vent på din label.</p>
          
          <button onClick={() => window.location.reload()}>Start forfra</button>
        </div>
      )}
    </div>
  );
}

export default App;