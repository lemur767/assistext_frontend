import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((
    type: Notification['type'],
    title: string,
    message: string
  ) => {
    const notification: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      title,
      message,
      timestamp: new Date(),
    };

    setNotifications(prev => [notification, ...prev.slice(0, 9)]); // Keep last 10

    // Also show toast
    switch (type) {
      case 'success':
        toast.success(`${title}: ${message}`);
        break;
      case 'error':
        toast.error(`${title}: ${message}`);
        break;
      case 'warning':
        toast(`${title}: ${message}`, { icon: '⚠️' });
        break;
      default:
        toast(`${title}: ${message}`);
    }
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
  };
};