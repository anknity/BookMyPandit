import { useState } from 'react';
import axios from 'axios';
import { useLanguageStore } from '@/store/languageStore';
import { cn } from '@/lib/utils';

interface NumerologyData {
    lifePathNumber: number;
    meaning: string;
    name: string;
}

export function NumerologyWidget({ className }: { className?: string }) {
    const { t } = useLanguageStore();
    const [name, setName] = useState('');
    const [dob, setDob] = useState('');
    const [data, setData] = useState<NumerologyData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleCalculate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!name || !dob) {
            setError(t('Please enter both name and date of birth.', 'कृपया नाम और जन्म तिथि दोनों दर्ज करें।'));
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/astrology/numerology`, { name, dob });
            if (response.data.success) {
                setData(response.data.data);
            }
        } catch (err: any) {
            setError(t('Failed to calculate numerology. Try again later.', 'अंक ज्योतिष की गणना करने में विफल। बाद में पुनः प्रयास करें।'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={cn("glass-card rounded-2xl p-6 bg-white border border-slate-100 shadow-sm", className)}>
            <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-purple-500">calculate</span>
                <h3 className="text-lg font-bold text-slate-800">{t('Numerology Calculator', 'अंक ज्योतिष कैलकुलेटर')}</h3>
            </div>

            {!data ? (
                <form onSubmit={handleCalculate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">{t('Full Name', 'पूरा नाम')}</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your full name"
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">{t('Date of Birth', 'जन्म तिथि')}</label>
                        <input
                            type="date"
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        />
                    </div>
                    {error && <p className="text-red-500 text-xs font-medium">{error}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-2.5 rounded-xl transition-all shadow-md shadow-purple-500/30 flex justify-center items-center"
                    >
                        {loading ? (
                            <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                        ) : (
                            t('Calculate Number', 'नंबर चुनें')
                        )}
                    </button>
                </form>
            ) : (
                <div className="animate-fadeIn text-center space-y-4">
                    <p className="text-sm text-slate-500 font-medium">For {data.name}</p>
                    <div className="inline-flex flex-col items-center justify-center p-6 bg-purple-50 rounded-full border border-purple-100">
                        <span className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-1">Life Path</span>
                        <span className="text-5xl font-black text-purple-700 font-display">{data.lifePathNumber}</span>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-left">
                        <p className="text-slate-700 text-sm leading-relaxed">{data.meaning}</p>
                    </div>
                    <button
                        onClick={() => setData(null)}
                        className="text-sm text-purple-600 hover:text-purple-700 font-bold hover:underline"
                    >
                        {t('Recalculate', 'पुनर्गणना करें')}
                    </button>
                </div>
            )}
        </div>
    );
}
