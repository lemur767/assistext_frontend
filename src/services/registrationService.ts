// src/services/registrationService.ts - Enhanced with better error handling

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
  searched_area_codes?: string[];  // ✅ NEW: Added optional field from backend
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
   * Search for available phone numbers in a city
   */
  static async searchPhoneNumbers(city: string): Promise<PhoneSearchResponse> {
    try {
      console.log(`🔍 Searching for phone numbers in ${city}...`);
      
      const response = await apiClient.post<PhoneSearchResponse>('/api/signup/search-numbers', { 
        city: city.toLowerCase() 
      });

      console.log(`✅ Phone search response:`, response);
      
      // ✅ ENHANCED: Better response validation
      if (!response || typeof response !== 'object') {
        throw new Error('Invalid response from server');
      }
      
      if (response.success === false) {
        // ✅ ENHANCED: Use backend's improved error messages
        const errorMessage = response.error || response.message || 'Phone search failed';
        throw new Error(errorMessage);
      }
      
      if (!response.available_numbers || !Array.isArray(response.available_numbers)) {
        throw new Error('No phone numbers returned from server');
      }
      
      // ✅ ENHANCED: Show more detailed success info
      const areaCodesInfo = response.searched_area_codes 
        ? ` (searched area codes: ${response.searched_area_codes.join(', ')})`
        : '';
      console.log(`✅ Found ${response.available_numbers.length} numbers for ${city}${areaCodesInfo}`);
      
      return response;
      
    } catch (error: any) {
      console.error('❌ Error searching phone numbers:', error);
      
      // ✅ ENHANCED: More specific error messages
      if (error.message.includes('Network error') || error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Please check if the backend is running on port 5000.');
      } else if (error.message.includes('500')) {
        throw new Error('Server error occurred. Please check the backend logs and try again.');
      } else if (error.message.includes('SignalWire service not available')) {
        throw new Error('Phone number service is temporarily unavailable. Please try again later or contact support.');
      } else {
        // Use the specific error message from backend
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

      console.log(`✅ Signup response:`, response);
      
      if (response && response.success) {
        console.log(`✅ Signup completed successfully for ${signupData.username}`);
      } else {
        // ✅ ENHANCED: Better error handling for signup
        const errorMessage = response?.error || response?.message || 'Registration failed';
        throw new Error(errorMessage);
      }
      
      return response;
      
    } catch (error: any) {
      console.error('❌ Error completing signup:', error);
      
      // ✅ ENHANCED: More specific signup error messages
      if (error.message.includes('Username already exists')) {
        throw new Error('This username is already taken. Please choose a different username.');
      } else if (error.message.includes('Email already exists')) {
        throw new Error('This email is already registered. Please use a different email or try logging in.');
      } else if (error.message.includes('Missing required field')) {
        throw new Error('Please fill in all required fields and try again.');
      } else {
        throw new Error(error.message || 'Registration failed. Please try again.');
      }
    }
  }

  /**
   * ✅ NEW: Debug method to test backend connection
   */
  static async testBackendConnection(): Promise<{
    connected: boolean;
    signalwireAvailable: boolean;
    configComplete: boolean;
    details?: any;
  }> {
    try {
      const response = await apiClient.get('/api/signup/debug');
      
      return {
        connected: true,
        signalwireAvailable: response.signalwire_client_created || false,
        configComplete: response.config_check?.space_url && response.config_check?.project_id && response.config_check?.auth_token,
        details: response
      };
      
    } catch (error) {
      console.error('❌ Backend connection test failed:', error);
      return {
        connected: false,
        signalwireAvailable: false,
        configComplete: false,
        details: error
      };
    }
  }

  /**
   * ✅ NEW: Get list of supported cities
   */
  static async getSupportedCities(): Promise<any[]> {
    try {
      const response = await apiClient.get('/api/signup/cities');
      return response.cities || [];
    } catch (error) {
      console.error('❌ Error getting supported cities:', error);
      return [];
    }
  }
}