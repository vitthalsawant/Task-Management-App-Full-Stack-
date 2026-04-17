import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

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
}
