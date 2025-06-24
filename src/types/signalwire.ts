// src/types/signalwire.ts - Complete TypeScript types for SignalWire integration

export interface SignalWireConfig {
  project_id: string;
  api_token: string;
  space_url: string;
  base_url: string;
}

export interface SMSMessage {
  id?: string;
  message_sid?: string;
  to: string;
  from: string;
  body: string;
  status?: MessageStatus;
  direction?: 'inbound' | 'outbound';
  timestamp?: string;
  date_created?: string;
  date_sent?: string;
  date_updated?: string;
  error_code?: number;
  error_message?: string;
  price?: string;
  price_unit?: string;
  uri?: string;
  account_sid?: string;
  num_segments?: number;
  num_media?: number;
  media_urls?: string[];
}

export type MessageStatus = 
  | 'queued'
  | 'sending'
  | 'sent'
  | 'delivered'
  | 'undelivered'
  | 'failed'
  | 'received'
  | 'accepted'
  | 'scheduled'
  | 'canceled'
  | 'unknown';

export interface SignalWirePhoneNumber {
  sid?: string;
  account_sid?: string;
  phone_number: string;
  friendly_name?: string;
  capabilities: PhoneNumberCapabilities;
  status?: 'in-use' | 'available';
  sms_url?: string;
  sms_method?: 'GET' | 'POST';
  sms_fallback_url?: string;
  sms_fallback_method?: 'GET' | 'POST';
  voice_url?: string;
  voice_method?: 'GET' | 'POST';
  voice_fallback_url?: string;
  voice_fallback_method?: 'GET' | 'POST';
  status_callback?: string;
  status_callback_method?: 'GET' | 'POST';
  voice_caller_id_lookup?: boolean;
  date_created?: string;
  date_updated?: string;
  is_configured?: boolean;
  webhook_configured?: boolean;
}

export interface PhoneNumberCapabilities {
  voice: boolean;
  sms: boolean;
  mms: boolean;
  fax?: boolean;
}

export interface WebhookConfig {
  url: string;
  method: 'POST' | 'GET';
  events: WebhookEvent[];
  is_active: boolean;
  auth_token?: string;
  retry_attempts?: number;
  timeout?: number;
  headers?: Record<string, string>;
}

export type WebhookEvent = 
  | 'message.received'
  | 'message.sent'
  | 'message.delivered'
  | 'message.failed'
  | 'call.initiated'
  | 'call.answered'
  | 'call.ended'
  | 'number.updated';

export interface WebhookPayload {
  MessageSid: string;
  AccountSid: string;
  From: string;
  To: string;
  Body: string;
  MessageStatus: MessageStatus;
  NumMedia?: string;
  MediaContentType0?: string;
  MediaUrl0?: string;
  SmsSid?: string;
  SmsStatus?: string;
  NumSegments?: string;
  ReferralNumMedia?: string;
  ReferralSid?: string;
  ApiVersion?: string;
  SpaceUrl?: string;
}

export interface SignalWireStatus {
  status: ConnectionStatus;
  space_url: string;
  project_id: string;
  phone_numbers_count: number;
  webhooks_configured: number;
  last_webhook_received?: string;
  last_message_sent?: string;
  connection_test_timestamp?: string;
  account_info?: AccountInfo;
  error?: string;
  health_check?: {
    api_accessible: boolean;
    webhooks_responsive: boolean;
    phone_numbers_active: boolean;
    last_check: string;
  };
}

export type ConnectionStatus = 
  | 'connected' 
  | 'disconnected' 
  | 'error' 
  | 'connecting'
  | 'testing'
  | 'degraded';

export interface AccountInfo {
  sid?: string;
  friendly_name: string;
  status: 'active' | 'suspended' | 'closed';
  type?: 'Trial' | 'Full';
  date_created?: string;
  date_updated?: string;
  auth_token?: string;
  owner_account_sid?: string;
  uri?: string;
}

