# EchoGPT Backend --- Implementation Phases

## How to Use This File

Agents must execute phases sequentially.

Rules:

1.  Complete the current phase before starting the next phase.
2.  Do not implement bonus features while required functionality is
    incomplete.
3.  After each phase, run validation/tests/build as appropriate.
4.  Keep commits small and meaningful.
5.  Do not rewrite working modules without a concrete reason.
6.  Update documentation when architecture changes.

------------------------------------------------------------------------

# Phase 0 --- Repository Initialization

## Goal

Create a clean NestJS backend repository.

### Tasks

-   [ ] Initialize NestJS project
-   [ ] Configure TypeScript
-   [ ] Configure ESLint
-   [ ] Configure formatting
-   [ ] Create `.gitignore`
-   [ ] Create `.env.example`
-   [ ] Create initial README
-   [ ] Create feature-based source structure
-   [ ] Create initial Git commit

### Expected structure

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

### Exit Criteria

-   NestJS starts successfully.
-   TypeScript compiles.
-   No secrets are committed.

------------------------------------------------------------------------

# Phase 1 --- Infrastructure and Database

## Goal

Connect PostgreSQL and Prisma.

### Tasks

-   [ ] Install Prisma
-   [ ] Configure PostgreSQL
-   [ ] Create Prisma module/service
-   [ ] Create initial schema
-   [ ] Add migration
-   [ ] Verify database connection
-   [ ] Add database seed strategy
-   [ ] Add indexes and constraints
-   [ ] Document database setup

### Entities

-   [ ] User
-   [ ] Role
-   [ ] Session
-   [ ] Subscription
-   [ ] AIProvider
-   [ ] Conversation
-   [ ] Message
-   [ ] WebSearch
-   [ ] ApiUsageLog

### Exit Criteria

``` bash
npx prisma migrate dev
npm run build
```

works from a clean project.

------------------------------------------------------------------------

# Phase 2 --- Application Foundation

## Goal

Establish shared backend behavior before business features.

### Tasks

-   [ ] Global ConfigModule
-   [ ] Environment validation
-   [ ] Global ValidationPipe
-   [ ] Global exception handling
-   [ ] API prefix
-   [ ] Swagger setup
-   [ ] Health module
-   [ ] Logging strategy
-   [ ] Common decorators
-   [ ] Common guards
-   [ ] Common DTO utilities where needed

### Exit Criteria

-   `/health` works.
-   Swagger works.
-   Invalid DTOs are rejected.
-   Unknown fields are rejected.
-   Errors have predictable structure.

------------------------------------------------------------------------

# Phase 3 --- Authentication

## Goal

Implement secure authentication.

### Tasks

-   [ ] Registration
-   [ ] Password hashing
-   [ ] Login
-   [ ] Access JWT
-   [ ] Refresh token
-   [ ] Session persistence
-   [ ] Refresh token validation
-   [ ] Refresh token rotation/revocation
-   [ ] Logout
-   [ ] Current-user endpoint
-   [ ] JWT guard
-   [ ] Auth DTOs
-   [ ] Swagger documentation

### Security checklist

-   [ ] Password never returned
-   [ ] Password hash never returned
-   [ ] Refresh tokens are not stored in plaintext
-   [ ] Secrets are environment variables
-   [ ] Invalid credentials return safe errors
-   [ ] Logout invalidates session

### Exit Criteria

Complete auth flow works:

``` text
Register
  ↓
Login
  ↓
Access protected route
  ↓
Refresh
  ↓
Logout
  ↓
Refresh rejected
```

------------------------------------------------------------------------

# Phase 4 --- Authorization and User Management

## Goal

Implement roles and user profile management.

### Tasks

-   [ ] USER role
-   [ ] ADMIN role
-   [ ] Roles decorator
-   [ ] RolesGuard
-   [ ] Current profile
-   [ ] Update profile
-   [ ] Change password
-   [ ] Delete account
-   [ ] Authorization tests

### Exit Criteria

-   Normal users cannot access admin APIs.
-   Users can manage only their own profile.
-   Password changes remain secure.

------------------------------------------------------------------------

# Phase 5 --- Subscription Management

## Goal

Implement Free/Premium subscription behavior and usage limits.

### Tasks

-   [ ] Free plan
-   [ ] Premium plan
-   [ ] Subscription state
-   [ ] Status endpoint
-   [ ] Upgrade endpoint
-   [ ] Downgrade endpoint
-   [ ] Usage calculation
-   [ ] Remaining requests endpoint
-   [ ] Centralized subscription policy
-   [ ] Swagger documentation

### Exit Criteria

A user can determine:

``` text
Current plan
Subscription status
Usage
Remaining requests
```

and protected AI requests can enforce the configured limit.

------------------------------------------------------------------------

# Phase 6 --- AI Provider Management

## Goal

Create a provider abstraction supporting multiple AI vendors.

### Tasks

-   [ ] AIProvider interface
-   [ ] Provider registry/factory
-   [ ] OpenAI adapter
-   [ ] Anthropic adapter
-   [ ] Gemini adapter
-   [ ] Provider CRUD
-   [ ] Enable/disable
-   [ ] Default provider
-   [ ] Health check
-   [ ] Secure credential storage
-   [ ] Admin authorization
-   [ ] Provider error normalization

### Exit Criteria

The Chat module can request:

``` text
provider = OPENAI
provider = ANTHROPIC
provider = GEMINI
```

without containing vendor-specific branching logic.

------------------------------------------------------------------------

# Phase 7 --- Chat API

## Goal

Implement the primary EchoGPT interaction.

### Tasks

