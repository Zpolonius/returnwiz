import { useOnboardingStore } from '../../store/onboardingStore';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
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
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Branding</h2>
                <p className="mt-2 text-gray-500">Personalize your return portal to match your brand.</p>
            </div>

            <div className="space-y-8">
                {/* Logo Upload */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                    <label className="block text-sm font-semibold text-gray-900 mb-4">Logo Upload</label>
                    <div className="flex items-start gap-6">
                        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center group hover:border-brand-400 transition-colors">
                            {formData.logoPreview ? (
                                <img src={formData.logoPreview} alt="Logo" className="h-full w-full object-contain p-2" />
                            ) : (
                                <ImageIcon className="text-gray-400 group-hover:text-brand-500 transition-colors" size={24} />
                            )}
                        </div>
                        <div className="flex-1 space-y-3">
                            <p className="text-sm text-gray-500">Upload your store logo. It will be displayed at the top of your return portal.</p>
                            <div>
                                <input
                                    type="file"
                                    id="logo-upload"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange('logo', e)}
                                />
                                <label
                                    htmlFor="logo-upload"
                                    className="inline-flex cursor-pointer items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all"
                                >
                                    <Upload size={16} className="mr-2 text-gray-500" /> Choose File
                                </label>
                                <span className="ml-3 text-xs text-gray-400">Recommended: 200x200px PNG</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Banner Upload */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                    <label className="block text-sm font-semibold text-gray-900 mb-4">Banner Image</label>
                    <div className="relative h-40 w-full overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center group hover:border-brand-400 transition-colors">
                        {formData.bannerPreview ? (
                            <div className="relative w-full h-full">
                                <img src={formData.bannerPreview} alt="Banner" className="h-full w-full object-cover" />
                                <div className="absolute inset-0 bg-black/10"></div>
                            </div>
                        ) : (
                            <div className="text-center">
                                <ImageIcon className="mx-auto h-10 w-10 text-gray-400 group-hover:text-brand-500 transition-colors" />
                                <p className="mt-2 text-xs text-gray-400">No banner uploaded</p>
                            </div>
                        )}
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs text-gray-400">Optimal size: 1200x400px JPG/PNG</span>
                        <div>
                            <input
                                type="file"
                                id="banner-upload"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => handleFileChange('banner', e)}
                            />
                            <label
                                htmlFor="banner-upload"
                                className="inline-flex cursor-pointer items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all"
                            >
                                <Upload size={16} className="mr-2 text-gray-500" /> Upload Banner
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
