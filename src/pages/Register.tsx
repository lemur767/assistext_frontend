import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { RegisterData } from '../types/auth';
import { 
  User, 
  Mail, 
  Lock, 
  ArrowRight,
  Check,
  AlertCircle,
  MessageCircle,
  Zap,
  Shield
} from 'lucide-react';

interface FormData {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

interface ValidationErrors {
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  agreeToTerms?: string;
}

interface PasswordStrength {
  strength: number;
  label: string;
  color: string;
}

const Register: React.FC = () => {
  const { register, isAuthenticated, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<FormData>({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  
  const [localLoading, setLocalLoading] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Clear auth errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/app/dashboard" replace />;
  }

  // Show loading spinner while checking authentication status
  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-bg dark:bg-brand-bg-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary dark:border-brand-primary-dark"></div>
      </div>
    );
  }

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    
    // Username validation
    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      errors.username = 'Username can only contain letters, numbers, and underscores';
    }
    
    // Name validation
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    
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
    
    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    // Terms validation
    if (!formData.agreeToTerms) {
      errors.agreeToTerms = 'You must agree to the terms and conditions';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLocalLoading(true);
    clearError();
    
    try {
      // Prepare registration data according to your backend API
      const registrationData = {
        username: formData.username.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        password_confirm: formData.confirmPassword, // Keep if backend expects this
        firstName: formData.firstName.trim(),        // Try camelCase first
        lastName: formData.lastName.trim()          // Try camelCase first
      };
      
      // Use auth context register function - it handles the API call
      await register(registrationData);
      
      // Registration successful - redirect to dashboard
      navigate('/app/dashboard');
      
    } catch (err: unknown) {
      // Error is handled by auth context and will be shown via error state
      console.error('Registration failed:', err);
    } finally {
      setLocalLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean): void => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const getPasswordStrength = (): PasswordStrength => {
    const password = formData.password;
    if (!password) return { strength: 0, label: '', color: 'bg-surface-300' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    
    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
    
    return {
      strength,
      label: labels[strength - 1] || '',
      color: colors[strength - 1] || 'bg-surface-300'
    };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="min-h-screen bg-brand-bg dark:bg-brand-bg-dark flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-brand-primary dark:bg-brand-primary-dark rounded-xl flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-brand-text dark:text-brand-text-dark mb-2">
            Join AssisText
          </h1>
          <p className="text-surface-600 dark:text-surface-400">
            Start automating your SMS responses with AI
          </p>
        </div>

        {/* Registration Form */}
        <div className="card p-8 bg-white dark:bg-surface-800 border-surface-200 dark:border-surface-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-brand-text dark:text-brand-text-dark mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('username', e.target.value)}
                  className={`input w-full pl-10 bg-white dark:bg-surface-800 border-surface-300 dark:border-surface-600 text-brand-text dark:text-brand-text-dark focus:border-brand-primary dark:focus:border-brand-primary-dark ${
                    validationErrors.username ? 'border-red-500' : ''
                  }`}
                  placeholder="johndoe"
                  disabled={localLoading}
                />
              </div>
              {validationErrors.username && <p className="text-red-500 text-sm mt-1">{validationErrors.username}</p>}
              <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">
                Choose a unique username (letters, numbers, and underscores only)
              </p>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-text dark:text-brand-text-dark mb-2">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('firstName', e.target.value)}
                    className={`input w-full pl-10 bg-white dark:bg-surface-800 border-surface-300 dark:border-surface-600 text-brand-text dark:text-brand-text-dark focus:border-brand-primary dark:focus:border-brand-primary-dark ${
                      validationErrors.firstName ? 'border-red-500' : ''
                    }`}
                    placeholder="John"
                    disabled={localLoading}
                  />
                </div>
                {validationErrors.firstName && <p className="text-red-500 text-sm mt-1">{validationErrors.firstName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-text dark:text-brand-text-dark mb-2">
                  Last Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('lastName', e.target.value)}
                    className={`input w-full pl-10 bg-white dark:bg-surface-800 border-surface-300 dark:border-surface-600 text-brand-text dark:text-brand-text-dark focus:border-brand-primary dark:focus:border-brand-primary-dark ${
                      validationErrors.lastName ? 'border-red-500' : ''
                    }`}
                    placeholder="Doe"
                    disabled={localLoading}
                  />
                </div>
                {validationErrors.lastName && <p className="text-red-500 text-sm mt-1">{validationErrors.lastName}</p>}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-brand-text dark:text-brand-text-dark mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('email', e.target.value)}
                  className={`input w-full pl-10 bg-white dark:bg-surface-800 border-surface-300 dark:border-surface-600 text-brand-text dark:text-brand-text-dark focus:border-brand-primary dark:focus:border-brand-primary-dark ${
                    validationErrors.email ? 'border-red-500' : ''
                  }`}
                  placeholder="john@example.com"
                  disabled={localLoading}
                />
              </div>
              {validationErrors.email && <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-brand-text dark:text-brand-text-dark mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('password', e.target.value)}
                  className={`input w-full pl-10 pr-12 bg-white dark:bg-surface-800 border-surface-300 dark:border-surface-600 text-brand-text dark:text-brand-text-dark focus:border-brand-primary dark:focus:border-brand-primary-dark ${
                    validationErrors.password ? 'border-red-500' : ''
                  }`}
                  placeholder="••••••••"
                  disabled={localLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-surface-600 dark:text-surface-400">Password strength</span>
                    <span className={`text-xs font-medium ${
                      passwordStrength.strength >= 4 ? 'text-green-600' : 
                      passwordStrength.strength >= 3 ? 'text-blue-600' :
                      passwordStrength.strength >= 2 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="w-full bg-surface-200 dark:bg-surface-600 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                    />
                  </div>
                </div>
              )}
              
              {validationErrors.password && <p className="text-red-500 text-sm mt-1">{validationErrors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-brand-text dark:text-brand-text-dark mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('confirmPassword', e.target.value)}
                  className={`input w-full pl-10 bg-white dark:bg-surface-800 border-surface-300 dark:border-surface-600 text-brand-text dark:text-brand-text-dark focus:border-brand-primary dark:focus:border-brand-primary-dark ${
                    validationErrors.confirmPassword ? 'border-red-500' : ''
                  }`}
                  placeholder="••••••••"
                  disabled={localLoading}
                />
              </div>
              {validationErrors.confirmPassword && <p className="text-red-500 text-sm mt-1">{validationErrors.confirmPassword}</p>}
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('agreeToTerms', e.target.checked)}
                className="mt-1 h-4 w-4 text-brand-primary dark:text-brand-primary-dark border-surface-300 dark:border-surface-600 rounded focus:ring-brand-primary dark:focus:ring-brand-primary-dark"
                disabled={localLoading}
              />
              <label htmlFor="agreeToTerms" className="ml-3 text-sm text-brand-text dark:text-brand-text-dark">
                I agree to the{' '}
                <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-brand-primary dark:text-brand-primary-dark hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-brand-primary dark:text-brand-primary-dark hover:underline">
                  Privacy Policy
                </a>
              </label>
            </div>
            {validationErrors.agreeToTerms && <p className="text-red-500 text-sm">{validationErrors.agreeToTerms}</p>}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={localLoading}
              className="btn w-full bg-brand-primary dark:bg-brand-primary-dark text-white hover:bg-brand-primary/90 dark:hover:bg-brand-primary-dark/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {localLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Features Preview */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-10 h-10 bg-brand-primary/10 dark:bg-brand-primary-dark/20 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Zap className="w-5 h-5 text-brand-primary dark:text-brand-primary-dark" />
            </div>
            <p className="text-xs text-surface-600 dark:text-surface-400">AI-Powered Responses</p>
          </div>
          
          <div className="text-center">
            <div className="w-10 h-10 bg-brand-primary/10 dark:bg-brand-primary-dark/20 rounded-lg flex items-center justify-center mx-auto mb-2">
              <MessageCircle className="w-5 h-5 text-brand-primary dark:text-brand-primary-dark" />
            </div>
            <p className="text-xs text-surface-600 dark:text-surface-400">SMS Automation</p>
          </div>
          
          <div className="text-center">
            <div className="w-10 h-10 bg-brand-primary/10 dark:bg-brand-primary-dark/20 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Shield className="w-5 h-5 text-brand-primary dark:text-brand-primary-dark" />
            </div>
            <p className="text-xs text-surface-600 dark:text-surface-400">Secure & Reliable</p>
          </div>
        </div>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-sm text-surface-600 dark:text-surface-400">
            Already have an account?{' '}
            <a href="/login" className="text-brand-primary dark:text-brand-primary-dark hover:underline font-medium">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;