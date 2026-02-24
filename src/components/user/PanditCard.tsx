import { Link } from 'react-router-dom';

interface PanditCardProps {
    id: string | number;
    name: string;
    title: string;
    experience: string;
    rating: string;
    pujaCount: string;
    image: string;
    isVerified?: boolean;
}

export function PanditCard({ id, name, title, experience, rating, pujaCount, image, isVerified = true }: PanditCardProps) {
    return (
        <Link to={`/pandits/${id}`} className="bg-white rounded-[24px] p-4 border border-slate-100 flex items-center gap-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
            <div className="relative shrink-0">
                <img src={image} alt={name} className="w-24 h-24 rounded-2xl object-cover shadow-sm" />
                {isVerified && (
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full shadow-sm flex items-center justify-center">
                        <span className="material-symbols-outlined text-blue-500 text-[20px] filled">verified</span>
                    </div>
                )}
            </div>
            <div className="flex-1 min-w-0">
                <h4 className="font-bold text-slate-900 truncate text-lg group-hover:text-primary transition-colors">{name}</h4>
                <p className="text-xs text-slate-500 truncate mb-3">{title} • {experience}</p>
                <div className="flex items-center gap-3">
                    <span className="bg-orange-50 text-orange-700 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 border border-orange-100">
                        <span className="material-symbols-outlined text-[12px] filled">star</span> {rating}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">{pujaCount}</span>
                </div>
            </div>
            <button className="p-3 rounded-full bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-secondary transition-colors border border-slate-100">
                <span className="material-symbols-outlined">chat_bubble</span>
            </button>
        </Link>
    );
}
