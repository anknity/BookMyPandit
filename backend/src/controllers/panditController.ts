import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { supabase } from '../config/supabaseClient.js';
import { logger } from '../server.js';

// GET /api/pandits
export async function listPandits(req: AuthRequest, res: Response) {
    try {
        const { city, service, lat, lng, radius } = req.query;

        let query;

        if (service) {
            // Use inner join to filter pandits who offer this service
            query = supabase
                .from('pandits')
                .select('*, users(name, avatar_url, email, phone), pandit_services!inner(service_id, services(*))')
                .eq('is_approved', true)
                .eq('status', 'active')
                .eq('pandit_services.service_id', service);
        } else {
            query = supabase
                .from('pandits')
                .select('*, users(name, avatar_url, email, phone), pandit_services(services(*))')
                .eq('is_approved', true)
                .eq('status', 'active');
        }

        if (city) query = query.ilike('city', `%${city}%`);

        const { data: pandits, error } = await query.order('rating', { ascending: false });
        if (error) throw error;

        res.json({ pandits });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

// GET /api/pandits/admin/all
export async function listAllPandits(req: AuthRequest, res: Response) {
    try {
        const { data: pandits, error } = await supabase
            .from('pandits')
            .select('*, users(name, avatar_url, email, phone)')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json({ pandits });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

// PUT /api/pandits/:id/status
export async function updatePanditStatus(req: AuthRequest, res: Response) {
    try {
        const { status } = req.body; // 'active', 'suspended', 'rejected'
        const { id } = req.params;

        const { data, error } = await supabase
            .from('pandits')
            .update({ status, is_approved: status === 'active' })
            .eq('id', id)
            .select()
            .single();

        if (data && status === 'active') {
            // Promote user to pandit role
            await supabase.from('users').update({ role: 'pandit' }).eq('id', data.user_id);
        }

        if (error) throw error;
        res.json({ pandit: data });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

// GET /api/pandits/:id
export async function getPandit(req: AuthRequest, res: Response) {
    try {
        const { data, error } = await supabase
            .from('pandits')
            .select('*, users(name, avatar_url, email, phone), pandit_services(services(*)), reviews(*, users(name, avatar_url)), availability(*)')
            .eq('id', req.params.id)
            .single();

        if (error) throw error;
        res.json({ pandit: data });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

// POST /api/pandits/profile
export async function createPanditProfile(req: AuthRequest, res: Response) {
    try {
        const { bio, experience_years, specializations, languages, city, state, lat, lng, documents_url } = req.body;

        const { data, error } = await supabase
            .from('pandits')
            .upsert({
                user_id: req.user!.userId,
                bio,
                experience_years,
                specializations,
                languages,
                city,
                state,
                lat,
                lng,
                documents_url,
                status: 'pending',
            }, { onConflict: 'user_id' })
            .select()
            .single();

        if (error) throw error;
        // Role update will happen upon Admin Approval via updatePanditStatus
        // await supabase.from('users').update({ role: 'pandit' }).eq('id', req.user!.userId);

        res.status(201).json({ pandit: data });
    } catch (error: any) {
        logger.error('Create pandit profile error:', error);
        res.status(500).json({ error: error.message });
    }
}

// PUT /api/pandits/profile
export async function updatePanditProfile(req: AuthRequest, res: Response) {
    try {
        const { data, error } = await supabase
            .from('pandits')
            .update(req.body)
            .eq('user_id', req.user!.userId)
            .select()
            .single();

        if (error) throw error;
        res.json({ pandit: data });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

// PUT /api/pandits/availability
export async function updateAvailability(req: AuthRequest, res: Response) {
    try {
        const { availability } = req.body; // Array of { day_of_week, start_time, end_time, is_available }

        const { data: pandit } = await supabase.from('pandits').select('id').eq('user_id', req.user!.userId).single();
        if (!pandit) return res.status(404).json({ error: 'Pandit profile not found' });

        // Delete existing and insert new
        await supabase.from('availability').delete().eq('pandit_id', pandit.id);

        const records = availability.map((a: any) => ({ ...a, pandit_id: pandit.id }));
        const { data, error } = await supabase.from('availability').insert(records).select();

        if (error) throw error;
        res.json({ availability: data });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

// GET /api/pandits/bookings
export async function getPanditBookings(req: AuthRequest, res: Response) {
    try {
        const { data: pandit } = await supabase.from('pandits').select('id').eq('user_id', req.user!.userId).single();
        if (!pandit) return res.status(404).json({ error: 'Pandit profile not found' });

        const { data: bookings, error } = await supabase
            .from('bookings')
            .select('*, services(name, image_url), users(name, avatar_url, phone)')
            .eq('pandit_id', pandit.id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json({ bookings });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

// PUT /api/pandits/bookings/:id/accept
export async function acceptBooking(req: AuthRequest, res: Response) {
    try {
        const { data, error } = await supabase
            .from('bookings')
            .update({ status: 'confirmed' })
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) throw error;
        res.json({ booking: data });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

// GET /api/pandits/earnings
export async function getPanditEarnings(req: AuthRequest, res: Response) {
    try {
        const { data: pandit } = await supabase.from('pandits').select('id').eq('user_id', req.user!.userId).single();
        if (!pandit) return res.status(404).json({ error: 'Pandit profile not found' });

        const { data: payments, error } = await supabase
            .from('payments')
            .select('*, bookings(services(name))')
            .eq('bookings.pandit_id', pandit.id)
            .eq('status', 'completed')
            .order('created_at', { ascending: false });

        if (error) throw error;

        const totalEarnings = payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
        res.json({ earnings: totalEarnings, payments });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

// GET /api/pandits/my/dashboard
export async function getPanditDashboardStats(req: AuthRequest, res: Response) {
    try {
        const { data: pandit } = await supabase
            .from('pandits')
            .select('id, rating')
            .eq('user_id', req.user!.userId)
            .single();

        if (!pandit) return res.status(404).json({ error: 'Pandit profile not found' });

        // Get all bookings for this pandit
        const { data: bookings, error: bErr } = await supabase
            .from('bookings')
            .select('id, status, total_amount, created_at')
            .eq('pandit_id', pandit.id);

        if (bErr) throw bErr;

        const allBookings = bookings || [];
        const now = new Date();
        const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

        const totalBookings = allBookings.length;
        const pendingBookings = allBookings.filter(b => b.status === 'pending').length;
        const confirmedBookings = allBookings.filter(b => b.status === 'confirmed').length;
        const completedBookings = allBookings.filter(b => b.status === 'completed').length;
        const cancelledBookings = allBookings.filter(b => b.status === 'cancelled').length;

        const totalEarnings = allBookings
            .filter(b => b.status === 'completed')
            .reduce((sum, b) => sum + (b.total_amount || 0), 0);

        const thisMonthEarnings = allBookings
            .filter(b => b.status === 'completed' && b.created_at >= firstOfMonth)
            .reduce((sum, b) => sum + (b.total_amount || 0), 0);

        const pendingPayouts = allBookings
            .filter(b => b.status === 'confirmed')
            .reduce((sum, b) => sum + (b.total_amount || 0), 0);

        res.json({
            stats: {
                totalBookings,
                pendingBookings,
                confirmedBookings,
                completedBookings,
                cancelledBookings,
                rating: pandit.rating || 0,
                totalEarnings,
                thisMonthEarnings,
                pendingPayouts,
            },
        });
    } catch (error: any) {
        logger.error('Dashboard stats error:', error);
        res.status(500).json({ error: error.message });
    }
}

// PUT /api/pandits/bookings/:id/decline
export async function declineBooking(req: AuthRequest, res: Response) {
    try {
        const { data, error } = await supabase
            .from('bookings')
            .update({ status: 'cancelled' })
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) throw error;
        res.json({ booking: data });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
