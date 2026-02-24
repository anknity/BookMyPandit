import api from '../config/api';

export async function createBooking(data: {
    pandit_id: string;
    service_id: string;
    date: string;
    time_slot: string;
    address: string;
    lat?: number;
    lng?: number;
    notes?: string;
    coupon_code?: string;
}) {
    const res = await api.post('/bookings', data);
    return res.data.booking;
}

export async function getUserBookings() {
    const res = await api.get('/bookings');
    return res.data.bookings;
}

export async function getBooking(id: string) {
    const res = await api.get(`/bookings/${id}`);
    return res.data.booking;
}

export async function cancelBooking(id: string) {
    const res = await api.put(`/bookings/${id}/cancel`);
    return res.data.booking;
}

export async function addReview(bookingId: string, rating: number, comment: string) {
    const res = await api.post(`/bookings/${bookingId}/review`, { rating, comment });
    return res.data.review;
}
