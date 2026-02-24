import { useState, useEffect } from 'react';
import { AdminTable } from '@/components/admin/AdminTable';
import { cn } from '@/lib/utils';
import api from '@/config/api';
import { toast } from 'react-hot-toast';

interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    is_blocked: boolean;
    created_at: string;
    wallet?: { balance: number };
    bookings?: { count: number };
}

export function UserManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const { data } = await api.get(`/admin/users?page=${page}&search=${search}`);
            setUsers(data.users);
            setTotalPages(Math.ceil(data.total / 20)); // Assuming default limit 20
        } catch (error) {
            console.error('Failed to fetch users:', error);
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const debounce = setTimeout(() => {
            fetchUsers();
        }, 500);
        return () => clearTimeout(debounce);
    }, [search, page]);

    const handleBlockToggle = async (id: string, isBlocked: boolean) => {
        try {
            const endpoint = isBlocked ? `/admin/users/unblock/${id}` : `/admin/users/block/${id}`;
            await api.put(endpoint);
            toast.success(isBlocked ? 'User unblocked' : 'User blocked');
            fetchUsers();
        } catch (error) {
            toast.error('Failed to update user status');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this user? This cannot be undone.')) return;
        try {
            await api.delete(`/admin/users/${id}`);
            toast.success('User deleted');
            fetchUsers();
        } catch (error) {
            toast.error('Failed to delete user');
        }
    };

    const columns = [
        {
            key: 'name', label: 'User', render: (_: any, row: User) => (
                <div className="flex items-center gap-3">
                    <div className="size-9 rounded-full bg-gradient-to-br from-primary/20 to-orange-100 flex items-center justify-center text-primary font-bold text-sm uppercase">
                        {row.name?.[0] || '?'}
                    </div>
                    <div>
                        <p className="font-semibold text-slate-800">{row.name}</p>
                        <p className="text-xs text-slate-400">{row.email}</p>
                    </div>
                </div>
            )
        },
        { key: 'phone', label: 'Phone', render: (v: string) => v || '-' },
        {
            key: 'bookings',
            label: 'Bookings',
            render: (_: any, row: any) => <span className="font-bold">{row.bookings?.[0]?.count || 0}</span>
        },
        {
            key: 'wallet',
            label: 'Wallet',
            render: (_: any, row: any) => <span className="font-bold text-green-600">₹{row.wallet?.balance || 0}</span>
        },
        {
            key: 'is_blocked', label: 'Status', render: (v: boolean) => (
                <span className={cn("px-2 py-1 rounded-full text-xs font-bold", v ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700')}>
                    {v ? 'Blocked' : 'Active'}
                </span>
            )
        },
        {
            key: 'actions', label: 'Actions', render: (_: any, row: User) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => handleBlockToggle(row.id, row.is_blocked)}
                        className={cn("p-1.5 rounded-lg text-xs font-bold transition-colors", row.is_blocked ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-red-50 text-red-600 hover:bg-red-100')}
                    >
                        {row.is_blocked ? 'Unblock' : 'Block'}
                    </button>
                    <button
                        onClick={() => handleDelete(row.id)}
                        className="p-1.5 rounded-lg bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                    >
                        <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                </div>
            )
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 font-display">User Management</h2>
                    <p className="text-slate-500 mt-1">{users.length} registered users found</p>
                </div>
            </div>

            <div className="relative max-w-md">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">search</span>
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white/80 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
                    placeholder="Search users..."
                />
            </div>

            <div className="glass-card rounded-2xl p-6">
                {loading ? (
                    <div className="text-center py-10 text-slate-500">Loading users...</div>
                ) : (
                    <AdminTable columns={columns} data={users} />
                )}
            </div>

            {/* Pagination Controls could go here */}
        </div>
    );
}
