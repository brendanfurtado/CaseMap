/**
 * Zustand store for court location data.
 *
 * Court data is fetched once from /api/courts and cached indefinitely
 * client-side — courts don't move, so no re-fetching is needed.
 */

import { create } from "zustand";
import type { Court } from "@/types";

interface CourtsState {
  courts: Court[];
  isLoading: boolean;
  error: string | null;
}

interface CourtsActions {
  /**
   * Fetches all NY courts from /api/courts and populates the store.
   * No-ops if courts are already loaded.
   */
  fetchCourts: () => Promise<void>;
  /**
   * Returns a court by its CourtListener ID, or undefined if not found.
   */
  getCourtById: (clCourtId: string) => Court | undefined;
}

export const useCourtsStore = create<CourtsState & CourtsActions>((set, get) => ({
  courts: [],
  isLoading: false,
  error: null,

  fetchCourts: async () => {
    if (get().courts.length > 0) return;

    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/courts");
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }
      const courts: Court[] = await response.json();
      set({ courts, isLoading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      console.error("[CaseMap] useCourtsStore.fetchCourts:", message);
      set({ error: message, isLoading: false });
    }
  },

  getCourtById: (clCourtId) => {
    return get().courts.find((c) => c.cl_court_id === clCourtId);
  },
}));
