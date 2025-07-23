// src/types/client.ts
/**
 * Type definitions for client management system
 */

export interface Client {
  id: string;
  phone_number: string;
  name?: string;
  email?: string;
  notes?: string | ClientNote[];
  tags: string[];
  is_blocked: boolean;
  is_flagged: boolean;
  is_regular: boolean;
  is_vip: boolean;
  block_reason?: string;
  block_until?: string;
  flag_reason?: string;
  created_at: string;
  updated_at: string;
  last_contact: string;
  total_messages: number;
  unread_messages: number
  contacted_profiles?: {
    id: string;
    name: string;
    last_message_at: string;
    message_count: number;
  }[];
  // Analytics
  first_message_date?: string;
  avg_response_time?: number;
  total_spent?: number;
  lifetime_value?: number;
  // Location data (if available)
  city?: string;
  state?: string;
  country?: string;
  timezone?: string;
}

export interface ClientFilters {
  search?: string;
  status?: 'all' | 'active' | 'blocked' | 'flagged' | 'regular' | 'vip' | 'new';
  user_id?: string; // Filter by user who owns the client
  flagged_only?: boolean;
  blocked_only?: boolean;
  regular_only?: boolean;
  vip_only?: boolean;
  date_from?: string;
  date_to?: string;
  tags?: string[];
  min_messages?: number;
  max_messages?: number;
  has_email?: boolean;
  has_name?: boolean;
  location?: string;
  sort_by?: 'name' | 'phone' | 'last_contact' | 'message_count' | 'created_at';
  sort_order?: 'asc' | 'desc';
}

export interface ClientSearchResult {
  clients: Client[];
  search_query: string;
  pagination: {
    page: number;
    per_page: number;
    total: number;
    pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
  // Search metadata
  search_time_ms?: number;
  suggestions?: string[];
  filters_applied?: ClientFilters;
}

export interface ClientStats {
  total_clients: number;
  active_clients: number;
  blocked_clients: number;
  flagged_clients: number;
  regular_clients: number;
  vip_clients: number;
  new_clients_today: number;
  new_clients_week: number;
  new_clients_month: number;
  // Message statistics
  total_messages: number;
  avg_messages_per_client: number;
  most_active_client: Client | null;
  // Time-based analytics
  peak_contact_hours: number[];
  busiest_days: string[];
  // Geography (if available)
  top_locations: {
    location: string;
    count: number;
  }[];
  // Revenue (if tracked)
  total_revenue?: number;
  avg_revenue_per_client?: number;
}

// Generic API response wrapper
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
  metadata?: {
    timestamp: string;
    request_id: string;
    api_version: string;
  };
}

// Paginated response wrapper
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
  success: boolean;
  message?: string;
  filters_applied?: any;
  metadata?: {
    timestamp: string;
    request_id: string;
    total_time_ms: number;
  };
}

// Client activity/timeline event
export interface ClientActivity {
  id: string;
  client_id: string;
  type: 'message_sent' | 'message_received' | 'blocked' | 'unblocked' | 
        'flagged' | 'unflagged' | 'marked_regular' | 'marked_vip' | 
        'tag_added' | 'tag_removed' | 'note_added' | 'profile_contacted';
  description: string;
  data?: any; // Additional event-specific data
  profile_id?: string;
  created_at: string;
  metadata?: {
    user_agent?: string;
    ip_address?: string;
    location?: string;
  };
}

// Client conversation summary
export interface ClientConversation {
  id: string;
  client_id: string;
  user_id: string; // User who owns the conversation
  last_message_at: string;
  message_count: number;
  unread_count: number;
  last_message_content: string;
  last_message_is_incoming: boolean;
  is_ai_enabled: boolean;
  conversation_status: 'active' | 'archived' | 'blocked';
  tags: string[];
  notes?: string;
}

// Client notes
export interface ClientNote {
  id: string;
  client_id: string;
  content: string;
  created_at: string;
  created_by: string; // User ID who created the note
  is_private: boolean;
  tags?: string[];
}

// Client tag
export interface ClientTag {
  id: string;
  name: string;
  color: string;
  description?: string;
  is_system: boolean; // System tags vs user-created tags
  usage_count: number;
  created_at: string;
}

// Bulk operation result
export interface BulkOperationResult {
  total_requested: number;
  successful: number;
  failed: number;
  errors: Array<{
    client_id: string;
    error: string;
  }>;
  results: Array<{
    client_id: string;
    status: 'success' | 'error';
    data?: Client;
    error?: string;
  }>;
}

// Client export options
export interface ClientExportOptions {
  format: 'csv' | 'xlsx' | 'json';
  fields?: string[]; // Specific fields to export
  filters?: ClientFilters;
  include_conversations?: boolean;
  include_notes?: boolean;
  date_format?: string;
  timezone?: string;
}

// Client import data
export interface ClientImportData {
  phone_number: string;
  name?: string;
  email?: string;
  tags?: string[];
  notes?: string;
  is_regular?: boolean;
  is_vip?: boolean;
}

// Client import result
export interface ClientImportResult {
  total_processed: number;
  successful_imports: number;
  failed_imports: number;
  duplicates_found: number;
  errors: Array<{
    row: number;
    phone_number?: string;
    error: string;
  }>;
  imported_clients: Client[];
}

// Client analytics time series data
export interface ClientAnalyticsTimeSeries {
  date: string;
  new_clients: number;
  active_clients: number;
  total_messages: number;
  blocked_clients: number;
  flagged_clients: number;
}

// Client segment (for marketing/analysis)
export interface ClientSegment {
  id: string;
  name: string;
  description: string;
  criteria: ClientFilters;
  client_count: number;
  created_at: string;
  updated_at: string;
  is_dynamic: boolean; // Updates automatically vs static snapshot
}

// Client communication preferences
export interface ClientPreferences {
  client_id: string;
  preferred_contact_time?: {
    start_hour: number;
    end_hour: number;
    timezone: string;
  };
  communication_frequency?: 'high' | 'medium' | 'low';
  topics_of_interest?: string[];
  language_preference?: string;
  marketing_opt_in: boolean;
  sms_opt_in: boolean;
  email_opt_in: boolean;
  do_not_contact: boolean;
  do_not_contact_reason?: string;
}

// Enhanced client profile with all data
export interface ClientProfile extends Client {
  conversations: ClientConversation[];
  notes: ClientNote[];
  activity_timeline: ClientActivity[];
  preferences: ClientPreferences;
  analytics: {
    message_frequency: ClientAnalyticsTimeSeries[];
    response_patterns: any;
    engagement_score: number;
    lifetime_stats: ClientStats;
  };
}

// Client list view configuration
export interface ClientListConfig {
  columns: Array<{
    key: keyof Client;
    label: string;
    sortable: boolean;
    width?: number;
    visible: boolean;
  }>;
  filters: ClientFilters;
  sort: {
    field: keyof Client;
    direction: 'asc' | 'desc';
  };
  view_mode: 'table' | 'cards' | 'compact';
  page_size: number;
}

// WebSocket events for real-time updates
export interface ClientWebSocketEvent {
  type: 'client_created' | 'client_updated' | 'client_deleted' | 
        'client_blocked' | 'client_unblocked' | 'client_flagged' | 
        'client_unflagged' | 'client_message_sent' | 'client_message_received';
  client_id: string;
  client?: Client;
  profile_id?: string;
  timestamp: string;
  user_id: string;
}

