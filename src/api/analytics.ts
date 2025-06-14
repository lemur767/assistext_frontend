const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://backend.assitext.ca';

const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const tokens = localStorage.getItem('auth_tokens');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };
  
  if (tokens) {
    const { access_token } = JSON.parse(tokens);
    headers.Authorization = `Bearer ${access_token}`;
  }

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(errorData.error || `HTTP ${response.status}`);
  }

  return response.json();
};



export interface DashboardStats {
  total_messages: number;
  message_change: number;
  ai_responses: number;
  ai_response_change: number;
  response_rate: number;
  active_conversations: number;
  conversation_change: number;
  avg_response_time: number;
  response_time_change: number;
}

export interface MessageVolumeData {
  labels: string[];
  incoming: number[];
  outgoing: number[];
  ai_generated: number[];
}

export interface ResponseRateData {
  labels: string[];
  response_rate: number[];
  ai_accuracy: number[];
}

export const analyticsAPI = {
  // Get dashboard overview stats
  async getDashboardStats(profileId?: string, period = '7d') {
    const params = new URLSearchParams({ period });
    if (profileId) params.append('profile_id', profileId);
    
    const data = await apiRequest(`/api/analytics/dashboard?${params}`);
    return data;
  },

  // Get message volume data for charts
  async getMessageVolume(profileId?: string, period = '30d') {
    const params = new URLSearchParams({ period });
    if (profileId) params.append('profile_id', profileId);
    
    const data = await apiRequest(`/api/analytics/message-volume?${params}`);
    return data;
  },

  // Get response rate analytics
  async getResponseRates(profileId?: string, period = '30d') {
    const params = new URLSearchParams({ period });
    if (profileId) params.append('profile_id', profileId);
    
    const data = await apiRequest(`/api/analytics/response-rates?${params}`);
    return data;
  },

  // Get top performing hours
  async getPerformanceByHour(profileId?: string, period = '30d') {
    const params = new URLSearchParams({ period });
    if (profileId) params.append('profile_id', profileId);
    
    const data = await apiRequest(`/api/analytics/performance-by-hour?${params}`);
    return data;
  },

  // Get client engagement metrics
  async getClientEngagement(profileId?: string, period = '30d') {
    const params = new URLSearchParams({ period });
    if (profileId) params.append('profile_id', profileId);
    
    const data = await apiRequest(`/api/analytics/client-engagement?${params}`);
    return data;
  },

  // Get AI performance metrics
  async getAIPerformance(profileId?: string, period = '30d') {
    const params = new URLSearchParams({ period });
    if (profileId) params.append('profile_id', profileId);
    
    const data = await apiRequest(`/api/analytics/ai-performance?${params}`);
    return data;
  },

  // Export analytics data
  async exportAnalytics(profileId?: string, period = '30d', format = 'csv') {
    const params = new URLSearchParams({ period, format });
    if (profileId) params.append('profile_id', profileId);
    
    const response = await fetch(`${API_BASE_URL}/api/analytics/export?${params}`, {
      headers: {
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('auth_tokens') || '{}').access_token}`,
      },
    });
    
    if (!response.ok) throw new Error('Export failed');
    
    return response.blob();
  },
};