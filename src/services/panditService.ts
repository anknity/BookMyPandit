import api from '../config/api';

export async function listPandits(params?: { city?: string; service?: string }) {
    const res = await api.get('/pandits', { params });
    return res.data.pandits;
}

export async function getPandit(id: string) {
    const res = await api.get(`/pandits/${id}`);
    return res.data.pandit;
}

export async function createPanditProfile(data: any) {
    const res = await api.post('/pandits/profile', data);
    return res.data.pandit;
}

export async function updatePanditProfile(data: any) {
    const res = await api.put('/pandits/profile', data);
    return res.data.pandit;
}

export async function updateAvailability(availability: any[]) {
    const res = await api.put('/pandits/availability', { availability });
    return res.data.availability;
}

export async function getPanditBookings() {
    const res = await api.get('/pandits/my/bookings');
    return res.data.bookings;
}

export async function acceptPanditBooking(bookingId: string) {
    const res = await api.put(`/pandits/bookings/${bookingId}/accept`);
    return res.data.booking;
}

export async function declinePanditBooking(bookingId: string) {
    const res = await api.put(`/pandits/bookings/${bookingId}/decline`);
    return res.data.booking;
}

export async function getPanditEarnings() {
    const res = await api.get('/pandits/my/earnings');
    return res.data;
}

export async function getPanditDashboardStats() {
    const res = await api.get('/pandits/my/dashboard');
    return res.data.stats;
}

