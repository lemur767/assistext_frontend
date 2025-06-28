// src/services/billingService.ts
/**
 * BillingService - Comprehensive billing and subscription management service
 * Handles all billing-related operations, subscription plans, payments, and usage tracking
 * 
 * Features:
 * - Subscription management (create, update, cancel, resume)
 * - Payment processing and history
 * - Invoice management
 * - Usage tracking and limits
 * - Plan management and upgrades
 * - Billing analytics and reporting
 * - Payment method management
 * - Credits and billing adjustments
 */

import apiClient from './apiClient';
import type { 
  Subscription,
  SubscriptionPlan,
  PaymentMethod,
  Invoice,
  Payment,
  Usage,
  BillingSettings,
  PlanFeatures,
  UsageMetrics,
  BillingHistory,
  CreditTransaction,
  ApiResponse,
  PaginatedResponse
} from '../types/billing';

// Request/Response Types
export interface CreateSubscriptionData {
  plan_id: string;
  payment_method_id?: string;
  coupon_code?: string;
  billing_cycle: 'monthly' | 'annual';
  auto_renew?: boolean;
}

export interface UpdateSubscriptionData {
  plan_id?: string;
  billing_cycle?: 'monthly' | 'annual';
  auto_renew?: boolean;
  pause_until?: string; // ISO date string
}

export interface PaymentMethodData {
  type: 'card' | 'bank' | 'paypal';
  token: string; // Payment processor token
  is_default?: boolean;
  billing_address?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
}

export interface ProcessPaymentData {
  amount: number;
  currency: string;
  payment_method_id?: string;
  description?: string;
  metadata?: Record<string, any>;
}

export interface BillingAdjustmentData {
  type: 'credit' | 'debit' | 'refund' | 'discount';
  amount: number;
  reason: string;
  description?: string;
  reference_id?: string;
}

export interface UsageOverrideData {
  metric: string;
  value: number;
  reason: string;
  expires_at?: string;
}

export class BillingService {
  private static readonly BASE_PATH = '/api/billing';

  // ============ SUBSCRIPTION MANAGEMENT ============

