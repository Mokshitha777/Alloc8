# Alloc8 Frontend

React + Vite frontend starter for the Alloc8 Spring Boot API.

## Requirements
- Node.js and npm
- Alloc8 Spring Boot backend running at `http://localhost:8080`

## Run
Open this folder in VS Code, then in Terminal run:

```bash
npm install
npm run dev
```

Open http://localhost:5173.

## Backend URL
By default, the app calls `http://localhost:8080`. To override it, create a `.env` file from `.env.example`.

## Notes
- The login screen uses `POST /api/auth/login` and expects `{ "token": "..." }`.
- Registration uses `POST /api/users/register`.
- After login, the dashboard uses the Bearer token to call the API.
- Resource listing: `GET /api/resources`
- Allocation requests: `GET /api/requests`
- Allocations: `GET /api/allocations`
- Creating a request uses `POST /api/requests`; expected request fields follow the backend DTO:
  `userId`, `resourceType`, `startTime`, `endTime`, `priority`.
- This frontend is a starter and may need small adjustments if your backend response shapes differ.
