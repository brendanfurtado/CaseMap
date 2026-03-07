/**
 * CesiumJS initialization — client-side only.
 *
 * Sets the Cesium static asset base URL (so Workers/Assets are found in /public/cesium/)
 * and the Ion access token.
 *
 * IMPORTANT: Only import this from client components or files lazy-loaded with ssr: false.
 * Never import from server components or API routes.
 *
 * Call initCesium() once at module level in GlobeViewer.tsx, before the Viewer mounts.
 */

import { Ion, buildModuleUrl } from "cesium";

let initialized = false;

/**
 * Initializes CesiumJS:
 *  1. Sets the base URL to /cesium/ so Workers, Assets, and ThirdParty files are found.
 *     These are copied from node_modules by scripts/copy-cesium-assets.mjs.
 *  2. Sets the Cesium Ion access token from NEXT_PUBLIC_CESIUM_ION_TOKEN.
 *
 * Guards against double-initialization — safe to call multiple times.
 */
export function initCesium(): void {
  if (initialized) return;

  // Tell CesiumJS where to find its static files.
  // Must match the output of scripts/copy-cesium-assets.mjs.
  buildModuleUrl.setBaseUrl("/cesium/");

  const token = process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN;

  if (!token || token.startsWith("placeholder")) {
    console.warn(
      "[CaseMap] NEXT_PUBLIC_CESIUM_ION_TOKEN is missing or placeholder. " +
        "Cesium Ion assets will not load. Set a real token in .env.local."
    );
    initialized = true;
    return;
  }

  Ion.defaultAccessToken = token;
  initialized = true;
}
