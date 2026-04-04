"use client";

import { useEffect, useState, useCallback } from "react";
import { getDayType, isSacredDay, isStudioDay } from "@/lib/dayType";
import { getDailyLog, saveDailyLog, DailyLog, getStoreValue, getTodayISO } from "@/lib/db";
import { getSobrietyStreak } from "@/lib/streaks";
import { getDynamicReleases, Release } from "@/lib/releases";
import { useCloudSync } from "@/lib/useCloudSync";
import { getMakeModeWeek } from "@/lib/oracle";
import type { OracleDecree } from "@/lib/oracle";
import { getLaneStatus, Lane } from "@/lib/lanes";
import { getKillStats } from "@/lib/killList";
import WeeklyMirror from "@/components/WeeklyMirror";
import CheckItem from "@/components/CheckItem";
import Link from "next/link";


type ProtocolStep = { icon: string; action: string; tab?: string };

function getProtocolSteps(dayType: string): { tagline: string; steps: ProtocolStep[] } {
  if (dayType === "STUDIO + SAUNA DAY") return {
    tagline: "Split-Block Studio + Thermal Reset + DD Sprints.",
    steps: [
      { icon: "\uD83D\uDE97", action: "6 AM \u2192 DD Morning Sprint (1hr)" },
      { icon: "\u2600\uFE0F", action: "7 AM \u2192 Sovereignty Stack \u2192 log below" },
      { icon: "\uD83C\uDFB9", action: "10 AM \u2192 Studio Block 1 (mix/vocals)" },
      { icon: "\uD83D\uDE97", action: "12 PM \u2192 DD Midday Sprint (2hrs)" },
      { icon: "\uD83C\uDFA4", action: "2 PM \u2192 Studio Block 2" },
      { icon: "\uD83D\uDD25", action: "4 PM \u2192 Sauna (thermal reset)" },
      { icon: "\uD83D\uDE97", action: "5:30 PM \u2192 DD Evening Sprint (2-3hrs)" },
      { icon: "\uD83D\uDCF1", action: "Post content from STUDIO queue", tab: "studio" },
    ]
  };
  if (dayType === "STUDIO DAY") return {
    tagline: "Split-Block Studio + DD Sprints. No Distractions.",
    steps: [
      { icon: "\uD83D\uDE97", action: "6 AM \u2192 DD Morning Sprint (1hr)" },
      { icon: "\u2600\uFE0F", action: "7 AM \u2192 Sovereignty Stack \u2192 log below" },
      { icon: "\uD83C\uDFB9", action: "10 AM \u2192 Studio Block 1 (mix/vocals)" },
      { icon: "\uD83D\uDE97", action: "12 PM \u2192 DD Midday Sprint (2hrs)" },
      { icon: "\uD83C\uDFA4", action: "2 PM \u2192 Studio Block 2" },
      { icon: "\uD83D\uDE97", action: "5:30 PM \u2192 DD Evening Sprint (2-3hrs)" },
      { icon: "\uD83D\uDCF1", action: "Post content from STUDIO queue", tab: "studio" },
    ]
  };
  if (dayType === "BIZ DAY") return {
    tagline: "Pipeline moves + DD Sprints. ENGINE is Track 1.",
    steps: [
      { icon: "\uD83D\uDE97", action: "6 AM \u2192 DD Morning Sprint (1hr)" },
      { icon: "\u2600\uFE0F", action: "7 AM \u2192 Sovereignty Stack \u2192 log below" },
      { icon: "\u2699\uFE0F", action: "Check ENGINE for pipeline tasks", tab: "engine" },
      { icon: "\uD83D\uDE97", action: "12 PM \u2192 DD Midday Sprint (2hrs)" },
      { icon: "\uD83D\uDCE4", action: "Push content to IG/TikTok/YouTube" },
      { icon: "\uD83D\uDE97", action: "5:30 PM \u2192 DD Evening Sprint (2-3hrs)" },
      { icon: "\uD83D\uDD2E", action: "Read today's Oracle decree", tab: "oracle" },
    ]
  };
  return { tagline: "", steps: [] };
}

