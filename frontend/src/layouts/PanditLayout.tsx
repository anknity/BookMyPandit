import { Header } from '@/components/Header';
import { Footer } from '@/components/common/Footer';
import { Outlet, NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

const panditLinks = [
    { to: '/pandit/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { to: '/pandit/profile', icon: 'person', label: 'Profile' },
    { to: '/pandit/bookings', icon: 'calendar_month', label: 'Bookings' },
    { to: '/pandit/earnings', icon: 'account_balance_wallet', label: 'Earnings' },
    { to: '/pandit/inbox', icon: 'message', label: 'Inbox' },
];

export function PanditLayout() {
    return (
        <div className="min-h-screen bg-background-light text-slate-800 font-sans selection:bg-primary selection:text-white">
            <Header />
            <div className="pt-24 pb-6 px-4 md:px-6 max-w-6xl mx-auto w-full">
                {/* Horizontal Nav */}
                <nav className="flex justify-start md:justify-center gap-2 mb-8 overflow-x-auto hide-scrollbar">
                    {panditLinks.map((link) => (
                        <NavLink key={link.to} to={link.to}
                            className={({ isActive }) => cn(
                                "flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap",
                                isActive ? 'bg-primary text-white shadow-md shadow-orange-200' : 'bg-white text-slate-600 border border-slate-200 hover:border-primary/50'
                            )}>
                            <span className="material-symbols-outlined text-lg">{link.icon}</span>
                            {link.label}
                        </NavLink>
                    ))}
                </nav>
                <main className="min-h-[calc(100vh-12rem)]">
                    <Outlet />
                </main>
            </div>
            <Footer />
        </div>
    );
}
