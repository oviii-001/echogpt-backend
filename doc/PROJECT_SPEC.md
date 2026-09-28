# EchoGPT Backend --- Project Specification

## 1. Purpose

This document is the implementation contract for the EchoGPT backend
assessment.

Agents must treat this file as the primary technical specification for
implementation decisions.

If a requirement is not specified here, prefer:

1.  The internship assignment PDF
2.  Existing project code and migrations
3.  This project's `AGENTS.md`
4.  This project's `CLAUDE.md`
5.  Conservative, maintainable NestJS conventions

Do not invent major product requirements.

------------------------------------------------------------------------

# 2. Product Scope

The backend provides REST APIs for:

-   Authentication
-   User management
-   Subscription management
-   AI provider management
-   Chat
-   Web search
-   Administration
-   Usage logging
-   System health

------------------------------------------------------------------------

# 3. Technology Specification

  Area                Decision
  ------------------- ----------------------------------
  Runtime             Node.js
  Language            TypeScript
  Framework           NestJS
  Database            PostgreSQL
  ORM                 Prisma
  API style           REST
  API documentation   Swagger/OpenAPI
  Authentication      JWT
  Password hashing    Argon2
  Validation          class-validator + ValidationPipe
  Containerization    Docker / Docker Compose
  API prefix          `/api/v1`

------------------------------------------------------------------------

# 4. Architecture Specification

## 4.1 Module Architecture

Each business capability must be represented by a NestJS module.

``` text
auth
users
roles
subscriptions
providers
chat
web-search
usage
admin
health
```

Infrastructure:

``` text
common
config
prisma
```

------------------------------------------------------------------------

## 4.2 Layer Responsibilities

### Controller

Responsible for:

-   HTTP input
-   DTO binding
-   Swagger metadata
-   Calling application services
-   Returning appropriate results

Controllers must not contain:

-   Prisma queries
-   Provider SDK logic
-   Complex business rules
-   Password hashing logic

### Service

Responsible for:

-   Business rules
-   Orchestration
-   Transaction boundaries where required
-   Calling repositories/infrastructure

### Prisma

Responsible for:

-   Database access
-   Migrations
-   Database transactions

### Provider Layer

Responsible for:

-   Vendor-specific AI SDK integration
-   Request translation
-   Response normalization
-   Provider health checks
-   Provider-specific failures

------------------------------------------------------------------------

# 5. Authentication Specification

## 5.1 Registration

Endpoint:

``` http
POST /api/v1/auth/register
```

Expected input:

``` json
{
  "email": "user@example.com",
  "password": "secure-password",
  "name": "Example User"
}
```

Requirements:

-   Validate email
-   Validate password
-   Reject duplicate email
-   Hash password
-   Create user
-   Assign default User role
-   Create appropriate subscription state according to project policy

Do not return password or password hash.

------------------------------------------------------------------------

## 5.2 Login

``` http
POST /api/v1/auth/login
```

Flow:

``` text
Credentials
  ↓
Find user
  ↓
Verify password
  ↓
Create session
  ↓
Issue access token
  ↓
Issue refresh token
```

Invalid credentials must not reveal whether the email exists.

------------------------------------------------------------------------

## 5.3 Refresh

``` http
POST /api/v1/auth/refresh
```

Requirements:

-   Validate refresh credential
-   Validate session
-   Check revocation/expiry
-   Rotate refresh token where implemented
-   Issue new access token
-   Update session state

------------------------------------------------------------------------

## 5.4 Logout

``` http
POST /api/v1/auth/logout
```

Requirements:

-   Identify current session
-   Revoke session
-   Prevent future refresh

------------------------------------------------------------------------

## 5.5 Current User

``` http
GET /api/v1/auth/me
```

Requires authentication.

Return safe user information only.

------------------------------------------------------------------------

# 6. Authorization Specification

Roles:

``` text
USER
ADMIN
```

Admin-only endpoints require:

``` text
JWT authentication
+
ADMIN role
```

Use reusable NestJS guards/decorators.

Do not implement role checks independently inside every controller
method.

