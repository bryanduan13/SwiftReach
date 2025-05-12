
import React, { useState } from 'react';
import { format, addDays, subDays } from 'date-fns';
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
  }
];

const eventTypeColors = {
  showing: 'bg-blue-100 border-blue-300 text-blue-800',
  meeting: 'bg-purple-100 border-purple-300 text-purple-800',
  'open-house': 'bg-green-100 border-green-300 text-green-800',
  call: 'bg-yellow-100 border-yellow-300 text-yellow-800',
};

export const CalendarView = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<string>("day");
  
  const formattedDate = format(date, 'MMM d, yyyy');
  const dayEvents = mockEvents.filter(
    event => format(event.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
  );

  const handlePrevDay = () => setDate(subDays(date, 1));
  const handleNextDay = () => setDate(addDays(date, 1));

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
            <Button variant="outline" size="icon" onClick={handlePrevDay}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="font-medium">{formattedDate}</div>
            <Button variant="outline" size="icon" onClick={handleNextDay}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className={`${view === 'month' ? 'md:col-span-3' : 'md:col-span-2'}`}>
            <TabsContent value="day" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Day View</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {dayEvents.length > 0 ? (
                      dayEvents.map((event) => (
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
            </TabsContent>
            <TabsContent value="week" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Week View</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    Week calendar view will be implemented in the next version
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="month" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Month View</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    Month calendar view will be implemented in the next version
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>

          {view !== 'month' && (
            <div className="md:col-span-1">
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
                    <h3 className="font-medium mb-2">Upcoming Events</h3>
                    <div className="space-y-2">
                      {mockEvents.slice(0, 3).map((event, i) => (
                        <div key={i} className="text-sm flex justify-between border-b pb-1">
                          <span>{event.title}</span>
                          <span className="text-muted-foreground">{format(event.date, 'MMM d')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </Tabs>
    </div>
  );
};

export default CalendarView;
