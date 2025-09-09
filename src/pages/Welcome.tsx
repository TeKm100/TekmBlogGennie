
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {BookOpen, Sparkles, Crown, Zap, Shield, Globe} from 'lucide-react';
import AuthModal from '../components/AuthModal';

const Welcome: React.FC = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');

  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Ideas',
      description: 'Generate unlimited blog ideas with our advanced AI technology'
    },
    {
      icon: Crown,
      title: 'Premium Content',
      description: 'Create full blog posts with editing and export capabilities'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Get your content generated in seconds, not hours'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is protected with enterprise-grade security'
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Support for multiple languages and regions'
    },
    {
      icon: BookOpen,
      title: 'Export Ready',
      description: 'Download your content in various formats'
    }
  ];

  const handleGetStarted = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-8"
            >
              <BookOpen className="w-8 h-8 text-white" />
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Create Amazing{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Blog Content
              </span>{' '}
              with AI
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
              Generate engaging blog ideas instantly and create full content with our AI-powered platform. 
              From brainstorming to publishing, we've got you covered.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <motion.button
                onClick={() => handleGetStarted('signup')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-semibold text-lg shadow-lg"
              >
                Get Started Free
              </motion.button>
              
              <motion.button
                onClick={() => handleGetStarted('login')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 text-gray-700 dark:text-gray-300 px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
              >
                Sign In
              </motion.button>
            </div>

            {/* Pricing Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Free</h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-4">$0</p>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  <li>• Blog ideas generation</li>
                  <li>• Basic templates</li>
                  <li>• Community support</li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 text-white relative"
              >
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-semibold">
                    POPULAR
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Starter</h3>
                <p className="text-3xl font-bold mb-4">$5<span className="text-sm">/month</span></p>
                <ul className="text-sm space-y-2">
                  <li>• Everything in Free</li>
                  <li>• Full content generation</li>
                  <li>• Content editing</li>
                  <li>• Export options</li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Pro</h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-4">$10<span className="text-sm">/month</span></p>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  <li>• Everything in Starter</li>
                  <li>• Unlimited ideas</li>
                  <li>• AI rewriting</li>
                  <li>• Priority support</li>
                </ul>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Everything you need to create amazing content
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Powerful features designed to streamline your content creation process
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
              >
                <feature.icon className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </div>
  );
};

export default Welcome;
