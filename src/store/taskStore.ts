import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { Task, ApiResponse } from '@shared/types';
// Re-export Task for components
export type { Task };
interface TaskState {
  tasks: Task[];
  isFocusMode: boolean;
  isZenMode: boolean;
  isLoading: boolean;
  error: string | null;
  // Actions
  fetchTasks: () => Promise<void>;
  addTask: (text: string) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  setFocusMode: (isFocus: boolean) => void;
  toggleZenMode: () => void;
  clearCompleted: () => Promise<void>;
  deleteAllTasks: () => Promise<void>;
}
export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isFocusMode: false,
  isZenMode: false,
  isLoading: false,
  error: null,
  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch('/api/tasks');
      const data = await res.json() as ApiResponse<Task[]>;
      if (data.success && data.data) {
        set({ tasks: data.data });
      } else {
        set({ error: data.error || 'Failed to fetch tasks' });
      }
    } catch (err) {
      set({ error: 'Network error' });
      console.error(err);
    } finally {
      set({ isLoading: false });
    }
  },
  addTask: async (text: string) => {
    const newTask: Task = {
      id: uuidv4(),
      text,
      completed: false,
      createdAt: Date.now(),
    };
    // Optimistic update
    set((state) => ({
      tasks: [newTask, ...state.tasks],
    }));
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });
      const data = await res.json() as ApiResponse<Task[]>;
      if (!data.success) {
        console.error('Failed to sync add task:', data.error);
        // In a real app, we might revert the optimistic update here
      } else if (data.data) {
          // Sync with server state
          set({ tasks: data.data });
      }
    } catch (err) {
      console.error('Network error adding task:', err);
    }
  },
  toggleTask: async (id: string) => {
    const task = get().tasks.find(t => t.id === id);
    if (!task) return;
    const updates = { completed: !task.completed };
    // Optimistic update
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, ...updates } : t
      ),
    }));
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await res.json() as ApiResponse<Task[]>;
      if (!data.success) {
        console.error('Failed to sync toggle task:', data.error);
      } else if (data.data) {
          set({ tasks: data.data });
      }
    } catch (err) {
      console.error('Network error toggling task:', err);
    }
  },
  deleteTask: async (id: string) => {
    // Optimistic update
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    }));
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json() as ApiResponse<Task[]>;
      if (!data.success) {
        console.error('Failed to sync delete task:', data.error);
      } else if (data.data) {
          set({ tasks: data.data });
      }
    } catch (err) {
      console.error('Network error deleting task:', err);
    }
  },
  setFocusMode: (isFocus: boolean) => set({ isFocusMode: isFocus }),
  toggleZenMode: () => set((state) => ({ isZenMode: !state.isZenMode })),
  clearCompleted: async () => {
    // Optimistic update
    set((state) => ({
      tasks: state.tasks.filter((t) => !t.completed),
    }));
    try {
      const res = await fetch('/api/tasks/completed', {
        method: 'DELETE',
      });
      const data = await res.json() as ApiResponse<Task[]>;
      if (!data.success) {
        console.error('Failed to sync clear completed:', data.error);
      } else if (data.data) {
          set({ tasks: data.data });
      }
    } catch (err) {
      console.error('Network error clearing completed:', err);
    }
  },
  deleteAllTasks: async () => {
    // Optimistic update
    set({ tasks: [] });
    try {
      const res = await fetch('/api/tasks/all', {
        method: 'DELETE',
      });
      const data = await res.json() as ApiResponse<Task[]>;
      if (!data.success) {
        console.error('Failed to sync delete all tasks:', data.error);
      } else if (data.data) {
          set({ tasks: data.data });
      }
    } catch (err) {
      console.error('Network error deleting all tasks:', err);
    }
  }
}));