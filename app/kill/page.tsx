"use client";

// app/kill/page.tsx
// Dynamic Kill List — the Oracle's action surface.
// Every task is derived from live system state. Nothing is hardcoded.
// Tapping a task mutates the underlying data and the list re-derives.
// When all RED items clear, the Oracle auto-recalibrates.

import { useState, useEffect, useCallback } from "react";
import { deriveKillList, completeTask, getKillStats, KillTask } from "@/lib/killList";
import { recalibrateOracle } from "@/lib/recalibrate";

const URGENCY_STYLES: Record<string, { color: string; bg: string; border: string; glow: string }> = {
  RED:   { color: "#FF2D2D", bg: "rgba(255,45,45,0.06)",   border: "rgba(255,45,45,0.2)",   glow: "rgba(255,45,45,0.1)" },
  AMBER: { color: "#FFB800", bg: "rgba(255,184,0,0.05)",   border: "rgba(255,184,0,0.18)",  glow: "rgba(255,184,0,0.08)" },
  GREEN: { color: "#22c55e", bg: "rgba(34,197,94,0.04)",   border: "rgba(34,197,94,0.15)",  glow: "rgba(34,197,94,0.06)" },
};

const PILLAR_LABELS: Record<string, string> = {
  creative: "CREATIVE",
  business: "BUSINESS",
  body: "BODY",
  ops: "OPS",
};

function TaskCard({
  task,
  index,
  onComplete,
}: {
  task: KillTask;
  index: number;
  onComplete: (task: KillTask) => void;
}) {
  const [pressing, setPressing] = useState(false);
  const [clearing, setClearing] = useState(false);
  const style = URGENCY_STYLES[task.urgency];

  const handleComplete = () => {
    setClearing(true);
    setTimeout(() => onComplete(task), 400);
  };

  if (clearing) {
    return (
      <div
        className="rounded-xl px-5 py-4 mb-2.5 overflow-hidden"
        style={{
          background: "rgba(34,197,94,0.06)",
          border: "1px solid rgba(34,197,94,0.2)",
          animation: "killClearOut 0.4s ease forwards",
        }}
      >
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span className="text-sm font-bold" style={{ color: "#22c55e" }}>Cleared</span>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={handleComplete}
      onMouseDown={() => setPressing(true)}
      onMouseUp={() => setPressing(false)}
      onMouseLeave={() => setPressing(false)}
      onTouchStart={() => setPressing(true)}
      onTouchEnd={() => setPressing(false)}
      className="w-full text-left rounded-xl px-5 py-4 mb-2.5 transition-all duration-150 cursor-pointer"
      style={{
        background: pressing ? style.bg.replace(/[\d.]+\)$/, "0.12)") : style.bg,
        border: `1px solid ${style.border}`,
        transform: pressing ? "scale(0.98)" : "scale(1)",
        animation: `killFadeIn 0.3s ease ${index * 0.04}s both`,
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-bold text-white leading-snug mb-1">
            {task.title}
          </p>
          <p className="text-[11px] leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
            {task.subtitle}
          </p>
        </div>
        <div
          className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
          style={{
            border: `1.5px solid ${style.color}30`,
            background: `${style.color}08`,
          }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={style.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      </div>
      <div className="mt-2.5 flex items-center gap-2">
        <span
          className="text-[9px] font-black uppercase tracking-widest"
          style={{ color: style.color, opacity: 0.6 }}
        >
          {task.urgency}
        </span>
        <span style={{ color: "rgba(255,255,255,0.1)" }}>·</span>
        <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.25)" }}>
          {PILLAR_LABELS[task.pillar] || task.pillar}
        </span>
      </div>
    </button>
  );
}

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

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleComplete = async (task: KillTask) => {
    await completeTask(task);

    // Re-derive immediately
    const [t, s] = await Promise.all([deriveKillList(), getKillStats()]);
    setTasks(t);
    setStats(s);

    // If all RED items just cleared → auto-recalibrate
    const redBefore = stats.redRemaining;
    const redAfter = t.filter(x => x.urgency === "RED").length;
    if (redBefore > 0 && redAfter === 0) {
      setRecalStatus("running");
      try {
        await recalibrateOracle(true);
        setRecalStatus("done");
        // Re-derive after new decree (may generate new flags)
        setTimeout(async () => {
          await refresh();
          setRecalStatus("idle");
        }, 1500);
      } catch {
        setRecalStatus("idle");
      }
    }
  };

  const pct = stats.total > 0 ? Math.round((stats.cleared / stats.total) * 100) : 0;
  const redTasks = tasks.filter(t => t.urgency === "RED");
  const amberTasks = tasks.filter(t => t.urgency === "AMBER");
  const greenTasks = tasks.filter(t => t.urgency === "GREEN");

  const statusColor = redTasks.length > 0 ? "#FF2D2D" : amberTasks.length > 0 ? "#FFB800" : "#22c55e";
  const statusLabel = redTasks.length > 0 ? "ACTIVE" : amberTasks.length > 0 ? "CLEARING" : tasks.length === 0 ? "CLEAR" : "CLEARING";

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
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes killClearOut {
          0% { opacity: 1; max-height: 100px; }
          50% { opacity: 0; max-height: 100px; }
          100% { opacity: 0; max-height: 0; padding: 0; margin: 0; border: 0; }
        }
        @keyframes killPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>

      <div className="page-inner">

        {/* ── Header ── */}
        <div className="mb-6" style={{ animation: "killFadeIn 0.3s ease both" }}>
          <div className="flex items-center justify-between mb-4">
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
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>
              {stats.cleared}/{stats.total} cleared
            </span>
            <span className="text-[10px] font-black" style={{ color: statusColor }}>
              {pct}%
            </span>
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

        {/* ── RED section ── */}
        {redTasks.length > 0 && (
          <div className="mb-6" style={{ animation: "killFadeIn 0.3s ease 0.05s both" }}>
            <p className="text-[9px] font-black tracking-[0.2em] uppercase mb-3" style={{ color: "#FF2D2D" }}>
              Critical — {redTasks.length} item{redTasks.length > 1 ? "s" : ""}
            </p>
            {redTasks.map((task, i) => (
              <TaskCard key={task.id} task={task} index={i} onComplete={handleComplete} />
            ))}
          </div>
        )}

        {/* ── AMBER section ── */}
        {amberTasks.length > 0 && (
          <div className="mb-6" style={{ animation: "killFadeIn 0.3s ease 0.1s both" }}>
            <p className="text-[9px] font-black tracking-[0.2em] uppercase mb-3" style={{ color: "#FFB800" }}>
              Action — {amberTasks.length} item{amberTasks.length > 1 ? "s" : ""}
            </p>
            {amberTasks.map((task, i) => (
              <TaskCard key={task.id} task={task} index={i} onComplete={handleComplete} />
            ))}
          </div>
        )}

        {/* ── GREEN section ── */}
        {greenTasks.length > 0 && (
          <div className="mb-6" style={{ animation: "killFadeIn 0.3s ease 0.15s both" }}>
            <p className="text-[9px] font-black tracking-[0.2em] uppercase mb-3" style={{ color: "rgba(255,255,255,0.2)" }}>
              Maintenance — {greenTasks.length} item{greenTasks.length > 1 ? "s" : ""}
            </p>
            {greenTasks.map((task, i) => (
              <TaskCard key={task.id} task={task} index={i} onComplete={handleComplete} />
            ))}
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
