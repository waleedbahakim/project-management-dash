import React, { useEffect, useRef } from 'react';

interface WeeklyProgressChartProps {
  data: {
    day: string;
    completed: number;
    created: number;
  }[];
}

const WeeklyProgressChart: React.FC<WeeklyProgressChartProps> = ({ data }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    
    const width = rect.width;
    const height = rect.height;
    const padding = 40;
    
    // Calculate the chart dimensions
    const chartWidth = width - (padding * 2);
    const chartHeight = height - (padding * 2);
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // If there's no data, show empty state
    if (data.length === 0) {
      ctx.font = '14px Arial';
      ctx.fillStyle = 'rgba(156, 163, 175, 0.7)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('No data available', width / 2, height / 2);
      return;
    }
    
    // Find max value for scaling
    const maxValue = Math.max(
      ...data.map(d => Math.max(d.completed, d.created)),
      5 // Set a minimum to avoid flat lines when all values are 0
    );
    
    // Draw axes
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(156, 163, 175, 0.3)';
    ctx.lineWidth = 1;
    
    // X-axis
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    
    // Y-axis
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.stroke();
    
    // Draw the X-axis labels (days)
    const barWidth = chartWidth / data.length;
    ctx.font = '10px Arial';
    ctx.fillStyle = 'rgba(156, 163, 175, 0.9)';
    ctx.textAlign = 'center';
    
    data.forEach((item, index) => {
      const x = padding + (index * barWidth) + (barWidth / 2);
      ctx.fillText(item.day, x, height - padding + 15);
    });
    
    // Draw the Y-axis labels (values)
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    
    const numYTicks = 5;
    for (let i = 0; i <= numYTicks; i++) {
      const value = Math.round((maxValue / numYTicks) * i);
      const y = height - padding - ((i / numYTicks) * chartHeight);
      
      // Draw tick mark
      ctx.beginPath();
      ctx.moveTo(padding - 5, y);
      ctx.lineTo(padding, y);
      ctx.stroke();
      
      // Draw label
      ctx.fillText(value.toString(), padding - 8, y);
      
      // Draw horizontal grid line
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(156, 163, 175, 0.1)';
      ctx.setLineDash([3, 3]);
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    
    // Draw the bars for created tasks
    data.forEach((item, index) => {
      const x = padding + (index * barWidth) + (barWidth * 0.2);
      const barW = barWidth * 0.3;
      const createdHeight = (item.created / maxValue) * chartHeight;
      
      ctx.beginPath();
      ctx.fillStyle = 'rgba(79, 70, 229, 0.6)';
      ctx.fillRect(
        x, 
        height - padding - createdHeight, 
        barW, 
        createdHeight
      );
    });
    
    // Draw the bars for completed tasks
    data.forEach((item, index) => {
      const x = padding + (index * barWidth) + (barWidth * 0.5);
      const barW = barWidth * 0.3;
      const completedHeight = (item.completed / maxValue) * chartHeight;
      
      ctx.beginPath();
      ctx.fillStyle = 'rgba(16, 185, 129, 0.6)';
      ctx.fillRect(
        x, 
        height - padding - completedHeight, 
        barW, 
        completedHeight
      );
    });
    
    // Draw the legend
    const legendX = width - padding - 120;
    const legendY = padding + 15;
    
    // Created tasks
    ctx.beginPath();
    ctx.fillStyle = 'rgba(79, 70, 229, 0.6)';
    ctx.fillRect(legendX, legendY, 15, 15);
    
    ctx.font = '12px Arial';
    ctx.fillStyle = 'rgba(156, 163, 175, 0.9)';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('Created', legendX + 20, legendY + 7);
    
    // Completed tasks
    ctx.beginPath();
    ctx.fillStyle = 'rgba(16, 185, 129, 0.6)';
    ctx.fillRect(legendX, legendY + 20, 15, 15);
    ctx.fillStyle = 'rgba(156, 163, 175, 0.9)';
    ctx.fillText('Completed', legendX + 20, legendY + 27);
    
  }, [data]);

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export default WeeklyProgressChart; 