export default function Home() {
  const systemFields: [string, string][] = [
    ["Framework", "Next.js 16"],
    ["Language", "TypeScript"],
    ["3D Engine", "CesiumJS"],
    ["Styling", "Tailwind CSS v4"],
    ["State", "Zustand"],
    ["Phase", "0 — Setup"],
  ];

  const apiServices: [string, string][] = [
    ["Google Maps API", "● placeholder"],
    ["Cesium Ion Token", "● placeholder"],
    ["CourtListener API", "● placeholder"],
    ["NYC Open Data", "● placeholder"],
    ["Supabase", "● placeholder"],
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-lg space-y-6">
        {/* Wordmark */}
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-bold tracking-tight text-slate-900">
            CaseMap<span className="text-slate-400">.live</span>
          </h1>
          <p className="text-slate-500 text-sm">
            Court case geographic visualizer for New York
          </p>
          <p className="text-slate-400 text-xs font-mono">
            Powered by CesiumJS · Google Photorealistic 3D Tiles · CourtListener
          </p>
        </div>

        {/* System Status panel */}
        <div className="hud-panel p-4 space-y-3">
          <div className="hud-header">System Status</div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
            {systemFields.map(([label, value]) => (
              <div key={label}>
                <div className="data-label">{label}</div>
                <div className="data-field">{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* API Keys panel */}
        <div className="hud-panel p-4 space-y-3">
          <div className="hud-header">API Keys</div>
          <div className="space-y-2">
            {apiServices.map(([service, status]) => (
              <div key={service} className="flex items-center justify-between">
                <span className="data-label">{service}</span>
                <span className="data-field text-slate-400">{status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Court type legend */}
        <div className="hud-panel p-4 space-y-3">
          <div className="hud-header">Court Types</div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0" />
              <span className="data-label">Federal District</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600 flex-shrink-0" />
              <span className="data-label">Appellate</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-600 flex-shrink-0" />
              <span className="data-label">State Trial</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-600 flex-shrink-0" />
              <span className="data-label">Housing</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-600 flex-shrink-0" />
              <span className="data-label">Bankruptcy</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-500 flex-shrink-0" />
              <span className="data-label">Other</span>
            </div>
          </div>
        </div>

        {/* Coordinate readout preview — design system preview only */}
        <div className="text-center">
          <span className="font-mono text-xs text-slate-400 tracking-wider">
            LAT 40.7128°N&nbsp;&nbsp;LNG 74.0060°W&nbsp;&nbsp;ALT 400,000m&nbsp;&nbsp;HDG 000°
          </span>
        </div>
      </div>
    </div>
  );
}
