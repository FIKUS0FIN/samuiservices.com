'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Info } from 'lucide-react';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface Event {
  date: string; // YYYY-MM-DD
  title: string;
  type: 'holiday' | 'event';
}

// Comprehensive 2026 events & national holidays for Koh Samui & nearby islands
const EVENTS: Event[] = [
  // National Holidays 2026
  { date: '2026-01-01', title: "New Year's Day", type: 'holiday' },
  { date: '2026-03-03', title: 'Makha Bucha Day', type: 'holiday' },
  { date: '2026-04-06', title: 'Chakri Memorial Day', type: 'holiday' },
  { date: '2026-04-13', title: 'Songkran Water Festival', type: 'holiday' },
  { date: '2026-04-14', title: 'Songkran Water Festival', type: 'holiday' },
  { date: '2026-04-15', title: 'Songkran Water Festival', type: 'holiday' },
  { date: '2026-05-01', title: 'National Labor Day', type: 'holiday' },
  { date: '2026-05-04', title: 'Coronation Day', type: 'holiday' },
  { date: '2026-05-31', title: 'Visakha Bucha Day', type: 'holiday' },
  { date: '2026-06-03', title: "HM Queen's Birthday", type: 'holiday' },
  { date: '2026-07-28', title: "HM King's Birthday", type: 'holiday' },
  { date: '2026-07-29', title: 'Asanha Bucha Day', type: 'holiday' },
  { date: '2026-08-12', title: "Mother's Day (HM Queen Mother's Birthday)", type: 'holiday' },
  { date: '2026-10-13', title: "King Bhumibol Memorial Day", type: 'holiday' },
  { date: '2026-10-23', title: 'Chulalongkorn Day', type: 'holiday' },
  { date: '2026-12-05', title: "Father's Day (HM King Bhumibol's Birthday)", type: 'holiday' },
  { date: '2026-12-10', title: 'Constitution Day', type: 'holiday' },
  { date: '2026-12-31', title: "New Year's Eve", type: 'holiday' },
  
  // Local events & festivals 2026
  { date: '2026-02-12', title: 'Chinese New Year Celebrations', type: 'event' },
  { date: '2026-07-15', title: 'Samui Regatta (Opening)', type: 'event' },
  { date: '2026-07-18', title: 'Samui Regatta (Finals)', type: 'event' },
  { date: '2026-11-24', title: 'Loy Krathong Festival', type: 'event' },

  // Koh Phangan Full Moon Party Dates 2026
  { date: '2026-01-03', title: 'Full Moon Party (Phangan)', type: 'event' },
  { date: '2026-02-01', title: 'Full Moon Party (Phangan)', type: 'event' },
  { date: '2026-03-03', title: 'Full Moon Party (Phangan)', type: 'event' },
  { date: '2026-04-02', title: 'Full Moon Party (Phangan)', type: 'event' },
  { date: '2026-05-01', title: 'Full Moon Party (Phangan)', type: 'event' },
  { date: '2026-05-31', title: 'Full Moon Party (Phangan)', type: 'event' },
  { date: '2026-06-29', title: 'Full Moon Party (Phangan)', type: 'event' },
  { date: '2026-07-29', title: 'Full Moon Party (Phangan)', type: 'event' },
  { date: '2026-08-28', title: 'Full Moon Party (Phangan)', type: 'event' },
  { date: '2026-09-26', title: 'Full Moon Party (Phangan)', type: 'event' },
  { date: '2026-10-25', title: 'Full Moon Party (Phangan)', type: 'event' },
  { date: '2026-11-24', title: 'Full Moon Party (Phangan)', type: 'event' },
  { date: '2026-12-24', title: 'Full Moon Party (Phangan)', type: 'event' },
];

export function InteractiveCalendar() {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 1)); // Initialize in April 2026 (Songkran month)

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const gridDays = [];
  
  // Empty slots for days before the 1st
  for (let i = 0; i < firstDay; i++) {
    gridDays.push(<div key={`empty-${i}`} className="h-20 sm:h-28 border border-outline-variant/30 bg-surface-container-low/20 rounded-xl"></div>);
  }

  // Days of the month
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dayEvents = EVENTS.filter(e => e.date === dateStr);
    const isToday = today.getDate() === d && today.getMonth() === month && today.getFullYear() === year;
    
    gridDays.push(
      <div key={`day-${d}`} className={`h-20 sm:h-28 p-2 border border-outline-variant/40 rounded-xl transition-all hover:bg-surface-container-low/40 flex flex-col justify-between ${isToday ? 'ring-2 ring-primary bg-primary/5' : 'bg-surface-container-lowest'}`}>
        <span className={`text-xs sm:text-sm font-semibold ${isToday ? 'text-primary' : 'text-text-main'}`}>{d}</span>
        <div className="flex-1 overflow-y-auto mt-1 space-y-1 scrollbar-none">
          {dayEvents.map((evt, idx) => (
            <div 
              key={idx} 
              className={`text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-md truncate font-semibold border ${
                evt.type === 'holiday' 
                  ? 'bg-red-50 text-red-700 border-red-200/50' 
                  : 'bg-primary/5 text-primary border-primary-container/20'
              }`}
              title={evt.title}
            >
              {evt.title}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest rounded-3xl shadow-sm border border-outline-variant/50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 sm:p-6 border-b border-outline-variant/30 bg-surface-container-low/30">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-primary" />
          <h2 className="text-lg sm:text-xl font-bold text-text-main m-0 leading-none">
            {MONTHS[month]} {year}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handlePrevMonth}
            className="p-2 rounded-xl hover:bg-surface-container-low transition-colors text-text-muted hover:text-text-main border border-outline-variant/50"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={handleNextMonth}
            className="p-2 rounded-xl hover:bg-surface-container-low transition-colors text-text-muted hover:text-text-main border border-outline-variant/50"
            aria-label="Next month"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="px-4 sm:px-6 py-3 border-b border-outline-variant/30 flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <span className="text-text-muted font-medium">National Holidays</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-primary"></div>
          <span className="text-text-muted font-medium">Local & Nearby Events</span>
        </div>
        <div className="flex items-center gap-1.5 ml-auto">
          <Info className="w-4 h-4 text-text-muted shrink-0" />
          <span className="text-text-muted text-[10px]">All dates are local Koh Samui times</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4 sm:p-6 bg-surface-bright/50">
        <div className="grid grid-cols-7 gap-2 mb-2">
          {DAYS.map(day => (
            <div key={day} className="text-center text-[10px] font-bold text-text-muted uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {gridDays}
        </div>
      </div>
    </div>
  );
}
