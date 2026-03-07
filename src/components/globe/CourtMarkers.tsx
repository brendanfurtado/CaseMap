"use client";

/**
 * CourtMarkers — renders all NY courts as colored pin markers on the globe.
 *
 * Uses Cesium.PinBuilder to generate teardrop-shaped billboard pins per court,
 * grouped by color so we only build one canvas per unique court type color.
 *
 * Must be rendered inside <Viewer> to access useCesium().
 * Fetches court data from /api/courts via useCourtsStore on first mount.
 *
 * Click behavior: clicking a marker flies the camera to that courthouse
 * and opens a HUD popup with court details.
 */

import { useEffect, useState } from "react";
import { useCesium } from "resium";
import * as Cesium from "cesium";

import { useCourtsStore } from "@/stores/useCourtsStore";
import { flyToLocation } from "@/lib/cesium-utils";
import type { Court, CourtType } from "@/types";

const COURT_TYPE_LABELS: Record<CourtType, string> = {
  federal_district: "Federal District",
  federal_appellate: "Federal Appellate",
  federal_bankruptcy: "Federal Bankruptcy",
  state_appellate: "State Appellate",
  state_trial: "State Trial",
  state_housing: "State Housing",
  state_family: "State Family",
  state_surrogate: "State Surrogate",
  state_claims: "State Claims",
};

export default function CourtMarkers() {
  const { viewer, scene } = useCesium();
  const courts = useCourtsStore((s) => s.courts);
  const fetchCourts = useCourtsStore((s) => s.fetchCourts);
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);

  // Fetch courts once on mount
  useEffect(() => {
    fetchCourts();
  }, [fetchCourts]);

  // Render billboard pin primitives — one per court
  useEffect(() => {
    if (!viewer || !scene || courts.length === 0) return;

    const pinBuilder = new Cesium.PinBuilder();

    // Cache one pin canvas per unique color to avoid redundant renders
    const pinCache = new Map<string, HTMLCanvasElement>();
    const getPinCanvas = (hex: string): HTMLCanvasElement => {
      if (!pinCache.has(hex)) {
        pinCache.set(
          hex,
          pinBuilder.fromColor(Cesium.Color.fromCssColorString(hex), 48)
        );
      }
      return pinCache.get(hex)!;
    };

    const billboards = scene.primitives.add(new Cesium.BillboardCollection());

    courts.forEach((court) => {
      const canvas = getPinCanvas(court.marker_color);
      billboards.add({
        position: Cesium.Cartesian3.fromDegrees(
          court.longitude,
          court.latitude
        ),
        image: canvas,
        // Anchor the pin tip to the coordinate (bottom-center of the image)
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        // Scale down slightly so pins don't overlap too heavily at state zoom
        scale: 0.6,
        // Disable depth testing so pins always appear above terrain/buildings
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        id: court,
      });
    });

    return () => {
      if (!viewer.isDestroyed()) {
        scene.primitives.remove(billboards);
      }
    };
  }, [viewer, scene, courts]);

  // Click handler — pick a billboard and fly to that court
  useEffect(() => {
    if (!viewer || courts.length === 0) return;

    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

    handler.setInputAction(
      (click: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
        const picked = viewer.scene.pick(click.position);

        if (
          Cesium.defined(picked) &&
          picked.id !== null &&
          typeof picked.id === "object" &&
          "cl_court_id" in picked.id
        ) {
          const court = picked.id as Court;
          setSelectedCourt(court);
          flyToLocation(
            viewer,
            {
              latitude: court.latitude,
              longitude: court.longitude,
              altitude: court.altitude_flyto,
            },
            2.0
          );
        } else {
          // Click on empty space dismisses the popup
          setSelectedCourt(null);
        }
      },
      Cesium.ScreenSpaceEventType.LEFT_CLICK
    );

    return () => {
      handler.destroy();
    };
  }, [viewer, courts]);

  return (
    <>
      {selectedCourt && (
        <div className="absolute bottom-16 left-4 z-20 w-72 pointer-events-auto">
          <div className="hud-panel p-4">
            {/* Header row */}
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex-1 min-w-0">
                <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400 mb-1">
                  {COURT_TYPE_LABELS[selectedCourt.court_type]}
                </p>
                <h2 className="text-sm font-bold text-slate-900 leading-snug">
                  {selectedCourt.name}
                </h2>
              </div>
              <button
                onClick={() => setSelectedCourt(null)}
                className="shrink-0 font-mono text-xs text-slate-400 hover:text-slate-900 transition-colors leading-none mt-0.5"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-200 mb-3" />

            {/* Details */}
            <div className="space-y-1.5">
              <div className="flex gap-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 w-16 shrink-0 pt-px">
                  Short
                </span>
                <span className="font-mono text-xs text-slate-700">
                  {selectedCourt.short_name}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 w-16 shrink-0 pt-px">
                  Address
                </span>
                <span className="font-mono text-xs text-slate-700 leading-snug">
                  {selectedCourt.address}
                </span>
              </div>
              {selectedCourt.borough && (
                <div className="flex gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 w-16 shrink-0 pt-px">
                    Borough
                  </span>
                  <span className="font-mono text-xs text-slate-700">
                    {selectedCourt.borough}
                  </span>
                </div>
              )}
              <div className="flex gap-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 w-16 shrink-0 pt-px">
                  ID
                </span>
                <span className="font-mono text-xs text-slate-500">
                  {selectedCourt.cl_court_id}
                </span>
              </div>
            </div>

            {/* Color accent bar */}
            <div
              className="mt-3 h-0.5 rounded-full"
              style={{ backgroundColor: selectedCourt.marker_color }}
            />
          </div>
        </div>
      )}
    </>
  );
}
