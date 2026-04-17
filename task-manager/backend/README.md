# Backend (NestJS API)

Backend service for the Task Management App. Handles authentication, task CRUD, and user-scoped data access.

## Live project

- App URL: [https://task-management-app-full-stack-1.onrender.com/](https://task-management-app-full-stack-1.onrender.com/)
- You can create a new account and login from the app.
- Dummy account:
  - Email: `vitthalsawant300@gmail.com`
  - Password: `11111111`

## Backend topics

- NestJS modular architecture
- JWT authentication (access token + refresh token)
- Route guards and protected endpoints
- MongoDB integration with Mongoose
- Input validation and DTOs
- Task filtering, search, and pagination
- CORS and environment-based configuration

## Tech stack

- NestJS
- TypeScript
- MongoDB + Mongoose
- Passport JWT

## Setup (local)

```bash
npm install
npm run start:dev
```

API runs on `http://localhost:3000`.

## Environment variables

Configure these in `.env`:

- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `CORS_ORIGIN`

## API endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | No | Register user |
| POST | `/auth/login` | No | Login and return JWT tokens |
| GET | `/tasks` | Yes | Get user tasks |
| POST | `/tasks` | Yes | Create task |
| PUT | `/tasks/:id` | Yes | Update task |
| DELETE | `/tasks/:id` | Yes | Delete task |

## Useful scripts

```bash
npm run start
npm run start:dev
npm run start:prod
npm run test
npm run test:e2e
```
