import { MerchantLayout } from './layouts/MerchantLayout';
import { CustomerLayout } from './layouts/CustomerLayout';

// --- HELPER: DOMAIN DETECTION ---
const getSubdomain = () => {
  const hostname = window.location.hostname;
  const parts = hostname.split('.');
  if (parts.length === 1 || ['localhost', 'app', 'www', 'returnwiz'].includes(parts[0])) {
    return null;
  }
  return parts[0];
};

function App() {
  const subdomain = getSubdomain();

  // Hvis vi har et subdomæne, viser vi kundens portal.
  if (subdomain) {
    return <CustomerLayout subdomain={subdomain} />;
  }

  // Ellers viser vi Admin/Merchant portalen.
  return <MerchantLayout />;
}

export default App;