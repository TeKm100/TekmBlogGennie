
import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useSubscription } from '../hooks/useSubscription'
import { initializePaystack, generatePaymentReference, formatCurrency } from '../utils/paystack'
import { Link } from 'react-router-dom'
import {Crown, Check, X, Zap, ArrowLeft, Sparkles, Edit3, Download, BarChart3, Headphones, Globe, Star} from 'lucide-react'
import ThemeToggle from '../components/ThemeToggle'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

const Upgrade: React.FC = () => {
  const { user } = useAuth()
  const { subscription, isPremium, createSubscription } = useSubscription()
  const [loading, setLoading] = useState<string | null>(null)

  const features = [
    {
      name: 'Blog Ideas Generation',
      free: '5 per day',
      premium: 'Unlimited',
      icon: <Sparkles className="w-5 h-5" />
    },
    {
      name: 'Full Blog Post Generation',
      free: false,
      premium: true,
      icon: <Edit3 className="w-5 h-5" />
    },
    {
      name: 'Advanced Editing Tools',
      free: false,
      premium: true,
      icon: <Edit3 className="w-5 h-5" />
    },
    {
      name: 'SEO Optimization',
      free: false,
      premium: true,
      icon: <BarChart3 className="w-5 h-5" />
    },
    {
      name: 'Export Formats',
      free: 'Text only',
      premium: 'PDF, Word, HTML',
      icon: <Download className="w-5 h-5" />
    },
    {
      name: 'Writing Styles',
      free: 'Basic',
      premium: '10+ Styles',
      icon: <Globe className="w-5 h-5" />
    },
    {
      name: 'Priority Support',
      free: false,
      premium: true,
      icon: <Headphones className="w-5 h-5" />
    },
    {
      name: 'Analytics Dashboard',
      free: false,
      premium: true,
      icon: <BarChart3 className="w-5 h-5" />
    }
  ]

  const plans = [
    {
      name: 'Monthly',
      price: 5,
      period: 'month',
      description: 'Perfect for regular content creators',
      popular: true,
      savings: null
    },
    {
      name: 'Yearly',
      price: 50,
      originalPrice: 60,
      period: 'year',
      description: 'Best value for serious bloggers',
      popular: false,
      savings: '2 months free'
    }
  ]

  const handleSubscribe = async (planType: 'monthly' | 'yearly', amount: number) => {
    if (!user) {
      toast.error('Please sign in to subscribe')
      return
    }

    setLoading(planType)
    const reference = generatePaymentReference()

    try {
      initializePaystack({
        email: user.email,
        amount,
        reference,
        callback: async (response) => {
          if (response.status === 'success') {
            try {
              await createSubscription(planType, response.reference, amount)
              toast.success('Subscription activated successfully!')
            } catch (error) {
              toast.error('Failed to activate subscription')
            }
          }
          setLoading(null)
        },
        onClose: () => {
          setLoading(null)
        }
      })
    } catch (error) {
      toast.error('Failed to initialize payment')
      setLoading(null)
    }
  }

  if (isPremium) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link
                  to="/dashboard"
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-800 dark:text-white">TekmBlogGenie</h1>
                </div>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Crown className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
              You're Already Premium! 🎉
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Enjoy unlimited blog generation and all premium features
            </p>
            
            {subscription && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  Current Subscription
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Plan:</span>
                    <p className="font-semibold text-gray-800 dark:text-white capitalize">
                      {subscription.plan_type}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Status:</span>
                    <p className="font-semibold text-green-600 capitalize">
                      {subscription.status}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Expires:</span>
                    <p className="font-semibold text-gray-800 dark:text-white">
                      {new Date(subscription.expires_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                    <p className="font-semibold text-gray-800 dark:text-white">
                      {formatCurrency(subscription.amount)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <Link
              to="/dashboard"
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 inline-flex items-center gap-2"
            >
              <Zap className="w-5 h-5" />
              Continue Creating
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard"
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">TekmBlogGenie</h1>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Crown className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              <span className="text-purple-600 dark:text-purple-400 font-semibold">Upgrade to Premium</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-6">
              Unlock the Full Power of
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                {" "}AI Content Creation
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Generate unlimited blog ideas and complete blog posts with advanced editing tools
            </p>
          </div>

          {/* Feature Comparison */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden mb-12">
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-8 text-center">
                Feature Comparison
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-4 px-6 text-gray-800 dark:text-white font-semibold">Features</th>
                      <th className="text-center py-4 px-6 text-gray-800 dark:text-white font-semibold">Free</th>
                      <th className="text-center py-4 px-6 text-purple-600 dark:text-purple-400 font-semibold">Premium</th>
                    </tr>
                  </thead>
                  <tbody>
                    {features.map((feature, index) => (
                      <tr key={index} className="border-b border-gray-100 dark:border-gray-700">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="text-purple-600 dark:text-purple-400">
                              {feature.icon}
                            </div>
                            <span className="text-gray-800 dark:text-white font-medium">
                              {feature.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          {typeof feature.free === 'boolean' ? (
                            feature.free ? (
                              <Check className="w-5 h-5 text-green-500 mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-red-500 mx-auto" />
                            )
                          ) : (
                            <span className="text-gray-600 dark:text-gray-400">{feature.free}</span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-center">
                          {typeof feature.premium === 'boolean' ? (
                            feature.premium ? (
                              <Check className="w-5 h-5 text-green-500 mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-red-500 mx-auto" />
                            )
                          ) : (
                            <span className="text-purple-600 dark:text-purple-400 font-semibold">
                              {feature.premium}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Pricing Plans */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan, index) => (
              <div 
                key={index}
                className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 relative ${
                  plan.popular ? 'ring-2 ring-purple-600 scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h4 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{plan.name}</h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{plan.description}</p>
                  
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-4xl font-bold text-gray-800 dark:text-white">
                      {formatCurrency(plan.price)}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">/{plan.period}</span>
                  </div>
                  
                  {plan.originalPrice && (
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-gray-500 dark:text-gray-400 line-through">
                        {formatCurrency(plan.originalPrice)}
                      </span>
                      <span className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-1 rounded-full text-sm font-semibold">
                        {plan.savings}
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleSubscribe(plan.name.toLowerCase() as 'monthly' | 'yearly', plan.price)}
                  disabled={loading === plan.name.toLowerCase()}
                  className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200 disabled:opacity-50 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {loading === plan.name.toLowerCase() ? (
                    <div className="flex items-center justify-center gap-2">
                      <LoadingSpinner />
                      Processing...
                    </div>
                  ) : (
                    `Subscribe ${plan.name}`
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* Security Notice */}
          <div className="text-center mt-12">
            <p className="text-gray-600 dark:text-gray-400">
              🔒 Secure payment powered by Paystack • Cancel anytime • 30-day money-back guarantee
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Upgrade
