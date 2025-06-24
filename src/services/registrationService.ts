// src/services/registrationService.ts - Registration flow with live SignalWire integration

import { apiRequest } from './api';

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

export class RegistrationService {
  /**
   * Step 3 of registration: Search for 5 available phone numbers in selected city
   * Frontend → Backend → SignalWire API → Backend → Frontend (5 numbers)
   */
  static async searchPhoneNumbers(city: string): Promise<PhoneSearchResponse> {
    try {
      console.log(`Searching for phone numbers in ${city}...`);
      
      const response = await fetch('/api/signup/search-numbers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ city: city.toLowerCase() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Failed to search phone numbers: ${response.status}`);
      }

      console.log(`Found ${data.available_numbers?.length || 0} numbers for ${city}`);
      
      return data;
    } catch (error) {
      console.error('Error searching phone numbers:', error);
      throw new Error(`Failed to load phone numbers for ${city}: ${error.message}`);
    }
  }

  /**
   * Complete the registration process with selected phone number
   */
  static async completeSignup(signupData: CompleteSignupData): Promise<SignupResponse> {
    try {
      console.log(`Completing signup for ${signupData.username} with number ${signupData.selectedPhoneNumber}`);
      
      const response = await fetch('/api/signup/complete-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Signup failed: ${response.status}`);
      }

      console.log(`Signup completed successfully for ${signupData.username}`);
      
      return data;
    } catch (error) {
      console.error('Error completing signup:', error);
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

  /**
   * Get list of supported cities for registration
   */
  static async getSupportedCities(): Promise<{
    cities: Array<{
      name: string;
      value: string;
      area_codes: string[];
      primary_area_code: string;
    }>;
  }> {
    try {
      const response = await fetch('/api/signup/cities', {
        method: 'GET',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(`Failed to get cities: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Error getting supported cities:', error);
      throw new Error(`Failed to load cities: ${error.message}`);
    }
  }

  /**
   * Validate username availability
   */
  static async validateUsername(username: string): Promise<{
    available: boolean;
    error?: string;
  }> {
    try {
      const response = await fetch('/api/signup/validate-username', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error validating username:', error);
      return { available: false, error: 'Validation failed' };
    }
  }

  /**
   * Validate email availability
   */
  static async validateEmail(email: string): Promise<{
    available: boolean;
    error?: string;
  }> {
    try {
      const response = await fetch('/api/signup/validate-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error validating email:', error);
      return { available: false, error: 'Validation failed' };
    }
  }

  /**
   * Format phone number for display
   */
  static formatPhoneDisplay(phoneNumber: string): string {
    let cleanNumber = phoneNumber;
    if (cleanNumber.startsWith('+1')) {
      cleanNumber = cleanNumber.slice(2);
    } else if (cleanNumber.startsWith('1')) {
      cleanNumber = cleanNumber.slice(1);
    }

    if (cleanNumber.length === 10) {
      return `(${cleanNumber.slice(0, 3)}) ${cleanNumber.slice(3, 6)}-${cleanNumber.slice(6)}`;
    }

    return phoneNumber;
  }

  /**
   * Validate password strength
   */
  static validatePassword(password: string): {
    isValid: boolean;
    errors: string[];
  } {
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

    return {
      isValid: errors.length === 0,
      errors,
    };
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

  /**
   * Validate username format
   */
  static validateUsernameFormat(username: string): {
    isValid: boolean;
    error?: string;
  } {
    if (username.length < 3) {
      return { isValid: false, error: 'Username must be at least 3 characters' };
    }

    if (username.length > 20) {
      return { isValid: false, error: 'Username must be less than 20 characters' };
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      return { 
        isValid: false, 
        error: 'Username can only contain letters, numbers, underscores, and hyphens' 
      };
    }

    return { isValid: true };
  }
}

export default RegistrationService;