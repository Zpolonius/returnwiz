import { useState } from 'react';
import { useOnboardingStore } from '../../store/onboardingStore';
import { StepCompany } from './StepCompany';
import { StepIntegration } from './StepIntegration';
import { StepBranding } from './StepBranding';
import { Check, ChevronRight, Loader2 } from 'lucide-react';
import clsx from 'clsx';

const STEPS = [
    { id: 1, name: 'Company' },
    { id: 2, name: 'Integration' },
    { id: 3, name: 'Branding' },
];

export const OnboardingWizard = () => {
    const { step, setStep, formData } = useOnboardingStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [complete, setComplete] = useState(false);
    const [error, setError] = useState('');

    const handleNext = () => {
        // Basic validation could go here
        setStep(step + 1);
    };

    const handleBack = () => {
        setStep(step - 1);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError('');

        try {
            // Construct payload
            // In a real app we would upload files first, get URLs, then submit JSON
            // For this demo, we'll just send the base64 previews as URLs if present, or filenames
            // Note: The backend expects 'logo_url', 'banner_url'.

            const payload = {
                name: formData.companyName,
                email: "admin@" + formData.webshopName + ".dk", // Simplified for demo
                cvr_number: formData.cvrNumber,
                webshop_name: formData.webshopName,
                shopify_url: formData.shopifyUrl,
                bring_api_user: formData.bringApiUser,
                bring_api_key: formData.bringApiKey,
                bring_customer_id: formData.bringCustomerId,
                logo_url: formData.logoPreview || "",
                banner_url: formData.bannerPreview || ""
            };

            const API_URL = 'http://127.0.0.1:8000';
            const response = await fetch(`${API_URL}/tenants/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.detail || 'Registration failed');
            }

            setComplete(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (complete) {
        return (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md mx-auto animate-in zoom-in-95">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Success!</h2>
                <p className="text-gray-500 mb-6">Your webshop has been created successfully.</p>
                <a href={`http://${formData.webshopName}.returnwiz.local:5173`} className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700 transition-colors">
                    Go to Portal
                </a>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto">
            {/* Stepper */}
            <div className="mb-8">
                <div className="flex items-center justify-between relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-gray-200 -z-10" />
                    {STEPS.map((s) => {
                        const isCompleted = step > s.id;
                        const isCurrent = step === s.id;

                        return (
                            <div key={s.id} className="flex flex-col items-center bg-white px-2">
                                <div className={clsx(
                                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors duration-200",
                                    isCompleted ? "bg-brand-600 text-white" : isCurrent ? "bg-brand-600 text-white ring-4 ring-brand-50" : "bg-gray-100 text-gray-400"
                                )}>
                                    {isCompleted ? <Check size={16} /> : s.id}
                                </div>
                                <span className={clsx(
                                    "text-xs mt-2 font-medium",
                                    isCurrent ? "text-brand-700" : "text-gray-500"
                                )}>{s.name}</span>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Content Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 md:p-8">
                    {step === 1 && <StepCompany />}
                    {step === 2 && <StepIntegration />}
                    {step === 3 && <StepBranding />}

                    {error && (
                        <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-100 flex items-center">
                            {error}
                        </div>
                    )}
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                    <button
                        onClick={handleBack}
                        disabled={step === 1 || isSubmitting}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Back
                    </button>

                    {step < 3 ? (
                        <button
                            onClick={handleNext}
                            className="inline-flex items-center px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors"
                        >
                            Next <ChevronRight size={16} className="ml-1.5" />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="inline-flex items-center px-6 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors disabled:opacity-75"
                        >
                            {isSubmitting ? <><Loader2 size={16} className="animate-spin mr-2" /> Creating...</> : 'Launch Shop'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
