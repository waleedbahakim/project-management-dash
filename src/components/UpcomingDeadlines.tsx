import React from 'react';
import { motion } from 'framer-motion';
import { 
  CalendarIcon, 
  ClockIcon, 
  ExclamationCircleIcon 
} from '@heroicons/react/24/outline';
import { format, formatDistanceToNow, isPast, isFuture, isToday, addDays, isWithinInterval } from 'date-fns';
import { Task } from '@/types';

interface UpcomingDeadlinesProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

const UpcomingDeadlines: React.FC<UpcomingDeadlinesProps> = ({ tasks, onTaskClick }) => {
  // Get only tasks with due dates, sorted by closest due date
  const tasksWithDueDates = tasks
    .filter(task => task.dueDate && task.status !== 'done') // Filter out completed tasks
    .sort((a, b) => {
      const dateA = new Date(a.dueDate!);
      const dateB = new Date(b.dueDate!);
      return dateA.getTime() - dateB.getTime();
    })
    .slice(0, 5); // Show only the closest 5
  
  // Get deadline status and styling
  const getDeadlineStatus = (dueDate: string) => {
    const date = new Date(dueDate);
    const today = new Date();
    
    if (isPast(date) && !isToday(date)) {
      return {
        label: 'Overdue',
        className: 'text-red-600 dark:text-red-400 font-medium',
        icon: <ExclamationCircleIcon className="h-4 w-4 text-red-500" />
      };
    } else if (isToday(date)) {
      return {
        label: 'Due Today',
        className: 'text-orange-600 dark:text-orange-400 font-medium',
        icon: <ClockIcon className="h-4 w-4 text-orange-500" />
      };
    } else if (isWithinInterval(date, { start: today, end: addDays(today, 3) })) {
      return {
        label: 'Upcoming',
        className: 'text-yellow-600 dark:text-yellow-400 font-medium',
        icon: <CalendarIcon className="h-4 w-4 text-yellow-500" />
      };
    } else {
      return {
        label: 'Future',
        className: 'text-green-600 dark:text-green-400 font-medium',
        icon: <CalendarIcon className="h-4 w-4 text-green-500" />
      };
    }
  };
  
  // Get priority badge class
  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };
  
  const taskItemVariants = {
    initial: { opacity: 0, y: 10 },
    animate: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.05,
        duration: 0.3
      }
    }),
    hover: {
      y: -3,
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="h-full w-full">
      {tasksWithDueDates.length > 0 ? (
        <div className="space-y-3">
          {tasksWithDueDates.map((task, index) => {
            const deadlineStatus = getDeadlineStatus(task.dueDate!);
            const formattedDate = format(new Date(task.dueDate!), 'MMM d, yyyy');
            
            return (
              <motion.div
                key={task.id}
                className="rounded-lg frosted-glass p-3 cursor-pointer backdrop-blur-sm border border-gray-200 dark:border-gray-700"
                variants={taskItemVariants}
                custom={index}
                initial="initial"
                animate="animate"
                whileHover="hover"
                whileTap={{ scale: 0.98 }}
                onClick={() => onTaskClick(task)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[60%]">
                    {task.title}
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${getPriorityClass(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
                
                <div className="mt-2 flex items-center justify-between text-xs">
                  <div className="flex items-center">
                    {deadlineStatus.icon}
                    <span className={`ml-1 ${deadlineStatus.className}`}>
                      {deadlineStatus.label}
                    </span>
                  </div>
                  <span className="text-gray-500 dark:text-gray-400">
                    {formattedDate}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-sm text-gray-500 dark:text-gray-400">No upcoming deadlines</p>
        </div>
      )}
    </div>
  );
};

export default UpcomingDeadlines; 