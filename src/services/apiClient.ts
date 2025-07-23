

import axios from 'axios';

interface ApiResponse<T = any> {
  data?: T;
  success?: boolean;
  message?: string;
  error?: string;
}

class ApiClient {
  private client: any;
  public baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_APP_API_URL || 'https://backend.assitext.ca';
    
    console.log(`🔗 API Client initialized with baseURL: ${this.baseURL}`);
    
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config: any) => {
        const token = localStorage.getItem('auth_token');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        if (import.meta.env.NODE_ENV !== 'production') {
          console.log(`🔍 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        }
        return config;
      },
      (error: any) => {
        if (import.meta.env.NODE_ENV !== 'production') {
          console.error('🔥 API Request Error:', error);
        }
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response: any) => {
        if (import.meta.env.NODE_ENV !== 'production') {
          console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        }
        
        return response.data;
      },
      (error: any) => {
        if (import.meta.env.NODE_ENV !== 'production') {
          console.error('🔥 API Response Error:', error);
        }
        
        if (error.response) {
          const status = error.response.status;
          const data = error.response.data;
          
          if (status === 401) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('refresh_token');
            if (window.location.pathname !== '/login') {
              window.location.href = '/login';
            }
          }
          
          const errorMessage = data?.error || data?.message || `HTTP ${status} Error`;
          return Promise.reject(new Error(errorMessage));
          
        } else if (error.request) {
          return Promise.reject(new Error('Network error - Unable to reach server. Please check your connection.'));
          
        } else {
          return Promise.reject(new Error(`Request failed: ${error.message}`));
        }
      }
    );
  }

  setToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  removeToken(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
  }

  async get<T = any>(url: string): Promise<T> {
    return this.client.get(url);
  }

  async post<T = any>(url: string, data?: any): Promise<T> {
    return this.client.post(url, data);
  }

  async put<T = any>(url: string, data?: any): Promise<T> {
    return this.client.put(url, data);
  }

  async delete<T = any>(url: string): Promise<T> {
    return this.client.delete(url);
  }

  async patch<T = any>(url: string, data?: any): Promise<T> {
    return this.client.patch(url, data);
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.client.get('/api/health');
      return true;
    } catch (error) {
      console.error('🔥 Connection test failed:', error);
      return false;
    }
  }

  async getDebugInfo(): Promise<any> {
    try {
      return await this.client.get('/api/health');
    } catch (error) {
      console.error('🔥 Debug info failed:', error);
      return null;
    }
  }
}

const apiClient = new ApiClient();
export default apiClient;