
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './hooks/useAuth';
import { useTheme } from './hooks/useTheme';
import Navbar from './components/Navbar';
import Welcome from './pages/Welcome';
import Dashboard from './pages/Dashboard';
import Blog from './pages/Blog';
import Settings from './pages/Settings';
import Upgrade from './pages/Upgrade';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const { user, loading } = useAuth();
  const { theme } = useTheme();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  return (
    <div className={theme}>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
          <Navbar />
          
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/" 
              element={user ? <Navigate to="/dashboard" replace /> : <Welcome />} 
            />
            
            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={user ? <Dashboard /> : <Navigate to="/" replace />} 
            />
            <Route 
              path="/blog" 
              element={user ? <Blog /> : <Navigate to="/" replace />} 
            />
            <Route 
              path="/settings" 
              element={user ? <Settings /> : <Navigate to="/" replace />} 
            />
            <Route 
              path="/upgrade" 
              element={user ? <Upgrade /> : <Navigate to="/" replace />} 
            />
            
            {/* Catch all route */}
            <Route 
              path="*" 
              element={<Navigate to={user ? "/dashboard" : "/"} replace />} 
            />
          </Routes>

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: theme === 'dark' ? '#374151' : '#ffffff',
                color: theme === 'dark' ? '#ffffff' : '#000000',
                border: theme === 'dark' ? '1px solid #4B5563' : '1px solid #E5E7EB',
              },
            }}
          />
        </div>
      </Router>
    </div>
  );
}

export default App;
