import { Link } from 'react-router-dom';

export function UserDashboard() {
  return (
    <div className="flex h-full w-full flex-col md:flex-row gap-6">
      <aside className="hidden md:flex w-64 flex-col glass-panel rounded-2xl h-[calc(100vh-8rem)] sticky top-24 pt-6 pb-6 px-4">
        <div className="flex flex-col gap-2 mt-4">
          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/60 text-slate-600 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-medium">Overview</span>
          </Link>
          <Link to="/dashboard/bookings" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-primary/10 to-transparent text-primary font-bold border-l-4 border-primary shadow-sm">
            <span className="material-symbols-outlined">event_note</span>
            <span>My Bookings</span>
          </Link>
          <Link to="/temples" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/60 text-slate-600 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">temple_hindu</span>
            <span>Temples</span>
          </Link>
          <Link to="/pandits" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/60 text-slate-600 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">person</span>
            <span>Pandits</span>
          </Link>
        </div>
        <div className="mt-auto">
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/60 text-slate-600 hover:text-red-500 transition-colors w-full text-left">
            <span className="material-symbols-outlined">logout</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>
      
      <div className="flex-1 flex flex-col gap-6">
        <div className="flex justify-center mb-4">
          <div className="glass-card p-1.5 rounded-full inline-flex relative bg-white/40">
            <button className="relative z-10 px-8 py-2 text-sm font-bold text-slate-800 rounded-full focus:outline-none bg-white shadow-sm transition-colors duration-300">
              Upcoming
            </button>
            <button className="relative z-10 px-8 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 rounded-full focus:outline-none transition-colors duration-300">
              Past
            </button>
          </div>
        </div>
        
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-800 px-1">Upcoming Ceremonies</h2>
          
          <div className="glass-card rounded-3xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/50 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
            <div className="flex flex-col md:flex-row gap-6 relative z-10">
              <div className="flex-shrink-0">
                <div className="h-24 w-24 md:h-32 md:w-32 rounded-2xl overflow-hidden shadow-lg border-2 border-white/50">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEpvhMnZmtqeSJEVKF-GC795CtnlOPCceKuMkTVqw1FlbQTYWWQLKZG2zjFUXHdWoVQep0PKAPqJxCmSoEI3v7al3dEwiU63Wjqs1R1q8rSKhqbMHJsca5n1zdVarQ8ALUoVGkJ0o6OHR_RpwClLhjNz4mCeKP0eJlBc7R69jB36bPlrAifYgyhgUvqroK8gaeSptMyyq0aGedDUuj6NHWpg9qjIOR13vF-kqJrFcwiUWWq0C_nc_YkIi_mQgbJn6jcul7PS_WsIE" alt="Rudrabhishek" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-secondary text-xs font-bold mb-2 border border-blue-100">Video Call Puja</span>
                      <h3 className="text-xl md:text-2xl font-bold text-slate-800">Maha Rudrabhishek</h3>
                      <p className="text-slate-500 text-sm mt-1">For peace, prosperity, and removal of obstacles.</p>
                    </div>
                    <div className="text-right hidden sm:block">
                      <div className="text-3xl font-bold text-secondary font-display">02:14:50</div>
                      <div className="text-xs text-slate-400 font-medium uppercase tracking-wide">Time Remaining</div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-secondary to-blue-600 text-white font-bold shadow-lg hover:shadow-xl transition-all text-sm flex items-center justify-center gap-2">
                    <span>Join Video Room</span>
                    <span className="material-symbols-outlined text-[18px]">videocam</span>
                  </button>
                  <button className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-white text-slate-700 font-semibold border border-slate-200 hover:bg-slate-50 transition-all text-sm shadow-sm">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="glass-card rounded-3xl p-6 relative overflow-hidden group">
             {/* Second card content */}
             <div className="flex flex-col md:flex-row gap-6 relative z-10">
              <div className="flex-shrink-0">
                <div className="h-24 w-24 md:h-32 md:w-32 rounded-2xl overflow-hidden shadow-lg border-2 border-white/50">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCX-d1msSOIkHt1S4JxMukvD08aWfnj_7rEnbdEs47C5dO4t9JwHlx1a-R0AQzav2Zjoey-hoOqHh-FVeuQuyvk0wz0_68_AFKpNq1vIEAis6IxNhtNLo_OJH0k9y4vJNhndBU3uoIXAS29czzXzDMF_qDMQZYWyhxU_TmwKtvRNVaegpEeaYcF7-FpeehgTZB-ZL3wdSiyYl9dyn-h1aGsXv472aK-Qk29yNEMjh0W0930Xf96SwxhymkwGv0eOjjaA-RYCqm3q0A" alt="Griha Pravesh" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="inline-block px-3 py-1 rounded-full bg-orange-50 text-primary text-xs font-bold mb-2 border border-orange-100">On-Site Puja</span>
                      <h3 className="text-xl md:text-2xl font-bold text-slate-800">Griha Pravesh Ceremony</h3>
                      <p className="text-slate-500 text-sm mt-1">New home blessing ritual with 3 pandits.</p>
                    </div>
                    <div className="text-right hidden sm:block">
                      <div className="text-3xl font-bold text-secondary font-display text-primary">2 Days</div>
                      <div className="text-xs text-slate-400 font-medium uppercase tracking-wide">To Go</div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-orange-600 text-white font-bold shadow-lg hover:shadow-xl transition-all text-sm flex items-center justify-center gap-2">
                    <span>View Requirements</span>
                    <span className="material-symbols-outlined text-[18px]">list_alt</span>
                  </button>
                  <button className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-white text-slate-700 font-semibold border border-slate-200 hover:bg-slate-50 transition-all text-sm shadow-sm">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <aside className="w-full lg:w-80 flex flex-col gap-6 flex-shrink-0">
        <div className="glass-card rounded-3xl p-6 bg-white/70 backdrop-blur-xl relative">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800">Booking Summary</h3>
            <button className="text-primary text-sm font-medium hover:underline">View Report</button>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white/50 rounded-2xl p-4 border border-white flex flex-col items-center justify-center text-center shadow-sm">
              <span className="text-3xl font-bold text-slate-800">12</span>
              <span className="text-xs text-slate-500 font-medium mt-1">Pujas Completed</span>
            </div>
            <div className="bg-white/50 rounded-2xl p-4 border border-white flex flex-col items-center justify-center text-center shadow-sm">
              <span className="text-3xl font-bold text-secondary">8</span>
              <span className="text-xs text-slate-500 font-medium mt-1">Pandits Connected</span>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-slate-200/60">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-5 text-white shadow-xl">
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary blur-2xl opacity-40"></div>
              <p className="relative z-10 text-xs text-slate-300 font-medium uppercase tracking-wider mb-2">Next Milestone</p>
              <h4 className="relative z-10 text-lg font-bold mb-3">Devotee Level 2</h4>
              <div className="relative z-10 w-full bg-white/20 h-1.5 rounded-full overflow-hidden mb-2">
                <div className="bg-primary h-full w-[70%] shadow-[0_0_10px_rgba(255,106,0,0.8)]"></div>
              </div>
              <p className="relative z-10 text-[10px] text-slate-400">3 more bookings to reach Gold Status</p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
