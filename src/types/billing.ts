// src/types/billing.ts
/**
 * Type definitions for billing and subscription management system
 */

// ============ CORE BILLING ENTITIES ============

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'paused' | 'trialing' | 'incomplete';
  billing_cycle: 'monthly' | 'annual';
  auto_renew: boolean;
  
  // Dates
  created_at: string;
  updated_at: string;
  current_period_start: string;
  current_period_end: string;
  trial_end?: string;
  canceled_at?: string;
  pause_until?: string;
  
  // Financial
  amount: number;
  currency: string;
  discount_amount?: number;
  tax_amount?: number;
  
  // Relationships
  plan: SubscriptionPlan;
  payment_method?: PaymentMethod;
  latest_invoice?: Invoice;
  
  // Metadata
  metadata?: Record<string, any>;
  cancellation_reason?: string;
  pause_reason?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'archived';
  
  // Pricing
  monthly_price: number;
  annual_price: number;
  currency: string;
  setup_fee?: number;
  
  // Trial
  trial_period_days?: number;
  
  // Features and Limits
  features: PlanFeatures;
  
  // Marketing
  popular?: boolean;
  recommended?: boolean;
  category?: string;
  
  // Metadata
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
}

export interface PlanFeatures {
  // SMS Features
  sms_credits_monthly: number;
  sms_credits_annual?: number;
  ai_responses_monthly: number;
  ai_responses_annual?: number;
  
  // Profile Limits
  max_profiles: number;
  max_phone_numbers: number;
  
  // Storage & Data
  storage_gb: number;
  message_history_months: number;
  
  // Advanced Features
  advanced_analytics: boolean;
  priority_support: boolean;
  api_access: boolean;
  webhooks: boolean;
  custom_branding: boolean;
  team_collaboration: boolean;
  
  // AI Features
  custom_ai_prompts: boolean;
  ai_personality_customization: boolean;
  advanced_ai_models: boolean;
  
  // Integration Features
  third_party_integrations: boolean;
  crm_integration: boolean;
  calendar_integration: boolean;
  
  // Limits
  rate_limit_per_minute?: number;
  concurrent_conversations?: number;
  
  // Add-ons Available
  available_addons: string[];
}

export interface PaymentMethod {
  id: string;
  user_id: string;
  type: 'card' | 'bank' | 'paypal' | 'apple_pay' | 'google_pay';
  is_default: boolean;
  
  // Card Details (for display only - no sensitive data)
  card_brand?: string;
  card_last4?: string;
  card_exp_month?: number;
  card_exp_year?: number;
  
  // Bank Details (for display only)
  bank_name?: string;
  bank_last4?: string;
  
  // Billing Address
  billing_address?: BillingAddress;
  
  // Status
  status: 'active' | 'expired' | 'invalid';
  
  // Metadata
  created_at: string;
  updated_at: string;
  last_used_at?: string;
  metadata?: Record<string, any>;
}

export interface BillingAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface Invoice {
  id: string;
  user_id: string;
  subscription_id?: string;
  
  // Invoice Details
  invoice_number: string;
  status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible';
  
  // Amounts
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  
  // Dates
  created_at: string;
  updated_at: string;
  due_date: string;
  paid_at?: string;
  
  // Line Items
  line_items: InvoiceLineItem[];
  
  // Payment
  payment_method?: PaymentMethod;
  
  // Files
  pdf_url?: string;
  
  // Metadata
  description?: string;
  metadata?: Record<string, any>;
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unit_amount: number;
  total_amount: number;
  period_start?: string;
  period_end?: string;
  proration?: boolean;
  metadata?: Record<string, any>;
}

export interface Payment {
  id: string;
  user_id: string;
  invoice_id?: string;
  
  // Payment Details
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed' | 'canceled' | 'refunded' | 'partially_refunded';
  
  // Payment Method
  payment_method_id: string;
  payment_method: PaymentMethod;
  
  // Transaction Details
  transaction_id?: string;
  processor_response?: any;
  
  // Refund Information
  refunded_amount?: number;
  refund_reason?: string;
  
  // Dates
  created_at: string;
  updated_at: string;
  processed_at?: string;
  
  // Metadata
  description?: string;
  metadata?: Record<string, any>;
  failure_reason?: string;
}

// ============ USAGE & ANALYTICS ============

export interface Usage {
  user_id: string;
  subscription_id: string;
  period_start: string;
  period_end: string;
  
