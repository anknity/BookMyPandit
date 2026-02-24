import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import { BookingCard } from '@/components/user/BookingCard';
import { SidebarCalendar } from '@/components/user/SidebarCalendar';
import { TrendingPujas } from '@/components/home/TrendingPujas';
import { SacredDestinations } from '@/components/home/SacredDestinations';
import { SidebarHoroscopeSlider } from '@/components/SidebarHoroscopeSlider';
import api from '@/config/api';
import { listPandits } from '@/services/panditService';

interface Muhurat {
  name: string;
  time: string;
  type: string;
  description: string;
}

interface UserStats {
  total_bookings: number;
  completed_pujas: number;
  upcoming_pujas: number;
  total_spend: number;
  karma_points: number;
  progress_percent: number;
  level: number;
}

interface PanditData {
  id: string;
  bio?: string;
  experience_years?: number;
  rating?: number;
  city?: string;
  users?: { name: string; avatar_url?: string; email?: string; phone?: string };
  pandit_services?: any[];
}

export function HomePage() {
  const { user } = useAuthStore();
  const [muhurats, setMuhurats] = useState<Muhurat[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [pandits, setPandits] = useState<PanditData[]>([]);
  const [panditsLoading, setPanditsLoading] = useState(true);

  // Banner state
  interface BannerConfig {
    badge_text: string;
    date_text: string;
    title_line1: string;
    title_line2: string;
    description: string;
    bg_image_url: string;
    book_puja_id: string | null;
    view_details_puja_id: string | null;
    is_active: boolean;
  }
  const DEFAULT_BANNER: BannerConfig = {
    badge_text: 'Holi Special',
    date_text: 'March 25th',
    title_line1: 'Celebrate',
    title_line2: 'Colors of Holi',
    description: 'Embrace the festival of colors with divine blessings. Book special Holika Dahan puja and verified pandits for your home.',
    bg_image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCL5T5SWVPYZ-SmfuH0MjYBMB7AYVz2PflZ4loCj8AIPG6PlR2mcbiKhketR-gqKJokihZG304D7HksisaoG2y88MBDR7CK6oUXreHimwh2GgbTV4L3pcC7Zzvdq_MMejqiKBQj0y0kDEEtp8jaNQLzWDuLRMNYd90JU_P2m6nBNLMDvZAD26VujUqSb67e4y5NLY9zOeogrzhK9cPIE8tdYr2dPoypzYm38ElPC63Zz5_F87RXk9ZyFPljiTgToQK-a0ufr786Biw',
    book_puja_id: null,
    view_details_puja_id: null,
    is_active: true,
  };
  const [banner, setBanner] = useState<BannerConfig>(DEFAULT_BANNER);

  // Fetch banner
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/banner`)
      .then(res => {
        if (res.data?.banner?.is_active !== false) {
          setBanner({ ...DEFAULT_BANNER, ...res.data.banner });
        }
      })
      .catch(() => { });
  }, []);

  // Fetch real stats when user is logged in
  useEffect(() => {
    if (!user) { setStats(null); return; }
    setStatsLoading(true);
    api.get('/user/stats')
      .then(({ data }) => setStats(data.stats))
      .catch(() => setStats(null))
      .finally(() => setStatsLoading(false));
  }, [user]);

  // Fetch real pandits
  useEffect(() => {
    setPanditsLoading(true);
    listPandits()
      .then((data) => setPandits((data || []).slice(0, 6)))
      .catch(() => setPandits([]))
      .finally(() => setPanditsLoading(false));
  }, []);

  const pujaCount = stats?.total_bookings ?? 0;
  const karmaPoints = stats?.karma_points ?? 0;
  const progressPercent = stats?.progress_percent ?? 0;

  useEffect(() => {
    const fetchMuhurats = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/astrology/muhurat`);
        if (res.data.success) {
          setMuhurats(res.data.data.muhurats);
        }
      } catch (error) {
        console.error("Failed to load muhurats", error);
      }
    };
    fetchMuhurats();
  }, []);

  return (
    <div className="w-full max-w-[1600px] mx-auto pt-6 pb-6 px-4 md:px-6 flex flex-col-reverse lg:flex-row gap-6">
      {/* Sidebar */}
      <aside className="lg:w-[320px] shrink-0 gap-6 flex flex-col lg:sticky lg:top-6 pb-10 lg:pb-0 h-max">
        <SidebarCalendar />

        <SidebarHoroscopeSlider />

        {/* Dynamic Muhurats */}
        <div className="glass-card rounded-[2rem] p-8 flex flex-col gap-4 flex-1 shadow-sm overflow-hidden min-h-[300px]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#8A44E9]">calendar_month</span>
              <h3 className="font-bold text-slate-800 tracking-tight">Today's Muhurats</h3>
            </div>
            <button className="text-xs text-primary font-bold hover:text-orange-600 transition-colors uppercase tracking-wider">View All</button>
          </div>
          <div className="flex flex-col gap-3 overflow-y-auto scrollbar-hide pr-2">
            {muhurats.length > 0 ? muhurats.map((muhurat, idx) => (
              <div key={idx} className="group flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 hover:bg-white transition-all border border-transparent hover:border-slate-200 cursor-pointer shadow-sm hover:shadow-md">
                <div className={cn(
                  "flex flex-col items-center justify-center rounded-xl w-12 h-12 shrink-0 border",
                  muhurat.type === 'auspicious'
                    ? "bg-green-50 text-green-600 border-green-100"
                    : "bg-red-50 text-red-500 border-red-100"
                )}>
                  <span className="material-symbols-outlined text-2xl">
                    {muhurat.type === 'auspicious' ? 'wb_sunny' : 'dark_mode'}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 group-hover:text-[#8A44E9] transition-colors">{muhurat.name}</h4>
                  <p className="text-xs text-slate-500 mt-1 font-medium">{muhurat.time}</p>
                  <p className={cn(
                    "text-[10px] mt-1.5 flex items-center gap-1 font-bold uppercase tracking-wider",
                    muhurat.type === 'auspicious' ? "text-green-600" : "text-red-500"
                  )}>
                    <span className="material-symbols-outlined text-[12px]">
                      {muhurat.type === 'auspicious' ? 'check_circle' : 'cancel'}
                    </span>
                    {muhurat.type}
                  </p>
                </div>
              </div>
            )) : (
              <div className="flex items-center justify-center h-20">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col gap-8 pb-20 w-full min-w-0">
        {/* Hero Banner */}
        <section className="relative w-full h-auto min-h-[300px] md:min-h-[360px] rounded-[2rem] overflow-hidden group shrink-0 shadow-xl shadow-orange-900/10">
          <div
            className="absolute inset-0 bg-cover bg-[center_top_20%] transition-transform duration-1000 scale-105 group-hover:scale-100"
            style={{ backgroundImage: `url("${banner.bg_image_url}")` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent md:bg-gradient-to-r md:from-black/80 md:via-black/30 md:to-transparent" />
          <div className="relative h-full p-6 md:p-12 flex flex-col justify-center items-start z-10 w-full max-w-[90%] md:max-w-xl">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {banner.badge_text && (
                  <span className="px-2.5 py-1 rounded-full bg-primary text-white text-[10px] md:text-xs font-bold uppercase tracking-wider shadow-md">
                    {banner.badge_text}
                  </span>
                )}
                {banner.date_text && (
                  <span className="px-2.5 py-1 rounded-full bg-white/20 text-white text-[10px] md:text-xs font-bold backdrop-blur-md border border-white/20 shadow-sm">
                    {banner.date_text}
                  </span>
                )}
              </div>
              <h2 className="text-3xl md:text-5xl lg:text-[54px] font-extrabold text-white leading-[1.1] mb-3 md:mb-5 tracking-tight font-display">
                {banner.title_line1} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-pink-500">
                  {banner.title_line2}
                </span>
              </h2>
              <div className="bg-white/10 p-3 md:p-4 rounded-xl backdrop-blur-md border border-white/10 mb-5 md:mb-8 shadow-sm">
                <p className="text-white/95 text-xs md:text-base font-medium leading-relaxed">
                  {banner.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  to={banner.book_puja_id ? `/pujas/${banner.book_puja_id}` : '/pujas'}
                  className="bg-primary hover:bg-orange-600 text-white shadow-lg shadow-orange-900/20 px-5 md:px-8 py-2.5 md:py-3.5 font-bold rounded-full transition-transform active:scale-95 flex items-center gap-2 text-sm md:text-base">
                  <span className="material-symbols-outlined text-lg md:text-xl">book_online</span>
                  Book Puja
                </Link>
                <Link
                  to={banner.view_details_puja_id ? `/pujas/${banner.view_details_puja_id}` : '/pujas'}
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 md:px-8 py-3.5 font-bold rounded-full transition-colors flex items-center gap-2 text-sm md:text-base backdrop-blur-sm">
                  View Details
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Trending Pujas */}
        <section>
          <div className="flex items-end justify-between mb-6 px-2">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 font-display">Trending Pujas</h3>
              <p className="text-slate-500 text-sm mt-1">Most booked spiritual services this week</p>
            </div>
            <Link to="/pujas" className="text-primary font-bold text-sm hover:text-orange-600 transition-colors flex items-center gap-1">
              View all <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
          <TrendingPujas />
        </section>

        {/* Sacred Destinations */}
        <SacredDestinations />

        {/* Verified Pandits — Real Data */}
        <section>
          <div className="flex items-center justify-between mb-6 px-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50/80 rounded-lg text-blue-500 flex items-center justify-center">
                <span className="material-symbols-outlined filled">verified</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 font-display">Verified Pandits</h3>
            </div>
            <Link to="/pandits" className="text-primary font-bold text-sm hover:text-orange-600 transition-colors flex items-center gap-1">
              View all <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>

          {panditsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-[2rem] p-5 border border-slate-200/60 flex items-center gap-5 animate-pulse">
                  <div className="w-24 h-24 rounded-[1.25rem] bg-slate-100 shrink-0" />
                  <div className="flex-1">
                    <div className="h-5 w-32 bg-slate-100 rounded mb-2" />
                    <div className="h-3 w-24 bg-slate-100 rounded mb-4" />
                    <div className="flex gap-2">
                      <div className="h-7 w-14 bg-slate-100 rounded-lg" />
                      <div className="h-7 w-20 bg-slate-100 rounded-lg" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : pandits.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
              <div className="inline-flex p-3 bg-blue-50 rounded-full mb-3">
                <span className="material-symbols-outlined text-3xl text-blue-400">person_search</span>
              </div>
              <p className="text-slate-400 text-sm">No verified pandits available yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {pandits.map((pandit) => (
                <Link to={`/pandits/${pandit.id}`} key={pandit.id} className="bg-white rounded-[2rem] p-5 border border-slate-200/60 flex items-center gap-5 hover:shadow-2xl hover:shadow-orange-900/5 hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50/50 rounded-bl-full -mr-12 -mt-12 transition-transform duration-700 group-hover:scale-150 pointer-events-none z-0" />
                  <div className="relative shrink-0 z-10">
                    {pandit.users?.avatar_url ? (
                      <img
                        src={pandit.users.avatar_url}
                        alt={pandit.users?.name || 'Pandit'}
                        className="w-24 h-24 rounded-[1.25rem] object-cover shadow-sm group-hover:shadow-md transition-shadow bg-slate-100"
                        loading="lazy"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden'); }}
                      />
                    ) : null}
                    <div className={`w-24 h-24 rounded-[1.25rem] bg-gradient-to-br from-orange-100 to-amber-50 flex items-center justify-center shadow-sm ${pandit.users?.avatar_url ? 'hidden' : ''}`}>
                      <span className="material-symbols-outlined text-3xl text-primary">person</span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full shadow-sm flex items-center justify-center">
                      <span className="material-symbols-outlined text-blue-500 text-[24px] filled">verified</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 z-10">
                    <h4 className="font-black text-slate-900 truncate text-lg group-hover:text-[#F98E2E] transition-colors font-display">
                      {pandit.users?.name || 'Pandit Ji'}
                    </h4>
                    <p className="text-xs text-slate-500 truncate mb-4 font-medium">
                      {pandit.city || 'India'} • {pandit.experience_years || 0} Yrs Exp
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="bg-slate-50 text-slate-700 text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 border border-slate-100">
                        <span className="material-symbols-outlined text-[14px] text-orange-400 filled">star</span> {pandit.rating ? pandit.rating.toFixed(1) : '—'}
                      </span>
                      <span className="text-[11px] text-[#7E8B9E] font-bold uppercase tracking-wider flex items-center gap-1">
                        VERIFIED
                      </span>
                    </div>
                  </div>
                  <button className="p-3.5 rounded-2xl bg-slate-50 text-slate-400 hover:bg-[#F98E2E] hover:text-white transition-all duration-300 border border-slate-100 hover:shadow-md z-10 hidden sm:flex">
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </button>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
