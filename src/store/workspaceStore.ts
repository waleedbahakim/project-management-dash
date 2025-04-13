import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Workspace, Board, Column, Task, SubTask } from '@/types';

interface WorkspaceState {
  workspace: Workspace;
  activeBoard: string | null;
  
  // Board operations
  createBoard: (name: string, description: string) => Board;
  updateBoard: (boardId: string, updates: Partial<Omit<Board, 'id'>>) => void;
  deleteBoard: (boardId: string) => void;
  setActiveBoard: (boardId: string) => void;
  
  // Column operations
  createColumn: (boardId: string, name: string, color?: string) => Column;
  updateColumn: (boardId: string, columnId: string, updates: Partial<Omit<Column, 'id'>>) => void;
  deleteColumn: (boardId: string, columnId: string) => void;
  moveColumn: (boardId: string, columnId: string, newIndex: number) => void;
  
  // Task operations
  createTask: (
    boardId: string, 
    columnId: string, 
    task: Omit<Task, 'id' | 'createdAt' | 'status' | 'subtasks'>
  ) => Task;
  updateTask: (taskId: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
  deleteTask: (taskId: string) => void;
  moveTask: (
    taskId: string, 
    sourceBoardId: string, 
    sourceColumnId: string, 
    destinationBoardId: string, 
    destinationColumnId: string, 
    newIndex?: number
  ) => void;
  
  // Subtask operations
  addSubtask: (taskId: string, title: string) => SubTask;
  updateSubtask: (taskId: string, subtaskId: string, updates: Partial<Omit<SubTask, 'id'>>) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;
}

// Create default workspace structure
const createDefaultWorkspace = (): Workspace => {
  const now = new Date().toISOString();
  const defaultColumns: Column[] = [
    { id: uuidv4(), name: 'To Do', tasks: [], createdAt: now, updatedAt: now },
    { id: uuidv4(), name: 'In Progress', tasks: [], createdAt: now, updatedAt: now },
    { id: uuidv4(), name: 'Done', tasks: [], createdAt: now, updatedAt: now },
  ];
  
  const defaultBoard: Board = {
    id: uuidv4(),
    name: 'Main Project',
    description: 'This is your first project board',
    columns: defaultColumns,
    createdAt: now,
    updatedAt: now,
  };
  
  return {
    id: uuidv4(),
    name: 'My Workspace',
    description: 'Default workspace',
    boards: [defaultBoard],
    members: [],
    tasks: {},
    createdAt: now,
    updatedAt: now,
  };
};

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      workspace: createDefaultWorkspace(),
      activeBoard: null,
      
      createBoard: (name, description) => {
        const now = new Date().toISOString();
        const defaultColumns: Column[] = [
          { id: uuidv4(), name: 'To Do', tasks: [], createdAt: now, updatedAt: now },
          { id: uuidv4(), name: 'In Progress', tasks: [], createdAt: now, updatedAt: now },
          { id: uuidv4(), name: 'Done', tasks: [], createdAt: now, updatedAt: now },
        ];
        
        const newBoard: Board = {
          id: uuidv4(),
          name,
          description,
          columns: defaultColumns,
          createdAt: now,
          updatedAt: now,
        };
        
        set((state) => ({
          workspace: {
            ...state.workspace,
            boards: [...state.workspace.boards, newBoard],
            updatedAt: now,
          },
        }));
        
        return newBoard;
      },
      
      updateBoard: (boardId, updates) => {
        const now = new Date().toISOString();
        
        set((state) => ({
          workspace: {
            ...state.workspace,
            boards: state.workspace.boards.map((board) => 
              board.id === boardId 
                ? { ...board, ...updates, updatedAt: now } 
                : board
            ),
            updatedAt: now,
          },
        }));
      },
      
