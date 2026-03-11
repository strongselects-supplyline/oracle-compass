"use client";

import { useState, useEffect, useCallback } from "react";
import { getDynamicReleases, updateContentDeliverables, ContentDeliverables } from "@/lib/releases";

const VIDEO_STAGES = {
    primary: ["none", "planned", "shot", "edited", "done"] as const,
    lyric: ["none", "planned", "edited", "done"] as const,
};

const STAGE_LABELS: Record<string, { label: string; color: string }> = {
    none: { label: "NOT STARTED", color: "#555" },
    planned: { label: "PLANNED", color: "#d4a853" },
    shot: { label: "SHOT", color: "#e08a3a" },
    edited: { label: "EDITED", color: "#6ba1e0" },
    done: { label: "DONE", color: "#4ade80" },
};

export default function ContentDept({ trackTitle }: { trackTitle: string }) {
    const [data, setData] = useState<ContentDeliverables | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        getDynamicReleases().then(releases => {
            const r = releases.find(r => r.title === trackTitle);
            if (r?.contentDeliverables) setData(r.contentDeliverables);
        });
    }, [trackTitle]);

    const save = useCallback(async (patch: Partial<ContentDeliverables>) => {
        if (!data) return;
        const merged = { ...data, ...patch };
        setData(merged);
        setSaving(true);
        await updateContentDeliverables(trackTitle, patch);
        setSaving(false);
    }, [data, trackTitle]);

    if (!data) return <div className="text-[#555] text-xs py-8 text-center">Loading…</div>;

    const reelsPct = data.reelsGoal > 0 ? Math.min(100, Math.round((data.reelsPosted / data.reelsGoal) * 100)) : 0;
    const tiktokPct = data.tiktoksGoal > 0 ? Math.min(100, Math.round((data.tiktoksPosted / data.tiktoksGoal) * 100)) : 0;

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div className="flex justify-between items-center mb-5">
                <h3 className="text-sm font-black tracking-widest uppercase">🎬 Content</h3>
                {saving && (
                    <span className="text-[9px] font-black tracking-widest text-[#d4a853] animate-pulse uppercase">
                        SAVING…
                    </span>
                )}
            </div>

            <div className="space-y-4">
                {/* ── THE ONE IDEA ── */}
                <div className="card">
                    <h4 className="text-[10px] font-black tracking-widest text-[#d4a853] uppercase mb-3">
                        💡 The One Visual Idea
                    </h4>
                    <p className="text-[9px] text-[#555] font-bold mb-2 leading-relaxed">
                        What&apos;s the ONE thing that makes someone stop scrolling?
                    </p>
                    <textarea
                        className="w-full bg-[#0a0a0a] border border-[#252525] rounded-xl p-3 text-sm text-white placeholder-[#333] resize-none focus:border-[#d4a853] focus:outline-none transition-colors"
                        rows={3}
                        placeholder="e.g. &quot;Dancing alone in an empty parking garage at 2am under a single flickering light&quot;"
                        value={data.visualIdea}
                        onChange={e => save({ visualIdea: e.target.value })}
                    />
                </div>

                {/* ── VIDEO STATUS ── */}
                <div className="card">
                    <h4 className="text-[10px] font-black tracking-widest text-[#d4a853] uppercase mb-4">
                        🎥 Video Production
                    </h4>
                    <div className="space-y-4">
                        {/* Primary Video */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] font-black tracking-widest text-[#888] uppercase">Primary Video</span>
                                <span
                                    className="text-[9px] font-black tracking-widest uppercase"
                                    style={{ color: STAGE_LABELS[data.primaryVideo]?.color }}
                                >
                                    {STAGE_LABELS[data.primaryVideo]?.label}
                                </span>
                            </div>
                            <div className="flex gap-1">
                                {VIDEO_STAGES.primary.map(stage => (
                                    <button
                                        key={stage}
                                        onClick={() => save({ primaryVideo: stage })}
                                        className={`flex-1 py-2 rounded-lg text-[9px] font-black tracking-wider uppercase transition-all ${
                                            data.primaryVideo === stage
                                                ? "bg-[#d4a853] text-black shadow-lg shadow-[#d4a853]/20"
                                                : "bg-[#1a1a1a] text-[#555] border border-[#252525] hover:border-[#333]"
                                        }`}
                                    >
                                        {STAGE_LABELS[stage]?.label?.slice(0, 4)}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {/* Lyric Video */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] font-black tracking-widest text-[#888] uppercase">Lyric Video</span>
                                <span
                                    className="text-[9px] font-black tracking-widest uppercase"
                                    style={{ color: STAGE_LABELS[data.lyricVideo]?.color }}
                                >
                                    {STAGE_LABELS[data.lyricVideo]?.label}
                                </span>
                            </div>
                            <div className="flex gap-1">
                                {VIDEO_STAGES.lyric.map(stage => (
                                    <button
                                        key={stage}
                                        onClick={() => save({ lyricVideo: stage })}
                                        className={`flex-1 py-2 rounded-lg text-[9px] font-black tracking-wider uppercase transition-all ${
                                            data.lyricVideo === stage
                                                ? "bg-[#d4a853] text-black shadow-lg shadow-[#d4a853]/20"
                                                : "bg-[#1a1a1a] text-[#555] border border-[#252525] hover:border-[#333]"
                                        }`}
                                    >
                                        {STAGE_LABELS[stage]?.label?.slice(0, 4)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── CONTENT VOLUME ── */}
                <div className="card">
                    <h4 className="text-[10px] font-black tracking-widest text-[#d4a853] uppercase mb-4">
                        📊 Content Volume
                    </h4>
                    <div className="space-y-4">
                        {/* Reels */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] font-black tracking-widest text-[#888] uppercase">
                                    IG Reels / Trial Reels
                                </span>
                                <span className="text-[10px] font-black text-white">
                                    {data.reelsPosted} / {data.reelsGoal}
                                </span>
                            </div>
                            {/* Progress bar */}
                            <div className="w-full h-2 bg-[#1a1a1a] rounded-full overflow-hidden mb-2">
                                <div
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{
                                        width: `${reelsPct}%`,
                                        background: reelsPct >= 100 ? "#4ade80" : reelsPct >= 50 ? "#d4a853" : "#e08a3a",
                                    }}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => save({ reelsPosted: Math.max(0, data.reelsPosted - 1) })}
                                    className="w-10 h-10 rounded-xl bg-[#1a1a1a] border border-[#252525] text-[#888] font-black text-lg hover:border-[#555] transition-colors active:scale-95"
                                >
                                    −
                                </button>
                                <span className="flex-1 text-center text-2xl font-black text-white tabular-nums">
                                    {data.reelsPosted}
                                </span>
                                <button
                                    onClick={() => save({ reelsPosted: data.reelsPosted + 1 })}
                                    className="w-10 h-10 rounded-xl bg-[#d4a853] text-black font-black text-lg hover:bg-[#e0b864] transition-colors active:scale-95"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* TikToks */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] font-black tracking-widest text-[#888] uppercase">
                                    TikToks / Shit-Posts
                                </span>
                                <span className="text-[10px] font-black text-white">
                                    {data.tiktoksPosted} / {data.tiktoksGoal}
                                </span>
                            </div>
                            <div className="w-full h-2 bg-[#1a1a1a] rounded-full overflow-hidden mb-2">
                                <div
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{
                                        width: `${tiktokPct}%`,
                                        background: tiktokPct >= 100 ? "#4ade80" : tiktokPct >= 50 ? "#d4a853" : "#e08a3a",
                                    }}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => save({ tiktoksPosted: Math.max(0, data.tiktoksPosted - 1) })}
                                    className="w-10 h-10 rounded-xl bg-[#1a1a1a] border border-[#252525] text-[#888] font-black text-lg hover:border-[#555] transition-colors active:scale-95"
                                >
                                    −
                                </button>
                                <span className="flex-1 text-center text-2xl font-black text-white tabular-nums">
                                    {data.tiktoksPosted}
                                </span>
                                <button
                                    onClick={() => save({ tiktoksPosted: data.tiktoksPosted + 1 })}
                                    className="w-10 h-10 rounded-xl bg-[#d4a853] text-black font-black text-lg hover:bg-[#e0b864] transition-colors active:scale-95"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* B-Roll Clips */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] font-black tracking-widest text-[#888] uppercase">
                                    B-Roll Clips Captured
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => save({ brollClips: Math.max(0, data.brollClips - 1) })}
                                    className="w-10 h-10 rounded-xl bg-[#1a1a1a] border border-[#252525] text-[#888] font-black text-lg hover:border-[#555] transition-colors active:scale-95"
                                >
                                    −
                                </button>
                                <span className="flex-1 text-center text-2xl font-black text-white tabular-nums">
                                    {data.brollClips}
                                </span>
                                <button
                                    onClick={() => save({ brollClips: data.brollClips + 1 })}
                                    className="w-10 h-10 rounded-xl bg-[#d4a853] text-black font-black text-lg hover:bg-[#e0b864] transition-colors active:scale-95"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── PRODUCTION NOTES ── */}
                <div className="card">
                    <h4 className="text-[10px] font-black tracking-widest text-[#d4a853] uppercase mb-3">
                        📝 Production Notes
                    </h4>
                    <textarea
                        className="w-full bg-[#0a0a0a] border border-[#252525] rounded-xl p-3 text-sm text-[#ccc] placeholder-[#333] resize-none focus:border-[#d4a853] focus:outline-none transition-colors"
                        rows={3}
                        placeholder="Locations, collaborators, gear needed, shot list ideas…"
                        value={data.notes}
                        onChange={e => save({ notes: e.target.value })}
                    />
                </div>
            </div>
        </div>
    );
}
