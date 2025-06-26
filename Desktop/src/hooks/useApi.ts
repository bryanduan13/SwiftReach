import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientsApi, calendarApi } from '@/lib/api';

// Hook for fetching dashboard stats
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const [clientsResponse, eventsResponse] = await Promise.all([
        clientsApi.getClients({ limit: 100 }),
        calendarApi.getEvents({
          start_date: new Date().toISOString().split('T')[0],
          end_date: new Date().toISOString().split('T')[0]
        })
      ]);
      
      const clients = clientsResponse.data;
      const todayEvents = eventsResponse.data;
      
      // Calculate stats from real data
      const activeLeads = clients.filter(client => client.status === 'active').length;
      const followUpsToday = clients.filter(client => {
        // Add logic to check if follow-up is due today
        return client.status === 'follow-up';
      }).length;
      
      return {
        activeLeads,
        followUpsToday,
        unreadMessages: 0, // Will be implemented when messages API is ready
        todayAppointments: todayEvents.length,
        nextAppointment: todayEvents[0]?.startTime || null
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for fetching recent clients
export const useRecentClients = () => {
  return useQuery({
    queryKey: ['recent-clients'],
    queryFn: async () => {
      const response = await clientsApi.getClients({ limit: 4 });
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook for creating a new client
export const useCreateClient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: clientsApi.createClient,
    onSuccess: () => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['recent-clients'] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
};

// Hook for updating a client
export const useUpdateClient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      clientsApi.updateClient(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['recent-clients'] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
};

// Hook for deleting a client
export const useDeleteClient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => clientsApi.deleteClient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['recent-clients'] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
};