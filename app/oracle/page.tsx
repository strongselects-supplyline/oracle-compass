"use client";

import { useState, useCallback } from "react";

// ─── ORACLE ASSESSMENT ENGINE ───────────────────────────────────────
// Pillar weights and scoring logic. Each action item maps to a pillar
// and has a severity. Clearing items triggers full reassessment.

const PILLARS = {
  CREATIVE: "creative",
  BUSINESS: "business",
  BODY: "body",
} as const;

type Pillar = (typeof PILLARS)[keyof typeof PILLARS];

type StatusEntry = {
  label: string;
  color: string;
  bg: string;
  border: string;
};

const STATUS: Record<string, StatusEntry> = {
  RED: { label: "RED", color: "#FF2D2D", bg: "rgba(255,45,45,0.08)", border: "rgba(255,45,45,0.25)" },
  YELLOW: { label: "YELLOW", color: "#FFB800", bg: "rgba(255,184,0,0.08)", border: "rgba(255,184,0,0.25)" },
  GREEN: { label: "GREEN", color: "#00E676", bg: "rgba(0,230,118,0.08)", border: "rgba(0,230,118,0.25)" },
};

type ActionItem = {
  id: string;
  title: string;
  subtitle: string;
  pillar: Pillar;
  severity: number;
  cleared: boolean;
};

const INITIAL_ACTIONS: ActionItem[] = [
  {
    id: "compliance",
    title: "Complete SEE ME compliance (ISRC, ASCAP, MLC, Songtrust) before end of today",
    subtitle: "Release in 9 days with zero compliance completed - this will delay the release",
    pillar: PILLARS.BUSINESS,
    severity: 3,
    cleared: false,
  },
  {
    id: "fuel",
    title: "Fuel immediately - you're 2 hours into studio with zero nutrition",
    subtitle: "Running 6-hour creative block on empty fuel will crash productivity and vocal quality",
    pillar: PILLARS.BODY,
    severity: 3,
    cleared: false,
  },
  {
    id: "session_quality",
    title: "Log session quality metrics before next track",
    subtitle: "Zero session data logged today - Oracle is flying blind on creative output",
    pillar: PILLARS.CREATIVE,
    severity: 2,
    cleared: false,
  },
  {
    id: "outreach",
    title: "Send 3 outreach messages to restart income pipeline",
    subtitle: "Income stalled at $0 across both streams - business declared priority but zero action",
    pillar: PILLARS.BUSINESS,
    severity: 2,
    cleared: false,
  },
];

// ─── ASSESSMENT LOGIC ───────────────────────────────────────────────
type Assessment = {
  overall: StatusEntry;
  pillarStatus: Record<string, StatusEntry>;
  narrative: string;
  activeCount: number;
  totalCount: number;
  clearedCount: number;
};

function assess(actions: ActionItem[]): Assessment {
  const active = actions.filter((a) => !a.cleared);
  const pillarScores: Record<string, number> = {
    [PILLARS.CREATIVE]: 0,
    [PILLARS.BUSINESS]: 0,
    [PILLARS.BODY]: 0,
  };

  active.forEach((a) => {
    pillarScores[a.pillar] += a.severity;
  });

  const pillarStatus: Record<string, StatusEntry> = {};
  Object.entries(pillarScores).forEach(([pillar, score]) => {
    if (score >= 3) pillarStatus[pillar] = STATUS.RED;
    else if (score >= 1) pillarStatus[pillar] = STATUS.YELLOW;
    else pillarStatus[pillar] = STATUS.GREEN;
  });

  const totalSeverity = active.reduce((sum, a) => sum + a.severity, 0);
  let overall: StatusEntry;
  if (totalSeverity >= 6) overall = STATUS.RED;
  else if (totalSeverity >= 3) overall = STATUS.YELLOW;
  else overall = STATUS.GREEN;

  const narratives: Record<string, string> = {
    RED: generateRedNarrative(active, pillarStatus),
    YELLOW: generateYellowNarrative(active, pillarStatus),
    GREEN: "All pillars stabilized. You're clear to execute at full creative capacity.",
  };

  return {
    overall,
    pillarStatus,
    narrative: narratives[overall.label],
    activeCount: active.length,
    totalCount: actions.length,
    clearedCount: actions.filter((a) => a.cleared).length,
  };
}

function generateRedNarrative(active: ActionItem[], pillarStatus: Record<string, StatusEntry>) {
  const redPillars = Object.entries(pillarStatus)
    .filter(([, s]) => s.label === "RED")
    .map(([p]) => p);
  const count = redPillars.length;
  return `RED collapse across ${count} pillar${count > 1 ? "s" : ""}. ${active.length} unresolved actions blocking forward momentum. Clear the critical items to recalibrate.`;
}

