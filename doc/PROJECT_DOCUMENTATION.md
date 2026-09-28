# EchoGPT Backend --- Project Documentation

## 1. Project Overview

EchoGPT Backend is a production-oriented REST API backend for the
EchoGPT Chrome Extension.

The implementation is an internship assessment for a Software
Engineering Internship (Backend). The assignment requires a backend
using:

-   NestJS
-   PostgreSQL
-   Prisma ORM or TypeORM
-   Swagger / OpenAPI
-   JWT authentication
-   Docker (optional but recommended)

The assignment asks for clean architecture, RESTful API design, industry
best practices, a normalized PostgreSQL schema, complete Swagger
documentation, and maintainable code.

> Source of truth: the internship assignment PDF supplied for this
> project. Where this document adds engineering decisions that are not
> explicitly required by the assignment, they are marked as
> **Engineering Decision**.

------------------------------------------------------------------------

## 2. Primary Objective

Build a backend that supports the core EchoGPT workflow:

1.  A user registers and authenticates.
2.  The user has a role and subscription.
3.  The user can select an AI provider.
4.  The user sends prompts through the Chat API.
5.  Chat history is persisted.
6.  AI usage is tracked against subscription limits.
7.  The user can perform AI-assisted web searches.
8.  Administrators can manage users, subscriptions, providers, usage,
    logs, and system health.
9.  Every API is documented through Swagger/OpenAPI.

The final repository must be understandable, runnable, testable, and
reviewable by another engineer.

------------------------------------------------------------------------

## 3. Assignment Requirements

### 3.1 Authentication

Required:

-   User registration
-   User login
-   Secure logout
-   JWT authentication
-   Refresh token support
-   Password hashing

Bonus:

-   Email verification

### 3.2 User Management

Required:

-   User profile
-   Update profile
-   Change password
-   Delete account
-   User roles: Admin / User

### 3.3 Subscription Management

Required:

-   Free and Premium plans
-   Subscription status API
-   Upgrade subscription
-   Downgrade subscription
-   Usage limits
-   Remaining requests API

### 3.4 AI Provider Management

Supported providers:

-   OpenAI
-   Claude / Anthropic
-   Google Gemini

Required capabilities:

-   Add provider
-   Edit provider
-   Delete provider
-   Enable / disable provider
-   Secure API-key storage
-   Default provider selection
-   Provider health-check endpoint

### 3.5 Chat API

Required:

-   Send prompt
-   Receive AI response
-   Provider selection
-   Conversation history

Bonus:

-   Streaming response

### 3.6 Web Search API

Required:

-   Search query
-   Search history
-   Recent searches
-   Search suggestions

Bonus:

-   Search result caching

### 3.7 Admin APIs

Required:

-   Dashboard statistics
-   User management
-   Subscription management
-   AI provider management
-   API usage analytics
-   Request logs
-   System health

### 3.8 API Documentation

Every endpoint must document:

-   Request parameters
-   Request body
-   Response examples
-   Error responses
-   Authentication requirements

### 3.9 Database

The assignment requires a normalized PostgreSQL design containing at
minimum:

-   Users
-   Sessions
-   Roles
-   Subscriptions
-   AI Providers
-   Chat History
-   Web Searches
-   API Usage Logs

### 3.10 Submission

Required submission artifacts:

-   GitHub repository
-   README with setup instructions
-   Database migration files
-   Swagger/API documentation
-   `.env.example`

Optional:

-   Postman collection

Deadline stated in the assignment:

**29 September 2026**

------------------------------------------------------------------------

## 4. Engineering Goals

The implementation should demonstrate:

-   Clear module boundaries
-   Separation of concerns
-   Strong DTO validation
-   Secure authentication
-   Explicit authorization
-   Normalized database relationships
-   Consistent API responses
-   Predictable error handling
-   Provider abstraction
-   Usage accounting
-   Good observability
-   Complete API documentation
-   Reproducible local setup
-   Clean Git history

------------------------------------------------------------------------

## 5. Technology Stack

### Backend

-   NestJS
-   TypeScript
-   Node.js

### Database

-   PostgreSQL
-   Prisma ORM

Prisma is the preferred project decision for this implementation because
it provides typed database access, schema migrations, and a clear data
model.

### API Documentation

-   Swagger / OpenAPI

### Authentication

-   JWT access tokens
-   Refresh tokens
-   Argon2 password hashing

### Validation

-   NestJS ValidationPipe
-   class-validator
-   class-transformer

