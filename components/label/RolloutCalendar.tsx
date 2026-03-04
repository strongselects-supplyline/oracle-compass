"use client";

import { useState, useEffect } from "react";
import { getStoreValue, setStoreValue, logLabelCost } from "@/lib/db";
import { LABEL_COST_ESTIMATES } from "@/lib/budget";

export type RolloutItem = {
    daysFromRelease: number;
    dateDescription: string;
    action: string;
    platforms: string[];
    assetType: string;
    toolRequired: string;
    priority: "must" | "should" | "optional";
};

export type RolloutSchedule = {
    schedule: RolloutItem[];
};

export default function RolloutCalendar({ trackTitle, releaseDate }: { trackTitle: string, releaseDate: string }) {
    const [rollout, setRollout] = useState<RolloutSchedule | null>(null);
    const [loading, setLoading] = useState(false);
    const key = `label_rollout:${trackTitle}`;

    useEffect(() => {
        getStoreValue<RolloutSchedule>(key).then(setRollout);
    }, [key]);

    const generateRollout = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/label/marketing", {
                method: "POST",
                body: JSON.stringify({ trackTitle, releaseDate })
            });
            const data = await res.json();

            if (data.schedule) {
                await setStoreValue(key, data);
                await logLabelCost(LABEL_COST_ESTIMATES.marketing_rollout);
                setRollout(data);
            }
        } catch (e) {
            console.error(e);
            alert("Error generating rollout.");
        }
        setLoading(false);
    };

    const requestCopy = async (assetType: string) => {
        if (!assetType || assetType === 'manual') return;
        setLoading(true);
        try {
            const prRes = await fetch("/api/label/pr", { method: "POST", body: JSON.stringify({ trackTitle, assetType }) });
            const prData = await prRes.json();
            if (!prData.variants) throw new Error("No variants generated");

            const gRes = await fetch("/api/label/guardian", { method: "POST", body: JSON.stringify({ inputContent: prData.variants[0], assetType }) });
            const gData = await gRes.json();

            const copyRecord = {
                variants: [gData.content || prData.variants[0], prData.variants[1], prData.variants[2]].filter(Boolean),
                assetType,
                guardianScore: gData.score || 0,
                edits: gData.edits,
                hardRuleViolations: gData.hardRuleViolations,
                approved: gData.approved
            };

            const key = `label_pr:${trackTitle}:${assetType}:${new Date().toISOString().split('T')[0]}`;
            await setStoreValue(key, copyRecord);
            await logLabelCost(LABEL_COST_ESTIMATES.pr_request + LABEL_COST_ESTIMATES.guardian_filter);

            const unrev = (await getStoreValue<number>("label_vault_unreviewed")) || 0;
            await setStoreValue("label_vault_unreviewed", unrev + 1);
            alert("Copy generated and sent to Vault!");
        } catch (e) {
            console.error(e);
            alert("Error generating copy. See console.");
        }
        setLoading(false);
    };

    if (!rollout) {
        return (
            <div className="text-center py-12">
                <p className="text-[#888] mb-6">No rollout schedule generated yet.</p>
                <button
                    onClick={generateRollout}
                    disabled={loading}
                    className="bg-white text-black hover:bg-gray-200 text-xs font-bold tracking-widest uppercase px-6 py-3 rounded transition-colors disabled:opacity-50"
                >
                    {loading ? "ARCHITECTING ROLLOUT..." : "GENERATE 21-DAY ROLLOUT"}
                </button>
            </div>
        );
    }

    return (
        <div className="rollout-calendar animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">ROLLOUT — {trackTitle}</h3>
                <button
                    onClick={generateRollout}
                    disabled={loading}
                    className="text-xs font-bold tracking-widest text-[#888] hover:text-white uppercase disabled:opacity-50 transition-colors"
                >
                    {loading ? "REGENERATING..." : "[REGENERATE]"}
                </button>
            </div>

            <div className="space-y-4 relative border-l-2 border-[#1a1a1a] ml-4 pl-6">
                {rollout.schedule.map((item, i) => (
                    <div key={i} className="card relative">
                        {/* Timeline node */}
                        <div className={`absolute -left-[31px] top-6 w-3 h-3 rounded-full border border-[#0a0a0a] ${item.priority === 'must' ? 'bg-white' :
                            item.priority === 'should' ? 'bg-[#888]' : 'bg-[#333]'
                            }`} />

                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <span className={`text-xs font-bold tracking-widest uppercase ${item.daysFromRelease === 0 ? 'text-green-500' : 'text-[#888]'}`}>
                                    {item.daysFromRelease === 0 ? "DROP DAY" : item.dateDescription}
                                </span>
                                <p className="font-bold text-lg mt-1">{item.action}</p>
                            </div>
                            {item.assetType && item.assetType !== 'manual' && (
                                <button
                                    onClick={() => requestCopy(item.assetType)}
                                    disabled={loading}
                                    className="text-xs font-bold tracking-widest text-amber-500 hover:text-white uppercase transition-colors shrink-0 disabled:opacity-50"
                                >
                                    [GET COPY]
                                </button>
                            )}
                        </div>

                        <div className="flex gap-2 flex-wrap mt-4">
                            {item.platforms.map(p => (
                                <span key={p} className="badge bg-[#1a1a1a] text-[#888]">{p}</span>
                            ))}
                            <span className="badge border border-[#333] text-[#555] ml-auto">
                                TOOL: {item.toolRequired.replace('cf_', 'Content Factory ').replace('ss_', 'Sovereign Studio ').toUpperCase()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
