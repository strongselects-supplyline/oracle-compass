"use client";

// app/velocity/page.tsx
// Streaming Velocity Tracker + EP Momentum Flywheel
// God-Shinobi tier — the system knows if the algorithm is activating.
// Built March 28, 2026.

import { useEffect, useState, useCallback } from "react";
import {
  logStreamEntry,
  getAllVelocities,
  TrackVelocity,
  StreamEntry,
  POPULARITY_THRESHOLDS,
  TIER_COLORS,
  TIER_LABELS,
  saveRateSignal,
} from "@/lib/streaming";
import { getDynamicReleases, Release } from "@/lib/releases";

// ── EP Release Calendar (static north star) ───────────────────────────

const EP_RELEASES = [
  { title: "SEE ME",            releaseDate: "2026-03-13", color: "#8b5cf6" },
  { title: "East Side Love",    releaseDate: "2026-04-03", color: "#3b82f6" },
  { title: "Sweet Frustration", releaseDate: "2026-04-10", color: "#f59e0b" },
  { title: "Like I Did",        releaseDate: "2026-04-17", color: "#ec4899" },
  { title: "ALL LOVE (EP)",     releaseDate: "2026-04-24", color: "#d4a853" },
];

// ── Helpers ───────────────────────────────────────────────────────────

function daysFrom(dateStr: string): number {
  return Math.ceil(
    (new Date(dateStr + "T00:00:00").getTime() - Date.now()) / 86400000
  );
}

function daysSince(dateStr: string): number {
  return Math.max(
    0,
    Math.floor(
      (Date.now() - new Date(dateStr + "T00:00:00").getTime()) / 86400000
    )
  );
}

function fmt(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return String(n);
}

function releaseColor(title: string): string {
  return EP_RELEASES.find((r) => r.title === title)?.color ?? "#888";
}

// ── Trend Icon ────────────────────────────────────────────────────────

function TrendIcon({ trend }: { trend: TrackVelocity["derived"]["trending"] }) {
  if (trend === "up")   return <span className="text-green-400 font-black text-base">↑</span>;
  if (trend === "down") return <span className="text-red-400 font-black text-base">↓</span>;
  if (trend === "flat") return <span className="text-amber-400 font-black text-base">→</span>;
  return <span className="text-[#555] text-[9px] font-black">NEW</span>;
}

// ── Mini Sparkline (pure SVG, no deps) ───────────────────────────────

function Sparkline({ entries, color }: { entries: StreamEntry[]; color: string }) {
  if (entries.length < 2) return null;

  const values = entries.map((e) => e.streams);
  const max = Math.max(...values, 1);
  const W = 200, H = 40, PX = 4, PY = 6;

  const pts = values.map((v, i) => {
    const x = PX + (i / (values.length - 1)) * (W - PX * 2);
    const y = PY + (1 - v / max) * (H - PY * 2);
    return [x, y] as [number, number];
  });

  const polyline = pts.map((p) => p.join(",")).join(" ");
  const area = [
    `${PX},${H - PY}`,
    ...pts.map((p) => p.join(",")),
    `${W - PX},${H - PY}`,
  ].join(" ");

  const gradId = `g${color.replace("#", "")}`;
  const [lx, ly] = pts[pts.length - 1];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-10" preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#${gradId})`} />
      <polyline points={polyline} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lx} cy={ly} r="3" fill={color} />
    </svg>
  );
}

// ── 28-Day Window Bar ─────────────────────────────────────────────────

