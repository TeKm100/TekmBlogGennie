
import React from 'react';
import { motion } from 'framer-motion';
import {Clock, Tag, Sparkles, Crown} from 'lucide-react';
import { BlogIdea } from '../utils/aiService';
import { useSubscription } from '../hooks/useSubscription';

interface BlogIdeaCardProps {
  idea: BlogIdea;
  onGenerateContent?: (idea: BlogIdea) => void;
  onUpgrade?: () => void;
  showAd?: boolean;
}

const BlogIdeaCard: React.FC<BlogIdeaCardProps> = ({ 
  idea, 
  onGenerateContent, 
  onUpgrade, 
  showAd = false 
}) => {
  const { canGenerateFullContent } = useSubscription();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
          {idea.title}
        </h3>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 ml-2">
          <Clock className="w-4 h-4 mr-1" />
          {idea.estimatedReadTime}m
        </div>
      </div>

      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
        {idea.description}
      </p>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
            {idea.category}
          </span>
          <div className="flex items-center space-x-1">
            {idea.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="flex items-center text-xs text-gray-500 dark:text-gray-400"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {canGenerateFullContent() ? (
        <motion.button
          onClick={() => onGenerateContent?.(idea)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition-colors flex items-center justify-center space-x-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Generate Full Content</span>
        </motion.button>
      ) : (
        <motion.button
          onClick={onUpgrade}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-2 px-4 rounded-md font-medium transition-colors flex items-center justify-center space-x-2"
        >
          <Crown className="w-4 h-4" />
          <span>Upgrade for Full Content</span>
        </motion.button>
      )}

      {/* AdSense Ad Block for Free Users */}
      {showAd && !canGenerateFullContent() && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 text-center">
            Advertisement
          </div>
          {/* TODO: Replace with your actual AdSense code */}
          <div className="w-full h-32 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center">
            {/* 
            <ins className="adsbygoogle"
                 style={{ display: 'block' }}
                 data-ad-client="ca-pub-XXXXXXXXXXXXXXXXX"
                 data-ad-slot="XXXXXXXXXX"
                 data-ad-format="rectangle"
                 data-full-width-responsive="true"></ins>
            */}
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              Ad Space (300x250)
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
            Upgrade to remove ads and unlock premium features
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default BlogIdeaCard;
