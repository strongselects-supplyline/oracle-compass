"use client";

// app/pipeline/page.tsx
// Pipeline Dashboard — the spine of Oracle Compass.
// Shows every active release's position in the per-release pipeline.
// Tapping a release expands it to show the full checklist.
// This is the home page tab. The pipeline IS the work.

import { useState, useEffect, useCallback } from "react";
import { getDynamicReleases, Release } from "@/lib/releases";
import {
  PIPELINE_PHASES,
  TOTAL_PIPELINE_STEPS,
  getCurrentPhase,
  getNextStep,
  getCompletedCount,
  isPhaseComplete,
  togglePipelineStep,
  PipelineState,
} from "@/lib/pipeline";

// ── Helpers ───────────────────────────────────────────────────────────

function fmtDate(d: string): string {
  return new Date(d + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function daysUntil(dateStr: string): number {
  const d = new Date(dateStr + "T00:00:00");
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.ceil((d.getTime() - now.getTime()) / 86400000);
}

function getStatusColor(status: string): string {
  if (status === "live") return "#22c55e";
  if (status === "upload_pending") return "#eab308";
  return "#555";
}

// ── Phase progress bar ─────────────────────────────────────────────────

function PhaseBar({ phaseId, state }: { phaseId: number; state: PipelineState }) {
  const phase = PIPELINE_PHASES.find((p) => p.id === phaseId)!;
  const done = phase.steps.filter((s) => state[s.id]).length;
  const pct = Math.round((done / phase.steps.length) * 100);
  return (
    <div
      style={{ width: `${pct}%`, background: phase.color, height: "100%", borderRadius: 9999, transition: "width 0.3s ease" }}
    />
  );
}

// ── Collapsed phase row ────────────────────────────────────────────────

function CollapsedPhase({ phase }: { phase: typeof PIPELINE_PHASES[0] }) {
  return (
    <div
      style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderBottom: "1px solid var(--border)" }}
    >
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: "#22c55e22",
          border: "1px solid #22c55e44",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 11,
          flexShrink: 0,
        }}
      >
        ✓
      </div>
      <div style={{ flex: 1, height: 1, background: "#22c55e33", borderRadius: 9999 }} />
      <span
        style={{
          fontSize: 9,
          fontWeight: 900,
          letterSpacing: "0.15em",
          color: "#22c55e88",
          textTransform: "uppercase",
        }}
      >
        {phase.icon} {phase.name}
      </span>
    </div>
  );
}

// ── Future/locked phase row ────────────────────────────────────────────

function LockedPhase({ phase }: { phase: typeof PIPELINE_PHASES[0] }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 12px",
        borderRadius: 8,
        background: "rgba(255,255,255,0.02)",
        marginBottom: 4,
        opacity: 0.4,
      }}
    >
      <span style={{ fontSize: 14 }}>{phase.icon}</span>
      <div style={{ flex: 1 }}>
        <span
          style={{
            fontSize: 9,
            fontWeight: 900,
            letterSpacing: "0.15em",
            color: "var(--text-muted)",
            textTransform: "uppercase",
          }}
        >
          {phase.name}
        </span>
        <span
          style={{
            marginLeft: 8,
            fontSize: 9,
            color: "var(--text-muted)",
          }}
        >
          {phase.steps.length} steps
        </span>
      </div>
      <span style={{ fontSize: 10, color: "var(--text-muted)" }}>🔒</span>
    </div>
  );
}

// ── Step checkbox ─────────────────────────────────────────────────────

