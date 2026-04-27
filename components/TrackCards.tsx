"use client";

// components/TrackCards.tsx
// Per-track lifecycle notecard UI for /kill page.
// Shows one card per unreleased track (not the EP aggregate).
// Each card: current lifecycle phase + tappable checkboxes.
// Tapping a checkbox calls updateContentDeliverables() — same source of truth as Kill List.
// Cards auto-advance to next phase when all checks in current phase are done.
// COMPLETE cards collapse to a single green line.
//
// Apr 27, 2026: Initial build — phases: MASTER → UPLOAD → PRE-RELEASE → COMPLIANCE → COMPLETE

import { useState, useEffect, useCallback } from "react";
import { getDynamicReleases, updateContentDeliverables, ContentDeliverables, Release } from "@/lib/releases";

// ── Phase definitions ─────────────────────────────────────────────────

type PhaseCheck = { key: keyof ContentDeliverables; label: string };

type LifecyclePhase = {
  phase: string;
  color: string;
  checks: PhaseCheck[];
};

function getLifecyclePhase(d: ContentDeliverables): LifecyclePhase {
  if (!d.masteringVerified) {
    return {
      phase: "MASTER",
      color: "#C9A84C",
      checks: [
        { key: "masteringVerified", label: "Master locked + QC passed" },
        { key: "instrumentalRendered", label: "Instrumental exported" },
      ],
    };
  }
  if (!d.amuseUploaded) {
    return {
      phase: "UPLOAD",
      color: "#22c55e",
      checks: [
        { key: "amuseUploaded", label: "Uploaded to Amuse" },
        { key: "isrcPulled", label: "ISRC saved" },
      ],
    };
  }
  if (!d.spotifyPitchSubmitted || !d.preSaveLive) {
    return {
      phase: "PRE-RELEASE",
      color: "#8B5CF6",
      checks: [
        { key: "spotifyPitchSubmitted", label: "Editorial pitch submitted" },
        { key: "preSaveLive", label: "Pre-save link live" },
        { key: "captionsWritten", label: "Captions written" },
      ],
    };
  }
  if (!d.ascapRegistered || !d.mlcRegistered) {
    return {
      phase: "COMPLIANCE",
      color: "#FF2D2D",
      checks: [
        { key: "ascapRegistered", label: "ASCAP registered" },
        { key: "mlcRegistered", label: "MLC registered" },
        { key: "songtrustRegistered", label: "Songtrust registered" },
      ],
    };
  }
  return {
    phase: "COMPLETE",
    color: "#22c55e",
    checks: [],
  };
}

// Tracks that should show cards (EP tracks only, not aggregate)
const EP_TRACK_TITLES = ["East Side Love", "Green Light", "Sweet Frustration", "WANT U 2", "SEE ME"];

// ── Single Track Card ─────────────────────────────────────────────────

function TrackCard({
  release,
  onUpdate,
}: {
  release: Release;
  onUpdate: () => void;
}) {
  const [checking, setChecking] = useState<string | null>(null);
  const d = release.contentDeliverables;
  const { phase, color, checks } = getLifecyclePhase(d);

  const isComplete = phase === "COMPLETE";

  const handleCheck = async (key: keyof ContentDeliverables) => {
    // Only allow checking — no unchecking (data integrity)
    if (d[key] === true) return;
    setChecking(key as string);
    try {
      await updateContentDeliverables(release.title, { [key]: true });
      onUpdate();
    } finally {
      setChecking(null);
    }
  };

  if (isComplete) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "10px 14px",
          borderRadius: "10px",
          background: "rgba(34,197,94,0.04)",
          border: "1px solid rgba(34,197,94,0.12)",
          marginBottom: "8px",
        }}
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <span style={{ fontSize: "11px", fontWeight: 800, color: "#22c55e", letterSpacing: "0.05em" }}>
          {release.title}
        </span>
        <span style={{ fontSize: "9px", fontWeight: 700, color: "rgba(34,197,94,0.5)", marginLeft: "2px", letterSpacing: "0.12em" }}>
          COMPLETE
        </span>
      </div>
    );
  }

  return (
    <div
      style={{
        borderRadius: "12px",
        background: "rgba(255,255,255,0.02)",
        border: `1px solid rgba(255,255,255,0.07)`,
        borderLeft: `4px solid ${color}`,
        marginBottom: "8px",
        overflow: "hidden",
      }}
    >
      {/* Card header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 14px",
        }}
      >
        <span
          style={{
            fontSize: "13px",
            fontWeight: 800,
            color: "#fff",
            letterSpacing: "-0.01em",
          }}
        >
          {release.title}
        </span>
        <span
          style={{
            fontSize: "9px",
            fontWeight: 800,
            color: color,
            background: `${color}18`,
            border: `1px solid ${color}30`,
            borderRadius: "20px",
            padding: "2px 8px",
            letterSpacing: "0.12em",
            flexShrink: 0,
          }}
        >
          {phase}
        </span>
      </div>

      {/* Checkboxes */}
      <div style={{ padding: "0 14px 12px", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        {checks.map((check) => {
          const done = d[check.key] === true;
          const isChecking = checking === check.key;

          return (
            <button
              key={check.key as string}
              onClick={() => handleCheck(check.key)}
              disabled={done || isChecking}
              aria-label={`Mark ${check.label} as complete`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                width: "100%",
                padding: "8px 0",
                background: "transparent",
                border: "none",
                cursor: done ? "default" : "pointer",
                minHeight: "44px",
                textAlign: "left",
              }}
            >
              {/* Checkbox */}
              <div
                style={{
                  width: "18px",
                  height: "18px",
                  borderRadius: "5px",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: done ? `${color}25` : "rgba(255,255,255,0.04)",
                  border: done ? `1.5px solid ${color}60` : "1.5px solid rgba(255,255,255,0.1)",
                  transition: "all 0.2s ease",
                }}
              >
                {done && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
                {isChecking && (
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: color,
                      opacity: 0.6,
                      animation: "trackCardPulse 0.6s ease infinite",
                    }}
                  />
                )}
              </div>

              {/* Label */}
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: done ? 600 : 700,
                  color: done ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.75)",
                  textDecoration: done ? "line-through" : "none",
                  letterSpacing: "-0.01em",
                  transition: "all 0.2s ease",
                }}
              >
                {check.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Main TrackCards Component ─────────────────────────────────────────

export default function TrackCards() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    const all = await getDynamicReleases();
    const unreleased = all.filter(
      (r) =>
        r.status !== "live" &&
        EP_TRACK_TITLES.includes(r.title)
    );
    setReleases(unreleased);
    setLoaded(true);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (!loaded || releases.length === 0) return null;

  return (
    <div style={{ marginBottom: "20px" }}>
      <style>{`
        @keyframes trackCardPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.2; }
        }
      `}</style>
      <p
        style={{
          fontSize: "9px",
          fontWeight: 800,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.2)",
          marginBottom: "10px",
          paddingLeft: "2px",
        }}
      >
        Track Status
      </p>
      {releases.map((release) => (
        <TrackCard key={release.title} release={release} onUpdate={load} />
      ))}
    </div>
  );
}
