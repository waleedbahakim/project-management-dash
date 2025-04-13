import { useState, useEffect } from 'react';
import { useUIStore } from '@/store/uiStore';
import { Switch } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { CogIcon, SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';

export default function Settings() {
  const { theme, setThemeMode } = useUIStore();
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
  
  const buttonVariants = {
    inactive: { 
      scale: 1,
      backgroundColor: 'var(--frosted-glass-background)',
      boxShadow: 'none' 
    },
    active: { 
      scale: 1.05, 
      backgroundColor: 'var(--glass-background)',
      boxShadow: 'var(--primary-glow)'
    },
    hover: { 
      scale: 1.03, 
      y: -2,
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)' 
    },
    tap: { 
      scale: 0.97, 
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' 
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
            <div className="flex space-x-3 items-center">
              <motion.button
                onClick={() => setThemeMode('light')}
                className={`px-3 py-2 text-sm rounded-lg flex items-center gap-2 frosted-glass ${
                  theme.mode === 'light'
                    ? 'border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
                variants={buttonVariants}
                initial="inactive"
                animate={theme.mode === 'light' ? 'active' : 'inactive'}
                whileHover="hover"
                whileTap="tap"
              >
                <SunIcon className="h-4 w-4" />
                Light
              </motion.button>
              <motion.button
                onClick={() => setThemeMode('dark')}
                className={`px-3 py-2 text-sm rounded-lg flex items-center gap-2 frosted-glass ${
                  theme.mode === 'dark'
                    ? 'border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
                variants={buttonVariants}
                initial="inactive"
                animate={theme.mode === 'dark' ? 'active' : 'inactive'}
                whileHover="hover"
                whileTap="tap"
              >
                <MoonIcon className="h-4 w-4" />
                Dark
              </motion.button>
              <motion.button
                onClick={() => setThemeMode('system')}
                className={`px-3 py-2 text-sm rounded-lg flex items-center gap-2 frosted-glass ${
                  theme.mode === 'system'
                    ? 'border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
                variants={buttonVariants}
                initial="inactive"
                animate={theme.mode === 'system' ? 'active' : 'inactive'}
                whileHover="hover"
                whileTap="tap"
              >
                <ComputerDesktopIcon className="h-4 w-4" />
                System
              </motion.button>
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