function WindowBar({ days }: { days: number }) {
  const pct = Math.min((days / 28) * 100, 100);
  const label = days >= 28 ? "WINDOW CLOSED" : `DAY ${days} / 28`;
  const color = days >= 21 ? "#ef4444" : days >= 14 ? "#f59e0b" : "#22c55e";

  return (
    <div className="mb-3">
      <div className="flex justify-between mb-1">
        <span className="text-[9px] font-black text-[#555] uppercase tracking-wider">28-Day Algo Window</span>
        <span className="text-[9px] font-bold" style={{ color }}>{label}</span>
      </div>
      <div className="h-1.5 rounded-full bg-[#1a1a1a] overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

// ── Threshold Bar ─────────────────────────────────────────────────────

function ThresholdBar({ avg }: { avg: number }) {
  const max = POPULARITY_THRESHOLDS.viral;
  const pct = (v: number) => Math.min((v / max) * 100, 100);
  const barColor = avg >= POPULARITY_THRESHOLDS.algorithmic ? "#22c55e"
    : avg >= POPULARITY_THRESHOLDS.emerging ? "#f59e0b" : "#555";

  return (
    <div className="mb-3">
      <div className="flex justify-between mb-1">
        <span className="text-[9px] font-black text-[#555] uppercase tracking-wider">Popularity Threshold</span>
        <span className="text-[9px] font-bold text-white">{fmt(avg)}/day</span>
      </div>
      <div className="relative h-1.5 rounded-full bg-[#1a1a1a] overflow-hidden">
        <div className="absolute top-0 h-full w-px opacity-50" style={{ left: `${pct(POPULARITY_THRESHOLDS.emerging)}%`, background: "#f59e0b" }} />
        <div className="absolute top-0 h-full w-px opacity-50" style={{ left: `${pct(POPULARITY_THRESHOLDS.algorithmic)}%`, background: "#22c55e" }} />
        <div className="h-full rounded-full" style={{ width: `${Math.max(pct(avg), 2)}%`, background: barColor }} />
      </div>
      <div className="flex justify-between mt-0.5">
        <span className="text-[7px] text-[#333]">0</span>
        <span className="text-[7px] text-amber-400/40">500 editorial</span>
        <span className="text-[7px] text-green-400/40">3K algo</span>
        <span className="text-[7px] text-purple-400/40">10K viral</span>
      </div>
    </div>
  );
}

// ── EP Flywheel ───────────────────────────────────────────────────────

function EPFlywheel() {
  const today = new Date();
  const start = new Date("2026-03-13T00:00:00");
  const end = new Date("2026-04-24T00:00:00");
  const totalMs = end.getTime() - start.getTime();

  function toPct(dateStr: string): number {
    const d = new Date(dateStr + "T00:00:00");
    return Math.max(0, Math.min(100, ((d.getTime() - start.getTime()) / totalMs) * 100));
  }

  const todayPct = Math.max(0, Math.min(100, ((today.getTime() - start.getTime()) / totalMs) * 100));
  const compoundStart = toPct("2026-04-03");
  const compoundEnd = toPct("2026-04-24");

  return (
    <div className="card mb-4">
      <p className="text-[10px] font-black tracking-[0.2em] text-[#555] uppercase mb-0.5">EP Momentum Flywheel</p>
      <p className="text-[9px] text-[#444] mb-4">5 events · 42 days · algorithmic compounding</p>

      {/* Timeline */}
      <div className="relative h-3 rounded-full bg-[#1a1a1a] mb-5">
        {/* Compounding zone highlight */}
        <div
          className="absolute top-0 h-full rounded-full opacity-25"
          style={{ left: `${compoundStart}%`, width: `${compoundEnd - compoundStart}%`, background: "#d4a853" }}
        />
        {/* Release dots */}
        {EP_RELEASES.map((r) => {
          const isLive = new Date(r.releaseDate + "T00:00:00") <= today;
          return (
            <div
              key={r.title}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
              style={{ left: `${toPct(r.releaseDate)}%` }}
            >
              <div
                className="w-6 h-6 rounded-full border-[3px] border-[#080808] flex items-center justify-center transition-all hover:scale-125"
                style={{ background: isLive ? r.color : "#0f0f0f", borderColor: r.color }}
                aria-label={`${r.title} release dot`}
              />
            </div>
          );
        })}
        {/* Today line */}
        {todayPct >= 0 && todayPct <= 100 && (
          <div
            className="absolute top-1/2 -translate-x-1/2"
            style={{ left: `${todayPct}%` }}
          >
            <div className="w-px h-6 bg-white/20 -translate-y-3" />
          </div>
        )}
      </div>

      {/* Track labels below */}
      <div className="relative h-16 mb-2">
        {EP_RELEASES.map((r, i) => {
          const isLive = new Date(r.releaseDate + "T00:00:00") <= today;
          const dLeft = daysFrom(r.releaseDate);
          const align =
            i === 0 ? "left-0" :
            i === EP_RELEASES.length - 1 ? "right-0" : "";
          const style =
            i > 0 && i < EP_RELEASES.length - 1
              ? { left: `${toPct(r.releaseDate)}%`, transform: "translateX(-50%)" }
              : {};
          return (
            <div key={r.title} className={`absolute ${align}`} style={style}>
              <div className="text-[8px] font-black uppercase leading-tight whitespace-nowrap" style={{ color: isLive ? r.color : "#333" }}>
                {r.title.replace("East Side Love","ESL").replace("Sweet Frustration","SF").replace("Like I Did","LID").replace("ALL LOVE (EP)","EP")}
              </div>
              <div className="text-[7px] text-[#333] font-bold mt-0.5">
                {isLive ? `+${daysSince(r.releaseDate)}d` : dLeft <= 0 ? "TODAY" : `T-${dLeft}`}
              </div>
            </div>
          );
        })}
      </div>

      {/* Compounding callout */}
      <div className="rounded-xl px-3 py-2.5 border border-[#d4a853]/20 bg-[#d4a853]/5 mt-1">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-[9px] font-black text-[#d4a853] uppercase tracking-wider">Compounding Zone</div>
            <div className="text-[8px] text-[#666] mt-0.5">Apr 3–24 · ESL + SF + LID + EP in 21 days</div>
          </div>
          <div className="text-right">
            <div className="text-base font-black text-[#d4a853]">{Math.max(0, daysFrom("2026-04-03"))}</div>
            <div className="text-[7px] text-[#555]">days away</div>
          </div>
        </div>
      </div>

      <p className="text-[8px] text-[#444] leading-relaxed mt-3">
        Each drop re-triggers Release Radar before the previous track decays from the 28-day window.
        The algorithm sees momentum, not isolated tracks. 5 events in 42 days = compounding velocity.
      </p>
    </div>
  );
}

// ── Velocity Card ─────────────────────────────────────────────────────

function VelocityCard({
  velocity,
  onLog,
}: {
  velocity: TrackVelocity;
  onLog: () => void;
}) {
  const d = velocity.derived;
  const color = releaseColor(velocity.title);
  const sr = saveRateSignal(d.saveRate);

  return (
    <div className="card mb-3">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="font-black text-sm" style={{ color }}>{velocity.title}</div>
          <div className="text-[9px] text-[#555] mt-0.5">Released {velocity.releaseDate}</div>
        </div>
        <div className="flex items-center gap-2">
          <TrendIcon trend={d.trending} />
          <span
            className="text-[8px] font-black px-2 py-0.5 rounded border"
            style={{ color: TIER_COLORS[d.popularityTier], borderColor: TIER_COLORS[d.popularityTier] + "33", background: TIER_COLORS[d.popularityTier] + "11" }}
          >
            {TIER_LABELS[d.popularityTier]}
          </span>
        </div>
      </div>

      <WindowBar days={d.daysSinceRelease} />
      <ThresholdBar avg={d.sevenDayAvg} />

      {velocity.entries.length >= 2 && (
        <div className="mb-3"><Sparkline entries={velocity.entries.slice(-14)} color={color} /></div>
      )}

      <div className="grid grid-cols-3 gap-2 mb-3">
        {[
          { label: "Total", value: fmt(d.totalStreams) },
          { label: "7d avg/day", value: fmt(d.sevenDayAvg) },
          { 
             label: "Proj. Day28", 
             value: fmt(d.projectedDay28),
             alert: d.projectedDay28 < POPULARITY_THRESHOLDS.algorithmic && d.daysSinceRelease < 28
          },
        ].map((m) => (
          <div key={m.label} className="bg-[#0f0f0f] rounded-xl p-2.5 text-center relative overflow-hidden">
            <div className={`text-base font-black ${m.alert ? "text-red-400" : "text-white"}`}>{m.value}</div>
            <div className="text-[8px] text-[#555] font-bold uppercase">{m.label}</div>
            {m.alert && (
              <div className="absolute top-0 right-0 p-1">
                <span className="flex h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
              </div>
            )}
          </div>
        ))}
      </div>

      {d.projectedDay28 < POPULARITY_THRESHOLDS.algorithmic && d.daysSinceRelease < 28 && (
        <div className="bg-red-500/5 border border-red-500/10 rounded-xl px-3 py-2 mb-3">
          <p className="text-[8px] font-black text-red-400 uppercase tracking-widest mb-1">Low Algorithmic Signal</p>
          <p className="text-[8px] text-[#555] leading-relaxed">
            Projected D-28 is under {fmt(POPULARITY_THRESHOLDS.algorithmic)}. Algorithmic activation (Discover Weekly) requires higher velocity before the window closes.
          </p>
        </div>
      )}

      {d.saveRate > 0 && (
        <div
          className="rounded-xl px-3 py-2 mb-3 border"
          style={{ borderColor: sr.color + "33", background: sr.color + "0d" }}
        >
          <div className="text-[9px] font-black" style={{ color: sr.color }}>
            SAVE RATE {d.saveRate}% — {sr.label}
          </div>
          <div className="text-[8px] text-[#666] mt-0.5">{sr.advisory}</div>
        </div>
      )}

      {velocity.entries.length === 0 && (
        <div className="bg-[#0f0f0f] rounded-xl px-3 py-2.5 mb-3 text-center">
          <div className="text-[9px] text-[#555]">No streams logged yet. First entry starts the tracker.</div>
        </div>
      )}

      <button
        onClick={onLog}
        className="w-full py-3 rounded-xl text-[11px] font-black uppercase tracking-wider border border-[#252525] text-[#888] hover:bg-[#1a1a1a] hover:text-white transition-all active:scale-[0.98]"
      >
        + Log Today's Streams
      </button>
    </div>
  );
}

// ── Log Modal ─────────────────────────────────────────────────────────

function LogModal({
  title,
  onClose,
  onSave,
}: {
  title: string;
  onClose: () => void;
  onSave: (streams: number, saves: number) => Promise<void>;
}) {
  const [streams, setStreams] = useState("");
  const [saves, setSaves] = useState("");
  const [saving, setSaving] = useState(false);
  const color = releaseColor(title);

  async function submit() {
    const s = parseInt(streams);
    if (!s || s < 0) return;
    setSaving(true);
    await onSave(s, parseInt(saves) || 0);
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-end" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full bg-[#111] rounded-t-3xl border-t border-[#252525] p-6 pb-12">
        <div className="flex justify-between items-center mb-5">
          <div>
            <div className="font-black text-base" style={{ color }}>{title}</div>
            <div className="text-[10px] text-[#555]">Log today's numbers from Spotify for Artists</div>
          </div>
          <button onClick={onClose} className="text-[#555] text-3xl leading-none w-10 h-10 flex items-center justify-center">×</button>
        </div>

        <div className="space-y-3 mb-5">
          <div>
            <label className="block text-[10px] font-black text-[#555] uppercase tracking-wider mb-2">Streams Today *</label>
            <input
              type="number"
              inputMode="numeric"
              placeholder="e.g. 847"
              value={streams}
              onChange={(e) => setStreams(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3.5 text-white font-bold text-base focus:outline-none focus:border-[#d4a853]/40"
              autoFocus
            />
            <p className="text-[9px] text-[#444] mt-1.5">Spotify for Artists → Music → {title} → today's streams</p>
          </div>
          <div>
            <label className="block text-[10px] font-black text-[#555] uppercase tracking-wider mb-2">
              Saves <span className="text-[#333] font-normal normal-case">(optional)</span>
            </label>
            <input
              type="number"
              inputMode="numeric"
              placeholder="e.g. 42"
              value={saves}
              onChange={(e) => setSaves(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3.5 text-white font-bold text-base focus:outline-none focus:border-[#d4a853]/40"
            />
            <p className="text-[9px] text-[#444] mt-1.5">Target: 3-5%+ save rate = strong algorithmic signal</p>
          </div>
        </div>

        <button
          onClick={submit}
          disabled={!streams || saving}
          className="w-full py-4 rounded-xl font-black text-sm uppercase tracking-wider transition-all active:scale-[0.98] disabled:opacity-40"
          style={{ background: color, color: "#000" }}
        >
          {saving ? "Saving..." : "Log Streams"}
        </button>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────

export default function VelocityPage() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [velocities, setVelocities] = useState<TrackVelocity[]>([]);
  const [loading, setLoading] = useState(true);
  const [logTarget, setLogTarget] = useState<string | null>(null);

  const reload = useCallback(async () => {
    const rels = await getDynamicReleases();
    setReleases(rels);
    const vels = await getAllVelocities(rels);
    setVelocities(vels);
    setLoading(false);
  }, []);

  useEffect(() => { reload(); }, [reload]);

  async function handleSave(title: string, streams: number, saves: number) {
    await logStreamEntry(title, { streams, saves });
    setLogTarget(null);
    await reload();
  }

  const liveVels = velocities.filter(
    (v) => releases.find((r) => r.title === v.title)?.status === "live"
  );
  const upcomingVels = velocities.filter(
    (v) => releases.find((r) => r.title === v.title)?.status !== "live"
  );

  if (loading) {
    return (
      <main className="page animate-fade-in">
        <div className="page-inner flex items-center justify-center min-h-[60vh]">
          <div className="text-[#555] text-sm font-bold">Loading...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="page animate-fade-in pb-24">
      <div className="page-inner">
        {/* Header */}
        <div className="flex justify-between items-end mb-6">
          <div>
            <p className="text-[10px] font-black tracking-[0.2em] text-[#444] uppercase">Oracle Compass</p>
            <h1 className="text-2xl font-black tracking-tight text-white">📈 Velocity</h1>
          </div>
          <div className="text-[10px] text-[#555] text-right">28-day window<br />momentum tracker</div>
        </div>

        {/* EP Flywheel */}
        <EPFlywheel />

        {/* Live tracks */}
        {liveVels.length > 0 && (
          <>
            <p className="text-[10px] font-black tracking-[0.2em] text-[#555] uppercase mb-3">
              Live Tracks ({liveVels.length})
            </p>
            {liveVels.map((v) => (
              <VelocityCard key={v.title} velocity={v} onLog={() => setLogTarget(v.title)} />
            ))}
          </>
        )}

        {liveVels.length === 0 && (
          <div className="card text-center py-8 mb-4">
            <div className="text-2xl mb-2">🎵</div>
            <div className="text-sm font-bold text-white mb-1">SEE ME is live</div>
            <div className="text-[10px] text-[#555]">
              Log your first stream count to activate the velocity tracker.
            </div>
            <button
              onClick={() => setLogTarget("SEE ME")}
              className="mt-4 px-6 py-3 rounded-xl font-black text-[11px] uppercase tracking-wider bg-[#8b5cf6] text-white active:scale-[0.98]"
            >
              Log SEE ME Streams
            </button>
          </div>
        )}

        {/* Upcoming */}
        {upcomingVels.length > 0 && (
          <div className="mt-2">
            <p className="text-[10px] font-black tracking-[0.2em] text-[#555] uppercase mb-3">Upcoming</p>
            {upcomingVels.map((v) => {
              const rel = releases.find((r) => r.title === v.title);
              const color = releaseColor(v.title);
              const dLeft = daysFrom(v.releaseDate);
              return (
                <div key={v.title} className="card mb-2 flex justify-between items-center py-3">
                  <div>
                    <div className="font-black text-sm" style={{ color }}>{v.title}</div>
                    <div className="text-[9px] text-[#555] mt-0.5">
                      {rel?.uploadDate ? `Upload ${rel.uploadDate} · ` : ""}
                      {dLeft > 0 ? `T-${dLeft}` : dLeft === 0 ? "TODAY" : `${Math.abs(dLeft)}d ago`}
                    </div>
                  </div>
                  <div className="text-[8px] font-black px-2 py-1 rounded border border-[#252525] text-[#444]">
                    LOCKED
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Playbook reference */}
        <div className="card mt-4 border-[#1c1c1c]">
          <p className="text-[9px] font-black text-[#444] uppercase tracking-wider mb-3">Algo Thresholds</p>
          <div className="space-y-2">
            {[
              { label: "Editorial consideration", val: "500+/day", color: "#f59e0b" },
              { label: "Release Radar + Discover Weekly", val: "3K+/day", color: "#22c55e" },
              { label: "Viral / trending", val: "10K+/day", color: "#8b5cf6" },
            ].map((t) => (
              <div key={t.label} className="flex justify-between items-center">
                <span className="text-[9px] text-[#555]">{t.label}</span>
                <span className="text-[9px] font-black" style={{ color: t.color }}>{t.val}</span>
              </div>
            ))}
          </div>
          <p className="text-[8px] text-[#333] mt-3 leading-relaxed">
            Popularity score is weighted toward last 7 days within a 28-day window. Each drop resets and compounds momentum before the previous track decays.
          </p>
        </div>
      </div>

      {logTarget && (
        <LogModal
          title={logTarget}
          onClose={() => setLogTarget(null)}
          onSave={(s, sv) => handleSave(logTarget, s, sv)}
        />
      )}
    </main>
  );
}
