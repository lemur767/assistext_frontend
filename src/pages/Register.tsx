// src/pages/Register.tsx - Fixed to use RegisterData interface
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, AlertCircle, Loader, CheckCircle, Phone, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { RegisterData, SearchNumbersRequest } from '../types/auth';

interface PhoneSetupData {
  country: string;
  areaCode: string;
  locality: string;
}

const Register: React.FC = () => {
  const { register: registerUser, searchNumbers, purchaseNumber } = useAuth();
  const navigate = useNavigate();
  
  // Multi-step state
  const [currentStep, setCurrentStep] = useState<'account' | 'phone' | 'complete'>('account');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  
  // Use RegisterData interface for form state
  const [formData, setFormData] = useState<RegisterData>({
    username: '',
    email: '',
    password: '',
    confirm_password: '',
    first_name: '',
    last_name: '',
    personal_phone: ''
  });
  
  // Phone setup data
  const [phoneSetupData, setPhoneSetupData] = useState<PhoneSetupData>({
    country: 'CA',
    areaCode: '',
    locality: ''
  });
  
  // Phone selection state
  const [availableNumbers, setAvailableNumbers] = useState<any[]>([]);
  const [selectedNumber, setSelectedNumber] = useState<string>('');
  const [selectionToken, setSelectionToken] = useState<string>('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  
  // Show/hide password
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Ontario area codes for dropdown
  const ontarioAreaCodes = [
    { code: '416', city: 'Toronto' },
    { code: '647', city: 'Toronto' },
    { code: '437', city: 'Toronto' },
    { code: '905', city: 'GTA' },
    { code: '289', city: 'Hamilton/GTA' },
    { code: '365', city: 'Hamilton' },
    { code: '613', city: 'Ottawa' },
    { code: '343', city: 'Ottawa' },
    { code: '705', city: 'Northern Ontario' },
    { code: '249', city: 'Northern Ontario' }
  ];

  // Handle account form submission
  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Validate form
      if (formData.password !== formData.confirm_password) {
        throw new Error('Passwords do not match');
      }

      // Register user with subproject creation - pass formData directly
      await registerUser(formData);

      // Move to phone setup step
      setCurrentStep('phone');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle phone number search
  const handleSearchNumbers = async () => {
    setSearchLoading(true);
    setError('');

    try {
      const searchCriteria: SearchNumbersRequest = {
        country: phoneSetupData.country,
        area_code: phoneSetupData.areaCode,
        locality: phoneSetupData.locality,
        limit: 5
      };

      const result = await searchNumbers(searchCriteria);
      
      if (result.success) {
        setAvailableNumbers(result.numbers);
        setSelectionToken(result.selection_token);
      } else {
        throw new Error(result.error || 'Failed to search numbers');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSearchLoading(false);
    }
  };

  // Handle phone number purchase
  const handlePurchaseNumber = async () => {
    if (!selectedNumber || !selectionToken) return;
    
    setPurchaseLoading(true);
    setError('');

    try {
      const result = await purchaseNumber({
        phone_number: selectedNumber,
        selection_token: selectionToken
      });

      if (result.success) {
        setCurrentStep('complete');
      } else {
        throw new Error(result.error || 'Failed to purchase number');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setPurchaseLoading(false);
    }
  };

  // Handle input changes - updated to match RegisterData fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handlePhoneSetupChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPhoneSetupData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            {currentStep === 'account' && 'Create your account'}
            {currentStep === 'phone' && 'Choose your phone number'}
            {currentStep === 'complete' && 'Setup complete!'}
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {currentStep === 'account' && 'Start your 14-day trial with SMS AI assistance'}
            {currentStep === 'phone' && 'Select a phone number for your AI assistant'}
            {currentStep === 'complete' && 'Your account is ready to use'}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center space-x-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            currentStep === 'account' ? 'bg-primary-600 text-white' : 'bg-green-500 text-white'
          }`}>
            {currentStep === 'account' ? '1' : <CheckCircle className="w-5 h-5" />}
          </div>
          <div className={`w-16 h-1 ${currentStep !== 'account' ? 'bg-green-500' : 'bg-slate-300'}`} />
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            currentStep === 'phone' ? 'bg-primary-600 text-white' : 
            currentStep === 'complete' ? 'bg-green-500 text-white' : 'bg-slate-300 text-slate-600'
          }`}>
            {currentStep === 'complete' ? <CheckCircle className="w-5 h-5" /> : '2'}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
            <div className="flex">
              <AlertCircle className="w-5 h-5 text-red-400 mr-2 flex-shrink-0" />
              <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
            </div>
          </div>
        )}

        {/* Step 1: Account Creation */}
        {currentStep === 'account' && (
          <form onSubmit={handleAccountSubmit} className="space-y-6">
            {/* First Name - using RegisterData field names */}
            <div>
              <label htmlFor="first_name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                First Name
              </label>
              <div className="mt-1 relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  required
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className="form-input pl-10"
                  placeholder="John"
                />
              </div>
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="last_name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Last Name
              </label>
              <div className="mt-1 relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  required
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className="form-input pl-10"
                  placeholder="Doe"
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Username
              </label>
              <div className="mt-1 relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleInputChange}
                  className="form-input pl-10"
                  placeholder="johndoe"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input pl-10"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            {/* Personal Phone (Optional) */}
            <div>
              <label htmlFor="personal_phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Personal Phone (Optional)
              </label>
              <div className="mt-1 relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="personal_phone"
                  name="personal_phone"
                  type="tel"
                  value={formData.personal_phone || ''}
                  onChange={handleInputChange}
                  className="form-input pl-10"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Password
              </label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="form-input pl-10 pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirm_password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="confirm_password"
                  name="confirm_password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirm_password}
                  onChange={handleInputChange}
                  className="form-input pl-10 pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Password Match Indicator */}
              {formData.confirm_password && (
                <div className="mt-1 flex items-center">
                  {formData.password === formData.confirm_password ? (
                    <div className="flex items-center text-green-600 dark:text-green-400">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      <span className="text-sm">Passwords match</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-600 dark:text-red-400">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      <span className="text-sm">Passwords do not match</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader className="w-5 h-5 animate-spin mr-2" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account & Continue
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Rest of the component remains the same... */}
        {/* Step 2: Phone Number Setup */}
        {currentStep === 'phone' && (
          <div className="space-y-6">
            {/* Search Criteria */}
            <div className="space-y-4">
              <div>
                <label htmlFor="areaCode" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Area Code (Ontario)
                </label>
                <select
                  id="areaCode"
                  name="areaCode"
                  value={phoneSetupData.areaCode}
                  onChange={handlePhoneSetupChange}
                  className="form-select mt-1"
                >
                  <option value="">Select area code</option>
                  {ontarioAreaCodes.map(area => (
                    <option key={area.code} value={area.code}>
                      {area.code} - {area.city}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="locality" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  City (Optional)
                </label>
                <div className="mt-1 relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    id="locality"
                    name="locality"
                    type="text"
                    value={phoneSetupData.locality}
                    onChange={handlePhoneSetupChange}
                    className="form-input pl-10"
                    placeholder="e.g., Toronto, Ottawa"
                  />
                </div>
              </div>

              <button
                onClick={handleSearchNumbers}
                disabled={searchLoading || !phoneSetupData.areaCode}
                className="btn btn-outline w-full"
              >
                {searchLoading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin mr-2" />
                    Searching...
                  </>
                ) : (
                  'Search Available Numbers'
                )}
              </button>
            </div>

            {/* Available Numbers */}
            {availableNumbers.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">
                  Available Numbers
                </h3>
                <div className="space-y-2">
                  {availableNumbers.map((number) => (
                    <div
                      key={number.phone_number}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedNumber === number.phone_number
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                      onClick={() => setSelectedNumber(number.phone_number)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-slate-900 dark:text-slate-100">
                            {number.phone_number}
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            {number.locality}, {number.region}
                          </div>
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          {number.monthly_cost}/month
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handlePurchaseNumber}
                  disabled={purchaseLoading || !selectedNumber}
                  className="btn btn-primary w-full"
                >
                  {purchaseLoading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin mr-2" />
                      Purchasing...
                    </>
                  ) : (
                    'Purchase Selected Number'
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Complete */}
        {currentStep === 'complete' && (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                Account Created Successfully!
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Your account and phone number have been configured. You can now start using your AI SMS assistant.
              </p>
            </div>

            <button
              onClick={() => navigate('/app/dashboard')}
              className="btn btn-primary w-full"
            >
              Go to Dashboard
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        )}

        {/* Login Link */}
        {currentStep === 'account' && (
          <div className="text-center">
            <p className="text-slate-600 dark:text-slate-400">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;