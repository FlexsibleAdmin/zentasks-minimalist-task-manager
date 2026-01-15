import { DurableObject } from "cloudflare:workers";
import type { DemoItem, Task } from '@shared/types';
import { MOCK_ITEMS } from '@shared/mock-data';
// **DO NOT MODIFY THE CLASS NAME**
export class GlobalDurableObject extends DurableObject {
    async getCounterValue(): Promise<number> {
      const value = (await this.ctx.storage.get("counter_value")) || 0;
      return value as number;
    }
    async increment(amount = 1): Promise<number> {
      let value: number = (await this.ctx.storage.get("counter_value")) || 0;
      value += amount;
      await this.ctx.storage.put("counter_value", value);
      return value;
    }
    async decrement(amount = 1): Promise<number> {
      let value: number = (await this.ctx.storage.get("counter_value")) || 0;
      value -= amount;
      await this.ctx.storage.put("counter_value", value);
      return value;
    }
    async getDemoItems(): Promise<DemoItem[]> {
      const items = await this.ctx.storage.get("demo_items");
      if (items) {
        return items as DemoItem[];
      }
      await this.ctx.storage.put("demo_items", MOCK_ITEMS);
      return MOCK_ITEMS;
    }
    async addDemoItem(item: DemoItem): Promise<DemoItem[]> {
      const items = await this.getDemoItems();
      const updatedItems = [...items, item];
      await this.ctx.storage.put("demo_items", updatedItems);
      return updatedItems;
    }
    async updateDemoItem(id: string, updates: Partial<Omit<DemoItem, 'id'>>): Promise<DemoItem[]> {
      const items = await this.getDemoItems();
      const updatedItems = items.map(item =>
        item.id === id ? { ...item, ...updates } : item
      );
      await this.ctx.storage.put("demo_items", updatedItems);
      return updatedItems;
    }
    async deleteDemoItem(id: string): Promise<DemoItem[]> {
      const items = await this.getDemoItems();
      const updatedItems = items.filter(item => item.id !== id);
      await this.ctx.storage.put("demo_items", updatedItems);
      return updatedItems;
    }
    // Task Management Methods
    async getTasks(): Promise<Task[]> {
        const tasks = await this.ctx.storage.get("tasks");
        return (tasks as Task[]) || [];
    }
    async addTask(task: Task): Promise<Task[]> {
        const tasks = await this.getTasks();
        // Add to top of list
        const updatedTasks = [task, ...tasks];
        await this.ctx.storage.put("tasks", updatedTasks);
        return updatedTasks;
    }
    async updateTask(id: string, updates: Partial<Task>): Promise<Task[]> {
        const tasks = await this.getTasks();
        const updatedTasks = tasks.map(t => t.id === id ? { ...t, ...updates } : t);
        await this.ctx.storage.put("tasks", updatedTasks);
        return updatedTasks;
    }
    async deleteTask(id: string): Promise<Task[]> {
        const tasks = await this.getTasks();
        const updatedTasks = tasks.filter(t => t.id !== id);
        await this.ctx.storage.put("tasks", updatedTasks);
        return updatedTasks;
    }
    async clearCompletedTasks(): Promise<Task[]> {
        const tasks = await this.getTasks();
        const updatedTasks = tasks.filter(t => !t.completed);
        await this.ctx.storage.put("tasks", updatedTasks);
        return updatedTasks;
    }
    async deleteAllTasks(): Promise<Task[]> {
        const emptyTasks: Task[] = [];
        await this.ctx.storage.put("tasks", emptyTasks);
        return emptyTasks;
    }
}