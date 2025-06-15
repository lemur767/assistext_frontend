// src/api/analytics.ts - Integrate with our dashboard
import { apiClients } from './clients.ts';
import type { DashboardStats, DashboardData } from '../types';

export const analyticsAPI = {
  async getDashboardData(profileId?: string, timeRange = '7d'): Promise<DashboardData> {
    const params = new URLSearchParams({ timeRange });
    if (profileId) params.append('profileId', profileId);
    
    const data = await apiClient(`/api/analytics/dashboard?${params}`);
    return data;
  },

  async getMessageStats(profileId: string, period = '30d') {
    const params = new URLSearchParams({ period });
    const data = await apiClient(`/api/profiles/${profileId}/analytics/messages?${params}`);
    return data;
  },

  async getAIPerformance(profileId: string, period = '30d') {
    const params = new URLSearchParams({ period });
    const data = await apiClient(`/api/profiles/${profileId}/analytics/ai-performance?${params}`);
    return data;
  },

  async getClientEngagement(profileId: string, period = '30d') {
    const params = new URLSearchParams({ period });
    const data = await apiClient(`/api/profiles/${profileId}/analytics/clients?${params}`);
    return data;
  }
};