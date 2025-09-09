
import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'
import { lumi } from '../lib/lumi'
import toast from 'react-hot-toast'

interface Subscription {
  _id: string
  user_id: string
  plan_type: 'free' | 'monthly' | 'yearly'
  status: 'active' | 'expired' | 'cancelled' | 'pending'
  expires_at: string
  amount: number
  currency: string
}

export function useSubscription() {
  const { user, isAuthenticated } = useAuth()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchSubscription = async () => {
    if (!isAuthenticated || !user) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const { list: subscriptions } = await lumi.entities.subscriptions.list({
        filter: { user_id: user.userId },
        sort: { created_at: -1 }
      })

      if (subscriptions && subscriptions.length > 0) {
        setSubscription(subscriptions[0])
      } else {
        // Create default free subscription
        const freeSubscription = await lumi.entities.subscriptions.create({
          user_id: user.userId,
          plan_type: 'free',
          status: 'active',
          payment_reference: '',
          amount: 0,
          currency: 'USD',
          auto_renew: false,
          created_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000 * 5).toISOString(), // 5 years
          updated_at: new Date().toISOString()
        })
        setSubscription(freeSubscription)
      }
    } catch (error) {
      console.error('Failed to fetch subscription:', error)
    } finally {
      setLoading(false)
    }
  }

  const isPremium = () => {
    if (!subscription) return false
    return subscription.plan_type !== 'free' && 
           subscription.status === 'active' && 
           new Date(subscription.expires_at) > new Date()
  }

  const createSubscription = async (planType: 'monthly' | 'yearly', paymentReference: string, amount: number) => {
    if (!user) throw new Error('User not authenticated')

    try {
      const expiresAt = planType === 'monthly' 
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)

      const newSubscription = await lumi.entities.subscriptions.create({
        user_id: user.userId,
        plan_type: planType,
        status: 'active',
        payment_reference: paymentReference,
        amount,
        currency: 'USD',
        auto_renew: true,
        created_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString(),
        updated_at: new Date().toISOString()
      })

      setSubscription(newSubscription)
      toast.success('Subscription activated successfully!')
      return newSubscription
    } catch (error) {
      console.error('Failed to create subscription:', error)
      toast.error('Failed to activate subscription')
      throw error
    }
  }

  useEffect(() => {
    fetchSubscription()
  }, [isAuthenticated, user])

  return {
    subscription,
    loading,
    isPremium: isPremium(),
    createSubscription,
    refetchSubscription: fetchSubscription
  }
}
