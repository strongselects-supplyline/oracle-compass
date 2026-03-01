"use client";

import { useEffect, useState } from "react";
import { getDailyLog, saveDailyLog, DailyLog } from "@/lib/db";
import { getSobrietyStreak } from "@/lib/streaks";
import { getDayType, isStudioDay } from "@/lib/dayType";

export default function GrindPage() {
    const [log, setLog] = useState<DailyLog | null>(null);
    const [streak, setStreak] = useState<number>(0);
    const [dayType, setDayType] = useState<string>("");

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
                        label="Ate before session"
                        checked={log.ateBefore}
                        onChange={(v) => updateLog({ ateBefore: v })}
                    />
                    <CheckItem
                        label="Sauna"
                        checked={log.sauna}
                        onChange={(v) => updateLog({ sauna: v })}
                        dimmed={dayType !== "STUDIO + SAUNA DAY"}
                    />
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

            </div>
        </main>
    );
}

function CheckItem({ label, checked, onChange, dimmed }: { label: string, checked: boolean, onChange: (v: boolean) => void, dimmed?: boolean }) {
    const [popping, setPopping] = useState(false);

    const handleTap = () => {
        if (!checked) {
            setPopping(true);
            setTimeout(() => setPopping(false), 400);
        }
        onChange(!checked);
    };

    return (
        <div
            className={`check-item ${dimmed ? 'opacity-30 pointer-events-none' : ''}`}
            onClick={handleTap}
        >
            <div className={`check-box ${checked ? 'checked' : ''} ${popping ? 'animate-check-pop' : ''}`}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                </svg>
            </div>
            <span className={`text-base font-semibold transition-colors duration-200 ${checked ? 'text-[#555] line-through' : 'text-white'}`}>
                {label}
            </span>
        </div>
    );
}
