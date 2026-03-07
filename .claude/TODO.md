# CaseMap.live — Master Task Checklist

Full SRS roadmap checklist. Check off items as completed.
Reference: SRS Section 12 (Development Roadmap) + Section 15 (Definition of Done).

---

## Phase 0: Project Setup

- [x] **0.1** Register `casemap.live` domain and configure DNS for Vercel *(manual)*
- [x] **0.2** Initialize Next.js project with TypeScript, Tailwind, pnpm
- [ ] **0.3** Install and configure `resium` (CesiumJS React wrapper) and `cesium` packages
- [ ] **0.4** Set up Supabase project (database + auth)
- [ ] **0.5** Obtain Google Cloud API key and enable Map Tiles API
- [ ] **0.6** Obtain CourtListener API token (register at courtlistener.com)
- [ ] **0.6b** Obtain NYC Open Data app token (register at data.cityofnewyork.us)
- [x] **0.7** Create `.env.local` with all 7 env vars (placeholder values)
- [ ] **0.7b** Fill in `.env.local` with real API keys
- [x] **0.8a** Configure ESLint (flat config rules: no-unused-vars, no-console, prefer-const)
- [x] **0.8b** Configure Prettier (`.prettierrc`, `.prettierignore`)
- [ ] **0.8c** Set up Husky pre-commit hooks (`pnpm add -D husky && pnpm dlx husky init`)
- [ ] **0.9** Create GitHub repo (`casemap-live`) with README, .gitignore, MIT license
- [ ] **0.10** Deploy blank Next.js app to Vercel on `casemap.live`, confirm CI/CD pipeline

### Phase 0 Scaffolding (completed this session)
- [x] Design system: globals.css — Tailwind v4 @theme tokens, component utilities, CRT overlay
- [x] `next.config.ts` — webpack fallbacks + image remotePatterns
- [x] `src/app/layout.tsx` — JetBrains Mono font, full metadata
- [x] `src/app/page.tsx` — design system preview landing page
- [x] `src/types/index.ts` — all shared TypeScript types
- [x] `src/lib/utils.ts` — cn() utility
- [x] `src/lib/cesium-config.ts` — Cesium Ion init stub
- [x] `src/lib/supabase/client.ts` — browser client stub
- [x] `src/lib/supabase/server.ts` — server client stub
- [x] `src/stores/useCourtsStore.ts` — courts store stub
- [x] `src/stores/useSearchStore.ts` — search store stub
- [x] Directory structure created (components, hooks, data, api routes, public/markers, scripts)
- [x] `.env.example` — documented all env vars

### Remaining Phase 0 installs
- [ ] `pnpm add zustand cesium resium @supabase/ssr @supabase/supabase-js clsx tailwind-merge`
- [ ] `pnpm add -D prettier eslint-config-prettier tailwindcss-animate husky lint-staged`
- [ ] `pnpm dlx shadcn@latest init` — set up shadcn/ui component library

---

## Phase 1: 3D Globe Foundation

- [ ] **1.1** Create `<GlobeContainer>` component with CesiumJS Viewer using `resium`
- [ ] **1.2** Load Google Photorealistic 3D Tiles as the base layer
- [ ] **1.3** Set initial camera: lat 42.9, lng -75.5, alt 400km (New York State overview)
- [ ] **1.4** Implement `flyToLocation(lat, lng, altitude, duration)` utility function
- [ ] **1.5** Test fly-to: button → camera flies to Times Square at 200m with 3D buildings
- [ ] **1.6** Add "Reset View" button that flies back to NY State overview
- [ ] **1.7** Handle CesiumJS loading states (skeleton/spinner while tiles stream)
- [ ] **1.8** Lazy-load CesiumJS via `next/dynamic` with `ssr: false`
- [ ] **1.9** Test performance: confirm 60fps on target hardware
- [ ] **1.10** Configure `RequestScheduler.requestsByServer` for faster Google tile loading
- [ ] **1.11** Uncomment Cesium widget CSS import in globals.css
- [ ] **1.12** Uncomment `Ion.defaultAccessToken` in cesium-config.ts
- [ ] **1.13** Add coordinate readout HUD (live lat/lng/alt/heading from camera)
- [ ] **1.14** Add CRT overlay toggle button

