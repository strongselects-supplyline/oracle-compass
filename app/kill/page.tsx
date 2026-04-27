"use client";

// app/kill/page.tsx — EXECUTE
// Unified priority stream: Oracle decree header + Kill List + DoorDash + Recalibrate.
// Replaces the Oracle standalone page. One source of truth for "what do I do next?"
//
// Apr 7, 2026: Added Daily Focus anchor + Needle/Infrastructure split.
// Apr 12, 2026 (v24 redesign): Merged Oracle decree, CompletionModal, DD quick-add,
//   recalibrate button, What's Next auto-routing. One Thing now reads from getDailyLog.

import { useState, useEffect, useCallback, useRef } from "react";
import {
  getDailyTelemetry, saveDailyTelemetry, DailyTelemetry,
  getStoreValue, setStoreValue, getTodayISO,
  getDailyLog, saveDailyLog,
} from "@/lib/db";
import { deriveKillList, completeTask, getKillStats, KillTask, CompletionInput } from "@/lib/killList";
import { recalibrateOracle } from "@/lib/recalibrate";
import { getTrackHoursSummaries, TrackHoursSummary } from "@/lib/studioLog";
import type { OracleDecree } from "@/lib/oracle";
import TrackCards from "@/components/TrackCards";
import Link from "next/link";

const URGENCY_STYLES: Record<string, { color: string; bg: string; border: string }> = {
  RED:   { color: "#FF2D2D", bg: "rgba(255,45,45,0.06)",   border: "rgba(255,45,45,0.2)" },
  AMBER: { color: "#FFB800", bg: "rgba(255,184,0,0.05)",   border: "rgba(255,184,0,0.18)" },
  GREEN: { color: "#22c55e", bg: "rgba(34,197,94,0.04)",   border: "rgba(34,197,94,0.15)" },
};

const PILLAR_LABELS: Record<string, string> = {
  creative: "CREATIVE", business: "BUSINESS", body: "BODY", ops: "OPS",
};

// ── Needle vs Infrastructure classification ─────────────────────────
const NEEDLE_PREFIXES = [
  "telemetry-", "session-", "content-sprint-", "instrumental-",
  "esl-pitch-", "414-",
  "ig-community-sprint", "biz-move", "biz-touches",
  "dd-",
  "flag-",
  "s3-checkin",
];

const INFRASTRUCTURE_PREFIXES = [
  "social-", "fan-",
  "fuel-", "dayone-", "grind-", "mudra-",
  "ss-menu-",
];

function isNeedle(task: KillTask): boolean {
  if (task.needle === true) return true;
  if (task.needle === false) return false;
  return NEEDLE_PREFIXES.some(p => task.id.startsWith(p));
}

function getGroupKey(task: KillTask): string {
  if (task.id.startsWith("flag-") || task.id.startsWith("fuel-") ||
      task.id.startsWith("grind-") || task.id.startsWith("session-") ||
      task.id.startsWith("biz-") || task.id.startsWith("fan-") ||
      task.id.startsWith("social-") || task.id.startsWith("ig-") ||
      task.id.startsWith("s3-")) {
    return "Today";
  }
  if (task.id.startsWith("414-")) return "414 Day";
  if (task.id.startsWith("instrumental-")) return "Instrumentals";
  const match = task.title.match(/\s—\s(.+)$/);
  if (match) return match[1];
  return "Today";
}

function getGroupUrgency(tasks: KillTask[]): "RED" | "AMBER" | "GREEN" {
  if (tasks.some(t => t.urgency === "RED")) return "RED";
  if (tasks.some(t => t.urgency === "AMBER")) return "AMBER";
  return "GREEN";
}

// ── Completion Modal ─────────────────────────────────────────────────

