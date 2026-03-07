/**
 * CesiumJS camera and navigation utilities — client-side only.
 * Import only from components lazy-loaded with ssr: false.
 */

import * as Cesium from "cesium";
import type { CameraDestination } from "@/types";

/** NYC boroughs overview — default reset target. */
export const NYC_OVERVIEW: CameraDestination = {
  latitude: 40.6392,
  longitude: -73.9865,
  altitude: 10_757,
};

/**
 * Smoothly flies the camera to a geographic location.
 *
 * @param viewer  - The active Cesium.Viewer instance.
 * @param destination - Target lat/lng/altitude.
 * @param duration - Flight duration in seconds (0 = instant).
 */
export function flyToLocation(
  viewer: Cesium.Viewer,
  destination: CameraDestination,
  duration = 2.0
): void {
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(
      destination.longitude,
      destination.latitude,
      destination.altitude
    ),
    duration,
    easingFunction: Cesium.EasingFunction.CUBIC_IN_OUT,
  });
}

/**
 * Resets the camera to the NYC boroughs overview —
 * south-of-Manhattan angled view showing all five boroughs.
 *
 * @param viewer   - The active Cesium.Viewer instance.
 * @param duration - Flight duration in seconds.
 */
export function flyToNewYorkState(viewer: Cesium.Viewer, duration = 2.0): void {
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(
      NYC_OVERVIEW.longitude,
      NYC_OVERVIEW.latitude,
      NYC_OVERVIEW.altitude
    ),
    orientation: {
      heading: Cesium.Math.toRadians(359),
      pitch: Cesium.Math.toRadians(-35),
      roll: 0,
    },
    duration,
    easingFunction: Cesium.EasingFunction.CUBIC_IN_OUT,
  });
}

/**
 * Reads the current camera position as lat/lng/altitude strings
 * formatted for the coordinate HUD readout.
 */
export function getCameraCoordinates(viewer: Cesium.Viewer): {
  lat: string;
  lng: string;
  alt: string;
  heading: string;
} {
  const cart = Cesium.Cartographic.fromCartesian(viewer.camera.position);
  const lat = Cesium.Math.toDegrees(cart.latitude);
  const lng = Cesium.Math.toDegrees(cart.longitude);
  const alt = cart.height;
  const heading = Cesium.Math.toDegrees(viewer.camera.heading);

  return {
    lat: `${Math.abs(lat).toFixed(4)}°${lat >= 0 ? "N" : "S"}`,
    lng: `${Math.abs(lng).toFixed(4)}°${lng >= 0 ? "E" : "W"}`,
    alt: `${Math.round(alt).toLocaleString()}m`,
    heading: `${((heading % 360) + 360) % 360 | 0}°`,
  };
}
