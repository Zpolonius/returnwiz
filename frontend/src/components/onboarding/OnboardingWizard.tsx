import { useState } from 'react';
import { StepCompany } from './StepCompany';
import { StepBranding } from './StepBranding';
import { StepIntegration } from './StepIntegration';
import { useOnboardingStore } from '../../store/onboardingStore';
import { api } from '../../services/api'; // Import API
import { ChevronRight, Check, AlertCircle, Loader2 } from 'lucide-react';
import clsx from 'clsx';

export function OnboardingWizard() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const store = useOnboardingStore();

  const handleNext = () => setStep(s => Math.min(s + 1, 3));
  const handlePrev = () => setStep(s => Math.max(s - 1, 1));

  const handleFinish = async () => {
    setIsSubmitting(true);
    setError(null);
    
    try {
        await api.registerTenant({
            name: store.companyName,
            email: store.email,
            password: store.password, // Send password med
            cvr_number: store.cvr,
            shopify_url: store.shopifyUrl,
            logo_url: store.logoUrl,
            // ... map resten af felterne fra store
        });
        setSuccess(true);
    } catch (err: any) {
        setError(err.message || "Der skete en fejl ved oprettelsen.");
    } finally {
        setIsSubmitting(false);
    }
  };

  if (success) {
      return (
          <div className="text-center py-12 animate-in zoom-in-95">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                  <Check size={40} />
              </div>
              <h2 className="text-2xl font-bold mb-2">Din konto er oprettet!</h2>
              <p className="text-gray-500 mb-8">Du kan nu logge ind og se dit dashboard.</p>
              <button 
                onClick={() => window.location.reload()} // Simpel måde at komme til login
                className="bg-brand-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-brand-700"
              >
                  Gå til Login
              </button>
          </div>
      );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Progress Header */}
      <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
            {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                    <div className={clsx(
                        "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors",
                        step >= s ? "bg-brand-600 text-white" : "bg-gray-200 text-gray-500"
                    )}>
                        {s}
                    </div>
                    <span className={clsx("ml-2 text-sm font-medium", step >= s ? "text-gray-900" : "text-gray-400")}>
                        {s === 1 ? 'Firma' : s === 2 ? 'Design' : 'Integration'}
                    </span>
                    {s < 3 && <div className="w-12 h-px bg-gray-300 mx-4" />}
                </div>
            ))}
        </div>
      </div>

      <div className="p-8 min-h-[400px]">
        {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                <AlertCircle size={20} /> {error}
            </div>
        )}

        {step === 1 && <StepCompany />}
        {step === 2 && <StepBranding />}
        {step === 3 && <StepIntegration />}
      </div>

      <div className="bg-gray-50 px-8 py-4 border-t border-gray-200 flex justify-between">
        <button 
            onClick={handlePrev}
            disabled={step === 1}
            className="px-4 py-2 text-gray-600 font-medium hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            Tilbage
        </button>
        
        {step < 3 ? (
            <button 
                onClick={handleNext}
                className="px-6 py-2 bg-brand-600 text-white rounded-lg font-bold hover:bg-brand-700 flex items-center shadow-sm"
            >
                Næste <ChevronRight size={16} className="ml-1" />
            </button>
        ) : (
            <button 
                onClick={handleFinish}
                disabled={isSubmitting}
                className="px-6 py-2 bg-brand-600 text-white rounded-lg font-bold hover:bg-brand-700 shadow-sm flex items-center"
            >
                {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : "Afslut Opsætning"}
            </button>
        )}
      </div>
    </div>
  );
}