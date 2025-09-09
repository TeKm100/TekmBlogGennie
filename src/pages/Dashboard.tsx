
import React, { useState, useEffect } from 'react'
import {Plus, Lightbulb, Edit3, Trash2, Crown, Zap, TrendingUp, Calendar} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useSubscription } from '../hooks/useSubscription'
import { generateBlogIdeas, generateFullBlog } from '../utils/aiService'
import { generatePremiumBlogIdeas, generatePremiumFullBlog } from '../utils/premiumAiService'
import { lumi } from '../lib/lumi'
import Navbar from '../components/Navbar'
import BlogIdeaCard from '../components/BlogIdeaCard'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

interface BlogIdea {
  _id?: string
  user_id: string
  title: string
  description: string
  category: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  estimated_time: string
  keywords: string[]
  full_content?: string
  created_at: string
}

const Dashboard: React.FC = () => {
  const { user } = useAuth()
  const { subscription, isLoading: subscriptionLoading } = useSubscription()
  const [blogIdeas, setBlogIdeas] = useState<BlogIdea[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [expandingId, setExpandingId] = useState<string | null>(null)
  const [newIdeaTopic, setNewIdeaTopic] = useState('')
  const [dailyCount, setDailyCount] = useState(0)

  const isPremium = subscription?.status === 'active'
  const dailyLimit = 5

  useEffect(() => {
    if (user) {
      fetchBlogIdeas()
      checkDailyUsage()
    }
  }, [user])

  const fetchBlogIdeas = async () => {
    if (!user) return

    try {
      const ideas = await lumi.entities.blog_posts.list({
        filter: { user_id: user.userId },
        sort: { created_at: -1 }
      })
      setBlogIdeas(ideas)
    } catch (error) {
      console.error('Error fetching blog ideas:', error)
      toast.error('Failed to load blog ideas')
    } finally {
      setLoading(false)
    }
  }

  const checkDailyUsage = async () => {
    if (!user) return

    try {
      const today = new Date().toISOString().split('T')[0]
      const todayIdeas = await lumi.entities.blog_posts.list({
        filter: { 
          user_id: user.userId,
          created_at: { $gte: `${today}T00:00:00.000Z` }
        }
      })
      setDailyCount(todayIdeas.length)
    } catch (error) {
      console.error('Error checking daily usage:', error)
    }
  }

  const handleGenerateIdea = async () => {
    if (!user || !newIdeaTopic.trim()) return

    if (!isPremium && dailyCount >= dailyLimit) {
      toast.error(`Daily limit reached! Upgrade to Premium for unlimited ideas.`)
      return
    }

    setGenerating(true)
    try {
      const ideas = isPremium 
        ? await generatePremiumBlogIdeas(newIdeaTopic)
        : await generateBlogIdeas(newIdeaTopic)

      for (const idea of ideas) {
        const newIdea: BlogIdea = {
          user_id: user.userId,
          title: idea.title,
          description: idea.description,
          category: idea.category,
          difficulty: idea.difficulty,
          estimated_time: idea.estimated_time,
          keywords: idea.keywords,
          created_at: new Date().toISOString()
        }

        const savedIdea = await lumi.entities.blog_posts.create(newIdea)
        setBlogIdeas(prev => [savedIdea, ...prev])
        setDailyCount(prev => prev + 1)
      }

      setNewIdeaTopic('')
      toast.success('Blog ideas generated successfully!')
    } catch (error) {
      console.error('Error generating ideas:', error)
      toast.error('Failed to generate blog ideas')
    } finally {
      setGenerating(false)
    }
  }

  const handleExpandIdea = async (ideaId: string) => {
    if (!isPremium) {
      toast.error('Full blog generation is a Premium feature. Please upgrade!')
      return
    }

    const idea = blogIdeas.find(i => i._id === ideaId)
    if (!idea || idea.full_content) return

    setExpandingId(ideaId)
    try {
      const fullContent = await generatePremiumFullBlog(idea.title, idea.description)
      
      const updatedIdea = await lumi.entities.blog_posts.update(ideaId, {
        full_content: fullContent
      })

      setBlogIdeas(prev => prev.map(i => 
        i._id === ideaId ? { ...i, full_content: fullContent } : i
      ))

      toast.success('Full blog content generated!')
    } catch (error) {
      console.error('Error expanding idea:', error)
      toast.error('Failed to generate full content')
    } finally {
      setExpandingId(null)
    }
  }

  const handleDeleteIdea = async (ideaId: string) => {
    if (window.confirm('Are you sure you want to delete this blog idea?')) {
      try {
        await lumi.entities.blog_posts.delete(ideaId)
        setBlogIdeas(prev => prev.filter(i => i._id !== ideaId))
        toast.success('Blog idea deleted')
      } catch (error) {
        console.error('Error deleting idea:', error)
        toast.error('Failed to delete blog idea')
      }
    }
  }

  if (loading || subscriptionLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                Welcome back, {user?.userName}!
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {isPremium ? 'Premium Account' : `Free Account - ${dailyLimit - dailyCount} ideas remaining today`}
              </p>
            </div>
            
            {!isPremium && (
              <div className="mt-4 md:mt-0">
                <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center gap-2">
                  <Crown className="w-5 h-5" />
                  Upgrade to Premium
                </button>
              </div>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <Lightbulb className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">{blogIdeas.length}</p>
                  <p className="text-gray-600 dark:text-gray-400">Total Ideas</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">{dailyCount}</p>
                  <p className="text-gray-600 dark:text-gray-400">Ideas Today</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    {blogIdeas.filter(idea => idea.full_content).length}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">Full Articles</p>
                </div>
              </div>
            </div>
          </div>

          {/* Generate New Idea */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg mb-8">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Generate New Blog Idea</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                value={newIdeaTopic}
                onChange={(e) => setNewIdeaTopic(e.target.value)}
                placeholder="Enter a topic or keyword..."
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                onKeyPress={(e) => e.key === 'Enter' && handleGenerateIdea()}
              />
              <button
                onClick={handleGenerateIdea}
                disabled={generating || !newIdeaTopic.trim() || (!isPremium && dailyCount >= dailyLimit)}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {generating ? (
                  <>
                    <LoadingSpinner />
                    Generating...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Generate Ideas
                  </>
                )}
              </button>
            </div>
            {!isPremium && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Free users can generate up to {dailyLimit} ideas per day. 
                <span className="text-purple-600 dark:text-purple-400 cursor-pointer hover:underline ml-1">
                  Upgrade for unlimited access.
                </span>
              </p>
            )}
          </div>

          {/* Blog Ideas Grid */}
          {blogIdeas.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {blogIdeas.map((idea) => (
                <BlogIdeaCard
                  key={idea._id}
                  idea={idea}
                  onExpand={handleExpandIdea}
                  onDelete={handleDeleteIdea}
                  isExpanding={expandingId === idea._id}
                  isPremium={isPremium}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Lightbulb className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                No blog ideas yet
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Generate your first blog idea to get started!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
