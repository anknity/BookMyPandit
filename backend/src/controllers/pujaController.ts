import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabaseClient.js';

// GET /api/pujas — list all puja services
export async function listPujas(req: Request, res: Response, next: NextFunction) {
    try {
        let query = supabase.from('services').select('*');

        // Only filter active for public users; admin passes ?all=true to see all
        if (req.query.all !== 'true') {
            query = query.eq('is_active', true);
        }

        const { category, search } = req.query;
        if (category && typeof category === 'string') {
            query = query.eq('category', category);
        }
        if (search && typeof search === 'string') {
            query = query.ilike('name', `%${search}%`);
        }

        const limit = Number(req.query.limit);
        if (limit && !isNaN(limit)) {
            query = query.limit(limit);
        }

        const { data, error } = await query.order('name');
        if (error) throw error;

        res.json({ pujas: data || [] });
    } catch (err) {
        next(err);
    }
}


// GET /api/pujas/categories — list puja categories
export async function listCategories(_req: Request, res: Response, next: NextFunction) {
    try {
        const { data, error } = await supabase.from('services').select('category').eq('is_active', true);
        if (error) throw error;

        const categories = [...new Set((data || []).map((d: any) => d.category))].filter(Boolean);
        res.json({ categories });
    } catch (err) {
        next(err);
    }
}

// GET /api/pujas/:id — get single puja detail
export async function getPuja(req: Request, res: Response, next: NextFunction) {
    try {
        const { data, error } = await supabase
            .from('services')
            .select('*')
            .eq('id', req.params.id)
            .single();

        if (error) throw error;
        if (!data) return res.status(404).json({ error: 'Puja service not found' });

        res.json({ puja: data });
    } catch (err) {
        next(err);
    }
}

// POST /api/pujas (admin) — create puja
export async function createPuja(req: Request, res: Response, next: NextFunction) {
    try {
        const { name, description, category, base_price, duration, image_url } = req.body;

        const { data, error } = await supabase.from('services').insert({
            name, description, category, base_price, duration,
            image_url, is_active: true,
        }).select().single();

        if (error) throw error;
        res.status(201).json({ puja: data });
    } catch (err) {
        next(err);
    }
}

// PUT /api/pujas/:id (admin) — update puja
export async function updatePuja(req: Request, res: Response, next: NextFunction) {
    try {
        // Whitelist only the fields that are actually mutable — never let client
        // send id / created_at / updated_at into Supabase, which causes a 500.
        const {
            name, name_hi, description, description_hi,
            category, base_price, duration, duration_hours,
            image_url, is_active, mantra_count,
            pandits_required, samagri_available,
            items_included, benefits,
        } = req.body;

        const updatePayload: Record<string, any> = {
            name, description, category, base_price,
            duration, is_active, pandits_required, samagri_available,
        };

        // Only include optional fields if they were actually sent
        if (name_hi !== undefined) updatePayload.name_hi = name_hi;
        if (description_hi !== undefined) updatePayload.description_hi = description_hi;
        if (image_url !== undefined) updatePayload.image_url = image_url;
        if (duration_hours !== undefined) updatePayload.duration_hours = duration_hours;
        if (mantra_count !== undefined) updatePayload.mantra_count = mantra_count;
        if (items_included !== undefined) updatePayload.items_included = items_included;
        if (benefits !== undefined) updatePayload.benefits = benefits;

        const { data, error } = await supabase
            .from('services')
            .update(updatePayload)
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) throw error;
        res.json({ puja: data });
    } catch (err) {
        next(err);
    }
}


// DELETE /api/pujas/:id (admin) — soft delete
export async function deletePuja(req: Request, res: Response, next: NextFunction) {
    try {
        const { error } = await supabase
            .from('services')
            .update({ is_active: false })
            .eq('id', req.params.id);

        if (error) throw error;
        res.json({ message: 'Puja service deleted' });
    } catch (err) {
        next(err);
    }
}
