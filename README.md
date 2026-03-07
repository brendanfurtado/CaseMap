# CaseMap.live

New York court cases on a 3D globe. Search for a case, fly down to the courthouse, see what's been filed there.

Built with CesiumJS and Google Photorealistic 3D Tiles — so you're looking at actual buildings, not icons on a flat map.

---

## What it does

- Plots every NY court (federal, state, housing, appellate, bankruptcy) as a marker on a 3D globe
- Search by topic, party name, or docket number via CourtListener's API
- Click a result → camera flies to the courthouse
- NYC-specific data (HPD violations, OATH hearings, DOB complaints) from NYC Open Data
- Coordinate readout shows live camera position as you navigate

## Running locally

```bash
pnpm install
pnpm copy-cesium   # copies CesiumJS static assets to public/
pnpm dev
```

You need a `.env.local` file. Copy `.env.example` and fill in:

| Key | Where to get it |
|-----|----------------|
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Cloud Console → Map Tiles API |
| `NEXT_PUBLIC_CESIUM_ION_TOKEN` | ion.cesium.com/tokens |
| `COURTLISTENER_API_TOKEN` | courtlistener.com → Profile |
| `NYC_OPENDATA_APP_TOKEN` + `NYC_OPENDATA_APP_SECRET` | data.cityofnewyork.us → Developer Settings |
| `NEXT_PUBLIC_SUPABASE_URL` + keys | supabase.com → Project Settings → API |

## Stack

Next.js 16 · TypeScript · CesiumJS + Resium · Google Photorealistic 3D Tiles · Tailwind CSS v4 · Zustand · Supabase · pnpm

## Status

Early development. Court markers and search are not yet built — right now it's a 3D globe centered on Manhattan. See `.claude/TODO.md` for the full roadmap.
