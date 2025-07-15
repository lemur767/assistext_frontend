import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Menu } from 'lucide-react';

interface AppHeaderProps {
  onMenuClick: () => void;
  isMobile: boolean;
}

const AppHeader: React.FC<AppHeaderProps> = ({ onMenuClick, isMobile }) => {
  const { user } = useAuth();

  // Only render on mobile
  if (!isMobile) return null;

  return (
    <div className="relative z-10 flex-shrink-0 flex h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <button
        type="button"
        className="px-4 border-r border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
        onClick={onMenuClick}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      <div className="flex-1 px-4 flex justify-between items-center">
        <div className="flex-1 flex">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            AssisText
          </h1>
        </div>

        <div className="ml-4 flex items-center">
          {/* User info for mobile */}
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <span className="text-blue-600 dark:text-blue-400 font-medium text-sm">
                {user?.first_name?.[0] || user?.username?.[0] || 'U'}
              </span>
            </div>
            <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              {user?.first_name || user?.username}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppHeader;