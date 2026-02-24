import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '@/config/api';
import { PujaCard } from '@/components/user/PujaCard';

interface SearchResult {
    pujas: any[];
    pandits: any[];
}

export function SearchResults() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [results, setResults] = useState<SearchResult>({ pujas: [], pandits: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            if (!query) {
                setResults({ pujas: [], pandits: [] });
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                // Fetch matching pujas
                const pujasRes = await api.get(`/pujas?search=${encodeURIComponent(query)}`);

                // Fetch matching pandits
                const panditsRes = await api.get(`/pandits?search=${encodeURIComponent(query)}`);

                // Filter pujas independently on the frontend in case the backend search implementation is weak
                const lowerQuery = query.toLowerCase();
                let pujas = pujasRes.data?.pujas || [];
                pujas = pujas.filter((p: any) =>
                    p.name.toLowerCase().includes(lowerQuery) ||
                    p.description?.toLowerCase().includes(lowerQuery) ||
                    p.category?.toLowerCase().includes(lowerQuery)
                );

                let pandits = panditsRes.data?.pandits || [];
                pandits = pandits.filter((p: any) =>
                    p.users?.name?.toLowerCase().includes(lowerQuery) ||
                    p.city?.toLowerCase().includes(lowerQuery) ||
                    p.languages?.some((lang: string) => lang.toLowerCase().includes(lowerQuery))
                );

                setResults({ pujas, pandits });
            } catch (err) {
                console.error('Search failed:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query]);

    return (
        <div className="bg-slate-50 w-full max-w-[1600px] mx-auto pt-24 pb-20 px-4 md:px-6 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
                    Search Results
                </h1>
                <p className="text-slate-500 mb-10 text-lg">
                    Showing matches for <span className="font-bold text-slate-800">"{query}"</span>
                </p>

                {loading ? (
                    <div className="py-20 flex justify-center">
                        <div className="size-12 border-4 border-orange-100 border-t-primary rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="space-y-16">

                        {/* Pujas Section */}
                        {results.pujas.length > 0 && (
                            <section>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">auto_awesome</span>
                                        Matching Pujas ({results.pujas.length})
                                    </h2>
                                    <Link to="/pujas" className="text-sm font-bold text-primary hover:underline">View All Pujas</Link>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {results.pujas.map((puja) => (
                                        <PujaCard key={puja.id} puja={puja} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Pandits Section */}
                        {results.pandits.length > 0 && (
                            <section>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">group</span>
                                        Matching Pandits ({results.pandits.length})
                                    </h2>
                                    <Link to="/pandits" className="text-sm font-bold text-primary hover:underline">View All Pandits</Link>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {results.pandits.map((pandit) => (
                                        <Link key={pandit.id} to={`/pandits/${pandit.id}`} className="block group">
                                            <div className="glass-panel rounded-2xl p-5 hover:bg-white/80 hover:shadow-lg hover:shadow-orange-200/40 transition-all border border-slate-100 flex flex-col h-full">
                                                <div className="flex items-center gap-4 mb-4">
                                                    <img
                                                        src={pandit.users?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(pandit.users?.name || 'P')}&background=f97316&color=fff`}
                                                        alt={pandit.users?.name}
                                                        className="size-16 rounded-full object-cover border-2 border-primary/20 group-hover:border-primary transition-colors"
                                                    />
                                                    <div>
                                                        <h3 className="font-bold text-lg text-slate-900 group-hover:text-primary transition-colors line-clamp-1">{pandit.users?.name}</h3>
                                                        <p className="text-sm text-slate-500 font-medium flex items-center gap-1">
                                                            <span className="material-symbols-outlined text-[14px]">location_on</span>
                                                            {pandit.city || 'India'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1.5 mb-2">
                                                    <span className="material-symbols-outlined text-saffron text-[18px] tag-filled">star</span>
                                                    <span className="font-bold text-slate-700">{pandit.rating || '4.8'}</span>
                                                    <span className="text-sm text-slate-400">· {pandit.experience_years}+ yrs exp</span>
                                                </div>
                                                <div className="mt-auto pt-4 flex flex-wrap gap-2">
                                                    {pandit.languages?.slice(0, 3).map((lang: string) => (
                                                        <span key={lang} className="px-2 py-0.5 rounded text-xs font-bold text-slate-500 bg-slate-100 border border-slate-200">{lang}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}

                        {results.pujas.length === 0 && results.pandits.length === 0 && (
                            <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm">
                                <div className="inline-flex size-20 rounded-full bg-slate-50 items-center justify-center mb-6">
                                    <span className="material-symbols-outlined text-5xl text-slate-300">search_off</span>
                                </div>
                                <h3 className="text-2xl font-bold text-slate-800 mb-2">No results found</h3>
                                <p className="text-slate-500 max-w-sm mx-auto">We couldn't find any pujas or pandits matching "{query}". Try checking for spelling errors or using more general terms.</p>
                                <div className="mt-8 flex gap-4 justify-center">
                                    <Link to="/pujas" className="px-6 py-2.5 rounded-full bg-primary text-white font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200">Browse All Pujas</Link>
                                    <Link to="/pandits" className="px-6 py-2.5 rounded-full bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-colors">Browse Pandits</Link>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
