import { useState, useEffect } from 'react';
import { useTaskStore } from '@/store/taskStore';
import { format } from 'date-fns';
import { Task, TaskPriority, TaskStatus } from '@/types';
import { 
  PencilIcon, 
  TrashIcon, 
  ArrowDownIcon, 
  ArrowUpIcon,
  FunnelIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  ClockIcon,
  ChatBubbleBottomCenterTextIcon,
  TagIcon,
  UserIcon,
  CheckIcon,
  XMarkIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import TaskModal from '@/components/TaskModal';

type SortField = 'title' | 'priority' | 'status' | 'dueDate' | 'createdAt';
type SortDirection = 'asc' | 'desc';

export default function Tasks() {
  const { tasks, deleteTask, updateTask } = useTaskStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isTaskDetailsModalOpen, setIsTaskDetailsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | undefined>(undefined);
  const [viewingTask, setViewingTask] = useState<Task | undefined>(undefined);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Open modal to edit task
  const handleEditTask = (task: Task, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setCurrentTask(task);
    setIsTaskModalOpen(true);
  };

  // Open modal to create new task
  const handleCreateTask = () => {
    setCurrentTask(undefined);
    setIsTaskModalOpen(true);
  };

  // Open modal to view task details
  const handleViewTaskDetails = (task: Task) => {
    setViewingTask(task);
    setIsTaskDetailsModalOpen(true);
  };

  // Close task details modal
  const closeTaskDetailsModal = () => {
    setIsTaskDetailsModalOpen(false);
  };

  // Handle updating task status
  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    updateTask(taskId, { status: newStatus });
    
    // Update the viewing task if it's currently open
    if (viewingTask && viewingTask.id === taskId) {
      setViewingTask({
        ...viewingTask,
        status: newStatus
      });
    }
  };

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter and sort tasks
  const filteredTasks = tasks
    .filter(task => {
      // Apply search filter
      if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Apply status filter
      if (statusFilter !== 'all' && task.status !== statusFilter) {
        return false;
      }
      
      // Apply priority filter
      if (priorityFilter !== 'all' && task.priority !== priorityFilter) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      const direction = sortDirection === 'asc' ? 1 : -1;
      
      switch (sortField) {
        case 'title':
          return direction * a.title.localeCompare(b.title);
        case 'priority': {
          const priorityOrder = { low: 0, medium: 1, high: 2, urgent: 3, none: -1 };
          const aValue = a.priority ? priorityOrder[a.priority] || 0 : 0;
          const bValue = b.priority ? priorityOrder[b.priority] || 0 : 0;
          return direction * (aValue - bValue);
        }
        case 'status': {
          const statusOrder: Record<string, number> = { backlog: 0, todo: 1, 'in-progress': 2, review: 3, done: 4 };
          const aValue = a.status && a.status in statusOrder ? statusOrder[a.status] : 0;
          const bValue = b.status && b.status in statusOrder ? statusOrder[b.status] : 0;
          return direction * (aValue - bValue);
        }
        case 'dueDate':
          if (!a.dueDate) return direction;
          if (!b.dueDate) return -direction;
          return direction * (new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
        case 'createdAt':
        default:
          return direction * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      }
    });

  // Get priority badge class
  const getPriorityBadgeClass = (priority: TaskPriority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border border-red-200 dark:border-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 border border-orange-200 dark:border-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border border-green-200 dark:border-green-800';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600';
    }
  };

  // Get status badge class
  const getStatusBadgeClass = (status?: TaskStatus) => {
    if (!status) return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600';
    
    switch (status) {
      case 'done':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border border-green-200 dark:border-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-800';
      case 'review':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 border border-purple-200 dark:border-purple-800';
      case 'todo':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800';
      case 'backlog':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600';
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
  
  const tableRowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (index: number) => ({ 
      opacity: 1, 
      x: 0,
      transition: {
        delay: 0.1 + (index * 0.03),
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    }),
    hover: { 
      y: -2, 
      backgroundColor: 'rgba(59, 130, 246, 0.04)',
      transition: { duration: 0.2 }
    }
  };

  const headerVariants = {
    initial: { y: -10, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.5 } },
    hover: { color: '#3b82f6', scale: 1.02, transition: { duration: 0.2 } }
  };

  // Animation variants for modals
  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    },
    exit: { 
      opacity: 0, 
      y: 50, 
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setSortField('createdAt');
    setSortDirection('desc');
  };

  return (
    <motion.div 
      className="space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate={isLoaded ? "visible" : "hidden"}
    >
      {/* Search and filters controls */}
      <motion.div 
        className="flex flex-col sm:flex-row sm:items-center justify-end gap-4 py-2"
        variants={itemVariants}
      >
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
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
            onClick={handleCreateTask}
          >
            <PlusIcon className="h-5 w-5 mr-1" />
            Create Task
          </motion.button>
        </div>
      </motion.div>
      
      {/* Task modal for creating/editing tasks */}
      <TaskModal 
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        task={currentTask}
      />
      
      {/* Task Details Modal */}
      <AnimatePresence>
        {isTaskDetailsModalOpen && viewingTask && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeTaskDetailsModal}
          >
            <motion.div
              className="glass-panel rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{viewingTask.title}</h2>
                  <div className="flex items-center mt-1 space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(viewingTask.status)}`}>
                      {viewingTask.status ? viewingTask.status.replace('-', ' ') : 'No status'}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getPriorityBadgeClass(viewingTask.priority)}`}>
                      {viewingTask.priority}
                    </span>
                  </div>
                </div>
                
                <button
                  className="p-2 text-gray-400 hover:text-gray-500 rounded-full"
                  onClick={closeTaskDetailsModal}
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center">
                      <ChatBubbleBottomCenterTextIcon className="w-4 h-4 mr-1" />
                      Description
                    </h3>
                    <div className="text-gray-900 dark:text-white bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg">
                      {viewingTask.description || "No description provided."}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center">
                      <TagIcon className="w-4 h-4 mr-1" />
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {viewingTask.tags && viewingTask.tags.length > 0 ? (
                        viewingTask.tags.map((tag, index) => (
                          <span 
                            key={index} 
                            className="px-2 py-1 text-xs rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300"
                          >
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">No tags</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center">
                      <UserIcon className="w-4 h-4 mr-1" />
                      Assigned To
                    </h3>
                    <div className="text-gray-900 dark:text-white">
                      {viewingTask.assignee || "Unassigned"}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center">
                      <CalendarIcon className="w-4 h-4 mr-1" />
                      Due Date
                    </h3>
                    <div className="text-gray-900 dark:text-white">
                      {viewingTask.dueDate ? format(new Date(viewingTask.dueDate), 'MMM d, yyyy') : 'No due date'}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center">
                      <ClockIcon className="w-4 h-4 mr-1" />
                      Created At
                    </h3>
                    <div className="text-gray-900 dark:text-white">
                      {format(new Date(viewingTask.createdAt), 'MMM d, yyyy, h:mm a')}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Update Status</h3>
                <div className="flex flex-wrap gap-2">
                  {(['backlog', 'todo', 'in-progress', 'review', 'done'] as TaskStatus[]).map((status) => (
                    <motion.button
                      key={status}
                      className={`px-3 py-2 rounded-md text-sm ${
                        viewingTask.status === status
                          ? 'bg-primary-500 text-white'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleStatusChange(viewingTask.id, status)}
                    >
                      {status.replace('-', ' ')}
                    </motion.button>
                  ))}
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-2">
                <motion.button
                  className="btn btn-secondary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    closeTaskDetailsModal();
                    handleEditTask(viewingTask);
                  }}
                >
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Edit Task
                </motion.button>
                <motion.button
                  className="btn btn-danger"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to delete "${viewingTask.title}"?`)) {
                      deleteTask(viewingTask.id);
                      closeTaskDetailsModal();
                    }
                  }}
                >
                  <TrashIcon className="h-4 w-4 mr-2" />
                  Delete Task
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Task modal for creating/editing tasks */}
      <TaskModal 
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        task={currentTask}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        className="glass-panel rounded-lg shadow overflow-hidden transform-3d"
        variants={itemVariants}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="frosted-glass">
              <tr>
                <motion.th 
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('title')}
                  whileHover="hover"
                  variants={headerVariants}
                >
                  <div className="flex items-center">
                    <span>Task</span>
                    {sortField === 'title' && (
                      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.2 }}>
                        {sortDirection === 'asc' ? <ArrowUpIcon className="ml-1 h-4 w-4" /> : <ArrowDownIcon className="ml-1 h-4 w-4" />}
                      </motion.span>
                    )}
                  </div>
                </motion.th>
                <motion.th 
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('priority')}
                  whileHover="hover"
                  variants={headerVariants}
                >
                  <div className="flex items-center">
                    <span>Priority</span>
                    {sortField === 'priority' && (
                      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.2 }}>
                        {sortDirection === 'asc' ? <ArrowUpIcon className="ml-1 h-4 w-4" /> : <ArrowDownIcon className="ml-1 h-4 w-4" />}
                      </motion.span>
                    )}
                  </div>
                </motion.th>
                <motion.th 
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('status')}
                  whileHover="hover"
                  variants={headerVariants}
                >
                  <div className="flex items-center">
                    <span>Status</span>
                    {sortField === 'status' && (
                      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.2 }}>
                        {sortDirection === 'asc' ? <ArrowUpIcon className="ml-1 h-4 w-4" /> : <ArrowDownIcon className="ml-1 h-4 w-4" />}
                      </motion.span>
                    )}
                  </div>
                </motion.th>
                <motion.th 
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('dueDate')}
                  whileHover="hover"
                  variants={headerVariants}
                >
                  <div className="flex items-center">
                    <span>Due Date</span>
                    {sortField === 'dueDate' && (
                      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.2 }}>
                        {sortDirection === 'asc' ? <ArrowUpIcon className="ml-1 h-4 w-4" /> : <ArrowDownIcon className="ml-1 h-4 w-4" />}
                      </motion.span>
                    )}
                  </div>
                </motion.th>
                <motion.th 
                  scope="col" 
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  variants={headerVariants}
                >
                  Actions
                </motion.th>
              </tr>
            </thead>
            <tbody className="backdrop-blur-sm divide-y divide-gray-200 dark:divide-gray-800">
              <AnimatePresence>
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task, index) => (
                    <motion.tr 
                      key={task.id} 
                      className="transition-all backdrop-blur-sm cursor-pointer"
                      variants={tableRowVariants}
                      custom={index}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                      exit={{ opacity: 0, x: -20 }}
                      onClick={() => handleViewTaskDetails(task)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{task.title}</div>
                        {task.description && (
                          <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">{task.description}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <motion.span 
                          className={`px-2 py-1 text-xs rounded-full backdrop-blur-sm ${getPriorityBadgeClass(task.priority)}`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {task.priority}
                        </motion.span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <motion.span 
                          className={`px-2 py-1 text-xs rounded-full backdrop-blur-sm ${getStatusBadgeClass(task.status)}`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {task.status ? task.status.replace('-', ' ') : 'No status'}
                        </motion.span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <motion.button 
                          className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 mr-3"
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => handleEditTask(task, e)}
                        >
                          <PencilIcon className="h-5 w-5" />
                        </motion.button>
                        <motion.button 
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteTask(task.id);
                          }}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <TrashIcon className="h-5 w-5" />
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <motion.div 
                        className="flex flex-col items-center justify-center"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <motion.div 
                          className="w-16 h-16 mb-4 text-gray-300 dark:text-gray-600"
                          animate={{ 
                            opacity: [0.5, 1, 0.5],
                            scale: [1, 1.05, 1] 
                          }}
                          transition={{ 
                            repeat: Infinity,
                            duration: 2,
                            repeatType: "reverse"
                          }}
                        >
                          <svg fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </motion.div>
                        <motion.p 
                          className="text-sm text-gray-500 dark:text-gray-400"
                          animate={{ 
                            y: [0, -3, 0],
                          }}
                          transition={{ 
                            repeat: Infinity,
                            duration: 2,
                            repeatType: "reverse"
                          }}
                        >
                          No tasks found. Create one?
                        </motion.p>
                      </motion.div>
                    </td>
                  </motion.tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
} 