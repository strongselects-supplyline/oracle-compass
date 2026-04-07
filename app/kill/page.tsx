"use client";

// app/kill/page.tsx
// Dynamic Kill List — grouped by release with collapsible accordions.
// Every task is derived from live system state. Nothing is hardcoded.
// Tapping a task mutates the underlying data and the list re-derives.
// When all RED items clear, the Oracle auto-recalibrates.
//
// Apr 7, 2026: Added Daily Focus anchor + Needle/Infrastructure split.
// Dr. K insight: urgency ≠ importance. The page should answer "what's the one thing?"
// first, then show everything else collapsed.

import { useState, useEffect, useCallback, useRef } from "react";
import { getDailyTelemetry, saveDailyTelemetry, DailyTelemetry, getStoreValue, setStoreValue, getTodayISO } from "@/lib/db";
import { deriveKillList, completeTask, getKillStats, KillTask } from "@/lib/killList";
import { recalibrateOracle } from "@/lib/recalibrate";
import { getTrackHoursSummaries, TrackHoursSummary } from "@/lib/studioLog";

const URGENCY_STYLES: Record<string, { color: string; bg: string; border: string }> = {
  RED:   { color: "#FF2D2D", bg: "rgba(255,45,45,0.06)",   border: "rgba(255,45,45,0.2)" },
  AMBER: { color: "#FFB800", bg: "rgba(255,184,0,0.05)",   border: "rgba(255,184,0,0.18)" },
  GREEN: { color: "#22c55e", bg: "rgba(34,197,94,0.04)",   border: "rgba(34,197,94,0.15)" },
};

const PILLAR_LABELS: Record<string, string> = {
  creative: "CREATIVE", business: "BUSINESS", body: "BODY", ops: "OPS",
};

// ── Needle vs Infrastructure classification ─────────────────────────
// Needles = tasks that compound. The record, the releases, the performance, the outreach.
// Infrastructure = one-time setup, socials, tools. Important but not the main stage.

const NEEDLE_PREFIXES = [
  // Creative core — the record
  "telemetry-", "session-", "content-sprint-", "instrumental-",
  // Release pipeline — the drops
  "esl-pitch-", "414-",
  // Outreach engine — the growth lever
  "ig-community-sprint", "biz-move", "biz-touches",
  // Revenue — keeps the lights on
  "dd-",
  // Oracle flags — system-level priority
  "flag-",
];

const INFRASTRUCTURE_PREFIXES = [
  // Social audit items
  "social-", "fan-",
  // Body/fuel — important but not "the work"
  "fuel-", "dayone-", "grind-", "mudra-",
  // Maintenance
  "ss-menu-",
];

function isNeedle(task: KillTask): boolean {
  // Explicit override from derivation engine
  if (task.needle === true) return true;
  if (task.needle === false) return false;
  // Pattern-match by ID prefix
  return NEEDLE_PREFIXES.some(p => task.id.startsWith(p));
}

// ── Extract release name from task title (format: "Task — Track Name") ──
function getGroupKey(task: KillTask): string {
  // Oracle flags and non-release tasks always go under "Today"
  if (task.id.startsWith("flag-") || task.id.startsWith("fuel-") ||
      task.id.startsWith("grind-") || task.id.startsWith("session-") ||
      task.id.startsWith("biz-") || task.id.startsWith("fan-") ||
      task.id.startsWith("social-") || task.id.startsWith("ig-")) {
    return "Today";
  }
  // 414 Day prep tasks group together
  if (task.id.startsWith("414-")) {
    return "414 Day";
  }
  // Instrumentals group under their track name
  if (task.id.startsWith("instrumental-")) {
    return "Instrumentals";
  }
  const match = task.title.match(/\s—\s(.+)$/);
  if (match) return match[1];
  return "Today";
}

function getGroupUrgency(tasks: KillTask[]): "RED" | "AMBER" | "GREEN" {
  if (tasks.some(t => t.urgency === "RED")) return "RED";
  if (tasks.some(t => t.urgency === "AMBER")) return "AMBER";
  return "GREEN";
}

// ── Task Row (expandable how-to + separate complete button) ──────────