function generateYellowNarrative(active: ActionItem[], pillarStatus: Record<string, StatusEntry>) {
  const yellowPillars = Object.entries(pillarStatus)
    .filter(([, s]) => s.label === "YELLOW")
    .map(([p]) => p);
  return `Partial recovery — ${yellowPillars.length} pillar${yellowPillars.length > 1 ? "s" : ""} still degraded. ${active.length} action${active.length > 1 ? "s" : ""} remaining. Keep clearing to reach GREEN.`;
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
      <span
        className="text-xs font-mono uppercase tracking-widest"
        style={{ color: status.color, opacity: 0.9 }}
      >
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
          <span className="text-sm font-medium" style={{ color: "#00E676" }}>
            Cleared — Oracle recalibrating...
          </span>
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
          <p className="text-sm font-semibold text-white leading-snug mb-1.5">
            {action.title}
          </p>
          <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
            {action.subtitle}
          </p>
        </div>
        <div
          className="mt-1 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
          style={{
            border: `1.5px solid ${severity.color}40`,
            background: `${severity.color}10`,
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={severity.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}>
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <span
          className="text-xs font-mono uppercase tracking-wider"
          style={{ color: severity.color, opacity: 0.7 }}
        >
          {action.pillar}
        </span>
        <span style={{ color: "rgba(255,255,255,0.15)" }}>•</span>
        <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
          Tap to clear
        </span>
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
        <div
          className="w-5 h-5 rounded-full flex items-center justify-center"
          style={{ background: "rgba(0,230,118,0.15)" }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#00E676" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <p className="text-sm line-through" style={{ color: "rgba(255,255,255,0.3)" }}>
          {action.title}
        </p>
      </div>
    </div>
  );
}

// ─── MAIN ORACLE VIEW ───────────────────────────────────────────────

export default function OraclePage() {
  const [actions, setActions] = useState(INITIAL_ACTIONS);
  const [assessment, setAssessment] = useState(() => assess(INITIAL_ACTIONS));
  const [recalibrating, setRecalibrating] = useState(false);

  const handleClear = useCallback((id: string) => {
    setRecalibrating(true);
    setActions((prev) => {
      const updated = prev.map((a) => (a.id === id ? { ...a, cleared: true } : a));
      setTimeout(() => {
        setAssessment(assess(updated));
        setRecalibrating(false);
      }, 600);
      return updated;
    });
  }, []);

  const handleReset = () => {
    setActions(INITIAL_ACTIONS);
    setAssessment(assess(INITIAL_ACTIONS));
  };

  const activeActions = actions.filter((a) => !a.cleared);
  const clearedActions = actions.filter((a) => a.cleared);
  const overall = assessment.overall;

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
            <h1
              className="text-xs font-mono uppercase tracking-[0.3em]"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              Oracle
            </h1>
            <div className="flex items-center gap-1.5">
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: overall.color,
                  boxShadow: `0 0 6px ${overall.color}`,
                }}
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
          <div
            className="flex gap-5 mb-6 pb-5"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            {Object.entries(assessment.pillarStatus).map(([pillar, status]) => (
              <PillarIndicator key={pillar} name={pillar} status={status} />
            ))}
          </div>
        </div>

        {/* ─── ASSESSMENT ─── */}
        <div className="mb-8" style={fadeSlide(0.1)}>
          <h2
            className="text-xs font-mono uppercase tracking-[0.25em] mb-3"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            Assessment
          </h2>
          <p
            className="text-sm leading-relaxed"
            style={{
              color: "rgba(255,255,255,0.6)",
              animation: recalibrating ? "recalPulse 0.6s ease infinite" : "statusShift 0.5s ease",
            }}
          >
            {assessment.narrative}
          </p>
        </div>

        {/* ─── PROGRESS BAR ─── */}
        <div className="mb-8" style={fadeSlide(0.15)}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
              {assessment.clearedCount}/{assessment.totalCount} cleared
            </span>
            <span className="text-xs font-mono" style={{ color: overall.color }}>
              {Math.round((assessment.clearedCount / assessment.totalCount) * 100)}%
            </span>
          </div>
          <div
            className="h-1 rounded-full overflow-hidden"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
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

        {/* ─── ACTION REQUIRED ─── */}
        {activeActions.length > 0 && (
          <div className="mb-8" style={fadeSlide(0.2)}>
            <h2
              className="text-xs font-mono uppercase tracking-[0.25em] mb-4"
              style={{ color: overall.color }}
            >
              Action Required
            </h2>
            {activeActions.map((action, i) => (
              <ActionCard
                key={action.id}
                action={action}
                onClear={handleClear}
                index={i}
              />
            ))}
          </div>
        )}

        {/* ─── CLEARED ─── */}
        {clearedActions.length > 0 && (
          <div className="mb-8" style={fadeSlide(0.25)}>
            <h2
              className="text-xs font-mono uppercase tracking-[0.25em] mb-4"
              style={{ color: "rgba(255,255,255,0.2)" }}
            >
              Cleared
            </h2>
            {clearedActions.map((action, i) => (
              <ClearedCard key={action.id} action={action} index={i} />
            ))}
          </div>
        )}

        {/* ─── ALL CLEAR STATE ─── */}
        {activeActions.length === 0 && (
          <div
            className="text-center py-12 rounded-2xl mb-8"
            style={{
              background: "rgba(0,230,118,0.04)",
              border: "1px solid rgba(0,230,118,0.1)",
              animation: "fadeSlideIn 0.6s ease both",
            }}
          >
            <div
              className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{
                background: "rgba(0,230,118,0.1)",
                boxShadow: "0 0 24px rgba(0,230,118,0.15)",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00E676" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="text-sm font-medium" style={{ color: "#00E676" }}>
              All pillars GREEN
            </p>
            <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>
              Full creative capacity unlocked. Execute.
            </p>
          </div>
        )}

        {/* ─── RESET (for testing / demo) ─── */}
        {clearedActions.length > 0 && (
          <div className="text-center">
            <button
              onClick={handleReset}
              className="text-xs font-mono uppercase tracking-wider px-4 py-2 rounded-lg transition-all duration-200"
              style={{
                color: "rgba(255,255,255,0.25)",
                border: "1px solid rgba(255,255,255,0.08)",
                background: "transparent",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.borderColor = "rgba(255,255,255,0.15)";
                (e.target as HTMLElement).style.color = "rgba(255,255,255,0.4)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
                (e.target as HTMLElement).style.color = "rgba(255,255,255,0.25)";
              }}
            >
              Reset Oracle
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
