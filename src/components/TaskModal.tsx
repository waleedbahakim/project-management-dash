import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Task, TaskPriority } from '@/types';
import { useTaskStore } from '@/store/taskStore';

type TaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  task?: Task; // For editing existing task
  initialStatus?: string; // For new tasks
};

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, task, initialStatus = 'todo' }) => {
  const { addTask, updateTask } = useTaskStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [status, setStatus] = useState(initialStatus);
  const [dueDate, setDueDate] = useState('');
  const [assignee, setAssignee] = useState('');

  // If editing existing task, populate form fields
  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setPriority(task.priority || 'medium');
      setStatus(task.status || initialStatus);
      setDueDate(task.dueDate || '');
      setAssignee(task.assignee || '');
    } else {
      // Reset form for new task
      setTitle('');
      setDescription('');
      setPriority('medium');
      setStatus(initialStatus);
      setDueDate('');
      setAssignee('');
    }
  }, [task, initialStatus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return; // Require at least a title
    
    const taskData = {
      title,
      description,
      priority,
      status,
      updatedAt: new Date().toISOString(),
      dueDate: dueDate || undefined,
      assignee: assignee || undefined,
    };
    
    if (task) {
      // Update existing task
      updateTask(task.id, taskData);
    } else {
      // Create new task
      addTask(taskData);
    }
    
    onClose();
  };

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };
  
  const modalVariants = {
    hidden: { opacity: 0, y: -20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: 'spring', damping: 25, stiffness: 300 }
    },
    exit: { opacity: 0, y: 20, scale: 0.95 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm dark:bg-black/50"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={overlayVariants}
          onClick={onClose}
        >
          <motion.div 
            className="glass-panel mx-4 w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700/50">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {task ? 'Edit Task' : 'Create Task'}
              </h2>
              <button 
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                onClick={onClose}
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title*
                  </label>
                  <input
                    type="text"
                    className="frosted-glass w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-primary-500/50"
                    placeholder="Task title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    className="frosted-glass w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-primary-500/50"
                    placeholder="Task description"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Priority
                    </label>
                    <select
                      className="frosted-glass w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-primary-500/50"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as TaskPriority)}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Status
                    </label>
                    <select
                      className="frosted-glass w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-primary-500/50"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="backlog">Backlog</option>
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="review">Review</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Due Date
                    </label>
                    <input
                      type="date"
                      className="frosted-glass w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-primary-500/50"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Assignee
                    </label>
                    <input
                      type="text"
                      className="frosted-glass w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-primary-500/50"
                      placeholder="Assign to"
                      value={assignee}
                      onChange={(e) => setAssignee(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  {task ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TaskModal; 