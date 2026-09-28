---
trigger: model_decision
description: Dependency update policy, plus conditional rules for optional feature modules — file uploads, real-time, payments, email, analytics/consent, visual regression, feature flags, multi-tenancy. Apply when adding a dependency or building one of these features.
---

# Dependency Management & Conditional Modules

> Scope: dependency hygiene, plus rules for capabilities that don't apply to every web project.

## 1. Dependency Update Policy

- Automated dependency update PRs (Renovate or Dependabot) run on a schedule; patch/minor updates for non-critical packages can auto-merge on green CI, major version bumps and anything touching auth/crypto/payments always get a human-reviewed PR with the changelog summarized.
- A dependency that's unmaintained (no updates in 12+ months, open critical CVEs) is flagged for replacement rather than pinned indefinitely and ignored.

## 2. Conditional Modules — Include Only What This Project Uses

The subsections below are common enough across web projects to standardize, but not universal — a marketing site doesn't need a payments section, and a dashboard doesn't need SEO (see `security-seo.md`). **Delete the subsections that don't apply to this project** rather than leaving unused rules for an agent to trip over; if a project later adds one of these capabilities, add the matching subsection then.

- **File/media uploads:** uploads go to object storage (S3/R2/GCS) via short-lived signed URLs — never proxy large binary uploads through the application server, and never store user-uploaded files on local/ephemeral disk in production. Validate file type and size server-side (not just via the `accept` attribute), and serve user-uploaded content from a separate domain/subdomain from the main app to avoid stored-XSS-via-upload turning into a same-origin attack.
- **Real-time (WebSockets/SSE):** connections are authenticated the same way HTTP requests are (no separate, weaker auth path for the socket); server-side state for a real-time feature is still externalized (Redis pub/sub) so it works across multiple instances, not just a single in-memory process.
- **Payments:** all payment processing goes through a PCI-compliant provider (Stripe or equivalent) — the application never touches raw card data. Webhooks are signature-verified before being trusted, and payment-mutating endpoints follow the idempotency-key rule from `backend.md` §4 without exception.
- **Email/notifications:** transactional email goes through a dedicated provider (Resend, Postmark, SES), not a general SMTP relay; templates are versioned in the repo, not edited live in a third-party dashboard with no history.
- **Analytics & consent:** a cookie/consent banner gates non-essential tracking where required by applicable law (GDPR/CCPA); analytics/tracking scripts are loaded only after consent, not fired unconditionally on page load.
- **Visual regression & component docs:** Storybook for shared UI components, with Chromatic/Percy (or an equivalent visual diffing tool) in CI for components in `packages/ui` — catches an unintended visual change that unit tests can't see.
- **Feature flags:** for anything beyond a handful of simple boolean toggles, use a real feature-flag service (LaunchDarkly, Unleash) rather than accumulating ad hoc environment-variable branches — flag state changes shouldn't require a redeploy.
- **Multi-tenancy:** tenant isolation is enforced at the data layer (row-level security or a mandatory `tenantId` filter on every query), not just at the UI/routing layer — a missing `tenantId` filter is a data-leak bug, not a cosmetic one.
