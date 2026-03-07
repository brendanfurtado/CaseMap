/**
 * Zustand store for court location data.
 *
 * Court data is fetched once from /api/courts and cached indefinitely
 * client-side — courts don't move, so no re-fetching is needed.
 *
 * NOTE: zustand is not yet installed. Install with: pnpm add zustand
 */

// import { create } from "zustand";
import type { Court } from "@/types";

interface CourtsState {
  courts: Court[];
  isLoading: boolean;
  error: string | null;
}

interface CourtsActions {
  /**
   * Fetches all NY courts from the /api/courts route and populates the store.
   * No-ops if courts are already loaded to prevent duplicate fetches.
   */
  fetchCourts: () => Promise<void>;
  /**
   * Returns a court by its CourtListener court ID, or undefined if not found.
   * @param clCourtId — CourtListener court ID, e.g. "nysd", "nyed", "nysupct"
   */
  getCourtById: (clCourtId: string) => Court | undefined;
}

// Phase 0 stub — real implementation after installing zustand
// export const useCourtsStore = create<CourtsState & CourtsActions>((set, get) => ({
//   courts: [],
//   isLoading: false,
//   error: null,
//
//   fetchCourts: async () => {
//     if (get().courts.length > 0) return; // already loaded
//
//     set({ isLoading: true, error: null });
//     try {
//       const response = await fetch("/api/courts");
//       if (!response.ok) {
//         throw new Error(`Failed to fetch courts: ${response.status} ${response.statusText}`);
//       }
//       const courts: Court[] = await response.json();
//       set({ courts, isLoading: false });
//     } catch (err) {
//       const message = err instanceof Error ? err.message : "Unknown error fetching courts";
//       set({ error: message, isLoading: false });
//       console.error("[CaseMap] useCourtsStore.fetchCourts:", message);
//     }
//   },
//
//   getCourtById: (clCourtId) => {
//     return get().courts.find((c) => c.cl_court_id === clCourtId);
//   },
// }));

/** Phase 0 placeholder export — replace with the real create() call above in Phase 2. */
export const useCourtsStore = {
  getState: (): CourtsState & CourtsActions => ({
    courts: [],
    isLoading: false,
    error: null,
    fetchCourts: async () => {
      console.warn("[CaseMap] useCourtsStore.fetchCourts: zustand not yet installed");
    },
    getCourtById: (_clCourtId: string) => undefined,
  }),
};
