import { useState, useEffect } from 'react';
import { BookingCard } from '@/components/user/BookingCard';
import api from '@/config/api';

const TABS = ['All', 'Upcoming', 'Completed', 'Cancelled'];

export function BookingHistory() {
    const [activeTab, setActiveTab] = useState('All');
    const [bookings, setBookings] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const { data } = await api.get('/bookings');
                setBookings(data.bookings || []);
            } catch (error) {
                console.error('Failed to fetch bookings:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBookings();
    }, []);

    const filteredBookings = bookings.filter(b => {
        if (activeTab === 'All') return true;
        if (activeTab === 'Upcoming') return ['pending', 'confirmed', 'in_progress'].includes(b.status);
        return b.status === activeTab.toLowerCase();
    });

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 font-display">Booking History</h2>
                <p className="text-slate-500 mt-1">View and manage your bookings</p>
            </div>

            <div className="flex gap-2 overflow-x-auto hide-scrollbar">
                {TABS.map((tab) => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                        className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab ? 'bg-primary text-white shadow-md shadow-orange-200' : 'bg-white text-slate-600 border border-slate-200 hover:border-primary/50'}`}>
                        {tab}
                    </button>
                ))}
            </div>

            <div className="space-y-4">
                {isLoading ? (
                    <div className="text-center py-16 text-slate-500">Loading your bookings...</div>
                ) : filteredBookings.length === 0 ? (
                    <div className="text-center py-16">
                        <span className="material-symbols-outlined text-5xl text-slate-300 mb-3 block">event_busy</span>
                        <p className="text-slate-500">No bookings found</p>
                    </div>
                ) : (
                    filteredBookings.map((b) => (
                        <BookingCard
                            key={b.id}
                            id={b.id}
                            serviceName={b.services?.name || 'Puja Service'}
                            panditName={b.pandits?.users?.name || 'Assigned Pandit'}
                            date={new Date(b.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                            status={b.status}
                            amount={`₹${Number(b.total_amount).toLocaleString('en-IN')}`}
                            imageUrl={b.services?.image_url}
                            timeSlot={b.time_slot}
                            paymentMethod={b.payment_method}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
