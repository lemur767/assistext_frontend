import { useState, useEffect, useCallback } from 'react';

type DarkModeValue = boolean;
type SetDarkModeValue = (value: boolean | ((prevValue: boolean) => boolean)) => void;

interface UseDarkModeReturn {
  isDarkMode: DarkModeValue;
  setDarkMode: SetDarkModeValue;
  toggleDarkMode: () => void;
}

const LOCAL_STORAGE_KEY = 'assistext-dark-mode';
const DARK_MODE_CLASS = 'dark';

/**
 * Hook for managing dark mode state
 * Automatically applies dark mode class to document element
 * Persists preference in localStorage
 * Respects system preference on first visit
 */
export const useDarkMode = (): UseDarkModeReturn => {
  // Initialize state from localStorage or system preference
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    // Check if we're in the browser
    if (typeof window === 'undefined') {
      return false;
    }

    // Check localStorage first
    const savedMode = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedMode !== null) {
      return JSON.parse(savedMode);
    }

    // Fall back to system preference
    if (window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    // Default to light mode
    return false;
  });

  // Apply dark mode class to document element
  const applyDarkMode = useCallback((darkMode: boolean) => {
    if (typeof document !== 'undefined') {
      if (darkMode) {
        document.documentElement.classList.add(DARK_MODE_CLASS);
      } else {
        document.documentElement.classList.remove(DARK_MODE_CLASS);
      }
    }
  }, []);

  // Set dark mode value with persistence
  const setDarkMode: SetDarkModeValue = useCallback((value) => {
    setIsDarkMode((prevValue) => {
      const newValue = typeof value === 'function' ? value(prevValue) : value;
      
      // Apply to DOM
      applyDarkMode(newValue);
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newValue));
      }
      
      return newValue;
    });
  }, [applyDarkMode]);

  // Toggle function
  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => !prev);
  }, [setDarkMode]);

  // Apply dark mode on initial load and when isDarkMode changes
  useEffect(() => {
    applyDarkMode(isDarkMode);
  }, [isDarkMode, applyDarkMode]);

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if user hasn't manually set a preference
      const savedMode = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedMode === null) {
        setDarkMode(e.matches);
      }
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    // Legacy browsers
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [setDarkMode]);

  return {
    isDarkMode,
    setDarkMode,
    toggleDarkMode,
  };
};

export default useDarkMode;