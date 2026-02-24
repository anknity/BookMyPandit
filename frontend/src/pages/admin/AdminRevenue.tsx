import { useState, useEffect } from 'react';
import api from '@/config/api';
import { AdminTable } from '@/components/admin/AdminTable';
import { cn } from '@/lib/utils';

interface Payment {
  id: string;
  amount: number;
  method: string;
  status: string;
  created_at: string;
  users?: { name: string; email: string };
  bookings?: { services?: { name: string } };
}

export function AdminRevenue() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const { data } = await api.get('/admin/payments');
        setPayments(data.payments);
      } catch (error) {
        console.error('Failed to fetch payments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const totalRevenue = payments.reduce((sum, p) => p.status === 'completed' ? sum + p.amount : sum, 0);
  const pendingRevenue = payments.reduce((sum, p) => p.status === 'pending' ? sum + p.amount : sum, 0);

  const columns = [
    {
      key: 'user',
      label: 'User',
      render: (_: any, row: Payment) => (
        <div>
          <p className="font-semibold text-slate-800">{row.users?.name || 'Unknown'}</p>
          <p className="text-xs text-slate-400">{row.users?.email}</p>
        </div>
      )
    },
    {
      key: 'service',
      label: 'Service',
      render: (_: any, row: Payment) => <span className="text-slate-600">{row.bookings?.services?.name || '-'}</span>
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (_: any, row: Payment) => <span className="font-bold text-slate-900">₹{row.amount}</span>
    },
    {
      key: 'method',
      label: 'Method',
      render: (v: string) => <span className="uppercase text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">{v}</span>
    },
    {
      key: 'status', label: 'Status', render: (v: string) => (
        <span className={cn("px-2 py-1 rounded-full text-xs font-bold capitalize",
          v === 'completed' ? 'bg-green-100 text-green-700' :
            v === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
        )}>
          {v}
        </span>
      )
    },
    {
      key: 'created_at',
      label: 'Date',
      render: (v: string) => new Date(v).toLocaleDateString()
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-6 rounded-2xl">
          <p className="text-slate-500 text-sm font-medium mb-1">Total Revenue</p>
          <h3 className="text-3xl font-bold text-slate-900">₹{totalRevenue.toLocaleString()}</h3>
        </div>
        <div className="glass-card p-6 rounded-2xl">
          <p className="text-slate-500 text-sm font-medium mb-1">Pending Amount</p>
          <h3 className="text-3xl font-bold text-yellow-600">₹{pendingRevenue.toLocaleString()}</h3>
        </div>
        <div className="glass-card p-6 rounded-2xl">
          <p className="text-slate-500 text-sm font-medium mb-1">Total Transactions</p>
          <h3 className="text-3xl font-bold text-slate-900">{payments.length}</h3>
        </div>
      </div>

      <div className="flex-1 min-w-0 pb-10">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Recent Transactions</h2>

        <div className="glass-card rounded-2xl p-6">
          {loading ? (
            <div className="text-center py-10 text-slate-500">Loading payments...</div>
          ) : (
            <AdminTable columns={columns} data={payments} />
          )}
        </div>
      </div>
    </div>
  );
}
