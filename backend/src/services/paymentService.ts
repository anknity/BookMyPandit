import Stripe from 'stripe';
import Razorpay from 'razorpay';
import dotenv from 'dotenv';

dotenv.config();

// Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
    apiVersion: '2025-01-27.acacia' as any,
});

export async function createStripePaymentIntent(amount: number, currency: string = 'inr', metadata?: Record<string, string>) {
    return stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to paise
        currency,
        metadata,
    });
}

// Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
    key_secret: process.env.RAZORPAY_SECRET || 'placeholder',
});

export async function createRazorpayOrder(amount: number, currency: string = 'INR', receipt?: string) {
    return razorpay.orders.create({
        amount: Math.round(amount * 100), // Convert to paise
        currency,
        receipt: receipt || `order_${Date.now()}`,
    });
}

export async function verifyRazorpayPayment(orderId: string, paymentId: string, signature: string) {
    const crypto = await import('crypto');
    const body = orderId + '|' + paymentId;
    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET || '')
        .update(body)
        .digest('hex');
    return expectedSignature === signature;
}

export { stripe, razorpay };
