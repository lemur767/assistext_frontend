// src/types/auth.ts - Updated to match consolidated User model

export interface User {
  id: number;
  username: string;
  email: string;
  
  // Personal Information
  first_name?: string;
  last_name?: string;
  full_name?: string;
  personal_phone?: string;
  
  // Business Information
  business_name?: string;
  business_phone?: string;
  business_description?: string;
  display_name?: string;
  timezone?: string;
  business_hours?: BusinessHours;
  
  // AI Settings
  ai_enabled?: boolean;
  ai_model?: string;
  ai_temperature?: number;
  ai_max_tokens?: number;
  ai_personality?: string;
  
  // Service Settings
  auto_reply_enabled?: boolean;
  daily_response_limit?: number;
  response_delay_seconds?: number;
  
  // Status
  is_active: boolean;
  is_admin?: boolean;
  is_verified?: boolean;
  subscription_status?: string;
  signalwire_configured?: boolean;
  
  // Usage Statistics
  monthly_message_count?: number;
  total_messages_sent?: number;
  total_messages_received?: number;
  
  // Timestamps
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface BusinessHours {
  monday?: { start: string; end: string; enabled: boolean };
  tuesday?: { start: string; end: string; enabled: boolean };
  wednesday?: { start: string; end: string; enabled: boolean };
  thursday?: { start: string; end: string; enabled: boolean };
  friday?: { start: string; end: string; enabled: boolean };
  saturday?: { start: string; end: string; enabled: boolean };
  sunday?: { start: string; end: string; enabled: boolean };
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirm_password: string;  // Backend expects this format
  first_name?: string;       // Backend expects snake_case
  last_name?: string;        // Backend expects snake_case
  personal_phone?: string;
}

export interface UpdateUserData {
  // Personal Information
  first_name?: string;
  last_name?: string;
  personal_phone?: string;
  
  // Business Information
  business_name?: string;
  business_description?: string;
  timezone?: string;
  business_hours?: BusinessHours;
  
  // AI Settings
  ai_enabled?: boolean;
  ai_model?: string;
  ai_temperature?: number;
  ai_max_tokens?: number;
  ai_personality?: string;
  
  // Service Settings
  auto_reply_enabled?: boolean;
  daily_response_limit?: number;
  response_delay_seconds?: number;
}

export interface ResetPasswordData {
  password: string;
  confirm_password: string;  // Consistent naming
}

// API Response wrapper types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token: string;
  message?: string;
}