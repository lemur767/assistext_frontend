import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Brain, 
  MessageSquare, 
  Settings, 
  Save, 
  RefreshCw,
  Zap,
  Clock,
  User,
  Sliders,
  TestTube,
  Send,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

interface AISettings {
  personality: string;
  instructions: string;
  model: string;
  temperature: number;
  max_tokens: number;
  response_style: string;
  auto_reply_enabled: boolean;
  auto_reply_delay: number;
  business_hours_only: boolean;
  greeting_message: string;
  fallback_message: string;
  typing_indicator: boolean;
  context_memory: number;
}

interface AIModel {
  id: string;
  name: string;
  description: string;
  max_tokens: number;
  cost_per_token: number;
  speed: 'fast' | 'medium' | 'slow';
  capabilities: string[];
}

interface TestMessage {
  content: string;
  response: string;
  timestamp: Date;
  status: 'success' | 'error' | 'pending';
}

const AISettings: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const [settings, setSettings] = useState<AISettings>({
    personality: 'professional',
    instructions: '',
    model: 'gpt-4',
    temperature: 0.7,
    max_tokens: 150,
    response_style: 'concise',
    auto_reply_enabled: true,
    auto_reply_delay: 2,
    business_hours_only: false,
    greeting_message: '',
    fallback_message: '',
    typing_indicator: true,
    context_memory: 5
  });

  const [testMessage, setTestMessage] = useState('');
  const [testHistory, setTestHistory] = useState<TestMessage[]>([]);

  const availableModels: AIModel[] = [
    {
      id: 'gpt-4',
      name: 'GPT-4',
      description: 'Most capable model, best for complex conversations',
      max_tokens: 8192,
      cost_per_token: 0.03,
      speed: 'medium',
      capabilities: ['reasoning', 'creativity', 'coding', 'analysis']
    },
    {
      id: 'gpt-3.5-turbo',
      name: 'GPT-3.5 Turbo',
      description: 'Fast and efficient, great for most conversations',
      max_tokens: 4096,
      cost_per_token: 0.002,
      speed: 'fast',
      capabilities: ['conversation', 'summarization', 'q&a']
    },
    {
      id: 'claude-3',
      name: 'Claude 3',
      description: 'Excellent for detailed analysis and creative tasks',
      max_tokens: 200000,
      cost_per_token: 0.015,
      speed: 'medium',
      capabilities: ['analysis', 'writing', 'reasoning', 'safety']
    },
    {
      id: 'llama-2',
      name: 'Llama 2',
      description: 'Open source model, cost-effective',
      max_tokens: 4096,
      cost_per_token: 0.001,
      speed: 'fast',
      capabilities: ['conversation', 'coding', 'summarization']
    }
  ];

  const personalityOptions = [
    { value: 'professional', label: 'Professional', description: 'Formal, business-focused responses' },
    { value: 'friendly', label: 'Friendly', description: 'Warm, approachable tone' },
    { value: 'casual', label: 'Casual', description: 'Relaxed, conversational style' },
    { value: 'technical', label: 'Technical', description: 'Detailed, precise explanations' },
    { value: 'empathetic', label: 'Empathetic', description: 'Understanding, supportive responses' },
    { value: 'concise', label: 'Concise', description: 'Brief, to-the-point answers' }
  ];

  const responseStyleOptions = [
    { value: 'concise', label: 'Concise', description: 'Short and direct responses' },
    { value: 'detailed', label: 'Detailed', description: 'Comprehensive explanations' },
    { value: 'conversational', label: 'Conversational', description: 'Natural, flowing dialogue' },
    { value: 'bullet_points', label: 'Bullet Points', description: 'Structured, easy to scan' }
  ];

  // Load settings on component mount
  useEffect(() => {
    loadAISettings();
  }, []);

  const loadAISettings = async () => {
    try {
      const response = await fetch('/api/ai/settings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Failed to load AI settings:', error);
    }
  };

  const handleInputChange = (key: keyof AISettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setHasUnsavedChanges(true);
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/ai/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(settings)
      });

      if (!response.ok) {
        throw new Error('Failed to save settings');
      }

      setHasUnsavedChanges(false);
      toast.success('AI settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save AI settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestMessage = async () => {
    if (!testMessage.trim()) {
      toast.error('Please enter a test message');
      return;
    }

    setIsTesting(true);
    
    const newTest: TestMessage = {
      content: testMessage,
      response: '',
      timestamp: new Date(),
      status: 'pending'
    };

    setTestHistory(prev => [newTest, ...prev.slice(0, 4)]);

    try {
      const response = await fetch('/api/ai/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          message: testMessage,
          settings: settings
        })
      });

      if (!response.ok) {
        throw new Error('Test failed');
      }

      const data = await response.json();
      
      setTestHistory(prev => [
        {
          ...prev[0],
          response: data.response,
          status: 'success'
        },
        ...prev.slice(1)
      ]);
      
      setTestMessage('');
    } catch (error) {
      setTestHistory(prev => [
        {
          ...prev[0],
          response: 'Error: Failed to generate response',
          status: 'error'
        },
        ...prev.slice(1)
      ]);
    } finally {
      setIsTesting(false);
    }
  };

  const selectedModel = availableModels.find(m => m.id === settings.model);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            AI Settings
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Configure your AI assistant's personality, behavior, and responses
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Model Selection */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-6">
                AI Model Selection
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableModels.map(model => (
                  <div
                    key={model.id}
                    className={`
                      border rounded-lg p-4 cursor-pointer transition-all
                      ${settings.model === model.id
                        ? 'border-brand-primary bg-brand-primary/5'
                        : 'border-slate-200 dark:border-slate-700 hover:border-brand-primary/50'
                      }
                    `}
                    onClick={() => handleInputChange('model', model.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-slate-900 dark:text-slate-100">
                        {model.name}
                      </h3>
                      <span className={`badge ${
                        model.speed === 'fast' ? 'badge-success' : 
                        model.speed === 'medium' ? 'badge-warning' : 'badge-error'
                      }`}>
                        {model.speed}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                      {model.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {model.capabilities.slice(0, 3).map(cap => (
                        <span key={cap} className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-2 py-1 rounded">
                          {cap}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Personality & Style */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-6">
                Personality & Response Style
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                    Personality
                  </label>
                  <div className="space-y-2">
                    {personalityOptions.map(option => (
                      <div
                        key={option.value}
                        className={`
                          border rounded-lg p-3 cursor-pointer transition-all
                          ${settings.personality === option.value
                            ? 'border-brand-primary bg-brand-primary/5'
                            : 'border-slate-200 dark:border-slate-700 hover:border-brand-primary/50'
                          }
                        `}
                        onClick={() => handleInputChange('personality', option.value)}
                      >
                        <div className="font-medium text-slate-900 dark:text-slate-100">
                          {option.label}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          {option.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                    Response Style
                  </label>
                  <div className="space-y-2">
                    {responseStyleOptions.map(option => (
                      <div
                        key={option.value}
                        className={`
                          border rounded-lg p-3 cursor-pointer transition-all
                          ${settings.response_style === option.value
                            ? 'border-brand-primary bg-brand-primary/5'
                            : 'border-slate-200 dark:border-slate-700 hover:border-brand-primary/50'
                          }
                        `}
                        onClick={() => handleInputChange('response_style', option.value)}
                      >
                        <div className="font-medium text-slate-900 dark:text-slate-100">
                          {option.label}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          {option.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Custom Instructions */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-6">
                Custom Instructions
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    System Instructions
                  </label>
                  <textarea
                    value={settings.instructions}
                    onChange={(e) => handleInputChange('instructions', e.target.value)}
                    rows={6}
                    className="form-input"
                    placeholder="Enter specific instructions for how the AI should behave, respond, and interact with users. For example: 'You are a helpful customer service assistant for a tech company. Always be polite, provide clear solutions, and ask follow-up questions when needed.'"
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    These instructions will be included in every conversation to guide the AI's behavior.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Greeting Message
                    </label>
                    <textarea
                      value={settings.greeting_message}
                      onChange={(e) => handleInputChange('greeting_message', e.target.value)}
                      rows={3}
                      className="form-input"
                      placeholder="Hi! How can I help you today?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Fallback Message
                    </label>
                    <textarea
                      value={settings.fallback_message}
                      onChange={(e) => handleInputChange('fallback_message', e.target.value)}
                      rows={3}
                      className="form-input"
                      placeholder="I'm sorry, I didn't understand that. Could you please rephrase your question?"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Advanced Settings */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-6">
                Advanced Settings
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Creativity Level
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={settings.temperature}
                      onChange={(e) => handleInputChange('temperature', parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Focused (0.0)</span>
                      <span>Current: {settings.temperature}</span>
                      <span>Creative (1.0)</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Max Response Length
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="50"
                      max={selectedModel?.max_tokens || 4096}
                      step="50"
                      value={settings.max_tokens}
                      onChange={(e) => handleInputChange('max_tokens', parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Short (50)</span>
                      <span>Current: {settings.max_tokens}</span>
                      <span>Long ({selectedModel?.max_tokens || 4096})</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Auto-Reply Delay (seconds)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={settings.auto_reply_delay}
                    onChange={(e) => handleInputChange('auto_reply_delay', parseInt(e.target.value))}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Context Memory (messages)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={settings.context_memory}
                    onChange={(e) => handleInputChange('context_memory', parseInt(e.target.value))}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-slate-100">
                      Auto-Reply Enabled
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Automatically respond to incoming messages
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.auto_reply_enabled}
                      onChange={(e) => handleInputChange('auto_reply_enabled', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-primary/25 dark:peer-focus:ring-brand-primary/50 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-primary"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-slate-100">
                      Business Hours Only
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Only auto-reply during business hours
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.business_hours_only}
                      onChange={(e) => handleInputChange('business_hours_only', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-primary/25 dark:peer-focus:ring-brand-primary/50 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-primary"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-slate-100">
                      Typing Indicator
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Show typing indicator while generating response
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.typing_indicator}
                      onChange={(e) => handleInputChange('typing_indicator', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-primary/25 dark:peer-focus:ring-brand-primary/50 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-primary"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Testing Panel */}
          <div className="space-y-6">
            {/* Test AI */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Test Your AI
              </h3>

              <div className="space-y-4">
                <div>
                  <textarea
                    value={testMessage}
                    onChange={(e) => setTestMessage(e.target.value)}
                    rows={3}
                    className="form-input"
                    placeholder="Type a message to test your AI's response..."
                  />
                </div>

                <button
                  onClick={handleTestMessage}
                  disabled={isTesting || !testMessage.trim()}
                  className="btn-primary w-full flex items-center justify-center space-x-2"
                >
                  {isTesting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span>{isTesting ? 'Testing...' : 'Test Message'}</span>
                </button>
              </div>

              {/* Test History */}
              {testHistory.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-3">
                    Test Results
                  </h4>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {testHistory.map((test, index) => (
                      <div key={index} className="border border-slate-200 dark:border-slate-700 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                            You
                          </span>
                          <span className="text-xs text-slate-500">
                            {test.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                          {test.content}
                        </p>
                        
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                            AI
                          </span>
                          {test.status === 'success' && (
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                          )}
                          {test.status === 'error' && (
                            <AlertCircle className="w-4 h-4 text-red-500" />
                          )}
                          {test.status === 'pending' && (
                            <RefreshCw className="w-4 h-4 animate-spin text-brand-primary" />
                          )}
                        </div>
                        <p className="text-sm text-slate-900 dark:text-slate-100">
                          {test.response || 'Generating response...'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Save Settings */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Save Changes
              </h3>
              
              {hasUnsavedChanges && (
                <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    You have unsaved changes
                  </p>
                </div>
              )}

              <button
                onClick={handleSaveSettings}
                disabled={isLoading || !hasUnsavedChanges}
                className="btn-primary w-full flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{isLoading ? 'Saving...' : 'Save AI Settings'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISettings;