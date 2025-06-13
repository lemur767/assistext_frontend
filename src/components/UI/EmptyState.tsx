import React from 'react';
import type { BaseComponentProps } from '../../types';

interface EmptyStateProps extends BaseComponentProps {
  icon?: string | React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  };
  size?: 'sm' | 'md' | 'lg';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '📭',
  title,
  description,
  action,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16',
  };

  const iconSizes = {
    sm: 'text-4xl',
    md: 'text-6xl',
    lg: 'text-8xl',
  };

  const titleSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={`text-center ${sizeClasses[size]} ${className}`}>
      <div className={`${iconSizes[size]} mb-4`}>
        {typeof icon === 'string' ? icon : icon}
      </div>
      <h3 className={`${titleSizes[size]} font-semibold text-theme mb-2`}>
        {title}
      </h3>
      {description && (
        <p className="text-neutral-500 mb-6 max-w-md mx-auto">
          {description}
        </p>
      )}
      {action && (
        <button 
          className={`btn ${action.variant === 'secondary' ? 'btn-secondary' : 'btn-primary'}`}
          onClick={action.onClick}
        >
          {action.label}
        </button>
      )}
    </div>
  );
};
