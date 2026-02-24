import { Request, Response, NextFunction } from 'express';
import { auth } from '../config/firebaseAdmin.js';
import { supabase } from '../config/supabaseClient.js';
import { logger } from '../server.js';

export interface AuthRequest extends Request {
    user?: {
        uid: string;
        email: string;
        role: string;
        userId: string;
    };
}

export async function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const token = authHeader.split('Bearer ')[1];
        const decoded = await auth.verifyIdToken(token);

        // Get user from Supabase
        const { data: user } = await supabase
            .from('users')
            .select('id, role')
            .eq('firebase_uid', decoded.uid)
            .single();

        req.user = {
            uid: decoded.uid,
            email: decoded.email || '',
            role: user?.role || 'user',
            userId: user?.id || '',
        };

        next();
    } catch (error) {
        logger.error('Auth middleware error:', error);
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}
