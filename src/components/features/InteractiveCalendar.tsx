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

// Sample events - some Thai national holidays and local events for 2026
const EVENTS: Event[] = [
  { date: '2026-01-01', title: 'New Year&apos;s Day', type: 'holiday' },
  { date: '2026-04-13', title: 'Songkran Festival', type: 'holiday' },
  { date: '2026-04-14', title: 'Songkran Festival', type: 'holiday' },
  { date: '2026-04-15', title: 'Songkran Festival', type: 'holiday' },
  { date: '2026-05-01', title: 'Labor Day', type: 'holiday' },
  { date: '2026-07-28', title: 'King&apos;s Birthday', type: 'holiday' },
  { date: '2026-08-12', title: 'Mother&apos;s Day', type: 'holiday' },
  { date: '2026-10-13', title: 'King Bhumibol Memorial Day', type: 'holiday' },
  { date: '2026-10-23', title: 'Chulalongkorn Day', type: 'holiday' },
  { date: '2026-12-05', title: 'Father&apos;s Day', type: 'holiday' },
  { date: '2026-12-10', title: 'Constitution Day', type: 'holiday' },
  { date: '2026-12-31', title: 'New Year&apos;s Eve', type: 'holiday' },
  
  // Fake local events for demonstration
  { date: '2026-07-15', title: 'Samui Regatta', type: 'event' },
  { date: '2026-07-30', title: 'Full Moon Party (Phangan)', type: 'event' },
  { date: '2026-08-28', title: 'Full Moon Party (Phangan)', type: 'event' },
];

export function InteractiveCalendar() {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

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
    gridDays.push(<div key={`empty-${i}`} className="h-24 sm:h-32 border border-outline-muted/50 bg-surface-hover/30 rounded-md"></div>);
  }

  // Days of the month
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dayEvents = EVENTS.filter(e => e.date === dateStr);
    const isToday = today.getDate() === d && today.getMonth() === month && today.getFullYear() === year;
    
    gridDays.push(
      <div key={`day-${d}`} className={`h-24 sm:h-32 p-2 border border-outline-muted rounded-md transition-colors hover:bg-surface-hover/50 flex flex-col ${isToday ? 'ring-2 ring-primary bg-primary/5' : 'bg-surface'}`}>
        <span className={`text-sm font-semibold mb-1 ${isToday ? 'text-primary' : 'text-text-main'}`}>{d}</span>
        <div className="flex-1 overflow-y-auto space-y-1">
          {dayEvents.map((evt, idx) => (
            <div 
              key={idx} 
              className={`text-xs px-1.5 py-0.5 rounded-sm truncate ${
                evt.type === 'holiday' 
                  ? 'bg-red-100 text-red-800 border border-red-200' 
                  : 'bg-blue-100 text-blue-800 border border-blue-200'
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
    <div className="bg-surface rounded-xl shadow-sm border border-outline-muted overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 sm:p-6 border-b border-outline-muted bg-surface-hover/30">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-primary" />
          <h2 className="text-xl sm:text-2xl font-bold text-text-main">
            {MONTHS[month]} {year}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handlePrevMonth}
            className="p-2 rounded-md hover:bg-surface-hover transition-colors text-text-muted hover:text-text-main border border-outline-muted"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={handleNextMonth}
            className="p-2 rounded-md hover:bg-surface-hover transition-colors text-text-muted hover:text-text-main border border-outline-muted"
            aria-label="Next month"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="px-4 sm:px-6 py-3 border-b border-outline-muted flex flex-wrap items-center gap-4 text-sm">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <span className="text-text-muted">National Holidays</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-blue-400"></div>
          <span className="text-text-muted">Local Events</span>
        </div>
        <div className="flex items-center gap-1.5 ml-auto">
          <Info className="w-4 h-4 text-text-muted" />
          <span className="text-text-muted text-xs">Dates are estimates</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-7 gap-2 sm:gap-4 mb-2">
          {DAYS.map(day => (
            <div key={day} className="text-center text-xs font-semibold text-text-muted uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2 sm:gap-4">
          {gridDays}
        </div>
      </div>
    </div>
  );
}
