---
trigger: glob
glob: "apps/api/**,server/**,**/*.controller.ts,**/*.service.ts,**/*.module.ts,**/*.repository.ts"
description: Backend conventions — Node.js framework choice, API design, data layer, auth, and production-hardening. Applies to API/service/controller/repository files.
---

# Backend — Node.js & API Design

> Scope: the API/service layer — framework choice, data access, auth, and production-hardening concerns. See `architecture-monorepo.md` for the contract shared with the frontend, and `testing.md` for how it's tested.

## 1. Framework & Language

- **TypeScript strict** on the backend, matching the frontend — the API contract (request/response DTOs) is defined once as **Zod** (or TypeBox) schemas, shared as a package/workspace between frontend and backend so types never drift and validation logic isn't duplicated.
- Default framework: **NestJS** for the primary service (structured DI, modules, guards, interceptors, scales cleanly with team size and enforces the layered architecture below). Use **Fastify** directly (or the Fastify adapter under NestJS) where raw throughput on a specific hot-path route matters. Use **Hono** only for edge/serverless functions (Cloudflare Workers, Vercel Edge, Deno Deploy) that need small cold starts — not as the primary API framework for a full service.
- API style: **REST with OpenAPI** for public/partner-facing APIs (tooling, client generation, versioning are mature and well understood); **tRPC** is a strong option for an internal, same-monorepo TypeScript client with no external consumers, since it skips the schema-generation step entirely. **GraphQL** only when the actual access pattern demands it (many clients with divergent, nested data needs) — don't default to it for a simple CRUD API.

## 2. Data Layer

- ORM: **Prisma** for teams that want DX and migrations out of the box on traditional Postgres; **Drizzle** where SQL-level control, edge/serverless compatibility (HTTP-based drivers), or minimal runtime overhead matters. Pick one per service — don't mix ORMs in the same service.
- **Database migrations are versioned, reversible, and reviewed** (Prisma Migrate / Drizzle Kit). Never hand-edit schema in production; never ship a migration touching a live-traffic table without a rollback plan.
- Repository pattern at the data-access boundary: services depend on a repository *interface*, not a concrete Prisma/Drizzle client directly, so business logic stays testable against an in-memory/fake repository without spinning up a real database for every unit test.

## 3. Auth, Validation & Security

- Auth: short-lived JWT **access tokens** + revocable, DB-backed **refresh tokens**. Session tokens in a browser context use `httpOnly`, `secure`, `sameSite` cookies — never `localStorage`, which is readable by any injected script.
- Validate every inbound request at the boundary (Zod/class-validator on DTOs) — never trust client input, including from your own frontend or a mobile client hitting the same API.
- Role-based/attribute-based access control enforced on the backend route and at the database level (e.g., Postgres RLS or query-level scoping) — never rely on hiding a UI element as the only access control.
- Passwords: `argon2` or `bcrypt`, never reversible encryption, never plaintext.
- Never commit secrets. Local secrets live in a git-ignored `.env`; CI/CD and production pull from a secrets manager (Doppler/Vault/cloud-provider secret store).
- Dependency scanning (`npm audit`, Dependabot, Snyk) runs in CI; a high/critical vulnerability is a release blocker, not a follow-up ticket.

## 4. Production-Grade Backend Architecture

- **Layered, not a fat controller/route handler.** Controller/route → service (business logic) → repository (data access). Controllers stay thin: input validation, delegation, response shaping only — business rules never live inside a route handler.
- **Modular monolith** as the default starting shape: one module per bounded domain (`UsersModule`, `OrdersModule`, `PaymentsModule`), each with its own controller/service/repository trio. Each module exposes a single designated public-service interface; another module may depend only on that interface, never reach past it into internals — NestJS's DI raises an error on a violation, making this a build failure, not a review nitpick. This is the standard on-ramp to extracting a microservice later without a rewrite. Reach for actual microservices only when a specific scaling or team-ownership need demands it — not by default.
- **Idempotency on retryable mutating endpoints** (payments, order creation) via an idempotency key. Clients *will* retry on timeout; design for it instead of treating double-submission as a rare edge case.
- **Explicit, typed error responses:** a consistent error shape (code, message, correlation ID) across the whole API. Never leak a stack trace or raw DB error to a client response. Distinguish 4xx (client's fault, actionable) from 5xx (ours, gets paged) at the framework level (exception filters / error handlers), not ad hoc per-route `try/catch`.
- **Resilience:** timeouts and retry-with-backoff on all outbound calls (third-party APIs, inter-service calls); circuit breakers around flaky dependencies; graceful degradation (stale cache / reduced functionality) over a hard failure when a non-critical dependency is down.
- **Caching is explicit, not incidental:** Redis for hot read paths and session data, HTTP caching headers (`ETag`/`Cache-Control`) for cacheable GETs, and a stated invalidation strategy per cache — "just cache it" with no invalidation plan is a production incident waiting to happen.
- **Rate limiting and abuse protection** at the edge (API gateway/reverse proxy) and per-user/per-IP at the application layer for public-facing endpoints — never assume the frontend is the only client hitting the API.
- **Background jobs/queues:** BullMQ (Redis-backed) or equivalent for async work — never do long-running work inline in the request/response cycle.
- **Horizontal scalability by default:** services are stateless (session state in Redis/DB, never in-process memory) so any instance can serve any request — this is what makes autoscaling and zero-downtime deploys possible.
- **Environment parity:** local/staging/production run the same architecture (same DB engine, same auth flow) at different scale — "works on my machine but not staging" is a bug in the setup, not the code.
