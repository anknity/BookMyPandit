import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    signInWithPhoneNumber,
    signOut,
    onAuthStateChanged,
    type User as FirebaseUser,
    type ConfirmationResult,
} from 'firebase/auth';
import { firebaseAuth, googleProvider, getRecaptchaVerifier } from '../config/firebase';
import api from '../config/api';

export async function loginWithEmail(email: string, password: string) {
    const result = await signInWithEmailAndPassword(firebaseAuth, email, password);
    return syncWithBackend(result.user);
}

export async function registerWithEmail(email: string, password: string, name: string, role: string = 'user') {
    const result = await createUserWithEmailAndPassword(firebaseAuth, email, password);
    const { data } = await api.post('/auth/register', {
        firebase_uid: result.user.uid,
        email: result.user.email,
        name,
        role,
    });
    return data.user;
}

export async function loginWithGoogle() {
    const result = await signInWithPopup(firebaseAuth, googleProvider);
    return syncWithBackend(result.user);
}

export async function sendPhoneOTP(phone: string, containerId: string = 'recaptcha-container'): Promise<ConfirmationResult> {
    const verifier = getRecaptchaVerifier(containerId);
    return signInWithPhoneNumber(firebaseAuth, phone, verifier);
}

export async function verifyPhoneOTP(confirmationResult: ConfirmationResult, otp: string) {
    const result = await confirmationResult.confirm(otp);
    return syncWithBackend(result.user);
}

async function syncWithBackend(firebaseUser: FirebaseUser) {
    const { data } = await api.post('/auth/login', {
        firebase_uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName || '',
        phone: firebaseUser.phoneNumber || '',
        avatar_url: firebaseUser.photoURL || '',
    });
    return data.user;
}

export async function logoutUser() {
    await signOut(firebaseAuth);
}

export async function getCurrentUser() {
    const { data } = await api.get('/auth/me');
    return data.user;
}

export function onAuthChange(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(firebaseAuth, callback);
}
