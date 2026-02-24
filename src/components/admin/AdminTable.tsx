import React from 'react';
import { cn } from '@/lib/utils';

interface Column {
    key: string;
    label: string;
    render?: (value: any, row: any) => React.ReactNode;
}

interface AdminTableProps {
    columns: Column[];
    data: any[];
    onRowClick?: (row: any) => void;
}

export function AdminTable({ columns, data, onRowClick }: AdminTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-slate-100">
                        {columns.map((col) => (
                            <th key={col.key} className="pb-3 font-semibold px-4">{col.label}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="text-sm text-slate-600">
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="py-12 text-center text-slate-400">
                                <span className="material-symbols-outlined text-3xl mb-2 block">inbox</span>
                                No data found
                            </td>
                        </tr>
                    ) : (
                        data.map((row, i) => (
                            <tr key={row.id || i}
                                onClick={() => onRowClick?.(row)}
                                className={cn(
                                    "hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0",
                                    onRowClick && "cursor-pointer"
                                )}>
                                {columns.map((col) => (
                                    <td key={col.key} className="py-4 px-4">
                                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
