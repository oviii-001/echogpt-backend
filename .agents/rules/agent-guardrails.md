---
trigger: always_on
description: Guardrails for an autonomous coding agent working in this repo — search-before-writing, no duplicated business logic, scope discipline, and keeping setup docs in sync.
---

# Agent-Specific Guardrails

> Scope: rules specifically for an autonomous coding agent working in this repo, on top of everything else in `.agent/rules/`.

- **Search before writing.** Before adding any utility, hook, or component (date formatting, currency parsing, a custom button, an API error handler), search the codebase — check `packages/ui`, `packages/shared-types`, and `shared/` first. Import what exists; never duplicate it.
- **Refactor over copy-paste.** If an existing shared function is almost what you need, extend it (e.g., an added default parameter) while preserving current callers' behavior — don't fork a near-duplicate.
- **Extract new shared logic properly.** A genuinely new, reusable utility or UI primitive goes into the appropriate `packages/*` immediately, not buried inside a single feature folder "for now."
- **Do not** introduce a new major dependency (state library, ORM, auth provider, CSS framework) without flagging it explicitly in the PR description — these are architectural decisions, not implementation details.
- **Do not** duplicate a business rule between frontend and backend (see `architecture-monorepo.md`) — if the same rule must exist in both today, say so explicitly; it's usually a sign the rule belongs behind a shared schema or a single API call instead.
- When unsure whether something is feature-local vs. shared, default to the **narrowest scope** and let a human widen it in review — promoting code to `shared/`/`packages/` later is cheaper than unwinding a bad abstraction.
- Any UI text you introduce is added to the i18n dictionary as part of the same task, not deferred (`cross-cutting.md` §3).
- Any new dependency, environment variable, or migration you introduce is reflected in `README.md`/`.env.example` in the same PR — don't leave setup steps undiscoverable.