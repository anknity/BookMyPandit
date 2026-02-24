import { io } from 'socket.io-client';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://bookmypandit-backend.onrender.com/api';
const URL = API_BASE_URL.replace('/api', '');

export const socket = io(URL, {
    autoConnect: false,
    withCredentials: true,
});
