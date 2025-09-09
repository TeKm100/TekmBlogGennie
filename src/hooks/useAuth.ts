
import { useState, useEffect } from 'react'
import { lumi } from '../lib/lumi'

interface User {
  userId: string
  email: string
  userName: string
  createdTime: string
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(lumi.auth.isAuthenticated)
  const [user, setUser] = useState<User | null>(lumi.auth.user)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = lumi.auth.onAuthChange(({ isAuthenticated, user }) => {
      setIsAuthenticated(isAuthenticated)
      setUser(user)
      setLoading(false)
    })
    
    setLoading(false)
    return unsubscribe
  }, [])

  const signIn = async () => {
    try {
      const { user } = await lumi.auth.signIn()
      return user
    } catch (error) {
      console.error('Sign in failed:', error)
      throw error
    }
  }

  const signOut = () => {
    lumi.auth.signOut()
  }

  return { 
    user, 
    isAuthenticated, 
    loading, 
    signIn, 
    signOut 
  }
}
