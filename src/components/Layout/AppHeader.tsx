import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Bell, 
  LogOut, 
  MoreVertical, 
  Settings, 
  Phone,
  User,
  Menu,
  X,
  Brain
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SimpleThemeToggle } from '../UI/ThemeToggle';

interface AppHeaderProps {
  isSidebarOpen: boolean;
  onSidebarToggle: () => void;
  isMobile: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ 
  isSidebarOpen, 
  onSidebarToggle, 
  isMobile 
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Updated dropdown items - changed "App Settings" to "AI Settings"
  const dropdownItems = [
    {
      label: 'Profile Settings',
      icon: User,
      action: () => navigate('/settings'),
      description: 'Personal information and account settings'
    },
    {
      label: 'SignalWire Settings',
      icon: Phone,
      action: () => navigate('/app/signalwire-settings'),
      description: 'Phone number and messaging configuration'
    },
    {
      label: 'AI Settings', // Changed from "App Settings"
      icon: Brain, // Changed from Settings to Brain for better semantic meaning
      action: () => navigate('/app/ai-settings'), // Updated route to match naming
      description: 'AI behavior and response customization'
    },
    {
      type: 'divider'
    },
    {
      label: 'Logout',
      icon: LogOut,
      action: handleLogout,
      className: 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10'
    },
  ];

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shadow-sm sticky top-0 z-30">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Left Side - Mobile Menu Toggle */}
        <div className="flex items-center space-x-4">
          {isMobile && (
            <button
              onClick={onSidebarToggle}
              className="p-2 text-slate-500 hover:text-brand-primary hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all duration-200"
              aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            >
              {isSidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          )}
          
          {/* Page Title - Hidden on mobile when sidebar is open */}
          <div className={`${isMobile && isSidebarOpen ? 'hidden' : 'block'}`}>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              AssisText
            </h1>
          </div>
        </div>

        {/* Right Side - User Actions */}
        <div className="flex items-center space-x-3">
          {/* Theme Toggle */}
          <SimpleThemeToggle />

          {/* Notifications */}
          <button className="p-2 text-slate-500 hover:text-brand-primary hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all duration-200 relative">
            <Bell className="w-5 h-5" />
            {/* Optional notification badge */}
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>

          {/* Profile Link */}
          <Link
            to="/settings"
            className="flex items-center space-x-2 px-3 py-2 text-slate-500 hover:text-brand-primary hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all duration-200"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-lg flex items-center justify-center text-white text-sm font-semibold">
              {user?.first_name?.[0] || user?.display_name?.[0] || user?.username?.[0] || 'U'}
            </div>
            <span className="hidden sm:block text-sm font-medium text-slate-900 dark:text-slate-100">
              {user?.display_name || user?.first_name || user?.username}
            </span>
          </Link>

          {/* Direct Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-3 py-2 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-all duration-200"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:block text-sm font-medium">Logout</span>
          </button>

          {/* 3-Dot Dropdown Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="p-2 text-slate-500 hover:text-brand-primary hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all duration-200"
              aria-label="More options"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {/* Enhanced Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg backdrop-blur-sm z-50">
                <div className="py-2">
                  {dropdownItems.map((item, index) => {
                    if (item.type === 'divider') {
                      return (
                        <div
                          key={index}
                          className="my-1 border-t border-slate-200 dark:border-slate-700"
                        />
                      );
                    }

                    const Icon = item.icon;
                    return (
                      <button
                        key={index}
                        onClick={() => {
                          item.action();
                          setIsDropdownOpen(false);
                        }}
                        className={`
                          w-full flex items-start space-x-3 px-4 py-3 text-sm transition-colors text-left
                          ${item.className || 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}
                        `}
                      >
                        <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="font-medium">{item.label}</div>
                          {item.description && (
                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                              {item.description}
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;