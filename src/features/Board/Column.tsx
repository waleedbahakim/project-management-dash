import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { useUIStore } from '@/store/uiStore';
import { Column as ColumnType, Task } from '@/types';
import TaskCard from '../Tasks/TaskCard';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { AnimatePresence, motion } from 'framer-motion';
import { PlusIcon, EllipsisHorizontalIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
  boardId: string;
}

export default function Column({ column, tasks, boardId }: ColumnProps) {
  const { theme } = useUIStore();
  const { createTask, updateColumn, deleteColumn } = useWorkspaceStore();
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Set up sortable
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: 'column',
      column,
    },
  });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    zIndex: isDragging ? 10 : 1,
  };
  
  // Add a new task to this column
  const handleAddTask = () => {
    setIsAddingTask(true);
    // Open the create task modal
    // For now, just create a placeholder task
    createTask(boardId, column.id, {
      title: 'New Task',
      description: 'Task description',
      priority: 'medium',
      tags: [],
      updatedAt: new Date().toISOString()
    });
    
    // Simulate task creation delay
    setTimeout(() => setIsAddingTask(false), 800);
  };
  
  // Animation variants
  const columnVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      filter: 'blur(8px)',
      scale: 0.95,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      filter: 'blur(0px)',
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 20,
        mass: 0.8
      }
    },
    exit: { 
      opacity: 0,
      x: -30, 
      filter: 'blur(8px)',
      scale: 0.9,
      transition: {
        duration: 0.3,
        ease: 'easeInOut'
      }
    },
    drag: {
      scale: 1.02,
      boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
      zIndex: 20
    }
  };
  
  // Task list animation variants
  const taskListVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        when: "beforeChildren"
      }
    }
  };
  
  // Empty column variants
  const emptyColumnVariants = {
    initial: { opacity: 0.6, scale: 0.95 },
    hover: { opacity: 1, scale: 1, borderColor: '#3b82f6', borderWidth: 2 }
  };
  
  // Add button variants
  const buttonVariants = {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { duration: 0.3 } },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.1 } },
    exit: { scale: 0.9, opacity: 0, transition: { duration: 0.2 } }
  };
  
  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      variants={columnVariants}
      initial="hidden"
      animate={isDragging ? "drag" : "visible"}
      exit="exit"
      className="flex-shrink-0 w-80 flex flex-col bg-transparent rounded-lg transform-3d"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Column Header */}
      <motion.div 
        className="flex items-center justify-between p-2 text-white rounded-t-lg cursor-grab glass-panel bg-primary-600/90 dark:bg-primary-700/80"
        {...listeners}
        whileHover={{ filter: 'brightness(1.1)' }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center">
          <motion.span 
            className="font-medium"
            animate={{ y: [0, isHovered ? -1 : 0], fontWeight: isHovered ? 600 : 500 }}
            transition={{ duration: 0.2 }}
          >
            {column.name}
          </motion.span>
          <motion.span 
            className="ml-2 bg-white bg-opacity-30 text-white text-xs font-medium px-2 py-0.5 rounded-full"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            animate={{ 
              backgroundColor: tasks.length > 0 ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.15)',
              y: [0, isHovered ? -1 : 0]
            }}
          >
            {tasks.length}
          </motion.span>
        </div>
        
        <div className="flex space-x-1">
          <motion.button 
            className="p-1.5 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
            whileHover={{ rotate: 15, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <EllipsisHorizontalIcon className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>
      
      {/* Column Content */}
      <motion.div 
        className="flex-1 rounded-b-lg p-3 min-h-[100px] max-h-[calc(100vh-220px)] overflow-y-auto custom-scrollbar task-column"
        variants={{
          visible: { opacity: 1, y: 0 },
          hidden: { opacity: 0, y: 10 }
        }}
        animate={isDragging ? { scale: 0.98 } : { scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <SortableContext 
          items={tasks.map(task => task.id)}
          strategy={verticalListSortingStrategy}
        >
          <motion.div
            variants={taskListVariants}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            <AnimatePresence>
              {tasks.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  variants={buttonVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  whileHover="hover"
                  className="mb-3"
                >
                  <TaskCard 
                    task={task} 
                    columnId={column.id}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </SortableContext>
        
        {tasks.length === 0 && (
          <motion.div 
            className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-md transition-all"
            variants={emptyColumnVariants}
            initial="initial"
            whileHover="hover"
            animate={isHovered ? "hover" : "initial"}
          >
            <motion.p 
              className="text-sm text-gray-400 dark:text-gray-400"
              animate={{ y: isHovered ? -3 : 0, opacity: isHovered ? 1 : 0.7 }}
              transition={{ duration: 0.2 }}
            >
              Drop tasks here
            </motion.p>
          </motion.div>
        )}
        
        {/* Add Task Button */}
        <motion.button 
          onClick={handleAddTask}
          className="w-full mt-3 py-2 rounded-md frosted-glass text-primary-500 dark:text-primary-400 flex items-center justify-center text-sm transition-all disabled:opacity-50"
          disabled={isAddingTask}
          variants={buttonVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
          animate={isAddingTask ? "exit" : "initial"}
        >
          <PlusIcon className="w-4 h-4 mr-1" />
          {isAddingTask ? "Adding..." : "Add Task"}
        </motion.button>
      </motion.div>
    </motion.div>
  );
} 