function TaskRow({
  task,
  onComplete,
}: {
  task: KillTask;
  onComplete: (task: KillTask) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [clearing, setClearing] = useState(false);
  const style = URGENCY_STYLES[task.urgency];

  const handleComplete = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setClearing(true);
    setTimeout(() => onComplete(task), 350);
  };

  if (clearing) {
    return (
      <div
        className="flex items-center gap-2 px-4 py-2.5 overflow-hidden"
        style={{ animation: "killClearOut 0.35s ease forwards" }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <span className="text-[11px] font-bold" style={{ color: "#22c55e" }}>Cleared</span>
      </div>
    );
  }

  // Strip the track name from display (it's already in the accordion header)
  const displayTitle = task.title.replace(/\s—\s.+$/, "");

  return (
    <div
      className="border-b transition-all duration-200"
      style={{
        borderColor: "rgba(255,255,255,0.04)",
        background: expanded ? "rgba(255,255,255,0.02)" : "transparent",
      }}
    >
      {/* Main row — tap text to expand, tap circle to complete */}
      <div className="flex items-center justify-between px-4 py-3">
        {/* Tap target: expand/collapse instructions */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex-1 min-w-0 mr-3 text-left py-2 flex items-center gap-2"
          aria-expanded={expanded}
          aria-label={`${expanded ? "Collapse" : "Expand"} instructions for ${displayTitle}`}
          style={{ minHeight: "48px" }}
        >
          <span
            className="text-[9px] transition-transform duration-200 flex-shrink-0"
            style={{
              color: "rgba(255,255,255,0.4)",
              transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
            }}
          >
            ▶
          </span>
          <div className="min-w-0">
            <p className="text-[13px] font-bold text-white leading-snug">
              {displayTitle}
            </p>
            <p className="text-[11px] leading-relaxed mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>
              {task.subtitle}
            </p>
          </div>
        </button>

        {/* Tap target: complete the task */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-[9px] font-black tracking-[0.15em] px-2 py-1 rounded-md bg-white/5 border border-white/5" style={{ color: style.color }}>
            {PILLAR_LABELS[task.pillar]}
          </span>
          <button
            onClick={handleComplete}
            className="w-10 h-10 rounded-full flex items-center justify-center active:scale-90 transition-transform"
            style={{ border: `1.5px solid ${style.color}60`, background: `${style.color}15` }}
            aria-label={`Mark task ${displayTitle} as complete`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={style.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* How-to drawer — step-by-step instructions */}
      {expanded && task.howTo.length > 0 && (
        <div
          className="px-4 pb-3 ml-6"
          style={{ animation: "killFadeIn 0.2s ease both" }}
        >
          <div
            className="rounded-lg px-3 py-2.5"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <p className="text-[9px] font-black tracking-[0.15em] uppercase mb-2" style={{ color: "rgba(255,255,255,0.2)" }}>
              How to do this
            </p>
            <ol className="list-none space-y-1.5">
              {task.howTo.map((step, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-[10px] font-black flex-shrink-0 mt-px" style={{ color: style.color, opacity: 0.4, minWidth: "14px" }}>
                    {i + 1}.
                  </span>
                  <span className="text-[11px] leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Release Accordion ────────────────────────────────────────────────

function ReleaseGroup({
  name,
  tasks,
  defaultOpen,
  onComplete,
  index,
}: {
  name: string;
  tasks: KillTask[];
  defaultOpen: boolean;
  onComplete: (task: KillTask) => void;
  index: number;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const urgency = getGroupUrgency(tasks);
  const style = URGENCY_STYLES[urgency];
  const redCount = tasks.filter(t => t.urgency === "RED").length;
  const amberCount = tasks.filter(t => t.urgency === "AMBER").length;

  return (
    <div
      className="rounded-xl overflow-hidden mb-3"
      style={{
        border: `1px solid ${open ? style.border : "rgba(255,255,255,0.06)"}`,
        background: open ? style.bg : "rgba(255,255,255,0.02)",
        animation: `killFadeIn 0.25s ease ${index * 0.04}s both`,
      }}
    >
      {/* Header — tap to toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-4 transition-all"
        aria-expanded={open}
        aria-label={`${open ? "Collapse" : "Expand"} release group: ${name}`}
        style={{ minHeight: "48px" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: style.color, boxShadow: `0 0 6px ${style.color}40` }}
          />
          <span className="text-[13px] font-black text-white tracking-tight">
            {name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {redCount > 0 && (
            <span className="text-[9px] font-black px-1.5 py-0.5 rounded" style={{ color: "#FF2D2D", background: "rgba(255,45,45,0.12)" }}>
              {redCount}
            </span>
          )}
          {amberCount > 0 && (
            <span className="text-[9px] font-black px-1.5 py-0.5 rounded" style={{ color: "#FFB800", background: "rgba(255,184,0,0.1)" }}>
              {amberCount}
            </span>
          )}
          <span className="text-[10px] font-bold" style={{ color: "rgba(255,255,255,0.25)" }}>
            {tasks.length}
          </span>
          <span
            className="text-[10px] transition-transform duration-200"
            style={{ color: "rgba(255,255,255,0.2)", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          >
            ▾
          </span>
        </div>
      </button>

      {/* Task list — only visible when open */}
      {open && (
        <div style={{ borderTop: `1px solid ${style.border}` }}>
          {tasks.map((task) => (
            <TaskRow key={task.id} task={task} onComplete={onComplete} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────

export default function KillPage() {
  const [tasks, setTasks] = useState<KillTask[]>([]);
  const [stats, setStats] = useState({ total: 0, cleared: 0, redRemaining: 0 });
  const [telemetry, setTelemetry] = useState<DailyTelemetry>({ doordash_earned: 0, doordash_month: '' });
  const [trackSummaries, setTrackSummaries] = useState<TrackHoursSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [recalStatus, setRecalStatus] = useState<"idle" | "running" | "done">("idle");

  // Daily Focus — one sentence, persists for the day
  const [focus, setFocus] = useState("");
  const [focusEditing, setFocusEditing] = useState(false);
  const [focusDraft, setFocusDraft] = useState("");
  const focusInputRef = useRef<HTMLInputElement>(null);

  // Infrastructure section — collapsed by default
  const [infraOpen, setInfraOpen] = useState(false);

  const refresh = useCallback(async () => {
    const [t, s, tel, summaries] = await Promise.all([deriveKillList(), getKillStats(), getDailyTelemetry(), getTrackHoursSummaries()]);
    setTasks(t);
    setStats(s);
    setTelemetry(tel);
    setTrackSummaries(summaries);
    setLoading(false);
  }, []);

  // Load focus on mount
  useEffect(() => {
    refresh();
    const loadFocus = async () => {
      const saved = await getStoreValue<string>(`daily_focus:${getTodayISO()}`);
      if (saved) setFocus(saved);
    };
    loadFocus();
  }, [refresh]);

  const saveFocus = async () => {
    const trimmed = focusDraft.trim();
    setFocus(trimmed);
    setFocusEditing(false);
    await setStoreValue(`daily_focus:${getTodayISO()}`, trimmed);
  };

  const handleComplete = async (task: KillTask) => {
    await completeTask(task);
    const [t, s, tel, summaries] = await Promise.all([deriveKillList(), getKillStats(), getDailyTelemetry(), getTrackHoursSummaries()]);
    setTasks(t);
    setStats(s);
    setTelemetry(tel);
    setTrackSummaries(summaries);

    const redBefore = stats.redRemaining;
    const redAfter = t.filter(x => x.urgency === "RED").length;
    if (redBefore > 0 && redAfter === 0) {
      setRecalStatus("running");
      try {
        await recalibrateOracle(true);
        setRecalStatus("done");
        setTimeout(async () => { await refresh(); setRecalStatus("idle"); }, 1500);
      } catch { setRecalStatus("idle"); }
    }
  };

  const updateTelemetry = async (field: keyof DailyTelemetry, value: number) => {
    const newTel = { ...telemetry, [field]: value };
    setTelemetry(newTel);
    await saveDailyTelemetry(newTel);
    refresh(); // Re-derive the kill list so tasks immediately recalibrate urgencies
  };

  // ── Split tasks: needles vs infrastructure ──
  const needleTasks = tasks.filter(isNeedle);
  const infraTasks = tasks.filter(t => !isNeedle(t));

  // ── Group needle tasks by release/category ──
  const groups: { name: string; tasks: KillTask[] }[] = [];
  const groupMap = new Map<string, KillTask[]>();

  for (const task of needleTasks) {
    const key = getGroupKey(task);
    if (!groupMap.has(key)) groupMap.set(key, []);
    groupMap.get(key)!.push(task);
  }

  // "Today" group first, then releases sorted by urgency
  const todayTasks = groupMap.get("Today");
  if (todayTasks && todayTasks.length > 0) {
    groups.push({ name: "Today", tasks: todayTasks });
    groupMap.delete("Today");
  }

  const releaseGroups = Array.from(groupMap.entries())
    .map(([name, tasks]) => ({ name, tasks }))
    .sort((a, b) => {
      const order: Record<string, number> = { RED: 0, AMBER: 1, GREEN: 2 };
      return order[getGroupUrgency(a.tasks)] - order[getGroupUrgency(b.tasks)];
    });

  groups.push(...releaseGroups);

  // ── Infrastructure grouped ──
  const infraGroups: { name: string; tasks: KillTask[] }[] = [];
  const infraGroupMap = new Map<string, KillTask[]>();

  for (const task of infraTasks) {
    const key = getGroupKey(task);
    if (!infraGroupMap.has(key)) infraGroupMap.set(key, []);
    infraGroupMap.get(key)!.push(task);
  }

  const infraToday = infraGroupMap.get("Today");
  if (infraToday && infraToday.length > 0) {
    infraGroups.push({ name: "Today", tasks: infraToday });
    infraGroupMap.delete("Today");
  }
  infraGroups.push(...Array.from(infraGroupMap.entries()).map(([name, tasks]) => ({ name, tasks })));

  const sfHoursFromLog = trackSummaries.find(t => t.trackName.toUpperCase() === 'SWEET FRUSTRATION')?.totalHours || 0;
  const lidHoursFromLog = trackSummaries.find(t => t.trackName.toUpperCase() === 'LIKE I DID')?.totalHours || 0;

  const pct = stats.total > 0 ? Math.round((stats.cleared / stats.total) * 100) : 0;
  const statusColor = tasks.some(t => t.urgency === "RED") ? "#FF2D2D"
    : tasks.some(t => t.urgency === "AMBER") ? "#FFB800" : "#22c55e";
  const statusLabel = tasks.some(t => t.urgency === "RED") ? "ACTIVE"
    : tasks.length > 0 ? "CLEARING" : "CLEAR";

  if (loading) {
    return (
      <main className="page flex items-center justify-center animate-fade-in">
        <p className="text-[10px] tracking-[0.3em] text-[#333]">DERIVING KILL LIST...</p>
      </main>
    );
  }

  return (
    <main className="page animate-fade-in pb-28">
      <style>{`
        @keyframes killFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes killClearOut {
          0% { opacity: 1; max-height: 60px; }
          50% { opacity: 0; max-height: 60px; }
          100% { opacity: 0; max-height: 0; padding: 0; margin: 0; }
        }
        @keyframes killPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>

      <div className="page-inner">

        {/* ── Header ── */}
        <div className="mb-5" style={{ animation: "killFadeIn 0.25s ease both" }}>
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-[10px] font-black tracking-[0.3em] uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>
              Kill List
            </h1>
            <div className="flex items-center gap-1.5">
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: statusColor, boxShadow: `0 0 6px ${statusColor}` }}
              />
              <span
                className="text-[10px] font-black tracking-wider"
                style={{
                  color: statusColor,
                  animation: recalStatus === "running" ? "killPulse 0.6s ease infinite" : "none",
                }}
              >
                {recalStatus === "running" ? "RECALIBRATING..." : recalStatus === "done" ? "RECALIBRATED ✓" : statusLabel}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>
              {stats.cleared}/{stats.total} cleared
            </span>
            <span className="text-[10px] font-black" style={{ color: statusColor }}>{pct}%</span>
          </div>
          <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${pct}%`,
                background: `linear-gradient(90deg, ${statusColor}80, ${statusColor})`,
                boxShadow: `0 0 8px ${statusColor}30`,
              }}
            />
          </div>
        </div>

        {/* ── DAILY FOCUS — "What's the one thing?" ── */}
        <div
          className="mb-5 rounded-xl overflow-hidden"
          style={{
            background: focus ? "rgba(212,168,83,0.04)" : "rgba(255,255,255,0.02)",
            border: `1px solid ${focus ? "rgba(212,168,83,0.15)" : "rgba(255,255,255,0.06)"}`,
            animation: "killFadeIn 0.25s ease 0.05s both",
          }}
        >
          <div className="px-4 py-3">
            <p className="text-[9px] font-black tracking-[0.2em] uppercase mb-2" style={{ color: focus ? "#d4a853" : "rgba(255,255,255,0.25)" }}>
              {focus ? "Today's Focus" : "Set Your Focus"}
            </p>

            {focusEditing ? (
              <div className="flex gap-2">
                <input
                  ref={focusInputRef}
                  type="text"
                  value={focusDraft}
                  onChange={e => setFocusDraft(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") saveFocus(); }}
                  placeholder="What's the one thing today?"
                  className="flex-1 bg-[#0a0a0a] border border-[#222] rounded-lg px-3 py-2.5 text-[13px] font-bold text-white outline-none placeholder-[#333] focus:border-[#d4a853]/30"
                  autoFocus
                />
                <button
                  onClick={saveFocus}
                  className="px-4 py-2 rounded-lg bg-[#d4a853]/15 border border-[#d4a853]/25 text-[#d4a853] text-[10px] font-black tracking-widest uppercase active:scale-95 transition-all"
                >
                  Set
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setFocusDraft(focus); setFocusEditing(true); }}
                className="w-full text-left active:scale-[0.99] transition-transform"
                style={{ minHeight: "36px" }}
              >
                {focus ? (
                  <p className="text-[15px] font-black text-white leading-snug">{focus}</p>
                ) : (
                  <p className="text-[13px] font-bold leading-snug" style={{ color: "rgba(255,255,255,0.25)" }}>
                    Tap to set — everything below serves this.
                  </p>
                )}
              </button>
            )}

            {focus && !focusEditing && (
              <p className="text-[9px] mt-1.5" style={{ color: "rgba(255,255,255,0.15)" }}>
                Everything below serves this. Tap to change.
              </p>
            )}
          </div>
        </div>

        {/* ── Daily Telemetry (Anti-Drift Engine) ── */}
        <div className="mb-5 rounded-xl p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[9px] font-black tracking-[0.2em] uppercase" style={{ color: "rgba(255,255,255,0.4)" }}>Anti-Drift Telemetry</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4 border-b border-[#ffffff10] pb-4">
            <div>
              <p className="text-[10px] uppercase font-bold text-white mb-2 opacity-80 text-center">SF Mixdown</p>
              <div className="text-center font-black text-[14px] text-white tabular-nums">
                {sfHoursFromLog} <span className="opacity-40 text-[10px]">/ 11h (auto)</span>
              </div>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-white mb-2 opacity-80 text-center">LID Mixdown</p>
              <div className="text-center font-black text-[14px] text-white tabular-nums">
                {lidHoursFromLog} <span className="opacity-40 text-[10px]">/ 11h (auto)</span>
              </div>
            </div>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-white mb-2 opacity-80 text-center">DoorDash Earned</p>
            <div className="flex gap-2 mb-3">
              <button onClick={() => updateTelemetry('doordash_earned', telemetry.doordash_earned + 20)} className="flex-1 py-1.5 rounded bg-[#ffffff10] border border-[#ffffff1a] text-[#fff] text-[11px] font-black active:scale-95 transition-transform">+$20</button>
              <button onClick={() => updateTelemetry('doordash_earned', telemetry.doordash_earned + 50)} className="flex-1 py-1.5 rounded bg-[#ffffff10] border border-[#ffffff1a] text-[#fff] text-[11px] font-black active:scale-95 transition-transform">+$50</button>
              <button onClick={() => updateTelemetry('doordash_earned', telemetry.doordash_earned + 100)} className="flex-1 py-1.5 rounded bg-[#ffffff10] border border-[#ffffff1a] text-[#fff] text-[11px] font-black active:scale-95 transition-transform">+$100</button>
            </div>
            <p className="text-center font-black text-[15px] text-white">
              ${telemetry.doordash_earned} <span className="opacity-40 text-[11px] w-14">/ $1000</span>
            </p>
          </div>
        </div>

        {/* ── NEEDLE TASKS — the work that compounds ── */}
        {needleTasks.length > 0 && (
          <div className="mb-2">
            <h2 className="text-[9px] font-black tracking-[0.2em] uppercase mb-3 px-1" style={{ color: "rgba(255,255,255,0.25)" }}>
              The Work
            </h2>
            {groups.map((group, i) => (
              <ReleaseGroup
                key={group.name}
                name={group.name}
                tasks={group.tasks}
                defaultOpen={i === 0 || getGroupUrgency(group.tasks) === "RED"}
                onComplete={handleComplete}
                index={i}
              />
            ))}
          </div>
        )}

        {/* ── INFRASTRUCTURE — collapsed by default ── */}
        {infraTasks.length > 0 && (
          <div className="mb-5">
            <button
              onClick={() => setInfraOpen(!infraOpen)}
              className="w-full flex items-center justify-between px-1 py-3 transition-all"
            >
              <h2 className="text-[9px] font-black tracking-[0.2em] uppercase" style={{ color: "rgba(255,255,255,0.15)" }}>
                Infrastructure ({infraTasks.length})
              </h2>
              <div className="flex items-center gap-2">
                {infraTasks.some(t => t.urgency === "RED") && (
                  <span className="text-[8px] font-black px-1.5 py-0.5 rounded" style={{ color: "#FF2D2D", background: "rgba(255,45,45,0.12)" }}>
                    {infraTasks.filter(t => t.urgency === "RED").length}
                  </span>
                )}
                {infraTasks.some(t => t.urgency === "AMBER") && (
                  <span className="text-[8px] font-black px-1.5 py-0.5 rounded" style={{ color: "#FFB800", background: "rgba(255,184,0,0.1)" }}>
                    {infraTasks.filter(t => t.urgency === "AMBER").length}
                  </span>
                )}
                <span
                  className="text-[10px] transition-transform duration-200"
                  style={{ color: "rgba(255,255,255,0.15)", transform: infraOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                >
                  ▾
                </span>
              </div>
            </button>

            {infraOpen && (
              <div style={{ animation: "killFadeIn 0.2s ease both" }}>
                {infraGroups.map((group, i) => (
                  <ReleaseGroup
                    key={group.name}
                    name={group.name}
                    tasks={group.tasks}
                    defaultOpen={getGroupUrgency(group.tasks) === "RED"}
                    onComplete={handleComplete}
                    index={i}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── All Clear state ── */}
        {tasks.length === 0 && (
          <div
            className="text-center py-16 rounded-2xl"
            style={{
              background: "rgba(34,197,94,0.04)",
              border: "1px solid rgba(34,197,94,0.1)",
              animation: "killFadeIn 0.5s ease both",
            }}
          >
            <div
              className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ background: "rgba(34,197,94,0.1)", boxShadow: "0 0 24px rgba(34,197,94,0.15)" }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="text-sm font-bold" style={{ color: "#22c55e" }}>Kill list clear</p>
            <p className="text-[11px] mt-1.5" style={{ color: "rgba(255,255,255,0.25)" }}>
              Nothing derived. Execute freely.
            </p>
            {stats.cleared > 0 && (
              <p className="text-[10px] mt-3" style={{ color: "rgba(255,255,255,0.15)" }}>
                {stats.cleared} task{stats.cleared > 1 ? "s" : ""} cleared today
              </p>
            )}
          </div>
        )}

      </div>
    </main>
  );
}
