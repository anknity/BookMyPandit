import { Link } from 'react-router-dom';
import { destinations } from '@/data/destinations';
import { cn } from '@/lib/utils';

export function SacredDestinations() {
    return (
        <section className="mb-12 relative">
            <div className="flex items-end justify-between mb-6 px-2">
                <div>
                    <h3 className="text-2xl font-bold text-slate-900 font-display">Sacred Destinations</h3>
                    <p className="text-slate-500 text-sm mt-1">Experience divinity at India's holiest temples</p>
                </div>
                <button className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-orange-50 text-primary font-bold text-sm tracking-wide hover:bg-orange-100 transition-colors">
                    Explore Map <span className="material-symbols-outlined text-[18px]">map</span>
                </button>
            </div>

            <div className="flex gap-6 overflow-x-auto pb-6 px-2 scrollbar-hide snap-x">
                {destinations.map((dest) => (
                    <div key={dest.id} className="min-w-[320px] max-w-[320px] bg-white rounded-[2rem] p-2 border border-slate-100 shadow-sm flex flex-col snap-start shrink-0 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        {/* Image Section */}
                        <div className="relative w-full h-[280px] rounded-[1.75rem] overflow-hidden mb-4">
                            <img
                                src={dest.imageUrl}
                                alt={dest.name}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                            {/* Badge */}
                            {dest.badgeText && (
                                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-sm">
                                        {dest.badgeText.includes('ft') ? 'landscape' : dest.badgeText.includes('Visited') ? 'groups' : 'water_drop'}
                                    </span>
                                    {dest.badgeText}
                                </div>
                            )}

                            {/* Title & Location */}
                            <div className="absolute bottom-4 left-4 right-4">
                                <h4 className="text-2xl font-bold text-white font-display mb-1">{dest.name}</h4>
                                <p className="text-white/80 text-sm flex items-center gap-1 font-medium">
                                    <span className="material-symbols-outlined text-sm">location_on</span>
                                    {dest.location}
                                </p>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4 px-1">
                            {dest.tags.map((tag, idx) => {
                                const colors = {
                                    blue: 'bg-blue-50 text-blue-600',
                                    orange: 'bg-orange-50 text-orange-600',
                                    purple: 'bg-purple-50 text-purple-600',
                                    yellow: 'bg-yellow-50 text-yellow-600',
                                };
                                return (
                                    <span key={idx} className={cn("text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider", colors[tag.color])}>
                                        {tag.label}
                                    </span>
                                );
                            })}
                        </div>

                        {/* Description */}
                        <p className="text-slate-500 text-sm leading-relaxed mb-6 px-1 line-clamp-3">
                            {dest.description}
                        </p>

                        {/* Action Button */}
                        <div className="mt-auto">
                            <Link
                                to={`/destinations/${dest.id}`}
                                className="w-full bg-[#2A3441] hover:bg-[#1E2530] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
                            >
                                Read Details
                                <span className="material-symbols-outlined text-[18px]">menu_book</span>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
