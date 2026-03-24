"use client";

import { useEffect, useState } from "react";

// ── Types ─────────────────────────────────────────────────────────
type TrackProfile = {
    trackName: string;
    project: string;
    lane: string;
    topAnchorArtists: string[];
    topAnchorTracks: string[];
    doubleEncodeArtists: string[];
};

type ProjectIdentity = {
    tracks: TrackProfile[];
    permanentAnchors: string[];
    recurring: string[];
    spectrum: string[];
};

type SonicData = {
    generatedAt: string;
    version: number;
    tracksAnalyzed: number;
    projectsTracked: string[];
    lenses: {
        perRelease: TrackProfile[];
        perProject: Record<string, ProjectIdentity>;
        overallArtist: {
            permanentAnchors: string[];
            recurring: string[];
        };
    };
};

// ── Lane Colors ───────────────────────────────────────────────────
const LANE_COLORS: Record<string, string> = {
    "Dark TrapSoul / OVO": "#8b5cf6",
    "R&B": "#3b82f6",
    "Modern TrapSoul Bounce": "#f59e0b",
    "House-R&B / Electronic Soul": "#10b981",
};

const LANE_SHORT: Record<string, string> = {
    "Dark TrapSoul / OVO": "TRAPSOUL",
    "R&B": "R&B",
    "Modern TrapSoul Bounce": "BOUNCE",
    "House-R&B / Electronic Soul": "HOUSE-R&B",
};

// ── Sub-components ────────────────────────────────────────────────
function LanePill({ lane }: { lane: string }) {
    const color = LANE_COLORS[lane] || "#6b7280";
    const label = LANE_SHORT[lane] || lane;
    return (
        <span style={{ background: color + "18", color, border: `1px solid ${color}33` }}
            className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded whitespace-nowrap">
            {label}
        </span>
    );
}

function AnchorChip({ name, size = "sm" }: { name: string; size?: "sm" | "lg" }) {
    return (
        <span className={`inline-block bg-[#1a1a1a] border border-[#2a2a2a] rounded-md font-bold
            ${size === "lg" ? "text-[10px] px-2.5 py-1" : "text-[9px] px-2 py-0.5"}`}>
            {name}
        </span>
    );
}

function SpectrumBar({ tracks }: { tracks: TrackProfile[] }) {
    const sorted = [...tracks].sort((a, b) => {
        const order: Record<string, number> = {
            "Dark TrapSoul / OVO": 0, "R&B": 1, "Modern TrapSoul Bounce": 2, "House-R&B / Electronic Soul": 3
        };
        return (order[a.lane] ?? 1) - (order[b.lane] ?? 1);
    });

    return (
        <div className="card mb-4">
            <p className="text-[10px] font-black tracking-[0.2em] text-[#555] uppercase mb-3">Sonic Spectrum</p>
            <div className="relative h-10 mb-2">
                <div className="absolute top-4 left-0 right-0 h-1 rounded-full overflow-hidden flex">
                    {sorted.map((t, i) => {
                        const color = LANE_COLORS[t.lane] || "#6b7280";
                        return <div key={i} style={{ background: color, flex: 1 }} />;
                    })}
                </div>
                <div className="absolute top-0 left-0 text-[8px] text-[#555] font-bold">MOODY</div>
                <div className="absolute top-0 right-0 text-[8px] text-[#555] font-bold">KINETIC</div>
            </div>
            <div className="flex justify-between">
                {sorted.map((t, i) => (
                    <div key={i} className="text-center flex-1">
                        <div className="text-[8px] font-black text-white leading-tight">{t.trackName.toUpperCase()}</div>
                        <LanePill lane={t.lane} />
                    </div>
                ))}
            </div>
        </div>
    );
}

