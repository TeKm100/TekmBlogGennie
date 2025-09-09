
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {ArrowLeft, Calendar, Clock, Tag, Edit, Trash2, Download} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { BlogPost } from '../utils/premiumAiService';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const Blog: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    loadBlogPosts();
  }, []);

  const loadBlogPosts = async () => {
    try {
      // Load from localStorage (in production, load from your backend)
      const savedPosts = localStorage.getItem('user_blog_posts');
      if (savedPosts) {
        setBlogPosts(JSON.parse(savedPosts));
      }
    } catch (error) {
      console.error('Error loading blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = (postId: string) => {
    const updatedPosts = blogPosts.filter(post => post.id !== postId);
    setBlogPosts(updatedPosts);
    localStorage.setItem('user_blog_posts', JSON.stringify(updatedPosts));
    setSelectedPost(null);
    toast.success('Blog post deleted successfully');
  };

  const handleExportPost = (post: BlogPost) => {
    const content = `# ${post.title}\n\n${post.content}`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${post.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Blog post exported successfully');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading your blog posts..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <motion.button
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </motion.button>
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Your Blog Posts
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage and view your AI-generated content
            </p>
          </div>
        </div>

        {selectedPost ? (
          /* Blog Post Detail View */
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg"
          >
            {/* Post Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between mb-4">
                <button
                  onClick={() => setSelectedPost(null)}
                  className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                >
                  ← Back to posts
                </button>
                
                <div className="flex items-center space-x-2">
                  <motion.button
                    onClick={() => handleExportPost(selectedPost)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                    title="Export"
                  >
                    <Download className="w-4 h-4" />
                  </motion.button>
                  
                  <motion.button
                    onClick={() => handleDeletePost(selectedPost.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
              
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {selectedPost.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(selectedPost.createdAt)}</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{selectedPost.estimatedReadTime} min read</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Tag className="w-4 h-4" />
                  <span>{selectedPost.category}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                {selectedPost.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Post Content */}
            <div className="p-6">
              <div className="prose dark:prose-invert max-w-none">
                <div
                  className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: selectedPost.content.replace(/\n/g, '<br>')
                  }}
                />
              </div>
            </div>
          </motion.div>
        ) : (
          /* Blog Posts List */
          <>
            {blogPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedPost(post)}
                  >
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                      
                      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(post.createdAt)}</span>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{post.estimatedReadTime}m</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                          {post.category}
                        </span>
                        
                        <div className="flex items-center space-x-2">
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleExportPost(post);
                            }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded"
                            title="Export"
                          >
                            <Download className="w-4 h-4" />
                          </motion.button>
                          
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeletePost(post.id);
                            }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              /* Empty State */
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Edit className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No blog posts yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Generate your first blog post from the dashboard to see it here
                </p>
                <motion.button
                  onClick={() => navigate('/dashboard')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                >
                  Go to Dashboard
                </motion.button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Blog;
