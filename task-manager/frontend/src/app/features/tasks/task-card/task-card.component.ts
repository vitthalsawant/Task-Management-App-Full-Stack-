import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Task } from '../../../core/models/task.model';
import { StatusColorPipe } from '../../../shared/pipes/status-color.pipe';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [MatIconModule, StatusColorPipe, DatePipe],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss',
})
export class TaskCardComponent {
  @Input({ required: true }) task!: Task;
  @Output() edit = new EventEmitter<Task>();
  @Output() remove = new EventEmitter<Task>();
}
