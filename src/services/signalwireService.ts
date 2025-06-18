// src/services/signalwireService.ts - Fixed to use your existing apiClient
import apiClient  from './apiClient.ts';


export interface SMSMessage {
  id?: string;
  to: string;
  from: string;
  body: string;
  status?: 'queued' | 'sending' | 'sent' | 'delivered' | 'failed';
  timestamp?: string;
  message_sid?: string;
  error_message?: string;
}

export interface SignalWirePhoneNumber {
  phone_number: string;
  friendly_name?: string;
  capabilities: {
    sms: boolean;
    mms: boolean;
    voice: boolean;
  };
  webhook_url?: string;
  is_configured: boolean;
}

export interface WebhookConfig {
  url: string;
  method: 'POST' | 'GET';
  events: string[];
  is_active: boolean;
}

export interface SignalWireStatus {
  status: 'connected' | 'disconnected' | 'error';
  space_url: string;
  project_id: string;
  phone_numbers_count: number;
  webhooks_configured: number;
  last_webhook_received?: string;
  account_info?: {
    friendly_name: string;
    status: string;
  };
}

export interface MessageAnalytics {
  total_sent: number;
  total_received: number;
  delivery_rate: number;
  failed_messages: number;
  last_24h: {
    sent: number;
    received: number;
  };
  by_profile: Array<{
    profile_id: string;
    profile_name: string;
    sent: number;
    received: number;
    delivery_rate: number;
  }>;
}

class SignalWireService {
  // ========== SMS OPERATIONS ==========

