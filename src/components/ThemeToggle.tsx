
import React from 'react';
import { motion } from 'framer-motion';
import {Sun, Moon} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <motion.div
        initial={false}
        animate={{ 
          rotate: theme === 'dark' ? 180 : 0,
          scale: theme === 'dark' ? 1.1 : 1
        }}
        transition={{ 
          duration: 0.4, 
          type: 'spring',
          stiffness: 200,
          damping: 10
        }}
      >
        {theme === 'light' ? (
          <Sun className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
        ) : (
          <Moon className="w-5 h-5 text-blue-500 dark:text-blue-400" />
        )}
      </motion.div>
      
      {/* Visual indicator */}
      <motion.div
        className="absolute inset-0 rounded-lg"
        initial={false}
        animate={{
          backgroundColor: theme === 'dark' 
            ? 'rgba(59, 130, 246, 0.1)' 
            : 'rgba(251, 191, 36, 0.1)'
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
};

export default ThemeToggle;
