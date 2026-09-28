# EchoGPT Backend

The backend for the EchoGPT application, providing AI chat interactions, user management, subscriptions, and administrative APIs.

## Technology Stack

- **Framework:** NestJS
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT, Argon2
- **Documentation:** Swagger / OpenAPI

## Prerequisites

- Node.js (v20+)
- PostgreSQL (or Docker)

## Installation

```bash
npm install
```

## Environment Setup

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

## Database Setup

Initialize the database using Prisma:

```bash
# Generate the client
npx prisma generate

# Run migrations
npx prisma migrate dev
```

## Running the Application

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## Docker Setup

You can run the entire stack (Database + API) using Docker Compose:

```bash
docker-compose up -d
```

The API will be available at `http://localhost:3000`.

## Swagger Documentation

Once the application is running, view the interactive Swagger documentation at:

```
http://localhost:3000/api/docs
```

## Authentication

Authentication uses JWT (JSON Web Tokens). 
1. Register a new user at `/api/v1/auth/register`
2. Login at `/api/v1/auth/login` to receive an `access_token`
3. Use this token as a Bearer token in the Swagger UI or HTTP headers.

## Testing

```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e
```