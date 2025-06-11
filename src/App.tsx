import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '../src/context/ThemeContext';
import AppLayout from './components/Layout/AppLayout';
import './styles/globals.css';
import { clearLargeCookies } from './utils/clear';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});
if (window.performance.navigation.type === 1) { // Page refresh
    clearLargeCookies();
}
const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <div className="App">
            <AppLayout />
            <Toaster
              position="bottom-right"
              toastOptions={{
                duration: 4000,
                className: '',
                style: {
                  background: 'var(--card-bg)',
                  color: 'var(--text-color)',
                  border: '1px solid var(--border-color)',
                },
                success: {
                  iconTheme: {
                    primary: '#22c55e',
                    secondary: '#ffffff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#ffffff',
                  },
                },
              }}
            />
          </div>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;