function TrackCard({ track, index }: { track: TrackProfile; index: number }) {
    const [expanded, setExpanded] = useState(false);
    const color = LANE_COLORS[track.lane] || "#6b7280";

    return (
        <button onClick={() => setExpanded(!expanded)}
            className="card text-left w-full transition-all mb-2"
            style={{ borderColor: expanded ? color + "44" : "transparent" }}>
            <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span style={{ color }} className="font-black text-sm">{track.trackName}</span>
                        <LanePill lane={track.lane} />
                    </div>
                    <div className="text-[9px] text-[#555]">{track.project}</div>
                </div>
                {track.doubleEncodeArtists.length > 0 && (
                    <span className="text-[8px] font-black text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                        {track.doubleEncodeArtists.length}× ENCODE
                    </span>
                )}
            </div>

            {/* Always show top 3 anchors */}
            <div className="flex flex-wrap gap-1 mt-2">
                {track.topAnchorArtists.slice(0, 3).map((a, i) => (
                    <AnchorChip key={i} name={a} />
                ))}
                {!expanded && track.topAnchorArtists.length > 3 && (
                    <span className="text-[9px] text-[#555] self-center">+{track.topAnchorArtists.length - 3} more</span>
                )}
            </div>

            {expanded && (
                <div className="mt-3 pt-3 border-t border-[#1c1c1c]">
                    <p className="text-[9px] font-bold text-[#666] uppercase tracking-wider mb-2">All Anchors</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                        {track.topAnchorArtists.map((a, i) => <AnchorChip key={i} name={a} />)}
                    </div>

                    {track.doubleEncodeArtists.length > 0 && (
                        <>
                            <p className="text-[9px] font-bold text-amber-400 uppercase tracking-wider mb-2">Double-Encode</p>
                            <div className="flex flex-wrap gap-1 mb-3">
                                {track.doubleEncodeArtists.map((a, i) => (
                                    <span key={i} className="text-[9px] px-2 py-0.5 rounded bg-amber-400/10 text-amber-400 border border-amber-400/20 font-bold">
                                        {a}
                                    </span>
                                ))}
                            </div>
                        </>
                    )}

                    <p className="text-[9px] font-bold text-[#666] uppercase tracking-wider mb-2">Sonic Pocket Tracks</p>
                    <div className="text-[9px] text-[#888] leading-relaxed">
                        {track.topAnchorTracks.slice(0, 6).map((t, i) => (
                            <span key={i} className="block">• {t}</span>
                        ))}
                    </div>
                </div>
            )}
        </button>
    );
}

