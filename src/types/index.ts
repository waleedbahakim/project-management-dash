export type TaskStatus = string;

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent' | 'none';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

export interface Comment {
  id: string;
  text: string;
  author: string;
  authorAvatar?: string;
  createdAt: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status?: TaskStatus;
  priority: TaskPriority;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  assignedTo?: string;
  assignee?: string;
  assigneeAvatar?: string;
  tags?: string[];
  labels?: string[];
  subtasks?: SubTask[];
  checklist?: ChecklistItem[];
  comments?: Comment[];
  attachments?: Attachment[];
}

export interface User {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  role: 'admin' | 'member' | 'viewer';
}

export interface Column {
  id: string;
  name: string;
  tasks: Task[] | string[] | (string | Task)[];  // Can be task objects, task IDs as strings, or a mix
  createdAt: string;
  updatedAt: string;
}

export interface Board {
  id: string;
  name: string;
  description?: string;
  columns: Column[];
  createdAt: string;
  updatedAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  description: string;
  boards: Board[];
  members: User[];
  createdAt: string;
  updatedAt: string;
  tasks: Record<string, Task>; // All tasks across all boards
}

// Animation and UI types
export interface TransitionConfig {
  type: 'tween' | 'spring' | 'inertia';
  duration?: number;
  stiffness?: number;
  damping?: number;
  mass?: number;
  bounce?: number;
}

export interface ThemeConfig {
  mode: 'light' | 'dark' | 'system';
  accentColor: string;
  glassEffect: boolean;
  animation: {
    enabled: boolean;
    intensity: 'subtle' | 'medium' | 'high';
    transitions: TransitionConfig;
  };
  density: 'compact' | 'comfortable' | 'spacious';
}

export interface UITheme {
  mode: 'light' | 'dark';
  glassEffect: boolean;
  animation: {
    enabled: boolean;
    transitions: {
      duration: number;
      ease: string;
    };
  };
} 