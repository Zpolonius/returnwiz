import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { Store, Package, RefreshCcw, Loader2 } from 'lucide-react'; // Husk at installere lucide-react ikoner hvis de mangler
import { OnboardingWizard } from '../components/onboarding/OnboardingWizard';
import { api, type ReturnOrderListResponse } from '../services/api';
import logo from '../assets/logo.jpg';

export function MerchantLayout() {
  const [tab, setTab] = useState<'REGISTER' | 'DASHBOARD'>('DASHBOARD');
  const [loginEmail, setLoginEmail] = useState('');
  
  // Data State
  const [returns, setReturns] = useState<ReturnOrderListResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Hent data når vi skifter til Dashboard
  useEffect(() => {
    if (tab === 'DASHBOARD') {
        loadDashboardData();
    }
  }, [tab]);

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
        )}
      </main>
    </div>
  );
}