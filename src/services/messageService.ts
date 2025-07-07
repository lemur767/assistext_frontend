import type { Message, Conversation, MessageTemplate, ApiResponse, PaginatedResponse } from '../types';
import apiClient from './apiClient';
import { API_ENDPOINTS } from '../utils/constants';

/**
 * Message Service - Updated to work without profiles
 * All messages are now automatically associated with the current user
 */
export class MessageService {
  
  // =============================================================================
  // MESSAGE LISTING AND FILTERING
  // =============================================================================
  
  /**
   * Get messages for the current user
   */
  static async getMessages(params: {
    page?: number;
    per_page?: number;
    client_phone?: string;
    search?: string;
    is_incoming?: boolean;
    ai_generated?: boolean;
    is_flagged?: boolean;
    is_read?: boolean;
    date_from?: string;
    date_to?: string;
    sort_by?: string;
    sort_order?: string;
    include_analysis?: boolean;
  } = {}): Promise<{
    messages: Message[];
    pagination: {
      page: number;
      per_page: number;
      total: number;
      pages: number;
      has_next: boolean;
      has_prev: boolean;
    };
    filters_applied: any;
  }> {
    try {
      const searchParams = new URLSearchParams();
      
      // Add all parameters to search params
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      
      const url = `${API_ENDPOINTS.messages.list}?${searchParams.toString()}`;
      const response = await apiClient.get(url);
      return response;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw new Error(`Failed to fetch messages: ${error.message}`);
    }
  }
  
  /**
   * Get a specific message by ID
   */
  static async getMessage(
    messageId: string,
    includeAnalysis: boolean = true
  ): Promise<Message> {
    try {
      const params = includeAnalysis ? '?include_analysis=true' : '';
      const url = `${API_ENDPOINTS.messages.get(messageId)}${params}`;
      const response = await apiClient.get<Message>(url);
      return response;
    } catch (error) {
      console.error('Error fetching message:', error);
      throw new Error(`Failed to fetch message: ${error.message}`);
    }
  }
  
  // =============================================================================
  // MESSAGE SENDING
  // =============================================================================
  
  /**
   * Send a new message
   */
  static async sendMessage(data: {
    recipient_number: string;
    content: string;
    ai_generated?: boolean;
  }): Promise<Message> {
    try {
      const response = await apiClient.post<ApiResponse<Message>>(
        API_ENDPOINTS.messages.send,
        data
      );
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw new Error(`Failed to send message: ${error.message}`);
    }
  }
  
  // =============================================================================
  // MESSAGE ACTIONS
  // =============================================================================
  
  /**
   * Mark a message as read
   */
  static async markMessageRead(messageId: string): Promise<{ message: string; message_data: Message }> {
    try {
      const response = await apiClient.post<ApiResponse<{ message: string; message_data: Message }>>(
        API_ENDPOINTS.messages.markRead(messageId)
      );
      return response.data;
    } catch (error) {
      console.error('Error marking message as read:', error);
      throw new Error(`Failed to mark message as read: ${error.message}`);
    }
  }
  
  /**
   * Flag a message
   */
  static async flagMessage(
    messageId: string,
    reasons: string[]
  ): Promise<{ message: string; message_data: Message }> {
    try {
      const response = await apiClient.post<ApiResponse<{ message: string; message_data: Message }>>(
        API_ENDPOINTS.messages.flag(messageId),
        { reasons }
      );
      return response.data;
    } catch (error) {
      console.error('Error flagging message:', error);
      throw new Error(`Failed to flag message: ${error.message}`);
    }
  }
  
  /**
   * Unflag a message
   */
  static async unflagMessage(messageId: string): Promise<{ message: string; message_data: Message }> {
    try {
      const response = await apiClient.post<ApiResponse<{ message: string; message_data: Message }>>(
        API_ENDPOINTS.messages.unflag(messageId)
      );
      return response.data;
    } catch (error) {
      console.error('Error unflagging message:', error);
      throw new Error(`Failed to unflag message: ${error.message}`);
    }
  }
  
  // =============================================================================
  // CONVERSATIONS
  // =============================================================================
  
