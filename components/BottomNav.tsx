"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getKillStats } from "@/lib/killList";
import { useTheme } from "@/components/ThemeProvider";

// War Room grid items — reference only, no notification dots
const WAR_ROOM_ITEMS = [
  { name: "Studio",    path: "/studio",    icon: "🎤", desc: "Waterfall · Cycles · Sessions" },
  { name: "Velocity",  path: "/velocity",  icon: "📈", desc: "Streaming momentum" },
  { name: "Sonic",     path: "/sonic",     icon: "🎧", desc: "Identity data" },
  { name: "Label",     path: "/label",     icon: "🏷️", desc: "Release ops" },
  { name: "Planner",   path: "/planner",   icon: "📋", desc: "Marathon · Lanes · Mirror" },
  { name: "Engine",    path: "/engine",    icon: "⚙️", desc: "Biz touches · Content" },
  { name: "Grind",     path: "/grind",     icon: "💪", desc: "Recovery · Conditioning" },
  { name: "Brain",     path: "/brain",     icon: "🧠", desc: "Scrolls · Sovereignty" },
  { name: "Geo",       path: "/geo",       icon: "🗺️", desc: "Gorilla Geo map" },
  { name: "Analytics", path: "/analytics", icon: "📊", desc: "S4A monthly intake" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const [showWarRoom, setShowWarRoom] = useState(false);
  const [killRed, setKillRed] = useState(false);
  const [killCount, setKillCount] = useState(0);
  const { mode, resolved, cycle: cycleTheme } = useTheme();

  useEffect(() => {
    getKillStats().then(s => {
      setKillRed(s.redRemaining > 0);
      setKillCount(s.total - s.cleared);
    });

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowWarRoom(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Which nav group is "active" — War Room pages count as War Room active
  const isWarRoomPage = WAR_ROOM_ITEMS.some(n => pathname === n.path || (n.name === "Studio" && pathname === "/sonic"));
  const isToday = pathname === "/";
  const isExecute = pathname === "/kill";

  return (
    <>
      {/* War Room overlay */}
      {showWarRoom && (
        <>
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            onClick={() => setShowWarRoom(false)}
          />
          <div
            className="fixed bottom-[calc(4rem+env(safe-area-inset-bottom))] left-0 right-0 z-50 mx-auto max-w-lg px-4"
            style={{ animation: "warRoomSlideUp 0.2s ease both" }}
          >
            <div
              className="rounded-2xl overflow-hidden"
              style={{ background: "rgba(10,10,10,0.98)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                <p className="text-[9px] font-black tracking-[0.25em] uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>
                  WAR ROOM — REFERENCE ONLY
                </p>
                <button
                  onClick={(e) => { e.stopPropagation(); cycleTheme(); }}
                  className="text-[9px] font-black tracking-widest text-[#444] uppercase"
                >
                  {mode === "auto" ? "AUTO" : mode === "light" ? "LIGHT" : "DARK"} {resolved === "light" ? "☀️" : "🌙"}
                </button>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-3 gap-px bg-white/5">
                {WAR_ROOM_ITEMS.map(item => {
                  const active = pathname === item.path || (item.name === "Studio" && pathname === "/sonic");
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      onClick={() => setShowWarRoom(false)}
                      className={`flex flex-col items-center gap-1.5 py-4 px-2 transition-all active:scale-95 ${
                        active ? "bg-white/8" : "bg-[#0a0a0a] hover:bg-white/[0.04]"
                      }`}
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <span
                        className="text-[10px] font-black tracking-wider uppercase"
                        style={{ color: active ? "white" : "rgba(255,255,255,0.5)" }}
                      >
                        {item.name}
                      </span>
                      <span className="text-[8px] text-center leading-tight" style={{ color: "rgba(255,255,255,0.2)" }}>
                        {item.desc}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Bottom Nav — 3 items */}
      <nav className="bottom-nav">
        <style>{`
          @keyframes warRoomSlideUp {
            from { opacity: 0; transform: translateY(12px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        {/* TODAY */}
        <Link href="/" className={`nav-item ${isToday ? "active" : ""}`} style={{ flex: 1 }}>
          <div className="text-2xl">🏠</div>
          <span>TODAY</span>
        </Link>

        {/* EXECUTE */}
        <Link href="/kill" className={`nav-item ${isExecute ? "active" : ""}`} style={{ flex: 1 }}>
          <div className="text-2xl relative">
            🎯
            {killRed && (
              <span
                className="absolute -top-1 -right-2 w-2.5 h-2.5 bg-red-500 rounded-full border"
                style={{ borderColor: "var(--nav-border-dark)" }}
              />
            )}
            {!killRed && killCount > 0 && (
              <span
                className="absolute -top-1 -right-2 w-2.5 h-2.5 bg-amber-500 rounded-full border"
                style={{ borderColor: "var(--nav-border-dark)" }}
              />
            )}
          </div>
          <span>EXECUTE</span>
        </Link>

        {/* WAR ROOM */}
        <button
          onClick={() => setShowWarRoom(!showWarRoom)}
          className={`nav-item ${isWarRoomPage || showWarRoom ? "active" : ""} ${showWarRoom ? "opacity-50" : ""}`}
          style={{ flex: 1, border: "none", background: "none" }}
          aria-label="War Room"
        >
          <div className="text-2xl">{showWarRoom ? "✕" : "⚔️"}</div>
          <span>WAR ROOM</span>
        </button>
      </nav>
    </>
  );
}
