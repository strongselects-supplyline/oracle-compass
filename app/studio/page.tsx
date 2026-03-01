"use client";

import { useEffect, useState } from "react";
import { SINGLES, ALBUM_RELEASE } from "@/lib/releases";
import { getStoreValue, setStoreValue } from "@/lib/db";

export default function StudioPage() {
    const [daysUntil, setDaysUntil] = useState(0);
    const [sessions, setSessions] = useState(0);

    useEffect(() => {
        const now = new Date();
        // Neutralize time to avoid timezone drift
        const utcAlbum = Date.UTC(ALBUM_RELEASE.getFullYear(), ALBUM_RELEASE.getMonth(), ALBUM_RELEASE.getDate());
        const utcNow = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
        const diff = Math.ceil((utcAlbum - utcNow) / (1000 * 60 * 60 * 24));
        setDaysUntil(diff);

        getStoreValue<number>('weekly_sessions').then(v => setSessions(v || 0));
    }, []);

    const logSession = async () => {
        const next = sessions + 1;
        setSessions(next);
        await setStoreValue('weekly_sessions', next);
    };

    return (
        <main className="page animate-fade-in">
            <div className="page-inner">

                <div className="text-center mb-12">
                    <div className={`countdown ${daysUntil < 15 ? 'text-red-500' : (daysUntil <= 30 ? 'text-amber-500' : 'text-white')} animate-slide-up`}>
                        {daysUntil}
                    </div>
                    <div className="text-sm font-bold tracking-widest text-[#888] uppercase mt-2">
                        days until ALL LOVE
                    </div>
                </div>

                <h3 className="text-xs font-bold tracking-widest text-[#888] uppercase mb-4">Release Waterfall</h3>
                <div className="card mb-8">
                    {SINGLES.map((s, i) => (
                        <div key={s.title} className="mb-5 last:mb-0">
                            <div className="flex justify-between items-end mb-2">
                                <div>
                                    <span className="font-bold text-lg block">{s.title}</span>
                                    <span className="text-xs text-[#888]">{s.releaseDate}</span>
                                </div>
                                <div className="text-right">
                                    {s.status === 'live' && <span className="badge badge-green">LIVE</span>}
                                    {s.status === 'upload_pending' && <span className="badge badge-amber">PENDING</span>}
                                    {s.status === 'unreleased' && <span className="badge badge-muted">LOCKED</span>}
                                </div>
                            </div>
                            <div className="waterfall-bar">
                                <div
                                    className={`waterfall-fill ${s.status === 'live' ? 'bg-green-500 w-full' : (s.status === 'upload_pending' ? 'bg-amber-500 w-1/2' : 'bg-[#2a2a2a] w-0')}`}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>

                <h3 className="text-xs font-bold tracking-widest text-[#888] uppercase mb-4">Cycle Board</h3>
                <div className="card mb-8">
                    <CycleRow title="RECONNECT" storageKey="cycle_reconnect" initialStatus="recording" />
                    <CycleRow title="WANT U 2" storageKey="cycle_wantu2" initialStatus="mixing" />
                    <CycleRow title="WORTH IT" storageKey="cycle_worthit" initialStatus="resting" />
                    <CycleRow title="JUST SAY SO" storageKey="cycle_justsayso" initialStatus="add" />
                </div>

                <div className="card text-center py-6">
                    <div className="text-xs font-bold tracking-widest text-[#888] uppercase mb-2">This Week's Sessions</div>
                    <div className="text-2xl font-bold mb-4">{sessions} / 4</div>
                    <button
                        onClick={logSession}
                        className={`w-full py-3 rounded-lg font-bold ${sessions >= 4 ? 'bg-green-500 text-black animate-celebrate' : 'bg-[#2a2a2a] text-white hover:bg-[#333]'}`}
                    >
                        {sessions >= 4 ? 'TARGET HIT ✓' : '+ LOG SESSION'}
                    </button>
                </div>

            </div>
        </main>
    );
}

function CycleRow({ title, initialStatus, storageKey }: { title: string, initialStatus: string, storageKey: string }) {
    const [status, setStatus] = useState(initialStatus);

    useEffect(() => {
        getStoreValue<string>(storageKey).then(v => {
            if (v) setStatus(v);
        });
    }, [storageKey]);

    const cycle = async () => {
        const map: Record<string, string> = {
            'add': 'recording',
            'recording': 'mixing',
            'mixing': 'resting',
            'resting': 'done',
            'done': 'add'
        };
        const nextStatus = map[status];
        setStatus(nextStatus);
        await setStoreValue(storageKey, nextStatus);
    };

    return (
        <div className="flex justify-between items-center py-3 border-b border-[#2a2a2a] last:border-0">
            <span className="font-bold">{title}</span>
            <button onClick={cycle} className="cycle-btn bg-[#1c1c1c] border-[#2a2a2a]">
                {status === 'recording' && <><div className="dot bg-red-500" /> RECORDING</>}
                {status === 'mixing' && <><div className="dot" style={{ background: 'linear-gradient(90deg, #f59e0b 50%, transparent 50%)', border: '1px solid #f59e0b' }} /> MIXING</>}
                {status === 'resting' && <><div className="dot border border-green-500 bg-transparent" /> RESTING</>}
                {status === 'done' && <span className="text-green-500 px-2 font-bold">✓ DONE</span>}
                {status === 'add' && <span className="text-[#888] px-2 font-bold">+ ADD</span>}
            </button>
        </div>
    )
}
