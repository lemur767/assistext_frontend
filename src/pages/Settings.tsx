import { useState } from 'react';
import { 
  User, 
  Shield, 
  Bell, 
  Key, 
  Globe,
  Smartphone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Save,
  Copy,
  RefreshCw,
  Trash2,
  Plus,
  AlertTriangle,
  CheckCircle,
  Settings,
  Database,
  Zap,
  Clock,
  Filter,
  Download,
  Upload,
  RotateCcw,
  Code,
  ExternalLink
} from 'lucide-react';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [showPassword, setShowPassword] = useState(false);


  const [settings, setSettings] = useState({
    // Account settings
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    timezone: 'America/Toronto',
    
    // Security settings
    twoFactorEnabled: false,
    loginNotifications: true,
    sessionTimeout: 60,
    
    // Notification settings
    emailNotifications: {
      newMessages: true,
      aiResponses: false,
      systemAlerts: true,
      billingUpdates: true,
      securityAlerts: true
    },
    
    // SMS settings
    webhookUrl: 'https://assitext.ca/webhooks/sms',
    rateLimiting: true,
    autoFlagging: true,
    
    
  const updateSetting = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  },
  
  

  const TabButton = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-left transition-colors ${
        activeTab === id 
          ? 'bg-blue-100 text-blue-700 border border-blue-200' 
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
      }`}
    >
      <Icon className="h-5 w-5" />
      <span className="font-medium">{label}</span>
    </button>
  )
  }
  const SettingCard = ({ title, description, children}) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
      </div>
      {children}
    </div>
  );

  const ToggleSetting = ({ label, description, checked, onChange }) => (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="font-medium text-gray-900">{label}</p>
        {description && <p className="text-sm text-gray-600">{description}</p>}
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
      </label>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account preferences and system configuration</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-2">
              <TabButton id="account" label="Account" icon={User} />
              <TabButton id="security" label="Security" icon={Shield} />
              <TabButton id="notifications" label="Notifications" icon={Bell} />
              <TabButton id="api" label="API & Webhooks" icon={Key} />
              <TabButton id="system" label="System" icon={Settings} />
              <TabButton id="integrations" label="Integrations" icon={Zap} />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {activeTab === 'account' && (
              <div className="space-y-6">
                <SettingCard 
                  title="Profile Information"
                  description="Update your personal information and contact details"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                      <input
                        type="text"
                        value={settings.firstName}
                        onChange={(e) => setSettings({...settings, firstName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                      <input
                        type="text"
                        value={settings.lastName}
                        onChange={(e) => setSettings({...settings, lastName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        value={settings.email}
                        onChange={(e) => setSettings({...settings, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={settings.phone}
                        onChange={(e) => setSettings({...settings, phone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                    <select
                      value={settings.timezone}
                      onChange={(e) => setSettings({...settings, timezone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="America/Toronto">Eastern Time (Toronto)</option>
                      <option value="America/New_York">Eastern Time (New York)</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                    </select>
                  </div>

                  <div className="flex justify-end mt-6">
                    <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      <Save className="h-4 w-4" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </SettingCard>

                <SettingCard 
                  title="Change Password"
                  description="Update your account password"
                >
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end mt-6">
                    <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      <Lock className="h-4 w-4" />
                      <span>Update Password</span>
                    </button>
                  </div>
                </SettingCard>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <SettingCard 
                  title="Two-Factor Authentication"
                  description="Add an extra layer of security to your account"
                >
                  <ToggleSetting
                    label="Enable Two-Factor Authentication"
                    description="Require a code from your phone in addition to your password"
                    checked={settings.twoFactorEnabled}
                    onChange={(e) => setSettings({...settings, twoFactorEnabled: e.target.checked})}
                  />
                  {settings.twoFactorEnabled && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-700">
                        Two-factor authentication is enabled. Use your authenticator app to generate codes.
                      </p>
                    </div>
                  )}
                </SettingCard>

                <SettingCard 
                  title="Login Security"
                  description="Configure login and session security options"
                >
                  <ToggleSetting
                    label="Login Notifications"
                    description="Get notified when someone logs into your account"
                    checked={settings.loginNotifications}
                    onChange={(e) => setSettings({...settings, loginNotifications: e.target.checked})}
                  />
                  
                  <div className="border-t border-gray-200 my-4"></div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout</label>
                    <select
                      value={settings.sessionTimeout}
                      onChange={(e) => setSettings({...settings, sessionTimeout: parseInt(e.target.value)})}
                      className="w-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value={15}>15 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={60}>1 hour</option>
                      <option value={240}>4 hours</option>
                      <option value={480}>8 hours</option>
                    </select>
                    <p className="text-sm text-gray-600 mt-1">Automatically log out after this period of inactivity</p>
                  </div>
                </SettingCard>

                <SettingCard 
                  title="Active Sessions"
                  description="Manage your active login sessions"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Current Session</p>
                        <p className="text-sm text-gray-600">Chrome on macOS • Toronto, ON</p>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Mobile App</p>
                        <p className="text-sm text-gray-600">iPhone • Last seen 2 hours ago</p>
                      </div>
                      <button className="text-red-600 hover:text-red-700 text-sm">
                        Revoke
                      </button>
                    </div>
                  </div>
                </SettingCard>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <SettingCard 
                  title="Email Notifications"
                  description="Choose which emails you want to receive"
                >
                  <div className="space-y-1">
                    <ToggleSetting
                      label="New Messages"
                      description="Get notified when you receive new SMS messages"
                      checked={settings.emailNotifications.newMessages}
                      onChange={(e) => updateSetting('emailNotifications', 'newMessages', e.target.checked)}
                    />
                    <ToggleSetting
                      label="AI Responses"
                      description="Get notified when AI responds to messages automatically"
                      checked={settings.emailNotifications.aiResponses}
                      onChange={(e) => updateSetting('emailNotifications', 'aiResponses', e.target.checked)}
                    />
                    <ToggleSetting
                      label="System Alerts"
                      description="Important system updates and maintenance notifications"
                      checked={settings.emailNotifications.systemAlerts}
                      onChange={(e) => updateSetting('emailNotifications', 'systemAlerts', e.target.checked)}
                    />
                    <ToggleSetting
                      label="Billing Updates"
                      description="Payment confirmations and billing reminders"
                      checked={settings.emailNotifications.billingUpdates}
                      onChange={(e) => updateSetting('emailNotifications', 'billingUpdates', e.target.checked)}
                    />
                    <ToggleSetting
                      label="Security Alerts"
                      description="Login attempts and security-related notifications"
                      checked={settings.emailNotifications.securityAlerts}
                      onChange={(e) => updateSetting('emailNotifications', 'securityAlerts', e.target.checked)}
                    />
                  </div>
                </SettingCard>

                <SettingCard 
                  title="Notification Preferences"
                  description="Configure how and when you receive notifications"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Quiet Hours Start</label>
                      <input
                        type="time"
                        defaultValue="22:00"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Quiet Hours End</label>
                      <input
                        type="time"
                        defaultValue="08:00"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    No notifications will be sent during quiet hours except for critical security alerts.
                  </p>
                </SettingCard>
              </div>
            )}

         
      

              

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Webhook Events</label>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                            <span className="ml-2 text-sm text-gray-700">New message received</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                            <span className="ml-2 text-sm text-gray-700">AI response sent</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                            <span className="ml-2 text-sm text-gray-700">Message flagged</span>
                          </label>
                        </div>
                      </div>
                    </div>
       
          
         

            {activeTab === 'system' && (
              <div className="space-y-6">
                <SettingCard 
                  title="Message Processing"
                  description="Configure how messages are processed and filtered"
                >
                  <ToggleSetting
                    label="Auto-flagging"
                    description="Automatically flag suspicious or inappropriate messages"
                    checked={settings.autoFlagging}
                    onChange={(e) => setSettings({...settings, autoFlagging: e.target.checked})}
                  />
                  
                 

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message Retention</label>
                    <select className="w-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value={30}>30 days</option>
                      <option value={90}>90 days</option>
                      <option value={365}>1 year</option>
                      <option value={-1}>Forever</option>
                    </select>
                    <p className="text-sm text-gray-600 mt-1">How long to keep message history</p>
                  </div>
                </SettingCard>

                <SettingCard 
                  title="AI Configuration"
                  description="System-wide AI settings and preferences"
                >
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Default AI Model</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="dolphin-mistral:7b-v2.8">Dolphin Mistral 7B v2.8</option>
                        <option value="llama2:7b">Llama 2 7B</option>
                        <option value="codellama:7b">Code Llama 7B</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">LLM Server URL</label>
                      <input
                        type="url"
                        defaultValue="http://10.0.0.4:8080"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Timeout (seconds)</label>
                        <input
                          type="number"
                          defaultValue={30}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Retry Attempts</label>
                        <input
                          type="number"
                          defaultValue={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </SettingCard>

                <SettingCard 
                  title="Data Management"
                  description="Export and backup your data"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button className="flex items-center justify-center space-x-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <Download className="h-4 w-4" />
                      <span>Export All Data</span>
                    </button>
                    <button className="flex items-center justify-center space-x-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <Download className="h-4 w-4" />
                      <span>Export Messages</span>
                    </button>
                    <button className="flex items-center justify-center space-x-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <Upload className="h-4 w-4" />
                      <span>Import Data</span>
                    </button>
                    <button className="flex items-center justify-center space-x-2 p-4 border border-red-300 text-red-600 rounded-lg hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                      <span>Delete Account</span>
                    </button>
                  </div>
                </SettingCard>
              </div>
            )}

           
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;