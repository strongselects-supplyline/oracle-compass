"use client";

import { useEffect, useState } from "react";
import { getDynamicReleases, Release, EP_RELEASE_DATE } from "@/lib/releases";
import { getStoreValue, setStoreValue } from "@/lib/db";
import { PROJECTS, LOOSIES, TIMELINE_EVENTS, STATUSES, Project, Track, TrackStatus } from "@/lib/studioData";
import { getWeekKey } from "@/lib/oracle";
import { getSessionsForDateRange } from "@/lib/studioLog";

// ── Utils ────────────────────────────────────────────────────
function daysUntilDate(dateStr: string | null): number | null {
    if (!dateStr) return null;
    const d = new Date(dateStr + "T00:00:00");
    const now = new Date(); now.setHours(0, 0, 0, 0);
    return Math.ceil((d.getTime() - now.getTime()) / 86400000);
}
function fmtDate(d: string | null): string {
    if (!d) return "—";
    return new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
function getWeekDateRange() {
    const now = new Date();
    const day = now.getDay() || 7; // 1 Mon to 7 Sun
    const start = new Date(now);
    start.setDate(now.getDate() - day + 1);
    const end = new Date(now);
    end.setDate(now.getDate() - day + 7);
    const toISO = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    return { startStr: toISO(start), endStr: toISO(end) };
}

// ── Sub-components ─────────────────────────────────────────────
function StatusPill({ status }: { status: TrackStatus }) {
    const s = STATUSES.find(x => x.value === status)!;
    return (
        <span style={{ background: s.color + "22", color: s.color, border: `1px solid ${s.color}44` }}
            className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
            {s.label}
        </span>
    );
}

function Timeline() {
    const projectColors: Record<string, string> = {
        "all-love": "#6ee7b7", "all-love-deluxe": "#fbbf24",
        "cream": "#f472b6", "freakshow": "#c084fc", "loosies": "#60a5fa",
    };
    // Focusing on the MOVE window (Mar-Apr/May) for better mobile visibility
    const yearStart = new Date("2026-03-01T00:00:00");
    const yearEnd = new Date("2026-05-01T00:00:00");
    const totalMs = yearEnd.getTime() - yearStart.getTime();
    const now = new Date(); now.setHours(0, 0, 0, 0);

    return (
        <div className="card mb-6">
            <p className="text-[10px] font-black tracking-[0.2em] text-[#555] uppercase mb-3">Sprinting Window</p>
            <div className="relative h-14">
                {/* Track */}
                <div className="absolute top-6 left-0 right-0 h-0.5 bg-[#222]" />
                {/* Now marker */}
                {now >= yearStart && now <= yearEnd && (
                    <div style={{ left: `${((now.getTime() - yearStart.getTime()) / totalMs) * 100}%` }}
                        className="absolute top-3 w-0.5 h-6 bg-red-500">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] text-red-500 font-black whitespace-nowrap">NOW</div>
                    </div>
                )}
                {TIMELINE_EVENTS.map((ev, i) => {
                    const evDate = new Date(ev.date + "T00:00:00");
                    if (evDate < yearStart || evDate > yearEnd) return null;
                    const pos = ((evDate.getTime() - yearStart.getTime()) / totalMs) * 100;
                    const c = projectColors[ev.project] || "#475569";
                    const isAlbum = ev.type === "album";
                    return (
                        <div key={i} style={{ left: `${Math.max(0, Math.min(98, pos))}%` }}
                            className="absolute top-4 -translate-x-1/2">
                            <div title={`${ev.date}: ${ev.label}`}
                                style={{ background: c, width: isAlbum ? 10 : 5, height: isAlbum ? 10 : 5, borderRadius: isAlbum ? 2 : "50%" }} />
                            {isAlbum && (
                                <div style={{ color: c }} className="absolute top-4 left-1/2 -translate-x-1/2 text-[7px] font-black whitespace-nowrap">
                                    {ev.label}
                                </div>
                            )}
                        </div>
                    );
                })}
                {/* Month labels */}
                {["Mar", "Apr", "May"].map((m, i) => {
                    const ms = new Date(`2026-0${i + 3}-01T00:00:00`);
                    if (ms < yearStart || ms > yearEnd) return null;
                    const pos = ((ms.getTime() - yearStart.getTime()) / totalMs) * 100;
                    return <div key={m} style={{ left: `${pos}%` }} className="absolute bottom-0 text-[8px] text-[#444] font-semibold">{m}</div>;
                })}
            </div>
        </div>
    );
}

