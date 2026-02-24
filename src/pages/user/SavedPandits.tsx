import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '@/config/api';
import { toast } from 'react-hot-toast';

interface SavedPandit {
    id: string;
    name: string;
    avatar_url?: string;
    experience_years: number;
    rating: number;
    total_pujas: number;
}

export function SavedPandits() {
    const [pandits, setPandits] = useState<SavedPandit[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchSavedPandits();
    }, []);

    const fetchSavedPandits = async () => {
        try {
            const { data } = await api.get('/user/saved-pandits');
            setPandits(data.pandits || []);
        } catch (error) {
            console.error('Failed to fetch saved pandits:', error);
            toast.error('Failed to load saved pandits');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemove = async (panditId: string) => {
        try {
            const { data } = await api.post('/user/saved-pandits/toggle', { pandit_id: panditId });
            if (!data.saved) {
                setPandits(prev => prev.filter(p => p.id !== panditId));
                toast.success('Removed from saved list');
            }
        } catch (error) {
            console.error('Failed to remove pandit:', error);
            toast.error('Could not remove pandit');
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 pb-20">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 font-display">Saved Pandits</h2>
                <p className="text-slate-500 mt-1">Pandits you have saved for quick access</p>
            </div>

            {isLoading ? (
                <div className="text-center py-16 text-slate-500">Loading your saved pandits...</div>
            ) : pandits.length === 0 ? (
                <div className="text-center py-16">
                    <span className="material-symbols-outlined text-5xl text-slate-300 mb-3 block">favorite_border</span>
                    <p className="text-slate-500 font-medium">No saved pandits found</p>
                    <Link to="/pandits" className="text-primary hover:underline mt-2 inline-block">Browse Pandits</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {pandits.map(pandit => (
                        <div key={pandit.id} className="group glass-panel rounded-xl p-5 hover:bg-white/80 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 flex flex-col h-full relative overflow-hidden bg-white border border-slate-100">
                            <button
                                onClick={(e) => { e.preventDefault(); handleRemove(pandit.id); }}
                                className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                            >
                                <span className="material-symbols-outlined text-lg filled">favorite</span>
                            </button>

                            <div className="flex items-start justify-between mb-4">
                                <div className="size-16 rounded-full p-0.5 shadow-sm border border-slate-200">
                                    <img src={pandit.avatar_url || `https://ui-avatars.com/api/?name=${pandit.name}&background=random`} alt={pandit.name} className="w-full h-full rounded-full object-cover" />
                                </div>
                            </div>

                            <div className="mb-4">
                                <h3 className="text-lg font-bold text-[#0d101b] leading-tight group-hover:text-primary transition-colors">{pandit.name}</h3>
                                <div className="flex items-center gap-3 mt-2">
                                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-md border border-yellow-100">
                                        <span className="text-xs font-bold text-yellow-700">{pandit.rating || 'New'}</span>
                                        <span className="material-symbols-outlined text-[12px] text-yellow-500 fill-current">star</span>
                                    </div>
                                    <span className="text-xs text-slate-500 font-medium">{pandit.experience_years || 0} Yrs Exp</span>
                                    <span className="text-xs text-slate-500 font-medium">{pandit.total_pujas || 0} Pujas</span>
                                </div>
                            </div>

                            <div className="mt-auto pt-4 border-t border-slate-100">
                                <Link to={`/pandits/${pandit.id}`} className="w-full h-10 rounded-lg border border-primary/30 text-primary font-bold text-sm hover:bg-primary/5 transition-colors flex items-center justify-center">
                                    View Profile
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
