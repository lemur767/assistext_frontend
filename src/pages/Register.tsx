import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import SignUpWithSelectPhone from '../components/profile/SignUpWithSelectPhone';

// Type definitions
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

interface ApiResponse {
  error?: string;
  available_numbers?: AvailableNumber[];
  tokens?: {
    access_token: string;
    refresh_token: string;
  };
  user?: any;
  profile?: any;
  [key: string]: any;
}

interface CompleteSignupData extends FormData {
  selected_phone_number: string;
  profile_description: string;
}

const Register: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Multi-step form state
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [availableNumbers, setAvailableNumbers] = useState<AvailableNumber[]>([]);
  const [selectedNumber, setSelectedNumber] = useState<AvailableNumber | null>(null);
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
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Load available numbers when reaching step 3
  useEffect(() => {
    if (currentStep === 3) {
      loadAvailableNumbers();
    }
  }, [currentStep, formData.preferredCity]);

  // API call to load available phone numbers
  const loadAvailableNumbers = async (): Promise<void> => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/signup/available-numbers?city=${formData.preferredCity}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data: ApiResponse = await response.json();
      
      if (response.ok && data.available_numbers) {
        setAvailableNumbers(data.available_numbers);
      } else {
        setError(data.error || 'Failed to load available numbers');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error connecting to server';
      setError(errorMessage);
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
  };

  // Handle phone number selection
  const handleNumberSelect = (number: AvailableNumber): void => {
    setSelectedNumber(number);
    if (error) {
      setError('');
    }
  };

  // Step validation
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(
          formData.username.trim() && 
          formData.email.trim() && 
          formData.password && 
          formData.confirmPassword &&
          formData.password === formData.confirmPassword &&
          formData.password.length >= 8 &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
          /^[a-zA-Z0-9_-]+$/.test(formData.username) &&
          formData.username.length >= 3
        );
      case 2:
        return !!formData.profileName.trim();
      case 3:
        return !!selectedNumber;
      case 4:
        return !!(formData.username && formData.email && formData.password && 
                 formData.profileName && selectedNumber);
      default:
        return true;
    }
  };

  // Validation error messages
  const getValidationErrors = (step: number): string[] => {
    const errors: string[] = [];
    
    if (step === 1) {
      if (!formData.username.trim()) errors.push('Username is required');
      else if (formData.username.length < 3) errors.push('Username must be at least 3 characters');
      else if (!/^[a-zA-Z0-9_-]+$/.test(formData.username)) errors.push('Username can only contain letters, numbers, underscores and hyphens');
      
      if (!formData.email.trim()) errors.push('Email is required');
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.push('Please enter a valid email address');
      
      if (!formData.password) errors.push('Password is required');
      else if (formData.password.length < 8) errors.push('Password must be at least 8 characters');
      
      if (!formData.confirmPassword) errors.push('Please confirm your password');
      else if (formData.password !== formData.confirmPassword) errors.push('Passwords do not match');
    }
    
    if (step === 2 && !formData.profileName.trim()) {
      errors.push('Profile name is required');
    }
    
    if (step === 3 && !selectedNumber) {
      errors.push('Please select a phone number');
    }
    
    return errors;
  };

  // Navigation functions
  const handleNextStep = (): void => {
    const validationErrors = getValidationErrors(currentStep);
    
    if (validationErrors.length > 0) {
      setError(validationErrors[0]); // Show first error
      return;
    }
    
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
      setError('');
    }
  };

  const handlePrevStep = (): void => {
    setCurrentStep(prev => prev - 1);
    setError('');
  };

  // Complete signup API call
  const handleCompleteSignup = async (): Promise<void> => {
    if (!selectedNumber) {
      setError('Please select a phone number');
      return;
    }

    if (!validateStep(4)) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const signupData: CompleteSignupData = {
        ...formData,
        selected_phone_number: selectedNumber.phone_number,
        profile_description: formData.profileDescription
      };

      const response = await fetch('/api/signup/complete-signup', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData)
      });

      const data: ApiResponse = await response.json();

      if (response.ok && data.tokens) {
        setSuccess(true);
        
        // Store authentication tokens
        localStorage.setItem('access_token', data.tokens.access_token);
        localStorage.setItem('refresh_token', data.tokens.refresh_token);
        
        // Store user data if provided
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        
        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      } else {
        setError(data.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error creating account. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Force reload numbers when city changes
  const handleCityChange = (field: keyof FormData, value: string): void => {
    handleInputChange(field, value);
    if (field === 'preferredCity' && currentStep === 3) {
      setAvailableNumbers([]);
      setSelectedNumber(null);
      // Numbers will be reloaded by useEffect
    }
  };

  return (
    <SignUpWithSelectPhone
      currentStep={currentStep}
      formData={formData}
      availableNumbers={availableNumbers}
      selectedNumber={selectedNumber}
      loading={loading}
      error={error}
      success={success}
      onInputChange={formData.preferredCity ? handleCityChange : handleInputChange}
      onNumberSelect={handleNumberSelect}
      onNextStep={handleNextStep}
      onPrevStep={handlePrevStep}
      onCompleteSignup={handleCompleteSignup}
      onLoadNumbers={loadAvailableNumbers}
      validateStep={validateStep}
    />
  );
};

export default Register;