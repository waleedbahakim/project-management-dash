import { useState, useEffect } from 'react';
import { useTaskStore } from '@/store/taskStore';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  PlusIcon, 
  ChartBarIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  ClipboardIcon,
  SparklesIcon,
  FireIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  CalendarIcon,
  UserCircleIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';
import TaskModal from '@/components/TaskModal';
import TaskStatusChart from '@/components/TaskStatusChart';
import WeeklyProgressChart from '@/components/WeeklyProgressChart';
import UpcomingDeadlines from '@/components/UpcomingDeadlines';
import RecentActivities from '@/components/RecentActivities';
import OnboardingTour from '@/components/OnboardingTour';
import { Task } from '@/types';

export default function Dashboard() {
  const { tasks } = useTaskStore();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const navigate = useNavigate();
  
  // Get current time for welcome message
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState('');
  
  // Animation progress value
  const progressValue = useMotionValue(0);
  
  useEffect(() => {
    setIsLoaded(true);
    
    // Set greeting based on time of day
    const hours = currentTime.getHours();
    if (hours < 12) {
      setGreeting('Good morning');
    } else if (hours < 18) {
      setGreeting('Good afternoon');
    } else {
      setGreeting('Good evening');
    }
    
    // Animate progress after component mounts
    const timer = setTimeout(() => {
      progressValue.set(completionPercentage);
    }, 500);
    
    // Check if onboarding should be shown
    const shouldShowOnboarding = localStorage.getItem('showOnboarding') === 'true';
    if (shouldShowOnboarding) {
      // Short delay to allow dashboard to load first
      setTimeout(() => {
        setShowOnboarding(true);
      }, 1000);
    }
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle onboarding completion
  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem('hasCompletedOnboarding', 'true');
    localStorage.removeItem('showOnboarding');
  };
  
  // Handle onboarding skip
  const handleOnboardingSkip = () => {
    setShowOnboarding(false);
    localStorage.setItem('hasCompletedOnboarding', 'true');
    localStorage.removeItem('showOnboarding');
  };
  
  // Calculate task stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'done').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
  const todoTasks = tasks.filter(task => task.status === 'todo').length;
  const backlogTasks = tasks.filter(task => task.status === 'backlog').length;
  const reviewTasks = tasks.filter(task => task.status === 'review').length;
  
  // Calculate stats by priority
  const urgentTasks = tasks.filter(task => task.priority === 'urgent').length;
  const highTasks = tasks.filter(task => task.priority === 'high').length;
  const mediumTasks = tasks.filter(task => task.priority === 'medium').length;
  const lowTasks = tasks.filter(task => task.priority === 'low').length;
  
  // Calculate completion percentage
  const completionPercentage = totalTasks > 0 
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;
  
  // Prepare data for task status chart
  const statusChartData = [
    { label: 'Backlog', value: backlogTasks, color: 'rgba(156, 163, 175, 0.7)' },
    { label: 'To Do', value: todoTasks, color: 'rgba(245, 158, 11, 0.7)' },
    { label: 'In Progress', value: inProgressTasks, color: 'rgba(59, 130, 246, 0.7)' },
    { label: 'Review', value: reviewTasks, color: 'rgba(139, 92, 246, 0.7)' },
    { label: 'Done', value: completedTasks, color: 'rgba(16, 185, 129, 0.7)' },
  ];
  
  // Generate dummy data for weekly progress
  const weeklyData = [
    { day: 'Mon', completed: 3, created: 5 },
    { day: 'Tue', completed: 2, created: 3 },
    { day: 'Wed', completed: 5, created: 4 },
    { day: 'Thu', completed: 4, created: 6 },
    { day: 'Fri', completed: 6, created: 2 },
    { day: 'Sat', completed: 1, created: 1 },
    { day: 'Sun', completed: 2, created: 3 },
  ];
  
  // Generate dummy data for recent activities
  const recentActivities = [
    {
      id: '1',
      type: 'create' as const,
      taskId: '101',
      taskTitle: 'Create UI design mockups',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      user: 'You'
    },
    {
      id: '2',
      type: 'status' as const,
      taskId: '102',
      taskTitle: 'Frontend development',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
      user: 'You',
      details: 'in-progress'
    },
    {
      id: '3',
      type: 'complete' as const,
      taskId: '103',
      taskTitle: 'Initial project setup',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      user: 'You'
    },
    {
      id: '4',
      type: 'update' as const,
      taskId: '104',
      taskTitle: 'API integration',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(), // 1.5 days ago
      user: 'Team Member'
    }
  ];
  
  // Handle opening task modal
  const handleOpenTaskModal = (task: Task | null = null) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  // Navigate to tasks page
  const navigateToTasksPage = () => {
    navigate('/dashboard/tasks');
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
  
  // Format number with animation
  const Count = ({ value, className }: { value: number, className: string }) => {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
      const timer = setTimeout(() => {
        setCount(value);
      }, 300);
      return () => clearTimeout(timer);
    }, [value]);
    
    return <p className={className}>{count}</p>;
  };

  return (
    <>
      <motion.div 
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
      >
        {/* Welcome section */}
        <motion.div
          className="glass-panel welcome-panel rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          variants={itemVariants}
          data-tour="welcome-panel"
        >
          <div className="flex flex-col items-center sm:items-start">
            <div className="flex items-center mb-2">
              <SparklesIcon className="h-6 w-6 text-primary-500 mr-2" />
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {greeting}, User!
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-center sm:text-left">
              You have {urgentTasks + highTasks} high priority tasks and {completedTasks} completed tasks this week.
            </p>
          </div>
          
          <div className="flex gap-2">
            <motion.button 
              className="btn btn-secondary"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowOnboarding(true)}
              title="Start application tour"
              data-tour="tour-button"
            >
              <QuestionMarkCircleIcon className="h-5 w-5 mr-1" />
              Tour
            </motion.button>
            <motion.button 
              className="btn btn-primary"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleOpenTaskModal()}
              data-tour="create-task-button"
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
          task={selectedTask || undefined}
        />
        
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 task-overview-cards" data-tour="task-overview-cards">
          <motion.div 
            className="glass-panel rounded-lg p-4 transform-3d"
            variants={itemVariants}
            whileHover={{ 
              y: -5, 
              rotateX: 2, 
              rotateY: 2,
              boxShadow: '0 20px 30px rgba(0, 0, 0, 0.1), 0 0 10px var(--neon-glow)' 
            }}
            data-tour="total-tasks"
          >
            <div className="flex items-center mb-2">
              <ClipboardIcon className="h-5 w-5 text-primary-500 mr-2" />
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Tasks</h3>
            </div>
            <Count 
              value={totalTasks}
              className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white"
            />
          </motion.div>
          
          <motion.div 
            className="glass-panel rounded-lg p-4 transform-3d completion-card"
            variants={itemVariants}
            whileHover={{ 
              y: -5, 
              rotateX: 2, 
              rotateY: -2,
              boxShadow: '0 20px 30px rgba(0, 0, 0, 0.1), 0 0 10px var(--neon-glow)' 
            }}
            data-tour="completion-card"
          >
            <div className="flex items-center mb-2">
              <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed</h3>
            </div>
            <div className="flex items-center mt-1">
              <Count 
                value={completedTasks}
                className="text-3xl font-semibold text-gray-900 dark:text-white mr-2"
              />
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                {completionPercentage}%
              </span>
            </div>
          </motion.div>
          
          <motion.div 
            className="glass-panel rounded-lg p-4 transform-3d in-progress-card"
            variants={itemVariants}
            whileHover={{ 
              y: -5, 
              rotateX: -2, 
              rotateY: 2,
              boxShadow: '0 20px 30px rgba(0, 0, 0, 0.1), 0 0 10px var(--neon-glow)' 
            }}
            data-tour="in-progress-card"
          >
            <div className="flex items-center mb-2">
              <ClockIcon className="h-5 w-5 text-blue-500 mr-2" />
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">In Progress</h3>
            </div>
            <Count 
              value={inProgressTasks}
              className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white"
            />
          </motion.div>
          
          <motion.div 
            className="glass-panel rounded-lg p-4 transform-3d"
            variants={itemVariants}
            whileHover={{ 
              y: -5, 
              rotateX: -2, 
              rotateY: -2,
              boxShadow: '0 20px 30px rgba(0, 0, 0, 0.1), 0 0 10px var(--neon-glow)' 
            }}
          >
            <div className="flex items-center mb-2">
              <ChartBarIcon className="h-5 w-5 text-purple-500 mr-2" />
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Productivity</h3>
            </div>
            <div className="flex items-center mt-1">
              <Count 
                value={completedTasks}
                className="text-3xl font-semibold text-gray-900 dark:text-white"
              />
              <span className="text-xs ml-2 text-gray-500 dark:text-gray-400">
                tasks<br/>this week
              </span>
            </div>
          </motion.div>
        </div>
        
        {/* Priority Status */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 priority-cards" data-tour="priority-cards">
          <motion.div 
            className="glass-panel rounded-lg p-4 flex items-center transform-3d urgent-card"
            variants={itemVariants}
            whileHover={{ 
              y: -5, 
              boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1), 0 0 10px var(--neon-glow)' 
            }}
            data-tour="urgent-card"
          >
            <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-3 mr-4">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-500 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Urgent</p>
              <p className="text-xl font-bold text-red-600 dark:text-red-400">{urgentTasks}</p>
            </div>
          </motion.div>
          
          <motion.div 
            className="glass-panel rounded-lg p-4 flex items-center transform-3d"
            variants={itemVariants}
            whileHover={{ 
              y: -5, 
              boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1), 0 0 10px var(--neon-glow)' 
            }}
          >
            <div className="rounded-full bg-orange-100 dark:bg-orange-900/30 p-3 mr-4">
              <FireIcon className="h-6 w-6 text-orange-500 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">High</p>
              <p className="text-xl font-bold text-orange-600 dark:text-orange-400">{highTasks}</p>
            </div>
          </motion.div>
          
          <motion.div 
            className="glass-panel rounded-lg p-4 flex items-center transform-3d"
            variants={itemVariants}
            whileHover={{ 
              y: -5, 
              boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1), 0 0 10px var(--neon-glow)' 
            }}
          >
            <div className="rounded-full bg-yellow-100 dark:bg-yellow-900/30 p-3 mr-4">
              <ArrowTrendingUpIcon className="h-6 w-6 text-yellow-500 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Medium</p>
              <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">{mediumTasks}</p>
            </div>
          </motion.div>
          
          <motion.div 
            className="glass-panel rounded-lg p-4 flex items-center transform-3d"
            variants={itemVariants}
            whileHover={{ 
              y: -5, 
              boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1), 0 0 10px var(--neon-glow)' 
            }}
          >
            <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3 mr-4">
              <CalendarIcon className="h-6 w-6 text-green-500 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Low</p>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">{lowTasks}</p>
            </div>
          </motion.div>
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 chart-section" data-tour="chart-section">
          <motion.div 
            className="glass-panel rounded-lg p-4 h-64 transform-3d status-chart"
            variants={itemVariants}
            whileHover={{ 
              y: -3, 
              boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1), 0 0 10px var(--neon-glow)' 
            }}
            data-tour="status-chart"
          >
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Task Status Distribution</h3>
            <TaskStatusChart data={statusChartData} />
          </motion.div>
          
          <motion.div 
            className="glass-panel rounded-lg p-3 h-64 transform-3d weekly-chart"
            variants={itemVariants}
            whileHover={{ 
              y: -3, 
              boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1), 0 0 10px var(--neon-glow)' 
            }}
            data-tour="weekly-chart"
          >
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Weekly Tasks Progress</h3>
            <WeeklyProgressChart data={weeklyData} />
          </motion.div>
        </div>
        
        {/* Deadlines and Recent Activities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 info-section" data-tour="info-section">
          <motion.div 
            className="glass-panel rounded-lg p-4 transform-3d deadlines-section"
            variants={itemVariants}
            whileHover={{ 
              y: -3, 
              boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1), 0 0 10px var(--neon-glow)' 
            }}
            data-tour="deadlines-section"
          >
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Upcoming Deadlines</h3>
            <div className="h-64 overflow-y-auto pr-1">
              <UpcomingDeadlines tasks={tasks} onTaskClick={handleOpenTaskModal} />
            </div>
          </motion.div>
          
          <motion.div 
            className="glass-panel rounded-lg p-4 transform-3d activities-section"
            variants={itemVariants}
            whileHover={{ 
              y: -3, 
              boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1), 0 0 10px var(--neon-glow)' 
            }}
            data-tour="activities-section"
          >
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Recent Activities</h3>
            <div className="h-64 overflow-y-auto pr-1">
              <RecentActivities activities={recentActivities} />
            </div>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Onboarding Tour */}
      <AnimatePresence>
        {showOnboarding && (
          <OnboardingTour 
            isOpen={showOnboarding} 
            onComplete={handleOnboardingComplete} 
            onSkip={handleOnboardingSkip} 
          />
        )}
      </AnimatePresence>
    </>
  );
} 