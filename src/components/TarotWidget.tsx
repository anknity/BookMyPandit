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

const POSITION_THEME: Record<string, { icon: string; accent: string; glow: string; pattern: string }> = {
    past: {
        icon: 'history',
        accent: 'text-amber-300',
        glow: 'shadow-amber-500/30',
        pattern: 'from-slate-700 via-slate-800 to-slate-900',
    },
    present: {
        icon: 'sunny',
        accent: 'text-yellow-300',
        glow: 'shadow-yellow-500/30',
        pattern: 'from-indigo-800 via-slate-800 to-slate-900',
    },
    future: {
        icon: 'rocket_launch',
        accent: 'text-orange-300',
        glow: 'shadow-orange-500/30',
        pattern: 'from-slate-800 via-indigo-900 to-slate-900',
    },
};

function getPositionTheme(position: string) {
    const key = position.toLowerCase();
    return POSITION_THEME[key] || {
        icon: 'auto_awesome',
        accent: 'text-amber-300',
        glow: 'shadow-amber-500/30',
        pattern: 'from-slate-700 via-slate-800 to-slate-900',
    };
}

function getCardSuitTheme(cardTitle: string) {
    const title = cardTitle.toLowerCase();
    if (title.includes('swords')) {
        return { icon: 'swords', tone: 'text-amber-700', chip: 'bg-amber-100 border-amber-300', label: 'Swords' };
    }
    if (title.includes('cups')) {
        return { icon: 'local_bar', tone: 'text-yellow-700', chip: 'bg-yellow-100 border-yellow-300', label: 'Cups' };
    }
    if (title.includes('wands')) {
        return { icon: 'local_fire_department', tone: 'text-orange-700', chip: 'bg-orange-100 border-orange-300', label: 'Wands' };
    }
    if (title.includes('pentacles')) {
        return { icon: 'toll', tone: 'text-amber-700', chip: 'bg-amber-50 border-amber-300', label: 'Pentacles' };
    }
    return { icon: 'auto_awesome', tone: 'text-amber-700', chip: 'bg-amber-50 border-amber-300', label: 'Arcana' };
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
                            const theme = getPositionTheme(data.position);
                            const suitTheme = getCardSuitTheme(data.card);
                            return (
                                <div key={idx} className="flex flex-col items-center">
                                    <h4 className="text-amber-400/80 font-bold uppercase tracking-widest text-xs mb-4">{data.position}</h4>
                                    <div
                                        className="relative w-full max-w-[140px] aspect-[2/3] cursor-pointer perspective-1000 mb-6 group"
                                        onClick={() => toggleFlip(idx)}
                                    >
                                        <div className={cn("w-full h-full transition-transform duration-700 transform-style-3d", isFlipped && "rotate-y-180")}>
                                            {/* Front of Card (Face Down) */}
                                            <div className={cn("absolute w-full h-full backface-hidden border-2 border-amber-400/30 rounded-xl flex items-center justify-center p-2 shadow-lg transition-all", theme.glow, "group-hover:border-amber-300/70 group-hover:shadow-2xl")}>
                                                <div className={cn("w-full h-full border border-amber-400/20 rounded-lg bg-gradient-to-br flex items-center justify-center relative overflow-hidden", theme.pattern)}>
                                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(251,191,36,0.18),transparent_60%)]" />
                                                    <span className={cn("material-symbols-outlined text-4xl relative z-10", theme.accent)}>{theme.icon}</span>
                                                    <span className="material-symbols-outlined text-lg text-amber-200/50 absolute top-3 left-3">auto_awesome</span>
                                                    <span className="material-symbols-outlined text-base text-amber-200/40 absolute bottom-3 right-3">stars</span>
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
                                                    <div className={cn("absolute top-2 left-2 px-2 py-1 rounded-full border text-[9px] font-black tracking-wider uppercase flex items-center gap-1", suitTheme.chip, suitTheme.tone)}>
                                                        <span className="material-symbols-outlined text-[12px]">{suitTheme.icon}</span>
                                                        {suitTheme.label}
                                                    </div>
                                                    {data.image ? (
                                                        <img src={data.image} alt={data.card} className="w-16 h-16 opacity-80" />
                                                    ) : (
                                                        <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center">
                                                            <span className={cn("material-symbols-outlined text-3xl", suitTheme.tone)}>{suitTheme.icon}</span>
                                                        </div>
                                                    )}
                                                    <span className="absolute top-2 right-2 text-[9px] font-black text-amber-600/80 uppercase tracking-wider">{data.position}</span>
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
