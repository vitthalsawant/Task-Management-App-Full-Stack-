import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, RouterLink],
  template: `
    <mat-toolbar color="primary" class="toolbar">
      <a class="brand" routerLink="/tasks">
        <mat-icon>check_circle</mat-icon>
        <span>Task Manager</span>
      </a>

      <span class="spacer"></span>

      @if (isAuthed()) {
        <span class="user">{{ userName() }}</span>
        <button mat-stroked-button (click)="logout()">Logout</button>
      } @else {
        <a mat-stroked-button routerLink="/login">Login</a>
      }
    </mat-toolbar>
  `,
  styles: [
    `
      .toolbar {
        position: sticky;
        top: 0;
        z-index: 100;
      }
      .brand {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        color: inherit;
        text-decoration: none;
        font-weight: 600;
      }
      .spacer {
        flex: 1;
      }
      .user {
        margin-right: 12px;
        opacity: 0.9;
      }
    `,
  ],
})
export class NavbarComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly isAuthed = computed(() => this.auth.isAuthenticated());
  readonly userName = computed(() => this.auth.user()?.name ?? '');

  async logout() {
    this.auth.logout();
    await this.router.navigateByUrl('/login');
  }
}

