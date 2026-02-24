import { Request, Response } from 'express';
// import { AuthRequest } from '../middleware/authMiddleware.js'; // Not needed for the helper if we cast
import { supabase } from '../config/supabaseClient.js';
import { broadcastNotification, createNotification } from '../services/notificationService.js';
import { logger } from '../server.js';

// Controller for Admin Dashboard & Management
// Helper to log admin actions
async function logAdminAction(adminId: string, action: string, targetType: string, targetId: string, details?: string) {
    await supabase.from('admin_logs').insert({ admin_id: adminId, action, target_type: targetType, target_id: targetId, details });
}

function getAdminId(req: any): string {
    if (!req.user?.userId) throw new Error('Unauthorized: Admin ID missing');
    return req.user.userId;
}

// ===== Dashboard =====
export async function getDashboardStats(req: any, res: Response) {

    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayStr = today.toISOString();

        const { count: totalUsers } = await supabase.from('users').select('*', { count: 'exact', head: true });
        const { count: totalPandits } = await supabase.from('pandits').select('*', { count: 'exact', head: true }).eq('status', 'active');
        const { count: totalBookings } = await supabase.from('bookings').select('*', { count: 'exact', head: true });

        const { count: bookingsToday } = await supabase.from('bookings').select('*', { count: 'exact', head: true }).gte('created_at', todayStr);

        const { data: todayPayments } = await supabase.from('payments').select('amount').eq('status', 'completed').gte('created_at', todayStr);
        const revenueToday = todayPayments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

        const { data: recentBookings } = await supabase
            .from('bookings')
            .select('*, users(name), services(name)')
            .order('created_at', { ascending: false })
            .limit(5);

        const { data: recentPendingPandits } = await supabase
            .from('pandits')
            .select('*, users(name, avatar_url, city)')
            .eq('status', 'pending')
            .limit(3);

        const { data: payments } = await supabase.from('payments').select('amount').eq('status', 'completed');
        const totalRevenue = payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

        res.json({
            stats: {
                totalUsers,
                totalPandits,
                totalBookings,
                bookingsToday,
                revenueToday,
                totalRevenue,
                recentBookings,
                recentPendingPandits
            },
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

// ===== User Management =====
export async function getUsers(req: any, res: Response) {
    try {
        const { search, page = '1', limit = '20' } = req.query;
        const offset = (Number(page) - 1) * Number(limit);

        let query = supabase.from('users').select('*, wallet(balance)', { count: 'exact' });
        if (search) query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);

        const { data, count, error } = await query.range(offset, offset + Number(limit) - 1).order('created_at', { ascending: false });
        if (error) throw error;

        res.json({ users: data, total: count, page: Number(page), limit: Number(limit) });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export async function blockUser(req: any, res: Response) {
    try {
        const { id } = req.params;
        await supabase.from('users').update({ is_blocked: true }).eq('id', id);
        await logAdminAction(getAdminId(req), 'block_user', 'user', id);
        res.json({ success: true });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export async function unblockUser(req: any, res: Response) {
    try {
        const { id } = req.params;
        await supabase.from('users').update({ is_blocked: false }).eq('id', id);
        await logAdminAction(getAdminId(req), 'unblock_user', 'user', id);
        res.json({ success: true });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export async function deleteUser(req: any, res: Response) {
    try {
        const { id } = req.params;
        await supabase.from('users').delete().eq('id', id);
        await logAdminAction(getAdminId(req), 'delete_user', 'user', id);
        res.json({ success: true });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

// ===== Pandit Management =====
export async function getPandits(req: any, res: Response) {
    try {
        const { status, search } = req.query;
        let query = supabase.from('pandits').select('*, users(name, email, avatar_url, phone)');
        if (status) query = query.eq('status', status);
        if (search) query = query.ilike('users.name', `%${search}%`);

        const { data, error } = await query.order('created_at', { ascending: false });
        if (error) throw error;
        res.json({ pandits: data });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export async function approvePandit(req: any, res: Response) {
    try {
        const { id } = req.params;
        await supabase.from('pandits').update({ is_approved: true, is_verified: true, status: 'active' }).eq('id', id);

        const { data: pandit } = await supabase.from('pandits').select('user_id').eq('id', id).single();
        if (pandit) await createNotification(pandit.user_id, 'Profile Approved', 'Your pandit profile has been approved! You can now receive bookings.', 'approval');

        await logAdminAction(getAdminId(req), 'approve_pandit', 'pandit', id);
        res.json({ success: true });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export async function suspendPandit(req: any, res: Response) {
    try {
        const { id } = req.params;
        await supabase.from('pandits').update({ status: 'suspended', is_approved: false }).eq('id', id);
        await logAdminAction(getAdminId(req), 'suspend_pandit', 'pandit', id);
        res.json({ success: true });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

// ===== Booking Management =====
export async function getAllBookings(req: any, res: Response) {
    try {
        const { status, page = '1', limit = '20' } = req.query;
        const offset = (Number(page) - 1) * Number(limit);

        let query = supabase.from('bookings').select('*, services(name), users(name, email), pandits(users(name))', { count: 'exact' });
        if (status) query = query.eq('status', status);

        const { data, count, error } = await query.range(offset, offset + Number(limit) - 1).order('created_at', { ascending: false });
        if (error) throw error;

        res.json({ bookings: data, total: count });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export async function updateBooking(req: any, res: Response) {
    try {
        const { id } = req.params;
        const { status, pandit_id } = req.body;

        const updates: any = {};
        if (status) updates.status = status;
        if (pandit_id) updates.pandit_id = pandit_id;

        const { data, error } = await supabase.from('bookings').update(updates).eq('id', id).select().single();
        if (error) throw error;

        await logAdminAction(getAdminId(req), 'update_booking', 'booking', id, JSON.stringify(updates));
        res.json({ booking: data });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

// ===== Service Management =====
export async function getServices(req: any, res: Response) {
    try {
        const { data, error } = await supabase.from('services').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        res.json({ services: data });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export async function createService(req: any, res: Response) {
    try {
        const { data, error } = await supabase.from('services').insert(req.body).select().single();
        if (error) throw error;
        await logAdminAction(getAdminId(req), 'create_service', 'service', data.id);
        res.status(201).json({ service: data });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export async function updateService(req: any, res: Response) {
    try {
        const { data, error } = await supabase.from('services').update(req.body).eq('id', req.params.id).select().single();
        if (error) throw error;
        res.json({ service: data });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export async function deleteService(req: any, res: Response) {
    try {
        await supabase.from('services').delete().eq('id', req.params.id);
        await logAdminAction(getAdminId(req), 'delete_service', 'service', req.params.id);
        res.json({ success: true });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

// ===== Coupon Management =====
export async function getCoupons(req: any, res: Response) {
    try {
        const { data, error } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        res.json({ coupons: data });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export async function createCoupon(req: any, res: Response) {
    try {
        const { data, error } = await supabase.from('coupons').insert(req.body).select().single();
        if (error) throw error;
        res.status(201).json({ coupon: data });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export async function updateCoupon(req: any, res: Response) {
    try {
        const { data, error } = await supabase.from('coupons').update(req.body).eq('id', req.params.id).select().single();
        if (error) throw error;
        res.json({ coupon: data });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export async function deleteCoupon(req: any, res: Response) {
    try {
        await supabase.from('coupons').delete().eq('id', req.params.id);
        res.json({ success: true });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

// ===== Payment Management =====
export async function getPayments(req: any, res: Response) {
    try {
        const { data, error } = await supabase
            .from('payments')
            .select('*, users(name, email), bookings(services(name))')
            .order('created_at', { ascending: false });
        if (error) throw error;
        res.json({ payments: data });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export async function refundPayment(req: any, res: Response) {
    try {
        const { id } = req.params;
        await supabase.from('payments').update({ status: 'refunded' }).eq('id', id);
        await logAdminAction(getAdminId(req), 'refund_payment', 'payment', id);
        res.json({ success: true });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

// ===== Reports =====
export async function getReports(req: any, res: Response) {
    try {
        const { data, error } = await supabase
            .from('reports')
            .select('*, users:reporter_id(name, email)')
            .order('created_at', { ascending: false });
        if (error) throw error;
        res.json({ reports: data });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export async function resolveReport(req: any, res: Response) {
    try {
        const { id } = req.params;
        await supabase.from('reports').update({ status: 'resolved', resolved_at: new Date().toISOString() }).eq('id', id);
        await logAdminAction(getAdminId(req), 'resolve_report', 'report', id);
        res.json({ success: true });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

// ===== Notifications =====
export async function sendNotification(req: any, res: Response) {
    try {
        const { title, message, target, userId } = req.body;

        if (target === 'all') {
            await broadcastNotification(title, message);
        } else if (target === 'users') {
            await broadcastNotification(title, message, 'user');
        } else if (target === 'pandits') {
            await broadcastNotification(title, message, 'pandit');
        } else if (target === 'specific' && userId) {
            await createNotification(userId, title, message, 'admin');
        }

        await logAdminAction(getAdminId(req), 'send_notification', 'notification', target);
        res.json({ success: true });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

// ===== Admin Logs =====
export async function getAdminLogs(req: any, res: Response) {
    try {
        const { data, error } = await supabase
            .from('admin_logs')
            .select('*, users:admin_id(name, email)')
            .order('created_at', { ascending: false })
            .limit(100);
        if (error) throw error;
        res.json({ logs: data });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
