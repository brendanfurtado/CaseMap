import GlobeContainer from "@/components/globe/GlobeContainer";

export default function Home() {
  return (
    <main className="relative w-screen h-screen overflow-hidden bg-slate-950">
      {/* Full-screen 3D globe */}
      <GlobeContainer />

      {/* Top-left branding overlay */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none">
        <div className="hud-panel px-3 py-2">
          <span className="text-sm font-bold text-slate-900 tracking-tight">
            CaseMap<span className="text-slate-400">.live</span>
          </span>
        </div>
      </div>

      {/* Top-right phase badge — remove in Phase 4 when search bar exists */}
      <div className="absolute top-4 right-4 z-20 pointer-events-none">
        <div className="hud-panel px-3 py-1.5">
          <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest">
            Phase 1 · 3D Globe
          </span>
        </div>
      </div>
    </main>
  );
}
