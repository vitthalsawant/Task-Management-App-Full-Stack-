import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

type ApiEndpoint = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  auth: 'Public' | 'Bearer Token';
  description: string;
};

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.scss',
})
export class ProjectDetailsComponent {
  readonly techStack = [
    { layer: 'Frontend', value: 'Angular (standalone components, signals), SCSS, Angular Material' },
    { layer: 'Backend', value: 'NestJS (modular API architecture)' },
    { layer: 'Database', value: 'MongoDB with Mongoose schemas and models' },
    { layer: 'Authentication', value: 'JWT access + refresh token strategy' },
    { layer: 'DevOps', value: 'Docker + docker-compose for full stack setup' },
  ];

  readonly localSteps = [
    'Start backend: open `backend`, install dependencies, and run `npm run start:dev`.',
    'Start frontend: open `frontend`, install dependencies, and run `npm start`.',
    'Open the app at `http://localhost:4200` and backend at `http://localhost:3000`.',
  ];

  readonly dockerSteps = [
    'Open terminal in the `task-manager` root folder.',
    'Run `docker compose up --build`.',
    'Use frontend (`http://localhost:4200`) and backend (`http://localhost:3000`) containers.',
  ];

  readonly keyFeatures = [
    'Secure login and registration flow',
    'Task CRUD with per-user isolation',
    'Status filtering, searching, and clean dashboard UI',
    'Consistent API response/error handling',
    'Containerized full stack run support',
  ];

  readonly apiBaseUrl = 'http://localhost:3000';

  readonly apiResponseShape = '{ "success": true, "message": "OK", "data": {} }';

  readonly apiEndpoints: ApiEndpoint[] = [
    {
      method: 'GET',
      path: '/',
      auth: 'Public',
      description: 'Service root check endpoint',
    },
    {
      method: 'POST',
      path: '/auth/register',
      auth: 'Public',
      description: 'Register a new user account',
    },
    {
      method: 'POST',
      path: '/auth/login',
      auth: 'Public',
      description: 'Authenticate user and return access/refresh tokens',
    },
    {
      method: 'GET',
      path: '/tasks',
      auth: 'Bearer Token',
      description: 'Get current user tasks (supports filter/search/pagination)',
    },
    {
      method: 'POST',
      path: '/tasks',
      auth: 'Bearer Token',
      description: 'Create a new task for the authenticated user',
    },
    {
      method: 'PUT',
      path: '/tasks/:id',
      auth: 'Bearer Token',
      description: 'Update an existing task owned by the user',
    },
    {
      method: 'DELETE',
      path: '/tasks/:id',
      auth: 'Bearer Token',
      description: 'Delete an existing task owned by the user',
    },
  ];

  readonly tasksQueryParams = [
    '`status`: `Todo` | `In Progress` | `Done`',
    '`search`: keyword search on title/description',
    '`page`: page number (default starts from 1)',
    '`limit`: items per page (max 100)',
  ];
}
