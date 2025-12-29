import { useState } from 'react';
import { StepCompany } from './StepCompany';
import { StepBranding } from './StepBranding';
import { StepIntegration } from './StepIntegration';
import { useOnboardingStore } from '../../store/onboardingStore';
import { ChevronRight, Check, AlertCircle, Loader2 } from 'lucide-react';
import clsx from 'clsx';

export function OnboardingWizard() {
  // Hent values og actions fra storen
  const { step, setStep, registerCompany, formData } = useOnboardingStore();
  
  // Lokal state til UI feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Navigations logik
  const handlePrev = () => setStep(Math.max(step - 1, 1));

  // Den nye smarte handleNext, der håndterer API kaldet på Step 1
  const handleNext = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      if (step === 1) {
        // STEP 1: Her opretter vi brugeren via storen
        // registerCompany mapper dataen korrekt og håndterer 422 fejlen
        await registerCompany(); 
        // Store funktionen sætter selv step til 2 ved success, så vi gør intet her
      } else if (step === 2) {
        // STEP 2: Gå videre til integration (lokal navigation)
        setStep(3);
      }
    } catch (err: any) {
      // Vis fejl fra backend (f.eks. "Email findes allerede")
      setError(err.message || "Der opstod en fejl.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    setError(null);
    
    try {
        // Her ville man typisk kalde et 'update' endpoint med data fra step 2 & 3
        // api.updateTenant({ ... }) 
        
        // For nu simulerer vi bare success:
        console.log("Gemmer branding og integration...", formData);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simuleret API kald
        
        setSuccess(true);
    } catch (err: any) {
        setError(err.message || "Kunne ikke afslutte opsætningen.");
    } finally {
        setIsSubmitting(false);
    }
  };

  // Success State - Vises når alt er færdigt
  if (success) {
      return (
          <div className="text-center py-12 animate-in zoom-in-95 bg-white rounded-xl shadow-sm p-8 max-w-lg mx-auto mt-10">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                  <Check size={40} />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-gray-900">Din konto er oprettet!</h2>
              <p className="text-gray-500 mb-8">Velkommen til Posten Bring universet. Du er nu klar til at sende pakker.</p>
              <button 
                onClick={() => window.location.href = '/dashboard'} 
                className="bg-[#7bc144] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#6da63e] transition-colors"
              >
                  Gå til Dashboard
              </button>
          </div>
      );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden max-w-4xl mx-auto my-8">
      
      {/* Progress Header */}
      <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
            {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                    <div className={clsx(
                        "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ring-2 ring-offset-2",
                        step >= s 
                            ? "bg-[#7bc144] text-white ring-[#7bc144]" // Active/Completed
                            : "bg-white text-gray-400 ring-gray-200"   // Inactive
                    )}>
                        {step > s ? <Check size={16} /> : s}
                    </div>
                    <span className={clsx("ml-3 text-sm font-medium hidden sm:block", step >= s ? "text-gray-900" : "text-gray-400")}>
                        {s === 1 ? 'Firma' : s === 2 ? 'Integration' : 'Branding'}
                    </span>
                    {s < 3 && <div className={clsx("w-16 h-0.5 mx-4", step > s ? "bg-[#7bc144]" : "bg-gray-200")} />}
                </div>
            ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-8 min-h-[400px]">
        {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 animate-in slide-in-from-top-2">
                <AlertCircle size={20} /> 
                <span className="text-sm font-medium">{error}</span>
            </div>
        )}

        <div className="max-w-2xl mx-auto">
            {step === 1 && <StepCompany />}
            {step === 2 && <StepIntegration />} 
            {step === 3 && <StepBranding />}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="bg-gray-50 px-8 py-4 border-t border-gray-200 flex justify-between items-center">
        <button 
            onClick={handlePrev}
            disabled={step === 1 || isSubmitting}
            className="px-4 py-2 text-gray-600 font-medium hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
            Tilbage
        </button>
        
        {step < 3 ? (
            <button 
                onClick={handleNext}
                disabled={isSubmitting}
                className={clsx(
                    "px-6 py-2.5 rounded-lg text-white font-bold flex items-center shadow-sm transition-all",
                    isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-[#7bc144] hover:bg-[#6da63e] active:scale-95"
                )}
            >
                {isSubmitting ? (
                    <><Loader2 className="animate-spin w-5 h-5 mr-2" /> Arbejder...</>
                ) : (
                    <>{step === 1 ? "Opret og fortsæt" : "Næste"} <ChevronRight size={18} className="ml-1" /></>
                )}
            </button>
        ) : (
            <button 
                onClick={handleFinish}
                disabled={isSubmitting}
                className={clsx(
                    "px-6 py-2.5 rounded-lg text-white font-bold flex items-center shadow-sm transition-all",
                    isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-[#7bc144] hover:bg-[#6da63e]"
                )}
            >
                {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : "Afslut Opsætning"}
            </button>
        )}
      </div>
    </div>
  );
}