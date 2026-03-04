"use client";

import { useState } from "react";
import { setStoreValue, getStoreValue, logLabelCost } from "@/lib/db";
import { LABEL_COST_ESTIMATES } from "@/lib/budget";

type SonicReport = {
    sonicPosition: string;
    bpmRange: string;
    energyLevel: string;
    referenceTracks: { artist: string; title: string; similarity: string; rolloutLesson: string }[];
    sequencingAdvice: string;
    honestAssessment: { strengths: string; weaknesses: string; actionItems: string };
};

export default function ANRPanel({ trackTitle }: { trackTitle: string }) {
    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState<SonicReport | null>(null);

    const analyze = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/label/anr", {
                method: "POST",
                body: JSON.stringify({ trackTitle })
            });
            const data = await res.json();
            if (data.error) { alert(data.error); setLoading(false); return; }

            setReport(data);
            await setStoreValue(`label_anr:${trackTitle}`, data);
            await logLabelCost(LABEL_COST_ESTIMATES.anr_track_analysis);
        } catch (e) {
            console.error(e);
            alert("A&R agent failed.");
        }
        setLoading(false);
    };

    useState(() => {
        getStoreValue<SonicReport>(`label_anr:${trackTitle}`).then(v => { if (v) setReport(v); });
    });

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">A&R / SONIC ANALYST</h3>
                <button
                    onClick={analyze}
                    disabled={loading}
                    className="text-xs font-bold tracking-widest text-amber-500 hover:text-white uppercase disabled:opacity-50 transition-colors"
                >
                    {loading ? "ANALYZING..." : "[RUN SONIC ANALYSIS]"}
                </button>
            </div>

            {!report && !loading && (
                <div className="text-center py-12 text-[#555] text-sm font-bold tracking-widest uppercase bg-[#0a0a0a] rounded border border-[#1a1a1a]">
                    No sonic analysis yet
                </div>
            )}

            {report && (
                <div className="space-y-6">
                    {/* Sonic Position */}
                    <div className="card">
                        <div className="flex gap-4 mb-4">
                            <span className="badge badge-amber">{report.bpmRange} BPM</span>
                            <span className="badge badge-green">{report.energyLevel.toUpperCase()} ENERGY</span>
                        </div>
                        <p className="text-sm text-[#ccc] leading-relaxed">{report.sonicPosition}</p>
                    </div>

                    {/* Reference Tracks */}
                    <div className="card">
                        <h4 className="text-sm font-bold tracking-widest text-amber-500 uppercase mb-4">🎧 REFERENCE TRACKS</h4>
                        <div className="space-y-3">
                            {report.referenceTracks.map((ref, i) => (
                                <div key={i} className="bg-[#0a0a0a] p-3 rounded border border-[#1a1a1a]">
                                    <p className="font-bold text-white">{ref.artist} — &ldquo;{ref.title}&rdquo;</p>
                                    <p className="text-xs text-[#888] mt-1">{ref.similarity}</p>
                                    <p className="text-xs text-amber-500/80 mt-1">Rollout lesson: {ref.rolloutLesson}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sequencing */}
                    <div className="card">
                        <h4 className="text-sm font-bold tracking-widest text-amber-500 uppercase mb-4">📋 TRACKLIST POSITION</h4>
                        <p className="text-sm text-[#ccc] leading-relaxed">{report.sequencingAdvice}</p>
                    </div>

                    {/* Honest Assessment */}
                    <div className="card">
                        <h4 className="text-sm font-bold tracking-widest text-amber-500 uppercase mb-4">💀 HONEST ASSESSMENT</h4>
                        <div className="space-y-3">
                            <div className="bg-green-900/20 p-3 rounded border border-green-500/30">
                                <span className="text-xs font-bold tracking-widest text-green-500">STRENGTHS</span>
                                <p className="text-sm text-[#ccc] mt-1">{report.honestAssessment.strengths}</p>
                            </div>
                            <div className="bg-red-900/20 p-3 rounded border border-red-500/30">
                                <span className="text-xs font-bold tracking-widest text-red-500">WEAKNESSES</span>
                                <p className="text-sm text-[#ccc] mt-1">{report.honestAssessment.weaknesses}</p>
                            </div>
                            <div className="bg-amber-900/20 p-3 rounded border border-amber-500/30">
                                <span className="text-xs font-bold tracking-widest text-amber-500">ACTION ITEMS</span>
                                <p className="text-sm text-[#ccc] mt-1">{report.honestAssessment.actionItems}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
