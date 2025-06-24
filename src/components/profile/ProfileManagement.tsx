// src/components/Profiles/ProfileManagement.tsx
import React, { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService } from '../../services/profileService';
import { formatters } from '../../utils/formatters';
import { QUERY_KEYS } from '../../utils/constants';
import { useKeyboardShortcut } from '../../hooks/useKeyboardShortcut';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import toast from 'react-hot-toast';
import type { 
  Profile, 
  CreateProfileForm,
  BaseComponentProps 
} from '../../types';

interface ProfileManagementProps extends BaseComponentProps {
  userId: string;
}

type ViewMode = 'grid' | 'list';

export const ProfileManagement: React.FC<ProfileManagementProps> = ({ 
  userId, 
  className = '' 
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Fetch user profiles
  const { data: profiles = [], isLoading } = useQuery({
    queryKey: QUERY_KEYS.profiles,
    queryFn: profileService.getProfiles,
  });

  // Keyboard shortcuts
  useKeyboardShortcut(
    { key: 'n', ctrlKey: true },
    () => setShowCreateModal(true),
    []
  );

  if (isLoading) {
    return <ProfileManagementSkeleton />;
  }

  return (
    <div className={`profile-management space-y-6 ${className}`}>
      {/* Header */}
      <ProfileHeader
        profileCount={profiles.length}
        onCreateProfile={() => setShowCreateModal(true)}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        isMobile={isMobile}
      />

      {/* Profiles Grid/List */}
      {profiles.length === 0 ? (
        <EmptyProfilesState onCreateProfile={() => setShowCreateModal(true)} />
      ) : (
        <ProfilesContainer
          profiles={profiles}
          viewMode={viewMode}
          onSelectProfile={setSelectedProfile}
        />
      )}

      {/* Create Profile Modal */}
      {showCreateModal && (
        <CreateProfileModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            toast.success('Profile created successfully!');
          }}
        />
      )}

      {/* Profile Details Modal */}
      {selectedProfile && (
        <ProfileDetailsModal
          profile={selectedProfile}
          onClose={() => setSelectedProfile(null)}
        />
      )}
    </div>
  );
};

