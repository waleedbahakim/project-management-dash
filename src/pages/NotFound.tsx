import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HomeIcon } from '@heroicons/react/24/outline';

export default function NotFound() {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  return (
    <motion.div 
      className="flex flex-col items-center justify-center min-h-screen px-4 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated background elements */}
      <motion.div 
        className="absolute inset-0 -z-10 overflow-hidden opacity-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1 }}
      >
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-primary-500/20 backdrop-blur-xl"
            style={{
              width: Math.random() * 300 + 50,
              height: Math.random() * 300 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            initial={{ 
              x: Math.random() * 200 - 100, 
              y: Math.random() * 200 - 100,
              opacity: 0 
            }}
            animate={{ 
              x: Math.random() * 200 - 100, 
              y: Math.random() * 200 - 100, 
              opacity: 0.5 
            }}
            transition={{ 
              repeat: Infinity, 
              repeatType: "reverse", 
              duration: Math.random() * 10 + 10,
              delay: Math.random() * 5
            }}
          />
        ))}
      </motion.div>
      
      <div className="text-center max-w-lg glass-panel rounded-xl backdrop-blur-xl p-10 transform-3d">
        <motion.h1 
          className="text-9xl font-bold gradient-text"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 10, delay: 0.2 }}
        >
          404
        </motion.h1>
        
        <motion.div
          className="mt-4 relative"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <motion.div
            className="absolute inset-0 bg-primary-500/10 rounded-lg blur-xl -z-10"
            animate={{ 
              boxShadow: ["0px 0px 0px rgba(59, 130, 246, 0)", "0px 0px 20px rgba(59, 130, 246, 0.5)", "0px 0px 0px rgba(59, 130, 246, 0)"] 
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          <motion.h2 
            className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Page not found
          </motion.h2>
        </motion.div>
        
        <motion.p 
          className="mt-4 text-base text-gray-500 dark:text-gray-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          Sorry, we couldn't find the page you're looking for.
        </motion.p>
        
        <motion.div 
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <Link to="/">
            <motion.button
              className="frosted-glass px-6 py-3 rounded-lg flex items-center justify-center space-x-2 text-primary-700 dark:text-primary-300 border border-primary-300 dark:border-primary-700"
              whileHover={{ 
                scale: 1.05, 
                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1), 0 0 10px rgba(59, 130, 246, 0.4)' 
              }}
              whileTap={{ scale: 0.98 }}
            >
              <HomeIcon className="h-5 w-5" />
              <span className="font-medium">Go back home</span>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
} 