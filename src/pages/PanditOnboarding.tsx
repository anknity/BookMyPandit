import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '@/config/api';
import { useAuthStore } from '@/store/authStore';
import { DocumentUpload } from '@/components/common/DocumentUpload';

const SPECIALIZATIONS = [
    'Vedic Pujas', 'Havan', 'Marriage', 'Funeral Services', 'Astrology', 'Vastu', 'Kathas', 'Festivals'
];

const LANGUAGES = [
    'Hindi', 'English', 'Sanskrit', 'Marathi', 'Gujarati', 'Tamil', 'Telugu', 'Kannada', 'Bengali'
];

export function PanditOnboarding() {
    const navigate = useNavigate();
    const { user, setUser } = useAuthStore();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        bio: '',
        experience_years: '',
        specializations: [] as string[],
        languages: [] as string[],
        city: '',
        state: '',
        documents_url: [] as string[]
    });

    const handletextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const toggleSelection = (field: 'specializations' | 'languages', value: string) => {
        setFormData(prev => {
            const current = prev[field];
            if (current.includes(value)) {
                return { ...prev, [field]: current.filter(item => item !== value) };
            } else {
                return { ...prev, [field]: [...current, value] };
            }
        });
    };

    const handleDocumentUpload = (url: string) => {
        setFormData(prev => ({ ...prev, documents_url: [...prev.documents_url, url] }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.city || !formData.state || !formData.bio || !formData.experience_years) {
            toast.error('Please fill in all required fields');
            return;
        }
        if (formData.documents_url.length === 0) {
            toast.error('Please upload at least one ID proof');
            return;
        }

        try {
            setLoading(true);
            const payload = {
                ...formData,
                experience_years: parseInt(formData.experience_years),
                lat: 28.6139, // Defaulting to Delhi for now, or could add Geocoding later
                lng: 77.2090
            };

            await api.post('/pandits/profile', payload);

            toast.success('Application submitted successfully! Please wait for admin approval.');
            // Role update happens on approval, so user is still 'user' but application is 'pending'
            navigate('/profile');
        } catch (error: any) {
            console.error('Onboarding failed:', error);
            toast.error(error.response?.data?.error || 'Failed to submit application');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        navigate('/login');
        return null;
    }

    return (
        <div className="max-w-3xl mx-auto px-6 py-12 pt-24 pb-32">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Become a Pandit</h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    Join our divine community of over 500+ verified Pandits. Share your knowledge and perform services for devotees across the country.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-slate-100 space-y-8">

                {/* Personal Bio */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">person</span>
                        Professional Bio
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-slate-700 mb-2">About You <span className="text-red-500">*</span></label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handletextChange}
                                rows={4}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                placeholder="Describe your background, lineage, and experience..."
                            ></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Years of Experience <span className="text-red-500">*</span></label>
                            <input
                                type="number"
                                name="experience_years"
                                value={formData.experience_years}
                                onChange={handletextChange}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                placeholder="e.g. 10"
                                min="0"
                            />
                        </div>
                    </div>
                </div>

                <div className="h-px bg-slate-100"></div>

                {/* Expertise */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">school</span>
                        Expertise & Languages
                    </h3>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-3">Specializations</label>
                        <div className="flex flex-wrap gap-3">
                            {SPECIALIZATIONS.map(spec => (
                                <button
                                    key={spec}
                                    type="button"
                                    onClick={() => toggleSelection('specializations', spec)}
                                    className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${formData.specializations.includes(spec)
                                        ? 'bg-primary text-white border-primary shadow-md shadow-orange-200'
                                        : 'bg-white text-slate-600 border-slate-200 hover:border-primary/50'
                                        }`}
                                >
                                    {spec}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-3">Languages Spoken</label>
                        <div className="flex flex-wrap gap-3">
                            {LANGUAGES.map(lang => (
                                <button
                                    key={lang}
                                    type="button"
                                    onClick={() => toggleSelection('languages', lang)}
                                    className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${formData.languages.includes(lang)
                                        ? 'bg-primary text-white border-primary shadow-md shadow-orange-200'
                                        : 'bg-white text-slate-600 border-slate-200 hover:border-primary/50'
                                        }`}
                                >
                                    {lang}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="h-px bg-slate-100"></div>

                {/* Location */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">location_on</span>
                        Location
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">City <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handletextChange}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                placeholder="e.g. Varanasi"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">State <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handletextChange}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                placeholder="e.g. Uttar Pradesh"
                            />
                        </div>
                    </div>
                </div>

                <div className="h-px bg-slate-100"></div>

                {/* Documents */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">verified_user</span>
                        Verification Documents
                    </h3>
                    <p className="text-sm text-slate-500">Please upload a valid ID Proof (Aadhar/PAN) and any Vedic Certificates.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <DocumentUpload
                            label="ID Proof (Front)"
                            onUpload={handleDocumentUpload}
                        />
                        <DocumentUpload
                            label="Vedic Certificate (Optional)"
                            onUpload={handleDocumentUpload}
                        />
                    </div>
                    {formData.documents_url.length > 0 && (
                        <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm flex items-center gap-2">
                            <span className="material-symbols-outlined text-base">check_circle</span>
                            {formData.documents_url.length} documents uploaded
                        </div>
                    )}
                </div>

                {/* Submit */}
                <div className="pt-6">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-primary to-orange-600 text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-orange-200 hover:shadow-orange-300 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Submitting Application...' : 'Submit Application'}
                    </button>
                    <p className="text-center text-xs text-slate-400 mt-4">
                        By submitting, you agree to our Terms & Conditions and Code of Conduct.
                    </p>
                </div>

            </form>
        </div>
    );
}
