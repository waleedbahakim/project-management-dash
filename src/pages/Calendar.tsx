import { useState, useEffect } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  startOfWeek,
  endOfWeek,
  addDays,
  getDay
} from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import { useTaskStore } from '@/store/taskStore';
import { Task } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

export default function Calendar() {
  const { tasks } = useTaskStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredDay, setHoveredDay] = useState<Date | null>(null);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  // Get calendar days for the current month view - including days from prev/next months to fill the grid
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  // Get all days in the calendar view (includes prev/next month days to fill the grid)
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  
  // Navigation handlers
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const today = () => setCurrentDate(new Date());
  
  // Get tasks for a specific day
  const getTasksForDay = (day: Date): Task[] => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      return isSameDay(new Date(task.dueDate), day);
    });
  };
  
  // Render task badge color by priority
  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
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
  
  const calendarHeaderVariants = {
    initial: { scale: 0.97, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.19, 1, 0.22, 1]
      }
    }
  };
  
  const dayVariants = {
    initial: { scale: 0.9, opacity: 0 },
    animate: (index: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: 0.1 + (index * 0.01),
        duration: 0.3,
        ease: "easeOut"
      }
    }),
    hover: { 
      y: -2, 
      scale: 1.02,
      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1), 0 0 5px rgba(59, 130, 246, 0.3)',
      transition: {
        duration: 0.2
      }
    }
  };
  
  const taskItemVariants = {
    initial: { opacity: 0, x: -5 },
    animate: (index: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.1 + (index * 0.05),
        duration: 0.3
      }
    }),
    hover: {
      scale: 1.02,
      x: 2,
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <motion.div 
      className="space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate={isLoaded ? "visible" : "hidden"}
    >
      {/* Calendar controls only */}
      <motion.div 
        className="flex justify-end items-center py-2"
        variants={itemVariants}
      >
        <motion.div 
          className="flex items-center space-x-2 frosted-glass p-1 rounded-lg"
          whileHover={{ boxShadow: 'var(--primary-glow)' }}
        >
          <motion.button
            onClick={prevMonth}
            className="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </motion.button>
          
          <motion.button
            onClick={today}
            className="px-3 py-1 text-sm font-medium text-primary-700 dark:text-primary-300 frosted-glass rounded-md"
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
          >
            Today
          </motion.button>
          
          <motion.h2 
            className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-purple-500 min-w-[120px] text-center"
            animate={{ 
              scale: [1, 1.03, 1],
              transition: { duration: 1.5, repeat: Infinity, repeatType: "reverse" }
            }}
          >
            {format(currentDate, 'MMMM yyyy')}
          </motion.h2>
          
          <motion.button
            onClick={nextMonth}
            className="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRightIcon className="h-5 w-5" />
          </motion.button>
        </motion.div>
      </motion.div>
      
      <motion.div 
        className="glass-panel rounded-lg overflow-hidden transform-3d"
        variants={itemVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {/* Calendar header */}
        <motion.div 
          className="grid grid-cols-7 frosted-glass border-b border-gray-200 dark:border-gray-700"
          variants={calendarHeaderVariants}
        >
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <motion.div
              key={day}
              className="py-2 text-center text-sm font-semibold text-gray-700 dark:text-gray-300"
              whileHover={{ color: '#3b82f6', scale: 1.05 }}
            >
              {day}
            </motion.div>
          ))}
        </motion.div>
        
        {/* Calendar grid */}
        <div className="grid grid-cols-7 border-gray-200 dark:border-gray-700">
          <AnimatePresence mode="wait">
            {calendarDays.map((day, dayIdx) => {
              const tasksForDay = getTasksForDay(day);
              const isToday = isSameDay(day, new Date());
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isDayHovered = hoveredDay && isSameDay(day, hoveredDay);
              
              return (
                <motion.div
                  key={day.toISOString()}
                  className={`min-h-[120px] border-b border-r border-gray-200 dark:border-gray-700 p-2 relative transform-3d ${
                    !isCurrentMonth ? 'bg-gray-50/40 dark:bg-gray-800/40' : 'transition-all'
                  } ${dayIdx % 7 === 6 ? 'border-r-0' : ''}`}
                  variants={dayVariants}
                  custom={dayIdx}
                  whileHover="hover"
                  onMouseEnter={() => setHoveredDay(day)}
                  onMouseLeave={() => setHoveredDay(null)}
                >
                  <motion.div
                    className={`text-sm font-medium flex items-center justify-center h-7 w-7 ${
                      isToday
                        ? 'rounded-full bg-primary-600 text-white ring-4 ring-primary-200 dark:ring-primary-800/30'
                        : isCurrentMonth
                        ? 'text-gray-900 dark:text-white'
                        : 'text-gray-400 dark:text-gray-600'
                    } ${isToday ? 'mx-auto' : ''}`}
                    whileHover={{ scale: 1.2 }}
                    animate={isDayHovered && !isToday ? { scale: 1.1 } : { scale: 1 }}
                  >
                    {format(day, 'd')}
                  </motion.div>
                  
                  <div className="mt-1 space-y-1 max-h-[90px] overflow-auto scrollbar-hide">
                    <AnimatePresence>
                      {tasksForDay.slice(0, 3).map((task, index) => (
                        <motion.div
                          key={task.id}
                          className="px-2 py-1 text-xs truncate rounded-lg backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 shadow-sm cursor-pointer transform-3d"
                          variants={taskItemVariants}
                          custom={index}
                          initial="initial"
                          animate="animate"
                          whileHover="hover"
                          whileTap={{ scale: 0.98 }}
                          layoutId={`task-${task.id}`}
                        >
                          <div className="flex items-center">
                            <motion.div 
                              className={`h-2 w-2 rounded-full mr-1 ${getPriorityColor(task.priority)}`}
                              whileHover={{ scale: 1.5 }}
                              animate={isDayHovered ? { scale: 1.2 } : { scale: 1 }}
                            />
                            <span className="truncate">{task.title}</span>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                  
                  {tasksForDay.length > 3 && (
                    <motion.div 
                      className="text-xs text-primary-500 dark:text-primary-400 mt-1 font-medium"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{ 
                        scale: 1.05, 
                        color: '#2563eb'
                      }}
                    >
                      +{tasksForDay.length - 3} more
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
} 