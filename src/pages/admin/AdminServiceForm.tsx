import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Puja } from '@/types';
import { cn } from '@/lib/utils';
import api from '@/config/api';
import { ImageUpload } from '@/components/common/ImageUpload';

type PujaFormData = Omit<Puja, 'id' | 'created_at' | 'updated_at'>;

export function AdminServiceForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<PujaFormData>();

    // Watch image_url reactively so ImageUpload shows the current value
    const currentImageUrl = watch('image_url');

    useEffect(() => {
        if (isEditMode) fetchService();
    }, [id]);

    const fetchService = async () => {
        try {
            // API returns { puja: {...} }
            const { data } = await api.get(`/pujas/${id}`);
            const puja: Puja = data.puja;
            if (!puja) return setError('Service not found');

            // Populate all form fields from the fetched puja
            (Object.keys(puja) as (keyof Puja)[]).forEach((key) => {
                if (key !== 'id' && key !== 'created_at' && key !== 'updated_at') {
                    setValue(key as keyof PujaFormData, (puja as any)[key]);
                }
            });
        } catch (err: any) {
            setError(err.response?.data?.error || err.message || 'Failed to fetch service');
        }
    };

    const onSubmit = async (formData: PujaFormData) => {
        setLoading(true);
        setError('');
        try {
            if (isEditMode) {
                await api.put(`/pujas/${id}`, formData);
            } else {
                await api.post('/pujas', formData);
            }
            navigate('/admin/services');
        } catch (err: any) {
            setError(err.response?.data?.error || err.message || 'Failed to save service');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 pb-20">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-slate-800">
                    {isEditMode ? 'Edit Puja Service' : 'Add New Puja Service'}
                </h2>
                <button type="button" onClick={() => navigate('/admin/services')} className="text-slate-500 hover:text-primary transition-colors">
                    Cancel
                </button>
            </div>

            {error && (
                <div className="p-4 mb-6 bg-red-50 text-red-600 rounded-lg border border-red-200 flex items-center gap-2">
                    <span className="material-symbols-outlined">error</span>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

                {/* Basic Info */}
                <div className="glass-card p-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-bold mb-4 border-b border-slate-100 pb-2 text-slate-700">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Name (English)</label>
                            <input {...register('name', { required: 'Name is required' })}
                                className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="e.g. Satyanarayan Puja" />
                            {errors.name && <span className="text-red-500 text-xs mt-1">{errors.name.message}</span>}
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Name (Hindi)</label>
                            <input {...register('name_hi')}
                                className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="e.g. सत्यनारायण पूजा" />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Description (English)</label>
                            <textarea {...register('description', { required: 'Description is required' })}
                                className="w-full p-2.5 border border-slate-200 rounded-lg h-28 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none" />
                            {errors.description && <span className="text-red-500 text-xs mt-1">{errors.description.message}</span>}
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Description (Hindi)</label>
                            <textarea {...register('description_hi')}
                                className="w-full p-2.5 border border-slate-200 rounded-lg h-28 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none" />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
                            <select {...register('category', { required: true })} className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white">
                                <option value="Mantra Jaap">Mantra Jaap</option>
                                <option value="Sanskar">Sanskar</option>
                                <option value="Graha Puja">Graha Puja</option>
                                <option value="Path & Stotra">Path & Stotra</option>
                                <option value="Home & Business">Home & Business</option>
                                <option value="Special Puja">Special Puja</option>
                                <option value="Dosh Nivaran">Dosh Nivaran</option>
                                <option value="Shraddh & Pitra">Shraddh & Pitra</option>
                                <option value="Daan & Charity">Daan & Charity</option>
                            </select>
                        </div>

                        <div>
                            {/* currentImageUrl is reactive—updates after async fetch completes */}
                            <ImageUpload
                                key={currentImageUrl ?? 'no-image'}
                                defaultUrl={currentImageUrl}
                                label="Puja Image"
                                onUpload={(url) => setValue('image_url', url, { shouldDirty: true })}
                            />
                            <input type="hidden" {...register('image_url')} />
                        </div>
                    </div>
                </div>

                {/* Pricing & Details */}
                <div className="glass-card p-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-bold mb-4 border-b border-slate-100 pb-2 text-slate-700">Pricing & Service Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Base Price (₹)</label>
                            <input type="number" {...register('base_price', { required: true, min: 0, valueAsNumber: true })}
                                className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Duration</label>
                            <input {...register('duration', { required: true })}
                                className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="e.g. 2-3 Hours" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Pandits Required</label>
                            <input type="number" {...register('pandits_required', { required: true, min: 1, valueAsNumber: true })}
                                className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                        </div>

                        <div className={cn("flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors")}>
                            <input type="checkbox" {...register('samagri_available')} className="size-5 rounded border-slate-300 text-primary focus:ring-primary" id="samagri" />
                            <label htmlFor="samagri" className="font-semibold text-slate-700 cursor-pointer select-none">Samagri Kit Available?</label>
                        </div>

                        <div className={cn("flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors")}>
                            <input type="checkbox" {...register('is_active')} className="size-5 rounded border-slate-300 text-primary focus:ring-primary" id="active" />
                            <label htmlFor="active" className="font-semibold text-slate-700 cursor-pointer select-none">Is Active Service?</label>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                    <button type="button" onClick={() => navigate('/admin/services')}
                        className="px-6 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 font-bold text-slate-600 transition-all">
                        Cancel
                    </button>
                    <button type="submit" disabled={loading}
                        className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-primary to-orange-600 hover:to-orange-700 text-white font-bold shadow-lg shadow-orange-200 disabled:opacity-50 transition-all flex items-center gap-2">
                        {loading ? <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : null}
                        {isEditMode ? 'Update Service' : 'Create Service'}
                    </button>
                </div>
            </form>
        </div>
    );
}