### Infrastructure

-   Docker / Docker Compose as a recommended engineering enhancement

------------------------------------------------------------------------

## 6. High-Level Architecture

``` text
Client / Chrome Extension
          |
          v
      REST API
          |
          v
       NestJS
          |
  +-------+-------+----------------+
  |       |       |                |
 Auth   Users  Business Modules   Admin
  |       |       |
  +-------+-------+
          |
       Services
          |
  +-------+-----------------------+
  |                               |
Prisma                        Provider Layer
  |                       +-------+-------+
PostgreSQL                |       |       |
                       OpenAI  Anthropic  Gemini
```

------------------------------------------------------------------------

## 7. Module Boundaries

``` text
src/
├── auth/
├── users/
├── roles/
├── subscriptions/
├── providers/
├── chat/
├── web-search/
├── usage/
├── admin/
├── health/
├── common/
├── config/
├── prisma/
├── app.module.ts
└── main.ts
```

Each feature owns its controller, service, DTOs, and feature-specific
logic.

Shared infrastructure belongs in `common/`, `config/`, or `prisma/`.

------------------------------------------------------------------------

## 8. Recommended Request Flow

For a protected AI request:

``` text
HTTP Request
    |
    v
Authentication Guard
    |
    v
Authorization / Role Guard
    |
    v
DTO Validation
    |
    v
Controller
    |
    v
Service
    |
    +--> Subscription / Usage Check
    |
    +--> Provider Selection
    |
    +--> Provider Adapter
    |
    v
Persist Result / Usage
    |
    v
HTTP Response
```

The exact ordering can be implemented according to NestJS lifecycle
rules, but the responsibilities must remain separated.

------------------------------------------------------------------------

## 9. Security Requirements

### Passwords

Never store plaintext passwords.

Use Argon2 hashing.

### JWT

Access tokens should be short-lived.

Refresh tokens should be revocable and associated with server-side
sessions.

### Refresh Tokens

Do not store raw refresh tokens in PostgreSQL.

Store a secure hash or otherwise use a design that prevents database
compromise from directly exposing active refresh credentials.

### AI API Keys

AI provider keys are secrets.

They must:

-   Never appear in API responses
-   Never be logged
-   Never be committed to Git
-   Never be placed in source code
-   Be encrypted before database persistence if database storage is
    required

The encryption key belongs in environment configuration.

### Authorization

Admin endpoints must require both:

-   Valid authentication
-   Admin role

### Validation

Reject unexpected fields and invalid input.

### Error Handling

Do not expose:

-   Stack traces
-   Database credentials
-   API keys
-   Internal provider secrets
-   Sensitive implementation details

------------------------------------------------------------------------

## 10. REST API Conventions

Use versioned routes:

``` text
/api/v1/...
```

Recommended resource naming:

``` text
/auth
/users
/subscriptions
/providers
/chat
/search
/admin
/health
```

Use HTTP methods according to intent:

-   `GET` --- retrieve
-   `POST` --- create / action
-   `PATCH` --- partial update
-   `DELETE` --- delete

Use appropriate status codes.

Examples:

``` text
201 Created
200 OK
204 No Content
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Unprocessable Entity
429 Too Many Requests
500 Internal Server Error
503 Service Unavailable
```

------------------------------------------------------------------------

## 11. Data Model Overview

Conceptual model:

``` text
User
 ├── Sessions
 ├── Roles
 ├── Subscription
 ├── Chat Conversations
 ├── Chat Messages
 ├── Web Searches
 └── API Usage Logs

Role
 └── Users

Subscription
 └── User

AI Provider
 ├── Chat usage
 └── Provider health status

Conversation
 └── Messages

Web Search
 └── User

API Usage Log
 ├── User
 └── Provider
```

Keep the schema normalized and avoid duplicating values that can be
derived from relationships.

------------------------------------------------------------------------

## 12. AI Provider Abstraction

The Chat module must not directly depend on a single provider
implementation.

Conceptual contract:

``` typescript
interface AIProvider {
  generateResponse(
    request: GenerateResponseRequest,
  ): Promise<GenerateResponseResult>;

  healthCheck(): Promise<ProviderHealthResult>;
}
```

Provider implementations:

``` text
OpenAIProvider
AnthropicProvider
GeminiProvider
```

A provider registry/factory/service resolves the selected provider.

This allows the Chat service to depend on an abstraction rather than
vendor-specific SDK details.

------------------------------------------------------------------------

## 13. Usage Tracking

