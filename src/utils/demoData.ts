import { Task, TaskPriority, TaskStatus } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Sample data for generating tasks
const taskTitles = [
  'Implement authentication flow',
  'Design landing page mockups',
  'Fix responsive layout issues',
  'Update dependencies',
  'Create documentation',
  'Set up CI/CD pipeline',
  'Refactor database queries',
  'Optimize image loading',
  'Add dark mode support',
  'Create user onboarding flow',
  'Implement real-time notifications',
  'Fix search functionality',
  'Update API endpoints',
  'Conduct user testing',
  'Improve accessibility',
  'Optimize database queries',
  'Add analytics tracking',
  'Bug fix: user profile',
  'Implement file upload feature',
  'Create admin dashboard',
];

const taskDescriptions = [
  'This task involves creating a robust solution that will enhance the user experience.',
  'We need to address this issue before the next release to ensure smooth operation.',
  'This feature has been requested by multiple users and should be prioritized.',
  'The current implementation needs to be optimized for better performance.',
  'This is a maintenance task that will improve the overall codebase health.',
  'We should implement this using the latest best practices in the industry.',
  'This is a critical bug that needs to be fixed as soon as possible.',
  'This enhancement will significantly improve the user workflow.',
  'The current solution is not scalable and needs to be redesigned.',
  'This task requires coordination with the design team for optimal results.',
];

const assignees = [
  'John Smith',
  'Emily Johnson',
  'Michael Brown',
  'Sophia Davis',
  'William Wilson',
  'Olivia Martinez',
  'James Taylor',
  'Emma Anderson',
  'Alexander Thomas',
  'Isabella Jackson',
];

/**
 * Generate a random date within a specified range
 */
const getRandomDate = (start: Date, end: Date): string => {
  const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return randomDate.toISOString();
};

/**
 * Generate a random priority
 */
const getRandomPriority = (): TaskPriority => {
  const priorities: TaskPriority[] = ['low', 'medium', 'high', 'urgent'];
  return priorities[Math.floor(Math.random() * priorities.length)];
};

/**
 * Generate a random status
 */
const getRandomStatus = (): TaskStatus => {
  const statuses: TaskStatus[] = ['backlog', 'todo', 'in-progress', 'review', 'done'];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

/**
 * Generate a single random task
 */
const generateRandomTask = (): Task => {
  const createdAt = getRandomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date());
  const updatedAt = getRandomDate(new Date(createdAt), new Date());
  
  return {
    id: uuidv4(),
    title: taskTitles[Math.floor(Math.random() * taskTitles.length)],
    description: taskDescriptions[Math.floor(Math.random() * taskDescriptions.length)],
    status: getRandomStatus(),
    priority: getRandomPriority(),
    createdAt,
    updatedAt,
    assignee: Math.random() > 0.3 ? assignees[Math.floor(Math.random() * assignees.length)] : undefined,
    dueDate: Math.random() > 0.5 ? getRandomDate(new Date(), new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)) : undefined,
  };
};

/**
 * Generate multiple random tasks
 */
export const generateDemoTasks = (count: number = 15): Task[] => {
  return Array.from({ length: count }, () => generateRandomTask());
};

/**
 * Initialize the task store with demo data
 */
export const initializeWithDemoData = (addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void) => {
  const demoTasks = generateDemoTasks();
  
  demoTasks.forEach(task => {
    const { id, createdAt, ...taskData } = task;
    addTask(taskData);
  });
}; 