function ProjectBlock({ project, isActive, onClick }: { project: Project; isActive: boolean; onClick: () => void }) {
    const live = project.tracks.filter(t => ["single_live", "on_album", "album_live"].includes(t.status)).length;
    const pct = Math.round((live / project.trackCount) * 100);
    const days = daysUntilDate(project.targetDate);

    return (
        <button onClick={onClick}
            style={{ borderColor: isActive ? project.color + "55" : "transparent", boxShadow: isActive ? `0 0 20px ${project.color}11` : "none" }}
            className="card text-left transition-all w-full">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <div style={{ color: project.color }} className="font-black text-sm leading-tight">{project.emoji} {project.name}</div>
                    <div className="text-[10px] text-[#555] mt-0.5">{project.role}</div>
                </div>
                <div className="text-right">
                    <div style={{ color: days !== null && days <= 0 ? "#22c55e" : days !== null && days <= 30 ? "#eab308" : "#555" }}
                        className="text-sm font-black">{days !== null ? (days <= 0 ? "OUT" : `${days}d`) : "—"}</div>
                    <div className="text-[9px] text-[#555]">{fmtDate(project.targetDate)}</div>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <div className="flex-1 h-1 bg-[#222] rounded-full overflow-hidden">
                    <div style={{ width: `${pct}%`, background: project.color }} className="h-full rounded-full transition-all" />
                </div>
                <span className="text-[9px] text-[#555] font-bold">{live}/{project.trackCount}</span>
            </div>
        </button>
    );
}

