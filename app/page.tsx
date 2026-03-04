"use client";

import { useEffect, useState } from "react";
import { getDayType, isSacredDay } from "@/lib/dayType";
import { getDailyLog, saveDailyLog, DailyLog, getStoreValue } from "@/lib/db";
import { getSobrietyStreak } from "@/lib/streaks";
import { getDynamicReleases, Release } from "@/lib/releases";

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
      { icon: "☀️", action: "Sovereignty Stack → log in GRIND", tab: "grind" },
      { icon: "🎹", action: "10 AM → Open DAW, work on cycle track" },
      { icon: "🔥", action: "1 PM → Sauna session" },
      { icon: "📱", action: "Post content from STUDIO queue", tab: "studio" },
      { icon: "✅", action: "Log session + check off GRIND before bed", tab: "grind" },
    ]
  };
  if (dayType === "STUDIO DAY") return {
    tagline: "Full studio immersion. No distractions.",
    steps: [
      { icon: "☀️", action: "Sovereignty Stack → log in GRIND", tab: "grind" },
      { icon: "🎹", action: "10 AM → Open DAW, execute the cycle" },
      { icon: "🎙️", action: "Record, mix, or master — move a track forward" },
      { icon: "📱", action: "Post content from STUDIO queue", tab: "studio" },
      { icon: "✅", action: "Log session in GRIND before bed", tab: "grind" },
    ]
  };
  if (dayType === "BIZ DAY") return {
    tagline: "Pipeline moves today. ENGINE is Track 1.",
    steps: [
      { icon: "☀️", action: "Sovereignty Stack → log in GRIND", tab: "grind" },
      { icon: "⚙️", action: "Check ENGINE for pipeline tasks", tab: "engine" },
      { icon: "📤", action: "Push content to IG/TikTok/YouTube" },
      { icon: "📊", action: "Review STUDIO waterfall — is anything overdue?", tab: "studio" },
      { icon: "🔮", action: "Read today's Oracle decree", tab: "oracle" },
      { icon: "✅", action: "Log day in GRIND before bed", tab: "grind" },
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

      // Dynamic releases — reflects any Oracle realignments
      const releases = await getDynamicReleases();
      const now = new Date();
      const next = releases.find(s => new Date(s.releaseDate) >= now) || releases[releases.length - 1];
      setNextRelease(next);
      setDaysUntilRelease(Math.max(
        Math.ceil((new Date(next.releaseDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
        0
      ));

      for (const t of CYCLE_TRACKS) {
        const status = await getStoreValue<string>(t.key);
        if (status === "recording") {
          setActiveTrack(t.label);
          break;
        }
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

  if (!log) return null;

  const isSacred = isSacredDay(dayType as any);

  return (
    <main className="page animate-fade-in">
      <div className="page-inner">

        {/* ── Urgency Banner (shows when release ≤3 days out) ── */}
        {daysUntilRelease <= 3 && nextRelease && nextRelease.status !== 'live' && (
          <div className="alert-banner alert-banner-red mb-8 animate-slide-up">
            <span className="animate-pulse-glow">🔴</span>
            <div className="flex-1">
              <span className="font-black tracking-wider">{nextRelease.title}</span>
              {" — "}
              {daysUntilRelease === 0 ? "RELEASES TODAY" : `${daysUntilRelease} DAY${daysUntilRelease === 1 ? "" : "S"} OUT`}
              <span className="block text-xs opacity-70 mt-0.5 font-medium">Check Label → Compliance before anything else</span>
            </div>
          </div>
        )}

        <header className="mb-10 text-center">
          <p className="text-[10px] font-black tracking-[0.2em] text-[#444] uppercase mb-1">
            MAKE MODE &middot; Week {week} of 5
          </p>
          <p className="text-xs font-bold tracking-widest text-[#666] uppercase">{dateStr}</p>
        </header>

        {isSacred ? (
          <div className="text-center mt-8 animate-fade-in">
            <div className="text-7xl mb-8 leading-none">🛑</div>
            <h2 className="text-2xl font-black mb-3 tracking-tight">Sunday is sacred.</h2>
            <p className="text-[#666] text-base leading-relaxed">
              Zero building.<br />
              Nadi Shodhana. Rest.<br />
              The week depends on this.
            </p>
          </div>
        ) : (
          <>
            {/* ── One Thing ── */}
            <section className="mb-10" onClick={() => !isEditingOneThing && setIsEditingOneThing(true)}>
              <p className="text-[10px] font-black tracking-[0.2em] text-amber-500 text-center mb-4 uppercase">
                Today's One Thing
              </p>
              {isEditingOneThing ? (
                <div className="animate-slide-up">
                  <input
                    autoFocus
                    type="text"
                    className="oracle-input text-xl font-bold text-center"
                    value={oneThingInput}
                    onChange={e => setOneThingInput(e.target.value)}
                    placeholder="The single move..."
                    onKeyDown={e => e.key === "Enter" && handleSaveOneThing()}
                    onBlur={handleSaveOneThing}
                  />
                </div>
              ) : (
                <div className="min-h-[3.5rem] flex justify-center items-center cursor-pointer">
                  {log.oneThing ? (
                    <p className="text-2xl font-black leading-tight text-center tracking-tight">
                      {log.oneThing}
                    </p>
                  ) : (
                    <p className="text-lg text-[#3a3a3a] italic">[ tap to set ]</p>
                  )}
                </div>
              )}
            </section>

            {/* ── Scoreboard Strip ── */}
            <div className="flex border border-[#252525] rounded-2xl overflow-hidden mb-10 bg-[#0d0d0d]">
              <div className="flex-1 flex flex-col items-center justify-center py-5 border-r border-[#252525]">
                <p className="text-[9px] font-black tracking-[0.18em] text-[#555] uppercase mb-2">Streak</p>
                <p className="text-4xl font-black leading-none text-amber-400 animate-count-up">{streak}</p>
                <p className="text-[9px] text-[#555] mt-1 font-bold">days 💎</p>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center py-5 border-r border-[#252525]">
                <p className="text-[9px] font-black tracking-[0.18em] text-[#555] uppercase mb-2">Release</p>
                <p className={`text-4xl font-black leading-none animate-count-up ${daysUntilRelease <= 3 ? 'text-red-400' : 'text-white'}`}>
                  {daysUntilRelease}
                </p>
                <p className="text-[9px] text-[#555] mt-1 font-bold truncate px-1 max-w-full text-center">
                  {nextRelease?.title.toUpperCase() ?? "–"}
                </p>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center py-5">
                <p className="text-[9px] font-black tracking-[0.18em] text-[#555] uppercase mb-2">Cycle</p>
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse-glow mb-2" />
                <p className="text-[9px] text-[#666] font-bold text-center px-1 leading-tight">{activeTrack}</p>
              </div>
            </div>

            {/* ── Today's Protocol ── */}
            {(() => {
              const protocol = getProtocolSteps(dayType);
              return (
                <div>
                  <div className="text-center mb-5">
                    <h3 className="text-base font-black tracking-widest uppercase text-white mb-1">{dayType}</h3>
                    <p className="text-xs text-[#555] font-semibold">{protocol.tagline}</p>
                  </div>
                  {protocol.steps.length > 0 && (
                    <div className="border border-[#252525] rounded-2xl bg-[#0d0d0d] overflow-hidden">
                      {protocol.steps.map((step, i) => (
                        <div key={i} className="flex items-center gap-3 px-5 py-4 border-b border-[#1a1a1a] last:border-0 active:bg-[#1a1a1a] transition-colors">
                          <span className="text-xl flex-shrink-0">{step.icon}</span>
                          <span className="text-[13px] font-semibold text-[#ccc] leading-snug flex-1">{step.action}</span>
                          {step.tab && (
                            <span className="text-[9px] font-black tracking-[0.15em] text-amber-500/70 uppercase flex-shrink-0 bg-amber-500/10 px-2 py-1 rounded-md">
                              {step.tab}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}
          </>
        )}
      </div>
    </main>
  );
}
