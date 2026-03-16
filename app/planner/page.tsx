"use client";

// app/planner/page.tsx
// Planner — Sprint targets, track production status grid, Sunday ritual checklist.
// The weekly command center. Update Sunday, reference daily.

import { useEffect, useState, useCallback } from "react";
import {
  getTrackStatuses,
  saveTrackStatuses,
  getSprintTarget,
  saveSprintTarget,
  getSundayChecklist,
  saveSundayChecklist,
  computeTrackProgress,
  isSundayChecklistComplete,
  PHASE_ORDER,
  PHASE_LABELS,
  ALL_LOVE_TRACK_COUNT,
  type TrackProductionStatus,
  type TrackPhase,
  type SundayChecklist,
} from "@/lib/planner";
import { getWeekKey } from "@/lib/oracle";

// ── Phase selector component ────────────────────────────────────────────────

const PHASE_COLORS: Record<TrackPhase, string> = {
  not_started: "bg-[#111] text-[#444] border-[#1a1a1a]",
  track: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  mix: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  master: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  instrumental: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
  done: "bg-green-500/15 text-green-400 border-green-500/30",
};

const PHASE_DOT: Record<TrackPhase, string> = {
  not_started: "bg-[#333]",
  track: "bg-amber-400",
  mix: "bg-blue-400",
  master: "bg-purple-400",
  instrumental: "bg-cyan-400",
  done: "bg-green-400",
};

function TrackRow({
  track,
  index,
  isDivider,
  onPhaseChange,
}: {
  track: TrackProductionStatus;
  index: number;
  isDivider: boolean;
  onPhaseChange: (name: string, phase: TrackPhase) => void;
}) {
  const [open, setOpen] = useState(false);

  const handlePhase = (phase: TrackPhase) => {
    onPhaseChange(track.name, phase === track.phase ? "not_started" : phase);
    setOpen(false);
  };

  return (
    <>
      {isDivider && (
        <div className="flex items-center gap-3 my-1">
          <div className="h-px flex-1 bg-[#1a1a1a]" />
          <span className="text-[9px] font-black tracking-[0.15em] text-[#333] uppercase">—</span>
          <div className="h-px flex-1 bg-[#1a1a1a]" />
        </div>
      )}
      <div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center gap-3 py-3 px-0 active:opacity-60 transition-opacity"
        >
          <div
            className={`w-2 h-2 rounded-full flex-shrink-0 ${PHASE_DOT[track.phase]}`}
          />
          <span className="flex-1 text-left text-sm font-bold text-white truncate">
            {track.name}
          </span>
          <span
            className={`text-[10px] font-black tracking-wider px-2.5 py-1 rounded-lg border ${PHASE_COLORS[track.phase]}`}
          >
            {PHASE_LABELS[track.phase]}
          </span>
          <span className="text-[#333] text-[10px]">{open ? "▲" : "▼"}</span>
        </button>

        {open && (
          <div className="flex gap-1.5 pb-3 flex-wrap">
            {PHASE_ORDER.filter((p) => p !== "not_started").map((phase) => (
              <button
                key={phase}
                onClick={() => handlePhase(phase)}
                className={`px-3 py-2 rounded-xl text-[10px] font-black tracking-wider uppercase border transition-all active:scale-95 ${
                  track.phase === phase
                    ? PHASE_COLORS[phase]
                    : "bg-transparent text-[#444] border-[#1a1a1a]"
                }`}
              >
                {PHASE_LABELS[phase]}
              </button>
            ))}
            {track.phase !== "not_started" && (
              <button
                onClick={() => handlePhase("not_started")}
                className="px-3 py-2 rounded-xl text-[10px] font-black tracking-wider uppercase border border-red-500/20 text-red-500/60 bg-transparent active:scale-95 transition-all"
              >
                CLEAR
              </button>
            )}
          </div>
        )}
        <div className="h-px bg-[#141414]" />
      </div>
    </>
  );
}

function TogglePill({
  label,
  checked,
  onChange,
  dimmed,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  dimmed?: boolean;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border transition-all active:scale-[0.98] ${
        dimmed && !checked
          ? "border-[#1a1a1a] bg-transparent text-[#2a2a2a]"
          : checked
          ? "border-green-500/40 bg-green-500/8 text-white"
          : "border-[#222] bg-[#0d0d0d] text-[#888]"
      }`}
    >
      <span className="text-sm font-bold">{label}</span>
      <span
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
          checked ? "border-green-500 bg-green-500" : "border-[#333]"
        }`}
      >
        {checked && <span className="text-[10px] font-black text-black">✓</span>}
      </span>
    </button>
  );
}