-   [ ] Create conversation
-   [ ] Send prompt
-   [ ] Provider selection
-   [ ] Generate AI response
-   [ ] Persist messages
-   [ ] Retrieve conversation history
-   [ ] Delete conversation if supported by API design
-   [ ] Enforce subscription limits
-   [ ] Record usage
-   [ ] Normalize provider errors
-   [ ] Swagger documentation

### Exit Criteria

``` text
Authenticated User
      ↓
Subscription Check
      ↓
Provider Selection
      ↓
AI Request
      ↓
Persist History
      ↓
Record Usage
      ↓
Response
```

works end-to-end.

------------------------------------------------------------------------

# Phase 8 --- Web Search API

## Goal

Implement AI-assisted web search API capabilities.

### Tasks

-   [ ] Search endpoint
-   [ ] Search history
-   [ ] Recent searches
-   [ ] Search suggestions
-   [ ] Search provider abstraction if needed
-   [ ] Pagination where needed
-   [ ] Swagger documentation

### Bonus

-   [ ] Search result caching

### Exit Criteria

Authenticated users can search and retrieve their own search history.

------------------------------------------------------------------------

# Phase 9 --- Usage and Request Logging

## Goal

Make system usage observable.

### Tasks

-   [ ] API usage log persistence
-   [ ] AI request logging
-   [ ] Provider information
-   [ ] Success/failure status
-   [ ] Timestamp
-   [ ] Usage count
-   [ ] Avoid sensitive data logging

### Exit Criteria

An administrator can inspect meaningful usage information without
exposing secrets.

------------------------------------------------------------------------

# Phase 10 --- Admin APIs

## Goal

Implement administrative operations.

### Tasks

-   [ ] Dashboard statistics
-   [ ] User management
-   [ ] Subscription management
-   [ ] AI provider management
-   [ ] Usage analytics
-   [ ] Request logs
-   [ ] System health
-   [ ] Pagination
-   [ ] Admin authorization
-   [ ] Swagger documentation

### Exit Criteria

Every admin endpoint rejects non-admin users.

------------------------------------------------------------------------

# Phase 11 --- API Quality and Documentation

## Goal

Bring every endpoint to assessment-ready quality.

### Tasks

-   [ ] Swagger summaries
-   [ ] Request schemas
-   [ ] Response schemas
-   [ ] Error responses
-   [ ] Auth requirements
-   [ ] Example payloads
-   [ ] Consistent HTTP status codes
-   [ ] Consistent errors
-   [ ] DTO validation
-   [ ] Pagination conventions
-   [ ] API versioning

### Exit Criteria

A reviewer can understand and test the API through Swagger without
reading source code.

------------------------------------------------------------------------

# Phase 12 --- Security Review

## Goal

Perform a security-focused review.

### Checklist

-   [ ] No secrets in Git
-   [ ] `.env` ignored
-   [ ] `.env.example` exists
-   [ ] Passwords hashed
-   [ ] Refresh credentials protected
-   [ ] Provider keys protected
-   [ ] JWT secrets configurable
-   [ ] Admin routes protected
-   [ ] DTO validation enabled
-   [ ] Unknown fields rejected
-   [ ] Sensitive errors sanitized
-   [ ] Sensitive logs removed
-   [ ] Authorization tested
-   [ ] SQL injection avoided through Prisma
-   [ ] Rate/usage limits enforced where required

------------------------------------------------------------------------

# Phase 13 --- Testing

## Goal

Verify critical business behavior.

### Tasks

-   [ ] Auth unit tests
-   [ ] Auth integration/e2e tests
-   [ ] Authorization tests
-   [ ] Subscription tests
-   [ ] Provider tests
-   [ ] Chat tests
-   [ ] Search tests
-   [ ] Admin tests
-   [ ] Error-path tests

### Exit Criteria

Critical flows pass consistently.

------------------------------------------------------------------------

# Phase 14 --- Docker and Local Setup

## Goal

Make local setup reproducible.

### Tasks

-   [ ] Dockerfile
-   [ ] Docker Compose
-   [ ] PostgreSQL service
-   [ ] Environment documentation
-   [ ] Migration startup strategy
-   [ ] Health check
-   [ ] README Docker instructions

Docker is recommended by the assignment but is not listed as a mandatory
technology requirement.

------------------------------------------------------------------------

# Phase 15 --- README and Submission Package

## Goal

Prepare the repository for evaluation.

### README must contain

-   [ ] Project overview
-   [ ] Technology stack
-   [ ] Architecture
-   [ ] Prerequisites
-   [ ] Installation
-   [ ] Environment setup
-   [ ] Database setup
-   [ ] Migration commands
-   [ ] Development commands
-   [ ] Production/build commands
-   [ ] Swagger URL
-   [ ] Authentication explanation
-   [ ] Project structure
-   [ ] API overview
-   [ ] Testing
-   [ ] Docker setup
-   [ ] Security notes

### Submission checklist

-   [ ] GitHub repository
-   [ ] README
-   [ ] Migration files
-   [ ] Swagger
-   [ ] `.env.example`
-   [ ] Optional Postman collection

------------------------------------------------------------------------

# Phase 16 --- Bonus Features

Only start after all required features are stable.

Priority candidates:

-   [ ] Email verification
-   [ ] Streaming AI responses
-   [ ] Search caching

------------------------------------------------------------------------

# Final Assessment Review

Before submission:

``` text
Architecture          [ ]
REST design           [ ]
Database design       [ ]
Code quality          [ ]
Security              [ ]
Authentication        [ ]
Authorization         [ ]
Error handling        [ ]
Swagger               [ ]
Scalability           [ ]
Git history           [ ]
README                [ ]
Migrations            [ ]
.env.example          [ ]
```

The final review must prioritize the evaluation criteria stated in the
internship assignment.
