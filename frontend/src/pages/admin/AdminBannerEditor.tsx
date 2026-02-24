import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import api from '@/config/api';
import { ImageUpload } from '@/components/common/ImageUpload';
import { Puja } from '@/types';

interface BannerForm {
    badge_text: string;
    date_text: string;
    title_line1: string;
    title_line2: string;
    description: string;
    bg_image_url: string;
    book_puja_id: string;
    view_details_puja_id: string;
    is_active: boolean;
}

export function AdminBannerEditor() {
    const [pujas, setPujas] = useState<Puja[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [previewBg, setPreviewBg] = useState('');

    const { register, handleSubmit, setValue, watch, reset } = useForm<BannerForm>();

    // Watch bg_image_url to keep preview in sync
    const bgUrl = watch('bg_image_url');

    useEffect(() => {
        setPreviewBg(bgUrl || '');
    }, [bgUrl]);

    // Load current banner + all pujas (for dropdowns)
    useEffect(() => {
        Promise.all([
            api.get('/banner'),
            api.get('/pujas?all=true'),
        ]).then(([bannerRes, pujasRes]) => {
            const b = bannerRes.data.banner;
            reset({
                badge_text: b.badge_text || '',
                date_text: b.date_text || '',
                title_line1: b.title_line1 || '',
                title_line2: b.title_line2 || '',
                description: b.description || '',
                bg_image_url: b.bg_image_url || '',
                book_puja_id: b.book_puja_id || '',
                view_details_puja_id: b.view_details_puja_id || '',
                is_active: b.is_active !== false,
            });
            setPreviewBg(b.bg_image_url || '');
            setPujas(pujasRes.data.pujas || []);
        }).catch(console.error).finally(() => setLoading(false));
    }, []);

    const onSubmit = async (data: BannerForm) => {
        setSaving(true);
        try {
            await api.put('/admin/banner', data);
            toast.success('Banner updated successfully!');
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Failed to save banner');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
            </div>
        );
    }

    return (
        <div className="flex-1 min-w-0 pb-16 px-4 md:px-8 pt-6">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-800">Homepage Banner</h2>
                <p className="text-sm text-slate-500 mt-1">Edit the hero banner shown on the homepage</p>
            </div>

            {/* Live Preview */}
            <div className="mb-8 rounded-2xl overflow-hidden relative h-52 shadow-lg border border-slate-200 group">
                <div
                    className="absolute inset-0 bg-cover bg-center scale-105 group-hover:scale-100 transition-transform duration-700"
                    style={{ backgroundImage: previewBg ? `url("${previewBg}")` : undefined, backgroundColor: !previewBg ? '#f1f5f9' : undefined }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 to-white/20" />
                <div className="relative p-8 flex flex-col justify-center h-full z-10 max-w-[65%]">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-2.5 py-1 rounded-full bg-primary text-white text-[10px] font-bold uppercase">
                            {watch('badge_text') || 'Badge'}
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-white/90 text-slate-700 text-[10px] font-bold border border-white shadow-sm">
                            {watch('date_text') || 'Date'}
                        </span>
                    </div>
                    <h2 className="text-2xl font-extrabold text-slate-900 leading-tight">
                        {watch('title_line1') || 'Title Line 1'}<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-pink-500">
                            {watch('title_line2') || 'Title Line 2'}
                        </span>
                    </h2>
                    <p className="text-slate-600 text-xs mt-2 line-clamp-2">{watch('description') || 'Description...'}</p>
                </div>
                <div className="absolute top-3 right-3 bg-white/90 text-[10px] font-bold px-2 py-1 rounded-full border border-slate-200 text-slate-500">
                    LIVE PREVIEW
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Left: Content */}
                <div className="space-y-5">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">Banner Text</h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">Badge Text</label>
                                    <input {...register('badge_text')}
                                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                                        placeholder="e.g. Holi Special" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">Date / Event Text</label>
                                    <input {...register('date_text')}
                                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                                        placeholder="e.g. March 25th" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Title — Line 1 (dark text)</label>
                                <input {...register('title_line1')}
                                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                                    placeholder="e.g. Celebrate" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Title — Line 2 (gradient text)</label>
                                <input {...register('title_line2')}
                                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                                    placeholder="e.g. Colors of Holi" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Description</label>
                                <textarea {...register('description')} rows={3}
                                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all resize-none"
                                    placeholder="Short description shown under the title..." />
                            </div>
                        </div>
                    </div>

                    {/* Active toggle */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center justify-between">
                        <div>
                            <p className="font-semibold text-slate-800 text-sm">Banner Active</p>
                            <p className="text-xs text-slate-400">Hide banner from homepage if disabled</p>
                        </div>
                        <label className="inline-flex items-center cursor-pointer">
                            <input type="checkbox" {...register('is_active')} className="sr-only peer" />
                            <div className="relative w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                        </label>
                    </div>
                </div>

                {/* Right: Image + Button Links */}
                <div className="space-y-5">
                    {/* Background image */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">Background Image</h3>
                        <ImageUpload
                            key={watch('bg_image_url') || 'no-bg'}
                            defaultUrl={watch('bg_image_url')}
                            label="Upload Banner Image"
                            onUpload={(url) => setValue('bg_image_url', url, { shouldDirty: true })}
                        />
                        <input type="hidden" {...register('bg_image_url')} />
                        <p className="text-xs text-slate-400 mt-2">Or paste a direct URL:</p>
                        <input
                            value={watch('bg_image_url') || ''}
                            onChange={(e) => setValue('bg_image_url', e.target.value)}
                            className="w-full mt-1 px-3 py-2 text-xs rounded-lg border border-slate-200 focus:border-primary outline-none transition-all"
                            placeholder="https://..." />
                    </div>

                    {/* Button puja links */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">Button Links</h3>
                        <p className="text-xs text-slate-400 mb-4">Select a puja from the database to link each button to. Leave empty to link to the general pujas listing.</p>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
                                    <span className="size-2 rounded-full bg-primary inline-block" />
                                    "Book Puja" Button → links to
                                </label>
                                <select {...register('book_puja_id')}
                                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-primary outline-none bg-white transition-all">
                                    <option value="">All Pujas (/pujas)</option>
                                    {pujas.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
                                    <span className="size-2 rounded-full bg-slate-400 inline-block" />
                                    "View Details" Button → links to
                                </label>
                                <select {...register('view_details_puja_id')}
                                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-primary outline-none bg-white transition-all">
                                    <option value="">All Pujas (/pujas)</option>
                                    {pujas.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="lg:col-span-2 flex justify-end pt-2">
                    <button type="submit" disabled={saving}
                        className="px-10 py-3 rounded-xl bg-gradient-to-r from-primary to-orange-600 text-white font-bold shadow-lg shadow-orange-200 disabled:opacity-50 transition-all flex items-center gap-2">
                        {saving && <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                        {saving ? 'Saving...' : 'Save Banner'}
                    </button>
                </div>
            </form>
        </div>
    );
}
