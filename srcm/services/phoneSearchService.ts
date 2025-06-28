// src/services/phoneSearchService.ts - Updated for live SignalWire integration

import apiClient from './apiClient';

export interface PhoneSearchFilters {
  city?: string;
  area_code?: string;
  country?: string;
  limit?: number;
}

export interface AvailablePhoneNumber {
  phone_number: string;
  formatted_number: string;
  locality: string;
  region: string;
  area_code: string;
  capabilities: {
    sms: boolean;
    mms: boolean;
    voice: boolean;
  };
  setup_cost: string;
  monthly_cost: string;
  country: string;
  is_toll_free: boolean;
  friendly_name: string;
}

export interface PhoneSearchResponse {
  success: boolean;
  city: string;
  available_numbers: AvailablePhoneNumber[];
  count: number;
  searched_area_codes?: string[];
  message?: string;
  error?: string;
}

export interface PhoneValidationResponse {
  is_available: boolean;
  phone_number?: string;
  formatted_number?: string;
  locality?: string;
  region?: string;
  capabilities?: {
    sms: boolean;
    mms: boolean;
    voice: boolean;
  };
  message?: string;
  error?: string;
}

export interface PhonePurchaseResponse {
  success: boolean;
  phone_number?: {
    phone_number: string;
    friendly_name: string;
    sid: string;
    capabilities: {
      sms: boolean;
      mms: boolean;
      voice: boolean;
    };
    webhook_configured: boolean;
    status: string;
    purchased_at: string;
  };
  error?: string;
}

export class PhoneSearchService {
  /**
   * Search for available phone numbers by city or area code
   */
  static async searchAvailableNumbers(filters: PhoneSearchFilters): Promise<PhoneSearchResponse> {
    try {
      const response = await apiClient('/api/phone-search', {
        method: 'POST',
        body: JSON.stringify(filters),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response;
    } catch (error) {
      console.error('Error searching available numbers:', error);
      throw new Error(`Failed to search available numbers: ${error.message}`);
    }
  }

  /**
   * Validate if a specific phone number is still available
   */
  static async validatePhoneNumber(phoneNumber: string): Promise<PhoneValidationResponse> {
    try {
      const response = await apiClient('/api/phone-validate', {
        method: 'POST',
        body: JSON.stringify({ phone_number: phoneNumber }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response;
    } catch (error) {
      console.error('Error validating phone number:', error);
      throw new Error(`Failed to validate phone number: ${error.message}`);
    }
  }

  /**
   * Purchase a phone number
   */
  static async purchasePhoneNumber(
    phoneNumber: string,
    friendlyName?: string,
    profileId?: string
  ): Promise<PhonePurchaseResponse> {
    try {
      const response = await apiClient('/api/signalwire/phone-numbers/purchase', {
        method: 'POST',
        body: JSON.stringify({
          phone_number: phoneNumber,
          friendly_name: friendlyName,
          profile_id: profileId,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response;
    } catch (error) {
      console.error('Error purchasing phone number:', error);
      throw new Error(`Failed to purchase phone number: ${error.message}`);
    }
  }

  /**
   * Get supported cities with their area codes
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
      const response = await apiClient('/api/signup/cities', {
        method: 'GET',
      });

      return response;
    } catch (error) {
      console.error('Error getting supported cities:', error);
      throw new Error(`Failed to get supported cities: ${error.message}`);
    }
  }

  /**
   * Test SignalWire connection status
   */
  static async testSignalWireConnection(): Promise<{
    is_connected: boolean;
    error_message: string;
    account_info: {
      friendly_name?: string;
      status?: string;
      type?: string;
      date_created?: string;
    };
  }> {
    try {
      const response = await apiClient('/api/signalwire/test-connection', {
        method: 'GET',
      });

      return response;
    } catch (error) {
      console.error('Error testing SignalWire connection:', error);
      throw new Error(`Failed to test SignalWire connection: ${error.message}`);
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
   * Validate phone number format
   */
  static isValidPhoneNumber(phoneNumber: string): boolean {
    // Remove formatting characters
    const cleaned = phoneNumber.replace(/[\s\-\(\)\.]/g, '');
    
    // Check if it's a valid North American number
    const northAmericanPattern = /^(\+?1)?[2-9]\d{2}[2-9]\d{2}\d{4}$/;
    
    return northAmericanPattern.test(cleaned);
  }

  /**
   * Get area codes for a city
   */
  static getAreaCodesForCity(city: string): string[] {
    const cityAreaCodes: Record<string, string[]> = {
      toronto: ['416', '647', '437'],
      ottawa: ['613', '343'],
      vancouver: ['604', '778', '236'],
      montreal: ['514', '438'],
      calgary: ['403', '587', '825'],
      edmonton: ['780', '587', '825'],
      mississauga: ['905', '289', '365'],
      hamilton: ['905', '289'],
      london: ['519', '226', '548'],
      winnipeg: ['204', '431'],
      quebec_city: ['418', '581'],
      halifax: ['902', '782'],
      saskatoon: ['306', '639'],
      regina: ['306', '639'],
    };

    return cityAreaCodes[city.toLowerCase()] || [];
  }

  /**
   * Check if number is toll-free
   */
  static isTollFreeNumber(phoneNumber: string): boolean {
    const tollFreePrefixes = ['800', '888', '877', '866', '855', '844', '833'];
    const cleaned = phoneNumber.replace(/[\s\-\(\)\.+]/g, '');
    
    if (cleaned.startsWith('1')) {
      const areaCode = cleaned.slice(1, 4);
      return tollFreePrefixes.includes(areaCode);
    }
    
    const areaCode = cleaned.slice(0, 3);
    return tollFreePrefixes.includes(areaCode);
  }

  /**
   * Estimate monthly cost for a phone number
   */
  static estimateMonthlyCost(phoneNumber: string, country: string = 'CA'): number {
    if (this.isTollFreeNumber(phoneNumber)) {
      return 2.0; // Toll-free numbers typically cost more
    }

    switch (country) {
      case 'CA':
        return 1.0; // CAD $1.00 for Canadian numbers
      case 'US':
        return 1.0; // USD $1.00 for US numbers
      default:
        return 1.0;
    }
  }
}

// Export individual methods for tree-shaking
export const {
  searchAvailableNumbers,
  validatePhoneNumber,
  purchasePhoneNumber,
  getSupportedCities,
  testSignalWireConnection,
  formatPhoneDisplay,
  isValidPhoneNumber,
  getAreaCodesForCity,
  isTollFreeNumber,
  estimateMonthlyCost,
} = PhoneSearchService;

export default PhoneSearchService;