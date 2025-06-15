import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle, Loader } from 'lucide-react';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

const Login: React.FC = () => {
  const { login, isAuthenticated, error, clearError, isLoading } = AuthContext;
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

 

  useEffect(() => {
    if (validationErrors.email || validationErrors.password) {
      setValidationErrors({});
    }
  }, [formData.email, formData.password]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/app/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      await login({
        email: formData.email,
        password: formData.password
      });
    } catch (err) {
      console.error('Login failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const InputField: React.FC<{
    label: string;
    name: string;
    type?: string;
    placeholder: string;
    icon: React.ElementType;
    showPasswordToggle?: boolean;
    error?: string;
  }> = ({ label, name, type = 'text', placeholder, icon: Icon, showPasswordToggle = false, error }) => (
    <div className="flex flex-col m-0 vw-fit h-screen-100">
    <div className="flex flex-col p-4 m-0 justify-center align-center box-shadow">
      <label className="form-label">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
        <input
          type={showPasswordToggle ? (showPassword ? 'text' : 'password') : type}
          name={name}
          value={formData[name as keyof LoginFormData] as string}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={`input-field pl-10 ${showPasswordToggle ? 'pr-10' : 'pr-4'} ${
            error ? 'border-red-500 focus:border-red-500' : ''
          }`}
          disabled={isSubmitting}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted hover:text-primary transition-colors"
            disabled={isSubmitting}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>
      {error && (
        <p className="form-error flex items-center mt-1">
          <AlertCircle className="w-4 h-4 mr-1" />
          {error}
        </p>
      )}
    </div>
    </div>
  );

  return (
    <>
      {/* Form Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-primary">Welcome Back</h2>
        <p className="text-muted mt-2">Sign in to your AssisText account</p>
      </div>

      {/* Global Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField
          label="Email Address"
          name="email"
          type="email"
          placeholder="john@example.com"
          icon={Mail}
          error={validationErrors.email}
        />

        <InputField
          label="Password"
          name="password"
          placeholder="Enter your password"
          icon={Lock}
          showPasswordToggle={true}
          error={validationErrors.password}
        />

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleInputChange}
              className="w-4 h-4 text-brand-primary border-gray-300 rounded focus:ring-brand-primary focus:ring-2"
              disabled={isSubmitting}
            />
            <span className="ml-2 text-sm text-muted">Remember me</span>
          </label>
          <Link
            to="/forgot-password"
            className="text-sm text-brand-primary hover:text-brand-secondary transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="btn-primary group:hover btn-lg width-25% w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting || isLoading ? (
            <Loader className="w-5 h-5 animate-spin mr-2" />
          ) : (
            <ArrowRight className="w-5 h-5 mr-2" />
          )}
          {isSubmitting || isLoading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      {/* Form Footer */}
      <div className="mt-8 text-center">
        <p className="text-muted">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-brand-primary hover:text-brand-secondary font-medium transition-colors"
          >
            Create one here
          </Link>
        </p>
      </div>

      {/* Demo Credentials */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-xl">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Demo Credentials</h4>
          <div className="text-xs text-gray-600 space-y-1">
            <p>Email: demo@assistext.com</p>
            <p>Password: demo123456</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;