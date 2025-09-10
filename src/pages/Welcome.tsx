
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {BookOpen, Sparkles, Crown, Zap, Shield, Globe, Star, Menu, X, ChevronDown, Lightbulb, FileText, AlertCircle} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthModal from '../components/AuthModal';
import RatingModal from '../components/RatingModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import ThemeToggle from '../components/ThemeToggle';
import { BlogPost } from '../utils/premiumAiService';
import toast from 'react-hot-toast';

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

interface BlogIdea {
  id: string;
  title: string;
  description: string;
}

interface UsageStats {
  date: string;
  count: number;
}

// API Configuration - Replace with your actual API keys
const API_CONFIG = {
  // TODO: Replace with your actual API endpoint and key
  BLOG_GENERATION_API: process.env.REACT_APP_BLOG_API_URL || 'https://api.your-ai-service.com/generate',
  API_KEY: process.env.REACT_APP_AI_API_KEY || 'your-api-key-here',
  // Alternative: OpenAI configuration
  OPENAI_API_KEY: process.env.REACT_APP_OPENAI_API_KEY || 'your-openai-key-here',
  // Alternative: Other AI service keys
  ANTHROPIC_API_KEY: process.env.REACT_APP_ANTHROPIC_API_KEY || 'your-anthropic-key-here'
};