  /**
   * Get list of conversations (grouped by client)
   */
  static async getConversations(params: {
    page?: number;
    per_page?: number;
    search?: string;
    unread_only?: boolean;
  } = {}): Promise<{
    conversations: Array<{
      phone_number: string;
      client: any;
      latest_message: Message;
      unread_count: number;
      total_messages: number;
      display_name: string;
    }>;
    pagination: {
      page: number;
      per_page: number;
      total: number;
      pages: number;
      has_next: boolean;
      has_prev: boolean;
    };
  }> {
    try {
      const searchParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      
      const url = `${API_ENDPOINTS.messages.conversations}?${searchParams.toString()}`;
      const response = await apiClient.get(url);
      return response;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw new Error(`Failed to fetch conversations: ${error.message}`);
    }
  }
  
  /**
   * Get all messages for a specific conversation
   */
  static async getConversationMessages(
    phoneNumber: string,
    params: {
      page?: number;
      per_page?: number;
      include_analysis?: boolean;
    } = {}
  ): Promise<{
    conversation: {
      phone_number: string;
      client: any;
      display_name: string;
    };
    messages: Message[];
    pagination: {
      page: number;
      per_page: number;
      total: number;
      pages: number;
      has_next: boolean;
      has_prev: boolean;
    };
    marked_read: number;
  }> {
    try {
      const searchParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      
      const url = `${API_ENDPOINTS.messages.conversation(phoneNumber)}?${searchParams.toString()}`;
      const response = await apiClient.get(url);
      return response;
    } catch (error) {
      console.error('Error fetching conversation messages:', error);
      throw new Error(`Failed to fetch conversation messages: ${error.message}`);
    }
  }
  
  // =============================================================================
  // MESSAGE TEMPLATES
  // =============================================================================
  
  /**
   * Get message templates for the current user
   */
  static async getMessageTemplates(params: {
    category?: string;
    active_only?: boolean;
  } = {}): Promise<MessageTemplate[]> {
    try {
      const searchParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      
      const url = `${API_ENDPOINTS.messages.templates}?${searchParams.toString()}`;
      const response = await apiClient.get<MessageTemplate[]>(url);
      return response;
    } catch (error) {
      console.error('Error fetching message templates:', error);
      throw new Error(`Failed to fetch message templates: ${error.message}`);
    }
  }
  
  /**
   * Create a new message template
   */
  static async createMessageTemplate(templateData: {
    name: string;
    content: string;
    category?: string;
    description?: string;
  }): Promise<MessageTemplate> {
    try {
      const response = await apiClient.post<ApiResponse<MessageTemplate>>(
        API_ENDPOINTS.messages.templates,
        templateData
      );
      return response.data;
    } catch (error) {
      console.error('Error creating message template:', error);
      throw new Error(`Failed to create message template: ${error.message}`);
    }
  }
  
  // =============================================================================
  // MESSAGE STATISTICS
  // =============================================================================
  
  /**
   * Get message statistics for the user
   */
  static async getMessageStats(days: number = 30): Promise<{
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
  }> {
    try {
      const url = `${API_ENDPOINTS.messages.stats}?days=${days}`;
      const response = await apiClient.get<ApiResponse<any>>(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching message stats:', error);
      throw new Error(`Failed to fetch message stats: ${error.message}`);
    }
  }
  
  // =============================================================================
  // UTILITY METHODS
  // =============================================================================
  
  /**
   * Format message timestamp for display
   */
  static formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const minutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return minutes <= 1 ? 'Just now' : `${minutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 168) { // 7 days
      const days = Math.floor(diffInHours / 24);
      return `${days}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  }
  
  /**
   * Get message direction label
   */
  static getDirectionLabel(message: Message): 'incoming' | 'outgoing' {
    return message.is_incoming ? 'incoming' : 'outgoing';
  }
  
  /**
   * Get message status color
   */
  static getStatusColor(message: Message): string {
    if (message.is_flagged) return 'red';
    if (message.processing_status === 'failed') return 'red';
    if (message.processing_status === 'pending') return 'yellow';
    if (message.ai_generated) return 'blue';
    if (message.is_incoming && !message.is_read) return 'green';
    return 'gray';
  }
  
  /**
   * Get conversation partner phone number
   */
  static getConversationPartner(message: Message): string {
    return message.is_incoming ? message.sender_number : message.recipient_number;
  }
  
