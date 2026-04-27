import { Link, NavLink, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useLanguageStore } from '@/store/languageStore';
import { useAuthStore } from '@/store/authStore';
import { logoutUser } from '@/services/authService';
import logo from '@/assets/logo.png';
import { NotificationBell } from '@/components/common/NotificationBell';

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { language, toggleLanguage } = useLanguageStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const isAdmin = location.pathname.startsWith('/admin');

  const navItems = [
    { label: 'Home', to: '/' },
    { label: 'Pujas', to: '/pujas' },
    { label: 'Pandits', to: '/pandits' },
    { label: 'Astrology', to: '/astrology' },
    { label: 'About', to: '/about' },
  ];

  const handleLogout = async () => {
    try {
      await logoutUser();
      logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <header className={cn("fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-4 transition-all duration-300", isAdmin ? "glass-panel m-4 rounded-xl border-b border-white/40" : "")}>
      <div className={cn("flex items-center justify-between mx-auto", isAdmin ? "w-full" : "max-w-[1600px] glass-panel rounded-full px-4 md:px-6 py-3")}>
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 group">
            <img src={logo} alt="BookMyPandit Logo" className="h-10 w-auto object-contain" />
            <h1 className="text-xl font-bold tracking-tight text-slate-800 hidden sm:block">
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
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-full leading-5 bg-white/80 text-slate-700 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-primary focus:border-opacity-50 focus:ring-1 focus:ring-primary sm:text-sm transition-all shadow-sm"
                  placeholder="Search pujas, pandits, or deities..."
                  type="text"
                />
              </form>
            </div>
          </div>
        )}

        <div className="flex items-center gap-4">
          {!isAdmin && (
            <nav className="hidden lg:flex items-center gap-2 mr-4 bg-white/60 border border-slate-200/70 rounded-full px-2 py-1.5">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => cn(
                    "px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border",
                    isActive
                      ? "text-primary bg-orange-50 border-orange-200 shadow-sm"
                      : "text-slate-600 bg-transparent border-transparent hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          )}

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 transition-all text-sm font-bold text-slate-700 border border-slate-200"
            title="Switch Language"
          >
            <span className={cn(language === 'en' ? "text-primary" : "text-slate-400")}>EN</span>
            <span className="text-slate-300">|</span>
            <span className={cn(language === 'hi' ? "text-primary" : "text-slate-400")}>HI</span>
          </button>

          <NotificationBell />

          <div className="h-8 w-[1px] bg-slate-200 mx-1 hidden sm:block"></div>

          {isAuthenticated ? (
            <Link to={isAdmin ? "/admin/profile" : "/profile"} className="flex items-center gap-3 pl-1 cursor-pointer group">
              <div className="size-9 rounded-full bg-cover bg-center border-2 border-primary/30 group-hover:border-primary transition-colors shadow-sm bg-slate-200 overflow-hidden">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary text-white font-bold text-sm">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="hidden xl:block text-left">
                <p className="text-xs text-slate-500">{isAdmin ? "Admin" : "Welcome,"}</p>
                <p className="text-sm font-bold text-slate-800 leading-none max-w-[100px] truncate">{user?.name || "User"}</p>
              </div>
            </Link>
          ) : (
            <Link to="/login" className="px-5 py-2 rounded-full bg-primary text-white font-bold text-sm hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
