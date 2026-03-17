"use client";

import { useEffect, useState } from "react";
import { getDailyLog, saveDailyLog, DailyLog, getTodayISO } from "@/lib/db";
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

    const studioDay = isStudioDay(dayType as any);

    return (
        <main className="page animate-fade-in">
            <div className="page-inner">

                <div className="text-center mb-10">
                    <div className="scoreboard text-amber-400 mb-2 animate-count-up">{streak}</div>
                    <div className="text-xs font-bold tracking-widest text-[#888] uppercase">
                        Days Sober &middot; since Feb 28, 2026
                    </div>
                </div>

                <div className="card mb-6">
                    <CheckItem
                        label="Sovereignty Stack"
                        checked={log.sovereigntyStack}
                        onChange={(v) => updateLog({ sovereigntyStack: v })}
                    />
                    <CheckItem
                        label="Movement (before DAW)"
                        checked={log.movement}
                        onChange={(v) => updateLog({ movement: v })}
                    />
                    <CheckItem
                        label="Eucalyptus Steam"
                        checked={log.eucalyptusStream}
                        onChange={(v) => updateLog({ eucalyptusStream: v })}
                        dimmed={!studioDay}
                    />
                    <CheckItem
                        label="Sauna"
                        checked={log.sauna}
                        onChange={(v) => updateLog({ sauna: v })}
                        dimmed={dayType !== "STUDIO + SAUNA DAY"}
                    />
                </div>

                <div className="card mb-6">
                    <span className="block text-xs font-bold tracking-widest text-[#888] mb-3">PERFORMANCE CONDITIONING</span>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                        {[
                            { value: 'zone2', label: 'Zone 2' },
                            { value: 'vo2max', label: 'VO2 Max' },
                            { value: 'anaerobic', label: 'Anaerobic' },
                        ].map((p) => (
                            <button
                                key={p.value}
                                onClick={() => updateLog({ conditioningType: log.conditioningType === p.value ? '' : p.value })}
                                className={`py-2 px-1 rounded-lg text-[10px] font-black tracking-wider border transition-all ${
                                    log.conditioningType === p.value
                                        ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                                        : 'border-[#333] text-[#666] hover:border-[#555]'
                                }`}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {[
                            { value: 'dance_walkthrough', label: 'Dance (Walk)' },
                            { value: 'dance_fullout', label: 'Dance (Full Out)' },
                        ].map((p) => (
                            <button
                                key={p.value}
                                onClick={() => updateLog({ conditioningType: log.conditioningType === p.value ? '' : p.value })}
                                className={`py-2 px-1 rounded-lg text-[10px] font-black tracking-wider border transition-all ${
                                    log.conditioningType === p.value
                                        ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                                        : 'border-[#333] text-[#666] hover:border-[#555]'
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
                                value={log.conditioningMinutes || ''}
                                onChange={(e) => updateLog({ conditioningMinutes: parseInt(e.target.value) || null })}
                                placeholder="0"
                            />
                            <span className="text-xs font-bold text-[#666]">MINUTES</span>
                        </div>
                    )}
                </div>

                <div className="flex gap-4 mb-6">
                    <div className="card flex-1 flex flex-col items-center">
                        <span className="text-xs font-bold tracking-widest text-[#888] mb-3">SLEEP (HRS)</span>
                        <input
                            type="number"
                            className="num-input"
                            value={log.sleep || ""}
                            onChange={(e) => updateLog({ sleep: parseFloat(e.target.value) || null })}
                            placeholder="0"
                        />
                    </div>
                    <div className="card flex-1 flex flex-col items-center">
                        <span className="text-xs font-bold tracking-widest text-[#888] mb-3">PUSHUPS</span>
                        <input
                            type="number"
                            className="num-input"
                            value={log.pushups || ""}
                            onChange={(e) => updateLog({ pushups: parseInt(e.target.value) || null })}
                            placeholder="0"
                        />
                    </div>
                </div>

                <div className="card">
                    <span className="block text-xs font-bold tracking-widest text-[#888] mb-3">JOURNAL</span>
                    <textarea
                        className="oracle-input resize-none h-24 text-sm"
                        placeholder="3 wins, 1 to improve, tomorrow's 1 thing"
                        value={log.journalLine || ""}
                        onChange={(e) => updateLog({ journalLine: e.target.value })}
                    />
                </div>

                <button
                    onClick={() => handleSync(log, dayType)}
                    disabled={!!syncStatus && syncStatus !== 'FAILED'}
                    className="w-full mt-6 py-4 rounded-xl bg-[#1a1a1a] border border-[#333] text-sm font-black tracking-widest hover:bg-[#222] active:scale-95 transition-all outline-none"
                    style={{ color: syncStatus === 'SYNCED' ? '#22c55e' : syncStatus === 'FAILED' ? '#ef4444' : 'white' }}
                >
                    {syncStatus || "SYNC TO CLOUD"}
                </button>

            </div>
        </main>
    );
}

