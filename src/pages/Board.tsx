import { useState, useEffect, useCallback, useMemo } from 'react';
import { useTaskStore } from '@/store/taskStore';
import { Task, TaskPriority, TaskStatus } from '@/types';
import { PlusIcon, FunnelIcon, MagnifyingGlassIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import TaskCard from '@/features/Tasks/TaskCard';
import { motion, AnimatePresence } from 'framer-motion';
import { lazy, Suspense } from 'react';
import TaskModal from '@/components/TaskModal';

// Create a memoized version of TaskCard wrapper
const MemoizedTaskCard = lazy(() => import('@/features/Tasks/TaskCard'));

// Loading fallback for lazy-loaded components
const TaskCardSkeleton = () => (
  <div className="animate-pulse rounded-lg p-3 bg-gray-100/50 dark:bg-gray-800/50">
    <div className="flex justify-between">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
    </div>
    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mt-2"></div>
    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mt-1"></div>
    <div className="flex mt-2 space-x-2">
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
    </div>
  </div>
);

export default function Board() {
  const { tasks, columns, moveTask } = useTaskStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [activeColumn, setActiveColumn] = useState('todo');
  
  // Track which columns are visible in viewport
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);

  useEffect(() => {
    // Use IntersectionObserver to track visible columns
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const columnId = entry.target.getAttribute('data-column-id');
          if (columnId) {
            if (entry.isIntersecting) {
              setVisibleColumns(prev => [...prev, columnId]);
            } else {
              setVisibleColumns(prev => prev.filter(id => id !== columnId));
            }
          }
        });
      },
      { threshold: 0.1 }
    );
    
    // Observe all columns
    document.querySelectorAll('[data-column-id]').forEach(column => {
      observer.observe(column);
    });
    
    return () => observer.disconnect();
  }, [columns.length]);

  useEffect(() => {
    // Delay the initial animation to reduce jank
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setAssigneeFilter('all');
  };

  // Get tasks for a specific column - memoized
  const getColumnTasks = useCallback((columnId: string): Task[] => {
    let columnTasks = columns.find(col => col.id === columnId)?.tasks || [];
    
    // Convert any string IDs to actual Task objects
    let taskList = columnTasks.map(item => {
      if (typeof item === 'string') {
        return tasks.find(t => t.id === item) || { 
          id: item, 
          title: 'Unknown Task', 
          description: '', 
          priority: 'none' as TaskPriority, 
          createdAt: '', 
          updatedAt: '' 
        };
      }
      return item;
    });
    
    // Apply filters if they are set
    if (searchQuery) {
      taskList = taskList.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    if (statusFilter !== 'all') {
      taskList = taskList.filter(task => task.status === statusFilter);
    }
    
    if (priorityFilter !== 'all') {
      taskList = taskList.filter(task => task.priority === priorityFilter);
    }
    
    if (assigneeFilter === 'unassigned') {
      taskList = taskList.filter(task => !task.assignee);
    } else if (assigneeFilter === 'me') {
      taskList = taskList.filter(task => task.assignee === 'Current User'); // Replace with actual current user logic
    } else if (assigneeFilter !== 'all') {
      taskList = taskList.filter(task => task.assignee === assigneeFilter);
    }
    
    return taskList;
  }, [columns, tasks, searchQuery, statusFilter, priorityFilter, assigneeFilter]);

  // Handler for drag start
  const handleDragStart = useCallback((e: React.DragEvent<HTMLDivElement>, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  }, []);

  // Handler for drag over
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  // Handler for drop
  const handleDrop = useCallback((e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    moveTask(taskId, columnId as any);
  }, [moveTask]);

  // Handler for adding a task to a specific column
  const handleAddTaskToColumn = (columnId: string) => {
    setActiveColumn(columnId);
    setIsTaskModalOpen(true);
  };

  // Memoize animation variants to prevent re-renders
  const animations = useMemo(() => ({
    containerVariants: {
      hidden: { opacity: 0 },
      visible: { 
        opacity: 1,
        transition: {
          staggerChildren: 0.05,
          when: "beforeChildren",
          duration: 0.3
        }
      }
    },
    
    itemVariants: {
      hidden: { opacity: 0, y: 10 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 24,
          duration: 0.2
        }
      }
    },

    columnVariants: {
      hidden: { opacity: 0, x: -10 },
      visible: (index: number) => ({ 
        opacity: 1, 
        x: 0,
        transition: {
          delay: 0.05 + (Math.min(index, 3) * 0.03),
          type: "spring",
          stiffness: 300,
          damping: 24,
          duration: 0.2
        }
      }),
      hover: { 
        scale: 1.01, 
        y: -2,
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08), 0 0 10px rgba(59, 130, 246, 0.15)',
      }
    }
  }), []);

  return (
    <motion.div 
      className="h-full flex flex-col space-y-4"
      variants={animations.containerVariants}
      initial="hidden"
      animate={isLoaded ? "visible" : "hidden"}
      style={{ willChange: 'contents' }}
    >
      {/* Page controls - without background card */}
      <motion.div 
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2"
        variants={animations.itemVariants}
      >
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center ml-auto">
          <motion.div 
            className="relative"
            whileHover={{ scale: 1.02 }}
          >
            <input
              type="text"
              placeholder="Search tasks..."
              className="frosted-glass pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 focus:border-primary-500 dark:focus:border-primary-500 focus:ring-primary-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
            </div>
          </motion.div>
          
          <motion.button
            type="button"
            className="btn btn-secondary p-2"
            onClick={() => setShowFilters(!showFilters)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FunnelIcon className="h-5 w-5" />
          </motion.button>
          
          <motion.button 
            className="btn btn-primary"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsTaskModalOpen(true)}
          >
            <PlusIcon className="h-5 w-5 mr-1" />
            Create Task
          </motion.button>
        </div>
      </motion.div>

      {/* Task modal */}
      <TaskModal 
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        initialStatus={activeColumn} 
      />
      
      <AnimatePresence>
        {showFilters && (
          <motion.div 
            className="glass-panel rounded-lg p-4"
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <div className="flex flex-col space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                  <select 
                    className="frosted-glass input w-full rounded-lg border border-gray-200 dark:border-gray-700"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as TaskStatus | 'all')}
                  >
                    <option value="all">All Statuses</option>
                    <option value="backlog">Backlog</option>
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="done">Done</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
                  <select 
                    className="frosted-glass input w-full rounded-lg border border-gray-200 dark:border-gray-700"
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value as TaskPriority | 'all')}
                  >
                    <option value="all">All Priorities</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assignee</label>
                  <select 
                    className="frosted-glass input w-full rounded-lg border border-gray-200 dark:border-gray-700"
                    value={assigneeFilter}
                    onChange={(e) => setAssigneeFilter(e.target.value)}
                  >
                    <option value="all">All Assignees</option>
                    <option value="unassigned">Unassigned</option>
                    <option value="me">Assigned to me</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end">
                <motion.button
                  className="btn btn-secondary flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetFilters}
                >
                  <ArrowPathIcon className="h-4 w-4 mr-1" />
                  Reset Filters
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div 
        className="flex-1 overflow-x-auto custom-scrollbar"
        variants={animations.itemVariants}
        style={{ willChange: 'transform' }}
      >
        <div className="h-full flex gap-4 pb-8 content-start">
          {columns.map((column, index) => {
            const isVisible = visibleColumns.includes(column.id) || index < 3;
            const columnTasks = getColumnTasks(column.id);
            
            return (
              <motion.div
                key={column.id}
                data-column-id={column.id}
                className="flex-shrink-0 w-80 flex flex-col h-full transform-3d"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id)}
                variants={animations.columnVariants}
                custom={index}
                whileHover="hover"
                transition={{ duration: 0.2 }}
                style={{ 
                  willChange: isVisible ? 'transform, opacity' : 'auto',
                  transformStyle: 'preserve-3d'
                }}
              >
                <motion.div 
                  className="frosted-glass backdrop-blur-md px-3 py-3 rounded-t-lg flex justify-between items-center"
                >
                  <motion.h3 className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-primary-700 dark:from-primary-400 dark:to-primary-600">
                    {column.name}
                  </motion.h3>
                  <motion.div 
                    className="flex items-center justify-center w-6 h-6 bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 rounded-full text-xs font-medium"
                    whileHover={{ scale: 1.1 }}
                  >
                    {columnTasks.length}
                  </motion.div>
                </motion.div>
                
                <motion.div 
                  className="flex-1 glass-panel backdrop-blur-sm p-2 rounded-b-lg overflow-y-auto scrollbar-hide"
                  style={{ willChange: isVisible ? 'transform' : 'auto' }}
                >
                  <div className="space-y-2 min-h-full">
                    {isVisible ? columnTasks.map((task, taskIndex) => {
                      const taskId = typeof task === 'string' ? task : task.id;
                      
                      return (
                        <motion.div
                          key={taskId}
                          // Using DOM event handler instead of React synthetic event
                          ref={(el) => {
                            if (el) {
                              el.ondragstart = (e) => {
                                e.dataTransfer?.setData('taskId', taskId);
                              };
                            }
                          }}
                          draggable="true"
                          className="cursor-grab active:cursor-grabbing"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ 
                            opacity: 1, 
                            y: 0, 
                            transition: { 
                              delay: Math.min(taskIndex, 5) * 0.03,
                              duration: 0.2
                            }
                          }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          whileHover={{ y: -2 }}
                          style={{ 
                            willChange: 'transform',
                            transformStyle: 'preserve-3d'
                          }}
                        >
                          <Suspense fallback={<TaskCardSkeleton />}>
                            <MemoizedTaskCard task={task} />
                          </Suspense>
                        </motion.div>
                      );
                    }) : (
                      <div className="py-4 text-center text-sm text-gray-500">
                        Loading tasks...
                      </div>
                    )}
                    
                    {isVisible && columnTasks.length === 0 && (
                      <motion.div 
                        className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 text-center text-sm text-gray-500 dark:text-gray-400 h-24 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ 
                          opacity: [0.5, 0.7, 0.5], 
                          transition: { 
                            repeat: Infinity, 
                            duration: 2,
                            repeatType: "mirror" 
                          }
                        }}
                      >
                        <span>Drop tasks here</span>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
} 