// Profile Header Component
interface ProfileHeaderProps {
  profileCount: number;
  onCreateProfile: () => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  isMobile: boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ 
  profileCount, 
  onCreateProfile, 
  viewMode, 
  onViewModeChange,
  isMobile 
}) => {
  return (
    <div className="profile-header">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-theme">SMS Profiles</h1>
          <p className="text-neutral-500 mt-1">
            Manage your {formatters.number(profileCount)} active profile{profileCount !== 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {!isMobile && (
            <div className="flex bg-neutral-100 dark:bg-neutral-800 rounded-lg p-1">
              <button
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === 'grid' ? 
                  'bg-white dark:bg-neutral-700 text-primary dark:text-primary-dark shadow-sm' : 
                  'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
                }`}
                onClick={() => onViewModeChange('grid')}
                title="Grid view"
              >
                <GridIcon className="w-4 h-4" />
              </button>
              <button
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === 'list' ? 
                  'bg-white dark:bg-neutral-700 text-primary dark:text-primary-dark shadow-sm' : 
                  'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
                }`}
                onClick={() => onViewModeChange('list')}
                title="List view"
              >
                <ListIcon className="w-4 h-4" />
              </button>
            </div>
          )}
          
          <button className="btn btn-primary" onClick={onCreateProfile}>
            <PlusIcon className="w-4 h-4" />
            {isMobile ? 'Create' : 'Create Profile'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Profiles Container Component
interface ProfilesContainerProps {
  profiles: Profile[];
  viewMode: ViewMode;
  onSelectProfile: (profile: Profile) => void;
}

const ProfilesContainer: React.FC<ProfilesContainerProps> = ({ 
  profiles, 
  viewMode, 
  onSelectProfile 
}) => {
  const containerClasses = viewMode === 'grid' ? 
    'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 
    'space-y-4';

  return (
    <div className={containerClasses}>
      {profiles.map(profile => (
        <ProfileCard
          key={profile.id}
          profile={profile}
          viewMode={viewMode}
          onClick={() => onSelectProfile(profile)}
        />
      ))}
    </div>
  );
};

// Individual Profile Card
interface ProfileCardProps {
  profile: Profile;
  viewMode: ViewMode;
  onClick: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, viewMode, onClick }) => {
  const queryClient = useQueryClient();

  // Toggle AI mutation
  const toggleAI = useMutation({
    mutationFn: (enabled: boolean) => profileService.toggleAI(profile.id, enabled),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profiles });
      toast.success(`AI ${profile.aiEnabled ? 'disabled' : 'enabled'} for ${profile.name}`);
    },
    onError: () => {
      toast.error('Failed to update AI settings');
    },
  });

  // Delete profile mutation
  const deleteProfile = useMutation({
    mutationFn: () => profileService.deleteProfile(profile.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profiles });
      toast.success('Profile deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete profile');
    },
  });

  const handleToggleAI = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    toggleAI.mutate(!profile.aiEnabled);
  }, [profile.aiEnabled, toggleAI]);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${profile.name}"? This action cannot be undone.`)) {
      deleteProfile.mutate();
    }
  }, [profile.name, deleteProfile]);

  const getStatusInfo = () => {
    if (!profile.isActive) return { text: 'Inactive', color: 'error' as const };
    if (profile.aiEnabled) return { text: 'AI Active', color: 'success' as const };
    return { text: 'Manual Only', color: 'warning' as const };
  };

  const statusInfo = getStatusInfo();

  if (viewMode === 'list') {
    return (
      <div 
        className="profile-list-item bg-card border border-neutral-200 dark:border-neutral-700 rounded-xl p-4 cursor-pointer hover:shadow-md hover:border-primary/30 dark:hover:border-primary-dark/30 transition-all duration-200"
        onClick={onClick}
      >
        <div className="flex items-center gap-4">
          {/* Profile Info */}
          <div className="flex items-center gap-3 flex-1">
            <div className="profile-avatar w-12 h-12 text-sm relative">
              {profile.name.charAt(0).toUpperCase()}
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-neutral-800 ${
                statusInfo.color === 'success' ? 'bg-success' :
                statusInfo.color === 'warning' ? 'bg-warning' :
                'bg-error'
              }`} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-theme">{profile.name}</h3>
              <p className="text-sm text-neutral-500">{formatters.phone(profile.phoneNumber)}</p>
              {profile.description && (
                <p className="text-xs text-neutral-400 mt-1 line-clamp-1">{profile.description}</p>
              )}
            </div>
          </div>
          
          {/* Stats */}
          <div className="flex items-center gap-6 text-center">
            <div>
              <div className="text-lg font-semibold text-theme">{formatters.number(profile.messageCount || 0)}</div>
              <div className="text-xs text-neutral-500">Messages</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-theme">{formatters.number(profile.clientCount || 0)}</div>
              <div className="text-xs text-neutral-500">Clients</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-theme">{formatters.percentage(profile.aiResponseRate || 0, 0)}</div>
              <div className="text-xs text-neutral-500">AI Rate</div>
            </div>
          </div>
          
          {/* Status */}
          <div>
            <span className={`badge badge-${statusInfo.color}`}>
              {statusInfo.text}
            </span>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              className={`btn btn-sm ${profile.aiEnabled ? 'btn-success' : 'btn-ghost'}`}
              onClick={handleToggleAI}
              disabled={toggleAI.isPending}
              title={profile.aiEnabled ? 'Disable AI' : 'Enable AI'}
            >
              {profile.aiEnabled ? '🤖' : '👤'}
            </button>
            <button
              className="btn btn-ghost btn-sm"
              onClick={(e) => {
                e.stopPropagation();
                window.open(`/profiles/${profile.id}/settings`, '_blank');
              }}
              title="Settings"
            >
              <SettingsIcon className="w-4 h-4" />
            </button>
            <button
              className="btn btn-ghost btn-sm text-error hover:bg-error/10"
              onClick={handleDelete}
              disabled={deleteProfile.isPending}
              title="Delete Profile"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="profile-card bg-card border border-neutral-200 dark:border-neutral-700 rounded-xl p-6 cursor-pointer hover:shadow-lg hover:border-primary/30 dark:hover:border-primary-dark/30 hover:-translate-y-1 transition-all duration-200 group"
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="profile-avatar w-16 h-16 text-lg relative">
          {profile.name.charAt(0).toUpperCase()}
          <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white dark:border-neutral-800 ${
            statusInfo.color === 'success' ? 'bg-success' :
            statusInfo.color === 'warning' ? 'bg-warning' :
            'bg-error'
          }`} />
        </div>
        <span className={`badge badge-${statusInfo.color}`}>
          {statusInfo.text}
        </span>
      </div>
      
      {/* Body */}
      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-lg text-theme mb-1">{profile.name}</h3>
          <p className="text-sm text-neutral-500">{formatters.phone(profile.phoneNumber)}</p>
        </div>
        
        {profile.description && (
          <p className="text-sm text-neutral-400 line-clamp-2">{profile.description}</p>
        )}
        
        <div className="grid grid-cols-3 gap-4 pt-3 border-t border-neutral-200 dark:border-neutral-700">
          <div className="text-center">
            <div className="text-lg font-semibold text-theme">{formatters.number(profile.messageCount || 0)}</div>
            <div className="text-xs text-neutral-500">Messages</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-theme">{formatters.number(profile.clientCount || 0)}</div>
            <div className="text-xs text-neutral-500">Clients</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-theme">{formatters.percentage(profile.aiResponseRate || 0, 0)}</div>
            <div className="text-xs text-neutral-500">AI Rate</div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="flex items-center justify-between pt-4 mt-4 border-t border-neutral-200 dark:border-neutral-700">
        <div className="text-xs text-neutral-400">
          Created {formatters.relativeTime(profile.createdAt)}
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            className={`btn btn-sm ${profile.aiEnabled ? 'btn-success' : 'btn-ghost'}`}
            onClick={handleToggleAI}
            disabled={toggleAI.isPending}
            title={profile.aiEnabled ? 'Disable AI' : 'Enable AI'}
          >
            {profile.aiEnabled ? '🤖' : '👤'}
          </button>
          <button
            className="btn btn-ghost btn-sm"
            onClick={(e) => {
              e.stopPropagation();
              window.open(`/profiles/${profile.id}/settings`, '_blank');
            }}
            title="Settings"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
          <button
            className="btn btn-ghost btn-sm text-error hover:bg-error/10"
            onClick={handleDelete}
            disabled={deleteProfile.isPending}
            title="Delete Profile"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Create Profile Modal
interface CreateProfileModalProps {
  onClose: () => void;
  onSuccess: (profile: Profile) => void;
}

const CreateProfileModal: React.FC<CreateProfileModalProps> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState<CreateProfileForm>({
    name: '',
    phoneNumber: '',
    description: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    aiEnabled: true,
  });
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Partial<CreateProfileForm>>({});

  const queryClient = useQueryClient();

  const createProfile = useMutation({
    mutationFn: profileService.createProfile,
    onSuccess: (newProfile) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profiles });
      onSuccess(newProfile);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create profile');
    },
  });

  const validateStep1 = useCallback(() => {
    const newErrors: Partial<CreateProfileForm> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Profile name is required';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData.name, formData.phoneNumber]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (validateStep1()) {
        setStep(2);
      }
    } else {
      createProfile.mutate(formData);
    }
  }, [step, validateStep1, createProfile, formData]);

  const handleChange = useCallback((field: keyof CreateProfileForm, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header p-6 border-b border-neutral-200 dark:border-neutral-700">
          <h2 className="text-xl font-semibold text-theme">Create New Profile</h2>
          <button className="btn btn-ghost p-1" onClick={onClose}>
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body p-6">
            {/* Step Indicator */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center gap-4">
                <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary dark:text-primary-dark' : 'text-neutral-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step >= 1 ? 'bg-primary text-white dark:bg-primary-dark' : 'bg-neutral-200 dark:bg-neutral-700'
                  }`}>
                    1
                  </div>
                  <span className="font-medium">Basic Info</span>
                </div>
                <div className={`w-8 h-px ${step >= 2 ? 'bg-primary dark:bg-primary-dark' : 'bg-neutral-200 dark:bg-neutral-700'}`} />
                <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary dark:text-primary-dark' : 'text-neutral-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step >= 2 ? 'bg-primary text-white dark:bg-primary-dark' : 'bg-neutral-200 dark:bg-neutral-700'
                  }`}>
                    2
                  </div>
                  <span className="font-medium">Configuration</span>
                </div>
              </div>
            </div>

            {/* Step 1: Basic Information */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="form-group">
                  <label className="form-label">
                    Profile Name <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-input ${errors.name ? 'border-error focus:border-error focus:ring-error/50' : ''}`}
                    placeholder="e.g., Luna's Profile"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                  />
                  {errors.name && <div className="form-error">{errors.name}</div>}
                  <div className="form-help">
                    This is how your profile will be identified in the system
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Phone Number <span className="text-error">*</span>
                  </label>
                  <input
                    type="tel"
                    className={`form-input ${errors.phoneNumber ? 'border-error focus:border-error focus:ring-error/50' : ''}`}
                    placeholder="+1 (555) 123-4567"
                    value={formData.phoneNumber}
                    onChange={(e) => handleChange('phoneNumber', e.target.value)}
                  />
                  {errors.phoneNumber && <div className="form-error">{errors.phoneNumber}</div>}
                  <div className="form-help">
                    This number will receive SMS messages. Must be verified with your SMS provider.
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-input h-24 resize-none"
                    placeholder="Brief description of this profile..."
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Configuration */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="form-group">
                  <label className="form-label">Time Zone</label>
                  <select
                    className="form-input"
                    value={formData.timezone}
                    onChange={(e) => handleChange('timezone', e.target.value)}
                  >
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>

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

                <div className="bg-primary/10 dark:bg-primary-dark/20 border border-primary/20 dark:border-primary-dark/20 rounded-lg p-4">
                  <div className="flex gap-3">
                    <div className="text-primary dark:text-primary-dark text-xl">ℹ️</div>
                    <div>
                      <h4 className="font-semibold text-theme mb-2">What happens next?</h4>
                      <ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
                        <li>• Your profile will be created and activated</li>
                        <li>• You can configure AI personality and training data</li>
                        <li>• Start receiving and responding to messages</li>
                        <li>• Monitor analytics and performance</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer p-6 border-t border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center justify-between">
              <button type="button" className="btn btn-ghost" onClick={onClose}>
                Cancel
              </button>
              
              <div className="flex items-center gap-3">
                {step > 1 && (
                  <button 
                    type="button" 
                    className="btn btn-ghost"
                    onClick={() => setStep(step - 1)}
                  >
                    Back
                  </button>
                )}
                
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={createProfile.isPending}
                >
                  {createProfile.isPending ? (
                    <>
                      <div className="loading-spinner" />
                      Creating...
                    </>
                  ) : step < 2 ? (
                    'Next'
                  ) : (
                    'Create Profile'
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// Profile Details Modal
interface ProfileDetailsModalProps {
  profile: Profile;
  onClose: () => void;
}

const ProfileDetailsModal: React.FC<ProfileDetailsModalProps> = ({ profile, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
    { id: 'history', label: 'History', icon: '📋' },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-extra-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header p-6 border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center gap-3">
            <div className="profile-avatar w-12 h-12 text-sm">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-theme">{profile.name}</h2>
              <p className="text-neutral-500">{formatters.phone(profile.phoneNumber)}</p>
            </div>
          </div>
          <button className="btn btn-ghost p-1" onClick={onClose}>
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`px-6 py-3 font-medium transition-all duration-200 border-b-2 ${
                activeTab === tab.id
                  ? 'text-primary dark:text-primary-dark border-primary dark:border-primary-dark bg-white dark:bg-neutral-900'
                  : 'text-neutral-600 dark:text-neutral-400 border-transparent hover:text-primary dark:hover:text-primary-dark'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="mr-2">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="modal-body p-6">
          {activeTab === 'overview' && <ProfileOverview profile={profile} />}
          {activeTab === 'analytics' && <ProfileAnalytics profile={profile} />}
          {activeTab === 'settings' && <ProfileSettings profile={profile} />}
          {activeTab === 'history' && <ProfileHistory profile={profile} />}
        </div>

        <div className="modal-footer p-6 border-t border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <button className="btn btn-ghost" onClick={onClose}>
              Close
            </button>
            <button 
              className="btn btn-primary" 
              onClick={() => window.open(`/profiles/${profile.id}/edit`, '_blank')}
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Profile Overview Tab
interface ProfileOverviewProps {
  profile: Profile;
}

const ProfileOverview: React.FC<ProfileOverviewProps> = ({ profile }) => {
  const statusInfo = {
    profile: profile.isActive ? { text: 'Active', color: 'success' as const } : { text: 'Inactive', color: 'error' as const },
    ai: profile.aiEnabled ? { text: 'Enabled', color: 'success' as const } : { text: 'Disabled', color: 'warning' as const },
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg p-6">
          <h4 className="font-semibold text-theme mb-4">Quick Stats</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-neutral-600 dark:text-neutral-400">Total Messages:</span>
              <span className="font-semibold text-theme">{formatters.number(profile.messageCount || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600 dark:text-neutral-400">Active Clients:</span>
              <span className="font-semibold text-theme">{formatters.number(profile.clientCount || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600 dark:text-neutral-400">AI Response Rate:</span>
              <span className="font-semibold text-theme">{formatters.percentage(profile.aiResponseRate || 0)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600 dark:text-neutral-400">Created:</span>
              <span className="font-semibold text-theme">{formatters.date(profile.createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg p-6">
          <h4 className="font-semibold text-theme mb-4">Current Status</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-neutral-600 dark:text-neutral-400">Profile Status:</span>
              <span className={`badge badge-${statusInfo.profile.color}`}>
                {statusInfo.profile.text}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-600 dark:text-neutral-400">AI Responses:</span>
              <span className={`badge badge-${statusInfo.ai.color}`}>
                {statusInfo.ai.text}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600 dark:text-neutral-400">Time Zone:</span>
              <span className="font-semibold text-theme">{profile.timezone}</span>
            </div>
          </div>
        </div>
      </div>

      {profile.description && (
        <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg p-6">
          <h4 className="font-semibold text-theme mb-3">Description</h4>
          <p className="text-neutral-600 dark:text-neutral-400">{profile.description}</p>
        </div>
      )}
    </div>
  );
};

// Placeholder components for other tabs
const ProfileAnalytics: React.FC<{ profile: Profile }> = ({ profile }) => (
  <div className="text-center py-12">
    <div className="text-4xl mb-4">📈</div>
    <h3 className="text-lg font-semibold text-theme mb-2">Analytics Dashboard</h3>
    <p className="text-neutral-500">Detailed analytics for {profile.name} coming soon</p>
  </div>
);

const ProfileSettings: React.FC<{ profile: Profile }> = ({ profile }) => (
  <div className="text-center py-12">
    <div className="text-4xl mb-4">⚙️</div>
    <h3 className="text-lg font-semibold text-theme mb-2">Profile Settings</h3>
    <p className="text-neutral-500">Configure settings for {profile.name}</p>
    <button className="btn btn-primary mt-4" onClick={() => window.open(`/profiles/${profile.id}/settings`, '_blank')}>
      Open Settings
    </button>
  </div>
);

const ProfileHistory: React.FC<{ profile: Profile }> = ({ profile }) => (
  <div className="text-center py-12">
    <div className="text-4xl mb-4">📋</div>
    <h3 className="text-lg font-semibold text-theme mb-2">Activity History</h3>
    <p className="text-neutral-500">Recent activity for {profile.name}</p>
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

// Empty States
const EmptyProfilesState: React.FC<{ onCreateProfile: () => void }> = ({ onCreateProfile }) => (
  <div className="text-center py-16">
    <div className="text-6xl mb-6">📱</div>
    <h3 className="text-2xl font-semibold text-theme mb-3">No profiles yet</h3>
    <p className="text-neutral-500 mb-6 max-w-md mx-auto">
      Create your first SMS profile to start managing automated responses and engaging with clients.
    </p>
    <button className="btn btn-primary btn-lg" onClick={onCreateProfile}>
      <PlusIcon className="w-5 h-5" />
      Create Your First Profile
    </button>
  </div>
);

// Profile Management Skeleton
const ProfileManagementSkeleton: React.FC = () => (
  <div className="profile-management space-y-6">
    <div className="flex justify-between items-center">
      <div>
        <div className="skeleton h-8 w-48 mb-2" />
        <div className="skeleton h-4 w-64" />
      </div>
      <div className="skeleton h-10 w-32" />
    </div>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="card p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="skeleton h-16 w-16 rounded-full" />
            <div className="skeleton h-6 w-16 rounded-full" />
          </div>
          <div className="space-y-3">
            <div className="skeleton h-6 w-32" />
            <div className="skeleton h-4 w-28" />
            <div className="skeleton h-4 w-full" />
            <div className="grid grid-cols-3 gap-4 pt-3">
              <div className="skeleton h-8 w-full" />
              <div className="skeleton h-8 w-full" />
              <div className="skeleton h-8 w-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Icons
const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

const GridIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const ListIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
  </svg>
);

const SettingsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const XIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default ProfileManagement;