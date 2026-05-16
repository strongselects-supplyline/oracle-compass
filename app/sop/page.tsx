"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

/* ─── Types ─────────────────────────────────────────────── */
interface PhaseEntry {
  id: string;
  action: string;
  detail: string;
  badge: string;
  color: string;
  start: string;
  end: string;
}

/* ─── Release schedule — Quick Start source of truth ─────── */
const PHASES: PhaseEntry[] = [
  { id: "rec",       action: "Record GL + SF + WU2",               detail: "FL Studio. Body prep → /practice first. Batch ALL vocals in one session. No mixing mid-record.", badge: "PHASE 0B–0C",    color: "#4ade80", start: "2026-05-15", end: "2026-05-18" },
  { id: "upload",    action: "Upload GL + SF + WU2 + EP to Amuse",  detail: "Genre: R&B / Alt-R&B only. Cover art attached. SEE ME + ESL ISRCs carry. GL/SF/WU2 get new ISRCs.", badge: "PHASE 1",         color: "#60a5fa", start: "2026-05-19", end: "2026-05-19" },
  { id: "sprint",    action: "8-day content blitz — Pre-Release",   detail: "Batch 5–7 pieces. S4A editorial pitch. Build DM list. No production during this window.", badge: "PHASE 2",         color: "#fbbf24", start: "2026-05-20", end: "2026-05-28" },
  { id: "ep",        action: "ALL LOVE EP DROPS — Full Activation",  detail: "Post midnight + 8 AM. DM your list. Every channel live. Pull S4A by noon.", badge: "PHASE 3",         color: "#f472b6", start: "2026-05-29", end: "2026-05-29" },
  { id: "compound",  action: "EP Compound Phase — Sustain",          detail: "T+1 to T+7. Stitch replies, repost moments, meme seed. Sunday = full S4A data pull.", badge: "PHASE 4",         color: "#c084fc", start: "2026-05-30", end: "2026-06-04" },
  { id: "comply1",   action: "EP Compliance — Thursday Jun 5",       detail: "ASCAP + SoundExchange + Songtrust + MLC. All 5 EP tracks. 30 min total.", badge: "COMPLIANCE",     color: "#34d399", start: "2026-06-05", end: "2026-06-05" },
  { id: "ilg-pre",   action: "ILG Pre-Release Sprint",               detail: "I Like Girls upload + 8-day content batch. Same Phase 2 playbook.", badge: "PHASE 2 (ILG)",  color: "#fbbf24", start: "2026-06-06", end: "2026-06-11" },
  { id: "ilg",       action: "I Like Girls DROPS — Jun 12",          detail: "Second Release Radar trigger. Cluster A opener. Full activation.", badge: "PHASE 3 (ILG)",  color: "#4ade80", start: "2026-06-12", end: "2026-06-12" },
  { id: "lid-pre",   action: "Like I Did Pre-Release Sprint",        detail: "Vault single #2. 110 BPM, D minor. Same Phase 2 playbook.", badge: "PHASE 2 (LID)",  color: "#fbbf24", start: "2026-06-19", end: "2026-06-25" },
  { id: "lid",       action: "Like I Did DROPS — Jun 26",            detail: "Third Release Radar trigger. Full activation.", badge: "PHASE 3 (LID)",  color: "#4ade80", start: "2026-06-26", end: "2026-06-26" },
  { id: "wi-pre",    action: "Worth It Pre-Release Sprint",          detail: "Vault single #3. 97 BPM, F minor.", badge: "PHASE 2 (WI)",   color: "#fbbf24", start: "2026-07-03", end: "2026-07-09" },
  { id: "wi",        action: "Worth It DROPS — Jul 10",             detail: "Fourth Release Radar trigger.", badge: "PHASE 3 (WI)",   color: "#4ade80", start: "2026-07-10", end: "2026-07-10" },
  { id: "review",    action: "90-Day Review + CREAM Tracklist Lock", detail: "Jul 17 review. Jul 24 lock — pop score delta + save rate + live traction. Top 5 decided.", badge: "CREAM LOCK",     color: "#c084fc", start: "2026-07-17", end: "2026-07-24" },
];

function getCurrentPhase(): PhaseEntry | null {
  const todayStr = new Date().toISOString().split("T")[0];
  for (const p of PHASES) {
    if (todayStr >= p.start && todayStr <= p.end) return p;
  }
  return PHASES.find(p => p.start > todayStr) ?? null;
}

/* ─── Sub-components ─────────────────────────────────────── */
function Callout({ type = "gold", children }: { type?: "gold" | "red" | "green" | "blue"; children: React.ReactNode }) {
  const map = { gold: "sc-important", red: "sc-warning", green: "sc-tip", blue: "sc-note" };
  const icons = { gold: "⚡", red: "🚨", green: "✅", blue: "ℹ️" };
  return (
    <div className={`scroll-callout ${map[type]}`} style={{ marginBottom: 12 }}>
      <span className="scroll-callout-icon">{icons[type]}</span>
      <div className="scroll-callout-body">{children}</div>
    </div>
  );
}

