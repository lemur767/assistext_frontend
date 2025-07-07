// =============================================================================
// CORE USER TYPES (replaces Profile types)
// =============================================================================

export interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  display_name?: string;
  personal_phone?: string;
  timezone: string;
  
  // SignalWire Integration
  signalwire_phone_number?: string;
  signalwire_configured: boolean;
  signalwire_project_id?: string;
  signalwire_space_url?: string;
  
  // AI Settings
  ai_enabled: boolean;
  ai_personality: string;
  ai_response_style: 'professional' | 'casual' | 'custom';
  ai_language: string;
  use_emojis: boolean;
  casual_language: boolean;
  custom_instructions?: string;
  
  // Auto Reply Settings
  auto_reply_enabled: boolean;
  custom_greeting?: string;
  out_of_office_enabled: boolean;
  out_of_office_message?: string;
  out_of_office_start?: string;
  out_of_office_end?: string;
  
  // Business Hours
  business_hours_enabled: boolean;
  business_hours_start?: string;
  business_hours_end?: string;
  business_days: string;
  after_hours_message?: string;
  
  // Security Settings
  enable_flagged_word_detection: boolean;
  custom_flagged_words?: string;
  auto_block_suspicious: boolean;
  require_manual_review: boolean;
  
  // Account Status
  is_active: boolean;
  is_verified: boolean;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  last_login?: string;
}

// =============================================================================
// SETTINGS INTERFACES
// =============================================================================

export interface AISettings {
  ai_enabled: boolean;
  ai_personality: string;
  ai_response_style: 'professional' | 'casual' | 'custom';
  ai_language: string;
  use_emojis: boolean;
  casual_language: boolean;
  custom_instructions?: string;
}

export interface AutoReplySettings {
  auto_reply_enabled: boolean;
  custom_greeting?: string;
  out_of_office_enabled: boolean;
  out_of_office_message?: string;
  out_of_office_start?: string;
  out_of_office_end?: string;
}

export interface BusinessHoursSettings {
  business_hours_enabled: boolean;
  business_hours_start?: string;
  business_hours_end?: string;
  business_days: string;
  after_hours_message?: string;
  is_business_hours?: boolean;
}

export interface SecuritySettings {
  enable_flagged_word_detection: boolean;
  custom_flagged_words?: string;
  auto_block_suspicious: boolean;
  require_manual_review: boolean;
  flagged_words_list?: string[];
}

export interface SignalWireSettings {
  signalwire_phone_number?: string;
  signalwire_configured: boolean;
  signalwire_project_id?: string;
  signalwire_space_url?: string;
}

// =============================================================================
// CLIENT TYPES (updated)
// =============================================================================

export interface Client {
  id: string;
  user_id: string;
  phone_number: string;
  name?: string;
  nickname?: string;
  email?: string;
  display_name: string;
  notes?: string;
  tags: string[];
  
  // Location
  city?: string;
  state?: string;
  country?: string;
  timezone?: string;
  
  // Relationship Management
  relationship_status: 'new' | 'regular' | 'vip' | 'blocked';
  priority_level: number;
  client_type?: string;
  
  // Interaction Tracking
  first_contact: string;
  last_interaction: string;
  total_interactions: number;
  total_messages_received: number;
  total_messages_sent: number;
  
  // Client-Specific Settings
  custom_ai_personality?: string;
  custom_greeting?: string;
  auto_reply_enabled: boolean;
  ai_response_style?: string;
  
  // Status and Flags
  is_blocked: boolean;
  block_reason?: string;
  blocked_at?: string;
  is_favorite: boolean;
  is_flagged: boolean;
  flag_reasons?: string[];
  
  // Risk Assessment
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  trust_score: number;
  verified_client: boolean;
  
  // Engagement Metrics
  avg_response_time?: number;
  last_message_sentiment?: number;
  engagement_score: number;
  
  // Preferences
  preferred_contact_time?: string;
  communication_style?: string;
  language_preference: string;
  emoji_preference: boolean;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  
  // Optional stats (when include_stats=true)
  conversation_stats?: {
    total_messages: number;
    incoming_messages: number;
    outgoing_messages: number;
    ai_generated_responses: number;
    flagged_messages: number;
  };
  is_recent_contact?: boolean;
}

