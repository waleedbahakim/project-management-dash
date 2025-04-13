import { useState } from 'react';
import { Board } from '@/types';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { useUIStore } from '@/store/uiStore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusIcon, 
  ViewColumnsIcon, 
  ListBulletIcon, 
  CalendarIcon, 
  ChartBarIcon,
  EllipsisHorizontalIcon,
  PencilIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

interface BoardHeaderProps {
  board: Board;
}

export default function BoardHeader({ board }: BoardHeaderProps) {
  const { workspace, createTask, updateBoard } = useWorkspaceStore();
  const { theme, currentView, setCurrentView } = useUIStore();
  const [isEditing, setIsEditing] = useState(false);
  const [boardName, setBoardName] = useState(board.name);
  const [isHovered, setIsHovered] = useState(false);
  
  // Handle view switching
  const handleViewChange = (view: 'board' | 'list' | 'calendar' | 'gantt') => {
    setCurrentView(view);
  };
  
  // Handle board name edit
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBoardName(e.target.value);
  };
  
  // Handle board name submit
  const handleNameSubmit = () => {
    if (boardName.trim() !== '') {
      updateBoard(board.id, { name: boardName });
    } else {
      setBoardName(board.name);
    }
    setIsEditing(false);
  };
  
  // Handle keyboard events for editing
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSubmit();
    } else if (e.key === 'Escape') {
      setBoardName(board.name);
      setIsEditing(false);
    }
  };

  // Animation variants
  const buttonVariants = {
    initial: { scale: 1, y: 0 },
    hover: { scale: 1.05, y: -2 },
    tap: { scale: 0.98, y: 0 }
  };

  const viewButtonVariants = {
    inactive: { 
      scale: 1,
      backgroundColor: 'transparent', 
      color: 'var(--gray-500)'
    },
    active: { 
      scale: 1.05,
      backgroundColor: 'var(--glass-background)',
      color: 'var(--primary-500)',
      boxShadow: 'var(--primary-glow)'
    },
    hover: { 
      scale: 1.05,
      backgroundColor: 'rgba(59, 130, 246, 0.1)'
    }
  };
  
  return (
    <motion.div 
      className="glass-panel backdrop-blur-xl rounded-lg mb-6 p-4 flex items-center justify-between"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center">
        {isEditing ? (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 'auto', opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="flex items-center"
          >
            <motion.input
              type="text"
              value={boardName}
              onChange={handleNameChange}
              onBlur={handleNameSubmit}
              onKeyDown={handleKeyDown}
              autoFocus
              className="text-xl font-bold bg-transparent border-b-2 border-primary-500 focus:outline-none px-1 text-gray-900 dark:text-white"
              initial={{ width: 0 }}
              animate={{ width: 'auto' }}
              transition={{ duration: 0.3 }}
            />
            <motion.button
              onClick={handleNameSubmit}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="ml-2 p-1 rounded-full bg-primary-500 text-white"
            >
              <CheckIcon className="w-4 h-4" />
            </motion.button>
          </motion.div>
        ) : (
          <motion.h1 
            className="text-xl font-bold gradient-text flex items-center cursor-pointer transition-colors"
            onClick={() => setIsEditing(true)}
            whileHover={{ scale: 1.02, x: 2 }}
            transition={{ duration: 0.2 }}
          >
            {board.name}
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <PencilIcon className="w-4 h-4 ml-2" />
            </motion.span>
          </motion.h1>
        )}
        <motion.span 
          className="ml-4 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full"
          animate={{ y: isHovered ? -1 : 0, opacity: isHovered ? 1 : 0.8 }}
          whileHover={{ scale: 1.05 }}
        >
          {board.columns.reduce((total, column) => total + column.tasks.length, 0)} tasks
        </motion.span>
      </div>
      
      <div className="flex space-x-3">
        {/* View Switcher */}
        <motion.div 
          className="flex frosted-glass rounded-lg p-1.5 mr-2"
          whileHover={{ boxShadow: 'var(--primary-glow)' }}
        >
          <AnimatePresence mode="wait">
            <motion.button
              className="p-1.5 rounded-md"
              onClick={() => handleViewChange('board')}
              title="Board View"
              variants={viewButtonVariants}
              initial="inactive"
              animate={currentView === 'board' ? 'active' : 'inactive'}
              whileHover={currentView === 'board' ? 'active' : 'hover'}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <ViewColumnsIcon className="w-5 h-5" />
            </motion.button>
          </AnimatePresence>
          
          <AnimatePresence mode="wait">
            <motion.button
              className="p-1.5 rounded-md"
              onClick={() => handleViewChange('list')}
              title="List View"
              variants={viewButtonVariants}
              initial="inactive"
              animate={currentView === 'list' ? 'active' : 'inactive'}
              whileHover={currentView === 'list' ? 'active' : 'hover'}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <ListBulletIcon className="w-5 h-5" />
            </motion.button>
          </AnimatePresence>
          
          <AnimatePresence mode="wait">
            <motion.button
              className="p-1.5 rounded-md"
              onClick={() => handleViewChange('calendar')}
              title="Calendar View"
              variants={viewButtonVariants}
              initial="inactive"
              animate={currentView === 'calendar' ? 'active' : 'inactive'}
              whileHover={currentView === 'calendar' ? 'active' : 'hover'}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <CalendarIcon className="w-5 h-5" />
            </motion.button>
          </AnimatePresence>
          
          <AnimatePresence mode="wait">
            <motion.button
              className="p-1.5 rounded-md"
              onClick={() => handleViewChange('gantt')}
              title="Gantt View"
              variants={viewButtonVariants}
              initial="inactive"
              animate={currentView === 'gantt' ? 'active' : 'inactive'}
              whileHover={currentView === 'gantt' ? 'active' : 'hover'}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <ChartBarIcon className="w-5 h-5" />
            </motion.button>
          </AnimatePresence>
        </motion.div>
        
        {/* Action Buttons */}
        <motion.button
          className="btn btn-primary"
          variants={buttonVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
        >
          <PlusIcon className="w-5 h-5 mr-1" />
          Add Task
        </motion.button>
        
        <motion.button
          className="p-2 rounded-lg frosted-glass text-gray-500 dark:text-gray-400"
          variants={buttonVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
        >
          <EllipsisHorizontalIcon className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.div>
  );
} 