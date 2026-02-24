import { AdminTable } from '@/components/admin/AdminTable';
import { cn } from '@/lib/utils';

// TODO: Fetch real payments from backend
const PAYMENTS: any[] = [];

const statusColors: Record<string, string> = { completed: 'bg-green-100 text-green-700', pending: 'bg-yellow-100 text-yellow-700', refunded: 'bg-blue-100 text-blue-700', failed: 'bg-red-100 text-red-700' };
const methodIcons: Record<string, string> = { stripe: '💳', razorpay: '🏦', wallet: '👛', cash: '💵' };

export function PaymentManagement() {
    const totalRevenue = PAYMENTS.filter(p => p.status === 'completed').reduce((s, p) => s + p.amount, 0);

    const columns = [
        { key: 'user', label: 'Customer' },
        { key: 'service', label: 'Service' },
        { key: 'amount', label: 'Amount', render: (v: number) => <span className="font-bold">₹{v.toLocaleString()}</span> },
        { key: 'method', label: 'Method', render: (v: string) => <span className="capitalize">{methodIcons[v]} {v}</span> },
        { key: 'status', label: 'Status', render: (v: string) => <span className={cn("px-2 py-1 rounded-full text-xs font-bold capitalize", statusColors[v])}>{v}</span> },
        { key: 'date', label: 'Date' },
        {
            key: 'actions', label: '', render: (_: any, row: any) => row.status === 'completed' && (
                <button className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-bold">Refund</button>
            )
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 font-display">Payment Management</h2>
                <p className="text-slate-500 mt-1">Total Revenue: <span className="text-green-600 font-bold">₹{totalRevenue.toLocaleString()}</span></p>
            </div>
            <div className="glass-card rounded-2xl p-6">
                <AdminTable columns={columns} data={PAYMENTS} />
            </div>
        </div>
    );
}
