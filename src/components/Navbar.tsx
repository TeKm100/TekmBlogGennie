
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {Menu, X, BookOpen, User, Settings, LogOut, Home, FileText} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import ThemeToggle from './ThemeToggle';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navLinks = user ? [
  { name: 'Dashboard', path: '/dashboard', icon: Home },
  { name: 'Blog', path: '/blog', icon: FileText },
  { name: 'Profile', path: '/settings', icon: User },
  { name: 'Upgrade', path: '/upgrade', icon: Settings }
] : [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Blog', path: '/blog', icon: FileText },
  { name: 'Sign In', path: '/', icon: User } // This will trigger the auth modal
];

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={user ? "/dashboard" : "/"} className="flex items-center space-x-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center"
              >
                <BookOpen className="w-5 h-5 text-white" />
              </motion.div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                BlogGen AI
              </span>
            </Link>
          </div>

          {/* Desktop Navigation - Show Home, Blog, Sign In when NOT logged in */}
          {!user && (
  <div className="hidden md:flex items-center space-x-4">
    {/* Only show the menu icon, not individual links */}
    <ThemeToggle />
    
    <motion.button
      onClick={() => setIsOpen(true)}
      whileTap={{ scale: 0.95 }}
      className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      <Menu className="w-6 h-6" />
    </motion.button>
  </div>
)}

          {/* Toggle Menu Button - Show for logged in users OR mobile when not logged in */}
          <div className={`${user ? 'flex' : 'md:hidden flex'} items-center space-x-2`}>
            {!user && <ThemeToggle />}
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Right-side Slide-out Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
            />
            
            {/* Menu Panel - Right Side Column */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-900 shadow-xl z-50 overflow-y-auto"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      BlogGen AI
                    </span>
                  </div>
                  <motion.button
                    onClick={() => setIsOpen(false)}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>

                {/* User Info - Only show when logged in */}
                {user && (
                  <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Signed in as</p>
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {user.email}
                    </p>
                  </div>
                )}

                {/* Navigation Links - Column Layout */}
                <div className="space-y-2 mb-6">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        location.pathname === link.path
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <link.icon className="w-5 h-5" />
                      <span className="font-medium">{link.name}</span>
                    </Link>
                  ))}
                </div>

                {/* Theme Toggle */}
                <div className="mb-6">
                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Theme</span>
                    <ThemeToggle />
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  {user ? (
                    <motion.button
                      onClick={handleLogout}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium">Sign Out</span>
                    </motion.button>
                  ) : (
                    <Link
                      to="/"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center w-full px-4 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium"
                    >
                      Sign In
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
