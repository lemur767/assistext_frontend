// src/components/Layout/AuthLayout.tsx - Updated to handle landing page and navigation
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { MessageSquare, Shield, Brain, Zap } from 'lucide-react';

const AuthLayout: React.FC = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Responses',
      description: 'Advanced AI learns your style and responds naturally'
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      description: 'Enterprise-grade encryption keeps conversations secure'
    },
    {
      icon: Zap,
      title: 'Real-Time Automation',
      description: '24/7 instant responses with customizable business hours'
    }
  ];

  return (
    <div className="min-h-screen surface-bg">
      {/* Navigation Header - Only show on landing page */}
      {isLandingPage && (
        <header className="relative z-50 border-b border-brand/10">
          <nav className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link to="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold gradient-text">AssisText</h1>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                <a href="#features" className="text-muted hover:text-primary transition-colors">
                  Features
                </a>
                <a href="#pricing" className="text-muted hover:text-primary transition-colors">
                  Pricing
                </a>
                <a href="#about" className="text-muted hover:text-primary transition-colors">
                  About
                </a>
                <a href="#contact" className="text-muted hover:text-primary transition-colors">
                  Contact
                </a>
              </div>

              {/* Auth Buttons */}
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-muted hover:text-primary transition-colors hidden sm:inline-flex">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary">
                  Get Started
                </Link>
              </div>
            </div>
          </nav>
        </header>
      )}

      <div className="flex min-h-screen">
        {/* Left Side - Branding & Features (hide on small screens for auth pages) */}
        <div className={`${isLandingPage ? 'hidden' : 'hidden lg:flex'} lg:w-1/2 xl:w-3/5 flex-col justify-center p-12 surface-card`}>
          <div className="max-w-lg">
            {/* Logo Section */}
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-brand-primary rounded-xl flex items-center justify-center">
                <MessageSquare className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-3xl font-bold gradient-text">AssisText</h1>
            </div>
            
            {/* Hero Text */}
            <h2 className="text-4xl font-bold text-primary mb-6">
              AI-Powered SMS Management for Professional Services
            </h2>
            
            <p className="text-xl text-muted mb-12">
              Automate your text conversations with intelligent AI responses while maintaining your personal touch and professional boundaries.
            </p>
            
            {/* Features List */}
            <div className="space-y-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-brand-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary mb-2">{feature.title}</h3>
                    <p className="text-muted">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-12 pt-8 border-t border-brand">
              <div className="flex items-center space-x-6 text-muted">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm">256-bit SSL</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 text-center">🇨🇦</span>
                  <span className="text-sm">Canadian Hosted</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 text-center">🔒</span>
                  <span className="text-sm">PIPEDA Compliant</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Content */}
        <div className={`flex-1 ${isLandingPage ? 'w-full' : 'lg:w-1/2 xl:w-2/5'} flex flex-col justify-center ${isLandingPage ? 'p-8 lg:p-16' : 'p-8'}`}>
          <div className={`w-full ${isLandingPage ? 'max-w-6xl' : 'max-w-md'} mx-auto`}>
            {/* Mobile Logo - Only show for auth pages */}
            {!isLandingPage && (
              <div className="lg:hidden flex items-center justify-center space-x-3 mb-8">
                <div className="w-10 h-10 bg-brand-primary rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold gradient-text">AssisText</h1>
              </div>
            )}

            {/* Content */}
            {isLandingPage ? (
              <Outlet />
            ) : (
              <div className="surface-card rounded-2xl shadow-xl border border-brand p-8">
                <Outlet />
              </div>
            )}
            
            {/* Footer Links - Only show for auth pages */}
            {!isLandingPage && (
              <div className="mt-8 text-center">
                <div className="flex items-center justify-center space-x-6 text-sm text-muted">
                  <a href="/privacy" className="hover:text-brand-primary transition-colors">
                    Privacy Policy
                  </a>
                  <a href="/terms" className="hover:text-brand-primary transition-colors">
                    Terms of Service
                  </a>
                  <a href="/support" className="hover:text-brand-primary transition-colors">
                    Support
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer - Only show on landing page */}
      {isLandingPage && (
        <footer className="bg-slate-900 text-white py-16">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              {/* Company */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold">AssisText</span>
                </div>
                <p className="text-slate-400 mb-4">
                  AI-powered SMS management built in Canada with privacy and security in mind.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors">
                    📧
                  </a>
                  <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors">
                    🐦
                  </a>
                  <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors">
                    💼
                  </a>
                </div>
              </div>

              {/* Product */}
              <div>
                <h4 className="font-semibold mb-4">Product</h4>
                <ul className="space-y-2 text-slate-400">
                  <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                  <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-slate-400">
                  <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-slate-400">
                  <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                  <li><a href="/terms" className="hover:text-white transition-colors">Terms of Service</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">PIPEDA Compliance</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-8 text-center text-slate-400">
              <p>&copy; 2025 AssisText. All rights reserved. Made in Canada 🇨🇦</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default AuthLayout;