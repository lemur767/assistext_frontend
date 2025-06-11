import type { Conversation, Message, ApiResponse } from '../types';
import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '../utils/constants';

export const messageService = {
  async getConversations(profileId: string): Promise<Conversation[]> {
    const response = await apiClient.get<ApiResponse<Conversation[]>>(
      API_ENDPOINTS.messages.conversations(profileId)
    );
    return response.data;
  },

  async getConversation(id: string): Promise<Conversation> {
    const response = await apiClient.get<ApiResponse<Conversation>>(
      API_ENDPOINTS.messages.conversation(id)
    );
    return response.data;
  },

  async sendMessage(data: {
    conversationId: string;
    profileId: string;
    content: string;
    isAiGenerated: boolean;
  }): Promise<Message> {
    const response = await apiClient.post<ApiResponse<Message>>(
      API_ENDPOINTS.messages.send,
      data
    );
    return response.data;
  },

  async markAsRead(conversationId: string): Promise<void> {
    await apiClient.post(API_ENDPOINTS.messages.markRead(conversationId));
  },
};


