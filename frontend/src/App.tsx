import { useState } from 'react';
import './App.css';
// Husk at stien skal matche hvor du lagde filen. 
// Hvis den ligger i src/assets/:
import logo from './assets/logo.jpg'; 

// --- TYPES ---
// Vi definerer interfaces der matcher API'ets respons 1:1
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
  // --- STATE ---
  const [step, setStep] = useState<'SEARCH' | 'SELECT' | 'SUCCESS'>('SEARCH');
  
  // Data State
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [orderData, setOrderData] = useState<OrderResponse | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  // UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState<SuccessResponse | null>(null);

  // --- 1. SØG EFTER ORDRE ---
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

      if (!response.ok) throw new Error('Ordren blev ikke fundet (Prøv 1001 / test@test.dk)');

      const data = await response.json();
      setOrderData(data);
      setStep('SELECT'); 
    } catch (err: any) {
      setError(err.message || 'Der opstod en ukendt fejl');
    } finally {
      setLoading(false);
    }
  };

  // --- 2. HÅNDTER VALG (Checkbox Logic) ---
  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedIds);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedIds(newSelection);
  };

  // --- 3. INDSEND RETURSAG ---
  const handleSubmitReturn = async () => {
    if (selectedIds.size === 0) {
      alert("Du skal vælge mindst én vare!");
      return;
    }
    setLoading(true);

    // Mapper data til Backend Schema
    // BEMÆRK: Vi sender quantity: 1 som standard her. 
    // I en version 2.0 bør vi lade brugeren vælge antal, hvis de har købt flere af samme vare.
    const itemsToSend = orderData?.items
      .filter(i => selectedIds.has(i.id))
      .map(i => ({
        id: i.id,
        product_name: i.product_name,
        quantity: 1, 
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
      setStep('SUCCESS'); 

    } catch (err: any) {
      alert("Fejl: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- RENDER ---
  return (
    <div className="container" style={{maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif'}}>
      
      {/* HEADER MED LOGO */}
      <header style={{textAlign: 'center', padding: '2rem 0'}}>
        <img 
            src={logo} 
            alt="ReturnWiz Logo" 
            style={{ width: '120px', marginBottom: '10px' }} 
        />
        <h1 style={{margin: 0, color: '#2c3e50'}}>ReturnWiz</h1>
      </header>

      {/* TRIN 1: SØG */}
      {step === 'SEARCH' && (
        <div className="card" style={cardStyle}>
          <h2>Find din ordre</h2>
          <form onSubmit={handleSearch}>
            <div className="form-group" style={{marginBottom: '15px'}}>
              <label style={{display:'block', marginBottom:'5px'}}>Ordrenummer</label>
              <input
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="F.eks. 1001"
                required
                style={inputStyle}
              />
            </div>
            <div className="form-group" style={{marginBottom: '15px'}}>
              <label style={{display:'block', marginBottom:'5px'}}>Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email brugt ved køb"
                required
                style={inputStyle}
              />
            </div>
            <button disabled={loading} style={buttonStyle}>
                {loading ? 'Leder...' : 'Start Retur'}
            </button>
            {error && <p style={{color: 'red', marginTop: '10px'}}>{error}</p>}
          </form>
        </div>
      )}

      {/* TRIN 2: VÆLG VARER */}
      {step === 'SELECT' && orderData && (
        <div className="result-area" style={cardStyle}>
          <h2>Vælg varer til retur</h2>
          <div className="item-list">
            {orderData.items.map((item) => {
              const isSelected = selectedIds.has(item.id);
              return (
                <div 
                  key={item.id} 
                  onClick={() => toggleSelection(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '10px',
                    marginBottom: '10px',
                    borderRadius: '8px',
                    cursor: 'pointer', 
                    border: isSelected ? '2px solid #7bc144' : '1px solid #eee',
                    backgroundColor: isSelected ? '#f9fff9' : 'white'
                  }}
                >
                  {/* Visuel Checkbox */}
                  <div style={{
                    width: 24, height: 24, 
                    borderRadius: '50%', 
                    border: isSelected ? 'none' : '2px solid #ddd',
                    background: isSelected ? '#7bc144' : 'white',
                    marginRight: 15,
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    color: 'white', fontWeight: 'bold'
                  }}>
                    {isSelected && '✓'}
                  </div>
                  
                  <img src={item.image_url} alt="" style={{width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px', marginRight: '15px'}} />
                  
                  <div className="item-info">
                    <h3 style={{margin: '0 0 5px 0', fontSize: '1rem'}}>{item.product_name}</h3>
                    <span style={{color: '#666', fontSize: '0.9rem'}}>{item.variant_name}</span>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div style={{marginTop: 20, display: 'flex', gap: '10px'}}>
             <button 
                className="secondary-btn" 
                onClick={() => setStep('SEARCH')}
                style={secondaryButtonStyle}
             >
                 Annuller
             </button>
            <button 
                onClick={handleSubmitReturn} 
                disabled={loading || selectedIds.size === 0} 
                style={{...buttonStyle, opacity: selectedIds.size === 0 ? 0.6 : 1}}
            >
              {loading ? 'Opretter...' : `Returner ${selectedIds.size} varer`}
            </button>
          </div>
        </div>
      )}

      {/* TRIN 3: SUCCESS */}
      {step === 'SUCCESS' && successData && (
        <div className="card" style={{...cardStyle, textAlign: 'center'}}>
           {/* Vi kan genbruge logoet her eller en success icon */}
          <h2 style={{color: '#7bc144'}}>Tak for din retur!</h2>
          <p>Din retursag er oprettet hos {successData.tenant_used}.</p>
          
          <div style={{background: '#f4f4f4', padding: '20px', margin: '20px 0', borderRadius: '8px', border: '1px dashed #ccc'}}>
            <strong>Dit Tracking Nummer:</strong><br/>
            <span style={{fontSize: '1.4rem', fontFamily: 'monospace', color: '#333', display: 'block', marginTop: '5px'}}>
                {successData.tracking_number}
            </span>
          </div>

          <p style={{fontSize: '0.9rem', color: '#666'}}>
            Vis dette nummer i pakkeshoppen for at få printet din label.
          </p>
          
          <button onClick={() => window.location.reload()} style={buttonStyle}>Start forfra</button>
        </div>
      )}
    </div>
  );
}

// --- STYLING CONSTANTS (For at holde det clean) ---
const cardStyle: React.CSSProperties = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
};

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
    fontSize: '16px'
};

const buttonStyle: React.CSSProperties = {
    backgroundColor: '#7bc144', // Bring Green
    color: 'white',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    flex: 1
};

const secondaryButtonStyle: React.CSSProperties = {
    backgroundColor: '#eee',
    color: '#333',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer'
};

export default App;