import { useEffect, useState } from 'react';
import { AdminTable } from '@/components/admin/AdminTable';
import { cn } from '@/lib/utils';
import api from '@/config/api';

interface Pandit {
  id: string;
  user_id: string;
  bio: string;
  experience_years: number;
  city: string;
  state: string;
  status: 'pending' | 'active' | 'suspended' | 'rejected';
  rating: number; // calculated field usually
  users: {
    name: string;
    email: string;
    phone: string;
    avatar_url?: string;
  };
}

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  suspended: 'bg-red-100 text-red-700',
  rejected: 'bg-slate-100 text-slate-600',
};

export function PanditManagement() {
  const [pandits, setPandits] = useState<Pandit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPandits();
  }, []);

  const fetchPandits = async () => {
    try {
      const { data } = await api.get('/pandits/admin/all');
      setPandits(data.pandits || []);
    } catch (error) {
      console.error('Error fetching pandits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    if (!confirm(`Are you sure you want to change status to ${status}?`)) return;
    try {
      await api.put(`/pandits/${id}/status`, { status });
      fetchPandits(); // Refresh list
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const columns = [
    {
      key: 'name', label: 'Pandit', render: (_: any, row: Pandit) => (
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-orange-700 font-bold text-sm overflow-hidden">
            {row.users.avatar_url ? (
              <img src={row.users.avatar_url} alt={row.users.name} className="w-full h-full object-cover" />
            ) : (
              row.users.name.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <p className="font-semibold text-slate-800">{row.users.name}</p>
            <p className="text-xs text-slate-400">{row.users.email}</p>
          </div>
        </div>
      )
    },
    { key: 'city', label: 'City' },
    { key: 'experience_years', label: 'Experience', render: (v: number) => `${v} yrs` },
    // Rating might be complex to calculate on fly if simplified query, defaulting to 0 or N/A if not in join
    // The backend join pandit_services -> ... doesn't give average rating directly unless we aggregate.
    // For now removing Rating column or showing N/A if not available.
    // Actually getPandit has reviews, listAllPandits didn't join reviews. I'll omit rating for now or fetch it if crucial.
    {
      key: 'status', label: 'Status', render: (v: string) => (
        <span className={cn("px-2 py-1 rounded-full text-xs font-bold capitalize", statusColors[v])}>{v}</span>
      )
    },
    {
      key: 'actions', label: 'Actions', render: (_: any, row: Pandit) => (
        <div className="flex gap-2">
          {row.status === 'pending' && (
            <button onClick={() => handleStatusChange(row.id, 'active')} className="px-3 py-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 text-xs font-bold transition-colors">Approve</button>
          )}
          {row.status === 'active' && (
            <button onClick={() => handleStatusChange(row.id, 'suspended')} className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold transition-colors">Suspend</button>
          )}
          {row.status === 'suspended' && (
            <button onClick={() => handleStatusChange(row.id, 'active')} className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-bold transition-colors">Reactivate</button>
          )}
        </div>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 font-display">Pandit Management</h2>
        <p className="text-slate-500 mt-1">{pandits.length} registered pandits</p>
      </div>
      <div className="glass-card rounded-2xl p-6 bg-white border border-slate-100 shadow-sm">
        {loading ? (
          <div className="text-center py-10 text-slate-400">Loading pandits...</div>
        ) : (
          <AdminTable columns={columns} data={pandits} />
        )}
      </div>
    </div>
  );
}