      deleteBoard: (boardId) => {
        const now = new Date().toISOString();
        const { workspace, activeBoard } = get();
        const board = workspace.boards.find(b => b.id === boardId);
        
        if (!board) return;
        
        // Get all task IDs from this board
        const taskIdsToRemove: string[] = [];
        board.columns.forEach(column => {
          // Extract task IDs from the tasks array
          column.tasks.forEach(task => {
            if (typeof task === 'string') {
              taskIdsToRemove.push(task);
            } else {
              taskIdsToRemove.push(task.id);
            }
          });
        });
        
        const updatedTasks = { ...workspace.tasks };
        
        taskIdsToRemove.forEach(taskId => {
          delete updatedTasks[taskId];
        });
        
        set({
          workspace: {
            ...workspace,
            boards: workspace.boards.filter(b => b.id !== boardId),
            tasks: updatedTasks,
            updatedAt: now,
          },
          // Reset active board if deleted
          activeBoard: activeBoard === boardId ? null : activeBoard,
        });
      },
      
      setActiveBoard: (boardId) => {
        set({ activeBoard: boardId });
      },
      
      createColumn: (boardId, name, color) => {
        const now = new Date().toISOString();
        const newColumn: Column = {
          id: uuidv4(),
          name,
          tasks: [],
          createdAt: now,
          updatedAt: now,
        };
        
        set((state) => ({
          workspace: {
            ...state.workspace,
            boards: state.workspace.boards.map((board) => 
              board.id === boardId 
                ? { 
                    ...board, 
                    columns: [...board.columns, newColumn],
                    updatedAt: now,
                  }
                : board
            ),
            updatedAt: now,
          },
        }));
        
        return newColumn;
      },
      
      updateColumn: (boardId, columnId, updates) => {
        const now = new Date().toISOString();
        
        set((state) => ({
          workspace: {
            ...state.workspace,
            boards: state.workspace.boards.map((board) => 
              board.id === boardId 
                ? { 
                    ...board, 
                    columns: board.columns.map((column) => 
                      column.id === columnId
                        ? { ...column, ...updates }
                        : column
                    ),
                    updatedAt: now,
                  }
                : board
            ),
            updatedAt: now,
          },
        }));
      },
      
      deleteColumn: (boardId, columnId) => {
        const now = new Date().toISOString();
        const { workspace } = get();
        const board = workspace.boards.find(b => b.id === boardId);
        
        if (!board) return;
        
        const column = board.columns.find(c => c.id === columnId);
        
        if (!column) return;
        
        // Get all task IDs from this column
        const taskIdsToRemove: string[] = [];
        column.tasks.forEach(task => {
          if (typeof task === 'string') {
            taskIdsToRemove.push(task);
          } else {
            taskIdsToRemove.push(task.id);
          }
        });
        
        const updatedTasks = { ...workspace.tasks };
        
        taskIdsToRemove.forEach(taskId => {
          delete updatedTasks[taskId];
        });
        
        set({
          workspace: {
            ...workspace,
            boards: workspace.boards.map((board) => 
              board.id === boardId 
                ? { 
                    ...board, 
                    columns: board.columns.filter(c => c.id !== columnId),
                    updatedAt: now,
                  }
                : board
            ),
            tasks: updatedTasks,
            updatedAt: now,
          },
        });
      },
      
      moveColumn: (boardId, columnId, newIndex) => {
        const now = new Date().toISOString();
        const { workspace } = get();
        const board = workspace.boards.find(b => b.id === boardId);
        
        if (!board) return;
        
        const oldIndex = board.columns.findIndex(c => c.id === columnId);
        if (oldIndex === -1) return;
        
        const updatedColumns = [...board.columns];
        const [movedColumn] = updatedColumns.splice(oldIndex, 1);
        updatedColumns.splice(newIndex, 0, movedColumn);
        
        set({
          workspace: {
            ...workspace,
            boards: workspace.boards.map((board) => 
              board.id === boardId 
                ? { 
                    ...board, 
                    columns: updatedColumns,
                    updatedAt: now,
                  }
                : board
            ),
            updatedAt: now,
          },
        });
      },
      
