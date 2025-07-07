export const APP_CONFIG = {
  name: 'AssisText',
  description: 'AI-Powered SMS Response Platform',
  version: '2.0.0',
  author: 'AssisText Team',
} as const;

// UPDATED API ENDPOINTS - NO MORE PROFILES!
export const API_ENDPOINTS = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    refresh: '/api/auth/refresh-token',
    me: '/api/auth/me',
    logout: '/api/auth/logout',
  },
  
  // USER PROFILE ENDPOINTS (replaces profiles)
  user: {
    profile: '/api/user/profile',
    aiSettings: '/api/user/ai-settings',
    autoReplySettings: '/api/user/auto-reply-settings',
    businessHours: '/api/user/business-hours',
    securitySettings: '/api/user/security-settings',
    signalwireSettings: '/api/user/signalwire-settings',
    dashboard: '/api/user/dashboard',
    changePassword: '/api/user/change-password',
    deactivate: '/api/user/deactivate',
  },
  
  // CLIENT ENDPOINTS (now user-based)
  clients: {
    list: '/api/clients',
    get: (id: string) => `/api/clients/${id}`,
    create: '/api/clients',
    update: (id: string) => `/api/clients/${id}`,
    delete: (id: string) => `/api/clients/${id}`,
    block: (id: string) => `/api/clients/${id}/block`,
    unblock: (id: string) => `/api/clients/${id}/unblock`,
    flag: (id: string) => `/api/clients/${id}/flag`,
    unflag: (id: string) => `/api/clients/${id}/unflag`,
    stats: '/api/clients/stats',
    bulk: '/api/clients/bulk',
  },
  
  // MESSAGE ENDPOINTS (now user-based)
  messages: {
    list: '/api/messages',
    get: (id: string) => `/api/messages/${id}`,
    send: '/api/messages',
    conversations: '/api/messages/conversations',
    conversation: (phoneNumber: string) => `/api/messages/conversations/${phoneNumber}`,
    markRead: (id: string) => `/api/messages/${id}/read`,
    flag: (id: string) => `/api/messages/${id}/flag`,
    unflag: (id: string) => `/api/messages/${id}/unflag`,
    templates: '/api/messages/templates',
    stats: '/api/messages/stats',
  },
  
  // WEBHOOK ENDPOINTS
  webhooks: {
    signalwire: '/api/webhooks/signalwire',
    twilio: '/api/webhooks/twilio',
  },
  
  // OPTIONAL ENDPOINTS
  billing: {
    subscription: '/api/billing/subscription',
    plans: '/api/billing/plans',
    usage: '/api/billing/usage',
    invoices: '/api/billing/invoices',
  },
  
  analytics: {
    dashboard: '/api/analytics/dashboard',
    messages: '/api/analytics/messages',
    clients: '/api/analytics/clients',
  },
} as const;

// UPDATED QUERY KEYS - NO MORE PROFILES!
export const QUERY_KEYS = {
  // User-related queries
  user: ['user'],
  userProfile: ['user', 'profile'],
  userDashboard: ['user', 'dashboard'],
  
  // Settings queries
  aiSettings: ['user', 'ai-settings'],
  autoReplySettings: ['user', 'auto-reply-settings'],
  businessHours: ['user', 'business-hours'],
  securitySettings: ['user', 'security-settings'],
  signalwireSettings: ['user', 'signalwire-settings'],
  
  // Client queries (no more profile dependency)
  clients: ['clients'],
  client: (id: string) => ['clients', id],
  clientStats: ['clients', 'stats'],
  
  // Message queries (no more profile dependency)
  messages: ['messages'],
  message: (id: string) => ['messages', id],
  conversations: ['messages', 'conversations'],
  conversation: (phoneNumber: string) => ['messages', 'conversations', phoneNumber],
  messageTemplates: ['messages', 'templates'],
  messageStats: ['messages', 'stats'],
  
  // Analytics queries
  analytics: (type: string) => ['analytics', type],
} as const;

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export const ANIMATION_DURATION = {
  fast: 150,
  normal: 200,
  slow: 300,
  slower: 500,
} as const;

export const Z_INDEX = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modal: 1040,
  popover: 1050,
  tooltip: 1060,
} as const;

// STATUS OPTIONS
export const CLIENT_STATUSES = [
  { value: 'new', label: 'New' },
  { value: 'regular', label: 'Regular' },
  { value: 'vip', label: 'VIP' },
  { value: 'blocked', label: 'Blocked' },
] as const;

export const RISK_LEVELS = [
  { value: 'low', label: 'Low Risk', color: 'green' },
  { value: 'medium', label: 'Medium Risk', color: 'yellow' },
  { value: 'high', label: 'High Risk', color: 'orange' },
  { value: 'critical', label: 'Critical Risk', color: 'red' },
] as const;

export const AI_RESPONSE_STYLES = [
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'custom', label: 'Custom' },
] as const;

export const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
] as const;

export const TIMEZONES = [
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'Eastern Time' },
  { value: 'America/Chicago', label: 'Central Time' },
  { value: 'America/Denver', label: 'Mountain Time' },
  { value: 'America/Los_Angeles', label: 'Pacific Time' },
  { value: 'America/Toronto', label: 'Toronto' },
  { value: 'America/Vancouver', label: 'Vancouver' },
] as const;

export const BUSINESS_DAYS = [
  { value: '1', label: 'Monday' },
  { value: '2', label: 'Tuesday' },
  { value: '3', label: 'Wednesday' },
  { value: '4', label: 'Thursday' },
  { value: '5', label: 'Friday' },
  { value: '6', label: 'Saturday' },
  { value: '7', label: 'Sunday' },
] as const;

export const MESSAGE_TEMPLATE_CATEGORIES = [
  { value: 'greeting', label: 'Greetings' },
  { value: 'booking', label: 'Booking' },
  { value: 'pricing', label: 'Pricing' },
  { value: 'availability', label: 'Availability' },
  { value: 'location', label: 'Location' },
  { value: 'policies', label: 'Policies' },
  { value: 'other', label: 'Other' },
] as const;