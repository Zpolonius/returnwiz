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
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
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
        primaryColor: '#7bc144',  // Default grøn farve
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
            shopifyUrl: '',
            bringApiUser: '',
            bringApiKey: '',
            bringCustomerId: '',
            logoFile: null,
            bannerFile: null,
            logoPreview: null,
            bannerPreview: null,
            email: '',
            primaryColor: ''
        }
    })
}));
