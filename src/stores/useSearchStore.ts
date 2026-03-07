/**
 * Zustand store for case and violation search state.
 *
 * Manages unified search across CourtListener (court cases) and
 * NYC Open Data / Socrata (violations, hearings). All search methods
 * are stubbed in Phase 0 — full implementation in Phase 4.
 *
 * NOTE: zustand is not yet installed. Install with: pnpm add zustand
 */

// import { create } from "zustand";
import type { SearchResult, SearchSource, SearchFilters } from "@/types";

const DEFAULT_FILTERS: SearchFilters = {
  dateFrom: null,
  dateTo: null,
  courtType: [],
  status: "all",
  source: "all",
};

interface SearchState {
  query: string;
  source: SearchSource | "all";
  results: SearchResult[];
  isLoading: boolean;
  error: string | null;
  /** Cursor for CourtListener pagination */
  cursor: string | null;
  totalCount: number;
  filters: SearchFilters;
}

interface SearchActions {
  setQuery: (query: string) => void;
  setSource: (source: SearchSource | "all") => void;
  setFilters: (filters: Partial<SearchFilters>) => void;
  /** Executes search against the configured source(s). Phase 4 implementation. */
  search: () => Promise<void>;
  /** Loads the next page of results using cursor pagination. Phase 4 implementation. */
  loadMore: () => Promise<void>;
  clearResults: () => void;
}

// Phase 0 stub — real implementation after installing zustand in Phase 4
// export const useSearchStore = create<SearchState & SearchActions>((set, get) => ({
//   query: "",
//   source: "all",
//   results: [],
//   isLoading: false,
//   error: null,
//   cursor: null,
//   totalCount: 0,
//   filters: { ...DEFAULT_FILTERS },
//
//   setQuery: (query) => set({ query }),
//
//   setSource: (source) => set({ source }),
//
//   setFilters: (partial) =>
//     set((state) => ({ filters: { ...state.filters, ...partial } })),
//
//   search: async () => {
//     console.warn("[CaseMap] useSearchStore.search: not yet implemented — Phase 4");
//   },
//
//   loadMore: async () => {
//     console.warn("[CaseMap] useSearchStore.loadMore: not yet implemented — Phase 4");
//   },
//
//   clearResults: () =>
//     set({ results: [], cursor: null, totalCount: 0, error: null }),
// }));

/** Phase 0 placeholder export — replace with the real create() call above in Phase 4. */
export const useSearchStore = {
  getState: (): SearchState & SearchActions => ({
    query: "",
    source: "all",
    results: [],
    isLoading: false,
    error: null,
    cursor: null,
    totalCount: 0,
    filters: { ...DEFAULT_FILTERS },
    setQuery: (_query: string) => {
      console.warn("[CaseMap] useSearchStore.setQuery: not yet implemented — Phase 4");
    },
    setSource: (_source: SearchSource | "all") => {
      console.warn("[CaseMap] useSearchStore.setSource: not yet implemented — Phase 4");
    },
    setFilters: (_partial: Partial<SearchFilters>) => {
      console.warn("[CaseMap] useSearchStore.setFilters: not yet implemented — Phase 4");
    },
    search: async () => {
      console.warn("[CaseMap] useSearchStore.search: not yet implemented — Phase 4");
    },
    loadMore: async () => {
      console.warn("[CaseMap] useSearchStore.loadMore: not yet implemented — Phase 4");
    },
    clearResults: () => {
      console.warn("[CaseMap] useSearchStore.clearResults: not yet implemented — Phase 4");
    },
  }),
};
