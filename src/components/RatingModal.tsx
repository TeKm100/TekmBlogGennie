
import React, { useState, useEffect } from 'react'
import {Star, X, ThumbsUp} from 'lucide-react'
import { lumi } from '../lib/lumi'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'

interface Rating {
  _id: string
  user_id: string
  rating: number
  feedback?: string
  created_at: string
}

const RatingModal: React.FC = () => {
  const { user } = useAuth()
  const [isVisible, setIsVisible] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const checkRatingStatus = async () => {
      if (!user) return

      try {
        // Check if user has already rated or dismissed
        const userPrefs = await lumi.entities.user_preferences.list({
          filter: { user_id: user.userId }
        })

        const prefs = userPrefs[0]
        if (!prefs?.show_rating_modal) {
          return // Don't show modal
        }

        // Check if user has already rated
        const existingRating = await lumi.entities.ratings.list({
          filter: { user_id: user.userId }
        })

        if (existingRating.length === 0) {
          // Show modal after a short delay
          setTimeout(() => setIsVisible(true), 2000)
        }
      } catch (error) {
        console.error('Error checking rating status:', error)
      }
    }

    checkRatingStatus()
  }, [user])

  const handleSubmitRating = async () => {
    if (!user || rating === 0) return

    setIsSubmitting(true)
    try {
      await lumi.entities.ratings.create({
        user_id: user.userId,
        rating,
        feedback: feedback.trim() || undefined,
        created_at: new Date().toISOString()
      })

      toast.success('Thank you for your feedback!')
      setIsVisible(false)
    } catch (error) {
      toast.error('Failed to submit rating')
      console.error('Rating submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRemindLater = async () => {
    // Keep show_rating_modal as true for next login
    setIsVisible(false)
  }

  const handleDontShowAgain = async () => {
    if (!user) return

    try {
      const userPrefs = await lumi.entities.user_preferences.list({
        filter: { user_id: user.userId }
      })

      if (userPrefs.length > 0) {
        await lumi.entities.user_preferences.update(userPrefs[0]._id, {
          show_rating_modal: false
        })
      } else {
        await lumi.entities.user_preferences.create({
          user_id: user.userId,
          show_rating_modal: false,
          theme: 'system',
          email_notifications: true
        })
      }

      setIsVisible(false)
    } catch (error) {
      console.error('Error updating preferences:', error)
      setIsVisible(false)
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Rate TekmBlogGenie</h2>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ThumbsUp className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            How would you rate your experience with TekmBlogGenie so far?
          </p>
        </div>

        {/* Star Rating */}
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="transition-colors"
            >
              <Star
                className={`w-8 h-8 ${
                  star <= (hoverRating || rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300 dark:text-gray-600'
                }`}
              />
            </button>
          ))}
        </div>

        {/* Feedback */}
        {rating > 0 && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tell us more (optional)
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="What do you like most about TekmBlogGenie?"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
              rows={3}
              maxLength={500}
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {rating > 0 && (
            <button
              onClick={handleSubmitRating}
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Rating'}
            </button>
          )}
          
          <div className="flex gap-3">
            <button
              onClick={handleRemindLater}
              className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Remind me later
            </button>
            <button
              onClick={handleDontShowAgain}
              className="flex-1 text-gray-500 dark:text-gray-400 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Don't show again
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RatingModal