      createTask: (boardId, columnId, taskData) => {
        const now = new Date().toISOString();
        const { workspace } = get();
        const board = workspace.boards.find(b => b.id === boardId);
        
        if (!board) throw new Error('Board not found');
        
        const column = board.columns.find(c => c.id === columnId);
        if (!column) throw new Error('Column not found');
        
        const newTask: Task = {
          id: uuidv4(),
          ...taskData,
          status: column.name,
          createdAt: now,
          subtasks: [],
        };
        
        set({
          workspace: {
            ...workspace,
            boards: workspace.boards.map((board) => 
              board.id === boardId 
                ? { 
                    ...board, 
                    columns: board.columns.map((column) => 
                      column.id === columnId
                        ? { ...column, tasks: [...column.tasks, newTask.id] }
                        : column
                    ),
                    updatedAt: now,
                  }
                : board
            ),
            tasks: {
              ...workspace.tasks,
              [newTask.id]: newTask,
            },
            updatedAt: now,
          },
        });
        
        return newTask;
      },
      
      updateTask: (taskId, updates) => {
        const now = new Date().toISOString();
        const { workspace } = get();
        
        if (!workspace.tasks[taskId]) return;
        
        set({
          workspace: {
            ...workspace,
            tasks: {
              ...workspace.tasks,
              [taskId]: {
                ...workspace.tasks[taskId],
                ...updates,
              },
            },
            updatedAt: now,
          },
        });
      },
      
      deleteTask: (taskId) => {
        const now = new Date().toISOString();
        const { workspace } = get();
        
        if (!workspace.tasks[taskId]) return;
        
        // Find which board and column contain this task
        let targetBoardId: string | null = null;
        let targetColumnId: string | null = null;
        
        workspace.boards.forEach(board => {
          board.columns.forEach(column => {
            const taskIdStr = taskId.toString();
            if (column.tasks.some(task => 
              (typeof task === 'string' && task === taskIdStr) || 
              (typeof task === 'object' && task.id === taskIdStr)
            )) {
              targetBoardId = board.id;
              targetColumnId = column.id;
            }
          });
        });
        
        if (!targetBoardId || !targetColumnId) return;
        
        // Create a copy of tasks and remove the task
        const updatedTasks = { ...workspace.tasks };
        delete updatedTasks[taskId];
        
        set({
          workspace: {
            ...workspace,
            boards: workspace.boards.map((board) => 
              board.id === targetBoardId 
                ? { 
                    ...board, 
                    columns: board.columns.map((column) => 
                      column.id === targetColumnId
                        ? { 
                            ...column, 
                            tasks: column.tasks.filter(task => 
                              (typeof task === 'string' && task !== taskId) ||
                              (typeof task === 'object' && task.id !== taskId)
                            )
                          }
                        : column
                    ),
                    updatedAt: now,
                  }
                : board
            ),
            tasks: updatedTasks,
            updatedAt: now,
          },
        });
      },
      
      moveTask: (
        taskId, 
        sourceBoardId, 
        sourceColumnId, 
        destinationBoardId, 
        destinationColumnId, 
        newIndex
      ) => {
        const now = new Date().toISOString();
        const { workspace } = get();
        
        const sourceBoard = workspace.boards.find(b => b.id === sourceBoardId);
        const destinationBoard = workspace.boards.find(b => b.id === destinationBoardId);
        
        if (!sourceBoard || !destinationBoard) return;
        
        const sourceColumn = sourceBoard.columns.find(c => c.id === sourceColumnId);
        const destinationColumn = destinationBoard.columns.find(c => c.id === destinationColumnId);
        
        if (!sourceColumn || !destinationColumn) return;
        
        // Remove task from source column
        const updatedSourceColumn = {
          ...sourceColumn,
          tasks: sourceColumn.tasks.filter(task => 
            (typeof task === 'string' && task !== taskId) ||
            (typeof task === 'object' && task.id !== taskId)
          )
        };
        
        // Update destination column tasks
        let updatedDestTasks = [...destinationColumn.tasks];
        
        if (typeof newIndex === 'number') {
          // Insert at specific index if provided
          updatedDestTasks.splice(newIndex, 0, taskId);
        } else {
          // Append to the end if no index provided
          updatedDestTasks.push(taskId);
        }
        
        const updatedDestinationColumn = {
          ...destinationColumn,
          tasks: updatedDestTasks,
        };
        
        // Update the task's status if moved to a different column
        const task = workspace.tasks[taskId];
        if (task && destinationColumn.name !== task.status) {
          workspace.tasks[taskId] = {
            ...task,
            status: destinationColumn.name,
          };
        }
        
        set({
          workspace: {
            ...workspace,
            boards: workspace.boards.map(board => {
              if (board.id === sourceBoardId) {
                return {
                  ...board,
                  columns: board.columns.map(col => 
                    col.id === sourceColumnId ? updatedSourceColumn : col
                  ),
                  updatedAt: now,
                };
              }
              
              if (board.id === destinationBoardId) {
                return {
                  ...board,
                  columns: board.columns.map(col => 
                    col.id === destinationColumnId ? updatedDestinationColumn : col
                  ),
                  updatedAt: now,
                };
              }
              
              return board;
            }),
            updatedAt: now,
          },
        });
      },
      
