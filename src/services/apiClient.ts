// src/services/apiClient.ts - Vite version
import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    // Vite uses import.meta.env instead of process.env
    const baseURL = import.meta.env.VITE_API_URL || 'https://backend.assitext.ca';
    
    console.log(`🔗 API Client initialized with baseURL: ${baseURL}`);
    
    this.client = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        console.log(`🔍 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('🔥 API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        console.log('📄 Response data:', response.data);
        return response.data;
      },
      (error: AxiosError) => {
        console.error('🔥 API Response Error:', error);
        
        if (error.response) {
          const status = error.response.status;
          const data = error.response.data as any;
          
          console.error(`❌ HTTP ${status}:`, data);
          
          if (status === 401) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
          }
          
          const errorMessage = data?.error || data?.message || `HTTP ${status} Error`;
          return Promise.reject(new Error(errorMessage));
          
        } else if (error.request) {
          console.error('❌ Network Error:', error.request);
          return Promise.reject(new Error('Network error - Unable to reach server'));
          
        } else {
          console.error('❌ Request Error:', error.message);
          return Promise.reject(new Error(`Request failed: ${error.message}`));
        }
      }
    );
  }

  async post<T = any>(url: string, data?: any): Promise<T> {
    return this.client.post(url, data);
  }

  async get<T = any>(url: string): Promise<T> {
    return this.client.get(url);
  }

  // Add other methods as needed...
}

const apiClient = new ApiClient();
export default apiClient;