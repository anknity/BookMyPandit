import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { listPandits } from '@/services/panditService';

interface PanditData {
  id: string;
  bio?: string;
  experience_years?: number;
  rating?: number;
  city?: string;
  languages?: string[];
  users?: { name: string; avatar_url?: string; email?: string; phone?: string };
  pandit_services?: { services?: { name: string } }[];
}

export function PanditSelection() {
  const [pandits, setPandits] = useState<PanditData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

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
    setLoading(true);
    listPandits()
      .then((data) => setPandits(data || []))
      .catch((err) => {
        console.error('Failed to load pandits:', err);
        setPandits([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredPandits = pandits.filter(p => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const nameMatch = p.users?.name?.toLowerCase().includes(q);
    const cityMatch = p.city?.toLowerCase().includes(q);
    const langMatch = p.languages?.some(l => l.toLowerCase().includes(q));
    const serviceMatch = p.pandit_services?.some(ps => ps.services?.name.toLowerCase().includes(q));

    return nameMatch || cityMatch || langMatch || serviceMatch;
  });

  return (
    <div className="w-full max-w-[1600px] mx-auto pt-10 pb-6 px-4 md:px-6 flex-1 min-w-0 pb-20">
      {/* Header Section */}
      <div className="mb-1">
        <h2 className="text-3xl font-black tracking-tight text-[#0d101b] mb-1">Find Your Spiritual Guide</h2>
        <p className="text-gray-500 font-medium">Connect with verified Vedic Pandits for authentic rituals</p>
      </div>

      {/* Search & Filters Bar */}
      <div className="glass-panel rounded-2xl p-2 mb-8 sticky top-[72px] z-40 transition-all duration-300 border-primary/10 shadow-lg shadow-primary/5">
        <div className="flex flex-col md:flex-row gap-2">
          <div className="relative flex-1 group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary material-symbols-outlined transition-transform group-focus-within:scale-110">search</span>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 rounded-xl bg-white/40 border border-transparent focus:border-primary/30 text-[15px] font-semibold placeholder:text-gray-400 focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all"
              placeholder="Search by name, pooja type, or location..."
              type="text"
            />
          </div>
          <div className="flex items-center gap-2 px-2 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
            <div className="h-8 w-[1px] bg-gray-200 mx-2 hidden md:block"></div>
            <button className="flex items-center gap-2 h-10 px-4 bg-orange-50/50 hover:bg-orange-50 rounded-lg border border-orange-100 text-sm font-bold text-gray-700 whitespace-nowrap transition-all hover:border-primary/30 active:scale-95">
              <span className="material-symbols-outlined text-[18px] text-primary/70">military_tech</span>
              <span>Experience</span>
              <span className="material-symbols-outlined text-sm">expand_more</span>
            </button>
            <button className="flex items-center gap-2 h-10 px-4 bg-blue-50/50 hover:bg-blue-50 rounded-lg border border-blue-100 text-sm font-bold text-gray-700 whitespace-nowrap transition-all hover:border-blue-300 active:scale-95">
              <span className="material-symbols-outlined text-[18px] text-blue-500/70">translate</span>
              <span>Language</span>
              <span className="material-symbols-outlined text-sm">expand_more</span>
            </button>
            <button className="flex items-center gap-2 h-10 px-4 bg-green-50/50 hover:bg-green-50 rounded-lg border border-green-100 text-sm font-bold text-gray-700 whitespace-nowrap transition-all hover:border-green-300 active:scale-95">
              <span className="material-symbols-outlined text-[18px] text-green-600/70">location_on</span>
              <span>Location</span>
              <span className="material-symbols-outlined text-sm">expand_more</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pandits Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="glass-panel rounded-xl p-5 h-[280px] animate-pulse">
              <div className="flex justify-between mb-4">
                <div className="size-16 rounded-full bg-gray-200"></div>
                <div className="w-12 h-6 rounded-full bg-gray-200"></div>
              </div>
              <div className="w-3/4 h-5 bg-gray-200 rounded mb-2"></div>
              <div className="w-1/2 h-4 bg-gray-200 rounded mb-6"></div>
              <div className="flex gap-2 mb-6">
                <div className="w-20 h-6 bg-gray-200 rounded"></div>
                <div className="w-20 h-6 bg-gray-200 rounded"></div>
              </div>
              <div className="mt-auto flex gap-3">
                <div className="flex-1 h-10 bg-gray-200 rounded"></div>
                <div className="flex-1 h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : pandits.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <div className="inline-flex p-4 rounded-full bg-orange-50 mb-4">
            <span className="material-symbols-outlined text-4xl text-primary">person_search</span>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No Pandits Found</h3>
          <p className="text-gray-500">We couldn't find any verified pandits right now. Please check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPandits.map((pandit) => (
            <div key={pandit.id} className="group glass-card rounded-2xl p-1 hover:bg-white/90 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 flex flex-col h-full relative overflow-hidden border border-white/80">
              <div className="bg-slate-50/50 rounded-2xl p-5 flex flex-col h-full border border-slate-100/50">
                <div className="flex items-start justify-between mb-5">
                  <div className="relative">
                    <div className={`size-20 rounded-2xl p-1 shadow-md rotate-3 group-hover:rotate-0 transition-transform duration-500 ${pandit.users?.avatar_url ? 'bg-gradient-to-br from-saffron to-primary' : 'bg-gray-100'}`}>
                      {pandit.users?.avatar_url ? (
                        <img
                          src={pandit.users.avatar_url}
                          alt={pandit.users?.name || 'Pandit profile'}
                          className="w-full h-full rounded-xl object-cover border-2 border-white"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden'); }}
                        />
                      ) : null}
                      <div className={`w-full h-full rounded-xl bg-orange-50 flex items-center justify-center border-2 border-white ${pandit.users?.avatar_url ? 'hidden' : ''}`}>
                        <span className="material-symbols-outlined text-3xl text-primary">person</span>
                      </div>
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-white rounded-lg p-1 shadow-lg ring-1 ring-black/5 flex items-center justify-center">
                      <span className="material-symbols-outlined text-blue-500 text-xl filled">verified</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-full shadow-sm border border-slate-100">
                      <span className="text-sm font-black text-slate-800">{pandit.rating ? pandit.rating.toFixed(1) : '5.0'}</span>
                      <span className="material-symbols-outlined text-[16px] text-saffron filled">star</span>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Premium</span>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-xl font-black text-slate-900 leading-tight group-hover:text-primary transition-colors tracking-tight">{pandit.users?.name || 'Pandit Ji'}</h3>
                  <div className="flex flex-wrap items-center gap-y-1 gap-x-3 mt-2">
                    <p className="text-[13px] text-slate-600 font-bold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px] text-primary/70">workspace_premium</span>
                      {pandit.experience_years || 0} Yrs Experience
                    </p>
                    <p className="text-[13px] text-slate-600 font-bold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px] text-blue-500/70">location_on</span>
                      {pandit.city || 'Varanasi'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {pandit.pandit_services && pandit.pandit_services.length > 0 ? (
                    <>
                      {pandit.pandit_services.slice(0, 2).map((ps, idx) => (
                        <span key={idx} className="px-3 py-1 rounded-lg bg-white text-slate-700 text-[11px] font-bold border border-slate-200 shadow-sm uppercase tracking-tighter">
                          {ps.services?.name || 'Vedic Ritual'}
                        </span>
                      ))}
                      {pandit.pandit_services.length > 2 && (
                        <span className="px-2 py-1 rounded-lg bg-slate-100 text-slate-500 text-[11px] font-bold border border-slate-200">
                          +{pandit.pandit_services.length - 2} More
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="px-3 py-1 rounded-lg bg-white text-slate-700 text-[11px] font-bold border border-slate-200 shadow-sm uppercase tracking-tighter">
                      Vedic rituals
                    </span>
                  )}
                </div>

                <div className="mt-auto grid grid-cols-5 gap-2">
                  <Link to={`/pandits/${pandit.id}`} className="col-span-2 h-11 rounded-xl border border-slate-200 bg-white text-slate-800 font-black text-[12px] hover:bg-slate-50 transition-all flex items-center justify-center uppercase tracking-tight active:scale-95">
                    Profile
                  </Link>
                  <Link to="/checkout" className="col-span-2 h-11 rounded-xl bg-gradient-to-r from-saffron to-primary text-white font-black text-[12px] shadow-lg shadow-orange-200 hover:shadow-orange-300 hover:brightness-110 transition-all flex items-center justify-center uppercase tracking-tight active:scale-95">
                    Book Now
                  </Link>
                  <Link to={`/astrologer-chat?panditId=${pandit.id}`} className="col-span-1 h-11 rounded-xl border border-orange-100 bg-orange-50 text-orange-600 hover:bg-orange-100 transition-all flex items-center justify-center shadow-sm active:scale-95" title="Chat Directly">
                    <span className="material-symbols-outlined text-[20px] filled">chat</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
