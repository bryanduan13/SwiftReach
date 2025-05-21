
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

// Create an Axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add authentication token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('auth-token');
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
        const refreshToken = await AsyncStorage.getItem('refresh-token');
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/auth/refresh`, { 
            refresh_token: refreshToken 
          });
          
          if (response.data?.access_token) {
            await AsyncStorage.setItem('auth-token', response.data.access_token);
            await AsyncStorage.setItem('refresh-token', response.data.refresh_token);
            
            api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
            originalRequest.headers['Authorization'] = `Bearer ${response.data.access_token}`;
            
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
        
        // Clear stored tokens if refresh fails
        await AsyncStorage.removeItem('auth-token');
        await AsyncStorage.removeItem('refresh-token');
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

export default api;