  /**
   * Check if message contains flagged content
   */
  static containsFlaggedWords(content: string, flaggedWords: string[]): boolean {
    const lowerContent = content.toLowerCase();
    return flaggedWords.some(word => lowerContent.includes(word.toLowerCase()));
  }
  
  /**
   * Estimate message reading time
   */
  static estimateReadingTime(content: string): number {
    // Assuming average reading speed of 200 words per minute
    const words = content.split(/\s+/).length;
    const minutes = words / 200;
    return Math.max(1, Math.ceil(minutes)); // Minimum 1 minute
  }
  
  /**
   * Get sentiment color from score
   */
  static getSentimentColor(score: number): string {
    if (score > 0.5) return 'green';
    if (score > 0.1) return 'blue';
    if (score > -0.1) return 'gray';
    if (score > -0.5) return 'orange';
    return 'red';
  }
  
  /**
   * Get sentiment label from score
   */
  static getSentimentLabel(score: number): string {
    if (score > 0.5) return 'Very Positive';
    if (score > 0.1) return 'Positive';
    if (score > -0.1) return 'Neutral';
    if (score > -0.5) return 'Negative';
    return 'Very Negative';
  }
  
  /**
   * Format phone number for conversation grouping
   */
  static normalizePhoneNumber(phoneNumber: string): string {
    // Remove all non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // Add +1 for US numbers if not present
    if (cleaned.length === 10) {
      return `+1${cleaned}`;
    }
    
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return `+${cleaned}`;
    }
    
    return phoneNumber;
  }
  
  /**
   * Check if message is recent
   */
  static isRecentMessage(timestamp: string, minutes: number = 5): boolean {
    const messageTime = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = (now.getTime() - messageTime.getTime()) / (1000 * 60);
    return diffInMinutes <= minutes;
  }
  
  /**
   * Search messages locally (for frontend filtering)
   */
  static searchMessages(messages: Message[], searchTerm: string): Message[] {
    if (!searchTerm.trim()) return messages;
    
    const term = searchTerm.toLowerCase();
    return messages.filter(message =>
      message.content.toLowerCase().includes(term) ||
      message.sender_number.includes(term) ||
      message.recipient_number.includes(term)
    );
  }
  
  /**
   * Group messages by conversation
   */
  static groupMessagesByConversation(messages: Message[]): Record<string, Message[]> {
    const grouped: Record<string, Message[]> = {};
    
    messages.forEach(message => {
      const partner = this.getConversationPartner(message);
      const normalizedNumber = this.normalizePhoneNumber(partner);
      
      if (!grouped[normalizedNumber]) {
        grouped[normalizedNumber] = [];
      }
      
      grouped[normalizedNumber].push(message);
    });
    
    // Sort messages within each conversation by timestamp
    Object.keys(grouped).forEach(phoneNumber => {
      grouped[phoneNumber].sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
    });
    
    return grouped;
  }
  
  /**
   * Calculate conversation statistics
   */
  static calculateConversationStats(messages: Message[]): {
    total_messages: number;
    incoming_count: number;
    outgoing_count: number;
    ai_generated_count: number;
    unread_count: number;
    flagged_count: number;
    avg_response_time: number | null;
  } {
    const stats = {
      total_messages: messages.length,
      incoming_count: 0,
      outgoing_count: 0,
      ai_generated_count: 0,
      unread_count: 0,
      flagged_count: 0,
      avg_response_time: null as number | null,
    };
    
    let responseTimes: number[] = [];
    let lastIncomingTime: Date | null = null;
    
    messages.forEach(message => {
      if (message.is_incoming) {
        stats.incoming_count++;
        lastIncomingTime = new Date(message.timestamp);
        if (!message.is_read) stats.unread_count++;
      } else {
        stats.outgoing_count++;
        // Calculate response time if there was a recent incoming message
        if (lastIncomingTime) {
          const responseTime = new Date(message.timestamp).getTime() - lastIncomingTime.getTime();
          responseTimes.push(responseTime / 1000 / 60); // Convert to minutes
          lastIncomingTime = null;
        }
      }
      
      if (message.ai_generated) stats.ai_generated_count++;
      if (message.is_flagged) stats.flagged_count++;
    });
    
    if (responseTimes.length > 0) {
      stats.avg_response_time = responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;
    }
    
    return stats;
  }
}

// Export default instance for convenience
export default MessageService;