---

## Phase 2: Court Location Data

- [ ] **2.1** Query CourtListener `/courts/` API — compile full list of NY court IDs
- [ ] **2.2** Geocode all NY courts (manual + Google Geocoding API fallback)
- [ ] **2.3** Create `courts` table in Supabase with schema from SRS Section 9.2
- [ ] **2.4** Seed `courts` table with all NY courts (~80–120 entries)
- [ ] **2.5** Create Next.js API route `GET /api/courts` — returns all courts with geocodes
- [ ] **2.6** Activate `useCourtsStore` (uncomment real zustand implementation)
- [ ] **2.7** On app load, fetch `/api/courts` and populate store (cache indefinitely)
- [ ] **2.8** Activate `src/lib/supabase/client.ts` and `server.ts` (uncomment real impls)

---

## Phase 3: Court Markers on the Globe

- [ ] **3.1** Create `<CourtMarkers>` component — reads useCourtsStore, renders Cesium billboards
- [ ] **3.2** Design marker SVG icons for each court type (convert to PNG for CesiumJS)
- [ ] **3.3** Implement marker sizing: base size + scale factor from case count
- [ ] **3.4** Implement hover tooltip: court name, address, case count
- [ ] **3.5** Implement click handler: fly-to + open side panel
- [ ] **3.6** Implement marker clustering for high zoom-out views
- [ ] **3.7** Add pulse/glow animation on search result update (`animate-marker-pulse`)
- [ ] **3.8** Create `<Legend>` component showing court type color scheme

---

## Phase 4: Search Integration

- [ ] **4.1** Create API route `POST /api/search` — proxy to CourtListener Search API v4
- [ ] **4.2** Create API route `POST /api/search/nyc` — proxy to NYC Open Data (Socrata)
  - [ ] Check Supabase `nyc_violations_cache` first (24hr TTL)
  - [ ] Parallel requests to HPD Violations, OATH Hearings, HPD Litigation, DOB Complaints
- [ ] **4.3** Create `<SearchBar>` component — debounced input (300ms), source toggle
- [ ] **4.4** Activate `useSearchStore` (uncomment real zustand implementation)
- [ ] **4.5** Wire search submit → API → store → globe marker update
- [ ] **4.6** Create `<SearchResults>` side panel — case cards + violation cards
- [ ] **4.7** Click result card → fly-to court/building + open detail panel
- [ ] **4.8** Create `<FilterDropdown>` — court type, date range, nature of suit, status, source
- [ ] **4.9** Update marker sizes from search result counts per court
- [ ] **4.10** Handle empty results (message + suggestions)
- [ ] **4.11** Implement pagination: cursor-based (CourtListener), offset (Socrata)

---

## Phase 5: Case Detail Panel

- [ ] **5.1** Create API route `GET /api/cases/[id]` — fetch cluster + opinions from CourtListener
- [ ] **5.2** Create `<CaseDetail>` component — header, metadata, parties, opinion text, citations
- [ ] **5.3** Keyword highlighting in opinion text matching active search query
- [ ] **5.4** "View cited case" — click → new search → fly to that court
- [ ] **5.5** `<BackButton>` — return to search results
- [ ] **5.6** Loading skeleton while case detail fetches
- [ ] **5.7** Handle no-opinion cases (docket-only view)

---

## Phase 6: Jurisdiction Overlays

- [ ] **6.1** Obtain/create GeoJSON for NY federal districts, Appellate Division depts, NYC boroughs
- [ ] **6.2** Create `<JurisdictionOverlays>` — loads GeoJSON as Cesium GeoJsonDataSource
- [ ] **6.3** Style overlays: 20% opacity fill, colored borders, `clampToGround: true`
- [ ] **6.4** Create `<LayerToggle>` UI — show/hide each overlay layer
- [ ] **6.5** Click-on-jurisdiction → popup with aggregate stats

