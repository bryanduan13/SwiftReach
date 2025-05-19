
import React, { useState } from 'react';
import { format, addDays, subDays, addMonths, subMonths, addWeeks, subWeeks } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import DayView from '@/components/calendar/DayView';
import WeekView from '@/components/calendar/WeekView';
import MonthView from '@/components/calendar/MonthView';
import CalendarFilter from '@/components/calendar/CalendarFilter';
import GoogleCalendarIntegration from '@/components/calendar/GoogleCalendarIntegration';

const mockEvents = [
  {
    id: 1,
    title: 'Property Showing',
    client: 'Emma Thompson',
    location: '123 Main St.',
    date: new Date(),
    startTime: '10:00 AM',
    endTime: '11:00 AM',
    type: 'showing'
  },
  {
    id: 2,
    title: 'Client Meeting',
    client: 'Michael Chen',
    location: 'Office',
    date: new Date(),
    startTime: '1:00 PM',
    endTime: '2:00 PM',
    type: 'meeting'
  },
  {
    id: 3,
    title: 'Open House',
    client: 'Multiple Clients',
    location: '456 Oak Ave.',
    date: addDays(new Date(), 1),
    startTime: '2:00 PM',
    endTime: '4:00 PM',
    type: 'open-house'
  },
  {
    id: 4,
    title: 'Follow-up Call',
    client: 'Sarah Johnson',
    location: 'Phone',
    date: addDays(new Date(), 1),
    startTime: '11:00 AM',
    endTime: '11:30 AM',
    type: 'call'
  },
  // Add more events for better testing
  {
    id: 5,
    title: 'Property Viewing',
    client: 'John Smith',
    location: '789 Pine St.',
    date: addDays(new Date(), 2),
    startTime: '3:00 PM',
    endTime: '4:00 PM',
    type: 'showing'
  },
  {
    id: 6,
    title: 'Team Meeting',
    client: 'Real Estate Team',
    location: 'Conference Room',
    date: addDays(new Date(), 3),
    startTime: '9:00 AM',
    endTime: '10:30 AM',
    type: 'meeting'
  },
  {
    id: 7,
    title: 'Client Call',
    client: 'David Wilson',
    location: 'Phone',
    date: addDays(new Date(), 4),
    startTime: '2:30 PM',
    endTime: '3:00 PM',
    type: 'call'
  },
  {
    id: 8,
    title: 'Weekend Open House',
    client: 'Multiple Clients',
    location: '101 Maple Dr.',
    date: addDays(new Date(), 5),
    startTime: '1:00 PM',
    endTime: '5:00 PM',
    type: 'open-house'
  }
];

export const CalendarView = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<string>("day");
  const [filters, setFilters] = useState({
    showing: true,
    meeting: true,
    'open-house': true,
    call: true
  });
  
  const formattedDate = format(date, 'MMM d, yyyy');
  
  // Filter events based on selected filters and current date view
  const filteredEvents = mockEvents.filter(
    event => filters[event.type as keyof typeof filters]
  );

  const handleDateChange = (change: number) => {
    if (view === 'day') {
      setDate(prevDate => change > 0 ? addDays(prevDate, change) : subDays(prevDate, Math.abs(change)));
    } else if (view === 'week') {
      setDate(prevDate => change > 0 ? addWeeks(prevDate, change) : subWeeks(prevDate, Math.abs(change)));
    } else if (view === 'month') {
      setDate(prevDate => change > 0 ? addMonths(prevDate, change) : subMonths(prevDate, Math.abs(change)));
    }
  };

  const handleFilterChange = (key: string, value: boolean) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-1">
              <Plus className="h-4 w-4" />
              New Event
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Event</DialogTitle>
              <DialogDescription>
                Create a new calendar event or appointment.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Event Title</Label>
                <Input id="title" placeholder="Property Showing" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">Event Type</Label>
                  <Select defaultValue="showing">
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="showing">Property Showing</SelectItem>
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="open-house">Open House</SelectItem>
                      <SelectItem value="call">Call</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="start">Start Time</Label>
                  <Input id="start" type="time" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="end">End Time</Label>
                  <Input id="end" type="time" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="client">Client</Label>
                <Input id="client" placeholder="Client name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="Address or virtual" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" placeholder="Additional details..." />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save Event</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="day" onValueChange={setView} className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="day">Day</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => handleDateChange(-1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="font-medium">{
              view === 'month' 
                ? format(date, 'MMMM yyyy')
                : view === 'week'
                  ? `Week of ${format(date, 'MMM d')}`
                  : formattedDate
            }</div>
            <Button variant="outline" size="icon" onClick={() => handleDateChange(1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className={`${view === 'month' ? 'md:col-span-3' : 'md:col-span-2'}`}>
            <TabsContent value="day" className="mt-0">
              <DayView 
                date={date} 
                events={filteredEvents.filter(event => 
                  format(event.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
                )} 
              />
            </TabsContent>
            <TabsContent value="week" className="mt-0">
              <WeekView date={date} events={filteredEvents} />
            </TabsContent>
            <TabsContent value="month" className="mt-0">
              <MonthView date={date} events={filteredEvents} />
            </TabsContent>
          </div>

          {view !== 'month' && (
            <div className="md:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Calendar</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                    className="rounded-md border pointer-events-auto"
                  />
                  <div className="mt-4">
                    <CalendarFilter 
                      filters={filters} 
                      onFilterChange={handleFilterChange}
                    />
                  </div>
                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Upcoming Events</h3>
                    <div className="space-y-2">
                      {filteredEvents.slice(0, 3).map((event, i) => (
                        <div key={i} className="text-sm flex justify-between border-b pb-1">
                          <span>{event.title}</span>
                          <span className="text-muted-foreground">{format(event.date, 'MMM d')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <GoogleCalendarIntegration />
            </div>
          )}
        </div>
      </Tabs>
    </div>
  );
};

export default CalendarView;
