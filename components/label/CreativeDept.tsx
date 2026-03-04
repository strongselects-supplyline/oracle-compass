"use client";

import { useState } from "react";
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

    const generate = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/label/creative", {
                method: "POST",
                body: JSON.stringify({ trackTitle, mood: "dark, intimate, late-night R&B" })
            });
            const data = await res.json();
            if (data.error) { alert(data.error); setLoading(false); return; }

            setPkg(data);
            await setStoreValue(`label_creative:${trackTitle}`, data);
            await logLabelCost(LABEL_COST_ESTIMATES.creative_brief);
        } catch (e) {
            console.error(e);
            alert("Creative agent failed.");
        }
        setLoading(false);
    };

    // Load existing on mount
    useState(() => {
        getStoreValue<CreativePackage>(`label_creative:${trackTitle}`).then(v => { if (v) setPkg(v); });
    });

    const copyPrompt = (text: string, idx: number) => {
        navigator.clipboard.writeText(text);
        setCopied(idx);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">CREATIVE DEPARTMENT</h3>
                <button
                    onClick={generate}
                    disabled={loading}
                    className="text-xs font-bold tracking-widest text-amber-500 hover:text-white uppercase disabled:opacity-50 transition-colors"
                >
                    {loading ? "GENERATING..." : "[GENERATE CREATIVE PACKAGE]"}
                </button>
            </div>

            {!pkg && !loading && (
                <div className="text-center py-12 text-[#555] text-sm font-bold tracking-widest uppercase bg-[#0a0a0a] rounded border border-[#1a1a1a]">
                    No creative package generated yet
                </div>
            )}

            {pkg && (
                <div className="space-y-6">
                    {/* Video Treatment */}
                    <div className="card">
                        <h4 className="text-sm font-bold tracking-widest text-amber-500 uppercase mb-4">🎬 VIDEO TREATMENT</h4>
                        <div className="space-y-3">
                            {(["act1", "act2", "act3"] as const).map((act, i) => (
                                <div key={act} className="bg-[#0a0a0a] p-3 rounded border border-[#1a1a1a]">
                                    <span className="text-xs text-[#555] font-bold tracking-widest uppercase">ACT {i + 1}</span>
                                    <p className="text-sm text-[#ccc] mt-1 leading-relaxed">{pkg.videoTreatment[act]}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Cover Art Prompts */}
                    <div className="card">
                        <h4 className="text-sm font-bold tracking-widest text-amber-500 uppercase mb-4">🎨 COVER ART PROMPTS</h4>
                        <div className="space-y-3">
                            {pkg.coverArtPrompts.map((prompt, i) => (
                                <div key={i} className="bg-[#0a0a0a] p-3 rounded border border-[#1a1a1a] relative group">
                                    <span className="text-xs text-[#555] font-bold tracking-widest">VARIANT {i + 1}</span>
                                    <p className="text-sm text-[#ccc] mt-1 leading-relaxed font-mono">{prompt}</p>
                                    <button
                                        onClick={() => copyPrompt(prompt, i)}
                                        className="absolute top-2 right-2 text-xs text-[#555] hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        {copied === i ? "✓ COPIED" : "[COPY]"}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Merch Concept */}
                    <div className="card">
                        <h4 className="text-sm font-bold tracking-widest text-amber-500 uppercase mb-4">👕 MERCH CONCEPT</h4>
                        <div className="bg-[#0a0a0a] p-4 rounded border border-[#1a1a1a]">
                            <p className="font-bold text-white">{pkg.merchConcept.item}</p>
                            <p className="text-sm text-[#ccc] mt-2 leading-relaxed">{pkg.merchConcept.description}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
