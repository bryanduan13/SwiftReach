
import React from 'react';
import { format } from 'date-fns';
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

interface DayViewProps {
  date: Date;
  events: Event[];
}

export const eventTypeColors = {
  showing: 'bg-blue-100 border-blue-300 text-blue-800',
  meeting: 'bg-purple-100 border-purple-300 text-purple-800',
  'open-house': 'bg-green-100 border-green-300 text-green-800',
  call: 'bg-yellow-100 border-yellow-300 text-yellow-800',
};

export const DayView: React.FC<DayViewProps> = ({ date, events }) => {
  const formattedDate = format(date, 'MMM d, yyyy');
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Day View</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {events.length > 0 ? (
            events.map((event) => (
              <div 
                key={event.id} 
                className={`p-3 rounded-lg border ${eventTypeColors[event.type as keyof typeof eventTypeColors]}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{event.title}</h3>
                    <p className="text-sm">{event.client}</p>
                  </div>
                  <div className="text-sm font-medium">
                    {event.startTime} - {event.endTime}
                  </div>
                </div>
                <p className="text-sm mt-1">{event.location}</p>
              </div>
            ))
          ) : (
            <div className="py-4 text-center text-muted-foreground">
              No events scheduled for today
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DayView;
