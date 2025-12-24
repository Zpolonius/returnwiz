import { useState } from 'react';
import { useOnboardingStore } from '../../store/onboardingStore';
import { StepCompany } from './StepCompany';
import { StepIntegration } from './StepIntegration';
import { StepBranding } from './StepBranding';
import { Check, ChevronRight, Loader2 } from 'lucide-react';
import clsx from 'clsx';

const STEPS = [
    { id: 1, name: 'Company Details' },
    { id: 2, name: 'Integration' },
    { id: 3, name: 'Branding' },
];

export const OnboardingWizard = () => {
    const { step, setStep, formData } = useOnboardingStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [complete, setComplete] = useState(false);
    const [error, setError] = useState('');

    const handleNext = () => {
        setStep(step + 1);
    };

    const handleBack = () => {
        setStep(step - 1);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError('');

        try {
            const payload = {
                name: formData.companyName,
                email: "admin@" + formData.webshopName + ".dk",
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
            <div className="min-h-[600px] flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-lg w-full animate-in zoom-in-95 border border-gray-100">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">All Set! 🎉</h2>
                    <p className="text-gray-500 mb-8 text-lg">Your webshop <span className="font-semibold text-gray-900">{formData.companyName}</span> has been created successfully.</p>
                    <a href={`http://${formData.webshopName}.returnwiz.local:5173`} className="block w-full py-4 px-6 border border-transparent text-lg font-medium rounded-xl text-white bg-brand-600 hover:bg-brand-700 transition-all shadow-lg hover:shadow-brand-500/30">
                        Go to My Portal
                    </a>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-8">
            {/* Progress Header */}
            <div className="mb-12">
                <nav aria-label="Progress">
                    <ol role="list" className="flex items-center justify-center w-full">
                        {STEPS.map((s, stepIdx) => {
                            const isCompleted = step > s.id;
                            const isCurrent = step === s.id;

                            return (
                                <li key={s.name} className={clsx("relative flex-1 flex flex-col items-center", stepIdx !== STEPS.length - 1 ? "" : "")}>
                                    {stepIdx !== STEPS.length - 1 && (
                                        <div className="absolute top-5 left-[55%] right-[-45%] h-0.5 bg-gray-200" aria-hidden="true">
                                            <div className={clsx("h-full transition-all duration-500 ease-in-out bg-brand-600", isCompleted ? "w-full" : "w-0")} />
                                        </div>
                                    )}
                                    <div className="group relative flex flex-col items-center">
                                        <span className={clsx(
                                            "flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 z-10 border-2",
                                            isCompleted ? "bg-brand-600 border-brand-600" : isCurrent ? "bg-white border-brand-600 ring-4 ring-brand-50" : "bg-white border-gray-300"
                                        )}>
                                            {isCompleted ? (
                                                <Check className="h-6 w-6 text-white" aria-hidden="true" />
                                            ) : (
                                                <span className={clsx("text-sm font-semibold", isCurrent ? "text-brand-600" : "text-gray-500")}>{s.id}</span>
                                            )}
                                        </span>
                                        <span className={clsx(
                                            "mt-3 text-xs font-semibold uppercase tracking-wider transition-colors duration-200 text-center",
                                            isCurrent ? "text-brand-600" : "text-gray-400"
                                        )}>{s.name}</span>
                                    </div>
                                </li>
                            )
                        })}
                    </ol>
                </nav>
            </div>

            {/* Content Card with Glass/Modern effect */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden relative min-h-[500px] flex flex-col">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-400 to-brand-600"></div>

                <div className="flex-1 p-8 md:p-12">
                    {step === 1 && <StepCompany />}
                    {step === 2 && <StepIntegration />}
                    {step === 3 && <StepBranding />}

                    {error && (
                        <div className="mt-8 p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100 flex items-center animate-in shake">
                            <span className="mr-2">⚠️</span> {error}
                        </div>
                    )}
                </div>

                <div className="px-8 py-6 bg-gray-50/80 backdrop-blur-sm border-t border-gray-100 flex justify-between items-center">
                    <button
                        onClick={handleBack}
                        disabled={step === 1 || isSubmitting}
                        className="px-6 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Back
                    </button>

                    {step < 3 ? (
                        <button
                            onClick={handleNext}
                            className="group inline-flex items-center px-6 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-brand-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all transform hover:-translate-y-0.5"
                        >
                            Continue <ChevronRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="inline-flex items-center px-8 py-2.5 bg-gradient-to-r from-brand-600 to-brand-700 text-white text-sm font-semibold rounded-lg shadow-lg hover:shadow-brand-500/30 hover:from-brand-500 hover:to-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all transform hover:-translate-y-0.5 disabled:opacity-75 disabled:cursor-wait"
                        >
                            {isSubmitting ? <><Loader2 size={16} className="animate-spin mr-2" /> Setting up...</> : 'Launch My Shop 🚀'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
