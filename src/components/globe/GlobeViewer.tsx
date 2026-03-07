"use client";

/**
 * GlobeViewer — the CesiumJS viewer component.
 *
 * Client-only. This file MUST be lazy-loaded via next/dynamic with ssr: false.
 * Never import this directly from a server component or page.tsx.
 *
 * Renders:
 *  - Google Photorealistic 3D Tiles as the base layer
 *  - Initial camera positioned over New York State
 *  - Live coordinate readout HUD (bottom-center)
 *  - Reset View button (bottom-right)
 */

import { useEffect, useState, useCallback } from "react";
import { Viewer, useCesium } from "resium";
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";

import { initCesium } from "@/lib/cesium-config";
import { flyToNewYorkState, getCameraCoordinates } from "@/lib/cesium-utils";
import CourtMarkers from "./CourtMarkers";

// Initialize Cesium (base URL + Ion token) at module load time.
// Safe: this module is only evaluated in the browser (lazy-loaded with ssr: false).
initCesium();

// ─────────────────────────────────────────────────────────────
// GooglePhotorealistic3DTiles
// Loads Google's 3D Tiles tileset and configures the viewer.
// Must be rendered inside <Viewer> to access useCesium().
// ─────────────────────────────────────────────────────────────

function GooglePhotorealistic3DTiles() {
  const { viewer } = useCesium();

  useEffect(() => {
    if (!viewer) return;

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey || apiKey.startsWith("placeholder")) {
      console.warn(
        "[CaseMap] NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is missing — 3D tiles will not load"
      );
      return;
    }

    // Remove default Cesium imagery (Bing Maps / Natural Earth)
    viewer.imageryLayers.removeAll();

    // Use flat ellipsoid terrain — Google 3D Tiles include their own elevation data
    viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider();

    let tileset: Cesium.Cesium3DTileset | undefined;

    Cesium.Cesium3DTileset.fromUrl(
      `https://tile.googleapis.com/v1/3dtiles/root.json?key=${apiKey}`,
      { showCreditsOnScreen: true }
    )
      .then((ts) => {
        tileset = ts;
        viewer.scene.primitives.add(tileset);

        // Initial view: south of Manhattan looking north, full island visible
        viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(-73.9865, 40.6392, 10_757),
          orientation: {
            heading: Cesium.Math.toRadians(359),
            pitch: Cesium.Math.toRadians(-35),
            roll: 0,
          },
          duration: 0,
        });
      })
      .catch((err: unknown) => {
        console.error("[CaseMap] Failed to load Google Photorealistic 3D Tiles:", err);
      });

    return () => {
      if (tileset && !viewer.isDestroyed()) {
        viewer.scene.primitives.remove(tileset);
      }
    };
  }, [viewer]);

  return null;
}

// ─────────────────────────────────────────────────────────────
// CoordinateReadout
// Live camera lat/lng/alt/heading HUD. Renders as an absolutely
// positioned overlay inside the Viewer container.
// Must be inside <Viewer> to access useCesium().
// ─────────────────────────────────────────────────────────────

interface CoordState {
  lat: string;
  lng: string;
  alt: string;
  heading: string;
}

function CoordinateReadout() {
  const { viewer } = useCesium();
  const [coords, setCoords] = useState<CoordState>({
    lat: "42.9000°N",
    lng: "75.5000°W",
    alt: "400,000m",
    heading: "0°",
  });

  useEffect(() => {
    if (!viewer) return;

    const removeListener = viewer.scene.postRender.addEventListener(() => {
      setCoords(getCameraCoordinates(viewer));
    });

    return () => {
      removeListener();
    };
  }, [viewer]);

  return (
    <div
      className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 pointer-events-none"
      style={{ transform: "translateX(-50%)" }}
    >
      <div className="hud-panel px-3 py-1.5">
        <span className="font-mono text-xs text-slate-400 tracking-wider whitespace-nowrap">
          LAT {coords.lat}&nbsp;&nbsp;LNG {coords.lng}&nbsp;&nbsp;ALT {coords.alt}
          &nbsp;&nbsp;HDG {coords.heading}
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ResetViewButton
// Flies camera back to New York State overview.
// Must be inside <Viewer> to access useCesium().
// ─────────────────────────────────────────────────────────────

function ResetViewButton() {
  const { viewer } = useCesium();

  const handleReset = useCallback(() => {
    if (!viewer) return;
    flyToNewYorkState(viewer, 2.0);
  }, [viewer]);

  return (
    <div className="absolute bottom-6 right-4 z-10">
      <button
        onClick={handleReset}
        className="hud-panel px-3 py-1.5 font-mono text-xs text-slate-500 uppercase tracking-widest hover:text-slate-900 hover:border-slate-400 transition-colors cursor-pointer"
        title="Reset to New York State overview (keyboard: R)"
      >
        Reset View
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// GlobeViewer — main export
// ─────────────────────────────────────────────────────────────

/**
 * Full-screen CesiumJS globe with Google Photorealistic 3D Tiles.
 * Client-only — import via GlobeContainer which lazy-loads with ssr: false.
 */
export default function GlobeViewer() {
  return (
    <Viewer
      full
      animation={false}
      baseLayerPicker={false}
      fullscreenButton={false}
      geocoder={false}
      homeButton={false}
      infoBox={false}
      sceneModePicker={false}
      selectionIndicator={false}
      timeline={false}
      navigationHelpButton={false}
      navigationInstructionsInitiallyVisible={false}
    >
      {/* Tile loader — no DOM output */}
      <GooglePhotorealistic3DTiles />

      {/* Court markers — fetches from /api/courts, renders as colored points */}
      <CourtMarkers />

      {/* HUD overlays — rendered inside Viewer's container, above the canvas */}
      <CoordinateReadout />
      <ResetViewButton />
    </Viewer>
  );
}
