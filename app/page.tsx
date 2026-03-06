"use client";

import { useEffect, useState } from "react";
import { getDayType, isSacredDay, isStudioDay } from "@/lib/dayType";
import { getDailyLog, saveDailyLog, DailyLog, getStoreValue } from "@/lib/db";
import { getSobrietyStreak } from "@/lib/streaks";
import { getDynamicReleases, Release } from "@/lib/releases";
import WeeklyMirror from "@/components/WeeklyMirror";

function getMakeModeWeek(): number {
  const start = Date.UTC(2026, 1, 20);
  const now = Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
  const days = Math.floor((now - start) / (1000 * 60 * 60 * 24));
  return Math.min(Math.max(Math.ceil(days / 7), 1), 5);
}

type ProtocolStep = { icon: string; action: string; tab?: string };

function getProtocolSteps(dayType: string): { tagline: string; steps: ProtocolStep[] } {
  if (dayType === "STUDIO + SAUNA DAY") return {
    tagline: "Create + recover. Both compound.",
    steps: [
      { icon: "☀️", action: "Sovereignty Stack → log below" },
      { icon: "🎹", action: "10 AM → Open DAW, work on cycle track" },
      { icon: "🔥", action: "1 PM → Sauna session" },
      { icon: "📱", action: "Post content from STUDIO queue", tab: "studio" },
    ]
  };
  if (dayType === "STUDIO DAY") return {
    tagline: "Full studio immersion. No distractions.",
    steps: [
      { icon: "☀️", action: "Sovereignty Stack → log below" },
      { icon: "🎹", action: "10 AM → Open DAW, execute the cycle" },
      { icon: "🎙️", action: "Record, mix, or master — move a track forward" },
      { icon: "📱", action: "Post content from STUDIO queue", tab: "studio" },
    ]
  };
  if (dayType === "BIZ DAY") return {
    tagline: "Pipeline moves today. ENGINE is Track 1.",
    steps: [
      { icon: "☀️", action: "Sovereignty Stack → log below" },
      { icon: "⚙️", action: "Check ENGINE for pipeline tasks", tab: "engine" },
      { icon: "📤", action: "Push content to IG/TikTok/YouTube" },
      { icon: "📊", action: "Review STUDIO waterfall — is anything overdue?", tab: "studio" },
      { icon: "🔮", action: "Read today's Oracle decree", tab: "oracle" },
    ]
  };
  return { tagline: "", steps: [] };
}

const CYCLE_TRACKS = [
  { label: "RECONNECT", key: "cycle_reconnect" },
  { label: "WANT U 2", key: "cycle_wantu2" },
  { label: "WORTH IT", key: "cycle_worthit" },
  { label: "JUST SAY SO", key: "cycle_justsayso" },
];

