import { useState, useEffect } from 'react';
import { useLanguageStore } from '@/store/languageStore';
import { Puja } from '@/types';
import { PujaCard } from '@/components/user/PujaCard';
import { cn } from '@/lib/utils';
import { useLocation } from 'react-router-dom';
import api from '@/config/api';

export default function PujaListing() {
    const { t, language } = useLanguageStore();
    const [pujas, setPujas] = useState<Puja[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    // Categories (hardcoded or fetched)
    const categories = ['All', 'Mantra Jaap', 'Sanskar', 'Graha Puja', 'Path & Stotra', 'Home & Business', 'Special Puja', 'Dosh Nivaran', 'Shraddh & Pitra', 'Daan & Charity'];

    const location = useLocation();

    // Initialize search query from URL
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const searchParam = queryParams.get('search');
        if (searchParam) {
            setSearchQuery(searchParam);
        } else {
            setSearchQuery('');
        }
    }, [location.search]);

    useEffect(() => {
        fetchPujas();
    }, []);

    const fetchPujas = async () => {
        try {
            setLoading(true);
            // Fetch from API
            const response = await api.get('/pujas');
            const data = response.data;
            if (data.pujas) {
                setPujas(data.pujas);
            }
        } catch (error) {
            console.error('Error fetching pujas:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredPujas = pujas.filter(puja => {
        const matchesCategory = activeCategory === 'All' || puja.category === activeCategory;
        const matchesSearch = (language === 'hi' && puja.name_hi
            ? puja.name_hi.toLowerCase().includes(searchQuery.toLowerCase())
            : puja.name.toLowerCase().includes(searchQuery.toLowerCase()))
            || puja.description.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    return (
        <div className="h-full w-full max-w-[1600px] mx-auto pt-10 pb-12">
            <div className="container mx-auto px-4 max-w-7xl">

                {/* Header Section */}
                <div className="text-center mb-2">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4 font-serif">
                        {t('Divine Puja Services', 'दिव्य पूजा सेवाएँ')}
                    </h1>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        {t('Choose from our wide range of Vedic pujas and rituals performed by experienced Pandits at your home or online.', 'अपने घर या ऑनलाइन अनुभवी पंडितों द्वारा वैदिक पूजा और अनुष्ठानों की हमारी विस्तृत श्रृंखला से चुनें।')}
                    </p>
                </div>

                {/* Search & Filter */}
                <div className="mb-10 space-y-6">
                    {/* Search */}
                    <div className="max-w-md mx-auto relative">
                        <span className="absolute left-3 top-3 text-slate-400 material-symbols-outlined">search</span>
                        <input
                            type="text"
                            placeholder={t('Search for a puja...', 'पूजा खोजें...')}
                            className="w-full bg-white pl-10 pr-4 py-3 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Category Tabs */}
                    <div className="flex flex-wrap justify-center gap-2">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={cn(
                                    "px-4 py-2 rounded-full text-sm font-medium transition-all border",
                                    activeCategory === category
                                        ? "bg-primary text-white border-primary shadow-md shadow-orange-200"
                                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                                )}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl h-80 animate-pulse border border-slate-100">
                                <div className="h-48 bg-slate-200 rounded-t-2xl"></div>
                                <div className="p-4 space-y-3">
                                    <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                                    <div className="h-4 bg-slate-200 rounded w-full"></div>
                                    <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        {filteredPujas.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredPujas.map(puja => (
                                    <PujaCard key={puja.id} puja={puja} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <div className="inline-flex items-center justify-center size-20 rounded-full bg-slate-100 mb-4 text-slate-400">
                                    <span className="material-symbols-outlined text-4xl">search_off</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-700 mb-2">{t('No pujas found', 'कोई पूजा नहीं मिली')}</h3>
                                <p className="text-slate-500">
                                    {t('Try adjusting your search or category filter.', 'अपनी खोज या श्रेणी फ़िल्टर को समायोजित करने का प्रयास करें।')}
                                </p>
                                <button
                                    onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
                                    className="mt-6 text-primary hover:underline font-medium"
                                >
                                    {t('Clear all filters', 'सभी फ़िल्टर साफ़ करें')}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
