// src/pages/LandingPage.tsx - Fixed and complete landing page
import logo from '../assets/logoNoRect.png';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageSquare, Shield, Brain, Zap, CheckCircle, Star } from 'lucide-react';
import { GlassGradCard } from '../components/UI/GlassGradientCard';

const data = [
            {
                
                icon: <Brain className="w-8 h-8 text-accent-400" />,
                title: 'AI-Powered Intelligence',
                glow: 'accent' as const,
                blur: 'light' as const,
                size: 'sm' as const,
                animation:'glow' as const,
                description: 'Advanced AI learns your communication style and responds naturally to customers.',
                
              },
              {
                
                icon: <Shield className="w-8 h-8 text-secondary-400" />,
                title: 'Privacy & Security',
                description: 'Canadian-hosted with enterprise-grade encryption. PIPEDA compliant by design.',
                blur:'light' as const,
                size:'sm' as const,
                animation:'glow' as const,
                glow:'brand' as const


              },
              {
                icon: <Zap className="w-8 h-8 text-primary-400" />,
                title: '24/7 Availability',
                description: 'Never miss a message again. Instant responses with customizable business hours.',
                glow: 'secondary' as const,
                blur: 'light' as const,
                size: 'sm' as const,
                animation: 'glow' as const

              }
         ]

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-3 mt-2 dark:bg-slate-950 overflow-hidden">
      {/* Background orbs - heavily blurred for subtle ambient lighting */}
      <div className="fixed top-20 left-10 w-72 h-72 bg-blue-400/20 dark:bg-blue-500/30 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="fixed top-40 right-20 w-96 h-96 bg-purple-400/15 dark:bg-purple-500/25 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: '2s' }} />
      <div className="fixed bottom-20 left-1/3 w-80 h-80 bg-cyan-400/20 dark:bg-cyan-500/30 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: '4s' }} />
      <div className="fixed bottom-40 right-1/4 w-64 h-64 bg-pink-400/15 dark:bg-pink-500/25 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: '6s' }} />
      
      {/* Subtle overlay for depth */}
      <div className="fixed inset-0 bg-white/30 dark:bg-black/20 pointer-events-none" />
      
      <div className="relative z-10">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
      
          <div className="text-center max-w-4xl mx-auto">
            
              <div className="inline-flex items-center space-x-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-white/20">
                <span className="w-2 h-2 bg-accent-400 rounded-full animate-pulse"></span>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  🇨🇦 Proudly Canadian • PIPEDA Compliant
                </span>
              </div>
            </div>
            <div className="flex flex-row items-between justify-center mb-8">
              <div className="items-center justify-center mb-4 p-2">
                <img src={logo} width={220} height={220} alt="logo"/>
              </div>
            <div>
            <h1 className="font-bold m-8 leading-tight">
              <span className="text-2xl md:text-5xl text-slate-900 dark:text-white">AI-Powered</span>
              <br />
              <span className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-accent-300 to-secondary-900 bg-clip-text text-transparent">
                Assist Text
              </span>
            </h1>
            </div>
            </div>
            
            <p className="text-xl text-center items-center justify-center md:text-2xl text-slate-600 dark:text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Transform your business communications with intelligent SMS automation.
              Never miss a message, always respond professionally, available 24/7.</p>
           
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link 
                to="/register" 
                className="group px-8 py-4 bg-gradient-to-r from-secondary-600 to-primary-600 text-white rounded-2xl font-semibold text-lg hover:from-primary-600 hover:to-accent-400 hover:border-2 hover:to-bg-slate-700 transform hover:scale-105 transition-all duration-500 shadow-2xl"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2 inline-block group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/login" 
                className="px-8 py-4 bg-white/80 dark:bg-transparent text-slate-900 dark:text-white backdrop-blur-sm rounded-2xl font-semibold text-lg hover:bg-white dark:hover:bg-slate-700 transition-all duration-200 border border-white/20"
              >
                Sign In
              </Link>
            </div>
            
            <div className="flex items-center justify-center space-x-8 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Free 14-day trial</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Cancel anytime</span>
              </div>
            </div>
       </section>
         
        
                      
      {/* Features Section */}
      <section id="features" className="py-24 backdrop-blur-sm">
        <div className="absolute z-12 flex flex-row gap-8 align-center justifty-center p-4"></div>
          <div className="text-center mb-16">
                
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Why Choose AssisText?
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Built specifically for Canadian businesses who value privacy, security, and intelligent automation.
            </p>
          </div>
      <div className="grid md:grid-cols-3 mx-8 max-w-6xl justify-between gap-8 ">
         {data.map((data, index) =>  {
          return (
            <GlassGradCard className="hover:scale-105 transition-transform duration-300"
              key={index}
              glow={data.glow}
              blur={data.blur}
              size={data.size}
              animation={data.animation}>
                
              <div className="text-center flex flex-col items-center m-2 p-2">
                <div className="w-10 h-10 text-accent-400 justify-center items-center mb-4">{data.icon}</div> 
                <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">{data.title}</h3>
                <p className="text-slate-600 dark:text-slate-300">{data.description}</p>
              </div>
              
            </GlassGradCard>
          )
         }
        )}
      </div>
                      
       
       
      
    </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Choose the plan that fits your business needs. All plans include our core AI features.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: 'Starter',
                price: '$19',
                period: '/month',
                description: 'Perfect for small businesses',
                features: ['100 SMS messages', 'Basic AI responses', 'Email support'],
                highlighted: false
              },
              {
                name: 'Professional',
                price: '$34',
                period: '/month',
                description: 'Most popular for growing businesses',
                features: ['2,000 SMS messages', 'Advanced AI training', 'Priority support', 'Analytics dashboard'],
                highlighted: true
              },
              {
                name: 'Enterprise',
                price: '$79',
                period: '/month',
                description: 'For large organizations',
                features: ['10,000 SMS messages', 'Custom AI training', 'Personal Support 24/7', 'Advanced analytics'],
                highlighted: false
              }
            ].map((plan, index) => (
              <div 
                key={index} 
                className={`relative p-8 rounded-3xl shadow-xl border transition-all duration-300 hover:scale-105 ${
                  plan.highlighted 
                    ? 'bg-gradient-to-b hover:backdrop-blue-md hover:bg-accent-400/25 from-blue-600 to-indigo-600 text-white border-blue-500 scale-105' 
                    : 'bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border-white/20 text-slate-900 dark:text-white'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-orange-400 to-pink-400 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className={`text-sm ${plan.highlighted ? 'text-blue-100' : 'text-slate-600 dark:text-slate-400'} mb-4`}>
                    {plan.description}
                  </p>
                  <div className="flex items-end justify-center">
                    <span className="text-5xl font-bold">{plan.price}</span>
                    <span className={`text-lg ${plan.highlighted ? 'text-blue-100' : 'text-slate-600 dark:text-slate-400'} ml-1`}>
                      {plan.period}
                    </span>
                  </div>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle className={`w-5 h-5 mr-3 ${plan.highlighted ? 'text-blue-200' : 'text-green-500'}`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link
                  to="/register"
                  className={`block w-full py-4 text-center font-semibold rounded-2xl transition-all duration-200 ${
                    plan.highlighted
                      ? 'bg-white text-blue-600 hover:bg-blue-50'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
                  }`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white/50 dark:bg-slate-800/25 backdrop-blur-sm">
      
        <div className="container backdrop-blue-lg mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Trusted by Canadian Businesses
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: 'Sarah Chen',
                role: 'Restaurant Owner',
                company: 'Toronto',
                content: 'AssisText has revolutionized how we handle reservations. Our AI assistant handles 80% of inquiries automatically.',
                rating: 5
              },
              {
                name: 'Michael Dubois',
                role: 'Real Estate Agent',
                company: 'Montreal',
                content: 'Never miss a lead again. The AI responds to property inquiries instantly, even when I\'m showing other homes.',
                rating: 5
              },
              {
                name: 'Jennifer Smith',
                role: 'Clinic Manager',
                company: 'Vancouver',
                content: 'Perfect for appointment confirmations and patient communication. PIPEDA compliance was essential for us.',
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="p-8 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-600 dark:text-slate-300 mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">{testimonial.name}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">{testimonial.role}, {testimonial.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-8">
              Ready to Transform Your Business Communications?
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-12">
              Join thousands of Canadian businesses using AI to respond faster, smarter, and more efficiently.
            </p>
            
            <div className= "flex flex-col-2 gap-6 justify-center mb-12">
              <Link 
                to="/register" 
                className="dark:text-slate-300 mb-12 px-8 py-5 bg-gradient-to-r from-secondary-600 to-primary-600 text-white rounded-2xl font-semibold hover:from-primary-600 hover:to-accent-400 hover:border-2 hover:to-bg-slate-700 transform hover:scale-105 transition-all duration-500 shadow-2xl flex items-center justify-center">
                Start Your Free Trial
                <ArrowRight className="w-5 h-5 ml-2 inline-block group-hover:translate-x-1 transition-transform" />
                          
              </Link>
              <Link 
                to="/login" 
                className="px-8 py-4 h-fit bg-white/80 dark:bg-transparent text-slate-900 dark:text-white backdrop-blur-sm rounded-2xl font-semibold text-lg dark:hover:bg-slate-800/80 dark:hover:border-white/90 dark:hover:bg-slate-700 transition-all duration-200 border border-white/40"
              >Sign In
              </Link>
            </div>
            
            <p className="text-sm text-slate-600 dark:text-slate-400">
              No setup fees • Cancel anytime • Canadian hosted & compliant
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Company */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
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
    </div>
    </div>
  );
};

export default LandingPage;