function CheckItem({ label, description, checked, onChange, dimmed }: { label: string, description?: string, checked: boolean, onChange: (v: boolean) => void, dimmed?: boolean }) {
  const [popping, setPopping] = useState(false);
  const handleTap = () => {
    if (!checked) { setPopping(true); setTimeout(() => setPopping(false), 400); }
    onChange(!checked);
  };
  return (
    <div className={`flex items-start gap-3 p-3 active:bg-[#1a1a1a] transition-all cursor-pointer rounded-xl ${dimmed ? 'opacity-30 pointer-events-none' : ''}`} onClick={handleTap}>
      <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 mt-0.5 ${checked ? 'bg-amber-500 border-amber-500' : 'border-[#333]'} ${popping ? 'scale-110' : 'scale-100'}`}>
        {checked && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
      </div>
      <div className="flex-1 flex flex-col justify-center min-h-[24px]">
        <span className={`text-sm font-bold ${checked ? 'text-[#666] line-through' : 'text-white'}`}>{label}</span>
        {description && <span className={`text-[10px] leading-tight font-medium mt-1 ${checked ? 'text-[#555]' : 'text-[#888]'}`}>{description}</span>}
      </div>
    </div>
  );
}

export default function MorningMode() {
  const [log, setLog] = useState<DailyLog | null>(null);
  const [streak, setStreak] = useState<number>(0);
  const [dayType, setDayType] = useState<string>("");
  const [dateStr, setDateStr] = useState<string>("");
  const [isEditingOneThing, setIsEditingOneThing] = useState(false);
  const [oneThingInput, setOneThingInput] = useState("");
  const [activeTrack, setActiveTrack] = useState<string>("–");
  const [week, setWeek] = useState<number>(1);
  const [nextRelease, setNextRelease] = useState<Release | null>(null);
  const [daysUntilRelease, setDaysUntilRelease] = useState<number>(0);

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

      for (const t of CYCLE_TRACKS) {
        if (await getStoreValue<string>(t.key) === "recording") { setActiveTrack(t.label); break; }
      }
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
  };

  const submitDoorDash = async () => {
    if (!ddHours || !ddRevenue) return;
    setDdStatus("Logging...");
    try {
      const res = await fetch("/api/doordash", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: new Date().toISOString().split("T")[0], hours: parseFloat(ddHours), revenue: parseFloat(ddRevenue), gas: 0, tips: 0, miles: 0 })
      });
      if (res.ok) { setDdStatus("V"); setTimeout(() => { setDdStatus(""); setDdHours(""); setDdRevenue(""); }, 2000); }
      else setDdStatus("X");
    } catch { setDdStatus("X"); }
  };

  if (!log) return null;
  const isSacred = isSacredDay(dayType as any);
  const studioDay = isStudioDay(dayType as any);

  return (
    <main className="page animate-fade-in pb-20">
      <div className="page-inner">

        {daysUntilRelease <= 3 && nextRelease && nextRelease.status !== 'live' && (
          <div className="alert-banner alert-banner-red mb-8 !p-3">
            <span className="animate-pulse-glow mr-2">🔴</span>
            <div className="flex-1">
              <span className="font-black text-sm">{nextRelease.title}</span> — {daysUntilRelease === 0 ? "OUT TODAY" : `${daysUntilRelease}d OUT`}
            </div>
          </div>
        )}

        <header className="mb-8 text-center">
          <p className="text-[10px] font-black tracking-[0.2em] text-[#444] uppercase mb-1">MAKE MODE &middot; Wk {week} of 5</p>
          <p className="text-sm font-bold tracking-widest text-[#888] uppercase">{dateStr}</p>
        </header>

        {isSacred ? (
          <div className="text-center mt-12">
            <div className="text-6xl mb-6">🛑</div>
            <h2 className="text-xl font-black mb-2">Sunday is sacred.</h2>
            <p className="text-[#666] text-sm">Zero building.<br />Nadi Shodhana. Rest.<br />The week depends on this.</p>
          </div>
        ) : (
          <>
            {/* ONE THING */}
            <section className="mb-6 card !py-5 text-center" onClick={() => !isEditingOneThing && setIsEditingOneThing(true)}>
              <p className="text-[9px] font-black tracking-[0.2em] text-amber-500 uppercase mb-2">Today's One Thing</p>
              {isEditingOneThing ? (
                <input autoFocus type="text" className="w-full bg-transparent text-xl font-black text-center text-white outline-none placeholder-[#333]"
                  value={oneThingInput} onChange={e => setOneThingInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSaveOneThing()} onBlur={handleSaveOneThing} placeholder="The single move..." />
              ) : (
                <p className={`text-xl font-black leading-tight tracking-tight ${log.oneThing ? 'text-white' : 'text-[#444] italic gap-0'}`}>{log.oneThing || "[ tap to set ]"}</p>
              )}
            </section>

            {/* DASHBOARD KPS */}
            <div className="flex gap-2 mb-6">
              <div className="card flex-1 p-3 text-center">
                <p className="text-[9px] font-black tracking-[0.1em] text-[#555] uppercase">Streak</p>
                <p className="text-2xl font-black text-amber-400 my-1">{streak}</p>
                <p className="text-[9px] text-[#555] font-bold">days 💎</p>
              </div>
              <div className="card flex-1 p-3 text-center">
                <p className="text-[9px] font-black tracking-[0.1em] text-[#555] uppercase">Release</p>
                <p className={`text-2xl font-black my-1 ${daysUntilRelease <= 3 ? 'text-red-400' : 'text-white'}`}>{daysUntilRelease}</p>
                <p className="text-[9px] text-[#555] font-bold truncate px-1">{nextRelease?.title.toUpperCase() ?? "–"}</p>
              </div>
              <div className="card flex-1 p-3 text-center">
                <p className="text-[9px] font-black tracking-[0.1em] text-[#555] uppercase">Cycle</p>
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse-glow mx-auto my-1.5" />
                <p className="text-[8px] text-[#666] font-bold truncate px-1">{activeTrack}</p>
              </div>
            </div>

            {/* WEEKLY MIRROR */}
            <WeeklyMirror />

            {/* PROTOCOL */}
            {(() => {
              const protocol = getProtocolSteps(dayType);
              return protocol.steps.length > 0 && (
                <div className="mb-8">
                  <div className="flex justify-between items-end mb-3 px-1">
                    <h3 className="text-sm font-black tracking-widest uppercase text-white">{dayType}</h3>
                  </div>
                  <div className="card !p-0 overflow-hidden divide-y divide-[#1a1a1a]">
                    {protocol.steps.map((step, i) => (
                      <div key={i} className="flex items-center gap-3 px-4 py-3.5">
                        <span className="text-lg">{step.icon}</span>
                        <span className="text-[12px] font-bold text-[#ccc] leading-snug flex-1">{step.action}</span>
                        {step.tab && <span className="text-[8px] font-black tracking-widest text-amber-500/70 uppercase bg-amber-500/10 px-1.5 py-0.5 rounded">{step.tab}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* QUICK LOGGING (Replaces Grind panel) */}
            <div className="mb-8">
              <h3 className="text-[10px] font-black tracking-[0.2em] text-[#555] uppercase mb-3 px-1">Morning & Grind Logging</h3>
              <div className="card !p-1.5 mb-2">
                <CheckItem label="Sovereignty Stack" description="Trataka, breathwork, mullein tea, cold shower." checked={log.sovereigntyStack} onChange={v => updateLog({ sovereigntyStack: v })} />
                <CheckItem label="Movement (Pre-DAW)" description="Lift, run, or deep stretch — sweat required." checked={log.movement} onChange={v => updateLog({ movement: v })} />
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

              <div className="card p-3">
                <textarea className="w-full bg-transparent outline-none text-sm font-semibold placeholder-[#333] resize-none h-16" placeholder="GRATITUDE / WINS / NOTES..." value={log.journalLine || ""} onChange={e => updateLog({ journalLine: e.target.value })} />
              </div>
            </div>

            {/* DOORDASH QUICK-ADD */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3 px-1">
                <h3 className="text-[10px] font-black tracking-[0.2em] text-[#555] uppercase">DOORDASH LOG</h3>
                {ddStatus && <span className={`text-[10px] font-black tracking-widest ${ddStatus === "V" ? "text-green-500" : ddStatus === "X" ? "text-red-500" : "text-amber-500"}`}>{ddStatus === "V" ? "LOGGED" : ddStatus === "X" ? "FAILED" : ddStatus}</span>}
              </div>
              <div className="card flex gap-2 p-2 relative overflow-hidden">
                <input type="number" placeholder="Hrs" className="flex-1 bg-[#111] rounded-lg p-3 text-center text-sm font-black outline-none border border-transparent focus:border-[#333]" value={ddHours} onChange={e => setDdHours(e.target.value)} />
                <input type="number" placeholder="$ Rev" className="flex-1 bg-[#111] rounded-lg p-3 text-center text-sm font-black outline-none border border-transparent focus:border-[#333]" value={ddRevenue} onChange={e => setDdRevenue(e.target.value)} />
                <button onClick={submitDoorDash} disabled={!!ddStatus} className="w-12 flex items-center justify-center rounded-lg bg-amber-500 text-black font-black active:scale-95 transition-all text-xl disabled:opacity-50">+</button>
              </div>
            </div>

          </>
        )}
      </div>
    </main>
  );
}