// Cycle tracks removed — all on ALL LOVE EP. Active track derived from releases.


function HydrationSelector({ value, onChange }: { value: number | null, onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1.5">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          onClick={() => onChange(n)}
          className={`w-9 h-9 rounded-lg text-sm font-black transition-all ${value === n ? 'bg-blue-500 text-white' : 'bg-[#111] text-[#555] border border-[#222]'}`}
        >
          {n}
        </button>
      ))}
    </div>
  );
}

export default function MorningMode() {
  const [log, setLog] = useState<DailyLog | null>(null);
  const [decree, setDecree] = useState<OracleDecree | null>(null);
  const [streak, setStreak] = useState<number>(0);
  const [dayType, setDayType] = useState<string>("");
  const [dateStr, setDateStr] = useState<string>("");
  const [isEditingOneThing, setIsEditingOneThing] = useState(false);
  const [oneThingInput, setOneThingInput] = useState("");
  const [activeTrack, setActiveTrack] = useState<string>("\u2013");
  const [week, setWeek] = useState<number>(1);
  const [nextRelease, setNextRelease] = useState<Release | null>(null);
  const [daysUntilRelease, setDaysUntilRelease] = useState<number>(0);
  const [lanes, setLanes] = useState<Lane[]>([]);
  const [showProtocol, setShowProtocol] = useState(false);
  const [killRedCount, setKillRedCount] = useState(0);
  const { syncStatus, sync: handleSync } = useCloudSync();

  // Refresh lanes reactively after any state change
  const refreshLanes = useCallback(async () => {
    setLanes(await getLaneStatus());
  }, []);

  // DoorDash State
  const [ddHours, setDdHours] = useState("");
  const [ddRevenue, setDdRevenue] = useState("");
  const [ddStatus, setDdStatus] = useState("");

  useEffect(() => {
    const init = async () => {
      const todayLog = await getDailyLog();
      setLog(todayLog);
      setOneThingInput(todayLog.oneThing);
      setStreak(getSobrietyStreak());
      setDayType(getDayType());
      setWeek(getMakeModeWeek());

      const d = new Date();
      setDateStr(d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }));

      const releases = await getDynamicReleases();
      const now = new Date();
      const next = releases.find(s => new Date(s.releaseDate) >= now) || releases[releases.length - 1];
      setNextRelease(next);
      setDaysUntilRelease(Math.max(Math.ceil((new Date(next.releaseDate).getTime() - now.getTime()) / 86400000), 0));

      // Active track = next upcoming release title
      setActiveTrack(next?.title || "–");

      setDecree(await getStoreValue<OracleDecree>(`oracle_decree:${getTodayISO()}`));
      setLanes(await getLaneStatus());
      const stats = await getKillStats();
      setKillRedCount(stats.redRemaining);
    };
    init();
  }, []);

  const handleSaveOneThing = async () => {
    if (!log) return;
    const updated = { ...log, oneThing: oneThingInput };
    await saveDailyLog(updated);
    setLog(updated);
    setIsEditingOneThing(false);
  };

  const updateLog = async (updates: Partial<DailyLog>) => {
    if (!log) return;
    const updated = { ...log, ...updates };
    setLog(updated);
    await saveDailyLog(updated);
    // Refresh lanes so they reflect the new log state immediately
    refreshLanes();
  };

  const submitDoorDash = async () => {
    if (!ddHours || !ddRevenue) return;
    setDdStatus("Logging...");
    try {
      const res = await fetch("/api/doordash", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: new Date().toISOString().split("T")[0], hours: parseFloat(ddHours), revenue: parseFloat(ddRevenue), gas: 0, tips: 0, miles: 0 })
      });
      if (res.ok) {
        // Sync to DailyTelemetry so Kill List telemetry panel stays coherent
        const { getDailyTelemetry, saveDailyTelemetry } = await import("@/lib/db");
        const tel = await getDailyTelemetry();
        tel.doordash_earned += parseFloat(ddRevenue) || 0;
        await saveDailyTelemetry(tel);
        refreshLanes(); // Update money lane immediately
        setDdStatus("LOGGED ✓"); setTimeout(() => { setDdStatus(""); setDdHours(""); setDdRevenue(""); }, 2000);
      }
      else setDdStatus("FAILED");
    } catch { setDdStatus("FAILED"); }
  };

  if (!log) return null;
  const isSacred = isSacredDay(dayType as any);
  const studioDay = isStudioDay(dayType as any);
  const fuelScore = [log.fuelPreSession, log.fuelMidSession, log.fuelPostSession].filter(Boolean).length;

  const fuelLabels = decree?.dietary_alignment ? decree.dietary_alignment : {
    pre: { label: "Pre-Session Fuel", desc: "Breakfast protocol not set by Oracle." },
    mid: { label: "Mid-Session Fuel", desc: "Mid-day protocol not set by Oracle." },
    post: { label: "Post-Session Fuel", desc: "Evening protocol not set by Oracle." },
    warning: null
  };

  return (
    <main className="page animate-fade-in pb-20">
      <div className="page-inner">

        {daysUntilRelease <= 3 && nextRelease && nextRelease.status !== 'live' && (
          <div className="alert-banner alert-banner-red mb-8 !p-3">
            <span className="animate-pulse-glow mr-2">{"\uD83D\uDD34"}</span>
            <div className="flex-1">
              <span className="font-black text-sm">{nextRelease.title}</span> {"\u2014"} {daysUntilRelease === 0 ? "OUT TODAY" : `${daysUntilRelease}d OUT`}
            </div>
          </div>
        )}

        <header className="mb-8 text-center">
          <p className="text-[10px] font-black tracking-[0.2em] text-[#444] uppercase mb-1">MAKE MODE {"\u00B7"} Wk {week} of 5</p>
          <p className="text-sm font-bold tracking-widest text-[#888] uppercase">{dateStr}</p>
        </header>

        {isSacred ? (
          <div className="text-center mt-12">
            <div className="text-6xl mb-6">{"\uD83D\uDED1"}</div>
            <h2 className="text-xl font-black mb-2">Sunday is sacred.</h2>
            <p className="text-[#666] text-sm">Zero building.<br />Nadi Shodhana. Rest.<br />The week depends on this.</p>
          </div>
        ) : (
          <>
            {/* ONE THING */}
            <section
              className={`mb-6 card !py-6 text-center transition-all active:scale-[0.98] cursor-pointer ${!log.oneThing ? 'border-dashed border-amber-500/30 bg-amber-500/[0.02]' : ''}`}
              onClick={() => !isEditingOneThing && setIsEditingOneThing(true)}
              aria-label="Set today's one thing"
            >
              <p className="text-[10px] font-black tracking-[0.2em] text-amber-500 uppercase mb-3">Today{"'"}s One Thing</p>
              {isEditingOneThing ? (
                <input
                  autoFocus
                  type="text"
                  className="w-full bg-transparent text-xl font-black text-center text-white outline-none placeholder-[#333]"
                  value={oneThingInput}
                  onChange={e => setOneThingInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSaveOneThing()}
                  onBlur={handleSaveOneThing}
                  placeholder="The single move..."
                />
              ) : (
                <p className={`text-xl font-black leading-tight tracking-tight px-4 ${log.oneThing ? 'text-white' : 'text-[#555] opacity-60'}`}>
                  {log.oneThing || "Tap to define the single move \u2192"}
                </p>
              )}
            </section>

            {/* DASHBOARD KPS */}
            <div className="flex gap-2 mb-6">
              <div className="card flex-1 p-3 text-center">
                <p className="text-[9px] font-black tracking-[0.1em] text-[#555] uppercase">Streak</p>
                <p className="text-2xl font-black text-amber-400 my-1">{streak}</p>
                <p className="text-[9px] text-[#555] font-bold">days {"\uD83D\uDC8E"}</p>
              </div>
              <div className="card flex-1 p-3 text-center">
                <p className="text-[9px] font-black tracking-[0.1em] text-[#555] uppercase">Release</p>
                <p className={`text-2xl font-black my-1 ${daysUntilRelease <= 3 ? 'text-red-400' : 'text-white'}`}>{daysUntilRelease}</p>
                <p className="text-[9px] text-[#555] font-bold truncate px-1">{nextRelease?.title.toUpperCase() ?? "\u2013"}</p>
              </div>
              <div className="card flex-1 p-3 text-center">
                <p className="text-[9px] font-black tracking-[0.1em] text-[#555] uppercase">Fuel</p>
                <p className={`text-2xl font-black my-1 ${fuelScore === 3 ? 'text-green-400' : fuelScore >= 1 ? 'text-amber-400' : 'text-[#333]'}`}>{fuelScore}/3</p>
                <p className="text-[9px] text-[#555] font-bold">meals</p>
              </div>
            </div>

            {/* WEEKLY MIRROR */}
            <WeeklyMirror />

            {/* LANE DASHBOARD */}
            {lanes.length > 0 && (
              <div className="mb-8">
                <h3 className="text-[10px] font-black tracking-[0.2em] text-[#555] uppercase mb-3 px-1">Lanes Touched Today</h3>
                <div className="grid grid-cols-6 gap-2">
                  {lanes.map(lane => {
                    // Life lane is tappable — toggles personalTime directly
                    const isTappable = lane.id === 'life';
                    const handleTapLane = async () => {
                      if (!isTappable || !log) return;
                      await updateLog({ personalTime: !log.personalTime });
                    };

                    // Explicit ring colors per lane (ring-current doesn't work with Tailwind text classes)
                    const ringColors: Record<string, string> = {
                      money: 'ring-green-400', body: 'ring-orange-400', music: 'ring-blue-400',
                      content: 'ring-pink-400', life: 'ring-yellow-400', inner: 'ring-purple-400',
                    };

                    return (
                      <div
                        key={lane.id}
                        className={`flex flex-col items-center gap-1.5 ${isTappable ? 'cursor-pointer active:scale-95' : ''}`}
                        onClick={isTappable ? handleTapLane : undefined}
                      >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg transition-all duration-500 ${
                          lane.touched
                            ? `${lane.bgColor} ring-2 ${ringColors[lane.id]} ${lane.color} scale-105`
                            : 'bg-[#111] ring-1 ring-[#222] opacity-40'
                        }`}>
                          {lane.icon}
                        </div>
                        <span className={`text-[8px] font-black tracking-wider uppercase ${
                          lane.touched ? lane.color : 'text-[#333]'
                        }`}>{lane.label}</span>
                        {lane.touched && lane.touchCount > 1 && (
                          <span className={`text-[7px] font-bold ${lane.color} opacity-60`}>{lane.touchCount}x</span>
                        )}
                        {isTappable && !lane.touched && (
                          <span className="text-[7px] text-[#333] font-bold">tap</span>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="mt-3 text-center">
                  <span className="text-[10px] text-[#444] font-bold">
                    {lanes.filter(l => l.touched).length}/6 lanes active
                  </span>
                </div>
              </div>
            )}

            {/* NEED DIRECTION? — Kill List safety net */}
            <Link href="/kill" className="block mb-8">
              <div className={`card !p-4 text-center border-dashed transition-all active:scale-[0.98] ${
                killRedCount > 0
                  ? 'border-red-500/30 hover:border-red-500/50'
                  : 'border-[#222] hover:border-amber-500/30'
              }`}>
                <p className="text-sm font-black text-[#666]">
                  Need direction?
                  {killRedCount > 0 && (
                    <span className="ml-2 text-[10px] text-red-400 font-black">
                      {killRedCount} RED
                    </span>
                  )}
                </p>
                <p className="text-[10px] text-[#444] mt-0.5">
                  {killRedCount > 0
                    ? `${killRedCount} urgent task${killRedCount > 1 ? 's' : ''} waiting on the Kill List`
                    : 'Open the Kill List for data-backed next moves'
                  }
                </p>
              </div>
            </Link>

            {/* PROTOCOL (collapsible) */}
            {(() => {
              const protocol = getProtocolSteps(dayType);
              return protocol.steps.length > 0 && (
                <div className="mb-8">
                  <button
                    onClick={() => setShowProtocol(!showProtocol)}
                    className="flex justify-between items-center w-full mb-3 px-1"
                  >
                    <h3 className="text-[10px] font-black tracking-[0.2em] text-[#555] uppercase">{dayType}</h3>
                    <span className="text-[10px] text-[#444] font-bold">{showProtocol ? 'hide' : 'show schedule'}</span>
                  </button>
                  {showProtocol && (
                    <div className="card !p-0 overflow-hidden divide-y divide-[#1a1a1a] animate-fade-in">
                      {protocol.steps.map((step, i) => (
                        <div key={i} className="flex items-center gap-3 px-4 py-3.5">
                          <span className="text-lg">{step.icon}</span>
                          <span className="text-[12px] font-bold text-[#ccc] leading-snug flex-1">{step.action}</span>
                          {step.tab && <span className="text-[8px] font-black tracking-widest text-amber-500/70 uppercase bg-amber-500/10 px-1.5 py-0.5 rounded">{step.tab}</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* MORNING & GRIND LOGGING */}
            <div className="mb-8">
              <h3 className="text-[10px] font-black tracking-[0.2em] text-[#555] uppercase mb-3 px-1">Morning & Grind Logging</h3>
              <div className="card !p-1.5 mb-2">
                <CheckItem label="Sovereignty Stack" description="Trataka, breathwork, mullein tea, cold shower." checked={log.sovereigntyStack} onChange={v => updateLog({ sovereigntyStack: v })} />
                <CheckItem label="Movement (Pre-DAW)" description="Lift, run, or deep stretch \u2014 sweat required." checked={log.movement} onChange={v => updateLog({ movement: v })} />
                <CheckItem label="Eucalyptus Steam" description="Clear the lungs for vocal performance." dimmed={!studioDay} checked={log.eucalyptusStream} onChange={v => updateLog({ eucalyptusStream: v })} />
                <CheckItem label="Sauna" dimmed={dayType !== "STUDIO + SAUNA DAY"} checked={log.sauna} onChange={v => updateLog({ sauna: v })} />
              </div>

              <div className="flex gap-2 mb-2">
                <div className="card flex-1 flex items-center justify-between p-3">
                  <span className="text-[10px] font-black tracking-widest text-[#555] uppercase">Sleep (h)</span>
                  <input type="number" className="w-12 bg-transparent text-right font-black text-lg outline-none" value={log.sleep || ""} onChange={e => updateLog({ sleep: parseFloat(e.target.value) || null })} placeholder="0" />
                </div>
                <div className="card flex-1 flex items-center justify-between p-3">
                  <span className="text-[10px] font-black tracking-widest text-[#555] uppercase">Pushups</span>
                  <input type="number" className="w-12 bg-transparent text-right font-black text-lg outline-none" value={log.pushups || ""} onChange={e => updateLog({ pushups: parseInt(e.target.value) || null })} placeholder="0" />
                </div>
              </div>

              <div className="card p-3 mb-2">
                <textarea className="w-full bg-transparent outline-none text-sm font-semibold placeholder-[#333] resize-none h-16" placeholder="GRATITUDE / WINS / NOTES..." value={log.journalLine || ""} onChange={e => updateLog({ journalLine: e.target.value })} />
              </div>

              {/* FUEL TRACKING */}
              <h3 className="text-[10px] font-black tracking-[0.2em] text-[#555] uppercase mb-3 mt-6 px-1">Fuel</h3>
              {fuelLabels.warning && (
                <div className="mb-2 p-2 bg-red-500/10 border border-red-500/20 rounded-lg text-xs font-bold text-red-500 flex items-center gap-2">
                  <span className="text-sm">{"\u26A0\uFE0F"}</span> {fuelLabels.warning}
                </div>
              )}
              <div className="card !p-1.5 mb-2">
                <CheckItem label={fuelLabels.pre.label} description={fuelLabels.pre.desc} checked={log.fuelPreSession} onChange={v => updateLog({ fuelPreSession: v })} />
                <CheckItem label={fuelLabels.mid.label} description={fuelLabels.mid.desc} checked={log.fuelMidSession} onChange={v => updateLog({ fuelMidSession: v })} />
                <CheckItem label={fuelLabels.post.label} description={fuelLabels.post.desc} checked={log.fuelPostSession} onChange={v => updateLog({ fuelPostSession: v })} />
                <CheckItem label="Dairy Before Vocals" description="Thickens mucus on cords. Flag if yes." checked={log.fuelDairyFlag} onChange={v => updateLog({ fuelDairyFlag: v })} warn={true} dimmed={!studioDay} />
              </div>

              <div className="card flex items-center justify-between p-3 mb-2">
                <span className="text-[10px] font-black tracking-widest text-[#555] uppercase">Hydration</span>
                <HydrationSelector value={log.fuelHydration} onChange={v => updateLog({ fuelHydration: v })} />
              </div>

              <button
                onClick={() => handleSync(log!, dayType)}
                disabled={!!syncStatus && syncStatus !== 'FAILED'}
                className="w-full mt-4 py-3 rounded-xl bg-[#1a1a1a] border border-[#333] text-sm font-black tracking-widest text-white hover:bg-[#222] active:scale-95 transition-all outline-none"
                style={{ color: syncStatus === 'SYNCED' ? '#22c55e' : syncStatus === 'FAILED' ? '#ef4444' : 'white' }}
              >
                {syncStatus || "SYNC TO CLOUD"}
              </button>
            </div>

            {/* DOORDASH QUICK-ADD */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3 px-1">
                <h3 className="text-[10px] font-black tracking-[0.2em] text-[#555] uppercase">DOORDASH LOG</h3>
                {ddStatus && <span className={`text-[10px] font-black tracking-widest ${ddStatus.includes("✓") ? "text-green-500" : ddStatus === "FAILED" ? "text-red-500" : "text-amber-500"}`}>{ddStatus}</span>}
              </div>
              <div className="card flex gap-2 p-2 relative overflow-hidden">
                <input type="number" placeholder="Hrs" className="flex-1 bg-[#111] rounded-lg p-3 text-center text-sm font-black outline-none border border-transparent focus:border-[#333]" value={ddHours} onChange={e => setDdHours(e.target.value)} />
                <input type="number" placeholder="$ Rev" className="flex-1 bg-[#111] rounded-lg p-3 text-center text-sm font-black outline-none border border-transparent focus:border-[#333]" value={ddRevenue} onChange={e => setDdRevenue(e.target.value)} />
                <button onClick={submitDoorDash} disabled={!!ddStatus} className="w-12 flex items-center justify-center rounded-lg bg-amber-500 text-black font-black active:scale-95 transition-all text-xl disabled:opacity-50">+</button>
              </div>
            </div>

          </>
        )}

        {/* Build stamp — always know which deploy you're looking at */}
        <div className="text-center text-[10px] text-zinc-600 py-4 select-all">
          build {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || "local"} · {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_MESSAGE?.slice(0, 40) || "dev"}
        </div>
      </div>
    </main>
  );
}
