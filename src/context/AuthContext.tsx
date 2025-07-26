// src/context/AuthContext.tsx - Fixed with proper TypeScript types

import React, { createContext, useReducer, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import apiClient from '../services/apiClient';
import type { User, LoginCredentials, RegisterData, SearchNumbersRequest, PurchaseNumberRequest } from '../types/auth';


// Define the AuthState type
export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Define the AuthContext type
export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  searchNumbers: (criteria: SearchNumbersRequest) => Promise<any>;
  purchaseNumber: (request: PurchaseNumberRequest) => Promise<any>;
  logout: () => void;
  clearError: () => void;
  updateUser: (userData: Partial<User>) => void;
  refreshTokenFunc: () => Promise<void>;
}

// Define action types
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string; refreshToken: string } }
  | { type: 'AUTH_FAIL'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'REFRESH_TOKEN'; payload: { token: string; refreshToken: string } }
  | { type: 'SET_LOADING'; payload: boolean };

// Initial state
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('auth_token'),
  refreshToken: localStorage.getItem('refresh_token'),
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Reducer function
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      localStorage.setItem('auth_token', action.payload.token);
      localStorage.setItem('refresh_token', action.payload.refreshToken);
      // Update apiClient token
      apiClient.setToken(action.payload.token);
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'AUTH_FAIL':
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      // Remove token from apiClient
      apiClient.removeToken();
      return {
        ...state,
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      // Remove token from apiClient
      apiClient.removeToken();
      return {
        ...state,
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    case 'REFRESH_TOKEN':
      localStorage.setItem('auth_token', action.payload.token);
      localStorage.setItem('refresh_token', action.payload.refreshToken);
      // Update apiClient token
      apiClient.setToken(action.payload.token);
      return {
        ...state,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};

// JWT interface for token decoding
interface JWTPayload {
  exp: number;
  iat: number;
  sub: string;
  [key: string]: any;
}

// Create context
export const AuthContext = createContext<AuthContextType>({
  ...initialState,
  login: async () => {},
  register: async () => {},
  searchNumbers: async () => { return Promise.resolve(undefined); },
  purchaseNumber: async () => { return Promise.resolve(undefined); },
  logout: () => {},
  clearError: () => {},
  updateUser: () => {},
  refreshTokenFunc: async () => {},
});

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize apiClient with stored token
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      apiClient.setToken(storedToken);
    }
  }, []);

  // Load user data
  const loadUser = useCallback(async () => {
    try {
      const response = await apiClient.get<{ user: User }>('/api/auth/me');
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: response.user,
          token: state.token!,
          refreshToken: state.refreshToken!,
        },
      });
    } catch (err: any) {
      console.error('Failed to load user:', err);
      dispatch({ type: 'AUTH_FAIL', payload: 'Failed to load user data' });
    }
  }, [state.token, state.refreshToken]);

  // Auto-refresh token function
  const refreshTokenFunc = useCallback(async () => {
    if (!state.refreshToken) {
      dispatch({ type: 'LOGOUT' });
      return;
    }

    try {
      const response = await apiClient.post<{
        access_token: string;
        refresh_token?: string;
      }>('/api/auth/refresh', {
        refresh_token: state.refreshToken,
      });

      dispatch({
        type: 'REFRESH_TOKEN',
        payload: {
          token: response.access_token,
          refreshToken: response.refresh_token || state.refreshToken,
        },
      });
    } catch (err: any) {
      console.error('Token refresh failed:', err);
      dispatch({ type: 'LOGOUT' });
    }
  }, [state.refreshToken]);

  // Check token expiration and load user on mount
  useEffect(() => {
    const checkTokenExpiration = async () => {
      if (!state.token) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }

      try {
        // Decode token to check expiration
        const decoded = jwtDecode<JWTPayload>(state.token);
        const currentTime = Math.floor(Date.now() / 1000);

        // If token expires in less than 5 minutes, refresh it
        if (decoded.exp - currentTime < 300) {
          console.log('Token expiring soon, refreshing...');
          await refreshTokenFunc();
        }
        // If token is valid, load user data
        else {
          await loadUser();
        }
      } catch (err) {
        console.error('Token validation failed:', err);
        dispatch({ type: 'LOGOUT' });
      }
    };

    if (state.isLoading) {
      checkTokenExpiration();
    }
  }, [state.token, state.isLoading, refreshTokenFunc, loadUser]);

  // Set up periodic token refresh (every 14 minutes)
  useEffect(() => {
    if (!state.isAuthenticated || !state.token) return;

    const refreshInterval = setInterval(() => {
      refreshTokenFunc();
    }, 14 * 60 * 1000); // 14 minutes

    return () => clearInterval(refreshInterval);
  }, [state.isAuthenticated, state.token, refreshTokenFunc]);

  // Login user
  const login = useCallback(async (credentials: LoginCredentials) => {
    dispatch({ type: 'AUTH_START' });

    try {
      const response = await apiClient.post<{
        user: User;
        access_token: string;
        refresh_token: string;
      }>('/api/auth/login', credentials);

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: response.user,
          token: response.access_token,
          refreshToken: response.refresh_token,
        },
      });
    } catch (err: any) {
      const errorMessage = err.message || 'Authentication failed';
      dispatch({ type: 'AUTH_FAIL', payload: errorMessage });
      throw new Error(errorMessage);
    }
  }, []);

  // Register user
  const register = useCallback(async (data: RegisterData) => {
    dispatch({ type: 'AUTH_START' });

    try {
      // DEBUG: Log what AuthContext receives
      console.log('🔍 AuthContext received data:', JSON.stringify(data, null, 2));
      
      // Send data exactly as received - don't transform field names
      const response = await apiClient.post<{
        user: User;
        access_token: string;
        refresh_token: string;
      }>('/api/auth/register', data);  // Pass data as-is
      
      // DEBUG: Log response
      console.log('✅ AuthContext received response:', response);

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: response.user,
          token: response.access_token,
          refreshToken: response.refresh_token,
        },
      });
    } catch (err: any) {
      const errorMessage = err.message || 'Registration failed';
      dispatch({ type: 'AUTH_FAIL', payload: errorMessage });
      throw new Error(errorMessage);
    }
  }, []);

  // Logout user
  const logout = useCallback(() => {
    // Optional: Call logout endpoint to invalidate tokens on server
    if (state.token) {
      apiClient.post('/api/auth/logout').catch(() => {
        // Ignore logout endpoint errors
        console.log('Logout endpoint not available or failed');
      });
    }

    dispatch({ type: 'LOGOUT' });
  }, [state.token]);

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  // Update user data
  const updateUser = useCallback((userData: Partial<User>) => {
    if (!state.user) return;

    dispatch({
      type: 'UPDATE_USER',
      payload: { ...state.user, ...userData },
    });
  }, [state.user]);

   const searchNumbers = useCallback(async (criteria: SearchNumbersRequest) => {
    try {
      const response = await apiClient.post('/api/auth/search-numbers', criteria);
      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Number search failed';
      throw new Error(errorMessage);
    }
  }, []);

  // Add phone number purchase method
  const purchaseNumber = useCallback(async (request: PurchaseNumberRequest) => {
    try {
      const response = await apiClient.post('/api/auth/purchase-number', request);
      
      // Update user data with new phone number
      if (response.success && response.user) {
        dispatch({
          type: 'UPDATE_USER',
          payload: response.user,
        });
      }
      
      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Number purchase failed';
      throw new Error(errorMessage);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        isLoading: state.isLoading,
        error: state.error,
        login,
        register,
        searchNumbers,
        purchaseNumber,
        logout,
        clearError,
        updateUser,
        refreshTokenFunc,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for accessing auth context
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};