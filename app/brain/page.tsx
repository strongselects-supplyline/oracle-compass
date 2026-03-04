"use client";

import { useEffect, useState } from "react";
import { getDynamicReleases } from "@/lib/releases";

function getMakeModeWeek(): number {
  const start = Date.UTC(2026, 1, 20);
  const now = Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
  const days = Math.floor((now - start) / (1000 * 60 * 60 * 24));
  return Math.min(Math.max(Math.ceil(days / 7), 1), 5);
}

function getPhasePercent(): number {
  const makeStart = Date.UTC(2026, 2, 1);
  const pushEnd = Date.UTC(2026, 3, 28);
  const now = Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
  const total = pushEnd - makeStart;
  const elapsed = Math.max(0, Math.min(now - makeStart, total));
  return Math.round((elapsed / total) * 100);
}

export default function BrainPage() {
  const [uploadedSingles, setUploadedSingles] = useState(0);
  const week = getMakeModeWeek();
  const phasePercent = getPhasePercent();

  const currentPhase =
    phasePercent < 45 ? "MAKE" :
      phasePercent < 75 ? "SHIP" : "PUSH";

  useEffect(() => {
    // Dynamic — reflects Oracle status updates
    getDynamicReleases().then(releases => {
      setUploadedSingles(releases.filter(s => s.status === "live").length);
    });
  }, []);

  return (
    <main className="page animate-fade-in">
      <div className="page-inner">

        {/* ── Mode Declaration ── */}
        <div className="mb-10">
          <h1 className="text-5xl font-black tracking-tight mb-2 leading-none">MAKE MODE</h1>
          <p className="text-[#666] text-sm leading-relaxed font-medium">
            Studio is primary. Everything else is Track 2.<br />
            Mar 1 → Apr 10
          </p>
        </div>

        {/* ── Phase Bar ── */}
        <div className="mb-12">
          <div className="waterfall-bar mb-3" style={{ height: "8px", borderRadius: "4px" }}>
            <div className="waterfall-fill bg-amber-500" style={{ width: `${phasePercent}%` }} />
          </div>
          <div className="flex justify-between text-[10px] font-black tracking-[0.15em] text-[#555] uppercase">
            <span className={currentPhase === "MAKE" ? "text-amber-400" : ""}>MAKE</span>
            <span className={currentPhase === "SHIP" ? "text-amber-400" : ""}>SHIP</span>
            <span className={currentPhase === "PUSH" ? "text-amber-400" : ""}>PUSH</span>
          </div>
          <p className="text-[10px] text-amber-500 mt-2 font-black tracking-widest uppercase text-center">
            ↑ Week {week} of 5
          </p>
        </div>

        {/* ── Exit Criteria ── */}
        <div className="card mb-14">
          <p className="text-[10px] font-black text-[#555] mb-4 uppercase tracking-widest">
            MAKE MODE closes when:
          </p>
          <ExitLine
            done={uploadedSingles >= 5}
            label={`5 singles uploaded (${uploadedSingles}/5)`}
          />
          <ExitLine done={false} label="4 album tracks recorded + mixed" />
          <ExitLine done={false} label="Apr 3" />
        </div>

        {/* ── Philosophical Anchors ── */}
        <div className="space-y-10 mb-14">
          <Anchor text="Done is the tribute." />
          <Anchor text="Every move must compound." />
          <Anchor text="The anesthesia phase is over." />
          <div>
            <Anchor text="You are the Jinchuriki." />
            <p className="text-[#555] text-base font-medium leading-relaxed mt-3 ml-1">
              Master the seal.<br />
              Channel the power.<br />
              <span className="text-[#444] mt-1 block">ALL LOVE is the output.</span>
            </p>
          </div>
        </div>

        {/* ── Mission Statement ── */}
        <div className="border-t border-[#1e1e1e] pt-8 pb-4">
          <p className="text-[10px] font-black tracking-[0.15em] text-[#333] uppercase leading-relaxed">
            Sovereign Creator. Zero Dependency.<br />
            Zero-Cost Stack. S-Tier standard.<br />
            Every move compounds relentlessly into the next.
          </p>
        </div>

      </div>
    </main>
  );
}

function Anchor({ text }: { text: string }) {
  return (
    <p className="text-2xl font-black tracking-tight leading-tight text-white">{text}</p>
  );
}

function ExitLine({ done, label }: { done: boolean; label: string }) {
  return (
    <div className="flex items-center gap-3 py-2 border-b border-[#1e1e1e] last:border-0">
      <span className={`text-base font-black flex-shrink-0 ${done ? "text-green-500" : "text-[#333]"}`}>
        {done ? "✓" : "□"}
      </span>
      <span className={`text-sm font-semibold ${done ? "text-[#555] line-through" : "text-white"}`}>
        {label}
      </span>
    </div>
  );
}
