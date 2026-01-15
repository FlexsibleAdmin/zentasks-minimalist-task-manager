import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}
interface TaskState {
  tasks: Task[];
  isFocusMode: boolean;
  // Actions
  addTask: (text: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  setFocusMode: (isFocus: boolean) => void;
  clearCompleted: () => void;
}
// Initial mock data
const MOCK_TASKS: Task[] = [
  { id: '1', text: 'Review project blueprint', completed: true, createdAt: Date.now() - 100000 },
  { id: '2', text: 'Implement visual foundation', completed: false, createdAt: Date.now() - 50000 },
  { id: '3', text: 'Connect backend persistence', completed: false, createdAt: Date.now() },
];
export const useTaskStore = create<TaskState>((set) => ({
  tasks: MOCK_TASKS,
  isFocusMode: false,
  addTask: (text: string) => set((state) => ({
    tasks: [
      {
        id: uuidv4(),
        text,
        completed: false,
        createdAt: Date.now(),
      },
      ...state.tasks,
    ],
  })),
  toggleTask: (id: string) => set((state) => ({
    tasks: state.tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ),
  })),
  deleteTask: (id: string) => set((state) => ({
    tasks: state.tasks.filter((task) => task.id !== id),
  })),
  setFocusMode: (isFocus: boolean) => set({ isFocusMode: isFocus }),
  clearCompleted: () => set((state) => ({
    tasks: state.tasks.filter((task) => !task.completed),
  })),
}));