import { useOnboardingStore } from '../../store/onboardingStore';
import clsx from 'clsx';

// Hjælpekomponent til labels for konsistens
const Label = ({ children }: { children: React.ReactNode }) => (
    <label className="block text-sm font-bold text-ui-800 mb-1.5">
        {children}
    </label>
);

// Hjælpekomponent til input styling
const inputClasses = "block w-full rounded border-ui-200 bg-white px-4 py-3 text-ui-800 placeholder-gray-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 sm:text-sm transition-colors shadow-sm";

export const StepCompany = () => {
    const { formData, updateFormData } = useOnboardingStore();

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            <div className="border-b border-ui-100 pb-4">
                <h2 className="text-lg font-semibold text-ui-800">Virksomhedsoplysninger</h2>
                <p className="mt-1 text-sm text-gray-500">Udfyld de grundlæggende oplysninger om din virksomhed for at komme i gang.</p>
            </div>

            <div className="space-y-6 max-w-2xl">
                <div>
                    <Label>Virksomhedsnavn</Label>
                    <input
                        type="text"
                        className={inputClasses}
                        placeholder="F.eks. Min Webshop ApS"
                        value={formData.companyName}
                        onChange={(e) => updateFormData({ companyName: e.target.value })}
                        autoFocus
                    />
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                        <Label>CVR Nummer</Label>
                        <input
                            type="text"
                            className={inputClasses}
                            placeholder="12345678"
                            pattern="[0-9]*"
                            value={formData.cvrNumber}
                            onChange={(e) => updateFormData({ cvrNumber: e.target.value })}
                        />
                    </div>

                    <div>
                        <Label>Webshop Handle</Label>
                        <div className="relative rounded shadow-sm">
                            <input
                                type="text"
                                className={clsx(inputClasses, "pr-32")} // plads til suffix
                                placeholder="min-shop"
                                value={formData.webshopName}
                                onChange={(e) => updateFormData({ webshopName: e.target.value })}
                            />
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 bg-ui-50 border-l border-ui-200 rounded-r text-gray-500 sm:text-sm">
                                .returnwiz.dk
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};