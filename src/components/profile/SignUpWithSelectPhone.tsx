import React from 'react';
import type { ChangeEvent } from 'react';
import { Phone, MapPin, Check, Loader, AlertCircle, User, Mail, Lock, Tag } from 'lucide-react';

// Type definitions for the component props
interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  profileName: string;
  profileDescription: string;
  personalPhone: string;
  preferredCity: string;
}

interface PhoneNumberCapabilities {
  sms: boolean;
  voice: boolean;
  mms: boolean;
}

interface AvailableNumber {
  phone_number: string;
  formatted_number: string;
  locality: string;
  region: string;
  area_code: string;
  setup_cost: string;
  monthly_cost: string;
  capabilities: PhoneNumberCapabilities;
}

interface City {
  value: string;
  label: string;
  areaCodes: string[];
}

interface Step {
  number: number;
  title: string;
  desc: string;
}

// Props interface for the component
interface SignUpWithSelectPhoneProps {
  currentStep: number;
  formData: FormData;
  availableNumbers: AvailableNumber[];
  selectedNumber: AvailableNumber | null;
  loading: boolean;
  error: string;
  success: boolean;
  
  // Event handlers
  onInputChange: (field: keyof FormData, value: string) => void;
  onNumberSelect: (number: AvailableNumber) => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  onCompleteSignup: () => void;
  onLoadNumbers: () => void;
  
  // Validation
  validateStep: (step: number) => boolean;
}

