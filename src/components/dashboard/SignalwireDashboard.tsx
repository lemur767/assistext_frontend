import React, { useState, useEffect } from 'react';
import { Phone, MessageSquare, Zap, AlertCircle, CheckCircle, Clock, Send, RefreshCw, Settings, Plus, PhoneCall } from 'lucide-react';

// Mock hooks for demonstration (replace with actual imports)
const useSignalWire = () => ({
  status: {
    status: 'connected',
    space_url: 'assitext.signalwire.com',
    project_id: 'de26db73-cf95-4570-9d3a-bb44c08eb70e',
    phone_numbers_count: 3,
    webhooks_configured: 3,
    account_info: {
      friendly_name: 'AssisText Production',
      status: 'active'
    }
  },
  statusLoading: false,
  initializeSignalWire: () => {},
  isInitializing: false,
  testWebhook: () => {},
  isTestingWebhook: false,
});

const useSignalWirePhoneNumbers = () => ({
  phoneNumbers: [
    {
      phone_number: '+1234567890',
      friendly_name: 'Business Line',
      capabilities: { sms: true, mms: true, voice: true },
      webhook_url: 'https://backend.assitext.ca/api/webhooks/signalwire',
      is_configured: true
    },
    {
      phone_number: '+1987654321',
      friendly_name: 'Support Line',
      capabilities: { sms: true, mms: false, voice: true },
      webhook_url: 'https://backend.assitext.ca/api/webhooks/signalwire',
      is_configured: true
    }
  ],
  isLoading: false,
  configureWebhook: () => {},
  isConfiguringWebhook: false,
});

const useSignalWireAnalytics = () => ({
  analytics: {
    total_sent: 1247,
    total_received: 892,
    delivery_rate: 98.5,
    failed_messages: 19,
    last_24h: { sent: 47, received: 31 },
    by_profile: [
      { profile_id: '1', profile_name: 'Business Profile', sent: 523, received: 389, delivery_rate: 99.1 },
      { profile_id: '2', profile_name: 'Support Team', sent: 724, received: 503, delivery_rate: 97.8 }
    ]
  },
  isLoading: false
});

const useSMS = () => ({
  sendSMS: () => {},
  isSending: false,
});

const usePhoneNumberValidation = () => ({
  validatePhoneNumber: (num) => /^\+?[1-9]\d{1,14}$/.test(num.replace(/\D/g, '')),
  formatPhoneNumber: (num) => {
    const cleaned = num.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `+1 (${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return num;
  }
});

// Status indicator component
const StatusIndicator = ({ status, label }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'bg-green-500';
      case 'disconnected': return 'bg-red-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-yellow-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-4 h-4" />;
      case 'disconnected': return <AlertCircle className="w-4 h-4" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <div className={`w-3 h-3 rounded-full ${getStatusColor(status)} animate-pulse`}></div>
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <span className="text-slate-500">{getStatusIcon(status)}</span>
    </div>
  );
};

// Stats card component
const StatsCard = ({ title, value, subtitle, icon: Icon, trend }) => (
  <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow duration-200">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-600">{title}</p>
        <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
        {subtitle && (
          <p className={`text-sm mt-1 ${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-slate-500'}`}>
            {subtitle}
          </p>
        )}
      </div>
      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white">
        <Icon className="w-6 h-6" />
      </div>
    </div>
  </div>
);

// Phone number card component
const PhoneNumberCard = ({ phoneNumber, onConfigure }) => (
  <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow duration-200">
    <div className="flex items-start justify-between mb-3">
      <div>
        <div className="font-semibold text-slate-900">{phoneNumber.phone_number}</div>
        <div className="text-sm text-slate-500">{phoneNumber.friendly_name}</div>
      </div>
      <div className={`w-3 h-3 rounded-full ${phoneNumber.is_configured ? 'bg-green-500' : 'bg-red-500'}`}></div>
    </div>
    
    <div className="flex items-center space-x-4 text-xs text-slate-500 mb-3">
      <span className={phoneNumber.capabilities.sms ? 'text-green-600' : 'text-slate-400'}>SMS</span>
      <span className={phoneNumber.capabilities.mms ? 'text-green-600' : 'text-slate-400'}>MMS</span>
      <span className={phoneNumber.capabilities.voice ? 'text-green-600' : 'text-slate-400'}>Voice</span>
    </div>
    
    <button
      onClick={() => onConfigure(phoneNumber.phone_number)}
      className="w-full px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
    >
      {phoneNumber.is_configured ? 'Reconfigure' : 'Configure'}
    </button>
  </div>
);

// Send SMS form component
const SendSMSForm = () => {
  const [smsData, setSmsData] = useState({ to: '', from: '', message: '' });
  const { sendSMS, isSending } = useSMS();
  const { validatePhoneNumber, formatPhoneNumber } = usePhoneNumberValidation();

  const handleSubmit = () => {
    if (!validatePhoneNumber(smsData.to)) {
      alert('Please enter a valid phone number');
      return;
    }
    sendSMS(smsData);
    setSmsData({ to: '', from: '', message: '' });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
        <Send className="w-5 h-5 mr-2" />
        Send Test SMS
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">To</label>
          <input
            type="tel"
            value={smsData.to}
            onChange={(e) => setSmsData(prev => ({ ...prev, to: e.target.value }))}
            placeholder="+1 (555) 123-4567"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">From</label>
          <select
            value={smsData.from}
            onChange={(e) => setSmsData(prev => ({ ...prev, from: e.target.value }))}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select phone number</option>
            <option value="+1234567890">+1 (234) 567-890 - Business Line</option>
            <option value="+1987654321">+1 (987) 654-321 - Support Line</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
          <textarea
            value={smsData.message}
            onChange={(e) => setSmsData(prev => ({ ...prev, message: e.target.value }))}
            placeholder="Enter your message..."
            rows={3}
            maxLength={160}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <div className="text-xs text-slate-500 mt-1">{smsData.message.length}/160 characters</div>
        </div>
        
        <button
          onClick={handleSubmit}
          disabled={isSending}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isSending ? (
            <RefreshCw className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <Send className="w-4 h-4 mr-2" />
          )}
          {isSending ? 'Sending...' : 'Send SMS'}
        </button>
      </div>
    </div>
  );
};

