import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTaskStore } from '@/store/taskStore';
import { 
  ChartBarIcon, 
  ChartPieIcon, 
  ArrowTrendingUpIcon,
  CalendarIcon,
  DocumentChartBarIcon,
  ClockIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export default function Reports() {
  const { tasks } = useTaskStore();
  const [isLoaded, setIsLoaded] = useState(false);
  const [timeRange, setTimeRange] = useState('week');
  const productivityCanvasRef = useRef<HTMLCanvasElement>(null);
  const completionRateCanvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    setIsLoaded(true);
    
    // Draw charts when component mounts
    drawProductivityChart();
    drawCompletionRateChart();
    
    // Redraw on window resize
    const handleResize = () => {
      drawProductivityChart();
      drawCompletionRateChart();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Redraw charts when time range changes
  useEffect(() => {
    drawProductivityChart();
    drawCompletionRateChart();
  }, [timeRange]);
  
  // Draw productivity chart (line chart)
  const drawProductivityChart = () => {
    const canvas = productivityCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Chart data based on selected time range
    let data: number[] = [];
    let labels: string[] = [];
    
    if (timeRange === 'week') {
      data = [12, 19, 15, 17, 22, 24, 18];
      labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    } else if (timeRange === 'month') {
      data = [48, 52, 57, 64, 75, 68, 63, 59];
      labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'];
    } else {
      data = [145, 185, 210, 178, 197, 215, 230, 255, 242, 260, 270, 290];
      labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    }
    
    // Chart dimensions
    const padding = 40;
    const chartWidth = rect.width - (padding * 2);
    const chartHeight = rect.height - (padding * 2);
    
    // Calculate scales
    const maxValue = Math.max(...data) * 1.1; // Add 10% for padding
    const xStep = chartWidth / (data.length - 1);
    const yStep = chartHeight / maxValue;
    
    // Draw axes
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(156, 163, 175, 0.5)';
    ctx.lineWidth = 1;
    
    // x-axis
    ctx.moveTo(padding, rect.height - padding);
    ctx.lineTo(rect.width - padding, rect.height - padding);
    
    // y-axis
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, rect.height - padding);
    ctx.stroke();
    
    // Draw grid lines
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(156, 163, 175, 0.2)';
    
    for (let i = 0; i < 5; i++) {
      const y = padding + (chartHeight / 5) * i;
      ctx.moveTo(padding, y);
      ctx.lineTo(rect.width - padding, y);
    }
    
    for (let i = 0; i < data.length; i++) {
      const x = padding + xStep * i;
      ctx.moveTo(x, padding);
      ctx.lineTo(x, rect.height - padding);
    }
    
    ctx.stroke();
    
    // Draw labels
    ctx.font = '12px Arial';
    ctx.fillStyle = 'rgba(156, 163, 175, 0.8)';
    ctx.textAlign = 'center';
    
    for (let i = 0; i < data.length; i++) {
      const x = padding + xStep * i;
      ctx.fillText(labels[i], x, rect.height - padding + 20);
    }
    
    // Y-axis labels
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const y = rect.height - padding - (chartHeight / 5) * i;
      ctx.fillText(Math.round(maxValue * (i / 5)).toString(), padding - 10, y + 5);
    }
    
    // Draw data line
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.8)';
    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';
    
    for (let i = 0; i < data.length; i++) {
      const x = padding + (xStep * i);
      const y = rect.height - padding - (data[i] * yStep);
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.stroke();
    
    // Draw area under the line
    ctx.lineTo(padding + xStep * (data.length - 1), rect.height - padding);
    ctx.lineTo(padding, rect.height - padding);
    ctx.closePath();
    ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
    ctx.fill();
    
    // Draw data points
    for (let i = 0; i < data.length; i++) {
      const x = padding + (xStep * i);
      const y = rect.height - padding - (data[i] * yStep);
      
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.8)';
      ctx.lineWidth = 3;
      ctx.fill();
      ctx.stroke();
    }
  };
  
  // Draw completion rate chart (pie chart)
  const drawCompletionRateChart = () => {
    const canvas = completionRateCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Chart data
    const data = [
      { label: 'Completed', value: 68, color: 'rgba(16, 185, 129, 0.7)' },
      { label: 'In Progress', value: 22, color: 'rgba(59, 130, 246, 0.7)' },
      { label: 'Overdue', value: 10, color: 'rgba(245, 158, 11, 0.7)' }
    ];
    
    const total = data.reduce((acc, item) => acc + item.value, 0);
    
    // Set the center point for the pie chart
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const radius = Math.min(centerX, centerY) * 0.7;
    
    // Draw each segment
    let startAngle = -0.5 * Math.PI;
    
    data.forEach(item => {
      const segmentAngle = (item.value / total) * 2 * Math.PI;
      
      // Draw segment
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + segmentAngle);
      ctx.closePath();
      ctx.fillStyle = item.color;
      ctx.fill();
      
      // Draw segment label
      if (item.value / total > 0.05) {
        const labelRadius = radius * 0.7;
        const labelAngle = startAngle + segmentAngle / 2;
        const labelX = centerX + labelRadius * Math.cos(labelAngle);
        const labelY = centerY + labelRadius * Math.sin(labelAngle);
        
        ctx.font = 'bold 14px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${item.value}%`, labelX, labelY);
      }
      
      startAngle += segmentAngle;
    });
    
    // Draw inner circle (donut hole)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.5, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fill();
    
    // Draw center text
    ctx.font = 'bold 18px Arial';
    ctx.fillStyle = 'rgba(55, 65, 81, 0.9)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${data[0].value}%`, centerX, centerY);
    
    ctx.font = '12px Arial';
    ctx.fillStyle = 'rgba(107, 114, 128, 0.8)';
    ctx.fillText('Completion', centerX, centerY + 20);
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
  
  // Calculate task stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'done').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
  const todoTasks = tasks.filter(task => task.status === 'todo').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Calculate days active and average completion time (dummy data)
  const daysActive = 45;
  const avgCompletionTime = '2.3 days';
  
  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate={isLoaded ? "visible" : "hidden"}
    >
      {/* Header Section */}
      <motion.div
        className="glass-panel rounded-xl p-6"
        variants={itemVariants}
      >
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mr-4">
              <DocumentChartBarIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Project Analytics</h1>
              <p className="text-gray-500 dark:text-gray-400">Performance metrics and insights</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <motion.select
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              whileHover={{ scale: 1.02 }}
            >
              <option value="week">Last 7 days</option>
              <option value="month">Last 2 months</option>
              <option value="year">This year</option>
            </motion.select>
          </div>
        </div>
      </motion.div>
      
      {/* Summary Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={containerVariants}
      >
        <motion.div
          className="glass-panel rounded-lg p-4 transform-3d"
          variants={itemVariants}
          whileHover={{ 
            y: -5, 
            boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1), 0 0 10px var(--neon-glow)'
          }}
        >
          <div className="flex items-center mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mr-3">
              <CheckCircleIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Completion Rate</h3>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{completionRate}%</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full" 
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
        </motion.div>
        
        <motion.div
          className="glass-panel rounded-lg p-4 transform-3d"
          variants={itemVariants}
          whileHover={{ 
            y: -5, 
            boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1), 0 0 10px var(--neon-glow)'
          }}
        >
          <div className="flex items-center mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
              <ClockIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Completion Time</h3>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{avgCompletionTime}</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          className="glass-panel rounded-lg p-4 transform-3d"
          variants={itemVariants}
          whileHover={{ 
            y: -5, 
            boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1), 0 0 10px var(--neon-glow)'
          }}
        >
          <div className="flex items-center mb-2">
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3">
              <ArrowTrendingUpIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">On-time Delivery</h3>
              <p className="text-xl font-bold text-gray-900 dark:text-white">92%</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          className="glass-panel rounded-lg p-4 transform-3d"
          variants={itemVariants}
          whileHover={{ 
            y: -5, 
            boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1), 0 0 10px var(--neon-glow)'
          }}
        >
          <div className="flex items-center mb-2">
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-3">
              <CalendarIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Days Active</h3>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{daysActive}</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productivity Trend */}
        <motion.div
          className="glass-panel rounded-lg p-4 transform-3d"
          variants={itemVariants}
          whileHover={{ 
            y: -3, 
            boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1), 0 0 10px var(--neon-glow)'
          }}
        >
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Productivity Trend</h3>
          <div className="h-80">
            <canvas ref={productivityCanvasRef} className="w-full h-full" />
          </div>
        </motion.div>
        
        {/* Task Completion Rate */}
        <motion.div
          className="glass-panel rounded-lg p-4 transform-3d"
          variants={itemVariants}
          whileHover={{ 
            y: -3, 
            boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1), 0 0 10px var(--neon-glow)'
          }}
        >
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Task Completion Rate</h3>
          <div className="flex justify-center items-center h-80">
            <div className="w-64 h-64">
              <canvas ref={completionRateCanvasRef} className="w-full h-full" />
            </div>
            <div className="ml-6 space-y-4">
              {[
                { label: 'Completed', color: 'bg-green-500', value: '68%' },
                { label: 'In Progress', color: 'bg-blue-500', value: '22%' },
                { label: 'Overdue', color: 'bg-yellow-500', value: '10%' }
              ].map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className={`w-4 h-4 rounded-full ${item.color} mr-2`}></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{item.label}: </span>
                  <span className="ml-1 text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Team Performance */}
      <motion.div
        className="glass-panel rounded-lg p-4 transform-3d"
        variants={itemVariants}
        whileHover={{ 
          y: -3, 
          boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1), 0 0 10px var(--neon-glow)'
        }}
      >
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Team Performance</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                <th className="py-3 px-4 font-medium">Team Member</th>
                <th className="py-3 px-4 font-medium">Assigned</th>
                <th className="py-3 px-4 font-medium">Completed</th>
                <th className="py-3 px-4 font-medium">Completion Rate</th>
                <th className="py-3 px-4 font-medium">On Time</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Samantha Johnson', avatar: 'https://i.pravatar.cc/150?img=1', assigned: 45, completed: 42, onTime: '98%' },
                { name: 'David Chen', avatar: 'https://i.pravatar.cc/150?img=4', assigned: 78, completed: 64, onTime: '92%' },
                { name: 'Amara Okafor', avatar: 'https://i.pravatar.cc/150?img=5', assigned: 52, completed: 48, onTime: '96%' },
                { name: 'Miguel Rodriguez', avatar: 'https://i.pravatar.cc/150?img=6', assigned: 42, completed: 37, onTime: '88%' },
                { name: 'Thomas Weber', avatar: 'https://i.pravatar.cc/150?img=3', assigned: 60, completed: 52, onTime: '95%' }
              ].map((member, index) => (
                <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full mr-3" />
                      <span className="font-medium text-gray-900 dark:text-white">{member.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{member.assigned}</td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{member.completed}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${(member.completed / member.assigned) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">
                        {Math.round((member.completed / member.assigned) * 100)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{member.onTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
      
      {/* Recommendations Section */}
      <motion.div
        className="glass-panel rounded-lg p-4 transform-3d"
        variants={itemVariants}
        whileHover={{ 
          y: -3, 
          boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1), 0 0 10px var(--neon-glow)'
        }}
      >
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Insights & Recommendations</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
            <div className="flex items-start">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <ArrowTrendingUpIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Productivity Improvement</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Task completion rate has improved by 12% compared to last month.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
            <div className="flex items-start">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <ClockIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Time Management</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Average task completion time could be improved. Consider breaking down larger tasks.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
            <div className="flex items-start">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <UserGroupIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Team Collaboration</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Design and Development teams have good collaboration patterns. Consider similar approach for other teams.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
            <div className="flex items-start">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Potential Bottlenecks</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  3 high-priority tasks have been in review for more than 3 days. Consider follow-up.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
} 