// =============================================================================
// MESSAGE TYPES (updated)
// =============================================================================

export interface Message {
  id: string;
  content: string;
  is_incoming: boolean;
  sender_number: string;
  recipient_number: string;
  user_id: string;
  ai_generated: boolean;
  is_read: boolean;
  is_flagged: boolean;
  processing_status: 'pending' | 'delivered' | 'failed' | 'queued';
  timestamp: string;
  sent_at?: string;
  delivered_at?: string;
  read_at?: string;
  time_since: string;
  conversation_partner: string;
  
  // Optional flag data
  flag_reasons?: string[];
  
  // Optional analysis data (when include_analysis=true)
  ai_confidence?: number;
  ai_model_used?: string;
  sentiment_score?: number;
  intent_classification?: string;
  confidence_score?: number;
  retry_count?: number;
  error_message?: string;
}

export interface MessageTemplate {
  id: string;
  name: string;
  content: string;
  category?: string;
  description?: string;
  usage_count: number;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface Conversation {
  phone_number: string;
  client?: Client;
  latest_message: Message;
  unread_count: number;
  total_messages: number;
  display_name: string;
}

// =============================================================================
// DASHBOARD AND ANALYTICS TYPES
// =============================================================================

export interface DashboardData {
  user: User;
  stats: {
    total_messages: number;
    messages_today: number;
    messages_this_week: number;
    total_clients: number;
    new_clients_this_week: number;
    ai_messages: number;
    ai_usage_percentage: number;
    unread_messages: number;
  };
  status: {
    ai_enabled: boolean;
    auto_reply_enabled: boolean;
    signalwire_configured: boolean;
    out_of_office: boolean;
    business_hours: boolean;
  };
}

export interface DashboardStats {
  totalMessages: number;
  messageChange: number;
  aiResponses: number;
  aiResponseChange: number;
  aiResponseRate: number;
  activeClients: number;
  clientChange: number;
  avgResponseTime: number;
  responseTimeChange: number;
}

export interface Activity {
  id: string;
  type: 'ai_response' | 'flagged_message' | 'new_client' | 'user_update';
  title: string;
  description: string;
  timestamp: string;
  clientId?: string;
}

export interface Insight {
  id: string;
  type: 'performance' | 'optimization' | 'warning' | 'success';
  title: string;
  description: string;
  action?: string;
  priority: 'low' | 'medium' | 'high';
}

// =============================================================================
// FORM TYPES (updated)
// =============================================================================

export interface UserRegistrationForm {
  username: string;
  email: string;
  password: string;
  confirm_password: string;
  first_name: string;
  last_name: string;
  personal_phone?: string;
}

export interface UserProfileForm {
  first_name: string;
  last_name: string;
  display_name?: string;
  personal_phone?: string;
  timezone: string;
}

export interface ClientCreateForm {
  phone_number: string;
  name?: string;
  nickname?: string;
  email?: string;
  notes?: string;
  tags?: string[];
  relationship_status?: 'new' | 'regular' | 'vip' | 'blocked';
  priority_level?: number;
}

export interface ClientUpdateForm extends Partial<ClientCreateForm> {
  id: string;
  is_favorite?: boolean;
  custom_ai_personality?: string;
  custom_greeting?: string;
  auto_reply_enabled?: boolean;
}

export interface MessageSendForm {
  recipient_number: string;
  content: string;
  ai_generated?: boolean;
}

export interface MessageTemplateForm {
  name: string;
  content: string;
  category?: string;
  description?: string;
}

// =============================================================================
// API RESPONSE TYPES
// =============================================================================

export interface ApiResponse<T> {
  data: T;
  success?: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items?: T[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export interface ErrorResponse {
  error: string;
  details?: Record<string, string[]>;
  code?: string;
}

// =============================================================================
// FILTER AND SEARCH TYPES
// =============================================================================

export interface ClientFilters {
  search?: string;
  status?: 'new' | 'regular' | 'vip' | 'blocked';
  flagged_only?: boolean;
  favorites_only?: boolean;
  risk_level?: 'low' | 'medium' | 'high' | 'critical';
  tags?: string;
  sort_by?: 'name' | 'last_interaction' | 'created_at' | 'total_interactions';
  sort_order?: 'asc' | 'desc';
}

export interface MessageFilters {
  search?: string;
  client_phone?: string;
  is_incoming?: boolean;
  ai_generated?: boolean;
  is_flagged?: boolean;
  is_read?: boolean;
  date_from?: string;
  date_to?: string;
  sort_by?: 'timestamp' | 'content';
  sort_order?: 'asc' | 'desc';
}

export interface ConversationFilters {
  search?: string;
  unread_only?: boolean;
}

// =============================================================================
// COMPONENT PROP TYPES
// =============================================================================

export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface LoadingProps extends BaseComponentProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export interface ErrorProps extends BaseComponentProps {
  message: string;
  retry?: () => void;
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// =============================================================================
// HOOK TYPES
// =============================================================================

export interface UseWebSocketReturn {
  socket: any;
  isConnected: boolean;
  messages: Message[];
  sendMessage: (message: any) => void;
}

export interface UseQueryOptions {
  enabled?: boolean;
  refetchInterval?: number;
  refetchOnWindowFocus?: boolean;
  staleTime?: number;
  cacheTime?: number;
}

export interface UseMutationOptions<TData, TError, TVariables> {
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: TError, variables: TVariables) => void;
  onSettled?: (data: TData | undefined, error: TError | null, variables: TVariables) => void;
}

// =============================================================================
// STATISTICS TYPES
// =============================================================================

export interface ClientStats {
  total_clients: number;
  new_clients_last_30_days: number;
  recent_interactions: number;
  status_breakdown: Record<string, number>;
  risk_level_breakdown: Record<string, number>;
  top_clients: Client[];
  period_days: number;
}

export interface MessageStats {
  total_messages: number;
  recent_messages: number;
  incoming_messages: number;
  outgoing_messages: number;
  ai_generated_messages: number;
  flagged_messages: number;
  unread_messages: number;
  ai_usage_percentage: number;
  daily_stats: Array<{
    date: string;
    message_count: number;
  }>;
  period_days: number;
}

// =============================================================================
// NAVIGATION AND ROUTING TYPES
// =============================================================================

export interface NavItem {
  label: string;
  href: string;
  icon?: React.ComponentType;
  badge?: number;
  children?: NavItem[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

// =============================================================================
// THEME AND UI TYPES
// =============================================================================

export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  spacing: Record<string, string>;
  breakpoints: Record<string, string>;
}

export interface NotificationConfig {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  persistent?: boolean;
}

// =============================================================================
// EXPORT ALL TYPES
// =============================================================================

export type {
  // Re-export common types for convenience
  User as Profile, // For backward compatibility during migration
};

// =============================================================================
// UTILITY TYPES
// =============================================================================

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// =============================================================================
// CONSTANTS AS TYPES
// =============================================================================

export type ClientStatus = 'new' | 'regular' | 'vip' | 'blocked';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type AIResponseStyle = 'professional' | 'casual' | 'custom';
export type MessageProcessingStatus = 'pending' | 'delivered' | 'failed' | 'queued';
export type SortOrder = 'asc' | 'desc';
export type NotificationType = 'success' | 'error' | 'warning' | 'info';
export type PriorityLevel = 1 | 2 | 3 | 4 | 5;

// =============================================================================
// FEATURE FLAGS
// =============================================================================

export interface FeatureFlags {
  enableBilling: boolean;
  enableAnalytics: boolean;
  enableWebhooks: boolean;
  enableExport: boolean;
  enableBulkOperations: boolean;
}

// =============================================================================
// ENVIRONMENT CONFIG
// =============================================================================

export interface EnvironmentConfig {
  apiUrl: string;
  wsUrl: string;
  version: string;
  environment: 'development' | 'staging' | 'production';
  features: FeatureFlags;
}