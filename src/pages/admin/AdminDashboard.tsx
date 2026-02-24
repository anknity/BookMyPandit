import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '@/config/api';

export function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/admin/dashboard');
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprovePandit = async (id: string) => {
    try {
      await api.put(`/pandits/${id}/status`, { status: 'active' });
      fetchStats(); // Refresh
    } catch (error) {
      console.error('Error approving pandit:', error);
    }
  };

  if (loading) {
    return <div className="p-10 text-center text-slate-500">Loading dashboard...</div>;
  }

  if (!stats) return null;

  return (
    <div className="flex-1 min-w-0 pb-10">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="glass-panel p-6 rounded-2xl flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300 shadow-sm hover:shadow-md border-l-4 border-l-blue-500">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
            <span className="material-symbols-outlined text-2xl">group</span>
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Total Users</p>
            <h3 className="text-2xl font-bold text-slate-800">{stats.totalUsers}</h3>
            {/* <p className="text-green-500 text-xs font-bold flex items-center mt-1">
              <span className="material-symbols-outlined text-xs mr-0.5">trending_up</span> +12%
            </p> */}
          </div>
        </div>
        <div className="glass-panel p-6 rounded-2xl flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300 shadow-sm hover:shadow-md border-l-4 border-l-saffron">
          <div className="p-3 bg-orange-100 text-saffron rounded-xl">
            <span className="material-symbols-outlined text-2xl">temple_hindu</span>
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Active Pandits</p>
            <h3 className="text-2xl font-bold text-slate-800">{stats.totalPandits}</h3>
            <p className="text-slate-400 text-xs font-medium mt-1">
              {stats.recentPendingPandits?.length || 0} pending approvals
            </p>
          </div>
        </div>
        <div className="glass-panel p-6 rounded-2xl flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300 shadow-sm hover:shadow-md border-l-4 border-l-purple-500">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
            <span className="material-symbols-outlined text-2xl">event_available</span>
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Bookings Today</p>
            <h3 className="text-2xl font-bold text-slate-800">{stats.bookingsToday}</h3>
            <p className="text-slate-500 text-xs mt-1">Total: {stats.totalBookings}</p>
          </div>
        </div>
        <div className="glass-panel p-6 rounded-2xl flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300 shadow-sm hover:shadow-md border-l-4 border-l-green-500">
          <div className="p-3 bg-green-100 text-green-600 rounded-xl">
            <span className="material-symbols-outlined text-2xl">payments</span>
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Revenue (Today)</p>
            <h3 className="text-2xl font-bold text-slate-800">₹{(stats.revenueToday || 0).toLocaleString('en-IN')}</h3>
            <p className="text-slate-500 text-xs mt-1">Total: ₹{(stats.totalRevenue || 0).toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Bookings */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="glass-panel rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800">Recent Bookings</h3>
              <Link to="/admin/bookings" className="text-primary text-sm font-semibold hover:underline">View All</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-slate-100">
                    <th className="pb-3 font-semibold pl-2">User</th>
                    <th className="pb-3 font-semibold">Service</th>
                    <th className="pb-3 font-semibold">Date</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right pr-2">Amount</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-slate-600">
                  {stats.recentBookings?.length === 0 ? (
                    <tr><td colSpan={5} className="py-4 text-center text-slate-400">No recent bookings</td></tr>
                  ) : (
                    stats.recentBookings?.map((booking: any) => (
                      <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0 group">
                        <td className="py-4 font-medium text-slate-800 pl-2">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs text-slate-500">
                              {booking.users?.name?.charAt(0)}
                            </div>
                            {booking.users?.name}
                          </div>
                        </td>
                        <td className="py-4">{booking.services?.name}</td>
                        <td className="py-4">{new Date(booking.booking_date).toLocaleDateString()}</td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold capitalize
                              ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                              booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                booking.status === 'completed' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100'}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="py-4 text-right font-bold text-slate-800 pr-2">₹{booking.amount}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Quick Actions & Notifications */}
        <div className="flex flex-col gap-8">
          <div className="glass-panel rounded-2xl p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/admin/pandits" className="p-4 rounded-xl bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-colors flex flex-col items-center justify-center gap-2 text-primary">
                <span className="material-symbols-outlined text-2xl">person_add</span>
                <span className="text-xs font-bold">Pandits</span>
              </Link>
              <Link to="/admin/services/new" className="p-4 rounded-xl bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-colors flex flex-col items-center justify-center gap-2 text-blue-600">
                <span className="material-symbols-outlined text-2xl">post_add</span>
                <span className="text-xs font-bold">New Service</span>
              </Link>
              <button className="p-4 rounded-xl bg-green-50 border border-green-100 hover:bg-green-100 transition-colors flex flex-col items-center justify-center gap-2 text-green-600">
                <span className="material-symbols-outlined text-2xl">campaign</span>
                <span className="text-xs font-bold">Broadcast</span>
              </button>
              <button className="p-4 rounded-xl bg-purple-50 border border-purple-100 hover:bg-purple-100 transition-colors flex flex-col items-center justify-center gap-2 text-purple-600">
                <span className="material-symbols-outlined text-2xl">analytics</span>
                <span className="text-xs font-bold">Reports</span>
              </button>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-6 flex-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800">Pending Approvals</h3>
              {stats.recentPendingPandits?.length > 0 && (
                <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">{stats.recentPendingPandits.length} New</span>
              )}
            </div>
            <div className="space-y-4">
              {stats.recentPendingPandits?.length === 0 ? (
                <div className="text-sm text-slate-500 text-center py-4">No pending approvals</div>
              ) : (
                stats.recentPendingPandits?.map((pandit: any) => (
                  <div key={pandit.id} className="flex items-start gap-3 p-3 rounded-xl bg-white/50 border border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0 overflow-hidden">
                      {pandit.users?.avatar_url ? (
                        <img src={pandit.users.avatar_url} alt="Pandit" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold">
                          {pandit.users?.name?.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-800">{pandit.users?.name}</p>
                      <p className="text-xs text-slate-500 mb-2">{pandit.city}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprovePandit(pandit.id)}
                          className="px-3 py-1 rounded-lg bg-green-500 text-white text-xs font-bold hover:bg-green-600 transition-colors"
                        >
                          Approve
                        </button>
                        <Link to={`/admin/pandits`} className="px-3 py-1 rounded-lg bg-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-300 transition-colors">
                          Review
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
