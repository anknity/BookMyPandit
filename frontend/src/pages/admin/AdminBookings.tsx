import { useEffect, useState } from 'react';
import { AdminTable } from '@/components/admin/AdminTable';
import { cn } from '@/lib/utils';
import api from '@/config/api';

interface Booking {
  id: string;
  booking_date: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  services: { name: string };
  users: { name: string; email: string };
  pandits?: { users: { name: string } };
}

const statusColors: Record<string, string> = {
  confirmed: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-red-100 text-red-700',
};

export function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await api.get('/admin/bookings');
      setBookings(data.bookings || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: 'id', label: 'Booking ID', render: (v: string) => <span className="font-mono text-slate-500 text-xs">#{v.slice(0, 8)}</span>
    },
    {
      key: 'user', label: 'User', render: (_: any, row: Booking) => (
        <div>
          <p className="font-semibold text-slate-800">{row.users?.name}</p>
          <p className="text-xs text-slate-400">{row.users?.email}</p>
        </div>
      )
    },
    {
      key: 'service', label: 'Service', render: (_: any, row: Booking) => row.services?.name
    },
    {
      key: 'pandit', label: 'Assigned Pandit', render: (_: any, row: Booking) => row.pandits?.users?.name || <span className="text-slate-400 italic">Unassigned</span>
    },
    {
      key: 'booking_date', label: 'Date', render: (v: string) => new Date(v).toLocaleDateString(undefined, { dateStyle: 'medium' })
    },
    {
      key: 'status', label: 'Status', render: (v: string) => (
        <span className={cn("px-2 py-1 rounded-full text-xs font-bold capitalize", statusColors[v])}>{v}</span>
      )
    },
    {
      key: 'amount', label: 'Amount', render: (v: number) => <span className="font-bold text-slate-700">₹{v}</span>
    },
    {
      key: 'actions', label: 'Actions', render: (_: any, row: Booking) => (
        <button className="text-primary hover:underline text-xs font-bold">Details</button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 font-display">Booking Management</h2>
        <p className="text-slate-500 mt-1">{bookings.length} total bookings</p>
      </div>
      <div className="glass-card rounded-2xl p-6 bg-white border border-slate-100 shadow-sm">
        {loading ? (
          <div className="text-center py-10 text-slate-400">Loading bookings...</div>
        ) : (
          <AdminTable columns={columns} data={bookings} />
        )}
      </div>
    </div>
  );
}
