import { useOnboardingStore } from '../../store/onboardingStore';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { useCallback } from 'react';

export const StepBranding = () => {
    const { formData, updateFormData } = useOnboardingStore();

    const handleFileChange = useCallback((type: 'logo' | 'banner', e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (type === 'logo') {
                    updateFormData({ logoFile: file, logoPreview: reader.result as string });
                } else {
                    updateFormData({ bannerFile: file, bannerPreview: reader.result as string });
                }
            };
            reader.readAsDataURL(file);
        }
    }, [updateFormData]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="border-b border-ui-100 pb-4">
                <h2 className="text-lg font-semibold text-ui-800">Branding</h2>
                <p className="mt-1 text-sm text-gray-500">Tilpas returportalen så den matcher dit brand.</p>
            </div>

            <div className="space-y-6">
                {/* Logo Upload */}
                <div className="bg-white rounded-lg border border-ui-200 p-6 flex flex-col sm:flex-row gap-6 items-start">
                     <div className="w-32 h-32 flex-shrink-0 bg-gray-50 border-2 border-dashed border-ui-200 rounded-lg flex items-center justify-center overflow-hidden">
                        {formData.logoPreview ? (
                            <img src={formData.logoPreview} alt="Logo" className="w-full h-full object-contain p-2" />
                        ) : (
                            <span className="text-xs text-gray-400 text-center px-2">Ingen Logo</span>
                        )}
                     </div>
                     <div className="flex-1">
                        <label className="block text-sm font-bold text-ui-800 mb-2">Webshop Logo</label>
                        <p className="text-sm text-gray-500 mb-4">Dette logo vises øverst i venstre hjørne på din portal.</p>
                        
                        <input
                            type="file"
                            id="logo-upload"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => handleFileChange('logo', e)}
                        />
                        <label
                            htmlFor="logo-upload"
                            className="inline-flex cursor-pointer items-center px-4 py-2 bg-white border border-ui-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-brand-500 transition-all shadow-sm"
                        >
                            <Upload size={16} className="mr-2" /> Vælg fil...
                        </label>
                     </div>
                </div>

                {/* Banner Upload */}
                <div className="bg-white rounded-lg border border-ui-200 p-6">
                    <label className="block text-sm font-bold text-ui-800 mb-4">Top Banner</label>
                    
                    <div className="relative w-full h-48 bg-gray-50 border-2 border-dashed border-ui-200 rounded-lg flex flex-col items-center justify-center group hover:border-brand-400 transition-colors overflow-hidden">
                        {formData.bannerPreview ? (
                            <>
                                <img src={formData.bannerPreview} alt="Banner" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <p className="text-white font-medium">Klik for at ændre</p>
                                </div>
                            </>
                        ) : (
                            <div className="text-center p-4">
                                <ImageIcon className="mx-auto h-10 w-10 text-gray-300 mb-2" />
                                <p className="text-sm text-gray-500">Klik eller træk et billede herind</p>
                                <p className="text-xs text-gray-400 mt-1">Anbefalet: 1200x400px</p>
                            </div>
                        )}
                        <input
                            type="file"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            accept="image/*"
                            onChange={(e) => handleFileChange('banner', e)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};