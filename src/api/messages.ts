// src/api/messages.ts - Integrate with our messaging interface
import { apiClient } from './client';

export const messagesAPI = {
  async getConversations(profileId: string, page = 1, limit = 20) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    const data = await apiClient(`/api/profiles/${profileId}/conversations?${params}`);
    return data;
  },

  async getMessages(conversationId: string, page = 1, limit = 50) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    const data = await apiClient(`/api/conversations/${conversationId}/messages?${params}`);
    return data;
  },

  async sendMessage(profileId: string, toNumber: string, content: string) {
    const data = await apiClient('/api/messages/send', {
      method: 'POST',
      body: JSON.stringify({
        profile_id: profileId,
        to_number: toNumber,
        content,
      }),
    });
    return data;
  },

  async generateAIResponse(messageId: string) {
    const data = await apiClient(`/api/messages/${messageId}/ai-response`, {
      method: 'POST',
    });
    return data;
  }
};