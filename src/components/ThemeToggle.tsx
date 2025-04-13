import { useThemeContext } from '@/components/ThemeProvider';
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function ThemeToggle({ className = '', size = 'md', showLabel = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useThemeContext();
  
  const iconSize = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };
  
  const buttonSize = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3',
  };
  
  const getIcon = () => {
    switch (theme) {
      case 'dark':
        return <MoonIcon className={`${iconSize[size]} text-primary-400 dark:text-primary-300`} />;
      case 'light':
        return <SunIcon className={`${iconSize[size]} text-yellow-500`} />;
      case 'system':
        return <ComputerDesktopIcon className={`${iconSize[size]} text-gray-500 dark:text-gray-400`} />;
      default:
        return <SunIcon className={`${iconSize[size]} text-yellow-500`} />;
    }
  };
  
  const getLabel = () => {
    switch (theme) {
      case 'dark':
        return 'Dark';
      case 'light':
        return 'Light';
      case 'system':
        return 'System';
      default:
        return 'Light';
    }
  };
  
  return (
    <motion.button
      onClick={toggleTheme}
      className={`${buttonSize[size]} rounded-full bg-white/10 dark:bg-gray-800/30 backdrop-blur-md border border-gray-200/30 dark:border-gray-700/30 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:bg-opacity-30 focus:outline-none shadow-lg ${className}`}
      whileHover={{ scale: 1.1, rotate: 15 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center gap-2">
        {getIcon()}
        {showLabel && <span className="text-sm font-medium">{getLabel()}</span>}
      </div>
    </motion.button>
  );
} 