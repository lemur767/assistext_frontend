// src/components/AISettings/AISettings.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { aiSettingsService } from '../../services/aiSettingService';
import { QUERY_KEYS } from '../../utils/constants';
import { useDebounce } from '../../hooks/useDebounce';
import toast from 'react-hot-toast';
import type { 
  AISettings as AISettingsType, 
  TextExample, 
  BaseComponentProps 
} from '../../types';

interface AISettingsProps extends BaseComponentProps {
  profileId: string;
}

type TabId = 'general' | 'personality' | 'training' | 'rules' | 'safety' | 'advanced';

export const AISettings: React.FC<AISettingsProps> = ({ 
  profileId, 
  className = '' 
}) => {
  const [activeTab, setActiveTab] = useState<TabId>('general');
  const queryClient = useQueryClient();

  // Fetch AI settings
  const { data: settings, isLoading } = useQuery({
    queryKey: QUERY_KEYS.aiSettings(profileId),
    queryFn: () => aiSettingsService.getSettings(profileId),
    enabled: !!profileId,
  });

  const tabs = [
    { id: 'general' as const, label: 'General Settings', icon: '⚙️', description: 'Basic AI configuration' },
    { id: 'personality' as const, label: 'Personality & Style', icon: '🎭', description: 'Communication style and tone' },
    { id: 'training' as const, label: 'Training Data', icon: '📚', description: 'Example conversations' },
    { id: 'rules' as const, label: 'Response Rules', icon: '📋', description: 'Automated reply conditions' },
    { id: 'safety' as const, label: 'Safety & Filters', icon: '🛡️', description: 'Content moderation' },
    { id: 'advanced' as const, label: 'Advanced', icon: '🔧', description: 'Technical parameters' },
  ];

  if (isLoading) {
    return <AISettingsSkeleton />;
  }

  return (
    <div className={`ai-settings max-w-6xl mx-auto space-y-6 ${className}`}>
      {/* Settings Header */}
      <div className="settings-header">
        <h1 className="text-3xl font-bold text-theme">AI Configuration</h1>
        <p className="text-neutral-500 mt-1">
          Customize how your AI assistant responds to messages
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-card rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
        <div className="grid grid-cols-2 lg:grid-cols-6 border-b border-neutral-200 dark:border-neutral-700">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`p-4 text-center transition-all duration-200 border-b-2 ${
                activeTab === tab.id
                  ? 'text-primary dark:text-primary-dark border-primary dark:border-primary-dark bg-primary/5 dark:bg-primary-dark/10'
                  : 'text-neutral-600 dark:text-neutral-400 border-transparent hover:text-primary dark:hover:text-primary-dark hover:bg-neutral-50 dark:hover:bg-neutral-800'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <div className="text-xl mb-1">{tab.icon}</div>
              <div className="font-medium text-sm">{tab.label}</div>
              <div className="text-xs text-neutral-400 mt-1 hidden lg:block">
                {tab.description}
              </div>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'general' && (
            <GeneralSettings settings={settings} profileId={profileId} />
          )}
          {activeTab === 'personality' && (
            <PersonalitySettings settings={settings} profileId={profileId} />
          )}
          {activeTab === 'training' && (
            <TrainingDataSettings settings={settings} profileId={profileId} />
          )}
          {activeTab === 'rules' && (
            <ResponseRulesSettings settings={settings} profileId={profileId} />
          )}
          {activeTab === 'safety' && (
            <SafetySettings settings={settings} profileId={profileId} />
          )}
          {activeTab === 'advanced' && (
            <AdvancedSettings settings={settings} profileId={profileId} />
          )}
        </div>
      </div>
    </div>
  );
};

// General Settings Tab
interface GeneralSettingsProps {
  settings?: AISettingsType;
  profileId: string;
}

const GeneralSettings: React.FC<GeneralSettingsProps> = ({ settings, profileId }) => {
  const [formData, setFormData] = useState({
    aiEnabled: settings?.aiEnabled || false,
    responseDelay: settings?.responseDelay || 2,
    maxResponseLength: settings?.maxResponseLength || 150,
    temperature: settings?.temperature || 0.7,
    model: settings?.model || 'dolphin-mistral:7b-v2.8',
  });

  const queryClient = useQueryClient();
  const debouncedFormData = useDebounce(formData, 500);

  const updateSettings = useMutation({
    mutationFn: (data: Partial<AISettingsType>) => 
      aiSettingsService.updateSettings(profileId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.aiSettings(profileId) });
      toast.success('Settings updated successfully');
    },
    onError: () => {
      toast.error('Failed to update settings');
    },
  });

  // Auto-save when form data changes
  useEffect(() => {
    if (settings && JSON.stringify(debouncedFormData) !== JSON.stringify({
      aiEnabled: settings.aiEnabled,
      responseDelay: settings.responseDelay,
      maxResponseLength: settings.maxResponseLength,
      temperature: settings.temperature,
      model: settings.model,
    })) {
      updateSettings.mutate(debouncedFormData);
    }
  }, [debouncedFormData, settings, updateSettings]);

  const handleChange = useCallback((field: keyof typeof formData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Basic Configuration */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-theme mb-4">Basic Configuration</h3>
            <p className="text-sm text-neutral-500 mb-6">
              Control when and how your AI responds to messages
            </p>
          </div>

          {/* AI Toggle */}
          <div className="setting-item">
            <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
              <div>
                <div className="font-semibold text-theme">Enable AI Responses</div>
                <div className="text-sm text-neutral-500">
                  Allow AI to automatically respond to incoming messages
                </div>
              </div>
              <ToggleSwitch
                checked={formData.aiEnabled}
                onChange={(checked) => handleChange('aiEnabled', checked)}
              />
            </div>
          </div>

          {formData.aiEnabled && (
            <>
              {/* Response Delay */}
              <div className="setting-item">
                <label className="form-label">Response Delay</label>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={formData.responseDelay}
                    onChange={(e) => handleChange('responseDelay', parseInt(e.target.value))}
                    className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-sm text-neutral-500">
                    <span>1s</span>
                    <span className="font-semibold text-primary dark:text-primary-dark">
                      {formData.responseDelay}s
                    </span>
                    <span>30s</span>
                  </div>
                  <p className="text-sm text-neutral-500">
                    Seconds to wait before sending AI response
                  </p>
                </div>
              </div>

              {/* Max Response Length */}
              <div className="setting-item">
                <label className="form-label">Maximum Response Length</label>
                <select
                  className="form-input"
                  value={formData.maxResponseLength}
                  onChange={(e) => handleChange('maxResponseLength', parseInt(e.target.value))}
                >
                  <option value={100}>Short (100 chars)</option>
                  <option value={150}>Medium (150 chars)</option>
                  <option value={200}>Long (200 chars)</option>
                  <option value={300}>Very Long (300 chars)</option>
                </select>
                <p className="form-help">
                  Maximum number of characters for AI responses
                </p>
              </div>
            </>
          )}
        </div>

        {/* AI Model Configuration */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-theme mb-4">AI Model Configuration</h3>
            <p className="text-sm text-neutral-500 mb-6">
              Advanced settings for AI behavior and performance
            </p>
          </div>

          {formData.aiEnabled && (
            <>
              {/* AI Temperature */}
              <div className="setting-item">
                <label className="form-label">Response Creativity</label>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.1"
                    value={formData.temperature}
                    onChange={(e) => handleChange('temperature', parseFloat(e.target.value))}
                    className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-sm text-neutral-500">
                    <span>Conservative</span>
                    <span className="font-semibold text-primary dark:text-primary-dark">
                      {formData.temperature}
                    </span>
                    <span>Creative</span>
                  </div>
                  <p className="text-sm text-neutral-500">
                    Higher values make responses more creative and varied
                  </p>
                </div>
              </div>

              {/* LLM Model Selection */}
              <div className="setting-item">
                <label className="form-label">AI Model</label>
                <select
                  className="form-input"
                  value={formData.model}
                  onChange={(e) => handleChange('model', e.target.value)}
                >
                  <option value="dolphin-mistral:7b-v2.8">Dolphin Mistral 7B (Recommended)</option>
                  <option value="llama2:7b">Llama 2 7B</option>
                  <option value="codellama:7b">Code Llama 7B</option>
                  <option value="neural-chat:7b">Neural Chat 7B</option>
                </select>
                <p className="form-help">
                  Choose the AI model for generating responses
                </p>
              </div>
            </>
          )}

          {/* Status Indicator */}
          <div className="bg-primary/10 dark:bg-primary-dark/20 border border-primary/20 dark:border-primary-dark/20 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${formData.aiEnabled ? 'bg-success' : 'bg-neutral-400'}`} />
              <div>
                <div className="font-semibold text-theme">
                  AI Status: {formData.aiEnabled ? 'Active' : 'Inactive'}
                </div>
                <div className="text-sm text-neutral-500">
                  {formData.aiEnabled 
                    ? 'AI will automatically respond to messages' 
                    : 'Manual responses only'
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Personality Settings Tab
interface PersonalitySettingsProps {
  settings?: AISettingsType;
  profileId: string;
}

const PersonalitySettings: React.FC<PersonalitySettingsProps> = ({ settings, profileId }) => {
  const [formData, setFormData] = useState({
    personality: settings?.personality || 'friendly',
    tone: settings?.tone || 'professional',
    customInstructions: settings?.customInstructions || '',
    styleNotes: settings?.styleNotes || '',
    useEmojis: settings?.useEmojis || false,
    casualLanguage: settings?.casualLanguage || true,
  });

  const queryClient = useQueryClient();
  const debouncedFormData = useDebounce(formData, 1000);

  const updateSettings = useMutation({
    mutationFn: (data: Partial<AISettingsType>) => 
      aiSettingsService.updatePersonality(profileId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.aiSettings(profileId) });
      toast.success('Personality settings updated');
    },
  });

  useEffect(() => {
    if (settings) {
      updateSettings.mutate(debouncedFormData);
    }
  }, [debouncedFormData, settings, updateSettings]);

  const handleChange = useCallback((field: keyof typeof formData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const personalityOptions = [
    { 
      value: 'friendly', 
      label: 'Friendly', 
      description: 'Warm and approachable',
      icon: '😊',
      color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
    },
    { 
      value: 'professional', 
      label: 'Professional', 
      description: 'Business-like and courteous',
      icon: '💼',
      color: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300'
    },
    { 
      value: 'flirty', 
      label: 'Flirty', 
      description: 'Playful and charming',
      icon: '😉',
      color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300'
    },
    { 
      value: 'mysterious', 
      label: 'Mysterious', 
      description: 'Intriguing and enigmatic',
      icon: '🌙',
      color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Personality Type */}
      <div>
        <h3 className="text-lg font-semibold text-theme mb-4">Personality Type</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {personalityOptions.map(personality => (
            <div
              key={personality.value}
              className={`cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 ${
                formData.personality === personality.value
                  ? 'border-primary dark:border-primary-dark bg-primary/10 dark:bg-primary-dark/20'
                  : 'border-neutral-200 dark:border-neutral-700 hover:border-primary/50 dark:hover:border-primary-dark/50'
              }`}
              onClick={() => handleChange('personality', personality.value)}
            >
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg text-lg mb-3 ${personality.color}`}>
                {personality.icon}
              </div>
              <h4 className="font-semibold text-theme mb-1">{personality.label}</h4>
              <p className="text-sm text-neutral-500">{personality.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Communication Tone */}
      <div>
        <label className="form-label">Communication Tone</label>
        <select
          className="form-input"
          value={formData.tone}
          onChange={(e) => handleChange('tone', e.target.value)}
        >
          <option value="casual">Casual & Relaxed</option>
          <option value="professional">Professional</option>
          <option value="intimate">Intimate & Personal</option>
          <option value="playful">Playful & Fun</option>
          <option value="sophisticated">Sophisticated</option>
        </select>
      </div>

      {/* Custom Instructions */}
      <div>
        <label className="form-label">Custom Instructions</label>
        <textarea
          className="form-input h-32 resize-none"
          placeholder="e.g., Always be supportive and understanding. Use British spelling. Mention availability for weekends."
          value={formData.customInstructions}
          onChange={(e) => handleChange('customInstructions', e.target.value)}
        />
        <p className="form-help">
          Specific instructions for how your AI should behave and respond
        </p>
      </div>

      {/* Style Notes */}
      <div>
        <label className="form-label">Writing Style Notes</label>
        <textarea
          className="form-input h-24 resize-none"
          placeholder="e.g., Use short sentences. Avoid formal language. Include questions to keep conversation flowing."
          value={formData.styleNotes}
          onChange={(e) => handleChange('styleNotes', e.target.value)}
        />
        <p className="form-help">
          How should your AI write and structure messages?
        </p>
      </div>

      {/* Communication Preferences */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="setting-item">
          <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
            <div>
              <div className="font-semibold text-theme">Use Emojis</div>
              <div className="text-sm text-neutral-500">
                Include emojis in AI responses for more engaging communication
              </div>
            </div>
            <ToggleSwitch
              checked={formData.useEmojis}
              onChange={(checked) => handleChange('useEmojis', checked)}
            />
          </div>
        </div>

        <div className="setting-item">
          <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
            <div>
              <div className="font-semibold text-theme">Casual Language</div>
              <div className="text-sm text-neutral-500">
                Use contractions and informal language (e.g., "I'm" instead of "I am")
              </div>
            </div>
            <ToggleSwitch
              checked={formData.casualLanguage}
              onChange={(checked) => handleChange('casualLanguage', checked)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Training Data Settings Tab
interface TrainingDataSettingsProps {
  settings?: AISettingsType;
  profileId: string;
}

const TrainingDataSettings: React.FC<TrainingDataSettingsProps> = ({ settings, profileId }) => {
  const [examples, setExamples] = useState<TextExample[]>([]);
  const [newExample, setNewExample] = useState({ incoming: '', outgoing: '' });
  const [importMode, setImportMode] = useState(false);
  const [importText, setImportText] = useState('');

  const queryClient = useQueryClient();

  // Fetch text examples
  const { data: textExamples = [] } = useQuery({
    queryKey: ['textExamples', profileId],
    queryFn: () => aiSettingsService.getTextExamples(profileId),
  });

  useEffect(() => {
    setExamples(textExamples);
  }, [textExamples]);

  // Add example mutation
  const addExampleMutation = useMutation({
    mutationFn: (example: { incoming: string; outgoing: string }) => 
      aiSettingsService.addTextExample(profileId, example),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['textExamples', profileId] });
      setNewExample({ incoming: '', outgoing: '' });
      toast.success('Example added successfully');
    },
  });

  // Delete example mutation
  const deleteExampleMutation = useMutation({
    mutationFn: (exampleId: string) => aiSettingsService.deleteTextExample(exampleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['textExamples', profileId] });
      toast.success('Example deleted');
    },
  });

  // Bulk import mutation
  const bulkImportMutation = useMutation({
    mutationFn: (data: { text: string }) => 
      aiSettingsService.bulkImportExamples(profileId, data),
    onSuccess: (result: { imported: number }) => {
      queryClient.invalidateQueries({ queryKey: ['textExamples', profileId] });
      setImportText('');
      setImportMode(false);
      toast.success(`Imported ${result.imported} examples`);
    },
  });

  const handleAddExample = useCallback(() => {
    if (newExample.incoming.trim() && newExample.outgoing.trim()) {
      addExampleMutation.mutate(newExample);
    }
  }, [newExample, addExampleMutation]);

  const handleBulkImport = useCallback(() => {
    if (importText.trim()) {
      bulkImportMutation.mutate({ text: importText });
    }
  }, [importText, bulkImportMutation]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-theme">Training Examples</h3>
          <p className="text-sm text-neutral-500">
            Current examples: {examples.length} • Minimum 10 recommended
          </p>
        </div>
        <button
          className="btn btn-secondary"
          onClick={() => setImportMode(!importMode)}
        >
          {importMode ? 'Manual Entry' : 'Bulk Import'}
        </button>
      </div>

      {/* Progress Indicator */}
      <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-theme">Training Progress</span>
          <span className="text-sm text-neutral-500">{examples.length}/10</span>
        </div>
        <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
          <div 
            className="bg-primary dark:bg-primary-dark h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min((examples.length / 10) * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* Manual Entry Mode */}
      {!importMode && (
        <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-6">
          <h4 className="font-semibold text-theme mb-4">Add New Example</h4>
          <div className="space-y-4">
            <div>
              <label className="form-label">Client Message</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Hey, are you available tonight?"
                value={newExample.incoming}
                onChange={(e) => setNewExample(prev => ({ ...prev, incoming: e.target.value }))}
              />
            </div>
            <div>
              <label className="form-label">Your Response</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Hi! Let me check my schedule and get back to you 😊"
                value={newExample.outgoing}
                onChange={(e) => setNewExample(prev => ({ ...prev, outgoing: e.target.value }))}
              />
            </div>
            <button
              className="btn btn-primary"
              onClick={handleAddExample}
              disabled={!newExample.incoming.trim() || !newExample.outgoing.trim() || addExampleMutation.isPending}
            >
              {addExampleMutation.isPending ? 'Adding...' : 'Add Example'}
            </button>
          </div>
        </div>
      )}

      {/* Bulk Import Mode */}
      {importMode && (
        <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-6">
          <h4 className="font-semibold text-theme mb-4">Bulk Import</h4>
          <div className="space-y-4">
            <div>
              <label className="form-label">Conversation History</label>
              <textarea
                className="form-input h-40 resize-none font-mono text-sm"
                placeholder={`Paste your conversation history here.`}
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
              />
              <p className="form-help">
                AI will automatically parse conversations and extract examples
              </p>
            </div>
            <button
              className="btn btn-primary"
              onClick={handleBulkImport}
              disabled={!importText.trim() || bulkImportMutation.isPending}
            >
              {bulkImportMutation.isPending ? 'Processing...' : 'Import Examples'}
            </button>
          </div>
        </div>
      )}

      {/* Examples List */}
      <div>
        <h4 className="font-semibold text-theme mb-4">Training Examples</h4>
        {examples.length === 0 ? (
          <div className="text-center py-12 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
            <div className="text-4xl mb-3">📝</div>
            <p className="text-neutral-500 mb-2">No training examples yet</p>
            <p className="text-sm text-neutral-400">Add examples to improve AI responses</p>
          </div>
        ) : (
          <div className="space-y-4">
            {examples.map((example) => (
              <ExampleCard
                key={example.id}
                example={example}
                onDelete={() => deleteExampleMutation.mutate(example.id)}
                isDeleting={deleteExampleMutation.isPending}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Example Card Component
interface ExampleCardProps {
  example: TextExample;
  onDelete: () => void;
  isDeleting: boolean;
}

const ExampleCard: React.FC<ExampleCardProps> = ({ example, onDelete, isDeleting }) => {
  return (
    <div className="bg-card border border-neutral-200 dark:border-neutral-700 rounded-lg p-4">
      <div className="flex gap-4">
        <div className="flex-1 space-y-3">
          <div className="flex items-start gap-3">
            <div className="bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 px-2 py-1 rounded text-xs font-medium">
              Client:
            </div>
            <div className="flex-1 text-sm text-theme">{example.incoming}</div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 dark:bg-primary-dark/20 text-primary dark:text-primary-dark px-2 py-1 rounded text-xs font-medium">
              You:
            </div>
            <div className="flex-1 text-sm text-theme">{example.outgoing}</div>
          </div>
        </div>
        <button
          className="btn btn-ghost btn-sm text-error hover:bg-error/10"
          onClick={onDelete}
          disabled={isDeleting}
          title="Delete example"
        >
          {isDeleting ? (
            <div className="loading-spinner w-4 h-4" />
          ) : (
            <TrashIcon className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
};

// Placeholder components for other tabs
const ResponseRulesSettings: React.FC<{ settings?: AISettingsType; profileId: string }> = () => (
  <div className="text-center py-12">
    <div className="text-4xl mb-4">📋</div>
    <h3 className="text-lg font-semibold text-theme mb-2">Response Rules</h3>
    <p className="text-neutral-500">Configure automatic response conditions and triggers</p>
  </div>
);

const SafetySettings: React.FC<{ settings?: AISettingsType; profileId: string }> = () => (
  <div className="text-center py-12">
    <div className="text-4xl mb-4">🛡️</div>
    <h3 className="text-lg font-semibold text-theme mb-2">Safety & Filters</h3>
    <p className="text-neutral-500">Content moderation and safety features</p>
  </div>
);

const AdvancedSettings: React.FC<{ settings?: AISettingsType; profileId: string }> = () => (
  <div className="text-center py-12">
    <div className="text-4xl mb-4">🔧</div>
    <h3 className="text-lg font-semibold text-theme mb-2">Advanced Settings</h3>
    <p className="text-neutral-500">Technical parameters and fine-tuning options</p>
  </div>
);

// Toggle Switch Component
interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, disabled = false }) => {
  return (
    <button
      type="button"
      className={`toggle-switch ${checked ? 'active' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
    >
      <div className="toggle-handle" />
    </button>
  );
};

// Loading Skeleton
const AISettingsSkeleton: React.FC = () => (
  <div className="ai-settings max-w-6xl mx-auto space-y-6">
    <div>
      <div className="skeleton h-8 w-64 mb-2" />
      <div className="skeleton h-4 w-96" />
    </div>
    
    <div className="bg-card rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
      <div className="grid grid-cols-6 border-b border-neutral-200 dark:border-neutral-700">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="p-4">
            <div className="skeleton h-6 w-6 mx-auto mb-2" />
            <div className="skeleton h-4 w-16 mx-auto mb-1" />
            <div className="skeleton h-3 w-12 mx-auto" />
          </div>
        ))}
      </div>
      <div className="p-6">
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="skeleton h-6 w-48 mb-4" />
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="skeleton h-4 w-32" />
                <div className="skeleton h-10 w-full" />
              </div>
            ))}
          </div>
          <div className="space-y-6">
            <div className="skeleton h-6 w-48 mb-4" />
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="skeleton h-4 w-32" />
                <div className="skeleton h-10 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Icon
const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

export default AISettings;