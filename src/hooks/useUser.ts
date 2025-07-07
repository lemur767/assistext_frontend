import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { UserService } from '../services/userService';
import { QUERY_KEYS } from '../utils/constants';
import type { 
  User, 
  AISettings, 
  AutoReplySettings, 
  BusinessHoursSettings, 
  SecuritySettings, 
  SignalWireSettings,
  DashboardData,
  UseQueryOptions,
  UseMutationOptions 
} from '../types';

// =============================================================================
// USER PROFILE HOOKS
// =============================================================================

/**
 * Hook to get current user profile
 */
export const useUser = (options?: UseQueryOptions) => {
  return useQuery({
    queryKey: QUERY_KEYS.userProfile,
    queryFn: () => UserService.getProfile(true),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
};

/**
 * Hook to update user profile
 */
export const useUpdateUser = (options?: UseMutationOptions<User, Error, Partial<User>>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (updates: Partial<User>) => UserService.updateProfile(updates),
    onSuccess: (data) => {
      // Update the user profile cache
      queryClient.setQueryData(QUERY_KEYS.userProfile, data);
      
      // Invalidate dashboard data
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.userDashboard });
      
      options?.onSuccess?.(data, updates);
    },
    onError: options?.onError,
    onSettled: options?.onSettled,
  });
};

/**
 * Hook to get dashboard data
 */
