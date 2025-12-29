import { create } from 'zustand';

interface OnboardingState {
    step: number;
    formData: {
        // Step 1: Company
        companyName: string;
        cvrNumber: string;
        webshopName: string;
        email: string;
        password: string;

        // Step 2: Integration
        shopifyUrl: string;
        bringApiUser: string;
        bringApiKey: string;
        bringCustomerId: string;

        // Step 3: Branding
        logoFile: File | null;
        bannerFile: File | null;
        logoPreview: string | null;
        bannerPreview: string | null;
        primaryColor: string;
    };
    setStep: (step: number) => void;
    updateFormData: (data: Partial<OnboardingState['formData']>) => void;
    reset: () => void;
    // Her er definitionen (den havde du korrekt)
    registerCompany: () => Promise<void>; 
}

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
    step: 1,
    formData: {
        companyName: '',
        cvrNumber: '',
        webshopName: '',
        email: '',
        password: '',
        shopifyUrl: '',
        bringApiUser: '',
        bringApiKey: '',
        bringCustomerId: '',
        logoFile: null,
        bannerFile: null,
        logoPreview: null,
        bannerPreview: null,
        primaryColor: '#7bc144',  // Default Posten Bring grøn
    },
    setStep: (step) => set({ step }),
    
    updateFormData: (data) => set((state) => ({
        formData: { ...state.formData, ...data }
    })),

    reset: () => set({
        step: 1,
        formData: {
            companyName: '',
            cvrNumber: '',
            webshopName: '',
            email: '',
            password: '',
            shopifyUrl: '',
            bringApiUser: '',
            bringApiKey: '',
            bringCustomerId: '',
            logoFile: null,
            bannerFile: null,
            logoPreview: null,
            bannerPreview: null,
            primaryColor: '#7bc144'
        }
    }),

    // --- HER ER DEN MANGLENDE IMPLEMENTERING ---
    registerCompany: async () => {
        const { formData, setStep } = get();

        // 1. Validering: Tjek at nødvendige felter er udfyldt
        if (!formData.companyName || !formData.email || !formData.password) {
            throw new Error("Udfyld venligst virksomhedsnavn, email og password.");
        }

        // 2. Data Mapping: Forbered payload til backend
        // Vi sender KUN de felter, der er relevante for oprettelsen for at undgå 422 fejl
        const payload = {
            name: formData.companyName, // Backend forventer 'name', vi har 'companyName'
            email: formData.email,
            password: formData.password,
            // Tilføj evt. cvrNumber hvis backenden understøtter det:
            // cvr: formData.cvrNumber 
        };

        // 3. API Kald
        // HUSK: Ret URL'en til din faktiske backend endpoint
        const response = await fetch('http://localhost:8000/register', { 
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            // Vi kaster en fejl med beskeden fra backenden, så UI kan vise den
            throw new Error(errorData.detail?.[0]?.msg || "Der skete en fejl ved oprettelse af bruger.");
        }

        // 4. Success: Gå til næste step (Integration)
        console.log("Bruger oprettet! Går til step 2.");
        setStep(2);
    }
}));