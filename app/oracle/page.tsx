"use client";

import { useState, useCallback, useEffect } from "react";
import { getStoreValue, setStoreValue, getTodayISO, getDailyTelemetry, type DailyTelemetry } from "@/lib/db";
import { getDynamicReleases, type Release } from "@/lib/releases";
import type { OracleDecree, Realignment } from "@/lib/oracle";
import { getKillStats } from "@/lib/killList";
import { recalibrateOracle } from "@/lib/recalibrate";

// ─── TYPES ──────────────────────────────────────────────────────────

type Pillar = "creative" | "business" | "body";

type StatusEntry = {
  label: string;
  color: string;
  bg: string;
  border: string;
};

const STATUS: Record<string, StatusEntry> = {
  RED:    { label: "RED",    color: "#FF2D2D", bg: "rgba(255,45,45,0.08)",   border: "rgba(255,45,45,0.25)" },
  YELLOW: { label: "YELLOW", color: "#FFB800", bg: "rgba(255,184,0,0.08)",   border: "rgba(255,184,0,0.25)" },
  GREEN:  { label: "GREEN",  color: "#00E676", bg: "rgba(0,230,118,0.08)",   border: "rgba(0,230,118,0.25)" },
};

type ActionItem = {
  id: string;
  title: string;
  subtitle: string;
  pillar: Pillar;
  severity: number;  // 1=YELLOW, 2=AMBER, 3=RED
  cleared: boolean;
};

// ─── MAP DECREE → ACTION CARDS ─────────────────────────────────────

function pillarFromRealignment(r: Realignment & { type: "flag_action" }): Pillar {
  const action = r.action.toLowerCase();
  const reason = r.reason.toLowerCase();
  if (action.includes("studio") || action.includes("session") || action.includes("record") ||
      action.includes("vocal") || action.includes("track") || action.includes("mix") ||
      action.includes("content") || action.includes("reel") || action.includes("compliance") ||
      action.includes("isrc") || action.includes("ascap") || reason.includes("release") ||
      reason.includes("content") || reason.includes("compliance")) return "business";
  if (action.includes("fuel") || action.includes("food") || action.includes("sleep") ||
      action.includes("hydrat") || action.includes("rest") || action.includes("recovery") ||
      action.includes("dairy") || reason.includes("fuel") || reason.includes("body") ||
      reason.includes("burnout") || reason.includes("sleep")) return "body";
  if (action.includes("doordash") || action.includes("selects") || action.includes("revenue") ||
      action.includes("income") || action.includes("outreach") || reason.includes("revenue") ||
      reason.includes("income") || reason.includes("financial")) return "business";
  // Default: creative for remaining items
  return "creative";
}

function decreeToActions(decree: OracleDecree): ActionItem[] {
  const flags = (decree.realignments ?? []).filter(
    (r): r is Realignment & { type: "flag_action" } => r.type === "flag_action"
  );

  if (flags.length === 0) {
    // No explicit flags — create one card from the decree itself
    return [{
      id: "decree_main",
      title: decree.oracle_message,
      subtitle: decree.assessment.slice(0, 120) + (decree.assessment.length > 120 ? "…" : ""),
      pillar: "creative",
      severity: decree.severity === "RED" ? 3 : decree.severity === "AMBER" ? 2 : 1,
      cleared: false,
    }];
  }

  return flags.map((r, i) => ({
    id: `flag_${i}_${r.urgency}`,
    title: r.action,
    subtitle: r.reason,
    pillar: pillarFromRealignment(r),
    severity: r.urgency === "RED" ? 3 : 2,
    cleared: false,
  }));
}

// ─── ASSESSMENT LOGIC ───────────────────────────────────────────────

type Assessment = {
  overall: StatusEntry;
  pillarStatus: Record<string, StatusEntry>;
  narrative: string;
  activeCount: number;
  totalCount: number;
  clearedCount: number;
};

