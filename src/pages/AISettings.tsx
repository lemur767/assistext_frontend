// src/pages/AISettings.tsx - Complete implementation
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { profilesAPI } from '../api/profiles';
import { Zap, Save, RotateCcw, Settings, Brain, MessageSquare } from 'lucide-react';

const AISettings: React.FC = () => {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [settings, setSettings] = useState({
    ai_enabled: false,
    ai_instructions: '',
    daily_auto_response_limit: 100,
    response_style: 'professional',
    use_emojis: false,
    casual_language: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadProfiles();
  }, []);

  useEffect(() => {
    if (selectedProfile) {
      setSettings({
        ai_enabled: selectedProfile.ai_enabled,
        ai_instructions: selectedProfile.ai_instructions || '',
        daily_auto_response_limit: selectedProfile.daily_auto_response_limit,
        response_style: 'professional',
        use_emojis: false,
        casual_language: false,
      });
    }
  }, [selectedProfile]);

  const loadProfiles = async () => {
    try {
      setIsLoading(true);
      const data = await profilesAPI.getProfiles();
      setProfiles(data.profiles || []);
      if (data.profiles && data.profiles.length > 0) {
        setSelectedProfile(data.profiles[0]);
      }
    } catch (error) {
      console.error('Error loading profiles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedProfile) return;

    try {
      setIsSaving(true);
      await profilesAPI.updateAISettings(selectedProfile.id, {
        ai_enabled: settings.ai_enabled,
        ai_instructions: settings.ai_instructions,
        daily_auto_response_limit: settings.daily_auto_response_limit,
      });
      
      // Update local state
      setProfiles(prev => 
        prev.map(p => 
          p.id === selectedProfile.id 
            ? { ...p, ...settings }
            : p
        )
      );
      
      alert('AI settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const resetToDefaults = () => {
    setSettings({
      ai_enabled: true,
      ai_instructions: 'You are a helpful AI assistant. Respond professionally and helpfully to all messages.',
      daily_auto_response_limit: 100,
      response_style: 'professional',
      use_emojis: false,
      casual_language: false,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Zap className="w-7 h-7 mr-3 text-purple-600" />
              AI Settings
            </h1>
            <p className="text-gray-500 mt-1">Configure AI behavior and response styles</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={resetToDefaults}
              className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isSaving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Settings
            </button>
          </div>
        </div>

        {/* Profile Selector */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Profile</h3>
          <select
            value={selectedProfile?.id || ''}
            onChange={(e) => {
              const profile = profiles.find(p => p.id === parseInt(e.target.value));
              setSelectedProfile(profile);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {profiles.map(profile => (
              <option key={profile.id} value={profile.id}>
                {profile.name} ({profile.phone_number})
              </option>
            ))}
          </select>
        </div>

        {selectedProfile && (
          <div className="space-y-8">
            {/* Basic AI Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Basic Settings
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Enable AI Responses</h4>
                    <p className="text-sm text-gray-500">Automatically generate AI responses to incoming messages</p>
                  </div>
                  <button
                    onClick={() => setSettings(prev => ({ ...prev, ai_enabled: !prev.ai_enabled }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.ai_enabled ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.ai_enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Daily Response Limit
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={settings.daily_auto_response_limit}
                    onChange={(e) => setSettings(prev => ({ 
                      ...prev, 
                      daily_auto_response_limit: parseInt(e.target.value) 
                    }))}
                    className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Maximum AI responses per day (current: {selectedProfile.daily_ai_count || 0})
                  </p>
                </div>
              </div>
            </div>

            {/* AI Instructions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Brain className="w-5 h-5 mr-2" />
                AI Instructions
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  System Instructions
                </label>
                <textarea
                  value={settings.ai_instructions}
                  onChange={(e) => setSettings(prev => ({ ...prev, ai_instructions: e.target.value }))}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Provide detailed instructions for how the AI should respond..."
                />
                <p className="text-sm text-gray-500 mt-2">
                  These instructions will guide the AI's responses. Be specific about tone, style, and any special requirements.
                </p>
              </div>
            </div>

            {/* Response Style */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                Response Style
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Communication Style
                  </label>
                  <select
                    value={settings.response_style}
                    onChange={(e) => setSettings(prev => ({ ...prev, response_style: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="professional">Professional</option>
                    <option value="friendly">Friendly</option>
                    <option value="casual">Casual</option>
                    <option value="formal">Formal</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.use_emojis}
                      onChange={(e) => setSettings(prev => ({ ...prev, use_emojis: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Use Emojis</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.casual_language}
                      onChange={(e) => setSettings(prev => ({ ...prev, casual_language: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Casual Language</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AISettings;