------------------------------------------------------------------------

# 7. User Specification

Endpoints:

``` http
GET    /api/v1/users/me
PATCH  /api/v1/users/me
PATCH  /api/v1/users/me/password
DELETE /api/v1/users/me
```

Rules:

-   Users can manage their own profile.
-   Password changes require authentication.
-   Account deletion must not expose sensitive information.
-   Password hashes and secrets are never returned.

Admin user-management APIs belong under `/api/v1/admin`.

------------------------------------------------------------------------

# 8. Subscription Specification

Plans:

``` text
FREE
PREMIUM
```

The implementation must support:

-   Subscription status
-   Upgrade
-   Downgrade
-   Usage limits
-   Remaining requests

Recommended endpoints:

``` http
GET   /api/v1/subscriptions/status
GET   /api/v1/subscriptions/usage
PATCH /api/v1/subscriptions/upgrade
PATCH /api/v1/subscriptions/downgrade
```

Exact request limits should be centralized in configuration or
subscription policy logic rather than scattered as magic numbers.

------------------------------------------------------------------------

# 9. AI Provider Specification

Supported providers:

``` text
OPENAI
ANTHROPIC
GEMINI
```

Provider fields should be designed around:

-   Identifier
-   Display name
-   Provider type
-   Enabled state
-   Default state
-   Encrypted credential
-   Metadata required for provider integration
-   Timestamps

Do not return encrypted credentials through APIs.

Recommended admin endpoints:

``` http
GET    /api/v1/admin/providers
POST   /api/v1/admin/providers
PATCH  /api/v1/admin/providers/:id
DELETE /api/v1/admin/providers/:id
PATCH  /api/v1/admin/providers/:id/status
POST   /api/v1/admin/providers/:id/health
```

------------------------------------------------------------------------

# 10. Provider Abstraction Contract

The Chat module must depend on an abstraction.

Example:

``` typescript
export interface AIProvider {
  generateResponse(
    request: GenerateResponseRequest,
  ): Promise<GenerateResponseResult>;

  healthCheck(): Promise<ProviderHealthResult>;
}
```

The implementation must normalize provider-specific response formats.

The Chat service must not contain OpenAI/Anthropic/Gemini SDK-specific
branches.

------------------------------------------------------------------------

# 11. Chat Specification

Recommended resources:

``` text
conversations
messages
```

Endpoints:

``` http
POST   /api/v1/chat
GET    /api/v1/chat/conversations
GET    /api/v1/chat/conversations/:id
DELETE /api/v1/chat/conversations/:id
```

Example request:

``` json
{
  "prompt": "Explain REST APIs",
  "provider": "OPENAI",
  "conversationId": "optional-id"
}
```

Flow:

``` text
Authenticate
   ↓
Validate request
   ↓
Check subscription
   ↓
Check usage limit
   ↓
Resolve provider
   ↓
Generate AI response
   ↓
Persist conversation/message
   ↓
Record usage
   ↓
Return normalized response
```

Provider failure must produce a controlled API error.

------------------------------------------------------------------------

# 12. Web Search Specification

Required concepts:

-   Search
-   Search history
-   Recent searches
-   Suggestions

Recommended endpoints:

``` http
POST /api/v1/search
GET  /api/v1/search/history
GET  /api/v1/search/recent
GET  /api/v1/search/suggestions
```

A search provider abstraction may be used.

Search caching is a bonus and should not delay the required
implementation.

------------------------------------------------------------------------

# 13. Admin Specification

All endpoints require Admin authorization.

Recommended endpoints:

``` http
GET /api/v1/admin/dashboard
GET /api/v1/admin/users
GET /api/v1/admin/subscriptions
GET /api/v1/admin/providers
GET /api/v1/admin/usage
GET /api/v1/admin/logs
GET /api/v1/admin/health
```

Admin services should aggregate data from existing modules rather than
duplicating business rules.

------------------------------------------------------------------------

# 14. Database Specification

Minimum conceptual entities:

