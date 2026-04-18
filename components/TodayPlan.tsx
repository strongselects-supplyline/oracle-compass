"use client";

import { useEffect, useState } from "react";
import {
  PHASE_MAP,
  VOCAL_PRINCIPLES,
  todayIsoDate,
  getSovereigntyDays,
  daysTo,
  type PhaseDay,
} from "@/lib/phaseMap";

export default function TodayPlan() {
  const [mounted, setMounted] = useState(false);
  const [nnState, setNnState] = useState<boolean[]>([false, false, false]);

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
          >
            <span className="stp-nn-check">{nnState[i] ? "✓" : "○"}</span>
            <span className="stp-nn-text">{item}</span>
          </button>
        ))}
      </div>

      {/* Vocal principle */}
      <h3 className="stp-section-title">Vocal Codex — Principle of the Day</h3>
      <div className="stp-vocal-callout">
        <span className="stp-vocal-icon">🎤</span>
        <div className="stp-vocal-body" dangerouslySetInnerHTML={{ __html: vocalPrinciple }} />
      </div>
    </section>
  );
}
