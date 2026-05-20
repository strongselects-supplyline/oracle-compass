"use client";

// components/SovereigntyDashboard.tsx
// Extracted from app/brain/page.tsx (May 12, 2026 — ADHD/UX audit)
// Canonical home for sovereignty tracking: useSovereignty hook,
// SovereigntyDashboard (tabs: Clock, Benchmarks, Journal, Data),
// and SovereignTrajectory (rank progress table).
//
// Renders on Body (/grind) — not Brain. Brain gets a single link card.

import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";

const DataCenterModal = dynamic(() => import("@/components/DataCenterModal"), { ssr: false });
import {
  RANKS, type SovereigntyState, type WeeklyData,
  loadSovereigntyState, saveSovereigntyState,
  getSobrietyDays, getNextRank, getChecksForRank, getDaysToRank, canPromote,
} from "@/lib/sovereignty";

// ── Hook ──────────────────────────────────────────────────────────────

export function useSovereignty() {
  const [state, setState] = useState<SovereigntyState | null>(null);

  useEffect(() => {
    loadSovereigntyState().then(setState);
  }, []);

  const save = useCallback(async (next: SovereigntyState) => {
    setState(next);
    await saveSovereigntyState(next);
  }, []);

  return { state, save };
}

// ── Sovereign Trajectory ─────────────────────────────────────────────

export function SovereignTrajectory() {
  const { state } = useSovereignty();
  const currentIdx = state?.currentRankIndex ?? 0;

  return (
    <div className="card mb-10">
      <p className="text-[10px] font-black tracking-[0.18em] uppercase mb-4" style={{ color: "var(--text-muted)" }}>The Sovereign Trajectory</p>
      <p className="text-[10px] font-medium mb-4" style={{ color: "var(--text-secondary)" }}>
        You are not just running a sprint. You are building the architecture the next generation of independent artists will study.
      </p>
      {RANKS.map((rank, i) => {
        const status = i < currentIdx ? "earned" : i === currentIdx ? "current" : "locked";
        return (
          <div
            key={rank.id}
            className={`flex items-start gap-3 py-3 border-b last:border-0 ${status === "current" ? "border-l-2 pl-3 -ml-3" : ""}`}
            style={{ borderColor: "var(--border)", borderLeftColor: status === "current" ? rank.color : undefined }}
          >
            <div className="flex-shrink-0 w-20">
              <div style={{ color: rank.color }} className="text-[9px] font-black tracking-wider uppercase">{rank.tier}</div>
              <div className="text-[9px] mt-0.5" style={{ color: "var(--text-muted)" }}>{rank.label}</div>
              {status === "current" && <div className="text-[8px] font-black mt-1" style={{ color: rank.color }}>● NOW</div>}
              {status === "earned" && <div className="text-[8px] font-black mt-1" style={{ color: "#10b981" }}>✓ EARNED</div>}
            </div>
            <p className="text-[10px] leading-relaxed flex-1" style={{ color: "var(--text-secondary)" }}>{rank.desc}</p>
          </div>
        );
      })}
    </div>
  );
}

// ── Sovereignty Dashboard ─────────────────────────────────────────────