  /**
   * Get current user's subscription details
   */
  static async getCurrentSubscription(): Promise<Subscription> {
    try {
      const response = await apiClient.get<ApiResponse<Subscription>>(
        `${this.BASE_PATH}/subscription`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching current subscription:', error);
      throw new Error(`Failed to fetch subscription: ${error.message}`);
    }
  }

  /**
   * Get subscription by ID
   */
  static async getSubscription(subscriptionId: string): Promise<Subscription> {
    try {
      const response = await apiClient.get<ApiResponse<Subscription>>(
        `${this.BASE_PATH}/subscriptions/${subscriptionId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching subscription:', error);
      throw new Error(`Failed to fetch subscription: ${error.message}`);
    }
  }

  /**
   * Create new subscription
   */
  static async createSubscription(data: CreateSubscriptionData): Promise<Subscription> {
    try {
      const response = await apiClient.post<ApiResponse<Subscription>>(
        `${this.BASE_PATH}/subscriptions`,
        data
      );
      return response.data;
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw new Error(`Failed to create subscription: ${error.message}`);
    }
  }

  /**
   * Update existing subscription
   */
  static async updateSubscription(
    subscriptionId: string,
    data: UpdateSubscriptionData
  ): Promise<Subscription> {
    try {
      const response = await apiClient.put<ApiResponse<Subscription>>(
        `${this.BASE_PATH}/subscriptions/${subscriptionId}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw new Error(`Failed to update subscription: ${error.message}`);
    }
  }

  /**
   * Cancel subscription
   */
  static async cancelSubscription(
    subscriptionId: string,
    reason?: string,
    cancelAtPeriodEnd: boolean = true
  ): Promise<Subscription> {
    try {
      const response = await apiClient.post<ApiResponse<Subscription>>(
        `${this.BASE_PATH}/subscriptions/${subscriptionId}/cancel`,
        { reason, cancel_at_period_end: cancelAtPeriodEnd }
      );
      return response.data;
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw new Error(`Failed to cancel subscription: ${error.message}`);
    }
  }

  /**
   * Resume canceled subscription
   */
  static async resumeSubscription(subscriptionId: string): Promise<Subscription> {
    try {
      const response = await apiClient.post<ApiResponse<Subscription>>(
        `${this.BASE_PATH}/subscriptions/${subscriptionId}/resume`
      );
      return response.data;
    } catch (error) {
      console.error('Error resuming subscription:', error);
      throw new Error(`Failed to resume subscription: ${error.message}`);
    }
  }

  /**
   * Pause subscription
   */
  static async pauseSubscription(
    subscriptionId: string,
    pauseUntil?: string
  ): Promise<Subscription> {
    try {
      const response = await apiClient.post<ApiResponse<Subscription>>(
        `${this.BASE_PATH}/subscriptions/${subscriptionId}/pause`,
        { pause_until: pauseUntil }
      );
      return response.data;
    } catch (error) {
      console.error('Error pausing subscription:', error);
      throw new Error(`Failed to pause subscription: ${error.message}`);
    }
  }

  // ============ SUBSCRIPTION PLANS ============

  /**
   * Get all available subscription plans
   */
  static async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    try {
      const response = await apiClient.get<ApiResponse<SubscriptionPlan[]>>(
        `${this.BASE_PATH}/plans`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
      throw new Error(`Failed to fetch plans: ${error.message}`);
    }
  }

  /**
   * Get specific subscription plan
   */
  static async getSubscriptionPlan(planId: string): Promise<SubscriptionPlan> {
    try {
      const response = await apiClient.get<ApiResponse<SubscriptionPlan>>(
        `${this.BASE_PATH}/plans/${planId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching subscription plan:', error);
      throw new Error(`Failed to fetch plan: ${error.message}`);
    }
  }

  /**
   * Compare subscription plans
   */
  static async comparePlans(planIds: string[]): Promise<SubscriptionPlan[]> {
    try {
      const params = new URLSearchParams();
      planIds.forEach(id => params.append('plan_ids', id));

      const response = await apiClient.get<ApiResponse<SubscriptionPlan[]>>(
        `${this.BASE_PATH}/plans/compare?${params}`
      );
      return response.data;
    } catch (error) {
      console.error('Error comparing plans:', error);
      throw new Error(`Failed to compare plans: ${error.message}`);
    }
  }

  /**
   * Get upgrade/downgrade preview
   */
  static async getUpgradePreview(
    currentPlanId: string,
    newPlanId: string,
    billingCycle?: 'monthly' | 'annual'
  ): Promise<{
    proration_amount: number;
    effective_date: string;
    next_billing_date: string;
    plan_changes: any;
  }> {
    try {
      const response = await apiClient.post<ApiResponse<any>>(
        `${this.BASE_PATH}/plans/upgrade-preview`,
        {
          current_plan_id: currentPlanId,
          new_plan_id: newPlanId,
          billing_cycle: billingCycle
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error getting upgrade preview:', error);
      throw new Error(`Failed to get upgrade preview: ${error.message}`);
    }
  }

  // ============ PAYMENT METHODS ============

  /**
   * Get all payment methods for user
   */
  static async getPaymentMethods(): Promise<PaymentMethod[]> {
    try {
      const response = await apiClient.get<ApiResponse<PaymentMethod[]>>(
        `${this.BASE_PATH}/payment-methods`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      throw new Error(`Failed to fetch payment methods: ${error.message}`);
    }
  }

  /**
   * Add new payment method
   */
  static async addPaymentMethod(data: PaymentMethodData): Promise<PaymentMethod> {
    try {
      const response = await apiClient.post<ApiResponse<PaymentMethod>>(
        `${this.BASE_PATH}/payment-methods`,
        data
      );
      return response.data;
    } catch (error) {
      console.error('Error adding payment method:', error);
      throw new Error(`Failed to add payment method: ${error.message}`);
    }
  }

  /**
   * Update payment method
   */
  static async updatePaymentMethod(
    methodId: string,
    data: Partial<PaymentMethodData>
  ): Promise<PaymentMethod> {
    try {
      const response = await apiClient.put<ApiResponse<PaymentMethod>>(
        `${this.BASE_PATH}/payment-methods/${methodId}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error('Error updating payment method:', error);
      throw new Error(`Failed to update payment method: ${error.message}`);
    }
  }

  /**
   * Delete payment method
   */
  static async deletePaymentMethod(methodId: string): Promise<void> {
    try {
      await apiClient.delete(`${this.BASE_PATH}/payment-methods/${methodId}`);
    } catch (error) {
      console.error('Error deleting payment method:', error);
      throw new Error(`Failed to delete payment method: ${error.message}`);
    }
  }

  /**
   * Set default payment method
   */
  static async setDefaultPaymentMethod(methodId: string): Promise<PaymentMethod> {
    try {
      const response = await apiClient.post<ApiResponse<PaymentMethod>>(
        `${this.BASE_PATH}/payment-methods/${methodId}/set-default`
      );
      return response.data;
    } catch (error) {
      console.error('Error setting default payment method:', error);
      throw new Error(`Failed to set default payment method: ${error.message}`);
    }
  }

  // ============ PAYMENTS & TRANSACTIONS ============

  /**
   * Process a payment
   */
  static async processPayment(data: ProcessPaymentData): Promise<Payment> {
    try {
      const response = await apiClient.post<ApiResponse<Payment>>(
        `${this.BASE_PATH}/payments`,
        data
      );
      return response.data;
    } catch (error) {
      console.error('Error processing payment:', error);
      throw new Error(`Failed to process payment: ${error.message}`);
    }
  }

  /**
   * Get payment history
   */
  static async getPaymentHistory(
    page: number = 1,
    per_page: number = 20,
    status?: string,
    dateFrom?: string,
    dateTo?: string
  ): Promise<PaginatedResponse<Payment>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: per_page.toString(),
        ...(status && { status }),
        ...(dateFrom && { date_from: dateFrom }),
        ...(dateTo && { date_to: dateTo }),
      });

      const response = await apiClient.get<PaginatedResponse<Payment>>(
        `${this.BASE_PATH}/payments?${params}`
      );
      return response;
    } catch (error) {
      console.error('Error fetching payment history:', error);
      throw new Error(`Failed to fetch payment history: ${error.message}`);
    }
  }

  /**
   * Get specific payment details
   */
  static async getPayment(paymentId: string): Promise<Payment> {
    try {
      const response = await apiClient.get<ApiResponse<Payment>>(
        `${this.BASE_PATH}/payments/${paymentId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching payment:', error);
      throw new Error(`Failed to fetch payment: ${error.message}`);
    }
  }

  /**
   * Refund a payment
   */
  static async refundPayment(
    paymentId: string,
    amount?: number,
    reason?: string
  ): Promise<Payment> {
    try {
      const response = await apiClient.post<ApiResponse<Payment>>(
        `${this.BASE_PATH}/payments/${paymentId}/refund`,
        { amount, reason }
      );
      return response.data;
    } catch (error) {
      console.error('Error processing refund:', error);
      throw new Error(`Failed to process refund: ${error.message}`);
    }
  }

  // ============ INVOICES ============

  /**
   * Get invoice history
   */
  static async getInvoices(
    page: number = 1,
    per_page: number = 20,
    status?: string
  ): Promise<PaginatedResponse<Invoice>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: per_page.toString(),
        ...(status && { status }),
      });

      const response = await apiClient.get<PaginatedResponse<Invoice>>(
        `${this.BASE_PATH}/invoices?${params}`
      );
      return response;
    } catch (error) {
      console.error('Error fetching invoices:', error);
      throw new Error(`Failed to fetch invoices: ${error.message}`);
    }
  }

  /**
   * Get specific invoice
   */
  static async getInvoice(invoiceId: string): Promise<Invoice> {
    try {
      const response = await apiClient.get<ApiResponse<Invoice>>(
        `${this.BASE_PATH}/invoices/${invoiceId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching invoice:', error);
      throw new Error(`Failed to fetch invoice: ${error.message}`);
    }
  }

  /**
   * Download invoice PDF
   */
  static async downloadInvoice(invoiceId: string): Promise<Blob> {
    try {
      const response = await fetch(
        `${apiClient['baseURL']}${this.BASE_PATH}/invoices/${invoiceId}/download`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Download failed: ${response.statusText}`);
      }

      return await response.blob();
    } catch (error) {
      console.error('Error downloading invoice:', error);
      throw new Error(`Failed to download invoice: ${error.message}`);
    }
  }

  /**
   * Pay outstanding invoice
   */
  static async payInvoice(
    invoiceId: string,
    paymentMethodId?: string
  ): Promise<Payment> {
    try {
      const response = await apiClient.post<ApiResponse<Payment>>(
        `${this.BASE_PATH}/invoices/${invoiceId}/pay`,
        { payment_method_id: paymentMethodId }
      );
      return response.data;
    } catch (error) {
      console.error('Error paying invoice:', error);
      throw new Error(`Failed to pay invoice: ${error.message}`);
    }
  }

  // ============ USAGE & LIMITS ============

  /**
   * Get current usage metrics
   */
  static async getCurrentUsage(): Promise<Usage> {
    try {
      const response = await apiClient.get<ApiResponse<Usage>>(
        `${this.BASE_PATH}/usage/current`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching current usage:', error);
      throw new Error(`Failed to fetch usage: ${error.message}`);
    }
  }

  /**
   * Get usage history
   */
  static async getUsageHistory(
    startDate: string,
    endDate: string,
    granularity: 'day' | 'week' | 'month' = 'day'
  ): Promise<UsageMetrics[]> {
    try {
      const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
        granularity,
      });

      const response = await apiClient.get<ApiResponse<UsageMetrics[]>>(
        `${this.BASE_PATH}/usage/history?${params}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching usage history:', error);
      throw new Error(`Failed to fetch usage history: ${error.message}`);
    }
  }

  /**
   * Get plan limits and features
   */
  static async getPlanLimits(): Promise<PlanFeatures> {
    try {
      const response = await apiClient.get<ApiResponse<PlanFeatures>>(
        `${this.BASE_PATH}/limits`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching plan limits:', error);
      throw new Error(`Failed to fetch plan limits: ${error.message}`);
    }
  }

  /**
   * Check if usage limit exceeded
   */
  static async checkUsageLimit(metric: string): Promise<{
    is_exceeded: boolean;
    current_usage: number;
    limit: number;
    percentage_used: number;
  }> {
    try {
      const response = await apiClient.get<ApiResponse<any>>(
        `${this.BASE_PATH}/usage/check/${metric}`
      );
      return response.data;
    } catch (error) {
      console.error('Error checking usage limit:', error);
      throw new Error(`Failed to check usage limit: ${error.message}`);
    }
  }

  /**
   * Override usage limit temporarily
   */
  static async overrideUsageLimit(data: UsageOverrideData): Promise<void> {
    try {
      await apiClient.post(`${this.BASE_PATH}/usage/override`, data);
    } catch (error) {
      console.error('Error overriding usage limit:', error);
      throw new Error(`Failed to override usage limit: ${error.message}`);
    }
  }

  // ============ CREDITS & ADJUSTMENTS ============

  /**
   * Get credit balance
   */
  static async getCreditBalance(): Promise<{
    balance: number;
    currency: string;
    expires_at?: string;
  }> {
    try {
      const response = await apiClient.get<ApiResponse<any>>(
        `${this.BASE_PATH}/credits/balance`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching credit balance:', error);
      throw new Error(`Failed to fetch credit balance: ${error.message}`);
    }
  }

  /**
   * Get credit transaction history
   */
  static async getCreditHistory(
    page: number = 1,
    per_page: number = 20
  ): Promise<PaginatedResponse<CreditTransaction>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: per_page.toString(),
      });

      const response = await apiClient.get<PaginatedResponse<CreditTransaction>>(
        `${this.BASE_PATH}/credits/history?${params}`
      );
      return response;
    } catch (error) {
      console.error('Error fetching credit history:', error);
      throw new Error(`Failed to fetch credit history: ${error.message}`);
    }
  }

  /**
   * Apply billing adjustment
   */
  static async applyBillingAdjustment(data: BillingAdjustmentData): Promise<CreditTransaction> {
    try {
      const response = await apiClient.post<ApiResponse<CreditTransaction>>(
        `${this.BASE_PATH}/adjustments`,
        data
      );
      return response.data;
    } catch (error) {
      console.error('Error applying billing adjustment:', error);
      throw new Error(`Failed to apply adjustment: ${error.message}`);
    }
  }

  // ============ BILLING SETTINGS ============

  /**
   * Get billing settings
   */
  static async getBillingSettings(): Promise<BillingSettings> {
    try {
      const response = await apiClient.get<ApiResponse<BillingSettings>>(
        `${this.BASE_PATH}/settings`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching billing settings:', error);
      throw new Error(`Failed to fetch billing settings: ${error.message}`);
    }
  }

  /**
   * Update billing settings
   */
  static async updateBillingSettings(
    settings: Partial<BillingSettings>
  ): Promise<BillingSettings> {
    try {
      const response = await apiClient.put<ApiResponse<BillingSettings>>(
        `${this.BASE_PATH}/settings`,
        settings
      );
      return response.data;
    } catch (error) {
      console.error('Error updating billing settings:', error);
      throw new Error(`Failed to update billing settings: ${error.message}`);
    }
  }

  // ============ ANALYTICS & REPORTING ============

  /**
   * Get billing analytics
   */
  static async getBillingAnalytics(
    startDate: string,
    endDate: string
  ): Promise<{
    total_revenue: number;
    subscription_revenue: number;
    usage_revenue: number;
    refunds: number;
    new_subscriptions: number;
    churn_rate: number;
    mrr: number; // Monthly Recurring Revenue
    arr: number; // Annual Recurring Revenue
  }> {
    try {
      const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
      });

      const response = await apiClient.get<ApiResponse<any>>(
        `${this.BASE_PATH}/analytics?${params}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching billing analytics:', error);
      throw new Error(`Failed to fetch billing analytics: ${error.message}`);
    }
  }

  /**
   * Get subscription analytics
   */
  static async getSubscriptionAnalytics(): Promise<{
    active_subscriptions: number;
    trial_subscriptions: number;
    canceled_subscriptions: number;
    paused_subscriptions: number;
    plan_distribution: Array<{ plan_name: string; count: number; percentage: number }>;
    churn_analysis: any;
  }> {
    try {
      const response = await apiClient.get<ApiResponse<any>>(
        `${this.BASE_PATH}/analytics/subscriptions`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching subscription analytics:', error);
      throw new Error(`Failed to fetch subscription analytics: ${error.message}`);
    }
  }

  // ============ UTILITY METHODS ============

  /**
   * Validate coupon code
   */
  static async validateCoupon(
    couponCode: string,
    planId?: string
  ): Promise<{
    valid: boolean;
    discount_amount?: number;
    discount_percentage?: number;
    expires_at?: string;
    restrictions?: any;
  }> {
    try {
      const response = await apiClient.post<ApiResponse<any>>(
        `${this.BASE_PATH}/coupons/validate`,
        { coupon_code: couponCode, plan_id: planId }
      );
      return response.data;
    } catch (error) {
      console.error('Error validating coupon:', error);
      throw new Error(`Failed to validate coupon: ${error.message}`);
    }
  }

  /**
   * Calculate tax for billing address
   */
  static async calculateTax(
    amount: number,
    billingAddress: any
  ): Promise<{
    tax_amount: number;
    tax_rate: number;
    tax_name: string;
  }> {
    try {
      const response = await apiClient.post<ApiResponse<any>>(
        `${this.BASE_PATH}/tax/calculate`,
        { amount, billing_address: billingAddress }
      );
      return response.data;
    } catch (error) {
      console.error('Error calculating tax:', error);
      throw new Error(`Failed to calculate tax: ${error.message}`);
    }
  }

  /**
   * Get billing portal URL
   */
  static async getBillingPortalUrl(
    returnUrl?: string
  ): Promise<{ url: string; expires_at: string }> {
    try {
      const response = await apiClient.post<ApiResponse<any>>(
        `${this.BASE_PATH}/portal`,
        { return_url: returnUrl }
      );
      return response.data;
    } catch (error) {
      console.error('Error getting billing portal URL:', error);
      throw new Error(`Failed to get billing portal URL: ${error.message}`);
    }
  }

  /**
   * Export billing data
   */
  static async exportBillingData(
    type: 'invoices' | 'payments' | 'usage' | 'subscriptions',
    format: 'csv' | 'xlsx' | 'pdf' = 'csv',
    startDate?: string,
    endDate?: string
  ): Promise<Blob> {
    try {
      const params = new URLSearchParams({
        type,
        format,
        ...(startDate && { start_date: startDate }),
        ...(endDate && { end_date: endDate }),
      });

      const response = await fetch(
        `${apiClient['baseURL']}${this.BASE_PATH}/export?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Export failed: ${response.statusText}`);
      }

      return await response.blob();
    } catch (error) {
      console.error('Error exporting billing data:', error);
      throw new Error(`Failed to export billing data: ${error.message}`);
    }
  }
}

// Export individual methods for tree-shaking
export const {
  getCurrentSubscription,
  getSubscription,
  createSubscription,
  updateSubscription,
  cancelSubscription,
  resumeSubscription,
  pauseSubscription,
  getSubscriptionPlans,
  getSubscriptionPlan,
  comparePlans,
  getUpgradePreview,
  getPaymentMethods,
  addPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
  setDefaultPaymentMethod,
  processPayment,
  getPaymentHistory,
  getPayment,
  refundPayment,
  getInvoices,
  getInvoice,
  downloadInvoice,
  payInvoice,
  getCurrentUsage,
  getUsageHistory,
  getPlanLimits,
  checkUsageLimit,
  overrideUsageLimit,
  getCreditBalance,
  getCreditHistory,
  applyBillingAdjustment,
  getBillingSettings,
  updateBillingSettings,
  getBillingAnalytics,
  getSubscriptionAnalytics,
  validateCoupon,
  calculateTax,
  getBillingPortalUrl,
  exportBillingData,
} = BillingService;

// Default export
export default BillingService;