import { useState } from 'react';
import { OnboardingWizard } from './components/onboarding/OnboardingWizard';
import { Store, Package, ArrowRight, CheckCircle2, Search, ShoppingBag } from 'lucide-react';
import clsx from 'clsx';
// Sørg for at stien passer til dit logo
import logo from './assets/logo.jpg'; 

// --- TYPES (Beholdt fra din kode) ---
interface DashboardOrder { id: string; shopify_order_number: string; customer_email: string; tracking_number: string; status: string; items: any[]; }

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
  // Hvis der er et subdomæne, er vi kunde. Ellers er vi Admin (Merchant).
  const [view] = useState<'CUSTOMER' | 'MERCHANT'>(subdomain ? 'CUSTOMER' : 'MERCHANT');
  const [merchantTab, setMerchantTab] = useState<'REGISTER' | 'DASHBOARD'>('DASHBOARD');
  
  // State placeholders
  const [loginEmail, setLoginEmail] = useState('');
  const [dashboardData] = useState<DashboardOrder[]>([]); 
  
  // Customer State
  const [customerStep, setCustomerStep] = useState<'SEARCH' | 'SELECT' | 'SUCCESS'>('SEARCH');
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');

  // ---------------------------------------------------------------------------
  // VIEW: MERCHANT (ADMIN DASHBOARD)
  // ---------------------------------------------------------------------------
  if (view === 'MERCHANT') {
    return (
      <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
        {/* Admin Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Logo Vist Her */}
              <img src={logo} alt="Logo" className="h-12 w-auto object-contain logo-img" />
              <div className="h-8 w-px bg-gray-200 mx-2"></div>
              <span className="font-semibold text-gray-500 tracking-wide uppercase text-sm">Merchant Portal</span>
            </div>
            
            <nav className="flex gap-2 bg-gray-100 p-1 rounded-lg border border-gray-200">
              <button 
                onClick={() => setMerchantTab('DASHBOARD')}
                className={clsx(
                  "px-4 py-2 text-sm font-semibold rounded-md transition-all", 
                  merchantTab === 'DASHBOARD' ? "bg-white text-brand-700 shadow-sm" : "text-gray-500 hover:text-gray-900"
                )}
              >
                Dashboard
              </button>
              <button 
                onClick={() => setMerchantTab('REGISTER')}
                className={clsx(
                  "px-4 py-2 text-sm font-semibold rounded-md transition-all", 
                  merchantTab === 'REGISTER' ? "bg-white text-brand-700 shadow-sm" : "text-gray-500 hover:text-gray-900"
                )}
              >
                Opsætning
              </button>
            </nav>
          </div>
        </header>

        {/* Admin Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {merchantTab === 'REGISTER' ? (
            <div className="max-w-4xl mx-auto">
               <OnboardingWizard />
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in duration-500">
              {/* Login Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-10 shadow-sm max-w-md mx-auto text-center mt-12">
                  <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-600">
                      <Store size={32} />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Admin Login</h2>
                  <p className="text-gray-500 mb-8">Få adgang til dine retursager og indstillinger</p>
                  
                  <div className="space-y-4 text-left">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                        <input 
                            type="email" 
                            className="block w-full rounded-lg border-gray-300 px-4 py-3 focus:border-brand-500 focus:ring-brand-500 transition-shadow"
                            placeholder="admin@webshop.dk"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                        />
                      </div>
                      <button className="w-full bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-lg font-bold transition-all shadow hover:shadow-lg transform hover:-translate-y-0.5">
                          Log Ind
                      </button>
                  </div>
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // VIEW: CUSTOMER (MOBILE FRIENDLY RETURN PORTAL)
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Customer Brand Header */}
      <div className="mb-8 text-center">
        <img src={logo} alt="Shop Logo" className="h-16 w-auto mx-auto object-contain mb-4 rounded-lg shadow-sm bg-white p-2" />
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{subdomain} Returportal</h1>
        <p className="mt-2 text-gray-600">Vi hjælper dig med at returnere dine varer</p>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Progress Bar (Visual only for now) */}
        <div className="h-1.5 w-full bg-gray-100">
            <div 
                className="h-full bg-brand-500 transition-all duration-500" 
                style={{ width: customerStep === 'SEARCH' ? '33%' : customerStep === 'SELECT' ? '66%' : '100%' }}
            ></div>
        </div>

        <div className="p-8">
            {customerStep === 'SEARCH' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-50 text-brand-600 mb-4">
                            <Search size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Find din ordre</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">Ordrenummer</label>
                            <input 
                                className="block w-full rounded-lg border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:ring-brand-500 shadow-sm"
                                placeholder="#1001"
                                value={orderNumber}
                                onChange={(e) => setOrderNumber(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">Email adresse</label>
                            <input 
                                type="email"
                                className="block w-full rounded-lg border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:ring-brand-500 shadow-sm"
                                placeholder="din@email.dk"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <button 
                        onClick={() => setCustomerStep('SELECT')}
                        className="w-full flex items-center justify-center px-8 py-3.5 border border-transparent text-base font-bold rounded-lg text-white bg-brand-600 hover:bg-brand-700 md:text-lg transition-all shadow-md hover:shadow-lg mt-6"
                    >
                        Find Ordre <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
                    </button>
                </div>
            )}

            {customerStep === 'SELECT' && (
                <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                    <div className="flex items-center mb-6">
                        <button onClick={() => setCustomerStep('SEARCH')} className="text-sm text-gray-500 hover:text-gray-900 font-medium">← Tilbage</button>
                        <h2 className="text-xl font-bold text-gray-900 ml-auto">Vælg Varer</h2>
                    </div>
                    
                    <div className="border rounded-xl p-4 mb-4 flex gap-4 bg-gray-50 border-gray-200">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                            <ShoppingBag size={24} />
                        </div>
                        <div>
                            <p className="font-bold text-gray-900">Cool T-Shirt</p>
                            <p className="text-sm text-gray-500">Size: L • Black</p>
                            <p className="text-sm font-medium text-gray-900 mt-1">299,00 DKK</p>
                        </div>
                        <input type="checkbox" className="ml-auto w-6 h-6 text-brand-600 rounded border-gray-300 focus:ring-brand-500" />
                    </div>

                    <button 
                         onClick={() => setCustomerStep('SUCCESS')}
                         className="w-full mt-6 bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 rounded-lg shadow-md"
                    >
                        Returnér Valgte
                    </button>
                </div>
            )}
            
            {customerStep === 'SUCCESS' && (
                <div className="text-center py-6 animate-in zoom-in-95 duration-500">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Tak for din retur!</h2>
                    <p className="text-gray-600 mb-6">Vi har sendt en returlabel til din email.</p>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-8">
                        <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Tracking Nummer</p>
                        <p className="font-mono text-lg font-bold text-gray-900">XX 123 456 789 DK</p>
                    </div>
                    <button onClick={() => window.location.reload()} className="text-brand-600 font-bold hover:underline">
                        Start ny retur
                    </button>
                </div>
            )}
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
                <Package size={12} /> Powered by  & ReturnWiz
            </p>
        </div>
      </div>
    </div>
  );
}

export default App;