export interface MessageAnalytics {
  total_sent: number;
  total_received: number;
  total_failed: number;
  delivery_rate: number;
  failed_messages: number;
  average_response_time?: number;
  peak_hours?: Array<{
    hour: number;
    message_count: number;
  }>;
  last_24h: {
    sent: number;
    received: number;
    failed: number;
    delivery_rate: number;
  };
  last_7d: {
    sent: number;
    received: number;
    failed: number;
    delivery_rate: number;
  };
  by_profile: ProfileAnalytics[];
  by_status: Record<MessageStatus, number>;
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

export interface ProfileAnalytics {
  profile_id: string;
  profile_name: string;
  phone_number?: string;
  sent: number;
  received: number;
  failed: number;
  delivery_rate: number;
  avg_response_time?: number;
  most_active_hours?: number[];
  conversation_count?: number;
  unique_contacts?: number;
}

export interface BulkSMSRequest {
  messages: Array<Omit<SMSMessage, 'id' | 'status' | 'timestamp'>>;
  batch_name?: string;
  schedule_time?: string;
  callback_url?: string;
}

export interface BulkSMSResponse {
  batch_id: string;
  total_messages: number;
  successful: SMSMessage[];
  failed: Array<{
    message: Omit<SMSMessage, 'id' | 'status' | 'timestamp'>;
    error: string;
    error_code?: number;
  }>;
  status: 'completed' | 'partial' | 'failed';
  cost_estimate?: {
    total_cost: number;
    currency: string;
  };
}

export interface AvailablePhoneNumber {
  phone_number: string;
  friendly_name?: string;
  locality?: string;
  region?: string;
  postal_code?: string;
  iso_country: string;
  address_requirements?: 'none' | 'any' | 'local' | 'foreign';
  beta?: boolean;
  capabilities: PhoneNumberCapabilities;
  price?: string;
  price_unit?: string;
}

export interface PhoneNumberSearchFilters {
  area_code?: string;
  contains?: string;
  country?: string;
  distance?: number;
  in_locality?: string;
  in_postal_code?: string;
  in_region?: string;
  near_lat_long?: string;
  near_number?: string;
  sms_enabled?: boolean;
  mms_enabled?: boolean;
  voice_enabled?: boolean;
  limit?: number;
}

export interface SignalWireError {
  code: number;
  message: string;
  more_info?: string;
  status: number;
  details?: Record<string, any>;
}

export interface MessageTemplateVariable {
  name: string;
  type: 'text' | 'number' | 'date' | 'datetime' | 'currency';
  required: boolean;
  default_value?: string;
  validation_pattern?: string;
  description?: string;
}

export interface MessageTemplate {
  id: string;
  name: string;
  content: string;
  variables: MessageTemplateVariable[];
  category: 'marketing' | 'notification' | 'verification' | 'support';
  language: string;
  status: 'active' | 'inactive' | 'pending_approval';
  created_at: string;
  updated_at: string;
  usage_count?: number;
  approval_status?: 'approved' | 'rejected' | 'pending';
}

export interface ConversationThread {
  id: string;
  contact_number: string;
  profile_id: string;
  messages: SMSMessage[];
  status: 'active' | 'closed' | 'archived';
  created_at: string;
  updated_at: string;
  last_message_at: string;
  unread_count: number;
  tags?: string[];
  notes?: string;
  contact_info?: {
    name?: string;
    email?: string;
    company?: string;
    custom_fields?: Record<string, any>;
  };
}

export interface SignalWireIntegrationSettings {
  auto_response_enabled: boolean;
  default_response_template?: string;
  business_hours?: {
    enabled: boolean;
    timezone: string;
    schedule: Array<{
      day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
      start_time: string; // HH:MM format
      end_time: string;   // HH:MM format
    }>;
  };
  rate_limiting?: {
    enabled: boolean;
    max_messages_per_minute: number;
    max_messages_per_hour: number;
    max_messages_per_day: number;
  };
  spam_protection?: {
    enabled: boolean;
    block_keywords: string[];
    allow_list: string[];
    block_list: string[];
  };
  compliance?: {
    opt_out_keywords: string[];
    opt_in_required: boolean;
    double_opt_in: boolean;
    consent_tracking: boolean;
  };
}

// API Response wrapper types
export interface SignalWireAPIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  error_code?: number;
  timestamp: string;
  request_id?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

// Hook return types
export interface UseSignalWireReturn {
  status: SignalWireStatus | null;
  statusLoading: boolean;
  statusError: Error | null;
  refetchStatus: () => void;
  initializeSignalWire: () => void;
  isInitializing: boolean;
  testWebhook: () => void;
  isTestingWebhook: boolean;
}

export interface UseSMSReturn {
  sendSMS: (message: Omit<SMSMessage, 'id' | 'status' | 'timestamp'>) => void;
  sendSMSAsync: (message: Omit<SMSMessage, 'id' | 'status' | 'timestamp'>) => Promise<SMSMessage>;
  isSending: boolean;
  sendBulkSMS: (messages: Omit<SMSMessage, 'id' | 'status' | 'timestamp'>[]) => void;
  sendBulkSMSAsync: (messages: Omit<SMSMessage, 'id' | 'status' | 'timestamp'>[]) => Promise<BulkSMSResponse>;
  isSendingBulk: boolean;
  getMessageStatus: (messageSid: string) => Promise<any>;
}

export interface UseSignalWirePhoneNumbersReturn {
  phoneNumbers: SignalWirePhoneNumber[] | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  configureWebhook: (params: { phoneNumber: string; webhookUrl: string }) => void;
  isConfiguringWebhook: boolean;
  purchasePhoneNumber: (params: { areaCode?: string; country?: string }) => void;
  isPurchasing: boolean;
}

// Event types for real-time updates
export interface SignalWireEvent {
  type: 'message_received' | 'message_sent' | 'message_delivered' | 'message_failed' | 'webhook_received';
  timestamp: string;
  data: any;
  profile_id?: string;
  message_sid?: string;
}

// Configuration types for initialization
export interface SignalWireInitConfig {
  project_id: string;
  api_token: string;
  space_url: string;
  webhook_base_url: string;
  phone_numbers?: string[];
  auto_configure_webhooks?: boolean;
  default_webhook_events?: WebhookEvent[];
}

export default {
  SMSMessage,
  SignalWirePhoneNumber,
  WebhookConfig,
  SignalWireStatus,
  MessageAnalytics,
  ProfileAnalytics,
  BulkSMSRequest,
  BulkSMSResponse,
  ConversationThread,
  SignalWireIntegrationSettings,
  SignalWireAPIResponse,
};