function StepCheckbox({
  stepId,
  label,
  doneWhen,
  tools,
  checked,
  onToggle,
}: {
  stepId: string;
  label: string;
  doneWhen: string;
  tools?: string;
  checked: boolean;
  onToggle: () => void;
}) {
  const [bounce, setBounce] = useState(false);

  const handleTap = useCallback(() => {
    if (checked) return; // no unchecking — forward only per spec
    setBounce(true);
    setTimeout(() => setBounce(false), 200);
    onToggle();
  }, [checked, onToggle]);

  return (
    <button
      onClick={handleTap}
      disabled={checked}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        padding: "10px 0",
        borderBottom: "1px solid var(--border)",
        background: "none",
        border: "none",
        width: "100%",
        textAlign: "left",
        cursor: checked ? "default" : "pointer",
        minHeight: 44,
        transition: "opacity 0.2s ease",
        opacity: checked ? 0.55 : 1,
      }}
    >
      {/* Checkbox */}
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: 6,
          border: checked ? "none" : "1.5px solid var(--border)",
          background: checked ? "#22c55e" : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          marginTop: 2,
          transform: bounce ? "scale(1.25)" : "scale(1)",
          transition: "transform 0.2s cubic-bezier(0.34,1.56,0.64,1), background 0.15s ease",
        }}
      >
        {checked && (
          <span style={{ color: "white", fontSize: 11, fontWeight: 900 }}>✓</span>
        )}
      </div>
      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: checked ? "var(--text-muted)" : "var(--text-primary)",
            textDecoration: checked ? "line-through" : "none",
            lineHeight: 1.3,
          }}
        >
          <span
            style={{
              fontSize: 9,
              fontWeight: 900,
              color: "var(--text-muted)",
              marginRight: 6,
              letterSpacing: "0.05em",
            }}
          >
            {stepId}
          </span>
          {label}
        </div>
        <div
          style={{
            fontSize: 9,
            color: "var(--text-muted)",
            marginTop: 2,
            lineHeight: 1.4,
          }}
        >
          {doneWhen}
          {tools && (
            <span style={{ color: "#555", marginLeft: 4 }}>· {tools}</span>
          )}
        </div>
      </div>
    </button>
  );
}

// ── Active phase block ─────────────────────────────────────────────────

function ActivePhase({
  phase,
  state,
  onToggle,
}: {
  phase: typeof PIPELINE_PHASES[0];
  state: PipelineState;
  onToggle: (stepId: string) => void;
}) {
  const done = phase.steps.filter((s) => state[s.id]).length;
  const total = phase.steps.length;

  return (
    <div
      style={{
        borderRadius: 10,
        border: `1px solid ${phase.color}44`,
        background: `${phase.color}08`,
        padding: "12px 12px 4px",
        marginBottom: 8,
      }}
    >
      {/* Phase header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 16 }}>{phase.icon}</span>
        <span
          style={{
            fontSize: 10,
            fontWeight: 900,
            letterSpacing: "0.15em",
            color: phase.color,
            textTransform: "uppercase",
            flex: 1,
          }}
        >
          {phase.name}
        </span>
        <span style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 700 }}>
          {done}/{total}
        </span>
      </div>
      {/* Mini progress bar */}
      <div style={{ height: 2, background: "var(--surface-2)", borderRadius: 9999, marginBottom: 10, overflow: "hidden" }}>
        <PhaseBar phaseId={phase.id} state={state} />
      </div>
      {/* Steps */}
      {phase.steps.map((step) => (
        <StepCheckbox
          key={step.id}
          stepId={step.id}
          label={step.label}
          doneWhen={step.doneWhen}
          tools={step.tools}
          checked={!!state[step.id]}
          onToggle={() => onToggle(step.id)}
        />
      ))}
    </div>
  );
}

// ── Release card (expanded) ────────────────────────────────────────────

function ReleaseCardExpanded({
  release,
  onToggle,
  onCollapse,
}: {
  release: Release;
  onToggle: (stepId: string) => void;
  onCollapse: () => void;
}) {
  const state = release.pipelineState || {};
  const completed = getCompletedCount(state);
  const pct = Math.round((completed / TOTAL_PIPELINE_STEPS) * 100);
  const currentPhase = getCurrentPhase(state);

  return (
    <div
      className="card"
      style={{
        marginBottom: 12,
        animation: "pipelineFadeIn 0.25s ease both",
      }}
    >
      {/* Header */}
      <button
        onClick={onCollapse}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          width: "100%",
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          marginBottom: 14,
          textAlign: "left",
          minHeight: 44,
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 900,
              color: "var(--text-primary)",
              letterSpacing: "0.03em",
              lineHeight: 1.2,
            }}
          >
            {release.title}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
            <span
              style={{
                fontSize: 9,
                fontWeight: 900,
                letterSpacing: "0.12em",
                color: currentPhase.color,
                textTransform: "uppercase",
                background: `${currentPhase.color}18`,
                padding: "2px 6px",
                borderRadius: 4,
              }}
            >
              {currentPhase.icon} {currentPhase.name}
            </span>
            <span style={{ fontSize: 9, color: "var(--text-muted)" }}>
              {completed}/{TOTAL_PIPELINE_STEPS} · {pct}%
            </span>
          </div>
        </div>
        <span style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 700 }}>▲</span>
      </button>

      {/* Full pipeline phase list */}
      {PIPELINE_PHASES.map((phase) => {
        const complete = isPhaseComplete(state, phase.id);
        const isActive = currentPhase.id === phase.id;
        const isPrior = phase.id < currentPhase.id;
        const isFuture = phase.id > currentPhase.id;

        if (complete || (isPrior && complete)) {
          return <CollapsedPhase key={phase.id} phase={phase} />;
        }
        if (isActive) {
          return (
            <ActivePhase
              key={phase.id}
              phase={phase}
              state={state}
              onToggle={onToggle}
            />
          );
        }
        if (isFuture) {
          return <LockedPhase key={phase.id} phase={phase} />;
        }
        return null;
      })}
    </div>
  );
}

