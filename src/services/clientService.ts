// src/services/clientService.ts
/**
 * ClientService - Comprehensive client management service
 * Handles all client-related API calls and data management
 * 
 * Features:
 * - Client CRUD operations
 * - Search and filtering
 * - Block/unblock management
 * - Flag management
 * - Regular/VIP client management
 * - Analytics and reporting
 * - Bulk operations
 */

import apiClient from './apiClient';
import type { 
  Client, 
  ClientFilters, 
  ClientSearchResult, 
  ClientStats,
  PaginatedResponse,
  ApiResponse 
} from '../types';

// Types for client operations
export interface ClientCreateData {
  phone_number: string;
  name?: string;
  email?: string;
  notes?: string;
  tags?: string[];
}

export interface ClientUpdateData {
  name?: string;
  email?: string;
  notes?: string;
  tags?: string[];
  is_regular?: boolean;
  is_vip?: boolean;
}

export interface ClientBlockData {
  reason?: string;
  block_until?: string; // ISO date string for temporary blocks
  notify_user?: boolean;
}

export interface ClientBulkOperation {
  client_ids: string[];
  operation: 'block' | 'unblock' | 'flag' | 'unflag' | 'delete' | 'add_tag' | 'remove_tag';
  data?: {
    reason?: string;
    tag?: string;
    block_until?: string;
  };
}

export interface ClientAnalytics {
  total_clients: number;
  active_clients: number;
  blocked_clients: number;
  flagged_clients: number;
  regular_clients: number;
  vip_clients: number;
  new_clients_today: number;
  new_clients_week: number;
  most_active_clients: Client[];
  recent_activity: any[];
}

export class ClientService {
  private static readonly BASE_PATH = '/api/clients';

