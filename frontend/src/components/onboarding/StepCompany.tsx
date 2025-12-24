import { useOnboardingStore } from '../../store/onboardingStore';

export const StepCompany = () => {
    const { formData, updateFormData } = useOnboardingStore();

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Company Details</h2>
                <p className="mt-2 text-gray-500">Let's start with the basics of your business.</p>
            </div>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name</label>
                    <input
                        type="text"
                        className="block w-full rounded-xl border-gray-200 bg-gray-50 px-5 py-3.5 text-gray-900 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 sm:text-sm transition-all shadow-sm hover:bg-white"
                        placeholder="e.g. Acme Corp"
                        value={formData.companyName}
                        onChange={(e) => updateFormData({ companyName: e.target.value })}
                        autoFocus
                    />
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">CVR Number</label>
                        <input
                            type="text"
                            className="block w-full rounded-xl border-gray-200 bg-gray-50 px-5 py-3.5 text-gray-900 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 sm:text-sm transition-all shadow-sm hover:bg-white"
                            placeholder="12345678"
                            value={formData.cvrNumber}
                            onChange={(e) => updateFormData({ cvrNumber: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Webshop Handle</label>
                        <div className="relative rounded-xl shadow-sm">
                            <input
                                type="text"
                                className="block w-full rounded-xl border-gray-200 bg-gray-50 px-5 py-3.5 text-gray-900 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 sm:text-sm transition-all shadow-sm hover:bg-white pr-24"
                                placeholder="myshop"
                                value={formData.webshopName}
                                onChange={(e) => updateFormData({ webshopName: e.target.value })}
                            />
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                                <span className="text-gray-400 font-medium sm:text-sm">.returnwiz.dk</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
