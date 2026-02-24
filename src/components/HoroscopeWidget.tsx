import { useState, useEffect } from 'react';
import axios from 'axios';
import { cn } from '@/lib/utils';
import { useLanguageStore } from '@/store/languageStore';

interface HoroscopeData {
    date: string;
    horoscope_data: string;
}

type Period = 'daily' | 'weekly' | 'monthly';

export const ZODIAC_SIGNS = [
    { name: 'Aries', hi: 'मेष', icon: '♈', date: 'Mar 21 - Apr 19' },
    { name: 'Taurus', hi: 'वृषभ', icon: '♉', date: 'Apr 20 - May 20' },
    { name: 'Gemini', hi: 'मिथुन', icon: '♊', date: 'May 21 - Jun 20' },
    { name: 'Cancer', hi: 'कर्क', icon: '♋', date: 'Jun 21 - Jul 22' },
    { name: 'Leo', hi: 'सिंह', icon: '♌', date: 'Jul 23 - Aug 22' },
    { name: 'Virgo', hi: 'कन्या', icon: '♍', date: 'Aug 23 - Sep 22' },
    { name: 'Libra', hi: 'तुला', icon: '♎', date: 'Sep 23 - Oct 22' },
    { name: 'Scorpio', hi: 'वृश्चिक', icon: '♏', date: 'Oct 23 - Nov 21' },
    { name: 'Sagittarius', hi: 'धनु', icon: '♐', date: 'Nov 22 - Dec 21' },
    { name: 'Capricorn', hi: 'मकर', icon: '♑', date: 'Dec 22 - Jan 19' },
    { name: 'Aquarius', hi: 'कुंभ', icon: '♒', date: 'Jan 20 - Feb 18' },
    { name: 'Pisces', hi: 'मीन', icon: '♓', date: 'Feb 19 - Mar 20' },
];

export interface ZodiacSign {
    name: string;
    hi: string;
    icon: string;
    date: string;
}

export function HoroscopeWidget({ className, selectedSign }: { className?: string, selectedSign: ZodiacSign }) {
    const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://bookmypandit-backend.onrender.com/api';
    const { t, language } = useLanguageStore();
    const [selectedPeriod, setSelectedPeriod] = useState<Period>('daily');
    const [horoscope, setHoroscope] = useState<HoroscopeData | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchHoroscope = async (sign: string, period: Period) => {
        setLoading(true);
        // Minimum loading time for smooth transition
        const startTime = Date.now();

        try {
            const langQuery = language === 'hi' ? '?lang=hi' : '';
            const response = await axios.get(`${apiBaseUrl}/astrology/horoscope/${period}/${sign.toLowerCase()}${langQuery}`);
            if (response.data) {
                setHoroscope(response.data);
            } else {
                setHoroscope(null);
            }
        } catch (error) {
            console.error("Failed to fetch horoscope", error);
            setHoroscope(null);
        } finally {
            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(0, 500 - elapsedTime);
            setTimeout(() => {
                setLoading(false);
            }, remainingTime);
        }
    };

    useEffect(() => {
        fetchHoroscope(selectedSign.name, selectedPeriod);
    }, [selectedSign, selectedPeriod, language]); // Added language to dependency array

    return (
        <div className={cn("bg-white border border-slate-100 rounded-[2rem] p-8 md:p-10 shadow-sm relative overflow-hidden", className)}>
            {/* Header matches reference */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="text-[#F98E2E] bg-orange-50 p-2 rounded-xl">
                        <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                    </div>
                    <h3 className="text-xl font-bold text-[#0B1528] font-display">{t('Horoscope', 'राशिफल')}</h3>
                </div>

                <div className="flex bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                    {(['daily', 'weekly', 'monthly'] as Period[]).map((p) => (
                        <button
                            key={p}
                            onClick={() => setSelectedPeriod(p)}
                            className={cn(
                                "px-5 py-2 rounded-lg text-xs font-bold capitalize transition-all",
                                selectedPeriod === p
                                    ? "bg-white text-[#F98E2E] shadow-sm ring-1 ring-slate-100"
                                    : "text-slate-500 hover:text-slate-800"
                            )}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            <div className="min-h-[200px] relative z-10">
                {loading ? (
                    <div className="flex items-center justify-center h-48">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#F98E2E]"></div>
                    </div>
                ) : horoscope ? (
                    <div className="animate-fadeIn">
                        <div className="flex items-end justify-between mb-4">
                            <h4 className="font-extrabold text-2xl text-[#0B1528] font-display">{language === 'hi' ? selectedSign.hi : selectedSign.name}</h4>
                            <span className="text-[10px] text-[#64748B] font-bold uppercase tracking-wider">{horoscope.date}</span>
                        </div>
                        <p className="text-[#475569] leading-loose text-sm md:text-base font-medium">
                            {horoscope.horoscope_data}
                        </p>
                    </div>
                ) : (
                    <div className="text-center text-slate-400 py-12 font-medium">
                        {t('Select a sign below to view horoscope', 'राशिफल देखने के लिए नीचे एक राशि चुनें')}
                    </div>
                )}
            </div>

            {/* Subtle background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50 z-0 pointer-events-none"></div>
        </div>
    );
}
