# CaseMap.live — Court Case Geographic Visualizer

## Software Requirements Specification & Development Roadmap

**Version:** 1.0
**Author:** B
**Date:** March 4, 2026
**Domain:** casemap.live
**Status:** Draft

---

## 1. Executive Summary

CaseMap.live is a desktop web application that visualizes New York court cases on an interactive 3D globe using CesiumJS and Google Photorealistic 3D Tiles. Users can search for cases by topic, party name, or case type, then explore results geographically — flying from a statewide overview of New York down to photorealistic street-level views of individual courthouses. The initial scope covers New York City (five boroughs) and New York State courts, using publicly available data from CourtListener's API and the RECAP Archive.

The app serves law students studying New York civil procedure, paralegals tracking filings across jurisdictions, journalists covering legal trends, and legal-tech enthusiasts who want to understand how litigation distributes geographically.

---

## 2. Problem Statement

Court case data is publicly available but exists as flat text in databases — there is no tool that lets users intuitively see *where* cases happen, how they cluster, or how they move through the court system geographically. Existing legal research tools (Westlaw, LexisNexis, CourtListener) present results as lists. No consumer-facing product maps court activity onto an interactive 3D globe, and no product lets users fly into a photorealistic 3D rendering of the actual courthouse where a case was heard.

---

## 3. Target Users

**Primary:** Law students studying for the NY Bar or enrolled in NY law schools who want a visual, intuitive way to understand court jurisdiction and case distribution across the state.

**Secondary:** Paralegals and legal assistants at NYC-area firms who track filings across multiple courts and need a quick spatial reference for where cases are active.

**Tertiary:** Journalists, researchers, and legal-tech enthusiasts interested in litigation trends, court workload analysis, and geographic patterns in legal activity.

---

## 4. Product Vision

A user opens CaseMap.live and sees a photorealistic 3D globe centered on New York State. Court locations glow as interactive pins, sized and colored by recent filing volume. The user types "landlord tenant" into the search bar. The map lights up — NYC Housing Court locations pulse brightly, while upstate courts show smaller pins. The user clicks on the Kings County Housing Court pin. The camera smoothly flies down from a statewide view into a photorealistic 3D rendering of downtown Brooklyn, landing on the courthouse at 141 Livingston Street. A side panel shows recent landlord-tenant cases filed there, pulled in real time from CourtListener. The user clicks a case and sees its full docket, parties, and timeline.

---

## 5. Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Framework | Next.js 14+ (App Router) | SSR, API routes, React Server Components, file-based routing |
| Language | TypeScript | Type safety across the full stack |
| 3D Globe | CesiumJS (via `resium` React wrapper) | Apache 2.0, 3D globe with time-dynamic viz, first-class Google 3D Tiles support |
| 3D Imagery | Google Map Tiles API (Photorealistic 3D Tiles) | High-res 3D building models for 2,500+ cities, free tier generous for dev |
| Court Data | CourtListener REST API v4 | Free, 3,355 jurisdictions, case law + PACER dockets + judge data |
| NYC Local Data | NYC Open Data (Socrata API) | Free, building-level violations/hearings with lat/lng, 8M+ HPD records |
| Database | Supabase (PostgreSQL + Auth) | Court geocode cache, violation cache, user saved searches, bookmarks |
| Styling | Tailwind CSS + shadcn/ui | Rapid UI dev, consistent design system |
| State Mgmt | Zustand | Lightweight, minimal boilerplate |
| Deployment | Vercel | Native Next.js support, edge functions, preview deploys |
| Domain | casemap.live | Short, memorable, semantically fitting |
| Package Mgr | pnpm | Fast, disk-efficient |
| Fonts | JetBrains Mono (data) + system sans-serif (UI) | HUD-style data readouts for docket numbers, coordinates, and court codes |

---

## 6. Scope — New York Focus

### 6.1 Courts In Scope

**Federal Courts (within NY):**
- U.S. District Court, Southern District of New York (SDNY) — Manhattan
- U.S. District Court, Eastern District of New York (EDNY) — Brooklyn
- U.S. District Court, Northern District of New York (NDNY) — Albany, Syracuse, etc.
- U.S. District Court, Western District of New York (WDNY) — Buffalo, Rochester
- U.S. Court of Appeals, Second Circuit — Manhattan
- U.S. Bankruptcy Courts (SDNY, EDNY, NDNY, WDNY)

**New York State Courts:**
- NY Court of Appeals (Albany)
- Appellate Division, 1st–4th Departments
- NY Supreme Court (by county — all 62 counties, emphasis on the 5 NYC boroughs)
- NYC Civil Court
- NYC Criminal Court
- NYC Housing Court (by borough)
- NYC Family Court (by borough)
- Surrogate's Court (by county)
- Court of Claims

### 6.2 Data Scope

- Case opinions and metadata from CourtListener (full text where available)
- PACER docket data for federal courts via the RECAP Archive
- Case metadata: parties, docket number, date filed, date terminated, judges, nature of suit, case type
- NOT in scope for v1: full document retrieval, real-time PACER purchases, state court docket entries (limited availability)

### 6.3 Geographic Scope

- Primary: New York City (Manhattan, Brooklyn, Queens, Bronx, Staten Island)
- Secondary: Greater New York State (Albany, Buffalo, Rochester, Syracuse, White Plains, etc.)
- Google Photorealistic 3D Tiles available for all major NYC areas and most NY cities

---

## 7. Functional Requirements

### FR-1: Interactive 3D Globe

