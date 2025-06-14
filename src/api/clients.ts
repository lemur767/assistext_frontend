


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

// src/api/clients.ts
export interface Client {
  id: string;
  phone_number: string;
  name?: string;
  email?: string;
  notes?: string;
  tags: string[];
  is_blocked: boolean;
  is_flagged: boolean;
  last_contact: string;
  total_messages: number;
  created_at: string;
}

export const clientsAPI = {
  // Get clients for a profile
  async getClients(profileId: string, page = 1, limit = 20, filters: any = {}) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });
    const data = await apiRequest(`/api/profiles/${profileId}/clients?${params}`);
    return data;
  },

  // Get single client
  async getClient(clientId: string) {
    const data = await apiRequest(`/api/clients/${clientId}`);
    return data;
  },

  // Update client
  async updateClient(clientId: string, updates: Partial<Client>) {
    const data = await apiRequest(`/api/clients/${clientId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    return data;
  },

  // Block/unblock client
  async toggleBlockClient(clientId: string, isBlocked: boolean) {
    const data = await apiRequest(`/api/clients/${clientId}/block`, {
      method: 'PUT',
      body: JSON.stringify({ is_blocked: isBlocked }),
    });
    return data;
  },

  // Flag/unflag client
  async toggleFlagClient(clientId: string, isFlagged: boolean) {
    const data = await apiRequest(`/api/clients/${clientId}/flag`, {
      method: 'PUT',
      body: JSON.stringify({ is_flagged: isFlagged }),
    });
    return data;
  },

  // Add client tags
  async addClientTag(clientId: string, tag: string) {
    const data = await apiRequest(`/api/clients/${clientId}/tags`, {
      method: 'POST',
      body: JSON.stringify({ tag }),
    });
    return data;
  },

  // Remove client tag
  async removeClientTag(clientId: string, tag: string) {
    const data = await apiRequest(`/api/clients/${clientId}/tags/${tag}`, {
      method: 'DELETE',
    });
    return data;
  },

  // Search clients
  async searchClients(profileId: string, query: string, page = 1) {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
    });
    const data = await apiRequest(`/api/profiles/${profileId}/clients/search?${params}`);
    return data;
  },

  // Get client conversation history
  async getClientHistory(profileId: string, phoneNumber: string) {
    const data = await apiRequest(`/api/profiles/${profileId}/clients/${encodeURIComponent(phoneNumber)}/history`);
    return data;
  },

  // Export clients
  async exportClients(profileId: string, format = 'csv') {
    const params = new URLSearchParams({ format });
    
    const response = await fetch(`${API_BASE_URL}/api/profiles/${profileId}/clients/export?${params}`, {
      headers: {
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('auth_tokens') || '{}').access_token}`,
      },
    });
    
    if (!response.ok) throw new Error('Export failed');
    
    return response.blob();
  },
};