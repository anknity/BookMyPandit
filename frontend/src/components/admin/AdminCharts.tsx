import React from 'react';

interface ChartCardProps {
    title: string;
    children: React.ReactNode;
}

export function ChartCard({ title, children }: ChartCardProps) {
    return (
        <div className="glass-panel rounded-2xl p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">{title}</h3>
            {children}
        </div>
    );
}