export function SovereigntyDashboard() {
  const { state, save } = useSovereignty();
  const [griefEntry, setGriefEntry] = useState("");
  const [weeklyData, setWeeklyData] = useState<WeeklyData>({ spotify: "", saves: "", doordash: "", geo: "" });
  const [activeTab, setActiveTab] = useState<"sobriety" | "benchmarks" | "grief" | "data">("sobriety");
  const [saved, setSaved] = useState(false);
  const [dataCenterOpen, setDataCenterOpen] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);

  if (!state) return (
    <div className="card mb-10" style={{ borderColor: "var(--border)" }}>
      <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>Loading sovereignty state...</p>
    </div>
  );

  const currentRank = RANKS[state.currentRankIndex];
  const nextRank = getNextRank(state);
  const sobrietyDays = getSobrietyDays(state.sobrietyStart);
  const sobrietyTarget = nextRank?.sobrietyDay ?? 60;
  const sobrietyPct = Math.min(100, Math.round((sobrietyDays / sobrietyTarget) * 100));
  const checks = nextRank ? getChecksForRank(state, nextRank.id) : [];
  const checkedCount = checks.filter(Boolean).length;
  const totalBenchmarks = nextRank?.benchmarks.length ?? 0;
  const daysToNext = nextRank ? getDaysToRank(nextRank) : 0;
  const promotionReady = canPromote(state);

  const flashSaved = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const toggleCheck = async (i: number) => {
    if (!nextRank) return;
    const current = getChecksForRank(state, nextRank.id);
    current[i] = !current[i];
    const next = { ...state, benchmarkChecks: { ...state.benchmarkChecks, [nextRank.id]: current } };
    await save(next);
  };

  const resetSobriety = async () => {
    const reset = {
      ...state,
      sobrietyStart: new Date().toISOString().split("T")[0],
      sobrietyResets: [...state.sobrietyResets, { date: new Date().toISOString(), previousDay: sobrietyDays }],
    };
    await save(reset);
    setResetConfirm(false);
  };

  const promote = async () => {
    if (!nextRank || !promotionReady) return;
    const next = {
      ...state,
      currentRankIndex: state.currentRankIndex + 1,
      promotionLog: [...state.promotionLog, { rankId: nextRank.id, date: new Date().toISOString(), note: `Promoted to ${nextRank.tier}` }],
    };
    await save(next);
  };

  const submitGrief = async () => {
    if (!griefEntry.trim()) return;
    const entry = { date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), text: griefEntry.trim() };
    await save({ ...state, griefLog: [entry, ...state.griefLog].slice(0, 50) });
    setGriefEntry("");
    flashSaved();
  };

  const submitData = async () => {
    if (!weeklyData.spotify && !weeklyData.doordash) return;
    const entry = { date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }), data: { ...weeklyData } };
    await save({ ...state, weeklyDataLog: [entry, ...state.weeklyDataLog].slice(0, 24) });
    setWeeklyData({ spotify: "", saves: "", doordash: "", geo: "" });
    flashSaved();
  };

  const tabs = [
    { id: "sobriety" as const, label: "⏱ Clock" },
    { id: "benchmarks" as const, label: `🎯 ${nextRank?.tier ?? "DONE"}` },
    { id: "grief" as const, label: "📓 Journal" },
    { id: "data" as const, label: "📊 Data" },
  ];

  return (
    <>
    <div className="card mb-10" style={{ borderColor: "var(--border)" }}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] font-black tracking-[0.18em] uppercase" style={{ color: "var(--accent)" }}>⚔️ Sovereignty Dashboard</p>
        <span className="text-[9px] font-black tracking-wider uppercase px-2 py-1 rounded-md" style={{ background: currentRank.color, color: "#0a0a0a" }}>{currentRank.tier}</span>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1 mb-4 border-b" style={{ borderColor: "var(--border)" }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className="pb-2 px-2 text-[10px] font-black tracking-wider uppercase transition-all"
            style={{
              color: activeTab === t.id ? "var(--accent)" : "var(--text-muted)",
              borderBottom: activeTab === t.id ? "2px solid var(--accent)" : "2px solid transparent",
              marginBottom: "-1px",
            }}
          >{t.label}</button>
        ))}
      </div>

      {/* ── SOBRIETY TAB ── */}
      {activeTab === "sobriety" && (
        <div>
          <div className="text-center mb-4">
            <div className="text-6xl font-black mb-1" style={{ color: sobrietyDays >= sobrietyTarget ? "#10b981" : "var(--accent)" }}>{sobrietyDays}</div>
            <div className="text-[11px] font-black tracking-widest uppercase" style={{ color: "var(--text-muted)" }}>
              Days Clean · Since {new Date(state.sobrietyStart + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </div>
          </div>
          <div className="mb-3">
            <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--surface-2)" }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${sobrietyPct}%`, background: sobrietyDays >= sobrietyTarget ? "#10b981" : "#d97706" }} />
            </div>
            <div className="flex justify-between mt-1 text-[9px]" style={{ color: "var(--text-muted)" }}>
              <span>Day 0</span>
              <span className="font-black" style={{ color: "var(--accent)" }}>Day {sobrietyTarget} = {nextRank?.tier ?? "COMPLETE"}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <div className="p-3 rounded-xl text-center" style={{ background: "var(--surface-2)" }}>
              <div className="text-lg font-black" style={{ color: "var(--text-primary)" }}>{daysToNext}</div>
              <div className="text-[9px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Days to {nextRank?.tier ?? "—"}</div>
            </div>
            <div className="p-3 rounded-xl text-center" style={{ background: "var(--surface-2)" }}>
              <div className="text-lg font-black" style={{ color: checkedCount >= totalBenchmarks && totalBenchmarks > 0 ? "#10b981" : "var(--accent)" }}>{checkedCount}/{totalBenchmarks}</div>
              <div className="text-[9px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Benchmarks</div>
            </div>
          </div>
          {sobrietyDays >= sobrietyTarget && (
            <div className="mt-4 p-3 rounded-xl text-center" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid #10b981" }}>
              <p className="text-[11px] font-black" style={{ color: "#10b981" }}>🟢 SOBRIETY GATE: PASSED — DAY {sobrietyTarget}</p>
            </div>
          )}
          {!resetConfirm ? (
            <button onClick={() => setResetConfirm(true)} className="mt-4 w-full py-2 rounded-xl text-[10px] font-black tracking-wider uppercase transition-all active:scale-[0.98]" style={{ background: "transparent", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444" }}>
              Reset Sobriety Clock
            </button>
          ) : (
            <div className="mt-4 p-3 rounded-xl" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)" }}>
              <p className="text-[11px] font-black mb-2" style={{ color: "#ef4444" }}>⚠ CLOCK RESET — THIS IS PERMANENT</p>
              <p className="text-[10px] mb-3" style={{ color: "var(--text-secondary)" }}>
                Day count resets to 0. Previous count ({sobrietyDays} days) will be logged. No grace period. The system depends on honesty.
              </p>
              <div className="flex gap-2">
                <button onClick={resetSobriety} className="flex-1 py-2 rounded-xl text-[10px] font-black uppercase" style={{ background: "#ef4444", color: "white" }}>Confirm Reset</button>
                <button onClick={() => setResetConfirm(false)} className="flex-1 py-2 rounded-xl text-[10px] font-black uppercase" style={{ background: "var(--surface-2)", color: "var(--text-primary)" }}>Cancel</button>
              </div>
            </div>
          )}
          {state.sobrietyResets.length > 0 && (
            <div className="mt-3">
              <p className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: "var(--text-muted)" }}>Reset History</p>
              {state.sobrietyResets.map((r, i) => (
                <p key={i} className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                  {new Date(r.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} — Day {r.previousDay} reset
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── BENCHMARKS TAB ── */}
      {activeTab === "benchmarks" && nextRank && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>{currentRank.tier} → {nextRank.tier} · {daysToNext} days</span>
            <span className="text-[10px] font-black" style={{ color: checkedCount === totalBenchmarks ? "#10b981" : "var(--accent)" }}>{checkedCount}/{totalBenchmarks}</span>
          </div>
          <div className="space-y-2">
            {nextRank.benchmarks.map((b, i) => (
              <button key={i} onClick={() => toggleCheck(i)}
                className="w-full flex items-start gap-3 p-2 rounded-lg text-left transition-all active:scale-[0.98]"
                style={{ background: checks[i] ? "rgba(16,185,129,0.08)" : "var(--surface-2)" }}>
                <span className="flex-shrink-0 mt-0.5 text-sm font-black" style={{ color: checks[i] ? "#10b981" : "var(--text-muted)" }}>{checks[i] ? "✓" : "□"}</span>
                <span className="text-[11px] font-medium leading-snug" style={{ color: checks[i] ? "var(--text-muted)" : "var(--text-primary)", textDecoration: checks[i] ? "line-through" : "none" }}>{b}</span>
              </button>
            ))}
          </div>
          {promotionReady && (
            <button onClick={promote}
              className="mt-4 w-full py-3 rounded-xl text-[11px] font-black tracking-wider uppercase transition-all active:scale-[0.98]"
              style={{ background: "#10b981", color: "#0a0a0a" }}>
              ⚡ PROMOTE TO {nextRank.tier} — ALL BENCHMARKS MET
            </button>
          )}
        </div>
      )}
      {activeTab === "benchmarks" && !nextRank && (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">👑</div>
          <p className="text-[12px] font-black" style={{ color: "var(--accent)" }}>GOD OF SHINOBI — FINAL RANK ACHIEVED</p>
          <p className="text-[10px] mt-2" style={{ color: "var(--text-muted)" }}>You don&apos;t operate in the ecosystem. You build it.</p>
        </div>
      )}

      {/* ── GRIEF JOURNAL TAB ── */}
      {activeTab === "grief" && (
        <div>
          <p className="text-[10px] font-medium mb-3" style={{ color: "var(--text-muted)" }}>
            Grief protocol — {state.griefLog.length} entries logged. Required: weekly from Apr 27.
          </p>
          <textarea
            value={griefEntry}
            onChange={e => setGriefEntry(e.target.value)}
            placeholder="What surfaced this week? What are you carrying? What needs to move?"
            className="w-full text-[12px] p-3 rounded-xl border resize-none outline-none leading-relaxed"
            style={{ background: "var(--surface-2)", borderColor: "var(--border)", color: "var(--text-primary)", minHeight: "100px" }}
          />
          <button onClick={submitGrief} className="mt-2 w-full py-2.5 rounded-xl text-[11px] font-black tracking-wider uppercase transition-all active:scale-[0.98]" style={{ background: "var(--accent)", color: "#0a0a0a" }}>
            {saved ? "✓ LOGGED" : "LOG ENTRY"}
          </button>
          {state.griefLog.length > 0 && (
            <div className="mt-4 space-y-3">
              <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Entries ({state.griefLog.length})</p>
              {state.griefLog.slice(0, 5).map((e, i) => (
                <div key={i} className="p-3 rounded-xl" style={{ background: "var(--surface-2)" }}>
                  <p className="text-[9px] font-black mb-1" style={{ color: "var(--accent)" }}>{e.date}</p>
                  <p className="text-[11px] leading-snug" style={{ color: "var(--text-secondary)" }}>{e.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── DATA TAB — Data Center Portal ── */}
      {activeTab === "data" && (
        <div>
          <p className="text-[10px] font-medium mb-4" style={{ color: "var(--text-muted)" }}>
            One entry point. Zero drift. All data lives here.
          </p>

          {/* LAUNCH button */}
          <button
            onClick={() => setDataCenterOpen(true)}
            className="w-full py-4 rounded-2xl font-black tracking-[0.2em] uppercase text-[12px] transition-all active:scale-[0.98] mb-5"
            style={{
              background: "linear-gradient(135deg, rgba(212,168,83,0.12) 0%, rgba(212,168,83,0.06) 100%)",
              border: "1px solid rgba(212,168,83,0.35)",
              color: "#d4a853",
              boxShadow: "0 0 24px rgba(212,168,83,0.08)",
            }}
          >
            ⚡ LAUNCH DATA CENTER
          </button>

          {/* Last logged snapshot */}
          {state.weeklyDataLog.length > 0 && (
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>Last Pull</p>
              <div className="p-3 rounded-xl" style={{ background: "var(--surface-2)" }}>
                <p className="text-[9px] font-black mb-1" style={{ color: "var(--accent)" }}>{state.weeklyDataLog[0].date}</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
                  {state.weeklyDataLog[0].data.spotify && <p className="text-[10px]" style={{ color: "var(--text-secondary)" }}>Followers: <span style={{ color: "var(--text-primary)" }}>{state.weeklyDataLog[0].data.spotify}</span></p>}
                  {state.weeklyDataLog[0].data.saves && <p className="text-[10px]" style={{ color: "var(--text-secondary)" }}>Save Rate: <span style={{ color: "var(--text-primary)" }}>{state.weeklyDataLog[0].data.saves}</span></p>}
                  {state.weeklyDataLog[0].data.doordash && <p className="text-[10px]" style={{ color: "var(--text-secondary)" }}>DoorDash: <span style={{ color: "var(--text-primary)" }}>{state.weeklyDataLog[0].data.doordash}</span></p>}
                  {state.weeklyDataLog[0].data.geo && <p className="text-[10px]" style={{ color: "var(--text-secondary)" }}>Geo Hits: <span style={{ color: "var(--text-primary)" }}>{state.weeklyDataLog[0].data.geo}</span></p>}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>

    {/* ── Data Center Modal ── */}
    {dataCenterOpen && <DataCenterModal onClose={() => setDataCenterOpen(false)} />}
    </>
  );
}