---

## Phase 7: UI Polish & Responsiveness

- [ ] **7.1** Verify full light-mode HUD design applied throughout all components
- [ ] **7.2** Confirm all panels use sharp corners, thin borders, subtle shadow
- [ ] **7.3** Panel open/close animations (`animate-slide-in-right`, `animate-slide-out-right`)
- [ ] **7.4** Responsive: at <1280px, side panel overlays as full-width drawer
- [ ] **7.5** Keyboard shortcuts: Escape (close panel), `/` (focus search), `R` (reset view)
- [ ] **7.6** Empty states: no results, API error, loading
- [ ] **7.7** "Welcome to CaseMap.live" first-visit overlay (dismissable, localStorage)
- [ ] **7.8** Confirm JetBrains Mono applied to all data fields site-wide
- [ ] **7.9** Animate marker transitions on filter change (fade out old, fade in new)
- [ ] **7.10** CaseMap.live wordmark/logo design

---

## Phase 8: Auth & Saved Searches

- [ ] **8.1** Configure Supabase Auth — email/password + Google OAuth
- [ ] **8.2** Create `<AuthButton>` component (sign in / user avatar dropdown)
- [ ] **8.3** Create `saved_searches` table in Supabase with RLS policies
- [ ] **8.4** "Save Search" button (requires auth)
- [ ] **8.5** `<SavedSearches>` dropdown from search bar
- [ ] **8.6** "Bookmark Case" feature — save individual cases
- [ ] **8.7** User profile page — saved searches + bookmarked cases

---

## Phase 9: Testing & Performance

- [ ] **9.1** Unit tests for API route handlers (search proxy, courts, case detail)
- [ ] **9.2** Integration tests: search → marker update → fly-to → detail → back
- [ ] **9.3** Test all CourtListener API error states (rate limited, 404, 500, timeout)
- [ ] **9.4** Test Google Tiles API error states (quota, invalid key, network failure)
- [ ] **9.5** Lighthouse audit: target 90+ Performance (CesiumJS lazy-loaded)
- [ ] **9.6** Profile CesiumJS memory with 100+ markers + overlays
- [ ] **9.7** stale-while-revalidate caching on `/api/search` (5 min TTL)
- [ ] **9.8** Error boundary around CesiumJS viewer (WebGL fallback)
- [ ] **9.9** Cross-browser: Chrome, Firefox, Safari, Edge on macOS + Windows

---

## Phase 10: Deployment & Launch

- [ ] **10.1** Configure Vercel environment variables for production
- [ ] **10.2** Google API key restrictions: HTTP referrer `casemap.live`, `*.casemap.live`
- [ ] **10.3** Set up Vercel Analytics
- [ ] **10.4** Configure Sentry for error tracking (client + server)
- [ ] **10.5** Write README.md — overview, screenshots/GIF, tech stack, local dev, deploy guide
- [ ] **10.6** Create 30-second demo GIF/video for README
- [ ] **10.7** Deploy to production at `casemap.live`
- [ ] **10.8** OpenGraph meta tags + social preview image
- [ ] **10.9** Submit to legal tech communities (HN, r/LawSchool, r/paralegal, Product Hunt)
- [ ] **10.10** Write dev blog post about CaseMap.live architecture

---

## Stretch Goals (v1.1+)

- [ ] Time Slider Animation — scrubbing timeline, markers animate with CesiumJS clock
- [ ] Case Flow Visualization — animated arcs for appeals (District → Circuit → SCOTUS)
- [ ] Heat Map Mode — toggle pin markers → filing density heat map
- [ ] AI Case Summarizer — Anthropic API, plain-English opinion summaries
- [ ] Multi-State Expansion — all 50 states via CourtListener's 3,355 jurisdictions
- [ ] Embeddable Widget — `<iframe>` export pinned to a court or case
- [ ] Street View Integration — Google Street View Tiles of courthouse entrance
- [ ] Public API — `api.casemap.live` endpoint for third-party legal-tech tools
