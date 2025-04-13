import { useState, useEffect } from 'react';
import { Switch } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { CogIcon } from '@heroicons/react/24/outline';
import { useThemeContext } from '@/components/ThemeProvider';
import ThemeSwitcher from '@/components/ThemeSwitcher';

export default function Settings() {
  const { theme } = useThemeContext();
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };
  
  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate={isLoaded ? "visible" : "hidden"}
    >
      <motion.div 
        className="glass-panel rounded-lg p-6 backdrop-blur-sm transform-3d"
        variants={itemVariants}
        whileHover={{ 
          y: -5, 
          boxShadow: '0 20px 30px rgba(0, 0, 0, 0.1), 0 0 10px var(--neon-glow)' 
        }}
      >
        <motion.h2 
          className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center"
          whileHover={{ x: 2 }}
        >
          Theme Preferences
        </motion.h2>
        
        <div className="space-y-4">
          <motion.div 
            className="flex items-center justify-between p-4 frosted-glass rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div>
              <motion.h3 
                className="text-sm font-medium text-gray-800 dark:text-white"
                whileHover={{ x: 2 }}
              >
                Theme Selection
              </motion.h3>
              <motion.p 
                className="text-sm text-gray-500 dark:text-gray-400 max-w-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ delay: 0.3 }}
              >
                Choose between light, dark, or system-defined appearance
              </motion.p>
            </div>
            <ThemeSwitcher size="md" />
          </motion.div>

          <motion.div 
            className="flex items-center justify-between p-4 frosted-glass rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div>
              <motion.h3 
                className="text-sm font-medium text-gray-800 dark:text-white"
                whileHover={{ x: 2 }}
              >
                Current Theme
              </motion.h3>
              <motion.p 
                className="text-sm text-gray-500 dark:text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ delay: 0.4 }}
              >
                {theme === 'light' ? 'Light Mode' : theme === 'dark' ? 'Dark Mode' : 'System Default'}
              </motion.p>
            </div>
            <div className="h-8 w-8 rounded-full bg-primary-500 dark:bg-primary-600 shadow-lg shadow-primary-500/30 dark:shadow-primary-600/30 flex items-center justify-center">
              <span className="text-white text-xs">{theme === 'light' ? 'L' : theme === 'dark' ? 'D' : 'S'}</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
      
      <motion.div 
        className="glass-panel rounded-lg p-6 backdrop-blur-sm transform-3d"
        variants={itemVariants}
        whileHover={{ 
          y: -5, 
          boxShadow: '0 20px 30px rgba(0, 0, 0, 0.1), 0 0 10px var(--neon-glow)' 
        }}
      >
        <motion.h2 
          className="text-lg font-medium text-gray-900 dark:text-white mb-4"
          whileHover={{ x: 2 }}
        >
          Other Settings
        </motion.h2>
        <motion.div 
          className="p-4 frosted-glass rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.p 
            className="text-gray-500 dark:text-gray-400 mb-4"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 0.5, 1], 
            }}
            transition={{ 
              duration: 1,
              times: [0, 0.5, 1],
              delay: 0.5
            }}
          >
            Additional settings and customization options will be available in future updates.
          </motion.p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
} 