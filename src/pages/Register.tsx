// src/pages/Register.tsx - Updated for SignalWire integration
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { signalwireService, type SignalWireNumber, type PhoneNumberSearchParams } from '../services/signalwireService';
import { toast } from 'react-hot-toast';
import { SignalWireAPI } from '../api/signalwire';
import SignUpWithSelectPhone from '../components/profile/SignUpWithSelectPhone'

// Type definitions updated for SignalWire
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

interface ApiResponse {
  error?: string;
  success?: boolean;
  tokens?: {
    access_token: string;
    refresh_token: string;
  };
  user?: any;
  profile?: any;
  [key: string]: any;
}

interface CompleteSignupData extends FormData {
  selectedPhoneNumber: string;
  profileDescription: string;
}

const Register: React.FC = () => {
  const { isAuthenticated } = AuthContext;
  const navigate = useNavigate();

  // Multi-step form state
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [availableNumbers, setAvailableNumbers] = useState<SignalWireNumber[]>([]);
  const [selectedNumber, setSelectedNumber] = useState<SignalWireNumber | null>(null);
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

  // City to area code mapping for Canada
  const cityAreaCodes: Record<string, string[]> = {
    toronto: ['416', '647', '437'],
    ottawa: ['613', '343'],
    mississauga: ['905', '289', '365'],
    london: ['519', '226', '548'],
    hamilton: ['905', '289'],
    montreal: ['514', '438'],
    vancouver: ['604', '778', '236'],
    calgary: ['403', '587', '825'],
    edmonton: ['780', '587', '825'],
    winnipeg: ['204', '431']
  };

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('app/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Load available numbers when reaching step 3
  useEffect(() => {
    if (currentStep === 3) {
      loadAvailableNumbers();
    }
  }, [currentStep, formData.preferredCity]);

  // Load available phone numbers from SignalWire
  const loadAvailableNumbers = async (): Promise<void> => {
  setLoading(true);
  setError('');
  
  try {
    // Use the new search endpoint
    const response = await fetch('/api/signup/search-numbers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        city: formData.preferredCity,
        // Or specify area_code directly: area_code: '416'
      }),
    });

    const data = await response.json();
    
    if (response.ok && data.available_numbers) {
      setAvailableNumbers(data.available_numbers);
    } else {
      setError(data.error || 'No phone numbers available in your selected city.');
    }
  } catch (err) {
    console.error('Error loading available numbers:', err);
    setError('Failed to load available phone numbers.');
  } finally {
    setLoading(false);
  }
};
  // Get province for city (for SignalWire API)
  const getProvinceForCity = (city: string): string => {
    const cityToProvince: Record<string, string> = {
      toronto: 'ON',
      ottawa: 'ON',
      mississauga: 'ON',
      london: 'ON',
      hamilton: 'ON',
      montreal: 'QC',
      vancouver: 'BC',
      calgary: 'AB',
      edmonton: 'AB',
      winnipeg: 'MB'
    };
    return cityToProvince[city] || 'ON';
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
  const handleNumberSelect = (number: SignalWireNumber): void => {
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
          formData.username &&
          formData.email &&
          formData.password &&
          formData.confirmPassword &&
          formData.firstName &&
          formData.lastName &&
          formData.password === formData.confirmPassword
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
      setError('Please fill in all required fields correctly.');
    }
  };

  const handlePrevStep = (): void => {
    setCurrentStep(prev => prev - 1);
    setError('');
  };

  // Complete signup with SignalWire phone number
  const handleCompleteSignup = async (): Promise<void> => {
  if (!selectedNumber) {
    setError('Please select a phone number.');
    return;
  }

  setLoading(true);
  setError('');

  try {
    const response = await fetch('/api/signup/complete-signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        firstName: formData.firstName,
        lastName: formData.lastName,
        profileName: formData.profileName,
        profileDescription: formData.profileDescription,
        personalPhone: formData.personalPhone,
        selectedPhoneNumber: selectedNumber.phone_number, // Changed from phoneNumber
        timezone: 'America/Toronto'
      }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      // Store auth token
      localStorage.setItem('authToken', data.access_token);
      
      toast.success('Account created successfully! Phone number activated for SMS AI.');
      
      // Redirect to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } else {
      setError(data.error || 'Failed to create account. Please try again.');
      toast.error(data.error || 'Registration failed');
    }
  } catch (err) {
    console.error('Registration error:', err);
    setError('Error creating account. Please try again.');
    toast.error('Registration failed');
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
