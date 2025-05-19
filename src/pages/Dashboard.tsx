
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MessageSquare, User, Users } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button asChild>
          <Link to="/leads/new">Add New Lead</Link>
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Leads</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Follow-ups Due</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">3 urgent</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Next: 3:00 PM</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Leads</CardTitle>
            <CardDescription>Your latest lead acquisitions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Emma Thompson', email: 'emma@example.com', source: 'Website', date: '2h ago' },
                { name: 'Michael Chen', email: 'michael@example.com', source: 'Referral', date: '5h ago' },
                { name: 'Sarah Johnson', email: 'sarah@example.com', source: 'Zillow', date: '1d ago' },
                { name: 'David Rodriguez', email: 'david@example.com', source: 'Open House', date: '2d ago' },
              ].map((lead, index) => (
                <div key={index} className="flex items-center gap-4 rounded-lg border p-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>{lead.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{lead.name}</p>
                    <p className="text-sm text-muted-foreground">{lead.email}</p>
                  </div>
                  <div className="text-sm text-right">
                    <p className="font-medium">{lead.source}</p>
                    <p className="text-muted-foreground">{lead.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Messages</CardTitle>
            <CardDescription>Latest communications from clients</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { 
                client: 'Emma Thompson', 
                preview: 'Hi there, I\'m interested in the property at 123 Main St. Is it still available?', 
                time: '10:43 AM',
                unread: true
              },
              { 
                client: 'Michael Chen', 
                preview: 'Thanks for showing me the house yesterday. I have a few more questions about the financing options.', 
                time: 'Yesterday',
                unread: false
              },
              { 
                client: 'Sarah Johnson', 
                preview: 'I\'d like to make an offer on the Oak Street property. Can we discuss the details?', 
                time: 'Yesterday',
                unread: true
              },
              { 
                client: 'David Rodriguez', 
                preview: 'When can we schedule the next viewing? I\'m available this weekend.', 
                time: 'Monday',
                unread: false
              },
            ].map((message, index) => (
              <div key={index} className="rounded-lg border p-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>{message.client.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <p className="text-sm font-medium">{message.client}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{message.time}</span>
                    {message.unread && <div className="h-2 w-2 bg-primary rounded-full"></div>}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{message.preview}</p>
              </div>
            ))}
            <div className="pt-2">
              <Button variant="outline" size="sm" asChild className="w-full">
                <Link to="/inbox">View All Messages</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

