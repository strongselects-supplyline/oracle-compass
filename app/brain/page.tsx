"use client";

import { useEffect, useState } from "react";
import { getDynamicReleases } from "@/lib/releases";
import { getMakeModeWeek } from "@/lib/oracle";
import { PROJECTS } from "@/lib/studioData";


function getPhasePercent(): number {
  const makeStart = Date.UTC(2026, 2, 1);
  const pushEnd = Date.UTC(2026, 3, 24);
  const now = Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
  const total = pushEnd - makeStart;
  const elapsed = Math.max(0, Math.min(now - makeStart, total));
  return Math.round((elapsed / total) * 100);
}

export default function BrainPage() {
  const [uploadedSingles, setUploadedSingles] = useState(0);
  const [albumTracksReady, setAlbumTracksReady] = useState(0);
  const week = getMakeModeWeek();
  const phasePercent = getPhasePercent();
  const apr3Done = Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) >= Date.UTC(2026, 3, 3);

  const currentPhase =
    phasePercent < 45 ? "MAKE" :
      phasePercent < 75 ? "SHIP" : "PUSH";

  useEffect(() => {
    // Dynamic — reflects Oracle status updates
    getDynamicReleases().then(releases => {
      setUploadedSingles(releases.filter(s => s.status === "live").length);
    });
    // Count ALL LOVE album tracks that are mixed or mastered
    const allLove = PROJECTS.find(p => p.id === "all-love");
    if (allLove) {
      const ready = allLove.tracks.filter(t => ["mastered", "on_album", "album_live"].includes(t.status)).length;
      setAlbumTracksReady(ready);
    }
  }, []);

  return (
    <main className="page animate-fade-in">
      <div className="page-inner">

        {/* ── Mode Declaration ── */}
        <div className="mb-10">
          <h1 className="text-5xl font-black tracking-tight mb-2 leading-none">MAKE MODE</h1>
          <p className="text-[var(--text-secondary)] text-sm leading-relaxed font-medium">
            Studio is primary. Everything else is Track 2.<br />
            Mar 1 → Apr 24
          </p>
        </div>

        {/* ── The 6 Scrolls ── */}
        <div className="card mb-6" style={{ borderColor: 'var(--accent)', borderWidth: '1px' }}>
          <p className="text-[10px] font-black tracking-[0.18em] uppercase mb-4" style={{ color: 'var(--accent)' }}>📜 The 6 Scrolls</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { n: "1", name: "Waking Mind", href: "#waking-mind", icon: "🧠" },
              { n: "2", name: "Mudras & Breath", href: "/reference.html", icon: "🙏" },
              { n: "3", name: "Body Budget", href: "/scroll-body-codex.html", icon: "⚡" },
              { n: "4", name: "Rank Scroll", href: "/scroll-rank.html", icon: "🎯" },
              { n: "5", name: "Mixing Codex", href: "#mixing-ladder", icon: "🎚️" },
              { n: "6", name: "Vocal Codex", href: "#vocal-codex", icon: "🎤" },
            ].map(s => (
              <a
                key={s.n}
                href={s.href}
                className="flex items-center gap-2 p-3 rounded-xl border transition-all active:scale-[0.97]"
                style={{ borderColor: 'var(--border)', background: 'var(--surface-2)' }}
              >
                <span className="text-lg">{s.icon}</span>
                <div>
                  <span className="text-[9px] font-black tracking-wider uppercase" style={{ color: 'var(--accent)' }}>Scroll {s.n}</span>
                  <p className="text-[11px] font-bold" style={{ color: 'var(--text-primary)' }}>{s.name}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* ── Sovereignty Dashboard ── */}
        <SovereigntyDashboard />

        {/* ── Phase Bar ── */}
        <div className="mb-12">
          <div className="waterfall-bar mb-3" style={{ height: "8px", borderRadius: "4px" }}>
            <div className="waterfall-fill bg-amber-500" style={{ width: `${phasePercent}%` }} />
          </div>
          <div className="flex justify-between text-[10px] font-black tracking-[0.15em] text-[#555] uppercase">
            <span className={currentPhase === "MAKE" ? "text-amber-400" : ""}>MAKE</span>
            <span className={currentPhase === "SHIP" ? "text-amber-400" : ""}>SHIP</span>
            <span className={currentPhase === "PUSH" ? "text-amber-400" : ""}>PUSH</span>
          </div>
          <p className="text-[10px] text-amber-500 mt-2 font-black tracking-widest uppercase text-center">
            ↑ Week {week} of 5
          </p>
        </div>

        {/* ── Exit Criteria ── */}
        <div className="card mb-14">
          <p className="text-[10px] font-black text-[#555] mb-4 uppercase tracking-widest">
            MAKE MODE closes when:
          </p>
          <ExitLine
            done={uploadedSingles >= 4}
            label={`4 singles uploaded (${uploadedSingles}/4)`}
          />
          <ExitLine done={albumTracksReady >= 4} label={`4 EP tracks uploaded (${albumTracksReady}/4)`} />
          <ExitLine done={apr3Done} label={`Apr 3 — pre-release milestone`} />
        </div>

        {/* ── Philosophical Anchors ── */}
        <div className="space-y-8 mb-12">
          <Anchor text="Done is the tribute." />
          <Anchor text="Every move must compound." />
          <Anchor text="The anesthesia phase is over." />
          <div>
            <Anchor text="You are the Jinchuriki." />
            <p className="text-[#888] text-base font-medium leading-relaxed mt-3 ml-1">
              Master the seal.<br />
              Channel the power.<br />
              <span className="text-[#666] mt-1 block">ALL LOVE is the output.</span>
            </p>
          </div>
          <div>
            <Anchor text="The mind is an organ. Not an identity." />
            <p className="text-[#888] text-sm font-medium leading-relaxed mt-3 ml-1">
              Observe it. Don&apos;t become it.<br />
              Your nervous system branches like a river. Your heartbeat has a healthy fractal rhythm.<br />
              The mind that can watch itself is the mind that can change itself.
            </p>
            <p className="text-[10px] text-[#555] italic mt-2 ml-1">
              Interrupt: &ldquo;What is my mind doing right now?&rdquo; — not &ldquo;Why am I like this?&rdquo;
            </p>
          </div>
          <div>
            <Anchor text="Design for the worst case. Be surprised by the rest." />
            <p className="text-[#888] text-sm font-medium leading-relaxed mt-3 ml-1">
              Strategy based on 90% chance of success is a fragile strategy.<br />
              <span className="text-[11px] text-[#555] italic">Worst-case first. Then act.</span>
            </p>
          </div>
        </div>

        {/* ── Sovereign Trajectory ── */}
        <div className="card mb-10">
          <p className="text-[10px] font-black tracking-[0.18em] text-[#555] uppercase mb-4">The Sovereign Trajectory</p>
          <p className="text-[10px] text-[#444] font-medium mb-4">You are not just running a sprint. You are building the architecture the next generation of independent artists will study.</p>
          {[
            { tier: "JONIN", label: "Elite Operator", desc: "Cross-functional mastery. Production, mixing, writing, marketing. Oracle + Gorilla Geo + Content Factory running.", status: "past", color: "#555" },
            { tier: "KAGE", label: "Sovereign Leader", desc: "Entirely self-contained. No vocal coach. No mixing engineer. No external gatekeeper. The codex IS the coach. Apr 24.", status: "current", color: "#d97706" },
            { tier: "S-RANK", label: "The Disruptor", desc: "Algorithm gravity well. 4%+ save rate. Gorilla Geo outreach forcing industry to react to you. Not asking for placement — engineering it. Apr 25–Jul 5.", status: "next", color: "#10b981" },
            { tier: "SANNIN", label: "Cultural Pillar", desc: "Multi-era track record. CREAM + FREAKSHOW cycles complete. The Mudra System, Waking Mind Protocol, Hearing In Color — proprietary \"forbidden jutsu\" documented and proven. Q4 2026+.", status: "building", color: "#6366f1" },
            { tier: "GOD OF SHINOBI", label: "Paradigm Shifter", desc: "You don\'t operate in the ecosystem. You build it. Label OS as a methodology. Hearing In Color as a curriculum. Sonic frameworks that redefine what independent R&B looks like for a decade.", status: "architecture", color: "#c9a227" },
          ].map((item, i) => (
            <div key={i} className={`flex items-start gap-3 py-3 border-b border-[#1a1a1a] last:border-0 ${item.status === "current" ? "border-l-2 border-l-amber-500/50 pl-3 -ml-3" : ""}`}>
              <div className="flex-shrink-0 w-20">
                <div style={{ color: item.color }} className="text-[9px] font-black tracking-wider uppercase">{item.tier}</div>
                <div className="text-[9px] text-[#333] mt-0.5">{item.label}</div>
                {item.status === "current" && <div className="text-[8px] text-amber-500 font-black mt-1">● NOW</div>}
              </div>
              <p className="text-[10px] text-[#444] leading-relaxed flex-1">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* ── NSDR Recovery Protocol ── */}
        <div className="card mb-10">
          <p className="text-[10px] font-black tracking-[0.18em] text-[#555] uppercase mb-4">Recovery Protocol</p>
          <div className="space-y-0">
            {[
              { step: "Morning: Delay first meal", note: "IF window = repair state" },
              { step: "10-20min NSDR / Yoga Nidra", note: "After depleted sessions — replenishes dopamine faster than caffeine" },
              { step: "Observer mode interrupt", note: "\"What is my mind doing?\" — not \"Why am I like this?\"" },
              { step: "Creatine 5g daily", note: "20-25g when sleep-deprived (cognitive rescue protocol)" },
              { step: "No social media during reset window", note: "Retriggers the drain. Open after, not during." },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 py-2.5 border-b border-[#1a1a1a] last:border-0">
                <span className="text-amber-500 font-black text-[10px] flex-shrink-0 mt-0.5">{i + 1}</span>
                <div>
                  <div className="text-xs font-bold text-white">{item.step}</div>
                  <div className="text-[10px] text-[#444] mt-0.5">{item.note}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── WAKING MIND PROTOCOL ── */}
        <div id="waking-mind">
          <WakingMindProtocol />
        </div>

        {/* ── BLITZKRIEG PROTOCOL ── */}
        <BlitzkriegProtocol />

        {/* ── TEXTURED PRODUCTION ── */}
        <TexturedProduction />

        {/* ── THE LUFS MIXING LADDER ── */}
        <div id="mixing-ladder">
          <MixingProtocol />
        </div>

        {/* ── VOCAL CODEX ── */}
        <div id="vocal-codex">
          <VocalProtocol />
        </div>

        {/* ── Hearing In Color ── */}
        <div className="card mb-6" style={{ borderColor: "#c9a22722" }}>
          <p className="text-[10px] font-black tracking-[0.18em] text-[#555] uppercase mb-2">Hearing In Color — The Methodology</p>
          <p className="text-[10px] text-[#888] font-medium leading-relaxed mb-3">
            This is not a genre. It is a <span className="text-[#c9a227] font-bold">sensory translation system</span>. The art converts emotional frequency into sonic color. The listener doesn&apos;t just hear the record — they feel its temperature, weight, and texture.
          </p>
          <div className="space-y-2">
            {[
              { label: "The Sonic Signature", note: "Sexy 0.76 / Chill 0.56. Deep emerald + gold warmth + noir shadow. Grainy 35mm grain on the visual layer. Whispered fry → haunting falsetto. This is the frequency range. Everything produced must live inside it.", color: "#c9a227" },
              { label: "The 40Hz Architecture", note: "Sub frequencies carry emotional weight. Not just bass — physiological resonance. The body feels the record before the brain processes it. Every master targets felt sub-frequency presence, not just metered loudness.", color: "#a78a1a" },
              { label: "The Long Game", note: "Post-Jul 5: Hearing In Color becomes a curriculum. Stem packs, vocal methodology, the Label OS itself. Other independent artists won\'t just study the music — they\'ll study the system that built it.", color: "#8a7015" },
            ].map((item, i) => (
              <div key={i} className="py-2 border-b border-[#1a1a1a] last:border-0">
                <div className="text-[10px] font-bold text-[#c9a227] mb-0.5">{item.label}</div>
                <p className="text-[10px] text-[#444] leading-relaxed">{item.note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Publishing Protocol ── */}
        <div className="card mb-10" style={{ borderColor: "#ef444422" }}>
          <p className="text-[10px] font-black tracking-[0.18em] text-[#555] uppercase mb-2">Publishing Protocol — Standing Rule</p>
          <p className="text-[11px] text-red-400/80 font-bold mb-2">Before any collaboration: splits agreed in writing before the session opens.</p>
          <p className="text-[10px] text-[#444] leading-relaxed mb-3">
            Not after. Not &ldquo;we&apos;ll figure it out.&rdquo; Troy Taylor signed away publishing in perpetuity without a lawyer. Label OS exists to prevent that.
          </p>
          <div className="space-y-1.5">
            <div className="text-[10px] text-[#555]"><span className="text-red-400 font-bold">Step 1:</span> Text confirmation with exact percentages before the session starts.</div>
            <div className="text-[10px] text-[#555]"><span className="text-red-400 font-bold">Step 2:</span> Proper split sheet before any commercial release. Not after mixing. Before release.</div>
            <div className="text-[10px] text-[#555]"><span className="text-red-400 font-bold">Step 3:</span> Pull ISRCs from Amuse before any registration. Amuse is the distributor. Always has been.</div>
          </div>
        </div>

        {/* ── Mission Statement ── */}
        <div className="border-t border-[#1e1e1e] pt-8 pb-4">
          <p className="text-[10px] font-black tracking-[0.15em] text-[#666] uppercase leading-relaxed">
            Sovereign Creator. Zero Dependency.<br />
            Zero-Cost Stack. S-Tier standard.<br />
            Every move compounds relentlessly into the next.
          </p>
        </div>

      </div>
    </main>
  );
}

// ─────────────────────────────────────────────
// SOVEREIGNTY DASHBOARD — Live progress tracker
// ─────────────────────────────────────────────
const SOBRIETY_START = new Date("2026-04-02T00:00:00"); // Day 1

const ANBU_BENCHMARKS = [
  "ALL LOVE EP Released — Apr 24 data logged",
  "3 tracks Live on Spotify — SF, ESL, Like I Did",
  "Save Rate 3%+ on at least 1 track",
  "Gorilla Geo Activated — 3–5 DMs/day consistent",
  "Sobriety Day 60 — clock not reset",
  "Content Factory — 3+ assets/week consistent",
  "DoorDash $1,800/mo — April confirmed",
  "DoorDash $1,800/mo — May confirmed",
  "S3 Check-in running every studio day",
  "Grief Protocol — first journal entry by Apr 27",
  "ALL LOVE Deluxe decision logged by Apr 27",
  "Instagram bio updated and verified",
];

function SovereigntyDashboard() {
  const [sobrietyDays, setSobrietyDays] = useState(0);
  const [checks, setChecks] = useState<boolean[]>(Array(ANBU_BENCHMARKS.length).fill(false));
  const [griefEntry, setGriefEntry] = useState("");
  const [griefLog, setGriefLog] = useState<{ date: string; text: string }[]>([]);
  const [weeklyData, setWeeklyData] = useState({ spotify: "", saves: "", doordash: "", geo: "" });
  const [weeklyLog, setWeeklyLog] = useState<{ date: string; data: typeof weeklyData }[]>([]);
  const [activeTab, setActiveTab] = useState<"sobriety" | "anbu" | "grief" | "data">("sobriety");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Sobriety days
    const now = new Date();
    const diff = Math.floor((now.getTime() - SOBRIETY_START.getTime()) / (1000 * 60 * 60 * 24));
    setSobrietyDays(Math.max(0, diff));

    // Load persisted state
    try {
      const sc = localStorage.getItem("anbu-checks");
      if (sc) setChecks(JSON.parse(sc));
      const gl = localStorage.getItem("grief-log");
      if (gl) setGriefLog(JSON.parse(gl));
      const wl = localStorage.getItem("weekly-data-log");
      if (wl) setWeeklyLog(JSON.parse(wl));
    } catch {}
  }, []);

  const toggleCheck = (i: number) => {
    const next = [...checks];
    next[i] = !next[i];
    setChecks(next);
    localStorage.setItem("anbu-checks", JSON.stringify(next));
  };

  const submitGrief = () => {
    if (!griefEntry.trim()) return;
    const entry = { date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), text: griefEntry.trim() };
    const next = [entry, ...griefLog].slice(0, 20);
    setGriefLog(next);
    localStorage.setItem("grief-log", JSON.stringify(next));
    setGriefEntry("");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const submitData = () => {
    if (!weeklyData.spotify && !weeklyData.doordash) return;
    const entry = { date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }), data: { ...weeklyData } };
    const next = [entry, ...weeklyLog].slice(0, 12);
    setWeeklyLog(next);
    localStorage.setItem("weekly-data-log", JSON.stringify(next));
    setWeeklyData({ spotify: "", saves: "", doordash: "", geo: "" });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const checkedCount = checks.filter(Boolean).length;
  const daysToAnbu = Math.max(0, Math.ceil((new Date("2026-06-01").getTime() - Date.now()) / 86400000));
  const sobrietyPct = Math.min(100, Math.round((sobrietyDays / 60) * 100));

  const tabs = [
    { id: "sobriety" as const, label: "⏱ Clock", },
    { id: "anbu" as const, label: "🎯 ANBU", },
    { id: "grief" as const, label: "📓 Journal", },
    { id: "data" as const, label: "📊 Data", },
  ];

  return (
    <div className="card mb-10" style={{ borderColor: 'var(--border)' }}>
      <p className="text-[10px] font-black tracking-[0.18em] uppercase mb-3" style={{ color: 'var(--accent)' }}>⚔️ Sovereignty Dashboard</p>

      {/* Tab Bar */}
      <div className="flex gap-1 mb-4 border-b" style={{ borderColor: 'var(--border)' }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className="pb-2 px-2 text-[10px] font-black tracking-wider uppercase transition-all"
            style={{
              color: activeTab === t.id ? 'var(--accent)' : 'var(--text-muted)',
              borderBottom: activeTab === t.id ? '2px solid var(--accent)' : '2px solid transparent',
              marginBottom: '-1px',
            }}
          >{t.label}</button>
        ))}
      </div>

      {/* SOBRIETY TAB */}
      {activeTab === "sobriety" && (
        <div>
          <div className="text-center mb-4">
            <div className="text-6xl font-black mb-1" style={{ color: sobrietyDays >= 60 ? '#10b981' : 'var(--accent)' }}>
              {sobrietyDays}
            </div>
            <div className="text-[11px] font-black tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
              Days Clean · Since Apr 2
            </div>
          </div>
          <div className="mb-3">
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface-2)' }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${sobrietyPct}%`, background: sobrietyDays >= 60 ? '#10b981' : '#d97706' }} />
            </div>
            <div className="flex justify-between mt-1 text-[9px]" style={{ color: 'var(--text-muted)' }}>
              <span>Day 0</span>
              <span className="font-black" style={{ color: 'var(--accent)' }}>Day 60 = ANBU</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <div className="p-3 rounded-xl text-center" style={{ background: 'var(--surface-2)' }}>
              <div className="text-lg font-black" style={{ color: 'var(--text-primary)' }}>{daysToAnbu}</div>
              <div className="text-[9px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Days to ANBU</div>
            </div>
            <div className="p-3 rounded-xl text-center" style={{ background: 'var(--surface-2)' }}>
              <div className="text-lg font-black" style={{ color: checkedCount >= 12 ? '#10b981' : 'var(--accent)' }}>{checkedCount}/12</div>
              <div className="text-[9px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Benchmarks</div>
            </div>
          </div>
          {sobrietyDays >= 60 && (
            <div className="mt-4 p-3 rounded-xl text-center" style={{ background: 'rgba(16,185,129,0.1)', borderColor: '#10b981', borderWidth: 1 }}>
              <p className="text-[11px] font-black" style={{ color: '#10b981' }}>🟢 SOBRIETY GATE: PASSED — DAY 60 COMPLETE</p>
            </div>
          )}
        </div>
      )}

      {/* ANBU CHECKLIST TAB */}
      {activeTab === "anbu" && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Gate closes June 1, 2026 — {daysToAnbu} days away</span>
            <span className="text-[10px] font-black" style={{ color: checkedCount === 12 ? '#10b981' : 'var(--accent)' }}>{checkedCount}/12</span>
          </div>
          <div className="space-y-2">
            {ANBU_BENCHMARKS.map((b, i) => (
              <button
                key={i}
                onClick={() => toggleCheck(i)}
                className="w-full flex items-start gap-3 p-2 rounded-lg text-left transition-all active:scale-[0.98]"
                style={{ background: checks[i] ? 'rgba(16,185,129,0.08)' : 'var(--surface-2)' }}
              >
                <span className="flex-shrink-0 mt-0.5 text-sm font-black" style={{ color: checks[i] ? '#10b981' : 'var(--text-muted)' }}>
                  {checks[i] ? '✓' : '□'}
                </span>
                <span className="text-[11px] font-medium leading-snug" style={{ color: checks[i] ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: checks[i] ? 'line-through' : 'none' }}>
                  {b}
                </span>
              </button>
            ))}
          </div>
          {checkedCount === 12 && (
            <div className="mt-4 p-3 rounded-xl text-center" style={{ background: 'rgba(16,185,129,0.1)', borderColor: '#10b981', borderWidth: 1 }}>
              <p className="text-[11px] font-black" style={{ color: '#10b981' }}>⚡ ALL BENCHMARKS MET — PROMOTION CEREMONY READY</p>
            </div>
          )}
        </div>
      )}

      {/* GRIEF JOURNAL TAB */}
      {activeTab === "grief" && (
        <div>
          <p className="text-[10px] font-medium mb-3" style={{ color: 'var(--text-muted)' }}>
            Required: 1 entry/week from Apr 27. Grief protocol = ANBU gate requirement.
          </p>
          <textarea
            value={griefEntry}
            onChange={e => setGriefEntry(e.target.value)}
            placeholder="What surfaced this week? What are you carrying? What needs to move?"
            className="w-full text-[12px] p-3 rounded-xl border resize-none outline-none leading-relaxed"
            style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--text-primary)', minHeight: '100px' }}
          />
          <button
            onClick={submitGrief}
            className="mt-2 w-full py-2.5 rounded-xl text-[11px] font-black tracking-wider uppercase transition-all active:scale-[0.98]"
            style={{ background: 'var(--accent)', color: '#0a0a0a' }}
          >
            {saved ? '✓ LOGGED' : 'LOG ENTRY'}
          </button>
          {griefLog.length > 0 && (
            <div className="mt-4 space-y-3">
              <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Previous Entries ({griefLog.length})</p>
              {griefLog.slice(0, 3).map((e, i) => (
                <div key={i} className="p-3 rounded-xl" style={{ background: 'var(--surface-2)' }}>
                  <p className="text-[9px] font-black mb-1" style={{ color: 'var(--accent)' }}>{e.date}</p>
                  <p className="text-[11px] leading-snug" style={{ color: 'var(--text-secondary)' }}>{e.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* WEEKLY DATA TAB */}
      {activeTab === "data" && (
        <div>
          <p className="text-[10px] font-medium mb-3" style={{ color: 'var(--text-muted)' }}>
            Pull every Sunday. The data is the judge.
          </p>
          <div className="space-y-2">
            {[
              { key: "spotify" as const, label: "Spotify Followers", placeholder: "e.g. 1,247" },
              { key: "saves" as const, label: "Best Save Rate %", placeholder: "e.g. 4.2%" },
              { key: "doordash" as const, label: "DoorDash Revenue (mo)", placeholder: "e.g. $1,840" },
              { key: "geo" as const, label: "Gorilla Geo God-Tier Responses", placeholder: "e.g. 3 this week" },
            ].map(f => (
              <div key={f.key}>
                <label className="text-[9px] font-black uppercase tracking-wider block mb-1" style={{ color: 'var(--text-muted)' }}>{f.label}</label>
                <input
                  value={weeklyData[f.key]}
                  onChange={e => setWeeklyData(prev => ({ ...prev, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  className="w-full text-[12px] px-3 py-2 rounded-xl border outline-none"
                  style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                />
              </div>
            ))}
          </div>
          <button
            onClick={submitData}
            className="mt-3 w-full py-2.5 rounded-xl text-[11px] font-black tracking-wider uppercase transition-all active:scale-[0.98]"
            style={{ background: 'var(--accent)', color: '#0a0a0a' }}
          >
            {saved ? '✓ LOGGED' : 'LOG NUMBERS'}
          </button>
          {weeklyLog.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>History</p>
              {weeklyLog.slice(0, 4).map((e, i) => (
                <div key={i} className="p-3 rounded-xl" style={{ background: 'var(--surface-2)' }}>
                  <p className="text-[9px] font-black mb-1" style={{ color: 'var(--accent)' }}>{e.date}</p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
                    {e.data.spotify && <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>Followers: <span style={{ color: 'var(--text-primary)' }}>{e.data.spotify}</span></p>}
                    {e.data.saves && <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>Save Rate: <span style={{ color: 'var(--text-primary)' }}>{e.data.saves}</span></p>}
                    {e.data.doordash && <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>DoorDash: <span style={{ color: 'var(--text-primary)' }}>{e.data.doordash}</span></p>}
                    {e.data.geo && <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>Geo Hits: <span style={{ color: 'var(--text-primary)' }}>{e.data.geo}</span></p>}
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

function Anchor({ text }: { text: string }) {
  return (
    <p className="text-2xl font-black tracking-tight leading-tight text-white">{text}</p>
  );
}

function ExitLine({ done, label }: { done: boolean; label: string }) {
  return (
    <div className="flex items-center gap-3 py-2 border-b border-[#1e1e1e] last:border-0">
      <span className={`text-base font-black flex-shrink-0 ${done ? "text-green-500" : "text-[#333]"}`}>
        {done ? "✓" : "□"}
      </span>
      <span className={`text-sm font-semibold ${done ? "text-[#555] line-through" : "text-white"}`}>
        {label}
      </span>
    </div>
  );
}

function ScrollSection({ title, icon, accent, children }: { title: string; icon: string; accent: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-8">
      <button
        onClick={() => setOpen(!open)}
        className="w-full card flex items-center justify-between p-4 transition-all active:scale-[0.98]"
        style={{ borderColor: open ? accent + "44" : "transparent" }}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{icon}</span>
          <div className="text-left">
            <p style={{ color: accent }} className="text-xs font-black tracking-wider uppercase">{title}</p>
            <p className="text-[10px] text-[#555] mt-0.5">Tap to {open ? "collapse" : "expand"}</p>
          </div>
        </div>
        <span className="text-[#555] text-sm transition-transform" style={{ transform: open ? "rotate(90deg)" : "none" }}>›</span>
      </button>
      {open && <div className="mt-2 space-y-3 animate-fade-in">{children}</div>}
    </div>
  );
}

function WakingMindProtocol() {
  return (
    <ScrollSection title="The Waking Mind" icon="🧠" accent="#6366f1">

      {/* Core Frame */}
      <div className="card" style={{ borderColor: "#6366f122" }}>
        <p className="text-[10px] font-black tracking-[0.18em] text-[#555] uppercase mb-2">The Core Insight</p>
        <p className="text-sm font-black text-indigo-400 leading-snug italic">
          &quot;Nobody in your bloodline, going back through all of human history, has ever known this about themselves.&quot;
        </p>
        <p className="text-[10px] text-[#555] mt-2">
          Your neurons produce computational processes with knowledge — but not meta-knowledge.
          Meta-knowledge can direct the whole. You are the first generation to have it available as a practice.
        </p>
      </div>

      {/* 3-System Model */}
      <div className="card">
        <p className="text-[10px] font-black tracking-[0.18em] text-[#555] uppercase mb-3">The 3-System Model</p>
        {[
          {
            num: "3",
            title: "System 3 — Metacognitive Layer",
            desc: "Symbols that refer to your own mental states. \"I'm distracted.\" \"I'm in a threat state.\" This layer can reach into and rewire Systems 1 & 2. No ceiling.",
            color: "#818cf8"
          },
          {
            num: "2",
            title: "System 2 — Working Memory",
            desc: "Deliberate, effortful, fact-based reasoning. Planning, executing, deciding. Slow. Where most conscious thought happens.",
            color: "#34d399"
          },
          {
            num: "1",
            title: "System 1 — Automatic",
            desc: "Fast, unconscious, habitual. Your default mode. Drives you unless System 3 is active. Low ceiling on its own.",
            color: "#f59e0b"
          },
        ].map((item) => (
          <div key={item.num} className="flex items-start gap-3 py-2.5 border-b border-[#1a1a1a] last:border-0">
            <span style={{ color: item.color }} className="font-black text-[10px] flex-shrink-0 mt-0.5">{item.num}</span>
            <div>
              <div className="text-xs font-bold text-white">{item.title}</div>
              <div className="text-[10px] text-[#444] mt-0.5 leading-relaxed">{item.desc}</div>
            </div>
          </div>
        ))}
        <div className="mt-3 p-3 bg-indigo-500/5 border border-indigo-500/10 rounded-lg">
          <p className="text-[10px] text-indigo-400 font-bold">
            Key: System 3 instructions have a different key than System 2 instructions.
            Telling yourself &quot;be calm&quot; at S2 does almost nothing. Naming the state at S3 — &quot;I&apos;m in a threat loop&quot; — reaches S1 directly.
          </p>
        </div>
      </div>

      {/* Monitoring vs Control */}
      <div className="card">
        <p className="text-[10px] font-black tracking-[0.18em] text-[#555] uppercase mb-3">Two Modes — Both Trainable</p>
        {[
          {
            mode: "MONITORING",
            desc: "Noticing and naming your mental state in real time.",
            example: "\"I\u2019m distracted.\"  \"My energy is low.\"  \"I know I know this.\"",
            color: "#818cf8"
          },
          {
            mode: "CONTROL",
            desc: "Actively redirecting what\u2019s happening once you\u2019ve noticed it.",
            example: "Choose to focus. Slow the breath. Defer the argument. Return to the session.",
            color: "#34d399"
          },
        ].map((item) => (
          <div key={item.mode} className="py-2.5 border-b border-[#1a1a1a] last:border-0">
            <div className="flex items-center gap-2 mb-1">
              <span style={{ color: item.color }} className="text-[9px] font-black tracking-widest">{item.mode}</span>
            </div>
            <div className="text-xs font-bold text-white">{item.desc}</div>
            <div className="text-[10px] text-[#444] mt-0.5 italic">{item.example}</div>
          </div>
        ))}
      </div>

      {/* Interoception Stack */}
      <div className="card">
        <p className="text-[10px] font-black tracking-[0.18em] text-[#555] uppercase mb-3">The Signal Stack</p>
        {[
          { label: "Metacognition", role: "The engineer at the mixing board", note: "Represents and directs mental states. Can choose what to do with the signal.", color: "#818cf8" },
          { label: "Interoception", role: "The microphone picking up the room", note: "Heartbeat, breath, gut tension, muscle state. Raw body data — pre-symbolic.", color: "#34d399" },
          { label: "Sensation", role: "The raw electrical signal", note: "Below conscious access. Always running. Temperature, pain, proprioception.", color: "#f59e0b" },
        ].map((item) => (
          <div key={item.label} className="flex items-start gap-3 py-2.5 border-b border-[#1a1a1a] last:border-0">
            <div>
              <div className="flex items-center gap-2">
                <span style={{ color: item.color }} className="text-xs font-black">{item.label}</span>
                <span className="text-[9px] text-[#555] italic">{item.role}</span>
              </div>
              <div className="text-[10px] text-[#444] mt-0.5">{item.note}</div>
            </div>
          </div>
        ))}
        <div className="mt-3 p-3 bg-indigo-500/5 border border-indigo-500/10 rounded-lg">
          <p className="text-[10px] text-indigo-400 font-bold">
            High interoception + no metacognition = flooded by signals you can&apos;t regulate.<br />
            High metacognition + good interoception = rich data, skilled response. That&apos;s the target.
          </p>
        </div>
      </div>

      {/* Fractal Insight */}
      <div className="card">
        <p className="text-[10px] font-black tracking-[0.18em] text-[#555] uppercase mb-3">The Fractal Principle</p>
        <p className="text-[11px] text-[#888] font-medium leading-relaxed mb-3">
          Your nervous system branches like a river. Your lungs use the same geometry as a tree. Your heartbeat has a healthy fractal rhythm (HRV) — and when it becomes too regular, that&apos;s pathology.
        </p>
        {[
          { system: "Rivers", pattern: "Branch to drain maximum land with minimum material", color: "#60a5fa" },
          { system: "Trees / Lungs", pattern: "Branch to pack infinite surface area into finite volume", color: "#34d399" },
          { system: "Nervous system", pattern: "Branch to reach every cell with minimum signal-distance", color: "#818cf8" },
          { system: "Your workflow", pattern: "Each session mirrors the sprint. Each sprint mirrors the arc.", color: "#f59e0b" },
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-2 py-1.5">
            <span className="text-indigo-500/50 text-[10px] mt-0.5">◆</span>
            <div>
              <span className="text-[11px] font-bold text-[#ccc]">{item.system}</span>
              <span className="text-[10px] text-[#555] ml-1">— {item.pattern}</span>
            </div>
          </div>
        ))}
        <div className="mt-3 p-3 bg-indigo-500/5 border border-indigo-500/10 rounded-lg">
          <p className="text-[10px] text-indigo-400 font-bold italic">
            &quot;There is no single gene, law, or brain making all these things fractal.
            Each system independently found the same answer: self-similar branching is what optimality looks like.&quot;
          </p>
        </div>
      </div>

      {/* Activation Interrupts */}
      <div className="card" style={{ borderColor: "#6366f122" }}>
        <p className="text-[10px] font-black tracking-[0.18em] text-[#555] uppercase mb-3">System 3 Activation Interrupts</p>
        {[
          { trigger: "Feeling scattered", interrupt: "\"What is my mind doing right now?\" — wait for the answer. Don\u2019t judge it.", color: "#818cf8" },
          { trigger: "Stuck in a session", interrupt: "Rate your mental state 1-10. Now rate it again in 60 seconds. The act of rating breaks the loop.", color: "#34d399" },
          { trigger: "About to react", interrupt: "Name the emotion: \"I\u2019m in a threat state.\" Naming it activates metacognitive regulation — not suppression.", color: "#f59e0b" },
          { trigger: "Low energy spiral", interrupt: "Is this a body signal (interoception) or a thought loop? Different cause, different fix.", color: "#f472b6" },
          { trigger: "Distraction pull", interrupt: "\"What does my distraction tell me about what I\u2019m avoiding?\" Curiosity, not judgment.", color: "#60a5fa" },
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-3 py-2.5 border-b border-[#1a1a1a] last:border-0">
            <span style={{ color: item.color }} className="font-black text-[10px] flex-shrink-0 mt-0.5">→</span>
            <div>
              <div className="text-xs font-bold text-white">{item.trigger}</div>
              <div className="text-[10px] text-[#444] mt-0.5 leading-relaxed">{item.interrupt}</div>
            </div>
          </div>
        ))}
      </div>

      {/* No Ceiling */}
      <div className="card" style={{ borderColor: "#6366f122" }}>
        <p className="text-[10px] font-black tracking-[0.18em] text-[#555] uppercase mb-2">The No-Ceiling Principle</p>
        <p className="text-sm font-black text-white leading-snug">
          Object-level intelligence has a low ceiling.<br />
          <span className="text-indigo-400">Metacognitive intelligence has no ceiling.</span>
        </p>
        <p className="text-[10px] text-[#555] mt-2">
          Memory champions don&apos;t have bigger brains. Olympic athletes don&apos;t have different muscles.
          The gap is always System 3 — the metacognitive layer that unlocks what the hardware already has.
        </p>
      </div>

    </ScrollSection>
  );
}

function BlitzkriegProtocol() {
  return (
    <ScrollSection title="Blitzkrieg Protocol" icon="⚡" accent="#ef4444">
      {/* Core Quote */}
      <div className="card" style={{ borderColor: "#ef444422" }}>
        <p className="text-sm font-black text-red-400 leading-snug italic">
          &quot;You can do more in 30 days with that tenacity blitzkrieg mindset than somebody might do in 3 years.&quot;
        </p>
        <p className="text-[10px] text-[#555] mt-2">— Manager who broke Young Dolph &amp; Travis Porter</p>
      </div>

      {/* Framework */}
      <div className="card">
        <p className="text-[10px] font-black tracking-[0.18em] text-[#555] uppercase mb-3">The Framework</p>
        {[
          { num: "1", text: "Set a 30-day container", sub: "Hard start and stop date. Lightning war." },
          { num: "2", text: "Fill with touchpoints", sub: "Not one big thing — many stacked small things." },
          { num: "3", text: "Stack the perception", sub: "Make activity look bigger than it is. Promo run → looks like a tour." },
          { num: "4", text: "Numbers game", sub: "If 10% of 4,000 showed up, we'd have 400. That's easy." },
          { num: "5", text: "Present big, not small", sub: "Small asks get \"no.\" Big vision with revenue attached gets \"I'm in.\"" },
        ].map((item) => (
          <div key={item.num} className="flex items-start gap-3 py-2.5 border-b border-[#1a1a1a] last:border-0">
            <span className="text-red-500 font-black text-[10px] flex-shrink-0 mt-0.5">{item.num}</span>
            <div>
              <div className="text-xs font-bold text-white">{item.text}</div>
              <div className="text-[10px] text-[#444] mt-0.5">{item.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* The Dolph Blitz */}
      <div className="card">
        <p className="text-[10px] font-black tracking-[0.18em] text-[#555] uppercase mb-3">The Young Dolph Blitz (30 Days)</p>
        {[
          "Media run across mix show DJs — Jackson MS → Charlotte NC",
          "Meet & greets in each city (even if 5 people show)",
          "Turn promo run into a \"tour\" flyer — perception amplification",
          "Hit biggest LOCAL artists in each city for features + collabs",
          "Music videos for each collab — content drops every Friday",
          "Press CDs, pass out at every club in every market",
          "DJ listening party — themed release event",
          "Custom merch for DJs (hoodies) — relationship capital",
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-2 py-1.5">
            <span className="text-red-500/50 text-[10px] mt-0.5">→</span>
            <span className="text-[11px] text-[#aaa] font-medium">{item}</span>
          </div>
        ))}
        <div className="mt-3 p-3 bg-red-500/5 border border-red-500/10 rounded-lg">
          <p className="text-[11px] text-red-400 font-bold italic">&quot;Who is this guy? I&apos;m starting to see him everywhere.&quot;</p>
        </div>
      </div>

      {/* Travis Porter Origin */}
      <div className="card">
        <p className="text-[10px] font-black tracking-[0.18em] text-[#555] uppercase mb-3">The Origin — No Budget Version</p>
        <div className="space-y-2">
          <p className="text-[11px] text-[#888] font-medium">$100 in the bank. First show: 5 people.</p>
          <p className="text-[11px] text-[#888] font-medium">Strategy: Comment on every single follower of the local DJ (4,000 people), from the artist page.</p>
          <p className="text-[11px] text-[#888] font-medium">Simple messages: &quot;Appreciate the follow. Wanted to show some love to your page.&quot;</p>
          <p className="text-[11px] text-white font-bold mt-3">Result: #1 unsigned artist on all of MySpace.</p>
        </div>
      </div>

      {/* Meta Principle */}
      <div className="card" style={{ borderColor: "#ef444422" }}>
        <p className="text-[10px] font-black tracking-[0.18em] text-[#555] uppercase mb-2">Meta Principle</p>
        <p className="text-sm font-black text-white leading-snug">
          Stack small, invisible moves until the cumulative effect feels inevitable.
        </p>
        <p className="text-[10px] text-[#555] mt-2">
          In promotion: 15 touchpoints in 30 days → &quot;I&apos;m seeing him everywhere.&quot;<br />
          In production: 8 subtle layers → &quot;This sounds like a record.&quot;
        </p>
      </div>

      {/* Anti-Hustle */}
      <div className="card">
        <p className="text-[10px] font-black tracking-[0.18em] text-[#555] uppercase mb-2">Anti-Hustle Principle</p>
        <p className="text-[11px] text-[#888] font-medium italic">
          &quot;I slept till 8 this morning. Why? Because I needed sleep. If my stress levels are high, my creativity won&apos;t turn on. Somebody who feels good will run circles around me.&quot;
        </p>
        <p className="text-[11px] text-[#666] mt-2">
          If you blitz every play, you lose the game. Blitz strategically → break through.
        </p>
      </div>
    </ScrollSection>
  );
}

function TexturedProduction() {
  return (
    <ScrollSection title="Textured Sample Production" icon="🎛️" accent="#a855f7">
      {/* Core Quote */}
      <div className="card" style={{ borderColor: "#a855f722" }}>
        <p className="text-sm font-black text-purple-400 leading-snug italic">
          &quot;You almost don&apos;t hear them, you just feel them.&quot;
        </p>
        <p className="text-[10px] text-[#555] mt-2">Brent Faiyaz / SZA — Textured R&amp;B Sample Style</p>
      </div>

      {/* Signal Chain */}
      <div className="card">
        <p className="text-[10px] font-black tracking-[0.18em] text-[#555] uppercase mb-3">FL Studio Signal Chain</p>
        {[
          { step: "1", title: "Foundation — Unique Preset", desc: "Analog Lab / FLEX. 64-82 BPM. Leave SPACE between notes — you're filling gaps with layers.", color: "#6ee7b7" },
          { step: "2", title: "Texture Layer", desc: "Bounce to audio → duplicate → pitch +12 semitones → stretch algorithm → add stereo width. Blend behind original.", color: "#60a5fa" },
          { step: "3", title: "Bass Layer", desc: "Separate channel. Let intro breathe WITHOUT bass, then drop it. Use glide/portamento for movement.", color: "#f472b6" },
          { step: "4", title: "Secondary Synth", desc: "Different plugin, different character. EQ cut below ~300Hz. Reverb → push to back. Auto-pan with slow LFO.", color: "#fbbf24" },
          { step: "5", title: "Foley & Natural Sounds", desc: "Cityscape, keys/bells (tuned to key), reversed foley for anticipation, cassette noise. Phaser for otherworldly feel.", color: "#c084fc" },
          { step: "6", title: "Vocal Texture (Optional)", desc: "Ambient chop — NOT consistent. Saturate (CamelCrusher), EQ back harshness. Delay throws → 100% wet → reverse the tail.", color: "#f97316" },
          { step: "7", title: "Master Processing", desc: "Compression (Fruity Limiter) → RC-20/Vinyl warmth → pitch shift ±2-5 cents → stereo width.", color: "#ef4444" },
        ].map((item) => (
          <div key={item.step} className="flex items-start gap-3 py-3 border-b border-[#1a1a1a] last:border-0">
            <span style={{ color: item.color }} className="font-black text-xs flex-shrink-0 mt-0.5">{item.step}</span>
            <div>
              <div className="text-xs font-bold text-white">{item.title}</div>
              <div className="text-[10px] text-[#555] mt-1 leading-relaxed">{item.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Foley Deep Dive */}
      <div className="card">
        <p className="text-[10px] font-black tracking-[0.18em] text-[#555] uppercase mb-3">Foley — The Secret Sauce</p>
        {[
          { type: "Cityscape / ambient", how: "Layer under everything at very low volume" },
          { type: "Keys / bells / metal", how: "Tune to track key, place on downbeats" },
          { type: "Reversed foley", how: "Creates anticipation — reverse and place before a hit" },
          { type: "Cassette / vinyl noise", how: "Constant low-level texture throughout" },
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-2 py-2 border-b border-[#1a1a1a] last:border-0">
            <span className="text-purple-500/60 text-[10px] mt-0.5 flex-shrink-0">◆</span>
            <div>
              <span className="text-[11px] font-bold text-[#ccc]">{item.type}</span>
              <span className="text-[10px] text-[#555] ml-1">— {item.how}</span>
            </div>
          </div>
        ))}
      </div>

      {/* The Final Move */}
      <div className="card" style={{ borderColor: "#a855f722" }}>
        <p className="text-[10px] font-black tracking-[0.18em] text-[#555] uppercase mb-2">The Final Move</p>
        <p className="text-[11px] text-[#888] font-medium">
          After everything is bounced, shift the entire sample by a few <span className="text-purple-400 font-bold">cents</span> (not semitones).
        </p>
        <p className="text-[11px] text-[#666] mt-2">
          Makes it slightly detuned/warm — impossible to recreate exactly. The difference between &quot;sounds like a beat&quot; and &quot;sounds like a record.&quot;
        </p>
      </div>

      {/* Your Actual Plugin Cabinet */}
      <div className="card">
        <p className="text-[10px] font-black tracking-[0.18em] text-[#555] uppercase mb-3">Your Plugin Cabinet (Confirmed)</p>
        {[
          { effect: "Compression (transparent)", fl: "Pro-C 2 (FabFilter)" },
          { effect: "Compression (FET / transient)", fl: "FG-116 (Slate / UAD)" },
          { effect: "Compression (bus glue)", fl: "SSL G Bus Compressor (SSL bundle)" },
          { effect: "Channel strip suite", fl: "VMR — Virtual Mix Rack (Slate)" },
          { effect: "Surgical EQ", fl: "Pro-Q 3 (FabFilter)" },
          { effect: "Resonance cleaning", fl: "Soothe2" },
          { effect: "Saturation / analog warmth", fl: "Black Box Analog Saturator" },
          { effect: "Early reflections / space", fl: "Black Vortex" },
          { effect: "Reverb", fl: "Valhalla Verb" },
          { effect: "Delay", fl: "Valhalla Delay" },
          { effect: "Transient shaping / clipping", fl: "Gold Clip / Standard Clip" },
          { effect: "Kick / drum punch", fl: "KNOCK" },
          { effect: "Tape warmth", fl: "UAD Oxide Tape / ATR-102" },
          { effect: "Spectral / time manipulation", fl: "Portal by Output" },
          { effect: "Harmonic enhancement", fl: "Oxford Inflator @ 0dB" },
          { effect: "Limiting (master)", fl: "Oxford Limiter / Ozone 12 IRC" },
          { effect: "Mix bus cohesion", fl: "God Particle" },
          { effect: "Vocal processing suite", fl: "Nectar (iZotope)" },
          { effect: "Vocal compression", fl: "Waves R-Comp / Silk Vocal" },
          { effect: "Full mix / mastering suite", fl: "Ozone 12 (iZotope) — IRC limiter, Imager, EQ" },
          { effect: "Noise / repair", fl: "RX (iZotope)" },
          { effect: "Creative FX", fl: "SoundToys bundle (EchoBoy, Decapitator, PanMan, etc.)" },
          { effect: "Filter / creative EQ", fl: "Storch Filter (Slate)" },
          { effect: "Reverb (algorithmic)", fl: "VerbSuite Classics (Slate)" },
          { effect: "Pitch shift (cents)", fl: "Pitcher (FL native) or Edison" },
        ].map((item, i) => (
          <div key={i} className="flex justify-between items-center py-2 border-b border-[#1a1a1a] last:border-0">
            <span className="text-[11px] font-bold text-[#ccc]">{item.effect}</span>
            <span className="text-[10px] text-purple-400/70 font-medium">{item.fl}</span>
          </div>
        ))}
      </div>
    </ScrollSection>
  );
}

function MixingProtocol() {
  return (
    <ScrollSection title="The Mixing Ladder" icon="🎚️" accent="#3b82f6">

      {/* Golden Rule */}
      <div className="card" style={{ borderColor: "#3b82f622" }}>
        <p className="text-[10px] font-black tracking-[0.18em] text-[#555] uppercase mb-2">The Golden Rule</p>
        <p className="text-sm font-black text-blue-400 leading-snug italic">
          &quot;Mix in blocks. Treat loudness like a ladder. Lock each rung before climbing to the next.&quot;
        </p>
        <p className="text-[10px] text-[#555] mt-2">
          Mix drums on mid-range drivers only (disable tweeter + woofer). If kick and bass punch through a single mid-range cone, they translate everywhere. Switch to full-range periodically to check, but do the work in the mid.
        </p>
      </div>

      {/* Pre-DAW Apollo Hardware Chain */}
      <div className="card" style={{ borderColor: "#3b82f622" }}>
        <p className="text-[10px] font-black tracking-[0.18em] text-[#555] uppercase mb-2">Stage 2 — Pre-DAW Apollo Console Chain</p>
        <p className="text-[10px] text-[#555] font-medium mb-3">
          Every vocal is hardware-processed before FL even opens. This is your sound — not your plugins.
        </p>
        {[
          { step: "1", label: "TLM 103", note: "Source. Cardioid large-diaphragm condenser. Position: 6–8 inches, slight off-axis. -18dBFS RMS target into Apollo.", color: "#60a5fa" },
          { step: "2", label: "VT-737sp (Avalon)", note: "Mic pre + opto comp + EQ. Gain: 40–50dB. Comp: light (4:1, 2-3dB GR). EQ: boost 10kHz air, cut ~300Hz mud.", color: "#34d399" },
          { step: "3", label: "CL 1B mkII (UAD)", note: "Primary vocal compressor. Opto, slow attack. 4–6dB GR. Fast program-dependent release. Keeps.", color: "#818cf8" },
          { step: "4", label: "C-Vox (UAD)", note: "Character and presence. Harmonic thickness. Not a compressor — a color stage.", color: "#f59e0b" },
          { step: "5", label: "Auto-Tune RT (Antares)", note: "Real-time pitch correction. Retune speed: 20ms (natural). Do NOT zero it — that's a style choice, not a fix.", color: "#f472b6" },
          { step: "6", label: "Studer A800 (UAD)", note: "Tape saturation printed to file. One saturation stage. IPS: 15. Bias: +2. ALWAYS on. This is Stage 1 of 3 allowed saturation stages.", color: "#ef4444" },
          { step: "7", label: "Into FL Studio", note: "Target: -18dBFS RMS. Peaks: -10 to -6 dBFS. NEVER clip the interface. Leave headroom for FL processing.", color: "#a855f7" },
        ].map((item) => (
          <div key={item.step} className="flex items-start gap-3 py-2.5 border-b border-[#1a1a1a] last:border-0">
            <span style={{ color: item.color }} className="font-black text-[10px] flex-shrink-0 mt-0.5">{item.step}</span>
            <div>
              <div className="text-xs font-bold text-white">{item.label}</div>
              <div className="text-[10px] text-[#555] mt-0.5 leading-relaxed">{item.note}</div>
            </div>
          </div>
        ))}
        <div className="mt-3 p-3 bg-blue-500/5 border border-blue-500/10 rounded-lg">
          <p className="text-[10px] text-blue-400 font-bold">
            Rule: Do NOT touch this chain in FL. Bus the Apollo output directly to Lead Bus (9) and do ALL surgical work there. The Apollo print is your vibe — preserve it.
          </p>
        </div>
      </div>

      {/* Session Layout */}
      <div className="card">
        <p className="text-[10px] font-black tracking-[0.18em] text-[#555] uppercase mb-3">FL Session Layout (Top → Bottom)</p>
        {[
          { group: "DRUMS BUS (5)", tracks: "Kick Aux (layered kicks) → Snare Aux (layered snares) → Verb/Accent Snares → Percs → Bongos → Hat Loops", color: "#f59e0b" },
          { group: "PERC BUS (separate)", tracks: "Percs, bongos, hats only — NO kick or snare. Processed independently for stereo image control.", color: "#f59e0b" },
          { group: "808 / BASS", tracks: "Bass track → Sample Bus → Instru.L Bus (4)", color: "#ef4444" },
          { group: "INSTRUMENTS", tracks: "Keys, Pads, Leads, Secondary Synths → Instru.L Bus (4)", color: "#a855f7" },
          { group: "FX / TRANSITIONS", tracks: "Vocal effects, whooshes, reverses, sound design", color: "#6366f1" },
          { group: "LEAD VOCALS (10-12)", tracks: "Verse / Pre-Chorus / Chorus — each on separate tracks → Lead Bus (9) → Vox Bus (6)", color: "#3b82f6" },
          { group: "BG VOCALS (14-21)", tracks: "Stacks of 2 per harmony. Chorus ODs, Accents, Supporting harms → BG Bus (13) → Vox Bus (6)", color: "#3b82f6" },
          { group: "TIME-BASED FX", tracks: "Verb, Delay, Chorus sends → FX Bus", color: "#555" },
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-2 py-2 border-b border-[#1a1a1a] last:border-0">
            <span style={{ color: item.color }} className="text-[10px] mt-0.5 flex-shrink-0">■</span>
            <div>
              <span className="text-[11px] font-bold text-[#ccc]">{item.group}</span>
              <span className="text-[10px] text-[#555] ml-1">— {item.tracks}</span>
            </div>
          </div>
        ))}
        <div className="mt-3 p-3 bg-blue-500/5 border border-blue-500/10 rounded-lg">
          <p className="text-[10px] text-blue-400 font-bold">
            Key: Split Percs from Shells. Kick/Snare stay center, compressed for punch. Percs go wide with saturation and movement. Different bus = different stereo strategy.
          </p>
        </div>
      </div>

      {/* The LUFS Ladder */}
      <div className="card">
        <p className="text-[10px] font-black tracking-[0.18em] text-[#555] uppercase mb-3">The Short-Term LUFS Ladder</p>

        <div className="py-2.5 border-b border-[#1a1a1a]">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-blue-400 font-black text-xs">01</span>
            <span className="text-white font-bold text-[11px]">Drums Only (Foundation)</span>
            <span className="ml-auto text-blue-400 font-black text-[10px] bg-blue-500/10 px-1.5 py-0.5 rounded">-10 to -11 LUFS</span>
          </div>
          <p className="text-[10px] text-[#555]">Gold Clip on kick — shave 1.5-2dB of peak transient (soft clip mode). This reclaims headroom without losing perceived volume. Route Kick/Snare to Drums Bus (5). SSL G Bus Comp on the bus for 2-3dB GR. Tape (Oxide or ATR-102) on the bus for one stage of saturation. Gold Clip on the bus output for final headroom control.</p>
        </div>

        <div className="py-2.5 border-b border-[#1a1a1a]">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-blue-400 font-black text-xs">02</span>
            <span className="text-white font-bold text-[11px]">Drums + Bass (Weight)</span>
            <span className="ml-auto text-blue-400 font-black text-[10px] bg-blue-500/10 px-1.5 py-0.5 rounded">-9 LUFS</span>
          </div>
          <p className="text-[10px] text-[#555]">Saturate the bass mid-range harmonics so it cuts through small speakers. Sidechain sub frequencies (under 70Hz) to the kick for headroom. SSL G Bus Comp + Tape + Gold Clip on the Instru.L Bus (same chain as drums). Peak stays at -1.2dB. The sustained bass energy pushes LUFS from -11 up to -9.</p>
        </div>

        <div className="py-2.5 border-b border-[#1a1a1a]">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-blue-400 font-black text-xs">03</span>
            <span className="text-white font-bold text-[11px]">+ ONE Key Instrument + Lead Vocal</span>
            <span className="ml-auto text-blue-400 font-black text-[10px] bg-blue-500/10 px-1.5 py-0.5 rounded">-8 LUFS</span>
          </div>
          <p className="text-[10px] text-[#555]">Unmute the main chord instrument ONLY. Mix the lead vocal against Drums + Bass + that ONE anchor. Vocal chain: Nectar (surgical EQ → de-esser → vocal rider) → Pro-Q 3 (surgical cuts) → FG-116 (FET compression, the ONLY compressor in FL on lead) → SD-PE1 (tube EQ, presence after compression) → VCC Channel (console color). Lock the vocal-to-music relationship before adding anything else.</p>
        </div>

        <div className="py-2.5 border-b border-[#1a1a1a]">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-blue-400 font-black text-xs">04</span>
            <span className="text-white font-bold text-[11px]">Fill — Remaining Instruments + FX</span>
          </div>
          <p className="text-[10px] text-[#555]">Bring in secondary pads, synths, foley. Carve harshness with Soothe or Pro-Q 3. Add depth/width/movement with FX sends. Peak stays locked at -1.2dB. The vocal relationship is already set — everything you add now supports it.</p>
        </div>

        <div className="py-2.5">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-blue-400 font-black text-xs">05</span>
            <span className="text-white font-bold text-[11px]">Polish — BG Vocals (The Final Push)</span>
            <span className="ml-auto text-red-500 font-black text-[10px] bg-red-500/10 px-1.5 py-0.5 rounded">-7 LUFS Target</span>
          </div>
          <p className="text-[10px] text-[#555]">BG Bus chain: SSL 4K E (gentle bus compression) → FairChild R&amp;B Ahh BGVox (character) → SSL Fusion Stereo Image (width) → Black Vortex OR Black Box Saturator (ONE saturation, not both) → Gold Clip. Heavy compression keeps BGs as an unmoving pad behind the lead. This sustained wall of voice pushes you to the final -7 LUFS commercial target.</p>
        </div>
      </div>

      {/* Bus Chain Reference */}
      <div className="card">
        <p className="text-[10px] font-black tracking-[0.18em] text-[#555] uppercase mb-3">Your Bus Chains (Audited Mar 1)</p>
        {[
          { bus: "LEAD BUS (9)", chain: "Pro-Q 3 → Soothe (BEFORE color) → SSL Fusion Transformer → Tape → Gold Clip", note: "Soothe cleans first, Fusion adds color to clean signal" },
          { bus: "BG BUS (13)", chain: "SSL 4K E → FairChild R&B → SSL Fusion Stereo Image → Black Vortex OR Verve → Gold Clip", note: "ONE saturation stage only — two causes BGs to fight the lead" },
          { bus: "VOX BUS (6)", chain: "SSL G Bus Comp (2-3dB GR) → Gold Clip", note: "No tape here. Enough tape exists upstream (Studer print + Lead Bus)" },
          { bus: "DRUMS / INSTRU.L", chain: "SSL G Bus Comp → Tape (Oxide or ATR-102) → Gold Clip", note: "Same chain on both. Consistent subgroup treatment." },
          { bus: "PRE MASTER (2)", chain: "God Particle", note: "One plugin. Mix cohesion, thickness, width. Let it breathe." },
        ].map((item, i) => (
          <div key={i} className="py-2.5 border-b border-[#1a1a1a] last:border-0">
            <div className="text-[11px] font-bold text-blue-400">{item.bus}</div>
            <div className="text-[10px] text-[#888] mt-0.5 font-medium">{item.chain}</div>
            <div className="text-[10px] text-[#444] mt-0.5 italic">{item.note}</div>
          </div>
        ))}
      </div>

      {/* Master Chain */}
      <div className="card">
        <p className="text-[10px] font-black tracking-[0.18em] text-[#555] uppercase mb-3">Master Chain (Stage 9)</p>
        {[
          { step: "1", plugin: "Massive Passive EQ", job: "Broad musical shaping across full mix" },
          { step: "2", plugin: "Soothe2", job: "Clean resonances BEFORE adding final harmonics" },
          { step: "3", plugin: "Oxford Inflator @ 0dB", job: "Color only — NOT loudness. Harmonics only." },
          { step: "4", plugin: "Ozone 12 IRC", job: "Final limit. -1.0 dBTP ceiling." },
          { step: "5", plugin: "SSL Meter Pro", job: "Verify LUFS / LU / True Peak" },
        ].map((item) => (
          <div key={item.step} className="flex items-start gap-3 py-2 border-b border-[#1a1a1a] last:border-0">
            <span className="text-blue-400 font-black text-[10px] flex-shrink-0 mt-0.5">{item.step}</span>
            <div>
              <div className="text-xs font-bold text-white">{item.plugin}</div>
              <div className="text-[10px] text-[#444] mt-0.5">{item.job}</div>
            </div>
          </div>
        ))}
        <div className="mt-3 p-3 bg-blue-500/5 border border-blue-500/10 rounded-lg">
          <p className="text-[10px] text-blue-400 font-bold">
            Soothe2 BEFORE Inflator — not after. Inflator generates harmonics. If Soothe runs after, they fight each other.
          </p>
        </div>
      </div>

      {/* Loudness Targets */}
      <div className="card">
        <p className="text-[10px] font-black tracking-[0.18em] text-[#555] uppercase mb-3">Loudness Targets</p>
        {[
          { target: "Mix print", lufs: "-9 to -11 LUFS integrated", peak: "-1.0 dBTP", note: "Your audited mastering target from the Mar 1 signal chain audit" },
          { target: "Short-term (chorus)", lufs: "-7 to -6.5 LUFS", peak: "-1.0 dBTP", note: "The loudest moment should hit -7 on the short-term meter" },
          { target: "Spotify normalization", lufs: "-14 LUFS", peak: "n/a", note: "Spotify will turn you down. Master for YOUR sound, not the algorithm." },
        ].map((item, i) => (
          <div key={i} className="py-2 border-b border-[#1a1a1a] last:border-0">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-white">{item.target}</span>
              <span className="text-blue-400 font-black text-[10px]">{item.lufs}</span>
            </div>
            <div className="text-[10px] text-[#444] mt-0.5">{item.note}</div>
          </div>
        ))}
      </div>

      {/* Techniques */}
      <div className="card">
        <p className="text-[10px] font-black tracking-[0.18em] text-[#555] uppercase mb-3">Advanced Techniques</p>
        {[
          { name: "Gold Clip on Kicks (Headroom Recovery)", desc: "Soft clip 1.5-2dB off the kick peak. You get 2dB of headroom back without losing perceived volume. The clipping increases sustain on the transient, making it feel thicker. Your Ozone limiter on Master won't have to work as hard.", color: "#f59e0b" },
          { name: "Perception of Brightness (Snare Trick)", desc: "Boost the Air EQ band on the snare for excitement, then immediately put a high-cut after it to roll the brightness back off. You FEEL the high-end energy but don't HEAR it competing with your vocal's air region (where SD-PE1 pushes presence).", color: "#34d399" },
          { name: "Sidechain Vocal → Reverb", desc: "Sidechain the lead vocal to your reverb return. When the vocal sings, the reverb ducks — giving clarity. When the vocal stops, the reverb blooms and fills the space. Washy reverb without muddying the lead.", color: "#818cf8" },
          { name: "Mid-Only Compression on Pre Master", desc: "On God Particle / Pre Master: ignore lows, ignore highs, ignore side information. Compress ONLY the mono mid-range. Gives glue and perceived volume to the center without touching the stereo image or frequency extremes.", color: "#f472b6" },
          { name: "Clip Gain > Compression for One-Off Moments", desc: "If one vocal phrase is too loud but everything else is fine — don't increase the FG-116 ratio. Just clip-gain that single moment down. Surgical, not systemic.", color: "#60a5fa" },
          { name: "The Surgical Walkaway", desc: "Never loop until you hate the song. Drums locked = walk away. Bass locked = walk away. Vocals seated = walk away. Build the mix in aggressive sprints with ear resets between each block.", color: "#ef4444" },
          { name: "Treat Yourself Like a Client", desc: "The processing on your rough vocal tracks (from Apollo: CL 1B, Auto-Tune, Studer) — LEAVE IT. Don't touch it. Bus the output to Lead Bus (9) and do all surgical work there. Preserve the vibe, only enhance it.", color: "#a855f7" },
        ].map((item, i) => (
          <div key={i} className="py-3 border-b border-[#1a1a1a] last:border-0">
            <div className="flex items-center gap-2 mb-1">
              <span style={{ color: item.color }} className="text-[10px] font-black">→</span>
              <span className="text-xs font-bold text-white">{item.name}</span>
            </div>
            <p className="text-[10px] text-[#555] leading-relaxed ml-4">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Saturation Audit */}
      <div className="card" style={{ borderColor: "#3b82f622" }}>
        <p className="text-[10px] font-black tracking-[0.18em] text-[#555] uppercase mb-2">Saturation Audit (3 Stages Max)</p>
        <p className="text-[10px] text-[#888] font-medium leading-relaxed mb-2">
          You went from 6 saturation stages to 3. Never add more without removing one first.
        </p>
        {[
          { stage: "Apollo Print", what: "Studer A800 (tape color, always printed)" },
          { stage: "Lead Bus", what: "Tape (one stage — Oxide or ATR-102)" },
          { stage: "Master", what: "Oxford Inflator @ 0dB (harmonics only, NOT loudness)" },
        ].map((item, i) => (
          <div key={i} className="flex items-center justify-between py-1.5 border-b border-[#1a1a1a] last:border-0">
            <span className="text-[11px] font-bold text-[#ccc]">{item.stage}</span>
            <span className="text-[10px] text-blue-400/70 font-medium">{item.what}</span>
          </div>
        ))}
      </div>

      {/* Compression Audit */}
      <div className="card" style={{ borderColor: "#3b82f622" }}>
        <p className="text-[10px] font-black tracking-[0.18em] text-[#555] uppercase mb-2">Compression Audit (Audited Mar 1)</p>
        <p className="text-[10px] text-[#888] font-medium leading-relaxed mb-2">
          Over-compression kills dynamics and makes records sound flat. These are the ONLY compressors allowed in the chain.
        </p>
        {[
          { stage: "Apollo Print", plugin: "CL 1B mkII (UAD)", verdict: "KEEP", note: "Primary vocal opto-comp. Hardware. Cannot be removed — it's printed.", color: "#34d399" },
          { stage: "Lead Bus (FL)", plugin: "FG-116 (Slate/UAD)", verdict: "KEEP", note: "FET compression. Fast transient snap. ONLY compressor on lead in FL.", color: "#34d399" },
          { stage: "Vox Bus (6)", plugin: "SSL G Bus Comp", verdict: "KEEP", note: "Light bus glue. 2-3dB GR max. Keeps lead and BGs cohesive.", color: "#34d399" },
          { stage: "Drums/InstruL Bus", plugin: "SSL G Bus Comp", verdict: "KEEP", note: "Same bus glue treatment. Consistency across subgroups.", color: "#34d399" },
          { stage: "Lead Bus (FL)", plugin: "FG-2A (Opto)", verdict: "REMOVED", note: "Two compressors in series on lead = squashed dynamics. Redundant with CL 1B Apollo print.", color: "#ef4444" },
          { stage: "Lead Bus (FL)", plugin: "SSL 4K E", verdict: "REMOVED", note: "EQ character fine — but NOT as a compressor on lead. Was stacking with FG-116.", color: "#ef4444" },
        ].map((item, i) => (
          <div key={i} className="flex items-center justify-between py-1.5 border-b border-[#1a1a1a] last:border-0">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-[#ccc]">{item.plugin}</span>
                <span className="text-[9px] text-[#444] italic">({item.stage})</span>
              </div>
              <div className="text-[10px] text-[#444] mt-0.5">{item.note}</div>
            </div>
            <span style={{ color: item.color }} className="text-[9px] font-black tracking-wider ml-3 flex-shrink-0">{item.verdict}</span>
          </div>
        ))}
      </div>

      {/* Physics */}
      <div className="card" style={{ borderColor: "#3b82f622" }}>
        <p className="text-[10px] font-black tracking-[0.18em] text-[#555] uppercase mb-2">Why This Works (The Physics)</p>
        <p className="text-[11px] text-[#888] font-medium leading-relaxed">
          A kick drum hits -1.2dB Peak instantly — but it&apos;s a millisecond spike surrounded by silence.
          LUFS measures <span className="text-blue-400 font-bold">average</span> energy over time. At drums-only, the silence drags the average down to -11.
          As you add bass, pads, vocals — you fill in the silence. Peak stays locked at -1.2dB (your Gold Clips and limiters hold the ceiling).
          LUFS climbs from -11 to -7 simply because there is less empty space between the transients.
        </p>
        <p className="text-[10px] text-[#555] mt-2 italic">
          This is why the ladder works: you never push harder. You just fill in more space.
        </p>
      </div>

    </ScrollSection>
  );
}

function VocalProtocol() {
  return (
    <ScrollSection title="The Vocal Codex" icon="🎤" accent="#10b981">

      {/* Intro */}
      <div className="card" style={{ borderColor: "#10b98122" }}>
        <p className="text-[10px] font-black tracking-[0.18em] text-[#555] uppercase mb-2">S-Rank Bio-Diagnostic System</p>
        <p className="text-[11px] text-[#888] font-medium leading-relaxed">
          Built for the low tenor. Ron Anderson zero-tension philosophy + Seth Riggs Passaggio mastery
          + anatomical bio-diagnostics. You are your own vocal architect.
        </p>
        <p className="text-[10px] text-emerald-400/70 font-bold mt-2">
          Superpower: dynamic range. Whispered fry (chest) spiking into haunting falsetto. Weaponize the extremes — don&apos;t smooth them into generic midrange.
        </p>
      </div>

      {/* D01: Anderson Foundation */}
      <div className="card" style={{ borderColor: "#10b98122" }}>
        <p className="text-[10px] font-black tracking-[0.18em] text-[#555] uppercase mb-2">D-01 — The Anderson Foundation</p>
        <p className="text-[10px] text-[#555] font-medium mb-3">Projection comes from resonant space, not air pressure. The Appoggio system fails if your skeleton is misaligned.</p>
        {[
          { label: "Appoggio (The Anchor)", note: "Workload goes entirely into intercostal muscles (rib cage) and lower abdomen. Neck, jaw, tongue must be completely paralyzed in relaxation. Tension above the collarbone = you are pushing air, not generating resonance.", color: "#10b981" },
          { label: "Laryngeal Tilt & Cry Response", note: "Access the physical sensation of whimpering or crying. This naturally tilts the thyroid cartilage forward — thinning the cords, taking 80% of strain off, producing the emotional \"edge\" in elite R&B.", color: "#34d399" },
          { label: "Jaw Hinge Paralysis", note: "The masseter (jaw muscle) violently pulls the larynx up if it engages. When tracking high notes, jaw must feel completely detached and \"dumb.\" Diagnostic: thumb under chin, say \"Ah\" — must remain spongy. Hardens = choking the airway.", color: "#6ee7b7" },
          { label: "C-Spine Retraction (Alexander)", note: "Lifting the chin to hit a high note crushes the back of the neck. Cultivate a slight cervical tuck — imagine the back of your neck lengthening upward. Forces the larynx down into an open state.", color: "#a7f3d0" },
        ].map((item, i) => (
          <div key={i} className="py-3 border-b border-[#1a1a1a] last:border-0">
            <div className="flex items-center gap-2 mb-1">
              <span style={{ color: item.color }} className="text-[10px] font-black">▸</span>
              <span className="text-xs font-bold text-white">{item.label}</span>
            </div>
            <p className="text-[10px] text-[#555] leading-relaxed ml-4">{item.note}</p>
          </div>
        ))}
      </div>

      {/* D02: SLS & Formant Tuning */}
      <div className="card" style={{ borderColor: "#10b98122" }}>
        <p className="text-[10px] font-black tracking-[0.18em] text-[#555] uppercase mb-2">D-02 — Seth Riggs (SLS) & Formant Tuning</p>
        <p className="text-[10px] text-[#555] font-medium mb-3">Cardinal sin of the low tenor: pulling chest mass up into the transition. You cannot \"muscle\" through the Passaggio safely. Acoustic back-pressure does the heavy lifting.</p>
        {[
          { label: "Speech Level Singing", note: "Sing from your lowest note to your highest with the exact same neutral resting larynx position you use when casually speaking.", color: "#10b981" },
          { label: "Formants vs. Harmonics", note: "Your cords generate the sound wave. The shape of your mouth (Formant) amplifies it. If mouth shape conflicts with the pitch, the wave crashes back into the cords — forcing you to strain and push.", color: "#34d399" },
          { label: "Vowel Modification (The Mechanical Fix)", note: "As you cross the bridge (E4/G4), the vowel MUST physically narrow. \"AH\" becomes \"UH\". \"EE\" becomes \"IH\". Creates a vacuum that pulls the folds together without muscular tension. Feel like you hit a brick wall = you forgot to narrow.", color: "#6ee7b7" },
          { label: "Mixing", note: "You do not \"flip\" into falsetto. You incrementally bleed thick chest coordination into thin head voice. This happens automatically when the larynx stays down and the vowel narrows.", color: "#a7f3d0" },
        ].map((item, i) => (
          <div key={i} className="py-3 border-b border-[#1a1a1a] last:border-0">
            <div className="flex items-center gap-2 mb-1">
              <span style={{ color: item.color }} className="text-[10px] font-black">▸</span>
              <span className="text-xs font-bold text-white">{item.label}</span>
            </div>
            <p className="text-[10px] text-[#555] leading-relaxed ml-4">{item.note}</p>
          </div>
        ))}
      </div>

      {/* D03: Agility Engine */}
      <div className="card" style={{ borderColor: "#10b98122" }}>
        <p className="text-[10px] font-black tracking-[0.18em] text-[#555] uppercase mb-2">D-03 — The Agility Engine (Runs & Melisma)</p>
        <p className="text-[10px] text-[#555] font-medium mb-3">Runs will be muddy if you push a burst of air for every note. Agility requires absolute economy of air.</p>
        {[
          { label: "Slide, Don't Push", note: "A run is not a staircase of individual \"H\" sounds (Ah-ha-ha-ha). That triggers the diaphragm too violently. A vocal run is a smooth slide of cord tension on a single, continuous, highly pressurized, very thin stream of air.", color: "#10b981" },
          { label: "The Trill Foundation", note: "If you cannot execute a long, clean lip trill while sliding up and down your full range, your air pressure is uneven. Runs require mathematically even air pressure throughout the entire phrase.", color: "#34d399" },
          { label: "Decelerated Mapping", note: "Practice the hardest runs at 50% speed. Map the exact micro-intervals. Build the neurological pathway slowly so System 1 takes over effortlessly in the booth.", color: "#6ee7b7" },
        ].map((item, i) => (
          <div key={i} className="py-3 border-b border-[#1a1a1a] last:border-0">
            <div className="flex items-center gap-2 mb-1">
              <span style={{ color: item.color }} className="text-[10px] font-black">▸</span>
              <span className="text-xs font-bold text-white">{item.label}</span>
            </div>
            <p className="text-[10px] text-[#555] leading-relaxed ml-4">{item.note}</p>
          </div>
        ))}
      </div>

      {/* D04: CVT Overdrive */}
      <div className="card" style={{ borderColor: "#10b98122" }}>
        <p className="text-[10px] font-black tracking-[0.18em] text-[#555] uppercase mb-2">D-04 — CVT Overdrive & The Sovereign Signature</p>
        <p className="text-[10px] text-[#555] font-medium mb-3">The \"El Noir\" aesthetic requires abandoning pristine classical rules — but only if you know how to do it safely.</p>
        {[
          { label: "The Epiglottic Funnel (Safe Grit)", note: "Safe distortion (CVT Overdrive/Edge) happens ABOVE the true vocal folds. Intentionally narrowing the aryepiglottic sphincter (mimicking a sharp \"witch cackle\") makes the false tissue rattle aggressively while the true cords remain unstrained beneath.", color: "#10b981" },
          { label: "The Golden Rule of Distortion", note: "True, safe distortion requires MASSIVELY LESS air pressure, not more. If you push massive air to get rasp — you are shredding the cords. Pull the volume back, lock the Appoggio, engage the \"cackle\" tilt. If it hurts or tickles violently, you missed the target cartilage.", color: "#ef4444" },
        ].map((item, i) => (
          <div key={i} className="py-3 border-b border-[#1a1a1a] last:border-0">
            <div className="flex items-center gap-2 mb-1">
              <span style={{ color: item.color }} className="text-[10px] font-black">▸</span>
              <span className="text-xs font-bold text-white">{item.label}</span>
            </div>
            <p className="text-[10px] text-[#555] leading-relaxed ml-4">{item.note}</p>
          </div>
        ))}
      </div>

      {/* D05: Pre-Flight Somatic Matrix */}
      <div className="card" style={{ borderColor: "#10b98122" }}>
        <p className="text-[10px] font-black tracking-[0.18em] text-[#555] uppercase mb-2">D-05 — Pre-Flight Somatic Matrix</p>
        <p className="text-[10px] text-[#555] font-medium mb-3">Run this 6-point biometric scan 5 seconds before the red light goes on in the booth.</p>
        {[
          { n: "1", label: "Feet & Knees", check: "Are my feet rooted? Knees slightly bent? (Locked knees paralyze the pelvic floor.)" },
          { n: "2", label: "Intercostal Anchor", check: "Is my breath expanding my lower ribs laterally — or am I breathing into my high chest/shoulders?" },
          { n: "3", label: "C-Spine Posture", check: "Is the back of my neck long? Is my chin slightly tucked or parallel?" },
          { n: "4", label: "Jaw Check", check: "Is my jaw hanging dumbly? Is the muscle directly beneath my chin soft and spongy?" },
          { n: "5", label: "Soft Palate", check: "Can I feel the slight \"inner smile\" or \"yawn\" sensation lifting the back of my mouth?" },
          { n: "6", label: "Mental Override", check: "Acknowledge the block. Channel the frequency." },
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-3 py-2.5 border-b border-[#1a1a1a] last:border-0">
            <span className="text-emerald-500 font-black text-[10px] flex-shrink-0 mt-0.5">{item.n}</span>
            <div>
              <div className="text-xs font-bold text-white">{item.label}</div>
              <div className="text-[10px] text-[#555] mt-0.5">{item.check}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Routine Maintenance */}
      <div className="card" style={{ borderColor: "#10b98122" }}>
        <p className="text-[10px] font-black tracking-[0.18em] text-[#555] uppercase mb-2">Routine Maintenance</p>
        {[
          { label: "Pre-Session Warm-Up", note: "Never start by singing your hardest song. Begin with gentle lip trills or humming on a 5-tone scale. Proceed to gentle sirens (sliding low to high) to stretch the folds like rubber bands.", color: "#10b981" },
          { label: "Physical Unlocking", note: "Stretch neck, roll shoulders, aggressively massage jaw hinges BEFORE you ever hum. If traps and jaw are tight — larynx is tight — Appoggio fails.", color: "#34d399" },
          { label: "Post-Session Cool-Down", note: "After a heavy recording session, do NOT just stop and go to sleep. Spend 3 minutes on gentle, descending lip trills (high to low chest). Returns engorged laryngeal muscles to resting state — prevents overnight stiffening.", color: "#6ee7b7" },
          { label: "Hydration Timing", note: "Drink room-temperature water strictly 2 to 4 hours BEFORE your session. Water swallowed seconds before a take does nothing for your cords.", color: "#a7f3d0" },
        ].map((item, i) => (
          <div key={i} className="py-3 border-b border-[#1a1a1a] last:border-0">
            <div className="flex items-center gap-2 mb-1">
              <span style={{ color: item.color }} className="text-[10px] font-black">▸</span>
              <span className="text-xs font-bold text-white">{item.label}</span>
            </div>
            <p className="text-[10px] text-[#555] leading-relaxed ml-4">{item.note}</p>
          </div>
        ))}
      </div>

      {/* Emergency Protocol */}
      <div className="card" style={{ borderColor: "#ef444422" }}>
        <p className="text-[10px] font-black tracking-[0.18em] text-[#555] uppercase mb-2">Emergency Protocol — Inflammation Control</p>
        <p className="text-[10px] text-[#555] font-medium mb-3">When sickness, allergies, or vocal fatigue hit — the cords are inflamed (swollen). Break the cycle immediately.</p>
        {[
          { label: "SOVT Therapy", note: "Straw phonation into a half-glass of water. The back pressure holds inflamed vocal folds slightly apart so they can square up securely without crashing into each other. The ultimate massage.", color: "#f59e0b" },
          { label: "Direct Surface Hydration", note: "Personal vocal steamer or nebulizer with sterile isotonic saline (.9%) for 10 minutes. Directly reduces thick mucus and surface dehydration that systemic water cannot reach.", color: "#f59e0b" },
          { label: "No Dairy 2hrs Before", note: "Warm water + honey before tracking. No dairy before vocal takes — coats the folds, creates mucus drag.", color: "#f59e0b" },
        ].map((item, i) => (
          <div key={i} className="py-3 border-b border-[#1a1a1a] last:border-0">
            <div className="flex items-center gap-2 mb-1">
              <span style={{ color: item.color }} className="text-[10px] font-black">⚠</span>
              <span className="text-xs font-bold text-white">{item.label}</span>
            </div>
            <p className="text-[10px] text-[#555] leading-relaxed ml-4">{item.note}</p>
          </div>
        ))}
      </div>

    </ScrollSection>
  );
}

