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

function SkeletonRows() {
    return (
        <div className="space-y-3 border-l-2 border-[#1a1a1a] ml-4 pl-6">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="card" style={{ opacity: 1 - i * 0.15 }}>
                    <div className="skeleton h-3 w-24 mb-3 rounded" />
                    <div className="skeleton h-5 w-3/4 rounded" />
                    <div className="flex gap-2 mt-4">
                        <div className="skeleton h-6 w-16 rounded-md" />
                        <div className="skeleton h-6 w-20 rounded-md" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function RolloutCalendar({ trackTitle, releaseDate }: { trackTitle: string, releaseDate: string }) {
    const [rollout, setRollout] = useState<RolloutSchedule | null>(null);
    const [loading, setLoading] = useState(false);
    const [copyLoading, setCopyLoading] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [copySuccess, setCopySuccess] = useState<string | null>(null);
    const key = `label_rollout:${trackTitle}`;

    useEffect(() => {
        getStoreValue<RolloutSchedule>(key).then(setRollout);
    }, [key]);

    const generateRollout = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/label/marketing", {
                method: "POST",
                body: JSON.stringify({ trackTitle, releaseDate })
            });
            if (!res.ok) {
                const errText = await res.text().catch(() => "Server error");
                throw new Error(`Marketing agent error (${res.status}): ${errText.slice(0, 120)}`);
            }
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            if (data.schedule) {
                await setStoreValue(key, data);
                await logLabelCost(LABEL_COST_ESTIMATES.marketing_rollout);
                setRollout(data);
            }
        } catch (e: any) {
            console.error(e);
            setError(e?.message || "Error generating rollout");
        }
        setLoading(false);
    };

    const requestCopy = async (assetType: string) => {
        if (!assetType || assetType === 'manual') return;
        setCopyLoading(assetType);
        setError(null);
        try {
            const prRes = await fetch("/api/label/pr", { method: "POST", body: JSON.stringify({ trackTitle, assetType }) });
            if (!prRes.ok) {
                const errText = await prRes.text().catch(() => "Server error");
                throw new Error(`PR agent error (${prRes.status}): ${errText.slice(0, 120)}`);
            }
            const prData = await prRes.json();
            if (!prData.variants) throw new Error("No variants generated");

            const gRes = await fetch("/api/label/guardian", { method: "POST", body: JSON.stringify({ inputContent: prData.variants[0], assetType }) });
            let gData: any = {};
            if (gRes.ok) gData = await gRes.json();

            const copyRecord = {
                variants: [gData.content || prData.variants[0], prData.variants[1], prData.variants[2]].filter(Boolean),
                assetType,
                guardianScore: gData.score || 0,
                edits: gData.edits,
                hardRuleViolations: gData.hardRuleViolations,
                approved: gData.approved ?? true
            };
            const copyKey = `label_pr:${trackTitle}:${assetType}:${new Date().toISOString().split('T')[0]}`;
            await setStoreValue(copyKey, copyRecord);
            await logLabelCost(LABEL_COST_ESTIMATES.pr_request + LABEL_COST_ESTIMATES.guardian_filter);
            const unrev = (await getStoreValue<number>("label_vault_unreviewed")) || 0;
            await setStoreValue("label_vault_unreviewed", unrev + 1);
            setCopySuccess(assetType);
            setTimeout(() => setCopySuccess(null), 3000);
        } catch (e: any) {
            console.error(e);
            setError(e?.message || "Error generating copy");
        }
        setCopyLoading(null);
    };

    if (!rollout) {
        return (
            <div className="text-center py-10">
                {error && (
                    <div className="alert-banner alert-banner-red mb-4 animate-slide-up text-left">
                        <span>⚠️</span>
                        <div className="flex-1 text-xs">{error}</div>
                        <button onClick={() => setError(null)} className="text-xs opacity-60 hover:opacity-100">✕</button>
                    </div>
                )}
                {loading ? (
                    <>
                        <SkeletonRows />
                        <p className="text-[10px] font-black tracking-widest text-[#555] uppercase mt-6">
                            Marketing Director is architecting your rollout…
                        </p>
                    </>
                ) : (
                    <>
                        <p className="text-[#666] text-sm mb-6 font-medium">No rollout schedule yet.</p>
                        <button onClick={generateRollout} className="agent-btn agent-btn-primary w-full">
                            📅 GENERATE 21-DAY ROLLOUT
                        </button>
                    </>
                )}
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            {error && (
                <div className="alert-banner alert-banner-red mb-4 animate-slide-up">
                    <span>⚠️</span>
                    <div className="flex-1 text-xs">{error}</div>
                    <button onClick={() => setError(null)} className="text-xs opacity-60 hover:opacity-100">✕</button>
                </div>
            )}
            {copySuccess && (
                <div className="alert-banner alert-banner-green mb-4 animate-slide-up">
                    <span>✓</span>
                    <div className="flex-1 text-xs">Copy for "{copySuccess}" sent to Copy Vault</div>
                </div>
            )}
            <div className="flex justify-between items-center mb-5">
                <h3 className="text-sm font-black tracking-widest uppercase">📅 {trackTitle} Rollout</h3>
                <button
                    onClick={generateRollout}
                    disabled={loading}
                    className="text-[10px] font-black tracking-widest text-[#555] hover:text-white uppercase disabled:opacity-30 transition-colors"
                >
                    {loading ? "..." : "[REGEN]"}
                </button>
            </div>

            <div className="space-y-3 relative border-l-2 border-[#1a1a1a] ml-3 pl-5">
                {rollout.schedule.map((item, i) => (
                    <div key={i} className={`card relative border ${item.priority === 'must' ? 'border-[#333]' :
                            item.priority === 'should' ? 'border-[#252525]' : 'border-[#1a1a1a]'
                        }`}>
                        {/* Timeline node */}
                        <div className={`absolute -left-[28px] top-5 w-2.5 h-2.5 rounded-full border border-[#080808] ${item.priority === 'must' ? 'bg-[#d4a853]' :
                                item.priority === 'should' ? 'bg-[#666]' : 'bg-[#333]'
                            }`} />

                        <div className="flex justify-between items-start gap-2 mb-2">
                            <div className="flex-1 min-w-0">
                                <span className={`text-[9px] font-black tracking-widest uppercase ${item.daysFromRelease === 0 ? 'text-green-500' : 'text-[#666]'
                                    }`}>
                                    {item.daysFromRelease === 0 ? "🔥 DROP DAY" : item.dateDescription}
                                </span>
                                <p className="font-bold text-sm mt-1 leading-snug text-[#e0e0e0]">{item.action}</p>
                            </div>
                            {item.assetType && item.assetType !== 'manual' && (
                                <button
                                    onClick={() => requestCopy(item.assetType)}
                                    disabled={copyLoading === item.assetType}
                                    className="flex items-center gap-1.5 text-[10px] font-black tracking-widest text-[#d4a853] hover:text-white uppercase transition-colors shrink-0 disabled:opacity-40 bg-[#d4a853]/10 px-2.5 py-1.5 rounded-lg"
                                >
                                    {copyLoading === item.assetType ? <><span className="spinner" style={{ width: 10, height: 10, borderWidth: 1.5 }} />GEN</> : "✍️ COPY"}
                                </button>
                            )}
                        </div>

                        <div className="flex gap-1.5 flex-wrap mt-3">
                            {item.platforms.map(p => (
                                <span key={p} className="text-[9px] font-bold bg-[#1a1a1a] text-[#666] px-2 py-1 rounded-md border border-[#252525]">{p}</span>
                            ))}
                            {item.priority === 'must' && (
                                <span className="text-[9px] font-black text-[#d4a853] bg-[#d4a853]/10 px-2 py-1 rounded-md ml-auto border border-[#d4a853]/20">MUST</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
