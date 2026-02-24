import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { supabase } from '../config/supabaseClient.js';
import { logger } from '../server.js';

// GET /api/user/saved-pandits
export async function getSavedPandits(req: AuthRequest, res: Response) {
    try {
        const { data, error } = await supabase
            .from('saved_pandits')
            .select(`
                id,
                pandit_id,
                pandits (
                    id,
                    experience_years,
                    rating,
                    total_pujas,
                    users (name, avatar_url)
                )
            `)
            .eq('user_id', req.user!.userId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        const formattedPandits = data.map((item: any) => ({
            id: item.pandit_id,
            name: item.pandits?.users?.name,
            avatar_url: item.pandits?.users?.avatar_url,
            experience_years: item.pandits?.experience_years,
            rating: item.pandits?.rating,
            total_pujas: item.pandits?.total_pujas
        }));

        res.json({ pandits: formattedPandits });
    } catch (error: any) {
        logger.error('Get saved pandits error:', error);
        res.status(500).json({ error: error.message });
    }
}

// POST /api/user/saved-pandits/toggle
export async function toggleSavedPandit(req: AuthRequest, res: Response) {
    try {
        const { pandit_id } = req.body;
        const user_id = req.user!.userId;

        if (!pandit_id) {
            return res.status(400).json({ error: 'pandit_id is required' });
        }

        const { data: existing } = await supabase
            .from('saved_pandits')
            .select('id')
            .eq('user_id', user_id)
            .eq('pandit_id', pandit_id)
            .single();

        if (existing) {
            await supabase.from('saved_pandits').delete().eq('id', existing.id);
            return res.json({ saved: false, message: 'Removed from saved pandits' });
        } else {
            await supabase.from('saved_pandits').insert({ user_id, pandit_id });
            return res.status(201).json({ saved: true, message: 'Added to saved pandits' });
        }
    } catch (error: any) {
        logger.error('Toggle saved pandit error:', error);
        res.status(500).json({ error: error.message });
    }
}

// GET /api/user/notifications
export async function getNotifications(req: AuthRequest, res: Response) {
    try {
        const { data, error } = await supabase
            .from('notifications')
            .select('id, title, message, type, is_read, created_at')
            .eq('user_id', req.user!.userId)
            .order('created_at', { ascending: false })
            .limit(20);

        if (error) throw error;
        res.json({ notifications: data });
    } catch (error: any) {
        logger.error('Get notifications error:', error);
        res.status(500).json({ error: error.message });
    }
}

// PATCH /api/user/notifications/read — mark all (or specific ids) as read
export async function markNotificationsRead(req: AuthRequest, res: Response) {
    try {
        const { ids } = req.body as { ids?: string[] };
        let query = supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('user_id', req.user!.userId);

        if (ids && ids.length > 0) {
            query = query.in('id', ids);
        }

        const { error } = await query;
        if (error) throw error;
        res.json({ success: true });
    } catch (error: any) {
        logger.error('Mark notifications read error:', error);
        res.status(500).json({ error: error.message });
    }
}

// GET /api/user/stats — real-time counts for Smart Stats panel
export async function getUserStats(req: AuthRequest, res: Response) {
    try {
        const userId = req.user!.userId;

        // Count bookings by status
        const { data: bookings, error } = await supabase
            .from('bookings')
            .select('id, status, total_amount')
            .eq('user_id', userId);

        if (error) throw error;

        const totalBookings = bookings?.length ?? 0;
        const completedBookings = bookings?.filter(b => b.status === 'completed').length ?? 0;
        const upcomingBookings = bookings?.filter(b => ['pending', 'confirmed', 'in_progress'].includes(b.status)).length ?? 0;
        const totalSpend = bookings?.reduce((sum, b) => sum + (Number(b.total_amount) || 0), 0) ?? 0;

        // Karma: 50 pts per completed booking, 10 pts per pending/confirmed
        const karmaPoints = (completedBookings * 50) + (upcomingBookings * 10);

        // Level thresholds (every 5 completed pujas = next level)
        const PUJAS_PER_LEVEL = 5;
        const currentLevelPujas = completedBookings % PUJAS_PER_LEVEL;
        const progressPercent = PUJAS_PER_LEVEL > 0
            ? Math.round((currentLevelPujas / PUJAS_PER_LEVEL) * 100)
            : 0;

        res.json({
            stats: {
                total_bookings: totalBookings,
                completed_pujas: completedBookings,
                upcoming_pujas: upcomingBookings,
                total_spend: totalSpend,
                karma_points: karmaPoints,
                progress_percent: progressPercent,
                level: Math.floor(completedBookings / PUJAS_PER_LEVEL) + 1,
            }
        });
    } catch (error: any) {
        logger.error('Get user stats error:', error);
        res.status(500).json({ error: error.message });
    }
}