function assess(actions: ActionItem[], decree: OracleDecree | null): Assessment {
  const active = actions.filter((a) => !a.cleared);
  const pillarScores: Record<string, number> = {
    creative: 0, business: 0, body: 0,
  };
  active.forEach((a) => { pillarScores[a.pillar] += a.severity; });

  const pillarStatus: Record<string, StatusEntry> = {};
  Object.entries(pillarScores).forEach(([pillar, score]) => {
    if (score >= 3) pillarStatus[pillar] = STATUS.RED;
    else if (score >= 1) pillarStatus[pillar] = STATUS.YELLOW;
    else pillarStatus[pillar] = STATUS.GREEN;
  });

  const totalSeverity = active.reduce((sum, a) => sum + a.severity, 0);
  let overall: StatusEntry;
  if (active.length === 0) overall = STATUS.GREEN;
  else if (totalSeverity >= 6) overall = STATUS.RED;
  else if (totalSeverity >= 2) overall = STATUS.YELLOW;
  else overall = STATUS.GREEN;

  const clearedCount = actions.filter((a) => a.cleared).length;
  const pct = Math.round((clearedCount / Math.max(actions.length, 1)) * 100);

  let narrative: string;
  if (active.length === 0) {
    narrative = "All pillars stabilized. You're clear to execute at full creative capacity.";
  } else if (decree && active.length === actions.length) {
    // Fresh — use decree assessment directly
    narrative = decree.assessment;
  } else {
    const redPillars = Object.entries(pillarStatus).filter(([,s]) => s.label === "RED").map(([p]) => p);
    const yellowPillars = Object.entries(pillarStatus).filter(([,s]) => s.label === "YELLOW").map(([p]) => p);
    if (redPillars.length > 0) {
      narrative = `${pct}% cleared — ${redPillars.length} pillar${redPillars.length > 1 ? "s" : ""} still RED. ${active.length} action${active.length > 1 ? "s" : ""} remaining.`;
    } else {
      narrative = `Partial recovery — ${yellowPillars.length} pillar${yellowPillars.length > 1 ? "s" : ""} still degraded. ${active.length} action${active.length > 1 ? "s" : ""} remaining. Keep clearing to reach GREEN.`;
    }
  }

  return {
    overall,
    pillarStatus,
    narrative,
    activeCount: active.length,
    totalCount: actions.length,
    clearedCount,
  };
}

// ─── ANIMATIONS ─────────────────────────────────────────────────────

const fadeSlide = (delay = 0): React.CSSProperties => ({
  animation: `fadeSlideIn 0.4s ease ${delay}s both`,
});

const pulseGlow = (color: string): React.CSSProperties => ({
  animation: "pulseGlow 2s ease-in-out infinite",
  // @ts-expect-error CSS custom property
  "--glow-color": color,
});

// ─── COMPONENTS ─────────────────────────────────────────────────────

function PillarIndicator({ name, status }: { name: string; status: StatusEntry }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-2.5 h-2.5 rounded-full"
        style={{
          backgroundColor: status.color,
          boxShadow: `0 0 8px ${status.color}60`,
          ...pulseGlow(status.color),
        }}
      />
      <span className="text-xs font-mono uppercase tracking-widest" style={{ color: status.color, opacity: 0.9 }}>
        {name}
      </span>
    </div>
  );
}

