
import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'
import { lumi } from '../lib/lumi'

type Theme = 'light' | 'dark' | 'system'

export function useTheme() {
  const { user, isAuthenticated } = useAuth()
  const [theme, setTheme] = useState<Theme>('system')
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')

  // Load theme preference
  useEffect(() => {
    const loadTheme = async () => {
      if (isAuthenticated && user) {
        try {
          // Load from user preferences
          const prefs = await lumi.entities.user_preferences.list({
            filter: { user_id: user.userId }
          })
          
          if (prefs.length > 0 && prefs[0].theme) {
            setTheme(prefs[0].theme as Theme)
          } else {
            // Create default preferences
            await lumi.entities.user_preferences.create({
              user_id: user.userId,
              theme: 'system',
              email_notifications: true,
              show_rating_modal: true
            })
          }
        } catch (error) {
          console.error('Error loading theme preference:', error)
          // Fallback to localStorage
          const stored = localStorage.getItem('theme') as Theme
          if (stored && ['light', 'dark', 'system'].includes(stored)) {
            setTheme(stored)
          }
        }
      } else {
        // Load from localStorage for non-authenticated users
        try {
          const stored = localStorage.getItem('theme') as Theme
          if (stored && ['light', 'dark', 'system'].includes(stored)) {
            setTheme(stored)
          }
        } catch {
          setTheme('system')
        }
      }
    }

    loadTheme()
  }, [isAuthenticated, user])

  // Apply theme
  useEffect(() => {
    const root = window.document.documentElement
    
    const updateTheme = () => {
      let newTheme: 'light' | 'dark'
      
      if (theme === 'system') {
        newTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      } else {
        newTheme = theme
      }
      
      setResolvedTheme(newTheme)
      
      root.classList.remove('light', 'dark')
      root.classList.add(newTheme)
    }

    updateTheme()
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (theme === 'system') {
        updateTheme()
      }
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  const setThemeWithPersistence = async (newTheme: Theme) => {
    setTheme(newTheme)
    
    // Save to localStorage
    try {
      localStorage.setItem('theme', newTheme)
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error)
    }

    // Save to user preferences if authenticated
    if (isAuthenticated && user) {
      try {
        const prefs = await lumi.entities.user_preferences.list({
          filter: { user_id: user.userId }
        })

        if (prefs.length > 0) {
          await lumi.entities.user_preferences.update(prefs[0]._id, {
            theme: newTheme
          })
        } else {
          await lumi.entities.user_preferences.create({
            user_id: user.userId,
            theme: newTheme,
            email_notifications: true,
            show_rating_modal: true
          })
        }
      } catch (error) {
        console.error('Failed to save theme preference:', error)
      }
    }
  }

  return {
    theme,
    resolvedTheme,
    isAuthenticated,
    setTheme: setThemeWithPersistence
  }
}
