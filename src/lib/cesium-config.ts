/**
 * CesiumJS initialization — client-side only.
 * Sets the Cesium Ion access token required for Cesium Ion assets and terrain.
 *
 * IMPORTANT: This module must only be imported from client components.
 * Never import from server components or API routes.
 *
 * Usage: call initCesium() once before mounting the CesiumViewer.
 * Typically called inside the GlobeContainer useEffect or at the top of the
 * dynamic-imported globe module.
 */

// NOTE: "cesium" is not yet installed. Install with: pnpm add cesium resium
// Uncomment the import below in Phase 1 after installation.
// import { Ion } from "cesium";

const CESIUM_TOKEN_PLACEHOLDER = "your_cesium_ion_token_here";

let initialized = false;

/**
 * Initializes the Cesium Ion access token from the environment.
 * Guards against double-initialization — safe to call multiple times.
 *
 * @throws Never throws — logs warnings to console.error/console.warn instead,
 *   so a missing token doesn't crash the app (globe will load without Ion assets).
 */
export function initCesium(): void {
  if (initialized) return;

  const token = process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN;

  if (!token) {
    console.warn(
      "[CaseMap] NEXT_PUBLIC_CESIUM_ION_TOKEN is not set. " +
        "Cesium Ion assets (terrain, imagery) will not load. " +
        "Set this value in .env.local — see .env.example for details."
    );
    initialized = true;
    return;
  }

  if (token === CESIUM_TOKEN_PLACEHOLDER || token.startsWith("placeholder")) {
    console.warn(
      "[CaseMap] NEXT_PUBLIC_CESIUM_ION_TOKEN is still a placeholder value. " +
        "Obtain a real token at https://ion.cesium.com/tokens"
    );
    initialized = true;
    return;
  }

  // Phase 1: Uncomment after installing cesium package
  // Ion.defaultAccessToken = token;

  initialized = true;
}
