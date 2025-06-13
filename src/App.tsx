import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import PublicRoute from './components/common/PublicRoute';

// Layout Components
import AppLayout from './components/Layout/AppLayout';
import AuthLayout from './components/Layout/AuthLayout';

// Public Pages
import Login from './pages/Login';
import Register from './pages/Register';
import LandingPage from './pages/LandingPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Protected Pages
import Dashboard from './pages/Dashboard';
import MessagingInterface from './pages/MessagingInterface';
import ProfileManagement from './pages/ProfileManagement';
import AISettings from './pages/AISettings';
import Analytics from './pages/Analytics';
import ClientManagement from './pages/ClientManagement';
import Settings from './pages/Settings';
import Billing from './pages/Billing';

// Error Pages
import NotFound from './pages/NotFound';
import ErrorBoundary from './components/common/ErrorBoundary';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <div className="surface-bg min-h-screen">
            <Routes>
              {/* Public Routes - Available at root level */}
              <Route path="/" element={
                <PublicRoute>
                  <AuthLayout />
                </PublicRoute>
              }>
                <Route index element={<LandingPage />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="forgot-password" element={<ForgotPassword />} />
                <Route path="reset-password" element={<ResetPassword />} />
              </Route>

              {/* Protected Routes - Main Application */}
              <Route path="/app" element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="/app/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="messages" element={<MessagingInterface />} />
                <Route path="profiles" element={<ProfileManagement />} />
                <Route path="ai-settings" element={<AISettings />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="clients" element={<ClientManagement />} />
                <Route path="settings" element={<Settings />} />
                <Route path="billing" element={<Billing />} />
              </Route>

              {/* Redirect old routes to new structure */}
              <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
              <Route path="/messages" element={<Navigate to="/app/messages" replace />} />
              <Route path="/profiles" element={<Navigate to="/app/profiles" replace />} />
              <Route path="/ai-settings" element={<Navigate to="/app/ai-settings" replace />} />
              <Route path="/analytics" element={<Navigate to="/app/analytics" replace />} />
              <Route path="/clients" element={<Navigate to="/app/clients" replace />} />
              <Route path="/settings" element={<Navigate to="/app/settings" replace />} />

              {/* 404 Not Found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
};

export default App;