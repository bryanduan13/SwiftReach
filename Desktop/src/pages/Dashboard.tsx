
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MessageSquare, User, Users, Loader2, Plus, UserPlus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useDashboardStats, useRecentClients } from '@/hooks/useApi';
import { format } from 'date-fns';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { data: stats, isLoading: statsLoading, error: statsError } = useDashboardStats();
  const { data: recentClients, isLoading: clientsLoading, error: clientsError } = useRecentClients();

  const handleMessageClick = (messageIndex: number, clientName: string) => {
    navigate('/inbox', { 
      state: { 
        selectedConversationId: messageIndex + 1,
        clientName: clientName 
      } 
    });
  };

  const handleLeadClick = (clientId: string, clientName: string) => {
    navigate('/leads', { 
      state: { 
        selectedLeadId: clientId,
        leadName: clientName 
      } 
    });
  };

  if (statsError || clientsError) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        </div>
        <div className="text-center py-12">
          <div className="mx-auto max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to load dashboard</h3>
            <p className="text-gray-600 mb-4">There was an error connecting to the database. Please check your connection and try again.</p>
            <Button onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Check if this is a completely empty state (no data at all)
  const isEmpty = !statsLoading && !clientsLoading && 
    (!stats || (stats.activeLeads === 0 && stats.followUpsToday === 0 && stats.unreadMessages === 0 && stats.todayAppointments === 0)) &&
    (!recentClients || recentClients.length === 0);

  if (isEmpty) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <Button asChild>
            <Link to="/leads">
              <Plus className="mr-2 h-4 w-4" />
              Add New Lead
            </Link>
          </Button>
        </div>
        
        {/* Empty state for new users */}
        <div className="text-center py-12">
          <div className="mx-auto max-w-md">
            <UserPlus className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Welcome to your CRM!</h3>
            <p className="text-gray-600 mb-6">Get started by adding your first lead or client to begin tracking your sales pipeline.</p>
            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link to="/leads">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Lead
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link to="/clients/new">
                  Add a Client
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button asChild>
          <Link to="/leads">
            <Plus className="mr-2 h-4 w-4" />
            Add New Lead
          </Link>
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/leads')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Leads</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.activeLeads || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.activeLeads === 0 ? 'Add your first lead' : 'Active prospects'}
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/leads?filter=follow-up')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Follow-ups Due</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.followUpsToday || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.followUpsToday === 0 ? 'No follow-ups today' : 'Today'}
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/inbox')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.unreadMessages || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.unreadMessages === 0 ? 'All caught up!' : 'Pending responses'}
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/calendar')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.todayAppointments || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.nextAppointment ? `Next: ${stats.nextAppointment}` : 'No appointments today'}
                </p>
              </>
            )}
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
            {clientsLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <div className="space-y-4">
                {recentClients?.map((client: any) => (
                  <div 
                    key={client.id} 
                    className="flex items-center gap-4 rounded-lg border p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleLeadClick(client.id, `${client.first_name} ${client.last_name}`)}
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarFallback>
                        {client.first_name?.[0]}{client.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {client.first_name} {client.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">{client.email}</p>
                    </div>
                    <div className="text-sm text-right">
                      <p className="font-medium capitalize">{client.status}</p>
                      <p className="text-muted-foreground">
                        {format(new Date(client.created_at), 'MMM d')}
                      </p>
                    </div>
                  </div>
                ))}
                {(!recentClients || recentClients.length === 0) && (
                  <div className="text-center py-8">
                    <User className="mx-auto h-8 w-8 text-gray-400 mb-3" />
                    <p className="text-sm font-medium text-gray-900 mb-1">No leads yet</p>
                    <p className="text-sm text-muted-foreground mb-4">Start building your pipeline by adding your first lead</p>
                    <Button size="sm" asChild>
                      <Link to="/leads">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Lead
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Messages</CardTitle>
            <CardDescription>Latest communications from clients</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-8">
              <MessageSquare className="mx-auto h-8 w-8 text-gray-400 mb-3" />
              <p className="text-sm font-medium text-gray-900 mb-1">Messages integration coming soon</p>
              <p className="text-sm text-muted-foreground mb-4">Connect your messaging platform to see real conversations</p>
              <Button variant="outline" size="sm" asChild>
                <Link to="/inbox">Setup Messaging</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

