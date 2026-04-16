import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';

import { TaskService } from '../../../core/services/task.service';
import { CreateTaskDto, PaginatedTasks, Task, TaskStatus } from '../../../core/models/task.model';
import { TaskCardComponent } from '../task-card/task-card.component';
import { TaskFormComponent, TaskFormData } from '../task-form/task-form.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    TaskCardComponent,
    LoadingSpinnerComponent,
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent implements OnInit, OnDestroy {
  private readonly tasksApi = inject(TaskService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  readonly searchControl = new FormControl('', { nonNullable: true });
  readonly status = signal<TaskStatus | ''>('');

  readonly loading = signal(false);
  readonly data = signal<PaginatedTasks | null>(null);

  private readonly sub = new Subscription();

  ngOnInit() {
    this.load();

    this.sub.add(
      this.searchControl.valueChanges
        .pipe(debounceTime(300), distinctUntilChanged())
        .subscribe(() => this.load()),
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  setStatus(value: TaskStatus | '') {
    this.status.set(value);
    this.load();
  }

  load() {
    this.loading.set(true);
    this.tasksApi
      .getTasks({
        status: this.status() || undefined,
        search: this.searchControl.value || undefined,
        page: 1,
        limit: 12,
      })
      .subscribe({
        next: (res) => {
          this.data.set(res.data);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }

  openCreate() {
    const ref = this.dialog.open<TaskFormComponent, TaskFormData, CreateTaskDto>(TaskFormComponent, {
      width: '640px',
      data: { mode: 'create' },
    });

    ref.afterClosed().subscribe((dto) => {
      if (!dto) return;
      this.tasksApi.createTask(dto).subscribe({
        next: () => {
          this.snackBar.open('Task created', 'Dismiss', { duration: 2500 });
          this.load();
        },
      });
    });
  }

  openEdit(task: Task) {
    const ref = this.dialog.open<TaskFormComponent, TaskFormData, CreateTaskDto>(TaskFormComponent, {
      width: '640px',
      data: { mode: 'edit', task },
    });

    ref.afterClosed().subscribe((dto) => {
      if (!dto) return;
      this.tasksApi.updateTask(task._id, dto).subscribe({
        next: () => {
          this.snackBar.open('Task updated', 'Dismiss', { duration: 2500 });
          this.load();
        },
      });
    });
  }

  delete(task: Task) {
    this.tasksApi.deleteTask(task._id).subscribe({
      next: () => {
        this.snackBar.open('Task deleted', 'Dismiss', { duration: 2500 });
        this.load();
      },
    });
  }
}

