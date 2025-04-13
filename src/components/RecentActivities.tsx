import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircleIcon, 
  PlusIcon, 
  PencilIcon, 
  ArrowPathIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { format, formatDistanceToNow } from 'date-fns';

type ActivityType = 'create' | 'complete' | 'update' | 'status';

interface Activity {
  id: string;
  type: ActivityType;
  taskId: string;
  taskTitle: string;
  timestamp: string;
  user?: string;
  details?: string;
}

interface RecentActivitiesProps {
  activities: Activity[];
}

const RecentActivities: React.FC<RecentActivitiesProps> = ({ activities }) => {
  // Get icon based on activity type
  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'create':
        return <PlusIcon className="h-4 w-4 text-primary-500" />;
      case 'complete':
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      case 'update':
        return <PencilIcon className="h-4 w-4 text-blue-500" />;
      case 'status':
        return <ArrowPathIcon className="h-4 w-4 text-purple-500" />;
      default:
        return <ClockIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  // Get text based on activity type
  const getActivityText = (activity: Activity) => {
    switch (activity.type) {
      case 'create':
        return <span>created task <span className="font-medium text-gray-900 dark:text-white">{activity.taskTitle}</span></span>;
      case 'complete':
        return <span>completed task <span className="font-medium text-gray-900 dark:text-white">{activity.taskTitle}</span></span>;
      case 'update':
        return <span>updated task <span className="font-medium text-gray-900 dark:text-white">{activity.taskTitle}</span></span>;
      case 'status':
        return <span>changed status of <span className="font-medium text-gray-900 dark:text-white">{activity.taskTitle}</span> to <span className="font-medium text-gray-900 dark:text-white">{activity.details}</span></span>;
      default:
        return <span>modified task <span className="font-medium text-gray-900 dark:text-white">{activity.taskTitle}</span></span>;
    }
  };

  // Get color class based on activity type
  const getActivityColor = (type: ActivityType) => {
    switch (type) {
      case 'create':
        return 'bg-primary-100 dark:bg-primary-900/30 border-primary-200 dark:border-primary-700/30';
      case 'complete':
        return 'bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-700/30';
      case 'update':
        return 'bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700/30';
      case 'status':
        return 'bg-purple-100 dark:bg-purple-900/30 border-purple-200 dark:border-purple-700/30';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 border-gray-200 dark:border-gray-700/30';
    }
  };
  
  const activityItemVariants = {
    initial: { opacity: 0, x: -10 },
    animate: (index: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: index * 0.05,
        duration: 0.2
      }
    }),
    hover: {
      x: 3,
      backgroundColor: 'rgba(59, 130, 246, 0.08)',
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="h-full w-full relative">
      {activities.length > 0 ? (
        <div className="space-y-0 pl-4 relative">
          {/* Line running down the timeline */}
          <div className="absolute w-0.5 bg-gray-200 dark:bg-gray-700 left-2 top-2 bottom-2 z-0"></div>
          
          {activities.map((activity, index) => {
            const formattedTime = formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true });
            
            return (
              <motion.div
                key={activity.id}
                className="relative z-10 mb-4 last:mb-0"
                variants={activityItemVariants}
                custom={index}
                initial="initial"
                animate="animate"
                whileHover="hover"
              >
                {/* Timeline dot */}
                <div className="absolute -left-2.5 h-5 w-5 rounded-full border-2 border-white dark:border-gray-800 bg-white dark:bg-gray-800 z-10 flex items-center justify-center">
                  {getActivityIcon(activity.type)}
                </div>
                
                {/* Activity content */}
                <div className={`pl-6 pr-2 py-2.5 rounded-lg border ${getActivityColor(activity.type)} ml-4`}>
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {activity.user || 'You'}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 text-xs">
                        {formattedTime}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                      {getActivityText(activity)}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-sm text-gray-500 dark:text-gray-400">No recent activities</p>
        </div>
      )}
    </div>
  );
};

export default RecentActivities; 