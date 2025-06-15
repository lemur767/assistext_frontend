import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { SimpleThemeToggle } from '../UI/ThemeToggle';
import {DashboardIcon, MessagesIcon, ProfilesIcon, ClientsIcon, AISettingsIcon, AnalyticsIcon, SettingsIcon} from './Icons'

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
  selectedProfileId: string;
  onProfileChange: (profileId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  onClose, 
  isMobile,
  selectedProfileId,
  onProfileChange 
}) => {
  const location = useLocation();

  const navigationItems = [
  { path: '/app/dashboard', label: 'Dashboard', icon: DashboardIcon },
  { path: '/app/messages', label: 'Messages', icon: MessagesIcon },
  { path: '/app/profiles', label: 'Profiles', icon: ProfilesIcon },
  { path: '/app/clients', label: 'Clients', icon: ClientsIcon },
  { path: '/app/ai-settings', label: 'AI Settings', icon: AISettingsIcon },
  { path: '/app/analytics', label: 'Analytics', icon: AnalyticsIcon },
  { path: '/app/settings', label: 'Settings', icon: SettingsIcon },
];
  const sidebarClasses = `
    fixed top-0 left-0 h-full bg-card border-r border-neutral-200 dark:border-neutral-700
    shadow-lg transition-all duration-300 z-40
    ${isOpen ? 'w-64' : 'w-16'}
    ${isMobile && !isOpen ? '-translate-x-full' : ''}
  `;
const enhancedSidebarLogo = (
  <div className="p-4 border-b border-slate-200">
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
        <span className="text-white font-bold text-xl">A</span>
      </div>
      {isOpen && (
        <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          AssisText
        </div>
      )}
    </div>
  </div>
);
  // Add icon animation
  const iconClass = "group-hover:scale-110 transition-transform";

  const navLinkClass = "flex items-center gap-3 px-3 py-3 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 group";

  return (
    <aside className={sidebarClasses}>
      <div className="p-4 border-b border-slate-200">
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
        <span className="text-white font-bold text-xl">A</span>
      </div>
      {isOpen && (
        <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          AssisText
        </div>
      )}
    </div>
  </div>


      {/* Profile Selector */}
      {isOpen && (
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">
            Active Profile
          </label>
          <select 
            className="form-input text-sm"
            value={selectedProfileId}
            onChange={(e) => onProfileChange(e.target.value)}
          >
            <option value="1">Luna's Profile</option>
            <option value="2">Sarah's Profile</option>
            <option value="3">Alex's Profile</option>
          </select>
        </div>
      )}

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
                  className={`nav-link group ${isActive ? 'active' : ''} ${
                    !isOpen ? 'justify-center px-2' : ''
                  }`}
                  onClick={() => isMobile && onClose()}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {isOpen && (
                    <span className="truncate">{item.label}</span>
                  )}
                  {!isOpen && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className={`p-4 border-t border-neutral-200 dark:border-neutral-700 ${
        !isOpen ? 'px-2' : ''
      }`}>
        <div className={`flex items-center gap-3 ${!isOpen ? 'justify-center' : ''}`}>
          <SimpleThemeToggle className="p-2" />
          {isOpen && (
            <div className="flex-1">
              <div className="text-sm font-medium text-theme">Theme</div>
              <div className="text-xs text-neutral-500">Switch appearance</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
