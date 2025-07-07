// src/App.tsx - Complete with all our pages
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute'
import PublicRouteWrapper from './components/common/PublicRouteWrapper'
import { Toaster } from 'react-hot-toast';
import LandingPage from './pages/LandingPage'

// Import our existing pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MessagingInterface from './pages/MessagingInterface';
import ProfileSettings from '../pages/ProfileSettings';
import Analytics from './pages/Analytics';
xxxxxxxxxx
import ClientManagement from './pages/ClientManagement';
import Billing from './pages/Billing';


// Layout
// import AuthLayout from './components/Layout/AuthLayout';
import AppLayout from './components/Layout/AppLayout';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<PublicRouteWrapper><LandingPage/></PublicRouteWrapper>} />
          <Route path="login" element={<PublicRouteWrapper><Login/></PublicRouteWrapper>} />
          <Route path="register" element={<PublicRouteWrapper><Register/></PublicRouteWrapper>} />
         
        
        
          {/* Protected App Routes */}
          <Route path="/app" element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="messages" element={<MessagingInterface />} />
            <Route path="settings" element={<ProfileSettings/>} />
            <Route path="analytics" element={<Analytics />} />
            
            <Route path="clients" element={<ClientManagement />} />
            <Route path="billing" element={<Billing />} />
            
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