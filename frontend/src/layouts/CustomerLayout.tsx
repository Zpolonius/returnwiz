import { useState } from 'react';
import { Package, ArrowRight, CheckCircle2, Search, ShoppingBag } from 'lucide-react';
import logo from '../assets/logo.jpg';

interface CustomerLayoutProps {
  subdomain: string;
}

export function CustomerLayout({ subdomain }: CustomerLayoutProps) {
  const [step, setStep] = useState<'SEARCH' | 'SELECT' | 'SUCCESS'>('SEARCH');
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');

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
        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-gray-100">
            <div 
                className="h-full bg-brand-500 transition-all duration-500" 
                style={{ width: step === 'SEARCH' ? '33%' : step === 'SELECT' ? '66%' : '100%' }}
            ></div>
        </div>

        <div className="p-8">
            {step === 'SEARCH' && (
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
                        onClick={() => setStep('SELECT')}
                        className="w-full flex items-center justify-center px-8 py-3.5 border border-transparent text-base font-bold rounded-lg text-white bg-brand-600 hover:bg-brand-700 md:text-lg transition-all shadow-md hover:shadow-lg mt-6"
                    >
                        Find Ordre <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
                    </button>
                </div>
            )}

            {step === 'SELECT' && (
                <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                    <div className="flex items-center mb-6">
                        <button onClick={() => setStep('SEARCH')} className="text-sm text-gray-500 hover:text-gray-900 font-medium">← Tilbage</button>
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
                         onClick={() => setStep('SUCCESS')}
                         className="w-full mt-6 bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 rounded-lg shadow-md"
                    >
                        Returnér Valgte
                    </button>
                </div>
            )}
            
            {step === 'SUCCESS' && (
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
                <Package size={12} /> Powered by Posten Bring & ReturnWiz
            </p>
        </div>
      </div>
    </div>
  );
}