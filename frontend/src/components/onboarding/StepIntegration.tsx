import { useOnboardingStore } from '../../store/onboardingStore';
import { Lock, HelpCircle, Globe, Truck } from 'lucide-react';
import clsx from 'clsx';

// Genbrugelig input style for konsistens
const inputClasses = "block w-full rounded border-ui-200 bg-white px-4 py-3 text-ui-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 sm:text-sm transition-colors shadow-sm";

export const StepIntegration = () => {
    const { formData, updateFormData } = useOnboardingStore();

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="border-b border-ui-100 pb-4">
                <h2 className="text-lg font-semibold text-ui-800">Integrationer</h2>
                <p className="mt-1 text-sm text-gray-500">Forbind din webshop og din fragtaftale.</p>
            </div>

            <div className="space-y-6">
                {/* Shopify Section */}
                <div className="bg-white p-6 rounded-lg border border-ui-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-green-50 rounded text-green-600">
                            <Globe size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-ui-800">Shopify Setup</h3>
                            <p className="text-xs text-gray-500">Forbindelse til din salgskanal</p>
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-bold text-ui-800 mb-1.5">Shopify Shop URL</label>
                        <div className="flex rounded shadow-sm">
                            <span className="inline-flex items-center rounded-l border border-r-0 border-ui-200 bg-gray-50 px-4 text-gray-500 sm:text-sm font-medium">
                                https://
                            </span>
                            <input
                                type="text"
                                className={clsx(inputClasses, "rounded-l-none")}
                                placeholder="your-shop.myshopify.com"
                                value={formData.shopifyUrl}
                                onChange={(e) => updateFormData({ shopifyUrl: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* Bring Section */}
                <div className="bg-white p-6 rounded-lg border border-ui-200 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-brand-500"></div> {/* Bring Green Stripe */}
                    
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-50 rounded text-red-600">
                                <Truck size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-ui-800">Bring Integration</h3>
                                <p className="text-xs text-gray-500">API nøgler fra MyBring</p>
                            </div>
                        </div>
                        <a href="#" className="text-brand-600 hover:text-brand-700 text-sm font-medium flex items-center">
                            Hjælp? <HelpCircle size={14} className="ml-1.5" />
                        </a>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-ui-800 mb-1.5">API User (Email/ID)</label>
                            <input
                                type="text"
                                className={inputClasses}
                                placeholder="api@bring.com"
                                value={formData.bringApiUser}
                                onChange={(e) => updateFormData({ bringApiUser: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-bold text-ui-800 mb-1.5 flex items-center">
                                    API Key <Lock size={12} className="ml-1.5 text-gray-400" />
                                </label>
                                <input
                                    type="password"
                                    className={inputClasses}
                                    value={formData.bringApiKey}
                                    onChange={(e) => updateFormData({ bringApiKey: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-ui-800 mb-1.5">Customer ID</label>
                                <input
                                    type="text"
                                    className={inputClasses}
                                    value={formData.bringCustomerId}
                                    onChange={(e) => updateFormData({ bringCustomerId: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};