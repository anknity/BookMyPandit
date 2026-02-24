import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { supabase } from '../config/supabaseClient.js';
import { createStripePaymentIntent, createRazorpayOrder, verifyRazorpayPayment } from '../services/paymentService.js';
import { logger } from '../server.js';

// POST /api/payments/razorpay-chat
export async function createRazorpayChatPayment(req: AuthRequest, res: Response) {
    try {
        const { amount } = req.body;
        const order = await createRazorpayOrder(amount);

        // We log the attempt, but don't strictly require a booking_id
        await supabase.from('payments').insert({
            user_id: req.user!.userId,
            amount,
            method: 'razorpay',
            razorpay_order_id: order.id,
            status: 'pending',
        });

        res.json({ orderId: order.id, amount: order.amount, currency: order.currency });
    } catch (error: any) {
        logger.error('Razorpay chat payment error:', error);
        res.status(500).json({ error: error.message });
    }
}

// POST /api/payments/razorpay-chat/verify
export async function verifyRazorpayChat(req: AuthRequest, res: Response) {
    try {
        const { order_id, payment_id, signature } = req.body;

        const isValid = await verifyRazorpayPayment(order_id, payment_id, signature);
        if (!isValid) return res.status(400).json({ error: 'Invalid payment signature' });

        await supabase.from('payments').update({ status: 'completed' }).eq('razorpay_order_id', order_id);
        res.json({ success: true });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

// POST /api/payments/stripe
export async function createStripePayment(req: AuthRequest, res: Response) {
    try {
        const { booking_id, amount } = req.body;

        const intent = await createStripePaymentIntent(amount, 'inr', { booking_id });

        await supabase.from('payments').insert({
            booking_id,
            user_id: req.user!.userId,
            amount,
            method: 'stripe',
            stripe_payment_id: intent.id,
            status: 'pending',
        });

        res.json({ clientSecret: intent.client_secret, paymentIntentId: intent.id });
    } catch (error: any) {
        logger.error('Stripe payment error:', error);
        res.status(500).json({ error: error.message });
    }
}

// POST /api/payments/razorpay
export async function createRazorpayPayment(req: AuthRequest, res: Response) {
    try {
        const { booking_id, amount } = req.body;

        const order = await createRazorpayOrder(amount);

        await supabase.from('payments').insert({
            booking_id,
            user_id: req.user!.userId,
            amount,
            method: 'razorpay',
            razorpay_order_id: order.id,
            status: 'pending',
        });

        res.json({ orderId: order.id, amount: order.amount, currency: order.currency });
    } catch (error: any) {
        logger.error('Razorpay payment error:', error);
        res.status(500).json({ error: error.message });
    }
}

// POST /api/payments/razorpay/verify
export async function verifyRazorpay(req: AuthRequest, res: Response) {
    try {
        const { order_id, payment_id, signature } = req.body;

        const isValid = await verifyRazorpayPayment(order_id, payment_id, signature);
        if (!isValid) return res.status(400).json({ error: 'Invalid payment signature' });

        await supabase.from('payments').update({ status: 'completed' }).eq('razorpay_order_id', order_id);
        await supabase.from('bookings')
            .update({ payment_status: 'paid', payment_method: 'razorpay' })
            .eq('id', (await supabase.from('payments').select('booking_id').eq('razorpay_order_id', order_id).single()).data?.booking_id);

        res.json({ success: true });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

// POST /api/payments/wallet
export async function payWithWallet(req: AuthRequest, res: Response) {
    try {
        const { booking_id, amount } = req.body;

        // Check wallet balance
        const { data: wallet } = await supabase.from('wallet').select('*').eq('user_id', req.user!.userId).single();
        if (!wallet || wallet.balance < amount) {
            return res.status(400).json({ error: 'Insufficient wallet balance' });
        }

        // Deduct from wallet
        await supabase.from('wallet').update({ balance: wallet.balance - amount }).eq('user_id', req.user!.userId);

        // Record transaction
        await supabase.from('transactions').insert({
            wallet_id: wallet.id,
            type: 'debit',
            amount,
            description: `Payment for booking #${booking_id}`,
        });

        // Create payment record
        await supabase.from('payments').insert({
            booking_id,
            user_id: req.user!.userId,
            amount,
            method: 'wallet',
            status: 'completed',
        });

        // Update booking
        await supabase.from('bookings').update({ payment_status: 'paid', payment_method: 'wallet' }).eq('id', booking_id);

        res.json({ success: true, newBalance: wallet.balance - amount });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

// POST /api/payments/wallet/add
export async function addToWallet(req: AuthRequest, res: Response) {
    try {
        const { amount } = req.body;

        const { data: wallet } = await supabase.from('wallet').select('*').eq('user_id', req.user!.userId).single();
        if (!wallet) return res.status(404).json({ error: 'Wallet not found' });

        await supabase.from('wallet').update({ balance: wallet.balance + amount }).eq('user_id', req.user!.userId);

        await supabase.from('transactions').insert({
            wallet_id: wallet.id,
            type: 'credit',
            amount,
            description: 'Added money to wallet',
        });

        res.json({ success: true, newBalance: wallet.balance + amount });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

// GET /api/payments/wallet
export async function getWallet(req: AuthRequest, res: Response) {
    try {
        const { data: wallet } = await supabase
            .from('wallet')
            .select('*, transactions(*)')
            .eq('user_id', req.user!.userId)
            .single();

        res.json({ wallet });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
