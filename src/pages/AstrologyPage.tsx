import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HoroscopeWidget, ZODIAC_SIGNS, ZodiacSign } from '@/components/HoroscopeWidget';
import { NumerologyWidget } from '@/components/NumerologyWidget';
import { TarotWidget } from '@/components/TarotWidget';

export function AstrologyPage() {
  const [activeSign, setActiveSign] = useState<ZodiacSign>(ZODIAC_SIGNS[0]);

  return (
    <div className="w-full max-w-[1600px] mx-auto pt-10 pb-6 px-4 md:px-6">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="text-center mb-2">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#0B1528] mb-4 font-display">Daily Horoscope</h1>
          <p className="text-[#64748B] max-w-2xl mx-auto">Discover what the stars have aligned for you today. Get personalized insights based on your zodiac sign.</p>
        </div>

        {/* Selected Horoscope View */}
        <div className="mb-8">
          <HoroscopeWidget className="w-full shadow-sm rounded-3xl" selectedSign={activeSign} />
        </div>

        {/* 12 Zodiac Grid Layout matching reference */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {ZODIAC_SIGNS.map((zodiac) => (
            <div
              key={zodiac.name}
              className={`bg-white rounded-[2rem] p-8 flex flex-col items-center justify-center text-center cursor-pointer shadow-sm border transition-all group overflow-hidden relative ${activeSign.name === zodiac.name ? 'border-[#F98E2E] shadow-orange-100/50' : 'border-slate-100/50 hover:shadow-md hover:border-orange-100'}`}
              onClick={() => {
                setActiveSign(zodiac);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              {/* Decorative corner curve like reference */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50/50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>

              <div className={`w-16 h-16 rounded-lg flex items-center justify-center text-3xl mb-4 transition-colors relative z-10 font-sans ${activeSign.name === zodiac.name ? 'bg-[#F98E2E] text-white' : 'bg-orange-50 text-[#8A44E9] group-hover:bg-orange-100'}`}>
                {zodiac.icon}
              </div>
              <h3 className="text-xl font-bold text-[#0B1528] mb-1 relative z-10">{zodiac.name}</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest relative z-10">{zodiac.date}</p>
            </div>
          ))}
        </div>

        {/* More Tools Section */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px bg-slate-200 flex-1"></div>
            <h2 className="text-2xl font-bold text-slate-800 font-display">More Astrology Tools</h2>
            <div className="h-px bg-slate-200 flex-1"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <NumerologyWidget className="shadow-lg hover:shadow-xl transition-shadow" />
            <TarotWidget className="shadow-lg hover:shadow-xl transition-shadow" />
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="glass-panel rounded-3xl p-8 md:p-12 relative overflow-hidden bg-[#0B1528] shadow-2xl">
          <div className="absolute inset-0 bg-[#0B1528] z-0"></div>
          <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-white max-w-xl">
              <h2 className="text-3xl font-bold mb-4 font-display">Talk to an Astrologer</h2>
              <p className="text-slate-300 mb-8 text-base">Get detailed Kundli analysis and personalized remedies from our expert Vedic astrologers.</p>
              <Link to="/astrologer-chat" className="inline-flex items-center gap-2 bg-[#F98E2E] hover:bg-[#E87A1E] text-white px-8 py-3.5 rounded-full font-bold shadow-lg shadow-orange-500/20 transition-all font-display text-lg">
                Consult Now
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>
            <div className="shrink-0 relative">
              <div className="absolute inset-0 bg-orange-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
              <div className="w-48 h-48 rounded-full bg-gradient-to-br from-[#F98E2E] to-orange-400 p-1 relative z-10">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRQZAk1NOl0fM9bzNV5Tr9t2EXOHmCYXSR-AobE8pp8T93KJfxoRC8xd2OUe6K9v27vc5Mfpnw0QVMs9xBxq4dfB5H9oIDFbCCn1c-pdtn9ocX3-2G5LK_NeMkU5led-bYBNgy3GOwkWMUr52KL8Wxbn5T8ACiX2wfmyVbo58vmmCgWJWBoOL3l_QeGM8iZAv8dVQhnABWV5U0ea0QJvgSeV41tvoSwyjdgAjThkCerKZoOSMf4A1ANI7_M3bvKQ0SG3AlcjIgKDo" alt="Astrologer" className="w-full h-full rounded-full object-cover border-[6px] border-[#0B1528]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
