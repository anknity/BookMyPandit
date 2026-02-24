import { useState, useEffect } from 'react';
import { PanditProfileForm } from '@/components/pandit/PanditProfileForm';
import { AvailabilityCalendar } from '@/components/pandit/AvailabilityCalendar';
import { updatePanditProfile, updateAvailability } from '@/services/panditService';

export function PanditProfilePage() {
    const [activeTab, setActiveTab] = useState<'profile' | 'availability'>('profile');
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState('');

    const handleProfileSubmit = async (data: any) => {
        setSaving(true);
        setSuccess('');
        try {
            await updatePanditProfile(data);
            setSuccess('Profile updated successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err: any) {
            console.error('Profile update error:', err);
        } finally {
            setSaving(false);
        }
    };

    const handleAvailabilitySave = async (slots: any[]) => {
        setSaving(true);
        setSuccess('');
        try {
            await updateAvailability(slots);
            setSuccess('Availability updated successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err: any) {
            console.error('Availability update error:', err);
        } finally {
            setSaving(false);
        }
    };

    const tabs = [
        { id: 'profile' as const, label: 'Profile', icon: 'person' },
        { id: 'availability' as const, label: 'Availability', icon: 'calendar_month' },
    ];

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 font-display">Manage Profile</h2>
                <p className="text-slate-500 mt-1">Keep your profile updated to attract more devotees</p>
            </div>

            <div className="flex gap-2">
                {tabs.map((tab) => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                        className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-primary text-white shadow-md shadow-orange-200' : 'bg-white text-slate-600 border border-slate-200 hover:border-primary/50'}`}>
                        <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {success && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">check_circle</span>
                    {success}
                </div>
            )}

            <div className="bg-white rounded-2xl p-6 border border-slate-100/80 shadow-sm">
                {activeTab === 'profile' ? (
                    <PanditProfileForm onSubmit={handleProfileSubmit} />
                ) : (
                    <AvailabilityCalendar onSave={handleAvailabilitySave} />
                )}
            </div>
        </div>
    );
}
