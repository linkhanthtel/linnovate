import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  tags: string[];
  category: string;
  dueDate: string;
  createdAt: string;
}

class TaskStore {
  private STORAGE_KEY = '@tasks';

  async getTasks(): Promise<Task[]> {
    try {
      const tasksJson = await AsyncStorage.getItem(this.STORAGE_KEY);
      return tasksJson ? JSON.parse(tasksJson) : [];
    } catch (error) {
      console.error('Error getting tasks:', error);
      return [];
    }
  }

  async addTask(taskData: Omit<Task, 'id' | 'createdAt'>): Promise<Task> {
    try {
      const tasks = await this.getTasks();
      const newTask: Task = {
        ...taskData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify([...tasks, newTask]));
      return newTask;
    } catch (error) {
      console.error('Error adding task:', error);
      throw new Error('Failed to add task');
    }
  }

  async updateTask(updatedTask: Task): Promise<Task> {
    try {
      const tasks = await this.getTasks();
      const updatedTasks = tasks.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      );
      
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedTasks));
      return updatedTask;
    } catch (error) {
      console.error('Error updating task:', error);
      throw new Error('Failed to update task');
    }
  }

  async deleteTask(taskId: string): Promise<void> {
    try {
      const tasks = await this.getTasks();
      const filteredTasks = tasks.filter(task => task.id !== taskId);
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredTasks));
    } catch (error) {
      console.error('Error deleting task:', error);
      throw new Error('Failed to delete task');
    }
  }
}

export const taskStore = new TaskStore();