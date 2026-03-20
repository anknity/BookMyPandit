import { Link } from 'react-router-dom';

const PUJAS = [
  "Satyanarayan Puja",
  "Griha Pravesh",
  "Rudrabhishek",
  "Navagraha Shanti",
  "Maha Mrityunjaya",
  "Vastu Shanti",
  "Namakaran",
  "Mundan Sanskar",
  "Marriage Puja",
  "Annaprashan",
  "Kaal Sarp Dosh Nivaran",
  "Mangal Dosh Nivaran"
];

export function PujaScroller() {
  // Duplicate array for seamless continuous scrolling
  const scrollItems = [...PUJAS, ...PUJAS];

  return (
    <div className="w-full bg-orange-50/50 border-b border-orange-100 py-2 overflow-hidden shadow-sm relative shrink-0">
      <div className="flex animate-marquee hover:animation-play-state-paused w-max whitespace-nowrap">
        {scrollItems.map((puja, index) => (
          <Link
            key={index}
            to={`/pujas?search=${encodeURIComponent(puja)}`}
            className="group flex items-center shrink-0 px-6 py-1 mx-2"
          >
            <span className="material-symbols-outlined text-orange-400 text-sm mr-2 opacity-70 group-hover:opacity-100 group-hover:scale-125 transition-all">
              auto_awesome
            </span>
            <span className="text-slate-700 font-medium text-sm md:text-base group-hover:text-orange-600 transition-colors">
              {puja}
            </span>
          </Link>
        ))}
      </div>

      {/* Gradient edges for smooth fade out */}
      <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-orange-50/90 to-transparent z-10 pointer-events-none"></div>
      <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-orange-50/90 to-transparent z-10 pointer-events-none"></div>
    </div>
  );
}
