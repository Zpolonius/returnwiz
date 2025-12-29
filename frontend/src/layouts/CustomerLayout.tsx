import { useState } from 'react';
import { Package, ArrowRight, CheckCircle2, Search, ShoppingBag, Loader2, AlertCircle } from 'lucide-react';
import logo from '../assets/logo.jpg';

import { api } from '../services/api';
import type { OrderResponse, ReturnItemRequest, LineItem } from '../services/api';

interface CustomerLayoutProps {
  subdomain: string;
}

export function CustomerLayout({ subdomain }: CustomerLayoutProps) {
  const [step, setStep] = useState<'SEARCH' | 'SELECT' | 'SUCCESS'>('SEARCH');
  
  // Form State
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  
  // Data State
  const [orderData, setOrderData] = useState<OrderResponse | null>(null);
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({});
  const [returnResult, setReturnResult] = useState<{tracking: string, email: string} | null>(null);

  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- HANDLERS ---

  const handleSearch = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.searchOrder(orderNumber, email);
      setOrderData(data);
      setStep('SELECT');
    } catch (err) {
      setError("Vi kunne ikke finde din ordre. Tjek venligst ordrenummer (f.eks. 1001) og email.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateReturn = async () => {
    if (!orderData) return;
    
    setIsLoading(true);
    
    // Forbered data til backend
    // Vi mapper de valgte items til det format backend forventer
    const itemsToReturn: ReturnItemRequest[] = orderData.items
        .filter((item: LineItem) => selectedItems[item.id])
        .map((item: LineItem) => ({
            id: item.id,
            product_name: item.product_name,
            quantity: 1, // Simpel logik: returnerer altid 1 stk for nu
            reason: "NOT_SPECIFIED" // Vi kunne tilføje en dropdown med årsager senere
        }));

    if (itemsToReturn.length === 0) {
        setError("Du skal vælge mindst én vare at returnere.");
        setIsLoading(false);
        return;
    }

    try {
        const result = await api.createReturn({
            order_number: orderData.order_number,
            email: orderData.customer_email,
            items: itemsToReturn
        });
        
        setReturnResult({
            tracking: result.tracking_number,
            email: orderData.customer_email
        });
        setStep('SUCCESS');
    } catch (err) {
        setError("Der skete en fejl ved oprettelsen. Prøv igen senere.");
    } finally {
        setIsLoading(false);
    }
  };

  const toggleItemSelection = (id: string) => {
    setSelectedItems(prev => ({
        ...prev,
        [id]: !prev[id]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="mb-8 text-center">
        <img src={logo} alt="Shop Logo" className="h-16 w-auto mx-auto object-contain mb-4 rounded-lg shadow-sm bg-white p-2" />
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{subdomain} Returportal</h1>
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
            {/* Fejlbesked Boks */}
            {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3 text-sm">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p>{error}</p>
                </div>
            )}

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
                                className="block w-full rounded-lg border-gray-300 px-4 py-3 text-gray-900 focus:border-brand-500 focus:ring-brand-500 shadow-sm outline-none border"
                                placeholder="#1001"
                                value={orderNumber}
                                onChange={(e) => setOrderNumber(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">Email adresse</label>
                            <input 
                                type="email"
                                className="block w-full rounded-lg border-gray-300 px-4 py-3 text-gray-900 focus:border-brand-500 focus:ring-brand-500 shadow-sm outline-none border"
                                placeholder="din@email.dk"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <button 
                        onClick={handleSearch}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center px-8 py-3.5 border border-transparent text-base font-bold rounded-lg text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-md mt-6"
                    >
                        {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                            <>Find Ordre <ArrowRight className="ml-2 -mr-1 h-5 w-5" /></>
                        )}
                    </button>
                </div>
            )}

            {step === 'SELECT' && orderData && (
                <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                    <div className="flex items-center mb-6">
                        <button onClick={() => setStep('SEARCH')} className="text-sm text-gray-500 hover:text-gray-900 font-medium">← Tilbage</button>
                        <h2 className="text-xl font-bold text-gray-900 ml-auto">Vælg Varer</h2>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                        {orderData.items.map((item: LineItem) => (
                            <div 
                                key={item.id}
                                onClick={() => toggleItemSelection(item.id)}
                                className={`border rounded-xl p-4 flex gap-4 cursor-pointer transition-colors ${selectedItems[item.id] ? 'border-brand-500 bg-brand-50' : 'border-gray-200 bg-gray-50 hover:border-brand-300'}`}
                            >
                                <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center text-gray-400 border border-gray-100 overflow-hidden">
                                   {item.image_url ? <img src={item.image_url} className="w-full h-full object-cover"/> : <ShoppingBag size={24} />}
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-gray-900 text-sm">{item.product_name}</p>
                                    <p className="text-xs text-gray-500">{item.variant_name}</p>
                                    <p className="text-sm font-medium text-gray-900 mt-1">{(item.price / 100).toFixed(2)} DKK</p>
                                </div>
                                <div className="flex items-center">
                                    <input 
                                        type="checkbox" 
                                        checked={!!selectedItems[item.id]}
                                        readOnly
                                        className="w-5 h-5 text-brand-600 rounded border-gray-300 focus:ring-brand-500 accent-brand-600" 
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <button 
                         onClick={handleCreateReturn}
                         disabled={isLoading}
                         className="w-full mt-2 bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 rounded-lg shadow-md flex justify-center items-center"
                    >
                        {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Returnér Valgte"}
                    </button>
                </div>
            )}
            
            {step === 'SUCCESS' && returnResult && (
                <div className="text-center py-6 animate-in zoom-in-95 duration-500">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Tak for din retur!</h2>
                    <p className="text-gray-600 mb-6 text-sm">Vi har sendt en returlabel til <b>{returnResult.email}</b>.</p>
                    
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-8">
                        <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Tracking Nummer</p>
                        <p className="font-mono text-lg font-bold text-gray-900 tracking-wider">{returnResult.tracking}</p>
                    </div>

                    <button onClick={() => window.location.reload()} className="text-brand-600 font-bold hover:underline text-sm">
                        Start ny retur
                    </button>
                </div>
            )}
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
                <Package size={12} /> Powered by & ReturnWiz
            </p>
        </div>
      </div>
    </div>
  );
}