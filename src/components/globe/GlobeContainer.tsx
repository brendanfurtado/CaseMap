"use client";

import dynamic from "next/dynamic";

/**
 * Loading skeleton shown while CesiumJS initializes.
 * Matches the globe's dark background so the transition is seamless.
 */
function GlobeLoadingSkeleton() {
  return (
    <div className="w-full h-full bg-slate-950 flex items-center justify-center">
      <div className="space-y-2 text-center">
        <div className="font-mono text-xs text-slate-500 uppercase tracking-widest animate-pulse">
          Initializing 3D Viewer
        </div>
        <div className="font-mono text-[10px] text-slate-700 tracking-wider">
          Loading Google Photorealistic 3D Tiles
        </div>
      </div>
    </div>
  );
}

/**
 * Lazy-loads GlobeViewer (CesiumJS) on the client only.
 * ssr: false prevents CesiumJS from being imported on the server,
 * which would fail since CesiumJS references browser globals.
 */
const GlobeViewer = dynamic(() => import("./GlobeViewer"), {
  ssr: false,
  loading: GlobeLoadingSkeleton,
});

/**
 * GlobeContainer — safe to import from server components and page.tsx.
 * Handles the CesiumJS lazy-load boundary.
 */
export default function GlobeContainer() {
  return (
    <div className="relative w-full h-full">
      <GlobeViewer />
    </div>
  );
}
