import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  X, 
  Loader2,
  AlertCircle 
} from 'lucide-react';

// =============================================================================
// NOTIFICATION/TOAST COMPONENT
// =============================================================================

export interface NotificationProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

export const Notification: React.FC<NotificationProps> = ({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(id);
    }, 300);
  };

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const Icon = icons[type];

  const colorClasses = {
    success: 'bg-success-50 dark:bg-success-900/20 border-success-200 dark:border-success-800 text-success-800 dark:text-success-200',
    error: 'bg-error-50 dark:bg-error-900/20 border-error-200 dark:border-error-800 text-error-800 dark:text-error-200',
    warning: 'bg-warning-50 dark:bg-warning-900/20 border-warning-200 dark:border-warning-800 text-warning-800 dark:text-warning-200',
    info: 'bg-info-50 dark:bg-info-900/20 border-info-200 dark:border-info-800 text-info-800 dark:text-info-200',
  };

  const iconColorClasses = {
    success: 'text-success-600 dark:text-success-400',
    error: 'text-error-600 dark:text-error-400',
    warning: 'text-warning-600 dark:text-warning-400',
    info: 'text-info-600 dark:text-info-400',
  };

  return createPortal(
    <div
      className={`fixed top-4 right-4 z-notification max-w-sm w-full transform transition-all duration-300 ${
        isVisible && !isExiting
          ? 'translate-x-0 opacity-100 scale-100'
          : 'translate-x-full opacity-0 scale-95'
      }`}
    >
      <div
        className={`p-4 rounded-xl backdrop-blur-sm border shadow-lg ${colorClasses[type]}`}
      >
        <div className="flex items-start space-x-3">
          <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColorClasses[type]}`} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold">{title}</p>
            {message && (
              <p className="text-sm mt-1 opacity-90">{message}</p>
            )}
          </div>
          <button
            onClick={handleClose}
            className="flex-shrink-0 rounded-lg p-1 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

// =============================================================================
// NOTIFICATION MANAGER
// =============================================================================

export interface NotificationManagerState {
  notifications: NotificationProps[];
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);

  const addNotification = (notification: Omit<NotificationProps, 'id' | 'onClose'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { ...notification, id, onClose: removeNotification }]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const NotificationContainer = () => (
    <>
      {notifications.map(notification => (
        <Notification key={notification.id} {...notification} />
      ))}
    </>
  );

  return {
    addNotification,
    removeNotification,
    NotificationContainer,
    notifications,
  };
};

// =============================================================================
// MODAL COMPONENT
// =============================================================================

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  children: React.ReactNode;
  className?: string;
  closeOnBackdrop?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  size = 'md',
  children,
  className = '',
  closeOnBackdrop = true,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-none m-4',
  };

  return createPortal(
    <div className="fixed inset-0 z-modal flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm"
        onClick={closeOnBackdrop ? onClose : undefined}
      />
      
      {/* Modal */}
      <div
        className={`relative bg-white/90 dark:bg-surface-800/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-surface-200 dark:border-surface-700 w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden animate-scale-in ${className}`}
      >
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-surface-200 dark:border-surface-700">
            <h2 className="text-xl font-semibold text-brand-text dark:text-brand-text-dark">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
            >
              <X className="w-5 h-5 text-brand-text dark:text-brand-text-dark" />
            </button>
          </div>
        )}
        
        <div className="overflow-y-auto max-h-[calc(90vh-8rem)] custom-scrollbar">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

// =============================================================================
// STATUS BADGE COMPONENT
// =============================================================================

export interface StatusBadgeProps {
  status: 'online' | 'offline' | 'busy' | 'away' | 'active' | 'inactive' | 'success' | 'warning' | 'error';
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  size = 'md',
  showDot = true,
  className = '',
}) => {
  const statusConfig = {
    online: { color: 'success', label: 'Online', dotClass: 'bg-success-500 animate-pulse' },
    active: { color: 'success', label: 'Active', dotClass: 'bg-success-500' },
    success: { color: 'success', label: 'Success', dotClass: 'bg-success-500' },
    offline: { color: 'surface', label: 'Offline', dotClass: 'bg-surface-400 dark:bg-surface-600' },
    inactive: { color: 'surface', label: 'Inactive', dotClass: 'bg-surface-400 dark:bg-surface-600' },
    busy: { color: 'error', label: 'Busy', dotClass: 'bg-error-500' },
    error: { color: 'error', label: 'Error', dotClass: 'bg-error-500' },
    away: { color: 'warning', label: 'Away', dotClass: 'bg-warning-500' },
    warning: { color: 'warning', label: 'Warning', dotClass: 'bg-warning-500' },
  };

  const config = statusConfig[status];
  const displayLabel = label || config.label;

  const sizeClasses = {
    sm: { dot: 'w-2 h-2', text: 'text-xs', padding: 'px-2 py-1' },
    md: { dot: 'w-2.5 h-2.5', text: 'text-sm', padding: 'px-3 py-1.5' },
    lg: { dot: 'w-3 h-3', text: 'text-base', padding: 'px-4 py-2' },
  };

  const colorClasses = {
    success: 'bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-300',
    error: 'bg-error-100 text-error-800 dark:bg-error-900/20 dark:text-error-300',
    warning: 'bg-warning-100 text-warning-800 dark:bg-warning-900/20 dark:text-warning-300',
    surface: 'bg-surface-100 text-surface-800 dark:bg-surface-800 dark:text-surface-300',
  };

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full font-medium ${sizeClasses[size].padding} ${sizeClasses[size].text} ${colorClasses[config.color]} ${className}`}
    >
      {showDot && (
        <span className={`rounded-full ${sizeClasses[size].dot} ${config.dotClass}`} />
      )}
      {displayLabel}
    </span>
  );
};