function STable({ headers, rows }: { headers: string[]; rows: (string | React.ReactNode)[][] }) {
  return (
    <div className="scroll-table-wrap" style={{ marginBottom: 12 }}>
      <table className="scroll-table">
        <thead><tr>{headers.map((h, i) => <th key={i}>{h}</th>)}</tr></thead>
        <tbody>{rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

function Tag({ label, color = "#B8973E", bg }: { label: string; color?: string; bg?: string }) {
  return (
    <span style={{ display: "inline-block", padding: "1px 7px", borderRadius: 3, fontSize: 10, fontWeight: 700, letterSpacing: "0.04em", whiteSpace: "nowrap", background: bg ?? "rgba(184,151,62,0.15)", color }}>
      {label}
    </span>
  );
}

function Who({ role }: { role: "ETHAN" | "CLAUDE" | "ANTIGRAVITY" | "AUTO" }) {
  const map = {
    ETHAN:      { bg: "rgba(184,151,62,0.15)",  color: "#c9a84c" },
    CLAUDE:     { bg: "rgba(96,165,250,0.12)",  color: "#93c5fd" },
    ANTIGRAVITY:{ bg: "rgba(167,139,250,0.12)", color: "#c4b5fd" },
    AUTO:       { bg: "rgba(52,211,153,0.12)",  color: "#6ee7b7" },
  };
  return <Tag label={role} color={map[role].color} bg={map[role].bg} />;
}

function Step({ action, tags }: { action: React.ReactNode; tags?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
      <div style={{ flex: 1, fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>{action}</div>
      {tags && <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3, flexShrink: 0 }}>{tags}</div>}
    </div>
  );
}

function GroupLabel({ label }: { label: string }) {
  return <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-muted)", padding: "8px 0 4px", borderTop: "1px solid var(--border)", marginTop: 8 }}>{label}</div>;
}

function SopCard({ id, num, numBg, title, sub, open, onToggle, children }: {
  id: string; num: string; numBg: string; title: string; sub: string;
  open: boolean; onToggle: (id: string) => void; children: React.ReactNode;
}) {
  return (
    <div style={{ background: "var(--surface)", border: `1px solid ${open ? "rgba(201,168,76,0.2)" : "var(--border)"}`, borderRadius: 10, marginBottom: 8, overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,0.3)" }}>
      <div onClick={() => onToggle(id)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", cursor: "pointer", background: open ? "rgba(201,168,76,0.04)" : "transparent" }}>
        <div style={{ width: 28, height: 28, borderRadius: 6, background: numBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{num}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{title}</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{sub}</div>
        </div>
        <div style={{ fontSize: 11, color: "var(--text-muted)", transition: "transform 0.2s", transform: open ? "rotate(90deg)" : "none", flexShrink: 0 }}>▸</div>
      </div>
      {open && (
        <div style={{ padding: "4px 16px 14px", borderTop: "1px solid var(--border)" }}>
          {children}
        </div>
      )}
    </div>
  );
}

function RuleBlock({ num, children }: { num: number; children: React.ReactNode }) {
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "14px 16px", marginBottom: 8, display: "flex", gap: 12, alignItems: "flex-start" }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--accent)", flexShrink: 0, width: 22 }}>{num}</div>
      <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>{children}</div>
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return <span style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 4, padding: "4px 10px", fontSize: 11, color: "var(--text-secondary)", display: "inline-block", margin: "3px 3px" }}>{children}</span>;
}

/* ─── Nav sections ───────────────────────────────────────── */
const NAV = [
  { color: "#c9a84c", label: "Overview",        items: [{ id: "mission", label: "Thesis + North Star" }, { id: "roles", label: "Who Does What" }, { id: "tools", label: "Tool Stack" }] },
  { color: "#6ee7b7", label: "Daily Ops",        items: [{ id: "daily", label: "Daily Rhythm" }, { id: "doordash", label: "DoorDash Protocol" }] },
  { color: "#60a5fa", label: "Release Pipeline", items: [{ id: "p0", label: "Phase 0 — Creation" }, { id: "p1", label: "Phase 1 — Pre-Upload" }, { id: "p2", label: "Phase 2 — Pre-Release" }, { id: "p3", label: "Phase 3 — Release Day" }, { id: "p4", label: "Phase 4 — Compound" }, { id: "p5", label: "Phase 5 — Sync Prep" }, { id: "p6", label: "Phase 6 — System Update" }] },
  { color: "#f472b6", label: "Content",          items: [{ id: "content", label: "Content System" }, { id: "social", label: "Social Strategy" }] },
  { color: "#a78bfa", label: "Audience",         items: [{ id: "outreach", label: "DM Outreach" }, { id: "geo", label: "Gorilla Geo" }] },
  { color: "#34d399", label: "Revenue",          items: [{ id: "revenue", label: "Revenue Stack" }, { id: "compliance", label: "Compliance" }] },
  { color: "#fcd34d", label: "AI & Automation",  items: [{ id: "ai", label: "AI Delegation" }, { id: "cream", label: "CREAM Protocol" }] },
  { color: "#f87171", label: "Anti-Drift",       items: [{ id: "rules", label: "Standing Rules" }] },
];

/* ─── Page ───────────────────────────────────────────────── */
export default function SOPPage() {
  const [openCards, setOpenCards] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [activeSection, setActiveSection] = useState("mission");
  const [progress, setProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const currentPhase = getCurrentPhase();

  function toggleCard(id: string) {
    setOpenCards(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function expandSection(sectionId: string) {
    const cards = document.querySelectorAll<HTMLElement>(`[data-section="${sectionId}"] [data-card-id]`);
    const ids = Array.from(cards).map(el => el.dataset.cardId!);
    setOpenCards(prev => {
      const next = new Set(prev);
      ids.forEach(id => next.add(id));
      return next;
    });
  }

  function goto(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const pct = scrollHeight - clientHeight > 0 ? (scrollTop / (scrollHeight - clientHeight)) * 100 : 0;
      setProgress(pct);
      // Active section spy
      const sections = el.querySelectorAll<HTMLElement>("section[id]");
      let current = "mission";
      sections.forEach(s => { if (s.offsetTop - 120 <= el.scrollTop) current = s.id; });
      setActiveSection(current);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const sq = search.toLowerCase().trim();

  function sectionHidden(text: string) {
    return sq && !text.toLowerCase().includes(sq);
  }

  return (
    <div className="doctrine-layout" style={{ position: "relative" }}>
      {/* Progress bar */}
      <div style={{ position: "fixed", top: 0, left: 0, height: 2, background: "var(--accent)", width: `${progress}%`, zIndex: 9999, transition: "width 0.08s linear", pointerEvents: "none", borderRadius: "0 1px 1px 0" }} />

      {/* ── SIDEBAR ────────────────────────────────────────── */}
      <nav className="doctrine-sidebar">
        <div style={{ padding: "0 16px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.15em", color: "var(--accent)" }}>LABEL OS</div>
          <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>past.El noir · A-Z Manual</div>
        </div>
        {NAV.map(group => (
          <div key={group.label}>
            <div className="doc-nav-cat" style={{ color: group.color, borderLeft: `2px solid ${group.color}`, paddingLeft: 14 }}>{group.label}</div>
            {group.items.map(item => (
              <a key={item.id} className={`doc-nav-item ${activeSection === item.id ? "active" : ""}`} onClick={() => goto(item.id)} style={{ cursor: "pointer" }}>
                {item.label}
              </a>
            ))}
          </div>
        ))}
        <div style={{ height: 80 }} />
      </nav>

      {/* ── MAIN ───────────────────────────────────────────── */}
      <main className="doctrine-content" ref={contentRef} style={{ overflowY: "auto", maxHeight: "100vh", paddingBottom: 100 }}>

        {/* Search */}
        <div style={{ position: "sticky", top: 0, zIndex: 40, background: "var(--bg)", paddingBottom: 10, paddingTop: 6 }}>
          <input
            type="search"
            className="oracle-input"
            placeholder="Search the SOP…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ fontSize: 14 }}
          />
        </div>

        {/* Page header */}
        <div className="scroll-page-header" style={{ marginTop: 12 }}>
          <div className="scroll-page-tag">past.El noir Records · May 2026</div>
          <h1 className="scroll-page-title" style={{ fontSize: "clamp(1.4rem,4vw,2rem)" }}>Label OS — Full A-Z Manual</h1>
          <p className="scroll-page-sub">Everything that runs this label. From idea to algorithm. From recording to compliance. If you&apos;re Ethan, this is your operating system. If you&apos;re helping, this is your briefing. No drift. No guessing. Execute.</p>
        </div>

        {/* ── QUICK START ──────────────────────────────────── */}
        {currentPhase && (
          <div style={{ background: "linear-gradient(135deg, rgba(201,168,76,0.12), rgba(201,168,76,0.04))", border: "1px solid rgba(201,168,76,0.35)", borderRadius: 12, padding: "18px 20px", marginBottom: 28, display: "flex", alignItems: "flex-start", gap: 16 }}>
            <div style={{ fontSize: 28, flexShrink: 0, lineHeight: 1 }}>⚡</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 6 }}>Right now — May 2026</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.3, marginBottom: 8 }}>{currentPhase.action}</div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>{currentPhase.detail}</div>
              <div style={{ display: "inline-block", background: "rgba(201,168,76,0.18)", color: "var(--accent)", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", padding: "3px 10px", borderRadius: 4, marginTop: 10, textTransform: "uppercase" }}>{currentPhase.badge}</div>
            </div>
          </div>
        )}

        {/* ── MISSION ──────────────────────────────────────── */}
        <section id="mission" style={{ marginBottom: 52, scrollMarginTop: 60 }} hidden={sectionHidden("mission thesis north star metrics timeline")}>
          <h2 className="scroll-h3">🎯 Thesis + North Star</h2>
          <Callout type="gold"><strong>The single lever across all 90 days:</strong> Save rate → Discover Weekly → algorithm → organic growth. Everything serves that chain.</Callout>
          <p className="scroll-p">You are not a content creator who makes music. You are a <strong>recording artist running a machine that compounds</strong>. Label OS is the A&R, marketing, distribution, compliance, and analytics department — all automated or systematized. Mission: 30 years old, 44 tracks, a tested marketing engine, audience data across 3+ release cycles, and a production system that generates without burning the operator.</p>

          <h3 className="scroll-h4">Current Phase: ALL LOVE EP + Vault Waterfall</h3>
          <div style={{ display: "flex", gap: 0, overflowX: "auto", margin: "16px 0", borderRadius: 8, border: "1px solid var(--border)", overflow: "hidden" }}>
            {[
              { label: "ESL Live", date: "May 8", color: "#c9a84c", icon: "✓" },
              { label: "EP Upload", date: "May 19", color: "#60a5fa", icon: "↑" },
              { label: "EP Drops", date: "May 29", color: "#f472b6", icon: "💥" },
              { label: "ILG", date: "Jun 12", color: "#4ade80", icon: "→" },
              { label: "LID", date: "Jun 26", color: "#4ade80", icon: "→" },
              { label: "WI", date: "Jul 10", color: "#4ade80", icon: "→" },
              { label: "CREAM Lock", date: "Jul 24", color: "#c084fc", icon: "🔒" },
              { label: "RCN", date: "Aug 7", color: "#4ade80", icon: "→" },
            ].map((t, i, arr) => (
              <div key={i} style={{ flex: 1, minWidth: 80, textAlign: "center", padding: "10px 6px", borderRight: i < arr.length - 1 ? "1px solid var(--border)" : "none", background: "var(--surface)" }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", background: t.color, margin: "0 auto 6px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#000" }}>{t.icon}</div>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.06em", color: "var(--text-secondary)", textTransform: "uppercase" }}>{t.label}</div>
                <div style={{ fontSize: 9, color: "var(--text-muted)", marginTop: 2 }}>{t.date}</div>
              </div>
            ))}
          </div>

          <h3 className="scroll-h4">North Star Metrics (check every Sunday)</h3>
          <STable
            headers={["Metric", "May 29 Target", "Jul 17 Target"]}
            rows={[
              ["Save rate", "3%+ avg EP", "4%+ top track"],
              ["Spotify followers", "2,000+", "2,800+"],
              ["Monthly listeners", "30,000+", "40,000+"],
              ["Popularity score", "28+", "35+"],
              ["Release Radar triggers", "2 (ESL + EP)", "6 (all vault)"],
              ["Sobriety streak", "Day 57", "Day 106"],
              ["DoorDash monthly", "$1,800", "$1,800"],
            ]}
          />
        </section>

        {/* ── ROLES ────────────────────────────────────────── */}
        <section id="roles" style={{ marginBottom: 52, scrollMarginTop: 60 }} hidden={sectionHidden("roles who does what ethan claude antigravity automation")}>
          <h2 className="scroll-h3">👥 Who Does What</h2>
          <p className="scroll-p">Every task in this SOP is tagged with a role. Know your lane.</p>
          <STable
            headers={["Role", "What They Do", "When to Use"]}
            rows={[
              [<Who key="e" role="ETHAN" />, "Records, performs, approves, decides, DMs, posts, runs DoorDash", "Anything requiring creative judgment, physical presence, or final call"],
              [<Who key="c" role="CLAUDE" />, "Architecture, strategy, audits, cross-verification, spec writing", "System decisions, new infrastructure, anything broken, strategic pivots"],
              [<Who key="a" role="ANTIGRAVITY" />, "Filesystem writes, git operations, batch file work, mechanical execution", "Heavy file writes, git pushes, running scripts, batch transforms"],
              [<Who key="au" role="AUTO" />, "Scheduled tasks, cron jobs, catalog refresh, pipeline scripts", "Biweekly catalog refresh, automated Oracle updates"],
            ]}
          />
          <Callout type="red"><strong>Rule:</strong> Never burn Opus (Claude) on work Sonnet can handle. Never bring Ethan into execution tasks automation can run. Each role in its lane — that&apos;s where the system scales.</Callout>
        </section>

        {/* ── TOOL STACK ───────────────────────────────────── */}
        <section id="tools" style={{ marginBottom: 52, scrollMarginTop: 60 }} hidden={sectionHidden("tool stack fl studio cyanite amuse oracle gorilla pipeline")}>
          <h2 className="scroll-h3">🛠️ Tool Stack</h2>
          <STable
            headers={["Tool", "Role", "Access"]}
            rows={[
              [<Tag key="fl" label="FL Studio" color="#4ade80" bg="rgba(74,222,128,0.12)" />, "Production, recording, vocal mix, mastering (Illangelo chain)", "Ethan local"],
              [<Tag key="cy" label="Cyanite" color="#818cf8" bg="rgba(129,140,248,0.12)" />, "Audio analysis — genre/mood/Sexy scores. QA gate before final mix.", "cyanite.ai"],
              [<Tag key="ph" label="Photopea" color="#2dd4bf" bg="rgba(45,212,191,0.12)" />, "Cover art, layer isolation, transparent PNGs, Canvas prep", "photopea.com (free)"],
              [<Tag key="cc" label="CapCut" color="#fbbf24" bg="rgba(251,191,36,0.12)" />, "Canvas loops, lyric reels, parallax motion, quick edits", "Phone + desktop"],
              [<Tag key="am" label="Amuse" color="#c084fc" bg="rgba(192,132,252,0.12)" />, "Distribution. Genre: R&B / Alt-R&B. NEVER Pop. ISRC. Royalties. Insights.", "amuse.io — Amuse Pro"],
              [<Tag key="s4" label="S4A" color="#a3e635" bg="rgba(163,230,53,0.12)" />, "Editorial pitch, Discovery Mode, weekly data pull (saves, skip, demo)", "artists.spotify.com"],
              [<Tag key="oc" label="Oracle Compass" color="#60a5fa" bg="rgba(96,165,250,0.12)" />, "Daily OS. Kill List, Pipeline tracker, War Room, Practice, Log", "oracle-compass-ni8g.vercel.app"],
              [<Tag key="gg" label="Gorilla Geo" color="#6ee7b7" bg="rgba(110,231,183,0.12)" />, "5-module audience geo pipeline. T4 artist targeting. 2,783 exported.", "scratch/gorilla-geo/"],
              [<Tag key="cf" label="Content Pipeline" color="#fcd34d" bg="rgba(252,211,77,0.12)" />, "Batch image/video processing. 4 color looks. Format routing.", "node scratch/content-flood/pipeline.mjs"],
              [<Tag key="cr" label="Catalog Refresh" color="#fcd34d" bg="rgba(252,211,77,0.12)" />, "Spotify popularity auto-update + Music Stax fallback.", "node brain/refresh-catalog.mjs (biweekly)"],
              [<Tag key="ig" label="IG / TikTok" color="#f472b6" bg="rgba(244,114,182,0.12)" />, "Primary content engine, community trace, DM outreach", "Ethan accounts"],
              [<Tag key="ri" label="Rights Suite" color="#9ca3af" bg="rgba(156,163,175,0.12)" />, "ASCAP + MLC + Songtrust + SoundExchange. Thursday after each release.", "Manual portals"],
            ]}
          />
        </section>

        {/* ── DAILY RHYTHM ─────────────────────────────────── */}
        <section id="daily" data-section="daily" style={{ marginBottom: 52, scrollMarginTop: 60 }} hidden={sectionHidden("daily rhythm morning routine mudra breathing kill list")}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <h2 className="scroll-h3" style={{ margin: 0 }}>⏰ Daily Rhythm</h2>
            <button onClick={() => expandSection("daily")} style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", cursor: "pointer", padding: "2px 8px", borderRadius: 4, background: "var(--surface-2)", border: "1px solid var(--border)" }}>expand all</button>
          </div>
          <Callout type="gold"><strong>Non-negotiable order:</strong> Body → Ignition → Fuel → Kill List scan → Work. Never open the DAW before these 4 are done.</Callout>

          <SopCard id="d-stier" data-card-id="d-stier" num="S" numBg="#c9a84c" title="Full S-Tier Morning" sub="Non-DoorDash days · or late-start DoorDash days" open={openCards.has("d-stier")} onToggle={toggleCard}>
            <GroupLabel label="Sequence (in order, hard time caps)" />
            <Step action={<><strong>Wake → 32oz water + sea salt immediately.</strong> Rehydration + cortisol.</>} tags={<Who role="ETHAN" />} />
            <Step action={<><strong>Jnana Mudra + OM, 90 seconds.</strong> Captain&apos;s Chair ignition. Replaces doom-scroll. See <Link href="/practice" style={{ color: "var(--accent)" }}>/practice</Link> in Oracle.</>} tags={<Who role="ETHAN" />} />
            <Step action={<><strong>Nadi Shodhana, 5 min.</strong> ANS balance, serotonin baseline.</>} tags={<Who role="ETHAN" />} />
            <Step action={<><strong>Exercise: pushups + squats + walk, 30 min.</strong> BDNF + dopamine receptor upregulation.</>} tags={<Who role="ETHAN" />} />
            <Step action={<><strong>High-protein meal.</strong> Eggs, oats, banana. Tyrosine = dopamine precursor. Non-negotiable during sobriety gap.</>} tags={<Who role="ETHAN" />} />
            <Step action={<><strong>90-second Kill List scan.</strong> Open Oracle → read RED items → close it. Hard exit at 90 seconds. No rabbit holes.</>} tags={<Tag label="Oracle" color="#60a5fa" bg="rgba(96,165,250,0.12)" />} />
            <Step action={<><strong>S3 Check-in (studio days):</strong> "Name your mental state before opening the DAW." Rate 1–10. 30 seconds.</>} tags={<Who role="ETHAN" />} />
            <Step action={<><strong>DAW open. Work begins.</strong></>} tags={<Tag label="FL Studio" color="#4ade80" bg="rgba(74,222,128,0.12)" />} />
          </SopCard>

          <SopCard id="d-compressed" data-card-id="d-compressed" num="C" numBg="#555" title="Compressed Ignition" sub="DoorDash by 6:30 AM" open={openCards.has("d-compressed")} onToggle={toggleCard}>
            <Step action={<><strong>Wake → 32oz water + sea salt.</strong></>} tags={<Who role="ETHAN" />} />
            <Step action={<><strong>Jnana Mudra + OM, 60 seconds.</strong></>} tags={<Who role="ETHAN" />} />
            <Step action={<><strong>Protein meal — Option B:</strong> hardboiled eggs + banana (prepped night before).</>} tags={<Who role="ETHAN" />} />
            <Step action={<><strong>90-second Kill List scan.</strong> Close it.</>} tags={<Tag label="Oracle" color="#60a5fa" bg="rgba(96,165,250,0.12)" />} />
            <Step action={<><strong>DoorDash.</strong></>} tags={<Who role="ETHAN" />} />
          </SopCard>

          <h3 className="scroll-h4">Sleep Rules (upstream constraint)</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, margin: "8px 0 16px" }}>
            <Pill><strong>Lights out:</strong> 10:30 PM hard</Pill>
            <Pill><strong>Caffeine cutoff:</strong> 1:00 PM</Pill>
            <Pill><strong>DoorDash wheels down:</strong> 8:30 PM</Pill>
            <Pill><strong>No screens:</strong> post-9:30 PM</Pill>
            <Pill><strong>Evening:</strong> mullein tea, no social post-8 PM</Pill>
          </div>

          <h3 className="scroll-h4">Sunday Protocol (weekly reset)</h3>
          <Step action={<><strong>Grief journaling, 20 min.</strong> Write to your father. Controlled exposure. What you&apos;d say, what you&apos;d ask, what you&apos;re angry about.</>} tags={<Who role="ETHAN" />} />
          <Step action={<><strong>Weekly data pull, 40–60 min.</strong> S4A → all live tracks → save rate, streams, demographics, playlist adds.</>} tags={<Tag label="S4A" color="#a3e635" bg="rgba(163,230,53,0.12)" />} />
          <Step action={<><strong>Meal batch prep, 30–45 min.</strong> Rice, chicken thighs, hardboiled eggs, PB&J. Aldi ~$40. Protects the week.</>} tags={<Who role="ETHAN" />} />
          <Step action={<><strong>Next-week Kill List scan.</strong> What&apos;s RED? What&apos;s highest leverage on Monday?</>} tags={<Tag label="Oracle" color="#60a5fa" bg="rgba(96,165,250,0.12)" />} />
          <Step action={<><strong>IG unfollow audit, 5 min.</strong> Gradual. Target 3:1–4:1 ratio. No mass unfollows.</>} tags={<Tag label="IG" color="#f472b6" bg="rgba(244,114,182,0.12)" />} />
        </section>

        {/* ── DOORDASH ─────────────────────────────────────── */}
        <section id="doordash" style={{ marginBottom: 52, scrollMarginTop: 60 }} hidden={sectionHidden("doordash income bridge target 1800")}>
          <h2 className="scroll-h3">🚗 DoorDash Protocol</h2>
          <Callout type="green"><strong>Target: $1,800/month.</strong> Once hit — stop. Not a dollar more. Protect studio time.</Callout>
          <STable
            headers={["Block", "Time", "Rule"]}
            rows={[
              ["Primary", "6:30–9:00 AM", "Morning surge pricing. Do this first."],
              ["Secondary", "5:30–8:30 PM", "Only if monthly target needs it. Wheels down 8:30 PM hard."],
            ]}
          />
          <Callout type="red"><strong>Stop rule:</strong> Track weekly. Monthly hit = done. Never cram the last weekend. DoorDash is a bridge, not a career.</Callout>
        </section>

        {/* ── PHASE 0 ──────────────────────────────────────── */}
        <section id="p0" data-section="p0" style={{ marginBottom: 52, scrollMarginTop: 60 }} hidden={sectionHidden("phase 0 creation recording production mix master cyanite")}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <h2 className="scroll-h3" style={{ margin: 0 }}>🎵 Phase 0 — Creation</h2>
            <button onClick={() => expandSection("p0")} style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", cursor: "pointer", padding: "2px 8px", borderRadius: 4, background: "var(--surface-2)", border: "1px solid var(--border)" }}>expand all</button>
          </div>
          <Callout type="gold"><strong>Batch by stage, not by track.</strong> Record all vocals across ALL tracks in one session, then mix all, then master all. Interleaving kills momentum.</Callout>

          <SopCard id="p0a" data-card-id="p0a" num="0A" numBg="#4ade80" title="Writing + Production" sub="Idea → beat → arrangement" open={openCards.has("p0a")} onToggle={toggleCard}>
            <Step action={<><strong>Idea capture</strong> — voice memo (melody), text note (lyric), chord progression, vibe reference. Don&apos;t lose it.</>} tags={<><Tag label="Phone" color="#f87171" bg="rgba(248,113,113,0.12)" /><Who role="ETHAN" /></>} />
            <Step action={<><strong>Production topline</strong> — beat/arrangement draft in FL Studio.</>} tags={<Tag label="FL Studio" color="#4ade80" bg="rgba(74,222,128,0.12)" />} />
            <Step action={<><strong>Re-production</strong> — refine arrangement, sound selection, structure locks.</>} tags={<Tag label="FL Studio" color="#4ade80" bg="rgba(74,222,128,0.12)" />} />
            <Step action={<><strong>Writer&apos;s block?</strong> Feed idea to Suno as demo prompt. Sparring partner only — never source material.</>} tags={<Tag label="Suno" color="#9ca3af" bg="rgba(156,163,175,0.12)" />} />
          </SopCard>

          <SopCard id="p0b" data-card-id="p0b" num="0B" numBg="#60a5fa" title="Recording" sub="Batch ALL vocals in one session — performer mode" open={openCards.has("p0b")} onToggle={toggleCard}>
            <Step action={<><strong>Body prep first.</strong> <Link href="/practice" style={{ color: "var(--accent)" }}>/practice</Link> route in Oracle → vocal warmup 5 min → body check. No dairy 2 hrs before tracking.</>} tags={<Tag label="Oracle" color="#60a5fa" bg="rgba(96,165,250,0.12)" />} />
            <Step action={<><strong>Record ALL takes.</strong> Warm water + honey. Stay hydrated. Performer mode — don&apos;t analyze while recording.</>} tags={<Tag label="FL Studio" color="#4ade80" bg="rgba(74,222,128,0.12)" />} />
            <Step action={<><strong>Rough vocal comp</strong> — choose best takes per line/section after session, not during.</>} tags={<Tag label="FL Studio" color="#4ade80" bg="rgba(74,222,128,0.12)" />} />
          </SopCard>

          <SopCard id="p0c" data-card-id="p0c" num="0C" numBg="#818cf8" title="Vocal Mix → Rough Mix" sub="Comp → tune → levels → test" open={openCards.has("p0c")} onToggle={toggleCard}>
            <Step action={<><strong>Comp + de-breath.</strong></>} tags={<Tag label="FL Studio" color="#4ade80" bg="rgba(74,222,128,0.12)" />} />
            <Step action={<><strong>Auto-Tune Pro graph-mode tuning.</strong> Surgical, not corrective. Bake when done.</>} tags={<Tag label="FL + AT Pro" color="#4ade80" bg="rgba(74,222,128,0.12)" />} />
            <Step action={<><strong>Rough mix</strong> — levels, panning, basic FX chain.</>} tags={<Tag label="FL Studio" color="#4ade80" bg="rgba(74,222,128,0.12)" />} />
            <Step action={<><strong>Test on phone + car speakers.</strong> If it sounds good there, it sounds good everywhere.</>} tags={<Who role="ETHAN" />} />
          </SopCard>

          <SopCard id="p0d" data-card-id="p0d" num="0D" numBg="#c084fc" title="Cyanite QA Gate" sub="Data must match intent before final mix" open={openCards.has("p0d")} onToggle={toggleCard}>
            <Step action={<><strong>Upload rough mix to Cyanite.</strong> Log: genre, mood, Sexy score, Chill score, R&B confidence.</>} tags={<Tag label="Cyanite" color="#818cf8" bg="rgba(129,140,248,0.12)" />} />
            <Step action={<><strong>Target thresholds:</strong> Sexy ≥ 0.76, R&B ≥ 0.70, Chill ≥ 0.56. Below = adjust mix before proceeding.</>} tags={<Tag label="Cyanite" color="#818cf8" bg="rgba(129,140,248,0.12)" />} />
            <Step action={<><strong>Save results to catalog_intelligence_matrix.json.</strong></>} tags={<Who role="CLAUDE" />} />
            <Step action={<><strong>Second draft</strong> — adjust based on Cyanite + ears. Does data match intent?</>} tags={<Tag label="FL Studio" color="#4ade80" bg="rgba(74,222,128,0.12)" />} />
          </SopCard>

          <SopCard id="p0e" data-card-id="p0e" num="0E" numBg="#f59e0b" title="Final Mix + Master" sub="Illangelo chain — two master versions" open={openCards.has("p0e")} onToggle={toggleCard}>
            <Step action={<><strong>Final mix</strong> — full FX chain, parallel compression, saturation, spatial width.</>} tags={<Tag label="FL Studio" color="#4ade80" bg="rgba(74,222,128,0.12)" />} />
            <Step action={<><strong>Master Version A</strong> — streaming (–14 LUFS integrated, –1 dBTP true peak).</>} tags={<Tag label="FL Studio" color="#4ade80" bg="rgba(74,222,128,0.12)" />} />
            <Step action={<><strong>Master Version B</strong> — club/DJ (–9 to –10 LUFS, punchier limiter). Label &quot;CDJ&quot; in filename.</>} tags={<Tag label="FL Studio" color="#4ade80" bg="rgba(74,222,128,0.12)" />} />
            <Step action={<><strong>Export stems.</strong> Drums, bass, keys/synths, vocals dry, vocals wet, full mix. Archive forever.</>} tags={<Tag label="FL Studio" color="#4ade80" bg="rgba(74,222,128,0.12)" />} />
          </SopCard>
        </section>

        {/* ── PHASE 1 ──────────────────────────────────────── */}
        <section id="p1" data-section="p1" style={{ marginBottom: 52, scrollMarginTop: 60 }} hidden={sectionHidden("phase 1 pre-upload amuse cover art isrc metadata")}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <h2 className="scroll-h3" style={{ margin: 0 }}>🎨 Phase 1 — Pre-Upload</h2>
            <button onClick={() => expandSection("p1")} style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", cursor: "pointer", padding: "2px 8px", borderRadius: 4, background: "var(--surface-2)", border: "1px solid var(--border)" }}>expand all</button>
          </div>

          <SopCard id="p1a" data-card-id="p1a" num="1A" numBg="#2dd4bf" title="Cover Art" sub="3000×3000px, <20MB, no explicit content visible" open={openCards.has("p1a")} onToggle={toggleCard}>
            <Step action={<><strong>Design in Photopea.</strong> 3000×3000px. Label OS palette. ALL LOVE era = Emerald / Gold / Navy.</>} tags={<Tag label="Photopea" color="#2dd4bf" bg="rgba(45,212,191,0.12)" />} />
            <Step action={<><strong>Export as JPG</strong> — high quality. File size &lt;20MB. No borders. No explicit text.</>} tags={<Who role="ETHAN" />} />
            <Step action={<><strong>Check on phone.</strong> Does it read at 48×48px (playlist thumbnail size)?</>} tags={<Who role="ETHAN" />} />
          </SopCard>

          <SopCard id="p1b" data-card-id="p1b" num="1B" numBg="#60a5fa" title="Upload to Amuse" sub="Genre: R&B / Alt-R&B — NEVER Pop" open={openCards.has("p1b")} onToggle={toggleCard}>
            <Step action={<><strong>Create release in Amuse Pro.</strong> Single or EP entity.</>} tags={<Tag label="Amuse" color="#c084fc" bg="rgba(192,132,252,0.12)" />} />
            <Step action={<><strong>Genre: R&B.</strong> Sub-genre: Alt-R&B. NEVER select Pop. This affects algorithmic pool selection.</>} tags={<Tag label="Amuse" color="#c084fc" bg="rgba(192,132,252,0.12)" />} />
            <Step action={<><strong>Metadata:</strong> Writer credits, producer credits, ISRC (auto-generated or carry from prior upload), UPC (auto).</>} tags={<Tag label="Amuse" color="#c084fc" bg="rgba(192,132,252,0.12)" />} />
            <Step action={<><strong>Release date:</strong> 10 days minimum from upload. Target Monday or Thursday release.</>} tags={<Tag label="Amuse" color="#c084fc" bg="rgba(192,132,252,0.12)" />} />
            <Step action={<><strong>Attach cover art.</strong> Confirm preview renders correctly.</>} tags={<Tag label="Amuse" color="#c084fc" bg="rgba(192,132,252,0.12)" />} />
            <Step action={<><strong>Submit.</strong> Save ISRC for compliance records.</>} tags={<Who role="ETHAN" />} />
          </SopCard>

          <SopCard id="p1c" data-card-id="p1c" num="1C" numBg="#f472b6" title="S4A Editorial Pitch" sub="Submit 7+ days before release date" open={openCards.has("p1c")} onToggle={toggleCard}>
            <Step action={<><strong>Go to artists.spotify.com</strong> → Upcoming → select the track.</>} tags={<Tag label="S4A" color="#a3e635" bg="rgba(163,230,53,0.12)" />} />
            <Step action={<><strong>Fill pitch form:</strong> mood (2 AM drive, late night, introspective), instrumentation (electronic, 808s, synths), genre (R&B). Be specific — vague = deprioritized.</>} tags={<Tag label="S4A" color="#a3e635" bg="rgba(163,230,53,0.12)" />} />
            <Step action={<><strong>Submit.</strong> One pitch per release. Can&apos;t resubmit. Make it count.</>} tags={<Who role="ETHAN" />} />
          </SopCard>
        </section>

        {/* ── PHASE 2 ──────────────────────────────────────── */}
        <section id="p2" data-section="p2" style={{ marginBottom: 52, scrollMarginTop: 60 }} hidden={sectionHidden("phase 2 pre-release sprint content batch dm list")}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <h2 className="scroll-h3" style={{ margin: 0 }}>🚀 Phase 2 — Pre-Release Sprint</h2>
            <button onClick={() => expandSection("p2")} style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", cursor: "pointer", padding: "2px 8px", borderRadius: 4, background: "var(--surface-2)", border: "1px solid var(--border)" }}>expand all</button>
          </div>
          <Callout type="gold">The 8-day upload-to-release window is <strong>100% marketing</strong>. Do not record. Do not fix the system. Create content, build DM list, pitch editorial, prep the blitz.</Callout>

          <SopCard id="p2a" data-card-id="p2a" num="2A" numBg="#fbbf24" title="Content Creation (T-7 to T-1)" sub="5-7 pieces batched, scheduled daily" open={openCards.has("p2a")} onToggle={toggleCard}>
            <Step action={<><strong>T-7: Batch shoot.</strong> 5–7 setups in one session. BTS, direct-to-camera, world-build, aesthetic clips. Run through content-flood pipeline for format + look.</>} tags={<><Tag label="Phone" color="#f87171" bg="rgba(248,113,113,0.12)" /><Tag label="CapCut" color="#fbbf24" bg="rgba(251,191,36,0.12)" /></>} />
            <Step action={<><strong>T-5: Teaser.</strong> 15s clip — hook or production moment. IG Reel → TikTok → Shorts. Caption: one line, hook in line 1.</>} tags={<Tag label="IG / TikTok" color="#f472b6" bg="rgba(244,114,182,0.12)" />} />
            <Step action={<><strong>T-3: World-build.</strong> Aesthetic vibe post. 2 AM drive. Studio late night. Milwaukee. The world the song lives in.</>} tags={<Tag label="IG / TikTok" color="#f472b6" bg="rgba(244,114,182,0.12)" />} />
            <Step action={<><strong>T-1: Announce.</strong> Cover art reveal + release date + pre-save CTA. Link in bio updated.</>} tags={<Tag label="IG / TikTok" color="#f472b6" bg="rgba(244,114,182,0.12)" />} />
          </SopCard>

          <SopCard id="p2b" data-card-id="p2b" num="2B" numBg="#f472b6" title="DM List Build" sub="Warm audience — not cold outreach" open={openCards.has("p2b")} onToggle={toggleCard}>
            <Step action={<><strong>Pull from IG followers</strong> who have engaged in last 30 days (likes, comments, replies to stories).</>} tags={<Tag label="IG" color="#f472b6" bg="rgba(244,114,182,0.12)" />} />
            <Step action={<><strong>Gorilla Geo tier list</strong> (if available) — T1/T2 fans in Milwaukee + Great Lakes region first.</>} tags={<Tag label="Gorilla Geo" color="#6ee7b7" bg="rgba(110,231,183,0.12)" />} />
            <Step action={<><strong>Build list of 30–50 accounts.</strong> These get a personal DM on release day.</>} tags={<Who role="ETHAN" />} />
          </SopCard>
        </section>

        {/* ── PHASE 3 ──────────────────────────────────────── */}
        <section id="p3" style={{ marginBottom: 52, scrollMarginTop: 60 }} hidden={sectionHidden("phase 3 release day activation dm post")}>
          <h2 className="scroll-h3">💥 Phase 3 — Release Day</h2>
          <Callout type="red"><strong>Full activation day.</strong> Everything you built for 8 days deploys today.</Callout>
          <Step action={<><strong>12:01 AM or 8 AM:</strong> Post release content. Link in bio updated to song. Story with swipe-up.</>} tags={<Tag label="IG / TikTok" color="#f472b6" bg="rgba(244,114,182,0.12)" />} />
          <Step action={<><strong>DM your warm list.</strong> Personal, not copy-paste. "It&apos;s live. Would mean everything if you listened."</>} tags={<Who role="ETHAN" />} />
          <Step action={<><strong>Repost any fan reactions</strong> immediately. Every stitch, repost, quote = social proof + algo signal.</>} tags={<Who role="ETHAN" />} />
          <Step action={<><strong>Pull S4A by noon.</strong> Note opening stream count. Save rate will appear within 24–48 hrs.</>} tags={<Tag label="S4A" color="#a3e635" bg="rgba(163,230,53,0.12)" />} />
          <Step action={<><strong>Update Oracle Compass pipeline status</strong> to &quot;Release Day.&quot;</>} tags={<Tag label="Oracle" color="#60a5fa" bg="rgba(96,165,250,0.12)" />} />
        </section>

        {/* ── PHASE 4 ──────────────────────────────────────── */}
        <section id="p4" style={{ marginBottom: 52, scrollMarginTop: 60 }} hidden={sectionHidden("phase 4 compound sustain metrics stitch meme")}>
          <h2 className="scroll-h3">📈 Phase 4 — Compound (T+1 to T+7)</h2>
          <Step action={<><strong>Monitor daily.</strong> Save rate, streams, skip rate. Flag any anomalies to Claude.</>} tags={<Tag label="S4A" color="#a3e635" bg="rgba(163,230,53,0.12)" />} />
          <Step action={<><strong>Stitch fan content.</strong> Every video about the song gets a stitch reaction. This signals the algo that the song has community traction.</>} tags={<Who role="ETHAN" />} />
          <Step action={<><strong>Repost milestone moments.</strong> 1K streams, first playlist add, any blog/playlist feature.</>} tags={<Who role="ETHAN" />} />
          <Step action={<><strong>Meme account seeding.</strong> Drop instrumental or hook on burner/aesthetic accounts. Let it spread organically.</>} tags={<Who role="ETHAN" />} />
          <Step action={<><strong>Sunday T+7:</strong> Full S4A data pull. Log results to LIVE_STATE.md.</>} tags={<><Tag label="S4A" color="#a3e635" bg="rgba(163,230,53,0.12)" /><Who role="CLAUDE" /></>} />
        </section>

        {/* ── PHASE 5 ──────────────────────────────────────── */}
        <section id="p5" style={{ marginBottom: 52, scrollMarginTop: 60 }} hidden={sectionHidden("phase 5 sync prep licensing supervisor")}>
          <h2 className="scroll-h3">🎬 Phase 5 — Sync Prep</h2>
          <Callout type="blue">Begins after Compound phase. Tracks with save rate &gt;3% and strong Cyanite Sexy/Chill scores are sync candidates.</Callout>
          <Step action={<><strong>Confirm stems are archived</strong> — all 6 stem files per track. No stems = no sync deal.</>} tags={<Who role="CLAUDE" />} />
          <Step action={<><strong>Cyanite score export.</strong> Sync supervisors want the data. Print it.</>} tags={<Tag label="Cyanite" color="#818cf8" bg="rgba(129,140,248,0.12)" />} />
          <Step action={<><strong>One-sheet per track.</strong> BPM, key, mood tags, Cyanite scores, scene recommendations (2 AM drive, late night restaurant, relationship tension).</>} tags={<Who role="CLAUDE" />} />
          <Step action={<><strong>Submit to Distance Over Time</strong> (pub co) for sync licensing pipeline.</>} tags={<Who role="ETHAN" />} />
        </section>

        {/* ── PHASE 6 ──────────────────────────────────────── */}
        <section id="p6" style={{ marginBottom: 52, scrollMarginTop: 60 }} hidden={sectionHidden("phase 6 system update catalog refresh live state")}>
          <h2 className="scroll-h3">🔄 Phase 6 — System Update</h2>
          <Step action={<><strong>Update LIVE_STATE.md</strong> with verified numbers (followers, ML, save rates, popularity scores).</>} tags={<><Who role="CLAUDE" /><Who role="AUTO" /></>} />
          <Step action={<><strong>Catalog refresh run.</strong> <code>node brain/refresh-catalog.mjs</code> — Spotify popularity auto-update.</>} tags={<><Tag label="AUTO" color="#6ee7b7" bg="rgba(110,231,183,0.12)" /></>} />
          <Step action={<><strong>Update catalog_intelligence_matrix.json</strong> with new Cyanite + streaming data.</>} tags={<Who role="CLAUDE" />} />
          <Step action={<><strong>Oracle pipeline</strong> → mark release Compound → Sync Prep complete.</>} tags={<Tag label="Oracle" color="#60a5fa" bg="rgba(96,165,250,0.12)" />} />
          <Step action={<><strong>Write handoff note</strong> to brain/handoffs/ with session findings, state changes, next actions.</>} tags={<Who role="CLAUDE" />} />
        </section>

        {/* ── CONTENT ──────────────────────────────────────── */}
        <section id="content" data-section="content" style={{ marginBottom: 52, scrollMarginTop: 60 }} hidden={sectionHidden("content batch capture session processing pipeline ffmpeg character")}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <h2 className="scroll-h3" style={{ margin: 0 }}>🎥 Content System</h2>
            <button onClick={() => expandSection("content")} style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", cursor: "pointer", padding: "2px 8px", borderRadius: 4, background: "var(--surface-2)", border: "1px solid var(--border)" }}>expand all</button>
          </div>

          <SopCard id="c-batch" data-card-id="c-batch" num="📸" numBg="#f472b6" title="Batch Capture Session" sub="1–2 hr shoot = 1 week of content" open={openCards.has("c-batch")} onToggle={toggleCard}>
            <Step action={<><strong>Setups (rotate each):</strong> Direct-to-camera (DTC), BTS studio, world-build aesthetic, close-up hands/gear, lifestyle Milwaukee.</>} tags={<Who role="ETHAN" />} />
            <Step action={<><strong>Minimum 5 clips per setup.</strong> Shoot vertical (9:16). 15–60s per clip. Capture B-roll between setups.</>} tags={<Who role="ETHAN" />} />
            <Step action={<><strong>Consistent character per era.</strong> ALL LOVE = Emerald / Gold / Navy. See <code>character-seed/character-sheet.yaml</code>.</>} tags={<Who role="ETHAN" />} />
          </SopCard>

          <SopCard id="c-pipe" data-card-id="c-pipe" num="⚙️" numBg="#c9a84c" title="Content Pipeline Processing" sub="node scratch/content-flood/pipeline.mjs" open={openCards.has("c-pipe")} onToggle={toggleCard}>
            <Step action={<><strong>Batch mode:</strong> <code>node pipeline.mjs --mode batch --look all-love --format all</code> — processes entire raw/ directory.</>} tags={<Tag label="Pipeline" color="#fcd34d" bg="rgba(252,211,77,0.12)" />} />
            <Step action={<><strong>Single file:</strong> <code>node pipeline.mjs --mode single --input clip.mp4 --look moody-rnb --format reel</code></>} tags={<Tag label="Pipeline" color="#fcd34d" bg="rgba(252,211,77,0.12)" />} />
            <Step action={<><strong>Looks available:</strong> all-love (Emerald/Gold/Navy), moody-rnb, warm-analog, punchy, gritty-lofi.</>} tags={<Tag label="Pipeline" color="#fcd34d" bg="rgba(252,211,77,0.12)" />} />
            <Step action={<><strong>Outputs route to queue/</strong> subdirectories: ig-feed, reel, story, tiktok, shorts, canvas. Pick up from there for CapCut finish.</>} tags={<Tag label="CapCut" color="#fbbf24" bg="rgba(251,191,36,0.12)" />} />
          </SopCard>

          <SopCard id="c-ai" data-card-id="c-ai" num="🤖" numBg="#818cf8" title="AI Character System" sub="character-sheet.yaml drives all AI image gen" open={openCards.has("c-ai")} onToggle={toggleCard}>
            <Step action={<><strong>Physical spec locked:</strong> 6&apos;2&quot;, bald, fair skin, light eyes, gold wire glasses, brown/dark-blonde beard. NOT red. Fitted monochrome works.</>} tags={<Who role="ETHAN" />} />
            <Step action={<><strong>Three modes:</strong> Urban Editorial (street + fashion), Soft Editorial (intimate, low light), Color Performer (stage, presence).</>} tags={<Tag label="AI Gen" color="#818cf8" bg="rgba(129,140,248,0.12)" />} />
            <Step action={<><strong>Use prompt scaffolds</strong> from character-sheet.yaml. Era palette: ALL LOVE = Deep Emerald + Antique Gold + Midnight Navy.</>} tags={<Tag label="AI Gen" color="#818cf8" bg="rgba(129,140,248,0.12)" />} />
          </SopCard>
        </section>

        {/* ── SOCIAL ───────────────────────────────────────── */}
        <section id="social" style={{ marginBottom: 52, scrollMarginTop: 60 }} hidden={sectionHidden("social strategy ig tiktok caption portfolio test post")}>
          <h2 className="scroll-h3">📱 Social Strategy</h2>
          <STable
            headers={["Pillar", "What it Is", "Example"]}
            rows={[
              ["The Song", "Performance, snippet, lyric pull, behind the sound", "Studio clip showing hook being built"],
              ["The World", "Aesthetic, environment, mood", "2 AM Milwaukee highway. Film grain. Gold tones."],
              ["The Artist", "Your perspective, your story (filtered)", "DTC: what you learned from last session"],
              ["The Process", "Craft, discipline, system (not theory)", "Showing the Cyanite score after mix"],
              ["The Fan", "Engagement, duets, stitches, community", "Stitching a fan singing your hook"],
            ]}
          />
          <Callout type="gold"><strong>Portfolio Test:</strong> Before every post — "Would I want to be discovered as the artist in this clip?" If no, it doesn&apos;t go up.</Callout>

          <h3 className="scroll-h4">Caption Doctrine</h3>
          <Step action={<><strong>Hook in line 1.</strong> The first line is what they see before "more." Make it land without context.</>} />
          <Step action={<><strong>No hashtag walls.</strong> Max 3–5 targeted tags. Hashtag farming is dead. Relevance signals matter more.</>} />
          <Step action={<><strong>Front-stage first.</strong> Listener-facing copy leads with vibe (2 AM drive, late night, dark R&B). Never lead with the operator narrative.</>} />
        </section>

        {/* ── OUTREACH ─────────────────────────────────────── */}
        <section id="outreach" style={{ marginBottom: 52, scrollMarginTop: 60 }} hidden={sectionHidden("dm outreach playlist curator blitz cold warm")}>
          <h2 className="scroll-h3">📩 DM Outreach</h2>
          <STable
            headers={["Lane", "Target", "Message Type"]}
            rows={[
              ["Warm Fan DMs", "IG followers who engaged in last 30 days", "Personal. \"It&apos;s live. Means everything.\" Max 50."],
              ["Playlist Curator Blitz", "R&B / late-night / study lo-fi playlists (1K–50K followers)", "Track one-liner + Cyanite data + Spotify link. Keep under 3 sentences."],
              ["Artist/Producer Network", "Peers in the KAYTRANADA / Faiyaz / 6LACK lane", "Genuine listener engagement first. DM after 3+ interactions."],
            ]}
          />
          <Callout type="red"><strong>No mass copy-paste.</strong> Algorithmic outreach gets ignored. Personal &gt; volume. 30 personal DMs outperform 300 copy-pastes.</Callout>
        </section>

        {/* ── GORILLA GEO ──────────────────────────────────── */}
        <section id="geo" style={{ marginBottom: 52, scrollMarginTop: 60 }} hidden={sectionHidden("gorilla geo pipeline module audience targeting")}>
          <h2 className="scroll-h3">🗺️ Gorilla Geo</h2>
          <Callout type="blue">5-module audience pipeline. Current status: Module 1 running. Gap is triggering architecture, not app code. Credentials verified.</Callout>
          <STable
            headers={["Module", "What It Does", "Status"]}
            rows={[
              ["Module 1: Geo Seed", "Pull T4 artists in target cities. Classify by tier.", "✅ Running — tier-classified.json (~1.4MB)"],
              ["Module 2: IG Derivation", "2b-ig-autofill.js heuristic IG handle derivation", "✅ Built — HIGH/MEDIUM/LOW/REVIEW confidence"],
              ["Module 3: Export", "Format for DM queue", "⏳ Pending trigger"],
              ["Module 4: Outreach Log", "Track DM sends, responses", "⏳ Pending"],
              ["Module 5: Analysis", "Which geo/tier converts", "⏳ Pending"],
            ]}
          />
          <Step action={<><strong>When to run:</strong> Pre-release sprint. Feed outputs into DM list for Phase 2B.</>} tags={<Who role="ANTIGRAVITY" />} />
        </section>

        {/* ── REVENUE ──────────────────────────────────────── */}
        <section id="revenue" style={{ marginBottom: 52, scrollMarginTop: 60 }} hidden={sectionHidden("revenue stack streaming royalties ascap soundexchange rights")}>
          <h2 className="scroll-h3">💰 Revenue Stack</h2>
          <STable
            headers={["Stream", "Source", "Notes"]}
            rows={[
              ["Streaming royalties", "Amuse Pro (monthly)", "Performance + mechanical. R&B pool."],
              ["Performance royalties", "ASCAP", "Radio, sync, live performance. Register Thursday after each release."],
              ["Mechanical royalties", "MLC (Music Licensing Collective)", "Register Thursday after each release."],
              ["Digital performance", "SoundExchange", "Non-interactive streaming (Pandora, SiriusXM). Register Thursday."],
              ["Publishing admin", "Songtrust", "International sub-publishing. Registered."],
              ["Sync licensing", "Distance Over Time (pub co)", "Placed after Phase 5 prep. Activate post-Compound."],
              ["Live", "Milwaukee shows + Lake Geneva + McHenry", "Phase 2+ only. Audience exists first."],
              ["DoorDash bridge", "DoorDash", "$1,800/mo target. Stop when hit."],
            ]}
          />

          <h3 className="scroll-h4">Rights Infrastructure (fully built)</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, margin: "8px 0" }}>
            <Pill>✅ Distance Over Time (pub co)</Pill>
            <Pill>✅ ASCAP (writer)</Pill>
            <Pill>✅ Songtrust (admin)</Pill>
            <Pill>✅ SoundExchange</Pill>
            <Pill>✅ MLC registered</Pill>
            <Pill>✅ IP lawyer on file</Pill>
            <Pill>✅ Passman book read</Pill>
          </div>
          <Callout type="green">Rights layer is complete. Do NOT flag as a gap. Only action needed: register each new release Thursday after drop.</Callout>
        </section>

        {/* ── COMPLIANCE ───────────────────────────────────── */}
        <section id="compliance" style={{ marginBottom: 52, scrollMarginTop: 60 }} hidden={sectionHidden("compliance calendar thursday ascap soundexchange mlc registration")}>
          <h2 className="scroll-h3">📋 Compliance Calendar</h2>
          <Callout type="red"><strong>Rule:</strong> Compliance happens the <strong>Thursday AFTER release</strong>. Not before. Not the day of. Thursday. Every time.</Callout>
          <STable
            headers={["Release", "Drop Date", "Compliance Thursday", "Action"]}
            rows={[
              ["East Side Love", "May 8 ✓", "May 15 ✓", "ASCAP + SoundExchange + Songtrust + MLC"],
              ["ALL LOVE EP (5 tracks)", "May 29", "Jun 5", "All 5 tracks — ASCAP + SoundExchange + Songtrust + MLC"],
              ["I Like Girls", "Jun 12", "Jun 19", "ASCAP + SoundExchange + Songtrust + MLC"],
              ["Like I Did", "Jun 26", "Jul 3", "ASCAP + SoundExchange + Songtrust + MLC"],
              ["Worth It", "Jul 10", "Jul 17", "ASCAP + SoundExchange + Songtrust + MLC"],
              ["Just Say So", "Jul 24", "Jul 31", "ASCAP + SoundExchange + Songtrust + MLC"],
              ["Reconnect", "Aug 7", "Aug 13", "ASCAP + SoundExchange + Songtrust + MLC"],
            ]}
          />
        </section>

        {/* ── AI DELEGATION ────────────────────────────────── */}
        <section id="ai" style={{ marginBottom: 52, scrollMarginTop: 60 }} hidden={sectionHidden("ai delegation opus sonnet haiku antigravity model routing")}>
          <h2 className="scroll-h3">🤖 AI Delegation Protocol</h2>
          <STable
            headers={["Model / Tool", "Use For", "Do NOT Use For"]}
            rows={[
              ["Opus (Claude)", "Architecture, strategy, incident debugging, cross-system audits, anything broken", "Mechanical refactors, simple file edits, batch transforms"],
              ["Sonnet (Claude)", "Mechanical refactors, file migrations, routine edits, large batch writes", "Architecture decisions, strategic reasoning"],
              ["Haiku (Claude)", "Oracle decree generation, lightweight API calls, short-form content loops", "Complex reasoning, multi-file coordination"],
              ["Antigravity (Gemini)", "Heavy filesystem writes, git pushes, batch file work, running scripts", "Strategy, architecture, cross-system audits"],
              ["AUTO (cron/scripts)", "Catalog refresh (biweekly), scheduled tasks, pipeline automation", "Anything requiring judgment or approval"],
            ]}
          />
          <Callout type="red"><strong>Zero Opus burn rule:</strong> Content pipeline implementation, character sheet iteration, mechanical file edits = Sonnet or Antigravity. Only bring Opus for architecture decisions or when something breaks.</Callout>

          <h3 className="scroll-h4">Scheduled Automations</h3>
          <Step action={<><strong>Catalog refresh:</strong> Monday + Wednesday 10 AM — <code>node brain/refresh-catalog.mjs</code></>} tags={<Who role="AUTO" />} />
          <Step action={<><strong>Batch content processing:</strong> Run manually during Phase 2 sprint — <code>node content-flood/pipeline.mjs</code></>} tags={<Who role="ANTIGRAVITY" />} />
        </section>

        {/* ── CREAM ────────────────────────────────────────── */}
        <section id="cream" style={{ marginBottom: 52, scrollMarginTop: 60 }} hidden={sectionHidden("cream protocol tracklist lock album second project")}>
          <h2 className="scroll-h3">🏆 CREAM Protocol</h2>
          <Callout type="green"><strong>CREAM is CONFIRMED.</strong> The question is not &quot;if&quot; — it&apos;s &quot;which 5 tracks.&quot; Jul 24 is tracklist lock based on data from the vault waterfall.</Callout>

          <h3 className="scroll-h4">CREAM Tracklist Lock: July 24, 2026</h3>
          <p className="scroll-p">Decision criteria: pop score delta + save rate + live traction. Data-sorted top 5 as of May 14:</p>
          <STable
            headers={["Rank", "Track", "Why"]}
            rows={[
              ["1", "Coming Down", "Top pop score delta"],
              ["2", "Same Time", "Strong save rate signal"],
              ["3", "Keep Coming Back", "Consistent performance"],
              ["4", "Can't Let You Go", "Audience retention"],
              ["5", "Underneath It All", "Depth pick"],
              ["Wild Card", "Only Natural", "R&B 0.94, Sexy 0.87 — vault high. Needs minor key darkening."],
            ]}
          />

          <h3 className="scroll-h4">Pre-Production Timeline</h3>
          <Step action={<><strong>Jul 24:</strong> Tracklist locked. No changes after this date.</>} />
          <Step action={<><strong>Aug 15+:</strong> CREAM pre-production begins (100-day mark = APG activation threshold).</>} />
          <Step action={<><strong>Studio locations:</strong> Milwaukee (home base) + Lake Geneva (DoorDash territory) + McHenry IL (GF&apos;s area).</>} />
          <Step action={<><strong>Song Structure Study starts May 16:</strong> One 20-min format study per Tuesday session. 8 weeks = structural intuition for CREAM.</>} />

          <Callout type="blue"><strong>APG note:</strong> Manager exists at APG (A&R). Dormant — activates around Aug 15 if algorithmic targets hit. Do NOT describe Ethan as having &quot;no manager.&quot; Results activate the relationship.</Callout>
        </section>

        {/* ── RULES ────────────────────────────────────────── */}
        <section id="rules" style={{ marginBottom: 52, scrollMarginTop: 60 }} hidden={sectionHidden("rules anti-drift standing rules distributor amuse")}>
          <h2 className="scroll-h3">⚔️ Standing Rules — Anti-Drift</h2>
          <p className="scroll-p">These never change without explicit instruction from Ethan. If you see drift on any — revert and flag.</p>

          <RuleBlock num={1}><strong>Distributor is Amuse Pro.</strong> Not DistroKid. Never. Antigravity has hallucinated this before — any DistroKid reference gets reverted immediately.</RuleBlock>
          <RuleBlock num={2}><strong>Genre tagging on Amuse = R&B / Alt-R&B.</strong> NEVER Pop. This affects algorithmic pool selection. Every upload — check this.</RuleBlock>
          <RuleBlock num={3}><strong>Never trust Antigravity&apos;s claimed file writes</strong> — verify against live filesystem. Check timestamps. Treat all claims as unverified until confirmed.</RuleBlock>
          <RuleBlock num={4}><strong>Software work is OPEN as needed.</strong> No speculative builds. Fix what blocks active work. No new infrastructure for infrastructure&apos;s sake.</RuleBlock>
          <RuleBlock num={5}><strong>Kill List is the single source of truth for daily priorities.</strong> Oracle → /kill. RED tasks before anything else.</RuleBlock>
          <RuleBlock num={6}><strong>Compliance happens Thursday AFTER release.</strong> Not before. Not the day of. Thursday. See compliance calendar above.</RuleBlock>
          <RuleBlock num={7}><strong>The 8-day sprint window is ALL marketing.</strong> No production. No system fixes. Create content, pitch, DM, post.</RuleBlock>
          <RuleBlock num={8}><strong>Before any collaboration: splits agreed in writing before the session opens.</strong> Text confirmation with percentages is binding enough to start.</RuleBlock>
          <RuleBlock num={9}><strong>The 90-second Kill List exit signal is sacred.</strong> Scan RED tasks → close → work. No rabbit holes. Timer if needed.</RuleBlock>
          <RuleBlock num={10}><strong>Post what you want to be discovered as.</strong> The Portfolio Test on every content decision. If it doesn&apos;t represent the artist becoming — it doesn&apos;t go up.</RuleBlock>
          <RuleBlock num={11}><strong>Oracle main is canonical.</strong> v2 is dead. Baselined at 56ba9d1 (May 12, 2026). Never treat v2 as authoritative.</RuleBlock>
          <RuleBlock num={12}><strong>LIVE_STATE.md is the anti-compaction shield.</strong> Read it first every session. Trust it over conversation memory. Update when verified numbers change.</RuleBlock>
          <RuleBlock num={13}><strong>Manager exists (APG).</strong> Dormant — activates at 100-day mark (Aug 15) if targets hit. Do NOT describe Ethan as having &quot;no manager.&quot;</RuleBlock>
          <RuleBlock num={14}><strong>Website exists</strong> — ethanpayton.com on Wix. Dormant, not missing. Retrofit = 30-min job, not a redesign.</RuleBlock>

          <div style={{ marginTop: 40, paddingTop: 24, borderTop: "1px solid var(--border)", textAlign: "center" }}>
            <p className="scroll-page-tag" style={{ marginBottom: 6 }}>past.El noir Records · Label OS · May 2026</p>
            <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Create till 30. No breaks. The system makes that sustainable.</p>
          </div>
        </section>

      </main>
    </div>
  );
}
