import { Component, Input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  template: `
    <div class="wrap" [style.minHeight.px]="minHeight">
      <mat-progress-spinner mode="indeterminate" [diameter]="diameter" />
    </div>
  `,
  styles: [
    `
      .wrap {
        display: grid;
        place-items: center;
        width: 100%;
      }
    `,
  ],
})
export class LoadingSpinnerComponent {
  @Input() diameter = 40;
  @Input() minHeight = 120;
}