Every billable/request-counted AI operation should have enough
information to determine:

-   User
-   Provider
-   Request type
-   Timestamp
-   Success/failure
-   Request count
-   Relevant model/provider metadata where appropriate

Do not store sensitive prompt content in logs unless required by the
application.

------------------------------------------------------------------------

## 14. Observability

The backend should have structured application logging.

Logs should help diagnose:

-   Authentication failures
-   Provider failures
-   Database errors
-   Unexpected exceptions
-   Request failures

Never log secrets.

The API Usage Logs table is part of the required database design.

------------------------------------------------------------------------

## 15. API Documentation Standard

Every controller endpoint should have Swagger metadata.

Each endpoint should expose:

-   Summary
-   Description
-   Tags
-   Authentication requirement
-   Request DTO schema
-   Parameters
-   Success response
-   Relevant error responses
-   Example payloads where useful

Swagger must be usable by a reviewer without reading the source code.

------------------------------------------------------------------------

## 16. Testing Strategy

At minimum, prioritize tests around:

### Authentication

-   Registration
-   Duplicate registration
-   Login
-   Wrong password
-   Refresh token
-   Logout
-   Protected route
-   Admin authorization

### Subscription

-   Free plan
-   Premium plan
-   Usage limit
-   Remaining requests
-   Upgrade
-   Downgrade

### Provider

-   Create
-   Update
-   Enable/disable
-   Unauthorized access
-   Provider health check

### Chat

-   Authentication
-   Provider selection
-   Successful response
-   Provider failure
-   Usage limit
-   History persistence

### Search

-   Search request
-   History
-   Recent searches

------------------------------------------------------------------------

## 17. Environment Configuration

Never commit `.env`.

Provide `.env.example`.

Example categories:

``` env
NODE_ENV=
PORT=

DATABASE_URL=

JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=

JWT_ACCESS_EXPIRES_IN=
JWT_REFRESH_EXPIRES_IN=

ENCRYPTION_KEY=

OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GEMINI_API_KEY=
```

Actual provider keys should not be committed.

------------------------------------------------------------------------

## 18. Git Workflow

Use small, meaningful commits.

Examples:

``` text
feat: initialize nestjs application
feat: configure prisma and postgres
feat: implement authentication
feat: add refresh token sessions
feat: implement user management
feat: implement subscriptions
feat: add ai provider abstraction
feat: implement chat api
feat: implement web search
feat: add admin APIs
docs: add swagger documentation
test: add authentication integration tests
chore: add docker configuration
docs: improve setup instructions
```

Avoid one giant final commit.

------------------------------------------------------------------------

## 19. Definition of Done

The project is complete when:

-   The application starts successfully.
-   PostgreSQL connects successfully.
-   Migrations run from a clean database.
-   Registration works.
-   Login works.
-   JWT protection works.
-   Refresh token flow works.
-   Logout invalidates the session.
-   Roles and admin authorization work.
-   User management works.
-   Subscription management works.
-   Usage limits work.
-   AI providers can be managed.
-   Provider secrets are protected.
-   Chat works through the provider abstraction.
-   Chat history is persisted.
-   Web search endpoints work.
-   Admin endpoints work.
-   Usage logs are persisted.
-   Swagger documents the API.
-   Validation is globally configured.
-   Errors are handled consistently.
-   `.env.example` exists.
-   README contains setup instructions.
-   Database migrations are committed.
-   Git history is meaningful.
-   No secrets are committed.

------------------------------------------------------------------------

## 20. Engineering Decisions vs Assignment Requirements

The following are engineering decisions rather than explicit assignment
requirements:

-   Feature-based NestJS module organization
-   Prisma as the ORM
-   Argon2 for password hashing
-   Provider interface/adapter pattern
-   API versioning under `/api/v1`
-   Encryption for stored provider credentials
-   Refresh-token hashing
-   Structured logging
-   Docker Compose
-   Automated tests beyond the minimum
-   Specific status-code conventions

These decisions should remain aligned with the assignment and should not
introduce unnecessary complexity.

------------------------------------------------------------------------

## 21. Non-Goals

Do not spend assessment time building:

-   A complete Chrome Extension UI
-   A production billing/payment gateway unless specifically required
-   A complex distributed system
-   Microservices
-   Kubernetes
-   Event-driven infrastructure without a real requirement
-   Advanced caching before core functionality is stable

The assessment is primarily evaluating the backend API, architecture,
database, security, documentation, maintainability, and engineering
practices.
