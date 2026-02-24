import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { supabase } from '../config/supabaseClient.js';
import { auth } from '../config/firebaseAdmin.js';
import { logger } from '../server.js';

// POST /api/auth/register
export async function register(req: AuthRequest, res: Response) {
    try {
        const { firebase_uid, email, name, phone, role = 'user' } = req.body;

        // Check admin whitelist
        const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase());
        const assignedRole = adminEmails.includes(email?.toLowerCase()) ? 'admin' : role;

        const { data, error } = await supabase
            .from('users')
            .upsert({
                firebase_uid,
                email,
                name,
                phone,
                role: assignedRole,
            }, { onConflict: 'firebase_uid' })
            .select()
            .single();

        if (error) throw error;

        // Also create wallet
        await supabase.from('wallet').upsert({ user_id: data.id, balance: 0 }, { onConflict: 'user_id' });

        res.status(201).json({ user: data });
    } catch (error: any) {
        logger.error('Registration error:', error);
        res.status(500).json({ error: error.message });
    }
}

// POST /api/auth/login
export async function login(req: AuthRequest, res: Response) {
    try {
        const { firebase_uid, email, name, avatar_url } = req.body;

        const { data: user } = await supabase
            .from('users')
            .select('*')
            .eq('firebase_uid', firebase_uid)
            .single();

        if (!user) {
            // Auto-register on first login
            const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase());
            const role = adminEmails.includes(email?.toLowerCase()) ? 'admin' : 'user';

            const { data: newUser, error } = await supabase
                .from('users')
                .insert({ firebase_uid, email, role, name, avatar_url, fcm_token: req.body.fcm_token })
                .select()
                .single();

            if (error) throw error;
            await supabase.from('wallet').insert({ user_id: newUser.id, balance: 0 });
            return res.json({ user: newUser });
        } else {
            // Update name/avatar/device token/role if needed
            const fcm_token = req.body.fcm_token;
            const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase());
            const isAdminEmail = email && adminEmails.includes(email.toLowerCase());

            const updates: any = {};
            if (name && user.name !== name) updates.name = name;
            if (avatar_url && user.avatar_url !== avatar_url) updates.avatar_url = avatar_url;
            if (fcm_token && user.fcm_token !== fcm_token) updates.fcm_token = fcm_token;
            if (isAdminEmail && user.role !== 'admin') updates.role = 'admin';

            if (Object.keys(updates).length > 0) {
                await supabase.from('users').update(updates).eq('id', user.id);
                Object.assign(user, updates);
            }
        }

        if (user.is_blocked) {
            return res.status(403).json({ error: 'Your account has been blocked. Contact support.' });
        }

        res.json({ user });
    } catch (error: any) {
        logger.error('Login error:', error);
        res.status(500).json({ error: error.message });
    }
}

// GET /api/auth/me
export async function getMe(req: AuthRequest, res: Response) {
    try {
        const { data: user } = await supabase
            .from('users')
            .select('*, wallet(balance)')
            .eq('firebase_uid', req.user!.uid)
            .single();

        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ user });
    } catch (error: any) {
        logger.error('Get me error:', error);
        res.status(500).json({ error: error.message });
    }
}

// PUT /api/auth/profile
export async function updateProfile(req: AuthRequest, res: Response) {
    try {
        const { name, phone, avatar_url, fcm_token } = req.body;

        const updates: any = {};
        if (name) updates.name = name;
        if (phone) updates.phone = phone;
        if (avatar_url) updates.avatar_url = avatar_url;
        if (fcm_token) updates.fcm_token = fcm_token;

        const { data: user, error } = await supabase
            .from('users')
            .update(updates)
            .eq('id', req.user!.userId)
            .select()
            .single();

        if (error) throw error;
        res.json({ user });
    } catch (error: any) {
        logger.error('Update profile error:', error);
        res.status(500).json({ error: error.message });
    }
}
