// src/main.tsx - Updated to import beautiful styles
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Import beautiful global styles (with Tailwind)
import './styles/globals.css';

// Toast notifications
import { Toaster } from 'react-hot-toast';

// Error boundary for top level
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Application Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
          <div className="max-w-md mx-auto text-center p-8">
            <div className="card">
              <div className="card-body">
                <div className="text-6xl mb-4">⚠️</div>
                <h1 className="text-2xl font-bold text-slate-900 mb-4">
                  Something went wrong
                </h1>
                <p className="text-secondary-600 mb-6">
                  Please refresh the page or contact support if the problem persists.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="btn btn-primary"
                >
                  Refresh Page
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Get root element
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

// Create root and render
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e293b',
            color: '#fff',
            borderRadius: '12px',
            border: '1px solid #334155',
            fontSize: '14px',
          },
          success: {
            duration: 3000,
            style: {
              background: '#059669',
              color: '#fff',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#059669',
            },
          },
          error: {
            duration: 5000,
            style: {
              background: '#dc2626',
              color: '#fff',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#dc2626',
            },
          },
          loading: {
            style: {
              background: '#3b82f6',
              color: '#fff',
            },
          },
        }}
      />
    </ErrorBoundary>
  </React.StrictMode>
);