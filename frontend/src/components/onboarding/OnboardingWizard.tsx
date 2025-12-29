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

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError('');
        try {
            // ... (din eksisterende logik her) ...
            // Mocking success for UI demo
             await new Promise(resolve => setTimeout(resolve, 1500));
            setComplete(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (complete) {
        return (
            <div className="min-h-[600px] flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-card p-12 text-center max-w-lg w-full border border-ui-200">
                    <div className="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check className="w-10 h-10 text-brand-700" />
                    </div>
                    <h2 className="text-3xl font-bold text-ui-800 mb-4">All Set!</h2>
                    <p className="text-gray-600 mb-8 text-lg">
                        Your webshop <span className="font-semibold text-ui-800">{formData.companyName}</span> has been created.
                    </p>
                    <a href="#" className="block w-full py-3 px-6 text-base font-medium rounded text-white bg-brand-500 hover:bg-brand-600 transition-colors shadow-sm">
                        Go to My Portal
                    </a>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-12">
            {/* Bring Style Progress Header */}
            <div className="mb-10">
                <nav aria-label="Progress">
                    <ol role="list" className="flex items-center justify-center w-full">
                        {STEPS.map((s, stepIdx) => {
                            const isCompleted = step > s.id;
                            const isCurrent = step === s.id;
                            return (
                                <li key={s.name} className={clsx("relative flex-1 flex flex-col items-center")}>
                                    {stepIdx !== STEPS.length - 1 && (
                                        <div className="absolute top-4 left-[50%] right-[-50%] h-[2px] bg-ui-200" aria-hidden="true">
                                            <div className={clsx("h-full transition-all duration-300 ease-out bg-brand-500", isCompleted ? "w-full" : "w-0")} />
                                        </div>
                                    )}
                                    <div className="group relative flex flex-col items-center z-10">
                                        <span className={clsx(
                                            "flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 border-2 font-bold text-sm",
                                            isCompleted ? "bg-brand-500 border-brand-500 text-white" : 
                                            isCurrent ? "bg-white border-brand-500 text-brand-700 ring-4 ring-brand-50" : 
                                            "bg-white border-ui-200 text-gray-400"
                                        )}>
                                            {isCompleted ? <Check className="h-5 w-5" /> : s.id}
                                        </span>
                                        <span className={clsx(
                                            "mt-2 text-xs font-semibold uppercase tracking-wider transition-colors duration-200 text-center",
                                            isCurrent ? "text-brand-700" : "text-gray-400"
                                        )}>{s.name}</span>
                                    </div>
                                </li>
                            )
                        })}
                    </ol>
                </nav>
            </div>

            {/* Main Card - Clean Enterprise Look */}
            <div className="bg-white rounded-lg shadow-card border border-ui-200 flex flex-col min-h-[500px]">
                {/* Header Section */}
                <div className="px-8 py-6 border-b border-ui-100 bg-ui-50 rounded-t-lg">
                    <h1 className="text-xl font-bold text-ui-800">
                        {STEPS[step-1].name}
                    </h1>
                </div>

                <div className="flex-1 p-8 md:p-10">
                    {step === 1 && <StepCompany />}
                    {step === 2 && <StepIntegration />}
                    {step === 3 && <StepBranding />}

                    {error && (
                        <div className="mt-6 p-4 bg-red-50 text-red-800 text-sm rounded border border-red-100 flex items-center">
                            <span className="mr-2 font-bold">Fejl:</span> {error}
                        </div>
                    )}
                </div>

                {/* Footer / Actions */}
                <div className="px-8 py-6 bg-white border-t border-ui-100 flex justify-between items-center rounded-b-lg">
                    <button
                        onClick={handleBack}
                        disabled={step === 1 || isSubmitting}
                        className="px-6 py-2.5 text-sm font-medium text-gray-600 hover:text-ui-800 hover:bg-ui-50 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        Tilbage
                    </button>

                    {step < 3 ? (
                        <button
                            onClick={handleNext}
                            className="inline-flex items-center px-6 py-2.5 bg-brand-500 text-white text-sm font-bold rounded shadow-sm hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors"
                        >
                            Fortsæt <ChevronRight size={16} className="ml-2" />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="inline-flex items-center px-8 py-2.5 bg-brand-500 text-white text-sm font-bold rounded shadow-sm hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors disabled:opacity-70"
                        >
                            {isSubmitting ? <><Loader2 size={16} className="animate-spin mr-2" /> Behandler...</> : 'Opret Webshop'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};