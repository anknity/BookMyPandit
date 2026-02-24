import api from '../config/api';

export async function getDashboardStats() {
    const res = await api.get('/admin/dashboard');
    return res.data.stats;
}

export async function getUsers(params?: { search?: string; page?: number }) {
    const res = await api.get('/admin/users', { params });
    return res.data;
}

export async function blockUser(id: string) {
    return api.put(`/admin/users/block/${id}`);
}

export async function unblockUser(id: string) {
    return api.put(`/admin/users/unblock/${id}`);
}

export async function deleteUser(id: string) {
    return api.delete(`/admin/users/${id}`);
}

export async function getAdminPandits(params?: { status?: string }) {
    const res = await api.get('/admin/pandits', { params });
    return res.data.pandits;
}

export async function approvePandit(id: string) {
    return api.put(`/admin/pandits/approve/${id}`);
}

export async function suspendPandit(id: string) {
    return api.put(`/admin/pandits/suspend/${id}`);
}

export async function getAdminBookings(params?: { status?: string; page?: number }) {
    const res = await api.get('/admin/bookings', { params });
    return res.data;
}

export async function updateAdminBooking(id: string, data: any) {
    return api.put(`/admin/bookings/update/${id}`, data);
}

export async function getAdminServices() {
    const res = await api.get('/admin/services');
    return res.data.services;
}

export async function createService(data: any) {
    return api.post('/admin/services', data);
}

export async function updateService(id: string, data: any) {
    return api.put(`/admin/services/${id}`, data);
}

export async function deleteService(id: string) {
    return api.delete(`/admin/services/${id}`);
}

export async function getCoupons() {
    const res = await api.get('/admin/coupons');
    return res.data.coupons;
}

export async function createCoupon(data: any) {
    return api.post('/admin/coupons', data);
}

export async function updateCoupon(id: string, data: any) {
    return api.put(`/admin/coupons/${id}`, data);
}

export async function deleteCoupon(id: string) {
    return api.delete(`/admin/coupons/${id}`);
}

export async function getPayments() {
    const res = await api.get('/admin/payments');
    return res.data.payments;
}

export async function refundPayment(id: string) {
    return api.put(`/admin/payments/refund/${id}`);
}

export async function getReports() {
    const res = await api.get('/admin/reports');
    return res.data.reports;
}

export async function resolveReport(id: string) {
    return api.put(`/admin/reports/resolve/${id}`);
}

export async function sendAdminNotification(data: { title: string; message: string; target: string; userId?: string }) {
    return api.post('/admin/notifications', data);
}
