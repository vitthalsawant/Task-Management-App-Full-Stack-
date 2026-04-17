import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CreateTaskDto, PaginatedTasks, Task, TaskFilter } from '../models/task.model';

const API_BASE_URL = 'https://task-management-app-full-stack.onrender.com';

@Injectable({ providedIn: 'root' })
export class TaskService {
  constructor(private readonly http: HttpClient) {}

  getTasks(filter: TaskFilter) {
    let params = new HttpParams();
    if (filter.status) params = params.set('status', filter.status);
    if (filter.search) params = params.set('search', filter.search);
    if (filter.page) params = params.set('page', filter.page);
    if (filter.limit) params = params.set('limit', filter.limit);

    return this.http.get<{ success: boolean; message: string; data: PaginatedTasks }>(
      `${API_BASE_URL}/tasks`,
      { params },
    );
  }

  createTask(dto: CreateTaskDto) {
    return this.http.post<{ success: boolean; message: string; data: Task }>(
      `${API_BASE_URL}/tasks`,
      dto,
    );
  }

  updateTask(id: string, dto: Partial<CreateTaskDto>) {
    return this.http.put<{ success: boolean; message: string; data: Task }>(
      `${API_BASE_URL}/tasks/${id}`,
      dto,
    );
  }

  deleteTask(id: string) {
    return this.http.delete<{ success: boolean; message: string; data: { deleted: boolean } }>(
      `${API_BASE_URL}/tasks/${id}`,
    );
  }
}

