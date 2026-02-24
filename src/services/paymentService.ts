import api from '../config/api';

export async function createStripePayment(bookingId: string, amount: number) {
    const res = await api.post('/payments/stripe', { booking_id: bookingId, amount });
    return res.data;
}

export async function createRazorpayPayment(bookingId: string, amount: number) {
    const res = await api.post('/payments/razorpay', { booking_id: bookingId, amount });
    return res.data;
}

export async function verifyRazorpayPayment(orderId: string, paymentId: string, signature: string) {
    const res = await api.post('/payments/razorpay/verify', { order_id: orderId, payment_id: paymentId, signature });
    return res.data;
}

export async function payWithWallet(bookingId: string, amount: number) {
    const res = await api.post('/payments/wallet', { booking_id: bookingId, amount });
    return res.data;
}

export async function addMoneyToWallet(amount: number) {
    const res = await api.post('/payments/wallet/add', { amount });
    return res.data;
}

export async function getWallet() {
    const res = await api.get('/payments/wallet');
    return res.data.wallet;
}
