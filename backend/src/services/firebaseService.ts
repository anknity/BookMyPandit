import { firebaseAdmin } from '../config/firebaseAdmin.js';
import { logger } from '../server.js';

export async function sendPushNotification(token: string, title: string, body: string, data?: Record<string, string>) {
    try {
        await firebaseAdmin.messaging().send({
            token,
            notification: { title, body },
            data,
        });
        logger.info(`Push notification sent: ${title}`);
    } catch (error) {
        logger.error('Failed to send push notification:', error);
    }
}

export async function sendMulticastNotification(tokens: string[], title: string, body: string) {
    if (tokens.length === 0) return;
    try {
        await firebaseAdmin.messaging().sendEachForMulticast({
            tokens,
            notification: { title, body },
        });
        logger.info(`Multicast notification sent to ${tokens.length} devices`);
    } catch (error) {
        logger.error('Failed to send multicast notification:', error);
    }
}