function CompletionModal({
  task,
  onSubmit,
  onCancel,
}: {
  task: KillTask;
  onSubmit: (task: KillTask, inputValue: string | Record<string, string>) => void;
  onCancel: () => void;
}) {
  const input = task.completionInput!;
  const [rating, setRating] = useState<number | null>(null);
  const [numValue, setNumValue] = useState("");
  const [textValue, setTextValue] = useState("");
  const [ddHours, setDdHours] = useState("");
  const [ddRevenue, setDdRevenue] = useState("");

  const canSubmit = () => {
    if (input.type === "rating") return rating !== null;
    if (input.type === "number") return numValue.trim() !== "";
    if (input.type === "text") return textValue.trim() !== "";
    if (input.type === "doordash") return ddHours !== "" && ddRevenue !== "";
    return true;
  };

  const handleSubmit = () => {
    if (!canSubmit()) return;
    if (input.type === "rating") onSubmit(task, String(rating));
    else if (input.type === "number") onSubmit(task, numValue.trim());
    else if (input.type === "text") onSubmit(task, textValue.trim());
    else if (input.type === "doordash") onSubmit(task, { hours: ddHours, revenue: ddRevenue });
    else onSubmit(task, "");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-8" style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}>
      <div
        className="w-full max-w-sm rounded-2xl overflow-hidden"
        style={{
          background: "rgba(12,12,12,0.98)",
          border: "1px solid rgba(255,255,255,0.1)",
          animation: "killFadeIn 0.2s ease both",
        }}
      >
        {/* Header */}
        <div className="px-5 pt-5 pb-3 border-b border-white/5">
          <p className="text-[9px] font-black tracking-[0.25em] uppercase mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>
            COMPLETE TASK
          </p>
          <p className="text-sm font-black text-white leading-snug">{task.title.replace(/\s—\s.+$/, "")}</p>
          <p className="text-[11px] mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>{input.label}</p>
        </div>

        {/* Input */}
        <div className="px-5 py-5">
          {input.type === "rating" && (
            <div>
              <p className="text-[10px] font-black tracking-wider text-[#555] uppercase mb-3">Session Quality</p>
              <div className="flex gap-3 justify-center">
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    onClick={() => setRating(n)}
                    className="w-12 h-12 rounded-xl text-lg font-black transition-all active:scale-90"
                    style={{
                      background: rating === n ? "rgba(212,168,83,0.2)" : "rgba(255,255,255,0.04)",
                      border: `1.5px solid ${rating === n ? "#d4a853" : "rgba(255,255,255,0.08)"}`,
                      color: rating === n ? "#d4a853" : "rgba(255,255,255,0.4)",
                    }}
                  >
                    {n}
                  </button>
                ))}
              </div>
              {rating && (
                <p className="text-center text-[10px] mt-3 font-bold" style={{ color: "#d4a853" }}>
                  {rating === 1 ? "Rough session" : rating === 2 ? "Slow but real" : rating === 3 ? "Solid work" : rating === 4 ? "Strong session" : "Flow state ✓"}
                </p>
              )}
            </div>
          )}

          {input.type === "number" && (
            <div>
              <p className="text-[10px] font-black tracking-wider text-[#555] uppercase mb-3">{input.label}</p>
              <input
                autoFocus
                type="number"
                placeholder={input.placeholder || "0"}
                value={numValue}
                onChange={e => setNumValue(e.target.value)}
                onKeyDown={e => e.key === "Enter" && canSubmit() && handleSubmit()}
                className="w-full bg-[#111] border border-[#222] rounded-xl px-4 py-3 text-xl font-black text-center text-white outline-none focus:border-[#444]"
              />
            </div>
          )}

          {input.type === "text" && (
            <div>
              <p className="text-[10px] font-black tracking-wider text-[#555] uppercase mb-3">{input.label}</p>
              <input
                autoFocus
                type="text"
                placeholder={input.placeholder || "Enter..."}
                value={textValue}
                onChange={e => setTextValue(e.target.value)}
                onKeyDown={e => e.key === "Enter" && canSubmit() && handleSubmit()}
                className="w-full bg-[#111] border border-[#222] rounded-xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-[#444] placeholder-[#333]"
              />
            </div>
          )}

          {input.type === "doordash" && (
            <div>
              <p className="text-[10px] font-black tracking-wider text-[#555] uppercase mb-3">Log DoorDash Shift</p>
              <div className="flex gap-3">
                <input
                  autoFocus
                  type="number"
                  placeholder="Hours"
                  value={ddHours}
                  onChange={e => setDdHours(e.target.value)}
                  className="flex-1 bg-[#111] border border-[#222] rounded-xl px-3 py-3 text-center text-sm font-black text-white outline-none focus:border-[#444] placeholder-[#333]"
                />
                <input
                  type="number"
                  placeholder="$ Rev"
                  value={ddRevenue}
                  onChange={e => setDdRevenue(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && canSubmit() && handleSubmit()}
                  className="flex-1 bg-[#111] border border-[#222] rounded-xl px-3 py-3 text-center text-sm font-black text-white outline-none focus:border-[#444] placeholder-[#333]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-5 pb-5">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl text-[11px] font-black tracking-widest uppercase transition-all active:scale-95"
            style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit()}
            className="flex-2 flex-grow py-3 rounded-xl text-[11px] font-black tracking-widest uppercase transition-all active:scale-95 disabled:opacity-30"
            style={{ background: canSubmit() ? "#22c55e15" : "rgba(255,255,255,0.04)", color: canSubmit() ? "#22c55e" : "rgba(255,255,255,0.2)", border: `1px solid ${canSubmit() ? "#22c55e40" : "rgba(255,255,255,0.06)"}` }}
          >
            LOG + COMPLETE ✓
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Task Row ─────────────────────────────────────────────────────────

function TaskRow({
  task,
  onComplete,
  onOpenModal,
}: {
  task: KillTask;
  onComplete: (task: KillTask) => void;
  onOpenModal: (task: KillTask) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [clearing, setClearing] = useState(false);
  const style = URGENCY_STYLES[task.urgency];

  const handleComplete = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (task.completionInput) {
      // Open modal instead of immediately completing
      onOpenModal(task);
      return;
    }
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

  const displayTitle = task.title.replace(/\s—\s.+$/, "");

  return (
    <div
      className="border-b transition-all duration-200"
      style={{ borderColor: "rgba(255,255,255,0.04)", background: expanded ? "rgba(255,255,255,0.02)" : "transparent" }}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex-1 min-w-0 mr-3 text-left py-2 flex items-center gap-2"
          aria-expanded={expanded}
          aria-label={`${expanded ? "Collapse" : "Expand"} instructions for ${displayTitle}`}
          style={{ minHeight: "48px" }}
        >
          <span
            className="text-[9px] transition-transform duration-200 flex-shrink-0"
            style={{ color: "rgba(255,255,255,0.4)", transform: expanded ? "rotate(90deg)" : "rotate(0deg)" }}
          >
            ▶
          </span>
          <div className="min-w-0">
            <p className="text-[13px] font-bold text-white leading-snug">{displayTitle}</p>
            <p className="text-[11px] leading-relaxed mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>{task.subtitle}</p>
            {task.completionInput && (
              <p className="text-[9px] mt-1 font-black tracking-wider uppercase" style={{ color: "rgba(212,168,83,0.6)" }}>
                TAP ✓ TO LOG + COMPLETE
              </p>
            )}
          </div>
        </button>

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

      {expanded && task.howTo.length > 0 && (
        <div className="px-4 pb-3 ml-6" style={{ animation: "killFadeIn 0.2s ease both" }}>
          <div className="rounded-lg px-3 py-2.5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-[9px] font-black tracking-[0.15em] uppercase mb-2" style={{ color: "rgba(255,255,255,0.2)" }}>
              How to do this
            </p>
            <ol className="list-none space-y-1.5">
              {task.howTo.map((step, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-[10px] font-black flex-shrink-0 mt-px" style={{ color: style.color, opacity: 0.4, minWidth: "14px" }}>{i + 1}.</span>
                  <span className="text-[11px] leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>{step}</span>
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
  onOpenModal,
  index,
}: {
  name: string;
  tasks: KillTask[];
  defaultOpen: boolean;
  onComplete: (task: KillTask) => void;
  onOpenModal: (task: KillTask) => void;
  index: number;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const urgency = getGroupUrgency(tasks);
  const style = URGENCY_STYLES[urgency];
  const redCount = tasks.filter(t => t.urgency === "RED").length;
  const amberCount = tasks.filter(t => t.urgency === "AMBER").length;
  const quickWins = tasks.filter(t => t.howTo.length <= 2).length;

  return (
    <div
      className="rounded-xl overflow-hidden mb-3"
      style={{
        border: `1px solid ${open ? style.border : "rgba(255,255,255,0.06)"}`,
        background: open ? style.bg : "rgba(255,255,255,0.02)",
        animation: `killFadeIn 0.25s ease ${index * 0.04}s both`,
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-4 transition-all"
        aria-expanded={open}
        aria-label={`${open ? "Collapse" : "Expand"} release group: ${name}`}
        style={{ minHeight: "48px" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: style.color, boxShadow: `0 0 6px ${style.color}40` }} />
          <span className="text-[13px] font-black text-white tracking-tight">{name}</span>
        </div>
        <div className="flex items-center gap-2">
          {redCount > 0 && (
            <span className="text-[9px] font-black px-1.5 py-0.5 rounded" style={{ color: "#FF2D2D", background: "rgba(255,45,45,0.12)" }}>{redCount}</span>
          )}
          {amberCount > 0 && (
            <span className="text-[9px] font-black px-1.5 py-0.5 rounded" style={{ color: "#FFB800", background: "rgba(255,184,0,0.1)" }}>{amberCount}</span>
          )}
          {quickWins > 0 && !open && (
            <span className="text-[9px] font-black px-1.5 py-0.5 rounded" style={{ color: "#22c55e", background: "rgba(34,197,94,0.08)" }}>
              {quickWins} quick
            </span>
          )}
          <span className="text-[10px] font-bold" style={{ color: "rgba(255,255,255,0.25)" }}>{tasks.length}</span>
          <span className="text-[10px] transition-transform duration-200" style={{ color: "rgba(255,255,255,0.2)", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>▾</span>
        </div>
      </button>

      {open && (
        <div style={{ borderTop: `1px solid ${style.border}` }}>
          {tasks.map((task) => (
            <TaskRow key={task.id} task={task} onComplete={onComplete} onOpenModal={onOpenModal} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Oracle Decree Banner ─────────────────────────────────────────────

function OracleDecreeBanner({ decree }: { decree: OracleDecree }) {
  const [expanded, setExpanded] = useState(false);
  const severity = decree.severity ?? "GREEN";
  const style = URGENCY_STYLES[severity] ?? URGENCY_STYLES.GREEN;
  const summary = (decree.oracle_message || decree.assessment || "Oracle assessment complete.").slice(0, 120);

  return (
    <div
      className="mb-5 rounded-xl overflow-hidden"
      style={{
        background: style.bg,
        border: `1px solid ${style.border}`,
        animation: "killFadeIn 0.25s ease both",
      }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3"
        style={{ minHeight: "48px" }}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="text-[9px] font-black tracking-[0.2em] uppercase flex-shrink-0" style={{ color: style.color }}>
            🔮 ORACLE
          </span>
          <span className="text-[11px] font-bold text-white truncate">{summary}</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
          <span className="text-[9px] font-black px-2 py-0.5 rounded" style={{ color: style.color, background: `${style.color}15` }}>
            {severity}
          </span>
          <span className="text-[10px] transition-transform duration-200" style={{ color: "rgba(255,255,255,0.2)", transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}>▾</span>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-white/5" style={{ animation: "killFadeIn 0.2s ease both" }}>
          {decree.assessment && (
            <p className="text-[12px] text-white/70 leading-relaxed mt-3 mb-3">{decree.assessment}</p>
          )}
          {decree.realignments && decree.realignments.length > 0 && (
            <div className="space-y-2">
              {decree.realignments.filter(r => r.type === "flag_action").slice(0, 4).map((r, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-[9px] font-black flex-shrink-0 mt-0.5" style={{ color: style.color }}>→</span>
                  <div>
                    <p className="text-[12px] font-bold text-white leading-snug">{r.action}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{r.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────

export default function KillPage() {
  const [tasks, setTasks] = useState<KillTask[]>([]);
  const [stats, setStats] = useState({ total: 0, cleared: 0, redRemaining: 0 });
  const [telemetry, setTelemetry] = useState<DailyTelemetry>({ doordash_earned: 0, doordash_month: "" });
  const [trackSummaries, setTrackSummaries] = useState<TrackHoursSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [recalStatus, setRecalStatus] = useState<"idle" | "running" | "done">("idle");
  const [decree, setDecree] = useState<OracleDecree | null>(null);

  // One Thing — reads from DailyLog (single source of truth)
  const [oneThing, setOneThing] = useState("");
  const [oneThingEditing, setOneThingEditing] = useState(false);
  const [oneThingDraft, setOneThingDraft] = useState("");
  const oneThingRef = useRef<HTMLInputElement>(null);

  // Infrastructure section — collapsed by default
  const [infraOpen, setInfraOpen] = useState(false);

  // Completion modal
  const [modalTask, setModalTask] = useState<KillTask | null>(null);
  const [modalClearing, setModalClearing] = useState(false);

  // DD quick-add
  const [ddHours, setDdHours] = useState("");
  const [ddRevenue, setDdRevenue] = useState("");
  const [ddStatus, setDdStatus] = useState("");

  const refresh = useCallback(async () => {
    const [t, s, tel, summaries] = await Promise.all([
      deriveKillList(),
      getKillStats(),
      getDailyTelemetry(),
      getTrackHoursSummaries(),
    ]);
    setTasks(t);
    setStats(s);
    setTelemetry(tel);
    setTrackSummaries(summaries);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
    // Load One Thing from DailyLog (single source of truth — same as Today page)
    getDailyLog().then(log => {
      if (log.oneThing) setOneThing(log.oneThing);
    });
    // Load Oracle decree
    getStoreValue<OracleDecree>(`oracle_decree:${getTodayISO()}`).then(d => {
      if (d) setDecree(d);
    });
  }, [refresh]);

  const saveOneThing = async () => {
    const trimmed = oneThingDraft.trim();
    setOneThing(trimmed);
    setOneThingEditing(false);
    // Write to DailyLog — single source of truth shared with Today page
    const log = await getDailyLog();
    await saveDailyLog({ ...log, oneThing: trimmed });
  };

  const handleComplete = async (task: KillTask) => {
    await completeTask(task);
    const [t, s, tel, summaries] = await Promise.all([
      deriveKillList(), getKillStats(), getDailyTelemetry(), getTrackHoursSummaries(),
    ]);
    setTasks(t);
    setStats(s);
    setTelemetry(tel);
    setTrackSummaries(summaries);

    const redBefore = stats.redRemaining;
    const redAfter = t.filter(x => x.urgency === "RED").length;
    const allCleared = t.length === 0;

    // Recalibrate when RED tasks all clear, or when full list clears
    if ((redBefore > 0 && redAfter === 0) || allCleared) {
      setRecalStatus("running");
      try {
        await recalibrateOracle(true);
        const newDecree = await getStoreValue<OracleDecree>(`oracle_decree:${getTodayISO()}`);
        if (newDecree) setDecree(newDecree);
        setRecalStatus("done");
        setTimeout(async () => { await refresh(); setRecalStatus("idle"); }, 1500);
      } catch { setRecalStatus("idle"); }
    }
  };

  // Modal submit — logs data AND completes the task
  const handleModalSubmit = async (task: KillTask, value: string | Record<string, string>) => {
    const input = task.completionInput!;
    setModalClearing(true);

    try {
      // Write the input data to the appropriate store
      if (input.type === "doordash" && typeof value === "object") {
        const { hours, revenue } = value as { hours: string; revenue: string };
        await fetch("/api/doordash", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date: getTodayISO(),
            hours: parseFloat(hours),
            revenue: parseFloat(revenue),
            gas: 0, tips: 0, miles: 0,
          }),
        });
        const tel = await getDailyTelemetry();
        tel.doordash_earned += parseFloat(revenue) || 0;
        await saveDailyTelemetry(tel);
      } else if (input.type === "rating" && typeof value === "string") {
        await setStoreValue(input.storeTarget, parseInt(value));
      } else if (typeof value === "string") {
        await setStoreValue(input.storeTarget, value);
      }
    } catch (_e) { /* non-fatal */ }

    setModalTask(null);
    setModalClearing(false);
    await handleComplete(task);
  };

  const updateTelemetry = async (field: keyof DailyTelemetry, value: number) => {
    const newTel = { ...telemetry, [field]: value };
    setTelemetry(newTel);
    await saveDailyTelemetry(newTel);
    refresh();
  };

  const submitDoorDash = async () => {
    if (!ddHours || !ddRevenue) return;
    setDdStatus("Logging...");
    try {
      const res = await fetch("/api/doordash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: getTodayISO(),
          hours: parseFloat(ddHours),
          revenue: parseFloat(ddRevenue),
          gas: 0, tips: 0, miles: 0,
        }),
      });
      if (res.ok) {
        const tel = await getDailyTelemetry();
        tel.doordash_earned += parseFloat(ddRevenue) || 0;
        await saveDailyTelemetry(tel);
        setTelemetry(tel);
        setDdStatus("LOGGED ✓");
        setTimeout(() => { setDdStatus(""); setDdHours(""); setDdRevenue(""); }, 2000);
        refresh();
      } else {
        setDdStatus("FAILED");
      }
    } catch {
      setDdStatus("FAILED");
    }
  };

  const handleRecalibrate = async () => {
    setRecalStatus("running");
    try {
      await recalibrateOracle(true);
      const newDecree = await getStoreValue<OracleDecree>(`oracle_decree:${getTodayISO()}`);
      if (newDecree) setDecree(newDecree);
      setRecalStatus("done");
      await refresh();
      setTimeout(() => setRecalStatus("idle"), 2000);
    } catch {
      setRecalStatus("idle");
    }
  };

  // ── Split tasks ──
  const needleTasks = tasks.filter(isNeedle);
  const infraTasks = tasks.filter(t => !isNeedle(t));

  const groups: { name: string; tasks: KillTask[] }[] = [];
  const groupMap = new Map<string, KillTask[]>();

  for (const task of needleTasks) {
    const key = getGroupKey(task);
    if (!groupMap.has(key)) groupMap.set(key, []);
    groupMap.get(key)!.push(task);
  }

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

  const sfHoursFromLog = trackSummaries.find(t => t.trackName.toUpperCase() === "SWEET FRUSTRATION")?.totalHours || 0;
  const lidHoursFromLog = trackSummaries.find(t => t.trackName.toUpperCase() === "LIKE I DID")?.totalHours || 0;

  const pct = stats.total > 0 ? Math.round((stats.cleared / stats.total) * 100) : 0;
  const statusColor = tasks.some(t => t.urgency === "RED") ? "#FF2D2D"
    : tasks.some(t => t.urgency === "AMBER") ? "#FFB800" : "#22c55e";
  const statusLabel = tasks.some(t => t.urgency === "RED") ? "ACTIVE"
    : tasks.length > 0 ? "CLEARING" : "CLEAR";

  const hour = new Date().getHours();

  if (loading) {
    return (
      <main className="page flex items-center justify-center animate-fade-in">
        <p className="text-[10px] tracking-[0.3em] text-[#333]">DERIVING KILL LIST...</p>
      </main>
    );
  }

  return (
    <main className="page animate-fade-in pb-28">
      {modalTask && !modalClearing && (
        <CompletionModal
          task={modalTask}
          onSubmit={handleModalSubmit}
          onCancel={() => setModalTask(null)}
        />
      )}

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
              Execute
            </h1>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusColor, boxShadow: `0 0 6px ${statusColor}` }} />
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

          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>{stats.cleared}/{stats.total} cleared</span>
            <span className="text-[10px] font-black" style={{ color: statusColor }}>{pct}%</span>
          </div>
          <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${statusColor}80, ${statusColor})`, boxShadow: `0 0 8px ${statusColor}30` }}
            />
          </div>
        </div>

        {/* ── Oracle Decree Banner ── */}
        {decree && <OracleDecreeBanner decree={decree} />}

        {/* ── Track Status Cards ── */}
        <TrackCards />

        {/* ── ONE THING — reads from DailyLog (shared with Today page) ── */}
        <div
          className="mb-5 rounded-xl overflow-hidden"
          style={{
            background: oneThing ? "rgba(212,168,83,0.04)" : "rgba(255,255,255,0.02)",
            border: `1px solid ${oneThing ? "rgba(212,168,83,0.15)" : "rgba(255,255,255,0.06)"}`,
            animation: "killFadeIn 0.25s ease 0.05s both",
          }}
        >
          <div className="px-4 py-3">
            <p className="text-[9px] font-black tracking-[0.2em] uppercase mb-2" style={{ color: oneThing ? "#d4a853" : "rgba(255,255,255,0.25)" }}>
              {oneThing ? "Today's One Thing" : "Set Your Focus"}
            </p>

            {oneThingEditing ? (
              <div className="flex gap-2">
                <input
                  ref={oneThingRef}
                  type="text"
                  value={oneThingDraft}
                  onChange={e => setOneThingDraft(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") saveOneThing(); }}
                  placeholder="What's the one thing today?"
                  className="flex-1 bg-[#0a0a0a] border border-[#222] rounded-lg px-3 py-2.5 text-[13px] font-bold text-white outline-none placeholder-[#333] focus:border-[#d4a853]/30"
                  autoFocus
                />
                <button
                  onClick={saveOneThing}
                  className="px-4 py-2 rounded-lg bg-[#d4a853]/15 border border-[#d4a853]/25 text-[#d4a853] text-[10px] font-black tracking-widest uppercase active:scale-95 transition-all"
                >
                  Set
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setOneThingDraft(oneThing); setOneThingEditing(true); }}
                className="w-full text-left active:scale-[0.99] transition-transform"
                style={{ minHeight: "36px" }}
              >
                {oneThing ? (
                  <p className="text-[15px] font-black text-white leading-snug">{oneThing}</p>
                ) : (
                  <p className="text-[13px] font-bold leading-snug" style={{ color: "rgba(255,255,255,0.25)" }}>
                    Tap to set — everything below serves this.
                  </p>
                )}
              </button>
            )}

            {oneThing && !oneThingEditing && (
              <p className="text-[9px] mt-1.5" style={{ color: "rgba(255,255,255,0.15)" }}>
                Everything below serves this. Tap to change.
              </p>
            )}
          </div>
        </div>

        {/* ── Anti-Drift Telemetry ── */}
        <div className="mb-5 rounded-xl p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[9px] font-black tracking-[0.2em] uppercase" style={{ color: "rgba(255,255,255,0.4)" }}>Anti-Drift Telemetry</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4 border-b border-[#ffffff10] pb-4">
            <div>
              <p className="text-[10px] uppercase font-bold text-white mb-2 opacity-80 text-center">SF Mixdown</p>
              <div className="text-center font-black text-[14px] text-white tabular-nums">
                {sfHoursFromLog} <span className="opacity-40 text-[10px]">/ 11h</span>
              </div>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-white mb-2 opacity-80 text-center">LID Mixdown</p>
              <div className="text-center font-black text-[14px] text-white tabular-nums">
                {lidHoursFromLog} <span className="opacity-40 text-[10px]">/ 11h</span>
              </div>
            </div>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-white mb-2 opacity-80 text-center">DoorDash Earned</p>
            <div className="flex gap-2 mb-3">
              <button onClick={() => updateTelemetry("doordash_earned", telemetry.doordash_earned + 20)} className="flex-1 py-1.5 rounded bg-[#ffffff10] border border-[#ffffff1a] text-[#fff] text-[11px] font-black active:scale-95 transition-transform">+$20</button>
              <button onClick={() => updateTelemetry("doordash_earned", telemetry.doordash_earned + 50)} className="flex-1 py-1.5 rounded bg-[#ffffff10] border border-[#ffffff1a] text-[#fff] text-[11px] font-black active:scale-95 transition-transform">+$50</button>
              <button onClick={() => updateTelemetry("doordash_earned", telemetry.doordash_earned + 100)} className="flex-1 py-1.5 rounded bg-[#ffffff10] border border-[#ffffff1a] text-[#fff] text-[11px] font-black active:scale-95 transition-transform">+$100</button>
            </div>
            <p className="text-center font-black text-[15px] text-white">
              ${telemetry.doordash_earned} <span className="opacity-40 text-[11px]">/ $1,800 target</span>
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
                onOpenModal={setModalTask}
                index={i}
              />
            ))}
          </div>
        )}

        {/* ── INFRASTRUCTURE ── */}
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
                {infraTasks.filter(t => t.howTo.length <= 2).length > 0 && (
                  <span className="text-[8px] font-black px-1.5 py-0.5 rounded" style={{ color: "#22c55e", background: "rgba(34,197,94,0.08)" }}>
                    {infraTasks.filter(t => t.howTo.length <= 2).length} quick wins
                  </span>
                )}
                {infraTasks.some(t => t.urgency === "RED") && (
                  <span className="text-[8px] font-black px-1.5 py-0.5 rounded" style={{ color: "#FF2D2D", background: "rgba(255,45,45,0.12)" }}>
                    {infraTasks.filter(t => t.urgency === "RED").length}
                  </span>
                )}
                <span className="text-[10px] transition-transform duration-200" style={{ color: "rgba(255,255,255,0.15)", transform: infraOpen ? "rotate(180deg)" : "rotate(0deg)" }}>▾</span>
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
                    onOpenModal={setModalTask}
                    index={i}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── All Clear / What's Next ── */}
        {tasks.length === 0 && (
          <div
            className="text-center py-12 rounded-2xl mb-5"
            style={{ background: "rgba(34,197,94,0.04)", border: "1px solid rgba(34,197,94,0.1)", animation: "killFadeIn 0.5s ease both" }}
          >
            <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: "rgba(34,197,94,0.1)", boxShadow: "0 0 24px rgba(34,197,94,0.15)" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="text-sm font-bold" style={{ color: "#22c55e" }}>Kill list clear</p>
            {stats.cleared > 0 && (
              <p className="text-[10px] mt-2" style={{ color: "rgba(255,255,255,0.2)" }}>
                {stats.cleared} task{stats.cleared > 1 ? "s" : ""} cleared today
              </p>
            )}
          </div>
        )}

        {/* What's Next routing — shows when all tasks cleared */}
        {tasks.length === 0 && (
          <div className="space-y-2 mb-5" style={{ animation: "killFadeIn 0.4s ease 0.2s both" }}>
            {hour < 11 && (
              <Link href="/">
                <div className="card !p-4 flex items-center justify-between border-amber-500/20 hover:border-amber-500/40 active:scale-[0.98] transition-all">
                  <div>
                    <p className="text-[11px] font-black text-amber-400">Complete Morning Stack</p>
                    <p className="text-[10px] text-[#555] mt-0.5">Today page → finish the protocol</p>
                  </div>
                  <span className="text-amber-400 font-black">→</span>
                </div>
              </Link>
            )}
            {hour >= 17 && telemetry.doordash_earned === 0 && (
              <div className="card !p-4 flex items-center justify-between border-[#222] active:scale-[0.98] transition-all">
                <div>
                  <p className="text-[11px] font-black text-white">Log DoorDash</p>
                  <p className="text-[10px] text-[#555] mt-0.5">No shift logged today</p>
                </div>
                <button
                  onClick={() => setInfraOpen(true)}
                  className="text-[10px] font-black text-amber-500 tracking-widest"
                >
                  ADD →
                </button>
              </div>
            )}
            {tasks.length === 0 && stats.cleared === 0 && (
              <div className="text-center py-4">
                <p className="text-[11px] font-bold" style={{ color: "rgba(255,255,255,0.25)" }}>
                  Nothing derived. Execute freely.
                </p>
              </div>
            )}
            {tasks.length === 0 && stats.cleared > 0 && (
              <div className="text-center py-4">
                <p className="text-[11px] font-bold" style={{ color: "rgba(255,255,255,0.25)" }}>
                  All clear. Rest or create freely.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── DoorDash Quick-Add ── */}
        <div className="mb-5">
          <div className="flex justify-between items-center mb-2 px-1">
            <h3 className="text-[9px] font-black tracking-[0.2em] uppercase" style={{ color: "rgba(255,255,255,0.25)" }}>Log DoorDash Shift</h3>
            {ddStatus && (
              <span className={`text-[10px] font-black tracking-widest ${ddStatus.includes("✓") ? "text-green-500" : ddStatus === "FAILED" ? "text-red-500" : "text-amber-500"}`}>
                {ddStatus}
              </span>
            )}
          </div>
          <div className="card flex gap-2 p-2">
            <input
              type="number"
              placeholder="Hrs"
              className="flex-1 bg-[#111] rounded-lg p-3 text-center text-sm font-black outline-none border border-transparent focus:border-[#333]"
              value={ddHours}
              onChange={e => setDdHours(e.target.value)}
            />
            <input
              type="number"
              placeholder="$ Rev"
              className="flex-1 bg-[#111] rounded-lg p-3 text-center text-sm font-black outline-none border border-transparent focus:border-[#333]"
              value={ddRevenue}
              onChange={e => setDdRevenue(e.target.value)}
            />
            <button
              onClick={submitDoorDash}
              disabled={!!ddStatus && !ddStatus.includes("✓") && ddStatus !== "FAILED"}
              className="w-12 flex items-center justify-center rounded-lg bg-amber-500 text-black font-black active:scale-95 transition-all text-xl disabled:opacity-50"
            >
              +
            </button>
          </div>
        </div>

        {/* ── Recalibrate Oracle ── */}
        <div className="mb-8 text-center">
          <button
            onClick={handleRecalibrate}
            disabled={recalStatus === "running"}
            className="text-[9px] font-black tracking-[0.2em] uppercase px-4 py-2 rounded-lg transition-all active:scale-95 disabled:opacity-30"
            style={{
              color: "rgba(255,255,255,0.2)",
              border: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            {recalStatus === "running" ? "🔮 RECALIBRATING..." : recalStatus === "done" ? "🔮 DONE ✓" : "🔮 ASK ORACLE"}
          </button>
        </div>

      </div>
    </main>
  );
}
