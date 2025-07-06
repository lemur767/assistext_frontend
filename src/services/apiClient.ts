import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

interface ApiResponse<T = any> {
  data?: T;
  success?: boolean;
  message?: string;
  error?: string;
}

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    const baseURL = process.env.VITE_APP_API_URL || '';
    
    this.client = axios.create({
      baseURL,
      timeout: 15000, // ✅ ENHANCED: Increased timeout for SignalWire searches
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for better error handling
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // ✅ ENHANCED: Handle both direct data and wrapped responses
        if (response.data && typeof response.data === 'object') {
          return response.data;
        }
        return response.data;
      },
      (error: AxiosError) => {
        // ✅ ENHANCED: Better error handling for different scenarios
        if (error.response) {
          // Server responded with error status
          const data = error.response.data as any;
          
          if (data && data.error) {
            // Backend returned structured error
            console.error('❌ API Error:', data.error);
            return Promise.reject(new Error(data.error));
          } else if (data && data.message) {
            // Backend returned message
            console.error('❌ API Message:', data.message);
            return Promise.reject(new Error(data.message));
          } else {
            // Generic HTTP error
            console.error('❌ HTTP Error:', error.response.status, error.response.statusText);
            return Promise.reject(new Error(`Server error: ${error.response.status}`));
          }
        } else if (error.request) {
          // Network error - no response from server
          console.error('❌ Network Error:', error.message);
          return Promise.reject(new Error('Network error: Unable to connect to server. Please check if the backend is running and try again.'));
        } else {
          // Something else happened
          console.error('❌ Request Error:', error.message);
          return Promise.reject(new Error(`Request failed: ${error.message}`));
        }
      }
    );
  }

  setToken(token: string) {
    localStorage.setItem('authToken', token);
  }

  removeToken() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
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

  // ✅ NEW: Test connection method
  async testConnection(): Promise<boolean> {
    try {
      await this.client.get('/api/signup/test');
      return true;
    } catch (error) {
      console.error('🔥 Connection test failed:', error);
      return false;
    }
  }

  // ✅ NEW: Get backend debug info
  async getDebugInfo(): Promise<any> {
    try {
      return await this.client.get('/api/signup/debug');
    } catch (error) {
      console.error('🔥 Debug info failed:', error);
      return null;
    }
  }
}

const apiClient = new ApiClient();
export default apiClient;