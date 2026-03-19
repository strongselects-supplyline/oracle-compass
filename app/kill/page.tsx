"use client";

// app/kill/page.tsx
// Dynamic Kill List — grouped by release with collapsible accordions.
// Every task is derived from live system state. Nothing is hardcoded.
// Tapping a task mutates the underlying data and the list re-derives.
// When all RED items clear, the Oracle auto-recalibrates.

import { useState, useEffect, useCallback } from "react";
import { deriveKillList, completeTask, getKillStats, KillTask } from "@/lib/killList";
import { recalibrateOracle } from "@/lib/recalibrate";

const URGENCY_STYLES: Record<string, { color: string; bg: string; border: string }> = {
  RED:   { color: "#FF2D2D", bg: "rgba(255,45,45,0.06)",   border: "rgba(255,45,45,0.2)" },
  AMBER: { color: "#FFB800", bg: "rgba(255,184,0,0.05)",   border: "rgba(255,184,0,0.18)" },
  GREEN: { color: "#22c55e", bg: "rgba(34,197,94,0.04)",   border: "rgba(34,197,94,0.15)" },
};

const PILLAR_LABELS: Record<string, string> = {
  creative: "CREATIVE", business: "BUSINESS", body: "BODY", ops: "OPS",
};

// ── Extract release name from task title (format: "Task — Track Name") ──
function getGroupKey(task: KillTask): string {
  // Oracle flags and non-release tasks always go under "Today"
  if (task.id.startsWith("flag-") || task.id.startsWith("fuel-") ||
      task.id.startsWith("grind-") || task.id.startsWith("session-") ||
      task.id.startsWith("biz-")) {
    return "Today";
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
          className="flex-1 min-w-0 mr-3 text-left"
        >
          <div className="flex items-center gap-2">
            <span
              className="text-[9px] transition-transform duration-200 flex-shrink-0"
              style={{
                color: "rgba(255,255,255,0.2)",
                transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
              }}
            >
              ▶
            </span>
            <div className="min-w-0">
              <p className="text-[12px] font-semibold text-white leading-snug">
                {displayTitle}
              </p>
              <p className="text-[10px] leading-relaxed mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                {task.subtitle}
              </p>
            </div>
          </div>
        </button>

        {/* Tap target: complete the task */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[8px] font-black tracking-widest" style={{ color: style.color, opacity: 0.5 }}>
            {PILLAR_LABELS[task.pillar]}
          </span>
          <button
            onClick={handleComplete}
            className="w-7 h-7 rounded-full flex items-center justify-center active:scale-90 transition-transform"
            style={{ border: `1.5px solid ${style.color}40`, background: `${style.color}10` }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={style.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
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
        className="w-full flex items-center justify-between px-4 py-3.5 transition-all"
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
  const [loading, setLoading] = useState(true);
  const [recalStatus, setRecalStatus] = useState<"idle" | "running" | "done">("idle");

  const refresh = useCallback(async () => {
    const [t, s] = await Promise.all([deriveKillList(), getKillStats()]);
    setTasks(t);
    setStats(s);
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const handleComplete = async (task: KillTask) => {
    await completeTask(task);
    const [t, s] = await Promise.all([deriveKillList(), getKillStats()]);
    setTasks(t);
    setStats(s);

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

  // ── Group tasks by release/category ──
  const groups: { name: string; tasks: KillTask[] }[] = [];
  const groupMap = new Map<string, KillTask[]>();

  for (const task of tasks) {
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

        {/* ── Grouped accordions ── */}
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
