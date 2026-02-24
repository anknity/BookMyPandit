import { AdminTable } from '@/components/admin/AdminTable';
import { cn } from '@/lib/utils';

// TODO: Fetch real reports from backend
const REPORTS: any[] = [];

export function ReportsManagement() {
    const columns = [
        { key: 'reporter', label: 'Reported By' },
        { key: 'target_type', label: 'Type', render: (v: string) => <span className="capitalize bg-slate-100 text-slate-600 px-2 py-1 rounded-lg text-xs font-bold">{v}</span> },
        { key: 'reason', label: 'Reason', render: (v: string) => <span className="text-sm max-w-xs truncate block">{v}</span> },
        {
            key: 'status', label: 'Status', render: (v: string) => (
                <span className={cn("px-2 py-1 rounded-full text-xs font-bold capitalize", v === 'open' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700')}>{v}</span>
            )
        },
        { key: 'created_at', label: 'Date' },
        {
            key: 'actions', label: '', render: (_: any, row: any) => row.status === 'open' && (
                <button className="px-3 py-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 text-xs font-bold">Resolve</button>
            )
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 font-display">Reports</h2>
                <p className="text-slate-500 mt-1">{REPORTS.filter(r => r.status === 'open').length} open reports</p>
            </div>
            <div className="glass-card rounded-2xl p-6">
                <AdminTable columns={columns} data={REPORTS} />
            </div>
        </div>
    );
}
