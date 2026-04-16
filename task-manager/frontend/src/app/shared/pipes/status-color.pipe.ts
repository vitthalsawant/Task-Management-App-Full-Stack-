import { Pipe, PipeTransform } from '@angular/core';
import { TaskStatus } from '../../core/models/task.model';

@Pipe({
  name: 'statusColor',
  standalone: true,
})
export class StatusColorPipe implements PipeTransform {
  transform(status: TaskStatus): string {
    switch (status) {
      case 'Done':
        return 'primary';
      case 'In Progress':
        return 'accent';
      default:
        return '';
    }
  }
}

