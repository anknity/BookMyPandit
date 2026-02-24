import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { supabase } from '../config/supabaseClient.js';

const BANNER_KEY = 'homepage_banner';

// Default banner content (used if no DB row exists yet)
export const DEFAULT_BANNER = {
    badge_text: 'Holi Special',
    date_text: 'March 25th',
    title_line1: 'Celebrate',
    title_line2: 'Colors of Holi',
    description: 'Embrace the festival of colors with divine blessings. Book special Holika Dahan puja and verified pandits for your home.',
    bg_image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCL5T5SWVPYZ-SmfuH0MjYBMB7AYVz2PflZ4loCj8AIPG6PlR2mcbiKhketR-gqKJokihZG304D7HksisaoG2y88MBDR7CK6oUXreHimwh2GgbTV4L3pcC7Zzvdq_MMejqiKBQj0y0kDEEtp8jaNQLzWDuLRMNYd90JU_P2m6nBNLMDvZAD26VujUqSb67e4y5NLY9zOeogrzhK9cPIE8tdYr2dPoypzYm38ElPC63Zz5_F87RXk9ZyFPljiTgToQK-a0ufr786Biw',
    book_puja_id: null,      // links to a puja id for "Book Puja" button
    view_details_puja_id: null, // links to a puja id for "View Details" button
    is_active: true,
};

// GET /api/banner — public, no auth required
export async function getBanner(req: Request, res: Response, next: NextFunction) {
    try {
        let banner = DEFAULT_BANNER;
        const { data, error } = await supabase
            .from('site_settings')
            .select('value')
            .eq('key', BANNER_KEY)
            .single();

        if (!error && data?.value) {
            banner = data.value;
        }

        res.json({ banner });
    } catch (err) {
        // If table doesn't exist or other error, just return default
        res.json({ banner: DEFAULT_BANNER });
    }
}

// PUT /api/admin/banner — admin only
export async function updateBanner(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const {
            badge_text, date_text, title_line1, title_line2,
            description, bg_image_url,
            book_puja_id, view_details_puja_id, is_active,
        } = req.body;

        const value = {
            badge_text, date_text, title_line1, title_line2,
            description, bg_image_url,
            book_puja_id: book_puja_id || null,
            view_details_puja_id: view_details_puja_id || null,
            is_active: is_active !== false,
        };

        // Upsert into site_settings
        const { data, error } = await supabase
            .from('site_settings')
            .upsert({ key: BANNER_KEY, value }, { onConflict: 'key' })
            .select()
            .single();

        if (error) throw error;
        res.json({ banner: data.value });
    } catch (err) {
        next(err);
    }
}
