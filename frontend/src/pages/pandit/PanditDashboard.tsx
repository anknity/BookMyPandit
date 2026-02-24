import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { getPanditDashboardStats, getPanditBookings } from '@/services/panditService';

interface DashboardStats {
    totalBookings: number;
    pendingBookings: number;
    confirmedBookings: number;
    completedBookings: number;
    cancelledBookings: number;
    rating: number;
    totalEarnings: number;
    thisMonthEarnings: number;
    pendingPayouts: number;
}

interface Booking {
    id: string;
    status: string;
    date: string;
    time_slot: string;
    total_amount: number;
    address: string;
    created_at: string;
    services?: { name: string; image_url?: string };
    users?: { name: string; avatar_url?: string; phone?: string };
}

export function PanditDashboard() {
    const { user } = useAuthStore();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const [statsData, bookingsData] = await Promise.all([
                    getPanditDashboardStats(),
                    getPanditBookings(),
                ]);
                setStats(statsData);
                setBookings(bookingsData || []);
            } catch (err) {
                console.error('Dashboard fetch error:', err);
                // Set empty defaults for new pandits
                setStats({
                    totalBookings: 0, pendingBookings: 0, confirmedBookings: 0,
                    completedBookings: 0, cancelledBookings: 0, rating: 0,
                    totalEarnings: 0, thisMonthEarnings: 0, pendingPayouts: 0,
                });
                setBookings([]);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const recentBookings = bookings.slice(0, 5);
    const statCards = stats ? [
        { label: 'Total Bookings', value: stats.totalBookings.toString(), icon: 'calendar_month', gradient: 'from-blue-500 to-blue-600', bg: 'bg-blue-50', iconColor: 'text-blue-600' },
        { label: 'Pending', value: stats.pendingBookings.toString(), icon: 'pending_actions', gradient: 'from-amber-500 to-amber-600', bg: 'bg-amber-50', iconColor: 'text-amber-600' },
        { label: 'Rating', value: stats.rating > 0 ? stats.rating.toFixed(1) : '—', icon: 'star', gradient: 'from-orange-500 to-orange-600', bg: 'bg-orange-50', iconColor: 'text-orange-600' },
        { label: 'Completed', value: stats.completedBookings.toString(), icon: 'check_circle', gradient: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
    ] : [];

    const statusColors: Record<string, string> = {
        pending: 'bg-amber-100 text-amber-700',
        confirmed: 'bg-blue-100 text-blue-700',
        completed: 'bg-emerald-100 text-emerald-700',
        cancelled: 'bg-red-100 text-red-700',
    };

    // Skeleton loader
    if (loading) {
        return (
            <div className="space-y-8 animate-pulse">
                {/* Welcome skeleton */}
                <div className="rounded-3xl bg-gradient-to-r from-orange-100 to-amber-50 p-8">
                    <div className="h-8 w-64 bg-orange-200/60 rounded-xl mb-3" />
                    <div className="h-4 w-48 bg-orange-200/40 rounded-lg" />
                </div>
                {/* Stat cards skeleton */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="rounded-2xl bg-white border border-slate-100 p-5">
                            <div className="h-10 w-10 rounded-xl bg-slate-100 mb-3" />
                            <div className="h-3 w-16 bg-slate-100 rounded mb-2" />
                            <div className="h-7 w-12 bg-slate-100 rounded" />
                        </div>
                    ))}
                </div>
                {/* Earnings skeleton */}
                <div className="rounded-2xl bg-white border border-slate-100 p-6">
                    <div className="h-5 w-40 bg-slate-100 rounded mb-4" />
                    <div className="grid grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="rounded-xl bg-slate-50 p-4">
                                <div className="h-3 w-20 bg-slate-100 rounded mb-2" />
                                <div className="h-7 w-24 bg-slate-100 rounded" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Welcome Banner */}
            <div className="relative rounded-3xl bg-gradient-to-br from-orange-500 via-amber-500 to-primary p-8 text-white overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-14 -mt-14" />
                <div className="absolute bottom-0 left-1/2 w-32 h-32 bg-white/5 rounded-full -mb-16" />
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                            <span className="material-symbols-outlined text-2xl">waving_hand</span>
                        </div>
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold font-display">
                                Namaste, {user?.name?.split(' ')[0] || 'Pandit Ji'}!
                            </h2>
                            <p className="text-white/80 text-sm mt-0.5">Here's your dashboard overview</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {statCards.map((stat) => (
                    <div key={stat.label} className="group bg-white rounded-2xl p-5 border border-slate-100/80 hover:shadow-lg hover:shadow-slate-100/80 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                        <div className={`absolute top-0 right-0 w-20 h-20 rounded-full ${stat.bg} -mr-6 -mt-6 opacity-60 group-hover:scale-125 transition-transform duration-500`} />
                        <div className={`inline-flex p-2.5 rounded-xl ${stat.bg} mb-3 relative z-10`}>
                            <span className={`material-symbols-outlined ${stat.iconColor} text-xl`}>{stat.icon}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1 relative z-10">{stat.label}</p>
                        <p className="text-2xl font-black text-slate-900 font-display relative z-10">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Earnings Summary */}
            {stats && (
                <div className="bg-white rounded-2xl p-6 border border-slate-100/80 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
                        <span className="material-symbols-outlined text-emerald-600">account_balance_wallet</span>
                        Earnings Overview
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl p-4 border border-emerald-200/40">
                            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Total Earnings</p>
                            <p className="text-xl md:text-2xl font-black text-emerald-700 mt-1">₹{stats.totalEarnings.toLocaleString()}</p>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-4 border border-blue-200/40">
                            <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">This Month</p>
                            <p className="text-xl md:text-2xl font-black text-blue-700 mt-1">₹{stats.thisMonthEarnings.toLocaleString()}</p>
                        </div>
                        <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl p-4 border border-amber-200/40">
                            <p className="text-[10px] text-amber-600 font-bold uppercase tracking-widest">Pending</p>
                            <p className="text-xl md:text-2xl font-black text-amber-700 mt-1">₹{stats.pendingPayouts.toLocaleString()}</p>
                        </div>
                        <div className="bg-gradient-to-br from-violet-50 to-violet-100/50 rounded-xl p-4 border border-violet-200/40">
                            <p className="text-[10px] text-violet-600 font-bold uppercase tracking-widest">Completed</p>
                            <p className="text-xl md:text-2xl font-black text-violet-700 mt-1">{stats.completedBookings}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Recent Bookings */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <span className="material-symbols-outlined text-blue-600">event_note</span>
                        Recent Bookings
                    </h3>
                    {bookings.length > 0 && (
                        <Link to="/pandit/bookings" className="text-primary text-sm font-bold hover:text-orange-600 transition-colors flex items-center gap-1">
                            View all <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </Link>
                    )}
                </div>

                {recentBookings.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
                        <div className="inline-flex p-4 rounded-full bg-orange-50 mb-4">
                            <span className="material-symbols-outlined text-4xl text-primary">calendar_month</span>
                        </div>
                        <h4 className="text-lg font-bold text-slate-700 mb-2">No Bookings Yet</h4>
                        <p className="text-slate-400 text-sm max-w-sm mx-auto">
                            Your bookings will appear here once devotees start booking your services. Make sure your profile is complete!
                        </p>
                        <Link to="/pandit/profile" className="inline-flex items-center gap-2 mt-5 px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200">
                            <span className="material-symbols-outlined text-lg">edit</span>
                            Complete Profile
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {recentBookings.map((booking) => (
                            <div key={booking.id} className="bg-white rounded-2xl p-4 border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 rounded-xl bg-orange-50 shrink-0 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-primary text-xl">temple_hindu</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <h4 className="font-bold text-slate-900 truncate text-sm">
                                                {booking.services?.name || 'Puja Service'}
                                            </h4>
                                            <p className="text-xs text-slate-400 mt-0.5">
                                                by {booking.users?.name || 'Devotee'} • {new Date(booking.date || booking.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </p>
                                        </div>
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ${statusColors[booking.status] || 'bg-slate-100 text-slate-600'}`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-sm font-bold text-slate-900 shrink-0">
                                    ₹{(booking.total_amount || 0).toLocaleString()}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
