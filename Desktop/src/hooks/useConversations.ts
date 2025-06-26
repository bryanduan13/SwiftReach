import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { conversationsApi } from '../../../client/api';
import {
  Conversation,
  ConversationCreate,
  ConversationUpdate,
  ConversationFilters,
  SimilaritySearchRequest
} from '../types/conversations';
import { toast } from '@/hooks/use-toast';

// Hook for fetching conversations
export const useConversations = (filters?: ConversationFilters) => {
  return useQuery({
    queryKey: ['conversations', filters],
    queryFn: async () => {
      const response = await conversationsApi.getConversations(filters);
      return response.data;
    },
  });
};

// Hook for fetching a single conversation
export const useConversation = (id: string) => {
  return useQuery({
    queryKey: ['conversation', id],
    queryFn: async () => {
      const response = await conversationsApi.getConversation(id);
      return response.data;
    },
    enabled: !!id,
  });
};

// Hook for creating conversations
export const useCreateConversation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: ConversationCreate) => {
      const response = await conversationsApi.createConversation(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      toast({
        title: 'Success',
        description: 'Conversation created successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to create conversation',
        variant: 'destructive',
      });
    },
  });
};

// Hook for updating conversations
export const useUpdateConversation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ConversationUpdate }) => {
      const response = await conversationsApi.updateConversation(id, data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['conversation', data.id] });
      toast({
        title: 'Success',
        description: 'Conversation updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to update conversation',
        variant: 'destructive',
      });
    },
  });
};

// Hook for deleting conversations
export const useDeleteConversation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await conversationsApi.deleteConversation(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      toast({
        title: 'Success',
        description: 'Conversation deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to delete conversation',
        variant: 'destructive',
      });
    },
  });
};

// Hook for semantic search
export const useSemanticSearch = () => {
  return useMutation({
    mutationFn: async (data: SimilaritySearchRequest) => {
      const response = await conversationsApi.semanticSearch(data);
      return response.data;
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Search failed',
        variant: 'destructive',
      });
    },
  });
};

// Hook for generating embeddings
export const useGenerateEmbedding = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await conversationsApi.generateEmbedding(id);
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Embedding generated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to generate embedding',
        variant: 'destructive',
      });
    },
  });
};