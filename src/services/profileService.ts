import type { Profile, CreateProfileForm, ApiResponse } from '../types';
import  apiClient from './apiClient';
import { API_ENDPOINTS } from '../utils/constants';

export const profileService = {
  async getProfiles(): Promise<Profile[]> {
    const response = await apiClient.get<ApiResponse<Profile[]>>(API_ENDPOINTS.profiles.list);
    return response.data;
  },

  async getProfile(id: string): Promise<Profile> {
    const response = await apiClient.get<ApiResponse<Profile>>(API_ENDPOINTS.profiles.get(id));
    return response.data;
  },

  async createProfile(data: CreateProfileForm): Promise<Profile> {
    const response = await apiClient.post<ApiResponse<Profile>>(API_ENDPOINTS.profiles.create, data);
    return response.data;
  },

  async updateProfile(id: string, data: Partial<CreateProfileForm>): Promise<Profile> {
    const response = await apiClient.put<ApiResponse<Profile>>(API_ENDPOINTS.profiles.update(id), data);
    return response.data;
  },

  async deleteProfile(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.profiles.delete(id));
  },

  async toggleAI(id: string, enabled: boolean): Promise<Profile> {
    const response = await apiClient.post<ApiResponse<Profile>>(
      API_ENDPOINTS.profiles.toggleAI(id),
      { enabled }
    );
    return response.data;
  },
};