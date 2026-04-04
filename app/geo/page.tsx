"use client";

import { useState } from "react";

export default function GeoPage() {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <main className="page animate-fade-in" style={{ padding: 0 }}>
      {/* Minimal header overlay */}
      <div
        className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-5"
        style={{
          paddingTop: "max(env(safe-area-inset-top, 12px), 12px)",
          background: "linear-gradient(180deg, rgba(8,8,8,0.95) 0%, rgba(8,8,8,0.6) 60%, transparent 100%)",
          height: "72px",
          pointerEvents: "none",
        }}
      >
        <div style={{ pointerEvents: "auto" }}>
          <p className="text-[10px] font-black tracking-[0.2em] text-[#444] uppercase">Oracle Compass</p>
          <p className="text-xs font-black tracking-tight text-white">🗺️ Geo Intelligence</p>
        </div>
        <div style={{ pointerEvents: "auto" }}>
          <span className="text-[8px] font-black tracking-widest text-[#555] uppercase bg-[#111] px-2.5 py-1 rounded-lg border border-[#222]">
            God Shinobi
          </span>
        </div>
      </div>

      {/* Loading state */}
      {!loaded && !error && (
        <div className="absolute inset-0 z-5 flex items-center justify-center" style={{ background: "#09090b" }}>
          <div className="flex flex-col items-center gap-3">
            <div className="spinner" style={{ width: 24, height: 24, borderColor: "#d4a853", borderTopColor: "transparent" }} />
            <p className="text-[10px] font-black tracking-[0.3em] text-[#444] uppercase">Loading Geo Map...</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 z-5 flex items-center justify-center" style={{ background: "#09090b" }}>
          <div className="flex flex-col items-center gap-3 text-center px-8">
            <div className="text-4xl opacity-40">🗺️</div>
            <p className="text-sm font-bold text-white">Map data unavailable</p>
            <p className="text-[10px] text-[#555]">
              The Gorilla Geo map file could not be loaded. Check that <code className="bg-[#1a1a1a] px-1.5 py-0.5 rounded text-[#888]">god-shinobi.html</code> exists in the public/geo folder.
            </p>
            <button
              onClick={() => { setError(false); setLoaded(false); }}
              className="mt-3 px-5 py-2.5 rounded-xl text-[10px] font-black tracking-widest uppercase bg-[#1a1a1a] border border-[#333] text-white hover:bg-[#222] active:scale-95 transition-all"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Map iframe */}
      <iframe
        src={`/geo/god-shinobi.html?v=${Date.now()}`}
        style={{
          width: "100%",
          height: "calc(100vh - 68px)",
          border: "none",
          backgroundColor: "#09090b",
          display: error ? "none" : "block",
        }}
        title="Gorilla Geo — God Shinobi"
        allow="clipboard-write"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
    </main>
  );
}