``` text
User
Role
Session
Subscription
AIProvider
Conversation
Message
WebSearch
ApiUsageLog
```

Recommended relations:

``` text
User 1---N Session
User N---N Role
User 1---N SubscriptionHistory or 1---1 ActiveSubscription
User 1---N Conversation
Conversation 1---N Message
User 1---N WebSearch
User 1---N ApiUsageLog
AIProvider 1---N Message/Usage records where applicable
```

Use foreign keys.

Use indexes for frequent access paths such as:

-   User email
-   Session token hash
-   User ID
-   Provider type
-   Created timestamps
-   Subscription status
-   Usage-log timestamps

Use unique constraints where the domain requires uniqueness.

------------------------------------------------------------------------

# 15. API Usage Specification

Usage records should allow administrators to understand:

-   Which user made the request
-   Which provider was used
-   When the request occurred
-   Request category
-   Whether it succeeded
-   Usage count or equivalent accounting information

Avoid storing sensitive provider credentials.

------------------------------------------------------------------------

# 16. Error Specification

Use NestJS HTTP exceptions consistently.

Common mappings:

``` text
BadRequestException       -> 400
UnauthorizedException     -> 401
ForbiddenException        -> 403
NotFoundException         -> 404
ConflictException         -> 409
TooManyRequestsException  -> 429
InternalServerError       -> 500
ServiceUnavailable        -> 503
```

Error responses must not leak:

-   Password hashes
-   API keys
-   JWT secrets
-   Database credentials
-   Stack traces in production

------------------------------------------------------------------------

# 17. Validation Specification

Global validation:

``` typescript
new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
})
```

DTOs must validate:

-   Email format
-   Password constraints
-   Enum values
-   UUID/identifier format where applicable
-   Required fields
-   Optional fields

------------------------------------------------------------------------

# 18. Swagger Specification

Swagger must be available in development.

Every endpoint must include:

-   `@ApiOperation`
-   `@ApiResponse`
-   `@ApiBadRequestResponse` where relevant
-   `@ApiUnauthorizedResponse` where relevant
-   `@ApiForbiddenResponse` where relevant
-   `@ApiNotFoundResponse` where relevant
-   Request DTO documentation
-   Authentication metadata where required

Use:

``` typescript
@ApiBearerAuth()
```

for bearer-protected endpoints.

------------------------------------------------------------------------

# 19. Configuration Specification

All environment-dependent configuration must be centralized.

Do not access `process.env` throughout business services.

Use a configuration module/service.

Required categories:

``` text
Application
Database
JWT
Encryption
AI Providers
```

`.env.example` must document required variables without containing real
secrets.

------------------------------------------------------------------------

# 20. Transaction Specification

Use Prisma transactions for operations where multiple writes must
succeed or fail together.

Examples:

-   Creating a user plus required related records
-   Rotating/revoking sessions when multiple records are changed
-   Subscription state changes with related usage changes where
    atomicity is required

Do not use transactions unnecessarily.

------------------------------------------------------------------------

# 21. Performance Specification

Prefer:

-   Pagination for admin lists
-   Indexed database queries
-   Selecting only required fields
-   Avoiding N+1 queries
-   Reusing provider clients where safe
-   Avoiding unnecessary database round trips

Do not introduce premature distributed caching.

------------------------------------------------------------------------

# 22. Code Quality Specification

Required:

-   Strict TypeScript
-   Meaningful names
-   Small focused services
-   DTOs instead of unvalidated raw request bodies
-   No duplicated business rules
-   No secrets in code
-   No dead code
-   No unexplained magic numbers
-   No `any` unless technically justified

------------------------------------------------------------------------

# 23. Testing Specification

Priority:

1.  Auth
2.  Authorization
3.  Subscription limits
4.  Provider abstraction
5.  Chat
6.  Admin access
7.  Search

Tests should cover both success and important failure paths.

------------------------------------------------------------------------

# 24. Completion Criteria

The implementation satisfies the specification when all required
assignment features are implemented, documented, migrated, and runnable
from a clean environment.

Bonus features must never destabilize required features.
