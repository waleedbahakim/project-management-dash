import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { Task } from '@/types';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { useUIStore } from '@/store/uiStore';
import { 
  TagIcon, 
  CalendarIcon, 
  ChatBubbleLeftIcon,
  PaperClipIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

interface TaskCardProps {
  task: Task;
  columnId: string;
}

export default function TaskCard({ task, columnId }: TaskCardProps) {
  const { theme } = useUIStore();
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: task.id,
    data: {
      type: 'task',
      task,
      columnId
    }
  });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : 1
  };
  
  // Priority colors
  const priorityColors = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    none: 'bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-300'
  };
  
  // Calculate progress
  const progress = task.checklist && task.checklist.length > 0
    ? Math.round((task.checklist.filter(item => item.checked).length / task.checklist.length) * 100)
    : 0;
  
  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
  };
  
  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`p-3 mb-2 rounded-lg shadow-sm bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 
        ${isDragging ? 'shadow-md' : 'hover:shadow-md'} 
        ${theme.glassEffect ? 'backdrop-filter backdrop-blur-sm bg-white/80 dark:bg-gray-800/80' : ''}
        transition-all cursor-grab active:cursor-grabbing`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={theme.animation.transitions}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Task Labels */}
      {task.labels && task.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {task.labels.map((label) => (
            <span 
              key={label} 
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300"
            >
              <TagIcon className="w-3 h-3 mr-1" />
              {label}
            </span>
          ))}
        </div>
      )}
      
      {/* Task Title */}
      <h3 className="font-medium text-gray-900 dark:text-white">{task.title}</h3>
      
      {/* Task Description (if any) */}
      {task.description && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
          {task.description}
        </p>
      )}
      
      {/* Progress Bar (if there's a checklist) */}
      {task.checklist && task.checklist.length > 0 && (
        <div className="mt-2">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary-500 rounded-full" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
      
      {/* Task Footer Metadata */}
      <div className="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center">
          {/* Due Date */}
          {task.dueDate && (
            <div className="flex items-center mr-3">
              <CalendarIcon className="w-3.5 h-3.5 mr-1" />
              <span>{formatDate(task.dueDate)}</span>
            </div>
          )}
          
          {/* Comments Count */}
          {task.comments && task.comments.length > 0 && (
            <div className="flex items-center mr-3">
              <ChatBubbleLeftIcon className="w-3.5 h-3.5 mr-1" />
              <span>{task.comments.length}</span>
            </div>
          )}
          
          {/* Attachments Count */}
          {task.attachments && task.attachments.length > 0 && (
            <div className="flex items-center">
              <PaperClipIcon className="w-3.5 h-3.5 mr-1" />
              <span>{task.attachments.length}</span>
            </div>
          )}
        </div>
        
        {/* Assignee */}
        {task.assignee && (
          <div className="flex items-center">
            {task.assigneeAvatar ? (
              <img 
                src={task.assigneeAvatar} 
                alt={task.assignee} 
                className="w-5 h-5 rounded-full"
                title={task.assignee}
              />
            ) : (
              <UserCircleIcon 
                className="w-5 h-5 text-gray-400 dark:text-gray-500" 
                title={task.assignee}
              />
            )}
          </div>
        )}
        
        {/* Priority Badge */}
        {task.priority && task.priority !== 'none' && (
          <span 
            className={`inline-flex items-center px-1.5 py-0.5 rounded-md text-xs font-medium ${priorityColors[task.priority as keyof typeof priorityColors]}`}
          >
            {task.priority}
          </span>
        )}
      </div>
    </motion.div>
  );
} 