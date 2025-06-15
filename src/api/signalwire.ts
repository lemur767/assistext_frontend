// src/api/signalwire.ts - API endpoints for SignalWire integration
import { apiClient} from './apiClient';

export interface SendSMSRequest {
  to: string;
  from: string;
  message: string;
  profile_id?: string;
  template_id?: string;
  template_variables?: Record<string, any>;
  schedule_time?: string;
}

export interface SendSMSResponse {
  success: boolean;
  message_sid: string;
  status: string;
  timestamp: string;
  id: string;
  error?: string;
}

export interface BulkSMSRequest {
  messages: Array<{
    to: string;
    from: string;
    message: string;
    profile_id?: string;
  }>;
  batch_name?: string;
  schedule_time?: string;
}

export interface BulkSMSResponse {
  batch_id: string;
  total_messages: number;
  successful: Array<{
    to: string;
    message_sid: string;
    status: string;
  }>;
  failed: Array<{
    to: string;
    error: string;
    error_code?: number;
  }>;
  cost_estimate?: {
    total_cost: number;
    currency: string;
  };
}

export interface MessageStatusResponse {
  message_sid: string;
  status: string;
  error_code?: number;
  error_message?: string;
  date_sent?: string;
  date_updated?: string;
  price?: string;
  price_unit?: string;
}

export interface PhoneNumbersResponse {
  phone_numbers: Array<{
    phone_number: string;
    friendly_name?: string;
    capabilities: {
      sms: boolean;
      mms: boolean;
      voice: boolean;
    };
    webhook_url?: string;
    is_configured: boolean;
    status: string;
  }>;
  total_count: number;
}

export interface SignalWireStatusResponse {
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
  health_check: {
    api_accessible: boolean;
    webhooks_responsive: boolean;
    phone_numbers_active: boolean;
    last_check: string;
  };
}

export interface AnalyticsResponse {
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
  by_day: Array<{
    date: string;
    sent: number;
    received: number;
    failed: number;
  }>;
  costs?: {
    total_cost: number;
    cost_per_message: number;
    currency: string;
  };
}

export interface InitializeResponse {
  success: boolean;
  webhooks_configured: number;
  phone_numbers: string[];
  profiles_synced: number;
  profiles_created: number;
  error?: string;
}

export interface WebhookTestResponse {
  success: boolean;
  response_time?: number;
  error?: string;
  webhook_url: string;
  status_code?: number;
}

// ========== MAIN SIGNALWIRE API CLASS ==========
export class SignalWireAPI {
  
  // ========== SMS OPERATIONS ==========
  
