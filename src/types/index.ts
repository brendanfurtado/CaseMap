/**
 * Shared TypeScript interfaces and types for CaseMap.live.
 * These types mirror the Supabase database schema and API response shapes.
 * See SRS Section 9 for the full data architecture.
 */

// ============================================================
// COURT TYPES
// ============================================================

/** The nine court type categories used for color-coding and filtering. */
export type CourtType =
  | "federal_district"
  | "federal_appellate"
  | "federal_bankruptcy"
  | "state_appellate"
  | "state_trial"
  | "state_housing"
  | "state_family"
  | "state_surrogate"
  | "state_claims";

/**
 * Court record — mirrors the Supabase `courts` table schema.
 * Populated from CourtListener court metadata + manual geocoding.
 */
export interface Court {
  id: string;
  /** CourtListener court identifier, e.g. "nysd", "nyed", "nysupct" */
  cl_court_id: string;
  name: string;
  short_name: string;
  court_type: CourtType;
  /** Two-letter jurisdiction code, e.g. "NY" */
  jurisdiction: string;
  latitude: number;
  longitude: number;
  /** Camera altitude in meters for fly-to animation */
  altitude_flyto: number;
  address: string;
  /** NYC borough — only populated for NYC courts */
  borough: string | null;
  /** Hex color for the map marker, e.g. "#2563EB" */
  marker_color: string;
  created_at: string;
  updated_at: string;
}

// ============================================================
// SEARCH & RESULTS
// ============================================================

/** The two primary data sources for case and violation search. */
export type SearchSource = "courtlistener" | "nyc_opendata";

/**
 * Unified search result — normalizes CourtListener case data and
 * NYC Open Data violation/hearing records into a single shape for rendering.
 */
export interface SearchResult {
  id: string;
  case_name: string;
  /** Resolved Court record (joined via cl_court_id or inferred from address) */
  court: Court | null;
  court_id: string;
  date_filed: string | null;
  /** Docket number from CourtListener or dataset record_id from Socrata */
  docket_number: string | null;
  /** Short excerpt from opinion text or violation description */
  snippet: string | null;
  source: SearchSource;
  /** Building-level latitude — populated for NYC Open Data results */
  latitude: number | null;
  /** Building-level longitude — populated for NYC Open Data results */
  longitude: number | null;
}

// ============================================================
// NYC OPEN DATA
// ============================================================

/** The five NYC Open Data (Socrata) datasets currently in scope. */
export type NYCDataset =
  | "hpd_violations"
  | "oath_hearings"
  | "hpd_litigation"
  | "dob_complaints"
  | "ecb_violations";

/**
 * NYC violation/hearing cache record — mirrors the Supabase
 * `nyc_violations_cache` table schema.
 * Records are fetched from Socrata and cached with a 24-hour TTL.
 */
export interface NYCViolationRecord {
  id: string;
  source_dataset: NYCDataset;
  /** Unique record identifier from the Socrata dataset */
  record_id: string;
  address: string;
  borough: string;
  latitude: number;
  longitude: number;
  case_type: string;
  status: "open" | "closed" | "pending";
  date_filed: string;
  date_resolved: string | null;
  description: string;
  /** Full raw Socrata record for future field access */
  raw_data: Record<string, unknown>;
  fetched_at: string;
  created_at: string;
}

// ============================================================
// SEARCH FILTERS
// ============================================================

/**
 * Search filter state — controls how results are filtered across both sources.
 * All fields are optional (null = no filter applied).
 */
export interface SearchFilters {
  dateFrom: string | null;
  dateTo: string | null;
  /** Empty array = all court types included */
  courtType: CourtType[];
  /** Case/violation status filter */
  status: "open" | "closed" | "all";
  /** Which data source(s) to query */
  source: SearchSource | "all";
}

// ============================================================
// SAVED SEARCHES (requires auth)
// ============================================================

/**
 * Saved search record — mirrors the Supabase `saved_searches` table.
 * Protected by Row Level Security: users can only read/write their own.
 */
export interface SavedSearch {
  id: string;
  /** FK → auth.users */
  user_id: string;
  query: string;
  filters: SearchFilters;
  name: string;
  created_at: string;
}

// ============================================================
// CAMERA / NAVIGATION
// ============================================================

/**
 * Camera fly-to destination for CesiumJS navigation.
 * Altitude is in meters above the WGS84 ellipsoid.
 */
export interface CameraDestination {
  latitude: number;
  longitude: number;
  /** Meters above the ellipsoid. Typical values: 200 (street), 5000 (city), 400000 (state) */
  altitude: number;
}
