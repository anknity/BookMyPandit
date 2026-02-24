import React, { useEffect, useState } from 'react';
import api from '@/config/api';

interface StatsData {
    totalBookings: number;
    completedBookings: number;
}

export function SmartStats() {
    const [stats, setStats] = useState<StatsData>({ totalBookings: 0, completedBookings: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch user's bookings to calculate stats
                const { data } = await api.get('/bookings');
                if (data.bookings) {
                    const total = data.bookings.length;
                    const completed = data.bookings.filter((b: any) => b.status === 'completed').length;
                    setStats({ totalBookings: total, completedBookings: completed });
                }
            } catch (error) {
                console.error("Failed to fetch smart stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    // Logic: 100 Karma points per completed puja
    const karmaPoints = stats.completedBookings * 100;

    // Level Logic: Level 1 (0-4), Level 2 (5-9), etc.
    const LEVEL_THRESHOLD = 5;
    const currentLevel = Math.floor(stats.completedBookings / LEVEL_THRESHOLD) + 1;
    const pujasInCurrentLevel = stats.completedBookings % LEVEL_THRESHOLD;
    const progressPercent = Math.round((pujasInCurrentLevel / LEVEL_THRESHOLD) * 100);

    return (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm mb-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center border border-orange-100 shrink-0">
                    <span className="material-symbols-outlined text-orange-500 font-bold">bar_chart</span>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-800 leading-tight">Smart Stats</h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Your Spiritual Journey</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-[#F8F9FA] rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                    <span className="text-4xl font-black text-slate-800 mb-1">{stats.totalBookings}</span>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pujas</span>
                </div>
                <div className="bg-[#F8F9FA] rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                    <span className="text-4xl font-black text-[#F98E2E] mb-1">{karmaPoints}</span>
                    <span className="text-[11px] font-bold text-purple-500 uppercase tracking-wider">Karma Pts</span>
                </div>
            </div>

            {/* Progress Bar */}
            <div>
                <div className="flex justify-between items-end mb-2">
                    <span className="text-slate-500 font-medium text-sm">Level {currentLevel} Progress</span>
                    <span className="text-[#F98E2E] font-bold text-sm">{progressPercent}%</span>
                </div>
                <div className="h-2.5 w-full bg-[#F1F3F5] rounded-full overflow-hidden mb-2">
                    <div
                        className="h-full bg-gradient-to-r from-orange-400 to-[#F98E2E] rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
                <div className="text-right">
                    <p className="text-xs text-slate-400 font-medium">{pujasInCurrentLevel} / {LEVEL_THRESHOLD} pujas to Level {currentLevel + 1}</p>
                </div>
            </div>
        </div>
    );
}
