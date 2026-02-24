interface EarningsCardProps {
    totalEarnings: number;
    thisMonthEarnings?: number;
    pendingPayouts?: number;
    completedBookings?: number;
}

export function EarningsCard({ totalEarnings, thisMonthEarnings = 0, pendingPayouts = 0, completedBookings = 0 }: EarningsCardProps) {
    return (
        <div className="glass-panel rounded-2xl p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-green-600">account_balance_wallet</span>
                Earnings Overview
            </h3>
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-4 border border-green-200/50">
                    <p className="text-xs text-green-600 font-medium uppercase tracking-wider">Total Earnings</p>
                    <p className="text-2xl font-bold text-green-700 mt-1">₹{totalEarnings.toLocaleString()}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-4 border border-blue-200/50">
                    <p className="text-xs text-blue-600 font-medium uppercase tracking-wider">This Month</p>
                    <p className="text-2xl font-bold text-blue-700 mt-1">₹{thisMonthEarnings.toLocaleString()}</p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl p-4 border border-orange-200/50">
                    <p className="text-xs text-orange-600 font-medium uppercase tracking-wider">Pending</p>
                    <p className="text-2xl font-bold text-orange-700 mt-1">₹{pendingPayouts.toLocaleString()}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-4 border border-purple-200/50">
                    <p className="text-xs text-purple-600 font-medium uppercase tracking-wider">Completed</p>
                    <p className="text-2xl font-bold text-purple-700 mt-1">{completedBookings}</p>
                </div>
            </div>
        </div>
    );
}
