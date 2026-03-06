"use client";

import { useState, useEffect } from "react";
import { getStoreValue, setStoreValue, getAllWithPrefix, logLabelCost } from "@/lib/db";
import { LABEL_COST_ESTIMATES } from "@/lib/budget";

export type PRCopy = {
    variants: string[];
    assetType: string;
    guardianScore: number;
    edits?: string[];
    hardRuleViolations?: string[];
    approved: boolean;
};

export default function CopyVault({ trackTitle }: { trackTitle: string }) {
    const [copies, setCopies] = useState<Record<string, PRCopy>>({});
    const [loading, setLoading] = useState(false);
    const [activeRequest, setActiveRequest] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const loadCopies = async () => {
        try {
            const data = await getAllWithPrefix<PRCopy>(`label_pr:${trackTitle}:`);
            setCopies(data);
        } catch (e) {
            console.error("Failed to load copies:", e);
        }
    };

    useEffect(() => {
        loadCopies();
        setStoreValue("label_vault_unreviewed", 0);
    }, [trackTitle]);

    const requestVariants = async (assetType: string) => {
        setLoading(true);
        setActiveRequest(assetType);
        setError(null);
        try {
            const prRes = await fetch("/api/label/pr", {
                method: "POST",
                body: JSON.stringify({ trackTitle, assetType })
            });
            if (!prRes.ok) {
                const errText = await prRes.text().catch(() => "Unknown server error");
                throw new Error(`PR agent error (${prRes.status}): ${errText.slice(0, 120)}`);
            }
            const prData = await prRes.json();
            if (!prData.variants || !Array.isArray(prData.variants) || prData.variants.length === 0) {
                throw new Error("PR agent returned no variants — try again");
            }

            // Score with Guardian
            const gRes = await fetch("/api/label/guardian", {
                method: "POST",
                body: JSON.stringify({ inputContent: prData.variants[0], assetType })
            });
            // Guardian is optional — degrade gracefully
            let gData: any = {};
            if (gRes.ok) {
                gData = await gRes.json();
            } else {
                console.warn("Guardian scoring failed, using raw PR output");
            }

            const copyRecord: PRCopy = {
                variants: [gData.content || prData.variants[0], prData.variants[1], prData.variants[2]].filter(Boolean),
                assetType,
                guardianScore: gData.score || 0,
                edits: gData.edits,
                hardRuleViolations: gData.hardRuleViolations,
                approved: gData.approved ?? true
            };

            const key = `label_pr:${trackTitle}:${assetType}:${new Date().toISOString().split('T')[0]}`;
            await setStoreValue(key, copyRecord);
            await logLabelCost(LABEL_COST_ESTIMATES.pr_request + LABEL_COST_ESTIMATES.guardian_filter);

            const unrev = (await getStoreValue<number>("label_vault_unreviewed")) || 0;
            await setStoreValue("label_vault_unreviewed", unrev + 1);

            await loadCopies();
        } catch (e: any) {
            console.error("Copy generation failed:", e);
            setError(e?.message || "Failed to generate copy");
        }
        setLoading(false);
        setActiveRequest(null);
    };

    const rescoreVariant = async (assetType: string) => {
        setLoading(true);
        setError(null);
        try {
            const data = copies[assetType];
            if (!data) return;

            const gRes = await fetch("/api/label/guardian", {
                method: "POST",
                body: JSON.stringify({ inputContent: data.variants[0], assetType })
            });
            if (!gRes.ok) throw new Error(`Guardian error (${gRes.status})`);
            const gData = await gRes.json();

            const copyRecord: PRCopy = {
                ...data,
                variants: [gData.content || data.variants[0], data.variants[1], data.variants[2]].filter(Boolean),
                guardianScore: gData.score || 0,
                edits: gData.edits,
                hardRuleViolations: gData.hardRuleViolations,
                approved: gData.approved
            };

            const key = `label_pr:${trackTitle}:${assetType}:${new Date().toISOString().split('T')[0]}`;
            await setStoreValue(key, copyRecord);
            await logLabelCost(LABEL_COST_ESTIMATES.guardian_filter);
            await loadCopies();
        } catch (e: any) {
            console.error("Rescore failed:", e);
            setError(e?.message || "Rescore failed");
        }
        setLoading(false);
    };

    const copyToClip = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            // Brief visual feedback without alert
        }).catch(() => {
            // Fallback for older browsers
        });
    };

    const copiedFeedback = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <div className="animate-fade-in">
            <h3 className="text-sm font-black tracking-widest uppercase mb-4">✍️ Copy Vault — {trackTitle}</h3>

            {/* Error banner */}
            {error && (
                <div className="alert-banner alert-banner-red mb-4 animate-slide-up">
                    <span>⚠️</span>
                    <div className="flex-1 text-xs">{error}</div>
                    <button onClick={() => setError(null)} className="text-xs opacity-60 hover:opacity-100">✕</button>
                </div>
            )}

            {Object.entries(copies).length === 0 && !loading && (
                <p className="text-[#555] text-sm mb-6 font-medium">No copy generated yet.</p>
            )}

            <div className="space-y-4">
                {Object.entries(copies).map(([key, data]) => (
                    <div key={key} className="card relative">
                        <div className="flex justify-between items-center mb-3 gap-2">
                            <span className="text-[10px] font-black tracking-widest text-[#777] uppercase">{data.assetType?.replace(/_/g, ' ') || 'unknown'}</span>
                            <div className="flex gap-2 items-center shrink-0">
                                <span className={`badge ${(data.guardianScore ?? 0) >= 90 ? 'badge-green' : (data.guardianScore ?? 0) >= 70 ? 'badge-amber' : 'badge-red'}`}>
                                    {data.guardianScore ?? '—'}
                                </span>
                                <button
                                    onClick={() => rescoreVariant(data.assetType)}
                                    disabled={loading}
                                    className="text-[9px] font-black tracking-widest text-[#555] hover:text-white uppercase transition-colors disabled:opacity-30"
                                >
                                    [RESCORE]
                                </button>
                            </div>
                        </div>
                        {data.hardRuleViolations && data.hardRuleViolations.length > 0 && (
                            <div className="alert-banner alert-banner-red mb-3 text-xs">
                                <span>❌</span>
                                <span>{data.hardRuleViolations.join(", ")}</span>
                            </div>
                        )}
                        <div className="space-y-3">
                            {(data.variants || []).map((v, i) => {
                                const variantText = typeof v === 'string' ? v : (v as any).copy || (v as any).text || (v as any).content || JSON.stringify(v);
                                return (
                                    <div key={i} className="flex gap-3 items-start">
                                        <span className="text-[#444] font-bold text-xs mt-1 shrink-0">{['A', 'B', 'C'][i]}</span>
                                        <p className="flex-1 text-[13px] text-[#ccc] leading-relaxed">"{variantText}"</p>
                                        <button
                                            onClick={() => copiedFeedback(variantText)}
                                            className="text-[9px] font-black tracking-widest text-[#555] hover:text-[#d4a853] shrink-0 mt-1 transition-colors bg-[#1a1a1a] px-2 py-1 rounded-md"
                                        >
                                            COPY
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 border-t border-[#1a1a1a] pt-5">
                <div className="text-[10px] font-black tracking-widest text-[#555] uppercase mb-3">Request New Copy</div>
                <div className="flex gap-2 flex-wrap">
                    {["tiktok_caption", "ig_feed", "spotify_pitch", "curator_dm", "press_bio_short"].map(type => (
                        <button
                            key={type}
                            onClick={() => requestVariants(type)}
                            disabled={loading}
                            className={`text-[10px] font-bold tracking-wider uppercase px-3 py-2.5 rounded-xl transition-all min-h-[44px] ${activeRequest === type
                                ? 'bg-[#d4a853] text-black'
                                : 'bg-[#1a1a1a] text-[#777] border border-[#252525] active:scale-95'
                                } disabled:opacity-40`}
                        >
                            {activeRequest === type ? (
                                <span className="flex items-center gap-1.5"><span className="spinner" style={{ width: 10, height: 10, borderWidth: 1.5 }} /> GEN…</span>
                            ) : (
                                `+ ${type.replace(/_/g, ' ')}`
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