  /**
   * Send a single SMS message
   */
  static async sendSMS(request: SendSMSRequest): Promise<SendSMSResponse> {
    return await apiRequest('/api/sms/send', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  /**
   * Send bulk SMS messages
   */
  static async sendBulkSMS(request: BulkSMSRequest): Promise<BulkSMSResponse> {
    return await apiRequest('/api/sms/send-bulk', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  /**
   * Get message delivery status
   */
  static async getMessageStatus(messageSid: string): Promise<MessageStatusResponse> {
    return await apiRequest(`/api/sms/status/${messageSid}`, {
      method: 'GET',
    });
  }

  /**
   * Get messages for a specific conversation
   */
  static async getConversationMessages(
    profileId: string, 
    contactNumber: string,
    page: number = 1,
    limit: number = 50
  ): Promise<{
    messages: Array<{
      id: string;
      content: string;
      is_incoming: boolean;
      timestamp: string;
      status: string;
      message_sid?: string;
    }>;
    total: number;
    page: number;
    has_more: boolean;
  }> {
    const params = new URLSearchParams({
      contact_number: contactNumber,
      page: page.toString(),
      limit: limit.toString(),
    });

    return await apiRequest(`/api/profiles/${profileId}/conversations?${params}`, {
      method: 'GET',
    });
  }

  // ========== PHONE NUMBER MANAGEMENT ==========

  /**
   * Get all SignalWire phone numbers
   */
  static async getPhoneNumbers(): Promise<PhoneNumbersResponse> {
    return await apiRequest('/api/signalwire/phone-numbers', {
      method: 'GET',
    });
  }

  /**
   * Configure webhook for a phone number
   */
  static async configurePhoneNumberWebhook(
    phoneNumber: string, 
    webhookUrl: string
  ): Promise<{ success: boolean; error?: string }> {
    return await apiRequest(`/api/signalwire/phone-numbers/${encodeURIComponent(phoneNumber)}/webhook`, {
      method: 'PUT',
      body: JSON.stringify({ webhook_url: webhookUrl }),
    });
  }

  /**
   * Purchase a new phone number
   */
  static async purchasePhoneNumber(
    areaCode?: string, 
    country: string = 'CA'
  ): Promise<{
    success: boolean;
    phone_number?: {
      phone_number: string;
      friendly_name?: string;
      capabilities: {
        sms: boolean;
        mms: boolean;
        voice: boolean;
      };
    };
    error?: string;
  }> {
    return await apiRequest('/api/signalwire/phone-numbers/purchase', {
      method: 'POST',
      body: JSON.stringify({ area_code: areaCode, country }),
    });
  }

  /**
   * Search for available phone numbers
   */
  static async searchAvailableNumbers(filters: {
    area_code?: string;
    country?: string;
    contains?: string;
    sms_enabled?: boolean;
    limit?: number;
  }): Promise<{
    available_numbers: Array<{
      phone_number: string;
      locality?: string;
      region?: string;
      capabilities: {
        sms: boolean;
        mms: boolean;
        voice: boolean;
      };
      price?: string;
    }>;
    total_found: number;
  }> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });

    return await apiRequest(`/api/signalwire/phone-numbers/search?${params}`, {
      method: 'GET',
    });
  }

  // ========== WEBHOOK MANAGEMENT ==========

  /**
   * Get current webhook configuration
   */
  static async getWebhookConfig(): Promise<{
    url: string;
    method: 'POST' | 'GET';
    events: string[];
    is_active: boolean;
    last_received?: string;
  }> {
    return await apiRequest('/api/signalwire/webhooks/config', {
      method: 'GET',
    });
  }

  /**
   * Update webhook configuration
   */
  static async updateWebhookConfig(config: {
    url?: string;
    method?: 'POST' | 'GET';
    events?: string[];
    is_active?: boolean;
  }): Promise<{ success: boolean; error?: string }> {
    return await apiRequest('/api/signalwire/webhooks/config', {
      method: 'PUT',
      body: JSON.stringify(config),
    });
  }

  /**
   * Test webhook connectivity
   */
  static async testWebhook(): Promise<WebhookTestResponse> {
    return await apiRequest('/api/signalwire/webhooks/test', {
      method: 'POST',
    });
  }

  // ========== STATUS & MONITORING ==========

  /**
   * Get comprehensive SignalWire status
   */
  static async getStatus(): Promise<SignalWireStatusResponse> {
    return await apiRequest('/api/signalwire/status', {
      method: 'GET',
    });
  }

  /**
   * Initialize SignalWire integration
   */
  static async initialize(): Promise<InitializeResponse> {
    return await apiRequest('/api/signalwire/initialize', {
      method: 'POST',
    });
  }

  /**
   * Get message analytics
   */
  static async getAnalytics(
    timeframe: '24h' | '7d' | '30d' | '90d' = '30d',
    profileId?: string
  ): Promise<AnalyticsResponse> {
    const params = new URLSearchParams({ timeframe });
    if (profileId) {
      params.append('profile_id', profileId);
    }

    return await apiRequest(`/api/signalwire/analytics?${params}`, {
      method: 'GET',
    });
  }

  /**
   * Get real-time dashboard data
   */
  static async getDashboardData(): Promise<{
    status: SignalWireStatusResponse;
    analytics: AnalyticsResponse;
    recent_messages: Array<{
      id: string;
      from: string;
      to: string;
      body: string;
      timestamp: string;
      status: string;
      direction: 'inbound' | 'outbound';
    }>;
    active_conversations: Array<{
      contact_number: string;
      profile_name: string;
      last_message: string;
      last_message_time: string;
      unread_count: number;
    }>;
  }> {
    return await apiRequest('/api/signalwire/dashboard', {
      method: 'GET',
    });
  }

  // ========== PROFILE INTEGRATION ==========

  /**
   * Sync profile with SignalWire phone number
   */
  static async syncProfileWithSignalWire(
    profileId: string, 
    phoneNumber: string
  ): Promise<{ success: boolean; error?: string }> {
    return await apiRequest(`/api/profiles/${profileId}/signalwire-sync`, {
      method: 'POST',
      body: JSON.stringify({ phone_number: phoneNumber }),
    });
  }

  /**
   * Get profile SignalWire configuration
   */
  static async getProfileSignalWireConfig(profileId: string): Promise<{
    phone_number?: string;
    webhook_configured: boolean;
    auto_response_enabled: boolean;
    message_count_24h: number;
    last_message_timestamp?: string;
    delivery_rate: number;
    total_conversations: number;
  }> {
    return await apiRequest(`/api/profiles/${profileId}/signalwire-config`, {
      method: 'GET',
    });
  }

  /**
   * Update profile SignalWire settings
   */
  static async updateProfileSignalWireSettings(
    profileId: string, 
    settings: {
      auto_response_enabled?: boolean;
      webhook_url?: string;
      rate_limit_per_day?: number;
      business_hours_only?: boolean;
    }
  ): Promise<{ success: boolean; error?: string }> {
    return await apiRequest(`/api/profiles/${profileId}/signalwire-settings`, {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  // ========== CONVERSATION MANAGEMENT ==========

  /**
   * Get all conversations for a profile
   */
  static async getProfileConversations(
    profileId: string,
    page: number = 1,
    limit: number = 20,
    status?: 'active' | 'archived'
  ): Promise<{
    conversations: Array<{
      id: string;
      contact_number: string;
      contact_name?: string;
      last_message: string;
      last_message_time: string;
      unread_count: number;
      status: 'active' | 'archived';
      message_count: number;
    }>;
    total: number;
    page: number;
    has_more: boolean;
  }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (status) {
      params.append('status', status);
    }

    return await apiRequest(`/api/profiles/${profileId}/conversations?${params}`, {
      method: 'GET',
    });
  }

  /**
   * Archive or unarchive a conversation
   */
  static async updateConversationStatus(
    conversationId: string,
    status: 'active' | 'archived'
  ): Promise<{ success: boolean; error?: string }> {
    return await apiRequest(`/api/conversations/${conversationId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  /**
   * Add notes to a conversation
   */
  static async addConversationNote(
    conversationId: string,
    note: string
  ): Promise<{ success: boolean; error?: string }> {
    return await apiRequest(`/api/conversations/${conversationId}/notes`, {
      method: 'POST',
      body: JSON.stringify({ note }),
    });
  }

  // ========== WEBHOOK LOGS ==========

  /**
   * Get recent webhook activity
   */
  static async getWebhookLogs(
    limit: number = 50,
    phone_number?: string,
    status?: 'success' | 'failed'
  ): Promise<{
    logs: Array<{
      id: string;
      timestamp: string;
      phone_number: string;
      event_type: string;
      payload: any;
      response_status: number;
      response_time_ms: number;
      error?: string;
    }>;
    total: number;
  }> {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (phone_number) {
      params.append('phone_number', phone_number);
    }
    if (status) {
      params.append('status', status);
    }

    return await apiRequest(`/api/signalwire/webhooks/logs?${params}`, {
      method: 'GET',
    });
  }

  // ========== UTILITY METHODS ==========

  /**
   * Validate phone number format
   */
  static async validatePhoneNumber(phoneNumber: string): Promise<{
    is_valid: boolean;
    formatted_number?: string;
    country_code?: string;
    number_type?: 'mobile' | 'landline' | 'voip' | 'unknown';
    carrier?: string;
    error?: string;
  }> {
    return await apiRequest('/api/signalwire/validate-phone-number', {
      method: 'POST',
      body: JSON.stringify({ phone_number: phoneNumber }),
    });
  }

  /**
   * Estimate SMS cost
   */
  static async estimateSMSCost(
    to: string,
    from: string,
    messageLength: number
  ): Promise<{
    estimated_cost: number;
    currency: string;
    segments: number;
    is_international: boolean;
  }> {
    return await apiRequest('/api/signalwire/estimate-cost', {
      method: 'POST',
      body: JSON.stringify({ to, from, message_length: messageLength }),
    });
  }
}

// Export individual methods for easier importing
export const signalWireAPI = SignalWireAPI;

// Individual method exports for tree-shaking
export const {
  sendSMS,
  sendBulkSMS,
  getMessageStatus,
  getPhoneNumbers,
  configurePhoneNumberWebhook,
  purchasePhoneNumber,
  getWebhookConfig,
  updateWebhookConfig,
  testWebhook,
  getStatus,
  initialize,
  getAnalytics,
  getDashboardData,
  syncProfileWithSignalWire,
  getProfileSignalWireConfig,
  getProfileConversations,
} = SignalWireAPI;

export default SignalWireAPI;