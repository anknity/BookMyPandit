import { useState } from 'react';

// TODO: Fetch real transactions from backend
const TRANSACTIONS: any[] = [];

export function Wallet() {
    const [addAmount, setAddAmount] = useState('');
    const balance = 0; // TODO: Fetch real balance from backend

    const quickAmounts = [500, 1000, 2000, 5000];

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            {/* Balance Card */}
            <div className="bg-gradient-to-br from-primary via-orange-500 to-orange-600 rounded-3xl p-8 text-white shadow-xl shadow-orange-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/3 translate-x-1/3"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4"></div>
                <div className="relative z-10">
                    <p className="text-white/80 text-sm font-medium">Wallet Balance</p>
                    <h2 className="text-5xl font-bold mt-2 font-display">₹{balance.toLocaleString()}</h2>
                    <div className="flex items-center gap-2 mt-4">
                        <span className="material-symbols-outlined text-white/70">account_balance_wallet</span>
                        <span className="text-white/70 text-sm">BookMyPandit Wallet</span>
                    </div>
                </div>
            </div>

            {/* Add Money */}
            <div className="glass-card rounded-2xl p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-green-600">add_circle</span>
                    Add Money
                </h3>
                <div className="flex flex-wrap gap-3 mb-4">
                    {quickAmounts.map((amt) => (
                        <button key={amt} onClick={() => setAddAmount(String(amt))}
                            className={`px-5 py-2.5 rounded-xl border text-sm font-bold transition-all ${addAmount === String(amt) ? 'border-primary bg-primary/10 text-primary' : 'border-slate-200 text-slate-600 hover:border-primary/50'}`}>
                            ₹{amt.toLocaleString()}
                        </button>
                    ))}
                </div>
                <div className="flex gap-3">
                    <input type="number" value={addAmount} onChange={(e) => setAddAmount(e.target.value)}
                        className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-white/80 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
                        placeholder="Enter amount" />
                    <button className="bg-primary hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-orange-200 flex items-center gap-2">
                        <span className="material-symbols-outlined">add</span> Add
                    </button>
                </div>
            </div>

            {/* Transactions */}
            <div className="glass-card rounded-2xl p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary">receipt_long</span>
                    Transaction History
                </h3>
                <div className="space-y-3">
                    {TRANSACTIONS.length === 0 ? (
                        <p className="text-sm text-slate-500 text-center py-4">No recent transactions</p>
                    ) : (
                        TRANSACTIONS.map((txn) => (
                            <div key={txn.id} className="flex items-center justify-between p-4 rounded-xl bg-white border border-slate-100 hover:shadow-sm transition-shadow">
                                <div className="flex items-center gap-3">
                                    <div className={`size-10 rounded-full flex items-center justify-center ${txn.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                        <span className="material-symbols-outlined">{txn.type === 'credit' ? 'arrow_downward' : 'arrow_upward'}</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800">{txn.description}</p>
                                        <p className="text-xs text-slate-400">{txn.date}</p>
                                    </div>
                                </div>
                                <span className={`text-sm font-bold ${txn.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                                    {txn.type === 'credit' ? '+' : '-'}₹{txn.amount.toLocaleString()}
                                </span>
                            </div>
                        )))}
                </div>
            </div>
        </div>
    );
}
