import React, { useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';

export function SidebarCalendar() {
    const [currentDate, setCurrentDate] = useState(new Date());

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);

    // Get all days to display (including padding days from prev/next month to fill out the grid)
    // Actually, for a simple look, we might just start from Sunday of the first week
    const startDate = new Date(monthStart);
    startDate.setDate(startDate.getDate() - startDate.getDay()); // Go back to Sunday

    const endDate = new Date(monthEnd);
    if (endDate.getDay() !== 6) {
        endDate.setDate(endDate.getDate() + (6 - endDate.getDay())); // Go forward to Saturday
    }

    const dateFormat = "d";
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    // Comprehensive list of upcoming events (approximate real dates for 2026)
    const allEvents = [
        { date: new Date('2026-01-14T00:00:00'), title: 'Makar Sankranti', type: 'festival' },
        { date: new Date('2026-01-24T00:00:00'), title: 'Vasant Panchami', type: 'festival' },
        { date: new Date('2026-02-14T00:00:00'), title: 'Maha Shivaratri', type: 'festival' },
        { date: new Date('2026-02-23T00:00:00'), title: 'Satyanarayan Puja', type: 'puja' },
        { date: new Date('2026-03-04T00:00:00'), title: 'Holi Festival', type: 'festival' },
        { date: new Date('2026-03-19T00:00:00'), title: 'Chaitra Navratri', type: 'festival' },
        { date: new Date('2026-03-27T00:00:00'), title: 'Rama Navami', type: 'festival' },
        { date: new Date('2026-04-02T00:00:00'), title: 'Hanuman Jayanti', type: 'festival' },
        { date: new Date('2026-05-10T00:00:00'), title: 'Akshaya Tritiya', type: 'festival' },
        { date: new Date('2026-06-21T00:00:00'), title: 'Nirjala Ekadashi', type: 'festival' },
        { date: new Date('2026-07-20T00:00:00'), title: 'Guru Purnima', type: 'festival' },
        { date: new Date('2026-08-09T00:00:00'), title: 'Nag Panchami', type: 'festival' },
        { date: new Date('2026-08-28T00:00:00'), title: 'Raksha Bandhan', type: 'festival' },
        { date: new Date('2026-09-04T00:00:00'), title: 'Krishna Janmashtami', type: 'festival' },
        { date: new Date('2026-09-14T00:00:00'), title: 'Ganesh Chaturthi', type: 'festival' },
        { date: new Date('2026-10-10T00:00:00'), title: 'Sharad Navratri Starts', type: 'festival' },
        { date: new Date('2026-10-17T00:00:00'), title: 'Durga Puja', type: 'festival' },
        { date: new Date('2026-10-19T00:00:00'), title: 'Dussehra (Vijayadashami)', type: 'festival' },
        { date: new Date('2026-10-23T00:00:00'), title: 'Karwa Chauth', type: 'festival' },
        { date: new Date('2026-11-08T00:00:00'), title: 'Diwali', type: 'festival' },
        { date: new Date('2026-11-14T00:00:00'), title: 'Chhath Puja', type: 'festival' },
        { date: new Date('2026-12-25T00:00:00'), title: 'Vaikuntha Ekadashi', type: 'festival' },
    ];

    // Filter events for the currently viewed month
    const upcomingEvents = allEvents.filter(event => isSameMonth(event.date, currentDate)).sort((a, b) => a.date.getTime() - b.date.getTime());

    const hasEvent = (day: Date) => {
        return upcomingEvents.some(event => isSameDay(event.date, day));
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm mb-4">
                {/* Header */}
                <div className="flex justify-between items-center mb-6 px-2">
                    <button onClick={prevMonth} className="text-[#8492A6] hover:text-slate-800 transition-colors p-1">
                        <span className="material-symbols-outlined text-[20px] font-bold">chevron_left</span>
                    </button>
                    <h3 className="text-lg font-bold text-[#1E293B] font-display">{format(currentDate, 'MMMM yyyy')}</h3>
                    <button onClick={nextMonth} className="text-[#8492A6] hover:text-slate-800 transition-colors p-1">
                        <span className="material-symbols-outlined text-[20px] font-bold">chevron_right</span>
                    </button>
                </div>

                {/* Days of week */}
                <div className="grid grid-cols-7 mb-4">
                    {weekDays.map((day, i) => (
                        <div key={i} className="text-center text-[13px] font-bold text-[#94A3B8] uppercase tracking-wide">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-7 gap-y-4">
                    {days.map((day, i) => {
                        const isSelected = hasEvent(day);
                        const isCurrentMonth = isSameMonth(day, monthStart);
                        const isTodayDate = isToday(day);

                        return (
                            <div key={i} className="flex justify-center items-center">
                                <div className={`
                                    w-10 h-10 flex items-center justify-center rounded-full text-[15px] cursor-pointer transition-all box-border
                                    ${!isCurrentMonth ? 'text-[#CBD5E1] font-medium' : ''}
                                    ${isCurrentMonth && isSelected && !isTodayDate ? 'bg-[#F97316] text-white shadow-[0_4px_10px_rgba(249,115,22,0.3)] font-bold' : ''}
                                    ${isCurrentMonth && !isSelected && !isTodayDate ? 'text-[#334155] font-medium hover:bg-slate-50' : ''}
                                    ${isCurrentMonth && isTodayDate && !isSelected ? 'border-2 border-[#F97316] text-[#F97316] font-bold bg-orange-50' : ''}
                                    ${isCurrentMonth && isTodayDate && isSelected ? 'bg-[#F97316] text-white font-bold ring-2 ring-offset-2 ring-[#F97316]' : ''}
                                `}>
                                    {format(day, dateFormat)}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Upcoming Events Cards */}
            <h4 className="font-bold text-sm text-slate-800 mb-3 px-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500 block"></span>
                Upcoming in {format(currentDate, 'MMMM')}
            </h4>

            <div className="space-y-3">
                {upcomingEvents.map((event, i) => (
                    <div key={i} className="bg-white rounded-2xl p-3 border border-slate-100 shadow-sm hover:border-orange-200 transition-all flex gap-3 items-center group cursor-pointer">
                        <div className="bg-orange-50 w-11 h-11 rounded-xl flex flex-col items-center justify-center border border-orange-100 shrink-0 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                            <span className="text-[10px] font-bold uppercase text-orange-600 group-hover:text-white/90 leading-none mb-0.5">{format(event.date, 'MMM')}</span>
                            <span className="text-sm font-black text-orange-600 group-hover:text-white leading-none">{format(event.date, 'dd')}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h5 className="font-bold text-slate-800 text-sm truncate">{event.title}</h5>
                            <p className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold mt-0.5">{event.type}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
