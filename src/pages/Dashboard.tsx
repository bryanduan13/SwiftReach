
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MessageSquare, User, Users } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';

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
            <CardTitle>Lead Conversion</CardTitle>
            <CardDescription>Pipeline progress this month</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {[
              { stage: 'Initial Contact', count: 18, total: 24, color: 'bg-blue-500' },
              { stage: 'Property Showing', count: 12, total: 24, color: 'bg-indigo-500' },
              { stage: 'Negotiation', count: 8, total: 24, color: 'bg-purple-500' },
              { stage: 'Contract', count: 5, total: 24, color: 'bg-pink-500' },
              { stage: 'Closed', count: 3, total: 24, color: 'bg-green-500' },
            ].map((stage) => (
              <div key={stage.stage} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>{stage.stage}</span>
                  <span className="font-medium">{stage.count}/{stage.total}</span>
                </div>
                <Progress
                  value={(stage.count / stage.total) * 100}
                  className={stage.color}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
