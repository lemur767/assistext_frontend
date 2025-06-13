import { XIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  onRemove: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  duration = 5000,
  onRemove,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation
    const timer1 = setTimeout(() => setIsVisible(true), 10);
    
    // Auto remove
    const timer2 = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onRemove(id), 300);
    }, duration);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [id, duration, onRemove]);

  const typeClasses = {
    success: 'border-success bg-success/10 text-success-700 dark:text-success-300',
    error: 'border-error bg-error/10 text-error-700 dark:text-error-300',
    warning: 'border-warning bg-warning/10 text-warning-700 dark:text-warning-300',
    info: 'border-primary bg-primary/10 text-primary-700 dark:bg-primary-dark/20 dark:text-primary-300',
  };

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
  };

  return createPortal(
    <div
      className={`
        fixed top-4 right-4 z-50 max-w-sm w-full bg-card border-l-4 rounded-lg shadow-lg
        transform transition-all duration-300 ease-out
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${typeClasses[type]}
      `}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <span className="text-xl flex-shrink-0">{icons[type]}</span>
          <div className="flex-1 min-w-0">
            <div className="font-semibold">{title}</div>
            {message && (
              <div className="text-sm mt-1 opacity-90">{message}</div>
            )}
          </div>
          <button
            className="flex-shrink-0 ml-2 p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded"
            onClick={() => {
              setIsVisible(false);
              setTimeout(() => onRemove(id), 300);
            }}
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};