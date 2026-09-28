---
trigger: model_decision
description: Security headers (CSP, CORS, HSTS), cookie hardening, and SEO/metadata conventions for public pages. Apply when touching middleware, response headers, or page metadata/sitemap/robots.txt.
---

# Security Headers, SEO & Metadata

> Scope: transport/header-level security and public-page discoverability. See `backend.md` §3 for auth/input-validation security and `dependencies-modules.md` for the dependency-scanning policy.

## 1. Transport & Header-Level Security

- **Content-Security-Policy (CSP)** set explicitly (via framework middleware or a reverse proxy) — default-deny for script/style sources, with an allowlist rather than `unsafe-inline`/`unsafe-eval` as a first resort.
- **CORS** is an explicit allowlist of known origins — never `Access-Control-Allow-Origin: *` on an endpoint that reads authenticated/user-specific data.
- Standard hardening headers on every response: `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `X-Frame-Options`/`frame-ancestors` (clickjacking protection), `Referrer-Policy`. Most frameworks (Next.js middleware, Helmet on Node) set these in one place — configure once, don't hand-roll per route.
- Cookies default to `Secure`, `HttpOnly` (unless a script genuinely needs to read it), and `SameSite=Lax` or `Strict` — see `backend.md` §3 for session-token specifics.

## 2. SEO & Discoverability

*(Skip this section entirely for an authenticated-only app/dashboard with no public, indexable pages.)*

- Every public page ships accurate `<title>`, meta description, canonical URL, and Open Graph/Twitter Card tags — generated per-route (Next.js `generateMetadata` or equivalent), not one static blob copy-pasted across pages.
- `sitemap.xml` and `robots.txt` are generated (not hand-maintained) and kept in sync with actual public routes; a route intentionally excluded from indexing gets a `noindex` meta tag or a `robots.txt` disallow — deliberately, not by omission.
- Structured data (JSON-LD) for content types that benefit from rich results (articles, products, FAQs, events) where relevant to the project.
- Semantic, server-rendered HTML for anything that needs to be indexed — a page that only renders meaningful content after client-side JS runs is an SEO liability; prefer SSR/SSG (`frontend.md` §1) for indexable routes.
