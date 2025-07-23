// src/types/auth.ts - Updated to match backend exactly

export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  personal_phone?: string; // Optional, matches backend expectations
  country?: string; // Optional, matches backend expectations
  area_code?: string; // Optional, matches backend expectations
  city?: string; // Optional, matches backend expectations
  region?: string; // Optional, matches backend expectations

  is_active: boolean;
  is_admin: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  username: string;  // Can be username OR email
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirm_password: string;  // ← Backend expects this exact name
  first_name: string;        // ← Backend expects snake_case
  last_name: string;         // ← Backend expects snake_case
  personal_phone?: string;   // ← Backend expects this exact name (optional)
  phone_number?: string;     // ← Backend expects this exact name (optional)
  country?: string;          // ← Optional field for future use
  area_code?: string;        // ← Optional field for future use
  city?: string;             // ← Optional field for future use
  region?: string;           // ← Optional field for future use
  terms_accepted: boolean;   // ← Backend expects this exact name
  subproject_name?: string;
  subproject_sid: string;
  subproject_auth_token: string;
  
}

export interface AuthResponse {
  message?: string;
  access_token: string;
  refresh_token: string;
  user: User;
}