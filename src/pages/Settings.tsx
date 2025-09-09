
import React, { useState } from 'react'
import {User, Mail, Globe, CreditCard, Bell, Shield, Trash2} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'
import { useSubscription } from '../hooks/useSubscription'
import { formatCurrency } from '../utils/paystack'
import Navbar from '../components/Navbar'
import toast from 'react-hot-toast'

const Settings: React.FC = () => {
  const { user } = useAuth()
  const { theme, setTheme } = useTheme()
  const { subscription, cancelSubscription } = useSubscription()
  const [activeTab, setActiveTab] = useState('account')

  const handleCancelSubscription = async () => {
    if (window.confirm('Are you sure you want to cancel your subscription? You will lose access to premium features.')) {
      try {
        await cancelSubscription()
        toast.success('Subscription canceled successfully')
      } catch (error) {
        toast.error('Failed to cancel subscription')
      }
    }
  }

  const tabs = [
    { id: 'account', label: 'Account', icon: <User className="w-5 h-5" /> },
    { id: 'subscription', label: 'Subscription', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'preferences', label: 'Preferences', icon: <Bell className="w-5 h-5" /> },
    { id: 'privacy', label: 'Privacy', icon: <Shield className="w-5 h-5" /> }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Settings</h1>
          
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                {/* Account Tab */}
                {activeTab === 'account' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Account Information</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Full Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="text"
                            value={user?.userName || ''}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            readOnly
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="email"
                            value={user?.email || ''}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            readOnly
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Member Since
                        </label>
                        <p className="text-gray-600 dark:text-gray-400">
                          {user?.createdTime ? new Date(user.createdTime).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Subscription Tab */}
                {activeTab === 'subscription' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Subscription</h2>
                    
                    {subscription ? (
                      <div className="space-y-6">
                        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-300">
                              Premium Plan
                            </h3>
                            <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-sm font-medium">
                              Active
                            </span>
                          </div>
                          
                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600 dark:text-gray-400">Plan</p>
                              <p className="font-medium text-gray-800 dark:text-white">
                                {subscription.plan === 'monthly' ? 'Monthly' : 'Yearly'} Premium
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600 dark:text-gray-400">Amount</p>
                              <p className="font-medium text-gray-800 dark:text-white">
                                {formatCurrency(subscription.plan === 'monthly' ? 5 : 50)}
                                /{subscription.plan === 'monthly' ? 'month' : 'year'}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600 dark:text-gray-400">Next Billing</p>
                              <p className="font-medium text-gray-800 dark:text-white">
                                {subscription.nextBilling ? new Date(subscription.nextBilling).toLocaleDateString() : 'N/A'}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600 dark:text-gray-400">Status</p>
                              <p className="font-medium text-gray-800 dark:text-white capitalize">
                                {subscription.status}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                          <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
                            Update Payment Method
                          </button>
                          <button 
                            onClick={handleCancelSubscription}
                            className="border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 px-6 py-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          >
                            Cancel Subscription
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                          No Active Subscription
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                          Upgrade to Premium to unlock full blog generation and editing tools.
                        </p>
                        <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
                          Upgrade to Premium
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Preferences Tab */}
                {activeTab === 'preferences' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Preferences</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                          Theme
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          {['light', 'dark', 'system'].map((themeOption) => (
                            <button
                              key={themeOption}
                              onClick={() => setTheme(themeOption as any)}
                              className={`p-3 border rounded-lg text-center transition-colors ${
                                theme === themeOption
                                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                                  : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-purple-300'
                              }`}
                            >
                              <div className="capitalize font-medium">{themeOption}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-800 dark:text-white">Email Notifications</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Receive updates about new features and tips</div>
                          </div>
                          <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" defaultChecked />
                        </label>
                      </div>

                      <div>
                        <label className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-800 dark:text-white">Marketing Emails</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Receive promotional content and special offers</div>
                          </div>
                          <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Privacy Tab */}
                {activeTab === 'privacy' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Privacy & Security</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Data Export</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          Download a copy of your data including blog ideas and generated content.
                        </p>
                        <button className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors">
                          Export Data
                        </button>
                      </div>

                      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                        <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-3">Danger Zone</h3>
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                          <h4 className="font-medium text-red-800 dark:text-red-300 mb-2">Delete Account</h4>
                          <p className="text-red-600 dark:text-red-400 text-sm mb-4">
                            Permanently delete your account and all associated data. This action cannot be undone.
                          </p>
                          <button className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                            <Trash2 className="w-4 h-4" />
                            Delete Account
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
