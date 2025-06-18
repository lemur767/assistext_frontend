export const APP_CONFIG = {
  name: 'AssisText',
  description: 'AI-Powered SMS Response Platform',
  version: '1.0.0',
  author: 'AssisText Team',
} as const;

export const API_ENDPOINTS = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    refresh: '/api/auth/refresh-token',
    me: '/api/auth/me',
  },
  profiles: {
    list: '/api/profiles',
    create: '/api/profiles',
    get: (id: string) => `/api/profiles/${id}`,
    update: (id: string) => `/api/profiles/${id}`,
    delete: (id: string) => `/api/profiles/${id}`,
    toggleAI: (id: string) => `/api/profiles/${id}/toggle_ai`,
  },
  messages: {
    list: '/api/messages',
    send: '/api/messages',
    conversations: (profileId: string) => `/api/profiles/${profileId}/conversations`,
    conversation: (id: string) => `/api/conversations/${id}`,
    markRead: (id: string) => `/api/conversations/${id}/mark-read`,
  },
  clients: {
    list: (profileId: string) => `/api/profiles/${profileId}/clients`,
    get: (id: string) => `/api/clients/${id}`,
    update: (id: string) => `/api/clients/${id}`,
    block: (id: string) => `/api/clients/${id}/block`,
  },
  ai: {
    settings: (profileId: string) => `/api/profiles/${profileId}/ai-settings`,
    examples: (profileId: string) => `/api/profiles/${profileId}/text-examples`,
    bulkImport: (profileId: string) => `/api/profiles/${profileId}/bulk-import`,
  },
  analytics: {
    dashboard: (profileId: string) => `/api/analytics/dashboard/${profileId}`,
    messages: (profileId: string) => `/api/analytics/messages/${profileId}`,
    clients: (profileId: string) => `/api/analytics/clients/${profileId}`,
  },
} as const;

export const QUERY_KEYS = {
  user: ['user'],
  profiles: ['profiles'],
  profile: (id: string) => ['profile', id],
  conversations: (profileId: string) => ['conversations', profileId],
  conversation: (id: string) => ['conversation', id],
  clients: (profileId: string) => ['clients', profileId],
  client: (id: string) => ['client', id],
  aiSettings: (profileId: string) => ['aiSettings', profileId],
  dashboard: (profileId: string) => ['dashboard', profileId],
  analytics: (profileId: string, type: string) => ['analytics', profileId, type],
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