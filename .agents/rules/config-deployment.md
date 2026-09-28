---
trigger: model_decision
description: Environment variable and config validation, local dev bootstrap, and deployment/rollback conventions. Apply when touching env vars, .env.example, Docker/Compose, CI deploy steps, or database migrations.
---

# Configuration, Environments, Local Dev & Deployment

> Scope: how the app is configured, run locally, and shipped.

## 1. Configuration, Environments & Local Dev

- **Config validation at startup, not at point-of-use.** All required environment variables are parsed and validated once (Zod schema over `process.env`) at app boot; the app fails fast with a clear error naming the missing variable, rather than throwing `undefined is not a function` three layers deep at request time.
- **`.env.example` is a contract, not a suggestion.** Every environment variable the app reads has a corresponding entry (name + one-line purpose, no real values) in `.env.example`. Adding a new variable without updating this file is an incomplete PR.
- **Per-environment config, one shape.** `local` / `staging` / `production` differ only in values (URLs, keys, scale), never in code path or architecture — see the environment-parity rule in `backend.md`. Feature flags, not `if (env === 'staging')` branches, gate environment-specific behavior.
- **One-command local bootstrap.** A fresh machine should reach a running app via a single documented command (`pnpm install && pnpm dev`, or `docker compose up`) that also stands up local Postgres/Redis and runs seed data — a new contributor or agent should never have to reverse-engineer setup from scattered Slack knowledge.
- Secrets never enter version control at any point, including in a seed script, a fixture file, or a commit that's later reverted — see `backend.md` §3 for the secrets-manager requirement in CI/production.

## 2. Deployment & Infrastructure

- State the actual hosting target explicitly for this project (e.g., Vercel, AWS ECS/Fargate, a Dockerized VPS, Cloudflare Pages/Workers) — don't assume a generic target when writing deploy-related code or docs; this section should be filled in with the real answer per project rather than left generic.
- **Environments are promoted, not reconfigured.** The same build artifact/image that passed staging is what deploys to production (build once, promote the binary) — never rebuild from source between staging and prod, which risks a dependency resolving differently.
- **Zero-downtime deploys** by default: rolling/blue-green deploys behind a load balancer or platform equivalent; a deploy never causes a dropped in-flight request as a matter of course.
- **Every deploy is revertible.** A documented (or scripted) rollback path exists before a feature ships, not improvised after an incident — this pairs with the reversible-migrations rule in `backend.md`: a migration must be safe to run ahead of a rollback of the application code that used it.
- Database migrations run as a distinct step from app deployment (a migration job, not "runs on boot"), so a failed migration doesn't leave a partially-started app serving traffic against a schema it doesn't expect.
