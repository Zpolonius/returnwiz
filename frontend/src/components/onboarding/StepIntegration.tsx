import { useOnboardingStore } from '../../store/onboardingStore';
import { Lock, HelpCircle } from 'lucide-react';

export const StepIntegration = () => {
    const { formData, updateFormData } = useOnboardingStore();

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-xl font-semibold text-gray-900">Integration Details</h2>
            <p className="text-sm text-gray-500">Connect your Shopify store and Bring carrier account.</p>

            <div className="space-y-4">
                {/* Shopify Section */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                        Shopify Setup
                    </h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Shopify Shop URL</label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                            <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                                https://
                            </span>
                            <input
                                type="text"
                                className="block w-full flex-1 rounded-none rounded-r-md border border-gray-300 px-3 py-2 focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
                                placeholder="your-shop.myshopify.com"
                                value={formData.shopifyUrl}
                                onChange={(e) => updateFormData({ shopifyUrl: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* Bring Section */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                        Bring Integration
                        <a href="#" className="ml-2 text-gray-400 hover:text-gray-600"><HelpCircle size={14} /></a>
                    </h3>

                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">API User (Email/ID)</label>
                            <input
                                type="text"
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 sm:text-sm"
                                value={formData.bringApiUser}
                                onChange={(e) => updateFormData({ bringApiUser: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 flex items-center">
                                API Key <Lock size={12} className="ml-1 text-gray-400" />
                            </label>
                            <input
                                type="password"
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 sm:text-sm"
                                value={formData.bringApiKey}
                                onChange={(e) => updateFormData({ bringApiKey: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Customer ID</label>
                            <input
                                type="text"
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 sm:text-sm"
                                value={formData.bringCustomerId}
                                onChange={(e) => updateFormData({ bringCustomerId: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