export const useDashboard = (options?: UseQueryOptions) => {
  return useQuery({
    queryKey: QUERY_KEYS.userDashboard,
    queryFn: () => UserService.getDashboard(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    ...options,
  });
};

// =============================================================================
// AI SETTINGS HOOKS
// =============================================================================

/**
 * Hook to get AI settings
 */
export const useAISettings = (options?: UseQueryOptions) => {
  return useQuery({
    queryKey: QUERY_KEYS.aiSettings,
    queryFn: () => UserService.getAISettings(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

/**
 * Hook to update AI settings
 */
export const useUpdateAISettings = (
  options?: UseMutationOptions<{ message: string; ai_settings: AISettings }, Error, Partial<AISettings>>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (settings: Partial<AISettings>) => UserService.updateAISettings(settings),
    onSuccess: (data, variables) => {
      // Update AI settings cache
      queryClient.setQueryData(QUERY_KEYS.aiSettings, data.ai_settings);
      
      // Update user profile cache if AI settings are included
      queryClient.setQueryData(QUERY_KEYS.userProfile, (oldData: User | undefined) => {
        if (!oldData) return oldData;
        return { ...oldData, ...variables };
      });
      
      // Invalidate dashboard
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.userDashboard });
      
      options?.onSuccess?.(data, variables);
    },
    onError: options?.onError,
    onSettled: options?.onSettled,
  });
};

// =============================================================================
// AUTO REPLY SETTINGS HOOKS
// =============================================================================

/**
 * Hook to get auto reply settings
 */
export const useAutoReplySettings = (options?: UseQueryOptions) => {
  return useQuery({
    queryKey: QUERY_KEYS.autoReplySettings,
    queryFn: () => UserService.getAutoReplySettings(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

/**
 * Hook to update auto reply settings
 */
export const useUpdateAutoReplySettings = (
  options?: UseMutationOptions<{ message: string }, Error, Partial<AutoReplySettings>>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (settings: Partial<AutoReplySettings>) => UserService.updateAutoReplySettings(settings),
    onSuccess: (data, variables) => {
      // Update auto reply settings cache
      queryClient.setQueryData(QUERY_KEYS.autoReplySettings, (oldData: AutoReplySettings | undefined) => {
        if (!oldData) return variables as AutoReplySettings;
        return { ...oldData, ...variables };
      });
      
      // Update user profile cache
      queryClient.setQueryData(QUERY_KEYS.userProfile, (oldData: User | undefined) => {
        if (!oldData) return oldData;
        return { ...oldData, ...variables };
      });
      
      options?.onSuccess?.(data, variables);
    },
    onError: options?.onError,
    onSettled: options?.onSettled,
  });
};

// =============================================================================
// BUSINESS HOURS HOOKS
// =============================================================================

/**
 * Hook to get business hours settings
 */
export const useBusinessHours = (options?: UseQueryOptions) => {
  return useQuery({
    queryKey: QUERY_KEYS.businessHours,
    queryFn: () => UserService.getBusinessHours(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

/**
 * Hook to update business hours settings
 */
export const useUpdateBusinessHours = (
  options?: UseMutationOptions<{ message: string }, Error, Partial<BusinessHoursSettings>>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (settings: Partial<BusinessHoursSettings>) => UserService.updateBusinessHours(settings),
    onSuccess: (data, variables) => {
      // Update business hours cache
      queryClient.setQueryData(QUERY_KEYS.businessHours, (oldData: BusinessHoursSettings | undefined) => {
        if (!oldData) return variables as BusinessHoursSettings;
        return { ...oldData, ...variables };
      });
      
      // Update user profile cache
      queryClient.setQueryData(QUERY_KEYS.userProfile, (oldData: User | undefined) => {
        if (!oldData) return oldData;
        return { ...oldData, ...variables };
      });
      
      options?.onSuccess?.(data, variables);
    },
    onError: options?.onError,
    onSettled: options?.onSettled,
  });
};

// =============================================================================
// SECURITY SETTINGS HOOKS
// =============================================================================

/**
 * Hook to get security settings
 */
export const useSecuritySettings = (options?: UseQueryOptions) => {
  return useQuery({
    queryKey: QUERY_KEYS.securitySettings,
    queryFn: () => UserService.getSecuritySettings(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

/**
 * Hook to update security settings
 */
export const useUpdateSecuritySettings = (
  options?: UseMutationOptions<{ message: string }, Error, Partial<SecuritySettings>>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (settings: Partial<SecuritySettings>) => UserService.updateSecuritySettings(settings),
    onSuccess: (data, variables) => {
      // Update security settings cache
      queryClient.setQueryData(QUERY_KEYS.securitySettings, (oldData: SecuritySettings | undefined) => {
        if (!oldData) return variables as SecuritySettings;
        return { ...oldData, ...variables };
      });
      
      // Update user profile cache
      queryClient.setQueryData(QUERY_KEYS.userProfile, (oldData: User | undefined) => {
        if (!oldData) return oldData;
        return { ...oldData, ...variables };
      });
      
      options?.onSuccess?.(data, variables);
    },
    onError: options?.onError,
    onSettled: options?.onSettled,
  });
};

// =============================================================================
// SIGNALWIRE SETTINGS HOOKS
// =============================================================================

/**
 * Hook to get SignalWire settings
 */
export const useSignalWireSettings = (options?: UseQueryOptions) => {
  return useQuery({
    queryKey: QUERY_KEYS.signalwireSettings,
    queryFn: () => UserService.getSignalWireSettings(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

/**
 * Hook to update SignalWire settings
 */
export const useUpdateSignalWireSettings = (
  options?: UseMutationOptions<{ message: string }, Error, Partial<SignalWireSettings>>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (settings: Partial<SignalWireSettings>) => UserService.updateSignalWireSettings(settings),
    onSuccess: (data, variables) => {
      // Update SignalWire settings cache
      queryClient.setQueryData(QUERY_KEYS.signalwireSettings, (oldData: SignalWireSettings | undefined) => {
        if (!oldData) return variables as SignalWireSettings;
        return { ...oldData, ...variables };
      });
      
      // Update user profile cache
      queryClient.setQueryData(QUERY_KEYS.userProfile, (oldData: User | undefined) => {
        if (!oldData) return oldData;
        return { ...oldData, ...variables };
      });
      
      // Invalidate dashboard to update SignalWire status
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.userDashboard });
      
      options?.onSuccess?.(data, variables);
    },
    onError: options?.onError,
    onSettled: options?.onSettled,
  });
};

// =============================================================================
// ACCOUNT MANAGEMENT HOOKS
// =============================================================================

/**
 * Hook to change password
 */
export const useChangePassword = (
  options?: UseMutationOptions<{ message: string }, Error, {
    current_password: string;
    new_password: string;
    confirm_password: string;
  }>
) => {
  return useMutation({
    mutationFn: (data: {
      current_password: string;
      new_password: string;
      confirm_password: string;
    }) => UserService.changePassword(data),
    ...options,
  });
};

/**
 * Hook to deactivate account
 */
export const useDeactivateAccount = (
  options?: UseMutationOptions<{ message: string }, Error, void>
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => UserService.deactivateAccount(),
    onSuccess: (data) => {
      // Clear all cached data
      queryClient.clear();
      
      // Redirect to login or show confirmation
      options?.onSuccess?.(data, undefined);
    },
    onError: options?.onError,
    onSettled: options?.onSettled,
  });
};

// =============================================================================
// UTILITY HOOKS
// =============================================================================

/**
 * Hook to get user utilities and computed properties
 */
export const useUserUtils = () => {
  const { data: user } = useUser();
  
  return {
    user,
    isLoading: !user,
    hasCompletedSetup: user ? UserService.hasCompletedSetup(user) : false,
    displayName: user ? UserService.getDisplayName(user) : '',
    isInBusinessHours: user ? UserService.isInBusinessHours(user) : true,
    isOutOfOffice: user ? UserService.isOutOfOffice(user) : false,
    responseStyle: user ? UserService.getResponseStyle(user) : 'professional',
    isAIEnabled: user ? UserService.isAIEnabled(user) : false,
    flaggedWords: user ? UserService.getFlaggedWords(user) : [],
  };
};

/**
 * Hook to refresh all user-related data
 */
export const useRefreshUserData = () => {
  const queryClient = useQueryClient();
  
  return useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.userProfile }),
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.userDashboard }),
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.aiSettings }),
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.autoReplySettings }),
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.businessHours }),
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.securitySettings }),
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.signalwireSettings }),
    ]);
  }, [queryClient]);
};

