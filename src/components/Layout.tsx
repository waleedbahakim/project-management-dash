import { useState, useEffect, useRef, useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { 
  Bars3Icon, 
  XMarkIcon, 
  MoonIcon, 
  SunIcon, 
  ChevronUpIcon,
  HomeIcon,
  Squares2X2Icon,
  ClipboardDocumentListIcon,
  CalendarIcon,
  ChartBarIcon,
  UsersIcon,
  CogIcon,
  BellIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import { useUIStore } from '@/store/uiStore';
import Sidebar from '@/features/Sidebar/Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

// Map routes to page titles and icons
const pageConfig = {
  '/dashboard': { title: 'Dashboard', icon: HomeIcon },
  '/dashboard/board': { title: 'Project Board', icon: Squares2X2Icon },
  '/dashboard/tasks': { title: 'Tasks', icon: ClipboardDocumentListIcon },
  '/dashboard/calendar': { title: 'Calendar', icon: CalendarIcon },
  '/dashboard/reports': { title: 'Reports', icon: ChartBarIcon },
  '/dashboard/team': { title: 'Team', icon: UsersIcon },
  '/dashboard/settings': { title: 'Settings', icon: CogIcon },
};

export default function Layout() {
  const { sidebarCollapsed, toggleSidebar, theme, setThemeMode } = useUIStore();
  const [mounted, setMounted] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [time, setTime] = useState(new Date());
  const mainContentRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  
  // Get current page config based on route
  const currentPage = pageConfig[location.pathname as keyof typeof pageConfig] || { 
    title: 'Project Management', 
    icon: HomeIcon 
  };
  
  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Check if mobile on mount and when window resizes
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
  // Avoid hydration mismatch by only rendering theme toggle client-side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Apply the theme based on storage or system preference
  useEffect(() => {
    const root = window.document.documentElement;
    
    if (theme.mode === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.remove('light', 'dark');
      root.classList.add(systemTheme);
    } else {
      root.classList.remove('light', 'dark');
      root.classList.add(theme.mode);
    }
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (theme.mode === 'system') {
        const systemTheme = mediaQuery.matches ? 'dark' : 'light';
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(systemTheme);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Show/hide scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      if (mainContentRef.current) {
        setShowScrollTop(mainContentRef.current.scrollTop > 300);
      }
    };
    
    const mainContent = mainContentRef.current;
    if (mainContent) {
      mainContent.addEventListener('scroll', handleScroll);
      return () => mainContent.removeEventListener('scroll', handleScroll);
    }
  }, []);
  
  const scrollToTop = () => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const toggleTheme = () => {
    if (theme.mode === 'light') {
      setThemeMode('dark');
    } else if (theme.mode === 'dark') {
      setThemeMode('system');
    } else {
      setThemeMode('light');
    }
  };

  // Animations - memoize to prevent unnecessary recalculations
  const sidebarVariants = useMemo(() => ({
    open: { 
      x: 0,
      transition: { 
        type: 'spring', 
        stiffness: 300, 
        damping: 25 
      }
    },
    closed: { 
      x: '-100%',
      transition: { 
        type: 'spring', 
        stiffness: 400, 
        damping: 40 
      }
    }
  }), []);

  const headerVariants = useMemo(() => ({
    hidden: { y: -20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        duration: 0.4,
        ease: [0.19, 1, 0.22, 1]
      }
    }
  }), []);
  
  const pageTitleVariants = useMemo(() => ({
    exit: { y: -10, opacity: 0, scale: 0.9 },
    enter: { 
      y: 0, 
      opacity: 1,
      scale: 1,
      transition: { 
        duration: 0.4,
        ease: [0.19, 1, 0.22, 1]
      }
    }
  }), []);

  const iconVariants = useMemo(() => ({
    exit: { rotate: -90, opacity: 0, scale: 0.5 },
    enter: { 
      rotate: 0, 
      opacity: 1,
      scale: 1,
      transition: { 
        duration: 0.4,
        ease: [0.19, 1, 0.22, 1]
      }
    },
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: { duration: 0.2 }
    }
  }), []);

  // Only allow sidebar collapse on mobile
  const handleSidebarToggle = () => {
    if (isMobile) {
      toggleSidebar();
    }
  };

  // Determine if sidebar should be collapsed (only on mobile)
  const effectiveSidebarCollapsed = isMobile && sidebarCollapsed;

  // Format current time
  const formattedTime = useMemo(() => {
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, [time]);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Animated Background - will-change for GPU acceleration */}
      <div className="animated-bg will-change-transform"></div>
      
      {/* Sidebar */}
      <motion.div
        initial={effectiveSidebarCollapsed ? 'closed' : 'open'}
        animate={effectiveSidebarCollapsed ? 'closed' : 'open'}
        variants={sidebarVariants}
        className={`fixed inset-y-0 left-0 z-10 w-72 glass-panel transform lg:translate-x-0 lg:static lg:w-auto
          ${effectiveSidebarCollapsed ? '-translate-x-full' : 'translate-x-0'}`}
        style={{ 
          willChange: 'transform',
          borderTopRightRadius: '24px',
          borderBottomRightRadius: '24px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Sidebar />
      </motion.div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Futuristic Header */}
        <motion.header 
          variants={headerVariants}
          initial="hidden"
          animate="visible"
          className="flex items-center justify-between px-6 py-3 z-10 transform-3d"
          style={{ 
            willChange: 'transform, opacity',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(147, 51, 234, 0.05))',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            borderTopLeftRadius: '0px',
            borderTopRightRadius: '0px',
            borderBottomLeftRadius: '12px',
            borderBottomRightRadius: '12px',
          }}
        >
          <div className="flex items-center">
            {isMobile && (
              <motion.button
                onClick={handleSidebarToggle}
                className="lg:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:bg-opacity-30 focus:outline-none icon-hover"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {effectiveSidebarCollapsed ? (
                  <Bars3Icon className="h-6 w-6" />
                ) : (
                  <XMarkIcon className="h-6 w-6" />
                )}
              </motion.button>
            )}
            
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                className="flex items-center"
                initial="exit"
                animate="enter"
                exit="exit"
              >
                <motion.div
                  className="w-10 h-10 flex-shrink-0 mx-2 rounded-xl bg-gradient-to-br from-primary-500/80 to-primary-600/80 flex items-center justify-center shadow-lg"
                  variants={iconVariants}
                  whileHover="hover"
                  style={{ 
                    transformStyle: 'preserve-3d',
                    boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3), 0 0 0 1px rgba(59, 130, 246, 0.2)' 
                  }}
                >
                  <currentPage.icon className="h-5 w-5 text-white" />
                </motion.div>
                
                <motion.div className="ml-2">
                  <motion.div 
                    className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    variants={{
                      exit: { opacity: 0, y: -5 },
                      enter: { opacity: 0.8, y: 0, transition: { duration: 0.3, delay: 0.1 } }
                    }}
                  >
                    Project Management
                  </motion.div>
                  
                  <motion.h1 
                    className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-purple-500"
                    variants={pageTitleVariants}
                    style={{
                      backgroundSize: "200% auto",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      textShadow: "0 1px 2px rgba(0,0,0,0.1)"
                    }}
                  >
                    {currentPage.title}
                  </motion.h1>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Time Display */}
            <motion.div 
              className="hidden md:flex items-center text-gray-600 dark:text-gray-300 bg-white/10 dark:bg-gray-800/30 backdrop-blur-md px-3 py-1 rounded-full border border-gray-200/30 dark:border-gray-700/30"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-sm font-medium">{formattedTime}</span>
            </motion.div>
            
            {/* Notification Button */}
            <motion.button
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:bg-opacity-30 focus:outline-none relative"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <BellIcon className="h-5 w-5" />
              <motion.div
                className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.button>
            
            {/* Theme Toggle */}
            {mounted && (
              <ThemeToggle />
            )}
            
            {/* User Profile */}
            <motion.div
              className="hidden md:flex items-center rounded-full bg-white/5 border border-gray-200/20 dark:border-gray-700/30 p-1 pl-2"
              whileHover={{ scale: 1.02, boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}
              data-tour="user-menu"
            >
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300 mr-2">John Doe</span>
              <motion.div
                className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-purple-400 flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <UserCircleIcon className="h-6 w-6 text-white" />
              </motion.div>
            </motion.div>
          </div>
        </motion.header>

        {/* Main content area */}
        <main 
          ref={mainContentRef} 
          className="flex-1 overflow-auto p-4 custom-scrollbar"
          style={{ willChange: 'scroll-position' }}
        >
          <Outlet />
        </main>
        
        {/* Scroll to top button */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={scrollToTop}
              className="floating-action-btn"
              style={{ willChange: 'transform, opacity' }}
            >
              <ChevronUpIcon className="h-6 w-6" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 