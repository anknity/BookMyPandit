import { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getPanditEarnings, getPanditDashboardStats } from '@/services/panditService';

interface Payment {
    id: string;
    amount: number;
    status: string;
    created_at: string;
    bookings?: { services?: { name: string } };
}

interface Stats {
    totalEarnings: number;
    thisMonthEarnings: number;
    pendingPayouts: number;
    completedBookings: number;
}

export function Earnings() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [earningsData, statsData] = await Promise.all([
                    getPanditEarnings(),
                    getPanditDashboardStats(),
                ]);
                setPayments(earningsData.payments || []);
                setStats({
                    totalEarnings: statsData.totalEarnings || 0,
                    thisMonthEarnings: statsData.thisMonthEarnings || 0,
                    pendingPayouts: statsData.pendingPayouts || 0,
                    completedBookings: statsData.completedBookings || 0,
                });
            } catch (err) {
                console.error('Earnings fetch error:', err);
                setPayments([]);
                setStats({ totalEarnings: 0, thisMonthEarnings: 0, pendingPayouts: 0, completedBookings: 0 });
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    // Compute monthly chart data from real payments
    const monthlyData = useMemo(() => {
        const months: Record<string, number> = {};
        const now = new Date();
        // Initialize last 6 months
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const key = d.toLocaleDateString('en-US', { month: 'short' });
            months[key] = 0;
        }
        // Aggregate payments
        payments.forEach(p => {
            if (p.status === 'completed' && p.created_at) {
                const d = new Date(p.created_at);
                const key = d.toLocaleDateString('en-US', { month: 'short' });
                if (key in months) {
                    months[key] += p.amount || 0;
                }
            }
        });
        return Object.entries(months).map(([month, earnings]) => ({ month, earnings }));
    }, [payments]);

    if (loading) {
        return (
            <div className="space-y-8 animate-pulse">
                <div>
                    <div className="h-8 w-32 bg-slate-200 rounded-xl mb-2" />
                    <div className="h-4 w-56 bg-slate-100 rounded-lg" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="rounded-xl bg-white border border-slate-100 p-5">
                            <div className="h-3 w-20 bg-slate-100 rounded mb-2" />
                            <div className="h-8 w-28 bg-slate-100 rounded" />
                        </div>
                    ))}
                </div>
                <div className="h-[300px] bg-white rounded-2xl border border-slate-100" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 font-display">Earnings</h2>
                <p className="text-slate-500 mt-1">Track your income and payouts</p>
            </div>

            {/* Earnings Overview */}
            {stats && (
                <div className="bg-white rounded-2xl p-6 border border-slate-100/80 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-emerald-600">account_balance_wallet</span>
                        Earnings Overview
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl p-4 border border-emerald-200/40">
                            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Total Earnings</p>
                            <p className="text-2xl font-black text-emerald-700 mt-1">₹{stats.totalEarnings.toLocaleString()}</p>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-4 border border-blue-200/40">
                            <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">This Month</p>
                            <p className="text-2xl font-black text-blue-700 mt-1">₹{stats.thisMonthEarnings.toLocaleString()}</p>
                        </div>
                        <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl p-4 border border-amber-200/40">
                            <p className="text-[10px] text-amber-600 font-bold uppercase tracking-widest">Pending</p>
                            <p className="text-2xl font-black text-amber-700 mt-1">₹{stats.pendingPayouts.toLocaleString()}</p>
                        </div>
                        <div className="bg-gradient-to-br from-violet-50 to-violet-100/50 rounded-xl p-4 border border-violet-200/40">
                            <p className="text-[10px] text-violet-600 font-bold uppercase tracking-widest">Completed</p>
                            <p className="text-2xl font-black text-violet-700 mt-1">{stats.completedBookings}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Monthly Earnings Chart */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100/80 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Monthly Earnings</h3>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} />
                            <YAxis tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                            <Tooltip
                                formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Earnings']}
                                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                            />
                            <Bar dataKey="earnings" fill="#ea580c" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Payments */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100/80 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Payments</h3>
                {payments.length === 0 ? (
                    <div className="py-8 text-center">
                        <div className="inline-flex p-3 rounded-full bg-slate-50 mb-3">
                            <span className="material-symbols-outlined text-3xl text-slate-300">payments</span>
                        </div>
                        <p className="text-slate-400 text-sm">No payments received yet</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {payments.slice(0, 10).map((payment) => (
                            <div key={payment.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50/50 border border-slate-100/60 hover:bg-white hover:shadow-sm transition-all">
                                <div>
                                    <p className="text-sm font-semibold text-slate-800">
                                        {payment.bookings?.services?.name || 'Service'}
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        {new Date(payment.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-slate-900">₹{(payment.amount || 0).toLocaleString()}</p>
                                    <span className={`text-xs font-bold ${payment.status === 'completed' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                        {payment.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
