<p align="center">
  <img src="task-manager/taskflow-logo.svg" alt="Task Manager Logo" width="420" />
</p>

<h1 align="center">Task Manager API Documentation</h1>

Comprehensive API reference for the Task Management App backend.

- **Base URL:** `http://localhost:3000`
- **Backend framework:** NestJS
- **Auth model:** JWT (`accessToken` + `refreshToken`)
- **Data store:** MongoDB (via Mongoose)

---

## 1) API Purpose

The backend API exists to:

- authenticate users (register/login),
- issue JWT tokens for secure access,
- provide user-scoped task CRUD operations,
- support filtering/search/pagination for task listing,
- keep responses and errors consistent for frontend integration.

---

## 2) Global API Contract

### Success response format

All successful responses are wrapped by `ResponseInterceptor`:

```json
{
  "success": true,
  "message": "OK",
  "data": {}
}
```

### Error response format

All errors are wrapped by `HttpExceptionFilter`:

```json
{
  "success": false,
  "message": "Error text or validation array",
  "data": {
    "path": "/requested/path",
    "timestamp": "2026-04-17T00:00:00.000Z"
  }
}
```

---

## 3) Authentication and Security

### Token usage

- Protected routes require header:
  - `Authorization: Bearer <access_token>`
- Frontend adds this automatically through `auth.interceptor.ts`.

### Guards and strategies

- **`LocalAuthGuard` + local strategy**
  - used on `POST /auth/login`
  - validates email/password before controller method executes
  - returns `401 Invalid credentials` if login fails
- **`JwtAuthGuard` + JWT strategy**
  - used on all `/tasks` routes
  - validates Bearer token and injects JWT payload (`sub`, `email`, `name`) into request
  - blocks unauthorized access to task APIs

### Ownership enforcement

For update/delete, backend verifies `task.userId === currentUserId`.
If not, it returns `403 Access denied`.

---

## 4) Endpoint Summary

| Method | Endpoint | Auth | Why this API exists |
|---|---|---|---|
| GET | `/` | Public | Basic health/root check endpoint |
| POST | `/auth/register` | Public | Create new account and immediately issue tokens |
| POST | `/auth/login` | Public | Authenticate existing account and issue tokens |
| GET | `/tasks` | Bearer token | Fetch current user tasks with optional filters |
| POST | `/tasks` | Bearer token | Create a new task for current user |
| PUT | `/tasks/:id` | Bearer token | Update an existing user-owned task |
| DELETE | `/tasks/:id` | Bearer token | Delete an existing user-owned task |

---

## 5) Detailed Endpoint Documentation

## `GET /`

### Why we use this

- simple root endpoint to confirm backend service is reachable.

### Where we use this

- currently **not called directly by frontend app code**.
- mainly useful for quick manual testing in browser/Postman.

### Request

- No body
- No auth

### Success response (example)

```json
{
  "success": true,
  "message": "OK",
  "data": "Hello World!"
}
```

---

## `POST /auth/register`

### Why we use this

- creates a new user account,
- hashes password securely,
- returns auth tokens so user can start directly without separate login.

### Where we use this

- frontend: `frontend/src/app/core/services/auth.service.ts` (`register()`),
- called from: `frontend/src/app/features/auth/register/register.component.ts` (`submit()`).

### Request body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}
```

### Validation rules

- `name`: required, non-empty string
- `email`: required, valid email format
- `password`: required string, min length `6`

### Success response data shape

```json
{
  "user": {
    "_id": "userId",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "ISO_DATE",
    "updatedAt": "ISO_DATE"
  },
  "accessToken": "jwt_access_token",
  "refreshToken": "jwt_refresh_token"
}
```

### Common errors

- `400` if email already registered
- `400` for validation failures

---

## `POST /auth/login`

### Why we use this

- validates user credentials,
- returns fresh JWT tokens and user profile for authenticated session.

### Where we use this

- frontend: `frontend/src/app/core/services/auth.service.ts` (`login()`),
- called from: `frontend/src/app/features/auth/login/login.component.ts` (`submit()`).

### Request body

```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

### Validation rules

- `email`: required, valid email format
- `password`: required string, min length `6`

### Success response data shape

```json
{
  "user": {
    "_id": "userId",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "accessToken": "jwt_access_token",
  "refreshToken": "jwt_refresh_token"
}
```

### Common errors

- `401 Invalid credentials`
- `400` for validation failures

---

## `GET /tasks`

### Why we use this

- retrieves tasks for current logged-in user only,
- supports dashboard filtering and search,
- supports pagination for scalable list loading.

### Where we use this

- frontend: `frontend/src/app/core/services/task.service.ts` (`getTasks()`),
- called from: `frontend/src/app/features/tasks/task-list/task-list.component.ts` (`load()`).

### Auth

- Required: `Authorization: Bearer <access_token>`

### Query parameters

