import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface PublicRouteProps {
  children: JSX.Element;
}

const PublicRouteWrapper: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading indicator while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen surface-bg flex justify-center items-center">
        <div className="loading-spinner w-8 h-8"></div>
      </div>
    );
  }
  
  // If authenticated and trying to access auth pages, redirect to dashboard
  if (isAuthenticated && (
    location.pathname === '/login' || 
    location.pathname === '/register' ||
    location.pathname === '/forgot-password'
  )) {
    return <Navigate to="/app/dashboard" replace />;
  }

  // If authenticated and on root path, redirect to dashboard
  if (isAuthenticated && location.pathname === '/') {
    return <Navigate to="/app/dashboard" replace />;
  }

  // Render children for public routes
  return children;
};

export default PublicRouteWrapper;