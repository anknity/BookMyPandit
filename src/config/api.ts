import axios from 'axios';
import { firebaseAuth } from './firebase';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://bookmypandit-backend.onrender.com/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    headers: { 'Content-Type': 'application/json' },
});

// Attach Firebase token to every request
api.interceptors.request.use(async (config) => {
    try {
        const user = firebaseAuth.currentUser;
        if (user) {
            const token = await user.getIdToken();
            config.headers.Authorization = `Bearer ${token}`;
        }
    } catch (error) {
        console.warn('Failed to get auth token:', error);
    }
    return config;
});

// Response error handler
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Don't redirect if already on auth pages (prevents redirect loop)
            const path = window.location.pathname;
            const isAuthEndpoint = error.config?.url?.includes('/auth/me');
            if (path !== '/login' && path !== '/register' && !isAuthEndpoint) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
