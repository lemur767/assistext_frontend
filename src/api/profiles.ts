// src/api/profiles.ts
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

export interface Profile {
  id: string;
  user_id: string;
  name: string;
  phone_number: string;
  description?: string;
  timezone: string;
  is_active: boolean;
  ai_enabled: boolean;
  business_hours: any;
  daily_auto_response_limit: number;
  signalwire_sid?: string;
  ai_instructions?: string;
  created_at: string;
  daily_ai_count: number;
}

export interface BusinessHours {
  [key: string]: {
    start: string;
    end: string;
    closed?: boolean;
  };
}

export const profilesAPI = {
  // Get all profiles for user
  async getProfiles() {
    const data = await apiRequest('/api/profiles');
    return data;
  },

  // Get single profile
  async getProfile(profileId: string) {
    const data = await apiRequest(`/api/profiles/${profileId}`);
    return data;
  },

  // Create profile
  async createProfile(profileData: Partial<Profile>) {
    const data = await apiRequest('/api/profiles', {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
    return data;
  },

  // Update profile
  async updateProfile(profileId: string, updates: Partial<Profile>) {
    const data = await apiRequest(`/api/profiles/${profileId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    return data;
  },

  // Delete profile
  async deleteProfile(profileId: string) {
    const data = await apiRequest(`/api/profiles/${profileId}`, {
      method: 'DELETE',
    });
    return data;
  },

  // Update business hours
  async updateBusinessHours(profileId: string, businessHours: BusinessHours) {
    const data = await apiRequest(`/api/profiles/${profileId}/business-hours`, {
      method: 'PUT',
      body: JSON.stringify({ business_hours: businessHours }),
    });
    return data;
  },

  // Update AI settings
  async updateAISettings(profileId: string, settings: {
    ai_enabled: boolean;
    ai_instructions?: string;
    daily_auto_response_limit: number;
  }) {
    const data = await apiRequest(`/api/profiles/${profileId}/ai-settings`, {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
    return data;
  },

  // Get profile analytics
  async getProfileAnalytics(profileId: string, period = '30d') {
    const params = new URLSearchParams({ period });
    const data = await apiRequest(`/api/profiles/${profileId}/analytics?${params}`);
    return data;
  },

  // Toggle profile active status
  async toggleProfileStatus(profileId: string, isActive: boolean) {
    const data = await apiRequest(`/api/profiles/${profileId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ is_active: isActive }),
    });
    return data;
  },
};