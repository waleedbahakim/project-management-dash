import { Link, useLocation, useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HomeIcon,
  Squares2X2Icon,
  ClipboardDocumentListIcon,
  CalendarIcon,
  ChartBarIcon,
  CogIcon,
  UsersIcon,
  SparklesIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, dataTour: 'nav-dashboard' },
  { name: 'Board', href: '/dashboard/board', icon: Squares2X2Icon, dataTour: 'nav-board' },
  { name: 'Tasks', href: '/dashboard/tasks', icon: ClipboardDocumentListIcon, dataTour: 'nav-tasks' },
  { name: 'Calendar', href: '/dashboard/calendar', icon: CalendarIcon, dataTour: 'nav-calendar' },
  { name: 'Reports', href: '/dashboard/reports', icon: ChartBarIcon, dataTour: 'nav-reports' },
  { name: 'Team', href: '/dashboard/team', icon: UsersIcon, dataTour: 'nav-team' },
  { name: 'Settings', href: '/dashboard/settings', icon: CogIcon, dataTour: 'nav-settings' },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Animation variants
  const sidebarItemVariants = {
    initial: { x: -20, opacity: 0, rotateY: -10 },
    animate: (index: number) => ({ 
      x: 0, 
      opacity: 1,
      rotateY: 0,
      transition: { 
        delay: index * 0.05, 
        duration: 0.4,
        ease: [0.19, 1, 0.22, 1]
      }
    }),
    hover: { 
      scale: 1.03, 
      x: 5,
      rotateY: 5,
      transition: { duration: 0.2 }
    },
    tap: { 
      scale: 0.97, 
      rotateY: -5,
      transition: { duration: 0.1 }
    }
  };

  // Create a scrolling effect in active nav item
  useEffect(() => {
    const interval = setInterval(() => {
      const activeItem = document.querySelector('.active-nav-glow') as HTMLElement;
      if (activeItem) {
        activeItem.style.backgroundPosition = `${Math.random() * 100}% ${Math.random() * 100}%`;
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  // Handle logout
  const handleLogout = () => {
    // In a real app, you would clear auth tokens, etc.
    // For now, just navigate to sign-in page
    navigate('/signin');
  };

  return (
    <motion.div 
      className="flex flex-col h-full"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        perspective: '1000px',
        transformStyle: 'preserve-3d'
      }}
    >
      {/* Header with 3D effect */}
      <motion.div 
        className="relative overflow-hidden flex items-center justify-center h-20 bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-800 dark:to-primary-900 rounded-br-[30px]"
        initial={{ y: -20, opacity: 0, rotateX: -20 }}
        animate={{ y: 0, opacity: 1, rotateX: 0 }}
        transition={{ delay: 0.1, duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Decorative elements */}
        <motion.div
          className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-primary-400 opacity-20 mix-blend-overlay"
          animate={{ 
            x: [0, 10, 0],
            y: [0, 15, 0]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        />
        <motion.div
          className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-primary-300 opacity-20 mix-blend-overlay"
          animate={{ 
            x: [0, -15, 0],
            y: [0, -10, 0]
          }}
          transition={{ 
            duration: 7, 
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        
        <div className="relative z-10 flex items-center">
          <motion.div
            className="mr-2 rounded-full bg-white/10 p-1.5"
            whileHover={{ rotate: 180, scale: 1.1 }}
            transition={{ duration: 0.5 }}
          >
            <SparklesIcon className="h-6 w-6 text-white" />
          </motion.div>
          <motion.h1 
            className="text-xl font-bold text-white gradient-text"
            initial={{ backgroundPosition: "0% 0%" }}
            animate={{ backgroundPosition: "100% 0%" }}
            transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}
          >
            ProjectHub
          </motion.h1>
        </div>
      </motion.div>

      <nav className="flex-1 overflow-y-auto py-6 px-4" style={{ perspective: '1000px' }} data-tour="nav">
        <ul className="space-y-2.5">
          {navigation.map((item, index) => {
            const isActive = location.pathname === item.href;
            const isHovered = hoveredItem === item.name;
            
            return (
              <motion.li 
                key={item.name}
                variants={sidebarItemVariants}
                custom={index}
                initial="initial"
                animate="animate"
                whileHover="hover"
                whileTap="tap"
                style={{ transformStyle: 'preserve-3d' }}
                onMouseEnter={() => setHoveredItem(item.name)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <Link
                  to={item.href}
                  className={clsx(
                    'flex items-center px-4 py-3 text-sm font-medium rounded-xl group transition-all relative overflow-hidden transform-3d',
                    isActive
                      ? 'frosted-glass text-primary-700 dark:text-primary-100 shadow-lg active-nav-item'
                      : 'text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-300 hover:bg-gray-100/30 dark:hover:bg-gray-800/30'
                  )}
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: isHovered ? 'translateZ(8px)' : 'translateZ(0px)',
                    transition: 'transform 0.3s ease'
                  }}
                  data-tour={item.dataTour}
                >
                  {isActive && (
                    <motion.div 
                      className="absolute inset-0 bg-primary-100/30 dark:bg-primary-900/30 rounded-xl -z-10 active-nav-glow"
                      layoutId="activeNavBackground"
                      transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
                      style={{
                        boxShadow: '0 5px 15px rgba(59, 130, 246, 0.2)',
                        background: 'linear-gradient(45deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.05))',
                        backgroundSize: '200% 200%'
                      }}
                    />
                  )}
                  <motion.span 
                    className={clsx(
                      'p-1.5 mr-3 rounded-lg flex-shrink-0 flex items-center justify-center',
                      isActive
                        ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400'
                        : 'text-gray-500 group-hover:text-primary-600 dark:text-gray-400 dark:group-hover:text-primary-300'
                    )}
                    style={{ 
                      transformStyle: 'preserve-3d',
                      transform: `translateZ(${isHovered ? 12 : 0}px) rotateY(${isHovered ? 15 : 0}deg)`
                    }}
                  >
                    <item.icon className="h-5 w-5" aria-hidden="true" />
                  </motion.span>
                  
                  <span style={{ 
                    transformStyle: 'preserve-3d',
                    transform: `translateZ(${isHovered ? 8 : 0}px)`
                  }}>
                    {item.name}
                  </span>
                  
                  {isActive && (
                    <motion.div 
                      className="absolute right-3 h-2 w-2 rounded-full bg-primary-500 dark:bg-primary-400"
                      layoutId="activeNavIndicator"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      style={{ 
                        boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)',
                        transformStyle: 'preserve-3d',
                        transform: 'translateZ(15px)'
                      }}
                    />
                  )}
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <motion.div 
        className="p-4 mt-auto backdrop-blur-sm border-t border-white/10 dark:border-gray-700/40"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        style={{ 
          background: 'rgba(255, 255, 255, 0.03)',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '0px',
          transformStyle: 'preserve-3d'
        }}
      >
        <motion.button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl text-red-500 dark:text-red-400 hover:bg-red-50/20 dark:hover:bg-red-900/20 transition-all transform-3d"
          whileHover={{ 
            scale: 1.03, 
            x: 5, 
            boxShadow: '0 8px 16px rgba(239, 68, 68, 0.15)'
          }}
          whileTap={{ scale: 0.97 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <motion.span 
            className="p-1.5 mr-3 rounded-lg flex-shrink-0 flex items-center justify-center text-red-500 dark:text-red-400"
            style={{ transformStyle: 'preserve-3d' }}
            whileHover={{ rotate: 15 }}
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
          </motion.span>
          <span style={{ transformStyle: 'preserve-3d' }}>Logout</span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
} 