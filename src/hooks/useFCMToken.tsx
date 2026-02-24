import { useEffect, useRef } from 'react';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { toast } from 'react-hot-toast';
import app from '@/config/firebase';
import api from '@/config/api';
import { useAuthStore } from '@/store/authStore';

export function useFCMToken() {
    const { user } = useAuthStore();
    const isRegistered = useRef(false);

    useEffect(() => {
        if (!user || isRegistered.current) return;

        const requestNotificationPermission = async () => {
            try {
                if (!('Notification' in window)) {
                    console.log('This browser does not support desktop notification');
                    return;
                }

                const permission = await Notification.requestPermission();

                if (permission === 'granted') {
                    const messaging = getMessaging(app);

                    const token = await getToken(messaging, {
                        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
                    });

                    if (token) {
                        try {
                            await api.put('/auth/profile', { fcm_token: token });
                            isRegistered.current = true;
                        } catch (e) {
                            console.error('Failed to sync FCM token', e);
                        }
                    }

                    // Listen for foreground messages
                    onMessage(messaging, (payload) => {
                        if (payload.notification) {
                            toast(
                                (t) => (
                                    <div className="flex flex-col gap-1 w-full relative">
                                        <button
                                            onClick={() => toast.dismiss(t.id)}
                                            className="absolute -top-1 -right-1 text-slate-400 hover:text-slate-600"
                                        >
                                            <span className="material-symbols-outlined text-[16px]">close</span>
                                        </button>
                                        <h4 className="font-bold text-slate-900 leading-tight pr-4">
                                            {payload.notification?.title}
                                        </h4>
                                        <p className="text-sm text-slate-600 truncate">
                                            {payload.notification?.body}
                                        </p>
                                    </div>
                                ),
                                { duration: 5000, style: { padding: '16px', minWidth: '300px' } }
                            );
                        }
                    });
                }
            } catch (error) {
                console.error('An error occurred while retrieving token. ', error);
            }
        };

        requestNotificationPermission();
    }, [user]);
}
