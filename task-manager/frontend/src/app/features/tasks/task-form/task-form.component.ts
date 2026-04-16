import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { CreateTaskDto, Task, TaskStatus } from '../../../core/models/task.model';

export interface TaskFormData {
  mode: 'create' | 'edit';
  task?: Task;
}

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatIconModule,
  ],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
})
export class TaskFormComponent {
  private readonly dialogRef = inject(MatDialogRef<TaskFormComponent>);
  private readonly data = inject<TaskFormData>(MAT_DIALOG_DATA);
  private readonly fb = inject(FormBuilder);

  readonly statuses: TaskStatus[] = ['Todo', 'In Progress', 'Done'];

  readonly form = this.fb.nonNullable.group({
    title: [this.data.task?.title ?? '', [Validators.required, Validators.maxLength(100)]],
    description: [this.data.task?.description ?? '', [Validators.maxLength(500)]],
    status: [this.data.task?.status ?? 'Todo' as TaskStatus],
    dueDate: [this.data.task?.dueDate ? new Date(this.data.task.dueDate) : null as Date | null],
  });

  get title() {
    return this.data.mode === 'edit' ? 'Edit task' : 'New task';
  }

  save() {
    if (this.form.invalid) return;
    const raw = this.form.getRawValue();

    const dto: CreateTaskDto = {
      title: raw.title,
      description: raw.description || '',
      status: raw.status,
      dueDate: raw.dueDate ? raw.dueDate.toISOString() : undefined,
    };

    this.dialogRef.close(dto);
  }

  cancel() {
    this.dialogRef.close();
  }
}

