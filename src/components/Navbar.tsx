
import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {Sparkles, Menu, X, LogOut, User, Settings as SettingsIcon} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import ThemeToggle from './ThemeToggle'
import AuthModal from './AuthModal'

const Navbar: React.FC = () => {
  const { isAuthenticated, user, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode?: 'login' | 'signup' | 'forgot' }>({
    isOpen: false
  })

  const handleSignOut = () => {
    signOut()
    setIsUserMenuOpen(false)
    navigate('/')
  }

  const navItems = [
    { label: 'Blog', path: '/blog' },
    ...(isAuthenticated ? [
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Settings', path: '/settings' }
    ] : [])
  ]

  return (
    <>
      <nav className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-800 dark:text-white">TekmBlogGenie</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              
              <ThemeToggle />

              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <User className="w-5 h-5" />
                    <span className="hidden lg:block">{user?.userName || 'User'}</span>
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-800 dark:text-white">{user?.userName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                      </div>
                      <div className="p-1">
                        <Link
                          to="/settings"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 w-full p-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                        >
                          <SettingsIcon className="w-4 h-4" />
                          Settings
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-2 w-full p-2 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setAuthModal({ isOpen: true, mode: 'login' })}
                    className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setAuthModal({ isOpen: true, mode: 'signup' })}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Get Started
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 dark:text-gray-300"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4">
              <div className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      location.pathname === item.path
                        ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
                        : 'text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-gray-600 dark:text-gray-300">Theme</span>
                  <ThemeToggle />
                </div>

                {isAuthenticated ? (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium text-gray-800 dark:text-white">{user?.userName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2 w-full px-3 py-2 text-left text-red-600 dark:text-red-400"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2 flex flex-col gap-2">
                    <button
                      onClick={() => {
                        setAuthModal({ isOpen: true, mode: 'login' })
                        setIsMobileMenuOpen(false)
                      }}
                      className="px-3 py-2 text-left text-gray-600 dark:text-gray-300"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => {
                        setAuthModal({ isOpen: true, mode: 'signup' })
                        setIsMobileMenuOpen(false)
                      }}
                      className="mx-3 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Get Started
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModal.isOpen}
        onClose={() => setAuthModal({ isOpen: false })}
        initialMode={authModal.mode}
      />
    </>
  )
}

export default Navbar
