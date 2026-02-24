import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

export function AdminSidebar() {
  const location = useLocation();

  const links = [
    { icon: 'dashboard', label: 'Dashboard', path: '/admin' },
    { icon: 'people', label: 'Users', path: '/admin/users' },
    { icon: 'group', label: 'Pandits', path: '/admin/pandits' },
    { icon: 'spa', label: 'Puja Services', path: '/admin/services' },
    { icon: 'calendar_month', label: 'Bookings', path: '/admin/bookings' },
    { icon: 'local_offer', label: 'Coupons', path: '/admin/coupons' },
    { icon: 'payments', label: 'Revenue', path: '/admin/revenue' },
    { icon: 'credit_card', label: 'Payments', path: '/admin/payments' },
    { icon: 'flag', label: 'Reports', path: '/admin/reports' },
    { icon: 'image', label: 'Homepage Banner', path: '/admin/banner' },
    { icon: 'settings', label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <aside className="w-72 h-[calc(100vh-116px)] glass-panel flex flex-col justify-between shrink-0 z-20 hidden md:flex rounded-2xl fixed left-4 top-[116px] overflow-y-auto">
      <div>
        <nav className="flex flex-col gap-1 px-4 py-6">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                location.pathname === link.path
                  ? "bg-gradient-to-r from-primary/10 to-transparent border-l-4 border-primary text-primary font-semibold"
                  : "text-slate-500 hover:bg-white/50 hover:text-primary"
              )}
            >
              <span className={cn("material-symbols-outlined group-hover:scale-110 transition-transform", location.pathname === link.path ? "text-primary" : "")}>
                {link.icon}
              </span>
              <span className="text-sm">{link.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-4 m-4 glass-panel rounded-xl flex items-center gap-3 cursor-pointer hover:shadow-md transition-shadow bg-white/40">
        <div className="bg-cover bg-center rounded-full w-10 h-10 border-2 border-white shadow-sm bg-slate-200" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBGmPLFfMAefuu-JSIOu3-QuczGWdV3osF2cmeJkHVoOSW8Q5dZl-bCDxBRWKpymkgMC2MA9RPBUZo_Dc0Zmn_56IMxzkzESGjbicEUNlcti6QtADDKBsz6mmJ42TcARRdmutv10O-3cwQOdLnzQE3CItKnNOsi_0DwTf2sGS3lM2wsut-kw2wwO02fMPpeuP5m482GEvh6xdu9hBTxXumyXQ_XOvTBUJ8lBGk8x8_V0wz5-h1rt9vD42VE0GRS6t6m6-AaBEg2lb8")' }}></div>
        <div className="flex flex-col">
          <p className="text-slate-800 text-sm font-bold">Rajesh Kumar</p>
          <p className="text-slate-500 text-xs">Super Admin</p>
        </div>
        <span className="material-symbols-outlined ml-auto text-slate-400 text-sm">expand_more</span>
      </div>
    </aside>
  );
}
