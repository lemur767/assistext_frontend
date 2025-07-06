// src/services/apiClient.ts - Fixed with proper TypeScript types

import axios, { AxiosInstance, AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';

interface ApiResponse<T = any> {
  data?: T;
  success?: boolean;
  message?: string;
  error?: string;
}

class ApiClient {
  private client: AxiosInstance;
  public baseURL: string;

  constructor() {
    // Use environment variable or fallback to localhost
    this.baseURL = process.env.VITE_APP_API_URL || 'https://backend.assitext.ca';
    
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
      (config: AxiosRequestConfig) => {
        const token = localStorage.getItem('auth_token'); // Consistent token key
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        console.log(`🔍 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error: AxiosError) => {
        console.error('🔥 API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        console.log('📄 Response data:', response.data);
        
        // Return the data directly for successful responses
        return response.data;
      },
      (error: AxiosError) => {
        console.error('🔥 API Response Error:', error);
        
        if (error.response) {
          // Server responded with error status
          const status = error.response.status;
          const data = error.response.data as any;
          
          console.error(`❌ HTTP ${status}:`, data);
          
          if (status === 401) {
            // Token expired or invalid - clear all auth data
            localStorage.removeItem('auth_token');
            localStorage.removeItem('refresh_token');
            // Only redirect if not already on login page
            if (window.location.pathname !== '/login') {
              window.location.href = '/login';
            }
          }
          
          // Extract error message from response
          const errorMessage = data?.error || data?.message || `HTTP ${status} Error`;
          return Promise.reject(new Error(errorMessage));
          
        } else if (error.request) {
          // Request was made but no response received
          console.error('❌ Network Error - No response received:', error.request);
          return Promise.reject(new Error('Network error - Unable to reach server. Please check your connection and ensure the backend is running.'));
          
        } else {
          // Something else happened
          console.error('❌ Request Error:', error.message);
          return Promise.reject(new Error(`Request failed: ${error.message}`));
        }
      }
    );
  }

  /**
   * Set authentication token
   */
  setToken(token: string): void {
    localStorage.setItem('auth_token', token); // Consistent token key
  }

  /**
   * Remove authentication tokens
   */
  removeToken(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
  }

  /**
   * GET request
   */
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.client.get(url, config);
  }

  /**
   * POST request
   */
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.client.post(url, data, config);
  }

  /**
   * PUT request
   */
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.client.put(url, data, config);
  }

  /**
   * DELETE request
   */
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.client.delete(url, config);
  }

  /**
   * PATCH request
   */
  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.client.patch(url, data, config);
  }

  /**
   * Test connection to backend
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.client.get('/api/health');
      return true;
    } catch (error) {
      console.error('🔥 Connection test failed:', error);
      return false;
    }
  }

  /**
   * Get backend debug info
   */
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