  /**
   * Send an SMS message through SignalWire
   */
  async sendSMS(message: Omit<SMSMessage, 'id' | 'status' | 'timestamp'>): Promise<SMSMessage> {
    try {
      const response = await apiClient.post('/api/sms/send', {
        to: message.to,
        from: message.from,
        message: message.body,
      });

      return {
        ...message,
        id: response.id,
        message_sid: response.message_sid,
        status: response.status,
        timestamp: response.timestamp,
      };
    } catch (error) {
      console.error('Failed to send SMS:', error);
      throw new Error(`Failed to send SMS: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Send bulk SMS messages
   */
  async sendBulkSMS(messages: Omit<SMSMessage, 'id' | 'status' | 'timestamp'>[]): Promise<{
    successful: SMSMessage[];
    failed: Array<{ message: Omit<SMSMessage, 'id' | 'status' | 'timestamp'>; error: string }>;
  }> {
    try {
      const response = await apiClient.post('/api/sms/send-bulk', { messages });
      return response;
    } catch (error) {
      console.error('Failed to send bulk SMS:', error);
      throw new Error(`Failed to send bulk SMS: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get message status by message SID
   */
  async getMessageStatus(messageSid: string): Promise<{
    sid: string;
    status: string;
    error_code?: string;
    error_message?: string;
    date_sent?: string;
    date_updated?: string;
  }> {
    try {
      const response = await apiClient.get(`/api/sms/status/${messageSid}`);
      return response;
    } catch (error) {
      console.error('Failed to get message status:', error);
      throw new Error(`Failed to get message status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // ========== PHONE NUMBER MANAGEMENT ==========

  /**
   * Get all available SignalWire phone numbers for the account
   */
  async getPhoneNumbers(): Promise<SignalWirePhoneNumber[]> {
    try {
      const response = await apiClient.get('/api/signalwire/phone-numbers');
      return response.phone_numbers || [];
    } catch (error) {
      console.error('Failed to get phone numbers:', error);
      throw new Error(`Failed to get phone numbers: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Configure webhook for a specific phone number
   */
  async configurePhoneNumberWebhook(phoneNumber: string, webhookUrl: string): Promise<boolean> {
    try {
      const response = await apiClient.put(`/api/signalwire/phone-numbers/${encodeURIComponent(phoneNumber)}/webhook`, {
        webhook_url: webhookUrl
      });

      return response.success;
    } catch (error) {
      console.error('Failed to configure webhook:', error);
      throw new Error(`Failed to configure webhook: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Purchase a new phone number (if available in your SignalWire plan)
   */
  async purchasePhoneNumber(areaCode?: string, country?: string): Promise<SignalWirePhoneNumber> {
    try {
      const response = await apiClient.post('/api/signalwire/phone-numbers/purchase', {
        area_code: areaCode,
        country: country || 'CA'
      });

      return response.phone_number;
    } catch (error) {
      console.error('Failed to purchase phone number:', error);
      throw new Error(`Failed to purchase phone number: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // ========== WEBHOOK MANAGEMENT ==========

  /**
   * Get current webhook configuration
   */
  async getWebhookConfig(): Promise<WebhookConfig> {
    try {
      const response = await apiClient.get('/api/signalwire/webhooks/config');
      return response;
    } catch (error) {
      console.error('Failed to get webhook config:', error);
      throw new Error(`Failed to get webhook config: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Update webhook configuration
   */
  async updateWebhookConfig(config: Partial<WebhookConfig>): Promise<boolean> {
    try {
      const response = await apiClient.put('/api/signalwire/webhooks/config', config);
      return response.success;
    } catch (error) {
      console.error('Failed to update webhook config:', error);
      throw new Error(`Failed to update webhook config: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Test webhook connectivity
   */
  async testWebhook(): Promise<{ success: boolean; response_time?: number; error?: string }> {
    try {
      const response = await apiClient.post('/api/signalwire/webhooks/test');
      return response;
    } catch (error) {
      console.error('Webhook test failed:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // ========== STATUS & MONITORING ==========

  /**
   * Get comprehensive SignalWire integration status
   */
  async getSignalWireStatus(): Promise<SignalWireStatus> {
    try {
      const response = await apiClient.get('/api/signalwire/status');
      return response;
    } catch (error) {
      console.error('Failed to get SignalWire status:', error);
      throw new Error(`Failed to get SignalWire status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Initialize or re-initialize SignalWire integration
   */
  async initializeSignalWire(): Promise<{
    success: boolean;
    webhooks_configured: number;
    phone_numbers: string[];
    profiles_synced: number;
    error?: string;
  }> {
    try {
      const response = await apiClient.post('/api/signalwire/initialize');
      return response;
    } catch (error) {
      console.error('Failed to initialize SignalWire:', error);
      throw new Error(`Failed to initialize SignalWire: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get message analytics and delivery statistics
   */
  async getMessageAnalytics(timeframe: '24h' | '7d' | '30d' | '90d' = '30d'): Promise<MessageAnalytics> {
    try {
      const response = await apiClient.get(`/api/signalwire/analytics?timeframe=${timeframe}`);
      return response;
    } catch (error) {
      console.error('Failed to get message analytics:', error);
      throw new Error(`Failed to get message analytics: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // ========== PROFILE INTEGRATION ==========

  /**
   * Sync profile with SignalWire phone number
   */
  async syncProfileWithSignalWire(profileId: string, phoneNumber: string): Promise<boolean> {
    try {
      const response = await apiClient.post(`/api/profiles/${profileId}/signalwire-sync`, {
        phone_number: phoneNumber
      });

      return response.success;
    } catch (error) {
      console.error('Failed to sync profile with SignalWire:', error);
      throw new Error(`Failed to sync profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get SignalWire configuration for a specific profile
   */
  async getProfileSignalWireConfig(profileId: string): Promise<{
    phone_number?: string;
    webhook_configured: boolean;
    auto_response_enabled: boolean;
    message_count_24h: number;
    last_message_timestamp?: string;
  }> {
    try {
      const response = await apiClient.get(`/api/profiles/${profileId}/signalwire-config`);
      return response;
    } catch (error) {
      console.error('Failed to get profile SignalWire config:', error);
      throw new Error(`Failed to get profile config: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // ========== UTILITY METHODS ==========

  /**
   * Validate phone number format
   */
  isValidPhoneNumber(phoneNumber: string): boolean {
    // Remove all non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // Check if it's a valid length (10-15 digits)
    if (cleaned.length < 10 || cleaned.length > 15) {
      return false;
    }

    // Check if it starts with a country code
    if (cleaned.length === 10) {
      // Assume North American number, add +1
      return /^[2-9]\d{2}[2-9]\d{6}$/.test(cleaned);
    }

    if (cleaned.length === 11 && cleaned.startsWith('1')) {
      // North American with country code
      return /^1[2-9]\d{2}[2-9]\d{6}$/.test(cleaned);
    }

    // International numbers - basic validation
    return cleaned.length >= 10;
  }

  /**
   * Format phone number for display
   */
  formatPhoneNumber(phoneNumber: string): string {
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    if (cleaned.length === 10) {
      return `+1 (${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    
    // International format
    return `+${cleaned}`;
  }

  /**
   * Normalize phone number for API calls
   */
  normalizePhoneNumber(phoneNumber: string): string {
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    if (cleaned.length === 10) {
      return `+1${cleaned}`;
    }
    
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return `+${cleaned}`;
    }
    
    if (!cleaned.startsWith('+')) {
      return `+${cleaned}`;
    }
    
    return cleaned;
  }
}

// Create and export a singleton instance
export const signalwireService = new SignalWireService();

// Export the class for testing or custom instances
export default signalwireService;