"use client";

import { useEffect, useState } from "react";
import { getDynamicReleases, Release } from "@/lib/releases";
import CopyVault from "@/components/label/CopyVault";
import RolloutCalendar from "@/components/label/RolloutCalendar";
import AgentStatus from "@/components/label/AgentStatus";
import ComplianceBoard from "@/components/label/ComplianceBoard";
import CreativeDept from "@/components/label/CreativeDept";
import ANRPanel from "@/components/label/ANRPanel";

export default function LabelPage() {
    const [releases, setReleases] = useState<Release[]>([]);
    const [expandedRelease, setExpandedRelease] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"rollout" | "vault" | "compliance" | "creative" | "anr">("vault");

    useEffect(() => {
        getDynamicReleases().then(setReleases);
    }, []);

    return (
        <main className="page animate-fade-in pb-20">
            <div className="page-inner">
                <div className="text-center mb-12 animate-slide-up">
                    <h1 className="text-2xl font-bold">🏷️ LABEL OS</h1>
                    <div className="text-sm font-bold tracking-widest text-[#888] uppercase mt-2">
                        past.El noir Records
                    </div>
                </div>

                <h3 className="text-xs font-bold tracking-widest text-[#888] uppercase mb-4">Release Queue</h3>
                <div className="card mb-8">
                    {releases.map((s) => (
                        <div key={s.title} className="mb-2 last:mb-0">
                            <div
                                className="flex justify-between items-center cursor-pointer hover:bg-[#1a1a1a] p-3 -mx-3 rounded transition-colors"
                                onClick={() => setExpandedRelease(expandedRelease === s.title ? null : s.title)}
                            >
                                <div>
                                    <span className="font-bold text-lg block">{s.title}</span>
                                    <span className="text-xs text-[#888]">{s.releaseDate}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    {s.status === 'live' && <span className="badge badge-green">LIVE</span>}
                                    {s.status === 'upload_pending' && <span className="badge badge-amber">UPLOAD PENDING</span>}
                                    {s.status === 'unreleased' && <span className="badge badge-muted">LOCKED</span>}
                                    <span className={`text-[#888] transition-transform ${expandedRelease === s.title ? 'rotate-90' : ''}`}>→</span>
                                </div>
                            </div>

                            {expandedRelease === s.title && (
                                <div className="mt-4 border-t border-[#2a2a2a] pt-6 pb-2 animate-fade-in">
                                    <AgentStatus trackTitle={s.title} />

                                    <div className="flex gap-2 mb-6 overflow-x-auto pb-2 hide-scrollbar">
                                        {(["rollout", "vault", "compliance", "creative", "anr"] as const).map(tab => (
                                            <button
                                                key={tab}
                                                onClick={() => setActiveTab(tab)}
                                                className={`px-4 py-2 rounded text-xs font-bold tracking-widest uppercase shrink-0 transition-colors ${activeTab === tab ? 'bg-white text-black' : 'bg-[#1a1a1a] text-[#888] hover:text-white'}`}
                                            >
                                                {tab === 'vault' ? 'copy vault' : tab === 'anr' ? 'a&r' : tab}
                                            </button>
                                        ))}
                                    </div>

                                    {activeTab === "rollout" && <RolloutCalendar trackTitle={s.title} releaseDate={s.releaseDate} />}
                                    {activeTab === "vault" && <CopyVault trackTitle={s.title} />}
                                    {activeTab === "compliance" && <ComplianceBoard />}
                                    {activeTab === "creative" && <CreativeDept trackTitle={s.title} />}
                                    {activeTab === "anr" && <ANRPanel trackTitle={s.title} />}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
