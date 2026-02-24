import { useState } from 'react';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

interface AvailabilitySlot {
    day_of_week: number;
    start_time: string;
    end_time: string;
    is_available: boolean;
}

interface AvailabilityCalendarProps {
    initialData?: AvailabilitySlot[];
    onSave: (availability: AvailabilitySlot[]) => void;
    isLoading?: boolean;
}

export function AvailabilityCalendar({ initialData, onSave, isLoading }: AvailabilityCalendarProps) {
    const [slots, setSlots] = useState<AvailabilitySlot[]>(
        initialData || DAYS.map((_, i) => ({ day_of_week: i, start_time: '09:00', end_time: '18:00', is_available: i !== 0 }))
    );

    const toggleDay = (dayIndex: number) => {
        setSlots(prev => prev.map(s => s.day_of_week === dayIndex ? { ...s, is_available: !s.is_available } : s));
    };

    const updateTime = (dayIndex: number, field: 'start_time' | 'end_time', value: string) => {
        setSlots(prev => prev.map(s => s.day_of_week === dayIndex ? { ...s, [field]: value } : s));
    };

    return (
        <div className="space-y-4">
            <div className="space-y-3">
                {DAYS.map((day, i) => {
                    const slot = slots.find(s => s.day_of_week === i);
                    return (
                        <div key={day} className={`flex items-center gap-4 p-4 rounded-xl border ${slot?.is_available ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-100 opacity-60'}`}>
                            <button type="button" onClick={() => toggleDay(i)}
                                className={`size-6 rounded-md flex items-center justify-center shrink-0 transition-colors ${slot?.is_available ? 'bg-primary text-white' : 'bg-slate-200 text-slate-400'}`}>
                                {slot?.is_available && <span className="material-symbols-outlined text-[14px]">check</span>}
                            </button>
                            <span className="w-24 text-sm font-semibold text-slate-700">{day}</span>
                            {slot?.is_available && (
                                <div className="flex items-center gap-2">
                                    <input type="time" value={slot.start_time} onChange={(e) => updateTime(i, 'start_time', e.target.value)}
                                        className="px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white/80 focus:border-primary outline-none" />
                                    <span className="text-slate-400 text-sm">to</span>
                                    <input type="time" value={slot.end_time} onChange={(e) => updateTime(i, 'end_time', e.target.value)}
                                        className="px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white/80 focus:border-primary outline-none" />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            <button onClick={() => onSave(slots)} disabled={isLoading}
                className="bg-primary hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-orange-200 disabled:opacity-50">
                {isLoading ? 'Saving...' : 'Save Availability'}
            </button>
        </div>
    );
}
