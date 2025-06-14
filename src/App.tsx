// src/App.tsx - Beautiful app with proper routing
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Import the beautiful landing page
import LandingPage from './pages/LandingPage';

// Simple auth pages for now (will be styled later)
const Login: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
    <div className="max-w-md w-full mx-4">
      <div className="card">
        <div className="card-body text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-white text-2xl font-bold">A</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome Back</h2>
          <p className="text-secondary-600 mb-8">Sign in to your AssisText account</p>
          
          <div className="space-y-4">
            <div>
              <label className="form-label">Email or Username</label>
              <input type="text" className="form-input" placeholder="Enter your email or username" />
            </div>
            <div>
              <label className="form-label">Password</label>
              <input type="password" className="form-input" placeholder="Enter your password" />
            </div>
            <button className="btn btn-primary w-full">
              Sign In
            </button>
          </div>
          
          <div className="mt-8 pt-6 border-t border-secondary-200">
            <p className="text-sm text-secondary-600">
              Don't have an account?{' '}
              <a href="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                Sign up for free
              </a>
            </p>
            <p className="text-sm text-secondary-600 mt-2">
              <a href="/" className="text-primary-600 hover:text-primary-700">
                ← Back to home
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Register: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
    <div className="max-w-md w-full mx-4">
      <div className="card">
        <div className="card-body text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-white text-2xl font-bold">A</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Create Account</h2>
          <p className="text-secondary-600 mb-8">Get started with AssisText today</p>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="form-label">First Name</label>
                <input type="text" className="form-input" placeholder="John" />
              </div>
              <div>
                <label className="form-label">Last Name</label>
                <input type="text" className="form-input" placeholder="Doe" />
              </div>
            </div>
            <div>
              <label className="form-label">Email Address</label>
              <input type="email" className="form-input" placeholder="john@example.com" />
            </div>
            <div>
              <label className="form-label">Username</label>
              <input type="text" className="form-input" placeholder="johndoe" />
            </div>
            <div>
              <label className="form-label">Password</label>
              <input type="password" className="form-input" placeholder="Create a strong password" />
            </div>
            <button className="btn btn-primary w-full">
              Create Account
            </button>
          </div>
          
          <div className="mt-8 pt-6 border-t border-secondary-200">
            <p className="text-sm text-secondary-600">
              Already have an account?{' '}
              <a href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                Sign in
              </a>
            </p>
            <p className="text-sm text-secondary-600 mt-2">
              <a href="/" className="text-primary-600 hover:text-primary-700">
                ← Back to home
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Dashboard: React.FC = () => (
  <div className="min-h-screen bg-slate-50">
    <div className="container mx-auto px-6 py-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Dashboard</h1>
        <p className="text-secondary-600 mb-8">Welcome to your AssisText dashboard!</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="card">
            <div className="card-body text-center">
              <div className="text-3xl mb-4">📱</div>
              <h3 className="font-semibold text-slate-900 mb-2">Messages</h3>
              <p className="text-secondary-600">Manage your SMS conversations</p>
            </div>
          </div>
          
          <div className="card">
            <div className="card-body text-center">
              <div className="text-3xl mb-4">🤖</div>
              <h3 className="font-semibold text-slate-900 mb-2">AI Settings</h3>
              <p className="text-secondary-600">Configure your AI assistant</p>
            </div>
          </div>
          
          <div className="card">
            <div className="card-body text-center">
              <div className="text-3xl mb-4">📊</div>
              <h3 className="font-semibold text-slate-900 mb-2">Analytics</h3>
              <p className="text-secondary-600">View performance insights</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <a href="/" className="btn btn-outline">
            ← Back to Landing Page
          </a>
        </div>
      </div>
    </div>
  </div>
);

const NotFound: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
    <div className="text-center">
      <div className="text-8xl mb-8">🔍</div>
      <h1 className="text-4xl font-bold text-slate-900 mb-4">404 - Page Not Found</h1>
      <p className="text-secondary-600 mb-8">
        The page you're looking for doesn't exist.
      </p>
      <div className="space-x-4">
        <a href="/" className="btn btn-primary">
          Go Home
        </a>
        <button 
          onClick={() => window.history.back()} 
          className="btn btn-outline"
        >
          Go Back
        </button>
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  console.log('🎨 Beautiful App rendering...');

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes (simplified for now) */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/app/*" element={<Dashboard />} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;