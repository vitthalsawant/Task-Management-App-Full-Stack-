export type TaskStatus = 'Todo' | 'In Progress' | 'Done';

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  status?: TaskStatus;
  dueDate?: string;
}

export interface TaskFilter {
  status?: TaskStatus | '';
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedTasks {
  items: Task[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

