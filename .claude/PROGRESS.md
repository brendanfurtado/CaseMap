# CaseMap.live — Development Progress Log

---

## 2026-03-06 — Phase 0: Project Scaffolding

**Session goal:** Scaffold Phase 0 on top of the base Next.js project created by `pnpm create next-app@latest`.

### Files Modified
| File | Change |
|------|--------|
| `next.config.ts` | Added CesiumJS webpack fallbacks (fs/net/tls: false) + image remotePatterns for tile.googleapis.com and assets.cesium.com |
| `src/app/globals.css` | Full design system rewrite — Tailwind v4 `@theme` tokens, component utilities (.hud-panel, .hud-header, .data-field, .data-label, .court-badge), CRT overlay utilities, Cesium overrides |
| `src/app/layout.tsx` | Replaced Geist fonts with JetBrains Mono via next/font/google; full Metadata export with title, description, openGraph, twitter |
| `src/app/page.tsx` | Design system preview landing page — wordmark, System Status panel, API Keys panel, court type legend, coordinate readout |
| `eslint.config.mjs` | Added rules: no-unused-vars (warn, ignore _ prefix), no-console (warn, allow warn/error), prefer-const (error) |

### Files Created
| File | Purpose |
|------|---------|
| `src/types/index.ts` | All shared TypeScript types: CourtType, Court, SearchSource, SearchResult, NYCViolationRecord, NYCDataset, SearchFilters, SavedSearch, CameraDestination |
| `src/lib/utils.ts` | `cn()` utility (clsx + tailwind-merge) |
| `src/lib/cesium-config.ts` | `initCesium()` — Cesium Ion token init, guards double-init, warns on missing/placeholder token |
| `src/lib/supabase/client.ts` | Browser Supabase client stub (Phase 0) — real impl pending @supabase/ssr install |
| `src/lib/supabase/server.ts` | Server Supabase client stub (Phase 0) — real impl pending @supabase/supabase-js install |
| `src/stores/useCourtsStore.ts` | Zustand store stub for court data — real impl pending zustand install |
| `src/stores/useSearchStore.ts` | Zustand store stub for search state — real impl pending zustand install |
| `.env.example` | Documented all 7 env vars with comments, grouped by service |
| `.env.local` | Placeholder values for local dev (gitignored) |
| `.prettierrc` | Prettier config: semi, no singleQuote, tabWidth 2, trailingComma es5, printWidth 100 |
| `.prettierignore` | Excludes node_modules, .next, pnpm-lock.yaml, public |
| `src/components/globe/.gitkeep` | Directory placeholder |
| `src/components/search/.gitkeep` | Directory placeholder |
| `src/components/detail/.gitkeep` | Directory placeholder |
| `src/components/layout/.gitkeep` | Directory placeholder |
| `src/components/auth/.gitkeep` | Directory placeholder |
| `src/hooks/.gitkeep` | Directory placeholder |
| `src/data/.gitkeep` | Directory placeholder |
| `src/app/api/courts/.gitkeep` | Directory placeholder |
| `src/app/api/search/nyc/.gitkeep` | Directory placeholder |
| `src/app/api/cases/[id]/.gitkeep` | Directory placeholder |
| `src/app/api/violations/[id]/.gitkeep` | Directory placeholder |
| `src/app/auth/callback/.gitkeep` | Directory placeholder |
| `public/markers/.gitkeep` | Directory placeholder |
| `scripts/.gitkeep` | Directory placeholder |
| `.claude/PROGRESS.md` | This file |
| `.claude/TODO.md` | Master phase checklist |
| `.claude/ERROR_LOG.md` | Error tracking |
| `.claude/INSTRUCTIONS.md` | Instructions for future Claude Code sessions |

### Design System Notes
- **Theme:** "Clean Intelligence, Light Mode" — white/slate backgrounds, maximum readability
- **Tailwind version:** v4 (CSS-based config via `@theme` — no tailwind.config.ts)
- **No dark mode** — `prefers-color-scheme: dark` media query removed; light mode only
- **Typography:** System sans-serif for UI; JetBrains Mono for all data fields
- **Panels:** HUD-style, sharp corners (0.125rem border-radius), 1px slate-200 borders, subtle box-shadow
- **Panel headers:** .hud-header — uppercase, 0.08em letter-spacing, horizontal rules on both sides
- **CRT overlay:** `.crt-overlay` / `.crt-overlay-strong` — CSS-only scan lines, 3%/6% opacity, pointer-events none
- **Court colors:** federal=#2563EB, appellate=#DC2626, state-trial=#CA8A04, housing=#16A34A, bankruptcy=#9333EA, other=#6B7280

### Adapter Notes (SRS vs. actual project)
- **Next.js:** SRS specifies 14+; actual project uses 16.1.6 — no impact on architecture
- **React:** SRS implies 18; actual project uses React 19 — no breaking changes
- **tailwind.config.ts:** SRS instructs to create this file; Tailwind v4 uses CSS-based config — design system moved entirely to globals.css `@theme` block
- **eslint.config.mjs:** SRS instructs to modify `.eslintrc.json`; project uses flat config format — updated eslint.config.mjs instead
- **next.config.ts:** SRS references `next.config.mjs`; project uses TypeScript config format

### Next Steps (remaining Phase 0)
- [ ] Install dependencies: `pnpm add zustand cesium resium @supabase/ssr @supabase/supabase-js clsx tailwind-merge`
- [ ] Install dev dependencies: `pnpm add -D prettier eslint-config-prettier tailwindcss-animate husky @types/node`
- [ ] Set up shadcn/ui: `pnpm dlx shadcn@latest init`
- [ ] Set up Husky pre-commit hooks
- [ ] Obtain real API keys (Google Maps, Cesium Ion, CourtListener, NYC Open Data, Supabase)
- [ ] Fill in `.env.local` with real keys
- [ ] Create GitHub repo and push
- [ ] Connect Vercel and verify CI/CD pipeline
