
import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Event, eventTypeColors } from './types';

interface MonthViewProps {
  date: Date;
  events: Event[];
}

export const MonthView: React.FC<MonthViewProps> = ({ date, events }) => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Group days into weeks
  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];
  
  // Add days from previous month to start the calendar on Sunday
  const firstDayOfMonth = monthStart.getDay(); // 0 is Sunday, 1 is Monday, etc.
  if (firstDayOfMonth > 0) {
    for (let i = firstDayOfMonth; i > 0; i--) {
      const prevDate = new Date(monthStart);
      prevDate.setDate(prevDate.getDate() - i);
      currentWeek.push(prevDate);
    }
  }
  
  // Add all days of the month
  monthDays.forEach((day) => {
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push(day);
  });
  
  // Add days from next month to complete the last week
  while (currentWeek.length < 7) {
    const nextDate = new Date(monthEnd);
    nextDate.setDate(nextDate.getDate() + (currentWeek.length - 6));
    currentWeek.push(nextDate);
  }
  
  // Push the last week
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {format(date, 'MMMM yyyy')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-2 grid grid-cols-7 text-center font-medium">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-1 mb-1">
            {week.map((day) => {
              const dayEvents = events.filter(event => 
                isSameDay(event.date, day)
              );
              
              return (
                <div 
                  key={day.toString()} 
                  className={`min-h-[100px] p-1 border rounded ${
                    isSameMonth(day, date) ? 'bg-white' : 'bg-gray-50 text-gray-400'
                  }`}
                >
                  <div className="text-right text-xs p-1">
                    {format(day, 'd')}
                  </div>
                  <div className="space-y-1 overflow-y-auto max-h-[80px]">
                    {dayEvents.slice(0, 3).map((event) => (
                      <div 
                        key={event.id} 
                        className={`p-1 rounded text-xs ${eventTypeColors[event.type]}`}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-center text-muted-foreground">
                        +{dayEvents.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default MonthView;