function ActionCard({ action, onClear, index }: { action: ActionItem; onClear: (id: string) => void; index: number }) {
  const [pressing, setPressing] = useState(false);
  const [cleared, setCleared] = useState(false);
  const severity = action.severity === 3 ? STATUS.RED : STATUS.YELLOW;

  const handleClear = () => {
    setCleared(true);
    setTimeout(() => onClear(action.id), 500);
  };

  if (cleared) {
    return (
      <div
        className="rounded-xl p-5 mb-3 overflow-hidden"
        style={{
          background: "rgba(0,230,118,0.06)",
          border: "1px solid rgba(0,230,118,0.2)",
          animation: "clearOut 0.5s ease forwards",
        }}
      >
        <div className="flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00E676" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span className="text-sm font-medium" style={{ color: "#00E676" }}>Cleared — Oracle recalibrating...</span>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={handleClear}
      onMouseDown={() => setPressing(true)}
      onMouseUp={() => setPressing(false)}
      onMouseLeave={() => setPressing(false)}
      onTouchStart={() => setPressing(true)}
      onTouchEnd={() => setPressing(false)}
      className="w-full text-left rounded-xl p-5 mb-3 transition-all duration-200 cursor-pointer"
      style={{
        background: pressing ? severity.bg.replace("0.08", "0.18") : severity.bg,
        border: `1px solid ${severity.border}`,
        transform: pressing ? "scale(0.98)" : "scale(1)",
        ...fadeSlide(index * 0.08),
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="text-sm font-semibold text-white leading-snug mb-1.5">{action.title}</p>
          <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>{action.subtitle}</p>
        </div>
        <div
          className="mt-1 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
          style={{ border: `1.5px solid ${severity.color}40`, background: `${severity.color}10` }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={severity.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}>
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <span className="text-xs font-mono uppercase tracking-wider" style={{ color: severity.color, opacity: 0.7 }}>
          {action.pillar}
        </span>
        <span style={{ color: "rgba(255,255,255,0.15)" }}>•</span>
        <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>Tap to clear</span>
      </div>
    </button>
  );
}

function ClearedCard({ action, index }: { action: ActionItem; index: number }) {
  return (
    <div
      className="rounded-xl p-4 mb-3"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
        ...fadeSlide(index * 0.05),
      }}
    >
      <div className="flex items-center gap-2.5">
        <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "rgba(0,230,118,0.15)" }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#00E676" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <p className="text-sm line-through" style={{ color: "rgba(255,255,255,0.3)" }}>{action.title}</p>
      </div>
    </div>
  );
}

// ─── MAIN ORACLE VIEW ───────────────────────────────────────────────

const CLEARED_KEY = "oracle_cleared_actions";

export default function OraclePage() {
  const [decree, setDecree] = useState<OracleDecree | null>(null);
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [recalibrating, setRecalibrating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [killStats, setKillStats] = useState({ active: 0, total: 0 });
  const [telemetry, setTelemetry] = useState<DailyTelemetry | null>(null);
  const [nextRelease, setNextRelease] = useState<Release | null>(null);

  const loadDecree = useCallback(async () => {
    const today = getTodayISO();
    let stored = await getStoreValue<OracleDecree>(`oracle_decree:${today}`);
    
    if (!stored) {
      setRecalibrating(true);
      try {
        await recalibrateOracle();
        stored = await getStoreValue<OracleDecree>(`oracle_decree:${today}`);
      } catch (e) {
        console.error("Auto-recalibration failed:", e);
      }
      setRecalibrating(false);
    }

    const clearedIds = await getStoreValue<string[]>(CLEARED_KEY) ?? [];
    const stats = await getKillStats();
    
    // Fetch telemetry for context snapshot
    const tel = await getDailyTelemetry();
    const rels = await getDynamicReleases();
    setTelemetry(tel);
    setNextRelease(rels.find((r) => r.status !== "live") || null);

    if (stored) {
      setDecree(stored);
      const baseActions = decreeToActions(stored).map((a) => ({
        ...a,
        cleared: clearedIds.includes(a.id),
      }));
      setActions(baseActions);
      setAssessment(assess(baseActions, stored));
    }
    setKillStats({ active: stats.total - stats.cleared, total: stats.total });
    setLoading(false);
  }, []);

  // Load on mount
  useEffect(() => { loadDecree(); }, [loadDecree]);

  // Re-sync whenever you switch back to this tab (picks up recalibrations from Log page)
  useEffect(() => {
    const onVisible = () => { if (document.visibilityState === "visible") loadDecree(); };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [loadDecree]);

  const handleClear = useCallback((id: string) => {
    setRecalibrating(true);
    setActions((prev) => {
      const updated = prev.map((a) => (a.id === id ? { ...a, cleared: true } : a));
      const clearedIds = updated.filter((a) => a.cleared).map((a) => a.id);
      setStoreValue(CLEARED_KEY, clearedIds);
      setTimeout(() => {
        setAssessment(assess(updated, decree));
        setRecalibrating(false);
      }, 600);
      return updated;
    });
  }, [decree]);

  const handleReset = () => {
    if (!decree) return;
    const fresh = decreeToActions(decree);
    setActions(fresh);
    setAssessment(assess(fresh, decree));
    setStoreValue(CLEARED_KEY, []);
  };

  const activeActions = actions.filter((a) => !a.cleared);
  const clearedActions = actions.filter((a) => a.cleared);
  const overall = assessment?.overall ?? STATUS.GREEN;

  return (
    <main className="page animate-fade-in">
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes clearOut {
          0% { opacity: 1; transform: translateX(0); max-height: 120px; }
          60% { opacity: 0; transform: translateX(40px); max-height: 120px; }
          100% { opacity: 0; transform: translateX(40px); max-height: 0; padding: 0; margin: 0; border: 0; }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 4px var(--glow-color, #fff); }
          50% { box-shadow: 0 0 12px var(--glow-color, #fff); }
        }
        @keyframes recalPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes statusShift {
          from { opacity: 0; filter: blur(4px); }
          to { opacity: 1; filter: blur(0); }
        }
      `}</style>

      <div className="page-inner">

        {/* ─── HEADER ─── */}
        <div className="mb-8" style={fadeSlide(0)}>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xs font-mono uppercase tracking-[0.3em]" style={{ color: "rgba(255,255,255,0.35)" }}>
              Oracle
            </h1>
            <div className="flex items-center gap-1.5">
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: overall.color, boxShadow: `0 0 6px ${overall.color}` }}
              />
              <span
                className="text-xs font-mono font-bold tracking-wider"
                style={{
                  color: overall.color,
                  animation: recalibrating ? "recalPulse 0.6s ease infinite" : "statusShift 0.4s ease",
                }}
              >
                {recalibrating ? "RECALIBRATING..." : overall.label}
              </span>
            </div>
          </div>

          {/* Pillar Row */}
          {assessment && (
            <div className="flex gap-5 mb-6 pb-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {Object.entries(assessment.pillarStatus).map(([pillar, status]) => (
                <PillarIndicator key={pillar} name={pillar} status={status} />
              ))}
            </div>
          )}
        </div>

        {/* ─── LOADING ─── */}
        {loading && (
          <div className="text-center py-12" style={{ color: "rgba(255,255,255,0.3)" }}>
            <p className="text-xs font-mono uppercase tracking-widest">Loading decree...</p>
          </div>
        )}

        {/* ─── NO DECREE YET ─── */}
        {!loading && !decree && (
          <div
            className="rounded-2xl p-8 text-center"
            style={{ background: "rgba(255,184,0,0.04)", border: "1px solid rgba(255,184,0,0.15)" }}
          >
            <p className="text-sm font-medium mb-2" style={{ color: "#FFB800" }}>No decree yet today</p>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
              Hit Recalibrate from the Log page to get your Oracle reading.
            </p>
          </div>
        )}

        {/* ─── ASSESSMENT ─── */}
        {assessment && !loading && (
          <>
            <div className="mb-8" style={fadeSlide(0.1)}>
              <h2 className="text-xs font-mono uppercase tracking-[0.25em] mb-3" style={{ color: "rgba(255,255,255,0.3)" }}>
                Assessment
              </h2>
              <p
                className="text-sm leading-relaxed whitespace-pre-wrap"
                style={{
                  color: "rgba(255,255,255,0.7)",
                  animation: recalibrating ? "recalPulse 0.6s ease infinite" : "statusShift 0.5s ease",
                }}
              >
                {assessment.narrative}
              </p>
            </div>

            {/* ─── DECREE ─── */}
            {decree && (
              <div
                className="rounded-xl p-5 mb-8"
                style={{
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  ...fadeSlide(0.12),
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-mono uppercase tracking-wider px-2 py-0.5 rounded" style={{ background: `${overall.color}20`, color: overall.color }}>
                    {decree.severity}
                  </span>
                  <span className="text-xs font-mono uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.25)" }}>
                    Oracle Decree
                  </span>
                </div>
                <p className="text-sm font-semibold text-white leading-relaxed">{decree.oracle_message}</p>
              </div>
            )}

            {/* ─── PROGRESS BAR ─── */}
            {actions.length > 0 && (
              <div className="mb-8" style={fadeSlide(0.15)}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                    {assessment.clearedCount}/{assessment.totalCount} cleared
                  </span>
                  <span className="text-xs font-mono" style={{ color: overall.color }}>
                    {Math.round((assessment.clearedCount / assessment.totalCount) * 100)}%
                  </span>
                </div>
                <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${(assessment.clearedCount / assessment.totalCount) * 100}%`,
                      background: `linear-gradient(90deg, ${overall.color}80, ${overall.color})`,
                      boxShadow: `0 0 8px ${overall.color}40`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* ─── ACTION REQUIRED ─── */}
            {activeActions.length > 0 && (
              <div className="mb-8" style={fadeSlide(0.2)}>
                <h2 className="text-xs font-mono uppercase tracking-[0.25em] mb-4" style={{ color: overall.color }}>
                  Action Required
                </h2>
                {activeActions.map((action, i) => (
                  <ActionCard key={action.id} action={action} onClear={handleClear} index={i} />
                ))}
              </div>
            )}

            {/* ─── CLEARED ─── */}
            {clearedActions.length > 0 && (
              <div className="mb-8" style={fadeSlide(0.25)}>
                <h2 className="text-xs font-mono uppercase tracking-[0.25em] mb-4" style={{ color: "rgba(255,255,255,0.2)" }}>
                  Cleared
                </h2>
                {clearedActions.map((action, i) => (
                  <ClearedCard key={action.id} action={action} index={i} />
                ))}
              </div>
            )}

            {/* ─── CONTINUITY / ALL CLEAR STATE ─── */}
            {activeActions.length === 0 && actions.length > 0 && (
              <div
                className="text-center py-10 rounded-2xl mb-8"
                style={{
                  background: killStats.active > 0 ? "rgba(255,255,255,0.02)" : "rgba(0,230,118,0.04)",
                  border: killStats.active > 0 ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,230,118,0.1)",
                  animation: "fadeSlideIn 0.6s ease both",
                }}
              >
                {killStats.active > 0 ? (
                  <>
                    <h3 className="text-xs font-mono uppercase tracking-[0.2em] mb-3" style={{ color: "rgba(255,255,255,0.3)" }}>
                      Oracle Status Check
                    </h3>
                    <p className="text-sm font-semibold text-white mb-1">Pillars stabilized.</p>
                    <p className="text-xs mb-5" style={{ color: "rgba(255,255,255,0.5)" }}>
                      But you still have <strong style={{ color: "#FFB800" }}>{killStats.active} tasks</strong> remaining on the Kill List based on your current trajectory.
                    </p>
                    <a
                      href="/kill"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-all"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white" }}
                    >
                      <span>Execute Kill List</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </a>
                  </>
                ) : (
                  <>
                    <div
                      className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center"
                      style={{ background: "rgba(0,230,118,0.1)", boxShadow: "0 0 24px rgba(0,230,118,0.15)" }}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00E676" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium" style={{ color: "#00E676" }}>All systems clear</p>
                    <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>Kill list and Oracle both clear. Execute freely.</p>
                  </>
                )}
              </div>
            )}

            {/* ─── SYSTEM SNAPSHOT ─── */}
            {telemetry && nextRelease && (
              <div className="mb-8" style={fadeSlide(0.3)}>
                <h2 className="text-xs font-mono uppercase tracking-[0.25em] mb-4" style={{ color: "rgba(255,255,255,0.2)" }}>
                  System Snapshot
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <p className="text-[10px] font-black tracking-widest uppercase mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>Core Drive matrix</p>
                    <p className={`text-sm font-bold ${nextRelease.contentDeliverables.coreDriveComplete ? "text-green-400" : "text-amber-500"}`}>
                      {nextRelease.contentDeliverables.coreDriveComplete ? "Generated ✓" : "Pending"}
                    </p>
                  </div>
                  <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <p className="text-[10px] font-black tracking-widest uppercase mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>Income Bridge</p>
                    <p className="text-sm font-bold text-white">${telemetry.doordash_earned} <span className="text-[10px] opacity-40">earned</span></p>
                  </div>
                  <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <p className="text-[10px] font-black tracking-widest uppercase mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>Campaign Kit</p>
                    <p className={`text-sm font-bold ${nextRelease.contentDeliverables.campaignKitGenerated ? "text-green-400" : "text-amber-500"}`}>
                      {nextRelease.contentDeliverables.campaignKitGenerated ? "Generated ✓" : "Pending"}
                    </p>
                  </div>
                  <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <p className="text-[10px] font-black tracking-widest uppercase mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>Mixdown Engine</p>
                    <p className="text-sm font-bold text-white">Auto-tracking</p>
                  </div>
                </div>
              </div>
            )}

            {/* ─── RESET ─── */}
            {clearedActions.length > 0 && (
              <div className="text-center">
                <button
                  onClick={handleReset}
                  className="text-xs font-mono uppercase tracking-wider px-4 py-2 rounded-lg transition-all duration-200"
                  style={{ color: "rgba(255,255,255,0.25)", border: "1px solid rgba(255,255,255,0.08)", background: "transparent" }}
                  onMouseEnter={(e) => { (e.target as HTMLElement).style.borderColor = "rgba(255,255,255,0.15)"; (e.target as HTMLElement).style.color = "rgba(255,255,255,0.4)"; }}
                  onMouseLeave={(e) => { (e.target as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; (e.target as HTMLElement).style.color = "rgba(255,255,255,0.25)"; }}
                >
                  Reset Oracle
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
