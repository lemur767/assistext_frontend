import apiClient from './apiClient';

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  personal_phone?: string;
  timezone?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  personalPhone?: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token: string;
}

export class AuthService {
  /**
   * Login user
   */
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/api/auth/login', credentials);
      
      // Store tokens
      if (response.access_token) {
        apiClient.setToken(response.access_token);
      }
      
      return response;
    } catch (error: any) {
      console.error('Login failed:', error);
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  /**
   * Register new user (simple registration, not the multi-step one)
   */
  static async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/api/auth/register', data);
      
      // Store tokens
      if (response.access_token) {
        apiClient.setToken(response.access_token);
      }
      
      return response;
    } catch (error: any) {
      console.error('Registration failed:', error);
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

  /**
   * Get current user profile
   */
  static async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get<User>('/api/auth/me');
      return response;
    } catch (error: any) {
      console.error('Failed to get current user:', error);
      throw new Error(`Failed to get user profile: ${error.message}`);
    }
  }

  /**
   * Logout user
   */
  static async logout(): Promise<void> {
    try {
      await apiClient.post('/api/auth/logout');
    } catch (error) {
      // Ignore logout errors
      console.log('Logout endpoint not available or failed');
    } finally {
      // Always clear local tokens
      apiClient.removeToken();
    }
  }

  /**
   * Refresh authentication token
   */
  static async refreshToken(): Promise<{ access_token: string; refresh_token?: string }> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiClient.post<{ access_token: string; refresh_token?: string }>('/api/auth/refresh-token', {
        refresh_token: refreshToken
      });

      // Update stored token
      if (response.access_token) {
        apiClient.setToken(response.access_token);
      }
      if (response.refresh_token) {
        localStorage.setItem('refreshToken', response.refresh_token);
      }

      return response;
    } catch (error: any) {
      console.error('Token refresh failed:', error);
      // Clear tokens on refresh failure
      apiClient.removeToken();
      throw new Error(`Token refresh failed: ${error.message}`);
    }
  }
}

export default AuthService;