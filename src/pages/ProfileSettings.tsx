import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  User, 
  Bot, 
  Clock, 
  Shield, 
  Phone, 
  Settings,
  CheckCircle,
  AlertTriangle,
  Info,
  Save,
  Moon,
  Sun,
  Eye,
  EyeOff
} from 'lucide-react';

// Updated hooks for the new user-based system
import {
  useUser,
  useUpdateUser,
  useUpdateAISettings,
  useUpdateAutoReplySettings,
  useUpdateBusinessHours,
  useUpdateSecuritySettings,
  useUpdateSignalWireSettings,
  useChangePassword,
  useUserUtils
} from '../hooks/useUser';

import { useDarkMode } from '../hooks/useDarkMode';
import { 
  AI_RESPONSE_STYLES, 
  LANGUAGES, 
  TIMEZONES, 
  BUSINESS_DAYS 
} from '../utils/constants';

import type { User as UserType } from '../types';

// =============================================================================
// MAIN COMPONENT
// =============================================================================

const ProfileSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Get user data and utilities
  const { data: user, isLoading } = useUser();
  const { 
    displayName, 
    hasCompletedSetup, 
    isInBusinessHours, 
    isOutOfOffice, 
    isAIEnabled 
  } = useUserUtils();

  // Dark mode hook
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  // Mutation hooks
  const updateUserMutation = useUpdateUser();
  const updateAIMutation = useUpdateAISettings();
  const updateAutoReplyMutation = useUpdateAutoReplySettings();
  const updateBusinessHoursMutation = useUpdateBusinessHours();
  const updateSecurityMutation = useUpdateSecuritySettings();
  const updateSignalWireMutation = useUpdateSignalWireSettings();
  const changePasswordMutation = useChangePassword();

  // Show success/error messages
  const showMessage = (message: string, isError = false) => {
    if (isError) {
      setErrorMessage(message);
      setSuccessMessage('');
    } else {
      setSuccessMessage(message);
      setErrorMessage('');
    }
    setTimeout(() => {
      setSuccessMessage('');
      setErrorMessage('');
    }, 5000);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'ai', label: 'AI Settings', icon: Bot },
    { id: 'auto-reply', label: 'Auto Reply', icon: Settings },
    { id: 'business-hours', label: 'Hours', icon: Clock },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'signalwire', label: 'SignalWire', icon: Phone },
  ];

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-brand-bg dark:bg-brand-bg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-brand-text dark:text-brand-text-dark">Loading your settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg dark:bg-brand-bg-dark transition-colors duration-300">
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-brand-text dark:text-brand-text-dark mb-2">
                Profile Settings
              </h1>
              <p className="text-brand-text/70 dark:text-brand-text-dark/70 text-lg">
                Manage your account settings and AI configuration
              </p>
            </div>
            
            {/* Header Actions */}
            <div className="flex items-center gap-4">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-3 rounded-xl bg-white/80 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 hover:bg-white dark:hover:bg-surface-700 transition-all duration-200 shadow-sm"
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-brand-primary dark:text-brand-primary-dark" />
                ) : (
                  <Moon className="w-5 h-5 text-brand-text" />
                )}
              </button>
              
              {/* Setup Status Badge */}
              {hasCompletedSetup ? (
                <div className="flex items-center gap-2 px-4 py-2 bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-success-600 dark:text-success-400" />
                  <span className="text-success-700 dark:text-success-300 font-medium">Setup Complete</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-4 py-2 bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 rounded-xl">
                  <AlertTriangle className="w-5 h-5 text-warning-600 dark:text-warning-400" />
                  <span className="text-warning-700 dark:text-warning-300 font-medium">Setup Incomplete</span>
                </div>
              )}
            </div>
          </div>

          {/* Status Messages */}
          {successMessage && (
            <div className="mb-6 p-4 bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 rounded-xl flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-success-600 dark:text-success-400 flex-shrink-0" />
              <p className="text-success-700 dark:text-success-300">{successMessage}</p>
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 p-4 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-xl flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-error-600 dark:text-error-400 flex-shrink-0" />
              <p className="text-error-700 dark:text-error-300">{errorMessage}</p>
            </div>
          )}

          {/* Status Overview */}
          <div className="bg-white/80 dark:bg-surface-800 backdrop-blur-sm border border-surface-200 dark:border-surface-700 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-5 h-5 text-brand-primary dark:text-brand-primary-dark" />
              <h3 className="text-lg font-semibold text-brand-text dark:text-brand-text-dark">Account Status</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatusIndicator 
                label="AI Assistant" 
                isActive={isAIEnabled} 
                activeText="Enabled" 
                inactiveText="Disabled" 
              />
              <StatusIndicator 
                label="SignalWire" 
                isActive={user.signalwire_configured} 
                activeText="Connected" 
                inactiveText="Not Connected" 
              />
              <StatusIndicator 
                label="Business Hours" 
                isActive={isInBusinessHours} 
                activeText="Open" 
                inactiveText="Closed" 
              />
              <StatusIndicator 
                label="Availability" 
                isActive={!isOutOfOffice} 
                activeText="Available" 
                inactiveText="Out of Office" 
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="bg-white/80 dark:bg-surface-800 backdrop-blur-sm border border-surface-200 dark:border-surface-700 rounded-2xl p-2 shadow-sm sticky top-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                      isActive
                        ? 'bg-brand-primary text-white shadow-md'
                        : 'text-brand-text dark:text-brand-text-dark hover:bg-surface-50 dark:hover:bg-surface-700'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <ProfileForm 
                user={user} 
                onUpdate={updateUserMutation.mutate}
                isLoading={updateUserMutation.isPending}
                onSuccess={showMessage}
                onError={(message) => showMessage(message, true)}
              />
            )}
            
            {activeTab === 'ai' && (
              <AISettingsForm 
                user={user}
                onUpdate={updateAIMutation.mutate}
                isLoading={updateAIMutation.isPending}
                onSuccess={showMessage}
                onError={(message) => showMessage(message, true)}
              />
            )}
            
            {activeTab === 'auto-reply' && (
              <AutoReplyForm 
                user={user}
                onUpdate={updateAutoReplyMutation.mutate}
                isLoading={updateAutoReplyMutation.isPending}
                onSuccess={showMessage}
                onError={(message) => showMessage(message, true)}
              />
            )}
            
            {activeTab === 'business-hours' && (
              <BusinessHoursForm 
                user={user}
                onUpdate={updateBusinessHoursMutation.mutate}
                isLoading={updateBusinessHoursMutation.isPending}
                onSuccess={showMessage}
                onError={(message) => showMessage(message, true)}
              />
            )}
            
            {activeTab === 'security' && (
              <SecurityForm 
                user={user}
                onUpdate={updateSecurityMutation.mutate}
                isLoading={updateSecurityMutation.isPending}
                onSuccess={showMessage}
                onError={(message) => showMessage(message, true)}
              />
            )}
            
            {activeTab === 'signalwire' && (
              <SignalWireForm 
                user={user}
                onUpdate={updateSignalWireMutation.mutate}
                isLoading={updateSignalWireMutation.isPending}
                onSuccess={showMessage}
                onError={(message) => showMessage(message, true)}
              />
            )}
            
            {/* Password Change Section - Always visible at bottom */}
            {activeTab === 'security' && (
              <div className="mt-8">
                <PasswordChangeForm 
                  onSubmit={changePasswordMutation.mutate}
                  isLoading={changePasswordMutation.isPending}
                  onSuccess={showMessage}
                  onError={(message) => showMessage(message, true)}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

const StatusIndicator: React.FC<{
  label: string;
  isActive: boolean;
  activeText: string;
  inactiveText: string;
}> = ({ label, isActive, activeText, inactiveText }) => (
  <div className="flex items-center gap-3">
    <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-success-500' : 'bg-surface-400 dark:bg-surface-600'}`} />
    <div>
      <p className="text-sm font-medium text-brand-text dark:text-brand-text-dark">{label}</p>
      <p className={`text-xs ${isActive ? 'text-success-600 dark:text-success-400' : 'text-surface-500 dark:text-surface-400'}`}>
        {isActive ? activeText : inactiveText}
      </p>
    </div>
  </div>
);

const FormCard: React.FC<{ title: string; description: string; children: React.ReactNode }> = ({ 
  title, 
  description, 
  children 
}) => (
  <div className="bg-white/80 dark:bg-surface-800 backdrop-blur-sm border border-surface-200 dark:border-surface-700 rounded-2xl shadow-sm">
    <div className="p-6 border-b border-surface-200 dark:border-surface-700">
      <h2 className="text-xl font-semibold text-brand-text dark:text-brand-text-dark mb-1">{title}</h2>
      <p className="text-brand-text/70 dark:text-brand-text-dark/70">{description}</p>
    </div>
    <div className="p-6">
      {children}
    </div>
  </div>
);

const InputField: React.FC<{
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  register?: any;
  error?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPassword?: boolean;
  onTogglePassword?: () => void;
}> = ({ 
  label, 
  id, 
  type = 'text', 
  placeholder, 
  register, 
  error, 
  value, 
  onChange,
  showPassword,
  onTogglePassword
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-brand-text dark:text-brand-text-dark mb-2">
      {label}
    </label>
    <div className="relative">
      <input
        id={id}
        type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...(register ? register : {})}
        className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-surface-900 text-brand-text dark:text-brand-text-dark placeholder-surface-400 dark:placeholder-surface-500 focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all duration-200 ${
          error 
            ? 'border-error-300 dark:border-error-600' 
            : 'border-surface-200 dark:border-surface-700'
        }`}
      />
      {type === 'password' && onTogglePassword && (
        <button
          type="button"
          onClick={onTogglePassword}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 dark:text-surface-500 hover:text-brand-text dark:hover:text-brand-text-dark"
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      )}
    </div>
    {error && (
      <p className="mt-1 text-sm text-error-600 dark:text-error-400">{error}</p>
    )}
  </div>
);

const TextareaField: React.FC<{
  label: string;
  id: string;
  placeholder?: string;
  rows?: number;
  register?: any;
  error?: string;
}> = ({ label, id, placeholder, rows = 3, register, error }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-brand-text dark:text-brand-text-dark mb-2">
      {label}
    </label>
    <textarea
      id={id}
      rows={rows}
      placeholder={placeholder}
      {...(register ? register : {})}
      className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-surface-900 text-brand-text dark:text-brand-text-dark placeholder-surface-400 dark:placeholder-surface-500 focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all duration-200 resize-none ${
        error 
          ? 'border-error-300 dark:border-error-600' 
          : 'border-surface-200 dark:border-surface-700'
      }`}
    />
    {error && (
      <p className="mt-1 text-sm text-error-600 dark:text-error-400">{error}</p>
    )}
  </div>
);

const SelectField: React.FC<{
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}> = ({ label, id, value, onChange, options }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-brand-text dark:text-brand-text-dark mb-2">
      {label}
    </label>
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 text-brand-text dark:text-brand-text-dark focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all duration-200"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const ToggleField: React.FC<{
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}> = ({ label, description, checked, onChange }) => (
  <div className="flex items-center justify-between p-4 rounded-xl bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700">
    <div className="flex-1">
      <h4 className="text-sm font-medium text-brand-text dark:text-brand-text-dark">{label}</h4>
      {description && (
        <p className="text-sm text-brand-text/70 dark:text-brand-text-dark/70 mt-1">{description}</p>
      )}
    </div>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 ${
        checked ? 'bg-brand-primary' : 'bg-surface-300 dark:bg-surface-600'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-200 ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
);

const ActionButton: React.FC<{
  type?: 'button' | 'submit';
  onClick?: () => void;
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  children: React.ReactNode;
  className?: string;
}> = ({ 
  type = 'button', 
  onClick, 
  isLoading = false, 
  variant = 'primary', 
  children, 
  className = '' 
}) => {
  const baseClasses = "inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantClasses = {
    primary: "bg-brand-primary hover:bg-brand-primary/90 text-white focus:ring-brand-primary shadow-md",
    secondary: "bg-brand-secondary hover:bg-brand-secondary/90 text-white focus:ring-brand-secondary shadow-md",
    outline: "border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-brand-text dark:text-brand-text-dark hover:bg-surface-50 dark:hover:bg-surface-700 focus:ring-brand-primary"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {isLoading ? (
        <>
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <Save className="w-4 h-4" />
          {children}
        </>
      )}
    </button>
  );
};

// =============================================================================
// FORM COMPONENTS
// =============================================================================

interface FormProps {
  user: UserType;
  onUpdate: (data: any) => void;
  isLoading: boolean;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

const ProfileForm: React.FC<FormProps> = ({ user, onUpdate, isLoading, onSuccess, onError }) => {
  const form = useForm({
    defaultValues: {
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      display_name: user.display_name || '',
      personal_phone: user.personal_phone || '',
      timezone: user.timezone || 'UTC',
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      await onUpdate(data);
      onSuccess('Profile updated successfully!');
    } catch (error: any) {
      onError(error.message || 'Failed to update profile');
    }
  });

  return (
    <FormCard title="Personal Information" description="Update your basic profile information">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="First Name"
            id="first_name"
            placeholder="Your first name"
            register={form.register('first_name', { required: 'First name is required' })}
            error={form.formState.errors.first_name?.message}
          />
          <InputField
            label="Last Name"
            id="last_name"
            placeholder="Your last name"
            register={form.register('last_name', { required: 'Last name is required' })}
            error={form.formState.errors.last_name?.message}
          />
        </div>

        <InputField
          label="Display Name (Optional)"
          id="display_name"
          placeholder="How you'd like to be addressed"
          register={form.register('display_name')}
        />

        <InputField
          label="Personal Phone (Optional)"
          id="personal_phone"
          placeholder="+1 (555) 123-4567"
          register={form.register('personal_phone')}
        />

        <SelectField
          label="Timezone"
          id="timezone"
          value={form.watch('timezone')}
          onChange={(value) => form.setValue('timezone', value)}
          options={TIMEZONES}
        />

        <div className="flex justify-end">
          <ActionButton type="submit" isLoading={isLoading}>
            Update Profile
          </ActionButton>
        </div>
      </form>
    </FormCard>
  );
};

const AISettingsForm: React.FC<FormProps> = ({ user, onUpdate, isLoading, onSuccess, onError }) => {
  const form = useForm({
    defaultValues: {
      ai_enabled: user.ai_enabled || false,
      ai_personality: user.ai_personality || 'You are a helpful assistant.',
      ai_response_style: user.ai_response_style || 'professional',
      ai_language: user.ai_language || 'en',
      use_emojis: user.use_emojis || false,
      casual_language: user.casual_language || false,
      custom_instructions: user.custom_instructions || '',
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      await onUpdate(data);
      onSuccess('AI settings updated successfully!');
    } catch (error: any) {
      onError(error.message || 'Failed to update AI settings');
    }
  });

  const aiEnabled = form.watch('ai_enabled');

  return (
    <FormCard title="AI Configuration" description="Configure how the AI responds to messages">
      <form onSubmit={handleSubmit} className="space-y-6">
        <ToggleField
          label="Enable AI Responses"
          description="Automatically respond to incoming messages using AI"
          checked={aiEnabled}
          onChange={(checked) => form.setValue('ai_enabled', checked)}
        />

        {aiEnabled && (
          <div className="space-y-6 pt-4 border-t border-surface-200 dark:border-surface-700">
            <TextareaField
              label="AI Personality"
              id="ai_personality"
              placeholder="Describe how the AI should behave and respond..."
              rows={4}
              register={form.register('ai_personality', { required: 'AI personality is required when AI is enabled' })}
              error={form.formState.errors.ai_personality?.message}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SelectField
                label="Response Style"
                id="ai_response_style"
                value={form.watch('ai_response_style')}
                onChange={(value) => form.setValue('ai_response_style', value as any)}
                options={AI_RESPONSE_STYLES}
              />

              <SelectField
                label="Language"
                id="ai_language"
                value={form.watch('ai_language')}
                onChange={(value) => form.setValue('ai_language', value)}
                options={LANGUAGES}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ToggleField
                label="Use Emojis"
                description="Include emojis in AI responses"
                checked={form.watch('use_emojis')}
                onChange={(checked) => form.setValue('use_emojis', checked)}
              />

              <ToggleField
                label="Casual Language"
                description="Use informal, conversational language"
                checked={form.watch('casual_language')}
                onChange={(checked) => form.setValue('casual_language', checked)}
              />
            </div>

            <TextareaField
              label="Custom Instructions (Optional)"
              id="custom_instructions"
              placeholder="Additional specific instructions for the AI..."
              rows={3}
              register={form.register('custom_instructions')}
            />
          </div>
        )}

        <div className="flex justify-end">
          <ActionButton type="submit" isLoading={isLoading}>
            Update AI Settings
          </ActionButton>
        </div>
      </form>
    </FormCard>
  );
};

// Additional form components would follow the same pattern...
// I'll create simplified versions for the demo

const AutoReplyForm: React.FC<FormProps> = ({ user, onUpdate, isLoading, onSuccess, onError }) => {
  const form = useForm({
    defaultValues: {
      auto_reply_enabled: user.auto_reply_enabled || false,
      custom_greeting: user.custom_greeting || '',
      out_of_office_enabled: user.out_of_office_enabled || false,
      out_of_office_message: user.out_of_office_message || '',
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      await onUpdate(data);
      onSuccess('Auto reply settings updated successfully!');
    } catch (error: any) {
      onError(error.message || 'Failed to update auto reply settings');
    }
  });

  return (
    <FormCard title="Auto Reply Settings" description="Configure automatic message responses">
      <form onSubmit={handleSubmit} className="space-y-6">
        <ToggleField
          label="Enable Auto Reply"
          description="Automatically send replies to incoming messages"
          checked={form.watch('auto_reply_enabled')}
          onChange={(checked) => form.setValue('auto_reply_enabled', checked)}
        />

        <TextareaField
          label="Custom Greeting"
          id="custom_greeting"
          placeholder="Hi! Thanks for reaching out..."
          register={form.register('custom_greeting')}
        />

        <ToggleField
          label="Out of Office Mode"
          description="Enable when you're unavailable"
          checked={form.watch('out_of_office_enabled')}
          onChange={(checked) => form.setValue('out_of_office_enabled', checked)}
        />

        {form.watch('out_of_office_enabled') && (
          <TextareaField
            label="Out of Office Message"
            id="out_of_office_message"
            placeholder="I'm currently out of office..."
            register={form.register('out_of_office_message')}
          />
        )}

        <div className="flex justify-end">
          <ActionButton type="submit" isLoading={isLoading}>
            Update Auto Reply Settings
          </ActionButton>
        </div>
      </form>
    </FormCard>
  );
};

const BusinessHoursForm: React.FC<FormProps> = ({ user, onUpdate, isLoading, onSuccess, onError }) => {
  return (
    <FormCard title="Business Hours" description="Set your availability and business hours">
      <div className="text-center py-8 text-brand-text/70 dark:text-brand-text-dark/70">
        <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Business hours configuration coming soon...</p>
      </div>
    </FormCard>
  );
};

const SecurityForm: React.FC<FormProps> = ({ user, onUpdate, isLoading, onSuccess, onError }) => {
  return (
    <FormCard title="Security Settings" description="Manage your account security and privacy">
      <div className="text-center py-8 text-brand-text/70 dark:text-brand-text-dark/70">
        <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Security settings configuration coming soon...</p>
      </div>
    </FormCard>
  );
};

const SignalWireForm: React.FC<FormProps> = ({ user, onUpdate, isLoading, onSuccess, onError }) => {
  return (
    <FormCard title="SignalWire Integration" description="Connect your SignalWire account for SMS functionality">
      <div className="text-center py-8 text-brand-text/70 dark:text-brand-text-dark/70">
        <Phone className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>SignalWire configuration coming soon...</p>
      </div>
    </FormCard>
  );
};

const PasswordChangeForm: React.FC<{
  onSubmit: (data: any) => void;
  isLoading: boolean;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
  showPassword: any;
  setShowPassword: any;
}> = ({ onSubmit, isLoading, onSuccess, onError, showPassword, setShowPassword }) => {
  const form = useForm({
    defaultValues: {
      current_password: '',
      new_password: '',
      confirm_password: '',
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    if (data.new_password !== data.confirm_password) {
      onError("Passwords don't match");
      return;
    }
    
    try {
      await onSubmit(data);
      form.reset();
      onSuccess('Password changed successfully!');
    } catch (error: any) {
      onError(error.message || 'Failed to change password');
    }
  });

  return (
    <FormCard title="Change Password" description="Update your account password for better security">
      <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
        <InputField
          label="Current Password"
          id="current_password"
          type="password"
          register={form.register('current_password', { required: 'Current password is required' })}
          error={form.formState.errors.current_password?.message}
          showPassword={showPassword.current}
          onTogglePassword={() => setShowPassword(prev => ({ ...prev, current: !prev.current }))}
        />

        <InputField
          label="New Password"
          id="new_password"
          type="password"
          register={form.register('new_password', { 
            required: 'New password is required',
            minLength: { value: 8, message: 'Password must be at least 8 characters' }
          })}
          error={form.formState.errors.new_password?.message}
          showPassword={showPassword.new}
          onTogglePassword={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
        />

        <InputField
          label="Confirm New Password"
          id="confirm_password"
          type="password"
          register={form.register('confirm_password', { required: 'Please confirm your password' })}
          error={form.formState.errors.confirm_password?.message}
          showPassword={showPassword.confirm}
          onTogglePassword={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
        />

        <div className="flex justify-end">
          <ActionButton type="submit" isLoading={isLoading}>
            Change Password
          </ActionButton>
        </div>
      </form>
    </FormCard>
  );
};

export default ProfileSettings;