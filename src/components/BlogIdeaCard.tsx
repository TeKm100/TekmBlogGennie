
import React, { useState } from 'react'
import {Copy, Check, Zap, Crown} from 'lucide-react'

interface BlogIdeaCardProps {
  idea: {
    title: string
    outline: string[]
  }
  showPremiumFeatures?: boolean
  onGenerateFullPost?: () => void
}

const BlogIdeaCard: React.FC<BlogIdeaCardProps> = ({ 
  idea, 
  showPremiumFeatures = false,
  onGenerateFullPost 
}) => {
  const [copied, setCopied] = useState(false)

  // Defensive programming to prevent undefined errors
  const title = idea?.title || 'Untitled Blog Idea'
  const outline = idea?.outline || []

  const handleCopy = async () => {
    const content = `${title}\n\nOutline:\n${outline.map(point => `• ${point}`).join('\n')}`
    
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-4 hover:shadow-xl transition-shadow duration-300 border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold text-purple-700 pr-4 leading-tight">
          {title}
        </h3>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              copied 
                ? 'bg-green-500 text-white' 
                : 'bg-purple-500 hover:bg-purple-600 text-white'
            }`}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
          
          {showPremiumFeatures && onGenerateFullPost && (
            <button
              onClick={onGenerateFullPost}
              className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600 transition-all duration-200"
            >
              <Zap size={16} />
              Generate Post
            </button>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-600 mb-2">Outline:</p>
        {outline.map((point, index) => (
          <div key={index} className="flex items-start gap-2">
            <span className="text-purple-500 mt-1 text-sm">•</span>
            <p className="text-gray-700 text-sm leading-relaxed">{point}</p>
          </div>
        ))}
      </div>

      {!showPremiumFeatures && (
        <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
          <div className="flex items-center gap-2 text-purple-700">
            <Crown size={16} />
            <span className="text-sm font-medium">
              Upgrade to Premium to generate full blog posts from this idea
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default BlogIdeaCard
