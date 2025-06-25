import type { DashboardData, ApiResponse } from '../types';
import apiClient from './apiClient';
import { API_ENDPOINTS } from '../utils/constants';

const AnalyticService = {
  async getDashboardData(profileId: string, timeRange: string): Promise<DashboardData> {
    const response = await apiClient.get<ApiResponse<DashboardData>>(
      `${API_ENDPOINTS.dashboard(profileId)}?timeRange=${timeRange}`
    );
    return response.data;
  },
};

export default AnalyticService