// src/components/dashboard/TrialWarningBanner.tsx
import React, { useState, useEffect } from 'react';
import { AlertTriangle, CreditCard, Clock, CheckCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../services/userService';
import { billingService } from '../../services/billingService';

interface TrialStatus {
  status: 'pending_payment' | 'active' | 'expired' | 'completed';
  daysRemaining?: number;
  trialEnd?: string;
  hasValidPayment: boolean;
  canStartTrial: boolean;
}

interface TrialWarningBannerProps {
  user: any;
  onDismiss?: () => void;
}

export const TrialWarningBanner: React.FC<TrialWarningBannerProps> = ({
  user,
  onDismiss
}) => {
  const navigate = useNavigate();
  const [trialStatus, setTrialStatus] = useState<TrialStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetchTrialStatus();
  }, [user]);

  const fetchTrialStatus = async () => {
    try {
      setLoading(true);
      
      // Get trial status from user service
      const [userProfile, paymentMethods, subscription] = await Promise.all([
        userService.getProfile(),
        billingService.getPaymentMethods(),
        billingService.getCurrentSubscription()
      ]);

      const hasValidPayment = paymentMethods.length > 0;
      
      let status: TrialStatus['status'] = 'pending_payment';
      let daysRemaining: number | undefined;
      let trialEnd: string | undefined;

      if (subscription?.status === 'trialing') {
        status = 'active';
        trialEnd = subscription.trial_end;
        
        if (trialEnd) {
          const endDate = new Date(trialEnd);
          const now = new Date();
          const diffTime = endDate.getTime() - now.getTime();
          daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (daysRemaining <= 0) {
            status = 'expired';
          }
        }
      } else if (user.trial_status === 'expired') {
        status = 'expired';
      } else if (user.trial_status === 'completed') {
        status = 'completed';
      }

      setTrialStatus({
        status,
        daysRemaining,
        trialEnd,
        hasValidPayment,
        canStartTrial: hasValidPayment && status === 'pending_payment'
      });
    } catch (error) {
      console.error('Error fetching trial status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartTrial = () => {
    navigate('/dashboard/start-trial');
  };

  const handleAddPayment = () => {
    navigate('/dashboard/billing/payment-methods');
  };

  const handleUpgrade = () => {
    navigate('/dashboard/subscription');
  };

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  // Don't show banner if dismissed or completed/paid subscription
  if (loading || dismissed || !trialStatus || trialStatus.status === 'completed') {
    return null;
  }

  const getBannerConfig = () => {
    switch (trialStatus.status) {
      case 'pending_payment':
        return {
          bgColor: 'bg-orange-50 border-orange-200',
          textColor: 'text-orange-800',
          iconColor: 'text-orange-600',
          icon: CreditCard,
          title: '⚠️ Complete Payment Setup to Start Your 14-Day Trial',
          message: trialStatus.hasValidPayment 
            ? 'Select a subscription plan to activate your 14-day free trial and get your phone number.'
            : 'Add a payment method and select a subscription plan to start your 14-day free trial. You won\'t be charged until after the trial period.',
          action: trialStatus.hasValidPayment ? 'Start Trial' : 'Add Payment Method',
          actionHandler: trialStatus.hasValidPayment ? handleStartTrial : handleAddPayment,
          urgent: false
        };
      
      case 'active':
        const isUrgent = (trialStatus.daysRemaining || 0) <= 3;
        return {
          bgColor: isUrgent ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200',
          textColor: isUrgent ? 'text-red-800' : 'text-blue-800',
          iconColor: isUrgent ? 'text-red-600' : 'text-blue-600',
          icon: Clock,
          title: `${isUrgent ? '🚨' : '⏰'} Trial Active - ${trialStatus.daysRemaining} Day${(trialStatus.daysRemaining || 0) !== 1 ? 's' : ''} Remaining`,
          message: isUrgent 
            ? `Your trial expires ${trialStatus.daysRemaining === 1 ? 'tomorrow' : `in ${trialStatus.daysRemaining} days`}. Upgrade now to continue using your phone number and AI features without interruption.`
            : `Your 14-day trial is active with ${trialStatus.daysRemaining} days remaining. Upgrade anytime to continue seamless service.`,
          action: 'Upgrade Now',
          actionHandler: handleUpgrade,
          urgent: isUrgent
        };
      
      case 'expired':
        return {
          bgColor: 'bg-red-50 border-red-200',
          textColor: 'text-red-800',
          iconColor: 'text-red-600',
          icon: AlertTriangle,
          title: '🚨 Trial Expired - Immediate Action Required',
          message: 'Your trial has expired and your phone number has been suspended. Upgrade now to restore full service and keep your number.',
          action: 'Upgrade Now',
          actionHandler: handleUpgrade,
          urgent: true
        };
      
      default:
        return null;
    }
  };

  const config = getBannerConfig();
  if (!config) return null;

  const { bgColor, textColor, iconColor, icon: Icon, title, message, action, actionHandler, urgent } = config;

  return (
    <div className={`${bgColor} border rounded-lg p-4 mb-6 ${urgent ? 'shadow-lg' : ''}`}>
      <div className="flex items-start space-x-3">
        <Icon className={`${iconColor} mt-0.5 flex-shrink-0`} size={24} />
        
        <div className="flex-1 min-w-0">
          <h3 className={`${textColor} font-semibold text-lg mb-2`}>
            {title}
          </h3>
          
          <p className={`${textColor} text-sm mb-4 leading-relaxed`}>
            {message}
          </p>
          
          {/* Action buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={actionHandler}
              className={`px-6 py-2 rounded-md font-medium text-sm transition-colors ${
                urgent 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {action}
            </button>
            
            {trialStatus.status === 'active' && (
              <button
                onClick={() => navigate('/dashboard/billing')}
                className="px-4 py-2 rounded-md font-medium text-sm bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                View Billing Details
              </button>
            )}
          </div>
          
          {/* Additional info for pending payment */}
          {trialStatus.status === 'pending_payment' && (
            <div className="mt-4 p-3 bg-white rounded border">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <CheckCircle size={16} className="text-green-500" />
                <span>✅ No charges during 14-day trial period</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                <CheckCircle size={16} className="text-green-500" />
                <span>✅ Cancel anytime before trial ends</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                <CheckCircle size={16} className="text-green-500" />
                <span>✅ Full access to SignalWire phone number and AI features</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Dismiss button - only for non-urgent warnings */}
        {!urgent && (
          <button
            onClick={handleDismiss}
            className={`${textColor} hover:opacity-70 flex-shrink-0`}
            aria-label="Dismiss"
          >
            <X size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default TrialWarningBanner;