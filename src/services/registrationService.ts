// src/services/registrationService.ts - Fixed exports

import apiClient from './apiClient';

export interface RegistrationPhoneNumber {
  phone_number: string;
  formatted_number: string;
  locality: string;
  region: string;
  area_code: string;
  setup_cost: string;
  monthly_cost: string;
  capabilities: {
    sms: boolean;
    voice: boolean;
    mms: boolean;
  };
}

export interface PhoneSearchResponse {
  success: boolean;
  available_numbers: RegistrationPhoneNumber[];
  city: string;
  count: number;
  message?: string;
  error?: string;
}

export interface CompleteSignupData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  profileName: string;
  profileDescription?: string;
  personalPhone?: string;
  selectedPhoneNumber: string;
  timezone?: string;
}

export interface SignupResponse {
  success: boolean;
  message: string;
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  profile: {
    id: number;
    name: string;
    phone_number: string;
  };
  access_token: string;
  refresh_token: string;
  error?: string;
}

export interface SupportedCity {
  code: string;
  name: string;
  country: string;
  available: boolean;
}

class RegistrationService {
 
  /**
   * Complete registration process
   */
  static async completeSignup(signupData: CompleteSignupData): Promise<SignupResponse> {
    try {
      console.log(`🚀 Completing signup for ${signupData.username}...`);
      
      const response = await apiClient.post<SignupResponse>('/api/signup/complete-signup', signupData);

      if (response.success) {
        console.log(`✅ Signup completed successfully for ${signupData.username}`);
      }
      
      return response;
      
    } catch (error: any) {
      console.error('❌ Error completing signup:', error);
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

 

  /**
   * Validate password strength
   */
  static validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Check if passwords match
   */
  static validatePasswordMatch(password: string, confirmPassword: string): boolean {
    return password === confirmPassword;
  }

  /**
   * Validate email format
   */
  static validateEmailFormat(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }


}
// Export as default
export default RegistrationService;