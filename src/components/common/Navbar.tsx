import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { logoutUser } from '@/services/authService';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { NotificationBell } from '@/components/common/NotificationBell';
import logo from '@/assets/logo.png';

export function Navbar() {
    const { user, isAuthenticated, logout } = useAuthStore();
    const location = useLocation();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);
    const isAdmin = location.pathname.startsWith('/admin');

    const handleLogout = async () => {
        await logoutUser();
        logout();
        navigate('/login');
    };

    return (
        <header className={cn("fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-4 transition-all duration-300", isAdmin ? "glass-panel m-4 rounded-xl border-b border-white/40" : "bg-white/80 backdrop-blur-md border-b border-slate-100")}>
            <div className={cn("flex items-center justify-between mx-auto", isAdmin ? "w-full" : "max-w-[1600px] glass-panel rounded-full px-4 md:px-6 py-3")}>
                <div className="flex items-center gap-3">
                    <Link to="/" className="flex items-center gap-2 group">
                        <img src={logo} alt="BookMyPandit Logo" className="h-10 w-auto object-contain" />
                        <h1 className="text-xl font-bold tracking-tight text-slate-800 hidden sm:block group-hover:text-primary transition-colors">
                            {isAdmin ? "BookMyPandit Admin" : "BookMyPandit"}
                        </h1>
                    </Link>
                </div>

                {!isAdmin && (
                    <div className="hidden md:flex flex-1 max-w-md mx-8">
                        <div className="relative w-full group">
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                const q = new FormData(e.currentTarget).get('q') as string;
                                if (q) {
                                    navigate(`/search?q=${encodeURIComponent(q)}`);
                                }
                            }}>
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                    <span className="material-symbols-outlined">search</span>
                                </div>
                                <input
                                    name="q"
                                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-full leading-5 bg-white/80 text-slate-700 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm transition-all shadow-sm"
                                    placeholder="Search pujas, pandits, or deities..."
                                    type="text"
                                />
                            </form>
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-4">
                    {!isAdmin && (
                        <nav className="hidden lg:flex items-center gap-6 mr-4">
                            <Link to="/" className={cn("text-sm font-medium transition-colors hover:text-primary", location.pathname === '/' ? 'text-primary font-bold' : 'text-slate-600')}>Home</Link>
                            <Link to="/pujas" className={cn("text-sm font-medium transition-colors hover:text-primary", location.pathname.startsWith('/pujas') ? 'text-primary font-bold' : 'text-slate-600')}>Pujas</Link>
                            <Link to="/pandits" className={cn("text-sm font-medium transition-colors hover:text-primary", location.pathname.startsWith('/pandits') ? 'text-primary font-bold' : 'text-slate-600')}>Pandits</Link>
                            <Link to="/astrology" className={cn("text-sm font-medium transition-colors hover:text-primary", location.pathname.startsWith('/astrology') ? 'text-primary font-bold' : 'text-slate-600')}>Astrology</Link>
                            {user?.role === 'admin' && (
                                <Link to="/admin" className="text-sm font-bold text-primary hover:text-orange-600 transition-colors flex items-center gap-1 bg-orange-50 px-3 py-1.5 rounded-full">
                                    <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
                                    Admin Panel
                                </Link>
                            )}
                        </nav>
                    )}

                    {isAuthenticated ? (
                        <>
                            <NotificationBell />

                            <div className="h-8 w-[1px] bg-slate-200 mx-1 hidden sm:block"></div>

                            <div className="relative group">
                                <button className="flex items-center gap-3 pl-1 cursor-pointer">
                                    <div className="size-9 rounded-full bg-gradient-to-br from-primary/30 to-orange-200 flex items-center justify-center text-primary font-bold text-sm border-2 border-primary/20">
                                        {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                    <div className="hidden xl:block text-left">
                                        <p className="text-xs text-slate-500">{user?.role === 'admin' ? 'Admin' : 'Welcome,'}</p>
                                        <p className="text-sm font-bold text-slate-800 leading-none">{user?.name || user?.email?.split('@')[0]}</p>
                                    </div>
                                </button>
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                                    <Link to={user?.role === 'admin' ? '/admin' : user?.role === 'pandit' ? '/pandit/dashboard' : '/dashboard'} className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-primary">Dashboard</Link>
                                    <Link to="/profile" className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-primary">Profile</Link>
                                    {user?.role === 'user' && <Link to="/user/wallet" className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-primary">Wallet</Link>}
                                    <hr className="my-1 border-slate-100" />
                                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50">Logout</button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link to="/login" className="text-sm font-semibold text-primary hover:text-orange-600 transition-colors">Login</Link>
                            <Link to="/register" className="bg-primary hover:bg-orange-600 text-white px-5 py-2 rounded-full text-sm font-bold transition-colors shadow-md shadow-orange-200">Register</Link>
                        </div>
                    )}

                    {/* Mobile menu button */}
                    <button className="lg:hidden p-2 rounded-full hover:bg-slate-100 text-slate-500" onClick={() => setMobileOpen(!mobileOpen)}>
                        <span className="material-symbols-outlined">{mobileOpen ? 'close' : 'menu'}</span>
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileOpen && !isAdmin && (
                <div className="lg:hidden mt-3 glass-panel rounded-2xl p-4 max-w-[1600px] mx-auto">
                    <nav className="flex flex-col gap-2">
                        <Link to="/" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-white/50 hover:text-primary">Home</Link>
                        <Link to="/pujas" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-white/50 hover:text-primary">Pujas</Link>
                        <Link to="/pandits" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-white/50 hover:text-primary">Pandits</Link>
                        <Link to="/astrology" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-white/50 hover:text-primary">Astrology</Link>
                        {user?.role === 'admin' && (
                            <Link to="/admin" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-xl text-sm font-bold text-primary bg-orange-50 hover:bg-orange-100 flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg">admin_panel_settings</span> Admin Panel
                            </Link>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
}
