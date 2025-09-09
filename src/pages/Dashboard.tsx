
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {Search, Plus, BookOpen, Crown, Sparkles} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useSubscription } from '../hooks/useSubscription';
import { generateBlogIdeas, BlogIdea } from '../utils/aiService';
import { generateFullBlogPost } from '../utils/premiumAiService';
import BlogIdeaCard from '../components/BlogIdeaCard';
import LoadingSpinner from '../components/LoadingSpinner';
import RatingModal from '../components/RatingModal';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const [searchTopic, setSearchTopic] = useState('');
  const [blogIdeas, setBlogIdeas] = useState<BlogIdea[]>([]);
  const [loading, setLoading] = useState(false);
  const [generatingContent, setGeneratingContent] = useState<string | null>(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  
  const { user, userData } = useAuth();
  const { subscription, canGenerateFullContent, hasUnlimitedIdeas } = useSubscription();
  const navigate = useNavigate();

  // Check if should show rating modal
  useEffect(() => {
    if (user) {
      const hasRated = localStorage.getItem(`user_rated_${user.uid}`);
      const dontShow = localStorage.getItem(`dont_show_rating_${user.uid}`);
      
      if (!hasRated && !dontShow) {
        // Show rating modal after 30 seconds
        const timer = setTimeout(() => {
          setShowRatingModal(true);
        }, 30000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [user]);

  const handleGenerateIdeas = async () => {
    if (!searchTopic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    // Check limits for free users
    if (!hasUnlimitedIdeas() && blogIdeas.length >= 5) {
      toast.error('Free users can generate up to 5 ideas. Upgrade for unlimited ideas!');
      return;
    }

    setLoading(true);
    try {
      const ideas = await generateBlogIdeas(searchTopic, 3);
      setBlogIdeas(prev => [...prev, ...ideas]);
      setSearchTopic('');
      toast.success(`Generated ${ideas.length} blog ideas!`);
    } catch (error) {
      toast.error('Failed to generate ideas. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateContent = async (idea: BlogIdea) => {
    if (!canGenerateFullContent()) {
      navigate('/upgrade');
      return;
    }

    setGeneratingContent(idea.id);
    try {
      const blogPost = await generateFullBlogPost(idea);
      
      // Save to localStorage (in production, save to your backend)
      const existingPosts = JSON.parse(localStorage.getItem('user_blog_posts') || '[]');
      existingPosts.push(blogPost);
      localStorage.setItem('user_blog_posts', JSON.stringify(existingPosts));
      
      toast.success('Full blog post generated successfully!');
      // You could navigate to a blog post editor here
    } catch (error) {
      toast.error('Failed to generate content. Please try again.');
    } finally {
      setGeneratingContent(null);
    }
  };

  const handleUpgrade = () => {
    navigate('/upgrade');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome back, {userData?.displayName || user?.displayName || 'Creator'}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Ready to create amazing content? Let's get started.
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                {subscription.plan === 'free' ? (
                  <span className="text-sm text-gray-600 dark:text-gray-400">Free Plan</span>
                ) : (
                  <>
                    <Crown className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                      {subscription.plan} Plan
                    </span>
                  </>
                )}
              </div>
              
              {subscription.plan === 'free' && (
                <motion.button
                  onClick={handleUpgrade}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center space-x-2"
                >
                  <Crown className="w-4 h-4" />
                  <span>Upgrade</span>
                </motion.button>
              )}
            </div>
          </motion.div>
        </div>

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Generate Blog Ideas
            </h2>
          </div>
          
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTopic}
                onChange={(e) => setSearchTopic(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleGenerateIdeas()}
                placeholder="Enter a topic (e.g., productivity, technology, lifestyle...)"
                className="w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <motion.button
              onClick={handleGenerateIdeas}
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
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
          
          {!hasUnlimitedIdeas() && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Free plan: {Math.max(0, 5 - blogIdeas.length)} ideas remaining. 
              <button
                onClick={handleUpgrade}
                className="text-blue-600 hover:text-blue-500 ml-1"
              >
                Upgrade for unlimited ideas
              </button>
            </p>
          )}
        </motion.div>

        {/* Blog Ideas Grid */}
        {blogIdeas.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center space-x-2 mb-6">
              <BookOpen className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Generated Ideas ({blogIdeas.length})
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogIdeas.map((idea, index) => (
                <BlogIdeaCard
                  key={idea.id}
                  idea={idea}
                  onGenerateContent={handleGenerateContent}
                  onUpgrade={handleUpgrade}
                  showAd={index === 2} // Show ad after 3rd idea for free users
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {blogIdeas.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center py-12"
          >
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No blog ideas yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Enter a topic above to generate your first blog ideas with AI
            </p>
          </motion.div>
        )}

        {/* Loading Overlay */}
        {generatingContent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4">
              <LoadingSpinner size="lg" text="Generating full blog content..." />
            </div>
          </div>
        )}

        {/* Rating Modal */}
        <RatingModal
          isOpen={showRatingModal}
          onClose={() => setShowRatingModal(false)}
        />
      </div>
    </div>
  );
};

export default Dashboard;
