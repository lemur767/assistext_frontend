import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useKeyboardShortcut } from '../../hooks/useKeyboardShortcut';
import { Sidebar } from './Sidebar';
import {TopHeader} from './TopHeader';
import { Dashboard } from '../dashboard/Dashboard';
import { MessagingInterface}  from '../messaging/MessagingInterface';
import { ProfileManagement } from '../profile/ProfileManagement';
import AISettings from '../AISettings/AISettings';
import type { BaseComponentProps } from '../../types';
import { ComingSoonPage } from './ComingSoon';

interface AppLayoutProps extends BaseComponentProps {}

const AppLayout: React.FC<AppLayoutProps> = ({ className = '' }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState<string>('1'); // Mock profile ID
  
  const isMobile = useMediaQuery('(max-width: 768px)');
  const location = useLocation();

  // Close sidebar on route change (mobile)
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  // Keyboard shortcuts
  useKeyboardShortcut(
    { key: 'b', ctrlKey: true },
    () => setSidebarOpen(!sidebarOpen),
    [sidebarOpen]
  );

  useKeyboardShortcut(
    { key: 'Escape' },
    () => isMobile && setSidebarOpen(false),
    [isMobile, sidebarOpen]
  );

  return (
    <div className={`min-h-screen bg-background text-theme ${className}`}>
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isMobile={isMobile}
        selectedProfileId={selectedProfileId}
        onProfileChange={setSelectedProfileId}
      />

      {/* Main Content */}
      <div className={`flex flex-col transition-all duration-300 ${
        isMobile ? '' : sidebarOpen ? 'ml-64' : 'ml-16'
      }`}>
        {/* Top Header */}
        <TopHeader
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          isSidebarOpen={sidebarOpen}
          isMobile={isMobile}
        />

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route 
              path="/dashboard" 
              element={<Dashboard profileId={selectedProfileId} />} 
            />
            <Route 
              path="/messages" 
              element={<MessagingInterface profileId={selectedProfileId} />} 
            />
            <Route 
              path="/profiles" 
              element={<ProfileManagement userId="1" />} 
            />
            <Route 
              path="/ai-settings" 
              element={<AISettings profileId={selectedProfileId} />} 
            />
            <Route 
              path="/analytics" 
              element={<ComingSoonPage title="Analytics" icon="📊" />} 
            />
            <Route 
              path="/clients" 
              element={<ComingSoonPage title="Client Management" icon="👥" />} 
            />
            <Route 
              path="/settings" 
              element={<ComingSoonPage title="Settings" icon="⚙️" />} 
            />
          </Routes>
        </main>
      </div>

      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

// src/components/Layout/Sidebar.tsx


// src/components/Layout/TopHeader.tsx



// Coming Soon Page Component


// Navigation Icons

export default AppLayout;