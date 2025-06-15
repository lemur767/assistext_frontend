import { useLocation } from 'react-router-dom';
import { SidebarCollapseIcon, BellIcon, MenuIcon } from './Icons';

interface TopHeaderProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  isMobile: boolean;
}

const TopHeader: React.FC<TopHeaderProps> = ({ 
  onToggleSidebar, 
  isSidebarOpen, 
  isMobile 
}) => {
  const location = useLocation();

  const getPageInfo = (pathname: string) => {
    const pages: Record<string, { title: string; description: string }> = {
      '/dashboard': { 
        title: 'Dashboard', 
        description: 'Overview of your SMS AI platform performance' 
      },
      '/messages': { 
        title: 'Messages', 
        description: 'Real-time SMS conversations and AI responses' 
      },
      '/profiles': { 
        title: 'Profiles', 
        description: 'Manage your SMS profiles and configurations' 
      },
      '/clients': { 
        title: 'Clients', 
        description: 'Client contact management and analytics' 
      },
      '/ai-settings': { 
        title: 'AI Settings', 
        description: 'Configure AI personality and response behavior' 
      },
      '/analytics': { 
        title: 'Analytics', 
        description: 'Detailed insights and performance metrics' 
      },
      '/settings': { 
        title: 'Settings', 
        description: 'Platform configuration and preferences' 
      },
    };

    return pages[pathname] || { title: 'AssisText', description: 'SMS AI Platform' };
  };

  const pageInfo = getPageInfo(location.pathname);

  return (
    <header className="bg-card border-b border-neutral-200 dark:border-neutral-700 px-4 py-3 lg:px-6 lg:py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="btn btn-ghost p-2 -ml-2"
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen && !isMobile ? (
              <SidebarCollapseIcon className="w-5 h-5" />
            ) : (
              <MenuIcon className="w-5 h-5" />
            )}
          </button>
          
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-theme">
              {pageInfo.title}
            </h1>
            <p className="text-sm text-neutral-500 hidden sm:block">
              {pageInfo.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Actions */}
          <button className="btn btn-ghost p-2 relative">
            <BellIcon className="w-5 h-5" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full" />
          </button>
          
          {/* User Menu */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <div className="text-sm font-semibold text-theme">John Doe</div>
              <div className="text-xs text-neutral-500">Premium Plan</div>
            </div>
            <div className="profile-avatar w-10 h-10 text-sm">
              JD
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
