import { Link } from 'react-router-dom';

export function AboutUs() {
  return (
    <div className="w-full max-w-[1600px] mx-auto pt-10 pb-16 px-4 md:px-6">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
        <section className="relative rounded-[2rem] overflow-hidden min-h-[360px] shadow-2xl shadow-orange-900/10">
          <img
            src="https://images.unsplash.com/photo-1596539886544-4faed85d5f1a?auto=format&fit=crop&w=1400&q=80"
            alt="BookMyPandit community"
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-slate-900/45 to-orange-900/35" />
          <div className="relative z-10 p-8 md:p-10 h-full flex flex-col justify-end text-white">
            <span className="inline-flex w-fit items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-white/20 border border-white/20 mb-4">
              <span className="material-symbols-outlined text-sm">workspace_premium</span>
              Trusted Spiritual Platform
            </span>
            <h1 className="text-3xl md:text-4xl font-black font-display leading-tight">About BookMyPandit</h1>
            <p className="text-white/85 mt-3 text-sm md:text-base leading-relaxed max-w-xl">
              We connect families with verified pandits for authentic Vedic rituals, personalized guidance, and meaningful spiritual experiences at home or online.
            </p>
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-[2rem] p-7 md:p-9 shadow-sm">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900 font-display">Our Mission</h2>
              <p className="text-slate-600 mt-2 leading-relaxed">
                Spiritual services should be easy to access, transparent, and trustworthy. We simplify discovery, booking, and communication while preserving ritual authenticity.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <article className="rounded-2xl border border-orange-100 bg-orange-50/50 p-4">
                <span className="material-symbols-outlined text-primary">verified_user</span>
                <h3 className="font-bold text-slate-900 mt-2">Verified Pandits</h3>
                <p className="text-xs text-slate-600 mt-1">Profile checks, approval workflows, and transparent ratings.</p>
              </article>
              <article className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4">
                <span className="material-symbols-outlined text-blue-600">event_available</span>
                <h3 className="font-bold text-slate-900 mt-2">Easy Booking</h3>
                <p className="text-xs text-slate-600 mt-1">Book pujas by date, category, and guidance in minutes.</p>
              </article>
              <article className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
                <span className="material-symbols-outlined text-emerald-600">payments</span>
                <h3 className="font-bold text-slate-900 mt-2">Secure Payments</h3>
                <p className="text-xs text-slate-600 mt-1">Trusted gateways with clear receipts and confirmations.</p>
              </article>
              <article className="rounded-2xl border border-violet-100 bg-violet-50/50 p-4">
                <span className="material-symbols-outlined text-violet-600">auto_awesome</span>
                <h3 className="font-bold text-slate-900 mt-2">Astrology Tools</h3>
                <p className="text-xs text-slate-600 mt-1">Daily insights through horoscope, tarot, and numerology.</p>
              </article>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                to="/pujas"
                className="bg-primary hover:bg-orange-600 text-white px-5 py-2.5 rounded-full font-bold text-sm transition-colors"
              >
                Explore Pujas
              </Link>
              <Link
                to="/pandits"
                className="border border-slate-300 hover:border-slate-400 text-slate-700 px-5 py-2.5 rounded-full font-bold text-sm transition-colors"
              >
                Meet Pandits
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
