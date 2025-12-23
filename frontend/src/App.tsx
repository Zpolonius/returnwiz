import { useState } from 'react';
import './App.css';

// 1. Definition af datatyper (Skal matche Backenden)
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
  // 2. State (Hukommelse til input felter)
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [orderData, setOrderData] = useState<OrderResponse | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 3. Funktionen der kalder Backend API'et
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault(); // Stop siden fra at genindlæse
    setLoading(true);
    setError('');
    setOrderData(null);

    try {
      const response = await fetch('http://localhost:8000/returns/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_number: orderNumber, email: email }),
      });

      if (!response.ok) {
        throw new Error('Kunne ikke finde ordren. Tjek nummer og email.');
      }

      const data = await response.json();
      setOrderData(data); // Gem resultatet så vi kan vise det

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 4. HTML (JSX) Layout
  return (
    <div className="container">
      <header>
        <h1>ReturnWiz 📦</h1>
        <p>Returner dine varer nemt og hurtigt</p>
      </header>

      {/* SØGE FORMULAR */}
      {!orderData && (
        <div className="card">
          <form onSubmit={handleSearch}>
            <div className="form-group">
              <label>Ordrenummer</label>
              <input
                type="text"
                placeholder="F.eks. 1001"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="din@email.dk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? 'Søger...' : 'Find Ordre'}
            </button>
            
            {error && <p className="error-msg">{error}</p>}
          </form>
        </div>
      )}

      {/* RESULTAT LISTE (Vises kun hvis vi har fundet en ordre) */}
      {orderData && (
        <div className="result-area">
          <h2>Hej, her er din ordre #{orderData.order_number}</h2>
          <p>Vælg de varer du vil returnere:</p>
          
          <div className="item-list">
            {orderData.items.map((item) => (
              <div key={item.id} className="item-card">
                <img src={item.image_url} alt={item.product_name} width="50" />
                <div className="item-info">
                  <h3>{item.product_name}</h3>
                  <span>{item.variant_name}</span>
                </div>
                <div className="item-price">
                  {(item.price / 100).toFixed(2)} DKK
                </div>
              </div>
            ))}
          </div>

          <button className="secondary-btn" onClick={() => setOrderData(null)}>
            ← Gå tilbage
          </button>
        </div>
      )}
    </div>
  );
}

export default App;