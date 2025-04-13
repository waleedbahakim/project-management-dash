import { useState, useEffect } from 'react';
import { 
  DndContext, 
  DragOverlay,
  useSensor, 
  useSensors,
  PointerSensor,
  KeyboardSensor,
  closestCorners,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  UniqueIdentifier
} from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';

import { useWorkspaceStore } from '@/store/workspaceStore';
import { useUIStore } from '@/store/uiStore';
import Column from './Column';
import TaskCard from '../Tasks/TaskCard';
import { Column as ColumnType, Task } from '@/types';
import BoardHeader from './BoardHeader';
import { AnimatePresence, motion } from 'framer-motion';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function BoardContainer() {
  const { workspace, activeBoard, setActiveBoard, moveTask, moveColumn } = useWorkspaceStore();
  const { theme } = useUIStore();
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [activeColumn, setActiveColumn] = useState<ColumnType | null>(null);
  const [isDraggingColumn, setIsDraggingColumn] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Once component mounts, mark as loaded for animations
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Set first board as active if none is selected
  useEffect(() => {
    if (workspace.boards.length > 0 && !activeBoard) {
      setActiveBoard(workspace.boards[0].id);
    }
  }, [workspace.boards, activeBoard, setActiveBoard]);

  // Get the current active board
  const currentBoard = workspace.boards.find(board => board.id === activeBoard);

  // Configure DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // Minimum drag distance before activation
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // No board found
  if (!currentBoard) {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h2 
          className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-4 gradient-text"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          No boards available
        </motion.h2>
        <motion.button 
          className="btn btn-primary"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ 
            scale: 1.05, 
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1), 0 0 10px rgba(59, 130, 246, 0.5)' 
          }}
          whileTap={{ scale: 0.95 }}
        >
          Create a new board
        </motion.button>
      </motion.div>
    );
  }

  // Get tasks for a specific column
  const getColumnTasks = (columnId: string): Task[] => {
    const column = currentBoard.columns.find(col => col.id === columnId);
    if (!column) return [];
    
    return column.tasks.map(item => {
      if (typeof item === 'string') {
        return workspace.tasks[item] || { 
          id: item, 
          title: 'Unknown Task', 
          description: '', 
          priority: 'none', 
          createdAt: '', 
          updatedAt: '' 
        };
      }
      return item;
    });
  };

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeId = active.id as string;
    
    // Check if we're dragging a column
    const isColumn = currentBoard.columns.some(col => col.id === activeId);
    setIsDraggingColumn(isColumn);
    
    if (isColumn) {
      const column = currentBoard.columns.find(col => col.id === activeId);
      if (column) {
        setActiveColumn(column);
      }
    } else {
      // Otherwise, we're dragging a task
      const task = workspace.tasks[activeId];
      if (task) {
        setActiveTask(task);
      }
    }
    
    setActiveId(activeId);
  };
  
  // Handle drag over
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    // Skip if no over target or same as active
    if (!over || active.id === over.id) return;
    
    const activeId = active.id as string;
    const overId = over.id as string;
    
    // Skip column dragging logic - that's handled in dragEnd
    if (isDraggingColumn) return;
    
    // Handle task dragging between columns
    const activeColumnId = findColumnIdForTask(activeId);
    const overColumnId = findColumnIdForTask(overId) || overId; // If over a column directly
    
    if (!activeColumnId) return;
    
    // Skip if task is dragged over the same column
    if (activeColumnId === overColumnId) return;
    
    // Task is being moved to a different column
    const activeColumn = currentBoard.columns.find(col => col.id === activeColumnId);
    const overColumn = currentBoard.columns.find(col => col.id === overColumnId);
    
    if (!activeColumn || !overColumn) return;
    
    // Find the index where to insert the task
    let newIndex: number;
    
    if (overColumn.tasks.some(task => 
        (typeof task === 'string' && task === overId) || 
        (typeof task === 'object' && task.id === overId)
      )) {
      // Dropping on another task
      newIndex = overColumn.tasks.findIndex(task => 
        (typeof task === 'string' && task === overId) || 
        (typeof task === 'object' && task.id === overId)
      );
    } else {
      // Dropping directly on a column
      newIndex = overColumn.tasks.length;
    }
    
    // Move the task to the new column
    moveTask(
      activeId,
      currentBoard.id,
      activeColumnId,
      currentBoard.id,
      overColumnId,
      newIndex
    );
  };
  
  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    // Reset states
    setActiveId(null);
    setActiveTask(null);
    setActiveColumn(null);
    
    // Skip if no over target
    if (!over) return;
    
    const activeId = active.id as string;
    const overId = over.id as string;
    
    // Handle column reordering
    if (isDraggingColumn) {
      // Find the column indices
      const oldIndex = currentBoard.columns.findIndex(col => col.id === activeId);
      const newIndex = currentBoard.columns.findIndex(col => col.id === overId);
      
      if (oldIndex !== newIndex) {
        moveColumn(currentBoard.id, activeId, newIndex);
      }
      
      setIsDraggingColumn(false);
      return;
    }
    
    // Handle task reordering within the same column
    const activeColumnId = findColumnIdForTask(activeId);
    const overColumnId = findColumnIdForTask(overId) || overId;
    
    if (!activeColumnId) return;
    
    // Skip if task is not moving
    if (activeId === overId) return;
    
    // If reordering within same column
    if (activeColumnId === overColumnId) {
      const column = currentBoard.columns.find(col => col.id === activeColumnId);
      if (!column) return;
      
      const oldIndex = column.tasks.findIndex(task => 
        (typeof task === 'string' && task === activeId) || 
        (typeof task === 'object' && task.id === activeId)
      );
      const newIndex = column.tasks.findIndex(task => 
        (typeof task === 'string' && task === overId) || 
        (typeof task === 'object' && task.id === overId)
      );
      
      // Skip if position didn't change
      if (oldIndex === newIndex) return;
      
      // Reorder the tasks in the same column
      moveTask(
        activeId,
        currentBoard.id,
        activeColumnId,
        currentBoard.id,
        activeColumnId,
        newIndex
      );
    }
  };
  
  // Helper to find which column a task belongs to
  const findColumnIdForTask = (taskId: string): string | undefined => {
    for (const column of currentBoard.columns) {
      if (column.tasks.some(task => 
        (typeof task === 'string' && task === taskId) || 
        (typeof task === 'object' && task.id === taskId)
      )) {
        return column.id;
      }
    }
    return undefined;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
        ease: [0.19, 1, 0.22, 1],
        duration: 0.5
      }
    },
    exit: { opacity: 0 }
  };
  
  const addColumnButtonVariants = {
    hidden: { opacity: 0, scale: 0.8, x: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      x: 0,
      transition: {
        delay: 0.3 + (currentBoard.columns.length * 0.05),
        duration: 0.4,
        ease: [0.19, 1, 0.22, 1]
      }
    },
    hover: { 
      scale: 1.03, 
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1), 0 0 8px rgba(59, 130, 246, 0.4)',
      borderColor: '#3b82f6',
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <motion.div 
      className="flex flex-col h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <BoardHeader board={currentBoard} />
      
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToWindowEdges]}
      >
        <motion.div 
          className="flex-1 overflow-x-auto overflow-y-hidden p-4 custom-scrollbar"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div 
            className="flex gap-4 h-full" 
            variants={containerVariants}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            exit="exit"
          >
            <SortableContext items={currentBoard.columns.map(col => col.id)}>
              <AnimatePresence>
                {currentBoard.columns.map((column, index) => (
                  <Column 
                    key={column.id}
                    column={column}
                    tasks={getColumnTasks(column.id)}
                    boardId={currentBoard.id}
                  />
                ))}
              </AnimatePresence>
            </SortableContext>
            
            {/* Add Column Button */}
            <motion.div 
              className="flex-shrink-0 flex items-center justify-center w-80 h-12 mt-10 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 backdrop-blur-sm frosted-glass transition-colors cursor-pointer"
              variants={addColumnButtonVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              whileTap={{ scale: 0.97 }}
            >
              <motion.button 
                className="flex items-center text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm font-medium"
                whileHover={{ scale: 1.05 }}
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Add Column
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
        
        {/* Drag Overlay */}
        <DragOverlay adjustScale zIndex={999}>
          {activeTask ? (
            <motion.div 
              className="w-72 opacity-80 pointer-events-none"
              initial={{ scale: 0.9, rotate: -1 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.2 }}
            >
              <TaskCard task={activeTask} />
            </motion.div>
          ) : activeColumn ? (
            <motion.div 
              className="flex flex-col w-80 h-full opacity-80 pointer-events-none transform-3d"
              initial={{ scale: 0.97, rotateZ: -1 }}
              animate={{ scale: 1, rotateZ: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="p-2 rounded-t-md font-medium text-white bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-700 dark:to-primary-900"
              >
                {activeColumn.name}
              </motion.div>
              <motion.div 
                className="flex-1 frosted-glass backdrop-blur-sm rounded-b-md p-2 border-2 border-gray-200 dark:border-gray-700"
              >
                {getColumnTasks(activeColumn.id).length === 0 && (
                  <motion.div 
                    className="text-center text-gray-400 p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    No tasks
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </motion.div>
  );
} 