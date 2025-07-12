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
  X
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

  const dropdownItems = [
    {
      label: 'Profile Settings',
      icon: User,
      action: () => navigate('/settings'),
    },
    {
      label: 'SignalWire Settings',
      icon: Phone,
      action: () => navigate('/app/signalwire-settings'),
    },
    {
      label: 'App Settings',
      icon: Settings,
      action: () => navigate('/app/settings'),
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
              Dashboard
            </h1>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-3">
          {/* Dark Mode Toggle */}
          <SimpleThemeToggle />
          
          {/* Notifications */}
          <button className="relative p-2 text-slate-500 hover:text-brand-primary hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all duration-200">
            <Bell className="w-5 h-5" />
            {/* Notification badge */}
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-brand-accent rounded-full"></span>
          </button>

          {/* User Profile Link */}
          <Link
            to="/settings"
            className="flex items-center space-x-2 p-2 text-slate-500 hover:text-brand-primary hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all duration-200"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-brand-primary to-brand-accent rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-semibold">
                {user?.first_name?.[0] || user?.username?.[0] || 'U'}
              </span>
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

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg backdrop-blur-sm z-50">
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
                          w-full flex items-center space-x-3 px-4 py-2 text-sm transition-colors
                          ${item.className || 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}
                        `}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
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