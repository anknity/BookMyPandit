import { Link } from 'react-router-dom';
import { useLanguageStore } from '@/store/languageStore';
import { Puja } from '@/types';
import { cn } from '@/lib/utils'; // Assuming standard cn utility is available elsewhere

interface PujaCardProps {
    puja: Puja;
}

export function PujaCard({ puja }: PujaCardProps) {
    const { language, t } = useLanguageStore();

    const displayName = language === 'hi' ? (puja.name_hi || puja.name) : puja.name;
    const displayDescription = language === 'hi' ? (puja.description_hi || puja.description) : puja.description;

    return (
        <Link
            to={`/pujas/${puja.id}`}
            className="group relative bg-[#FCFAF6] rounded-[32px] overflow-hidden border border-orange-900/5 hover:shadow-2xl hover:shadow-orange-900/10 hover:-translate-y-1 transition-all duration-300 h-full flex flex-col p-2"
        >
            {/* Image Container */}
            <div className="relative h-48 w-full rounded-[24px] overflow-hidden bg-slate-100 mb-4 group-hover:shadow-inner transition-shadow duration-500">
                {puja.image_url ? (
                    <img
                        src={puja.image_url}
                        alt={displayName}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://placehold.co/400x300/F98E2E/FFFFFF?text=Puja';
                        }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-orange-50 text-orange-200">
                        <span className="material-symbols-outlined text-6xl">temple_hindu</span>
                    </div>
                )}
                {/* Floating Rating Badge */}
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md border border-white/30 px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-sm flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px] text-[#F98E2E] filled">star</span>
                    4.9
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col px-3 pb-2 z-10">
                <h3 className="text-xl font-extrabold text-[#0B1528] mb-2 line-clamp-1 group-hover:text-[#F98E2E] transition-colors font-display tracking-tight">
                    {displayName}
                </h3>
                <p className="text-sm text-slate-500 mb-4 line-clamp-2 leading-relaxed flex-1 font-medium">
                    {displayDescription}
                </p>

                {/* Info Pills */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-2 bg-[#F1F5F9] text-slate-600 px-3 py-1.5 rounded-full text-xs font-bold w-fit">
                        <span className="material-symbols-outlined text-[16px]">schedule</span>
                        {puja.duration}
                    </div>
                    <div className="flex items-center gap-2 bg-[#F1F5F9] text-slate-600 px-3 py-1.5 rounded-full text-xs font-bold w-fit">
                        <span className="material-symbols-outlined text-[16px]">group</span>
                        {puja.pandits_required} {t('Pandit', 'पंडित')}
                    </div>
                </div>

                {/* Price & Action */}
                <div className="flex items-end justify-between mt-auto pt-4 border-t border-slate-200/60 pl-1">
                    <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">{t('Starting from', 'शुरुआती कीमत')}</p>
                        <p className="text-2xl font-black text-[#E87B1E] font-display">
                            ₹{puja.base_price.toLocaleString('en-IN')}
                        </p>
                    </div>
                    <div className="bg-[#0B1528] group-hover:bg-[#F98E2E] text-white w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-md transform group-hover:scale-105 group-hover:rotate-12">
                        <span className="material-symbols-outlined">arrow_forward</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
