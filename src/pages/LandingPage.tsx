// src/pages/LandingPage.tsx - Beautiful modern landing page
import React from 'react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';


const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation Header */}
      <header className="relative z-50">
        <nav className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <div className="text-2xl font-bold text-gradient">AssisText</div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="nav-link">Features</a>
              <a href="#pricing" className="nav-link">Pricing</a>
              <a href="#about" className="nav-link">About</a>
              <a href="#contact" className="nav-link">Contact</a>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <Link to="/login" className="btn btn-ghost hidden sm:inline-flex">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid opacity-30"></div>
        
        {/* Gradient Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-gradient-to-r from-accent-400 to-accent-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        
        <div className="relative container mx-auto px-6 pt-20 pb-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Hero Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-primary-200 text-primary-700 text-sm font-medium mb-8 animate-fade-in">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              Now powered by SignalWire for reliable messaging
            </div>

            {/* Hero Title */}
            <h1 className="text-hero mb-8 animate-slide-up">
              <span className="text-slate-900">AI-Powered</span>
              <br />
              <span className="text-gradient">SMS Assistant</span>
            </h1>

            {/* Hero Subtitle */}
            <p className="text-subtitle max-w-2xl mx-auto mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              Automate your SMS responses with intelligent AI that learns your unique communication style. 
              Perfect for professionals, businesses, and anyone who wants to stay connected 24/7.
            </p>

            {/* Hero CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <Link to="/register" className="btn btn-primary btn-lg group">
                Start Free Trial
                <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link to="/login" className="btn btn-outline btn-lg">
                Sign In
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex items-center justify-center space-x-8 text-sm text-secondary-500 animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <div className="flex items-center">
                <span className="text-green-500 mr-1">✓</span>
                No credit card required
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-1">✓</span>
                7-day free trial
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-1">✓</span>
                Cancel anytime
              </div>
            </div>
          </div>

          {/* Hero Dashboard Preview */}
          <div className="relative max-w-5xl mx-auto mt-20 animate-slide-up" style={{ animationDelay: '0.8s' }}>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <div className="ml-4 text-white text-sm font-medium">AssisText Dashboard</div>
                </div>
              </div>
              <div className="p-8 bg-gradient-to-br from-white to-slate-50">
                <div className="text-center text-secondary-600">
                  <div className="text-6xl mb-4">📱</div>
                  <p className="text-lg">Beautiful dashboard preview coming soon...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Everything you need to automate SMS
            </h2>
            <p className="text-subtitle max-w-2xl mx-auto">
              Powered by SignalWire for reliable messaging and advanced AI for intelligent responses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card group hover:scale-105 transition-all duration-300">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:animate-float">
                  <span className="text-2xl">🤖</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">AI-Powered Responses</h3>
                <p className="text-secondary-600 leading-relaxed">
                  Train AI to respond in your unique style and personality. Smart context understanding for natural conversations.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="card group hover:scale-105 transition-all duration-300">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:animate-float">
                  <span className="text-2xl">📱</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">SignalWire Integration</h3>
                <p className="text-secondary-600 leading-relaxed">
                  Enterprise-grade SMS delivery with Canadian phone numbers. 99.9% uptime and instant message delivery.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="card group hover:scale-105 transition-all duration-300">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:animate-float">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Analytics Dashboard</h3>
                <p className="text-secondary-600 leading-relaxed">
                  Track message volume, response rates, and client engagement. Real-time insights to optimize your communication.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="card group hover:scale-105 transition-all duration-300">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:animate-float">
                  <span className="text-2xl">🔒</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Secure & Private</h3>
                <p className="text-secondary-600 leading-relaxed">
                  End-to-end encryption and PIPEDA compliance. Your data stays private and secure at all times.
                </p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="card group hover:scale-105 transition-all duration-300">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:animate-float">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Lightning Fast</h3>
                <p className="text-secondary-600 leading-relaxed">
                  Instant AI responses within seconds. Smart caching and optimized infrastructure for maximum speed.
                </p>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="card group hover:scale-105 transition-all duration-300">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:animate-float">
                  <span className="text-2xl">🇨🇦</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Made in Canada</h3>
                <p className="text-secondary-600 leading-relaxed">
                  Built with Canadian privacy standards. Local support and Canadian phone numbers available.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="section bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-subtitle">
              Start free, upgrade as you grow. No hidden fees or surprise charges.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Free Plan */}
              <div className="card">
                <div className="card-body">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Free Trial</h3>
                    <div className="text-4xl font-bold text-slate-900 mb-2">$0</div>
                    <p className="text-secondary-600">7 days, no credit card required</p>
                  </div>
                  
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-center">
                      <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs mr-3">✓</span>
                      <span>100 AI responses</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs mr-3">✓</span>
                      <span>1 profile</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs mr-3">✓</span>
                      <span>Basic analytics</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs mr-3">✓</span>
                      <span>Email support</span>
                    </li>
                  </ul>
                  
                  <Link to="/register" className="btn btn-outline w-full">
                    Start Free Trial
                  </Link>
                </div>
              </div>

              {/* Pro Plan */}
              <div className="card relative border-primary-200 shadow-glow">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
                
                <div className="card-body">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Professional</h3>
                    <div className="text-4xl font-bold text-slate-900 mb-2">$29</div>
                    <p className="text-secondary-600">per month</p>
                  </div>
                  
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-center">
                      <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs mr-3">✓</span>
                      <span>1,000 AI responses/month</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs mr-3">✓</span>
                      <span>Multiple profiles</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs mr-3">✓</span>
                      <span>Advanced analytics</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs mr-3">✓</span>
                      <span>Priority support</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs mr-3">✓</span>
                      <span>Custom AI training</span>
                    </li>
                  </ul>
                  
                  <Link to="/register" className="btn btn-primary w-full">
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white section">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">A</span>
                </div>
                <div className="text-2xl font-bold">AssisText</div>
              </div>
              <p className="text-slate-400 mb-6 max-w-md">
                AI-powered SMS automation that learns your communication style. 
                Built in Canada with privacy and security in mind.
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
          </div>

          <div className="border-t border-slate-800 pt-8 text-center text-slate-400">
            <p>&copy; 2025 AssisText. All rights reserved. Made in Canada 🇨🇦</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;