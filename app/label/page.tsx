"use client";

import { useEffect, useState } from "react";
import { getDynamicReleases, Release } from "@/lib/releases";
import CopyVault from "@/components/label/CopyVault";
import RolloutCalendar from "@/components/label/RolloutCalendar";
import AgentStatus from "@/components/label/AgentStatus";
import ComplianceBoard from "@/components/label/ComplianceBoard";
import CreativeDept from "@/components/label/CreativeDept";
import ContentDept from "@/components/label/ContentDept";
import ANRPanel from "@/components/label/ANRPanel";
import SubmissionLog from "@/components/label/SubmissionLog";
import VaultManager from "@/components/label/VaultManager";

type Tab = "rollout" | "content" | "subs" | "vault" | "compliance" | "creative" | "anr" | "assets";

const TABS: { id: Tab; label: string; emoji: string }[] = [
    { id: "rollout", label: "Rollout", emoji: "📅" },
    { id: "content", label: "Content", emoji: "🎬" },
    { id: "subs", label: "Subs", emoji: "📋" },
    { id: "vault", label: "Copy", emoji: "✍️" },
    { id: "compliance", label: "Ops", emoji: "✅" },
    { id: "creative", label: "Creative", emoji: "🎨" },
    { id: "anr", label: "A&R", emoji: "🎧" },
    { id: "assets", label: "Vault", emoji: "📦" },
];

export default function LabelPage() {
    const [releases, setReleases] = useState<Release[]>([]);
    const [expandedRelease, setExpandedRelease] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<Tab>("content");

    useEffect(() => {
        getDynamicReleases().then(releases => {
            setReleases(releases);
            // Auto-expand the most urgent release
            const urgent = releases.find(r => r.status === "upload_pending") || releases[0];
            if (urgent) setExpandedRelease(urgent.title);
        });
    }, []);

    const getDaysUntil = (date: string) => {
        const d = Math.ceil((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        return Math.max(d, 0);
    };

    return (
        <main className="page animate-fade-in pb-20">
            <div className="page-inner">
                {/* Header */}
                <div className="text-center mb-8 animate-slide-up">
                    <h1 className="text-xl font-black tracking-widest">🏷️ LABEL OS</h1>
                    <div className="text-[10px] font-black tracking-[0.2em] text-[#555] uppercase mt-1">
                        past.El noir Records
                    </div>
                </div>

                {/* Release Queue */}
                <h3 className="text-[10px] font-black tracking-[0.2em] text-[#555] uppercase mb-3">Release Queue</h3>
                <div className="space-y-2 mb-6">
                    {releases.map((s) => {
                        const days = getDaysUntil(s.releaseDate);
                        const isExpanded = expandedRelease === s.title;
                        return (
                            <div key={s.title} className="rounded-2xl border border-[#252525] overflow-hidden bg-[#0d0d0d]">
                                {/* Track header row */}
                                <button
                                    className="w-full flex justify-between items-center px-5 py-4 text-left active:bg-[#1a1a1a] transition-colors"
                                    onClick={() => setExpandedRelease(isExpanded ? null : s.title)}
                                >
                                    <div>
                                        <span className="font-black text-base tracking-tight">{s.title}</span>
                                        <span className="block text-[10px] text-[#555] font-bold mt-0.5">{s.releaseDate}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {s.status === 'live' && <span className="badge badge-green">LIVE</span>}
                                        {s.status === 'upload_pending' && (
                                            <span className={`badge ${days <= 3 ? 'badge-red' : 'badge-amber'}`}>
                                                {days <= 3 ? `${days}D OUT` : 'PENDING'}
                                            </span>
                                        )}
                                        {s.status === 'unreleased' && <span className="badge badge-muted">LOCKED</span>}
                                        <span className={`text-[#555] transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}>›</span>
                                    </div>
                                </button>

                                {/* Expanded agent workspace */}
                                {isExpanded && (
                                    <div className="border-t border-[#1a1a1a] animate-fade-in">
                                        {/* Agent status strip */}
                                        <div className="px-4 pt-4 pb-2">
                                            <AgentStatus trackTitle={s.title} />
                                        </div>

                                        {/* Tab pills — scrollable */}
                                        <div className="flex gap-2 px-4 py-2 mb-2 overflow-x-auto hide-scrollbar">
                                            {TABS.map(tab => (
                                                <button
                                                    key={tab.id}
                                                    onClick={() => setActiveTab(tab.id)}
                                                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[11px] font-bold tracking-wider uppercase shrink-0 transition-all ${activeTab === tab.id
                                                        ? 'bg-[#d4a853] text-black shadow-lg shadow-[#d4a853]/20 scale-105'
                                                        : 'bg-[#1a1a1a] text-[#777] border border-[#252525] hover:border-[#333]'
                                                        }`}
                                                >
                                                    <span className="text-sm">{tab.emoji}</span>
                                                    {tab.label}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Agent panel */}
                                        <div className="px-4 pb-6">
                                            {activeTab === "rollout" && <RolloutCalendar trackTitle={s.title} releaseDate={s.releaseDate} />}
                                            {activeTab === "content" && <ContentDept trackTitle={s.title} />}
                                            {activeTab === "subs" && <SubmissionLog trackTitle={s.title} />}
                                            {activeTab === "vault" && <CopyVault trackTitle={s.title} />}
                                            {activeTab === "compliance" && <ComplianceBoard />}
                                            {activeTab === "creative" && <CreativeDept trackTitle={s.title} />}
                                            {activeTab === "anr" && <ANRPanel trackTitle={s.title} />}
                                            {activeTab === "assets" && <VaultManager trackTitle={s.title} />}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}
