
import React from 'react'
import {ArrowLeft, Calendar, User, Clock} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ThemeToggle from '../components/ThemeToggle'

const Blog: React.FC = () => {
  const navigate = useNavigate()

  const blogPosts = [
    {
      id: 1,
      title: "10 AI Tools That Will Transform Your Content Creation in 2025",
      excerpt: "Discover the latest AI-powered tools that are revolutionizing how creators, marketers, and businesses approach content creation.",
      author: "TekmBlogGenie Team",
      date: "2025-01-15",
      readTime: "5 min read",
      image: "https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop",
      category: "AI & Technology"
    },
    {
      id: 2,
      title: "The Ultimate Guide to Blog Content Planning",
      excerpt: "Learn how to create a content calendar that drives engagement and builds a loyal audience for your blog.",
      author: "Content Strategy Team",
      date: "2025-01-12",
      readTime: "8 min read",
      image: "https://images.pexels.com/photos/6224/hands-people-woman-working.jpg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop",
      category: "Content Strategy"
    },
    {
      id: 3,
      title: "Why Every Business Needs a Blog in 2025",
      excerpt: "Explore the compelling reasons why blogging remains one of the most effective marketing strategies for businesses of all sizes.",
      author: "Marketing Insights",
      date: "2025-01-10",
      readTime: "6 min read",
      image: "https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop",
      category: "Business"
    },
    {
      id: 4,
      title: "SEO Best Practices for Blog Writers",
      excerpt: "Master the art of writing SEO-friendly blog posts that rank well in search engines while providing value to readers.",
      author: "SEO Specialists",
      date: "2025-01-08",
      readTime: "7 min read",
      image: "https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop",
      category: "SEO"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">TekmBlogGenie Blog</h1>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Insights & Tips for Content Creators
          </h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Stay updated with the latest trends, strategies, and tools to elevate your content creation game.
          </p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article key={post.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full text-sm font-medium">
                    {post.category}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3 line-clamp-2">
                  {post.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Stay Updated
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Get the latest blog posts and content creation tips delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
              <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Blog
