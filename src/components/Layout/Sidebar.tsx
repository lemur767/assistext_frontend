import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  MessageSquare, 
  BarChart3, 
  Settings, 
  CreditCard, 
  Brain,
  Home,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  isMobile: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  onToggle, 
  isMobile
}) => {
  const location = useLocation();

  const navigationItems = [
    { path: '/app/dashboard', label: 'Dashboard', icon: Home },
    { path: '/app/conversations', label: 'Conversations', icon: MessageSquare },
    { path: '/app/ai-settings', label: 'AI Settings', icon: Brain },
    { path: '/app/analytics', label: 'Usage & Analytics', icon: BarChart3 },
    { path: '/app/billing', label: 'Billing', icon: CreditCard },
  ];

  const sidebarClasses = `
    fixed top-0 left-0 h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700
    shadow-lg transition-all duration-300 z-40
    ${isOpen ? 'w-64' : 'w-16'}
    ${isMobile && !isOpen ? '-translate-x-full' : ''}
  `;

  return (
    <aside className={sidebarClasses}>
      {/* Logo Section */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-accent rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">A</span>
          </div>
          {isOpen && (
            <div className="text-xl font-bold gradient-text">
              AssisText
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group
                    ${isActive 
                      ? 'bg-brand-primary text-white shadow-md' 
                      : 'text-slate-600 dark:text-slate-300 hover:text-brand-primary hover:bg-slate-50 dark:hover:bg-slate-800'
                    }
                    ${!isOpen ? 'justify-center' : ''}
                  `}
                  title={!isOpen ? item.label : ''}
                >
                  <Icon className={`
                    w-5 h-5 transition-transform group-hover:scale-110
                    ${isActive ? 'text-white' : ''}
                  `} />
                  {isOpen && (
                    <span className="font-medium text-sm">
                      {item.label}
                    </span>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse Toggle Button */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        <button
          onClick={onToggle}
          className="flex items-center justify-center w-full p-2 text-slate-500 hover:text-brand-primary hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all duration-200"
          title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {isOpen ? (
            <ChevronLeft className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;