const SignUpWithSelectPhone: React.FC<SignUpWithSelectPhoneProps> = ({
  currentStep,
  formData,
  availableNumbers,
  selectedNumber,
  loading,
  error,
  success,
  onInputChange,
  onNumberSelect,
  onNextStep,
  onPrevStep,
  onCompleteSignup,
  validateStep
}) => {
  
  // Cities configuration
  const cities: City[] = [
    { value: 'toronto', label: 'Toronto', areaCodes: ['416', '647', '437'] },
    { value: 'ottawa', label: 'Ottawa', areaCodes: ['613', '343'] },
    { value: 'mississauga', label: 'Mississauga/GTA', areaCodes: ['905', '289', '365'] },
    { value: 'london', label: 'London', areaCodes: ['519', '226', '548'] },
    { value: 'hamilton', label: 'Hamilton', areaCodes: ['905', '289'] }
  ];

  // Steps configuration
  const steps: Step[] = [
    { number: 1, title: 'Account Info', desc: 'Basic account details' },
    { number: 2, title: 'Profile Setup', desc: 'Create your profile' },
    { number: 3, title: 'Phone Number', desc: 'Choose your number' },
    { number: 4, title: 'Complete', desc: 'Finalize setup' }
  ];

  // Helper function to get selected city
  const getSelectedCity = (): City | undefined => {
    return cities.find(c => c.value === formData.preferredCity);
  };

  // Success screen
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to AssisText!</h2>
          <p className="text-gray-600 mb-6">
            Your account has been created and your phone number is ready to receive messages.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">Your phone number:</p>
            <p className="text-xl font-bold text-gray-900">{selectedNumber?.formatted_number}</p>
          </div>
          <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.number 
                    ? 'bg-white text-purple-900 border-white' 
                    : 'border-white/30 text-white/60'
                }`}>
                  {currentStep > step.number ? <Check className="w-5 h-5" /> : step.number}
                </div>
                <div className="ml-3 hidden sm:block">
                  <p className={`text-sm font-medium ${currentStep >= step.number ? 'text-white' : 'text-white/60'}`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-white/40">{step.desc}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    currentStep > step.number ? 'bg-white' : 'bg-white/20'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                <span className="text-red-700">{error}</span>
              </div>
            )}

            {/* Step 1: Account Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h2>
                  <p className="text-gray-600">Start your SMS AI responder journey</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="w-4 h-4 inline mr-1" />
                      First Name
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => onInputChange('firstName', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => onInputChange('lastName', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-1" />
                    Username *
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => onInputChange('username', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Choose a username"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => onInputChange('email', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Lock className="w-4 h-4 inline mr-1" />
                      Password *
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => onInputChange('password', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Create a password"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => onInputChange('confirmPassword', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Confirm your password"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Personal Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    value={formData.personalPhone}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => onInputChange('personalPhone', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Your personal phone number"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Profile Setup */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Your Profile</h2>
                  <p className="text-gray-600">Set up your AI responder profile</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Tag className="w-4 h-4 inline mr-1" />
                    Profile Name *
                  </label>
                  <input
                    type="text"
                    value={formData.profileName}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => onInputChange('profileName', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Sophia, Diamond, etc."
                    required
                  />
                  <p className="mt-1 text-sm text-gray-500">This will be the name clients know you by</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Profile Description</label>
                  <textarea
                    value={formData.profileDescription}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onInputChange('profileDescription', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Brief description of your services and personality (optional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Preferred City/Region
                  </label>
                  <select
                    value={formData.preferredCity}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => onInputChange('preferredCity', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {cities.map(city => (
                      <option key={city.value} value={city.value}>
                        {city.label} ({city.areaCodes.join(', ')})
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-sm text-gray-500">
                    This determines which area codes we'll search for your phone number
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Phone Number Selection */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Phone Number</h2>
                  <p className="text-gray-600">
                    Select from available Ontario numbers for your profile "{formData.profileName}"
                  </p>
                </div>

                {loading ? (
                  <div className="text-center py-8">
                    <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
                    <p className="text-gray-600">Finding available numbers in {getSelectedCity()?.label}...</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {availableNumbers.map((number) => (
                      <div
                        key={number.phone_number}
                        onClick={() => onNumberSelect(number)}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedNumber?.phone_number === number.phone_number
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`w-4 h-4 rounded-full border-2 ${
                              selectedNumber?.phone_number === number.phone_number
                                ? 'border-purple-500 bg-purple-500'
                                : 'border-gray-300'
                            }`}>
                              {selectedNumber?.phone_number === number.phone_number && (
                                <div className="w-full h-full rounded-full bg-white scale-50"></div>
                              )}
                            </div>
                            <div>
                              <p className="text-lg font-semibold text-gray-900">
                                {number.formatted_number}
                              </p>
                              <p className="text-sm text-gray-600">
                                {number.locality}, {number.region} • Area Code {number.area_code}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">{number.setup_cost} setup</p>
                            <p className="text-sm text-gray-600">{number.monthly_cost}/month</p>
                          </div>
                        </div>
                        
                        <div className="mt-2 flex space-x-2">
                          {number.capabilities.sms && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              SMS
                            </span>
                          )}
                          {number.capabilities.voice && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Voice
                            </span>
                          )}
                          {number.capabilities.mms && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              MMS
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {availableNumbers.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">What happens next?</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Your chosen number will be purchased automatically</li>
                      <li>• SMS webhooks will be configured instantly</li>
                      <li>• AI responses will be enabled immediately</li>
                      <li>• You can start receiving messages right away</li>
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Complete Setup */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Setup</h2>
                  <p className="text-gray-600">Review your information and finalize your account</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">Account Details</h4>
                    <p className="text-gray-600">Username: {formData.username}</p>
                    <p className="text-gray-600">Email: {formData.email}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900">Profile Information</h4>
                    <p className="text-gray-600">Profile Name: {formData.profileName}</p>
                    <p className="text-gray-600">Location: {getSelectedCity()?.label}</p>
                  </div>
                  
                  {selectedNumber && (
                    <div>
                      <h4 className="font-semibold text-gray-900">Selected Phone Number</h4>
                      <p className="text-lg font-bold text-purple-600">{selectedNumber.formatted_number}</p>
                      <p className="text-gray-600">{selectedNumber.locality}, {selectedNumber.region}</p>
                      <p className="text-sm text-gray-500">Setup: {selectedNumber.setup_cost} • Monthly: {selectedNumber.monthly_cost}</p>
                    </div>
                  )}
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2">✨ Your AssisText agent will be ready with:</h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Instant SMS webhook configuration</li>
                    <li>• AI responses enabled by default</li>
                    <li>• Business hours set (10 AM - 10 PM)</li>
                    <li>• Professional message handling</li>
                    <li>• Real-time message monitoring</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onPrevStep}
                disabled={currentStep === 1}
                className={`px-6 py-2 rounded-lg font-medium ${
                  currentStep === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Previous
              </button>

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={onNextStep}
                  disabled={!validateStep(currentStep)}
                  className={`px-6 py-2 rounded-lg font-medium ${
                    validateStep(currentStep)
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Continue
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onCompleteSignup}
                  disabled={loading}
                  className="px-8 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 flex items-center"
                >
                  {loading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin mr-2" />
                      Creating Account...
                    </>
                  ) : (
                    'Complete Setup'
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpWithSelectPhone;