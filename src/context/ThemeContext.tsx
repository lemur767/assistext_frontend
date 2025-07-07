import React, { createContext, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (isDark: boolean) => void;
  systemPreference: boolean;
  isSystemMode: boolean;
  setSystemMode: (useSystem: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'assistext-theme-preference';
const SYSTEM_MODE_KEY = 'assistext-use-system-theme';

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: 'light' | 'dark' | 'system';
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  defaultTheme = 'system' 
}) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [systemPreference, setSystemPreference] = useState<boolean>(false);
  const [isSystemMode, setIsSystemMode] = useState<boolean>(true);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Get system preference
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemPreference(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemPreference(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  // Initialize theme from storage or default
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const savedUseSystem = localStorage.getItem(SYSTEM_MODE_KEY);
      const savedTheme = localStorage.getItem(STORAGE_KEY);

      if (savedUseSystem !== null) {
        const useSystem = JSON.parse(savedUseSystem);
        setIsSystemMode(useSystem);

        if (useSystem) {
          setIsDarkMode(systemPreference);
        } else if (savedTheme !== null) {
          setIsDarkMode(JSON.parse(savedTheme));
        }
      } else {
        // First visit - use default
        if (defaultTheme === 'system') {
          setIsSystemMode(true);
          setIsDarkMode(systemPreference);
        } else {
          setIsSystemMode(false);
          setIsDarkMode(defaultTheme === 'dark');
        }
      }
    } catch (error) {
      console.warn('Failed to load theme preference:', error);
      setIsDarkMode(systemPreference);
    } finally {
      setIsInitialized(true);
    }
  }, [systemPreference, defaultTheme]);

  // Update theme when system preference changes (if in system mode)
  useEffect(() => {
    if (isSystemMode && isInitialized) {
      setIsDarkMode(systemPreference);
    }
  }, [systemPreference, isSystemMode, isInitialized]);

  // Apply theme to DOM
  useEffect(() => {
    if (!isInitialized) return;

    const root = document.documentElement;
    
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Store preference
    try {
      localStorage.setItem(SYSTEM_MODE_KEY, JSON.stringify(isSystemMode));
      if (!isSystemMode) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(isDarkMode));
      }
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }
  }, [isDarkMode, isSystemMode, isInitialized]);

  const toggleDarkMode = () => {
    if (isSystemMode) {
      // If in system mode, switch to manual mode with opposite of current
      setIsSystemMode(false);
      setIsDarkMode(!isDarkMode);
    } else {
      // If in manual mode, just toggle
      setIsDarkMode(!isDarkMode);
    }
  };

  const setDarkMode = (isDark: boolean) => {
    setIsSystemMode(false);
    setIsDarkMode(isDark);
  };

  const setSystemMode = (useSystem: boolean) => {
    setIsSystemMode(useSystem);
    if (useSystem) {
      setIsDarkMode(systemPreference);
    }
  };

  // Prevent flash of incorrect theme
  if (!isInitialized) {
    return null;
  }

  const value: ThemeContextType = {
    isDarkMode,
    toggleDarkMode,
    setDarkMode,
    systemPreference,
    isSystemMode,
    setSystemMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeProvider;