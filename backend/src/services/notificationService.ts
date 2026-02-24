import { supabase } from '../config/supabaseClient.js';
import { logger } from '../server.js';
import { sendPushNotification } from './firebaseService.js';

export async function createNotification(userId: string, title: string, message: string, type: string = 'general') {
    const { data, error } = await supabase
        .from('notifications')
        .insert({ user_id: userId, title, message, type })
        .select()
        .single();

    if (error) {
        logger.error('Failed to create notification:', error);
        return null;
    }

    // Attempt to send push notification
    const { data: user } = await supabase
        .from('users')
        .select('fcm_token')
        .eq('id', userId)
        .single();

    if (user && user.fcm_token) {
        await sendPushNotification(user.fcm_token, title, message, { type });
    }

    return data;
}

export async function broadcastNotification(title: string, message: string, targetRole?: string) {
    let query = supabase.from('users').select('id, fcm_token');
    if (targetRole) {
        query = query.eq('role', targetRole);
    }

    const { data: users } = await query;
    if (!users || users.length === 0) return;

    const notifications = users.map(u => ({
        user_id: u.id,
        title,
        message,
        type: 'broadcast',
    }));

    const { error } = await supabase.from('notifications').insert(notifications);
    if (error) {
        logger.error('Failed to broadcast notification db save:', error);
    }

    // Send Firebase multicast push notification
    const fcmTokens = users
        .map(u => u.fcm_token)
        .filter((token): token is string => Boolean(token));

    if (fcmTokens.length > 0) {
        import('./firebaseService.js').then(({ sendMulticastNotification }) => {
            sendMulticastNotification(fcmTokens, title, message);
        });
    }
}
