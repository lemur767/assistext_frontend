import type { Subscription } from "./billing";


export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone_number?: string;
  is_active: boolean;
  is_admin: boolean;
  last_login?: string;
  subscription?: Subscription;
}

export interface AuthState {
  user: User | null;
  token: string | null;
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
  password_confirm: string;
  firstName?: string;
  lastName?: string;
  phone_number?: string;
}
export interface ResetPasswordData {
  password: string;
  password_confirm: string;
}