import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { signalWireService, SMSMessage, SignalWirePhoneNumber, SignalWireStatus } from '../services/signalwireService';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

// ========== MAIN SIGNALWIRE HOOK ==========
export const useSignalWire = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get SignalWire status
  const {
    data: status,
    isLoading: statusLoading,
    error: statusError,
    refetch: refetchStatus
  } = useQuery({
    queryKey: ['signalwire-status'],
    queryFn: () => signalWireService.getSignalWireStatus(),
    enabled: !!user,
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 20000, // Consider data stale after 20 seconds
  });

  // Initialize SignalWire
  const initializeMutation = useMutation({
    mutationFn: () => signalWireService.initializeSignalWire(),
    onSuccess: (data) => {
      toast.success(`SignalWire initialized! ${data.phone_numbers.length} phone numbers configured.`);
      queryClient.invalidateQueries({ queryKey: ['signalwire-status'] });
      queryClient.invalidateQueries({ queryKey: ['signalwire-phone-numbers'] });
    },
    onError: (error) => {
      toast.error(`Failed to initialize SignalWire: ${error.message}`);
    },
  });

  // Test webhook connectivity
  const testWebhookMutation = useMutation({
    mutationFn: () => signalWireService.testWebhook(),
    onSuccess: (data) => {
      if (data.success) {
        toast.success(`Webhook test successful! Response time: ${data.response_time}ms`);
      } else {
        toast.error(`Webhook test failed: ${data.error}`);
      }
    },
    onError: (error) => {
      toast.error(`Webhook test failed: ${error.message}`);
    },
  });

  return {
    status,
    statusLoading,
    statusError,
    refetchStatus,
    initializeSignalWire: initializeMutation.mutate,
    isInitializing: initializeMutation.isPending,
    testWebhook: testWebhookMutation.mutate,
    isTestingWebhook: testWebhookMutation.isPending,
  };
};

// ========== SMS MESSAGING HOOKS ==========
export const useSMS = () => {
  const queryClient = useQueryClient();

  // Send SMS mutation
  const sendSMSMutation = useMutation({
    mutationFn: (message: Omit<SMSMessage, 'id' | 'status' | 'timestamp'>) => 
      signalWireService.sendSMS(message),
    onSuccess: (data) => {
      toast.success(`SMS sent successfully to ${data.to}`);
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['signalwire-analytics'] });
    },
    onError: (error) => {
      toast.error(`Failed to send SMS: ${error.message}`);
    },
  });

  // Send bulk SMS mutation
  const sendBulkSMSMutation = useMutation({
    mutationFn: (messages: Omit<SMSMessage, 'id' | 'status' | 'timestamp'>[]) => 
      signalWireService.sendBulkSMS(messages),
    onSuccess: (data) => {
      toast.success(`Bulk SMS sent: ${data.successful.length} successful, ${data.failed.length} failed`);
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['signalwire-analytics'] });
    },
    onError: (error) => {
      toast.error(`Failed to send bulk SMS: ${error.message}`);
    },
  });

  // Get message status
  const getMessageStatus = useCallback(async (messageSid: string) => {
    try {
      const status = await signalWireService.getMessageStatus(messageSid);
      return status;
    } catch (error) {
      toast.error(`Failed to get message status: ${error.message}`);
      throw error;
    }
  }, []);

  return {
    sendSMS: sendSMSMutation.mutate,
    sendSMSAsync: sendSMSMutation.mutateAsync,
    isSending: sendSMSMutation.isPending,
    sendBulkSMS: sendBulkSMSMutation.mutate,
    sendBulkSMSAsync: sendBulkSMSMutation.mutateAsync,
    isSendingBulk: sendBulkSMSMutation.isPending,
    getMessageStatus,
  };
};

// ========== PHONE NUMBER MANAGEMENT HOOKS ==========
export const useSignalWirePhoneNumbers = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get phone numbers
  const {
    data: phoneNumbers,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['signalwire-phone-numbers'],
    queryFn: () => signalWireService.getPhoneNumbers(),
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Configure webhook for phone number
  const configureWebhookMutation = useMutation({
    mutationFn: ({ phoneNumber, webhookUrl }: { phoneNumber: string; webhookUrl: string }) =>
      signalWireService.configurePhoneNumberWebhook(phoneNumber, webhookUrl),
    onSuccess: (_, variables) => {
      toast.success(`Webhook configured for ${variables.phoneNumber}`);
      queryClient.invalidateQueries({ queryKey: ['signalwire-phone-numbers'] });
    },
    onError: (error, variables) => {
      toast.error(`Failed to configure webhook for ${variables.phoneNumber}: ${error.message}`);
    },
  });

  // Purchase new phone number
  const purchasePhoneNumberMutation = useMutation({
    mutationFn: ({ areaCode, country }: { areaCode?: string; country?: string }) =>
      signalWireService.purchasePhoneNumber(areaCode, country),
    onSuccess: (data) => {
      toast.success(`Phone number ${data.phone_number} purchased successfully!`);
      queryClient.invalidateQueries({ queryKey: ['signalwire-phone-numbers'] });
    },
    onError: (error) => {
      toast.error(`Failed to purchase phone number: ${error.message}`);
    },
  });

  return {
    phoneNumbers,
    isLoading,
    error,
    refetch,
    configureWebhook: configureWebhookMutation.mutate,
    isConfiguringWebhook: configureWebhookMutation.isPending,
    purchasePhoneNumber: purchasePhoneNumberMutation.mutate,
    isPurchasing: purchasePhoneNumberMutation.isPending,
  };
};

