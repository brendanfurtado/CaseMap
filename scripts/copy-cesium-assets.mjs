#!/usr/bin/env node
/**
 * Copies CesiumJS static assets to public/cesium/.
 *
 * CesiumJS spawns Web Workers at runtime and loads static assets (fonts, imagery
 * sprites, icons) from a base URL. These files must be served from the public
 * directory so the browser can fetch them.
 *
 * This script copies the four required directories from the cesium npm package:
 *   Assets/    — imagery, fonts, icons used by the viewer
 *   ThirdParty/ — third-party libraries (draco, etc.)
 *   Workers/   — Web Workers for terrain/imagery decoding
 *   Widgets/   — CSS and images for Cesium UI widgets
 *
 * Run manually: node scripts/copy-cesium-assets.mjs
 * Also runs automatically via postinstall.
 */

import { cpSync, mkdirSync, existsSync, rmSync } from "fs";
import { join, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const root = resolve(__dirname, "..");

const sourceDir = join(root, "node_modules", "cesium", "Build", "Cesium");
const targetDir = join(root, "public", "cesium");

if (!existsSync(sourceDir)) {
  console.error(`[copy-cesium] ERROR: Source not found at ${sourceDir}`);
  console.error("[copy-cesium] Run: pnpm add cesium");
  process.exit(1);
}

// Clean the existing copy so deleted/renamed files don't linger
if (existsSync(targetDir)) {
  rmSync(targetDir, { recursive: true, force: true });
}
mkdirSync(targetDir, { recursive: true });

const dirs = ["Assets", "ThirdParty", "Workers", "Widgets"];

for (const dir of dirs) {
  const src = join(sourceDir, dir);
  const dest = join(targetDir, dir);
  if (existsSync(src)) {
    cpSync(src, dest, { recursive: true });
    console.log(`[copy-cesium] Copied ${dir}/`);
  } else {
    console.warn(`[copy-cesium] Not found (skipping): ${dir}/`);
  }
}

console.log(`[copy-cesium] Done — assets available at /cesium/`);
