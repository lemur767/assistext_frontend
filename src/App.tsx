// src/App.tsx - Fixed with proper theme integration
import React from 'react';
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

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MessagingInterface from './pages/MessagingInterface';
import Analytics from './pages/Analytics';
import ClientManagement from './pages/ClientManagement';
import Billing from './pages/Billing';
import ProfileSettings from './pages/ProfileSettings';

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

          {/* Protected App Routes */}
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="messages" element={<MessagingInterface />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="clients" element={<ClientManagement />} />
            <Route path="billing" element={<Billing />} />
          </Route>

          {/* Profile Settings Route (outside of main app layout for full control) */}
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <ProfileSettings />
              </ProtectedRoute>
            }
          />

          {/* Legacy redirects */}
          <Route path="/profiles" element={<Navigate to="/settings" replace />} />
          <Route path="/profile-management" element={<Navigate to="/settings" replace />} />
          <Route path="/app/profiles" element={<Navigate to="/settings" replace />} />
          <Route path="/app/settings" element={<Navigate to="/settings" replace />} />

          {/* Catch all - redirect to dashboard if authenticated, landing if not */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Global Toast Notifications */}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
          }}
        />
      </div>
    </Router>
  );
}

export default App;