const SPRINT_PLAN_WEEKS = [
  { wk: 1, dates: "Mar 7–13", phase: "ALL LOVE", target: "4 (2 prod, 2 in-progress)", total: 4 },
  { wk: 2, dates: "Mar 14–20", phase: "ALL LOVE", target: "7 (close remaining)", total: 11 },
  { wk: 3, dates: "Mar 22–28", phase: "DELUXE", target: "3 tracks", total: 14 },
  { wk: 4, dates: "Mar 29–Apr 4", phase: "DELUXE", target: "3 tracks", total: 17 },
  { wk: 5, dates: "Apr 5–11", phase: "DELUXE", target: "3 tracks (+ album upload)", total: 20 },
  { wk: 6, dates: "Apr 12–18", phase: "DELUXE / CREAM", target: "3 tracks", total: 23 },
  { wk: 7, dates: "Apr 19–25", phase: "CREAM", target: "3 tracks", total: 26 },
  { wk: 8, dates: "Apr 26–May 2", phase: "CREAM", target: "3 tracks", total: 29 },
  { wk: 9, dates: "May 3–9", phase: "CREAM / FREAKSHOW", target: "3 tracks", total: 32 },
  { wk: 10, dates: "May 10–16", phase: "FREAKSHOW", target: "3 tracks", total: 35 },
  { wk: 11, dates: "May 17–23", phase: "FREAKSHOW", target: "3 tracks", total: 38 },
  { wk: 12, dates: "May 24–30", phase: "FREAKSHOW", target: "3 tracks", total: 41 },
  { wk: 13, dates: "May 31–Jun 6", phase: "FREAKSHOW", target: "2 tracks", total: 43 },
  { wk: 14, dates: "Jun 7–13", phase: "BUFFER", target: "—", total: 43 },
];

