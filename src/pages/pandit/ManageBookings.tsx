import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { getPanditBookings, acceptPanditBooking, declinePanditBooking } from '@/services/panditService';

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

const statusColors: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    confirmed: 'bg-blue-100 text-blue-700',
    completed: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-red-100 text-red-700',
};

export function ManageBookings() {
    const [filter, setFilter] = useState('all');
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const fetchBookings = useCallback(async () => {
        try {
            const data = await getPanditBookings();
            setBookings(data || []);
        } catch (err) {
            console.error('Failed to fetch bookings:', err);
            setBookings([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchBookings(); }, [fetchBookings]);

    const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

    const handleAccept = async (id: string) => {
        setActionLoading(id);
        try {
            await acceptPanditBooking(id);
            await fetchBookings();
        } catch (err) {
            console.error('Accept failed:', err);
        } finally {
            setActionLoading(null);
        }
    };

    const handleDecline = async (id: string) => {
        setActionLoading(id);
        try {
            await declinePanditBooking(id);
            await fetchBookings();
        } catch (err) {
            console.error('Decline failed:', err);
        } finally {
            setActionLoading(null);
        }
    };

    const filterCounts: Record<string, number> = {
        all: bookings.length,
        pending: bookings.filter(b => b.status === 'pending').length,
        confirmed: bookings.filter(b => b.status === 'confirmed').length,
        completed: bookings.filter(b => b.status === 'completed').length,
        cancelled: bookings.filter(b => b.status === 'cancelled').length,
    };

    // Skeleton loader
    if (loading) {
        return (
            <div className="space-y-8 animate-pulse">
                <div>
                    <div className="h-8 w-48 bg-slate-200 rounded-xl mb-2" />
                    <div className="h-4 w-72 bg-slate-100 rounded-lg" />
                </div>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(i => (<div key={i} className="h-10 w-24 bg-slate-100 rounded-full" />))}
                </div>
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (<div key={i} className="h-36 bg-white rounded-2xl border border-slate-100" />))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 font-display">Manage Bookings</h2>
                <p className="text-slate-500 mt-1">Accept, manage, and track your bookings</p>
            </div>

            <div className="flex gap-2 overflow-x-auto hide-scrollbar">
                {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((tab) => (
                    <button key={tab} onClick={() => setFilter(tab)}
                        className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap capitalize flex items-center gap-2 ${filter === tab ? 'bg-primary text-white shadow-md shadow-orange-200' : 'bg-white text-slate-600 border border-slate-200 hover:border-primary/50'}`}>
                        {tab}
                        {filterCounts[tab] > 0 && (
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${filter === tab ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                {filterCounts[tab]}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {filtered.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
                    <div className="inline-flex p-4 rounded-full bg-slate-50 mb-4">
                        <span className="material-symbols-outlined text-4xl text-slate-300">event_busy</span>
                    </div>
                    <h4 className="text-lg font-bold text-slate-600 mb-2">No {filter === 'all' ? '' : filter} Bookings</h4>
                    <p className="text-slate-400 text-sm">
                        {filter === 'all' ? 'Your bookings will appear here when devotees book your services.' : `You don't have any ${filter} bookings right now.`}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((booking) => (
                        <div key={booking.id} className="bg-white rounded-2xl p-5 border border-slate-100/80 hover:shadow-md transition-shadow flex flex-col h-full">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h4 className="font-bold text-slate-900 text-lg line-clamp-1" title={booking.services?.name || 'Puja Service'}>{booking.services?.name || 'Puja Service'}</h4>
                                    <p className="text-sm text-slate-500 mt-1 line-clamp-1" title={booking.users?.name || 'Devotee'}>by {booking.users?.name || 'Devotee'}</p>
                                </div>
                                <span className={cn("px-3 py-1 rounded-full text-xs font-bold capitalize shrink-0", statusColors[booking.status] || 'bg-slate-100 text-slate-600')}>
                                    {booking.status}
                                </span>
                            </div>

                            <div className="space-y-3 text-sm flex-1">
                                <div className="flex items-center gap-3 text-slate-600">
                                    <span className="material-symbols-outlined text-[18px] text-primary/70">event</span>
                                    <span>{new Date(booking.date || booking.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                </div>
                                {booking.time_slot && (
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <span className="material-symbols-outlined text-[18px] text-primary/70">schedule</span>
                                        <span className="capitalize">{booking.time_slot.replace(/_/g, ' ')}</span>
                                    </div>
                                )}
                                {booking.address && (
                                    <div className="flex items-start gap-3 text-slate-600">
                                        <span className="material-symbols-outlined text-[18px] text-primary/70 mt-0.5">location_on</span>
                                        <span className="line-clamp-2" title={booking.address}>{booking.address}</span>
                                    </div>
                                )}
                                {booking.users?.phone && (
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <span className="material-symbols-outlined text-[18px] text-primary/70">call</span>
                                        <span>{booking.users.phone}</span>
                                    </div>
                                )}
                            </div>

                            <div className="mt-5 pt-4 border-t border-slate-100">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-sm font-medium text-slate-500">Amount</span>
                                    <span className="text-lg font-bold text-slate-900">₹{(booking.total_amount || 0).toLocaleString()}</span>
                                </div>

                                {booking.status === 'pending' && (
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleAccept(booking.id)}
                                            disabled={actionLoading === booking.id}
                                            className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 border border-emerald-200 disabled:opacity-50">
                                            {actionLoading === booking.id ? (
                                                <span className="size-4 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                                            ) : (
                                                <span className="material-symbols-outlined text-lg">check</span>
                                            )}
                                            Accept
                                        </button>
                                        <button
                                            onClick={() => handleDecline(booking.id)}
                                            disabled={actionLoading === booking.id}
                                            className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 border border-red-200 disabled:opacity-50">
                                            <span className="material-symbols-outlined text-lg">close</span>
                                            Decline
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
