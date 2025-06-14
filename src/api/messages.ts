// src/api/messages.ts
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

export interface Message {
  id: string;
  profile_id: string;
  conversation_id?: string;
  sender_number: string;
  content: string;
  direction: 'inbound' | 'outbound';
  signalwire_sid?: string;
  status: string;
  is_ai_generated: boolean;
  parent_message_id?: string;
  created_at: string;
  delivered_at?: string;
}

export interface Conversation {
  id: string;
  profile_id: string;
  client_phone_number: string;
  client_name?: string;
  last_message_at: string;
  is_archived: boolean;
  created_at: string;
  message_count: number;
  last_message?: Message;
}

export const messagesAPI = {
  // Get conversations for a profile
  async getConversations(profileId: string, page = 1, limit = 20) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    const data = await apiRequest(`/api/profiles/${profileId}/conversations?${params}`);
    return data;
  },

  // Get messages for a conversation
  async getMessages(conversationId: string, page = 1, limit = 50) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    const data = await apiRequest(`/api/conversations/${conversationId}/messages?${params}`);
    return data;
  },

  // Send a message
  async sendMessage(profileId: string, toNumber: string, content: string) {
    const data = await apiRequest('/api/messages/send', {
      method: 'POST',
      body: JSON.stringify({
        profile_id: profileId,
        to_number: toNumber,
        content,
      }),
    });
    return data;
  },

  // Mark conversation as read
  async markAsRead(conversationId: string) {
    const data = await apiRequest(`/api/conversations/${conversationId}/read`, {
      method: 'POST',
    });
    return data;
  },

  // Archive conversation
  async archiveConversation(conversationId: string) {
    const data = await apiRequest(`/api/conversations/${conversationId}/archive`, {
      method: 'POST',
    });
    return data;
  },

  // Search messages
  async searchMessages(profileId: string, query: string, page = 1) {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
    });
    const data = await apiRequest(`/api/profiles/${profileId}/messages/search?${params}`);
    return data;
  },

  // Generate AI response manually
  async generateAIResponse(messageId: string) {
    const data = await apiRequest(`/api/messages/${messageId}/ai-response`, {
      method: 'POST',
    });
    return data;
  },

  // Get message statistics
  async getMessageStats(profileId: string, period = '7d') {
    const params = new URLSearchParams({ period });
    const data = await apiRequest(`/api/profiles/${profileId}/stats?${params}`);
    return data;
  },
};