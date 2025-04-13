import { format } from 'date-fns';
import { Task } from '@/types';
import { ClockIcon, UserIcon, TagIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
  columnId?: string;
}

export default function TaskCard({ task, onClick }: TaskCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Get formatted date
  const formattedDate = task.dueDate 
    ? format(new Date(task.dueDate), 'MMM d')
    : null;
  
  // Priority color mapping
  const priorityColors = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-300 dark:border-green-700',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700',
    high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 border-orange-300 dark:border-orange-700',
    urgent: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-300 dark:border-red-700',
    none: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-700',
  };

  // Task completion progress
  const progress = task.subtasks?.length 
    ? task.subtasks.filter(st => st.completed).length / task.subtasks.length
    : 0;

  // Animation variants
  const cardVariants = {
    initial: { 
      scale: 1,
      y: 0, 
      rotateX: 0,
      rotateY: 0, 
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.08)'
    },
    hover: { 
      scale: 1.02, 
      y: -5, 
      rotateX: 2,
      rotateY: 2, 
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)'
    }
  };

  return (
    <motion.div 
      className="rounded-lg p-3 cursor-pointer transform-3d backdrop-blur-sm border border-transparent"
      style={{ 
        backgroundColor: 'var(--glass-background)',
        borderTop: '1px solid var(--glass-highlight)',
        borderLeft: '1px solid var(--glass-highlight)',
        boxShadow: 'var(--panel-shadow)',
      }}
      initial="initial"
      whileHover="hover"
      variants={cardVariants}
      transition={{ 
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-start">
        <motion.h3 
          className="font-medium text-gray-900 dark:text-white text-sm"
          animate={{ 
            y: isHovered ? -1 : 0,
            scale: isHovered ? 1.02 : 1
          }}
          transition={{ duration: 0.2 }}
        >
          {task.title}
        </motion.h3>
        <motion.span 
          className={`px-2 py-1 text-xs rounded-full border ${priorityColors[task.priority]}`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {task.priority}
        </motion.span>
      </div>
      
      {task.description && (
        <motion.p 
          className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2"
          animate={{ opacity: isHovered ? 0.9 : 0.7 }}
          transition={{ duration: 0.2 }}
        >
          {task.description}
        </motion.p>
      )}

      {task.subtasks && task.subtasks.length > 0 && (
        <motion.div 
          className="mt-2 w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
          initial={{ opacity: 0.7 }}
          animate={{ opacity: isHovered ? 1 : 0.7 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div 
            className="h-full bg-primary-500 rounded-full"
            initial={{ width: `${progress * 100}%` }}
            animate={{ 
              width: `${progress * 100}%`,
              backgroundColor: isHovered ? '#2563eb' : '#3b82f6'
            }}
            transition={{ duration: 0.4 }}
          />
        </motion.div>
      )}
      
      <motion.div 
        className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400"
        animate={{ y: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2, delay: 0.1 }}
      >
        {formattedDate && (
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05, color: '#3b82f6' }}
          >
            <ClockIcon className="h-3 w-3 mr-1" />
            <span>{formattedDate}</span>
          </motion.div>
        )}
        
        {task.assignedTo && (
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05, color: '#3b82f6' }}
          >
            <UserIcon className="h-3 w-3 mr-1" />
            <span>{task.assignedTo}</span>
          </motion.div>
        )}
        
        {task.tags && task.tags.length > 0 && (
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05, color: '#3b82f6' }}
          >
            <TagIcon className="h-3 w-3 mr-1" />
            <span>{task.tags[0]}{task.tags.length > 1 ? ` +${task.tags.length - 1}` : ''}</span>
          </motion.div>
        )}
      </motion.div>

      {isHovered && (
        <motion.div
          className="absolute -top-1 -right-1 text-primary-500"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <CheckCircleIcon className="h-5 w-5" />
        </motion.div>
      )}
    </motion.div>
  );
} 