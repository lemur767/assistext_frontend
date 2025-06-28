// src/services/aiSettingsService.ts
import type { AISettings, TextExample, ApiResponse } from '../types';
import apiClient from './apiClient';
import { API_ENDPOINTS } from '../utils/constants';

export const aiSettingsService = {
  async getSettings(profileId: string): Promise<AISettings> {
    const response = await apiClient.get<ApiResponse<AISettings>>(
      API_ENDPOINTS.ai.settings(profileId)
    );
    return response.data;
  },

  async updateSettings(profileId: string, data: Partial<AISettings>): Promise<AISettings> {
    const response = await apiClient.put<ApiResponse<AISettings>>(
      API_ENDPOINTS.ai.settings(profileId),
      data
    );
    return response.data;
  },

  async updatePersonality(profileId: string, data: Partial<AISettings>): Promise<AISettings> {
    const response = await apiClient.patch<ApiResponse<AISettings>>(
      API_ENDPOINTS.ai.settings(profileId),
      data
    );
    return response.data;
  },

  async getTextExamples(profileId: string): Promise<TextExample[]> {
    const response = await apiClient.get<ApiResponse<TextExample[]>>(
      API_ENDPOINTS.ai.examples(profileId)
    );
    return response.data;
  },

  async addTextExample(profileId: string, example: { incoming: string; outgoing: string }): Promise<TextExample> {
    const response = await apiClient.post<ApiResponse<TextExample>>(
      API_ENDPOINTS.ai.examples(profileId),
      example
    );
    return response.data;
  },

  async deleteTextExample(exampleId: string): Promise<void> {
    await apiClient.delete(`/api/text-examples/${exampleId}`);
  },

  async bulkImportExamples(profileId: string, data: { text: string }): Promise<{ imported: number }> {
    const response = await apiClient.post<ApiResponse<{ imported: number }>>(
      API_ENDPOINTS.ai.bulkImport(profileId),
      data
    );
    return response.data;
  },
};