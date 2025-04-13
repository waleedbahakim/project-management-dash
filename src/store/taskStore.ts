import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Task, TaskStatus, TaskPriority, Column } from '@/types';
import { initializeWithDemoData } from '@/utils/demoData';
import { persist } from 'zustand/middleware';

interface TaskState {
  tasks: Task[];
  columns: Column[];
  searchQuery: string;
  filterStatus: TaskStatus | 'all';
  filterPriority: TaskPriority | 'all';
  
  // Actions
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (taskId: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
  deleteTask: (taskId: string) => void;
  moveTask: (taskId: string, targetStatus: TaskStatus) => void;
  setSearchQuery: (query: string) => void;
  setFilterStatus: (status: TaskStatus | 'all') => void;
  setFilterPriority: (priority: TaskPriority | 'all') => void;
  resetStore: () => void; // For resetting data
}

const initialColumns: Column[] = [
  { id: 'backlog', name: 'Backlog', tasks: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'todo', name: 'To Do', tasks: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'in-progress', name: 'In Progress', tasks: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'review', name: 'Review', tasks: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'done', name: 'Done', tasks: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

// Define initial state
const initialState = {
  tasks: [],
  columns: initialColumns,
  searchQuery: '',
  filterStatus: 'all' as TaskStatus | 'all',
  filterPriority: 'all' as TaskPriority | 'all',
};

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      addTask: (taskData) => {
        const newTask: Task = {
          id: uuidv4(),
          createdAt: new Date().toISOString(),
          ...taskData,
        };
        
        set((state) => {
          const updatedColumns = state.columns.map((column) => {
            if (column.id === taskData.status) {
              return { ...column, tasks: [...column.tasks, newTask] };
            }
            return column;
          });
          
          return { 
            tasks: [...state.tasks, newTask],
            columns: updatedColumns
          };
        });
      },
      
      updateTask: (taskId, updates) => {
        set((state) => {
          const taskIndex = state.tasks.findIndex((t) => t.id === taskId);
          if (taskIndex === -1) return state;
          
          const oldTask = state.tasks[taskIndex];
          const updatedTask = { ...oldTask, ...updates };
          const updatedTasks = [...state.tasks];
          updatedTasks[taskIndex] = updatedTask;
          
          // If status has changed, update columns
          let updatedColumns = [...state.columns];
          if (updates.status && updates.status !== oldTask.status) {
            updatedColumns = state.columns.map((column) => {
              if (column.id === oldTask.status) {
                return { ...column, tasks: column.tasks.filter((task) => 
                  typeof task === 'string' ? task !== taskId : task.id !== taskId
                )};
              }
              if (column.id === updates.status) {
                return { ...column, tasks: [...column.tasks, updatedTask] };
              }
              return column;
            });
          }
          
          return { 
            tasks: updatedTasks,
            columns: updatedColumns
          };
        });
      },
      
      deleteTask: (taskId) => {
        set((state) => {
          const task = state.tasks.find((t) => t.id === taskId);
          if (!task) return state;
          
          const updatedColumns = state.columns.map((column) => {
            if (column.id === task.status) {
              return { ...column, tasks: column.tasks.filter((task) => 
                typeof task === 'string' ? task !== taskId : task.id !== taskId
              )};
            }
            return column;
          });
          
          return { 
            tasks: state.tasks.filter((t) => t.id !== taskId),
            columns: updatedColumns
          };
        });
      },
      
      moveTask: (taskId, targetStatus) => {
        set((state) => {
          const task = state.tasks.find((t) => t.id === taskId);
          if (!task) return state;
          
          // Update the task status
          const updatedTasks = state.tasks.map((t) => 
            t.id === taskId ? { ...t, status: targetStatus } : t
          );
          
          // Update columns
          const updatedColumns = state.columns.map((column) => {
            if (column.id === task.status) {
              return { ...column, tasks: column.tasks.filter((task) => 
                typeof task === 'string' ? task !== taskId : task.id !== taskId
              )};
            }
            if (column.id === targetStatus) {
              return { ...column, tasks: [...column.tasks, updatedTasks.find(t => t.id === taskId)!] };
            }
            return column;
          });
          
          return { 
            tasks: updatedTasks,
            columns: updatedColumns
          };
        });
      },
      
      setSearchQuery: (query) => set({ searchQuery: query }),
      setFilterStatus: (status) => set({ filterStatus: status }),
      setFilterPriority: (priority) => set({ filterPriority: priority }),
      
      resetStore: () => set(initialState),
    }),
    {
      name: 'projecthub-tasks',
      onRehydrateStorage: () => {
        return (state) => {
          // If there are no tasks after rehydration, initialize with demo data
          if (state && state.tasks.length === 0) {
            setTimeout(() => {
              initializeWithDemoData(state.addTask);
            }, 500);
          }
        };
      }
    }
  )
); 