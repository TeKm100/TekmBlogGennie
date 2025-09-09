
import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuth } from './hooks/useAuth'
import { useTheme } from './hooks/useTheme'
import Welcome from './pages/Welcome'
import Dashboard from './pages/Dashboard'
import Blog from './pages/Blog'
import Settings from './pages/Settings'
import Upgrade from './pages/Upgrade'
import LoadingSpinner from './components/LoadingSpinner'
import RatingModal from './components/RatingModal'

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner />
      </div>
    )
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />
}

function App() {
  const { resolvedTheme, isAuthenticated } = useTheme()

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 5000,
          style: { 
            background: resolvedTheme === 'dark' ? '#374151' : '#ffffff',
            color: resolvedTheme === 'dark' ? '#ffffff' : '#1f2937',
            borderRadius: '12px',
            padding: '16px',
            border: resolvedTheme === 'dark' ? '1px solid #4b5563' : '1px solid #e5e7eb'
          },
          success: { 
            style: { 
              background: '#10b981',
              color: '#fff',
              border: 'none'
            } 
          },
          error: { 
            style: { 
              background: '#ef4444',
              color: '#fff',
              border: 'none'
            } 
          },
          loading: {
            style: {
              background: '#6366f1',
              color: '#fff',
              border: 'none'
            }
          }
        }}
      />
      
      <Router>
        <div className="min-h-screen transition-colors duration-300">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Welcome />} />
            <Route path="/blog" element={<Blog />} />
            
            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/upgrade" 
              element={
                <ProtectedRoute>
                  <Upgrade />
                </ProtectedRoute>
              } 
            />
            
            {/* Redirect any unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>

      {/* Rating Modal for authenticated users */}
      {isAuthenticated && <RatingModal />}
    </>
  )
}

export default App