- FR-1.1: Render a CesiumJS 3D globe with Google Photorealistic 3D Tiles as the base layer
- FR-1.2: Initialize the camera centered on New York State (approx. lat 42.9, lng -75.5, altitude 500km)
- FR-1.3: Support smooth zoom from state level → city level → street level with photorealistic 3D buildings
- FR-1.4: Support mouse/keyboard navigation: left-click drag to pan, right-click drag to zoom, Ctrl+drag to tilt/orbit
- FR-1.5: Display a minimap or compass indicator showing current camera orientation
- FR-1.6: Allow switching between 3D globe view and 2D map view

### FR-2: Court Location Markers

- FR-2.1: Plot all in-scope courts as interactive markers (pins/billboards) on the globe
- FR-2.2: Size markers proportionally to the number of cases matching the current search/filter
- FR-2.3: Color-code markers by court type (federal district = blue, state supreme = gold, housing = green, appellate = red, bankruptcy = purple)
- FR-2.4: Show a tooltip on hover with court name, address, total case count, and top 3 case categories
- FR-2.5: Cluster nearby markers at high zoom levels to prevent visual clutter; decluster on zoom
- FR-2.6: Animate marker appearance with a pulse/glow effect when search results update

### FR-3: Case Search & Filtering

- FR-3.1: Provide a search bar accepting free-text queries (topics, party names, docket numbers, legal concepts)
- FR-3.2: Search proxies to CourtListener's Search API (v4) with the `court` filter constrained to NY courts
- FR-3.3: Support filters for: date range, court type, nature of suit, judge name, case status (open/closed)
- FR-3.4: Display search results both as a scrollable list panel and as map markers simultaneously
- FR-3.5: Paginate results using CourtListener's cursor-based pagination
- FR-3.6: Show result count and query time
- FR-3.7: Support saved searches (stored in Supabase, requires auth)

### FR-4: Case Detail Panel

- FR-4.1: Clicking a search result or marker opens a slide-out detail panel
- FR-4.2: Display: case name, docket number, court, date filed, date terminated, judges, parties, attorneys, nature of suit
- FR-4.3: Display the opinion text (if available) with keyword highlighting matching the user's search
- FR-4.4: Show a list of cited cases with links to view them on the map
- FR-4.5: Provide a "View on CourtListener" external link for full docket access
- FR-4.6: For federal cases with RECAP data, show the full docket entry list

### FR-5: Camera Fly-To Animation

- FR-5.1: Clicking a court marker or search result triggers a smooth camera fly-to animation to that court's location
- FR-5.2: The fly-to lands at an altitude appropriate to the court type: 200m for individual courthouses (showing 3D buildings), 5km for borough-level views, 50km for regional views
- FR-5.3: During fly-to, show a loading indicator if 3D tiles are still streaming
- FR-5.4: Provide a "Reset View" button that flies back to the initial NY State overview

### FR-6: Jurisdiction Overlays

- FR-6.1: Toggle-able GeoJSON overlay showing federal district boundaries (SDNY, EDNY, NDNY, WDNY)
- FR-6.2: Toggle-able overlay for NY State judicial districts / Appellate Division departments
- FR-6.3: Toggle-able overlay for NYC borough boundaries
- FR-6.4: Overlays should be semi-transparent and draped onto the 3D tiles
- FR-6.5: Clicking inside a jurisdiction boundary shows aggregate stats for that jurisdiction

### FR-7: Time Slider (v1.1 stretch goal)

- FR-7.1: A horizontal timeline slider at the bottom of the screen
- FR-7.2: Scrubbing the slider animates case filings over time (by month or year)
- FR-7.3: Markers grow/shrink and pulse as filing volume changes over the selected time window
- FR-7.4: Supports play/pause for automatic animation

---

## 8. Non-Functional Requirements

### NFR-1: Performance

