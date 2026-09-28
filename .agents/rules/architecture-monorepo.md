---
trigger: model_decision
description: How the frontend and backend packages relate in the monorepo — the shared contract, package boundaries, and the no-cross-import rule. Apply when a change touches how apps/* and packages/* depend on each other, or when duplicating logic between frontend and backend is being considered.
---

# Full-Stack Architecture & Monorepo

> Scope: how the frontend (`frontend.md`) and backend (`backend.md`) fit together as one project.

- **Monorepo (Turborepo or Nx)** as the default for a frontend+backend project sharing a contract: `apps/web` (Next.js), `apps/api` (NestJS/Fastify), `packages/shared-types` (Zod schemas/DTOs shared by both), `packages/ui` (shared design-system components), `packages/config` (shared ESLint/TS config).
- **Dependency rule, non-negotiable:** `apps/*` depend on `packages/*`; `packages/*` never depend on `apps/*`; `apps/web` and `apps/api` never import each other's internals directly — they communicate only over the HTTP contract defined in `packages/shared-types`. An arrow pointing the wrong way is a boundary bug, fixed at the boundary, not special-cased.
- **Contract tests** between frontend and backend where they can drift (deployed independently, or maintained by different people/agents at different times): Pact, or schema-validation tests that assert the live API response still satisfies the shared Zod/OpenAPI schema.
- Don't duplicate a business rule (pricing calculation, a validation rule) between frontend and backend independently — the rule belongs in `packages/shared-types` (validation schema) or behind a single API call the frontend defers to, not reimplemented twice.
