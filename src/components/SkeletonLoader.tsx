import { motion } from 'framer-motion';

type SkeletonLoaderProps = {
  type: 'dashboard' | 'board' | 'tasks' | 'calendar' | 'reports' | 'team' | 'settings' | 'default';
};

export default function SkeletonLoader({ type = 'default' }: SkeletonLoaderProps) {
  // Animation for the skeleton pulse effect
  const pulseAnimation = {
    initial: { opacity: 0.6 },
    animate: {
      opacity: [0.6, 0.8, 0.6],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Common skeleton bar
  const SkeletonBar = ({ width, height = 'h-4', className = '' }: { width: string, height?: string, className?: string }) => (
    <motion.div
      className={`bg-gray-200 dark:bg-gray-700 rounded-md ${height} ${width} ${className}`}
      variants={pulseAnimation}
      initial="initial"
      animate="animate"
    />
  );

  // Common skeleton card
  const SkeletonCard = ({ className = '', children = null }: { className?: string, children?: React.ReactNode }) => (
    <motion.div
      className={`glass-panel rounded-lg p-4 transform-3d ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children || (
        <>
          <SkeletonBar width="w-1/3" className="mb-3" />
          <SkeletonBar width="w-2/3" height="h-6" className="mb-2" />
          <SkeletonBar width="w-full" />
        </>
      )}
    </motion.div>
  );

  // Dashboard skeleton
  if (type === 'dashboard') {
    return (
      <div className="space-y-6 w-full">
        {/* Action button placeholder */}
        <div className="flex justify-end">
          <SkeletonBar width="w-32" height="h-10" />
        </div>
        
        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SkeletonCard className="h-64" />
          <SkeletonCard className="h-64" />
        </div>
        
        {/* Task lists */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <SkeletonCard className="h-72" />
          <SkeletonCard className="h-72" />
          <SkeletonCard className="h-72" />
        </div>
      </div>
    );
  }

  // Board skeleton
  if (type === 'board') {
    return (
      <div className="space-y-6 w-full">
        {/* Board header */}
        <div className="flex justify-between items-center mb-6">
          <SkeletonBar width="w-1/4" height="h-8" />
          <div className="flex space-x-3">
            <SkeletonBar width="w-24" height="h-10" />
            <SkeletonBar width="w-24" height="h-10" />
          </div>
        </div>
        
        {/* Board columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col">
              <div className="flex justify-between items-center mb-3">
                <SkeletonBar width="w-1/3" height="h-6" />
                <SkeletonBar width="w-8" height="h-6" className="rounded-full" />
              </div>
              <div className="space-y-3">
                {[...Array(i + 2)].map((_, j) => (
                  <SkeletonCard key={j} className="h-32" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Tasks skeleton
  if (type === 'tasks') {
    return (
      <div className="space-y-6 w-full">
        {/* Task header */}
        <div className="flex justify-between items-center mb-6">
          <SkeletonBar width="w-1/3" height="h-8" />
          <div className="flex space-x-3">
            <SkeletonBar width="w-32" height="h-10" />
            <SkeletonBar width="w-40" height="h-10" />
          </div>
        </div>
        
        {/* Task filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          {[...Array(5)].map((_, i) => (
            <SkeletonBar key={i} width="w-24" height="h-8" />
          ))}
        </div>
        
        {/* Task list */}
        <div className="space-y-3">
          {[...Array(8)].map((_, i) => (
            <SkeletonCard key={i} className="h-16" />
          ))}
        </div>
      </div>
    );
  }

  // Default skeleton (simpler version for other pages)
  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <SkeletonBar width="w-1/4" height="h-8" />
        <SkeletonBar width="w-32" height="h-10" />
      </div>
      
      {/* Content cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <SkeletonCard className="h-48" />
        <SkeletonCard className="h-48" />
      </div>
      
      {/* More content */}
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <SkeletonCard key={i} className="h-24" />
        ))}
      </div>
    </div>
  );
} 