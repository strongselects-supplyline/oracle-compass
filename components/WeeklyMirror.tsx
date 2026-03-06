"use client";

import { useEffect, useState } from "react";

interface DaySummary {
    date: string;
    ddHours: number | null;
    winCount: number | null;
    hasSovereignty: boolean | null;
    logged: boolean;
}

interface WeeklySummary {
    days: DaySummary[];
    totalDDHours: number;
    sovereignDays: number;
    loggedDays: number;
    sovereignRate: number | null;
}

const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function getDayLabel(dateStr: string): string {
    const d = new Date(dateStr + "T12:00:00"); // avoid timezone shift
    return DAY_LABELS[d.getDay()];
}

function HoursBar({ ddHours, maxHours }: { ddHours: number | null; maxHours: number }) {
    const pct = ddHours && maxHours > 0 ? Math.min((ddHours / maxHours) * 100, 100) : 0;
    return (
        <div className="w-full bg-[#1a1a1a] rounded-full h-1.5 mt-1">
            <div
                className="h-1.5 rounded-full bg-amber-500/70 transition-all duration-500"
                style={{ width: `${pct}%` }}
            />
        </div>
    );
}

export default function WeeklyMirror() {
    const [data, setData] = useState<WeeklySummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        fetch("/api/weekly-summary")
            .then(r => r.json())
            .then(d => { setData(d); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return null;
    if (!data) return null;

    if (!data.days || !Array.isArray(data.days)) {
        return (
            <div className="mb-8 border border-red-900/30 bg-[#0f0f0f] p-4 rounded-xl text-center">
                <p className="text-red-500 text-xs font-bold tracking-widest uppercase">Mirror Sync Failed</p>
                <p className="text-[#666] text-xs mt-1">Check Vercel logs or Google Sheets API.</p>
            </div>
        );
    }

    const maxDD = Math.max(...data.days.map(d => d.ddHours ?? 0), 1);
    const sovereignRate = data.sovereignRate;
    const rateColor =
        sovereignRate === null ? "text-[#555]" :
            sovereignRate >= 80 ? "text-green-400" :
                sovereignRate >= 50 ? "text-amber-400" :
                    "text-red-400";

    return (
        <div className="mb-8">
            {/* Collapsed header — always visible */}
            <button
                className="w-full flex items-center justify-between px-1 mb-3"
                onClick={() => setIsOpen(v => !v)}
            >
                <h3 className="text-[10px] font-black tracking-[0.2em] text-[#555] uppercase">
                    7-Day Mirror
                </h3>
                <div className="flex items-center gap-3">
                    <span className={`text-[11px] font-black ${rateColor}`}>
                        {sovereignRate !== null ? `${sovereignRate}% Sovereign` : "—"}
                    </span>
                    <span className="text-[#555] text-xs transition-transform duration-200" style={{ display: "inline-block", transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}>›</span>
                </div>
            </button>

            {/* Expanded view */}
            {isOpen && (
                <div className="card !p-4 animate-fade-in">

                    {/* Stat chips */}
                    <div className="flex gap-2 mb-5">
                        <div className="flex-1 bg-[#111] rounded-xl p-3 text-center">
                            <p className="text-[9px] font-black tracking-[0.1em] text-[#555] uppercase mb-1">Sovereign</p>
                            <p className={`text-xl font-black ${rateColor}`}>
                                {sovereignRate !== null ? `${sovereignRate}%` : "—"}
                            </p>
                            <p className="text-[9px] text-[#444] font-bold">{data.sovereignDays}/{data.loggedDays} days</p>
                        </div>
                        <div className="flex-1 bg-[#111] rounded-xl p-3 text-center">
                            <p className="text-[9px] font-black tracking-[0.1em] text-[#555] uppercase mb-1">DD Hours</p>
                            <p className="text-xl font-black text-amber-400">{data.totalDDHours}h</p>
                            <p className="text-[9px] text-[#444] font-bold">this week</p>
                        </div>
                    </div>

                    {/* Per-day bars */}
                    <div className="grid grid-cols-7 gap-1.5">
                        {data.days.map((day) => {
                            const label = getDayLabel(day.date);
                            const sovereign = day.hasSovereignty;
                            const noData = !day.logged;
                            return (
                                <div key={day.date} className="flex flex-col items-center gap-1">
                                    {/* Sovereignty dot */}
                                    <div
                                        className={`w-3.5 h-3.5 rounded-full border-2 transition-all ${noData
                                            ? "border-[#222] bg-transparent"
                                            : sovereign
                                                ? "border-amber-500 bg-amber-500"
                                                : "border-red-500/60 bg-transparent"
                                            }`}
                                    />
                                    {/* DD hours bar */}
                                    <div className="w-full flex flex-col items-center gap-0.5">
                                        <div className="w-full h-10 bg-[#1a1a1a] rounded-md relative overflow-hidden">
                                            {day.ddHours !== null && day.ddHours > 0 && (
                                                <div
                                                    className="absolute bottom-0 left-0 right-0 bg-amber-500/40 rounded-md transition-all duration-500"
                                                    style={{ height: `${Math.min((day.ddHours / maxDD) * 100, 100)}%` }}
                                                />
                                            )}
                                        </div>
                                        <span className="text-[9px] font-black text-[#444] uppercase">{label}</span>
                                        {day.ddHours !== null && day.ddHours > 0 && (
                                            <span className="text-[8px] text-amber-500/60 font-bold">{day.ddHours}h</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Legend */}
                    <div className="flex items-center gap-4 mt-4 pt-3 border-t border-[#1a1a1a]">
                        <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                            <span className="text-[9px] text-[#555] font-bold">Sovereignty Stack done</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full border border-red-500/60" />
                            <span className="text-[9px] text-[#555] font-bold">Skipped</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
