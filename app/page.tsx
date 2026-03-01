"use client";

import { useEffect, useState } from "react";
import { getDayType, isSacredDay } from "@/lib/dayType";
import { getDailyLog, saveDailyLog, DailyLog, getStoreValue } from "@/lib/db";
import { getSobrietyStreak } from "@/lib/streaks";
import { SINGLES } from "@/lib/releases";

// Week number calculated from MAKE MODE start
function getMakeModeWeek(): number {
  const start = Date.UTC(2026, 1, 20); // Feb 20 2026
  const now = Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
  const days = Math.floor((now - start) / (1000 * 60 * 60 * 24));
  return Math.min(Math.max(Math.ceil(days / 7), 1), 5);
}

// Day-specific protocol copy
function getProtocolCopy(dayType: string): string {
  if (dayType === "STUDIO + SAUNA DAY") return "10 AM → DAW. 1 PM → Sauna. Compound.";
  if (dayType === "STUDIO DAY") return "10 AM → DAW. Execute the cycle.";
  if (dayType === "BIZ DAY") return "Engine is Track 1. Pipeline moves today.";
  return "";
}

// Cycle status labels
const CYCLE_STATUS_LABELS: Record<string, string> = {
  recording: "REC",
  mixing: "MIX",
  resting: "REST",
  done: "DONE",
  add: "–",
};

const CYCLE_TRACKS = [
  { label: "RECONNECT", key: "cycle_reconnect" },
  { label: "WANT U 2",  key: "cycle_wantu2" },
  { label: "WORTH IT",  key: "cycle_worthit" },
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

      // Find which track is currently in RECORDING phase
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

  const now = new Date();
  const nextRelease = SINGLES.find(s => new Date(s.releaseDate) >= now) || SINGLES[SINGLES.length - 1];
  const daysUntilRelease = Math.max(
    Math.ceil((new Date(nextRelease.releaseDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
    0
  );

  return (
    <main className="page animate-fade-in">
      <div className="page-inner">

        {/* ── Header ── */}
        <header className="mb-10 text-center">
          <p className="text-[10px] font-black tracking-[0.2em] text-[#444] uppercase mb-1">
            MAKE MODE &middot; Week {week} of 5
          </p>
          <p className="text-xs font-bold tracking-widest text-[#666] uppercase">{dateStr}</p>
        </header>

        {isSacred ? (
          /* ── Sacred View ── */
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
            <div className="flex border border-[#2a2a2a] rounded-2xl overflow-hidden mb-10 bg-[#0f0f0f]">
              {/* Streak */}
              <div className="flex-1 flex flex-col items-center justify-center py-5 border-r border-[#2a2a2a]">
                <p className="text-[9px] font-black tracking-[0.18em] text-[#555] uppercase mb-2">Streak</p>
                <p className="text-4xl font-black leading-none text-amber-400 animate-count-up">
                  {streak}
                </p>
                <p className="text-[9px] text-[#555] mt-1 font-bold">days 💎</p>
              </div>

              {/* Release */}
              <div className="flex-1 flex flex-col items-center justify-center py-5 border-r border-[#2a2a2a]">
                <p className="text-[9px] font-black tracking-[0.18em] text-[#555] uppercase mb-2">Release</p>
                <p className="text-4xl font-black leading-none text-white animate-count-up">
                  {daysUntilRelease}
                </p>
                <p className="text-[9px] text-[#555] mt-1 font-bold truncate px-1 max-w-full text-center">
                  {nextRelease.title.toUpperCase()}
                </p>
              </div>

              {/* Cycle */}
              <div className="flex-1 flex flex-col items-center justify-center py-5">
                <p className="text-[9px] font-black tracking-[0.18em] text-[#555] uppercase mb-2">Cycle</p>
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse-glow mb-2" />
                <p className="text-[9px] text-[#666] font-bold text-center px-1 leading-tight">
                  {activeTrack}
                </p>
              </div>
            </div>

            {/* ── Day Declaration ── */}
            <div className="text-center">
              <h3 className="text-base font-black tracking-widest uppercase text-white mb-2">
                {dayType}
              </h3>
              <p className="text-sm text-[#666] font-medium">
                {getProtocolCopy(dayType)}
              </p>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