- NFR-1.1: Initial page load (LCP) under 3 seconds on a modern desktop with broadband
- NFR-1.2: CesiumJS lazy-loaded — not included in the initial JS bundle
- NFR-1.3: 3D tile streaming should begin within 1 second of the viewer mounting
- NFR-1.4: Search results should return within 2 seconds for typical queries
- NFR-1.5: Smooth 60fps camera navigation on mid-range hardware (GTX 1060 / M1 MacBook equivalent)
- NFR-1.6: Court marker data cached client-side (static — courts don't move)

### NFR-2: Accessibility

- NFR-2.1: All non-map UI elements (search, panels, filters) meet WCAG 2.1 AA
- NFR-2.2: Keyboard navigation for search, filters, and result list
- NFR-2.3: Screen reader announcements for search results count and selected case
- NFR-2.4: High-contrast mode option for the side panel (note: 3D map is inherently visual)

### NFR-3: Responsiveness

- NFR-3.1: Desktop-first design (1280px+ viewport)
- NFR-3.2: Functional at 1024px (side panel collapses to overlay)
- NFR-3.3: Not optimized for mobile in v1 (3D globe is desktop-appropriate)

### NFR-4: API Usage & Costs

- NFR-4.1: Google Map Tiles API usage must stay within free tier during development (100K tile requests/month)
- NFR-4.2: CourtListener API calls must respect rate limits (unauthenticated: 100/day; authenticated: 5000/hour)
- NFR-4.3: NYC Open Data (Socrata) API calls must respect rate limits (1,000 requests/hr with app token; throttled without)
- NFR-4.4: Implement client-side caching (stale-while-revalidate) for repeated queries
- NFR-4.5: Cache court metadata and geocode data in Supabase to minimize repeat API calls
- NFR-4.6: Cache NYC Open Data responses in Supabase (`nyc_violations_cache`) with 24-hour freshness TTL to reduce Socrata load

### NFR-5: Security

- NFR-5.1: Google API key restricted by HTTP referrer and API type
- NFR-5.2: CourtListener token stored server-side in Next.js API routes (never exposed to client)
- NFR-5.3: NYC Open Data app token stored server-side in Next.js API routes (never exposed to client)
- NFR-5.4: Supabase RLS policies for user-specific data (saved searches, bookmarks)
- NFR-5.5: Respect CourtListener's `blocked` flag — do not display cases marked for privacy protection

---

## 9. Data Architecture

### 9.1 Multi-Source Data Strategy

CaseMap.live uses a dual-primary data source architecture. CourtListener handles traditional court case data (federal + state appellate opinions, PACER dockets, judges, citations). NYC Open Data (Socrata API) fills in the hyper-local NYC ground-level layer that CourtListener doesn't cover — housing violations, OATH administrative hearings, HPD litigation, and DOB complaints — all with geographic coordinates baked in. Additional sources are cataloged for future expansion.

```
                         ┌─────────────────────┐
                         │     User Search      │
                         └──────────┬───────────┘
                                    │
                         ┌──────────▼───────────┐
                         │  Next.js API Routes   │
                         └──────────┬───────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼                               ▼
     ┌──────────────────────┐        ┌──────────────────────────┐
     │   CourtListener v4   │        │   NYC Open Data (Socrata) │
     │   (Primary: Courts)  │        │   (Primary: NYC Local)    │
     ├──────────────────────┤        ├──────────────────────────┤
     │ • Opinions & case law│        │ • HPD housing violations  │
     │ • PACER/RECAP dockets│        │ • OATH hearings (admin)   │
     │ • Judge data         │        │ • HPD litigation records   │
     │ • Citation networks  │        │ • DOB complaints/permits   │
     │ • Court metadata     │        │ • ECB violations           │
     │ • Oral arguments     │        │ • All with lat/lng coords  │
     └──────────┬───────────┘        └──────────────┬───────────┘
                │                                    │
                └───────────────┬────────────────────┘
                                │
                     ┌──────────▼───────────┐
                     │  Results Merged &     │
                     │  Deduplicated by      │
                     │  address / court_id   │
                     └──────────┬───────────┘
                                │
                     ┌──────────▼───────────┐
                     │  Client Renders on    │
                     │  CesiumJS Globe       │
                     ├──────────────────────┤
                     │ • Court markers       │
                     │ • Case pins           │
                     │ • Violation overlays  │
                     │ • Jurisdiction bounds │
                     └──────────────────────┘
```

**Why these two sources complement each other:**

| Dimension | CourtListener | NYC Open Data (Socrata) |
|-----------|--------------|------------------------|
| Coverage | Federal + state appellate courts nationwide | NYC-specific administrative and municipal data |
| Data type | Opinions, dockets, judges, citations | Violations, complaints, hearings, inspections |
| Geography | Court-level (which court heard the case) | Building-level (exact address with lat/lng) |
| Freshness | Updated daily from court scrapers + RECAP | Updated daily/weekly by NYC agencies |
| Auth | Token-based (5,000 req/hr authenticated) | App token (1,000 req/hr rolling) |
| Cost | Free (nonprofit, 501(c)(3)) | Free (NYC open data mandate) |
| Best for | "What cases were filed about patent law in SDNY?" | "What violations exist at 123 Main St, Brooklyn?" |

### 9.2 Court Location Data (Supabase Table: `courts`)

```
id              UUID (PK)
cl_court_id     TEXT (CourtListener court ID, e.g., "nysupct")
name            TEXT ("Supreme Court, New York County")
short_name      TEXT ("NY Sup Ct, NY Co")
court_type      ENUM (federal_district, federal_appellate, federal_bankruptcy,
                      state_appellate, state_trial, state_housing,
                      state_family, state_surrogate, state_claims)
jurisdiction    TEXT ("NY")
latitude        FLOAT
longitude       FLOAT
altitude_flyto  FLOAT (camera altitude for fly-to in meters)
address         TEXT
borough         TEXT (nullable — only for NYC courts)
marker_color    TEXT (hex color)
created_at      TIMESTAMPTZ
updated_at      TIMESTAMPTZ
```

### 9.3 NYC Open Data Cache (Supabase Table: `nyc_violations_cache`)

```
id              UUID (PK)
source_dataset  TEXT ("hpd_violations" | "oath_hearings" | "hpd_litigation" |
                      "dob_complaints" | "ecb_violations")
record_id       TEXT (unique ID from Socrata dataset)
address         TEXT
borough         TEXT
latitude        FLOAT
longitude       FLOAT
case_type       TEXT (violation class, hearing type, etc.)
status          TEXT ("open" | "closed" | "pending")
date_filed      DATE
date_resolved   DATE (nullable)
description     TEXT
raw_data        JSONB (full Socrata record for future field access)
fetched_at      TIMESTAMPTZ
created_at      TIMESTAMPTZ
```

### 9.4 Geocode Cache (Supabase Table: `geocode_cache`)

```
id              UUID (PK)
address         TEXT (UNIQUE)
latitude        FLOAT
longitude       FLOAT
source          TEXT ("manual" | "google" | "nominatim")
created_at      TIMESTAMPTZ
```

### 9.5 Saved Searches (Supabase Table: `saved_searches`)

```
id              UUID (PK)
user_id         UUID (FK → auth.users)
query           TEXT
filters         JSONB
name            TEXT
created_at      TIMESTAMPTZ
```

### 9.6 Data Flow by Source

**CourtListener (opinions, dockets, court metadata):**
Fetched on demand via API — NOT stored locally except court metadata. All case data is live-queried:

```
User Search → Next.js API Route → CourtListener Search API (v4)
                                    ↓
                              JSON response
                                    ↓
                         Client renders results
                         + maps to court locations
                         via cl_court_id join
```

**NYC Open Data (violations, hearings, complaints):**
Fetched on demand via Socrata API with optional background caching in Supabase for frequently-queried buildings/addresses:

```
User Search (address or building) → Next.js API Route
    ↓
    ├─→ Supabase cache check (by address, dataset, freshness < 24hr)
    │     ├─ HIT → return cached records
    │     └─ MISS ↓
    │
    ├─→ Socrata API (parallel requests to multiple datasets)
    │     ├─→ HPD Violations:  data.cityofnewyork.us/resource/wvxf-dwi5.json
    │     ├─→ OATH Hearings:   data.cityofnewyork.us/resource/jz4z-kudi.json
    │     ├─→ HPD Litigation:  data.cityofnewyork.us/resource/59kj-x8nc.json
    │     └─→ DOB Complaints:  data.cityofnewyork.us/resource/eabe-havv.json
    │
    ├─→ Results normalized into unified schema
    ├─→ Cached in Supabase (nyc_violations_cache)
    └─→ Client renders as building-level pins on CesiumJS globe
```

---

## 10. API Integration Details

### 10.1 CourtListener REST API v4 (Primary — Court Cases)

**Base URL:** `https://www.courtlistener.com/api/rest/v4/`

**Authentication:** Token-based (stored in `COURTLISTENER_API_TOKEN` env var, used in server-side API routes only)

**Rate Limits:** Unauthenticated: 100/day. Authenticated: 5,000/hour.

**Key Endpoints:**

| Endpoint | Use |
|----------|-----|
| `/search/?q={query}&court={court_ids}&type=o` | Search opinions by keyword, filtered to NY courts |
| `/search/?q={query}&court={court_ids}&type=r` | Search RECAP/PACER dockets |
| `/dockets/{id}/` | Get full docket details |
| `/clusters/{id}/` | Get opinion cluster (case metadata + linked opinions) |
| `/opinions/{id}/` | Get opinion text |
| `/courts/` | Get court metadata |
| `/people/` | Judge biographical data |

**NY Court IDs (partial list — to be compiled from CourtListener's jurisdiction page):**

- `scotus` — Supreme Court of the United States
- `ca2` — Second Circuit Court of Appeals
- `nysd` — S.D.N.Y.
- `nyed` — E.D.N.Y.
- `nynd` — N.D.N.Y.
- `nywd` — W.D.N.Y.
- `nysupct` — NY Supreme Court
- `nyappdiv` — NY Appellate Division
- `ny` — NY Court of Appeals
- `nyfamct`, `nycivct`, `nycrimct`, `nysurcr`, `nyclaimsct`

### 10.2 NYC Open Data / Socrata API (Primary — NYC Local Data)

**Base URL:** `https://data.cityofnewyork.us/resource/{dataset_id}.json`

**Authentication:** App token (stored in `NYC_OPENDATA_APP_TOKEN` env var). Requests work without a token but are throttled; with a token, rate limit is 1,000 requests per rolling hour.

**Query Language:** SoQL (Socrata Query Language) — SQL-like syntax via URL parameters.

**Key Datasets:**

| Dataset | Socrata ID | Description | Records |
|---------|-----------|-------------|---------|
| HPD Violations | `wvxf-dwi5` | Housing maintenance code violations by building | 8M+ |
| OATH Hearings Division | `jz4z-kudi` | Administrative law cases (quality of life, public safety) | 3M+ |
| HPD Litigation | `59kj-x8nc` | HPD enforcement actions against landlords | 100K+ |
| DOB Complaints | `eabe-havv` | Dept of Buildings complaints with addresses | 2M+ |
| ECB Violations | `6bgk-3dad` | Environmental Control Board violations | 2M+ |
| Housing Court Filings | (to be identified) | Landlord-tenant filings (if available) | TBD |

**Example SoQL Queries:**

```
# Get all open HPD violations for a specific address in Brooklyn
GET https://data.cityofnewyork.us/resource/wvxf-dwi5.json
  ?$where=boroid='3' AND street='LIVINGSTON ST' AND housenumber='141'
  &$order=inspectiondate DESC
  &$limit=50
  &$$app_token={NYC_OPENDATA_APP_TOKEN}

# Get all OATH hearings in Manhattan from the last year
GET https://data.cityofnewyork.us/resource/jz4z-kudi.json
  ?$where=county='NEW YORK' AND violation_date > '2025-03-01T00:00:00'
  &$order=violation_date DESC
  &$limit=100

# Get HPD litigation for a specific building (by BIN or BBL)
GET https://data.cityofnewyork.us/resource/59kj-x8nc.json
  ?$where=boroid='1' AND block='00123' AND lot='0045'
  &$order=caseopendate DESC
```

**Geographic Data:** Most NYC Open Data datasets include `latitude`, `longitude`, `borough`, and full address fields. HPD datasets also include BIN (Building Identification Number) and BBL (Borough-Block-Lot) which enable precise building-level mapping on CesiumJS.

### 10.3 Google Map Tiles API (Visualization Layer)

**Photorealistic 3D Tiles Endpoint:**
`https://tile.googleapis.com/v1/3dtiles/root.json?key={API_KEY}`

**2D Tiles (fallback / overview):** Session token workflow per Google docs.

**Integration with CesiumJS:**
```typescript
const tileset = viewer.scene.primitives.add(
  new Cesium.Cesium3DTileset({
    url: `https://tile.googleapis.com/v1/3dtiles/root.json?key=${GOOGLE_API_KEY}`,
    showCreditsOnScreen: true,
  })
);
```

### 10.4 Secondary & Future Data Sources (Cataloged for Expansion)

The following sources are documented for future integration beyond v1. They are NOT in scope for the initial build but represent the expansion path for CaseMap.live.

| Source | Type | What It Provides | Access Method | Priority |
|--------|------|-----------------|---------------|----------|
| **PACER / RECAP** | Federal dockets | Authoritative federal court filings; freshest SDNY/EDNY data | PACER API ($0.10/pg, waived <$30/quarter); RECAP via CourtListener | High (v1.1) |
| **Harvard CAP (case.law)** | Historical case law | 6.7M cases 1658–2020, all states; already imported into CourtListener | Bulk download (search/API deprecated) | Low (already in CL) |
| **NYSCEF** | NY Supreme Court | Active NY Supreme Court e-filings, motions, decisions | Web scraping (no API; structured HTML forms) | Medium (v1.2) |
| **WebCrims** | NYC criminal courts | Criminal court records, calendars, case status for NYC courts | Web scraping (no API; public portal) | Medium (v1.2) |
| **SCROLL** | NY Supreme Court | Case histories, County Clerk data, motions, decisions, calendars | Web scraping (no API; portal at nycourts.gov) | Medium (v1.2) |
| **GovInfo (GPO)** | Federal opinions | Authenticated PDFs of federal court opinions | REST API (free, no auth required) | Low (fallback) |
| **Justia** | Case law | Federal + state opinions, dockets; good for external links | No API; link target only | Low (external links) |
| **Google Scholar** | Case law | State appellate since 1950, federal since 1923, SCOTUS since 1791 | No API; link target only | Low (external links) |
| **NY Court of Appeals** | NY top court | Materials for cases pending/filed after Jan 1, 2013 | Public search portal (no API) | Low (v1.3) |
| **FJC Integrated Database** | Federal court stats | Metadata about federal court cases (nature of suit, outcomes, timing) | Via CourtListener (already imported) or direct from FJC | Low (already in CL) |

**Expansion Roadmap for Data Sources:**

- **v1.0:** CourtListener + NYC Open Data (Socrata) — covers federal/state appellate cases + NYC building-level violations and administrative hearings
- **v1.1:** Direct PACER integration for real-time federal docket updates in SDNY/EDNY
- **v1.2:** NYSCEF + WebCrims scrapers for active NY Supreme Court and criminal court filings
- **v1.3:** Multi-state expansion using CourtListener's full 3,355 jurisdictions + state-specific open data portals

---

## 11. UI / UX Architecture

### 11.1 Layout (Desktop)

```
┌──────────────────────────────────────────────────────────────┐
│  CaseMap.live    [Search ________________________] [Filters▾]│
├────────────────────────────────────┬─────────────────────────┤
│                                    │                         │
│                                    │    Side Panel            │
│         3D Globe / Map             │    (Search Results       │
│         (CesiumJS Viewer)          │     or Case Detail)      │
│                                    │                         │
│                                    │                         │
│                                    │                         │
│                                    │                         │
├────────────────────────────────────┴─────────────────────────┤
│  [▶ Play] ═══════════●═══════════════ [2020]───[2026]        │
│  Legend: 🔵 Federal  🟡 State Trial  🟢 Housing  🔴 Appellate │
└──────────────────────────────────────────────────────────────┘
```

### 11.2 Component Tree

```
<App>
  <Header>
    <CaseMapLogo />
    <SearchBar />
    <FilterDropdown />
    <AuthButton />
  </Header>
  <MainLayout>
    <GlobeContainer>
      <CesiumViewer>
        <Google3DTileset />
        <CourtMarkers />
        <JurisdictionOverlays />
      </CesiumViewer>
      <MapControls>
        <ResetViewButton />
        <LayerToggle />
        <ViewModeSwitch (2D/3D) />
      </MapControls>
    </GlobeContainer>
    <SidePanel>
      <SearchResults />
      — OR —
      <CaseDetail />
    </SidePanel>
  </MainLayout>
  <TimelineSlider />
  <Legend />
