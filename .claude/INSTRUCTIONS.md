# CaseMap.live — Development Instructions

Instructions for future Claude Code sessions working on this project.

---

## Reference Documents

Always read the SRS (CaseMap-Live-SRS-Roadmap-2.md) and Implementation Guide
(CaseMap-Live-Implementation-Guide.md) before making changes. They contain the full
architecture, data schemas, API details, and phase breakdown.

---

## Tracking Files

After ANY changes, update these files:

- `.claude/PROGRESS.md` — Add a dated entry describing what was built/changed
- `.claude/TODO.md` — Check off completed tasks, add new tasks if scope expanded
- `.claude/ERROR_LOG.md` — Log any errors encountered with root cause and resolution

---

## Tech Stack (Actual Versions)

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | Next.js 16.1.6 (App Router) | SRS says 14+; actual is 16 |
| Language | TypeScript | Strict mode, zero `any` types |
| 3D Globe | CesiumJS via `resium` | Lazy-load with next/dynamic + ssr: false |
| 3D Imagery | Google Map Tiles API (Photorealistic 3D) | Proxied through Cesium |
| Styling | Tailwind CSS v4 | CSS-based config via @theme in globals.css |
| State | Zustand | useCourtsStore, useSearchStore |
| Database | Supabase (PostgreSQL + Auth) | RLS for user data |
| Deployment | Vercel | |
| Package Mgr | pnpm | |
| Fonts | JetBrains Mono (data) | Loaded via next/font/google |

---

## Design System

**Theme:** Light mode only — white/slate backgrounds, black text, maximum readability.
No dark mode. No `prefers-color-scheme: dark` media queries.

**Panels:** HUD-style.
- Sharp corners: `border-radius: 0.125rem` (`rounded-sm`)
- Thin 1px slate-200 borders
- Clean white with `shadow-hud` or `shadow-hud-lg`
- No glassmorphism, no backdrop-blur

**Typography:**
- System sans-serif (`system-ui, -apple-system`) for UI text
- JetBrains Mono (`font-mono`) for ALL data: docket numbers, case IDs, court codes, dates, coordinates, counts
- Monospace data text: slate-700 (`text-ink-data`, `#334155`)

**Panel headers:** Use `.hud-header` class.
- Renders: `── LABEL TEXT ──`
- Uppercase, 0.08em letter-spacing, monospace, slate-500

**Accent:** Single blue `#2563EB` for links and active/focus states only. No neon, no glow.

**CRT overlay:** `.crt-overlay` / `.crt-overlay-strong` — CSS-only scan lines on the globe.
Toggle-able. `pointer-events: none`. ~3%/6% opacity.

**Court marker colors (bright — must pop on the 3D globe):**
- federal: `#2563EB`
- appellate: `#DC2626`
- state-trial: `#CA8A04`
- housing: `#16A34A`
- bankruptcy: `#9333EA`
- other: `#6B7280`

---

## Tailwind v4 Notes

This project uses **Tailwind CSS v4**, not v3. Key differences:
- No `tailwind.config.ts` — all design tokens go in `globals.css` via `@theme`
- Custom colors defined as `--color-*` → generates `bg-*`, `text-*`, `border-*` utilities
- Custom shadows as `--shadow-*` → generates `shadow-*` utilities
- Custom animations as `--animate-*` → generates `animate-*` utilities
- The `@theme inline` block resolves CSS variables at runtime (needed for next/font CSS vars)
- Plugins use `@plugin "plugin-name"` syntax in CSS (not `plugins: []` in config)

---

## Key Conventions

### API Keys & Security
- `NEXT_PUBLIC_*` env vars → client-safe (appear in browser bundle)
- Non-prefixed vars (`COURTLISTENER_API_TOKEN`, `NYC_OPENDATA_APP_TOKEN`, `SUPABASE_SERVICE_ROLE_KEY`) → server-side only
- CourtListener token: always proxied through `/api/search` — never on client
- NYC Open Data token: always proxied through `/api/search/nyc` — never on client

### CesiumJS
- Must be lazy-loaded: `next/dynamic(() => import("..."), { ssr: false })`
- `initCesium()` must be called before mounting the viewer
- Import from `cesium` (not `@cesium-*`) — CesiumJS is a single package
- Widget CSS import in globals.css must be uncommented in Phase 1

### Data Caching
- Court data (`/api/courts`): cached indefinitely client-side (courts don't move)
- NYC Open Data: cached in Supabase `nyc_violations_cache` with 24hr TTL
- CourtListener search: stale-while-revalidate, 5 min TTL (Phase 9)

### Supabase Clients
- `createSupabaseBrowserClient()` → client components, hooks — respects RLS
- `createSupabaseServerClient()` → API routes only — bypasses RLS

### TypeScript
- Zero `any` types — use `unknown` + type guards instead
- All exported functions should have JSDoc comments

---

## Phase Progression

Complete phases in order. Each builds on the previous.

| Phase | Focus | Key Dependency |
|-------|-------|---------------|
| 0 | Setup & scaffolding | — |
| 1 | 3D globe (CesiumJS + Google 3D Tiles) | cesium, resium installed |
| 2 | Court data (Supabase seed + API route) | Supabase project created |
| 3 | Court markers on globe | Phase 1 + 2 complete |
| 4 | Search integration (CourtListener + Socrata) | API keys obtained |
| 5 | Case detail panel | Phase 4 complete |
| 6 | Jurisdiction overlays (GeoJSON) | Phase 3 complete |
| 7 | UI polish & responsiveness | Phase 4-6 complete |
| 8 | Auth & saved searches | Supabase Auth configured |
| 9 | Testing & performance | Phase 7 complete |
| 10 | Deployment & launch | Phase 9 complete |

See `.claude/TODO.md` for the full granular checklist.
See the SRS Section 15 for the Definition of Done per phase.

---

## Common Commands

```bash
# Dev server
pnpm dev

# Type check (run before committing)
pnpm tsc --noEmit

# Lint
pnpm lint

# Format
pnpm prettier --write .

# Build (for production testing)
pnpm build
```
