import { Component } from 'react' 
import type { ErrorInfo }from 'react';
import type { ReactNode }from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="max-w-md w-full mx-4">
            <div className="bg-card border border-neutral-200 dark:border-neutral-700 rounded-xl p-8 text-center">
              <div className="text-6xl mb-6">😵</div>
              <h1 className="text-2xl font-bold text-theme mb-4">Something went wrong</h1>
              <p className="text-neutral-500 mb-6">
                We encountered an unexpected error. Please try refreshing the page.
              </p>
              <div className="space-y-3">
                <button 
                  className="btn btn-primary w-full"
                  onClick={() => window.location.reload()}
                >
                  Refresh Page
                </button>
                <button 
                  className="btn btn-ghost w-full"
                  onClick={() => this.setState({ hasError: false, error: undefined })}
                >
                  Try Again
                </button>
              </div>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-6 text-left">
                  <summary className="cursor-pointer text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300">
                    Error Details (Development)
                  </summary>
                  <pre className="mt-2 p-3 bg-neutral-100 dark:bg-neutral-800 rounded text-xs overflow-auto">
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}