function TrackRow({ track, color }: { track: Track; color: string }) {
    const days = daysUntilDate(track.pitchDeadline);
    const isPitchUrgent = days !== null && days <= 3 && days > 0;

    return (
        <div className="flex items-center gap-2 px-3 py-2.5 border-b border-[#1a1a1a] last:border-0">
            <div className="flex-1 min-w-0">
                <div style={{ color: track.isLeadSingle ? color : "#e2e8f0" }}
                    className="text-xs font-bold truncate">
                    {track.leadRank && <span style={{ color: "#fbbf24" }} className="text-[9px] mr-1">#{track.leadRank}</span>}
                    {track.title}
                    {track.isLeadSingle && <span className="text-[8px] text-amber-400 ml-1 font-black">SINGLE</span>}
                </div>
                <div className="text-[9px] text-[#555] mt-0.5">
                    {track.bpm ? `${track.bpm} BPM` : "—"} {track.key ? `· ${track.key}` : ""}
                    {isPitchUrgent && <span className="text-red-500 ml-1 font-bold">⚡ Pitch by {fmtDate(track.pitchDeadline)}</span>}
                </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
                {track.releaseDate && <span className="text-[9px] text-[#555]">{fmtDate(track.releaseDate)}</span>}
                <StatusPill status={track.status} />
            </div>
        </div>
    );
}

function CycleRow({ title, storageKey, initialStatus }: { title: string; storageKey: string; initialStatus: string }) {
    const [status, setStatus] = useState(initialStatus);
    useEffect(() => { getStoreValue<string>(storageKey).then(v => { if (v) setStatus(v); }); }, [storageKey]);
    const cycle = async () => {
        const map: Record<string, string> = { add: "recording", recording: "mixing", mixing: "resting", resting: "done", done: "add" };
        const next = map[status];
        setStatus(next);
        await setStoreValue(storageKey, next);
    };
    const dotColor = status === "recording" ? "#ef4444" : status === "mixing" ? "#f59e0b" : status === "resting" ? "#22c55e" : "#555";
    const label = status === "done" ? "✓ DONE" : status === "add" ? "+ ADD" : status.toUpperCase();
    return (
        <div className="flex justify-between items-center py-3 border-b border-[#1c1c1c] last:border-0">
            <span className="text-xs font-bold">{title}</span>
            <button onClick={cycle}
                style={{ borderColor: dotColor + "55", color: dotColor }}
                className="flex items-center gap-1.5 text-[10px] font-black px-3 py-1.5 rounded-lg border bg-[#111] transition-all">
                {status !== "done" && status !== "add" && <div style={{ background: dotColor }} className="w-2 h-2 rounded-full" />}
                {label}
            </button>
        </div>
    );
}

// ── Main Page ──────────────────────────────────────────────────
export default function StudioPage() {
    const [activeProject, setActiveProject] = useState("all-love");
    const [releases, setReleases] = useState<Release[]>([]);
    const [albumDays, setAlbumDays] = useState(0);
    const [sessions, setSessions] = useState(0);
    const weekKey = `weekly_sessions:${getWeekKey()}`;

    useEffect(() => {
        const init = async () => {
            const [y, m, d] = EP_RELEASE_DATE.split("-").map(Number);
            const utcAlbum = Date.UTC(y, m - 1, d);
            const now = new Date();
            const utcNow = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
            setAlbumDays(Math.max(Math.ceil((utcAlbum - utcNow) / 86400000), 0));
            const r = await getDynamicReleases();
            setReleases(r);
            const { startStr, endStr } = getWeekDateRange();
            const loggedSessions = await getSessionsForDateRange(startStr, endStr);
            setSessions(loggedSessions.length);
        };
        init();
    }, []);

    const project = PROJECTS.find(p => p.id === activeProject)!;

    return (
        <main className="page animate-fade-in">
            <div className="page-inner">

                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <p className="text-[10px] font-black tracking-[0.2em] text-[#444] uppercase">The Studio</p>
                        <p className="text-xs text-[#555] font-bold mt-0.5">Waterfall · Cycle · Sessions</p>
                    </div>
                    <div className="text-right">
                        <div className={`text-3xl font-black leading-none ${albumDays <= 15 ? "text-red-500" : albumDays <= 30 ? "text-amber-500" : "text-white"}`}>
                            {albumDays}
                        </div>
                        <div className="text-[9px] text-[#555] font-bold uppercase tracking-wider mt-0.5">days · ALL LOVE EP</div>
                    </div>
                </div>

                {/* Timeline */}
                <Timeline />

                <p className="text-[10px] font-black tracking-[0.2em] text-[#555] uppercase mb-3">EP Cycle Board</p>
                <div className="card mb-6">
                    <CycleRow title="SEE ME" storageKey="cycle_see_me" initialStatus="done" />
                    <CycleRow title="EAST SIDE LOVE" storageKey="cycle_esl" initialStatus="recording" />
                    <CycleRow title="SWEET FRUSTRATION" storageKey="cycle_sf" initialStatus="mixing" />
                    <CycleRow title="LIKE I DID" storageKey="cycle_lid" initialStatus="mixing" />
                </div>

                {/* Project grid */}
                <div className="grid grid-cols-2 gap-2 mb-6">
                    {PROJECTS.map(p => (
                        <ProjectBlock key={p.id} project={p} isActive={activeProject === p.id} onClick={() => setActiveProject(p.id)} />
                    ))}
                </div>

                {/* Active project track list */}
                <div className="card mb-6">
                    <div className="flex justify-between items-center mb-3">
                        <p style={{ color: project.color }} className="text-xs font-black tracking-wider uppercase">{project.name} Tracks</p>
                        <p className="text-[9px] text-[#555]">Target: {fmtDate(project.targetDate)}</p>
                    </div>
                    {project.tracks.map((t, i) => <TrackRow key={i} track={t} color={project.color} />)}
                </div>

                {/* Loosies */}
                <p className="text-[10px] font-black tracking-[0.2em] text-[#555] uppercase mb-3">Bridge Singles / Loosies</p>
                <div className="grid grid-cols-2 gap-2 mb-6">
                    {LOOSIES.map((l, i) => (
                        <div key={i} className="card">
                            <div className="text-xs font-bold text-white mb-1">{l.title}</div>
                            <div className="text-[9px] text-[#555] mb-2">{fmtDate(l.targetDate)} · {l.notes}</div>
                            <StatusPill status={l.status} />
                        </div>
                    ))}
                </div>

                {/* Release Waterfall (dynamic from releases lib) */}
                <p className="text-[10px] font-black tracking-[0.2em] text-[#555] uppercase mb-3">Singles Waterfall</p>
                <div className="card mb-6">
                    {releases.map((s) => (
                        <div key={s.title} className="mb-4 last:mb-0">
                            <div className="flex justify-between items-end mb-1.5">
                                <div>
                                    <span className="font-bold text-sm block">{s.title}</span>
                                    <span className="text-[10px] text-[#666]">{s.releaseDate}</span>
                                </div>
                                <div>
                                    {s.status === "live" && <span className="badge badge-green">LIVE</span>}
                                    {s.status === "upload_pending" && <span className="badge badge-amber">PENDING</span>}
                                    {s.status === "unreleased" && <span className="badge badge-muted">LOCKED</span>}
                                </div>
                            </div>
                            <div className="waterfall-bar">
                                <div className={`waterfall-fill ${s.status === "live" ? "bg-green-500 w-full" : s.status === "upload_pending" ? "bg-amber-500 w-1/2" : "bg-[#2a2a2a] w-0"}`} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Creator Code — from R&B Money / Kevin Hart transcripts */}
                <p className="text-[10px] font-black tracking-[0.2em] text-[#555] uppercase mb-3">Creator Code</p>
                <div className="card mb-6 space-y-0">
                    {[
                        { rule: "Boss got to write a check.", sub: "Sovereign creator. You eat last, team gets paid first." },
                        { rule: "3 things = post it.", sub: "If you have 3 angles, it ships. Reps compound." },
                        { rule: "Associate with greatness.", sub: "Proximity earns the halo. Be in the room when it lands." },
                        { rule: "You're on a promo run.", sub: "Build quality before you scale. Low seats → earn the stage." },
                        { rule: "Oakland test: prove it in the hardest room.", sub: "Pitch editorial. Hit the gatekeepers first." },
                    ].map((item, i) => (
                        <div key={i} className="py-3 border-b border-[#1a1a1a] last:border-0">
                            <div className="text-xs font-black text-white leading-snug">{item.rule}</div>
                            <div className="text-[10px] text-[#444] mt-0.5">{item.sub}</div>
                        </div>
                    ))}
                </div>

                {/* Sonic Identity — link to dedicated page */}
                <a href="/sonic" className="card mb-6 flex items-center justify-between p-4 border border-[#252525] hover:border-amber-500/30 transition-colors active:scale-[0.98]">
                    <div>
                        <p className="text-xs font-black tracking-wider uppercase text-amber-500">🎧 Sonic Identity</p>
                        <p className="text-[10px] text-[#555] mt-0.5">v4 · 5,912 tracks analyzed · 4/4 EP singles</p>
                    </div>
                    <span className="text-[#555] text-sm">›</span>
                </a>

                {/* Session log */}
                <div className="card text-center py-5">
                    <div className="text-[10px] font-black tracking-widest text-[#666] uppercase mb-1.5">This Week&apos;s Sessions</div>
                    <div className="text-2xl font-black mb-2">{sessions} / {new Date() <= new Date('2026-04-03') ? 6 : 4}</div>
                    <div className="text-[10px] text-[#555] font-bold">(Auto-counted from Log tab)</div>
                </div>

            </div>
        </main>
    );
}
