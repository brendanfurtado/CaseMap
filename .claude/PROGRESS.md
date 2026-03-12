# CaseMap.live — Development Progress Log

---

## 2026-03-12 — Phase 2: Court Markers on the Globe

### What was built
- `supabase/migrations/001_create_courts.sql` — creates `courts` table + seeds ~45 NY courts across all court types (federal district, federal appellate, federal bankruptcy, state appellate, NY Supreme Court boroughs + upstate, NYC Housing/Civil/Criminal/Family, Surrogate's, Court of Claims). Uses `on conflict (cl_court_id) do nothing`.
- `src/lib/supabase/server.ts` — activated with real `createClient` from `@supabase/supabase-js`; service role key; env vars validated at call time
- `src/app/api/courts/route.ts` — `GET /api/courts`; queries Supabase `courts` table ordered by name; `revalidate = 86400` + `Cache-Control: s-maxage=86400`
- `src/stores/useCourtsStore.ts` — activated real Zustand v5 store; `fetchCourts()` no-ops if already loaded; `getCourtById()` lookup
- `src/components/globe/CourtMarkers.tsx` — new component (inside `<Viewer>`):
  - `PinBuilder.fromColor()` generates teardrop billboard pins; one canvas per unique color (6 total)
  - `BillboardCollection` replaces `PointPrimitiveCollection`
  - `verticalOrigin: BOTTOM` anchors pin tip to coordinate; `disableDepthTestDistance: Infinity` keeps pins above terrain/buildings
  - Click opens HUD popup — **does not move camera**
  - Popup shows: court type label, full name, short name, address, borough, CL ID, color accent bar, "Zoom to Location" button
  - Clicking empty space dismisses popup
- `GlobeViewer.tsx` — added `<CourtMarkers />` import and render inside `<Viewer>` tree

### Camera & navigation changes
- Initial view updated to match NYC boroughs overview: `lat 40.6392, lng -73.9865, alt 10,757m, heading 359°, pitch -35°` (south of Manhattan looking north, all boroughs visible)
- Reset View now flies to same NYC overview with matching heading/pitch (no longer NY State at 400km)

### Security
- Enabled RLS on `public.courts` + added `courts_public_read` policy (`select` for all) — clears Supabase Security Advisor error

### Phase badge updated
- `page.tsx` — badge updated to "Phase 2 · Court Markers"

---

## 2026-03-06 — Phase 1: 3D Globe Foundation

### What was built
- `scripts/copy-cesium-assets.mjs` — copies CesiumJS static files (Workers, Assets, ThirdParty, Widgets) to `public/cesium/`; added as `postinstall` script
- `src/lib/cesium-config.ts` — activated: `Ion.defaultAccessToken` set, `buildModuleUrl.setBaseUrl('/cesium/')` configured
- `src/lib/cesium-utils.ts` — `flyToLocation()`, `flyToNewYorkState()`, `getCameraCoordinates()` utilities
- `src/components/globe/GlobeViewer.tsx` — full CesiumJS viewer: Google Photorealistic 3D Tiles, initial camera over Manhattan at 1,500m/45° tilt, live coordinate readout HUD, Reset View button
- `src/components/globe/GlobeContainer.tsx` — lazy-load wrapper (`next/dynamic`, `ssr: false`, loading skeleton)
- `src/app/page.tsx` — full-screen globe replacing the Phase 0 landing page; branding + phase badge overlays
- `src/app/globals.css` — Cesium credit bar styled (kept visible for Google attribution ToS); toolbar hidden
- `src/app/layout.tsx` — added `suppressHydrationWarning` on `<body>` (browser extension injects `cz-shortcut-listen`)
- `README.md` — replaced create-next-app boilerplate with real project description

### Bugs fixed
- `ssr: false` not allowed in Server Component → added `'use client'` to GlobeContainer
- Browser extension hydration mismatch → `suppressHydrationWarning` on body
- Cesium 404 errors → `pnpm copy-cesium` copies assets to `public/cesium/`

### Current state
Globe is live at localhost:3000. Google Photorealistic 3D Tiles loading. Camera starts over midtown Manhattan at 1,500m with 45° tilt. Live coordinate HUD and Reset View button working.

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
- [x] Install dependencies (cesium, resium, zustand, supabase, clsx, tailwind-merge, etc.)
- [x] Obtain real API keys (Google Maps, Cesium Ion, CourtListener, NYC Open Data, Supabase)
- [x] Fill in `.env.local` with real keys
- [ ] Set up Husky pre-commit hooks
- [ ] Create GitHub repo and push
- [ ] Connect Vercel and verify CI/CD pipeline
