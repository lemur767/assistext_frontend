import apiClient from './apiClient';

export interface SignalWirePhoneNumber {
  phone_number: string;
  formatted_number: string;
  sid: string;
  friendly_name: string;
  capabilities: {
    sms: boolean;
    mms: boolean;
    voice: boolean;
  };
  sms_url?: string;
  voice_url?: string;
  date_created?: string;
}

export interface SignalWireStatus {
  status: 'connected' | 'disconnected' | 'error';
  space_url?: string;
  account?: {
    account_sid: string;
    friendly_name: string;
    status: string;
  };
  phone_numbers_count: number;
  phone_numbers?: SignalWirePhoneNumber[];
  webhooks_configured: number;
  webhook_url?: string;
  error?: string;
}

export interface SendSmsRequest {
  from_number: string;
  to_number: string;
  body: string;
}

export interface SendSmsResponse {
  success: boolean;
  message_sid?: string;
  status?: string;
  error?: string;
}

export class SignalWireService {
  
  static async getStatus(): Promise<SignalWireStatus> {
    try {
      const response = await apiClient.get<SignalWireStatus>('/api/signalwire/status');
      return response;
    } catch (error: any) {
      console.error('Error getting SignalWire status:', error);
      throw new Error(`Failed to get SignalWire status: ${error.message}`);
    }
  }

  /**
   * Get user's phone numbers
   */
  static async getPhoneNumbers(): Promise<{ phone_numbers: SignalWirePhoneNumber[]; count: number }> {
    try {
      const response = await apiClient.get<{ phone_numbers: SignalWirePhoneNumber[]; count: number }>('/api/signalwire/phone-numbers');
      return response;
    } catch (error: any) {
      console.error('Error getting phone numbers:', error);
      throw new Error(`Failed to get phone numbers: ${error.message}`);
    }
  }

  /**
   * Send SMS message
   */
  static async sendSms(request: SendSmsRequest): Promise<SendSmsResponse> {
    try {
      const response = await apiClient.post<SendSmsResponse>('/api/signalwire/send-sms', request);
      return response;
    } catch (error: any) {
      console.error('Error sending SMS:', error);
      throw new Error(`Failed to send SMS: ${error.message}`);
    }
  }

  /**
   * Configure webhook for a phone number
   */
  static async configureWebhook(phoneNumber: string, webhookUrl: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const response = await apiClient.post<{ success: boolean; message?: string; error?: string }>('/api/signalwire/configure-webhook', {
        phone_number: phoneNumber,
        webhook_url: webhookUrl
      });
      return response;
    } catch (error: any) {
      console.error('Error configuring webhook:', error);
      throw new Error(`Failed to configure webhook: ${error.message}`);
    }
  }

  /**
   * Test SignalWire connection
   */
  static async testConnection(): Promise<{ connected: boolean; error?: string }> {
    try {
      const response = await apiClient.get<{ connected: boolean; error?: string }>('/api/signalwire/test-connection');
      return response;
    } catch (error: any) {
      console.error('Error testing connection:', error);
      throw new Error(`Failed to test connection: ${error.message}`);
    }
  }
}

export default SignalWireService;