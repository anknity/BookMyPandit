import { create } from 'zustand';

interface AdminState {
    stats: {
        totalUsers: number;
        totalPandits: number;
        totalBookings: number;
        activeBookings: number;
        pendingApprovals: number;
        totalRevenue: number;
    } | null;
    setStats: (stats: AdminState['stats']) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
    stats: null,
    setStats: (stats) => set({ stats }),
}));
