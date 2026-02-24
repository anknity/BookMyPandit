import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

const projectId = process.env.FIREBASE_PROJECT_ID || '';
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL || '';
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') || '';

const isConfigured = projectId && clientEmail && privateKey
    && !projectId.includes('your_')
    && !clientEmail.includes('your_')
    && !privateKey.includes('your_');

if (!admin.apps.length) {
    if (isConfigured) {
        try {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId,
                    clientEmail,
                    privateKey,
                }),
            });
            console.log('✅ Firebase Admin initialized successfully');
        } catch (error: any) {
            console.warn('⚠️ Firebase Admin init failed:', error.message);
            console.warn('  The server will start but Firebase auth verification will not work.');
            admin.initializeApp({ projectId: 'placeholder' });
        }
    } else {
        console.warn('⚠️ Firebase Admin credentials not configured.');
        console.warn('  Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY in .env');
        console.warn('  The server will start but Firebase auth verification will not work.');
        admin.initializeApp({ projectId: projectId || 'placeholder' });
    }
}

export const firebaseAdmin = admin;

let authInstance: admin.auth.Auth;
try {
    authInstance = admin.auth();
} catch {
    authInstance = admin.auth();
}
export const auth: admin.auth.Auth = authInstance;
