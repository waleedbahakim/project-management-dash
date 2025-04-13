import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SparklesIcon, 
  ArrowRightIcon, 
  EyeIcon, 
  EyeSlashIcon,
  LockClosedIcon,
  EnvelopeIcon,
  UserIcon,
  ChartBarSquareIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

export default function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [activeDemo, setActiveDemo] = useState(0);
  
  // Demo credentials
  const demoUsers = [
    { role: 'Project Manager', email: 'manager@projecthub.com', password: 'manager123' },
    { role: 'Developer', email: 'dev@projecthub.com', password: 'dev123' },
    { role: 'Designer', email: 'design@projecthub.com', password: 'design123' }
  ];
  
  // Cycle through demo accounts
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDemo((prev) => (prev + 1) % demoUsers.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Apply demo credentials
  const applyDemoCredentials = () => {
    setEmail(demoUsers[activeDemo].email);
    setPassword(demoUsers[activeDemo].password);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate authentication
    setTimeout(() => {
      setIsLoading(false);
      
      // Check if this is the user's first login (simulation)
      const isFirstLogin = localStorage.getItem('hasCompletedOnboarding') !== 'true';
      
      // Store in localStorage that onboarding should be shown
      if (isFirstLogin) {
        localStorage.setItem('showOnboarding', 'true');
      }
      
      navigate('/dashboard');
    }, 1500);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { 
      scale: 1.03,
      boxShadow: '0 10px 20px rgba(59, 130, 246, 0.3)'
    },
    tap: { scale: 0.97 },
    loading: { 
      scale: 1.02,
      boxShadow: '0 5px 15px rgba(59, 130, 246, 0.4)'
    }
  };
  
  const floatingIconVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: [0.7, 1, 0.7],
      rotate: [0, i % 2 === 0 ? 10 : -10, 0],
      transition: {
        opacity: {
          repeat: Infinity,
          duration: 3,
          repeatType: "reverse"
        },
        rotate: {
          repeat: Infinity,
          duration: 5,
          repeatType: "reverse",
          delay: i * 0.5
        },
        y: {
          type: 'spring',
          stiffness: 100,
          delay: i * 0.2
        }
      }
    })
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary-500/10 dark:bg-primary-500/5 blur-3xl"
          animate={{ 
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-secondary-500/10 dark:bg-secondary-500/5 blur-3xl"
          animate={{ 
            x: [0, -40, 0],
            y: [0, -25, 0],
          }}
          transition={{ 
            duration: 18, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        />
        
        {/* Floating icons */}
        <motion.div 
          className="absolute top-[25%] left-[15%] text-primary-500/20 dark:text-primary-400/10"
          variants={floatingIconVariants}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          <ChartBarSquareIcon className="w-24 h-24" />
        </motion.div>
        
        <motion.div 
          className="absolute top-[40%] right-[18%] text-secondary-500/20 dark:text-secondary-400/10"
          variants={floatingIconVariants}
          initial="hidden"
          animate="visible"
          custom={1}
        >
          <Cog6ToothIcon className="w-20 h-20" />
        </motion.div>
        
        <motion.div 
          className="absolute bottom-[15%] left-[20%] text-gray-500/20 dark:text-gray-400/10"
          variants={floatingIconVariants}
          initial="hidden"
          animate="visible"
          custom={2}
        >
          <UserIcon className="w-16 h-16" />
        </motion.div>
      </div>

      <div className="w-full max-w-6xl flex flex-col lg:flex-row rounded-3xl backdrop-blur-lg shadow-2xl overflow-hidden">
        {/* Left panel - showcasing the app */}
        <motion.div 
          className="w-full lg:w-1/2 p-8 lg:p-12 bg-gradient-to-br from-primary-600/90 to-primary-800/90 text-white hidden lg:flex flex-col justify-between"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
        >
          <div>
            <div className="flex items-center mb-8">
              <div className="rounded-full bg-white/20 p-2 mr-2">
                <SparklesIcon className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold">ProjectHub</h1>
            </div>
            
            <h2 className="text-2xl font-semibold mb-4">Manage your projects with ease</h2>
            <p className="text-white/80 mb-8">
              Track tasks, collaborate with your team, and deliver projects on time with our intuitive project management dashboard.
            </p>
          
            <div className="space-y-6 mt-8">
              <div className="flex items-center">
                <div className="rounded-full bg-white/20 p-2 mr-4">
                  <UserIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-medium">Team Collaboration</h3>
                  <p className="text-sm text-white/70">Work together seamlessly with your team</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="rounded-full bg-white/20 p-2 mr-4">
                  <ChartBarSquareIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-medium">Real-time Analytics</h3>
                  <p className="text-sm text-white/70">Track project progress with detailed reports</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="rounded-full bg-white/20 p-2 mr-4">
                  <Cog6ToothIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-medium">Customizable Workflows</h3>
                  <p className="text-sm text-white/70">Adapt the system to your specific needs</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Demo credentials section */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeDemo}
              className="mt-8 p-4 bg-white/10 rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="font-medium text-lg mb-2">Try a demo account</h3>
              <p className="text-white/70 text-sm mb-3">{demoUsers[activeDemo].role} Demo</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-white/10 p-2 rounded">
                  <span className="text-white/60">Email:</span>
                  <div className="font-mono text-white/90 truncate">{demoUsers[activeDemo].email}</div>
                </div>
                <div className="bg-white/10 p-2 rounded">
                  <span className="text-white/60">Password:</span>
                  <div className="font-mono text-white/90">{demoUsers[activeDemo].password}</div>
                </div>
              </div>
              <motion.button 
                className="mt-3 w-full bg-white/20 hover:bg-white/30 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={applyDemoCredentials}
              >
                Use these credentials
              </motion.button>
            </motion.div>
          </AnimatePresence>
        </motion.div>
        
        {/* Right panel - signin form */}
        <motion.div 
          className="w-full lg:w-1/2 p-8 lg:p-12 bg-white/10 dark:bg-gray-900/50"
          style={{
            backdropFilter: 'blur(16px)',
            boxShadow: 'inset 0 -1px 0 0 rgba(255, 255, 255, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            transformStyle: 'preserve-3d',
          }}
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div className="flex items-center justify-center lg:justify-start mb-8" variants={itemVariants}>
            <div className="lg:hidden rounded-full bg-primary-600/20 p-2 mr-2">
              <SparklesIcon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h1 className="text-2xl lg:hidden font-bold text-gray-800 dark:text-white">ProjectHub</h1>
          </motion.div>

          <motion.h2 
            className="text-2xl lg:text-3xl font-semibold text-center lg:text-left text-gray-800 dark:text-white mb-2"
            variants={itemVariants}
          >
            Welcome back!
          </motion.h2>
          
          <motion.p
            className="text-center lg:text-left text-gray-600 dark:text-gray-400 mb-8"
            variants={itemVariants}
          >
            Sign in to continue to your dashboard
          </motion.p>

          <AnimatePresence>
            {error && (
              <motion.div 
                className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800/30 text-red-800 dark:text-red-300 px-4 py-3 rounded-lg mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit}>
            <motion.div className="mb-5" variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <motion.div 
                className="relative"
                whileFocus={{ scale: 1.01 }}
              >
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-gray-300/50 dark:border-gray-700/50 placeholder-gray-400 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 dark:focus:ring-primary-500/30 text-gray-900 dark:text-white backdrop-blur-sm"
                  placeholder="Enter your email"
                  style={{ 
                    transformStyle: 'preserve-3d',
                  }}
                />
              </motion.div>
            </motion.div>

            <motion.div className="mb-5" variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <motion.div 
                className="relative"
                whileFocus={{ scale: 1.01 }}
              >
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 rounded-xl bg-white/5 border border-gray-300/50 dark:border-gray-700/50 placeholder-gray-400 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 dark:focus:ring-primary-500/30 text-gray-900 dark:text-white backdrop-blur-sm"
                  placeholder="Enter your password"
                  style={{ 
                    transformStyle: 'preserve-3d',
                  }}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </motion.div>
            </motion.div>

            <motion.div className="flex items-center justify-between mb-6" variants={itemVariants}>
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300">
                  Forgot password?
                </a>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <motion.button
                type="submit"
                className={`w-full flex items-center justify-center gap-2 px-5 py-3.5 text-white font-medium rounded-xl ${isLoading ? 'bg-primary-500' : 'bg-gradient-to-r from-primary-600 to-primary-500'} hover:from-primary-500 hover:to-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800`}
                variants={buttonVariants}
                initial="idle"
                whileHover={isLoading ? undefined : "hover"}
                whileTap={isLoading ? undefined : "tap"}
                animate={isLoading ? "loading" : "idle"}
                disabled={isLoading}
                style={{ 
                  transformStyle: 'preserve-3d',
                }}
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <>
                    Sign In
                    <ArrowRightIcon className="h-4 w-4" />
                  </>
                )}
              </motion.button>
            </motion.div>
            
            <motion.div 
              className="mt-8 flex items-center text-sm text-gray-600 dark:text-gray-400"
              variants={itemVariants}
            >
              <div className="h-px flex-1 bg-gray-300/50 dark:bg-gray-700/50"></div>
              <span className="px-4">Or continue with</span>
              <div className="h-px flex-1 bg-gray-300/50 dark:bg-gray-700/50"></div>
            </motion.div>
            
            <motion.div 
              className="mt-5 grid grid-cols-3 gap-4"
              variants={itemVariants}
            >
              <button 
                type="button"
                className="flex justify-center items-center py-2.5 rounded-lg border border-gray-300/80 dark:border-gray-700/80 bg-white/5 hover:bg-white/10 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-200 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </button>
              <button 
                type="button"
                className="flex justify-center items-center py-2.5 rounded-lg border border-gray-300/80 dark:border-gray-700/80 bg-white/5 hover:bg-white/10 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-200 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0 0 14.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z"/>
                </svg>
              </button>
              <button 
                type="button"
                className="flex justify-center items-center py-2.5 rounded-lg border border-gray-300/80 dark:border-gray-700/80 bg-white/5 hover:bg-white/10 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-200 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.162 5.656a8.384 8.384 0 0 1-2.402.658A4.196 4.196 0 0 0 21.6 4c-.82.488-1.719.83-2.656 1.015a4.182 4.182 0 0 0-7.126 3.814 11.874 11.874 0 0 1-8.62-4.37 4.168 4.168 0 0 0-.566 2.103c0 1.45.738 2.731 1.86 3.481a4.168 4.168 0 0 1-1.894-.523v.052a4.185 4.185 0 0 0 3.355 4.101 4.21 4.21 0 0 1-1.89.072A4.185 4.185 0 0 0 7.97 16.65a8.394 8.394 0 0 1-6.191 1.732 11.83 11.83 0 0 0 6.41 1.88c7.693 0 11.9-6.373 11.9-11.9 0-.18-.005-.362-.013-.54a8.496 8.496 0 0 0 2.087-2.165z"/>
                </svg>
              </button>
            </motion.div>
          </form>

          <motion.div 
            className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400"
            variants={itemVariants}
          >
            Don't have an account?{' '}
            <button 
              onClick={() => alert('Sign up functionality would go here')}
              className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 transition-colors"
            >
              Create account
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 