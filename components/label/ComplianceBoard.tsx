"use client";

import { useState } from "react";
import { REGISTRY, TrackRegistry } from "@/lib/registry";
import { logLabelCost } from "@/lib/db";
import { LABEL_COST_ESTIMATES } from "@/lib/budget";

type Escalation = {
    track: string;
    issue: string;
    severity: "AMBER" | "RED";
};

export default function ComplianceBoard() {
    const [loading, setLoading] = useState(false);
    const [escalations, setEscalations] = useState<Escalation[] | null>(null);
    const [auditError, setAuditError] = useState<string | null>(null);

    const runAudit = async () => {
        setLoading(true);
        setAuditError(null);
        try {
            const res = await fetch("/api/label/ops", { method: "POST", body: JSON.stringify({}) });
            if (!res.ok) {
                const errText = await res.text().catch(() => "Server error");
                throw new Error(`Ops agent error (${res.status}): ${errText.slice(0, 120)}`);
            }
            const data = await res.json();
            await logLabelCost(LABEL_COST_ESTIMATES.ops_audit);
            setEscalations(data.escalations ?? []);
        } catch (e: any) {
            console.error(e);
            setAuditError(e?.message || "Error running ops audit");
        }
        setLoading(false);
    };

    const StatusBadge = ({ status }: { status: string }) => {
        if (status === 'assigned' || status === 'registered' || status === 'uploaded') {
            return <span className="badge badge-green truncate max-w-[120px]" title={status}>{status.toUpperCase()}</span>;
        }
        if (status === 'pending' || status === 'submitted') {
            return <span className="badge badge-amber truncate max-w-[120px]" title={status}>{status.toUpperCase()}</span>;
        }
        return <span className="badge badge-red truncate max-w-[120px]" title={status}>{status.toUpperCase()}</span>; // unassigned/unregistered
    };

    return (
        <div className="compliance-board animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">COMPLIANCE REGISTRY</h3>
                <button
                    onClick={runAudit}
                    disabled={loading}
                    className="text-xs font-bold tracking-widest text-amber-500 hover:text-white uppercase disabled:opacity-50 transition-colors"
                >
                    {loading ? "AUDITING..." : "[RUN FULL AUDIT]"}
                </button>
            </div>

            {auditError && (
                <div className="alert-banner alert-banner-red mb-4 animate-slide-up">
                    <span>⚠️</span>
                    <div className="flex-1 text-xs">{auditError}</div>
                    <button onClick={() => setAuditError(null)} className="text-xs opacity-60 hover:opacity-100">✕</button>
                </div>
            )}

            {escalations !== null && (
                <div className={`mb-6 p-4 rounded border ${escalations.length > 0 ? 'bg-red-900/20 border-red-500' : 'bg-green-900/20 border-green-500'}`}>
                    <h4 className="text-sm font-bold tracking-widest uppercase mb-2">
                        {escalations.length > 0 ? "⚠️ ESCALATIONS DETECTED" : "✓ ALL CLEAR"}
                    </h4>
                    {escalations.map((e, idx) => (
                        <div key={idx} className="flex gap-2 text-sm text-[#ddd] mb-1">
                            <span className={`badge ${e.severity === 'RED' ? 'badge-red' : 'badge-amber'}`}>{e.severity}</span>
                            <strong>{e.track}:</strong> {e.issue}
                        </div>
                    ))}
                    {escalations.length === 0 && <p className="text-sm text-[#888]">No immediate compliance risks found.</p>}
                </div>
            )}

            <div className="overflow-x-auto hide-scrollbar">
                <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                        <tr className="border-b border-[#2a2a2a] text-xs font-bold tracking-widest text-[#555] uppercase">
                            <th className="py-3 px-2">Track</th>
                            <th className="py-3 px-2">ISRC</th>
                            <th className="py-3 px-2">ASCAP</th>
                            <th className="py-3 px-2">MLC</th>
                            <th className="py-3 px-2">Songtrust</th>
                            <th className="py-3 px-2 text-right">Release</th>
                        </tr>
                    </thead>
                    <tbody>
                        {REGISTRY.map((track: TrackRegistry) => (
                            <tr key={track.title} className="border-b border-[#1a1a1a] hover:bg-[#111] transition-colors">
                                <td className="py-3 px-2 font-bold max-w-[140px] truncate" title={track.title}>{track.title}</td>
                                <td className="py-3 px-2">
                                    {track.isrc ? <span className="text-[#888] font-mono text-xs">{track.isrc}</span> : <StatusBadge status="pending" />}
                                </td>
                                <td className="py-3 px-2"><StatusBadge status={track.ascap} /></td>
                                <td className="py-3 px-2"><StatusBadge status={track.mlc} /></td>
                                <td className="py-3 px-2"><StatusBadge status={track.songtrust} /></td>
                                <td className="py-3 px-2 text-right text-xs text-[#888]">
                                    {track.releaseDate}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <p className="text-xs text-[#555] mt-6 px-2 text-center">
                Updating registry statuses requires manual code deployment. This ensures you personally verify registration.
            </p>
        </div>
    );
}