// ── Main Page ─────────────────────────────────────────────────────
export default function SonicPage() {
    const [data, setData] = useState<SonicData | null>(null);
    const [lens, setLens] = useState<"release" | "project" | "artist">("project");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/data/sonicIdentity.json")
            .then(res => res.json())
            .then(d => { setData(d); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <main className="page animate-fade-in">
                <div className="page-inner flex items-center justify-center min-h-[60vh]">
                    <div className="text-[#555] text-sm font-bold">Loading Sonic Identity...</div>
                </div>
            </main>
        );
    }

    if (!data) {
        return (
            <main className="page animate-fade-in">
                <div className="page-inner">
                    <div className="card text-center py-10">
                        <div className="text-2xl mb-3">🎧</div>
                        <div className="text-sm font-bold text-white mb-1">No Sonic Data</div>
                        <div className="text-[10px] text-[#555]">
                            Run <code className="bg-[#1a1a1a] px-1.5 py-0.5 rounded text-[#888]">identity-sync.mjs</code> to generate identity data.
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    const perRelease = data.lenses.perRelease;
    const perProject = data.lenses.perProject;
    const overallArtist = data.lenses.overallArtist;

    return (
        <main className="page animate-fade-in">
            <div className="page-inner">

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <p className="text-[10px] font-black tracking-[0.2em] text-[#444] uppercase">Sonic Identity</p>
                        <p className="text-xs text-[#555] font-bold mt-0.5">
                            v{data.version} · {data.tracksAnalyzed} tracks analyzed
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-[#555]">
                            {new Date(data.generatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </div>
                    </div>
                </div>

                {/* Lens Selector */}
                <div className="flex gap-1 mb-6 bg-[#0f0f0f] rounded-xl p-1">
                    {([
                        { key: "release" as const, label: "Per Release", icon: "🎵" },
                        { key: "project" as const, label: "Per Project", icon: "📀" },
                        { key: "artist" as const, label: "Artist", icon: "👤" },
                    ]).map(l => (
                        <button key={l.key} onClick={() => setLens(l.key)}
                            className={`flex-1 text-[10px] font-black uppercase tracking-wider py-2.5 rounded-lg transition-all
                                ${lens === l.key
                                    ? "bg-[#1a1a1a] text-white border border-[#2a2a2a]"
                                    : "text-[#555] hover:text-[#888]"}`}>
                            {l.icon} {l.label}
                        </button>
                    ))}
                </div>

                {/* ── LENS 1: PER RELEASE ──────────────────────── */}
                {lens === "release" && (
                    <div className="animate-fade-in">
                        <SpectrumBar tracks={perRelease} />
                        <p className="text-[10px] font-black tracking-[0.2em] text-[#555] uppercase mb-3">
                            Track Profiles ({perRelease.length})
                        </p>
                        {perRelease.map((t, i) => <TrackCard key={i} track={t} index={i} />)}
                    </div>
                )}

                {/* ── LENS 2: PER PROJECT ──────────────────────── */}
                {lens === "project" && (
                    <div className="animate-fade-in">
                        {Object.entries(perProject).map(([projectName, proj]) => (
                            <div key={projectName}>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-lg">📀</span>
                                    <div>
                                        <p className="text-sm font-black text-white">{projectName}</p>
                                        <p className="text-[10px] text-[#555]">
                                            {proj.tracks.length} track{proj.tracks.length > 1 ? "s" : ""} analyzed
                                        </p>
                                    </div>
                                </div>

                                <SpectrumBar tracks={proj.tracks} />

                                {/* Project Anchors */}
                                {proj.permanentAnchors.length > 0 && (
                                    <div className="card mb-4">
                                        <p className="text-[10px] font-black tracking-[0.2em] text-[#555] uppercase mb-3">
                                            Project Anchors · 3+ tracks
                                        </p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {proj.permanentAnchors.map((a, i) => <AnchorChip key={i} name={a} size="lg" />)}
                                        </div>
                                    </div>
                                )}

                                {/* Recurring */}
                                {proj.recurring.length > 0 && (
                                    <div className="card mb-4">
                                        <p className="text-[10px] font-black tracking-[0.2em] text-[#555] uppercase mb-3">
                                            Recurring · 2+ tracks
                                        </p>
                                        <div className="flex flex-wrap gap-1">
                                            {proj.recurring.slice(0, 30).map((a, i) => <AnchorChip key={i} name={a} />)}
                                            {proj.recurring.length > 30 && (
                                                <span className="text-[9px] text-[#555] self-center ml-1">
                                                    +{proj.recurring.length - 30} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Per-track cards within project */}
                                <p className="text-[10px] font-black tracking-[0.2em] text-[#555] uppercase mb-3">
                                    Track Profiles
                                </p>
                                {proj.tracks.map((t, i) => <TrackCard key={i} track={t} index={i} />)}
                            </div>
                        ))}
                    </div>
                )}

                {/* ── LENS 3: OVERALL ARTIST ────────────────────── */}
                {lens === "artist" && (
                    <div className="animate-fade-in">
                        {/* Permanent Anchors */}
                        <div className="card mb-4">
                            <div className="flex justify-between items-center mb-3">
                                <p className="text-[10px] font-black tracking-[0.2em] text-[#555] uppercase">
                                    Permanent Anchors
                                </p>
                                <span className="text-[8px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
                                    {overallArtist.permanentAnchors.length} ARTISTS
                                </span>
                            </div>
                            <p className="text-[9px] text-[#555] mb-3">
                                Artists appearing in 3+ analyses across all projects. These define the permanent algorithmic identity.
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {overallArtist.permanentAnchors.map((a, i) => <AnchorChip key={i} name={a} size="lg" />)}
                            </div>
                        </div>

                        {/* Recurring */}
                        <div className="card mb-4">
                            <div className="flex justify-between items-center mb-3">
                                <p className="text-[10px] font-black tracking-[0.2em] text-[#555] uppercase">
                                    Recurring Overlaps
                                </p>
                                <span className="text-[8px] font-bold text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded border border-blue-400/20">
                                    {overallArtist.recurring.length} ARTISTS
                                </span>
                            </div>
                            <p className="text-[9px] text-[#555] mb-3">
                                Artists appearing in 2+ analyses. Emerging patterns that may become permanent anchors.
                            </p>
                            <div className="flex flex-wrap gap-1">
                                {overallArtist.recurring.slice(0, 40).map((a, i) => <AnchorChip key={i} name={a} />)}
                                {overallArtist.recurring.length > 40 && (
                                    <span className="text-[9px] text-[#555] self-center ml-1">
                                        +{overallArtist.recurring.length - 40} more
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Full Spectrum across all */}
                        <SpectrumBar tracks={perRelease} />

                        {/* Stats */}
                        <div className="card text-center py-5">
                            <div className="text-[10px] font-black tracking-widest text-[#666] uppercase mb-3">Identity Stats</div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <div className="text-2xl font-black text-white">{data.tracksAnalyzed}</div>
                                    <div className="text-[9px] text-[#555] font-bold">TRACKS</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-black text-emerald-400">{overallArtist.permanentAnchors.length}</div>
                                    <div className="text-[9px] text-[#555] font-bold">ANCHORS</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-black text-blue-400">{data.projectsTracked.length}</div>
                                    <div className="text-[9px] text-[#555] font-bold">PROJECTS</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </main>
    );
}
