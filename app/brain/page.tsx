"use client";

import { useEffect, useState } from "react";
import { getDynamicReleases } from "@/lib/releases";
import { getMakeModeWeek } from "@/lib/oracle";
import { PROJECTS } from "@/lib/studioData";


function getPhasePercent(): number {
  const makeStart = Date.UTC(2026, 2, 1);
  const pushEnd = Date.UTC(2026, 3, 24);
  const now = Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
  const total = pushEnd - makeStart;
  const elapsed = Math.max(0, Math.min(now - makeStart, total));
  return Math.round((elapsed / total) * 100);
}

export default function BrainPage() {
  const [uploadedSingles, setUploadedSingles] = useState(0);
  const [albumTracksReady, setAlbumTracksReady] = useState(0);
  const week = getMakeModeWeek();
  const phasePercent = getPhasePercent();
  const apr3Done = Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) >= Date.UTC(2026, 2, 3);

  const currentPhase =
    phasePercent < 45 ? "MAKE" :
      phasePercent < 75 ? "SHIP" : "PUSH";

  useEffect(() => {
    // Dynamic — reflects Oracle status updates
    getDynamicReleases().then(releases => {
      setUploadedSingles(releases.filter(s => s.status === "live").length);
    });
    // Count ALL LOVE album tracks that are mixed or mastered
    const allLove = PROJECTS.find(p => p.id === "all-love");
    if (allLove) {
      const ready = allLove.tracks.filter(t => ["mastered", "on_album", "album_live"].includes(t.status)).length;
      setAlbumTracksReady(ready);
    }
  }, []);

  return (
    <main className="page animate-fade-in">
      <div className="page-inner">

        {/* ── Mode Declaration ── */}
        <div className="mb-10">
          <h1 className="text-5xl font-black tracking-tight mb-2 leading-none">MAKE MODE</h1>
          <p className="text-[var(--text-secondary)] text-sm leading-relaxed font-medium">
            Studio is primary. Everything else is Track 2.<br />
            Mar 1 → Apr 24
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
            done={uploadedSingles >= 4}
            label={`4 singles uploaded (${uploadedSingles}/4)`}
          />
          <ExitLine done={albumTracksReady >= 4} label={`4 EP tracks uploaded (${albumTracksReady}/4)`} />
          <ExitLine done={apr3Done} label={`Apr 3 — pre-release milestone`} />
        </div>

        {/* ── Philosophical Anchors ── */}
        <div className="space-y-8 mb-12">
          <Anchor text="Done is the tribute." />
          <Anchor text="Every move must compound." />
          <Anchor text="The anesthesia phase is over." />
          <div>
            <Anchor text="You are the Jinchuriki." />
            <p className="text-[#888] text-base font-medium leading-relaxed mt-3 ml-1">
              Master the seal.<br />
              Channel the power.<br />
              <span className="text-[#666] mt-1 block">ALL LOVE is the output.</span>
            </p>
          </div>
          <div>
            <Anchor text="The mind is an organ. Not an identity." />
            <p className="text-[#888] text-sm font-medium leading-relaxed mt-3 ml-1">
              Observe it. Don&apos;t become it.<br />
              <span className="text-[11px] text-[#555] italic">When stuck: &ldquo;What is my mind doing right now?&rdquo;</span>
            </p>
          </div>
          <div>
            <Anchor text="Design for the worst case. Be surprised by the rest." />
            <p className="text-[#888] text-sm font-medium leading-relaxed mt-3 ml-1">
              Strategy based on 90% chance of success is a fragile strategy.<br />
              <span className="text-[11px] text-[#555] italic">Worst-case first. Then act.</span>
            </p>
          </div>
        </div>

        {/* ── NSDR Recovery Protocol ── */}
        <div className="card mb-10">
          <p className="text-[10px] font-black tracking-[0.18em] text-[#555] uppercase mb-4">Recovery Protocol</p>
          <div className="space-y-0">
            {[
              { step: "Morning: Delay first meal", note: "IF window = repair state" },
              { step: "10-20min NSDR / Yoga Nidra", note: "After depleted sessions — replenishes dopamine faster than caffeine" },
              { step: "Observer mode interrupt", note: "\"What is my mind doing?\" — not \"Why am I like this?\"" },
              { step: "Creatine 5g daily", note: "20-25g when sleep-deprived (cognitive rescue protocol)" },
              { step: "No social media during reset window", note: "Retriggers the drain. Open after, not during." },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 py-2.5 border-b border-[#1a1a1a] last:border-0">
                <span className="text-amber-500 font-black text-[10px] flex-shrink-0 mt-0.5">{i + 1}</span>
                <div>
                  <div className="text-xs font-bold text-white">{item.step}</div>
                  <div className="text-[10px] text-[#444] mt-0.5">{item.note}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Mission Statement ── */}
        <div className="border-t border-[#1e1e1e] pt-8 pb-4">
          <p className="text-[10px] font-black tracking-[0.15em] text-[#666] uppercase leading-relaxed">
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
