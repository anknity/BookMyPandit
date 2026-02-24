import { useState, useEffect } from 'react';
import api from '@/config/api';
import { toast } from 'react-hot-toast';

interface Coupon {
    id: string;
    code: string;
    discount_percent: number;
    max_discount: number;
    max_uses: number;
    used_count: number;
    expires_at: string;
    is_active: boolean;
}

export function CouponManagement() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        discount_percent: '',
        max_discount: '',
        max_uses: '',
        expires_at: ''
    });

    const fetchCoupons = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/admin/coupons');
            setCoupons(data.coupons);
        } catch (error) {
            console.error('Failed to fetch coupons:', error);
            toast.error('Failed to load coupons');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const handleCreateCoupon = async () => {
        try {
            // Validate
            if (!formData.code || !formData.discount_percent || !formData.expires_at) {
                toast.error('Please fill required fields');
                return;
            }

            await api.post('/admin/coupons', {
                code: formData.code,
                discount_percent: Number(formData.discount_percent),
                max_discount: Number(formData.max_discount) || 0,
                max_uses: Number(formData.max_uses) || 100,
                expires_at: formData.expires_at,
                is_active: true
            });

            toast.success('Coupon created');
            setShowForm(false);
            setFormData({ code: '', discount_percent: '', max_discount: '', max_uses: '', expires_at: '' });
            fetchCoupons();
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to create coupon');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this coupon?')) return;
        try {
            await api.delete(`/admin/coupons/${id}`);
            toast.success('Coupon deleted');
            fetchCoupons();
        } catch (error) {
            toast.error('Failed to delete coupon');
        }
    };

    const handleToggleStatus = async (coupon: Coupon) => {
        try {
            await api.put(`/admin/coupons/${coupon.id}`, { is_active: !coupon.is_active });
            toast.success(`Coupon ${!coupon.is_active ? 'activated' : 'deactivated'}`);
            fetchCoupons();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const inputClass = "w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/80 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm";

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 font-display">Coupon Management</h2>
                    <p className="text-slate-500 mt-1">Create and manage discount coupons</p>
                </div>
                <button onClick={() => setShowForm(!showForm)}
                    className="bg-primary hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-md shadow-orange-200 flex items-center gap-2">
                    <span className="material-symbols-outlined">{showForm ? 'close' : 'add'}</span>
                    {showForm ? 'Cancel' : 'New Coupon'}
                </button>
            </div>

            {showForm && (
                <div className="glass-card rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Create New Coupon</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Coupon Code</label>
                            <input className={inputClass} placeholder="e.g. SUMMER25" value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })} />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Discount %</label>
                            <input type="number" className={inputClass} placeholder="e.g. 20" value={formData.discount_percent}
                                onChange={(e) => setFormData({ ...formData, discount_percent: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Max Discount (₹)</label>
                            <input type="number" className={inputClass} placeholder="e.g. 500" value={formData.max_discount}
                                onChange={(e) => setFormData({ ...formData, max_discount: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Max Uses</label>
                            <input type="number" className={inputClass} placeholder="e.g. 1000" value={formData.max_uses}
                                onChange={(e) => setFormData({ ...formData, max_uses: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Expires At</label>
                            <input type="date" className={inputClass} value={formData.expires_at}
                                onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })} />
                        </div>
                    </div>
                    <button
                        onClick={handleCreateCoupon}
                        className="mt-4 bg-primary hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-orange-200"
                    >
                        Create Coupon
                    </button>
                </div>
            )}

            {loading ? (
                <div className="text-center py-10 text-slate-500">Loading coupons...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {coupons.map((coupon) => (
                        <div key={coupon.id} className="glass-card rounded-2xl p-5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="bg-primary/10 text-primary font-mono font-bold text-lg px-3 py-1 rounded-lg">{coupon.code}</span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${coupon.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                        {coupon.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                                <p className="text-3xl font-bold text-slate-900">{coupon.discount_percent}% OFF</p>
                                <p className="text-xs text-slate-500 mt-1">Max discount: ₹{coupon.max_discount || 'Unlimited'}</p>
                                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                                    <span>{coupon.used_count}/{coupon.max_uses} used</span>
                                    <span>Expires: {new Date(coupon.expires_at).toLocaleDateString()}</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
                                    <div className="bg-primary rounded-full h-1.5 transition-all" style={{ width: `${Math.min((coupon.used_count / coupon.max_uses) * 100, 100)}%` }}></div>
                                </div>
                                <div className="flex gap-2 mt-4">
                                    <button
                                        onClick={() => handleToggleStatus(coupon)}
                                        className="flex-1 py-2 rounded-xl bg-blue-50 text-blue-600 text-xs font-bold hover:bg-blue-100 transition-colors"
                                    >
                                        {coupon.is_active ? 'Deactivate' : 'Activate'}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(coupon.id)}
                                        className="flex-1 py-2 rounded-xl bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && coupons.length === 0 && (
                <div className="text-center py-10 text-slate-400">
                    <span className="material-symbols-outlined text-4xl mb-2 block opacity-50">local_activity</span>
                    No coupons found. Create one to get started.
                </div>
            )}
        </div>
    );
}
