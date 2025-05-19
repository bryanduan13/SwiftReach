
import React from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Event {
  id: number;
  title: string;
  client: string;
  location: string;
  date: Date;
  startTime: string;
  endTime: string;
  type: 'showing' | 'meeting' | 'open-house' | 'call';
}

interface WeekViewProps {
  date: Date;
  events: Event[];
}

const eventTypeColors = {
  showing: 'bg-blue-100 border-blue-300 text-blue-800',
  meeting: 'bg-purple-100 border-purple-300 text-purple-800',
  'open-house': 'bg-green-100 border-green-300 text-green-800',
  call: 'bg-yellow-100 border-yellow-300 text-yellow-800',
};

export const WeekView: React.FC<WeekViewProps> = ({ date, events }) => {
  const weekStart = startOfWeek(date);
  const weekEnd = endOfWeek(date);
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Week of {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day) => {
            const dayEvents = events.filter(event => 
              isSameDay(event.date, day)
            );
            
            return (
              <div key={day.toString()} className="min-h-[200px]">
                <div className="font-medium text-center p-2 bg-muted mb-1 rounded">
                  {format(day, 'EEE')}<br/>
                  {format(day, 'd')}
                </div>
                <div className="space-y-1">
                  {dayEvents.length > 0 ? (
                    dayEvents.map((event) => (
                      <div 
                        key={event.id} 
                        className={`p-2 rounded-md border text-xs ${eventTypeColors[event.type]}`}
                      >
                        <div className="font-medium">{event.title}</div>
                        <div>{event.startTime}</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-center text-muted-foreground p-2">
                      No events
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeekView;
