import type { Client, ApiResponse } from '../types';
import apiClient from './apiClient';
import { API_ENDPOINTS } from '../utils/constants';


export class ClientService {
  
  static async getClients(params: {
    page?: number;
    per_page?: number;
    search?: string;
    status?: string;
    flagged_only?: boolean;
    favorites_only?: boolean;
    risk_level?: string;
    tags?: string;
    sort_by?: string;
    sort_order?: string;
    include_stats?: boolean;
  } = {}): Promise<{
    clients: Client[];
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
      
      const url = `${API_ENDPOINTS.clients.list}?${searchParams.toString()}`;
      const response = await apiClient.get(url);
      return response;
    } catch (error) {
      console.error('Error purchasing phone number:', error);
      const errorMessage = (error instanceof Error) ? error.message : String(error);
      throw new Error(`Failed to purchase phone number: ${errorMessage}`);
    
    }
  }

  static async getClient(
    clientId: string,
    options: {
      include_stats?: boolean;
      include_settings?: boolean;
      include_messages?: boolean;
      message_limit?: number;
    } = {}
  ): Promise<Client> {
    try {
      const searchParams = new URLSearchParams();
      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      
      const url = `${API_ENDPOINTS.clients.get(clientId)}?${searchParams.toString()}`;
      const response = await apiClient.get<Client>(url);
      return response;
    } catch (error) {
       console.error('Error purchasing phone number:', error);
      const errorMessage = (error instanceof Error) ? error.message : String(error);
      throw new Error(`Failed to purchase phone number: ${errorMessage}`);
    
    }
  }

  static async createClient(clientData: {
    phone_number: string;
    name?: string;
    nickname?: string;
    email?: string;
    notes?: string;
    tags?: string[];
    relationship_status?: string;
    priority_level?: number;
  }): Promise<Client> {
    try {
      const response = await apiClient.post<ApiResponse<Client>>(
        API_ENDPOINTS.clients.create,
        clientData
      );
      return response.data;
    } catch (error) {
      console.error('Error purchasing phone number:', error);
      const errorMessage = (error instanceof Error) ? error.message : String(error);
      throw new Error(`Failed to purchase phone number: ${errorMessage}`);
    }
  }
  

  static async updateClient(
    clientId: string,
    updates: Partial<{
      name: string;
      nickname: string;
      email: string;
      notes: string;
      tags: string[];
      relationship_status: string;
      priority_level: number;
      is_favorite: boolean;
      custom_ai_personality: string;
      custom_greeting: string;
      auto_reply_enabled: boolean;
    }>
  ): Promise<Client> {
    try {
      const response = await apiClient.put<ApiResponse<Client>>(
        API_ENDPOINTS.clients.update(clientId),
        updates
      );
      return response.data;
    } catch (error) {
     console.error('Error purchasing phone number:', error);
      const errorMessage = (error instanceof Error) ? error.message : String(error);
      throw new Error(`Failed to purchase phone number: ${errorMessage}`);
    }
  }
  
  static async deleteClient(clientId: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.delete<ApiResponse<{ message: string }>>(
        API_ENDPOINTS.clients.delete(clientId)
      );
      return response.data;
    } catch (error) {
      console.error('Error purchasing phone number:', error);
      const errorMessage = (error instanceof Error) ? error.message : String(error);
      throw new Error(`Failed to purchase phone number: ${errorMessage}`);
    }
  }
  


  static async blockClient(
    clientId: string,
    reason: string = 'No reason provided'
  ): Promise<{ message: string; client: Client }> {
    try {
      const response = await apiClient.post<ApiResponse<{ message: string; client: Client }>>(
        API_ENDPOINTS.clients.block(clientId),
        { reason }
      );
      return response.data;
    } catch (error) {
     console.error('Error purchasing phone number:', error);
      const errorMessage = (error instanceof Error) ? error.message : String(error);
      throw new Error(`Failed to purchase phone number: ${errorMessage}`);
    }
  }
  
 
  static async unblockClient(clientId: string): Promise<{ message: string; client: Client }> {
    try {
      const response = await apiClient.post<ApiResponse<{ message: string; client: Client }>>(
        API_ENDPOINTS.clients.unblock(clientId)
      );
      return response.data;
    } catch (error) {
      console.error('Error purchasing phone number:', error);
      const errorMessage = (error instanceof Error) ? error.message : String(error);
      throw new Error(`Failed to purchase phone number: ${errorMessage}`);
    }
  }
  

  static async flagClient(
    clientId: string,
    reasons: string[]
  ): Promise<{ message: string; client: Client }> {
    try {
      const response = await apiClient.post<ApiResponse<{ message: string; client: Client }>>(
        API_ENDPOINTS.clients.flag(clientId),
        { reasons }
      );
      return response.data;
    } catch (error) {
       console.error('Error purchasing phone number:', error);
      const errorMessage = (error instanceof Error) ? error.message : String(error);
      throw new Error(`Failed to purchase phone number: ${errorMessage}`);
    }
  }
  
  static async unflagClient(clientId: string): Promise<{ message: string; client: Client }> {
    try {
      const response = await apiClient.post<ApiResponse<{ message: string; client: Client }>>(
        API_ENDPOINTS.clients.unflag(clientId)
      );
      return response.data;
    } catch (error) {
      console.error('Error purchasing phone number:', error);
      const errorMessage = (error instanceof Error) ? error.message : String(error);
      throw new Error(`Failed to purchase phone number: ${errorMessage}`);
    }
  }
  
  
  static async bulkOperation(data: {
    client_ids: string[];
    operation: 'block' | 'unblock' | 'flag' | 'unflag' | 'delete' | 'update_tags';
    reason?: string;
    reasons?: string[];
    tags?: string[];
  }): Promise<{
    message: string;
    results: Array<{
      client_id: string;
      status: 'success' | 'error';
      error?: string;
    }>;
    total_processed: number;
    successful: number;
    failed: number;
  }> {
    try {
      const response = await apiClient.post<ApiResponse<any>>(
        API_ENDPOINTS.clients.bulk,
        data
      );
      return response.data;
    } catch (error) {
     console.error('Error purchasing phone number:', error);
      const errorMessage = (error instanceof Error) ? error.message : String(error);
      throw new Error(`Failed to purchase phone number: ${errorMessage}`);
    }
  }
  
 
  static async getClientStats(days: number = 30): Promise<{
    total_clients: number;
    new_clients_last_30_days: number;
    recent_interactions: number;
    status_breakdown: Record<string, number>;
    risk_level_breakdown: Record<string, number>;
    top_clients: Client[];
    period_days: number;
  }> {
    try {
      const url = `${API_ENDPOINTS.clients.stats}?days=${days}`;
      const response = await apiClient.get<ApiResponse<any>>(url);
      return response.data;
    } catch (error) {
      console.error('Error purchasing phone number:', error);
      const errorMessage = (error instanceof Error) ? error.message : String(error);
      throw new Error(`Failed to purchase phone number: ${errorMessage}`);
    }
  }
  

  static getDisplayName(client: Client): string {
    return client.name || client.nickname || client.phone_number;
  }
  

  static getTags(client: Client): string[] {
    return client.tags || [];
  }
  

  static isRecentContact(client: Client, days: number = 7): boolean {
    if (!client.last_interaction) return false;
    
    const lastInteraction = new Date(client.last_interaction);
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - days);
    
    return lastInteraction >= daysAgo;
  }
  

  static getRiskLevelColor(riskLevel: string): string {
    
    const colors: { [key: string]: string } = {
      low: 'green',
      medium: 'yellow',
      high: 'orange',
      critical: 'red',
    };
    return colors[riskLevel] || 'gray';
  }
  
  /**
   * Get relationship status label
   */
  static getRelationshipStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      new: 'New',
      regular: 'Regular',
      vip: 'VIP',
      blocked: 'Blocked',
    };
    return labels[status] || status;
  }
  
  /**
   * Format phone number for display
   */
  static formatPhoneNumber(phoneNumber: string): string {
    // Remove all non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // Format as (XXX) XXX-XXXX for US numbers
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    
    // Format as +X (XXX) XXX-XXXX for international numbers starting with 1
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    
    // Return as-is for other formats
    return phoneNumber;
  }
  
  /**
   * Calculate engagement score color
   */
  static getEngagementColor(score: number): string {
    if (score >= 0.8) return 'green';
    if (score >= 0.6) return 'blue';
    if (score >= 0.4) return 'yellow';
    if (score >= 0.2) return 'orange';
    return 'red';
  }
  
  /**
   * Get priority level label
   */
  static getPriorityLabel(level: number): string {
    const labels: { [key: number]: string } = {
      1: 'Low',
      2: 'Normal',
      3: 'Medium',
      4: 'High',
      5: 'Critical',
    };
    return labels[level] || 'Normal';
  }
  
  /**
   * Search clients locally (for frontend filtering)
   */
  static searchClients(clients: Client[], searchTerm: string): Client[] {
    if (!searchTerm.trim()) return clients;
    
    const term = searchTerm.toLowerCase();
    return clients.filter(client =>
      client.phone_number.includes(term) ||
      client.name?.toLowerCase().includes(term) ||
      client.nickname?.toLowerCase().includes(term) ||
      client.email?.toLowerCase().includes(term) ||
      client.notes?.toLowerCase().includes(term) ||
      client.tags?.some(tag => tag.toLowerCase().includes(term))
    );
  }
  
  /**
   * Sort clients by various criteria
   */
  static sortClients(clients: Client[], sortBy: string, sortOrder: 'asc' | 'desc' = 'desc'): Client[] {
    const sorted = [...clients].sort((a, b) => {
      let aValue: any;
      let bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = this.getDisplayName(a).toLowerCase();
          bValue = this.getDisplayName(b).toLowerCase();
          break;
        case 'last_interaction':
          aValue = new Date(a.last_interaction || 0);
          bValue = new Date(b.last_interaction || 0);
          break;
        case 'created_at':
          aValue = new Date(a.created_at || 0);
          bValue = new Date(b.created_at || 0);
          break;
        case 'total_interactions':
          aValue = a.total_interactions || 0;
          bValue = b.total_interactions || 0;
          break;
        case 'priority_level':
          aValue = a.priority_level || 1;
          bValue = b.priority_level || 1;
          break;
        case 'engagement_score':
          aValue = a.engagement_score || 0;
          bValue = b.engagement_score || 0;
          break;
        default:
          return 0;
      }
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    
    return sorted;
  }
}

// Export default instance for convenience
export default ClientService;