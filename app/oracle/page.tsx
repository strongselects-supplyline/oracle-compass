"use client";

import { useEffect, useState } from "react";
import { getStoreValue, getTodayISO } from "@/lib/db";
import type { OracleDecree } from "@/lib/oracle";

export default function OraclePage() {
    const [decree, setDecree] = useState<OracleDecree | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getStoreValue<OracleDecree>(`oracle_decree:${getTodayISO()}`).then(d => {
            setDecree(d);
            setLoading(false);
        });
    }, []);

    const severityColor =
        decree?.severity === "GREEN" ? "text-green-400" :
            decree?.severity === "AMBER" ? "text-amber-400" :
                decree?.severity === "RED" ? "text-red-400" : "text-[#555]";

    const severityBorder =
        decree?.severity === "GREEN" ? "border-green-900/40" :
            decree?.severity === "AMBER" ? "border-amber-900/40" :
                decree?.severity === "RED" ? "border-red-900/40" : "border-[#2a2a2a]";

    return (
        <main className="page animate-fade-in">
            <div className="page-inner">

                <header className="mb-10">
                    <h1 className="text-4xl font-black tracking-tight mb-1">🔮 Oracle</h1>
                    <p className="text-[#555] text-xs font-bold tracking-widest uppercase">
                        Daily decree — {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                    </p>
                </header>

                {loading ? (
                    <div className="text-center py-20">
                        <p className="text-[#444] text-sm animate-pulse">Reading the signal...</p>
                    </div>
                ) : decree ? (
                    <>
                        {/* Severity Badge */}
                        <div className="text-center mb-8">
                            <span className={`text-[11px] font-black tracking-[0.2em] uppercase ${severityColor}`}>
                                {decree.severity}
                            </span>
                        </div>

                        {/* Oracle Message */}
                        <div className={`border ${severityBorder} rounded-2xl p-6 mb-10 bg-[#0f0f0f]`}>
                            <p className="text-xl font-black leading-snug tracking-tight text-white text-center">
                                {decree.oracle_message}
                            </p>
                        </div>

                        {/* Assessment */}
                        <section className="mb-10">
                            <p className="text-[10px] font-black tracking-[0.2em] text-[#555] uppercase mb-3">Assessment</p>
                            <p className="text-sm text-[#888] leading-relaxed font-medium">
                                {decree.assessment}
                            </p>
                        </section>

                        {/* Realignments */}
                        {decree.realignments.length > 0 && decree.realignments[0].type !== "no_change" && (
                            <section className="mb-10">
                                <p className="text-[10px] font-black tracking-[0.2em] text-[#555] uppercase mb-4">Realignments</p>
                                <div className="space-y-3">
                                    {decree.realignments.map((r, i) => {
                                        if (r.type === "no_change") return null;
                                        const label =
                                            r.type === "shift_release" ? `📅 ${r.target} shifted ${r.days > 0 ? "+" : ""}${r.days} days` :
                                                r.type === "update_cycle_status" ? `🎵 ${r.track} → ${r.new_status}` :
                                                    r.type === "set_focus_requirement" ? `⏱️ Focus: ${r.hours}h required` : "";
                                        const reason = "reason" in r ? r.reason : "";
                                        return (
                                            <div key={i} className="border border-[#2a2a2a] rounded-xl p-4 bg-[#0f0f0f]">
                                                <p className="text-sm font-bold text-white mb-1">{label}</p>
                                                <p className="text-xs text-[#666] font-medium">{reason}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        )}
                    </>
                ) : (
                    <div className="text-center py-16">
                        <div className="text-5xl mb-6">🌑</div>
                        <h2 className="text-xl font-black mb-2 tracking-tight">No decree today.</h2>
                        <p className="text-[#555] text-sm leading-relaxed font-medium">
                            The Oracle fires automatically on first app open each day.<br />
                            Check back after your next session.
                        </p>
                    </div>
                )}

            </div>
        </main>
    );
}
