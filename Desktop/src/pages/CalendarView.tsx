import React, { useState, useEffect } from 'react';
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
import { calendarApi } from '../../../client/api';

// Define the Event type to match the interface expected by the view components
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

// No more hardcoded events - will fetch from API

export const CalendarView = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<string>("day");
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState({
    showing: true,
    meeting: true,
    'open-house': true,
    call: true
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const formattedDate = format(date, 'MMM d, yyyy');
  
  // Fetch events from API
  const fetchEvents = async () => {
    try {
      setLoading(true);
      console.log('Fetching events...');
      const response = await calendarApi.getEvents();
      console.log('Raw API response:', response.data);
      // Transform API response to match frontend Event interface
      const transformedEvents = response.data.map((apiEvent: any) => ({
        id: apiEvent.id,
        title: apiEvent.title,
        client: apiEvent.description || 'No client specified',
        location: 'Location not specified',
        date: new Date(apiEvent.start_datetime),
        startTime: new Date(apiEvent.start_datetime).toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit', 
          hour12: true 
        }),
        endTime: apiEvent.end_datetime ? new Date(apiEvent.end_datetime).toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit', 
          hour12: true 
        }) : 'No end time',
        type: 'meeting' as const // Default type, could be enhanced with API support
      }));
      console.log('Transformed events:', transformedEvents);
      setEvents(transformedEvents);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // Load events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  // Filter events based on selected filters and current date view
  const filteredEvents = events.filter(
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

  const handleCreateEvent = async (formData: FormData) => {
    try {
      const title = formData.get('title') as string;
      const description = formData.get('notes') as string;
      const startDate = formData.get('date') as string;
      const startTime = formData.get('startTime') as string;
      const endTime = formData.get('endTime') as string;
      
      console.log('Form data:', { title, description, startDate, startTime, endTime });
      
      if (!title || !startDate || !startTime || !endTime) {
        console.error('Missing required fields');
        alert('Please fill in all required fields');
        return;
      }
      
      // Combine date and time for start_datetime
      const startDateTime = new Date(`${startDate}T${startTime}`);
      const endDateTime = new Date(`${startDate}T${endTime}`);
      
      console.log('Creating event with:', {
        title,
        description,
        start_datetime: startDateTime.toISOString(),
        end_datetime: endDateTime.toISOString(),
        all_day: false
      });
      
      const response = await calendarApi.createEvent({
        title,
        description,
        start_datetime: startDateTime.toISOString(),
        end_datetime: endDateTime.toISOString(),
        all_day: false
      });
      
      console.log('Event created successfully:', response.data);
      
      // Refresh events after creation
      await fetchEvents();
      
      // Close the dialog
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Failed to create event:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        alert(`Failed to create event: ${error.response.data.detail || error.response.data.message || 'Unknown error'}`);
      } else {
        alert('Failed to create event. Please check your connection.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
            <form>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Event Title</Label>
                  <Input id="title" name="title" placeholder="Property Showing" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" name="date" type="date" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="type">Event Type</Label>
                    <Select name="type" defaultValue="showing">
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
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input id="startTime" name="startTime" type="time" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input id="endTime" name="endTime" type="time" required />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="client">Client</Label>
                  <Input id="client" name="client" placeholder="Client name" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" name="location" placeholder="Address or virtual" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea id="notes" name="notes" placeholder="Additional details..." />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={(e) => {
                  e.preventDefault();
                  const form = e.currentTarget.closest('form');
                  if (form) {
                    const formData = new FormData(form);
                    handleCreateEvent(formData);
                  }
                }}>Save Event</Button>
              </DialogFooter>
            </form>
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
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500">Loading events...</div>
            </div>
          ) : (
            <>
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
            </>
          )}
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