const Welcome: React.FC = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [menuOpen, setMenuOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showBlogGenerator, setShowBlogGenerator] = useState(false);
  const [topic, setTopic] = useState('');
  const [blogIdeas, setBlogIdeas] = useState<BlogIdea[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<BlogIdea | null>(null);
  const [blogContent, setBlogContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [usageStats, setUsageStats] = useState<UsageStats>({ date: '', count: 0 });
  const [showRatingModal, setShowRatingModal] = useState(false);
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const DAILY_LIMIT = 3;
  const today = new Date().toDateString();

  // Check if rating notification should be shown (once per day)
  useEffect(() => {
    if (user) {
      const lastRatingPrompt = localStorage.getItem(`lastRatingPrompt_${user.uid}`);
      const today = new Date().toDateString();
      
      if (!lastRatingPrompt || lastRatingPrompt !== today) {
        // Show rating modal after a short delay
        const timer = setTimeout(() => {
          setShowRatingModal(true);
          localStorage.setItem(`lastRatingPrompt_${user.uid}`, today);
        }, 2000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [user]);

  // Load usage statistics
  useEffect(() => {
    if (user) {
      const savedStats = localStorage.getItem(`bloggen_usage_stats_${user.uid}`);
      if (savedStats) {
        try {
          const stats = JSON.parse(savedStats);
          if (stats.date === today) {
            setUsageStats(stats);
          } else {
            // Reset for new day
            const newStats = { date: today, count: 0 };
            setUsageStats(newStats);
            localStorage.setItem(`bloggen_usage_stats_${user.uid}`, JSON.stringify(newStats));
          }
        } catch (error) {
          console.error('Error loading usage stats:', error);
          const newStats = { date: today, count: 0 };
          setUsageStats(newStats);
          localStorage.setItem(`bloggen_usage_stats_${user.uid}`, JSON.stringify(newStats));
        }
      } else {
        const newStats = { date: today, count: 0 };
        setUsageStats(newStats);
        localStorage.setItem(`bloggen_usage_stats_${user.uid}`, JSON.stringify(newStats));
      }
    }
  }, [today, user]);

  // Update usage count
  const incrementUsage = () => {
    if (!user) return;
    const newStats = { date: today, count: usageStats.count + 1 };
    setUsageStats(newStats);
    localStorage.setItem(`bloggen_usage_stats_${user.uid}`, JSON.stringify(newStats));
  };

  // Check if user has reached daily limit
  const hasReachedLimit = () => {
    return usageStats.count >= DAILY_LIMIT;
  };

  // Generate blog ideas using API
  const generateBlogIdeas = async () => {
    if (!user) {
      toast.error('Please sign in to generate blog ideas');
      setAuthModalOpen(true);
      return;
    }

    if (!topic.trim()) {
      toast.error('Please enter a topic or hint');
      return;
    }

    if (hasReachedLimit()) {
      toast.error(`Daily limit reached (${DAILY_LIMIT}/day). Upgrade for unlimited access!`);
      return;
    }

    setLoading(true);
    try {
      // Check if API key is configured
      if (API_CONFIG.API_KEY === 'your-api-key-here') {
        // Fallback to mock data when API key is not configured
        console.warn('API key not configured, using mock data');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const mockIdeas: BlogIdea[] = [
          {
            id: '1',
            title: `10 Essential Tips for ${topic}`,
            description: `A comprehensive guide covering the most important aspects of ${topic} that beginners should know.`
          },
          {
            id: '2',
            title: `The Ultimate ${topic} Guide for 2024`,
            description: `Everything you need to know about ${topic} in the current year, including latest trends and best practices.`
          },
          {
            id: '3',
            title: `Common ${topic} Mistakes and How to Avoid Them`,
            description: `Learn from others' experiences and avoid the most common pitfalls when dealing with ${topic}.`
          },
          {
            id: '4',
            title: `${topic}: From Beginner to Expert`,
            description: `A step-by-step journey that takes you from knowing nothing about ${topic} to becoming proficient.`
          },
          {
            id: '5',
            title: `Why ${topic} Matters in Today's World`,
            description: `Exploring the importance and relevance of ${topic} in modern society and future implications.`
          }
        ];
        
        setBlogIdeas(mockIdeas);
        incrementUsage();
        toast.success('Blog ideas generated successfully!');
        return;
      }

      // Real API call when keys are configured
      const response = await fetch(API_CONFIG.BLOG_GENERATION_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_CONFIG.API_KEY}`,
          // Alternative headers for different APIs:
          // 'X-API-Key': API_CONFIG.API_KEY,
          // 'OpenAI-API-Key': API_CONFIG.OPENAI_API_KEY,
        },
        body: JSON.stringify({
          prompt: `Generate 5 blog post ideas about "${topic}". Return as JSON array with id, title, and description fields.`,
          max_tokens: 1000,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      // Parse response based on your API structure
      let ideas: BlogIdea[];
      if (data.choices && data.choices[0]) {
        // OpenAI-style response
        ideas = JSON.parse(data.choices[0].message.content);
      } else if (data.ideas) {
        // Custom API response
        ideas = data.ideas;
      } else {
        // Direct array response
        ideas = data;
      }

      setBlogIdeas(ideas);
      incrementUsage();
      toast.success('Blog ideas generated successfully!');
    } catch (error) {
      console.error('Error generating ideas:', error);
      toast.error('Failed to generate ideas. Please check your API configuration.');
    } finally {
      setLoading(false);
    }
  };

  // Save blog post to localStorage and navigate to blog page
  const saveBlogPost = (post: BlogPost) => {
    try {
      const existingPosts = localStorage.getItem('user_blog_posts');
      const posts: BlogPost[] = existingPosts ? JSON.parse(existingPosts) : [];
      
      // Add new post to the beginning of the array
      posts.unshift(post);
      
      localStorage.setItem('user_blog_posts', JSON.stringify(posts));
      
      // Trigger storage event for other components
      window.dispatchEvent(new Event('storage'));
      
      return true;
    } catch (error) {
      console.error('Error saving blog post:', error);
      return false;
    }
  };

  // Generate full blog content with improved functionality and immediate redirect
  const generateBlogContent = async (idea: BlogIdea) => {
    if (!user) {
      toast.error('Please sign in to generate content');
      setAuthModalOpen(true);
      return;
    }

    if (hasReachedLimit()) {
      toast.error(`Daily limit reached (${DAILY_LIMIT}/day). Upgrade for unlimited access!`);
      return;
    }

    setSelectedIdea(idea);
    setLoading(true);
    setBlogContent(''); // Clear previous content
    
    try {
      let content: string;
      
      // Check if API key is configured
      if (API_CONFIG.API_KEY === 'your-api-key-here') {
        // Enhanced mock content when API key is not configured
        console.warn('API key not configured, using enhanced mock data');
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        content = `# ${idea.title}

## Introduction

${idea.description} In this comprehensive guide, we'll explore the key aspects that make ${topic} such an important topic in today's landscape.

## Understanding the Fundamentals

Before diving deep into ${topic}, it's essential to understand the foundational concepts that drive success in this area. Whether you're a complete beginner or looking to refine your knowledge, these fundamentals will serve as your roadmap.

### Key Principles

1. **Consistency is Key**: Regular practice and application of ${topic} principles leads to mastery
2. **Stay Updated**: The field of ${topic} is constantly evolving with new trends and best practices
3. **Learn from Others**: Community knowledge and shared experiences accelerate learning

## Advanced Strategies and Techniques

Once you've mastered the basics, it's time to explore more sophisticated approaches to ${topic}. These strategies have been proven effective by industry leaders and practitioners.

### Implementation Best Practices

- **Start Small**: Begin with manageable goals and gradually scale your efforts
- **Measure Progress**: Track your results to understand what works best for your situation
- **Iterate and Improve**: Continuously refine your approach based on feedback and results

## Common Challenges and Solutions

Every journey in ${topic} comes with its unique set of challenges. Here are the most common obstacles and proven strategies to overcome them:

### Challenge 1: Getting Started
**Solution**: Break down your goals into smaller, actionable steps that feel less overwhelming.

### Challenge 2: Maintaining Momentum
**Solution**: Create systems and habits that support consistent progress, even when motivation wanes.

### Challenge 3: Staying Current
**Solution**: Follow industry leaders, join communities, and set aside time for continuous learning.

## Tools and Resources

To excel in ${topic}, having the right tools and resources is crucial. Here are some recommendations:

- **Essential Tools**: [List of recommended tools for ${topic}]
- **Learning Resources**: Books, courses, and online materials
- **Communities**: Forums, social media groups, and networking opportunities

## Real-World Applications

Understanding how ${topic} applies in real-world scenarios helps bridge the gap between theory and practice. Consider these examples:

- **Case Study 1**: How Company X improved their results by 200% using ${topic} strategies
- **Case Study 2**: Personal success story of implementing ${topic} principles
- **Case Study 3**: Industry transformation through innovative ${topic} approaches

## Future Trends and Predictions

The landscape of ${topic} continues to evolve. Here's what experts predict for the coming years:

- **Emerging Technologies**: How new tech will impact ${topic}
- **Changing Consumer Behavior**: Shifts that will influence ${topic} strategies
- **Global Trends**: Worldwide movements affecting ${topic} practices

## Conclusion

Mastering ${topic} requires dedication, continuous learning, and practical application. By following the strategies outlined in this guide, you'll be well-equipped to navigate the challenges and opportunities that lie ahead.

Remember, success in ${topic} is not just about knowing the theory—it's about consistent implementation and adaptation to changing circumstances. Start with the fundamentals, gradually incorporate advanced techniques, and always stay curious about new developments in the field.

## Next Steps

1. **Apply What You've Learned**: Choose one strategy from this guide and implement it this week
2. **Join the Community**: Connect with others who share your interest in ${topic}
3. **Continue Learning**: Bookmark this guide and revisit it as you progress on your journey

---

*Generated with BlogGen AI - Free Version*
*Daily Usage: ${usageStats.count + 1}/${DAILY_LIMIT}*
*Want unlimited generations and advanced features? Upgrade to Premium!*`;
      } else {
        // Real API call for content generation
        const response = await fetch(API_CONFIG.BLOG_GENERATION_API, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_CONFIG.API_KEY}`,
          },
          body: JSON.stringify({
            prompt: `Write a comprehensive blog post with the title "${idea.title}". Description: ${idea.description}. 
                     Include introduction, main sections with subheadings, practical examples, and conclusion. 
                     Make it engaging, informative, and well-structured. Target length: 1500-2000 words.`,
            max_tokens: 2500,
            temperature: 0.7
          })
        });

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        
        // Parse response based on your API structure
        if (data.choices && data.choices[0]) {
          // OpenAI-style response
          content = data.choices[0].message.content;
        } else if (data.content) {
          // Custom API response
          content = data.content;
        } else {
          // Direct text response
          content = data.text || data;
        }

        // Add metadata footer
        content = `${content}

---

*Generated with BlogGen AI - Free Version*
*Daily Usage: ${usageStats.count + 1}/${DAILY_LIMIT}*
*Want unlimited generations and advanced features? Upgrade to Premium!*`;
      }

      // Create blog post object
      const blogPost: BlogPost = {
        id: `blog_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: idea.title,
        content: content,
        excerpt: idea.description,
        category: topic || 'General',
        tags: [topic, 'AI Generated', 'Blog'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        estimatedReadTime: Math.ceil(content.split(' ').length / 200), // Rough estimate: 200 words per minute
        status: 'published' as const
      };

      // Save the blog post
      const saved = saveBlogPost(blogPost);
      
      if (saved) {
        incrementUsage();
        toast.success('Blog content generated and saved successfully!');
        
        // Immediately redirect to blog page
        setTimeout(() => {
          navigate('/blog');
        }, 1000); // Small delay to show success message
      } else {
        toast.error('Failed to save blog post. Please try again.');
      }
      
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error('Failed to generate content. Please check your API configuration.');
    } finally {
      setLoading(false);
    }
  };

  // Load reviews from localStorage and listen for updates
  useEffect(() => {
    const loadReviews = () => {
      const savedReviews = localStorage.getItem('bloggen_reviews');
      if (savedReviews) {
        try {
          setReviews(JSON.parse(savedReviews));
        } catch (error) {
          console.error('Error loading reviews:', error);
        }
      } else {
        // Add some sample reviews
        const sampleReviews: Review[] = [
          {
            id: '1',
            name: 'Sarah Johnson',
            rating: 5,
            comment: 'Amazing tool! Generated incredible blog ideas that boosted my content strategy.',
            date: new Date().toISOString()
          },
          {
            id: '2',
            name: 'Mike Chen',
            rating: 4,
            comment: 'Great AI-powered content generation. Saved me hours of brainstorming.',
            date: new Date().toISOString()
          },
          {
            id: '3',
            name: 'Emily Rodriguez',
            rating: 5,
            comment: 'The premium features are worth every penny. Professional-quality content!',
            date: new Date().toISOString()
          }
        ];
        setReviews(sampleReviews);
        localStorage.setItem('bloggen_reviews', JSON.stringify(sampleReviews));
      }
    };

    loadReviews();

    // Listen for storage changes to update reviews in real-time
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'bloggen_reviews') {
        loadReviews();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events for same-tab updates
    const handleReviewUpdate = () => {
      loadReviews();
    };
    
    window.addEventListener('reviewsUpdated', handleReviewUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('reviewsUpdated', handleReviewUpdate);
    };
  }, []);

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

  const menuItems = [
    { name: 'Home', href: '#home' },
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Reviews', href: '#reviews' },
    { name: 'Contact', href: '#contact' }
  ];

  const handleGetStarted = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMenuOpen(false);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const resetGenerator = () => {
    setTopic('');
    setBlogIdeas([]);
    setSelectedIdea(null);
    setBlogContent('');
    setShowBlogGenerator(false);
  };

  // Handle start generating button click
  const handleStartGenerating = () => {
    if (!user) {
      toast.error('Please sign in to use the blog generator');
      setAuthModalOpen(true);
      return;
    }
    setShowBlogGenerator(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      {/* Top-Right Menu and Theme Toggle */}
      <div className="fixed top-4 right-4 z-50 flex items-center space-x-3">
        <ThemeToggle />
        
        {/* Hamburger Menu */}
        <div className="relative">
          <motion.button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md px-3 py-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 transition-colors"
            whileTap={{ scale: 0.95 }}
          >
            <Menu className="w-4 h-4" />
            <span className="text-sm font-medium">Menu</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
          </motion.button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                {menuItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => scrollToSection(item.href)}
                    className="block w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    {item.name}
                  </button>
                ))}
                
                {/* Auth buttons in menu when not logged in */}
                {!user && (
                  <>
                    <div className="border-t border-gray-200 dark:border-gray-700"></div>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        handleGetStarted('login');
                      }}
                      className="block w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        handleGetStarted('signup');
                      }}
                      className="block w-full text-left px-4 py-3 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors font-medium"
                    >
                      Get Started Free
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* BlogGen AI Logo and Title at Top */}
      <div className="pt-8 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center justify-center space-x-3"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                BlogGen AI
              </h1>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Create Amazing{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Blog Content
              </span>{' '}
              with AI
            </h2>

            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
              Generate engaging blog ideas instantly and create full content with our AI-powered platform. 
              From brainstorming to publishing, we've got you covered.
            </p>

            {/* Free Blog Generator Section */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
                    Try Free Blog Generator
                  </h3>
                  {user && (
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {usageStats.count}/{DAILY_LIMIT} today
                    </div>
                  )}
                </div>

                {!showBlogGenerator ? (
                  <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {user 
                        ? `Get ${DAILY_LIMIT} free blog generations per day. Enter a topic to start!`
                        : `Sign in to get ${DAILY_LIMIT} free blog generations per day!`
                      }
                    </p>
                    <motion.button
                      onClick={handleStartGenerating}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:from-green-600 hover:to-blue-600 transition-colors"
                    >
                      {user ? (hasReachedLimit() ? 'Daily Limit Reached' : 'Start Generating') : 'Sign In to Start'}
                    </motion.button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Topic Input */}
                    {!blogIdeas.length && !selectedIdea && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Enter your topic or hint:
                        </label>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="e.g., sustainable living, web development, cooking..."
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            disabled={loading || hasReachedLimit()}
                            onKeyPress={(e) => e.key === 'Enter' && generateBlogIdeas()}
                          />
                          <motion.button
                            onClick={generateBlogIdeas}
                            disabled={loading || hasReachedLimit()}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center"
                          >
                            {loading ? <LoadingSpinner size="sm" /> : <Sparkles className="w-4 h-4" />}
                          </motion.button>
                        </div>
                      </div>
                    )}

                    {/* Blog Ideas */}
                    {blogIdeas.length > 0 && !selectedIdea && (
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            Choose a blog idea:
                          </h4>
                          <button
                            onClick={resetGenerator}
                            className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                          >
                            Start Over
                          </button>
                        </div>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {blogIdeas.map((idea) => (
                            <motion.div
                              key={idea.id}
                              whileHover={{ scale: 1.01 }}
                              className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors group"
                              onClick={() => generateBlogContent(idea)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <h5 className="font-medium text-gray-900 dark:text-white mb-1">
                                    {idea.title}
                                  </h5>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {idea.description}
                                  </p>
                                </div>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="ml-3 bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                  Generate Full Content
                                </motion.button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Loading State */}
                    {loading && (
                      <div className="text-center py-8">
                        <LoadingSpinner size="lg" />
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                          {selectedIdea ? 'Generating full content and redirecting to blog page...' : 'Generating blog ideas...'}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Daily Limit Warning */}
                {user && hasReachedLimit() && (
                  <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <div className="flex items-center">
                      <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                          Daily limit reached!
                        </p>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300">
                          Upgrade for unlimited generations or try again tomorrow.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Only show Get Started buttons when NOT logged in */}
            {!user && (
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
            )}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Choose Your Plan
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Start free and upgrade when you need more power
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Free</h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-4">$0</p>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li>• 3 blog generations/day</li>
                <li>• Basic AI-powered ideas</li>
                <li>• Simple content generation</li>
                <li>• Community support</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
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
                <li>• Unlimited generations</li>
                <li>• Advanced AI models</li>
                <li>• Content editing tools</li>
                <li>• Export in multiple formats</li>
                <li>• Email support</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Pro</h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-4">$10<span className="text-sm">/month</span></p>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li>• Everything in Starter</li>
                <li>• Premium AI models</li>
                <li>• SEO optimization</li>
                <li>• Team collaboration</li>
                <li>• Priority support</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
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
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
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
      </section>

      {/* Reviews Section - Automatically displays user submissions */}
      <section id="reviews" className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              What Our Users Say
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Real feedback from content creators using BlogGen AI
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center mb-4">
                  <div className="flex space-x-1 mr-3">
                    {renderStars(review.rating)}
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(review.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4 italic">
                  "{review.comment}"
                </p>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm font-semibold">
                      {review.name.charAt(0)}
                    </span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {review.name}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {reviews.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                No reviews yet. Be the first to share your experience!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Join thousands of content creators using BlogGen AI
            </p>
            {/* Only show Get Started button when NOT logged in */}
            {!user && (
              <motion.button
                onClick={() => handleGetStarted('signup')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-semibold text-lg shadow-lg"
              >
                Start Creating Today
              </motion.button>
            )}
          </motion.div>
        </div>
      </section>

      {/* Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />

      <RatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
      />
    </div>
  );
};

export default Welcome;