      addSubtask: (taskId, title) => {
        const now = new Date().toISOString();
        const { workspace } = get();
        
        if (!workspace.tasks[taskId]) throw new Error('Task not found');
        
        const task = workspace.tasks[taskId];
        
        const newSubtask: SubTask = {
          id: uuidv4(),
          title,
          completed: false,
        };
        
        const subtasks = task.subtasks || [];
        
        set({
          workspace: {
            ...workspace,
            tasks: {
              ...workspace.tasks,
              [taskId]: {
                ...workspace.tasks[taskId],
                subtasks: [...subtasks, newSubtask],
              },
            },
            updatedAt: now,
          },
        });
        
        return newSubtask;
      },
      
      updateSubtask: (taskId, subtaskId, updates) => {
        const now = new Date().toISOString();
        const { workspace } = get();
        
        if (!workspace.tasks[taskId]) return;
        
        const task = workspace.tasks[taskId];
        const subtasks = task.subtasks || [];
        const subtaskIndex = subtasks.findIndex(st => st.id === subtaskId);
        
        if (subtaskIndex === -1) return;
        
        const updatedSubtasks = [...subtasks];
        updatedSubtasks[subtaskIndex] = {
          ...updatedSubtasks[subtaskIndex],
          ...updates,
        };
        
        set({
          workspace: {
            ...workspace,
            tasks: {
              ...workspace.tasks,
              [taskId]: {
                ...workspace.tasks[taskId],
                subtasks: updatedSubtasks,
              },
            },
            updatedAt: now,
          },
        });
      },
      
      toggleSubtask: (taskId, subtaskId) => {
        const now = new Date().toISOString();
        const { workspace } = get();
        
        if (!workspace.tasks[taskId]) return;
        
        const task = workspace.tasks[taskId];
        const subtasks = task.subtasks || [];
        const subtaskIndex = subtasks.findIndex(st => st.id === subtaskId);
        
        if (subtaskIndex === -1) return;
        
        const updatedSubtasks = [...subtasks];
        updatedSubtasks[subtaskIndex] = {
          ...updatedSubtasks[subtaskIndex],
          completed: !updatedSubtasks[subtaskIndex].completed,
        };
        
        set({
          workspace: {
            ...workspace,
            tasks: {
              ...workspace.tasks,
              [taskId]: {
                ...workspace.tasks[taskId],
                subtasks: updatedSubtasks,
              },
            },
            updatedAt: now,
          },
        });
      },
      
      deleteSubtask: (taskId, subtaskId) => {
        const now = new Date().toISOString();
        const { workspace } = get();
        
        if (!workspace.tasks[taskId]) return;
        
        const task = workspace.tasks[taskId];
        const subtasks = task.subtasks || [];
        
        set({
          workspace: {
            ...workspace,
            tasks: {
              ...workspace.tasks,
              [taskId]: {
                ...workspace.tasks[taskId],
                subtasks: subtasks.filter(st => st.id !== subtaskId),
              },
            },
            updatedAt: now,
          },
        });
      },
    }),
    {
      name: 'workspace-storage',
    }
  )
); 