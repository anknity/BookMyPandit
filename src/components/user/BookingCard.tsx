import { cn } from '@/lib/utils';

export interface BookingCardProps {
    id: string;
    serviceName: string;
    panditName: string;
    date: string;
    status: string;
    amount: string;
    imageUrl?: string;
    timeSlot?: string;
    paymentMethod?: string;
    [key: string]: any;
}

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    in_progress: 'bg-purple-100 text-purple-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    cash_on_service: 'bg-amber-100 text-amber-700',
};

export function BookingCard({ id, serviceName, panditName, date, status, amount, imageUrl, timeSlot, paymentMethod }: BookingCardProps) {
    return (
        <div className="bg-white rounded-2xl p-4 border border-slate-100 flex gap-4 hover:shadow-md transition-shadow">
            {imageUrl ? (
                <div className="w-20 h-20 rounded-xl bg-cover bg-center shrink-0 bg-slate-100" style={{ backgroundImage: `url("${imageUrl}")` }} />
            ) : (
                <div className="w-20 h-20 rounded-xl bg-orange-50 shrink-0 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-2xl">temple_hindu</span>
                </div>
            )}
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <h4 className="font-bold text-slate-900 truncate">{serviceName}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">by {panditName}</p>
                    </div>
                    <span className={cn("px-2 py-1 rounded-full text-xs font-bold shrink-0 capitalize", statusColors[status] || 'bg-slate-100 text-slate-600')}>
                        {status.replace(/_/g, ' ')}
                    </span>
                </div>
                <div className="flex flex-wrap items-center justify-between mt-3 gap-2">
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                            {date}
                        </span>
                        {timeSlot && (
                            <span className="flex items-center gap-1 capitalize">
                                <span className="material-symbols-outlined text-[14px]">schedule</span>
                                {timeSlot.replace(/_/g, ' ')}
                            </span>
                        )}
                        {paymentMethod === 'cash' && (
                            <span className="flex items-center gap-1 text-amber-600 font-medium">
                                <span className="material-symbols-outlined text-[14px]">payments</span>
                                Cash on Service
                            </span>
                        )}
                    </div>
                    <p className="text-sm font-bold text-slate-900">{amount}</p>
                </div>
            </div>
        </div>
    );
}

