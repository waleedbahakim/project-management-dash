import { motion } from 'framer-motion';
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';
import { useThemeContext } from './ThemeProvider';

interface ThemeSwitcherProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function ThemeSwitcher({ size = 'md', className = '' }: ThemeSwitcherProps) {
  const { theme, setThemeMode } = useThemeContext();
  
  const buttonSize = {
    sm: 'p-1.5 text-xs',
    md: 'p-2 text-sm',
    lg: 'p-2.5 text-base',
  };
  
  const iconSize = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };
  
  const buttonVariants = {
    inactive: { 
      scale: 1,
      boxShadow: 'none' 
    },
    active: { 
      scale: 1.05, 
      boxShadow: '0 0 10px rgba(59, 130, 246, 0.4)'
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
    <div className={`flex space-x-1 rounded-lg p-1 frosted-glass ${className}`}>
      <motion.button
        onClick={() => setThemeMode('light')}
        className={`${buttonSize[size]} rounded-md flex items-center gap-1.5 ${
          theme === 'light'
            ? 'bg-white/30 dark:bg-white/10 text-primary-700 dark:text-primary-300'
            : 'text-gray-600 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-white/5'
        }`}
        variants={buttonVariants}
        initial="inactive"
        animate={theme === 'light' ? 'active' : 'inactive'}
        whileHover="hover"
        whileTap="tap"
        aria-label="Light mode"
      >
        <SunIcon className={iconSize[size]} />
        {size !== 'sm' && <span>Light</span>}
      </motion.button>
      
      <motion.button
        onClick={() => setThemeMode('dark')}
        className={`${buttonSize[size]} rounded-md flex items-center gap-1.5 ${
          theme === 'dark'
            ? 'bg-white/30 dark:bg-white/10 text-primary-700 dark:text-primary-300'
            : 'text-gray-600 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-white/5'
        }`}
        variants={buttonVariants}
        initial="inactive"
        animate={theme === 'dark' ? 'active' : 'inactive'}
        whileHover="hover"
        whileTap="tap"
        aria-label="Dark mode"
      >
        <MoonIcon className={iconSize[size]} />
        {size !== 'sm' && <span>Dark</span>}
      </motion.button>
      
      <motion.button
        onClick={() => setThemeMode('system')}
        className={`${buttonSize[size]} rounded-md flex items-center gap-1.5 ${
          theme === 'system'
            ? 'bg-white/30 dark:bg-white/10 text-primary-700 dark:text-primary-300'
            : 'text-gray-600 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-white/5'
        }`}
        variants={buttonVariants}
        initial="inactive"
        animate={theme === 'system' ? 'active' : 'inactive'}
        whileHover="hover"
        whileTap="tap"
        aria-label="System theme"
      >
        <ComputerDesktopIcon className={iconSize[size]} />
        {size !== 'sm' && <span>System</span>}
      </motion.button>
    </div>
  );
} 