import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { Store, Package, RefreshCcw, Loader2, LogOut } from 'lucide-react';
import { OnboardingWizard } from '../components/onboarding/OnboardingWizard';
import { api, type ReturnOrderListResponse } from '../services/api';
import logo from '../assets/logo.jpg';

export function MerchantLayout() {
  const [tab, setTab] = useState<'REGISTER' | 'DASHBOARD'>('DASHBOARD');
  
  // --- LOGIN STATE ---
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // --- DASHBOARD DATA STATE ---
  const [returns, setReturns] = useState<ReturnOrderListResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Hent data når vi skifter til Dashboard (hvis logget ind)
  useEffect(() => {
    if (tab === 'DASHBOARD' && isAuthenticated) {
        loadDashboardData();
    }
  }, [tab, isAuthenticated]);

  const handleLogin = async () => {
      setIsLoggingIn(true);
      setLoginError(null);
      try {
          const result = await api.login(loginEmail, loginPassword);
          console.log("Logget ind som:", result.name);
          setIsAuthenticated(true);
          setTab('DASHBOARD'); 
      } catch (err) {
          setLoginError("Forkert email eller password.");
      } finally {
          setIsLoggingIn(false);
      }
  };

  const loadDashboardData = async () => {
      setIsLoading(true);
      try {
          const data = await api.getReturns();
          setReturns(data);
      } catch (e) {
          console.error("Fejl ved hentning af retursager", e);
      } finally {
          setIsLoading(false);
      }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
      {/* Admin Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={logo} alt="Logo" className="h-12 w-auto object-contain" />
            <div className="h-8 w-px bg-gray-200 mx-2"></div>
            <span className="font-semibold text-gray-500 tracking-wide uppercase text-sm">Merchant Portal</span>
          </div>
          
          <nav className="flex gap-2 bg-gray-100 p-1 rounded-lg border border-gray-200">
            <button 
              onClick={() => setTab('DASHBOARD')}
              className={clsx(
                "px-4 py-2 text-sm font-semibold rounded-md transition-all", 
                tab === 'DASHBOARD' ? "bg-white text-brand-700 shadow-sm" : "text-gray-500 hover:text-gray-900"
              )}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setTab('REGISTER')}
              className={clsx(
                "px-4 py-2 text-sm font-semibold rounded-md transition-all", 
                tab === 'REGISTER' ? "bg-white text-brand-700 shadow-sm" : "text-gray-500 hover:text-gray-900"
              )}
            >
              Opsætning
            </button>
            {isAuthenticated && (
                <button 
                    onClick={() => setIsAuthenticated(false)}
                    className="px-3 py-2 text-gray-500 hover:text-red-600 transition-colors"
                    title="Log ud"
                >
                    <LogOut size={18} />
                </button>
            )}
          </nav>
        </div>
      </header>

      {/* Admin Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {tab === 'REGISTER' ? (
          <div className="max-w-4xl mx-auto">
               <OnboardingWizard />
          </div>
        ) : (
          
          // Hvis vi IKKE er logget ind, vis Login Box. Ellers vis Dashboard.
          !isAuthenticated ? (
            <div className="bg-white rounded-xl border border-gray-200 p-10 shadow-sm max-w-md mx-auto text-center mt-12 animate-in fade-in zoom-in-95 duration-300">
                <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-600">
                    <Store size={32} />
                </div>
                <h2 className="text-2xl font-bold mb-2">Admin Login</h2>
                <p className="text-gray-500 mb-8">Få adgang til dine retursager og indstillinger</p>
                
                {loginError && (
                    <div className="mb-4 bg-red-50 border border-red-100 text-red-600 p-3 rounded-lg text-sm font-medium">
                        {loginError}
                    </div>
                )}

                <div className="space-y-4 text-left">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                      <input 
                          type="email" 
                          className="block w-full rounded-lg border-gray-300 px-4 py-3 border focus:border-brand-500 focus:ring-brand-500 outline-none transition-shadow"
                          placeholder="shop@eksempel.dk"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
                      <input 
                          type="password" 
                          className="block w-full rounded-lg border-gray-300 px-4 py-3 border focus:border-brand-500 focus:ring-brand-500 outline-none transition-shadow"
                          placeholder="••••••••"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                      />
                    </div>
                    <button 
                        onClick={handleLogin}
                        disabled={isLoggingIn}
                        className="w-full bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-lg font-bold transition-all shadow hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoggingIn ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : 'Log Ind'}
                    </button>
                </div>
            </div>
          ) : (
            // --- HER STARTER DASHBOARDET (hvis logget ind) ---
            <div className="space-y-6 animate-in fade-in duration-500">
                
                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <p className="text-sm font-medium text-gray-500 mb-1">Aktive Retursager</p>
                        <p className="text-3xl font-bold text-gray-900">{returns.length}</p>
                    </div>
                     <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <p className="text-sm font-medium text-gray-500 mb-1">Venter på modtagelse</p>
                        <p className="text-3xl font-bold text-brand-600">{returns.filter(r => r.status === 'CREATED').length}</p>
                    </div>
                </div>

                {/* Main Table */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                        <h2 className="text-lg font-bold text-gray-900">Seneste Retursager</h2>
                        <button onClick={loadDashboardData} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                            {isLoading ? <Loader2 className="animate-spin w-5 h-5 text-gray-500"/> : <RefreshCcw className="w-5 h-5 text-gray-500" />}
                        </button>
                    </div>
                    
                    {returns.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p>Ingen retursager fundet endnu.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-gray-600">
                                <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500">
                                    <tr>
                                        <th className="px-6 py-3">Ordre #</th>
                                        <th className="px-6 py-3">Kunde</th>
                                        <th className="px-6 py-3">Varer</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3">Tracking</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {returns.map((ret) => (
                                        <tr key={ret.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-900">#{ret.shopify_order_number}</td>
                                            <td className="px-6 py-4">{ret.customer_email}</td>
                                            <td className="px-6 py-4">
                                                {ret.items.map((item, idx) => (
                                                    <div key={idx} className="text-xs">
                                                        <span className="font-bold">{item.quantity}x</span> {item.product_name}
                                                    </div>
                                                ))}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                    {ret.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-mono text-xs">{ret.tracking_number}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
          )
        )}
      </main>
    </div>
  );
}