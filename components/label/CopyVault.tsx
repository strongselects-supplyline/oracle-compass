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

    const loadCopies = async () => {
        const data = await getAllWithPrefix<PRCopy>(`label_pr:${trackTitle}:`);
        setCopies(data);
    };

    useEffect(() => {
        loadCopies();
        // clear unreviewed flag when opening copy vault
        setStoreValue("label_vault_unreviewed", 0);
    }, [trackTitle]);

    const requestVariants = async (assetType: string) => {
        setLoading(true);
        try {
            // 1. Generate PR variants
            const prRes = await fetch("/api/label/pr", {
                method: "POST",
                body: JSON.stringify({ trackTitle, assetType })
            });
            const prData = await prRes.json();
            if (!prData.variants) throw new Error("No variants generated");

            // 2. Score with Guardian (Score variant 1 as the primary)
            const gRes = await fetch("/api/label/guardian", {
                method: "POST",
                body: JSON.stringify({ inputContent: prData.variants[0], assetType })
            });
            const gData = await gRes.json();

            // Store result
            const copyRecord: PRCopy = {
                variants: [gData.content || prData.variants[0], prData.variants[1], prData.variants[2]].filter(Boolean),
                assetType,
                guardianScore: gData.score || 0,
                edits: gData.edits,
                hardRuleViolations: gData.hardRuleViolations,
                approved: gData.approved
            };

            const key = `label_pr:${trackTitle}:${assetType}:${new Date().toISOString().split('T')[0]}`;
            await setStoreValue(key, copyRecord);

            // Log budget costs
            await logLabelCost(LABEL_COST_ESTIMATES.pr_request + LABEL_COST_ESTIMATES.guardian_filter);

            // Mark unreviewed + increment copy vault indicator
            const unrev = (await getStoreValue<number>("label_vault_unreviewed")) || 0;
            await setStoreValue("label_vault_unreviewed", unrev + 1);

            await loadCopies();
        } catch (e) {
            console.error(e);
            alert("Error generating copy. See console.");
        }
        setLoading(false);
    };

    const rescoreVariant = async (assetType: string) => {
        setLoading(true);
        try {
            const data = copies[assetType];
            if (!data) return;

            const gRes = await fetch("/api/label/guardian", {
                method: "POST",
                body: JSON.stringify({ inputContent: data.variants[0], assetType })
            });
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
        } catch (e) {
            console.error(e);
            alert("Error rescoring variant.");
        }
        setLoading(false);
    };

    const copyToClip = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Copied to clipboard!");
    };

    return (
        <div className="copy-vault animate-fade-in">
            <h3 className="text-xl font-bold mb-4">COPY VAULT — {trackTitle}</h3>

            {Object.entries(copies).length === 0 && <p className="text-[#888] mb-6">No copy generated yet.</p>}

            <div className="space-y-4">
                {Object.entries(copies).map(([key, data]) => (
                    <div key={key} className="card relative">
                        <div className="flex justify-between items-center mb-4">
                            <span className="font-bold tracking-widest text-[#888] uppercase">{data.assetType.replace(/_/g, ' ')}</span>
                            <div className="flex gap-3 items-center">
                                <span className={`badge ${data.guardianScore >= 90 ? 'badge-green' : data.guardianScore >= 70 ? 'badge-amber' : 'badge-red'}`}>
                                    GUARDIAN: {data.guardianScore}
                                </span>
                                <button onClick={() => rescoreVariant(data.assetType)} disabled={loading} className="text-xs font-bold tracking-widest text-[#555] hover:text-white uppercase transition-colors disabled:opacity-50">
                                    [RESCORE]
                                </button>
                            </div>
                        </div>
                        {data.hardRuleViolations && data.hardRuleViolations.length > 0 && (
                            <div className="bg-red-900/40 text-red-500 p-3 text-xs mb-4 rounded border border-red-500/50">
                                <strong className="block mb-1">❌ Rule Violation:</strong> {data.hardRuleViolations.join(", ")}
                            </div>
                        )}
                        <div className="space-y-4">
                            {data.variants.map((v, i) => (
                                <div key={i} className="flex gap-4 items-start">
                                    <span className="text-[#555] font-bold mt-1">{['A', 'B', 'C'][i]}</span>
                                    <p className="flex-1 text-sm text-[#ddd] leading-relaxed">"{v}"</p>
                                    <button onClick={() => copyToClip(v)} className="text-xs font-bold tracking-widest text-[#888] hover:text-white shrink-0 mt-1 transition-colors">
                                        [COPY]
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 border-t border-[#2a2a2a] pt-6">
                <div className="text-xs font-bold tracking-widest text-[#555] uppercase mb-4">Request New Copy</div>
                <div className="flex gap-2 flex-wrap">
                    {["tiktok_caption", "ig_feed", "spotify_pitch", "curator_dm", "press_bio_short"].map(type => (
                        <button
                            key={type}
                            onClick={() => requestVariants(type)}
                            disabled={loading}
                            className="bg-[#1a1a1a] hover:bg-[#2a2a2a] text-[#888] hover:text-white text-xs font-bold tracking-widest uppercase px-4 py-2 rounded transition-colors disabled:opacity-50"
                        >
                            + {type.replace(/_/g, ' ')}
                        </button>
                    ))}
                </div>
                {loading && <div className="mt-4 text-xs font-bold tracking-widest text-amber-500 uppercase animate-pulse">Running PR & Guardian Chain...</div>}
            </div>
        </div>
    );
}
