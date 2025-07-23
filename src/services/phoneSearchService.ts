

import apiClient from './apiClient';

export interface PhoneSearchFilters {
  city?: string;
  area_code?: string;
  country?: string;
  region?: string;
  contains?: string;
  limit?: number;
}

export interface AvailablePhoneNumber {
  phone_number: string;
  formatted_number: string;
  locality: string;
  region: string;
  country: string;
  capabilities: {
    sms: boolean;
    mms: boolean;
    voice: boolean;
  };
  monthly_cost: string;
}

export interface PhoneSearchResponse {
  success: boolean;
  message?: string;
  numbers: AvailablePhoneNumber[];
  search_criteria?: PhoneSearchFilters;
  error?: string;
}

export interface PhonePurchaseResponse {
  success: boolean;
  message?: string;
  phone_number?: {
    phone_number_sid: string;
    phone_number: string;
    friendly_name: string;
    capabilities: any;
    sms_url: string;
    voice_url: string;
    status_callback: string;
  };
  error?: string;
}

export class PhoneSearchService {
  /**
   * Search for available phone numbers
   */
  static async searchAvailableNumbers(filters: PhoneSearchFilters): Promise<PhoneSearchResponse> {
    try {
      const response = await apiClient.post('/api/signup/search-numbers', filters);

      return response;
    } catch (error) {
      console.error('Error searching available numbers:', error);
      const errorMessage = (error instanceof Error) ? error.message : String(error);
      throw new Error(`Failed to search available numbers: ${errorMessage}`);
    }
  }

  /**
   * Purchase a phone number
   */
  static async purchasePhoneNumber(
    phoneNumber: string,
    friendlyName?: string
  ): Promise<PhonePurchaseResponse> {
    try {
      const response = await apiClient.post('/api/signup/purchase-number', {
        phone_number: phoneNumber,
        friendly_name: friendlyName || 'My AssisText Number'
      });

      return response;
    } catch (error) {
      console.error('Error purchasing phone number:', error);
      const errorMessage = (error instanceof Error) ? error.message : String(error);
      throw new Error(`Failed to purchase phone number: ${errorMessage}`);
    }
  }

}

