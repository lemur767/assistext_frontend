// src/pages/Login.tsx - Fixed to use useAuth properly
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { LoginCredentials } from '../types/auth';

interface LoginFormData {
  username: string;
  password: string;
  rememberMe: boolean;
}

interface ValidationErrors {
  username?: string;
  password?: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // ✅ Get everything from useAuth - no manual state management needed
  const { 
    login,           // Function to login user
    isLoading,       // Loading state (automatic)
    error,           // Error state (automatic)
    clearError,      // Function to clear errors
    isAuthenticated, // Authentication status (automatic)
    user            // User data (automatic after login)
  } = useAuth();

  // Form state
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: '',
    rememberMe: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  // ✅ Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const from = (location.state as any)?.from?.pathname || '/app/dashboard';
      console.log('✅ User already authenticated, redirecting to:', from);
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, user, navigate, location]);

  // ✅ Clear validation errors when useAuth clears global errors
  useEffect(() => {
    if (!error) {
      setValidationErrors({});
    }
  }, [error]);

  // ✅ Handle input changes and clear validation errors
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear validation error for this field
    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
    
    // Clear global error when user starts typing
    if (error) {
      clearError();
    }
  };

  // ✅ Form validation
  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    
    if (!formData.username.trim()) {
      errors.username = 'Username or email is required';
    } else if (formData.username.length < 2) {
      errors.username = 'Username must be at least 2 characters';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear any previous errors
    clearError();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    try {
      console.log('🚀 Attempting login for:', formData.username);
      console.log('📡 API URL:', import.meta.env.VITE_API_URL || 'https://backend.assitext.ca');
      
     
      const credentials: LoginCredentials = {
        username: formData.username.trim(),
        password: formData.password,
        
      };
      
      
      await login(credentials);
      
      console.log('✅ Login successful!');
      
  
      toast.success(`Welcome back, ${formData.username}!`);
      
     
      
    } catch (err: any) {
      console.error('❌ Login failed:', err);
      
      
   
      toast.error(err.message || 'Login failed. Please check your credentials.');
      
      
      const usernameInput = document.querySelector('input[name="username"]') as HTMLInputElement;
      if (usernameInput) {
        usernameInput.focus();
      }
    }
  };


  return (
    <>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-black dark:text-white mb-2">Welcome Back</h2>
        <p className="text-slate-600 dark:text-primar y-300">Sign in to your AssisText account</p>
      </div>

      {/* ✅ Global Error Message from useAuth */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-red-800">{error}</p>
              <button
                onClick={clearError}
                className="text-xs text-red-600 hover:text-red-800 mt-1 underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Login Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Username Field */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium dark:text-white mb-2">
            Username or Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-accent-400" />
            <input
              id="username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Enter your username or email"
              autoComplete="username"
              className={`w-full pl-10 pr-4 py-3 border text-accent-900 rounded-xl bg-gray   dark:bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 ${
                validationErrors.username 
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              disabled={isLoading} 
            />
          </div>
          {validationErrors.username && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {validationErrors.username}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium dark:text-white mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-accent-400" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              className={`w-full pl-10 pr-12 py-3 border text-accent-900 rounded-xl bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 ${
                validationErrors.password 
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isLoading}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {validationErrors.password && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {validationErrors.password}
            </p>
          )}
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              disabled={isLoading}
            />
            <span className="ml-2 text-sm text-gray-600">Remember me</span>
          </label>
          
          <Link
            to="/forgot-password"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading} 
          className={`btn btn-secondary w-full flex items-center justify-center space-x-2 py-3 px-4 border border-transparent rounded-xl text-white font-medium transition-all duration-200 ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'btn btn-secondary hover:bg-transparent hover:border-brand-accent-dark hover:border-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
          }`}
        >
          {isLoading ? ( 
            <>
              <Loader className="w-5 h-5 animate-spin" />
              <span>Signing In...</span>
            </>
          ) : (
            <>
              <ArrowRight className="w-5 h-5" />
              <span>Sign In</span>
            </>
          )}
        </button>

       
      </form>

      {/* Form Footer */}
      <div className="mt-8 text-center">
        <p className="text-gray-600 dark:text-white">
          Don't have an account?{' '}
          <Link 
            to="/register" 
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            Sign up here
          </Link>
        </p>
      </div>

     
  
    </>
  );
};

export default Login;