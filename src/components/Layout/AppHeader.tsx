import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  MessageSquare, 
  Bell, 
  Settings, 
  User, 
  LogOut, 
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import DarkModeToggle from '../ui/DarkModeToggle';
import { useUser } from '../../hooks/useUser';
import { useAuth } from '../../hooks/useAuth';

const AppHeader: React.FC = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { data: user } = useUser();
  const { logout } = useAuth();

  const navigationItems = [
    { path: '/app/dashboard', label: 'Dashboard' },
    { path: '/app/messages', label: 'Messages' },
    { path: '/app/clients', label: 'Clients' },
    { path: '/app/analytics', label: 'Analytics' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActivePath = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-surface-800/80 backdrop-blur-md border-b border-surface-200 dark:border-surface-700">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/app/dashboard" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-accent rounded-xl flex items-center justify-center shadow-md">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold gradient-text-brand">AssisText</h1>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActivePath(item.path)
                    ? 'bg-brand-primary text-white shadow-md'
                    : 'text-brand-text dark:text-brand-text-dark hover:bg-surface-100 dark:hover:bg-surface-700'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            
            {/* Dark Mode Toggle */}
            <DarkModeToggle variant="icon" size="md" />
            
            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors">
              <Bell className="w-5 h-5 text-brand-text dark:text-brand-text-dark" />
              {/* Notification badge */}
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-brand-accent rounded-full"></span>
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {user?.first_name?.[0] || user?.username?.[0] || 'U'}
                  </span>
                </div>
                <span className="hidden sm:block text-sm font-medium text-brand-text dark:text-brand-text-dark">
                  {user?.display_name || user?.first_name || user?.username}
                </span>
                <ChevronDown className={`w-4 h-4 text-brand-text dark:text-brand-text-dark transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl shadow-lg backdrop-blur-sm z-50">
                  <div className="p-4 border-b border-surface-200 dark:border-surface-700">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center">
                        <span className="text-white text-lg font-semibold">
                          {user?.first_name?.[0] || user?.username?.[0] || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-brand-text dark:text-brand-text-dark">
                          {user?.display_name || `${user?.first_name} ${user?.last_name}` || user?.username}
                        </p>
                        <p className="text-xs text-brand-text/70 dark:text-brand-text-dark/70">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-2">
                    <Link
                      to="/settings"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center space-x-3 w-full px-3 py-2 text-sm text-brand-text dark:text-brand-text-dark hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Profile Settings</span>
                    </Link>
                    
                    <Link
                      to="/app/billing"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center space-x-3 w-full px-3 py-2 text-sm text-brand-text dark:text-brand-text-dark hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span>Account & Billing</span>
                    </Link>
                    
                    <hr className="my-2 border-surface-200 dark:border-surface-700" />
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 w-full px-3 py-2 text-sm text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/20 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-brand-text dark:text-brand-text-dark" />
              ) : (
                <Menu className="w-5 h-5 text-brand-text dark:text-brand-text-dark" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-surface-200 dark:border-surface-700 py-4">
            <nav className="space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActivePath(item.path)
                      ? 'bg-brand-primary text-white shadow-md'
                      : 'text-brand-text dark:text-brand-text-dark hover:bg-surface-100 dark:hover:bg-surface-700'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              
              <hr className="my-4 border-surface-200 dark:border-surface-700" />
              
              <Link
                to="/settings"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-lg text-sm font-medium text-brand-text dark:text-brand-text-dark hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
              >
                Profile Settings
              </Link>
              
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/20 transition-colors"
              >
                Sign Out
              </button>
            </nav>
          </div>
        )}
      </div>
      
      {/* Backdrop for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      {/* Backdrop for user menu */}
      {isUserMenuOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default AppHeader;