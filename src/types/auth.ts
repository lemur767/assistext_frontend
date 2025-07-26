// src/types/auth.ts - Updated to match new backend
export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  personal_phone?: string;
  signalwire_phone_number?: string;
  signalwire_setup_completed: boolean;
  signalwire_setup_step: number;
  trial_phone_expires_at?: string;
  is_active: boolean;
  is_admin: boolean;
  last_login?: string;
  created_at: string;
  updated_at?: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirm_password: string;  // Backend expects this exact name
  first_name: string;        // Backend expects snake_case
  last_name: string;         // Backend expects snake_case
  personal_phone?: string;   // Optional field, backend expects this name
}

// New types for phone setup
export interface SearchNumbersRequest {
  country: string;
  area_code?: string;
  locality?: string;
  limit?: number;
}

export interface PurchaseNumberRequest {
  phone_number: string;
  selection_token: string;
}

export interface AuthResponse {
  message?: string;
  access_token: string;
  refresh_token?: string;
  user: User;
  subproject?: {
    sid: string;
    friendly_name: string;
    status: string;
  };
  next_step?: string;
  profile_status?: any;
  banner?: string;
  requires_payment?: boolean;
}
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  error: string | null;
  loading: boolean;
  signalwireSetupCompleted: boolean;
  signalwireSetupStep: number;
  trialPhoneExpiresAt?: string;
  isAdmin: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt?: string;
  subproject?: {
    sid: string;
    friendly_name: string;
    status: string;
  };
  nextStep?: string;
  profileStatus?: any; 
  banner?: string;
  requiresPayment?: boolean;
}