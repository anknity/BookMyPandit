import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLanguageStore } from '@/store/languageStore';
import { Puja } from '@/types';
import { cn } from '@/lib/utils';
import api from '@/config/api';

export function PujaDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t, language } = useLanguageStore();

    const [puja, setPuja] = useState<Puja | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedTimeSlot, setSelectedTimeSlot] = useState('morning');
    const [includeSamagri, setIncludeSamagri] = useState(true);
    const [recommendedPujas, setRecommendedPujas] = useState<Puja[]>([]);

    // Create array of next 7 days for date picker
    const next7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return d;
    });

    useEffect(() => {
        const fetchPujaDetail = async () => {
            try {
                setLoading(true);
                // API returns { puja: {...} } — must unwrap .puja
                const { data } = await api.get(`/pujas/${id}`);
                if (!data.puja) throw new Error('Puja not found');
                setPuja(data.puja);

                // Fetch recommended pujas (using trending logic or simple limits for now as real data)
                const recRes = await api.get('/pujas?limit=3');
                setRecommendedPujas((recRes.data.pujas || []).filter((p: Puja) => p.id !== id).slice(0, 3));
            } catch (err: any) {
                setError(err.response?.data?.error || err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchPujaDetail();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error || !puja) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Puja Not Found</h2>
                <Link to="/pujas" className="text-primary hover:underline">Return to Listings</Link>
            </div>
        );
    }

    const displayName = language === 'hi' ? (puja.name_hi || puja.name) : puja.name;
    const displayDescription = language === 'hi' ? (puja.description_hi || puja.description) : puja.description;

    const samagriPrice = 1500;
    const PLATFORM_FEE = 99;
    const GST = 18; // 18% GST on platform fee only
    const basePrice = Number(puja.base_price) || 0;
    const totalPrice = basePrice + (includeSamagri && puja.samagri_available ? samagriPrice : 0) + PLATFORM_FEE + GST;

    const handleBook = () => {
        const bookingData = {
            puja,
            date: selectedDate,
            timeSlot: selectedTimeSlot,
            includeSamagri,
            totalPrice
        };
        navigate('/checkout', { state: bookingData });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-32 pt-24 min-h-screen">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
                <Link to="/" className="hover:text-primary transition-colors">{t('Home', 'होम')}</Link>
                <span className="material-symbols-outlined text-xs">chevron_right</span>
                <Link to="/pujas" className="hover:text-primary transition-colors">{t('Pujas', 'पूजा')}</Link>
                <span className="material-symbols-outlined text-xs">chevron_right</span>
                <span className="text-primary font-medium line-clamp-1">{displayName}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Hero Section */}
                    <div className="glass-card rounded-2xl overflow-hidden p-1 relative group bg-white border border-slate-100 shadow-sm">
                        <div className="relative h-64 sm:h-80 rounded-xl overflow-hidden">
                            {puja.image_url ? (
                                <img
                                    src={puja.image_url}
                                    alt={displayName}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-6xl text-orange-400">temple_hindu</span>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
                            <div className="absolute bottom-0 left-0 p-6 z-20 w-full">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="bg-primary px-2 py-0.5 rounded text-xs font-bold text-white uppercase tracking-wider">
                                        {puja.category}
                                    </span>
                                </div>
                                <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 tracking-tight drop-shadow-sm">{displayName}</h1>
                                <div className="flex items-center gap-4 mt-4 text-white/90 text-sm font-medium">
                                    <span className="flex items-center gap-1 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-md border border-white/10">
                                        <span className="material-symbols-outlined text-lg">schedule</span> {puja.duration}
                                    </span>
                                    <span className="flex items-center gap-1 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-md border border-white/10">
                                        <span className="material-symbols-outlined text-lg">group</span> {puja.pandits_required} {t('Pandits', 'पंडित')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Benefits & Included Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* What's Included */}
                        <div className="bg-white border border-slate-100 shadow-sm p-6 rounded-2xl">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                    <span className="material-symbols-outlined">inventory_2</span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-800">{t('What\'s Included', 'क्या शामिल है')}</h3>
                            </div>
                            <ul className="space-y-3">
                                {puja.items_included?.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <span className="material-symbols-outlined text-primary text-xl mt-0.5">check_circle</span>
                                        <span className="text-slate-600 font-medium">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Benefits */}
                        <div className="bg-slate-50/50 border border-slate-100 shadow-sm p-6 rounded-[32px]">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 py-1.5 flex items-center justify-center bg-blue-50/80 text-blue-500 rounded-xl">
                                    <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                                </div>
                                <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">{t('Spiritual Benefits', 'आध्यात्मिक लाभ')}</h3>
                            </div>

                            {puja.benefits && puja.benefits.length > 0 ? (
                                <div className="grid grid-cols-2 gap-3">
                                    {puja.benefits.slice(0, 4).map((benefit, idx) => {
                                        const b = benefit.toLowerCase();
                                        let icon = 'stars';
                                        if (b.includes('peace') || b.includes('shanti') || b.includes('calm') || b.includes('vibration')) icon = 'eco';
                                        else if (b.includes('prosper') || b.includes('wealth') || b.includes('success') || b.includes('abund') || b.includes('results')) icon = 'trending_up';
                                        else if (b.includes('protect') || b.includes('safe') || b.includes('guard') || b.includes('blessing')) icon = 'shield';
                                        else if (b.includes('harmon') || b.includes('family') || b.includes('relation') || b.includes('atmosphere')) icon = 'family_restroom';
                                        else if (b.includes('health') || b.includes('heal') || b.includes('cure')) icon = 'health_and_safety';
                                        else if (b.includes('obstacle') || b.includes('clear')) icon = 'water_drop';

                                        return (
                                            <div key={idx} className="bg-white rounded-3xl p-5 px-3 flex flex-col items-center justify-center text-center shadow-sm border border-slate-100 hover:border-orange-100 hover:shadow-md transition-all min-h-[140px]">
                                                <span className="material-symbols-outlined text-[#F98E2E] text-[36px] mb-3" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                                                <span className="text-[#0B1528] font-bold text-[13.5px] leading-snug tracking-tight max-w-[120px]">{benefit}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-slate-500 text-sm text-center py-4">{t('No specific benefits listed.', 'कोई विशिष्ट लाभ सूचीबद्ध नहीं है।')}</div>
                            )}
                        </div>
                    </div>

                    {/* Description Text */}
                    <div className="bg-white border border-slate-100 shadow-sm p-6 rounded-2xl">
                        <h3 className="text-lg font-bold mb-3 text-slate-800">{t('About the Puja', 'पूजा के बारे में')}</h3>
                        <p className="text-slate-600 leading-relaxed text-base">
                            {displayDescription}
                        </p>
                        {puja.name_hi && language === 'en' && (
                            <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-100">
                                <p className="text-sm text-orange-800 font-medium italic">"{puja.description_hi}"</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Booking Config */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 space-y-6">
                        <div className="bg-white border border-slate-100 shadow-xl p-6 rounded-2xl border-t-4 border-t-primary">
                            <h2 className="text-xl font-bold mb-6 text-slate-800">{t('Book Puja', 'पूजा बुक करें')}</h2>

                            {/* Date Picker (Simplified) */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">{t('Select Date', 'दिनांक चुनें')}</label>
                                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                    {next7Days.map((date, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setSelectedDate(date)}
                                            className={cn(
                                                "flex flex-col items-center justify-center min-w-[60px] p-2 rounded-xl border transition-all",
                                                selectedDate.toDateString() === date.toDateString()
                                                    ? "bg-primary text-white border-primary shadow-lg shadow-orange-200"
                                                    : "bg-white text-slate-600 border-slate-200 hover:border-primary hover:bg-orange-50"
                                            )}
                                        >
                                            <span className="text-xs font-medium uppercase">{date.toLocaleDateString(language, { weekday: 'short' })}</span>
                                            <span className="text-lg font-bold">{date.getDate()}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Time Slots */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">{t('Select Time Slot', 'समय चुनें')}</label>
                                <div className="grid grid-cols-1 gap-2">
                                    {[
                                        { id: 'morning', label: 'Morning', sub: '06:00 AM - 11:00 AM' },
                                        { id: 'afternoon', label: 'Afternoon', sub: '12:00 PM - 04:00 PM' },
                                        { id: 'evening', label: 'Evening', sub: '05:00 PM - 09:00 PM' },
                                        { id: 'shubh_muhurat', label: 'Shubh Muhurat', sub: 'As per Pandit ji' }
                                    ].map((slot) => (
                                        <label key={slot.id} className="cursor-pointer relative">
                                            <input
                                                type="radio"
                                                name="time"
                                                className="peer sr-only"
                                                checked={selectedTimeSlot === slot.id}
                                                onChange={() => setSelectedTimeSlot(slot.id)}
                                            />
                                            <div className="p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 peer-checked:bg-primary/5 peer-checked:border-primary peer-checked:text-primary transition-all flex justify-between items-center">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-sm">{language === 'hi' ? t(slot.label, slot.label) : slot.label}</span>
                                                    <span className="text-xs text-slate-400">{slot.sub}</span>
                                                </div>
                                                <div className="size-4 rounded-full border-2 border-slate-300 peer-checked:border-primary peer-checked:bg-primary"></div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Samagri Toggle */}
                            {puja.samagri_available && (
                                <div className="mb-6 pt-6 border-t border-slate-100">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary">shopping_bag</span>
                                            <span className="font-semibold text-sm text-slate-700">{t('Add Puja Samagri', 'पूजा सामग्री जोड़ें')}</span>
                                        </div>
                                        <label className="inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={includeSamagri}
                                                onChange={(e) => setIncludeSamagri(e.target.checked)}
                                            />
                                            <div className="relative w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                        </label>
                                    </div>
                                    <div className="ml-8 text-sm font-medium text-primary">+ ₹{samagriPrice}</div>
                                </div>
                            )}

                            {/* Itemised Price Breakdown */}
                            <div className="space-y-2 text-sm text-slate-600 mb-2 pt-4 border-t border-slate-100">
                                <div className="flex justify-between">
                                    <span className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm text-primary">temple_hindu</span>
                                        {t('Service Fee', 'सेवा शुल्क')}
                                    </span>
                                    <span>₹{basePrice.toLocaleString('en-IN')}</span>
                                </div>
                                {includeSamagri && puja.samagri_available && (
                                    <div className="flex justify-between text-slate-600">
                                        <span className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm text-primary">shopping_bag</span>
                                            {t('Samagri Kit', 'पूजा सामग्री')}
                                        </span>
                                        <span>+ ₹{samagriPrice.toLocaleString('en-IN')}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-slate-500">
                                    <span className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">receipt</span>
                                        {t('Platform Fee', 'प्लेटफ़ॉर्म शुल्क')}
                                    </span>
                                    <span>+ ₹99</span>
                                </div>
                                <div className="flex justify-between text-slate-500">
                                    <span className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">percent</span>
                                        {t('GST (18%)', 'जीएसटी (18%)')}
                                        <span className="text-[10px] bg-slate-100 px-1 rounded">on platform fee</span>
                                    </span>
                                    <span>+ ₹18</span>
                                </div>
                                <div className="flex justify-between font-bold text-slate-900 text-base pt-3 border-t border-slate-100 mt-1">
                                    <span>{t('Total Payable', 'कुल देय')}</span>
                                    <span className="text-primary text-lg">₹{totalPrice.toLocaleString('en-IN')}</span>
                                </div>
                                <p className="text-[10px] text-slate-400 text-right">Inclusive of all taxes</p>
                            </div>

                            <button
                                onClick={handleBook}
                                className="w-full mt-4 bg-gradient-to-r from-primary to-orange-600 text-white py-3.5 rounded-xl font-bold text-base shadow-lg shadow-orange-200 hover:shadow-orange-300 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
                            >
                                {t('Proceed to Book', 'बुकिंग के लिए आगे बढ़ें')}
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* You may also need Section */}
            {recommendedPujas.length > 0 && (
                <div className="mt-16">
                    <h3 className="text-2xl font-black text-slate-800 mb-6 tracking-tight">{t('You may also need', 'आपको इनकी भी आवश्यकता हो सकती है')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {recommendedPujas.map((rec) => (
                            <Link to={`/pujas/${rec.id}`} key={rec.id} className="group relative bg-[#FCFAF6] rounded-[32px] overflow-hidden border border-orange-900/5 hover:shadow-2xl hover:shadow-orange-900/10 hover:-translate-y-1 transition-all duration-300 h-full flex flex-col p-4">
                                <div className="relative h-48 w-full rounded-[24px] overflow-hidden bg-slate-100 mb-5 group-hover:shadow-inner transition-shadow duration-500">
                                    <img
                                        src={rec.image_url || 'https://placehold.co/400x300/F98E2E/FFF?text=Puja'}
                                        alt={language === 'hi' ? (rec.name_hi || rec.name) : rec.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                </div>
                                <div className="flex flex-col flex-1 px-2 pb-2 z-10">
                                    <h4 className="text-xl font-extrabold text-[#0B1528] mb-2 line-clamp-1 group-hover:text-[#F98E2E] transition-colors font-display tracking-tight">
                                        {language === 'hi' ? (rec.name_hi || rec.name) : rec.name}
                                    </h4>
                                    <p className="text-sm text-slate-500 line-clamp-2 mb-6 flex-1 font-medium leading-relaxed">
                                        {language === 'hi' ? (rec.description_hi || rec.description) : rec.description}
                                    </p>
                                    <div className="flex items-end justify-between mt-auto pt-4 border-t border-slate-200/60 pl-1">
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">{t('Starting from', 'शुरुआती कीमत')}</p>
                                            <span className="text-2xl font-black text-[#E87B1E] font-display">₹{rec.base_price.toLocaleString('en-IN')}</span>
                                        </div>
                                        <div className="bg-[#0B1528] group-hover:bg-[#F98E2E] text-white w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-md transform group-hover:scale-105 group-hover:rotate-12">
                                            <span className="material-symbols-outlined font-bold">add</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
