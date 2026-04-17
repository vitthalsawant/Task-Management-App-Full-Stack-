import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatIconModule, RouterLink],
  template: `
    <nav class="navbar">
      <div class="navbar-inner">
        <a class="brand" routerLink="/tasks">
          <span class="brand-icon">
            <mat-icon>check_circle</mat-icon>
          </span>
          <span class="brand-name">Task Manager</span>
        </a>

        <div class="nav-right">
          @if (isAuthed()) {
            <a class="btn-details" routerLink="/project-details">
              <mat-icon class="btn-icon">description</mat-icon>
              <span>Project Details</span>
            </a>
            <div class="user-pill">
              <div class="user-avatar">{{ initial() }}</div>
              <span class="user-name">{{ userName() }}</span>
            </div>
            <button class="btn-logout" (click)="logout()">
              <mat-icon class="btn-icon">logout</mat-icon>
              <span>Logout</span>
            </button>
          } @else {
            <a class="btn-login" routerLink="/login">Login</a>
          }
        </div>
      </div>
    </nav>
  `,
  styles: [
    `
      .navbar {
        position: sticky;
        top: 0;
        z-index: 100;
        background: var(--color-surface);
        border-bottom: 1px solid var(--color-border);
        box-shadow: var(--shadow-sm);
      }

      .navbar-inner {
        max-width: 1280px;
        margin: 0 auto;
        padding: 0 24px;
        height: 64px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
      }

      .brand {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        text-decoration: none;
        color: var(--color-primary);
        font-weight: 700;
        font-size: 18px;
        letter-spacing: -0.02em;
        transition: opacity 0.15s ease;

        &:hover {
          opacity: 0.85;
        }
      }

      .brand-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 34px;
        height: 34px;
        background: var(--color-primary-light);
        border-radius: 9px;
        color: var(--color-primary);

        mat-icon {
          font-size: 20px;
          width: 20px;
          height: 20px;
        }
      }

      .nav-right {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .user-pill {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 4px 12px 4px 4px;
        background: var(--color-border-light);
        border-radius: var(--radius-full);
      }

      .user-avatar {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: var(--color-primary);
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 13px;
        flex-shrink: 0;
      }

      .user-name {
        font-size: 13px;
        font-weight: 500;
        color: var(--color-text-muted);
        max-width: 140px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .btn-logout {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 7px 14px;
        border-radius: var(--radius-sm);
        border: 1px solid var(--color-border);
        background: transparent;
        color: var(--color-text-muted);
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        font-family: var(--font-sans);
        transition: all 0.15s ease;

        .btn-icon {
          font-size: 16px;
          width: 16px;
          height: 16px;
        }

        &:hover {
          background: var(--color-bg);
          border-color: var(--color-text-light);
          color: var(--color-text);
        }
      }

      .btn-details {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 7px 14px;
        border-radius: var(--radius-sm);
        border: 1px solid var(--color-primary);
        background: var(--color-primary-light);
        color: var(--color-primary);
        text-decoration: none;
        font-size: 13px;
        font-weight: 600;
        font-family: var(--font-sans);
        transition: all 0.15s ease;

        .btn-icon {
          font-size: 16px;
          width: 16px;
          height: 16px;
        }

        &:hover {
          background: var(--color-primary);
          color: #fff;
        }
      }

      .btn-login {
        display: inline-flex;
        align-items: center;
        padding: 8px 20px;
        border-radius: var(--radius-sm);
        background: var(--color-primary);
        color: #fff;
        text-decoration: none;
        font-size: 14px;
        font-weight: 600;
        font-family: var(--font-sans);
        transition: background 0.15s ease, transform 0.1s ease;

        &:hover {
          background: var(--color-primary-hover);
          transform: translateY(-1px);
        }
      }

      @media (max-width: 480px) {
        .navbar-inner {
          padding: 0 16px;
        }

        .user-name {
          display: none;
        }

        .btn-details span,
        .btn-logout span {
          display: none;
        }
      }
    `,
  ],
})
export class NavbarComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  // Use the auth user signal so navbar reacts immediately after login/logout.
  readonly isAuthed = computed(() => !!this.auth.user());
  readonly userName = computed(() => this.auth.user()?.name ?? '');
  readonly initial = computed(() => (this.auth.user()?.name ?? 'U').charAt(0).toUpperCase());

  async logout() {
    this.auth.logout();
    await this.router.navigateByUrl('/login');
  }
}
