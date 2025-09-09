
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import {Lightbulb, Zap, Crown, Check, ArrowRight, Sparkles, Star, Users, Award, Shield} from 'lucide-react'
import { formatCurrency } from '../utils/paystack'
import { lumi } from '../lib/lumi'
import AuthModal from '../components/AuthModal'
import Navbar from '../components/Navbar'

interface Rating {
  _id: string
  user_id: string
  rating: number
  feedback?: string
  created_at: string
}

const Welcome: React.FC = () => {
  const { isAuthenticated } = useAuth()
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode?: 'login' | 'signup' | 'forgot' }>({
    isOpen: false
  })
  const [ratings, setRatings] = useState<Rating[]>([])
  const [averageRating, setAverageRating] = useState(0)

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const ratingsData = await lumi.entities.ratings.list()
        setRatings(ratingsData)
        
        if (ratingsData.length > 0) {
          const avg = ratingsData.reduce((sum, rating) => sum + rating.rating, 0) / ratingsData.length
          setAverageRating(Math.round(avg * 10) / 10)
        }
      } catch (error) {
        console.error('Error fetching ratings:', error)
      }
    }

    fetchRatings()
  }, [])

  const features = [
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: "AI-Powered Ideas",
      description: "Generate unlimited blog ideas with advanced AI technology"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Generation",
      description: "Get professional blog ideas in seconds, not hours"
    },
    {
      icon: <Crown className="w-6 h-6" />,
      title: "Premium Content",
      description: "Full blog posts with editing capabilities for premium users"
    }
  ]

  const plans = [
    {
      name: "Free",
      price: 0,
      features: [
        "Generate blog ideas",
        "Basic templates",
        "5 ideas per day",
        "Community support"
      ],
      cta: "Get Started Free",
      popular: false
    },
    {
      name: "Monthly",
      price: 5,
      features: [
        "Unlimited blog ideas",
        "Full blog generation",
        "Advanced editing tools",
        "Priority support",
        "SEO optimization",
        "Multiple writing styles"
      ],
      cta: "Start Monthly Plan",
      popular: true
    },
    {
      name: "Yearly",
      price: 50,
      originalPrice: 60,
      features: [
        "Everything in Monthly",
        "2 months free",
        "Premium templates",
        "Advanced analytics",
        "Export to multiple formats",
        "Priority feature access"
      ],
      cta: "Best Value - Yearly",
      popular: false
    }
  ]

  const reviews = [
    {
      name: "Sarah Johnson",
      role: "Content Creator",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      rating: 5,
      text: "TekmBlogGenie has revolutionized my content creation process. I can generate high-quality blog posts in minutes!"
    },
    {
      name: "Michael Chen",
      role: "Marketing Manager",
      avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      rating: 5,
      text: "The AI-powered suggestions are incredibly accurate. It's like having a professional writer on my team 24/7."
    },
    {
      name: "Emily Rodriguez",
      role: "Blogger",
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      rating: 5,
      text: "I've tried many content tools, but nothing comes close to the quality and ease of use of TekmBlogGenie."
    }
  ]

  const stats = [
    { icon: <Users className="w-8 h-8" />, value: "50K+", label: "Happy Users" },
    { icon: <Award className="w-8 h-8" />, value: "1M+", label: "Blog Posts Generated" },
    { 
      icon: <Star className="w-8 h-8" />, 
      value: ratings.length > 0 ? `${averageRating}/5` : "4.9/5", 
      label: "User Rating" 
    },
    { icon: <Shield className="w-8 h-8" />, value: "99.9%", label: "Uptime" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 transition-colors duration-300">
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            <span className="text-purple-600 dark:text-purple-400 font-semibold">AI-Powered Blog Creation</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold text-gray-800 dark:text-white mb-6">
            Transform Ideas Into
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
              {" "}Amazing Blogs
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Generate engaging blog ideas instantly with AI, then create full, professional blog posts 
            with our premium features. Perfect for content creators, marketers, and businesses.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isAuthenticated && (
              <button
                onClick={() => setAuthModal({ isOpen: true, mode: 'signup' })}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                Start Creating Free
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
            <Link 
              to="/blog"
              className="border-2 border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200 flex items-center justify-center gap-2"
            >
              Read Our Blog
              <Lightbulb className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-purple-600 dark:text-purple-400 mb-2 flex justify-center">
                {stat.icon}
              </div>
              <div className="text-3xl font-bold text-gray-800 dark:text-white mb-1">{stat.value}</div>
              <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* User Ratings Section */}
      {ratings.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Loved by {ratings.length} User{ratings.length !== 1 ? 's' : ''}
            </h3>
            <div className="flex items-center justify-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-6 h-6 ${
                      i < Math.floor(averageRating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg font-semibold text-gray-800 dark:text-white">
                {averageRating} out of 5
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {ratings.slice(0, 3).map((rating) => (
              <div key={rating._id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                <div className="flex mb-3">
                  {[...Array(rating.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                {rating.feedback && (
                  <p className="text-gray-600 dark:text-gray-300 italic mb-3">"{rating.feedback}"</p>
                )}
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(rating.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Why Choose TekmBlogGenie?</h3>
          <p className="text-gray-600 dark:text-gray-300 text-lg">Powerful features designed for content creators</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-purple-600 dark:text-purple-400 mb-4">
                {feature.icon}
              </div>
              <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">{feature.title}</h4>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">What Our Users Say</h3>
          <p className="text-gray-600 dark:text-gray-300 text-lg">Join thousands of satisfied content creators</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {reviews.map((review, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
              <div className="flex items-center mb-4">
                <img 
                  src={review.avatar} 
                  alt={review.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h5 className="font-semibold text-gray-800 dark:text-white">{review.name}</h5>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{review.role}</p>
                </div>
              </div>
              <div className="flex mb-3">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic">"{review.text}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Simple, Transparent Pricing</h3>
          <p className="text-gray-600 dark:text-gray-300 text-lg">Choose the plan that's right for you</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 relative ${
                plan.popular ? 'ring-2 ring-purple-600 scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-6">
                <h4 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{plan.name}</h4>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-4xl font-bold text-gray-800 dark:text-white">
                    {formatCurrency(plan.price)}
                  </span>
                  {plan.name !== 'Free' && (
                    <span className="text-gray-500 dark:text-gray-400">
                      /{plan.name === 'Monthly' ? 'month' : 'year'}
                    </span>
                  )}
                </div>
                {plan.originalPrice && (
                  <span className="text-gray-500 dark:text-gray-400 line-through text-lg">
                    {formatCurrency(plan.originalPrice)}
                  </span>
                )}
              </div>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button
                onClick={() => setAuthModal({ isOpen: true, mode: 'signup' })}
                className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                  plan.popular
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">Ready to Transform Your Content Creation?</h3>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of content creators who are already using TekmBlogGenie
          </p>
          {!isAuthenticated && (
            <button
              onClick={() => setAuthModal({ isOpen: true, mode: 'signup' })}
              className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              Start Your Free Trial
            </button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p>&copy; 2025 TekmBlogGenie. Built with Lumi.</p>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModal.isOpen}
        onClose={() => setAuthModal({ isOpen: false })}
        initialMode={authModal.mode}
      />
    </div>
  )
}

export default Welcome
