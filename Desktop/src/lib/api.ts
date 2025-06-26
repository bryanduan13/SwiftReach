import axios, { AxiosResponse } from 'axios';
import {
  Conversation,
  ConversationCreate,
  ConversationUpdate,
  ConversationFilters,
  SimilaritySearchRequest,
  SimilaritySearchResult,
  MessageType,
  MessageDirection,
  MessageStatus
} from '../types/conversations';

// Create an Axios instance with default config
const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add authentication token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is due to an expired token, try to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/auth/refresh`, { 
            refresh_token: refreshToken 
          });
          
          if (response.data?.access_token) {
            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('refreshToken', response.data.refresh_token);
            
            api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
            originalRequest.headers['Authorization'] = `Bearer ${response.data.access_token}`;
            
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
        
        // Clear stored tokens if refresh fails
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        
        // Redirect to login page
        window.location.href = '/auth';
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: (email: string, password: string) => {
    return api.post('/auth/login', { email, password });
  },
  
  signup: (email: string, password: string, fullName?: string) => {
    return api.post('/auth/signup', { 
      email, 
      password, 
      full_name: fullName 
    });
  },
  
  logout: () => {
    return api.post('/auth/logout');
  },
  
  getProfile: () => {
    return api.get('/auth/me');
  },
};

// Clients API
export const clientsApi = {
  getClients: (params?: { 
    status?: string,
    limit?: number, 
    offset?: number 
  }) => {
    return api.get('/clients', { params });
  },
  
  getClient: (id: string) => {
    return api.get(`/clients/${id}`);
  },
  
  createClient: (client: {
    first_name: string,
    last_name: string,
    email?: string,
    phone?: string,
    notes?: string,
    status?: string
  }) => {
    return api.post('/clients', client);
  },
  
  updateClient: (id: string, client: {
    first_name?: string,
    last_name?: string,
    email?: string,
    phone?: string,
    notes?: string,
    status?: string
  }) => {
    return api.put(`/clients/${id}`, client);
  },
  
  deleteClient: (id: string) => {
    return api.delete(`/clients/${id}`);
  }
};

// Calendar API
export const calendarApi = {
  getEvents: (params?: {
    start_date?: string,
    end_date?: string,
    event_type?: 'showing' | 'meeting' | 'open-house' | 'call'
  }) => {
    return api.get('/calendar', { params });
  },
  
  createEvent: (event: {
    title: string,
    client: string,
    location: string,
    date: string, // ISO date string
    startTime: string,
    endTime: string,
    type: 'showing' | 'meeting' | 'open-house' | 'call'
  }) => {
    return api.post('/calendar', event);
  },
};

// Conversations API with proper typing
export const conversationsApi = {
  // Get all conversations
  getConversations: (params?: ConversationFilters): Promise<AxiosResponse<Conversation[]>> => {
    const searchParams = new URLSearchParams();
    if (params?.skip) searchParams.append('skip', params.skip.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.client_id) searchParams.append('client_id', params.client_id);
    if (params?.message_type) searchParams.append('message_type', params.message_type);
    if (params?.status) searchParams.append('status', params.status);
    
    return api.get<Conversation[]>(`/conversations/?${searchParams.toString()}`);
  },

  // Get specific conversation
  getConversation: (id: string): Promise<AxiosResponse<Conversation>> => 
    api.get<Conversation>(`/conversations/${id}`),

  // Create conversation
  createConversation: (data: ConversationCreate): Promise<AxiosResponse<Conversation>> => 
    api.post<Conversation>('/conversations/', data),

  // Update conversation
  updateConversation: (id: string, data: ConversationUpdate): Promise<AxiosResponse<Conversation>> => 
    api.put<Conversation>(`/conversations/${id}`, data),

  // Delete conversation
  deleteConversation: (id: string): Promise<AxiosResponse<{ message: string }>> => 
    api.delete(`/conversations/${id}`),

  // Generate embedding
  generateEmbedding: (id: string): Promise<AxiosResponse<{ message: string }>> => 
    api.post(`/conversations/${id}/generate-embedding`),

  // Semantic search
  semanticSearch: (data: SimilaritySearchRequest): Promise<AxiosResponse<SimilaritySearchResult[]>> => 
    api.post<SimilaritySearchResult[]>('/conversations/search', data),

  // Batch generate embeddings
  batchGenerateEmbeddings: (): Promise<AxiosResponse<{ message: string }>> => 
    api.post('/conversations/batch-generate-embeddings')
};

export default api;
