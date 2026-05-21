# Auth API

A REST API implementing JWT authentication with register, login and protected routes. Built with Node.js, TypeScript, Express and PostgreSQL.

## Tech Stack

- Node.js + TypeScript
- Express
- PostgreSQL
- bcrypt (password hashing)
- jsonwebtoken (JWT)
- Jest (integration testing)
- Docker
- GitHub Actions (CI)

## Getting Started

Start the database:

```bash
docker compose up -d
```

Install dependencies and run:

```bash
npm install
npm run dev
```

Server runs on http://localhost:3003

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | Public | Register and receive JWT |
| POST | /api/auth/login | Public | Login and receive JWT |
| GET | /api/profile | Bearer token | Get current user info |

### Register

```json
POST /api/auth/register
{
    "email": "user@example.com",
    "password": "password123"
}
```

### Login

```json
POST /api/auth/login
{
    "email": "user@example.com",
    "password": "password123"
}
```

### Protected route

```
GET /api/profile
Authorization: Bearer <token>
```

## Running Tests

```bash
npm test
```

## CI

GitHub Actions runs tests automatically on every push to main using a PostgreSQL service container.
