
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {Plus, BookOpen, Sparkles, Clock, TrendingUp} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useSubscription } from '../hooks/useSubscription';
import { generateBlogIdeas, BlogIdea } from '../utils/aiService';
import { generateFullBlogPost } from '../utils/premiumAiService';
import BlogIdeaCard from '../components/BlogIdeaCard';
import LoadingSpinner from '../components/LoadingSpinner';
import RatingModal from '../components/RatingModal';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { isPremium } = useSubscription();
  const [blogIdeas, setBlogIdeas] = useState<BlogIdea[]>([]);
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState('');
  const [showRatingModal, setShowRatingModal] = useState(false);

  // Check if user should see rating modal (after some usage)
  useEffect(() => {
    const lastRatingPrompt = localStorage.getItem(`lastRatingPrompt_${user?.uid}`);
    const ideaCount = blogIdeas.length;
    
    if (ideaCount >= 3 && (!lastRatingPrompt || Date.now() - parseInt(lastRatingPrompt) > 7 * 24 * 60 * 60 * 1000)) {
      // Show rating modal after user has generated 3+ ideas and hasn't been prompted in 7 days
      const timer = setTimeout(() => {
        setShowRatingModal(true);
      }, 5000); // Show after 5 seconds
      
      return () => clearTimeout(timer);
    }
  }, [blogIdeas.length, user?.uid]);

  const handleGenerateIdeas = async () => {
    if (!topic.trim()) return;
    
    setLoading(true);
    try {
      const ideas = await generateBlogIdeas(topic);
      setBlogIdeas(ideas);
    } catch (error) {
      console.error('Error generating ideas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRatingSubmit = (rating: number, comment: string) => {
    // Mark that user was prompted for rating
    if (user?.uid) {
      localStorage.setItem(`lastRatingPrompt_${user.uid}`, Date.now().toString());
    }
    setShowRatingModal(false);
  };

  const stats = [
    {
      icon: BookOpen,
      label: 'Ideas Generated',
      value: blogIdeas.length.toString(),
      color: 'blue'
    },
    {
      icon: Sparkles,
      label: 'Account Type',
      value: isPremium ? 'Premium' : 'Free',
      color: isPremium ? 'purple' : 'gray'
    },
    {
      icon: Clock,
      label: 'Last Activity',
      value: 'Today',
      color: 'green'
    },
    {
      icon: TrendingUp,
      label: 'Success Rate',
      value: '98%',
      color: 'yellow'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
          >
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome back, {user?.displayName || 'Creator'}! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Ready to create amazing content? Let's generate some blog ideas!
            </p>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
            >
              <div className="flex items-center">
                <div className={`p-3 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/20`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Blog Idea Generator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Generate Blog Ideas
          </h2>
          
          <div className="flex gap-4">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter a topic (e.g., 'digital marketing', 'cooking tips')"
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              onKeyPress={(e) => e.key === 'Enter' && handleGenerateIdeas()}
            />
            <motion.button
              onClick={handleGenerateIdeas}
              disabled={loading || !topic.trim()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  <span>Generate</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Blog Ideas Grid */}
        {blogIdeas.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Your Blog Ideas ({blogIdeas.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogIdeas.map((idea, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <BlogIdeaCard idea={idea} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {blogIdeas.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No blog ideas yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Enter a topic above to generate your first set of blog ideas!
            </p>
          </motion.div>
        )}
      </div>

      {/* Rating Modal */}
      <RatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        onSubmit={handleRatingSubmit}
      />
    </div>
  );
};

export default Dashboard;
