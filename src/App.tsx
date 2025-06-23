// src/App.tsx - Complete with all our pages
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute'
import PublicRoute from './components/common/PublicRoute'
import { Toaster } from 'react-hot-toast';

// Import our existing pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MessagingInterface from './pages/MessagingInterface';
import ProfileManagement from './pages/ProfileManagement';
import Analytics from './pages/Analytics';
import AISettings from './pages/AISettings';
import ClientManagement from './pages/ClientManagement';
import Billing from './pages/Billing';
import Settings from './pages/Settings';

// Layout
import AppLayout from './components/Layout/AppLayout';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
      <Route path="/auth" element={
        <PublicRoutes>
          <AuthLayout />
        </PublicRoutes>
      }>
          <Route path="/" element={<LandingPage/>} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
          {/* Protected App Routes */}
          <Route path="/app" element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="messages" element={<MessagingInterface />} />
            <Route path="profiles" element={<ProfileManagement />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="ai-settings" element={<AISettings />} />
            <Route path="clients" element={<ClientManagement />} />
            <Route path="billing" element={<Billing />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          
          {/* Redirects */}
       
          <Route path="/app" element={<Navigate to="/app/dashboard" />} />
        </Routes>
        
        <Toaster position="top-right" />
      </Router>
    </AuthProvider>
  );
}

export default App;