// ========== ANALYTICS HOOKS ==========
export const useSignalWireAnalytics = (timeframe: '24h' | '7d' | '30d' | '90d' = '30d') => {
  const { user } = useAuth();

  const {
    data: analytics,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['signalwire-analytics', timeframe],
    queryFn: () => signalWireService.getMessageAnalytics(timeframe),
    enabled: !!user,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  return {
    analytics,
    isLoading,
    error,
    refetch,
  };
};

// ========== PROFILE SIGNALWIRE INTEGRATION HOOKS ==========
export const useProfileSignalWire = (profileId: string) => {
  const queryClient = useQueryClient();

  // Get profile SignalWire configuration
  const {
    data: config,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['profile-signalwire-config', profileId],
    queryFn: () => signalWireService.getProfileSignalWireConfig(profileId),
    enabled: !!profileId,
    staleTime: 60 * 1000, // 1 minute
  });

  // Sync profile with SignalWire
  const syncProfileMutation = useMutation({
    mutationFn: (phoneNumber: string) =>
      signalWireService.syncProfileWithSignalWire(profileId, phoneNumber),
    onSuccess: () => {
      toast.success('Profile synced with SignalWire successfully!');
      queryClient.invalidateQueries({ queryKey: ['profile-signalwire-config', profileId] });
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
    },
    onError: (error) => {
      toast.error(`Failed to sync profile: ${error.message}`);
    },
  });

  return {
    config,
    isLoading,
    error,
    refetch,
    syncProfile: syncProfileMutation.mutate,
    isSyncing: syncProfileMutation.isPending,
  };
};

// ========== WEBHOOK MANAGEMENT HOOKS ==========
export const useSignalWireWebhooks = () => {
  const queryClient = useQueryClient();

  // Get webhook configuration
  const {
    data: webhookConfig,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['signalwire-webhook-config'],
    queryFn: () => signalWireService.getWebhookConfig(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Update webhook configuration
  const updateWebhookMutation = useMutation({
    mutationFn: (config: { url?: string; method?: 'POST' | 'GET'; events?: string[]; is_active?: boolean }) =>
      signalWireService.updateWebhookConfig(config),
    onSuccess: () => {
      toast.success('Webhook configuration updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['signalwire-webhook-config'] });
    },
    onError: (error) => {
      toast.error(`Failed to update webhook configuration: ${error.message}`);
    },
  });

  return {
    webhookConfig,
    isLoading,
    error,
    refetch,
    updateWebhook: updateWebhookMutation.mutate,
    isUpdating: updateWebhookMutation.isPending,
  };
};

// ========== UTILITY HOOKS ==========
export const usePhoneNumberValidation = () => {
  const [validationResults, setValidationResults] = useState<Record<string, boolean>>({});

  const validatePhoneNumber = useCallback((phoneNumber: string): boolean => {
    const isValid = signalWireService.isValidPhoneNumber(phoneNumber);
    setValidationResults(prev => ({ ...prev, [phoneNumber]: isValid }));
    return isValid;
  }, []);

  const formatPhoneNumber = useCallback((phoneNumber: string): string => {
    return signalWireService.formatPhoneNumber(phoneNumber);
  }, []);

  const normalizePhoneNumber = useCallback((phoneNumber: string): string => {
    return signalWireService.normalizePhoneNumber(phoneNumber);
  }, []);

  return {
    validatePhoneNumber,
    formatPhoneNumber,
    normalizePhoneNumber,
    validationResults,
  };
};

// ========== REALTIME STATUS HOOK ==========
export const useSignalWireRealTimeStatus = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const { status } = useSignalWire();

  useEffect(() => {
    if (status) {
      setIsConnected(status.status === 'connected');
      setLastUpdate(new Date());
    }
  }, [status]);

  // Check connection status every minute
  useEffect(() => {
    const interval = setInterval(() => {
      // This could trigger a lightweight status check
      setLastUpdate(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return {
    isConnected,
    lastUpdate,
    connectionStatus: status?.status || 'unknown',
  };
};