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
  name: string;
  value: string;
  area_codes: string[];
  primary_area_code: string;
}

export class RegistrationService {
  static async searchPhoneNumbers(city: string): Promise<PhoneSearchResponse> {
    try {
      console.log(`🔍 Searching for phone numbers in ${city}...`);
      
      const response = await apiClient.post<PhoneSearchResponse>('/api/signup/search-numbers', { 
        city: city.toLowerCase() 
      });

      console.log(`✅ Phone search response:`, response);
      
      // Validate response structure
      if (!response || typeof response !== 'object') {
        throw new Error('Invalid response from server');
      }
      
      if (response.success === false) {
        throw new Error(response.error || 'Phone search failed');
      }
      
      if (!response.available_numbers || !Array.isArray(response.available_numbers)) {
        throw new Error('No phone numbers returned from server');
      }
      
      console.log(`✅ Found ${response.available_numbers.length} numbers for ${city}`);
      return response;
      
    } catch (error: any) {
      console.error('❌ Error searching phone numbers:', error);
      
      // Provide specific error messages
      if (error.message.includes('Network error')) {
        throw new Error('Cannot connect to server. Please check if the backend is running on port 5000.');
      } else if (error.message.includes('500')) {
        throw new Error('Server error occurred. Please check the backend logs.');
      } else {
        throw new Error(error.message || `Failed to load phone numbers for ${city}`);
      }
    }
  }


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
   * Get supported cities for registration
   */
  static async getSupportedCities(): Promise<{ cities: SupportedCity[] }> {
    try {
      const response = await apiClient.get<{ cities: SupportedCity[] }>('/api/signup/cities');
      return response;
      
    } catch (error: any) {
      console.error('Error getting supported cities:', error);
      throw new Error(`Failed to load cities: ${error.message}`);
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
}

export default RegistrationService;