// ── Release card (collapsed) ───────────────────────────────────────────

function ReleaseCardCollapsed({
  release,
  onExpand,
}: {
  release: Release;
  onExpand: () => void;
}) {
  const state = release.pipelineState || {};
  const completed = getCompletedCount(state);
  const pct = Math.round((completed / TOTAL_PIPELINE_STEPS) * 100);
  const currentPhase = getCurrentPhase(state);
  const nextStep = getNextStep(state);
  const days = daysUntil(release.releaseDate);
  const daysColor =
    days <= 0 ? "#22c55e" : days <= 3 ? "#ef4444" : days <= 7 ? "#eab308" : "var(--text-muted)";

  return (
    <button
      onClick={onExpand}
      className="card"
      style={{
        display: "block",
        width: "100%",
        textAlign: "left",
        marginBottom: 10,
        cursor: "pointer",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
        animation: "pipelineFadeIn 0.25s ease both",
        minHeight: 44,
      }}
      onMouseDown={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.98)";
      }}
      onMouseUp={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
      }}
      onTouchStart={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.98)";
      }}
      onTouchEnd={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
      }}
    >
      {/* Row: title + phase badge + days */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
        <div style={{ flex: 1, minWidth: 0, marginRight: 8 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 900,
              color: "var(--text-primary)",
              letterSpacing: "0.03em",
              lineHeight: 1.2,
              marginBottom: 4,
            }}
          >
            {release.title}
          </div>
          <span
            style={{
              display: "inline-block",
              fontSize: 9,
              fontWeight: 900,
              letterSpacing: "0.12em",
              color: currentPhase.color,
              textTransform: "uppercase",
              background: `${currentPhase.color}18`,
              padding: "2px 6px",
              borderRadius: 4,
            }}
          >
            {currentPhase.icon} {currentPhase.name}
          </span>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 900, color: daysColor }}>
            {days <= 0 ? "LIVE" : `${days}d`}
          </div>
          <div style={{ fontSize: 9, color: "var(--text-muted)" }}>{fmtDate(release.releaseDate)}</div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 3, background: "var(--surface-2)", borderRadius: 9999, overflow: "hidden", marginBottom: 6 }}>
        <div
          style={{
            width: `${pct}%`,
            background: currentPhase.color,
            height: "100%",
            borderRadius: 9999,
            transition: "width 0.4s ease",
          }}
        />
      </div>

      {/* Next step + completion */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div
          style={{
            fontSize: 9,
            color: "var(--text-muted)",
            flex: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            marginRight: 8,
          }}
        >
          {nextStep ? (
            <>
              <span style={{ color: currentPhase.color, fontWeight: 700 }}>→ </span>
              {nextStep.label}
            </>
          ) : (
            <span style={{ color: "#22c55e", fontWeight: 700 }}>✓ All steps complete</span>
          )}
        </div>
        <span style={{ fontSize: 9, color: "var(--text-muted)", fontWeight: 700, flexShrink: 0 }}>
          {completed}/{TOTAL_PIPELINE_STEPS}
        </span>
      </div>
    </button>
  );
}

// ── Main page ──────────────────────────────────────────────────────────

