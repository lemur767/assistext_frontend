import type { User, ApiResponse, AISettings, AutoReplySettings, BusinessHoursSettings, SecuritySettings, SignalWireSettings, DashboardData } from '../types';
import apiClient from './apiClient';
import { API_ENDPOINTS } from '../utils/constants';

/**
 * User Service - Replaces the old ProfileService
 * Handles all user profile and settings management
 */
export class UserService {
  
  // =============================================================================
  // USER PROFILE MANAGEMENT
  // =============================================================================
  
  /**
   * Get current user profile
   */
  static async getProfile(includeSettings = true): Promise<User> {
    try {
      const params = includeSettings ? '?include_settings=true' : '';
      const response = await apiClient.get<ApiResponse<User>>(
        `${API_ENDPOINTS.user.profile}${params}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw new Error(`Failed to fetch user profile: ${error.message}`);
    }
  }
  
  /**
   * Update user profile information
   */
  static async updateProfile(updates: Partial<User>): Promise<User> {
    try {
      const response = await apiClient.put<ApiResponse<User>>(
        API_ENDPOINTS.user.profile,
        updates
      );
      return response.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw new Error(`Failed to update user profile: ${error.message}`);
    }
  }
  
  /**
   * Get dashboard summary for current user
   */
  static async getDashboard(): Promise<DashboardData> {
    try {
      const response = await apiClient.get<ApiResponse<DashboardData>>(
        API_ENDPOINTS.user.dashboard
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      throw new Error(`Failed to fetch dashboard: ${error.message}`);
    }
  }
  
  // =============================================================================
  // AI SETTINGS MANAGEMENT
  // =============================================================================
  
  /**
   * Get AI settings for current user
   */
  static async getAISettings(): Promise<AISettings> {
    try {
      const response = await apiClient.get<ApiResponse<AISettings>>(
        API_ENDPOINTS.user.aiSettings
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching AI settings:', error);
      throw new Error(`Failed to fetch AI settings: ${error.message}`);
    }
  }
  
  /**
   * Update AI settings for current user
   */
  static async updateAISettings(settings: Partial<AISettings>): Promise<{ message: string; ai_settings: AISettings }> {
    try {
      const response = await apiClient.put<ApiResponse<{ message: string; ai_settings: AISettings }>>(
        API_ENDPOINTS.user.aiSettings,
        settings
      );
      return response.data;
    } catch (error) {
      console.error('Error updating AI settings:', error);
      throw new Error(`Failed to update AI settings: ${error.message}`);
    }
  }
  
  // =============================================================================
  // AUTO REPLY SETTINGS
  // =============================================================================
  
  /**
   * Get auto reply settings for current user
   */
  static async getAutoReplySettings(): Promise<AutoReplySettings> {
    try {
      const response = await apiClient.get<ApiResponse<AutoReplySettings>>(
        API_ENDPOINTS.user.autoReplySettings
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching auto reply settings:', error);
      throw new Error(`Failed to fetch auto reply settings: ${error.message}`);
    }
  }
  
  /**
   * Update auto reply settings for current user
   */
  static async updateAutoReplySettings(settings: Partial<AutoReplySettings>): Promise<{ message: string }> {
    try {
      const response = await apiClient.put<ApiResponse<{ message: string }>>(
        API_ENDPOINTS.user.autoReplySettings,
        settings
      );
      return response.data;
    } catch (error) {
      console.error('Error updating auto reply settings:', error);
      throw new Error(`Failed to update auto reply settings: ${error.message}`);
    }
  }
  
  // =============================================================================
  // BUSINESS HOURS SETTINGS
  // =============================================================================
  
  /**
   * Get business hours settings for current user
   */
  static async getBusinessHours(): Promise<BusinessHoursSettings> {
    try {
      const response = await apiClient.get<ApiResponse<BusinessHoursSettings>>(
        API_ENDPOINTS.user.businessHours
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching business hours:', error);
      throw new Error(`Failed to fetch business hours: ${error.message}`);
    }
  }
  
  /**
   * Update business hours settings for current user
   */
  static async updateBusinessHours(settings: Partial<BusinessHoursSettings>): Promise<{ message: string }> {
    try {
      const response = await apiClient.put<ApiResponse<{ message: string }>>(
        API_ENDPOINTS.user.businessHours,
        settings
      );
      return response.data;
    } catch (error) {
      console.error('Error updating business hours:', error);
      throw new Error(`Failed to update business hours: ${error.message}`);
    }
  }
  
  // =============================================================================
  // SECURITY SETTINGS
  // =============================================================================
  
  /**
   * Get security settings for current user
   */
  static async getSecuritySettings(): Promise<SecuritySettings> {
    try {
      const response = await apiClient.get<ApiResponse<SecuritySettings>>(
        API_ENDPOINTS.user.securitySettings
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching security settings:', error);
      throw new Error(`Failed to fetch security settings: ${error.message}`);
    }
  }
  
  /**
   * Update security settings for current user
   */
  static async updateSecuritySettings(settings: Partial<SecuritySettings>): Promise<{ message: string }> {
    try {
      const response = await apiClient.put<ApiResponse<{ message: string }>>(
        API_ENDPOINTS.user.securitySettings,
        settings
      );
      return response.data;
    } catch (error) {
      console.error('Error updating security settings:', error);
      throw new Error(`Failed to update security settings: ${error.message}`);
    }
  }
  
  // =============================================================================
  // SIGNALWIRE SETTINGS
  // =============================================================================
  
  /**
   * Get SignalWire settings for current user
   */
  static async getSignalWireSettings(): Promise<SignalWireSettings> {
    try {
      const response = await apiClient.get<ApiResponse<SignalWireSettings>>(
        API_ENDPOINTS.user.signalwireSettings
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching SignalWire settings:', error);
      throw new Error(`Failed to fetch SignalWire settings: ${error.message}`);
    }
  }
  
  /**
   * Update SignalWire settings for current user
   */
  static async updateSignalWireSettings(settings: Partial<SignalWireSettings>): Promise<{ message: string }> {
    try {
      const response = await apiClient.put<ApiResponse<{ message: string }>>(
        API_ENDPOINTS.user.signalwireSettings,
        settings
      );
      return response.data;
    } catch (error) {
      console.error('Error updating SignalWire settings:', error);
      throw new Error(`Failed to update SignalWire settings: ${error.message}`);
    }
  }
  
  // =============================================================================
  // ACCOUNT MANAGEMENT
  // =============================================================================
  
  /**
   * Change user password
   */
  static async changePassword(data: {
    current_password: string;
    new_password: string;
    confirm_password: string;
  }): Promise<{ message: string }> {
    try {
      const response = await apiClient.post<ApiResponse<{ message: string }>>(
        API_ENDPOINTS.user.changePassword,
        data
      );
      return response.data;
    } catch (error) {
      console.error('Error changing password:', error);
      throw new Error(`Failed to change password: ${error.message}`);
    }
  }
  
  /**
   * Deactivate user account
   */
  static async deactivateAccount(): Promise<{ message: string }> {
    try {
      const response = await apiClient.post<ApiResponse<{ message: string }>>(
        API_ENDPOINTS.user.deactivate
      );
      return response.data;
    } catch (error) {
      console.error('Error deactivating account:', error);
      throw new Error(`Failed to deactivate account: ${error.message}`);
    }
  }
  
  // =============================================================================
  // UTILITY METHODS
  // =============================================================================
  
  /**
   * Check if user has completed initial setup
   */
  static hasCompletedSetup(user: User): boolean {
    return !!(
      user.first_name &&
      user.last_name &&
      user.email &&
      user.signalwire_configured
    );
  }
  
  /**
   * Get user's display name
   */
  static getDisplayName(user: User): string {
    if (user.display_name) return user.display_name;
    if (user.first_name && user.last_name) return `${user.first_name} ${user.last_name}`;
    if (user.first_name) return user.first_name;
    return user.username || 'User';
  }
  
  /**
   * Check if user is in business hours
   */
  static isInBusinessHours(user: User): boolean {
    if (!user.business_hours_enabled) return true;
    
    const now = new Date();
    const currentDay = now.getDay() === 0 ? 7 : now.getDay(); // Convert Sunday from 0 to 7
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
    
    // Check if current day is a business day
    const businessDays = user.business_days?.split(',').map(d => parseInt(d)) || [1, 2, 3, 4, 5];
    if (!businessDays.includes(currentDay)) return false;
    
    // Check if current time is within business hours
    if (user.business_hours_start && user.business_hours_end) {
      return currentTime >= user.business_hours_start && currentTime <= user.business_hours_end;
    }
    
    return true;
  }
  
  /**
   * Check if user is currently out of office
   */
  static isOutOfOffice(user: User): boolean {
    if (!user.out_of_office_enabled) return false;
    
    const now = new Date();
    const start = user.out_of_office_start ? new Date(user.out_of_office_start) : null;
    const end = user.out_of_office_end ? new Date(user.out_of_office_end) : null;
    
    return !!(start && end && now >= start && now <= end);
  }
  
  /**
   * Get effective response style for user
   */
  static getResponseStyle(user: User): string {
    return user.ai_response_style || 'professional';
  }
  
  /**
   * Check if AI is enabled and configured
   */
  static isAIEnabled(user: User): boolean {
    return user.ai_enabled && !!user.ai_personality;
  }
  
  /**
   * Get user's flagged words as array
   */
  static getFlaggedWords(user: User): string[] {
    const defaultWords = [
      'police', 'cop', 'law enforcement', 'arrest', 'sting', 'setup',
      'underage', 'minor', 'illegal', 'bust', 'wire', 'recording'
    ];
    
    const customWords = user.custom_flagged_words
      ? user.custom_flagged_words.split(',').map(word => word.trim().toLowerCase())
      : [];
    
    return [...defaultWords, ...customWords];
  }
}

// Export default instance for convenience
export default UserService;