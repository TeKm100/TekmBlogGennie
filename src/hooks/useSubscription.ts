
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export type SubscriptionPlan = 'free' | 'starter' | 'pro';

export interface Subscription {
  plan: SubscriptionPlan;
  status: 'active' | 'expired' | 'cancelled';
  expiresAt?: string;
  paymentMethod?: string;
}

export const useSubscription = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription>({
    plan: 'free',
    status: 'active'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // Load subscription data from localStorage or your backend
      const savedSubscription = localStorage.getItem(`subscription_${user.uid}`);
      if (savedSubscription) {
        setSubscription(JSON.parse(savedSubscription));
      }
    } else {
      setSubscription({ plan: 'free', status: 'active' });
    }
    setLoading(false);
  }, [user]);

  const updateSubscription = (newSubscription: Subscription) => {
    setSubscription(newSubscription);
    if (user) {
      localStorage.setItem(`subscription_${user.uid}`, JSON.stringify(newSubscription));
    }
  };

  const isPremium = () => {
    return subscription.plan !== 'free' && subscription.status === 'active';
  };

  const canGenerateFullContent = () => {
    return subscription.plan === 'starter' || subscription.plan === 'pro';
  };

  const canUseAIRewriting = () => {
    return subscription.plan === 'pro';
  };

  const hasUnlimitedIdeas = () => {
    return subscription.plan === 'pro';
  };

  return {
    subscription,
    loading,
    updateSubscription,
    isPremium,
    canGenerateFullContent,
    canUseAIRewriting,
    hasUnlimitedIdeas
  };
};