- `status` (optional): `Todo` | `In Progress` | `Done`
- `search` (optional): case-insensitive match on `title` or `description`
- `page` (optional): integer, minimum effective value `1` (default `1`)
- `limit` (optional): integer, clamped to `1..100` (default `10`)

### Example

`/tasks?status=Todo&search=ui&page=1&limit=12`

### Success response data shape

```json
{
  "items": [
    {
      "_id": "taskId",
      "title": "Finish UI",
      "description": "Improve task list page",
      "status": "In Progress",
      "dueDate": "2026-04-20T00:00:00.000Z",
      "userId": "userId",
      "createdAt": "ISO_DATE",
      "updatedAt": "ISO_DATE"
    }
  ],
  "page": 1,
  "limit": 12,
  "total": 23,
  "totalPages": 2
}
```

### Common errors

- `401` missing/invalid token

---

## `POST /tasks`

### Why we use this

- creates a new task under current authenticated user.

### Where we use this

- frontend: `frontend/src/app/core/services/task.service.ts` (`createTask()`),
- called from: `frontend/src/app/features/tasks/task-list/task-list.component.ts` (`openCreate()`).

### Auth

- Required: `Authorization: Bearer <access_token>`

### Request body

```json
{
  "title": "Write API docs",
  "description": "Create complete markdown docs",
  "status": "Todo",
  "dueDate": "2026-04-20"
}
```

### Validation rules

- `title`: required string, length `1..100`
- `description`: optional string, max `500`
- `status`: optional enum (`Todo` | `In Progress` | `Done`)
- `dueDate`: optional valid ISO date string

### Behavior

- if `status` not sent, default is `Todo`
- if `description` not sent, default is empty string

### Success response data shape

- returns created task document

### Common errors

- `400` validation failures
- `401` missing/invalid token

---

## `PUT /tasks/:id`

### Why we use this

- updates existing task fields for inline edit workflow.

### Where we use this

- frontend: `frontend/src/app/core/services/task.service.ts` (`updateTask()`),
- called from: `frontend/src/app/features/tasks/task-list/task-list.component.ts` (`openEdit()`).

### Auth

- Required: `Authorization: Bearer <access_token>`

### Path params

- `id`: task id

### Request body

All fields optional; send only fields to change.

```json
{
  "title": "Write final API docs",
  "status": "Done"
}
```

### Validation rules

Same field rules as create endpoint, but optional.

### Success response data shape

- returns updated task document

### Common errors

- `401` missing/invalid token
- `403 Access denied` (task belongs to another user)
- `404 Task not found`
- `400` validation failures

---

## `DELETE /tasks/:id`

### Why we use this

- removes a task permanently from current user board.

### Where we use this

- frontend: `frontend/src/app/core/services/task.service.ts` (`deleteTask()`),
- called from: `frontend/src/app/features/tasks/task-list/task-list.component.ts` (`delete()`).

### Auth

- Required: `Authorization: Bearer <access_token>`

### Path params

- `id`: task id

### Success response data shape

```json
{
  "deleted": true
}
```

### Common errors

- `401` missing/invalid token
- `403 Access denied` (task belongs to another user)
- `404 Task not found`

---

## 6) Frontend API Usage Map

| Frontend file | API methods used | Purpose |
|---|---|---|
| `frontend/src/app/core/services/auth.service.ts` | `POST /auth/register`, `POST /auth/login` | Authentication and token/user persistence |
| `frontend/src/app/core/services/task.service.ts` | `GET /tasks`, `POST /tasks`, `PUT /tasks/:id`, `DELETE /tasks/:id` | Task data access layer |
| `frontend/src/app/core/interceptors/auth.interceptor.ts` | (adds header for protected APIs) | Automatically attaches Bearer token |
| `frontend/src/app/features/auth/register/register.component.ts` | triggers register service | User signup flow |
| `frontend/src/app/features/auth/login/login.component.ts` | triggers login service | User signin flow |
| `frontend/src/app/features/tasks/task-list/task-list.component.ts` | triggers all task service methods | Task list/filter/create/edit/delete UI |

---

## 7) Quick cURL Examples

### Register

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"John Doe\",\"email\":\"john@example.com\",\"password\":\"secret123\"}"
```

### Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"john@example.com\",\"password\":\"secret123\"}"
```

### Get tasks

```bash
curl "http://localhost:3000/tasks?status=Todo&page=1&limit=10" \
  -H "Authorization: Bearer <access_token>"
```

### Create task

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d "{\"title\":\"Prepare demo\",\"description\":\"Finalize API docs\",\"status\":\"In Progress\"}"
```

---

## 8) Notes

- API currently returns both `accessToken` and `refreshToken`; refresh endpoint is not implemented yet.
- For production, set strong JWT secrets and restrictive CORS origin list.
- If new endpoints are added, update this file so frontend/backend teams stay aligned.

