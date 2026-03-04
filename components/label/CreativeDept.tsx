"use client";

import { useState, useEffect } from "react";
import { setStoreValue, getStoreValue, logLabelCost } from "@/lib/db";
import { LABEL_COST_ESTIMATES } from "@/lib/budget";

type CreativePackage = {
    videoTreatment: { act1: string; act2: string; act3: string };
    coverArtPrompts: string[];
    merchConcept: { item: string; description: string };
};

export default function CreativeDept({ trackTitle }: { trackTitle: string }) {
    const [loading, setLoading] = useState(false);
    const [pkg, setPkg] = useState<CreativePackage | null>(null);
    const [copied, setCopied] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getStoreValue<CreativePackage>(`label_creative:${trackTitle}`).then(v => { if (v) setPkg(v); });
    }, [trackTitle]);

    const generate = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/label/creative", {
                method: "POST",
                body: JSON.stringify({ trackTitle, mood: "dark, intimate, late-night R&B" })
            });
            if (!res.ok) {
                const errText = await res.text().catch(() => "Server error");
                throw new Error(`Creative agent error (${res.status}): ${errText.slice(0, 120)}`);
            }
            const data = await res.json();
            if (data.error) throw new Error(data.error);

            setPkg(data);
            await setStoreValue(`label_creative:${trackTitle}`, data);
            await logLabelCost(LABEL_COST_ESTIMATES.creative_brief);
        } catch (e: any) {
            console.error("Creative agent failed:", e);
            setError(e?.message || "Creative agent failed");
        }
        setLoading(false);
    };

    const copyPrompt = (text: string, idx: number) => {
        navigator.clipboard.writeText(text);
        setCopied(idx);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-5 gap-2">
                <h3 className="text-sm font-black tracking-widest uppercase">🎨 Creative Dept</h3>
                {pkg ? (
                    <button onClick={generate} disabled={loading} className="text-[10px] font-black tracking-widest text-[#555] hover:text-white uppercase disabled:opacity-30 transition-colors">
                        {loading ? "..." : "[REGEN]"}
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

            {!pkg && !loading && !error && (
                <div className="text-center py-8">
                    <p className="text-[#555] text-sm mb-5 font-medium">No creative package yet.</p>
                    <button onClick={generate} className="agent-btn agent-btn-primary w-full">
                        🎨 GENERATE CREATIVE PACKAGE
                    </button>
                </div>
            )}

            {loading && !pkg && (
                <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="card" style={{ opacity: 1 - i * 0.2 }}>
                            <div className="skeleton h-3 w-28 mb-3 rounded" />
                            <div className="skeleton h-12 w-full rounded" />
                        </div>
                    ))}
                    <p className="text-[10px] font-black tracking-widest text-[#555] uppercase text-center mt-4">
                        Creative Director is generating…
                    </p>
                </div>
            )}

            {pkg && (
                <div className="space-y-4">
                    {/* Video Treatment */}
                    <div className="card">
                        <h4 className="text-[10px] font-black tracking-widest text-[#d4a853] uppercase mb-3">🎬 Video Treatment</h4>
                        <div className="space-y-2">
                            {(["act1", "act2", "act3"] as const).map((act, i) => (
                                <div key={act} className="bg-[#0a0a0a] p-3 rounded-lg border border-[#1a1a1a]">
                                    <span className="text-[9px] text-[#555] font-black tracking-widest uppercase">ACT {i + 1}</span>
                                    <p className="text-[13px] text-[#ccc] mt-1 leading-relaxed">{pkg.videoTreatment?.[act] || '—'}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Cover Art Prompts */}
                    <div className="card">
                        <h4 className="text-[10px] font-black tracking-widest text-[#d4a853] uppercase mb-3">🎨 Cover Art Prompts</h4>
                        <div className="space-y-2">
                            {(pkg.coverArtPrompts || []).map((prompt, i) => (
                                <div key={i} className="bg-[#0a0a0a] p-3 rounded-lg border border-[#1a1a1a] relative">
                                    <div className="flex justify-between items-start gap-2">
                                        <div className="flex-1">
                                            <span className="text-[9px] text-[#555] font-black tracking-widest">V{i + 1}</span>
                                            <p className="text-[13px] text-[#ccc] mt-1 leading-relaxed font-mono">{prompt}</p>
                                        </div>
                                        <button
                                            onClick={() => copyPrompt(prompt, i)}
                                            className="text-[9px] font-black tracking-widest text-[#555] hover:text-[#d4a853] transition-colors bg-[#1a1a1a] px-2 py-1 rounded-md shrink-0 mt-1"
                                        >
                                            {copied === i ? "✓" : "COPY"}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Merch Concept */}
                    <div className="card">
                        <h4 className="text-[10px] font-black tracking-widest text-[#d4a853] uppercase mb-3">👕 Merch Concept</h4>
                        <div className="bg-[#0a0a0a] p-3 rounded-lg border border-[#1a1a1a]">
                            <p className="font-bold text-white text-sm">{pkg.merchConcept?.item || '—'}</p>
                            <p className="text-[13px] text-[#ccc] mt-2 leading-relaxed">{pkg.merchConcept?.description || '—'}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
