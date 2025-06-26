// src/pages/Register.tsx - Updated with live SignalWire integration

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import RegistrationService from '../services/registrationService';

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

const Register: React.FC = () => {
  const { isAuthenticated } = AuthContext;
  const navigate = useNavigate();

  // Multi-step form state
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [availableNumbers, setAvailableNumbers] = useState<RegistrationPhoneNumber[]>([]);
  const [selectedNumber, setSelectedNumber] = useState<RegistrationPhoneNumber | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  // Form data state
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    profileName: '',
    profileDescription: '',
    personalPhone: '',
    preferredCity: 'toronto'
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/app/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Load available numbers when reaching step 3 or when city changes
  useEffect(() => {
    if (currentStep === 3 && formData.preferredCity) {
      loadAvailableNumbers();
    }
  }, [currentStep, formData.preferredCity]);

  /**
   * Load available phone numbers from SignalWire via backend
   * Frontend → Backend → SignalWire API → Backend → Frontend (5 numbers)
   */
  const loadAvailableNumbers = async (): Promise<void> => {
    setLoading(true);
    setError('');
    setSelectedNumber(null);
    
    try {
      console.log(`Loading phone numbers for ${formData.preferredCity}...`);
      
      // Call backend which will call SignalWire API
      const result = await RegistrationService.searchPhoneNumbers(formData.preferredCity);
      
      if (result.success && result.available_numbers && result.available_numbers.length > 0) {
        setAvailableNumbers(result.available_numbers);
        toast.success(`Found ${result.available_numbers.length} available numbers in ${result.city}`);
      } else {
        setAvailableNumbers([]);
        setError(result.error || `No phone numbers available in ${formData.preferredCity}. Please try a different city.`);
        toast.error(result.error || 'No numbers available in this city');
      }
      
    } catch (err) {
      console.error('Error loading available numbers:', err);
      setAvailableNumbers([]);
      setError('Failed to load available phone numbers. Please try again or select a different city.');
      toast.error('Failed to load phone numbers');
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (field: keyof FormData, value: string): void => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear errors when user starts typing
    if (error) {
      setError('');
    }
    
    // If city changes and we're on step 3, reload numbers
    if (field === 'preferredCity' && currentStep === 3) {
      setAvailableNumbers([]);
      setSelectedNumber(null);
      // Numbers will be reloaded by useEffect
    }
  };

  // Handle phone number selection
  const handleNumberSelect = (number: RegistrationPhoneNumber): void => {
    setSelectedNumber(number);
    if (error) {
      setError('');
    }
    toast.success(`Selected ${number.formatted_number}`);
  };

  // Step validation
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        const passwordValid = RegistrationService.validatePassword(formData.password);
        const passwordsMatch = RegistrationService.validatePasswordMatch(formData.password, formData.confirmPassword);
        const emailValid = RegistrationService.validateEmailFormat(formData.email);
        
        return !!(
          formData.username &&
          formData.email &&
          formData.password &&
          formData.confirmPassword &&
          formData.firstName &&
          formData.lastName &&
          passwordValid.isValid &&
          passwordsMatch &&
          emailValid
        );
      case 2:
        return !!(formData.profileName && formData.preferredCity);
      case 3:
        return !!selectedNumber;
      default:
        return false;
    }
  };

  // Navigation functions
  const handleNextStep = (): void => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
      setError('');
    } else {
      switch (currentStep) {
        case 1:
          if (!RegistrationService.validatePassword(formData.password).isValid) {
            setError('Password must be at least 8 characters with uppercase, lowercase, and number');
          } else if (!RegistrationService.validatePasswordMatch(formData.password, formData.confirmPassword)) {
            setError('Passwords do not match');
          } else if (!RegistrationService.validateEmailFormat(formData.email)) {
            setError('Please enter a valid email address');
          } else {
            setError('Please fill in all required fields correctly');
          }
          break;
        case 2:
          setError('Please fill in profile name and select a city');
          break;
        case 3:
          setError('Please select a phone number');
          break;
        default:
          setError('Please complete all required fields');
      }
    }
  };

  const handlePrevStep = (): void => {
    setCurrentStep(prev => prev - 1);
    setError('');
  };

  /**
   * Complete signup process
   * This will purchase the selected SignalWire number and create the account
   */
  const handleCompleteSignup = async (): Promise<void> => {
    if (!selectedNumber) {
      setError('Please select a phone number.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log(`Completing signup for ${formData.username} with number ${selectedNumber.phone_number}`);
      
      const signupData: CompleteSignupData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        firstName: formData.firstName,
        lastName: formData.lastName,
        profileName: formData.profileName,
        profileDescription: formData.profileDescription,
        personalPhone: formData.personalPhone,
        selectedPhoneNumber: selectedNumber.phone_number,
        timezone: 'America/Toronto'
      };

      // Complete signup (backend will purchase the SignalWire number)
      const result = await RegistrationService.completeSignup(signupData);

      if (result.success) {
        // Store auth token
        localStorage.setItem('authToken', result.access_token);
        localStorage.setItem('refreshToken', result.refresh_token);
        
        setSuccess(true);
        toast.success(`Account created! Welcome ${result.user.first_name}! Phone number ${selectedNumber.formatted_number} is ready for SMS AI.`);
        
        // Redirect to dashboard
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
        
      } else {
        setError(result.error || 'Failed to create account. Please try again.');
        toast.error(result.error || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Error creating account. Please try again.');
      toast.error('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // Retry loading numbers if failed
  const handleRetryLoadNumbers = (): void => {
    loadAvailableNumbers();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-600 mt-2">Join SMS AI and get your phone number</p>
          
          {/* Progress indicator */}
          <div className="flex justify-center mt-6 space-x-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`w-3 h-3 rounded-full ${
                  step <= currentStep
                    ? 'bg-blue-600'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Step {currentStep} of 3
          </p>
        </div>

        {/* Step content */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <input
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            
            <input
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Profile Setup</h2>
            
            <input
              type="text"
              placeholder="Profile Name (e.g., My Business)"
              value={formData.profileName}
              onChange={(e) => handleInputChange('profileName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            
            <textarea
              placeholder="Profile Description (optional)"
              value={formData.profileDescription}
              onChange={(e) => handleInputChange('profileDescription', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
            
            <select
              value={formData.preferredCity}
              onChange={(e) => handleInputChange('preferredCity', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="toronto">Toronto, ON</option>
              <option value="ottawa">Ottawa, ON</option>
              <option value="vancouver">Vancouver, BC</option>
              <option value="montreal">Montreal, QC</option>
              <option value="calgary">Calgary, AB</option>
              <option value="edmonton">Edmonton, AB</option>
              <option value="mississauga">Mississauga, ON</option>
              <option value="hamilton">Hamilton, ON</option>
              <option value="london">London, ON</option>
              <option value="winnipeg">Winnipeg, MB</option>
            </select>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Choose Your Phone Number</h2>
            <p className="text-sm text-gray-600">
              Select a phone number for SMS AI in {formData.preferredCity.charAt(0).toUpperCase() + formData.preferredCity.slice(1)}
            </p>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading available numbers from SignalWire...</p>
              </div>
            ) : availableNumbers.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {availableNumbers.map((number) => (
                  <div
                    key={number.phone_number}
                    onClick={() => handleNumberSelect(number)}
                    className={`p-3 border rounded-md cursor-pointer transition-colors ${
                      selectedNumber?.phone_number === number.phone_number
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{number.formatted_number}</p>
                        <p className="text-sm text-gray-600">{number.locality}, {number.region}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Setup: {number.setup_cost}</p>
                        <p className="text-sm text-gray-600">Monthly: {number.monthly_cost}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">No numbers available in {formData.preferredCity}</p>
                <button
                  onClick={handleRetryLoadNumbers}
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Try again
                </button>
              </div>
            )}
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Success message */}
        {success && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-600 text-sm">Account created successfully! Redirecting...</p>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between mt-8">
          {currentStep > 1 && (
            <button
              onClick={handlePrevStep}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              disabled={loading}
            >
              Previous
            </button>
          )}
          
          <div className="ml-auto">
            {currentStep < 3 ? (
              <button
                onClick={handleNextStep}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                disabled={loading || !validateStep(currentStep)}
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleCompleteSignup}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                disabled={loading || !selectedNumber}
              >
                {loading ? 'Creating Account...' : 'Complete Registration'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;