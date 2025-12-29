import React, { useState } from 'react';
import { useOnboardingStore } from '../../store/onboardingStore';
import clsx from 'clsx';

// Hjælpekomponent til labels
const Label = ({ children }: { children: React.ReactNode }) => (
    <label className="block text-sm font-bold text-ui-800 mb-1.5">
        {children}
    </label>
);

// Hjælpekomponent til input styling
const inputClasses = "block w-full rounded border-ui-200 bg-white px-4 py-3 text-ui-800 placeholder-gray-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 sm:text-sm transition-colors shadow-sm";

export const StepCompany = () => {
    // Vi henter state, updater og setStep funktion fra storen
    const { formData, updateFormData, setStep } = useOnboardingStore();
    
    // Lokal state til at håndtere loading status (god UX)
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        updateFormData({ [name]: value });
        // Nulstil fejlbesked når brugeren skriver
        if (error) setError(null);
    };

    const handleNext = async () => {
        // 1. Simpel validering før vi kalder API
        if (!formData.companyName || !formData.email || !formData.password) {
            setError("Udfyld venligst alle obligatoriske felter.");
            return;
        }

        setIsLoading(true);
        setError(null);

        // 2. DATA MAPPING (Her løser vi 422 fejlen)
        // Vi oversætter fra vores store format til backendens forventede format
        const payload = {
            name: formData.companyName, // Backend: 'name' <-> Frontend: 'companyName'
            email: formData.email,
            password: formData.password,
            // Vi sender IKKE tomme felter fra step 2/3 her
        };

        try {
            // HUSK AT RETTE URL'en til dit faktiske endpoint
            // F.eks. 'http://localhost:8000/api/register' eller lignende
            const response = await fetch('DIN_BACKEND_URL/register', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Kritisk header
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Backend Error:", errorData);
                throw new Error(errorData.detail?.[0]?.msg || "Kunne ikke oprette bruger");
            }

            // 3. Success! Gå til næste step
            console.log("Bruger oprettet succesfuldt");
            setStep(2);

        } catch (err: any) {
            setError(err.message || "Der skete en teknisk fejl.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            <div className="border-b border-ui-100 pb-4">
                <h2 className="text-lg font-semibold text-ui-800">Virksomhedsoplysninger</h2>
                <p className="mt-1 text-sm text-gray-500">Udfyld de grundlæggende oplysninger om din virksomhed for at komme i gang.</p>
            </div>

            {/* Vis fejlbesked hvis den findes */}
            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
                    {error}
                </div>
            )}

            <div className="space-y-6 max-w-2xl">
                
                {/* Virksomhedsnavn */}
                <div>
                    <Label>Virksomhedsnavn</Label>
                    <input
                        type="text"
                        name="companyName"
                        className={inputClasses}
                        placeholder="F.eks. Min Webshop ApS"
                        value={formData.companyName}
                        onChange={handleChange}
                        autoFocus
                    />
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {/* CVR Nummer */}
                    <div>
                        <Label>CVR Nummer</Label>
                        <input
                            type="text"
                            name="cvrNumber"
                            className={inputClasses}
                            placeholder="12345678"
                            pattern="[0-9]*"
                            value={formData.cvrNumber}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Webshop Handle */}
                    <div>
                        <Label>Webshop Handle</Label>
                        <div className="relative rounded shadow-sm">
                            <input
                                type="text"
                                name="webshopName"
                                className={clsx(inputClasses, "pr-32")}
                                placeholder="min-shop"
                                value={formData.webshopName}
                                onChange={handleChange}
                            />
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 bg-ui-50 border-l border-ui-200 rounded-r text-gray-500 sm:text-sm">
                                .returnwiz.dk
                            </div>
                        </div>
                    </div>
                </div>

                {/* Email og Password */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                        <Label>Email (Login)</Label>
                        <input 
                            type="email"
                            name="email"
                            className={inputClasses}
                            placeholder="kontakt@shop.dk"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <Label>Vælg Password</Label>
                        <input 
                            type="password"
                            name="password"
                            className={inputClasses}
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                </div>

               

            </div>
        </div>
    );
};