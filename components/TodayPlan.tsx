"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  PHASE_MAP,
  VOCAL_PRINCIPLES,
  todayIsoDate,
  getSovereigntyDays,
  daysTo,
  type PhaseDay,
} from "@/lib/phaseMap";
import { useKillList } from "@/components/KillListProvider";
import type { KillTask } from "@/lib/killList";

export default function TodayPlan() {
  const [mounted, setMounted] = useState(false);
  const [nnState, setNnState] = useState<boolean[]>([false, false, false]);
  const { killList, killStats, error: killError, refresh } = useKillList();

  const redTasks = killList.filter((t) => t.urgency === "RED").slice(0, 5);

  useEffect(() => {
    setMounted(true);
    const iso = todayIsoDate();
    const key = `today-nn-${iso}`;
    try {
      const raw = localStorage.getItem(key);
      if (raw) setNnState(JSON.parse(raw));
    } catch {
      /* no-op */
    }
  }, []);

  if (!mounted) return null;

  const iso = todayIsoDate();
  const data: PhaseDay | undefined = PHASE_MAP[iso];
  const sovDays = getSovereigntyDays();

  // Vocal principle — deterministic per day
  const now = new Date();
  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  );
  const vocalPrinciple = VOCAL_PRINCIPLES[dayOfYear % VOCAL_PRINCIPLES.length];

  // Date string
  const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][now.getDay()];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dateStr = `${weekday} ${months[now.getMonth()]} ${now.getDate()}`;

  const toggleNn = (i: number) => {
    const next = [...nnState];
    next[i] = !next[i];
    setNnState(next);
    try {
      localStorage.setItem(`today-nn-${iso}`, JSON.stringify(next));
    } catch {
      /* no-op */
    }
  };

  // ═══ OFF-PLAN FALLBACK ═══
  if (!data) {
    return (
      <section className="scroll-today-plan">
        <div className="stp-header">
          <div className="stp-tag">Off-plan day</div>
          <h2 className="stp-title">Outside the 91-day window</h2>
          <p className="stp-sub">No plan entry for {iso}. Open the 90-Day Roadmap for context.</p>
        </div>
        <div className="stp-vocal-callout">
          <span className="stp-vocal-icon">🎤</span>
          <div className="stp-vocal-body" dangerouslySetInnerHTML={{ __html: vocalPrinciple }} />
        </div>
      </section>
    );
  }

  // ═══ ON-PLAN RENDER ═══
  const dropDays = data.dropDate ? daysTo(data.dropDate) : null;
  const dropDisplay = dropDays !== null ? (dropDays <= 0 ? "LIVE" : String(dropDays)) : "—";

  return (
    <section className="scroll-today-plan">
      {/* Header */}
      <div className="stp-header">
        <div className="stp-tag">
          {dateStr} · Arc {data.arc} · {data.weekName}
        </div>
        <h2 className="stp-title">{data.dayLabel}</h2>
        <p className="stp-sub">{data.sub}</p>
      </div>

      {/* Stats strip */}
      <div className="stp-stats">
        <div className="stp-stat">
          <div className="stp-stat-num">{sovDays}</div>
          <div className="stp-stat-lbl">Sovereignty Days</div>
        </div>
        <div className="stp-stat">
          <div className="stp-stat-num">{dropDisplay}</div>
          <div className="stp-stat-lbl">{data.dropLabel || "Days to Next"}</div>
        </div>
        <div className="stp-stat">
          <div className="stp-stat-num">Arc {data.arc}</div>
          <div className="stp-stat-lbl">Active Arc</div>
        </div>
        <div className="stp-stat">
          <div className="stp-stat-num" style={{ fontSize: "14px" }}>{data.phase}</div>
          <div className="stp-stat-lbl">Phase</div>
        </div>
      </div>

      {/* Deliverable card */}
      <div className={`stp-deliverable ${data.cardClass?.replace("card-left", "stp-border") || ""}`}>
        <div className="stp-del-head">
          <h3 className="stp-del-title">{data.deliverable}</h3>
          <span className={`stp-badge ${data.badgeClass || "badge-gold"}`}>{data.badge}</span>
        </div>
        <p className="stp-del-sub">{data.sub}</p>
      </div>

      {/* Warning callout */}
      {data.warning && (
        <div className={`stp-callout stp-callout-${data.warning.type}`}>
          <span className="stp-callout-icon">{data.warning.icon}</span>
          <div
            className="stp-callout-body"
            dangerouslySetInnerHTML={{ __html: data.warning.text }}
          />
        </div>
      )}

      {/* Non-negotiables */}
      <h3 className="stp-section-title">Non-Negotiables</h3>
      <div className="stp-nn-list">
        {(data.nn || []).map((item, i) => (
          <button
            key={i}
            className={`stp-nn-item ${nnState[i] ? "stp-nn-done" : ""}`}
            onClick={() => toggleNn(i)}
            aria-label={`Toggle non-negotiable: ${item}`}
            aria-pressed={nnState[i]}
          >
            <span className="stp-nn-check">{nnState[i] ? "✓" : "○"}</span>
            <span className="stp-nn-text">{item}</span>
          </button>
        ))}
      </div>

      {/* Kill List — RED summary */}
      {killStats && (
        <>
          <h3 className="stp-section-title" style={{ color: "#e05545" }}>🔥 Kill List — RED</h3>
          <div className="stp-deliverable" style={{ borderLeft: "3px solid #e05545", borderColor: "rgba(224,85,69,0.3)" }}>
            <div className="stp-del-sub" style={{ marginBottom: 8 }}>
              {killStats.cleared} cleared / {killStats.total} total · <strong style={{ color: "#e05545" }}>{killStats.redRemaining} RED</strong> remaining
            </div>
            {redTasks.length === 0 ? (
              <p className="scroll-p" style={{ color: "rgba(62,207,113,0.7)", marginBottom: 0 }}>No RED tasks. You&apos;re ahead.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {redTasks.map((t) => (
                  <div key={t.id} style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
                    <strong style={{ color: "rgba(255,255,255,0.9)" }}>{t.title}</strong>
                    {t.subtitle && <span style={{ marginLeft: 8, color: "rgba(255,255,255,0.35)" }}>— {t.subtitle.substring(0, 60)}</span>}
                  </div>
                ))}
              </div>
            )}
            <Link href="/kill" style={{ display: "block", marginTop: 12, fontSize: 12, color: "#e05545", textDecoration: "none", textAlign: "right" }}>
              Open full Kill List →
            </Link>
          </div>
        </>
      )}

      {/* Vocal principle */}
      <h3 className="stp-section-title">Vocal Codex — Principle of the Day</h3>
      <div className="stp-vocal-callout">
        <span className="stp-vocal-icon">🎤</span>
        <div className="stp-vocal-body" dangerouslySetInnerHTML={{ __html: vocalPrinciple }} />
      </div>

      {/* Kill List cross-link — RED urgency only */}
      <h3 className="stp-section-title">🔥 Live Kill List — RED</h3>
      <div className="stp-kill-summary">
        {killError ? (
          <div className="stp-kill-empty">
            Kill List unavailable.{" "}
            <button
              onClick={() => refresh()}
              className="stp-kill-retry"
              style={{ color: "var(--accent)", textDecoration: "underline", background: "none", border: "none", cursor: "pointer", font: "inherit" }}
            >
              Retry
            </button>
            {" · "}
            <Link href="/kill" style={{ color: "var(--accent)" }}>open /kill directly</Link>
          </div>
        ) : killStats ? (
          <p className="stp-kill-meta">
            {killStats.cleared} cleared / {killStats.total} total · {killStats.redRemaining} RED remaining
          </p>
        ) : (
          <p className="stp-kill-meta">Loading kill list…</p>
        )}
        {!killError && redTasks.length === 0 && killStats && (
          <p className="stp-kill-empty">No RED tasks. You&apos;re ahead.</p>
        )}
        {redTasks.length > 0 && (
          <ul className="stp-kill-list">
            {redTasks.map((t) => (
              <li key={t.id} className="stp-kill-item">
                <strong className="stp-kill-title">{t.title}</strong>
                <span className="stp-kill-sub">{t.subtitle}</span>
              </li>
            ))}
          </ul>
        )}
        <Link href="/kill" className="stp-kill-link">
          Open full Kill List →
        </Link>
      </div>
    </section>
  );
}

