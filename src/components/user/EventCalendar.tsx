import React, { useState, useEffect } from 'react';
import api from '@/config/api';
import { format, isThisMonth, addMonths, isSameMonth, parseISO } from 'date-fns';

interface Event {
    id: string;
    date: string; // ISO string
    title: string;
    time: string;
    status: string;
}

export function EventCalendar() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMonth, setViewMonth] = useState<'current' | 'next'>('current');

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                // Assuming /bookings returns user's bookings
                const { data } = await api.get('/bookings');
                if (data.bookings) {
                    const upcoming = data.bookings
                        .filter((b: any) => b.status === 'confirmed' || b.status === 'pending')
                        .map((b: any) => ({
                            id: b.id,
                            date: b.scheduled_date || b.created_at, // Use created_at as fallback if no scheduled date
                            title: b.services?.name || 'Vedic Ritual',
                            time: b.scheduled_time || '10:00 AM',
                            status: b.status
                        }));
                    setEvents(upcoming);
                }
            } catch (error) {
                console.error("Failed to fetch events", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const today = new Date();
    const targetMonth = viewMonth === 'current' ? today : addMonths(today, 1);

    // Filter events for the selected month
    const monthEvents = events.filter(e => isSameMonth(parseISO(e.date), targetMonth))
        // Sort by date ascending
        .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());

    return (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm mt-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100 shrink-0">
                        <span className="material-symbols-outlined text-blue-500">calendar_month</span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 leading-tight">Upcoming Events</h2>
                </div>
                {/* Month Toggle */}
                <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-200">
                    <button
                        onClick={() => setViewMonth('current')}
                        className={`text-xs font-bold px-3 py-1.5 rounded-md transition-all ${viewMonth === 'current' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        This Month
                    </button>
                    <button
                        onClick={() => setViewMonth('next')}
                        className={`text-xs font-bold px-3 py-1.5 rounded-md transition-all ${viewMonth === 'next' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Next Month
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-6 text-slate-400 animate-pulse">Loading events...</div>
                ) : monthEvents.length === 0 ? (
                    <div className="bg-slate-50 rounded-2xl p-8 text-center border border-dashed border-slate-200 flex flex-col items-center">
                        <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">event_busy</span>
                        <p className="text-slate-500 font-medium text-sm">No pujas scheduled for {format(targetMonth, 'MMMM')}.</p>
                        <button className="mt-4 text-primary text-sm font-bold hover:underline">Book a Puja</button>
                    </div>
                ) : (
                    monthEvents.map(event => {
                        const evtDate = parseISO(event.date);
                        return (
                            <div key={event.id} className="flex gap-4 items-center p-4 rounded-2xl border border-slate-100 hover:border-orange-200 hover:shadow-sm transition-all group">
                                <div className="bg-orange-50 w-14 h-14 rounded-xl flex flex-col items-center justify-center border border-orange-100 shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                                    <span className="text-xs font-bold uppercase text-orange-600 group-hover:text-white/80">{format(evtDate, 'MMM')}</span>
                                    <span className="text-xl font-black text-orange-600 group-hover:text-white leading-tight">{format(evtDate, 'dd')}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-slate-800 truncate text-[15px]">{event.title}</h4>
                                    <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                                        {event.time}
                                    </p>
                                </div>
                                <div>
                                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${event.status === 'confirmed' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-yellow-100 text-yellow-700 border border-yellow-200'}`}>
                                        {event.status}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {!loading && monthEvents.length > 0 && (
                <button className="w-full mt-4 py-3 text-sm font-bold text-primary hover:bg-orange-50 rounded-xl transition-colors">
                    View Full Calendar
                </button>
            )}
        </div>
    );
}
