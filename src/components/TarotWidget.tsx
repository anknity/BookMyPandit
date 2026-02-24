import { useState, useEffect } from 'react';
import { useLanguageStore } from '@/store/languageStore';
import { cn } from '@/lib/utils';
import api from '@/config/api';

interface TarotData {
    position: string;
    date: string;
    card: string;
    meaning: string;
    image: string;
}

export function TarotWidget({ className }: { className?: string }) {
    const { t } = useLanguageStore();
    const [cardData, setCardData] = useState<TarotData[]>([]);
    const [loading, setLoading] = useState(false);
    const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});

    const toggleFlip = (index: number) => {
        setFlippedCards(prev => ({ ...prev, [index]: true })); // Only flip open, no flip back
    };

    useEffect(() => {
        const fetchTarot = async () => {
            setLoading(true);
            try {
                const response = await api.get('/astrology/tarot/daily');
                if (response.data.success) {
                    setCardData(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch daily tarot card", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTarot();
    }, []);

    return (
        <div className={cn("glass-card rounded-2xl p-6 bg-slate-900 border border-slate-800 shadow-xl relative overflow-hidden", className)}>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-amber-400">style</span>
                        <h3 className="text-lg font-bold text-white">{t('Daily Tarot Reading', 'दैनिक टैरो रीडिंग')}</h3>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-48">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400"></div>
                    </div>
                ) : cardData.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                        {cardData.map((data, idx) => {
                            const isFlipped = !!flippedCards[idx];
                            return (
                                <div key={idx} className="flex flex-col items-center">
                                    <h4 className="text-amber-400/80 font-bold uppercase tracking-widest text-xs mb-4">{data.position}</h4>
                                    <div
                                        className="relative w-full max-w-[140px] aspect-[2/3] cursor-pointer perspective-1000 mb-6 group"
                                        onClick={() => toggleFlip(idx)}
                                    >
                                        <div className={cn("w-full h-full transition-transform duration-700 transform-style-3d", isFlipped && "rotate-y-180")}>
                                            {/* Front of Card (Face Down) */}
                                            <div className="absolute w-full h-full backface-hidden bg-slate-800 border-2 border-amber-400/30 rounded-xl flex items-center justify-center p-2 shadow-lg group-hover:shadow-amber-400/20 group-hover:border-amber-400/50 transition-all">
                                                <div className="w-full h-full border border-amber-400/20 rounded-lg bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-700 to-slate-800 flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-4xl text-amber-400/50">auto_awesome</span>
                                                </div>
                                                {!isFlipped && (
                                                    <div className="absolute -bottom-3 bg-amber-400 text-slate-900 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider animate-bounce">
                                                        Draw
                                                    </div>
                                                )}
                                            </div>

                                            {/* Back of Card (Face Up) */}
                                            <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-white border-2 border-slate-200 rounded-xl overflow-hidden shadow-lg flex flex-col">
                                                <div className="p-2 border-b border-slate-100 flex-1 flex flex-col relative items-center justify-center bg-slate-50">
                                                    <img src={data.image} alt={data.card} className="w-16 h-16 opacity-80" />
                                                </div>
                                                <div className="py-2 px-1 text-center bg-white flex items-center justify-center">
                                                    <p className="text-[10px] sm:text-xs font-black text-slate-800 uppercase tracking-tighter truncate px-1" title={data.card}>{data.card}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={cn("text-center transition-all duration-700 transform w-full px-2", isFlipped ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>
                                        <h4 className="text-lg font-bold text-amber-400 mb-1 font-display leading-tight">{data.card}</h4>
                                        <p className="text-[11px] text-slate-300 leading-relaxed font-medium line-clamp-3" title={data.meaning}>"{data.meaning}"</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : null}
            </div>
        </div>
    );
}
