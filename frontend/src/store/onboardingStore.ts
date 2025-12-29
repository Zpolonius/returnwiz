import { create } from 'zustand';
import { api } from '../services/api'; // Sørg for at stien passer til din mappestruktur

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
        primaryColor: '#7bc144',
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

    // --- HER ER DEN RETTEDE IMPLEMENTERING ---
    registerCompany: async () => {
        const { formData, setStep } = get();

        // 1. Validering
        if (!formData.companyName || !formData.email || !formData.password) {
            throw new Error("Udfyld venligst virksomhedsnavn, email og password.");
        }

        // 2. Data Mapping (Kritisk step!)
        // Vi oversætter fra Store (camelCase) til API/Backend (snake_case)
        const payload = {
            name: formData.companyName,         // API: 'name'
            email: formData.email,              // API: 'email'
            password: formData.password,        // API: 'password'
            cvr_number: formData.cvrNumber,     // API: 'cvr_number' (vigtig rettelse)
            webshop_name: formData.webshopName, // API: 'webshop_name'
            // Du kan tilføje shopify_url her, hvis du vil gemme den allerede i step 1,
            // ellers gemmes den først ved fuld submit i step 3.
        };

        try {
            // 3. Kald API'et via din service
            await api.registerTenant(payload);
            
            console.log("Tenant oprettet! Går til step 2.");
            setStep(2);
        } catch (error: any) {
            console.error("Fejl i registerCompany:", error);
            // Hvis det er en 404 her, betyder det at din backend IKKE kører på /tenants/register
            throw new Error(error.message || "Kunne ikke oprette bruger");
        }
    }
}));