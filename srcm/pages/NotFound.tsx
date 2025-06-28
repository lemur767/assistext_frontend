import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, MessageSquare } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen surface-bg flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="card card-body">
          {/* Logo */}
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-brand-primary rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">AssisText</span>
          </div>
          
          {/* 404 Message */}
          <div className="mb-8">
            <h1 className="text-6xl font-bold text-brand-primary mb-4">404</h1>
            <h2 className="text-2xl font-bold text-primary mb-2">Page Not Found</h2>
            <p className="text-muted">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/"
              className="btn-primary flex items-center justify-center"
            >
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="btn-outline flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </button>
          </div>
          
          {/* Help Links */}
          <div className="mt-8 pt-6 border-t border-brand">
            <p className="text-sm text-muted mb-3">Need help?</p>
            <div className="flex justify-center space-x-4 text-sm">
              <a href="/support" className="text-brand-primary hover:text-brand-secondary transition-colors">
                Contact Support
              </a>
              <a href="/docs" className="text-brand-primary hover:text-brand-secondary transition-colors">
                Documentation
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
