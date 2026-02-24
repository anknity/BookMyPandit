import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useLanguageStore } from '@/store/languageStore';
import { ZODIAC_SIGNS } from './HoroscopeWidget';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface HoroscopeData {
    sign: string;
    date: string;
    horoscope_data: string;
}

export function SidebarHoroscopeSlider({ className }: { className?: string }) {
    const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://bookmypandit-backend.onrender.com/api';
    const { t, language } = useLanguageStore();
    const [horoscopes, setHoroscopes] = useState<Record<string, string>>({});
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isPaused, setIsPaused] = useState(false);

    // We fetch all horoscopes on mount. If the backend 'all' endpoint isn't ready, we could fetch them individually or build an 'all' endpoint.
    // Let's assume we implement the 'all' endpoint.
    useEffect(() => {
        const fetchAllHoroscopes = async () => {
            try {
                const langQuery = language === 'hi' ? '?lang=hi' : '';
                const response = await axios.get(`${apiBaseUrl}/astrology/horoscope/all${langQuery}`);
                if (response.data && response.data.success) {
                    setHoroscopes(response.data.data); // Assuming data is an object like { "Aries": "...", "Taurus": "..." }
                }
            } catch (error) {
                console.error("Failed to fetch all horoscopes", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllHoroscopes();
    }, [language]);

    // Auto-slide logic
    useEffect(() => {
        if (loading || Object.keys(horoscopes).length === 0 || isPaused) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % ZODIAC_SIGNS.length);
        }, 5000); // Change every 5 seconds

        return () => clearInterval(interval);
    }, [loading, horoscopes, currentIndex, isPaused]);

    const currentSign = ZODIAC_SIGNS[currentIndex];
    // Use fallback if api fails temporarily
    const currentReading = horoscopes[currentSign.name] || "Loading your daily astrological insights...";

    return (
        <div
            className={cn("glass-card rounded-[2rem] p-6 flex flex-col overflow-hidden relative group cursor-pointer min-h-[280px]", className)}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50/50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110 pointer-events-none"></div>

            <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#F98E2E]">auto_awesome</span>
                    <h3 className="font-bold text-slate-800">{t('Daily Horoscope', 'दैनिक राशिफल')}</h3>
                </div>
                <Link to="/astrology" className="text-xs text-[#F98E2E] font-medium hover:text-orange-600 transition-colors">View All</Link>
            </div>

            <div className="relative w-full flex-1 z-10 flex flex-col">
                {loading ? (
                    <div className="flex items-center justify-center flex-1 h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F98E2E]"></div>
                    </div>
                ) : (
                    <div
                        key={currentSign.name}
                        className="animate-fadeIn flex flex-col flex-1"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 shrink-0 rounded-2xl bg-orange-50 flex items-center justify-center border border-orange-100/50 text-[#8A44E9] text-2xl font-sans relative shadow-sm">
                                {currentSign.icon}
                            </div>
                            <div className="flex flex-col">
                                <h4 className="font-bold text-slate-800 leading-tight text-lg">{language === 'hi' ? currentSign.hi : currentSign.name}</h4>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{currentSign.date}</p>
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed font-medium line-clamp-4 mt-1">
                            {currentReading ? currentReading : "Unlock your daily astrological insights and discover what the stars have aligned for you today."}
                        </p>
                    </div>
                )}
            </div>

            {/* Pagination Dots */}
            {!loading && (
                <div className="flex items-center justify-center gap-2 mt-auto pt-5 relative z-10">
                    {ZODIAC_SIGNS.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={cn(
                                "h-1.5 rounded-full transition-all duration-300",
                                currentIndex === idx ? "w-5 bg-[#F98E2E] shadow-[0_0_8px_rgba(249,142,46,0.5)]" : "w-1.5 bg-slate-200 hover:bg-slate-300"
                            )}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
