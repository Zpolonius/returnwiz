import { useState } from 'react';
import clsx from 'clsx';
import { Store } from 'lucide-react';
import { OnboardingWizard } from '../components/onboarding/OnboardingWizard';
import logo from '../assets/logo.jpg';

export function MerchantLayout() {
  const [tab, setTab] = useState<'REGISTER' | 'DASHBOARD'>('DASHBOARD');
  const [loginEmail, setLoginEmail] = useState('');

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