"use client";

import { useState, useEffect } from "react";
import { setStoreValue, getStoreValue, logLabelCost } from "@/lib/db";
import { LABEL_COST_ESTIMATES } from "@/lib/budget";
import { getTrackLabelData, saveTrackLabelData, type SonicProfile } from "@/lib/labelStore";

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
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getStoreValue<SonicReport>(`label_anr:${trackTitle}`).then(v => { if (v) setReport(v); });
    }, [trackTitle]);

    const analyze = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/label/anr", {
                method: "POST",
                body: JSON.stringify({ trackTitle })
            });
            if (!res.ok) {
                const errText = await res.text().catch(() => "Server error");
                throw new Error(`A&R agent error (${res.status}): ${errText.slice(0, 120)}`);
            }
            const data = await res.json();
            if (data.error) throw new Error(data.error);

            setReport(data);
            await setStoreValue(`label_anr:${trackTitle}`, data);

            // Save to shared labelStore for cross-agent access
            const labelData = await getTrackLabelData(trackTitle);
            labelData.sonicProfile = {
              bpm: parseInt(data.bpmRange) || 0,
              key: "—",
              genreBreakdown: {},
              moodTags: [data.energyLevel || "mid"],
              comparableArtists: (data.referenceTracks || []).map((r: any) => `${r.artist} — ${r.title}`),
              pitchAngle: data.sonicPosition || "",
              generatedAt: new Date().toISOString(),
            };
            await saveTrackLabelData(labelData);

            await logLabelCost(LABEL_COST_ESTIMATES.anr_track_analysis);
        } catch (e: any) {
            console.error("A&R agent failed:", e);
            setError(e?.message || "A&R agent failed");
        }
        setLoading(false);
    };

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-5 gap-2">
                <h3 className="text-sm font-black tracking-widest uppercase">🎧 A&R Analyst</h3>
                {report ? (
                    <button onClick={analyze} disabled={loading} className="text-[10px] font-black tracking-widest text-[#555] hover:text-white uppercase disabled:opacity-30 transition-colors">
                        {loading ? "..." : "[RERUN]"}
                    </button>
                ) : null}
            </div>

            {error && (
                <div className="alert-banner alert-banner-red mb-4 animate-slide-up">
                    <span>⚠️</span>
                    <div className="flex-1 text-xs">{error}</div>
                    <button onClick={() => setError(null)} className="text-xs opacity-60 hover:opacity-100">✕</button>
                </div>
            )}

            {!report && !loading && !error && (
                <div className="text-center py-8">
                    <p className="text-[#555] text-sm mb-5 font-medium">No sonic analysis yet.</p>
                    <button onClick={analyze} className="agent-btn agent-btn-primary w-full">
                        🎧 RUN SONIC ANALYSIS
                    </button>
                </div>
            )}

            {loading && !report && (
                <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="card" style={{ opacity: 1 - i * 0.15 }}>
                            <div className="skeleton h-3 w-24 mb-3 rounded" />
                            <div className="skeleton h-8 w-full rounded" />
                        </div>
                    ))}
                    <p className="text-[10px] font-black tracking-widest text-[#555] uppercase text-center mt-4">
                        A&R is analyzing sonic profile…
                    </p>
                </div>
            )}

            {report && (
                <div className="space-y-4">
                    {/* Sonic Position */}
                    <div className="card">
                        <div className="flex gap-2 mb-3 flex-wrap">
                            <span className="badge badge-amber">{report.bpmRange || '—'} BPM</span>
                            <span className="badge badge-green">{(report.energyLevel || 'MID').toUpperCase()} ENERGY</span>
                        </div>
                        <p className="text-[13px] text-[#ccc] leading-relaxed">{report.sonicPosition || '—'}</p>
                    </div>

                    {/* Reference Tracks */}
                    <div className="card">
                        <h4 className="text-[10px] font-black tracking-widest text-[#d4a853] uppercase mb-3">🎧 Reference Tracks</h4>
                        <div className="space-y-2">
                            {(report.referenceTracks || []).map((ref, i) => (
                                <div key={i} className="bg-[#0a0a0a] p-3 rounded-lg border border-[#1a1a1a]">
                                    <p className="font-bold text-white text-sm">{ref.artist} — &ldquo;{ref.title}&rdquo;</p>
                                    <p className="text-[11px] text-[#777] mt-1">{ref.similarity}</p>
                                    <p className="text-[11px] text-[#d4a853]/70 mt-1">Rollout lesson: {ref.rolloutLesson}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sequencing */}
                    <div className="card">
                        <h4 className="text-[10px] font-black tracking-widest text-[#d4a853] uppercase mb-3">📋 Tracklist Position</h4>
                        <p className="text-[13px] text-[#ccc] leading-relaxed">{report.sequencingAdvice || '—'}</p>
                    </div>

                    {/* Honest Assessment */}
                    <div className="card">
                        <h4 className="text-[10px] font-black tracking-widest text-[#d4a853] uppercase mb-3">💀 Honest Assessment</h4>
                        <div className="space-y-2">
                            <div className="bg-green-900/15 p-3 rounded-lg border border-green-500/20">
                                <span className="text-[9px] font-black tracking-widest text-green-500">STRENGTHS</span>
                                <p className="text-[13px] text-[#ccc] mt-1 leading-relaxed">{report.honestAssessment?.strengths || '—'}</p>
                            </div>
                            <div className="bg-red-900/15 p-3 rounded-lg border border-red-500/20">
                                <span className="text-[9px] font-black tracking-widest text-red-500">WEAKNESSES</span>
                                <p className="text-[13px] text-[#ccc] mt-1 leading-relaxed">{report.honestAssessment?.weaknesses || '—'}</p>
                            </div>
                            <div className="bg-amber-900/15 p-3 rounded-lg border border-amber-500/20">
                                <span className="text-[9px] font-black tracking-widest text-amber-500">ACTION ITEMS</span>
                                <p className="text-[13px] text-[#ccc] mt-1 leading-relaxed">{report.honestAssessment?.actionItems || '—'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
