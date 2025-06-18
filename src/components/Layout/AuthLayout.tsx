import React from 'react';
import { Outlet } from 'react-router-dom';
import { MessageSquare, Shield, Brain, Zap } from 'lucide-react';

const AuthLayout: React.FC = () => {
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
      <div className="flex min-h-screen">
        {/* Left Side - Branding & Features */}
        <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 flex-col justify-center p-12 surface-card">
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

        {/* Right Side - Auth Forms */}
        <div className="flex-1 lg:w-1/2 xl:w-2/5 flex flex-col justify-center p-8">
          <div className="w-full max-w-md mx-auto">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-brand-primary rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold gradient-text">AssisText</h1>
            </div>

            {/* Auth Content */}
            <div className="surface-card rounded-2xl shadow-xl border border-brand p-8">
              <Outlet />
            </div>
            
            {/* Footer Links */}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;