// Main SignalWire Dashboard component
const SignalWireDashboard = () => {
  const { status, statusLoading, initializeSignalWire, isInitializing, testWebhook, isTestingWebhook } = useSignalWire();
  const { phoneNumbers, isLoading: phoneNumbersLoading, configureWebhook, isConfiguringWebhook } = useSignalWirePhoneNumbers();
  const { analytics, isLoading: analyticsLoading } = useSignalWireAnalytics('30d');

  const handleConfigureWebhook = (phoneNumber) => {
    const webhookUrl = 'https://backend.assitext.ca/api/webhooks/signalwire';
    configureWebhook({ phoneNumber, webhookUrl });
  };

  if (statusLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">SignalWire Dashboard</h1>
          <p className="text-slate-600 mt-1">Monitor and manage your SMS integration</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={testWebhook}
            disabled={isTestingWebhook}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center"
          >
            {isTestingWebhook ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Zap className="w-4 h-4 mr-2" />}
            Test Webhook
          </button>
          <button
            onClick={initializeSignalWire}
            disabled={isInitializing}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
          >
            {isInitializing ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <RefreshCw className="w-4 h-4 mr-2" />}
            {isInitializing ? 'Initializing...' : 'Reinitialize'}
          </button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Connection Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatusIndicator status={status?.status} label="SignalWire Connection" />
          <StatusIndicator status={status?.webhooks_configured > 0 ? 'connected' : 'disconnected'} label="Webhooks" />
          <StatusIndicator status={status?.phone_numbers_count > 0 ? 'connected' : 'disconnected'} label="Phone Numbers" />
        </div>
        
        {status && (
          <div className="mt-4 p-4 bg-slate-50 rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-slate-600">Space URL:</span>
                <div className="font-medium">{status.space_url}</div>
              </div>
              <div>
                <span className="text-slate-600">Project ID:</span>
                <div className="font-medium font-mono text-xs">{status.project_id}</div>
              </div>
              <div>
                <span className="text-slate-600">Phone Numbers:</span>
                <div className="font-medium">{status.phone_numbers_count}</div>
              </div>
              <div>
                <span className="text-slate-600">Webhooks:</span>
                <div className="font-medium">{status.webhooks_configured}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Analytics Stats */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Messages Sent"
            value={analytics.total_sent.toLocaleString()}
            subtitle={`+${analytics.last_24h.sent} today`}
            icon={Send}
            trend="up"
          />
          <StatsCard
            title="Messages Received"
            value={analytics.total_received.toLocaleString()}
            subtitle={`+${analytics.last_24h.received} today`}
            icon={MessageSquare}
            trend="up"
          />
          <StatsCard
            title="Delivery Rate"
            value={`${analytics.delivery_rate}%`}
            subtitle="Excellent performance"
            icon={CheckCircle}
            trend="up"
          />
          <StatsCard
            title="Failed Messages"
            value={analytics.failed_messages}
            subtitle="Last 30 days"
            icon={AlertCircle}
            trend={analytics.failed_messages > 50 ? "down" : "neutral"}
          />
        </div>
      )}

      {/* Phone Numbers and Send SMS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Phone Numbers */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-900">Phone Numbers</h2>
            <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center text-sm">
              <Plus className="w-4 h-4 mr-1" />
              Add Number
            </button>
          </div>
          
          <div className="space-y-4">
            {phoneNumbers?.map((phoneNumber) => (
              <PhoneNumberCard
                key={phoneNumber.phone_number}
                phoneNumber={phoneNumber}
                onConfigure={handleConfigureWebhook}
              />
            ))}
          </div>
        </div>

        {/* Send SMS Form */}
        <SendSMSForm />
      </div>

      {/* Profile Analytics */}
      {analytics?.by_profile && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Profile Performance</h2>
          <div className="space-y-4">
            {analytics.by_profile.map((profile) => (
              <div key={profile.profile_id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <div className="font-medium text-slate-900">{profile.profile_name}</div>
                  <div className="text-sm text-slate-600">
                    {profile.sent} sent • {profile.received} received
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-slate-900">{profile.delivery_rate}%</div>
                  <div className="text-sm text-slate-600">delivery rate</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SignalWireDashboard;