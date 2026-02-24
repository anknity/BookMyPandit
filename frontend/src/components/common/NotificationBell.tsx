import { useState, useEffect, useRef, useCallback } from 'react';
import { formatDistanceToNow } from 'date-fns';
import api from '@/config/api';

interface Notification {
    id: string;
    title: string;
    message: string;
    type: string;
    is_read: boolean;
    created_at: string;
}

const TYPE_ICON: Record<string, string> = {
    booking: 'calendar_month',
    approval: 'verified',
    broadcast: 'campaign',
    general: 'info',
};

import { useAuthStore } from '@/store/authStore';

export function NotificationBell() {
    const { user } = useAuthStore();
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter((n) => !n.is_read).length;

    const fetchNotifications = useCallback(async () => {
        if (!user) return; // Don't fetch if not logged in
        try {
            setLoading(true);
            const res = await api.get('/user/notifications');
            setNotifications(res.data.notifications ?? []);
        } catch {
            // silently fail — user might not be logged in
        } finally {
            setLoading(false);
        }
    }, [user]);

    // Fetch on mount, then poll every 60 s
    useEffect(() => {
        if (!user) {
            setNotifications([]);
            return;
        }
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 60_000);
        return () => clearInterval(interval);
    }, [fetchNotifications, user]);

    // Close on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleOpen = async () => {
        setOpen((prev) => !prev);
        // Mark all as read when opening
        if (!open && unreadCount > 0) {
            try {
                await api.patch('/user/notifications/read', {});
                setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
            } catch { /* silent */ }
        }
    };

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={handleOpen}
                className="relative p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-500 hover:text-primary"
                aria-label="Notifications"
            >
                <span className="material-symbols-outlined">notifications</span>
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 min-w-[8px] h-2 bg-red-500 rounded-full border border-white flex items-center justify-center">
                        {unreadCount > 9 ? (
                            <span className="text-[8px] text-white font-bold px-0.5">9+</span>
                        ) : null}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                        <h3 className="font-bold text-slate-800 text-sm">Notifications</h3>
                        {unreadCount > 0 && (
                            <span className="text-xs text-primary font-medium">{unreadCount} new</span>
                        )}
                    </div>

                    {/* List */}
                    <ul className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                        {loading && (
                            <li className="px-4 py-6 text-center text-sm text-slate-400">Loading…</li>
                        )}
                        {!loading && notifications.length === 0 && (
                            <li className="px-4 py-10 flex flex-col items-center gap-2 text-slate-400">
                                <span className="material-symbols-outlined text-4xl">notifications_off</span>
                                <p className="text-sm">No notifications yet</p>
                            </li>
                        )}
                        {!loading && notifications.map((n) => (
                            <li
                                key={n.id}
                                className={`flex items-start gap-3 px-4 py-3 transition-colors ${n.is_read ? 'bg-white' : 'bg-orange-50'}`}
                            >
                                <div className={`mt-0.5 size-8 rounded-full flex-shrink-0 flex items-center justify-center ${n.is_read ? 'bg-slate-100 text-slate-400' : 'bg-primary/10 text-primary'}`}>
                                    <span className="material-symbols-outlined text-[18px]">
                                        {TYPE_ICON[n.type] ?? 'info'}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-slate-800 leading-snug">{n.title}</p>
                                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.message}</p>
                                    <p className="text-[10px] text-slate-400 mt-1">
                                        {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
