// src/pages/Register.tsx - Complete working register component
import React, { useState } from 'react';
// import { Link } from 'react-router-dom'; // Remove for artifact
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, AlertCircle, Loader, CheckCircle, MapPin, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { RegisterData } from '../types/auth';

interface RegisterFormData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  // Added for setup_tenant_user
  preferredCountry: string;
  preferredRegion: string;
  preferredCity: string;
}

interface ValidationErrors {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  // Added for setup_tenant_user
  preferredCountry?: string;
  preferredRegion?: string;
  preferredCity?: string;
}

const Register: React.FC = () => {
  const { register: registerUser } = useAuth();
  
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    // Added for setup_tenant_user
    preferredCountry: 'CA',
    preferredRegion: '',
    preferredCity: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Added for location selection
  const countries = [
    { code: 'CA', name: 'Canada' },
    { code: 'US', name: 'United States' }
  ];

  const regions = {
    CA: [
      { code: 'ON', name: 'Ontario' },
      { code: 'BC', name: 'British Columbia' },
      { code: 'AB', name: 'Alberta' },
      { code: 'QC', name: 'Quebec' }
    ],
    US: [
      { code: 'CA', name: 'California' },
      { code: 'NY', name: 'New York' },
      { code: 'TX', name: 'Texas' },
      { code: 'FL', name: 'Florida' }
    ]
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear region when country changes
    if (name === 'preferredCountry') {
      setFormData(prev => ({
        ...prev,
        preferredRegion: ''
      }));
    }
    
    // Clear validation error for this field
    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
    
    // Clear general error
    if (error) {
      setError('');
    }
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    
    // First Name validation
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    } else if (formData.firstName.length < 2) {
      errors.firstName = 'First name must be at least 2 characters';
    }
    
    // Last Name validation
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    } else if (formData.lastName.length < 2) {
      errors.lastName = 'Last name must be at least 2 characters';
    }
    
    // Username validation
    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.username)) {
      errors.username = 'Username can only contain letters, numbers, hyphens, and underscores';
    }
    
    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
    
    // Confirm Password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    // Added location validation
    if (!formData.preferredCountry) {
      errors.preferredCountry = 'Country is required';
    }
    if (!formData.preferredRegion) {
      errors.preferredRegion = 'Province/State is required';
    }
    if (!formData.preferredCity.trim()) {
      errors.preferredCity = 'City is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    setError('');
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await registerUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirmPassword,  // ← Backend expects this name
        first_name: formData.firstName,              // ← Backend expects snake_case
        last_name: formData.lastName,                // ← Backend expects snake_case
        // Added for setup_tenant_user
        preferred_country: formData.preferredCountry,
        preferred_region: formData.preferredRegion,
        preferred_city: formData.preferredCity,
        personal_phone: '', // Provide a value or add a field to the form
        subproject_sid: '', // Provide a value or add a field to the form
        subproject_auth_token: '' // Provide a value or add a field to the form
      });
      
      // Registration successful - user will be redirected by the auth context
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (!formData.password) return 'bg-slate-200';
    if (formData.password.length < 6) return 'bg-red-400';
    if (formData.password.length < 8) return 'bg-yellow-400';
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) return 'bg-yellow-400';
    return 'bg-green-400';
  };

  const getPasswordStrengthText = () => {
    if (!formData.password) return '';
    if (formData.password.length < 6) return 'Weak';
    if (formData.password.length < 8) return 'Fair';
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) return 'Good';
    return 'Strong';
  };

  return (
    <>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create Your Account</h2>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Join thousands of professionals using AI to manage their communications
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              First Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="John"
                className={`form-input pl-10 ${
                  validationErrors.firstName 
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-secondary-600 focus:ring-secondary-900 focus:border-secondary-900'
                }`}
                disabled={isSubmitting}
              />
            </div>
            {validationErrors.firstName && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {validationErrors.firstName}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Last Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Doe"
                className={`form-input pl-10 ${
                  validationErrors.lastName 
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-secondary-600 focus:ring-secondary-900 focus:border-secondary-900'
                }`}
                disabled={isSubmitting}
              />
            </div>
            {validationErrors.lastName && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {validationErrors.lastName}
              </p>
            )}
          </div>
        </div>

        {/* Username Field */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Username
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="johndoe"
              className={`form-input pl-10 ${
                validationErrors.username 
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                  : 'border-secondary-600 focus:ring-secondary-900 focus:border-secondary-900'
              }`}
              disabled={isSubmitting}
            />
          </div>
          {validationErrors.username && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {validationErrors.username}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="john@example.com"
              className={`form-input pl-10 ${
                validationErrors.email 
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                  : 'border-secondary-600 focus:ring-secondary-900 focus:border-secondary-900'
              }`}
              disabled={isSubmitting}
            />
          </div>
          {validationErrors.email && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {validationErrors.email}
            </p>
          )}
        </div>

        {/* ADDED: Location Fields for setup_tenant_user */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Country
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <select
                name="preferredCountry"
                value={formData.preferredCountry}
                onChange={handleInputChange}
                className={`form-input pl-10 ${
                  validationErrors.preferredCountry 
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-secondary-600 focus:ring-secondary-900 focus:border-secondary-900'
                }`}
                disabled={isSubmitting}
              >
                {countries.map(country => (
                  <option key={country.code} value={country.code}>{country.name}</option>
                ))}
              </select>
            </div>
            {validationErrors.preferredCountry && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {validationErrors.preferredCountry}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              {formData.preferredCountry === 'CA' ? 'Province' : 'State'}
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <select
                name="preferredRegion"
                value={formData.preferredRegion}
                onChange={handleInputChange}
                className={`form-input pl-10 ${
                  validationErrors.preferredRegion 
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-secondary-600 focus:ring-secondary-900 focus:border-secondary-900'
                }`}
                disabled={isSubmitting}
              >
                <option value="">Select {formData.preferredCountry === 'CA' ? 'Province' : 'State'}</option>
                {regions[formData.preferredCountry as keyof typeof regions]?.map(region => (
                  <option key={region.code} value={region.code}>{region.name}</option>
                ))}
              </select>
            </div>
            {validationErrors.preferredRegion && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {validationErrors.preferredRegion}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              City
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                name="preferredCity"
                value={formData.preferredCity}
                onChange={handleInputChange}
                placeholder="Toronto"
                className={`form-input pl-10 ${
                  validationErrors.preferredCity 
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-secondary-600 focus:ring-secondary-900 focus:border-secondary-900'
                }`}
                disabled={isSubmitting}
              />
            </div>
            {validationErrors.preferredCity && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {validationErrors.preferredCity}
              </p>
            )}
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Create a strong password"
              className={`form-input pl-10 pr-10 ${
                validationErrors.password 
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                  : ''
              }`}
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              disabled={isSubmitting}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          
          {/* Password Strength Indicator */}
          {formData.password && (
            <div className="mt-2">
              <div className="flex items-center space-x-2">
                <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                    style={{ width: formData.password.length >= 8 ? '100%' : `${(formData.password.length / 8) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-slate-600 dark:text-slate-400 min-w-[3rem]">
                  {getPasswordStrengthText()}
                </span>
              </div>
            </div>
          )}
          
          {validationErrors.password && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {validationErrors.password}
            </p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm your password"
              className={`form-input pl-10 pr-10 ${
                validationErrors.confirmPassword 
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                  : formData.confirmPassword && formData.password === formData.confirmPassword
                  ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
                  : ''
              }`}
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              disabled={isSubmitting}
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          
          {/* Password Match Indicator */}
          {formData.confirmPassword && (
            <div className="mt-1 flex items-center">
              {formData.password === formData.confirmPassword ? (
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
          
          {validationErrors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {validationErrors.confirmPassword}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader className="w-5 h-5 animate-spin mr-2" />
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <ArrowRight className="w-5 h-5 mr-2" />
              <span>Create Account</span>
            </>
          )}
        </button>
      </div>

      {/* Terms and Privacy */}
      <div className="mt-6 text-center">
        <p className="text-xs text-slate-600 dark:text-slate-400">
          By creating an account, you agree to our{' '}
          <a href="/terms" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
            Privacy Policy
          </a>
        </p>
      </div>

      {/* Login Link */}
      <div className="mt-8 text-center">
        <p className="text-slate-600 dark:text-slate-400">
          Already have an account?{' '}
          <a href="/login" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors">
            Sign in here
          </a>
        </p>
      </div>
    </>
  );
};

export default Register;