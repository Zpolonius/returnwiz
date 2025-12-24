import { useOnboardingStore } from '../../store/onboardingStore';
import { Upload, X } from 'lucide-react';
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
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-xl font-semibold text-gray-900">Branding</h2>
            <p className="text-sm text-gray-500">Customize your return portal look.</p>

            <div className="space-y-6">
                {/* Logo Upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
                    <div className="flex items-center gap-4">
                        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-gray-300 bg-gray-50 flex items-center justify-center">
                            {formData.logoPreview ? (
                                <img src={formData.logoPreview} alt="Logo" className="h-full w-full object-contain" />
                            ) : (
                                <span className="text-xs text-gray-400">No Logo</span>
                            )}
                        </div>
                        <div className="flex-1">
                            <input
                                type="file"
                                id="logo-upload"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => handleFileChange('logo', e)}
                            />
                            <label
                                htmlFor="logo-upload"
                                className="inline-flex cursor-pointer items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                            >
                                <Upload size={16} className="mr-2" /> Upload Logo
                            </label>
                            <p className="mt-1 text-xs text-gray-500">PNG, JPG up to 2MB</p>
                        </div>
                    </div>
                </div>

                {/* Banner Upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Banner Image</label>
                    <div className="relative h-32 w-full overflow-hidden rounded-lg border border-gray-300 bg-gray-50 flex items-center justify-center">
                        {formData.bannerPreview ? (
                            <img src={formData.bannerPreview} alt="Banner" className="h-full w-full object-cover" />
                        ) : (
                            <span className="text-xs text-gray-400">No Banner</span>
                        )}
                    </div>
                    <div className="mt-2">
                        <input
                            type="file"
                            id="banner-upload"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => handleFileChange('banner', e)}
                        />
                        <label
                            htmlFor="banner-upload"
                            className="inline-flex cursor-pointer items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                        >
                            <Upload size={16} className="mr-2" /> Upload Banner
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};
