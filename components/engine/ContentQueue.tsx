import { useEffect, useState } from "react";
import { getDynamicReleases, Release } from "@/lib/releases";

type ContentRequirement = {
    id: string;
    type: string;
    count: number;
    description: string;
    urgency: "RED" | "AMBER" | "GREEN";
};

export default function ContentQueue() {
    const [upcoming, setUpcoming] = useState<Release[]>([]);

    useEffect(() => {
        getDynamicReleases().then(releases => {
            // Filter out released tracks and sort by release date
            const v = releases
                .filter(r => r.status !== "live" && r.releaseDate)
                .sort((a, b) => new Date(a.releaseDate!).getTime() - new Date(b.releaseDate!).getTime());

            // Take the top 2 upcoming releases to focus on
            setUpcoming(v.slice(0, 2));
        });
    }, []);

    if (upcoming.length === 0) {
        return (
            <div className="card mb-6">
                <p className="text-[10px] font-black tracking-[0.18em] text-[#555] uppercase mb-4">Content Queue</p>
                <p className="text-[#666] text-sm">No upcoming releases detected.</p>
            </div>
        );
    }

    const today = new Date();

    return (
        <div className="card mb-6">
            <p className="text-[10px] font-black tracking-[0.18em] text-[#555] uppercase mb-4">Content Queue</p>

            <div className="space-y-6">
                {upcoming.map((release, idx) => {
                    const releaseDate = new Date(release.releaseDate!);
                    const daysUntil = Math.ceil((releaseDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

                    let queue: ContentRequirement[] = [];

                    if (daysUntil > 14) {
                        queue = [
                            { id: "bts", type: "Process (BTS)", count: 2, description: "Raw studio moments, 15s snippets", urgency: "GREEN" },
                            { id: "lyric", type: "The Lyric", count: 1, description: "Text block of a strong lyric, audio in background", urgency: "GREEN" }
                        ];
                    } else if (daysUntil > 3 && daysUntil <= 14) {
                        queue = [
                            { id: "session", type: "The Session", count: 3, description: "White-wall performance w/ bg swap", urgency: "AMBER" },
                            { id: "fit", type: "The Fit", count: 1, description: "Styling/lookbook focus", urgency: "GREEN" }
                        ];
                    } else if (daysUntil >= 0 && daysUntil <= 3) {
                        queue = [
                            { id: "drop", type: "The Drop", count: 1, description: "Release announcement, pre-save link", urgency: "RED" },
                            { id: "session", type: "The Session", count: 2, description: "White-wall performance w/ bg swap", urgency: "RED" }
                        ];
                    } else {
                        queue = [
                            { id: "out_now", type: "Out Now / Live", count: 1, description: "Direct driving to DSPs", urgency: "RED" }
                        ];
                    }

                    return (
                        <div key={idx} className="border-t border-[#1e1e1e] pt-4 first:border-0 first:pt-0">
                            <div className="flex justify-between items-baseline mb-3">
                                <h3 className="text-white font-black text-lg tracking-tight uppercase">{release.title}</h3>
                                <span className={`text-[10px] font-black tracking-widest px-2 py-1 rounded-sm ${daysUntil <= 3 ? "bg-red-900/40 text-red-500" : daysUntil <= 14 ? "bg-amber-900/40 text-amber-500" : "bg-green-900/40 text-green-500"}`}>
                                    {daysUntil < 0 ? "OUT NOW" : `${daysUntil} DAYS`}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {queue.map((q, i) => (
                                    <div key={i} className={`p-3 rounded-lg border flex items-center justify-between ${q.urgency === 'RED' ? 'border-red-900/50 bg-red-900/10' :
                                            q.urgency === 'AMBER' ? 'border-amber-900/50 bg-amber-900/10' :
                                                'border-[#2a2a2a] bg-[#1a1a1a]'
                                        }`}>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-white text-sm font-black">{q.count}x {q.type}</span>
                                            </div>
                                            <p className="text-[#666] text-xs">{q.description}</p>
                                        </div>
                                        {/* Placeholder action button - just structural for now */}
                                        <div className="w-6 h-6 rounded-full border border-[#444] bg-[#111]" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
