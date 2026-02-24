import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware.js';

export function adminMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
    const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase());
    const userEmail = req.user?.email?.toLowerCase();

    if (!userEmail || !adminEmails.includes(userEmail)) {
        return res.status(403).json({ error: 'Admin access denied. Your email is not in the admin whitelist.' });
    }

    next();
}
