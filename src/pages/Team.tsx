import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UsersIcon, 
  PlusCircleIcon, 
  ChartBarIcon, 
  EnvelopeIcon, 
  PencilIcon,
  UserPlusIcon,
  ArrowsRightLeftIcon,
  Cog6ToothIcon,
  XMarkIcon,
  CheckIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar: string;
  department: string;
  tasksCompleted: number;
  tasksAssigned: number;
  lastActive: string;
  status: 'online' | 'offline' | 'busy' | 'away';
}

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
}

export default function Team() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showAssignTasksModal, setShowAssignTasksModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [message, setMessage] = useState('');
  const [editedMember, setEditedMember] = useState<TeamMember | null>(null);
  
  // Mock tasks
  const [availableTasks] = useState<Task[]>([
    { id: '1', title: 'Complete API documentation', status: 'todo', priority: 'high' },
    { id: '2', title: 'Fix login page responsiveness', status: 'todo', priority: 'medium' },
    { id: '3', title: 'Implement dark mode toggle', status: 'todo', priority: 'low' },
    { id: '4', title: 'Update user profile settings', status: 'todo', priority: 'medium' },
    { id: '5', title: 'Optimize database queries', status: 'todo', priority: 'high' },
    { id: '6', title: 'Create onboarding tutorial', status: 'todo', priority: 'medium' }
  ]);
  
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  
  // New member form data
  const [newMember, setNewMember] = useState({
    name: '',
    role: '',
    email: '',
    department: 'Development',
    avatar: 'https://i.pravatar.cc/150?img=' + Math.floor(Math.random() * 70)
  });
  
  // Team member data
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'Samantha Johnson',
      role: 'Project Manager',
      email: 'samantha@example.com',
      avatar: 'https://i.pravatar.cc/150?img=1',
      department: 'Management',
      tasksCompleted: 32,
      tasksAssigned: 45,
      lastActive: '2 minutes ago',
      status: 'online'
    },
    {
      id: '2',
      name: 'David Chen',
      role: 'Senior Developer',
      email: 'david@example.com',
      avatar: 'https://i.pravatar.cc/150?img=4',
      department: 'Development',
      tasksCompleted: 64,
      tasksAssigned: 78,
      lastActive: '24 minutes ago',
      status: 'busy'
    },
    {
      id: '3',
      name: 'Amara Okafor',
      role: 'UX Designer',
      email: 'amara@example.com',
      avatar: 'https://i.pravatar.cc/150?img=5',
      department: 'Design',
      tasksCompleted: 48,
      tasksAssigned: 52,
      lastActive: '3 hours ago',
      status: 'online'
    },
    {
      id: '4',
      name: 'Miguel Rodriguez',
      role: 'Frontend Developer',
      email: 'miguel@example.com',
      avatar: 'https://i.pravatar.cc/150?img=6',
      department: 'Development',
      tasksCompleted: 37,
      tasksAssigned: 42,
      lastActive: '1 day ago',
      status: 'offline'
    },
    {
      id: '5',
      name: 'Leila Ahmed',
      role: 'Marketing Specialist',
      email: 'leila@example.com',
      avatar: 'https://i.pravatar.cc/150?img=2',
      department: 'Marketing',
      tasksCompleted: 19,
      tasksAssigned: 23,
      lastActive: '5 minutes ago',
      status: 'away'
    },
    {
      id: '6',
      name: 'Thomas Weber',
      role: 'Backend Developer',
      email: 'thomas@example.com',
      avatar: 'https://i.pravatar.cc/150?img=3',
      department: 'Development',
      tasksCompleted: 52,
      tasksAssigned: 60,
      lastActive: '17 minutes ago',
      status: 'online'
    }
  ]);
  
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

  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    },
    exit: { 
      opacity: 0, 
      y: 50, 
      scale: 0.9,
      transition: { duration: 0.2 }
    }
  };
  
  // Get unique departments
  const departments = ['all', ...Array.from(new Set(teamMembers.map(member => member.department)))];
  const departmentOptions = Array.from(new Set(teamMembers.map(member => member.department)));
  
  // Filter members by department
  const filteredMembers = filterDepartment === 'all'
    ? teamMembers
    : teamMembers.filter(member => member.department === filterDepartment);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  const handleMemberClick = (member: TeamMember) => {
    setSelectedMember(member);
    setShowMemberModal(true);
  };
  
  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    busy: 'bg-red-500',
    away: 'bg-yellow-500'
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewMember(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleAddMember = () => {
    // Validate form
    if (!newMember.name || !newMember.role || !newMember.email) {
      // In a real app, you would show validation errors
      alert('Please fill out all required fields');
      return;
    }
    
    // Create new member
    const member: TeamMember = {
      id: Date.now().toString(),
      name: newMember.name,
      role: newMember.role,
      email: newMember.email,
      department: newMember.department,
      avatar: newMember.avatar,
      tasksCompleted: 0,
      tasksAssigned: 0,
      lastActive: 'Just added',
      status: 'online'
    };
    
    // Add to team members
    setTeamMembers([...teamMembers, member]);
    
    // Reset form and close modal
    setNewMember({
      name: '',
      role: '',
      email: '',
      department: 'Development',
      avatar: 'https://i.pravatar.cc/150?img=' + Math.floor(Math.random() * 70)
    });
    
    setShowAddMemberModal(false);
  };
  
  const handleSendMessage = () => {
    if (!message.trim() || !selectedMember) return;
    
    // In a real app, you would send this message to an API
    alert(`Message sent to ${selectedMember.name}: "${message}"`);
    
    // Reset and close
    setMessage('');
    setShowMessageModal(false);
  };
  
  const handleAssignTasks = () => {
    if (!selectedTasks.length || !selectedMember) return;
    
    // In a real app, you would assign these tasks via an API
    const tasksToAssign = availableTasks.filter(task => selectedTasks.includes(task.id));
    const taskTitles = tasksToAssign.map(task => task.title).join(", ");
    
    // Update the member's task count
    setTeamMembers(prevMembers => 
      prevMembers.map(member => 
        member.id === selectedMember.id 
          ? { ...member, tasksAssigned: member.tasksAssigned + selectedTasks.length }
          : member
      )
    );
    
    // Update the selected member if it's still in the modal
    if (selectedMember) {
      setSelectedMember({
        ...selectedMember,
        tasksAssigned: selectedMember.tasksAssigned + selectedTasks.length
      });
    }
    
    alert(`Assigned tasks to ${selectedMember.name}: ${taskTitles}`);
    
    // Reset and close
    setSelectedTasks([]);
    setShowAssignTasksModal(false);
  };
  
  const handleEditProfile = () => {
    if (!editedMember) return;
    
    // Update the member in the team members list
    setTeamMembers(prevMembers => 
      prevMembers.map(member => 
        member.id === editedMember.id ? editedMember : member
      )
    );
    
    // Update selected member if the modal is still open
    setSelectedMember(editedMember);
    
    // Reset and close
    setShowEditProfileModal(false);
  };
  
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (editedMember) {
      setEditedMember({
        ...editedMember,
        [name]: value
      });
    }
  };
  
  const toggleTaskSelection = (taskId: string) => {
    if (selectedTasks.includes(taskId)) {
      setSelectedTasks(selectedTasks.filter(id => id !== taskId));
    } else {
      setSelectedTasks([...selectedTasks, taskId]);
    }
  };
  
  const initializeEditForm = () => {
    if (selectedMember) {
      setEditedMember({ ...selectedMember });
      setShowEditProfileModal(true);
    }
  };
  
  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate={isLoaded ? "visible" : "hidden"}
    >
      {/* Header */}
      <motion.div 
        className="glass-panel rounded-xl p-6"
        variants={itemVariants}
      >
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center mr-4">
              <UsersIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Team Members</h1>
              <p className="text-gray-500 dark:text-gray-400">{teamMembers.length} members across {departments.length - 1} departments</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <motion.button
              className="btn btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddMemberModal(true)}
            >
              <UserPlusIcon className="h-5 w-5 mr-2" />
              Add Member
            </motion.button>
            
            <motion.button
              className="btn btn-secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowManageModal(true)}
            >
              <Cog6ToothIcon className="h-5 w-5 mr-2" />
              Manage
            </motion.button>
          </div>
        </div>
      </motion.div>
      
      {/* Filters */}
      <motion.div
        className="flex flex-wrap gap-2 mb-4"
        variants={itemVariants}
      >
        {departments.map(dept => (
          <motion.button
            key={dept}
            className={`px-4 py-2 rounded-md text-sm ${
              filterDepartment === dept
              ? 'bg-primary-500 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            } border border-gray-200 dark:border-gray-700`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilterDepartment(dept)}
          >
            {dept.charAt(0).toUpperCase() + dept.slice(1)}
          </motion.button>
        ))}
      </motion.div>
      
      {/* Team Members Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        variants={containerVariants}
      >
        {filteredMembers.map((member) => (
          <motion.div
            key={member.id}
            className="glass-panel rounded-lg p-4 flex flex-col transform-3d cursor-pointer"
            variants={itemVariants}
            whileHover={{ 
              y: -5, 
              boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1), 0 0 10px var(--neon-glow)' 
            }}
            onClick={() => handleMemberClick(member)}
          >
            <div className="flex items-start mb-4">
              <div className="relative">
                <img 
                  src={member.avatar} 
                  alt={member.name} 
                  className="w-16 h-16 rounded-lg object-cover mr-4"
                />
                <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full ${statusColors[member.status]} border-2 border-white dark:border-gray-800`}></div>
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{member.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{member.role}</p>
                <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                  <span className="bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-md">
                    {member.department}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-center p-1 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                  <p className="text-gray-500 dark:text-gray-400">Assigned</p>
                  <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">{member.tasksAssigned}</p>
                </div>
                <div className="text-center p-1 bg-green-50 dark:bg-green-900/20 rounded-md">
                  <p className="text-gray-500 dark:text-gray-400">Completed</p>
                  <p className="text-sm font-semibold text-green-600 dark:text-green-400">{member.tasksCompleted}</p>
                </div>
              </div>
              
              <div className="mt-3 flex justify-between items-center">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Active {member.lastActive}
                </span>
                <div className="flex space-x-1">
                  <motion.button 
                    className="p-1 text-gray-400 hover:text-primary-500 rounded-full"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <EnvelopeIcon className="w-4 h-4" />
                  </motion.button>
                  <motion.button 
                    className="p-1 text-gray-400 hover:text-primary-500 rounded-full"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ChartBarIcon className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        
        {/* Add new team member card */}
        <motion.div
          className="glass-panel rounded-lg p-6 flex flex-col items-center justify-center h-full min-h-[280px] border-2 border-dashed border-gray-200 dark:border-gray-700 transform-3d cursor-pointer"
          variants={itemVariants}
          whileHover={{ 
            y: -5, 
            boxShadow: '0 15px 30px rgba(0, 0, 0, 0.05)' 
          }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowAddMemberModal(true)}
        >
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
            <PlusCircleIcon className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-center">Add new team member</p>
        </motion.div>
      </motion.div>
      
      {/* Member Detail Modal */}
      <AnimatePresence>
        {showMemberModal && selectedMember && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowMemberModal(false)}
          >
            <motion.div
              className="glass-panel rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center">
                  <div className="relative">
                    <img 
                      src={selectedMember.avatar} 
                      alt={selectedMember.name} 
                      className="w-20 h-20 rounded-xl object-cover mr-4"
                    />
                    <div className={`absolute bottom-0 right-0 w-5 h-5 rounded-full ${statusColors[selectedMember.status]} border-2 border-white dark:border-gray-800`}></div>
                  </div>
                  
                  <div>
                    <div className="flex items-center">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white mr-2">{selectedMember.name}</h2>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        selectedMember.status === 'online' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                        selectedMember.status === 'busy' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                        selectedMember.status === 'away' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {selectedMember.status.charAt(0).toUpperCase() + selectedMember.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">{selectedMember.role}</p>
                    <p className="text-sm text-primary-600 dark:text-primary-400">{selectedMember.email}</p>
                  </div>
                </div>
                
                <button
                  className="p-2 text-gray-400 hover:text-gray-500 rounded-full"
                  onClick={() => setShowMemberModal(false)}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Department</h3>
                    <p className="text-gray-900 dark:text-white">{selectedMember.department}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Performance</h3>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Tasks Completed</span>
                          <span className="font-medium">{selectedMember.tasksCompleted}/{selectedMember.tasksAssigned}</span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: `${(selectedMember.tasksCompleted / selectedMember.tasksAssigned) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Efficiency Rate</span>
                          <span className="font-medium">85%</span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: '85%' }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Activity</h3>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div className="w-2 h-2 mt-1.5 rounded-full bg-green-500 mr-2"></div>
                        <div>
                          <p className="text-sm text-gray-800 dark:text-gray-200">Completed "Database Migration" task</p>
                          <p className="text-xs text-gray-500">2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-500 mr-2"></div>
                        <div>
                          <p className="text-sm text-gray-800 dark:text-gray-200">Commented on "API Integration" task</p>
                          <p className="text-xs text-gray-500">Yesterday</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="w-2 h-2 mt-1.5 rounded-full bg-purple-500 mr-2"></div>
                        <div>
                          <p className="text-sm text-gray-800 dark:text-gray-200">Created "User Authentication" task</p>
                          <p className="text-xs text-gray-500">2 days ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-end space-x-2">
                <motion.button
                  className="btn btn-secondary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowMessageModal(true)}
                >
                  <EnvelopeIcon className="h-4 w-4 mr-2" />
                  Send Message
                </motion.button>
                <motion.button
                  className="btn btn-secondary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAssignTasksModal(true)}
                >
                  <ArrowsRightLeftIcon className="h-4 w-4 mr-2" />
                  Assign Tasks
                </motion.button>
                <motion.button
                  className="btn btn-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={initializeEditForm}
                >
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Edit Profile
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Add Member Modal */}
      <AnimatePresence>
        {showAddMemberModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddMemberModal(false)}
          >
            <motion.div
              className="glass-panel rounded-xl p-6 max-w-lg w-full"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add New Team Member</h2>
                <button
                  className="p-2 text-gray-400 hover:text-gray-500 rounded-full"
                  onClick={() => setShowAddMemberModal(false)}
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newMember.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter full name"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Role *
                  </label>
                  <input
                    type="text"
                    id="role"
                    name="role"
                    value={newMember.role}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter role (e.g. UI Designer)"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={newMember.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter email address"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Department *
                  </label>
                  <select
                    id="department"
                    name="department"
                    value={newMember.department}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  >
                    {departmentOptions.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-2">
                <motion.button
                  className="btn btn-secondary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddMemberModal(false)}
                >
                  Cancel
                </motion.button>
                <motion.button
                  className="btn btn-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddMember}
                >
                  <UserPlusIcon className="h-4 w-4 mr-2" />
                  Add Member
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Team Management Modal */}
      <AnimatePresence>
        {showManageModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowManageModal(false)}
          >
            <motion.div
              className="glass-panel rounded-xl p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Team Management</h2>
                <button
                  className="p-2 text-gray-400 hover:text-gray-500 rounded-full"
                  onClick={() => setShowManageModal(false)}
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3">Team Members</h3>
                  <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Department</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {teamMembers.map((member) => (
                          <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 relative">
                                  <img className="h-10 w-10 rounded-full object-cover" src={member.avatar} alt={member.name} />
                                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${statusColors[member.status]}`}></div>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">{member.name}</div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">{member.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 dark:text-white">{member.role}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                                {member.department}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                member.status === 'online' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                member.status === 'busy' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                member.status === 'away' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                              }`}>
                                {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                <button 
                                  className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                                  onClick={() => {
                                    setSelectedMember(member);
                                    setShowMemberModal(true);
                                    setShowManageModal(false);
                                  }}
                                >
                                  View
                                </button>
                                <button 
                                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                  onClick={() => {
                                    if (window.confirm(`Are you sure you want to remove ${member.name}?`)) {
                                      setTeamMembers(teamMembers.filter(m => m.id !== member.id));
                                    }
                                  }}
                                >
                                  Remove
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3">Departments</h3>
                  <div className="flex flex-wrap gap-2">
                    {departmentOptions.map((dept) => (
                      <div 
                        key={dept} 
                        className="px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-between"
                      >
                        <span className="text-sm text-gray-800 dark:text-gray-200">{dept}</span>
                        <span className="text-xs text-gray-500 ml-2">
                          {teamMembers.filter(m => m.department === dept).length} members
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <motion.button
                  className="btn btn-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowManageModal(false)}
                >
                  Done
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Send Message Modal */}
      <AnimatePresence>
        {showMessageModal && selectedMember && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowMessageModal(false)}
          >
            <motion.div
              className="glass-panel rounded-xl p-6 max-w-lg w-full"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Message to {selectedMember.name}
                </h2>
                <button
                  className="p-2 text-gray-400 hover:text-gray-500 rounded-full"
                  onClick={() => setShowMessageModal(false)}
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <img 
                    src={selectedMember.avatar} 
                    alt={selectedMember.name} 
                    className="w-10 h-10 rounded-full object-cover mr-3" 
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedMember.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{selectedMember.email}</p>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder={`Write a message to ${selectedMember.name}...`}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  ></textarea>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <motion.button
                  className="btn btn-secondary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowMessageModal(false)}
                >
                  Cancel
                </motion.button>
                <motion.button
                  className="btn btn-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                >
                  <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                  Send Message
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Assign Tasks Modal */}
      <AnimatePresence>
        {showAssignTasksModal && selectedMember && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAssignTasksModal(false)}
          >
            <motion.div
              className="glass-panel rounded-xl p-6 max-w-lg w-full"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Assign Tasks to {selectedMember.name}
                </h2>
                <button
                  className="p-2 text-gray-400 hover:text-gray-500 rounded-full"
                  onClick={() => setShowAssignTasksModal(false)}
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <img 
                    src={selectedMember.avatar} 
                    alt={selectedMember.name} 
                    className="w-10 h-10 rounded-full object-cover mr-3" 
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedMember.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{selectedMember.role}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Available Tasks
                  </h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-2">
                    {availableTasks.map(task => (
                      <motion.div 
                        key={task.id}
                        className={`flex items-center p-3 rounded-md cursor-pointer ${
                          selectedTasks.includes(task.id) 
                            ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-700' 
                            : 'hover:bg-gray-50 dark:hover:bg-gray-700 border border-transparent'
                        }`}
                        onClick={() => toggleTaskSelection(task.id)}
                        whileHover={{ x: 3 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className={`w-5 h-5 flex-shrink-0 border rounded-md mr-3 flex items-center justify-center ${
                          selectedTasks.includes(task.id)
                            ? 'bg-primary-500 border-primary-500' 
                            : 'border-gray-300 dark:border-gray-600'
                        }`}>
                          {selectedTasks.includes(task.id) && (
                            <CheckIcon className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{task.title}</p>
                          <div className="flex items-center mt-1">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              task.priority === 'high' 
                                ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' 
                                : task.priority === 'medium'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                                : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                            }`}>
                              {task.priority}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedTasks.length} task{selectedTasks.length !== 1 ? 's' : ''} selected
                </p>
                <div className="flex space-x-2">
                  <motion.button
                    className="btn btn-secondary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAssignTasksModal(false)}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    className="btn btn-primary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAssignTasks}
                    disabled={selectedTasks.length === 0}
                  >
                    <UserPlusIcon className="h-4 w-4 mr-2" />
                    Assign Tasks
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Edit Profile Modal */}
      <AnimatePresence>
        {showEditProfileModal && editedMember && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowEditProfileModal(false)}
          >
            <motion.div
              className="glass-panel rounded-xl p-6 max-w-lg w-full"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Edit Profile: {editedMember.name}
                </h2>
                <button
                  className="p-2 text-gray-400 hover:text-gray-500 rounded-full"
                  onClick={() => setShowEditProfileModal(false)}
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <img 
                      src={editedMember.avatar} 
                      alt={editedMember.name} 
                      className="w-20 h-20 rounded-full object-cover"
                    />
                    <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full ${statusColors[editedMember.status]} border-2 border-white dark:border-gray-800`}></div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={editedMember.name}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Role
                  </label>
                  <input
                    type="text"
                    id="role"
                    name="role"
                    value={editedMember.role}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={editedMember.email}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Department
                  </label>
                  <select
                    id="department"
                    name="department"
                    value={editedMember.department}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {departmentOptions.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={editedMember.status}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="online">Online</option>
                    <option value="busy">Busy</option>
                    <option value="away">Away</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <motion.button
                  className="btn btn-secondary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowEditProfileModal(false)}
                >
                  Cancel
                </motion.button>
                <motion.button
                  className="btn btn-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEditProfile}
                >
                  <CheckIcon className="h-4 w-4 mr-2" />
                  Save Changes
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
} 