# AGENTS.md --- Agent Operating Instructions

## Project

EchoGPT Backend REST API

## Mission

Build the backend for the EchoGPT Chrome Extension internship assessment
using NestJS, PostgreSQL, Prisma, Swagger/OpenAPI, and JWT
authentication.

The final implementation must be clean, secure, maintainable,
documented, and runnable.

------------------------------------------------------------------------

# 1. Mandatory Reading

Before implementation, read:

``` text
docs/PROJECT_DOCUMENTATION.md
docs/PROJECT_SPEC.md
docs/PHASES.md
CLAUDE.md
```

These documents define the engineering contract.

------------------------------------------------------------------------

# 2. Working Mode

Work phase-by-phase.

Current phase must be identified before making changes.

Do not jump ahead unless:

-   The current phase is complete, or
-   A dependency requires a small preparatory change.

------------------------------------------------------------------------

# 3. Repository Inspection

Before coding:

``` text
Inspect package.json
Inspect src/
Inspect prisma/
Inspect existing modules
Inspect environment configuration
Inspect migrations
Inspect tests
```

Do not assume a file does not exist.

------------------------------------------------------------------------

# 4. Implementation Rules

## Controllers

Controllers handle HTTP concerns only.

They should:

-   Receive DTOs
-   Apply decorators
-   Call services
-   Return service results

They should not contain database/business logic.

## Services

Services own business behavior.

Keep services focused.

## Prisma

All database operations should go through Prisma.

## Providers

Vendor-specific AI SDK code belongs in provider adapters.

------------------------------------------------------------------------

# 5. Architecture

Use:

``` text
Feature Module
    |
    +-- Controller
    +-- Service
    +-- DTO
    +-- Provider/Repository logic where appropriate
```

Shared functionality belongs under:

``` text
common/
config/
prisma/
```

Do not create a giant `utils.ts` file for unrelated functionality.

------------------------------------------------------------------------

# 6. Security Rules

Never:

-   Hard-code secrets
-   Commit `.env`
-   Log passwords
-   Log API keys
-   Return API keys
-   Return password hashes
-   Store raw refresh tokens
-   Disable authorization to make development easier

------------------------------------------------------------------------

# 7. Database Rules

Every schema change must use a migration.

Before changing schema:

1.  Inspect existing relations.
2.  Check indexes and constraints.
3.  Update Prisma schema.
4.  Generate migration.
5.  Run migration.
6.  Regenerate Prisma client.
7.  Run tests/build.

Never delete migrations to hide schema problems.

------------------------------------------------------------------------

# 8. API Rules

API prefix:

``` text
/api/v1
```

Protected routes require JWT.

Admin routes require Admin role.

Use correct HTTP methods and status codes.

Do not expose internal implementation details.

------------------------------------------------------------------------

# 9. Validation Rules

All incoming API data must be validated.

Use DTOs.

Global validation:

``` typescript
whitelist: true
forbidNonWhitelisted: true
transform: true
```

Do not trust client input.

------------------------------------------------------------------------

# 10. Swagger Rules

When adding an endpoint, add Swagger documentation in the same change.

Minimum:

``` text
Summary
Request schema
Success response
Relevant errors
Authentication requirement
```

Never leave undocumented endpoints for the end.

------------------------------------------------------------------------

# 11. Testing Rules

For each feature, test:

### Happy path

The expected successful behavior.

### Validation failure

Invalid request data.

### Authentication failure

Missing/invalid credentials where relevant.

### Authorization failure

Authenticated user without permission.

### Business failure

Examples:

-   Duplicate email
-   Usage limit exceeded
-   Provider disabled
-   Conversation not found

------------------------------------------------------------------------

# 12. Build Verification

Before considering a task complete, run appropriate checks:

``` bash
npm run build
npm run lint
npm test
```

Use the project's actual scripts if they differ.

For database changes:

``` bash
npx prisma validate
npx prisma generate
```

and run the migration against the development database.

------------------------------------------------------------------------

# 13. Git Workflow

Create meaningful commits after coherent pieces of work.

Recommended:

``` text
feat: initialize backend architecture
feat: configure prisma
feat: implement authentication
feat: add role authorization
feat: implement subscriptions
feat: add ai provider abstraction
feat: implement chat api
feat: implement web search
feat: add admin APIs
docs: complete swagger documentation
test: add backend integration tests
```

Avoid giant commits.

------------------------------------------------------------------------

# 14. Decision Making

When there are multiple technically valid options:

1.  Prefer the simplest option satisfying the assignment.
2.  Prefer NestJS-native patterns.
3.  Prefer maintainability over cleverness.
4.  Prefer explicit code over hidden magic.
5.  Prefer a modular monolith over unnecessary distributed architecture.
6.  Document important decisions.

Do not introduce infrastructure solely to appear sophisticated.

------------------------------------------------------------------------

# 15. AI Provider Rule

The provider abstraction must allow:

``` text
OpenAI
Anthropic
Gemini
```

to be selected without changing Chat service business logic.

If a provider SDK has a different request/response shape, normalize it
inside the provider adapter.

------------------------------------------------------------------------

# 16. Subscription Rule

Subscription limits must be enforced server-side.

Never trust the client to report:

``` text
remainingRequests
plan
usage
```

The backend is authoritative.

------------------------------------------------------------------------

# 17. Admin Rule

Admin APIs must be protected by:

``` text
JWT
+
ADMIN role
```

Never rely on frontend/UI restrictions for security.

------------------------------------------------------------------------

# 18. Error Rule

Errors must be safe and predictable.

Never return:

``` text
database connection strings
SQL details
API keys
password hashes
JWT secrets
stack traces
```

in production responses.

------------------------------------------------------------------------

# 19. Documentation Synchronization

When adding a feature:

``` text
Code
+
DTO
+
Swagger
+
Tests
+
Relevant docs
```

should stay synchronized.

------------------------------------------------------------------------

# 20. Phase Completion Report

At the end of each phase, report internally:

``` text
Implemented:
- ...

Verified:
- ...

Tests:
- ...

Build:
- ...

Known issues:
- ...

Next phase:
- ...
```

Do not claim completion if verification failed.

------------------------------------------------------------------------

# 21. Stop Conditions

Stop and ask for clarification only when:

-   A required product decision is genuinely missing.
-   Existing code contradicts the specification in a way that cannot be
    resolved safely.
-   Credentials or external service access is required and unavailable.
-   A destructive operation could delete important work.

Otherwise, make the conservative engineering decision and document it.

------------------------------------------------------------------------

# 22. Final Submission Gate

Before declaring the repository assessment-ready, verify:

``` text
[ ] NestJS builds
[ ] PostgreSQL schema works
[ ] Migrations work
[ ] Registration works
[ ] Login works
[ ] JWT works
[ ] Refresh works
[ ] Logout works
[ ] User management works
[ ] Roles work
[ ] Subscriptions work
[ ] Usage limits work
[ ] AI providers work
[ ] Provider secrets are protected
[ ] Chat works
[ ] Chat history works
[ ] Search works
[ ] Search history works
[ ] Admin APIs work
[ ] Admin authorization works
[ ] Usage logs work
[ ] Health endpoint works
[ ] Swagger is complete
[ ] Validation works
[ ] Error handling is consistent
[ ] Tests pass
[ ] README is complete
[ ] .env.example exists
[ ] No secrets are committed
[ ] Git history is meaningful
[ ] Docker works if included
```

Only after this gate should the project be considered ready for
submission.
