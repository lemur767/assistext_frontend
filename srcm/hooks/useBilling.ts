// src/hooks/useBilling.ts
/**
 * Custom React hook for billing and subscription management
 * Provides comprehensive billing data management with caching, error handling, and real-time updates
 */

import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { BillingService } from '../services/billingService';
import type { 
  Subscription,
  SubscriptionPlan,
  PaymentMethod,
  Invoice,
  Payment,
  Usage,
  BillingSettings,
  BillingAnalytics,
  CreateSubscriptionData,
  UpdateSubscriptionData,
  PaymentMethodData,
  ProcessPaymentData,
  PaginatedResponse
} from '../types/billing';

// Hook options interface
interface UseBillingOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
  enableRealTime?: boolean;
}

// Hook return type
interface UseBillingReturn {
  // Subscription Data
  subscription: Subscription | null;
  subscriptionPlans: SubscriptionPlan[];
  isSubscriptionLoading: boolean;
  subscriptionError: Error | null;
  
  // Payment Methods
  paymentMethods: PaymentMethod[];
  defaultPaymentMethod: PaymentMethod | null;
  isPaymentMethodsLoading: boolean;
  
  // Invoices & Payments
  invoices: Invoice[];
  payments: Payment[];
  invoicesLoading: boolean;
  paymentsLoading: boolean;
  
  // Usage & Limits
  currentUsage: Usage | null;
  usageLoading: boolean;
  usageHistory: any[];
  
  // Billing Settings
  billingSettings: BillingSettings | null;
  settingsLoading: boolean;
  
  // Analytics
  billingAnalytics: BillingAnalytics | null;
  analyticsLoading: boolean;
  
  // Credits
  creditBalance: number;
  creditHistory: any[];
  
  // Loading States
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  
  // Actions - Subscription Management
  createSubscription: (data: CreateSubscriptionData) => Promise<Subscription>;
  updateSubscription: (data: UpdateSubscriptionData) => Promise<Subscription>;
  cancelSubscription: (reason?: string, immediately?: boolean) => Promise<Subscription>;
  resumeSubscription: () => Promise<Subscription>;
  pauseSubscription: (pauseUntil?: string) => Promise<Subscription>;
  upgradeSubscription: (planId: string) => Promise<Subscription>;
  
  // Actions - Payment Methods
  addPaymentMethod: (data: PaymentMethodData) => Promise<PaymentMethod>;
  updatePaymentMethod: (methodId: string, data: Partial<PaymentMethodData>) => Promise<PaymentMethod>;
  deletePaymentMethod: (methodId: string) => Promise<void>;
  setDefaultPaymentMethod: (methodId: string) => Promise<PaymentMethod>;
  
  // Actions - Payments & Invoices
  processPayment: (data: ProcessPaymentData) => Promise<Payment>;
  payInvoice: (invoiceId: string, paymentMethodId?: string) => Promise<Payment>;
  downloadInvoice: (invoiceId: string) => Promise<void>;
  refundPayment: (paymentId: string, amount?: number, reason?: string) => Promise<Payment>;
  
  // Actions - Settings
  updateBillingSettings: (settings: Partial<BillingSettings>) => Promise<BillingSettings>;
  
  // Utility Actions
  refreshAllData: () => Promise<void>;
  validateCoupon: (code: string, planId?: string) => Promise<any>;
  getBillingPortal: (returnUrl?: string) => Promise<string>;
  exportBillingData: (type: string, format?: string) => Promise<void>;
  
  // Plan Comparison
  comparePlans: (planIds: string[]) => Promise<SubscriptionPlan[]>;
  getUpgradePreview: (newPlanId: string) => Promise<any>;
}

