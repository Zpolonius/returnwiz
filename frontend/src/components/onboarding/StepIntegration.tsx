import { useOnboardingStore } from '../../store/onboardingStore';
import { Lock, HelpCircle } from 'lucide-react';

export const StepIntegration = () => {
    const { formData, updateFormData } = useOnboardingStore();

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Integrations</h2>
                <p className="mt-2 text-gray-500">Connect your Shopify store and Bring carrier account.</p>
            </div>

            <div className="space-y-6">
                {/* Shopify Section */}
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                    <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center">
                        <span className="w-2 h-6 bg-green-500 rounded-full mr-3"></span>
                        Shopify Setup
                    </h3>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Shopify Shop URL</label>
                        <div className="mt-1 flex rounded-xl shadow-sm">
                            <span className="inline-flex items-center rounded-l-xl border border-r-0 border-gray-200 bg-white px-4 text-gray-500 sm:text-sm font-medium">
                                https://
                            </span>
                            <input
                                type="text"
                                className="block w-full flex-1 rounded-none rounded-r-xl border border-gray-200 px-4 py-3.5 focus:border-brand-500 focus:ring-brand-500 sm:text-sm transition-all focus:ring-4 focus:ring-brand-500/10"
                                placeholder="your-shop.myshopify.com"
                                value={formData.shopifyUrl}
                                onChange={(e) => updateFormData({ shopifyUrl: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* Bring Section */}
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                    <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center justify-between">
                        <div className="flex items-center">
                            <span className="w-2 h-6 bg-red-500 rounded-full mr-3"></span>
                            Bring Integration
                        </div>
                        <a href="#" className="text-brand-600 hover:text-brand-700 text-sm font-medium flex items-center">
                            Need help? <HelpCircle size={14} className="ml-1.5" />
                        </a>
                    </h3>

                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">API User (Email/ID)</label>
                            <input
                                type="text"
                                className="block w-full rounded-xl border-gray-200 bg-white px-5 py-3.5 text-gray-900 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 sm:text-sm transition-all shadow-sm"
                                value={formData.bringApiUser}
                                onChange={(e) => updateFormData({ bringApiUser: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                    API Key <Lock size={12} className="ml-1.5 text-gray-400" />
                                </label>
                                <input
                                    type="password"
                                    className="block w-full rounded-xl border-gray-200 bg-white px-5 py-3.5 text-gray-900 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 sm:text-sm transition-all shadow-sm"
                                    value={formData.bringApiKey}
                                    onChange={(e) => updateFormData({ bringApiKey: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Customer ID</label>
                                <input
                                    type="text"
                                    className="block w-full rounded-xl border-gray-200 bg-white px-5 py-3.5 text-gray-900 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 sm:text-sm transition-all shadow-sm"
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
