---
trigger: glob
glob: "**/*.tsx,**/*.jsx,**/*.ts,**/*.css,**/*.scss,apps/web/**"
description: Frontend conventions — React/Next.js architecture, state management, styling, performance, and accessibility. Applies to component, hook, and route files.
---

# Frontend — TypeScript, React & Next.js

> Scope: everything under the frontend app(s) — components, hooks, routing, styling, client-side performance and accessibility. See `architecture-monorepo.md` for how this talks to the backend, and `testing.md` for how it's tested.

## 1. Baseline Toolchain

- **TypeScript strict mode** (`strict: true`, `noUncheckedIndexedAccess: true`) — non-negotiable. `any` requires a `// TODO(PROJ-XXX): why` comment; it is never a silent escape hatch.
- **Next.js (App Router)** as the default framework for anything that benefits from SSR/SSG/ISR, file-based routing, or React Server Components. Use **Vite + React Router** only for a pure SPA with no SEO/SSR requirement (internal tools, admin dashboards).
- Package manager: **pnpm** by default (fast, disk-efficient, strict dependency resolution that catches phantom deps) unless the team has already standardized on npm/yarn/bun — don't mix lockfiles in one repo.
- Node.js LTS version pinned via `.nvmrc` / `engines` field in `package.json`; agents must not assume a different runtime version than what's pinned.

## 2. Architecture Pattern: Feature-Based, Hooks-as-ViewModel

- **Feature-based organization**, not type-based: group by what the user does (`features/checkout/`, `features/profile/`, `features/onboarding/`), each owning its own components, hooks, API/query layer, and types — not global `components/`, `hooks/`, `types/` folders spanning unrelated features.
- Shared, feature-agnostic UI (buttons, layout primitives, the design system) lives in `shared/` or `ui/` — never duplicated per feature.
- A feature folder may depend on `shared/`; feature folders never import from each other directly. Cross-feature needs get promoted to `shared/` or composed at the page/route level.
- **Presentational components stay dumb:** props in, JSX out, no data fetching or business logic inside a component body. A custom hook (`useCheckoutForm()`, `useOrderHistory()`) owns state, calls the query/service layer, and exposes state + handlers back to the component. Don't let a single component both fetch data, hold five pieces of state, and render markup — extract the hook.
- Server Components (Next.js App Router) do data fetching and stay free of `useState`/`useEffect`; Client Components (`"use client"`) are the minimal, leaf-level boundary for interactivity — push the client boundary as far down the tree as possible rather than marking whole pages client-side by default.
- Co-locate route-level logic (`loading.tsx`, `error.tsx`, `layout.tsx`) with the route; don't scatter equivalent boilerplate into a shared utils folder.

## 3. State Management

- **Server state and client state are different problems — use different tools for each.** Don't reach for global client state to hold data that actually lives on the server.
  - Server/remote state (API data, caching, revalidation): **TanStack Query** (or Next.js's built-in `fetch` cache + Server Actions for App Router data flows). Components never call `fetch` directly — go through the query layer so loading/error states are handled consistently everywhere.
  - Client-only UI/app state (modals, wizards, multi-step form state, theme): **Zustand** or React Context for small, localized state; avoid Redux unless the team already has deep Redux investment — the DX and boilerplate cost is rarely justified for new projects in 2026.
  - Form state: **React Hook Form + Zod** resolver — validation schema shared between client-side form validation and (ideally) the API boundary schema, so the rule is written once.
- `useState`/`useReducer` is fine for transient, component-local UI state (an expanded/collapsed toggle); it is never the right place for state that should survive navigation or represents actual app data.

## 4. Styling & Design System

- **Tailwind CSS** as the default utility layer, paired with **shadcn/ui** (or an equivalent headless-component + Radix Primitives base) for accessible, unstyled interactive components (dialogs, dropdowns, comboboxes) that the design system then themes — don't hand-roll ARIA-heavy widgets (date pickers, comboboxes, modals) from scratch when a well-tested headless primitive exists.
- Design tokens (colors, spacing, typography scale, radii) live in one place (`tailwind.config.ts` theme extension or CSS custom properties) — never hardcode a hex value or magic pixel number inline when a token exists.
- Dark mode via CSS custom properties + `prefers-color-scheme` / a theme toggle, not duplicated component variants.
- Responsive by default: mobile-first breakpoints, no fixed pixel widths on layout containers, images use `next/image` (or an equivalent responsive `<img>` with `srcset`) rather than a raw `<img>` tag with a hardcoded size.

## 5. Performance & Core Web Vitals

- Treat **Core Web Vitals (LCP, INP, CLS)** as a release gate for user-facing pages, not an occasional audit. Run Lighthouse CI on every PR touching a public route.
- Code-split at the route level by default (framework does this automatically with Next.js App Router); use `next/dynamic` / `React.lazy` for heavy, below-the-fold, or conditionally-rendered components (rich text editors, charting libraries, modals).
- Images: always sized, always lazy-loaded below the fold, always served in a modern format (AVIF/WebP with fallback) via the framework's image component.
- Fonts: self-hosted or loaded via `next/font` with `font-display: swap` to avoid layout shift and third-party request waterfalls.
- Memoize deliberately, not defensively: `useMemo`/`useCallback`/`React.memo` are for measured hot paths (large lists, expensive derived computation), not a reflexive wrapper on every function and value — unnecessary memoization adds cognitive overhead without a measured win.
- Bundle size is a reviewed metric: a new dependency that meaningfully increases the client bundle for a small feature gets flagged in the PR description, with a lighter alternative considered first.

## 6. Accessibility (a11y)

- Accessibility is part of the Definition of Done, not a separate backlog item: semantic HTML first (`<button>`, not a `<div onClick>`), labeled form fields, visible focus states, sufficient color contrast (WCAG 2.2 AA minimum).
- Every interactive element is keyboard-operable and reachable in a sensible tab order; every image has meaningful `alt` text (or `alt=""` if purely decorative).
- Automated checks (`axe-core`/`jest-axe` in component tests, Lighthouse in CI) catch the mechanical violations; they do not replace an actual keyboard/screen-reader pass for new, complex interactive components.