  // SMS Usage
  sms_sent: number;
  sms_received: number;
  sms_credits_used: number;
  sms_credits_remaining: number;
  
  // AI Usage
  ai_responses_generated: number;
  ai_credits_used: number;
  ai_credits_remaining: number;
  
  // Profile Usage
  active_profiles: number;
  total_conversations: number;
  
  // Storage Usage
  storage_used_gb: number;
  storage_limit_gb: number;
  
  // API Usage
  api_calls_made: number;
  api_calls_limit: number;
  
  // Advanced Features Usage
  webhook_calls: number;
  integration_syncs: number;
  
  // Overage Information
  overages: UsageOverage[];
  
  // Last Updated
  last_updated: string;
}

export interface UsageOverage {
  metric: string;
  overage_amount: number;
  overage_cost: number;
  rate_per_unit: number;
}

export interface UsageMetrics {
  date: string;
  sms_sent: number;
  sms_received: number;
  ai_responses: number;
  api_calls: number;
  active_conversations: number;
  new_clients: number;
  storage_used_gb: number;
}

export interface CreditTransaction {
  id: string;
  user_id: string;
  type: 'credit' | 'debit' | 'refund' | 'bonus' | 'adjustment' | 'expiration';
  
  // Amount
  amount: number;
  currency: string;
  balance_after: number;
  
  // Details
  description: string;
  reference_id?: string;
  reference_type?: 'payment' | 'refund' | 'adjustment' | 'bonus';
  
  // Expiration
  expires_at?: string;
  
  // Dates
  created_at: string;
  processed_at?: string;
  
  // Metadata
  metadata?: Record<string, any>;
}

// ============ SETTINGS & CONFIGURATION ============

export interface BillingSettings {
  user_id: string;
  
  // Billing Preferences
  auto_pay: boolean;
  billing_email: string;
  billing_address: BillingAddress;
  
  // Invoice Settings
  invoice_delivery: 'email' | 'postal' | 'both';
  invoice_format: 'pdf' | 'html';
  
  // Notification Preferences
  notifications: {
    payment_succeeded: boolean;
    payment_failed: boolean;
    invoice_created: boolean;
    subscription_renewed: boolean;
    subscription_canceled: boolean;
    usage_alerts: boolean;
    overage_alerts: boolean;
  };
  
  // Usage Alerts
  usage_alert_thresholds: {
    sms_credits: number; // Percentage (e.g., 80 for 80%)
    ai_credits: number;
    storage: number;
    api_calls: number;
  };
  
  // Tax Information
  tax_id?: string;
  tax_exempt: boolean;
  
  // Currency & Locale
  currency: string;
  locale: string;
  timezone: string;
  
  // Metadata
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
}

// ============ ANALYTICS & REPORTING ============

export interface BillingAnalytics {
  period_start: string;
  period_end: string;
  
  // Revenue Metrics
  total_revenue: number;
  subscription_revenue: number;
  usage_revenue: number;
  one_time_revenue: number;
  
  // Refunds & Adjustments
  total_refunds: number;
  total_adjustments: number;
  net_revenue: number;
  
  // Growth Metrics
  new_subscriptions: number;
  canceled_subscriptions: number;
  upgraded_subscriptions: number;
  downgraded_subscriptions: number;
  
  // Recurring Revenue
  mrr: number; // Monthly Recurring Revenue
  arr: number; // Annual Recurring Revenue
  mrr_growth_rate: number;
  
  // Customer Metrics
  churn_rate: number;
  retention_rate: number;
  customer_lifetime_value: number;
  average_revenue_per_user: number;
  
  // Payment Metrics
  payment_success_rate: number;
  failed_payments: number;
  dunning_success_rate: number;
  
  // Usage Metrics
  average_usage_per_customer: Record<string, number>;
  overage_revenue: number;
  
  // Plan Distribution
  plan_distribution: Array<{
    plan_id: string;
    plan_name: string;
    subscriber_count: number;
    revenue: number;
    percentage: number;
  }>;
}

export interface SubscriptionAnalytics {
  // Subscription Counts
  total_subscriptions: number;
  active_subscriptions: number;
  trial_subscriptions: number;
  canceled_subscriptions: number;
  paused_subscriptions: number;
  past_due_subscriptions: number;
  
