export interface DemoItem {
  id: string;
  name: string;
  value: number;
}
export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}