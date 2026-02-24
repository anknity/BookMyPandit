import React, { useState } from 'react';

interface PanditProfileFormProps {
    initialData?: any;
    onSubmit: (data: any) => void;
    isLoading?: boolean;
}

export function PanditProfileForm({ initialData, onSubmit, isLoading }: PanditProfileFormProps) {
    const [formData, setFormData] = useState({
        bio: initialData?.bio || '',
        experience_years: initialData?.experience_years || 0,
        specializations: initialData?.specializations?.join(', ') || '',
        languages: initialData?.languages?.join(', ') || '',
        city: initialData?.city || '',
        state: initialData?.state || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            specializations: formData.specializations.split(',').map(s => s.trim()).filter(Boolean),
            languages: formData.languages.split(',').map(s => s.trim()).filter(Boolean),
        });
    };

    const inputClass = "w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/80 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition-colors";

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Bio / About You</label>
                <textarea rows={4} className={inputClass} placeholder="Tell devotees about your experience and expertise..."
                    value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Years of Experience</label>
                    <input type="number" className={inputClass} min={0} value={formData.experience_years}
                        onChange={(e) => setFormData({ ...formData, experience_years: Number(e.target.value) })} />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">City</label>
                    <input type="text" className={inputClass} placeholder="e.g. Varanasi" value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Specializations (comma-separated)</label>
                    <input type="text" className={inputClass} placeholder="Vedic Astrology, Karma Kand, ..." value={formData.specializations}
                        onChange={(e) => setFormData({ ...formData, specializations: e.target.value })} />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Languages (comma-separated)</label>
                    <input type="text" className={inputClass} placeholder="Hindi, Sanskrit, English" value={formData.languages}
                        onChange={(e) => setFormData({ ...formData, languages: e.target.value })} />
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">State</label>
                <input type="text" className={inputClass} placeholder="e.g. Uttar Pradesh" value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })} />
            </div>

            <button type="submit" disabled={isLoading}
                className="bg-primary hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-orange-200 disabled:opacity-50 flex items-center gap-2">
                {isLoading && <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
                {initialData ? 'Update Profile' : 'Create Profile'}
            </button>
        </form>
    );
}
