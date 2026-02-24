import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getPandit } from '@/services/panditService';

export function PanditProfile() {
  const { id } = useParams<{ id: string }>();
  const [pandit, setPandit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showCopied, setShowCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getPandit(id)
      .then((data) => setPandit(data))
      .catch((err) => console.error('Failed to load pandit:', err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleShare = async () => {
    if (!pandit) return;
    const url = window.location.href;
    const shareData = {
      title: `${pandit.users?.name || 'Pandit Ji'} - Pandit Profile`,
      text: `Check out this Pandit profile on BookMyPandit!`,
      url: url,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(url);
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 lg:px-8 pb-20">
        <div className="animate-pulse flex flex-col gap-8">
          <div className="h-48 bg-gray-200 rounded-2xl"></div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-4">
              <div className="h-64 bg-gray-200 rounded-2xl"></div>
              <div className="h-40 bg-gray-200 rounded-2xl"></div>
            </div>
            <div className="lg:col-span-4 h-96 bg-gray-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!pandit) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">search_off</span>
        <h2 className="text-2xl font-bold text-gray-800">Pandit Not Found</h2>
        <p className="text-gray-500 mt-2 mb-6">The profile you are looking for does not exist or has been removed.</p>
        <Link to="/pandits" className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-orange-600 transition-colors">
          Browse All Pandits
        </Link>
      </div>
    );
  }

  const name = pandit.users?.name || 'Pandit Ji';
  const avatar = pandit.users?.avatar_url;
  const rating = pandit.rating ? Number(pandit.rating).toFixed(1) : '—';
  const exp = pandit.experience_years || 0;
  const city = pandit.city || 'India';
  const bio = pandit.bio || 'Highly revered Vedic scholar bringing authentic Vedic knowledge and spiritual depth to every ceremony.';
  const services = pandit.pandit_services || [];

  // Extract unique languages if available or fallback
  const languages = ['Hindi', 'Sanskrit', 'English'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 lg:px-8 pb-20">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-8 px-2">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <Link to="/pandits" className="hover:text-primary">Pandits</Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="text-primary font-medium">{name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
        {/* Left Column: Profile & Details */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          {/* Hero Profile Card */}
          <div className="glass-card rounded-2xl p-6 md:p-8 relative overflow-hidden group">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-100/50 rounded-full blur-3xl opacity-50"></div>
            <div className="flex flex-col md:flex-row gap-6 md:items-start relative z-10">
              <div className="relative shrink-0 mx-auto md:mx-0">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-xl overflow-hidden relative bg-gray-100 flex items-center justify-center">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt={name}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden'); }}
                    />
                  ) : null}
                  <span className={`material-symbols-outlined text-6xl text-primary ${avatar ? 'hidden' : ''}`}>person</span>
                </div>
                <div className="absolute bottom-1 right-1 bg-white p-1.5 rounded-full shadow-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-blue-500 text-xl filled">verified</span>
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                  <h1 className="text-3xl font-bold text-[#1c130d] tracking-tight">{name}</h1>
                  <div className="inline-flex items-center justify-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-bold border border-green-100">
                    <span className="material-symbols-outlined text-sm filled text-green-600">star</span>
                    {rating} Rating
                  </div>
                </div>
                <p className="text-gray-600 mb-4 text-base leading-relaxed">
                  Vedic Pandit • {exp} Years Experience
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
                  {languages.map((lang) => (
                    <span key={lang} className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold border border-orange-100">
                      {lang}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <button
                    onClick={handleShare}
                    className="relative flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-full text-sm font-semibold shadow-sm border border-gray-200 transition-all"
                  >
                    <span className="material-symbols-outlined text-lg">share</span>
                    Share
                    {showCopied && (
                      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg z-50 animate-fade-in">
                        Link copied!
                      </div>
                    )}
                  </button>
                  <button className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-full text-sm font-semibold shadow-sm border border-gray-200 transition-all">
                    <span className="material-symbols-outlined text-lg">favorite</span>
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-card p-4 rounded-xl flex flex-col items-center justify-center text-center gap-1 group hover:border-primary/30 transition-colors">
              <div className="bg-orange-50 p-2 rounded-full mb-1 group-hover:bg-primary/10 transition-colors">
                <span className="material-symbols-outlined text-primary text-2xl">workspace_premium</span>
              </div>
              <h3 className="font-bold text-lg">{exp}+</h3>
              <p className="text-xs text-gray-500 font-medium">Years Exp.</p>
            </div>
            <div className="glass-card p-4 rounded-xl flex flex-col items-center justify-center text-center gap-1 group hover:border-primary/30 transition-colors">
              <div className="bg-blue-50 p-2 rounded-full mb-1 group-hover:bg-blue-100 transition-colors">
                <span className="material-symbols-outlined text-secondary text-2xl">school</span>
              </div>
              <h3 className="font-bold text-lg">Vedic</h3>
              <p className="text-xs text-gray-500 font-medium">Scholar</p>
            </div>
            <div className="glass-card p-4 rounded-xl flex flex-col items-center justify-center text-center gap-1 group hover:border-primary/30 transition-colors">
              <div className="bg-green-50 p-2 rounded-full mb-1 group-hover:bg-green-100 transition-colors">
                <span className="material-symbols-outlined text-green-600 text-2xl">temple_hindu</span>
              </div>
              <h3 className="font-bold text-lg">{services.length || 5}+</h3>
              <p className="text-xs text-gray-500 font-medium">Services</p>
            </div>
            <div className="glass-card p-4 rounded-xl flex flex-col items-center justify-center text-center gap-1 group hover:border-primary/30 transition-colors">
              <div className="bg-purple-50 p-2 rounded-full mb-1 group-hover:bg-purple-100 transition-colors">
                <span className="material-symbols-outlined text-purple-600 text-2xl">location_on</span>
              </div>
              <h3 className="font-bold text-lg">{city}</h3>
              <p className="text-xs text-gray-500 font-medium">Based In</p>
            </div>
          </div>

          {/* About Section */}
          <div className="flex flex-col gap-4">
            <h3 className="text-2xl font-bold text-gray-900">About {name}</h3>
            <p className="text-gray-600 leading-7 whitespace-pre-wrap">
              {bio}
            </p>
          </div>

          {/* Services Section */}
          {services.length > 0 && (
            <div className="flex flex-col gap-4 mt-4">
              <h3 className="text-2xl font-bold text-gray-900">Provided Services</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((ps: any, idx: number) => (
                  <div key={idx} className="border border-gray-100 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                    <h4 className="font-bold text-gray-800">{ps.services?.name || 'Service'}</h4>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{ps.services?.description || 'A sacred vedic ritual.'}</p>
                    <div className="mt-3 text-primary font-bold text-sm">
                      Starting from ₹{ps.services?.base_price || 1500}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Booking Widget (Sticky) */}
        <div className="lg:col-span-4 relative">
          <div className="sticky top-28 flex flex-col gap-6">
            <div className="glass-card rounded-2xl p-6 shadow-xl border-t-4 border-t-primary/80">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Book a Puja</h3>
                <div className="bg-gradient-to-r from-orange-100 to-blue-50 px-3 py-1 rounded-full text-xs font-bold text-primary border border-primary/20">
                  Best Price
                </div>
              </div>

              {/* Service Selection (if multiple) */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Select Service</h4>
                <select className="w-full h-11 px-3 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary">
                  {services.length > 0 ? (
                    services.map((ps: any, idx: number) => (
                      <option key={idx} value={ps.services?.id}>{ps.services?.name}</option>
                    ))
                  ) : (
                    <option>General Consultation</option>
                  )}
                </select>
              </div>

              {/* Pricing & CTA */}
              <div className="border-t border-gray-200 pt-6">
                <Link to={`/astrologer-chat?panditId=${pandit.id}`} className="w-full h-12 mb-3 bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 group">
                  <span className="material-symbols-outlined text-[20px] filled">chat</span>
                  <span>Chat Directly</span>
                </Link>

                <Link to={`/checkout?pandit=${pandit.id}`} className="w-full h-14 bg-gradient-to-r from-primary to-[#ff8c38] hover:from-orange-600 hover:to-orange-500 text-white rounded-full font-bold text-lg shadow-lg shadow-orange-500/30 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 group relative overflow-hidden">
                  <span>Continue Booking</span>
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