</App>
```

### 11.3 Design Principles

Section 11.3 — Design Principles (primary — rewrite this entirely)
This is where the design system lives. The current text defines dark theme, glassmorphism, and electric blue. Replace it with the new "Clean Intelligence, Light Mode" direction. I'd structure it as:

Theme: Light mode — white and gray backgrounds, black text, maximum readability
Layout pattern: HUD-style panels with sharp corners (rounded-sm max), thin 1px slate-200 borders, no rounded pill shapes
Typography: System sans-serif for UI text; JetBrains Mono (or font-mono) for data — docket numbers, case IDs, court codes, dates, coordinates, counts. Monospace text in slate-700.
Panel headers: Uppercase, letter-spaced, monospace labels (e.g., ── SEARCH RESULTS ── 47 FOUND ──)
Colors: White (#FFFFFF) backgrounds, slate-50 card surfaces, slate-200 borders, slate-900 text. Court marker colors unchanged (blue, red, gold, green, purple) — these need to pop on the globe.
CRT overlay: Optional CSS-only scan-line effect over the globe viewport, toggle-able, very subtle (~3-4% opacity against light background). pointer-events: none.
Coordinate readout: Small monospace HUD at bottom of globe showing live camera position (lat, lng, alt, heading). slate-500 text.
Accent color: Single subtle blue (#2563EB) for links and active/focus states only
Panels: Clean white with subtle shadow-sm, no glassmorphism, no backdrop-blur
Globe viewport rule: No UI chrome should occlude more than 35% of the globe (unchanged)

---

## 12. Development Roadmap

### Phase 0: Project Setup (Days 1–2)

- [ ] **0.1** Register `casemap.live` domain and configure DNS for Vercel
- [ ] **0.2** Initialize Next.js 14 project with TypeScript, Tailwind, pnpm
- [ ] **0.3** Install and configure `resium` (CesiumJS React wrapper) and `cesium` packages
- [ ] **0.4** Set up Supabase project (database + auth)
- [ ] **0.5** Obtain Google Cloud API key and enable Map Tiles API
- [ ] **0.6** Obtain CourtListener API token (register at courtlistener.com)
- [ ] **0.6b** Obtain NYC Open Data app token (register at https://data.cityofnewyork.us/profile/edit/developer_settings)
- [ ] **0.7** Set up environment variables (.env.local): `GOOGLE_MAPS_API_KEY`, `COURTLISTENER_API_TOKEN`, `NYC_OPENDATA_APP_TOKEN`, `NEXT_PUBLIC_CESIUM_ION_TOKEN`, `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_KEY`
- [ ] **0.8** Configure ESLint, Prettier, husky pre-commit hooks
- [ ] **0.9** Create GitHub repo (`casemap-live`) with README, .gitignore, MIT license
- [ ] **0.10** Deploy blank Next.js app to Vercel on `casemap.live`, confirm CI/CD pipeline works

### Phase 1: 3D Globe Foundation (Days 3–5)

- [ ] **1.1** Create `<GlobeContainer>` component with CesiumJS Viewer using `resium`
- [ ] **1.2** Load Google Photorealistic 3D Tiles as the base layer
- [ ] **1.3** Set initial camera to center on New York State (lat 42.9, lng -75.5, alt 400km)
- [ ] **1.4** Implement smooth fly-to animation utility function: `flyToLocation(lat, lng, altitude, duration)`
- [ ] **1.5** Test fly-to: click a button → camera flies to Times Square at 200m altitude with 3D buildings visible
- [ ] **1.6** Add "Reset View" button that flies back to the NY State overview
- [ ] **1.7** Handle CesiumJS loading states (show skeleton/spinner while tiles stream)
- [ ] **1.8** Lazy-load CesiumJS via `next/dynamic` with `ssr: false` to avoid SSR issues
- [ ] **1.9** Test performance: confirm 60fps navigation on target hardware
- [ ] **1.10** Configure `Cesium.RequestScheduler.requestsByServer["tile.googleapis.com:443"]` for faster tile loading

### Phase 2: Court Location Data (Days 6–8)

- [ ] **2.1** Research and compile the full list of NY court CourtListener IDs by querying their `/courts/` API
- [ ] **2.2** For each court, manually gather or geocode the physical address (courthouse location)
- [ ] **2.3** Create the `courts` table in Supabase with the schema from Section 9.1
- [ ] **2.4** Seed the `courts` table with all NY courts (est. 80–120 entries: 4 federal districts + bankruptcy, 62 county supreme courts, specialty NYC courts, appellate courts)
- [ ] **2.5** Create a Next.js API route `GET /api/courts` that returns all courts with their geocoded locations
- [ ] **2.6** Create a Zustand store `useCourtsStore` to hold court data client-side
- [ ] **2.7** On app load, fetch `/api/courts` and populate the store (cache indefinitely — courts don't move)

### Phase 3: Court Markers on the Globe (Days 9–12)

- [ ] **3.1** Create `<CourtMarkers>` component that reads from `useCourtsStore` and renders Cesium Entity billboards for each court
- [ ] **3.2** Design marker icons (SVG → PNG) for each court type with the color scheme from FR-2.3
- [ ] **3.3** Implement marker sizing logic: base size + scale factor based on case count (default to uniform size before search)
- [ ] **3.4** Implement hover tooltip: on mouseover, show a floating card with court name, address, and case count
- [ ] **3.5** Implement click handler: clicking a marker triggers fly-to and opens the side panel for that court
- [ ] **3.6** Implement marker clustering for zoom levels where courts overlap (especially NYC borough courts)
- [ ] **3.7** Add pulse/glow animation for markers when search results update
- [ ] **3.8** Add a `<Legend>` component showing the color-coding scheme

### Phase 4: Search Integration (Days 13–17)

- [ ] **4.1** Create Next.js API route `POST /api/search` that proxies to CourtListener's Search API
  - Accept: `{ query, courtIds, dateFrom, dateTo, type, page }`
  - Server-side: attach CourtListener token, build query params, forward request
  - Return: sanitized results with court ID mapped to local court data
- [ ] **4.2** Create Next.js API route `POST /api/search/nyc` that queries NYC Open Data (Socrata)
  - Accept: `{ address, borough, dataset, dateFrom, dateTo }`
  - Server-side: attach Socrata app token, build SoQL query, hit relevant dataset endpoints in parallel
  - Check Supabase `nyc_violations_cache` first; fetch from Socrata on cache miss (TTL: 24hr)
  - Return: normalized results with lat/lng for building-level map pins
- [ ] **4.3** Create `<SearchBar>` component with debounced input (300ms), search icon, clear button
  - Include a toggle or tab: "Court Cases" (CourtListener) vs. "NYC Violations" (Socrata) vs. "All"
- [ ] **4.4** Create a Zustand store `useSearchStore` with: `query`, `results`, `isLoading`, `filters`, `pagination`, `source`
- [ ] **4.5** On search submit, call appropriate `/api/search` route(s), populate `useSearchStore`, update markers on globe
- [ ] **4.6** Create `<SearchResults>` component in the side panel: scrollable list of case/violation cards
  - Court case cards show: case name, court, date filed, nature of suit, snippet
  - Violation cards show: address, violation class, status, date, description, agency
- [ ] **4.7** Clicking a search result card: flies to the court location (for cases) or building location (for violations) + opens detail panel
- [ ] **4.8** Implement `<FilterDropdown>` component with:
  - Court type multi-select checkboxes
  - Date range picker (from/to)
  - Nature of suit dropdown (CourtListener) / Violation class dropdown (Socrata)
  - Judge name autocomplete (CourtListener only)
  - Case/violation status toggle (open/closed/all)
  - Data source toggle (CourtListener / NYC Open Data / Both)
- [ ] **4.9** Update marker sizes dynamically based on search result counts per court/building
- [ ] **4.10** Handle empty results gracefully (message + suggestions)
- [ ] **4.11** Implement cursor-based pagination for CourtListener, offset pagination for Socrata ("Load more" button)

### Phase 5: Case Detail Panel (Days 18–21)

- [ ] **5.1** Create Next.js API route `GET /api/cases/[id]` that fetches full cluster + opinions from CourtListener
- [ ] **5.2** Create `<CaseDetail>` component with sections:
  - Header: case name, docket number, court badge
  - Metadata: date filed, date terminated, judges, nature of suit
  - Parties: plaintiff(s), defendant(s), attorneys
  - Opinion text (if available) with keyword highlighting
  - Cited cases list
  - External links (CourtListener, PACER)
- [ ] **5.3** Implement keyword highlighting in opinion text using the active search query
- [ ] **5.4** Implement "View cited case" — clicking a cited case runs a new search and flies to that court
- [ ] **5.5** Create `<BackButton>` in case detail that returns to search results
- [ ] **5.6** Add loading skeleton while case detail fetches
- [ ] **5.7** Handle cases with no opinion text (show docket-only view)

### Phase 6: Jurisdiction Overlays (Days 22–24)

- [ ] **6.1** Obtain or create GeoJSON files for:
  - NY federal district boundaries (SDNY, EDNY, NDNY, WDNY)
  - NY Appellate Division departments (1st, 2nd, 3rd, 4th)
  - NYC borough boundaries
- [ ] **6.2** Create `<JurisdictionOverlays>` component that loads GeoJSON as Cesium GeoJsonDataSource
- [ ] **6.3** Style overlays: semi-transparent fill (20% opacity), colored borders matching court type colors
- [ ] **6.4** Drape overlays onto 3D tiles using `clampToGround: true`
- [ ] **6.5** Create `<LayerToggle>` UI component: checkbox list to show/hide each overlay layer
- [ ] **6.6** Implement click-on-jurisdiction: clicking inside a boundary polygon shows aggregate stats in a popup

### Phase 7: UI Polish & Responsiveness (Days 25–28)

- [ ] **7.1** Implement light theme with HUD-style panel styling (sharp corners, thin borders, monospace data headers)
- [ ] **7.2** clean white panels with subtle shadow and thin slate-200 borders
- [ ] **7.3** Add smooth panel open/close animations (slide in from right, 300ms ease)
- [ ] **7.4** Implement responsive behavior: at <1280px, side panel overlays the globe as a full-width drawer
- [ ] **7.5** Add keyboard shortcuts: Escape to close panel, `/` to focus search, `R` to reset view
- [ ] **7.6** Design and implement empty states (no results, API error, loading)
- [ ] **7.7** Add a "Welcome to CaseMap.live" overlay on first visit explaining controls (dismissable, don't show again)
- [ ] **7.8** System sans-serif for UI text; JetBrains Mono for all data fields (docket numbers, case IDs, court codes, dates, coordinates). Add CRT scan-line CSS overlay as toggle-able option.
- [ ] **7.9** Animate marker transitions when filters change (fade out old, fade in new)
- [ ] **7.10** Design CaseMap.live wordmark/logo: clean sans-serif with a map pin or gavel motif

### Phase 8: Auth & Saved Searches (Days 29–31)

- [ ] **8.1** Configure Supabase Auth with email/password and Google OAuth
- [ ] **8.2** Create `<AuthButton>` component (sign in / user avatar dropdown)
- [ ] **8.3** Create `saved_searches` table in Supabase with RLS policies (users can only read/write their own)
- [ ] **8.4** Add "Save Search" button in the search results header (requires auth)
- [ ] **8.5** Create `<SavedSearches>` dropdown accessible from the search bar
- [ ] **8.6** Implement "Bookmark Case" feature — save individual cases for quick access
- [ ] **8.7** Add basic user profile page showing saved searches and bookmarked cases

### Phase 9: Testing & Performance (Days 32–34)

- [ ] **9.1** Write unit tests for API route handlers (search proxy, court data, case detail)
- [ ] **9.2** Write integration tests for the search → marker update → fly-to flow
- [ ] **9.3** Test all CourtListener API error states (rate limited, 404, 500, timeout)
- [ ] **9.4** Test Google Tiles API error states (quota exceeded, invalid key, network failure)
- [ ] **9.5** Lighthouse audit: target 90+ Performance score (with CesiumJS lazy-loaded)
- [ ] **9.6** Profile CesiumJS memory usage with 100+ markers and jurisdiction overlays
- [ ] **9.7** Implement stale-while-revalidate caching on `/api/search` responses (5 min TTL)
- [ ] **9.8** Add error boundary around the CesiumJS viewer (graceful fallback if WebGL fails)
- [ ] **9.9** Test on Chrome, Firefox, Safari, Edge on macOS and Windows

### Phase 10: Deployment & Launch (Days 35–37)

- [ ] **10.1** Configure Vercel environment variables for production
- [ ] **10.2** Set up Google API key restrictions (HTTP referrer: `casemap.live`, `*.casemap.live`)
- [ ] **10.3** Set up Vercel Analytics for usage monitoring
- [ ] **10.4** Configure Sentry for error tracking (client + server)
- [ ] **10.5** Write README.md with: project overview, screenshots/GIF, tech stack, local dev setup, deployment guide
- [ ] **10.6** Create a 30-second demo GIF or video showing the fly-to experience for the README and landing page
- [ ] **10.7** Deploy to production at `casemap.live`
- [ ] **10.8** Add OpenGraph meta tags and social preview image for link sharing
- [ ] **10.9** Submit to legal tech communities (Hacker News, r/LawSchool, r/paralegal, LawNext, Product Hunt)
- [ ] **10.10** Write a dev blog post about the CaseMap.live architecture (portfolio content)

---

## 13. Stretch Goals (v1.1+)

### Time Slider Animation
Animate case filings over time with a scrubbing timeline. Markers grow/shrink as filing volume changes by month. Uses CesiumJS's native clock and timeline widgets.

### Case Flow Visualization
Animated arcs between courts showing appeals (District → Circuit → SCOTUS). Uses CesiumJS CZML format for time-dynamic polyline entities. Camera follows the case journey.

### Heat Map Mode
Toggle from pin markers to a heat map overlay showing filing density across the state. Uses a custom CesiumJS ImageryProvider or a canvas-based heat map texture.

### AI Case Summarizer
Click "Summarize" on a case detail panel → LLM generates a plain-English summary of the opinion. Uses Anthropic API. Useful for law students and non-lawyers.

### Multi-State Expansion
Extend CaseMap.live beyond NY to all 50 states. Court location data compiled from CourtListener's full 3,355 jurisdictions. Requires scaling the geocode pipeline. Potential future domains: `casemap.live/california`, `casemap.live/texas`, etc.

### Embeddable Widget
Export a shareable embed code (`<iframe>`) that pins the CaseMap.live globe to a specific court or case — for law firm websites, news articles, or legal blogs.

### Street View Integration
From the courthouse fly-to view, offer a "Street View" button that opens Google Street View Tiles of the courthouse entrance — using the Map Tiles API's Street View endpoint.

### Public API
Expose a `api.casemap.live` endpoint that returns geocoded court + case data for third-party developers building legal-tech tools.

---

## 14. Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| CourtListener API rate limits hit during development | Medium | Medium | Obtain authenticated token (5K/hr), cache aggressively, use bulk data for court metadata |
| Google Tiles API costs exceed free tier | Low | High | Monitor usage in Cloud Console, set daily quota cap, use 2D tiles for non-NYC areas |
| CesiumJS performance issues with many markers | Medium | Medium | Implement clustering, LOD-based marker rendering, limit visible markers to viewport |
| Incomplete court geocode data | High | Medium | Manual geocoding for missing courts, fallback to county centroid |
| CourtListener court IDs don't cover all NY courts | Medium | Medium | Cross-reference with NY court system website, create custom entries for missing courts |
| CesiumJS bundle size impacts load time | Low | Medium | Lazy load via next/dynamic, tree-shake unused modules |
| Google Tiles API TOS restrictions on data overlay | Low | High | Review TOS carefully, ensure attribution displayed, avoid caching tiles |
| State court data availability limited on CourtListener | High | Low | Focus v1 on federal courts (excellent coverage), state courts as best-effort |
| Domain `casemap.live` conflicts with existing "CaseMap" trademarks | Low | Medium | Research existing trademarks; LexisNexis has a product called "CaseMap" but it's a different category and the `.live` TLD differentiates |

---

## 15. Definition of Done (per Phase)

A phase is complete when:

1. All checklist items are marked done
2. No TypeScript errors (`tsc --noEmit` passes)
3. No ESLint warnings
4. Manual smoke test passes (search → results → fly-to → detail → back)
5. Deployed to Vercel preview branch and tested in Chrome + Firefox
6. No console errors in production build
7. README updated if any setup steps changed

---

## 16. Success Metrics (Post-Launch)

| Metric | Target (30 days) |
|--------|------------------|
| Unique visitors to casemap.live | 500+ |
| Average session duration | >3 minutes (indicates exploration) |
| Searches performed | 1,000+ |
| GitHub stars | 50+ |
| API costs | <$10/month |
| Error rate | <1% of sessions |
| Hacker News upvotes (if posted) | 50+ |

---

## 17. Open Questions

1. **Court geocoding:** Should we manually geocode all 80–120 courts upfront, or build a batch geocoding pipeline using Google's Geocoding API? Manual is more accurate but time-intensive.

2. **State court coverage:** CourtListener's coverage of NY state courts (especially lower courts like Housing Court, Family Court) may be limited. Should v1 focus exclusively on federal courts with state as a stretch goal?

3. **Authentication model:** Is Supabase Auth sufficient, or should CaseMap.live also support "guest mode" with local storage for saved searches (no account required)?

4. **Monetization:** If CaseMap.live gains traction, what's the business model? Freemium with saved searches behind auth? API access for legal tech companies? Institutional licenses for law schools?

5. **Data freshness:** How often should we sync court metadata from CourtListener? Daily? Weekly? On-demand?

6. **Trademark:** LexisNexis has a product called "CaseMap" (case analysis software). The `.live` TLD and different product category likely differentiates, but worth monitoring.

---

*This is a living document. Update as requirements evolve during development.*
*Project: CaseMap.live | GitHub: github.com/[username]/casemap-live*