export const useBilling = (options: UseBillingOptions = {}): UseBillingReturn => {
  const {
    autoRefresh = false,
    refreshInterval = 60000, // 1 minute
    enableRealTime = false,
  } = options;

  const queryClient = useQueryClient();

  // Local state for loading coordination
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ============ QUERIES ============

  // Current subscription
  const {
    data: subscription,
    isLoading: isSubscriptionLoading,
    error: subscriptionError,
    refetch: refetchSubscription,
  } = useQuery({
    queryKey: ['billing', 'subscription'],
    queryFn: BillingService.getCurrentSubscription,
    refetchInterval: autoRefresh ? refreshInterval : false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  // Subscription plans
  const { data: subscriptionPlans = [] } = useQuery({
    queryKey: ['billing', 'plans'],
    queryFn: BillingService.getSubscriptionPlans,
    staleTime: 30 * 60 * 1000, // 30 minutes (plans don't change often)
  });

  // Payment methods
  const {
    data: paymentMethods = [],
    isLoading: isPaymentMethodsLoading,
    refetch: refetchPaymentMethods,
  } = useQuery({
    queryKey: ['billing', 'payment-methods'],
    queryFn: BillingService.getPaymentMethods,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Invoices
  const {
    data: invoicesResponse,
    isLoading: invoicesLoading,
    refetch: refetchInvoices,
  } = useQuery({
    queryKey: ['billing', 'invoices'],
    queryFn: () => BillingService.getInvoices(1, 50),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Payments
  const {
    data: paymentsResponse,
    isLoading: paymentsLoading,
    refetch: refetchPayments,
  } = useQuery({
    queryKey: ['billing', 'payments'],
    queryFn: () => BillingService.getPaymentHistory(1, 50),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Current usage
  const {
    data: currentUsage,
    isLoading: usageLoading,
    refetch: refetchUsage,
  } = useQuery({
    queryKey: ['billing', 'usage', 'current'],
    queryFn: BillingService.getCurrentUsage,
    refetchInterval: autoRefresh ? refreshInterval : false,
    staleTime: 2 * 60 * 1000, // 2 minutes (usage changes frequently)
  });

  // Usage history
  const { data: usageHistory = [] } = useQuery({
    queryKey: ['billing', 'usage', 'history'],
    queryFn: () => {
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      return BillingService.getUsageHistory(startDate, endDate, 'day');
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Billing settings
  const {
    data: billingSettings,
    isLoading: settingsLoading,
    refetch: refetchSettings,
  } = useQuery({
    queryKey: ['billing', 'settings'],
    queryFn: BillingService.getBillingSettings,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });

  // Billing analytics
  const {
    data: billingAnalytics,
    isLoading: analyticsLoading,
  } = useQuery({
    queryKey: ['billing', 'analytics'],
    queryFn: () => {
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      return BillingService.getBillingAnalytics(startDate, endDate);
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  // Credit balance
  const { data: creditBalanceData } = useQuery({
    queryKey: ['billing', 'credits', 'balance'],
    queryFn: BillingService.getCreditBalance,
    refetchInterval: autoRefresh ? refreshInterval : false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Credit history
  const { data: creditHistoryResponse } = useQuery({
    queryKey: ['billing', 'credits', 'history'],
    queryFn: () => BillingService.getCreditHistory(1, 20),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // ============ DERIVED DATA ============

  const invoices = invoicesResponse?.data || [];
  const payments = paymentsResponse?.data || [];
  const creditBalance = creditBalanceData?.balance || 0;
  const creditHistory = creditHistoryResponse?.data || [];
  
  const defaultPaymentMethod = paymentMethods.find(method => method.is_default) || null;
  
  const isLoading = isSubscriptionLoading || isPaymentMethodsLoading;
  const isError = !!subscriptionError;
  const error = subscriptionError as Error | null;

  // ============ MUTATIONS ============

  // Subscription mutations
  const createSubscriptionMutation = useMutation({
    mutationFn: BillingService.createSubscription,
    onSuccess: (newSubscription) => {
      queryClient.invalidateQueries({ queryKey: ['billing'] });
      toast.success('Subscription created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create subscription: ${error.message}`);
    },
  });

  const updateSubscriptionMutation = useMutation({
    mutationFn: ({ data }: { data: UpdateSubscriptionData }) =>
      BillingService.updateSubscription(subscription!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing'] });
      toast.success('Subscription updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update subscription: ${error.message}`);
    },
  });

  const cancelSubscriptionMutation = useMutation({
    mutationFn: ({ reason, immediately }: { reason?: string; immediately?: boolean }) =>
      BillingService.cancelSubscription(subscription!.id, reason, !immediately),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing'] });
      toast.success('Subscription canceled successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to cancel subscription: ${error.message}`);
    },
  });

  const resumeSubscriptionMutation = useMutation({
    mutationFn: () => BillingService.resumeSubscription(subscription!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing'] });
      toast.success('Subscription resumed successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to resume subscription: ${error.message}`);
    },
  });

  const pauseSubscriptionMutation = useMutation({
    mutationFn: ({ pauseUntil }: { pauseUntil?: string }) =>
      BillingService.pauseSubscription(subscription!.id, pauseUntil),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing'] });
      toast.success('Subscription paused successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to pause subscription: ${error.message}`);
    },
  });

  // Payment method mutations
  const addPaymentMethodMutation = useMutation({
    mutationFn: BillingService.addPaymentMethod,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing', 'payment-methods'] });
      toast.success('Payment method added successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to add payment method: ${error.message}`);
    },
  });

  const updatePaymentMethodMutation = useMutation({
    mutationFn: ({ methodId, data }: { methodId: string; data: Partial<PaymentMethodData> }) =>
      BillingService.updatePaymentMethod(methodId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing', 'payment-methods'] });
      toast.success('Payment method updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update payment method: ${error.message}`);
    },
  });

  const deletePaymentMethodMutation = useMutation({
    mutationFn: BillingService.deletePaymentMethod,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing', 'payment-methods'] });
      toast.success('Payment method deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete payment method: ${error.message}`);
    },
  });

  const setDefaultPaymentMethodMutation = useMutation({
    mutationFn: BillingService.setDefaultPaymentMethod,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing', 'payment-methods'] });
      toast.success('Default payment method updated');
    },
    onError: (error: Error) => {
      toast.error(`Failed to set default payment method: ${error.message}`);
    },
  });

  // Payment mutations
  const processPaymentMutation = useMutation({
    mutationFn: BillingService.processPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing'] });
      toast.success('Payment processed successfully');
    },
    onError: (error: Error) => {
      toast.error(`Payment failed: ${error.message}`);
    },
  });

  const payInvoiceMutation = useMutation({
    mutationFn: ({ invoiceId, paymentMethodId }: { invoiceId: string; paymentMethodId?: string }) =>
      BillingService.payInvoice(invoiceId, paymentMethodId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing'] });
      toast.success('Invoice paid successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to pay invoice: ${error.message}`);
    },
  });

  const refundPaymentMutation = useMutation({
    mutationFn: ({ paymentId, amount, reason }: { paymentId: string; amount?: number; reason?: string }) =>
      BillingService.refundPayment(paymentId, amount, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing'] });
      toast.success('Refund processed successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to process refund: ${error.message}`);
    },
  });

  // Settings mutations
  const updateBillingSettingsMutation = useMutation({
    mutationFn: BillingService.updateBillingSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing', 'settings'] });
      toast.success('Billing settings updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update settings: ${error.message}`);
    },
  });

  // ============ ACTION HANDLERS ============

  const createSubscription = useCallback(async (data: CreateSubscriptionData): Promise<Subscription> => {
    return createSubscriptionMutation.mutateAsync(data);
  }, [createSubscriptionMutation]);

  const updateSubscription = useCallback(async (data: UpdateSubscriptionData): Promise<Subscription> => {
    return updateSubscriptionMutation.mutateAsync({ data });
  }, [updateSubscriptionMutation]);

  const cancelSubscription = useCallback(async (reason?: string, immediately: boolean = false): Promise<Subscription> => {
    return cancelSubscriptionMutation.mutateAsync({ reason, immediately });
  }, [cancelSubscriptionMutation]);

  const resumeSubscription = useCallback(async (): Promise<Subscription> => {
    return resumeSubscriptionMutation.mutateAsync();
  }, [resumeSubscriptionMutation]);

  const pauseSubscription = useCallback(async (pauseUntil?: string): Promise<Subscription> => {
    return pauseSubscriptionMutation.mutateAsync({ pauseUntil });
  }, [pauseSubscriptionMutation]);

  const upgradeSubscription = useCallback(async (planId: string): Promise<Subscription> => {
    return updateSubscriptionMutation.mutateAsync({ data: { plan_id: planId } });
  }, [updateSubscriptionMutation]);

  const addPaymentMethod = useCallback(async (data: PaymentMethodData): Promise<PaymentMethod> => {
    return addPaymentMethodMutation.mutateAsync(data);
  }, [addPaymentMethodMutation]);

  const updatePaymentMethod = useCallback(async (
    methodId: string,
    data: Partial<PaymentMethodData>
  ): Promise<PaymentMethod> => {
    return updatePaymentMethodMutation.mutateAsync({ methodId, data });
  }, [updatePaymentMethodMutation]);

  const deletePaymentMethod = useCallback(async (methodId: string): Promise<void> => {
    return deletePaymentMethodMutation.mutateAsync(methodId);
  }, [deletePaymentMethodMutation]);

  const setDefaultPaymentMethod = useCallback(async (methodId: string): Promise<PaymentMethod> => {
    return setDefaultPaymentMethodMutation.mutateAsync(methodId);
  }, [setDefaultPaymentMethodMutation]);

  const processPayment = useCallback(async (data: ProcessPaymentData): Promise<Payment> => {
    return processPaymentMutation.mutateAsync(data);
  }, [processPaymentMutation]);

  const payInvoice = useCallback(async (invoiceId: string, paymentMethodId?: string): Promise<Payment> => {
    return payInvoiceMutation.mutateAsync({ invoiceId, paymentMethodId });
  }, [payInvoiceMutation]);

  const refundPayment = useCallback(async (
    paymentId: string,
    amount?: number,
    reason?: string
  ): Promise<Payment> => {
    return refundPaymentMutation.mutateAsync({ paymentId, amount, reason });
  }, [refundPaymentMutation]);

  const updateBillingSettings = useCallback(async (
    settings: Partial<BillingSettings>
  ): Promise<BillingSettings> => {
    return updateBillingSettingsMutation.mutateAsync(settings);
  }, [updateBillingSettingsMutation]);

  // Utility actions
  const refreshAllData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        refetchSubscription(),
        refetchPaymentMethods(),
        refetchInvoices(),
        refetchPayments(),
        refetchUsage(),
        refetchSettings(),
      ]);
    } finally {
      setIsRefreshing(false);
    }
  }, [refetchSubscription, refetchPaymentMethods, refetchInvoices, refetchPayments, refetchUsage, refetchSettings]);

  const downloadInvoice = useCallback(async (invoiceId: string) => {
    try {
      const blob = await BillingService.downloadInvoice(invoiceId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice_${invoiceId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Invoice downloaded successfully');
    } catch (error) {
      toast.error(`Failed to download invoice: ${error.message}`);
    }
  }, []);

  const validateCoupon = useCallback(async (code: string, planId?: string) => {
    try {
      return await BillingService.validateCoupon(code, planId);
    } catch (error) {
      toast.error(`Invalid coupon code: ${error.message}`);
      throw error;
    }
  }, []);

  const getBillingPortal = useCallback(async (returnUrl?: string): Promise<string> => {
    try {
      const response = await BillingService.getBillingPortalUrl(returnUrl);
      return response.url;
    } catch (error) {
      toast.error(`Failed to get billing portal: ${error.message}`);
      throw error;
    }
  }, []);

  const exportBillingData = useCallback(async (type: string, format: string = 'csv') => {
    try {
      const blob = await BillingService.exportBillingData(type as any, format as any);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `billing_${type}_export.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Export completed successfully');
    } catch (error) {
      toast.error(`Export failed: ${error.message}`);
    }
  }, []);

  const comparePlans = useCallback(async (planIds: string[]): Promise<SubscriptionPlan[]> => {
    return BillingService.comparePlans(planIds);
  }, []);

  const getUpgradePreview = useCallback(async (newPlanId: string) => {
    if (!subscription) throw new Error('No active subscription');
    return BillingService.getUpgradePreview(subscription.plan_id, newPlanId);
  }, [subscription]);

  // Real-time updates (WebSocket integration)
  useEffect(() => {
    if (!enableRealTime) return;

    // WebSocket connection and event handling would go here
    console.log('Real-time billing updates enabled');

    return () => {
      // Cleanup WebSocket connection
    };
  }, [enableRealTime]);

  return {
    // Data
    subscription: subscription || null,
    subscriptionPlans,
    isSubscriptionLoading,
    subscriptionError: subscriptionError as Error | null,
    
    // Payment Methods
    paymentMethods,
    defaultPaymentMethod,
    isPaymentMethodsLoading,
    
    // Invoices & Payments
    invoices,
    payments,
    invoicesLoading,
    paymentsLoading,
    
    // Usage & Limits
    currentUsage: currentUsage || null,
    usageLoading,
    usageHistory,
    
    // Settings
    billingSettings: billingSettings || null,
    settingsLoading,
    
    // Analytics
    billingAnalytics: billingAnalytics || null,
    analyticsLoading,
    
    // Credits
    creditBalance,
    creditHistory,
    
    // Loading States
    isLoading: isLoading || isRefreshing,
    isError,
    error,
    
    // Actions - Subscription Management
    createSubscription,
    updateSubscription,
    cancelSubscription,
    resumeSubscription,
    pauseSubscription,
    upgradeSubscription,
    
    // Actions - Payment Methods
    addPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
    setDefaultPaymentMethod,
    
    // Actions - Payments & Invoices
    processPayment,
    payInvoice,
    downloadInvoice,
    refundPayment,
    
    // Actions - Settings
    updateBillingSettings,
    
    // Utility Actions
    refreshAllData,
    validateCoupon,
    getBillingPortal,
    exportBillingData,
    
    // Plan Comparison
    comparePlans,
    getUpgradePreview,
  };
};

export default useBilling;