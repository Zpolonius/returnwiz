import { MerchantLayout } from './layouts/MerchantLayout';
import { CustomerLayout } from './layouts/CustomerLayout';
import { useEffect, useState } from 'react';

// --- HELPER: INTELLIGENT DOMAIN DETECTION ---
const getSubdomain = (): string | null => {
  // 1. DEV-OVERRIDE: Tjekker om vi tvinger et shop-navn via URL'en
  // Dette virker både lokalt og i prod, hvis man skal debugge
  // F.eks: http://localhost:5173/?shop=min-test-butik
  const searchParams = new URLSearchParams(window.location.search);
  const shopParam = searchParams.get('shop');
  if (shopParam) {
    return shopParam;
  }

  // 2. STANDARD LOGIK: Kigger på selve domænet
  const hostname = window.location.hostname;
  const parts = hostname.split('.');

  // Ignorer disse standard domæner/keywords
  const ignoredDomains = ['localhost', 'app', 'www', 'returnwiz', '127.0.0.1'];

  // Hvis vi kun har 1 del (f.eks. "localhost") eller det er et ignored domæne
  if (parts.length === 1 || ignoredDomains.includes(parts[0])) {
    return null;
  }

  // Hvis vi er på "myshop.returnwiz.com" eller "myshop.localhost"
  return parts[0];
};

function App() {
  // Vi gemmer subdomænet i state, så vi kun beregner det én gang ved load
  const [subdomain, setSubdomain] = useState<string | null>(null);

  useEffect(() => {
    const detectedSubdomain = getSubdomain();
    setSubdomain(detectedSubdomain);
    
    // Debugging info (kun synlig i browser konsol)
    console.log(`%c Environment: ${import.meta.env.MODE} `, 'background: #222; color: #bada55');
    console.log(`%c Detected Subdomain: ${detectedSubdomain || 'None (Merchant Mode)'} `, 'background: #222; color: #bada55');
  }, []);

  // Hvis vi har fundet et subdomæne (eller en override), vis KUNDE portalen
  if (subdomain) {
    return <CustomerLayout subdomain={subdomain} />;
  }

  // Ellers vis ADMIN/MERCHANT portalen
  return <MerchantLayout />;
}

export default App;