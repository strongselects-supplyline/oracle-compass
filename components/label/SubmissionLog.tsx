"use client";

import { useState, useEffect } from "react";
import { getAllWithPrefix, setStoreValue, getTodayISO } from "@/lib/db";

export type Submission = {
    trackTitle: string;
    platform: string;
    status: "pending" | "submitted" | "accepted" | "rejected";
    submittedDate: string | null;
    responseDate: string | null;
    notes: string;
};

const PLATFORMS = [
    { id: "spotify_editorial", label: "Spotify Editorial", emoji: "🟢" },
    { id: "groover", label: "Groover", emoji: "🎧" },
    { id: "submithub", label: "SubmitHub", emoji: "📬" },
    { id: "ig_post", label: "IG Post", emoji: "📸" },
    { id: "tiktok", label: "TikTok", emoji: "🎵" },
    { id: "yt_shorts", label: "YT Shorts", emoji: "▶️" },
];

const STATUS_CONFIG = {
    pending: { label: "NOT SENT", color: "text-[#555]", bg: "bg-[#1a1a1a]", border: "border-[#252525]" },
    submitted: { label: "SENT", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    accepted: { label: "PLACED", color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
    rejected: { label: "PASSED", color: "text-[#666]", bg: "bg-[#111]", border: "border-[#1a1a1a]" },
};

function getSubmissionKey(trackTitle: string, platformId: string): string {
    return `submissions:${trackTitle}:${platformId}`;
}

export default function SubmissionLog({ trackTitle }: { trackTitle: string }) {
    const [subs, setSubs] = useState<Record<string, Submission>>({});
    const [loading, setLoading] = useState(true);

    const loadSubs = async () => {
        const data = await getAllWithPrefix<Submission>(`submissions:${trackTitle}:`);
        setSubs(data);
        setLoading(false);
    };

    useEffect(() => {
        loadSubs();
    }, [trackTitle]);

    const cyclePlatformStatus = async (platformId: string) => {
        const key = getSubmissionKey(trackTitle, platformId);
        const current = subs[key];
        const statusOrder: Submission["status"][] = ["pending", "submitted", "accepted", "rejected"];

        const currentStatus = current?.status || "pending";
        const nextIdx = (statusOrder.indexOf(currentStatus) + 1) % statusOrder.length;
        const nextStatus = statusOrder[nextIdx];

        const updated: Submission = {
            trackTitle,
            platform: platformId,
            status: nextStatus,
            submittedDate: nextStatus === "submitted" ? getTodayISO() : (current?.submittedDate || null),
            responseDate: (nextStatus === "accepted" || nextStatus === "rejected") ? getTodayISO() : null,
            notes: current?.notes || "",
        };

        await setStoreValue(key, updated);
        setSubs(prev => ({ ...prev, [key]: updated }));
    };

    if (loading) return null;

    // Count stats
    const total = PLATFORMS.length;
    const submitted = PLATFORMS.filter(p => {
        const s = subs[getSubmissionKey(trackTitle, p.id)];
        return s && s.status !== "pending";
    }).length;

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-black tracking-widest uppercase">📋 Submissions</h3>
                <span className={`text-[11px] font-black tracking-wider ${submitted === total ? 'text-green-400' : submitted > 0 ? 'text-amber-400' : 'text-[#555]'}`}>
                    {submitted}/{total}
                </span>
            </div>

            <div className="space-y-2">
                {PLATFORMS.map(platform => {
                    const key = getSubmissionKey(trackTitle, platform.id);
                    const sub = subs[key];
                    const status = sub?.status || "pending";
                    const config = STATUS_CONFIG[status];

                    return (
                        <button
                            key={platform.id}
                            onClick={() => cyclePlatformStatus(platform.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all active:scale-[0.98] ${config.bg} ${config.border}`}
                        >
                            <span className="text-lg">{platform.emoji}</span>
                            <span className="text-[12px] font-bold text-[#ccc] flex-1 text-left">{platform.label}</span>
                            <span className={`text-[10px] font-black tracking-widest ${config.color}`}>
                                {config.label}
                            </span>
                            {sub?.submittedDate && status !== "pending" && (
                                <span className="text-[9px] text-[#444] font-bold">{sub.submittedDate.slice(5)}</span>
                            )}
                        </button>
                    );
                })}
            </div>

            <p className="text-[9px] text-[#444] font-bold text-center mt-3">
                Tap to cycle: not sent → sent → placed → passed
            </p>
        </div>
    );
}
