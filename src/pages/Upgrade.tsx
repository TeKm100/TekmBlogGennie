
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {Check, Crown, Sparkles, Zap, Star} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useSubscription } from '../hooks/useSubscription';
import { initializePaystack, getCurrencyByCountry, convertPrice } from '../utils/paystack';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const Upgrade: React.FC = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('monthly');
  
  const { user, userData } = useAuth();
  const { updateSubscription } = useSubscription();

  const currency = userData?.country ? getCurrencyByCountry(userData.country) : 'USD';

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Perfect for getting started with AI content creation',
      monthlyPrice: 5,
      yearlyPrice: 50,
      features: [
        'Everything in Free',
        'Full blog content generation',
        'Content editing tools',
        'Export in multiple formats',
        'Email support',
        'No ads'
      ],
      popular: true,
      color: 'from-blue-500 to-purple-600'
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'For serious content creators and businesses',
      monthlyPrice: 10,
      yearlyPrice: 100,
      features: [
        'Everything in Starter',
        'Unlimited blog ideas',
        'AI content rewriting',
        'Advanced editing tools',
        'Priority support',
        'Analytics dashboard',
        'Team collaboration'
      ],
      popular: false,
      color: 'from-purple-500 to-pink-600'
    }
  ];

  const handleSubscribe = async (planId: string) => {
    if (!user || !userData?.email) {
      toast.error('Please log in to subscribe');
      return;
    }

    const plan = plans.find(p => p.id === planId);
    if (!plan) return;

    setLoading(planId);

    try {
      const basePrice = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
      const localPrice = convertPrice(basePrice, currency);
      const amountInCents = localPrice * (currency === 'NGN' ? 1 : 100); // Paystack expects kobo for NGN, cents for others

      initializePaystack({
        email: userData.email,
        amount: amountInCents,
        currency: currency,
        callback: (response) => {
          console.log('Payment successful:', response);
          
          // Update subscription status
          updateSubscription({
            plan: planId as 'starter' | 'pro',
            status: 'active',
            expiresAt: new Date(Date.now() + (billingCycle === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000).toISOString(),
            paymentMethod: 'Paystack'
          });
          
          toast.success(`Successfully subscribed to ${plan.name} plan!`);
          setLoading(null);
        },
        onClose: () => {
          console.log('Payment modal closed');
          setLoading(null);
        }
      });
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
      setLoading(null);
    }
  };

  const formatPrice = (usdPrice: number) => {
    const localPrice = convertPrice(usdPrice, currency);
    const currencySymbols: { [key: string]: string } = {
      'NGN': '₦',
      'GHS': '₵',
      'KES': 'KSh',
      'ZAR': 'R',
      'USD': '$',
      'GBP': '£',
      'CAD': 'C$'
    };
    
    return `${currencySymbols[currency] || '$'}${localPrice.toLocaleString()}`;
  };

  const getSavings = (plan: any) => {
    const monthlyTotal = plan.monthlyPrice * 12;
    const savings = monthlyTotal - plan.yearlyPrice;
    const savingsPercentage = Math.round((savings / monthlyTotal) * 100);
    return { amount: savings, percentage: savingsPercentage };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6"
          >
            <Crown className="w-8 h-8 text-white" />
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Unlock Your Creative{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Potential
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Choose the perfect plan to supercharge your content creation with AI-powered tools
          </p>
        </motion.div>

        {/* Billing Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center mb-12"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg p-1 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  billingCycle === 'monthly'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annually')}
                className={`px-6 py-2 rounded-md font-medium transition-colors relative ${
                  billingCycle === 'annually'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                Annually
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  Save 17%
                </span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => {
            const savings = getSavings(plan);
            const currentPrice = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
            
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-2 ${
                  plan.popular 
                    ? 'border-blue-500 dark:border-blue-400' 
                    : 'border-gray-200 dark:border-gray-700'
                } overflow-hidden`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center py-2 text-sm font-medium">
                    <Star className="inline w-4 h-4 mr-1" />
                    Most Popular
                  </div>
                )}

                <div className={`p-8 ${plan.popular ? 'pt-16' : ''}`}>
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      {plan.description}
                    </p>
                    
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">
                        {formatPrice(currentPrice)}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400 ml-1">
                        /{billingCycle === 'monthly' ? 'month' : 'year'}
                      </span>
                    </div>

                    {billingCycle === 'annually' && (
                      <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                        Save {formatPrice(savings.amount)} ({savings.percentage}%) per year
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Subscribe Button */}
                  <motion.button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={loading === plan.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                      plan.popular
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                        : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100'
                    } disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2`}
                  >
                    {loading === plan.id ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        <span>Get Started</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* FAQ or Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-center mt-16"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-3xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Why Upgrade?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span>Instant AI content generation</span>
              </div>
              <div className="flex items-center space-x-2">
                <Crown className="w-5 h-5 text-purple-500" />
                <span>Premium features & tools</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-blue-500" />
                <span>Priority customer support</span>
              </div>
            </div>
            
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-6">
              Secure payments powered by Paystack. Cancel anytime. Prices in {currency}.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Upgrade;
