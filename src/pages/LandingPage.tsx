// src/pages/LandingPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MessageSquare, 
  Brain, 
  Shield, 
  Zap, 
  ArrowRight, 
  Check, 
  Star,
  Users,
  Clock,
  BarChart3
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const features = [
    {
      icon: Brain,
      title: 'Smart AI Learning',
      description: 'AI learns your communication style and responds authentically to maintain your personal brand.'
    },
    {
      icon: Zap,
      title: 'Instant Response',
      description: '24/7 automated responses with customizable business hours and intelligent message handling.'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Enterprise-grade encryption with Canadian data hosting. Your conversations stay secure.'
    },
    {
      icon: Users,
      title: 'Multi-Profile Support',
      description: 'Manage multiple phone numbers and personas with unique AI personalities for each.'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Track response rates, client engagement, and AI performance with detailed insights.'
    },
    {
      icon: Clock,
      title: 'Smart Scheduling',
      description: 'Intelligent appointment booking and calendar integration with automatic confirmations.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah M.',
      role: 'Professional Companion',
      content: 'AssisText has revolutionized how I handle client communication. The AI responses are so natural, my clients can\'t tell the difference.',
      rating: 5
    },
    {
      name: 'Emma K.',
      role: 'Escort Services',
      content: 'Finally, a solution that understands our industry needs. Privacy, professionalism, and efficiency all in one platform.',
      rating: 5
    },
    {
      name: 'Jessica L.',
      role: 'Independent Provider',
      content: 'I can focus on my clients while AssisText handles the initial conversations. My response time has improved 300%.',
      rating: 5
    }
  ];

  const pricingTiers = [
    {
      name: 'Starter',
      price: 29,
      description: 'Perfect for independent professionals',
      features: [
        '1 Phone Number',
        '500 AI Responses/month',
        'Basic Analytics',
        'Email Support'
      ]
    },
    {
      name: 'Professional',
      price: 79,
      description: 'Most popular for growing businesses',
      features: [
        '3 Phone Numbers',
        '2,000 AI Responses/month',
        'Advanced Analytics',
        'Priority Support',
        'Custom AI Training'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: 199,
      description: 'For agencies and large operations',
      features: [
        'Unlimited Phone Numbers',
        'Unlimited AI Responses',
        'White-label Options',
        'Dedicated Account Manager',
        'Custom Integrations'
      ]
    }
  ];

  return (
    <div className="surface-bg">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center space-x-3 mb-6">
              <div className="w-16 h-16 bg-brand-primary rounded-2xl flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold gradient-text">AssisText</h1>
            </div>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold text-primary mb-6">
            AI-Powered SMS Management
            <br />
            <span className="text-brand-secondary">for Professional Services</span>
          </h2>
          
          <p className="text-xl text-muted mb-12 max-w-3xl mx-auto">
            Automate your text conversations with intelligent AI that learns your communication style, 
            maintains professional boundaries, and responds naturally 24/7.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/register"
              className="btn-primary btn-lg inline-flex items-center group"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="btn-outline btn-lg"
            >
              Sign In
            </Link>
          </div>
          
          <p className="text-sm text-muted mt-4">
            Free 14-day trial • No credit card required • Cancel anytime
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 surface-card">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Everything You Need to Automate Your Communication
            </h2>
            <p className="text-xl text-muted">
              Built specifically for professional service providers who value privacy and efficiency
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card card-body hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-brand-primary" />
                </div>
                <h3 className="text-xl font-semibold text-primary mb-3">{feature.title}</h3>
                <p className="text-muted">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Trusted by Professional Service Providers
            </h2>
            <p className="text-xl text-muted">
              See how AssisText is helping professionals streamline their communication
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card card-body">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-muted mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-primary">{testimonial.name}</p>
                  <p className="text-sm text-muted">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 surface-card">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-muted">
              Choose the plan that fits your business needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <div 
                key={index} 
                className={`card relative ${
                  tier.popular 
                    ? 'border-brand-primary shadow-lg scale-105' 
                    : ''
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-brand-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="card-body">
                  <h3 className="text-2xl font-bold text-primary mb-2">{tier.name}</h3>
                  <p className="text-muted mb-4">{tier.description}</p>
                  
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-primary">${tier.price}</span>
                    <span className="text-muted">/month</span>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <Check className="w-5 h-5 text-green-500 mr-3" />
                        <span className="text-muted">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link
                    to="/register"
                    className={`btn w-full ${
                      tier.popular ? 'btn-primary' : 'btn-outline'
                    }`}
                  >
                    Start Free Trial
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
            Ready to Transform Your Communication?
          </h2>
          <p className="text-xl text-muted mb-8">
            Join hundreds of professionals who have automated their SMS workflow with AssisText
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="btn-primary btn-lg inline-flex items-center group"
            >
              Start Your Free Trial
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="mailto:support@assistext.com"
              className="btn-ghost btn-lg"
            >
              Contact Sales
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-brand py-12 px-4 sm:px-6 lg:px-8 surface-card">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold gradient-text">AssisText</span>
              </div>
              <p className="text-muted">
                AI-powered SMS management for professional service providers.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-primary mb-4">Product</h4>
              <ul className="space-y-2 text-muted">
                <li><a href="#" className="hover:text-brand-primary transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-brand-primary transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-brand-primary transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-primary mb-4">Support</h4>
              <ul className="space-y-2 text-muted">
                <li><a href="#" className="hover:text-brand-primary transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-brand-primary transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-brand-primary transition-colors">Status</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-primary mb-4">Legal</h4>
              <ul className="space-y-2 text-muted">
                <li><a href="#" className="hover:text-brand-primary transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-brand-primary transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-brand-primary transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-brand mt-8 pt-8 text-center text-muted">
            <p>&copy; 2025 AssisText. All rights reserved. Made in Canada 🇨🇦</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;