// =============================================================================
// LOADING COMPONENT
// =============================================================================

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white' | 'current';
  text?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  text,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const colorClasses = {
    primary: 'text-brand-primary dark:text-brand-primary-dark',
    secondary: 'text-brand-secondary dark:text-brand-secondary-dark',
    white: 'text-white',
    current: 'text-current',
  };

  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <Loader2 className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]}`} />
      {text && (
        <span className="text-sm text-brand-text dark:text-brand-text-dark">
          {text}
        </span>
      )}
    </div>
  );
};

// =============================================================================
// LOADING OVERLAY COMPONENT
// =============================================================================

export interface LoadingOverlayProps {
  isLoading: boolean;
  text?: string;
  className?: string;
  children: React.ReactNode;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  text = 'Loading...',
  className = '',
  children,
}) => {
  return (
    <div className={`relative ${className}`}>
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-xl">
          <LoadingSpinner size="lg" text={text} />
        </div>
      )}
    </div>
  );
};

// =============================================================================
// SKELETON LOADING COMPONENT
// =============================================================================

export interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
  width,
  height,
  lines = 1,
}) => {
  const baseClasses = 'animate-pulse bg-surface-200 dark:bg-surface-700';
  
  const variantClasses = {
    text: 'rounded',
    rectangular: 'rounded-lg',
    circular: 'rounded-full',
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  if (variant === 'text' && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`h-4 ${baseClasses} ${variantClasses[variant]} ${
              index === lines - 1 ? 'w-3/4' : 'w-full'
            }`}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${
        variant === 'text' ? 'h-4' : ''
      } ${className}`}
      style={style}
    />
  );
};

// =============================================================================
// CARD COMPONENT
// =============================================================================

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'glass' | 'outline';
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  variant = 'default',
  hover = false,
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const variantClasses = {
    default: 'bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700',
    glass: 'bg-white/80 dark:bg-surface-800/80 backdrop-blur-sm border border-surface-200 dark:border-surface-700',
    outline: 'border border-surface-200 dark:border-surface-700',
  };

  const hoverClasses = hover ? 'transition-all duration-200 hover:shadow-lg hover:-translate-y-1' : '';

  return (
    <div
      className={`rounded-xl shadow-sm ${variantClasses[variant]} ${paddingClasses[padding]} ${hoverClasses} ${className}`}
    >
      {children}
    </div>
  );
};

// Export all components


export default {
  Notification,
  useNotifications,
  Modal,
  StatusBadge,
  LoadingSpinner,
  LoadingOverlay,
  Skeleton,
  Card,
}
export { Button } from './Button';
export { Select } from './Select';
export { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs';
export { Badge } from './Badge';
export { Tooltip } from './Tooltip';
export { CardHeader, CardTitle, CardContent } from './Card';;