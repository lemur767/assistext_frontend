import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Phone, 
  Globe, 
  MapPin, 
  CreditCard, 
  Settings, 
  CheckCircle,
  AlertCircle,
  Loader,
  RefreshCw,
  Link,
  Webhook,
  Shield
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Region {
  code: string;
  name: string;
  localities: Locality[];
}

interface Locality {
  code: string;
  name: string;
  area_codes: string[];
}

interface AvailableNumber {
  phone_number: string;
  friendly_name: string;
  locality: string;
  region: string;
  capabilities: {
    voice: boolean;
    sms: boolean;
    mms: boolean;
  };
}

interface SubAccount {
  sid: string;
  friendly_name: string;
  status: string;
  phone_numbers: Array<{
    phone_number: string;
    capabilities: any;
    webhook_configured: boolean;
  }>;
  monthly_limit: number;
  current_usage: number;
  created_at: string;
}

interface SearchCriteria {
  country: string;
  region: string;
  locality: string;
  area_code: string;
}

const SignalWireSettings: React.FC = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<'search' | 'select' | 'purchase' | 'complete'>('search');
  const [isLoading, setIsLoading] = useState(false);
  const [subAccount, setSubAccount] = useState<SubAccount | null>(null);
  
  // Search criteria state
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
    country: 'CA',
    region: 'ON',
    locality: 'Toronto',
    area_code: '416'
  });
  
  // Available numbers from search
  const [availableNumbers, setAvailableNumbers] = useState<AvailableNumber[]>([]);
  const [selectedNumber, setSelectedNumber] = useState<string>('');
  const [selectionToken, setSelectionToken] = useState<string>('');
  
  // Webhook configuration
  const [webhookUrl, setWebhookUrl] = useState<string>('');
  const [webhookStatus, setWebhookStatus] = useState<'pending' | 'configured' | 'error'>('pending');

  // Canadian regions and localities
  const canadianRegions: Region[] = [
    {
      code: 'ON',
      name: 'Ontario',
      localities: [
        { code: 'Toronto', name: 'Toronto', area_codes: ['416', '647', '437'] },
        { code: 'Ottawa', name: 'Ottawa', area_codes: ['613', '343'] },
        { code: 'Hamilton', name: 'Hamilton', area_codes: ['905', '289'] },
        { code: 'London', name: 'London', area_codes: ['519', '226'] }
      ]
    },
    {
      code: 'QC',
      name: 'Quebec',
      localities: [
        { code: 'Montreal', name: 'Montreal', area_codes: ['514', '438'] },
        { code: 'Quebec_City', name: 'Quebec City', area_codes: ['418', '581'] }
      ]
    },
    {
      code: 'BC',
      name: 'British Columbia',
      localities: [
        { code: 'Vancouver', name: 'Vancouver', area_codes: ['604', '778', '236'] },
        { code: 'Victoria', name: 'Victoria', area_codes: ['250', '778'] }
      ]
    },
    {
      code: 'AB',
      name: 'Alberta',
      localities: [
        { code: 'Calgary', name: 'Calgary', area_codes: ['403', '587', '825'] },
        { code: 'Edmonton', name: 'Edmonton', area_codes: ['780', '587', '825'] }
      ]
    }
  ];

  // Load existing subaccount on component mount
  useEffect(() => {
    loadExistingSubAccount();
  }, []);

  const loadExistingSubAccount = async () => {
    try {
      const response = await fetch('/api/signalwire/subaccount', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.subaccount) {
          setSubAccount(data.subaccount);
          setCurrentStep('complete');
          
          // Check webhook status
          if (data.subaccount.phone_numbers?.length > 0) {
            const phoneNumber = data.subaccount.phone_numbers[0];
            setWebhookStatus(phoneNumber.webhook_configured ? 'configured' : 'error');
          }
        }
      }
    } catch (error) {
      console.error('Failed to load subaccount:', error);
    }
  };

  const handleSearchNumbers = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/signalwire/search-numbers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          country: searchCriteria.country,
          region: searchCriteria.region,
          locality: searchCriteria.locality,
          area_code: searchCriteria.area_code,
          limit: 10
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to search numbers');
      }

      const data = await response.json();
      
      if (data.success) {
        setAvailableNumbers(data.available_numbers);
        setSelectionToken(data.selection_token);
        setCurrentStep('select');
        toast.success(`Found ${data.available_numbers.length} available numbers`);
      } else {
        throw new Error(data.error || 'Search failed');
      }
    } catch (error) {
      console.error('Number search error:', error);
      toast.error(error.message || 'Failed to search numbers');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePurchaseNumber = async () => {
    if (!selectedNumber || !selectionToken) {
      toast.error('Please select a number first');
      return;
    }

    setIsLoading(true);
    setCurrentStep('purchase');

    try {
      const response = await fetch('/api/signalwire/purchase-number', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          selectionToken,
          selectedPhoneNumber: selectedNumber,
          webhookUrl: webhookUrl || undefined
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to purchase number');
      }

      const data = await response.json();
      
      if (data.success) {
        setSubAccount(data.subaccount);
        setWebhookStatus('configured');
        setCurrentStep('complete');
        toast.success('Phone number purchased and configured successfully!');
      } else {
        throw new Error(data.error || 'Purchase failed');
      }
    } catch (error) {
      console.error('Number purchase error:', error);
      toast.error(error.message || 'Failed to purchase number');
      setCurrentStep('select');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWebhookTest = async () => {
    if (!subAccount) return;

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/signalwire/test-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          subaccount_sid: subAccount.sid
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Webhook test failed');
      }

      const data = await response.json();
      
      if (data.success) {
        toast.success('Webhook test successful!');
        setWebhookStatus('configured');
      } else {
        toast.error(data.error || 'Webhook test failed');
        setWebhookStatus('error');
      }
    } catch (error) {
      console.error('Webhook test error:', error);
      toast.error(error.message || 'Webhook test failed');
      setWebhookStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentLocalityData = () => {
    const region = canadianRegions.find(r => r.code === searchCriteria.region);
    return region?.localities || [];
  };

  const getCurrentAreaCodes = () => {
    const localities = getCurrentLocalityData();
    const locality = localities.find(l => l.code === searchCriteria.locality);
    return locality?.area_codes || [];
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            SignalWire Settings
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Configure your phone number and messaging settings
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {['search', 'select', 'purchase', 'complete'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                  ${currentStep === step || (step === 'complete' && currentStep === 'complete') 
                    ? 'bg-brand-primary text-white' 
                    : index < ['search', 'select', 'purchase', 'complete'].indexOf(currentStep)
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                  }
                `}>
                  {index < ['search', 'select', 'purchase', 'complete'].indexOf(currentStep) ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < 3 && (
                  <div className={`w-20 h-1 mx-2 ${
                    index < ['search', 'select', 'purchase', 'complete'].indexOf(currentStep)
                      ? 'bg-emerald-500'
                      : 'bg-slate-200 dark:bg-slate-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          <div className="flex justify-between mt-2 text-sm text-slate-600 dark:text-slate-400">
            <span>Search</span>
            <span>Select</span>
            <span>Purchase</span>
            <span>Complete</span>
          </div>
        </div>

        {/* Step 1: Search Criteria */}
        {currentStep === 'search' && (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-6">
              Choose Your Location
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Country
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <select
                    value={searchCriteria.country}
                    onChange={(e) => setSearchCriteria(prev => ({ ...prev, country: e.target.value }))}
                    className="form-select pl-10"
                  >
                    <option value="CA">Canada</option>
                    <option value="US">United States</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Province/State
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <select
                    value={searchCriteria.region}
                    onChange={(e) => setSearchCriteria(prev => ({ 
                      ...prev, 
                      region: e.target.value,
                      locality: '',
                      area_code: ''
                    }))}
                    className="form-select pl-10"
                  >
                    {canadianRegions.map(region => (
                      <option key={region.code} value={region.code}>
                        {region.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  City
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <select
                    value={searchCriteria.locality}
                    onChange={(e) => setSearchCriteria(prev => ({ 
                      ...prev, 
                      locality: e.target.value,
                      area_code: ''
                    }))}
                    className="form-select pl-10"
                  >
                    <option value="">Select a city</option>
                    {getCurrentLocalityData().map(locality => (
                      <option key={locality.code} value={locality.code}>
                        {locality.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Area Code (Optional)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <select
                    value={searchCriteria.area_code}
                    onChange={(e) => setSearchCriteria(prev => ({ ...prev, area_code: e.target.value }))}
                    className="form-select pl-10"
                  >
                    <option value="">Any area code</option>
                    {getCurrentAreaCodes().map(code => (
                      <option key={code} value={code}>
                        {code}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={handleSearchNumbers}
                disabled={isLoading || !searchCriteria.locality}
                className="btn-primary flex items-center space-x-2"
              >
                {isLoading ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Phone className="w-4 h-4" />
                )}
                <span>{isLoading ? 'Searching...' : 'Search Available Numbers'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Select Number */}
        {currentStep === 'select' && (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Select Your Number
              </h2>
              <button
                onClick={() => setCurrentStep('search')}
                className="text-brand-primary hover:text-brand-accent transition-colors"
              >
                ← Back to search
              </button>
            </div>

            <div className="space-y-4">
              {availableNumbers.map((number) => (
                <div
                  key={number.phone_number}
                  className={`
                    border rounded-lg p-4 cursor-pointer transition-all
                    ${selectedNumber === number.phone_number
                      ? 'border-brand-primary bg-brand-primary/5'
                      : 'border-slate-200 dark:border-slate-700 hover:border-brand-primary/50'
                    }
                  `}
                  onClick={() => setSelectedNumber(number.phone_number)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-slate-900 dark:text-slate-100">
                        {number.phone_number}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        {number.locality}, {number.region}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {number.capabilities.sms && (
                        <span className="badge badge-success">SMS</span>
                      )}
                      {number.capabilities.voice && (
                        <span className="badge badge-info">Voice</span>
                      )}
                      {number.capabilities.mms && (
                        <span className="badge badge-info">MMS</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Webhook Configuration (Optional) */}
            <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-3">
                Custom Webhook URL (Optional)
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                Leave empty to use our default webhook configuration.
              </p>
              <div className="relative">
                <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://your-server.com/webhook"
                  className="form-input pl-10"
                />
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setCurrentStep('search')}
                className="btn-outline"
              >
                Back
              </button>
              <button
                onClick={handlePurchaseNumber}
                disabled={!selectedNumber}
                className="btn-primary flex items-center space-x-2"
              >
                <CreditCard className="w-4 h-4" />
                <span>Purchase Number</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Purchase in Progress */}
        {currentStep === 'purchase' && (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="text-center py-8">
              <Loader className="w-12 h-12 animate-spin text-brand-primary mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                Setting up your phone number...
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                This may take a few moments while we configure your subaccount and webhook.
              </p>
            </div>
          </div>
        )}

        {/* Step 4: Complete */}
        {currentStep === 'complete' && subAccount && (
          <div className="space-y-6">
            {/* Account Overview */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <CheckCircle className="w-8 h-8 text-emerald-500" />
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    SignalWire Account Active
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400">
                    Your phone number is configured and ready to receive messages
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-3">
                    Account Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Account ID:</span>
                      <span className="font-mono">{subAccount.sid}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Status:</span>
                      <span className="badge badge-success">{subAccount.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Monthly Limit:</span>
                      <span>{subAccount.monthly_limit} messages</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Current Usage:</span>
                      <span>{subAccount.current_usage} messages</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-3">
                    Phone Numbers
                  </h3>
                  <div className="space-y-2">
                    {subAccount.phone_numbers.map((phone, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                        <div>
                          <div className="font-medium">{phone.phone_number}</div>
                          <div className="text-sm text-slate-500">
                            SMS • Voice • MMS
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {phone.webhook_configured ? (
                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-amber-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Webhook Status */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Webhook Configuration
                </h3>
                <div className={`flex items-center space-x-2 ${
                  webhookStatus === 'configured' ? 'text-emerald-600' : 
                  webhookStatus === 'error' ? 'text-red-600' : 'text-amber-600'
                }`}>
                  {webhookStatus === 'configured' ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : webhookStatus === 'error' ? (
                    <AlertCircle className="w-5 h-5" />
                  ) : (
                    <Loader className="w-5 h-5 animate-spin" />
                  )}
                  <span className="font-medium capitalize">{webhookStatus}</span>
                </div>
              </div>

              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Webhooks allow incoming messages to be automatically processed by our AI system.
              </p>

              <div className="flex space-x-4">
                <button
                  onClick={handleWebhookTest}
                  disabled={isLoading}
                  className="btn-outline flex items-center space-x-2"
                >
                  {isLoading ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  <span>Test Webhook</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignalWireSettings;  