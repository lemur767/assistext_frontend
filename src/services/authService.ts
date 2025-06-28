// src/services/authService.ts - Authentication service using apiClient

import apiClient from './apiClient';
import type { User, LoginCredentials, RegisterData } from '../types';

export interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token: string;
}

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token?: string;
}

export interface PasswordChangeData {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export interface PasswordResetData {
  token: string;
  password: string;
  confirm_password: string;
}

export class AuthService {
  /**
   * Login user with credentials
   */
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/api/auth/login', credentials);
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  /**
   * Register new user
   */
  static async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/api/auth/register', data);
      return response;
    } catch (error) {
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
    } catch (error) {
      console.error('Failed to get current user:', error);
      throw new Error(`Failed to get user profile: ${error.message}`);
    }
  }

  /**
   * Refresh authentication token
   */
  static async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    try {
      const response = await apiClient.post<RefreshTokenResponse>('/api/auth/refresh-token', {
        refresh_token: refreshToken
      });
      return response;
    } catch (error) {
      console.error('Token refresh failed:', error);
      throw new Error(`Token refresh failed: ${error.message}`);
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(data: Partial<User>): Promise<User> {
    try {
      const response = await apiClient.put<User>('/api/auth/profile', data);
      return response;
    } catch (error) {
      console.error('Profile update failed:', error);
      throw new Error(`Profile update failed: ${error.message}`);
    }
  }

  /**
   * Change user password
   */
  static async changePassword(data: PasswordChangeData): Promise<{ message: string }> {
    try {
      const response = await apiClient.post<{ message: string }>('/api/auth/change-password', data);
      return response;
    } catch (error) {
      console.error('Password change failed:', error);
      throw new Error(`Password change failed: ${error.message}`);
    }
  }

  /**
   * Request password reset
   */
  static async requestPasswordReset(email: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.post<{ message: string }>('/api/auth/forgot-password', {
        email
      });
      return response;
    } catch (error) {
      console.error('Password reset request failed:', error);
      throw new Error(`Password reset request failed: ${error.message}`);
    }
  }

  /**
   * Reset password with token
   */
  static async resetPassword(data: PasswordResetData): Promise<{ message: string }> {
    try {
      const response = await apiClient.post<{ message: string }>('/api/auth/reset-password', data);
      return response;
    } catch (error) {
      console.error('Password reset failed:', error);
      throw new Error(`Password reset failed: ${error.message}`);
    }
  }

  /**
   * Logout user (optional server-side logout)
   */
  static async logout(): Promise<void> {
    try {
      await apiClient.post('/api/auth/logout');
    } catch (error) {
      // Ignore logout errors - token will be removed locally anyway
      console.log('Server logout failed (this is usually fine):', error.message);
    }
  }

  /**
   * Verify email address
   */
  static async verifyEmail(token: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.post<{ message: string }>('/api/auth/verify-email', {
        token
      });
      return response;
    } catch (error) {
      console.error('Email verification failed:', error);
      throw new Error(`Email verification failed: ${error.message}`);
    }
  }

  /**
   * Resend email verification
   */
  static async resendEmailVerification(): Promise<{ message: string }> {
    try {
      const response = await apiClient.post<{ message: string }>('/api/auth/resend-verification');
      return response;
    } catch (error) {
      console.error('Resend verification failed:', error);
      throw new Error(`Resend verification failed: ${error.message}`);
    }
  }

  /**
   * Check if token is valid and not expired
   */
  static isTokenValid(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get token expiration time
   */
  static getTokenExpiration(token: string): Date | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return new Date(payload.exp * 1000);
    } catch (error) {
      return null;
    }
  }

  /**
   * Check if token will expire soon (within specified minutes)
   */
  static willTokenExpireSoon(token: string, minutesThreshold: number = 15): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      const thresholdTime = currentTime + (minutesThreshold * 60);
      return payload.exp < thresholdTime;
    } catch (error) {
      return true; // Assume it will expire if we can't parse it
    }
  }
}

// Export individual methods for tree-shaking
export const {
  login,
  register,
  getCurrentUser,
  refreshToken,
  updateProfile,
  changePassword,
  requestPasswordReset,
  resetPassword,
  logout,
  verifyEmail,
  resendEmailVerification,
  isTokenValid,
  getTokenExpiration,
  willTokenExpireSoon,
} = AuthService;

export default AuthService;