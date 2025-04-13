import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRightIcon,
  XMarkIcon,
  SparklesIcon,
  ChartBarIcon,
  ClipboardIcon,
  UserGroupIcon,
  PuzzlePieceIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  FireIcon,
  CalendarIcon,
  PlusIcon,
  ArrowTrendingUpIcon,
  HomeIcon,
  Squares2X2Icon,
  ClipboardDocumentListIcon,
  CogIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

interface OnboardingTourProps {
  isOpen: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

interface TourStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  target: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  route?: string; // Optional route to navigate to
}

export default function OnboardingTour({ isOpen, onComplete, onSkip }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [targetElement, setTargetElement] = useState<DOMRect | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const tourRef = useRef<HTMLDivElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  // Define tour steps with much more detail
  const tourSteps: TourStep[] = [
    {
      title: "Welcome to ProjectHub!",
      description: "This quick tour will introduce you to the main interface elements. Let's get started!",
      icon: <SparklesIcon className="h-8 w-8 text-primary-500" />,
      target: "body",
      position: "top",
      route: "/dashboard"
    },
    {
      title: "Dashboard Overview",
      description: "Your dashboard is where you'll find all your project information and metrics at a glance.",
      icon: <HomeIcon className="h-8 w-8 text-primary-500" />,
      target: "[data-tour='welcome-panel']",
      position: "bottom",
      route: "/dashboard"
    },
    {
      title: "Navigation Sidebar",
      description: "Use the sidebar to navigate between different sections of the application.",
      icon: <ClipboardIcon className="h-8 w-8 text-primary-500" />,
      target: "[data-tour='nav']",
      position: "right",
      route: "/dashboard"
    },
    {
      title: "Dashboard",
      description: "The Dashboard page shows a summary of your project status and key metrics.",
      icon: <HomeIcon className="h-8 w-8 text-primary-500" />,
      target: "[data-tour='nav-dashboard']",
      position: "right",
      route: "/dashboard"
    },
    {
      title: "Board View",
      description: "The Board view offers a Kanban-style interface for visual task management.",
      icon: <Squares2X2Icon className="h-8 w-8 text-primary-500" />,
      target: "[data-tour='nav-board']",
      position: "right",
      route: "/dashboard"
    },
    {
      title: "Tasks List",
      description: "The Tasks page displays all your tasks in a detailed list view with filtering options.",
      icon: <ClipboardDocumentListIcon className="h-8 w-8 text-primary-500" />,
      target: "[data-tour='nav-tasks']",
      position: "right",
      route: "/dashboard"
    },
    {
      title: "Calendar",
      description: "The Calendar view helps you visualize tasks and deadlines on a monthly or weekly calendar.",
      icon: <CalendarIcon className="h-8 w-8 text-primary-500" />,
      target: "[data-tour='nav-calendar']",
      position: "right",
      route: "/dashboard"
    },
    {
      title: "Reports",
      description: "The Reports page provides analytics and insights about your project performance.",
      icon: <ChartBarIcon className="h-8 w-8 text-primary-500" />,
      target: "[data-tour='nav-reports']",
      position: "right",
      route: "/dashboard"
    },
    {
      title: "Team",
      description: "Manage your team members, assign tasks, and track everyone's progress from the Team page.",
      icon: <UserGroupIcon className="h-8 w-8 text-primary-500" />,
      target: "[data-tour='nav-team']",
      position: "right",
      route: "/dashboard"
    },
    {
      title: "Settings",
      description: "Customize your workspace, notification preferences, and account settings.",
      icon: <CogIcon className="h-8 w-8 text-primary-500" />,
      target: "[data-tour='nav-settings']",
      position: "right",
      route: "/dashboard"
    },
    {
      title: "User Profile",
      description: "Access your profile settings, notifications, and account options from here.",
      icon: <UserCircleIcon className="h-8 w-8 text-primary-500" />,
      target: "[data-tour='user-menu']",
      position: "left",
      route: "/dashboard"
    },
    {
      title: "Ready to Begin!",
      description: "You're all set! Explore the different sections using the sidebar navigation.",
      icon: <SparklesIcon className="h-8 w-8 text-primary-500" />,
      target: "body",
      position: "top",
      route: "/dashboard"
    }
  ];

  // Focus the next button when the tour starts or advances to a new step
  useEffect(() => {
    if (hasStarted && isOpen && nextButtonRef.current) {
      // Small delay to ensure the element is rendered
      const timer = setTimeout(() => {
        if (nextButtonRef.current) {
          nextButtonRef.current.focus();
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [hasStarted, isOpen, currentStep]);

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || !hasStarted) return;
      
      if (e.key === 'Escape') {
        handleSkip();
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        handleNext();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, hasStarted, currentStep]);

  // Find target element position
  useEffect(() => {
    if (!isOpen) return;
    
    // If tour has started, find the target element for the current step
    if (hasStarted) {
      const step = tourSteps[currentStep];
      console.log(`Tour step ${currentStep}: ${step.title} targeting "${step.target}"`);
      
      // Navigate to the appropriate page if needed
      if (step.route && window.location.pathname !== step.route) {
        console.log(`Navigating to ${step.route} from ${window.location.pathname}`);
        navigate(step.route);
        
        // Give the page time to load/render fully before trying to find elements
        // This is especially important for route changes
        const routeTimer = setTimeout(() => {
          findTargetElement(step);
        }, 800); // Increased delay for page transitions
        
        return () => clearTimeout(routeTimer);
      } else {
        // If we're already on the right page, find the element directly
        // Still use a small delay to ensure the UI has fully updated
        const timer = setTimeout(() => {
          findTargetElement(step);
        }, 150);
        
        return () => clearTimeout(timer);
      }
    }
  }, [currentStep, isOpen, hasStarted, navigate]);

  // Helper function to find target element with retries
  const findTargetElement = (step: TourStep) => {
    // Try primary selector first, then fallback to alternatives if not found
    let attempts = 0;
    const maxAttempts = 5; // Increased retry attempts
    
    const tryFindElement = () => {
      attempts++;
      
      try {
        // Try to find the element
        let element = null;
        
        // Special case for body or fallback targets
        if (step.target === 'body') {
          element = document.body;
        } else {
          // Try more specific selectors if the main one fails
          const selectors = [
            step.target,
            `.${step.target.replace(/\./g, '').replace(/\[data-tour='|\]$/g, '')}`, // Try without brackets/data-tour
            `[data-tour="${step.target.replace(/\[data-tour='|\]$/g, '')}"]`, // Try with data attribute
            `.${currentStep === 0 ? 'welcome-panel' : step.target.replace(/\./g, '')}` // Special case for first step
          ];
          
          for (const selector of selectors) {
            try {
              const found = document.querySelector(selector);
              if (found) {
                element = found;
                console.log(`Found element using selector: ${selector}`, element);
                break;
              }
            } catch (e) {
              console.warn(`Invalid selector: ${selector}`);
            }
          }
        }
        
        if (element) {
          console.log(`Found target element for step ${currentStep}`, element);
          const rect = element.getBoundingClientRect();
          setTargetElement(rect);
        } else if (attempts < maxAttempts) {
          console.log(`Attempt ${attempts}: Could not find element "${step.target}", retrying in ${300 * attempts}ms...`);
          // Retry with increasing delay
          setTimeout(tryFindElement, 300 * attempts);
        } else {
          console.warn(`Failed to find element "${step.target}" after ${maxAttempts} attempts`);
          // If all attempts fail, use viewport center
          const centerRect = {
            top: window.innerHeight / 2 - 100,
            left: window.innerWidth / 2 - 150,
            right: window.innerWidth / 2 + 150,
            bottom: window.innerHeight / 2 + 100,
            width: 300,
            height: 200,
            x: window.innerWidth / 2 - 150,
            y: window.innerHeight / 2 - 100,
            toJSON: () => ({})
          };
          setTargetElement(centerRect);
          
          // Still allow the tour to continue
          console.log("Using center fallback and continuing tour");
        }
      } catch (error) {
        console.error("Error finding element:", error);
        // Provide a fallback so the tour doesn't break completely
        setTargetElement({
          top: window.innerHeight / 2 - 100,
          left: window.innerWidth / 2 - 150,
          right: window.innerWidth / 2 + 150,
          bottom: window.innerHeight / 2 + 100,
          width: 300,
          height: 200,
          x: window.innerWidth / 2 - 150,
          y: window.innerHeight / 2 - 100,
          toJSON: () => ({})
        });
      }
    };
    
    // Start trying to find the element
    tryFindElement();
  };

  // Add window resize handler
  useEffect(() => {
    const handleResize = () => {
      if (hasStarted && isOpen) {
        // Recalculate target element position on window resize
        const step = tourSteps[currentStep];
        const element = document.querySelector(step.target);
        
        if (element) {
          const rect = element.getBoundingClientRect();
          setTargetElement(rect);
        }
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [hasStarted, isOpen, currentStep, tourSteps]);

  // Calculate tooltip position
  const getTooltipPosition = () => {
    if (!targetElement) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    
    const step = tourSteps[currentStep];
    const buffer = 20; // Distance from target element
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    // Get the tooltip dimensions (with fallbacks if ref not available)
    const tooltipWidth = tourRef.current?.offsetWidth || 300;
    const tooltipHeight = tourRef.current?.offsetHeight || 200;
    
    // Base positions
    let position = { top: '0px', left: '0px', transform: 'none' };
    
    switch (step.position) {
      case 'top':
        position = {
          top: `${Math.max(10, targetElement.top - buffer - tooltipHeight)}px`,
          left: `${targetElement.left + targetElement.width / 2}px`,
          transform: 'translateX(-50%)'
        };
        break;
      case 'bottom':
        position = {
          top: `${Math.min(windowHeight - tooltipHeight - 10, targetElement.bottom + buffer)}px`,
          left: `${targetElement.left + targetElement.width / 2}px`,
          transform: 'translateX(-50%)'
        };
        break;
      case 'left':
        position = {
          top: `${targetElement.top + targetElement.height / 2}px`,
          left: `${Math.max(10, targetElement.left - buffer - tooltipWidth)}px`,
          transform: 'translateY(-50%)'
        };
        break;
      case 'right':
        position = {
          top: `${targetElement.top + targetElement.height / 2}px`,
          left: `${Math.min(windowWidth - tooltipWidth - 10, targetElement.right + buffer)}px`,
          transform: 'translateY(-50%)'
        };
        break;
      default:
        position = { 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)' 
        };
    }
    
    // Ensure tooltip stays within viewport bounds
    const numericTop = parseFloat(position.top);
    const numericLeft = parseFloat(position.left);
    
    if (numericTop < 10) {
      position.top = '10px';
    } else if (numericTop + tooltipHeight > windowHeight - 10) {
      position.top = `${windowHeight - tooltipHeight - 10}px`;
    }
    
    if (numericLeft < 10) {
      position.left = '10px';
      position.transform = position.transform.replace('translateX(-50%)', '');
    } else if (numericLeft + tooltipWidth > windowWidth - 10) {
      position.left = `${windowWidth - tooltipWidth - 10}px`;
      position.transform = position.transform.replace('translateX(-50%)', '');
    }
    
    return position;
  };

  // Handle start tour
  const handleStartTour = () => {
    console.log('Starting tour');
    
    // Set initializing state to prevent multiple start attempts
    setIsInitializing(true);
    
    // Instead of setting both states at once, use a slight delay
    // This allows the welcome modal to fully exit first
    setHasStarted(true);
    
    // Force a delay before initializing the first step
    setTimeout(() => {
      setCurrentStep(0);
      // Try to find the first element immediately after starting
      findTargetElement(tourSteps[0]);
      
      // Reset the initializing state after tour has fully started
      setTimeout(() => {
        setIsInitializing(false);
      }, 500);
    }, 300);
  };

  // Handle next step
  const handleNext = () => {
    // Prevent rapid clicking or navigation while transitions are happening
    if (isInitializing) {
      console.log('Tour is still initializing, please wait...');
      return;
    }
    
    if (currentStep === tourSteps.length - 1) {
      console.log('Tour completed');
      onComplete();
      setHasStarted(false);
      navigate('/dashboard');
    } else {
      console.log(`Advancing from step ${currentStep} to ${currentStep + 1}`);
      
      // Set initializing state to prevent multiple rapid transitions
      setIsInitializing(true);
      
      // Check if we're at the first step (welcome modal to first actual tooltip)
      // This transition needs special handling
      if (currentStep === 0) {
        // Clear any existing target element first
        setTargetElement(null);
        
        // Slight delay for cleaner transition
        setTimeout(() => {
          setCurrentStep(prev => prev + 1);
          
          // Reset initializing state after transition completes
          setTimeout(() => {
            setIsInitializing(false);
          }, 300);
        }, 100);
      } else {
        setCurrentStep(prev => prev + 1);
        
        // Reset initializing state after the new step renders
        setTimeout(() => {
          setIsInitializing(false);
        }, 300);
      }
    }
  };

  // Handle skip
  const handleSkip = () => {
    // Prevent rapid clicking or navigation while transitions are happening
    if (isInitializing) {
      console.log('Tour is still initializing, please wait...');
      return;
    }
    
    console.log('Tour skipped');
    onSkip();
    setHasStarted(false);
    navigate('/dashboard');
  };

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const tooltipVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: 'spring',
        damping: 20,
        stiffness: 300
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: { duration: 0.2 }
    }
  };

  // Welcome modal for the first step
  if (isOpen && !hasStarted) {
    return (
      <motion.div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div 
          className="glass-panel p-8 rounded-xl max-w-md w-full text-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          <div className="mx-auto w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4">
            <SparklesIcon className="h-8 w-8 text-primary-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">Welcome to ProjectHub!</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Take a quick tour to discover the powerful features at your fingertips.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <motion.button 
              className="btn btn-primary flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStartTour}
              autoFocus // Auto focus this button when modal appears
            >
              Start Tour <ArrowRightIcon className="ml-2 h-4 w-4" />
            </motion.button>
            <motion.button 
              className="btn btn-secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSkip}
            >
              Skip for Now
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  if (!isOpen || !hasStarted) return null;

  // Position the tooltip
  const tooltipPosition = getTooltipPosition();

  return (
    <motion.div 
      className="fixed inset-0 z-50"
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      {/* Semi-transparent backdrop with pointer events */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={isInitializing ? undefined : handleSkip} 
      />
      
      {/* Target spotlight */}
      {targetElement && (
        <div 
          className="absolute bg-transparent pointer-events-none"
          style={{
            top: targetElement.top - 10,
            left: targetElement.left - 10,
            width: targetElement.width + 20,
            height: targetElement.height + 20,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7)',
            borderRadius: '8px',
            zIndex: 10
          }}
        />
      )}
      
      {/* Tooltip */}
      <AnimatePresence mode="wait">
        <motion.div 
          ref={tourRef}
          key={`step-${currentStep}`}
          className="absolute glass-panel p-6 rounded-xl max-w-md w-full"
          style={tooltipPosition}
          variants={tooltipVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          tabIndex={-1} // Make the tooltip focusable
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mr-3">
                {tourSteps[currentStep].icon}
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                {tourSteps[currentStep].title}
              </h3>
            </div>
            <button 
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              onClick={isInitializing ? undefined : handleSkip}
              aria-label="Skip tour"
              disabled={isInitializing}
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          
          <p className="text-gray-600 dark:text-gray-300 mb-5">
            {tourSteps[currentStep].description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {tourSteps.map((_, index) => (
                <div 
                  key={index} 
                  className={`w-2 h-2 rounded-full ${
                    index === currentStep ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                  role="progressbar"
                  aria-valuenow={currentStep + 1}
                  aria-valuemin={1}
                  aria-valuemax={tourSteps.length}
                />
              ))}
            </div>
            
            <div className="flex gap-3">
              <motion.button 
                className="btn btn-secondary text-sm py-1.5 px-3"
                whileHover={isInitializing ? {} : { scale: 1.05 }}
                whileTap={isInitializing ? {} : { scale: 0.98 }}
                onClick={isInitializing ? undefined : handleSkip}
                disabled={isInitializing}
              >
                Skip
              </motion.button>
              <motion.button 
                ref={nextButtonRef}
                className={`btn btn-primary text-sm py-1.5 px-3 flex items-center ${isInitializing ? 'opacity-70' : ''}`}
                whileHover={isInitializing ? {} : { scale: 1.05 }}
                whileTap={isInitializing ? {} : { scale: 0.98 }}
                onClick={isInitializing ? undefined : handleNext}
                tabIndex={0}
                disabled={isInitializing}
              >
                {currentStep === tourSteps.length - 1 ? 'Finish' : 'Next'}
                <ArrowRightIcon className="ml-1.5 h-3.5 w-3.5" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
} 