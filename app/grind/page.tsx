"use client";

// app/grind/page.tsx — RECOVERY & PERFORMANCE
// Stripped of duplicate logging (sovereignty stack, sleep, pushups, journal — all on Today page).
// This page is now the "I'm depleted, what do I do?" emergency reference:
//   - Sobriety streak (large, motivational)
//   - Performance Conditioning type selector + minutes
//   - Recovery Protocol checklist
//
// v24 redesign (Apr 12, 2026): removed duplicate morning logging, kept conditioning + recovery.

import { useEffect, useState } from "react";
import { getDailyLog, saveDailyLog, DailyLog } from "@/lib/db";
import { getSobrietyStreak } from "@/lib/streaks";
import { getDayType, isStudioDay } from "@/lib/dayType";
import { useCloudSync } from "@/lib/useCloudSync";
import CheckItem from "@/components/CheckItem";

export default function GrindPage() {
  const [log, setLog] = useState<DailyLog | null>(null);
  const [streak, setStreak] = useState<number>(0);
  const [dayType, setDayType] = useState<string>("");
  const { syncStatus, sync: handleSync } = useCloudSync();

  useEffect(() => {
    const init = async () => {
      setLog(await getDailyLog());
      setStreak(getSobrietyStreak());
      setDayType(getDayType());
    };
    init();
  }, []);

  const updateLog = async (updates: Partial<DailyLog>) => {
    if (!log) return;
    const updated = { ...log, ...updates };
    setLog(updated);
    await saveDailyLog(updated);
  };

  if (!log) return null;

  return (
    <main className="page animate-fade-in">
      <div className="page-inner">

        {/* Sobriety streak — large + motivational */}
        <div className="text-center mb-10">
          <div className="scoreboard text-amber-400 mb-2 animate-count-up">{streak}</div>
          <div className="text-xs font-bold tracking-widest text-[#888] uppercase">
            Days Sober &middot; since Mar 11, 2026
          </div>
        </div>

        {/* Performance Conditioning */}
        <div className="card mb-6">
          <span className="block text-xs font-bold tracking-widest text-[#888] mb-3">PERFORMANCE CONDITIONING</span>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {[
              { value: "zone2", label: "Zone 2" },
              { value: "vo2max", label: "VO2 Max" },
              { value: "anaerobic", label: "Anaerobic" },
            ].map(p => (
              <button
                key={p.value}
                onClick={() => updateLog({ conditioningType: log.conditioningType === p.value ? "" : p.value })}
                className={`py-2 px-1 rounded-lg text-[10px] font-black tracking-wider border transition-all ${
                  log.conditioningType === p.value
                    ? "bg-amber-500/20 border-amber-500 text-amber-400"
                    : "border-[#333] text-[#666] hover:border-[#555]"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: "dance_walkthrough", label: "Dance (Walk)" },
              { value: "dance_fullout", label: "Dance (Full Out)" },
            ].map(p => (
              <button
                key={p.value}
                onClick={() => updateLog({ conditioningType: log.conditioningType === p.value ? "" : p.value })}
                className={`py-2 px-1 rounded-lg text-[10px] font-black tracking-wider border transition-all ${
                  log.conditioningType === p.value
                    ? "bg-amber-500/20 border-amber-500 text-amber-400"
                    : "border-[#333] text-[#666] hover:border-[#555]"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          {log.conditioningType && (
            <div className="flex items-center gap-3 mt-3 pt-3 border-t border-[#222]">
              <input
                type="number"
                className="num-input w-20 text-center"
                value={log.conditioningMinutes || ""}
                onChange={e => updateLog({ conditioningMinutes: parseInt(e.target.value) || null })}
                placeholder="0"
              />
              <span className="text-xs font-bold text-[#666]">MINUTES</span>
            </div>
          )}
        </div>

        <button
          onClick={() => handleSync(log, dayType)}
          disabled={!!syncStatus && syncStatus !== "FAILED"}
          className="w-full mb-8 py-3 rounded-xl bg-[#1a1a1a] border border-[#333] text-sm font-black tracking-widest hover:bg-[#222] active:scale-95 transition-all outline-none"
          style={{ color: syncStatus === "SYNCED" ? "#22c55e" : syncStatus === "FAILED" ? "#ef4444" : "white" }}
        >
          {syncStatus || "SYNC TO CLOUD"}
        </button>

        {/* Recovery Protocol — the "I'm depleted" emergency sequence */}
        <div className="pb-12">
          <p className="text-[9px] font-black tracking-[0.3em] text-center text-[#555] uppercase mb-2">
            Recovery Protocol
          </p>
          <p className="text-[10px] text-[#444] text-center mb-5">
            When depleted — run this sequence before forcing output.
          </p>
          <div className="card !p-1.5">
            {[
              { icon: "💧", label: "Hydration Reset",    desc: "32oz water + electrolytes. Dehydration mimics exhaustion.", field: "recoveryHydro" as const },
              { icon: "🧘", label: "NSDR / Yoga Nidra",  desc: "10-20min — replenishes dopamine faster than caffeine.",      field: "recoveryNSDR" as const },
              { icon: "📵", label: "Off-Grid Window",     desc: "No social media, no inputs. Let the nervous system reset.",   field: "recoveryOffGrid" as const },
              { icon: "🌬️", label: "Nadi Shodhana",      desc: "Alternate nostril breathing — 5min minimum. Rebalances.",    field: "recoveryBreathwork" as const },
              { icon: "🚶", label: "Movement Reset",      desc: "Walk outside. Sunlight + movement = cortisol regulation.",   field: "recoveryMovement" as const },
              { icon: "🛌", label: "Power Nap",           desc: "20min max. Set alarm. Longer = grogginess.",                 field: "recoveryNap" as const },
            ].map(item => (
              <CheckItem
                key={item.field}
                label={`${item.icon} ${item.label}`}
                description={item.desc}
                checked={!!(log as unknown as Record<string, boolean>)[item.field]}
                onChange={v => updateLog({ [item.field]: v })}
              />
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
