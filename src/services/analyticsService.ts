import type { ApiResponse } from '../types';
import apiClient from './apiClient';
import { API_ENDPOINTS } from '../utils/constants';

// Updated types for user-based system
export interface DashboardData {
  success: boolean;
  core_metrics: {
    total_messages: number;
    sent_messages: number;
    received_messages: number;
    ai_messages: number;
    total_clients: number;
    active_clients: number;
    new_clients: number;
    ai_adoption_rate: number;
    response_rate: number;
    client_activity_rate: number;
    avg_response_time_minutes: number;
  };
  messages: {
    types: {
      incoming: number;
      outgoing: number;
      ai_generated: number;
      manual: number;
    };
    peak_hours: Array<{ hour: number; count: number }>;
    avg_message_length: number;
  };
  time_series: Array<{
    date: string;
    sent: number;
    received: number;
    ai_generated: number;
    total: number;
  }>;
  client_activity: Array<{
    client_id: string;
    messages_sent: number;
    messages_received: number;
    ai_messages: number;
    last_active: string;
  }>;
}

export const analyticsService = {
 
  async getDashboardData(timeRange: string): Promise<DashboardData> {
    const params = new URLSearchParams({
      period: timeRange
    });

    const response = await apiClient.get<ApiResponse<DashboardData>>(
      `${API_ENDPOINTS.analytics.dashboard}?${params}`
    );
    
    if (!response.data.success) {
      throw new Error('Failed to fetch dashboard analytics');
    }
    
    return response.data;
  },


  async getMessageAnalytics(period = '30d', breakdown = 'daily') {
    const params = new URLSearchParams({
      period,
      breakdown
    });

    const response = await apiClient.get<ApiResponse<any>>(
      `${API_ENDPOINTS.analytics.messages}?${params}`
    );
    
    return response.data;
  },


  async getClientAnalytics(period = '30d') {
    const params = new URLSearchParams({
      period
    });

    const response = await apiClient.get<ApiResponse<any>>(
      `${API_ENDPOINTS.analytics.clients}?${params}`
    );
    
    return response.data;
  },


  async getPerformanceAnalytics(period = '30d') {
    const params = new URLSearchParams({
      period
    });

    const response = await apiClient.get<ApiResponse<any>>(
      `${API_ENDPOINTS.analytics.performance}?${params}`
    );
    
    return response.data;
  },


  async exportAnalytics(options: {
    type: 'csv' | 'json' | 'pdf';
    sections: string[];
    period: string;
  }) {
    const response = await apiClient.post<ApiResponse<any>>(
      API_ENDPOINTS.analytics.export,
      options
    );
    
    return response.data;
  },

  
  async getRealtimeData() {
    const params = new URLSearchParams({
      period: '1d',
      realtime: 'true'
    });

    const response = await apiClient.get<ApiResponse<any>>(
      `${API_ENDPOINTS.analytics.dashboard}?${params}`
    );
    
    return response.data;
  }
};

export default analyticsService;