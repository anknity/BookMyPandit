import { useState, useEffect } from 'react';
import { Puja } from '@/types';
import { PujaCard } from '@/components/user/PujaCard';

export function TrendingPujas() {
    const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://bookmypandit-backend.onrender.com/api';
    const [pujas, setPujas] = useState<Puja[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPujas = async () => {
            try {
                const response = await fetch(`${apiBaseUrl}/pujas?limit=4`);
                const data = await response.json();
                setPujas(data.pujas || []);
            } catch (error) {
                console.error("Failed to fetch trending pujas", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPujas();
    }, []);

    if (loading) {
        return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
            {[1, 2, 3].map(i => (
                <div key={i} className="bg-[#FCFAF6] rounded-[32px] p-2 h-[380px] animate-pulse border border-slate-100">
                    <div className="bg-slate-200 h-48 rounded-[24px] mb-4"></div>
                    <div className="px-3">
                        <div className="bg-slate-200 h-6 w-3/4 rounded mb-2"></div>
                        <div className="bg-slate-200 h-4 w-full rounded mb-1"></div>
                        <div className="bg-slate-200 h-4 w-2/3 rounded mb-4"></div>
                        <div className="flex gap-2">
                            <div className="bg-slate-200 h-8 w-16 rounded-full"></div>
                            <div className="bg-slate-200 h-8 w-16 rounded-full"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
            {pujas.slice(0, 3).map((puja) => (
                <PujaCard key={puja.id} puja={puja} />
            ))}
        </div>
    );
}