  // Plan Metrics
  plan_distribution: Array<{
    plan_id: string;
    plan_name: string;
    count: number;
    percentage: number;
    revenue: number;
  }>;
  
  // Churn Analysis
  churn_analysis: {
    monthly_churn_rate: number;
    annual_churn_rate: number;
    churn_by_plan: Array<{
      plan_id: string;
      plan_name: string;
      churn_rate: number;
    }>;
    top_cancellation_reasons: Array<{
      reason: string;
      count: number;
      percentage: number;
    }>;
  };
  
  // Cohort Analysis
  cohort_analysis?: Array<{
    cohort_month: string;
    subscriber_count: number;
    retention_rates: number[]; // Month 0, 1, 2, etc.
  }>;
}

// ============ WEBHOOKS & EVENTS ============

export interface BillingWebhookEvent {
  id: string;
  type: 'subscription.created' | 'subscription.updated' | 'subscription.canceled' |
        'payment.succeeded' | 'payment.failed' | 'invoice.created' | 'invoice.paid' |
        'usage.threshold_exceeded' | 'credit.added' | 'plan.changed';
  
  data: {
    object: Subscription | Payment | Invoice | Usage | any;
    previous_attributes?: Record<string, any>;
  };
  
  created_at: string;
  livemode: boolean;
  request_id?: string;
}

// ============ ERROR TYPES ============

export interface BillingError {
  code: string;
  message: string;
  type: 'card_error' | 'invalid_request_error' | 'api_error' | 'authentication_error' | 'rate_limit_error';
  param?: string;
  decline_code?: string;
  charge_id?: string;
}

// ============ FORM DATA TYPES ============

export interface CreateSubscriptionForm {
  plan_id: string;
  billing_cycle: 'monthly' | 'annual';
  payment_method_id?: string;
  coupon_code?: string;
  billing_address: BillingAddress;
  auto_renew: boolean;
}

export interface UpdatePaymentMethodForm {
  card_token?: string;
  billing_address: BillingAddress;
  is_default: boolean;
}

export interface BillingSettingsForm {
  billing_email: string;
  billing_address: BillingAddress;
  auto_pay: boolean;
  invoice_delivery: 'email' | 'postal' | 'both';
  notifications: BillingSettings['notifications'];
  usage_alert_thresholds: BillingSettings['usage_alert_thresholds'];
  tax_id?: string;
  tax_exempt: boolean;
}

// ============ UTILITY TYPES ============

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
  success: boolean;
  message?: string;
  metadata?: {
    timestamp: string;
    request_id: string;
    total_time_ms: number;
  };
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
  metadata?: {
    timestamp: string;
    request_id: string;
    api_version: string;
  };
}

// ============ FEATURE FLAGS ============

export interface BillingFeatureFlags {
  multiple_payment_methods: boolean;
  usage_based_billing: boolean;
  proration_enabled: boolean;
  tax_calculation: boolean;
  dunning_management: boolean;
  self_service_portal: boolean;
  webhook_endpoints: boolean;
  analytics_dashboard: boolean;
  custom_billing_cycles: boolean;
  team_billing: boolean;
}

// ============ DISCOUNT & COUPON TYPES ============

export interface Coupon {
  id: string;
  code: string;
  name: string;
  type: 'percentage' | 'fixed_amount';
  value: number;
  currency?: string;
  
  // Restrictions
  max_redemptions?: number;
  redemptions_count: number;
  valid_from: string;
  valid_until?: string;
  
  // Applicability
  applies_to: 'subscription' | 'invoice' | 'both';
  plan_restrictions?: string[];
  first_time_only: boolean;
  
  // Status
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Discount {
  id: string;
  coupon: Coupon;
  applied_at: string;
  expires_at?: string;
  amount_saved: number;
}

// ============ BILLING HISTORY ============

export interface BillingHistory {
  subscriptions: Subscription[];
  payments: Payment[];
  invoices: Invoice[];
  credits: CreditTransaction[];
  usage_history: UsageMetrics[];
}

// ============ EXPORT TYPES ============

export interface BillingExportOptions {
  type: 'invoices' | 'payments' | 'usage' | 'subscriptions' | 'all';
  format: 'csv' | 'xlsx' | 'pdf' | 'json';
  date_range: {
    start: string;
    end: string;
  };
  filters?: {
    status?: string[];
    plan_ids?: string[];
    amount_range?: {
      min: number;
      max: number;
    };
  };
}

export default Subscription;