  /**
   * Get all clients across all user's profiles
   */
  static async getAllClients(
    page: number = 1,
    per_page: number = 50,
    filters?: ClientFilters
  ): Promise<PaginatedResponse<Client>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: per_page.toString(),
        ...(filters?.search && { search: filters.search }),
        ...(filters?.status && { status: filters.status }),
        ...(filters?.profile_id && { profile_id: filters.profile_id }),
        ...(filters?.flagged_only && { flagged: 'true' }),
        ...(filters?.date_from && { date_from: filters.date_from }),
        ...(filters?.date_to && { date_to: filters.date_to }),
        ...(filters?.tags && { tags: filters.tags.join(',') }),
      });

      const response = await apiClient.get<PaginatedResponse<Client>>(
        `${this.BASE_PATH}?${params}`
      );
      return response;
    } catch (error) {
      console.error('Error fetching all clients:', error);
      throw new Error(`Failed to fetch clients: ${error.message}`);
    }
  }

  /**
   * Get clients for a specific profile
   */
  static async getClients(
    profileId: string,
    page: number = 1,
    per_page: number = 50,
    filters?: ClientFilters
  ): Promise<PaginatedResponse<Client>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: per_page.toString(),
        ...(filters?.search && { search: filters.search }),
        ...(filters?.status && { status: filters.status }),
        ...(filters?.flagged_only && { flagged: 'true' }),
        ...(filters?.date_from && { date_from: filters.date_from }),
        ...(filters?.date_to && { date_to: filters.date_to }),
        ...(filters?.tags && { tags: filters.tags.join(',') }),
      });

      const response = await apiClient.get<PaginatedResponse<Client>>(
        `${this.BASE_PATH}/profiles/${profileId}?${params}`
      );
      return response;
    } catch (error) {
      console.error('Error fetching profile clients:', error);
      throw new Error(`Failed to fetch clients for profile: ${error.message}`);
    }
  }

  /**
   * Search clients across all profiles
   */
  static async searchClients(
    query: string,
    page: number = 1,
    per_page: number = 20
  ): Promise<ClientSearchResult> {
    try {
      if (!query || query.trim().length < 2) {
        throw new Error('Search query must be at least 2 characters');
      }

      const params = new URLSearchParams({
        q: query.trim(),
        page: page.toString(),
        per_page: per_page.toString(),
      });

      const response = await apiClient.get<ClientSearchResult>(
        `${this.BASE_PATH}/search?${params}`
      );
      return response;
    } catch (error) {
      console.error('Error searching clients:', error);
      throw new Error(`Search failed: ${error.message}`);
    }
  }

  /**
   * Get a specific client by ID
   */
  static async getClient(clientId: string): Promise<Client> {
    try {
      const response = await apiClient.get<ApiResponse<Client>>(
        `${this.BASE_PATH}/${clientId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching client:', error);
      throw new Error(`Failed to fetch client: ${error.message}`);
    }
  }

  /**
   * Get client by phone number
   */
  static async getClientByPhone(phoneNumber: string): Promise<Client> {
    try {
      const response = await apiClient.get<ApiResponse<Client>>(
        `${this.BASE_PATH}/by-phone/${encodeURIComponent(phoneNumber)}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching client by phone:', error);
      throw new Error(`Failed to fetch client: ${error.message}`);
    }
  }

  /**
   * Create a new client
   */
  static async createClient(clientData: ClientCreateData): Promise<Client> {
    try {
      const response = await apiClient.post<ApiResponse<Client>>(
        this.BASE_PATH,
        clientData
      );
      return response.data;
    } catch (error) {
      console.error('Error creating client:', error);
      throw new Error(`Failed to create client: ${error.message}`);
    }
  }

  /**
   * Update client information
   */
  static async updateClient(
    clientId: string,
    updateData: ClientUpdateData
  ): Promise<Client> {
    try {
      const response = await apiClient.put<ApiResponse<Client>>(
        `${this.BASE_PATH}/${clientId}`,
        updateData
      );
      return response.data;
    } catch (error) {
      console.error('Error updating client:', error);
      throw new Error(`Failed to update client: ${error.message}`);
    }
  }

  /**
   * Delete a client
   */
  static async deleteClient(clientId: string): Promise<void> {
    try {
      await apiClient.delete(`${this.BASE_PATH}/${clientId}`);
    } catch (error) {
      console.error('Error deleting client:', error);
      throw new Error(`Failed to delete client: ${error.message}`);
    }
  }

  /**
   * Toggle client block status
   */
  static async toggleBlockClient(
    clientId: string,
    shouldBlock: boolean,
    blockData?: ClientBlockData
  ): Promise<Client> {
    try {
      const endpoint = shouldBlock 
        ? `${this.BASE_PATH}/${clientId}/block`
        : `${this.BASE_PATH}/${clientId}/unblock`;

      const response = await apiClient.post<ApiResponse<Client>>(
        endpoint,
        blockData || {}
      );
      return response.data;
    } catch (error) {
      console.error('Error toggling block status:', error);
      throw new Error(`Failed to ${shouldBlock ? 'block' : 'unblock'} client: ${error.message}`);
    }
  }

  /**
   * Toggle client block status by phone number
   */
  static async toggleClientBlock(
    phoneNumber: string,
    shouldBlock: boolean,
    reason?: string
  ): Promise<Client> {
    try {
      const endpoint = shouldBlock 
        ? `${this.BASE_PATH}/by-phone/${encodeURIComponent(phoneNumber)}/block`
        : `${this.BASE_PATH}/by-phone/${encodeURIComponent(phoneNumber)}/unblock`;

      const response = await apiClient.post<ApiResponse<Client>>(
        endpoint,
        { reason }
      );
      return response.data;
    } catch (error) {
      console.error('Error toggling block status:', error);
      throw new Error(`Failed to ${shouldBlock ? 'block' : 'unblock'} client: ${error.message}`);
    }
  }

  /**
   * Toggle client flag status
   */
  static async toggleFlagClient(
    clientId: string,
    shouldFlag: boolean,
    reason?: string
  ): Promise<Client> {
    try {
      const endpoint = shouldFlag 
        ? `${this.BASE_PATH}/${clientId}/flag`
        : `${this.BASE_PATH}/${clientId}/unflag`;

      const response = await apiClient.post<ApiResponse<Client>>(
        endpoint,
        { reason }
      );
      return response.data;
    } catch (error) {
      console.error('Error toggling flag status:', error);
      throw new Error(`Failed to ${shouldFlag ? 'flag' : 'unflag'} client: ${error.message}`);
    }
  }

  /**
   * Mark client as regular/not regular
   */
  static async markClientAsRegular(
    phoneNumber: string,
    isRegular: boolean
  ): Promise<Client> {
    try {
      const response = await apiClient.post<ApiResponse<Client>>(
        `${this.BASE_PATH}/by-phone/${encodeURIComponent(phoneNumber)}/regular`,
        { is_regular: isRegular }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating regular status:', error);
      throw new Error(`Failed to update regular status: ${error.message}`);
    }
  }

  /**
   * Mark client as VIP/not VIP
   */
  static async markClientAsVIP(
    clientId: string,
    isVIP: boolean
  ): Promise<Client> {
    try {
      const response = await apiClient.post<ApiResponse<Client>>(
        `${this.BASE_PATH}/${clientId}/vip`,
        { is_vip: isVIP }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating VIP status:', error);
      throw new Error(`Failed to update VIP status: ${error.message}`);
    }
  }

  /**
   * Add tags to client
   */
  static async addClientTags(
    clientId: string,
    tags: string[]
  ): Promise<Client> {
    try {
      const response = await apiClient.post<ApiResponse<Client>>(
        `${this.BASE_PATH}/${clientId}/tags`,
        { tags, action: 'add' }
      );
      return response.data;
    } catch (error) {
      console.error('Error adding client tags:', error);
      throw new Error(`Failed to add tags: ${error.message}`);
    }
  }

  /**
   * Remove tags from client
   */
  static async removeClientTags(
    clientId: string,
    tags: string[]
  ): Promise<Client> {
    try {
      const response = await apiClient.post<ApiResponse<Client>>(
        `${this.BASE_PATH}/${clientId}/tags`,
        { tags, action: 'remove' }
      );
      return response.data;
    } catch (error) {
      console.error('Error removing client tags:', error);
      throw new Error(`Failed to remove tags: ${error.message}`);
    }
  }

  /**
   * Get client conversation history
   */
  static async getClientConversations(
    clientId: string,
    profileId?: string,
    page: number = 1,
    per_page: number = 50
  ): Promise<any> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: per_page.toString(),
        ...(profileId && { profile_id: profileId }),
      });

      const response = await apiClient.get(
        `${this.BASE_PATH}/${clientId}/conversations?${params}`
      );
      return response;
    } catch (error) {
      console.error('Error fetching client conversations:', error);
      throw new Error(`Failed to fetch conversations: ${error.message}`);
    }
  }

  /**
   * Get client analytics/statistics
   */
  static async getClientStats(
    profileId?: string,
    dateRange?: { from: string; to: string }
  ): Promise<ClientAnalytics> {
    try {
      const params = new URLSearchParams({
        ...(profileId && { profile_id: profileId }),
        ...(dateRange?.from && { date_from: dateRange.from }),
        ...(dateRange?.to && { date_to: dateRange.to }),
      });

      const response = await apiClient.get<ClientAnalytics>(
        `${this.BASE_PATH}/analytics?${params}`
      );
      return response;
    } catch (error) {
      console.error('Error fetching client analytics:', error);
      throw new Error(`Failed to fetch analytics: ${error.message}`);
    }
  }

  /**
   * Export clients to CSV
   */
  static async exportClients(
    profileId?: string,
    filters?: ClientFilters
  ): Promise<Blob> {
    try {
      const params = new URLSearchParams({
        format: 'csv',
        ...(profileId && { profile_id: profileId }),
        ...(filters?.search && { search: filters.search }),
        ...(filters?.status && { status: filters.status }),
        ...(filters?.flagged_only && { flagged: 'true' }),
        ...(filters?.date_from && { date_from: filters.date_from }),
        ...(filters?.date_to && { date_to: filters.date_to }),
        ...(filters?.tags && { tags: filters.tags.join(',') }),
      });

      const response = await fetch(
        `${apiClient['baseURL']}${this.BASE_PATH}/export?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Export failed: ${response.statusText}`);
      }

      return await response.blob();
    } catch (error) {
      console.error('Error exporting clients:', error);
      throw new Error(`Failed to export clients: ${error.message}`);
    }
  }

  /**
   * Perform bulk operation on multiple clients
   */
  static async bulkOperation(
    operation: ClientBulkOperation
  ): Promise<{ success: number; failed: number; errors: string[] }> {
    try {
      const response = await apiClient.post<{
        success: number;
        failed: number;
        errors: string[];
      }>(`${this.BASE_PATH}/bulk`, operation);
      return response;
    } catch (error) {
      console.error('Error performing bulk operation:', error);
      throw new Error(`Bulk operation failed: ${error.message}`);
    }
  }

  /**
   * Get blocked clients
   */
  static async getBlockedClients(
    page: number = 1,
    per_page: number = 50
  ): Promise<PaginatedResponse<Client>> {
    try {
      return await this.getAllClients(page, per_page, { status: 'blocked' });
    } catch (error) {
      console.error('Error fetching blocked clients:', error);
      throw error;
    }
  }

  /**
   * Get flagged clients
   */
  static async getFlaggedClients(
    page: number = 1,
    per_page: number = 50
  ): Promise<PaginatedResponse<Client>> {
    try {
      return await this.getAllClients(page, per_page, { flagged_only: true });
    } catch (error) {
      console.error('Error fetching flagged clients:', error);
      throw error;
    }
  }

  /**
   * Get regular clients
   */
  static async getRegularClients(
    page: number = 1,
    per_page: number = 50
  ): Promise<PaginatedResponse<Client>> {
    try {
      return await this.getAllClients(page, per_page, { status: 'regular' });
    } catch (error) {
      console.error('Error fetching regular clients:', error);
      throw error;
    }
  }

  /**
   * Get VIP clients
   */
  static async getVIPClients(
    page: number = 1,
    per_page: number = 50
  ): Promise<PaginatedResponse<Client>> {
    try {
      return await this.getAllClients(page, per_page, { status: 'vip' });
    } catch (error) {
      console.error('Error fetching VIP clients:', error);
      throw error;
    }
  }

  /**
   * Check if client exists by phone number
   */
  static async clientExists(phoneNumber: string): Promise<boolean> {
    try {
      await this.getClientByPhone(phoneNumber);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get client message count
   */
  static async getClientMessageCount(
    clientId: string,
    profileId?: string
  ): Promise<{ total: number; unread: number }> {
    try {
      const params = new URLSearchParams({
        ...(profileId && { profile_id: profileId }),
      });

      const response = await apiClient.get<{ total: number; unread: number }>(
        `${this.BASE_PATH}/${clientId}/message-count?${params}`
      );
      return response;
    } catch (error) {
      console.error('Error fetching message count:', error);
      throw new Error(`Failed to fetch message count: ${error.message}`);
    }
  }

  /**
   * Get recent client activity
   */
  static async getRecentActivity(
    limit: number = 10,
    profileId?: string
  ): Promise<any[]> {
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        ...(profileId && { profile_id: profileId }),
      });

      const response = await apiClient.get<any[]>(
        `${this.BASE_PATH}/recent-activity?${params}`
      );
      return response;
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      throw new Error(`Failed to fetch recent activity: ${error.message}`);
    }
  }

  /**
   * Add client notes
   */
  static async addClientNote(
    clientId: string,
    note: string
  ): Promise<Client> {
    try {
      const response = await apiClient.post<ApiResponse<Client>>(
        `${this.BASE_PATH}/${clientId}/notes`,
        { note }
      );
      return response.data;
    } catch (error) {
      console.error('Error adding client note:', error);
      throw new Error(`Failed to add note: ${error.message}`);
    }
  }

  /**
   * Get client timeline/activity history
   */
  static async getClientTimeline(
    clientId: string,
    page: number = 1,
    per_page: number = 20
  ): Promise<any> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: per_page.toString(),
      });

      const response = await apiClient.get(
        `${this.BASE_PATH}/${clientId}/timeline?${params}`
      );
      return response;
    } catch (error) {
      console.error('Error fetching client timeline:', error);
      throw new Error(`Failed to fetch timeline: ${error.message}`);
    }
  }
}

// Export individual methods for tree-shaking
export const {
  getAllClients,
  getClients,
  searchClients,
  getClient,
  getClientByPhone,
  createClient,
  updateClient,
  deleteClient,
  toggleBlockClient,
  toggleClientBlock,
  toggleFlagClient,
  markClientAsRegular,
  markClientAsVIP,
  addClientTags,
  removeClientTags,
  getClientConversations,
  getClientStats,
  exportClients,
  bulkOperation,
  getBlockedClients,
  getFlaggedClients,
  getRegularClients,
  getVIPClients,
  clientExists,
  getClientMessageCount,
  getRecentActivity,
  addClientNote,
  getClientTimeline,
} = ClientService;

// Default export
export default ClientService;