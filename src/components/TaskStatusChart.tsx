import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface TaskStatusChartProps {
  data: {
    label: string;
    value: number;
    color: string;
  }[];
}

const TaskStatusChart: React.FC<TaskStatusChartProps> = ({ data }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const total = data.reduce((acc, item) => acc + item.value, 0);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const canvas = canvasRef.current;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    // Set the center point for the pie chart
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const radius = Math.min(centerX, centerY) * 0.8;
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw the chart background
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fill();
    
    // If there's no data, show empty state
    if (total === 0) {
      ctx.font = '14px Arial';
      ctx.fillStyle = 'rgba(156, 163, 175, 0.7)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('No data available', centerX, centerY);
      return;
    }
    
    // Draw each segment
    let startAngle = -0.5 * Math.PI;
    
    data.forEach(item => {
      const segmentAngle = (item.value / total) * 2 * Math.PI;
      
      // Draw segment
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + segmentAngle);
      ctx.lineTo(centerX, centerY);
      ctx.fillStyle = item.color;
      ctx.fill();
      
      // Draw segment text
      const textRadius = radius * 0.7;
      const textAngle = startAngle + segmentAngle / 2;
      const textX = centerX + textRadius * Math.cos(textAngle);
      const textY = centerY + textRadius * Math.sin(textAngle);
      
      if (item.value / total > 0.08) { // Only show text for segments that are large enough
        ctx.font = 'bold 12px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${Math.round((item.value / total) * 100)}%`, textX, textY);
      }
      
      startAngle += segmentAngle;
    });
    
    // Draw inner circle (donut hole)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.6, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.fill();
    
  }, [data]);

  return (
    <div className="relative w-full h-full flex flex-col">
      <canvas ref={canvasRef} className="w-full h-full" />
      <div className="absolute bottom-2 left-2 right-2">
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {data.map((item, index) => (
            <motion.div 
              key={index}
              className="flex items-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div 
                className="w-3 h-3 rounded-full mr-1" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-gray-700 dark:text-gray-300">
                {item.label} ({item.value})
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskStatusChart; 