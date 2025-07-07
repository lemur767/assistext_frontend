import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useDarkMode } from '../../hooks/useDarkMode';

interface DarkModeToggleProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'button' | 'icon' | 'switch';
  className?: string;
  showLabel?: boolean;
}

const DarkModeToggle: React.FC<DarkModeToggleProps> = ({
  size = 'md',
  variant = 'button',
  className = '',
  showLabel = false,
}) => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const buttonSizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3',
  };

  if (variant === 'switch') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        {showLabel && (
          <span className="text-sm font-medium text-brand-text dark:text-brand-text-dark">
            {isDarkMode ? 'Dark Mode' : 'Light Mode'}
          </span>
        )}
        <button
          onClick={toggleDarkMode}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 dark:focus:ring-brand-primary-dark ${
            isDarkMode 
              ? 'bg-brand-primary dark:bg-brand-primary-dark' 
              : 'bg-surface-300 dark:bg-surface-600'
          }`}
          role="switch"
          aria-checked={isDarkMode}
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-200 ${
              isDarkMode ? 'translate-x-6' : 'translate-x-1'
            }`}
          >
            {isDarkMode ? (
              <Moon className="w-3 h-3 m-0.5 text-brand-primary" />
            ) : (
              <Sun className="w-3 h-3 m-0.5 text-warning-500" />
            )}
          </span>
        </button>
      </div>
    );
  }

  if (variant === 'icon') {
    return (
      <button
        onClick={toggleDarkMode}
        className={`${buttonSizeClasses[size]} rounded-lg text-brand-text dark:text-brand-text-dark hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 ${className}`}
        aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDarkMode ? (
          <Sun className={`${sizeClasses[size]} transition-transform duration-200 hover:rotate-12`} />
        ) : (
          <Moon className={`${sizeClasses[size]} transition-transform duration-200 hover:-rotate-12`} />
        )}
      </button>
    );
  }

  // Default button variant
  return (
    <button
      onClick={toggleDarkMode}
      className={`inline-flex items-center gap-2 ${buttonSizeClasses[size]} px-3 rounded-xl bg-white/80 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 hover:bg-white dark:hover:bg-surface-700 transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 ${className}`}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? (
        <Sun className={`${sizeClasses[size]} text-warning-500 transition-transform duration-200 hover:rotate-12`} />
      ) : (
        <Moon className={`${sizeClasses[size]} text-brand-primary transition-transform duration-200 hover:-rotate-12`} />
      )}
      {showLabel && (
        <span className="text-sm font-medium text-brand-text dark:text-brand-text-dark">
          {isDarkMode ? 'Light' : 'Dark'}
        </span>
      )}
    </button>
  );
};

export default DarkModeToggle;