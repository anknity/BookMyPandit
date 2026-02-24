import { Link, useLocation } from 'react-router-dom';
import { useLanguageStore } from '@/store/languageStore';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';

export function MobileBottomNav() {
    const { t } = useLanguageStore();
    const { user } = useAuthStore();
    const location = useLocation();

    const navItems = [
        {
            label: t('Home', 'होम'),
            icon: 'home',
            path: '/',
        },
        {
            label: t('Pujas', 'पूजा'),
            icon: 'temple_hindu',
            path: '/pujas',
        },
        {
            label: t('Pandits', 'पंडित'),
            icon: 'person_search',
            path: '/pandits',
        },
        {
            label: t('Astrology', 'ज्योतिष'),
            icon: 'auto_awesome',
            path: '/astrology',
        },
    ];

    return (
        <div className="md:hidden fixed bottom-0 w-full bg-white/90 backdrop-blur-lg border-t border-slate-200 z-50 rounded-t-[24px] shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-safe">
            <div className="flex justify-around items-center px-2 py-3">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                "flex flex-col items-center justify-center w-16 gap-1 transition-all duration-300",
                                isActive ? "text-[#F98E2E]" : "text-slate-400 hover:text-slate-600"
                            )}
                        >
                            <div
                                className={cn(
                                    "flex items-center justify-center w-12 h-8 rounded-full transition-all duration-300",
                                    isActive ? "bg-orange-50" : "bg-transparent"
                                )}
                            >
                                <span
                                    className={cn(
                                        "material-symbols-outlined text-2xl transition-transform duration-300",
                                        isActive ? "filled scale-110" : "scale-100"
                                    )}
                                >
                                    {item.icon}
                                </span>
                            </div>
                            <span className={cn(
                                "text-[10px] font-bold transition-all duration-300 tracking-wide",
                                isActive ? "font-black" : "font-semibold"
                            )}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
