import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { supabase } from '../config/supabaseClient.js';
import { createNotification } from '../services/notificationService.js';
import { logger } from '../server.js';

// POST /api/bookings
export async function createBooking(req: AuthRequest, res: Response) {
    try {
        const {
            pandit_id, service_id, date, time_slot,
            address, lat, lng, notes, coupon_code,
            include_samagri, payment_method,
        } = req.body;

        const PLATFORM_FEE = 99;
        const GST = 18; // 18% of platform fee
        const SAMAGRI_PRICE = 1500;

        // Get service price
        const { data: service } = await supabase
            .from('services')
            .select('base_price, samagri_available')
            .eq('id', service_id)
            .single();

        let baseAmount = service?.base_price || 0;

        // Check pandit custom price
        const { data: panditService } = await supabase
            .from('pandit_services')
            .select('custom_price')
            .eq('pandit_id', pandit_id)
            .eq('service_id', service_id)
            .single();

        if (panditService?.custom_price) baseAmount = panditService.custom_price;

        // Apply coupon to base amount
        if (coupon_code) {
            const { data: coupon } = await supabase
                .from('coupons')
                .select('*')
                .eq('code', coupon_code)
                .eq('is_active', true)
                .single();

            if (coupon && new Date(coupon.expires_at) > new Date() && coupon.used_count < coupon.max_uses) {
                const discount = Math.min(baseAmount * coupon.discount_percent / 100, coupon.max_discount || Infinity);
                baseAmount -= discount;
                await supabase.from('coupons').update({ used_count: coupon.used_count + 1 }).eq('id', coupon.id);
            }
        }

        // Build total: base + optional samagri + platform fee + GST
        const samagriAmount = (include_samagri && service?.samagri_available) ? SAMAGRI_PRICE : 0;
        const totalAmount = baseAmount + samagriAmount + PLATFORM_FEE + GST;

        // Map frontend payment methods to database constraints
        const methodMap: Record<string, string> = {
            upi: 'razorpay',
            card: 'stripe',
            cash: 'cash',
            wallet: 'wallet'
        };
        const dbPaymentMethod = methodMap[payment_method] || 'razorpay';

        const { data: booking, error } = await supabase
            .from('bookings')
            .insert({
                user_id: req.user!.userId,
                pandit_id,
                service_id,
                date,
                time_slot,
                address,
                lat,
                lng,
                total_amount: totalAmount,
                notes,
                status: 'pending',
                payment_status: 'pending', // Constraint only allows: 'pending', 'paid', 'refunded', 'failed'
                payment_method: dbPaymentMethod,
            })
            .select('*, services(name, image_url), pandits(*, users(name, avatar_url, phone))')
            .single();

        if (error) throw error;

        // Notify pandit
        const { data: pandit } = await supabase.from('pandits').select('user_id').eq('id', pandit_id).single();
        if (pandit) {
            await createNotification(pandit.user_id, 'New Booking', `You have a new booking for ${date}`, 'booking');
        }

        res.status(201).json({
            booking: {
                ...booking,
                price_breakdown: {
                    base_amount: baseAmount,
                    samagri_amount: samagriAmount,
                    platform_fee: PLATFORM_FEE,
                    gst: GST,
                    total: totalAmount,
                },
            },
        });
    } catch (error: any) {
        logger.error('Create booking error:', error);
        res.status(500).json({ error: error.message });
    }
}

// POST /api/bookings/validate-coupon
export async function validateCoupon(req: AuthRequest, res: Response) {
    try {
        const { code, amount } = req.body;

        if (!code || !amount) {
            return res.status(400).json({ error: 'Coupon code and base amount are required' });
        }

        const { data: coupon } = await supabase
            .from('coupons')
            .select('*')
            .eq('code', code.toUpperCase())
            .eq('is_active', true)
            .single();

        if (!coupon) {
            return res.status(404).json({ error: 'Invalid or inactive coupon code' });
        }

        if (new Date(coupon.expires_at) < new Date()) {
            return res.status(400).json({ error: 'This coupon has expired' });
        }

        if (coupon.used_count >= coupon.max_uses) {
            return res.status(400).json({ error: 'This coupon has reached its maximum usage limit' });
        }

        // Calculate discount
        const rawDiscount = (amount * coupon.discount_percent) / 100;
        const discountAmount = Math.min(rawDiscount, coupon.max_discount || Infinity);

        res.json({
            valid: true,
            coupon: {
                id: coupon.id,
                code: coupon.code,
                discount_percent: coupon.discount_percent,
                max_discount: coupon.max_discount,
            },
            discountAmount: Math.round(discountAmount)
        });
    } catch (error: any) {
        logger.error('Validate coupon error:', error);
        res.status(500).json({ error: 'Failed to validate coupon' });
    }
}

// GET /api/bookings
export async function getUserBookings(req: AuthRequest, res: Response) {
    try {
        const { data: bookings, error } = await supabase
            .from('bookings')
            .select('*, services(name, image_url), pandits(users(name, avatar_url))')
            .eq('user_id', req.user!.userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json({ bookings });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

// GET /api/bookings/:id
export async function getBooking(req: AuthRequest, res: Response) {
    try {
        const { data: booking, error } = await supabase
            .from('bookings')
            .select('*, services(*), pandits(*, users(name, avatar_url, phone)), reviews(*)')
            .eq('id', req.params.id)
            .single();

        if (error) throw error;
        res.json({ booking });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

// PUT /api/bookings/:id/cancel
export async function cancelBooking(req: AuthRequest, res: Response) {
    try {
        const { data, error } = await supabase
            .from('bookings')
            .update({ status: 'cancelled' })
            .eq('id', req.params.id)
            .eq('user_id', req.user!.userId)
            .select()
            .single();

        if (error) throw error;
        res.json({ booking: data });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

// POST /api/bookings/:id/review
export async function addReview(req: AuthRequest, res: Response) {
    try {
        const { rating, comment } = req.body;
        const bookingId = req.params.id;

        const { data: booking } = await supabase.from('bookings').select('pandit_id').eq('id', bookingId).single();
        if (!booking) return res.status(404).json({ error: 'Booking not found' });

        const { data: review, error } = await supabase
            .from('reviews')
            .insert({
                booking_id: bookingId,
                user_id: req.user!.userId,
                pandit_id: booking.pandit_id,
                rating,
                comment,
            })
            .select()
            .single();

        if (error) throw error;

        // Update pandit rating
        const { data: reviews } = await supabase.from('reviews').select('rating').eq('pandit_id', booking.pandit_id);
        if (reviews) {
            const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
            await supabase.from('pandits').update({ rating: Math.round(avgRating * 10) / 10 }).eq('id', booking.pandit_id);
        }

        res.status(201).json({ review });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
