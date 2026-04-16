# Task Management App (Full Stack)

Production-ready task manager with JWT auth and per-user task CRUD.

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | Angular 18+ (standalone, signals), Angular Material, SCSS |
| Backend | NestJS |
| Database | MongoDB + Mongoose |
| Auth | JWT access token + refresh token |
| DevOps | Docker + docker-compose |

## Prerequisites

- Node.js 20+
- npm 9+
- MongoDB (local) **or** Docker Desktop

## Folder structure overview

```
task-manager/
├── frontend/
├── backend/
├── docker-compose.yml
└── README.md
```

## Setup instructions (local dev)

### Backend

```bash
cd backend
# update backend/.env for your environment
npm install
npm run start:dev
```

Backend runs on `http://localhost:3000`.

### Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs on `http://localhost:4200`.

## Setup instructions (Docker)

From `task-manager/`:

```bash
docker compose up --build
```

- Frontend: `http://localhost:4200`
- Backend: `http://localhost:3000`
- MongoDB: `mongodb://localhost:27017/taskmanager`

## API documentation

All responses follow the shape:

```json
{ "success": true, "message": "OK", "data": {} }
```

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | No | Register user |
| POST | `/auth/login` | No | Login, return JWT tokens |
| GET | `/tasks` | Yes | Get user's tasks (filter + search + pagination) |
| POST | `/tasks` | Yes | Create task |
| PUT | `/tasks/:id` | Yes | Update task |
| DELETE | `/tasks/:id` | Yes | Delete task |

### GET /tasks query params

- `status`: `Todo` \| `In Progress` \| `Done`
- `search`: keyword (matches title/description)
- `page`: number
- `limit`: number (max 100)

Example:

`/tasks?status=Todo&search=keyword&page=1&limit=10`

## Screenshots

- (placeholder) Login screen
- (placeholder) Task list with filters and dialog

## Deployment notes

- Set strong `JWT_SECRET` and `JWT_REFRESH_SECRET` in production.
- Configure CORS origin allowlist for your deployed frontend.
- Use a managed MongoDB (Atlas) and set `MONGODB_URI` accordingly.

