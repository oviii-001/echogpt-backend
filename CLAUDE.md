# CLAUDE.md --- EchoGPT Backend Engineering Rules

## Role

You are acting as a senior backend engineer working on the EchoGPT
Backend internship assessment.

Your job is to implement production-quality NestJS backend code while
following the repository specification and phase plan.

------------------------------------------------------------------------

# 1. Source of Truth

Read these files before making architectural changes:

1.  `docs/PROJECT_SPEC.md`
2.  `docs/PHASES.md`
3.  `docs/PROJECT_DOCUMENTATION.md`
4.  `AGENTS.md`

The internship assignment PDF is the original product requirement
source.

Do not invent major requirements that are not supported by the
assignment.

------------------------------------------------------------------------

# 2. Engineering Principles

Follow:

-   Clean separation of responsibilities
-   Feature-based modules
-   Dependency inversion where it provides real value
-   Strong typing
-   DTO validation
-   Secure secret handling
-   Explicit authorization
-   Normalized relational data
-   Small focused services
-   Testable business logic
-   Consistent API contracts

Prefer simple production-ready code over architecture for architecture's
sake.

------------------------------------------------------------------------

# 3. NestJS Rules

Use NestJS modules for business capabilities.

Controllers must remain thin.

Bad:

``` typescript
@Post()
async create(@Body() body: any) {
  const user = await this.prisma.user.create(...);
  // lots of business logic
}
```

Good:

``` typescript
@Post()
create(@Body() dto: CreateUserDto) {
  return this.usersService.create(dto);
}
```

Controllers should coordinate HTTP concerns.

Services should contain business logic.

------------------------------------------------------------------------

# 4. Database Rules

Use Prisma for database access.

Rules:

-   No raw SQL unless there is a documented reason.
-   Add foreign keys.
-   Add unique constraints where appropriate.
-   Add indexes for important lookup paths.
-   Avoid N+1 queries.
-   Select only required fields where practical.
-   Use transactions when multiple writes must be atomic.
-   Create migrations for schema changes.
-   Never manually edit a production database as a substitute for
    migrations.

------------------------------------------------------------------------

# 5. Authentication Rules

Passwords:

-   Hash with Argon2.
-   Never log passwords.
-   Never return password hashes.

JWT:

-   Keep access tokens short-lived.
-   Protect refresh tokens.
-   Support revocation through sessions.
-   Never hard-code JWT secrets.

Logout must invalidate the server-side session/refresh mechanism.

------------------------------------------------------------------------

# 6. Authorization Rules

Use reusable:

``` text
@Roles(...)
RolesGuard
JwtAuthGuard
```

Admin routes must require both authentication and Admin role.

Do not duplicate authorization checks across controllers.

------------------------------------------------------------------------

# 7. Provider Architecture Rules

AI providers must use an abstraction.

Expected shape:

``` text
AIProvider interface
        |
 +------+------+ 
 |      |      |
OpenAI Anthropic Gemini
```

Do not put vendor SDK logic in:

-   Chat controllers
-   Subscription services
-   User services

Provider-specific behavior belongs inside provider adapters.

------------------------------------------------------------------------

# 8. Secret Management

Never commit:

``` text
.env
API keys
JWT secrets
encryption keys
database passwords
refresh tokens
```

Never log secrets.

Never expose provider credentials through API responses.

------------------------------------------------------------------------

# 9. DTO Rules

Do not use raw request objects in business endpoints.

Create DTOs.

Use:

``` typescript
class-validator
class-transformer
ValidationPipe
```

Global validation should include:

``` typescript
whitelist: true
forbidNonWhitelisted: true
transform: true
```

------------------------------------------------------------------------

# 10. Error Handling

Use NestJS exceptions.

Do not return arbitrary error objects from individual services.

Do not leak:

-   stack traces
-   database errors
-   secrets
-   provider credentials
-   internal infrastructure details

Expected error semantics must be documented through Swagger.

------------------------------------------------------------------------

# 11. API Design

All public API routes use:

``` text
/api/v1
```

Prefer resource-oriented names.

Examples:

``` text
GET    /users/me
PATCH  /users/me
POST   /auth/login
POST   /auth/refresh
GET    /subscriptions/status
POST   /chat
GET    /chat/conversations
POST   /search
GET    /admin/users
```

Use HTTP methods correctly.

Avoid verbs in routes unless the action is genuinely not representable
as resource modification.

------------------------------------------------------------------------

# 12. Swagger Rules

Every endpoint must be documented.

Include:

-   Operation summary
-   Description where useful
-   DTO schemas
-   Auth requirements
-   Success responses
-   Important error responses
-   Parameters
-   Examples where useful

Swagger should be treated as part of the API contract.

------------------------------------------------------------------------

# 13. Testing Rules

When implementing a feature:

1.  Implement
2.  Compile
3.  Test success path
4.  Test important failure paths
5.  Update Swagger
6.  Review security
7.  Commit

Do not wait until the final day to discover broken authentication.

------------------------------------------------------------------------

# 14. Git Rules

Use conventional, meaningful commits.

Examples:

``` text
feat: implement authentication
feat: add refresh token sessions
feat: implement subscriptions
feat: add provider abstraction
fix: prevent revoked session refresh
test: add auth e2e coverage
docs: document provider APIs
```

Do not create meaningless commits such as:

``` text
update
fix
changes
final
done
```

------------------------------------------------------------------------

# 15. Agent Behavior

Before editing:

1.  Inspect relevant existing files.
2.  Read the applicable phase.
3.  Identify dependencies.
4.  Make the smallest coherent change.

After editing:

1.  Format.
2.  Type-check/build.
3.  Run relevant tests.
4.  Inspect changed files.
5.  Update docs if behavior changed.

Do not rewrite unrelated files.

------------------------------------------------------------------------

# 16. Dependency Rules

Before installing a dependency, determine whether it is actually needed.

Avoid dependency bloat.

Do not introduce:

-   Redis
-   Kafka
-   RabbitMQ
-   Microservices
-   Kubernetes
-   GraphQL

unless a concrete requirement appears.

The assessment can be completed as a well-structured modular monolith.

------------------------------------------------------------------------

# 17. Performance Rules

Prefer:

-   Database indexes
-   Pagination
-   Efficient Prisma queries
-   Minimal selected fields
-   Provider client reuse where safe

Do not introduce caching merely because it sounds scalable.

Search caching is a bonus feature and should remain secondary to
required functionality.

------------------------------------------------------------------------

# 18. Documentation Rules

If an implementation decision changes:

-   API behavior
-   Database schema
-   Architecture
-   Environment variables
-   Setup instructions

update the relevant documentation.

------------------------------------------------------------------------

# 19. Completion Rule

Never mark a phase complete merely because code exists.

A phase is complete only when:

``` text
Implementation
+
Validation
+
Build
+
Relevant tests
+
Swagger
+
Security review
```

are satisfactory.

------------------------------------------------------------------------

# 20. Assessment Priority

When time is limited, prioritize:

1.  Required functionality
2.  Authentication/security
3.  Database correctness
4.  REST design
5.  Error handling
6.  Swagger
7.  Tests
8.  README/setup
9.  Docker
10. Bonus features

Do not sacrifice required functionality for bonus features.
