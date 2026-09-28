---
trigger: model_decision
description: CI/CD pipeline behavior, observability/logging, internationalization, documentation, and repository health files (README, CHANGELOG, SECURITY.md). Apply when touching pipelines, logging, i18n strings, or these repo docs.
---

# Cross-Cutting Standards

> Scope: concerns that touch every layer — CI/CD, observability, i18n, documentation, and repository health files.

## 1. CI/CD

- Every PR triggers: install, typecheck, lint, unit tests, and a fast integration-test subset. Full E2E and slower suites run on merge to `main` and on a nightly schedule.
- Playwright E2E runs against a real preview deployment (Vercel/Netlify preview or equivalent) on every PR touching user-facing behavior.
- Releases follow **Semantic Versioning**; changelogs are generated from Conventional Commits.
- Lighthouse CI and bundle-size checks run on PRs touching public-facing routes (see `frontend.md` §5).

## 2. Observability

- Structured JSON logging (pino/winston) with correlation/request IDs propagated end-to-end (frontend → API → downstream services) — never `console.log` in a production code path.
- **PII masking:** never log names, emails, or precise geolocation in plaintext. Mask or hash before it hits a log line or crash-reporting breadcrumb (Sentry, etc.).
- Metrics (RED: rate/errors/duration) exported per endpoint; distributed tracing (OpenTelemetry) across service boundaries; alerting tied to SLOs, not "check the logs when someone complains."
- Frontend: error boundaries per route/major section so one broken widget doesn't blank the whole page; breadcrumbs for complex client-side state transitions so a production crash report shows the sequence that led to it.

## 3. Internationalization

- No hardcoded user-facing strings in components or route handlers that return user-facing errors. Extract to the i18n dictionary (`next-intl`, `react-i18next`, or equivalent) from the moment a screen/feature is created — retrofitting i18n later is far more expensive than doing it inline.

## 4. Documentation

- Exported functions/types crossing a package boundary and every API route require a doc comment (TSDoc/OpenAPI) — internal implementation details don't need prose padding; the code should read clearly on its own.
- Architecture Decision Records (ADRs) for decisions with long-term consequences (Prisma vs Drizzle, NestJS vs Fastify, monorepo tooling choice) go in `/docs/adr/`, not in these rules — this file states the current decision, an ADR explains why it was made.

## 5. Repository Health Files

- The agent is responsible for drafting and maintaining `README.md`, `CHANGELOG.md`, `CONTRIBUTING.md`, `SECURITY.md`, and `.github/` templates — don't expect a human to hand-write these from scratch.
- Proactively offer to update `CHANGELOG.md` from recent commit history after completing a notable feature or fixing a critical bug.
- When generating setup instructions or workflow rules for `README.md`/`CONTRIBUTING.md`, scan the active codebase and use these rule files as the source of truth for conventions — don't invent a workflow that contradicts them.
- **Never hallucinate credentials or contact details** when scaffolding files that need them (e.g., a security-disclosure email in `SECURITY.md`). Insert an explicit placeholder (`[INSERT CONTACT EMAIL HERE]`) and ask the human to fill it in.
