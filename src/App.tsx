import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Layout Components
import AppLayout from './components/Layout/AppLayout';
import AuthLayout from './components/Layout/AuthLayout';

// Route Protection
import ProtectedRoute from './components/common/ProtectedRoute';
import PublicRouteWrapper from './components/common/PublicRouteWrapper';

// Public Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';

// Protected Pages - Main App
import Dashboard from './pages/Dashboard';
import Conversations from './pages/Conversations';
import Analytics from './pages/Analytics';
import Billing from './pages/Billing';

// Protected Pages - Settings (Separate Routes)
import ProfileSettings from './pages/ProfileSettings';
import SignalWireSettings from './pages/SignalWireSettings';
import AISettings from './pages/AISettings';

// Styles
import './styles/globals.css';

// Create query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system">
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

function AppContent() {
  return (
    <Router>
      <div className="min-h-screen surface-bg transition-colors duration-300">
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <PublicRouteWrapper>
                <LandingPage />
              </PublicRouteWrapper>
            }
          />
          
          <Route
            path="/login"
            element={
              <PublicRouteWrapper>
                <AuthLayout>
                  <Login />
                </AuthLayout>
              </PublicRouteWrapper>
            }
          />
          
          <Route
            path="/register"
            element={
              <PublicRouteWrapper>
                <AuthLayout>
                  <Register />
                </AuthLayout>
              </PublicRouteWrapper>
            }
          />

          {/* Protected App Routes - Use AppLayout with Sidebar */}
          <Route
            path="/app/*"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            {/* Main app pages that appear in AppLayout outlet */}
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="conversations" element={<Conversations />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="billing" element={<Billing />} />
            
            {/* AI Settings within app layout */}
            <Route path="ai-settings" element={<AISettings />} />
          </Route>

          {/* Separate Settings Routes - Full Page Layout */}
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <ProfileSettings />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/signalwire-settings"
            element={
              <ProtectedRoute>
                <SignalWireSettings />
              </ProtectedRoute>
            }
          />

          {/* Legacy redirects for backward compatibility */}
          <Route path="/profiles" element={<Navigate to="/settings" replace />} />
          <Route path="/profile-management" element={<Navigate to="/settings" replace />} />
          <Route path="/app/profiles" element={<Navigate to="/settings" replace />} />
          <Route path="/app/settings" element={<Navigate to="/settings" replace />} />
          <Route path="/app/signalwire" element={<Navigate to="/signalwire-settings" replace />} />

          {/* Catch all - redirect to dashboard if authenticated, landing if not */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Global Toast Notifications */}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            className: 'toast-custom',
            style: {
              background: 'var(--card-bg)',
              color: 'var(--text-color)',
              border: '1px solid var(--border-color)',
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;