function SprintPlanMatrix() {
  const [open, setOpen] = useState(false);
  return (
    <div className="card !p-0 mb-5 overflow-hidden border border-[#222]">
      <button 
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 bg-[#0d0d0d] hover:bg-[#141414] transition-colors active:scale-[0.99]"
      >
        <div className="flex flex-col items-start gap-1">
          <span className="text-[11px] font-black tracking-widest text-[#888] uppercase">14-Week Marathon Tracker</span>
          <span className="text-sm font-bold text-white">View Full Sprint Plan</span>
        </div>
        <span className="text-[#555] text-sm transform transition-transform" style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}>›</span>
      </button>
      
      {open && (
        <div className="p-4 border-t border-[#1a1a1a] bg-[#0a0a0a]">
          <div className="flex justify-between items-end mb-4 border-b border-[#1a1a1a] pb-3">
            <h4 className="text-[9px] font-black tracking-[0.2em] text-amber-500 uppercase">Pace Table</h4>
            <span className="text-[9px] font-black text-[#666]">43 TRACKS TOTAL</span>
          </div>
          
          <div className="space-y-2">
            {SPRINT_PLAN_WEEKS.map(w => (
              <div key={w.wk} className="flex flex-col border border-[#1a1a1a] rounded-lg p-3 bg-[#111]">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-black text-[#555] uppercase">
                    <span className="text-white">Wk {w.wk}</span> <span className="mx-1 opacity-40">|</span> {w.dates}
                  </span>
                  <span className="text-[9px] font-black tracking-widest text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">{w.phase}</span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-xs font-bold text-[#ccc]">{w.target}</span>
                  <span className="text-[10px] font-black text-[#666]">{w.total}/43</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] font-medium text-[#444] mt-4 text-center italic">
            Week 14 is pure buffer. Early-June finish.
          </p>
        </div>
      )}
    </div>
  );
}

// ── Main page ───────────────────────────────────────────────────────────────

export default function PlannerPage() {
  const [tracks, setTracks] = useState<TrackProductionStatus[]>([]);
  const [sprintTarget, setSprintTarget] = useState("");
  const [sprintInput, setSprintInput] = useState("");
  const [checklist, setChecklist] = useState<SundayChecklist | null>(null);
  const [weekKey, setWeekKey] = useState("");
  const [weekLabel, setWeekLabel] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const init = async () => {
      const wk = getWeekKey();
      setWeekKey(wk);

      // Derive human-readable week label (Mon of this ISO week)
      const [year, week] = wk.split("-W").map(Number);
      const jan4 = new Date(Date.UTC(year, 0, 4));
      const isoMonday = new Date(jan4);
      isoMonday.setUTCDate(jan4.getUTCDate() - ((jan4.getUTCDay() + 6) % 7) + (week - 1) * 7);
      setWeekLabel(
        isoMonday.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          timeZone: "UTC",
        })
      );

      const [t, s, c] = await Promise.all([
        getTrackStatuses(),
        getSprintTarget(wk),
        getSundayChecklist(wk),
      ]);
      setTracks(t);
      setSprintTarget(s.target);
      setSprintInput(s.target);
      setChecklist(c);
      setLoaded(true);
    };
    init();
  }, []);

  const handlePhaseChange = useCallback(
    async (name: string, phase: TrackPhase) => {
      const updated = tracks.map((t) => (t.name === name ? { ...t, phase } : t));
      setTracks(updated);
      await saveTrackStatuses(updated);
    },
    [tracks]
  );

  const saveSprint = useCallback(async () => {
    setSprintTarget(sprintInput);
    await saveSprintTarget(sprintInput, weekKey);
  }, [sprintInput, weekKey]);

  const updateChecklist = useCallback(
    async (patch: Partial<SundayChecklist>) => {
      if (!checklist) return;
      const updated = { ...checklist, ...patch };
      setChecklist(updated);
      await saveSundayChecklist(updated);
    },
    [checklist]
  );

  if (!loaded || !checklist) return null;

  const progress = computeTrackProgress(tracks);
  const donePercent = progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0;
  const isSunday = new Date().getDay() === 0;
  const checklistDone = isSundayChecklistComplete(checklist);

  return (
    <main className="page animate-fade-in pb-28">
      <div className="page-inner">

        {/* HEADER */}
        <header className="mb-8 text-center">
          <p className="text-[10px] font-black tracking-[0.2em] text-amber-500 uppercase mb-1">
            📋 Planner
          </p>
          <p className="text-xs text-[#555] font-medium">week of {weekLabel}</p>
        </header>

        {/* SPRINT TARGET */}
        <section className="mb-5">
          <p className="text-[9px] font-black tracking-[0.2em] text-[#444] uppercase mb-2 px-1">
            This Week's Sprint Target
          </p>
          <div className="card !py-3 !px-4">
            <input
              type="text"
              className="w-full bg-transparent text-sm font-bold text-white outline-none placeholder-[#333]"
              value={sprintInput}
              onChange={(e) => setSprintInput(e.target.value)}
              onBlur={saveSprint}
              onKeyDown={(e) => e.key === "Enter" && saveSprint()}
              placeholder="e.g. finish ESL mix + Sweet Frustration vocal tracking..."
            />
          </div>
          {sprintTarget && (
            <p className="text-[10px] text-[#444] px-2 mt-1.5 italic">
              → {sprintTarget}
            </p>
          )}
        </section>

        {/* TRACK PRODUCTION STATUS */}
        <section className="mb-5">
          <div className="flex items-center justify-between mb-2 px-1">
            <p className="text-[9px] font-black tracking-[0.2em] text-[#444] uppercase">
              Track Progress
            </p>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-[#555]">
                {progress.done}/{progress.total} done
              </span>
              <span className="text-[10px] font-black text-amber-500/70">
                {progress.inProgress} in progress
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="waterfall-bar mb-3">
            <div
              className="waterfall-fill"
              style={{
                width: `${donePercent}%`,
                background:
                  donePercent === 100
                    ? "var(--green)"
                    : donePercent > 50
                    ? "var(--amber)"
                    : "var(--accent)",
              }}
            />
          </div>

          <div className="card !px-4 !py-2">
            {/* DELUXE label */}
            <div className="flex items-center gap-3 py-2">
              <div className="h-px flex-1 bg-[#1a1a1a]" />
              <span className="text-[9px] font-black tracking-[0.15em] text-[#333] uppercase">
                ALL LOVE
              </span>
              <div className="h-px flex-1 bg-[#1a1a1a]" />
            </div>

            {tracks.map((track, idx) => (
              <TrackRow
                key={track.name}
                track={track}
                index={idx}
                isDivider={false}
                onPhaseChange={handlePhaseChange}
              />
            ))}
          </div>
        </section>

        {/* SPRINT PLAN MATRIX */}
        <SprintPlanMatrix />

        {/* SUNDAY RITUAL */}
        <section className="mb-5">
          <div className="flex items-center justify-between mb-2 px-1">
            <p className="text-[9px] font-black tracking-[0.2em] text-[#444] uppercase">
              Sunday Ritual
            </p>
            {checklistDone && (
              <span className="text-[10px] font-black text-green-400">LOADED ✓</span>
            )}
            {!checklistDone && isSunday && (
              <span className="text-[10px] font-black text-amber-500">TODAY</span>
            )}
          </div>
          <div className="space-y-2">
            <TogglePill
              label="Sprint Plan reviewed"
              checked={checklist.sprintReviewed}
              onChange={(v) => updateChecklist({ sprintReviewed: v })}
              dimmed={!isSunday}
            />
            <TogglePill
              label="Track statuses updated"
              checked={checklist.tracksUpdated}
              onChange={(v) => updateChecklist({ tracksUpdated: v })}
              dimmed={!isSunday}
            />
            <TogglePill
              label="Batch prep set"
              checked={checklist.batchPrepSet}
              onChange={(v) => updateChecklist({ batchPrepSet: v })}
              dimmed={!isSunday}
            />
            <TogglePill
              label="Week loaded into Oracle"
              checked={checklist.weekLoadedIntoOracle}
              onChange={(v) => updateChecklist({ weekLoadedIntoOracle: v })}
              dimmed={!isSunday}
            />
          </div>
          {!isSunday && (
            <p className="text-[10px] text-[#333] text-center mt-3 italic">
              Activate on Sundays — this is your weekly load ritual.
            </p>
          )}
        </section>

        {/* PHASE LEGEND */}
        <section className="mb-4">
          <p className="text-[9px] font-black tracking-[0.2em] text-[#444] uppercase mb-2 px-1">
            Phase Key
          </p>
          <div className="card !p-3">
            <div className="grid grid-cols-3 gap-2">
              {PHASE_ORDER.filter((p) => p !== "not_started").map((phase) => (
                <div key={phase} className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${PHASE_DOT[phase]}`} />
                  <span className="text-[10px] font-black text-[#555]">
                    {PHASE_LABELS[phase]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
