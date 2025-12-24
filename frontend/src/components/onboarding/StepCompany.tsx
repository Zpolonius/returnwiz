import { useOnboardingStore } from '../../store/onboardingStore';

export const StepCompany = () => {
    const { formData, updateFormData } = useOnboardingStore();

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-xl font-semibold text-gray-900">Company Details</h2>
            <p className="text-sm text-gray-500">Tell us about your business.</p>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Company Name</label>
                    <input
                        type="text"
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 sm:text-sm"
                        placeholder="Acme Corp"
                        value={formData.companyName}
                        onChange={(e) => updateFormData({ companyName: e.target.value })}
                        autoFocus
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">CVR Number</label>
                    <input
                        type="text"
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 sm:text-sm"
                        placeholder="12345678"
                        value={formData.cvrNumber}
                        onChange={(e) => updateFormData({ cvrNumber: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Webshop Name</label>
                    <p className="text-xs text-gray-400">This will be used for your portal URL: [name].returnwiz.dk</p>
                    <input
                        type="text"
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 sm:text-sm"
                        placeholder="myshop"
                        value={formData.webshopName}
                        onChange={(e) => updateFormData({ webshopName: e.target.value })}
                    />
                </div>
            </div>
        </div>
    );
};
