import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { ProjectDetailsComponent } from './features/project-details/project-details.component';

export const routes: Routes = [
  { path: '', redirectTo: '/tasks', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'tasks',
    loadComponent: () =>
      import('./features/tasks/task-list/task-list.component').then((m) => m.TaskListComponent),
    canActivate: [authGuard],
  },
  {
    path: 'project-details',
    component: ProjectDetailsComponent,
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: '/tasks' },
];