export default function PipelinePage() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadReleases = useCallback(async () => {
    const all = await getDynamicReleases();
    // Filter: non-EP + (not live OR pipeline not 100% complete)
    const active = all.filter(
      (r) =>
        r.type !== "ep" &&
        (r.status !== "live" ||
          getCompletedCount(r.pipelineState || {}) < TOTAL_PIPELINE_STEPS)
    );
    // Sort: closest release date first
    active.sort(
      (a, b) =>
        new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime()
    );
    setReleases(active);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadReleases();
  }, [loadReleases]);

  const handleToggle = useCallback(
    async (releaseTitle: string, stepId: string) => {
      await togglePipelineStep(releaseTitle, stepId);
      await loadReleases(); // Re-read to get updated state
    },
    [loadReleases]
  );

  // ── Aggregate stats ────────────────────────────────────────────────
  const totalSteps = releases.length * TOTAL_PIPELINE_STEPS;
  const totalCompleted = releases.reduce(
    (sum, r) => sum + getCompletedCount(r.pipelineState || {}),
    0
  );
  const overallPct = totalSteps > 0 ? Math.round((totalCompleted / totalSteps) * 100) : 0;

  // Most urgent next step = first active release's next step
  const urgentRelease = releases.find(
    (r) => getNextStep(r.pipelineState || {}) !== null
  );
  const urgentNextStep = urgentRelease
    ? getNextStep(urgentRelease.pipelineState || {})
    : null;
  const urgentPhase = urgentRelease
    ? getCurrentPhase(urgentRelease.pipelineState || {})
    : null;

  if (loading) {
    return (
      <main className="page animate-fade-in">
        <div className="page-inner" style={{ paddingTop: 48 }}>
          <div style={{ textAlign: "center", color: "var(--text-muted)", fontSize: 12 }}>
            Loading pipeline…
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <style>{`
        @keyframes pipelineFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <main className="page animate-fade-in">
        <div className="page-inner">

          {/* ── Header ──────────────────────────────────────────── */}
          <div style={{ marginBottom: 20 }}>
            <p
              style={{
                fontSize: 9,
                fontWeight: 900,
                letterSpacing: "0.25em",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Oracle Compass
            </p>
            <h1
              style={{
                fontSize: 22,
                fontWeight: 900,
                letterSpacing: "0.06em",
                color: "var(--text-primary)",
                textTransform: "uppercase",
                lineHeight: 1,
                marginBottom: 16,
              }}
            >
              Pipeline
            </h1>

            {/* Aggregate stats card */}
            <div
              className="card"
              style={{ padding: "14px 16px", marginBottom: 0 }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 900, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 2 }}>
                    Active Releases
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: "var(--text-primary)", lineHeight: 1 }}>
                    {releases.length}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, fontWeight: 900, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 2 }}>
                    Overall
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: "var(--text-primary)", lineHeight: 1 }}>
                    {overallPct}%
                  </div>
                </div>
              </div>

              {/* Overall progress bar */}
              <div style={{ height: 3, background: "var(--surface-2)", borderRadius: 9999, overflow: "hidden", marginBottom: 10 }}>
                <div
                  style={{
                    width: `${overallPct}%`,
                    background: "linear-gradient(90deg, #C9A84C, #22c55e)",
                    height: "100%",
                    borderRadius: 9999,
                    transition: "width 0.4s ease",
                  }}
                />
              </div>

              {/* Next up */}
              {urgentRelease && urgentNextStep && urgentPhase && (
                <div style={{ paddingTop: 8, borderTop: "1px solid var(--border)" }}>
                  <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.12em", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 4 }}>
                    Next Up
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-primary)", fontWeight: 700, lineHeight: 1.4 }}>
                    <span style={{ color: urgentPhase.color }}>{urgentRelease.title}</span>
                    {" → "}
                    {urgentNextStep.label}
                  </div>
                  <div style={{ fontSize: 9, color: "var(--text-muted)", marginTop: 2 }}>
                    {urgentPhase.icon} {urgentPhase.name} · Step {urgentNextStep.id}
                  </div>
                </div>
              )}

              {releases.length === 0 && (
                <div style={{ textAlign: "center", color: "var(--text-muted)", fontSize: 11, paddingTop: 8 }}>
                  All pipelines complete 🎉
                </div>
              )}
            </div>
          </div>

          {/* ── Release cards ────────────────────────────────────── */}
          {releases.map((release, idx) =>
            expandedId === release.title ? (
              <ReleaseCardExpanded
                key={release.title}
                release={release}
                onToggle={(stepId) => handleToggle(release.title, stepId)}
                onCollapse={() => setExpandedId(null)}
              />
            ) : (
              <ReleaseCardCollapsed
                key={release.title}
                release={release}
                onExpand={() => setExpandedId(release.title)}
              />
            )
          )}

          {/* Bottom padding for nav */}
          <div style={{ height: 24 }} />

        </div>
      </main>
    </>
  );
}
