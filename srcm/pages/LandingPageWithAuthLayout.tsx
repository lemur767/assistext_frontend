// src/pages/LandingPageWithAuthLayout.tsx - Simplified landing page designed for AuthLayout
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Star, Users, Shield, Zap } from 'lucide-react';

const LandingPageWithAuthLayout: React.FC = () => {
  const features = [
    {
      icon: Zap,
      title: 'Instant AI Responses',
      description: 'Respond to texts 24/7 with intelligent, contextual AI that learns your communication style.'
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      description: 'Enterprise-grade encryption and Canadian data residency keeps your conversations secure.'
    },
    {
      icon: Users,
      title: 'Client Management',
      description: 'Organize conversations, track interactions, and maintain professional boundaries effortlessly.'
    }
  ];

  const benefits = [
    'Reduce response time by 90%',
    'Never miss important messages',
    'Maintain professional consistency',
    'Scale your communication effortlessly',
    'Full Canadian compliance (PIPEDA)',
    '24/7 automated customer support'
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Real Estate Agent',
      content: 'AssisText helped me respond to 200+ daily inquiries while maintaining my personal touch. Game changer!',
      rating: 5
    },
    {
      name: 'Mike Rodriguez',
      role: 'Business Consultant',
      content: 'The AI understands context perfectly. My clients can\'t tell the difference from my personal responses.',
      rating: 5
    }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold gradient-text leading-tight">
            Never Miss Another
            <br />
            Text Message Again
          </h1>
          <p className="text-xl text-muted max-w-2xl mx-auto">
            Professional AI-powered SMS management that responds intelligently while you focus on what matters most.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register" className="btn-primary btn-lg">
            Start Free Trial
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
          <button className="btn-outline btn-lg">
            Watch Demo
          </button>
        </div>
        
        <div className="flex items-center justify-center space-x-6 text-sm text-muted">
          <div className="flex items-center space-x-1">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center space-x-1">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>7-day free trial</span>
          </div>
          <div className="flex items-center space-x-1">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Cancel anytime</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-primary">
            Intelligent SMS Automation
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Our AI learns your communication style and responds to clients professionally, 
            maintaining your personal touch while you're busy or offline.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center space-y-4">
              <div className="w-16 h-16 bg-brand-primary/10 rounded-xl flex items-center justify-center mx-auto">
                <feature.icon className="w-8 h-8 text-brand-primary" />
              </div>
              <h3 className="text-xl font-semibold text-primary">
                {feature.title}
              </h3>
              <p className="text-muted">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-brand-primary/5 rounded-2xl p-8 space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-primary">
            Transform Your Business Communication
          </h2>
          <p className="text-lg text-muted">
            Join hundreds of professionals who've revolutionized their SMS workflow
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-primary">{benefit}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-primary">
            Trusted by Professionals
          </h2>
          <p className="text-lg text-muted">
            See how AssisText is helping businesses communicate better
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="surface-card rounded-xl p-6 space-y-4">
              <div className="flex items-center space-x-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-primary italic">
                "{testimonial.content}"
              </p>
              <div>
                <div className="font-semibold text-primary">{testimonial.name}</div>
                <div className="text-sm text-muted">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center space-y-8 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-2xl p-12 text-white">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold">
            Ready to Transform Your SMS Communication?
          </h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Join thousands of professionals using AI to respond faster, smarter, and more efficiently.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register" className="btn bg-white text-brand-primary hover:bg-gray-100 btn-lg">
            Start Your Free Trial
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
          <Link to="/login" className="btn border-white text-white hover:bg-white/10 btn-lg">
            Sign In
          </Link>
        </div>
        
        <p className="text-sm opacity-75">
          No setup fees • Cancel anytime • Canadian hosted & compliant
        </p>
      </section>
    </div>
  );
};

export default LandingPageWithAuthLayout;