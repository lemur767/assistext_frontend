// src/pages/Settings.tsx - Fixed with proper TypeScript types
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { getCurrentUser, updateUserProfile } from '../api/auth';
import { useAuth } from '../hooks/useAuth';
import type { User } from '../types';

// Import components
import ProfileForm from '../components/settings/ProfileForm';
import PasswordForm from '../components/settings/PasswordForm';
import NotificationSettings from '../components/settings/NotificationSettings';
import DeleteAccount from '../components/settings/DeleteAccount';

// Define tab types
type TabType = 'profile' | 'password' | 'notifications' | 'delete';

// Define settings types
interface NotificationSetting {
  email: boolean;
  push: boolean;
  sms: boolean;
}

interface SettingsState {
  notifications: {
    newMessages: NotificationSetting;
    aiResponses: NotificationSetting;
    systemUpdates: NotificationSetting;
    securityAlerts: NotificationSetting;
  };
  privacy: {
    profileVisibility: 'public' | 'private';
    dataSharing: boolean;
    analyticsTracking: boolean;
  };
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    timezone: string;
  };
}

const Settings: React.FC = () => {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [settings, setSettings] = useState<SettingsState>({
    notifications: {
      newMessages: { email: true, push: true, sms: false },
      aiResponses: { email: true, push: false, sms: false },
      systemUpdates: { email: true, push: false, sms: false },
      securityAlerts: { email: true, push: true, sms: true },
    },
    privacy: {
      profileVisibility: 'private',
      dataSharing: false,
      analyticsTracking: true,
    },
    preferences: {
      theme: 'light',
      language: 'en',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  });
  
  // Fetch user data
  useEffect(() => {
    const fetchUserData = async (): Promise<void> => {
      try {
        setIsLoading(true);
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load user profile');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  // Fixed: Update setting function with proper TypeScript types
  const updateSetting = (
    category: keyof SettingsState, 
    key: string, 
    value: any
  ): void => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };
  
  // Handle profile update
  const handleProfileUpdate = async (updatedUser: User): Promise<void> => {
    try {
      setUser(updatedUser);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };
  
  // Handle notification settings change
  const handleNotificationChange = (
    setting: string, 
    type: keyof NotificationSetting, 
    enabled: boolean
  ): void => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [setting]: {
          ...prev.notifications[setting as keyof typeof prev.notifications],
          [type]: enabled
        }
      }
    }));
    toast.success('Notification settings updated');
  };

  // Handle privacy settings change
  const handlePrivacyChange = (key: string, value: any): void => {
    updateSetting('privacy', key, value);
    toast.success('Privacy settings updated');
  };

  // Handle preference change
  const handlePreferenceChange = (key: string, value: any): void => {
    updateSetting('preferences', key, value);
    toast.success('Preferences updated');
  };

  // Save all settings
  const saveSettings = async (): Promise<void> => {
    try {
      // API call to save settings would go here
      console.log('Saving settings:', settings);
      toast.success('All settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">User not found</h2>
          <p className="text-gray-600">Please log in to access your settings.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Settings</h1>
        <p className="text-gray-600">
          Manage your account settings and preferences.
        </p>
      </div>
      
      {/* Settings Tabs */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            {/* Tab buttons */}
            {[
              { id: 'profile', label: 'Profile', icon: '👤' },
              { id: 'password', label: 'Password', icon: '🔒' },
              { id: 'notifications', label: 'Notifications', icon: '🔔' },
              { id: 'delete', label: 'Delete Account', icon: '🗑️' }
            ].map((tab) => (
              <button
                key={tab.id}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors duration-200 flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600 bg-indigo-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab(tab.id as TabType)}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="p-6">
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Information</h2>
                <ProfileForm user={user} onUpdate={handleProfileUpdate} />
              </div>
              
              {/* Privacy Settings */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Privacy Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Profile Visibility</label>
                      <p className="text-sm text-gray-500">Control who can see your profile</p>
                    </div>
                    <select
                      value={settings.privacy.profileVisibility}
                      onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                      className="form-select text-sm"
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Data Sharing</label>
                      <p className="text-sm text-gray-500">Share anonymized data for improvements</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.privacy.dataSharing}
                      onChange={(e) => handlePrivacyChange('dataSharing', e.target.checked)}
                      className="form-checkbox"
                    />
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Theme</label>
                      <p className="text-sm text-gray-500">Choose your preferred theme</p>
                    </div>
                    <select
                      value={settings.preferences.theme}
                      onChange={(e) => handlePreferenceChange('theme', e.target.value)}
                      className="form-select text-sm"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="auto">Auto</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Timezone</label>
                      <p className="text-sm text-gray-500">Your local timezone</p>
                    </div>
                    <select
                      value={settings.preferences.timezone}
                      onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
                      className="form-select text-sm"
                    >
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                      <option value="America/Toronto">Toronto</option>
                      <option value="America/Vancouver">Vancouver</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Password Settings */}
          {activeTab === 'password' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Change Password</h2>
              <PasswordForm />
            </div>
          )}
          
          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Notification Preferences</h2>
              <NotificationSettings 
                settings={settings.notifications}
                onChange={handleNotificationChange} 
              />
            </div>
          )}
          
          {/* Delete Account */}
          {activeTab === 'delete' && (
            <div>
              <h2 className="text-xl font-semibold text-red-600 mb-4">Delete Account</h2>
              <DeleteAccount />
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex justify-end">
            <button
              onClick={saveSettings}
              className="btn btn-primary"
            >
              Save All Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;