/**
 * Hook to handle optimistic updates for user settings
 */
export const useOptimisticUserUpdate = () => {
  const queryClient = useQueryClient();
  
  return useCallback(<T extends Partial<User>>(updates: T) => {
    // Optimistically update user profile
    queryClient.setQueryData(QUERY_KEYS.userProfile, (oldData: User | undefined) => {
      if (!oldData) return oldData;
      return { ...oldData, ...updates };
    });
    
    // Return rollback function
    return () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.userProfile });
    };
  }, [queryClient]);
};

// =============================================================================
// COMBINED SETTINGS HOOK
// =============================================================================

/**
 * Hook to get all user settings in one place
 */
export const useUserSettings = () => {
  const userQuery = useUser();
  const aiQuery = useAISettings();
  const autoReplyQuery = useAutoReplySettings();
  const businessHoursQuery = useBusinessHours();
  const securityQuery = useSecuritySettings();
  const signalwireQuery = useSignalWireSettings();
  
  return {
    user: userQuery.data,
    aiSettings: aiQuery.data,
    autoReplySettings: autoReplyQuery.data,
    businessHours: businessHoursQuery.data,
    securitySettings: securityQuery.data,
    signalwireSettings: signalwireQuery.data,
    isLoading: [
      userQuery,
      aiQuery,
      autoReplyQuery,
      businessHoursQuery,
      securityQuery,
      signalwireQuery,
    ].some(query => query.isLoading),
    isError: [
      userQuery,
      aiQuery,
      autoReplyQuery,
      businessHoursQuery,
      securityQuery,
      signalwireQuery,
    ].some(query => query.isError),
    errors: {
      user: userQuery.error,
      ai: aiQuery.error,
      autoReply: autoReplyQuery.error,
      businessHours: businessHoursQuery.error,
      security: securityQuery.error,
      signalwire: signalwireQuery.error,
    },
  };
};