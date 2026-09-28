---
trigger: model_decision
description: Testing strategy, tooling choices, and coverage targets across frontend and backend. Apply when writing or updating tests, or when planning how a new feature or bug fix should be tested.
---

# Testing Strategy

> Scope: test types, tooling, and coverage targets across frontend and backend. See root `AGENTS.md` §1.3 for the Agile Testing Quadrants this strategy is built on.

- **Unit/component:** Vitest (or Jest) + React Testing Library — test behavior and rendered output, not implementation details (avoid asserting on internal state, class names, or component internals).
- **API/integration:** Vitest/Jest + Supertest (or NestJS's built-in testing module) against a real test database via **Testcontainers** — not a fully mocked DB layer for integration-level tests. A test that mocks so much of the system it only asserts the mocks were called is not testing anything real; prefer real collaborators (in-memory DB, real reducers/services) wherever feasible.
- **E2E:** **Playwright** for critical user journeys across real browsers, run against a deployed preview environment in CI — not just `localhost`.
- **Contract tests:** see `architecture-monorepo.md` — catch frontend/backend drift before it reaches production.
- **Test pyramid (target ratio):** ~70% unit, ~20% integration/component, ~10% E2E. E2E is expensive and flaky — never compensate for missing unit coverage by adding more E2E.
- **Coverage targets (guideline, not a gate to game):** business logic/services ≥ 85%, custom hooks/state layers ≥ 80%, UI components ≥ 50% (behavior-focused, not snapshot-only), overall ≥ 75%. Never write a test that only asserts implementation details or mock call counts to inflate a number.
- **Shift-left:** for bug fixes, write the failing regression test first, then fix. For new features, write the acceptance-criteria-level test before diving into implementation details.
- Never disable a failing test to make CI green. Fix it, or mark it explicitly skipped with a linked ticket (`test.skip("PROJ-123: flaky, tracked", ...)`) — a silently commented-out test is a regression waiting to happen.
