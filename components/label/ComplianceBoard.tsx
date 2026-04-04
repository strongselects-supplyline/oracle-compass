"use client";

import { useState, useEffect, useCallback } from "react";
import { logLabelCost } from "@/lib/db";
import { LABEL_COST_ESTIMATES } from "@/lib/budget";
import { getDynamicReleases, updateContentDeliverables, type Release, type ContentDeliverables } from "@/lib/releases";

// Registration fields from contentDeliverables
const REG_FIELDS: { key: keyof ContentDeliverables; label: string; short: string }[] = [
  { key: "isrcPulled", label: "ISRC Code", short: "ISRC" },
  { key: "ascapRegistered", label: "ASCAP", short: "ASCAP" },
  { key: "mlcRegistered", label: "MLC", short: "MLC" },
  { key: "songtrustRegistered", label: "Songtrust", short: "TRUST" },
  { key: "musixmatchSubmitted", label: "Musixmatch", short: "LYRICS" },
  { key: "instrumentalRendered", label: "Instrumental", short: "INST" },
];

type Escalation = {
  track: string;
  issue: string;
  severity: "AMBER" | "RED";
};

export default function ComplianceBoard() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(false);
  const [escalations, setEscalations] = useState<Escalation[] | null>(null);
  const [auditError, setAuditError] = useState<string | null>(null);

  const loadReleases = useCallback(async () => {
    const data = await getDynamicReleases();
    setReleases(data);
  }, []);

  useEffect(() => { loadReleases(); }, [loadReleases]);

  const toggleField = async (title: string, field: keyof ContentDeliverables, currentValue: boolean) => {
    await updateContentDeliverables(title, { [field]: !currentValue } as any);
    await loadReleases();
  };

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

  // Compute escalations from live data
  const liveEscalations: Escalation[] = releases
    .filter(r => r.status !== "live")
    .flatMap(r => {
      const d = r.contentDeliverables;
      const daysUntil = Math.ceil((new Date(r.releaseDate + "T00:00:00").getTime() - Date.now()) / 86400000);
      const issues: Escalation[] = [];
      if (!d.isrcPulled && daysUntil <= 7) issues.push({ track: r.title, issue: "ISRC not pulled", severity: daysUntil <= 3 ? "RED" : "AMBER" });
      if (!d.ascapRegistered && daysUntil <= 5) issues.push({ track: r.title, issue: "ASCAP not registered", severity: daysUntil <= 2 ? "RED" : "AMBER" });
      if (!d.mlcRegistered && daysUntil <= 5) issues.push({ track: r.title, issue: "MLC not registered", severity: daysUntil <= 2 ? "RED" : "AMBER" });
      if (!d.distrokidUploaded && daysUntil <= 3) issues.push({ track: r.title, issue: "Not uploaded to DistroKid", severity: "RED" });
      return issues;
    });

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

      {/* Live escalations from data */}
      {liveEscalations.length > 0 && (
        <div className="mb-6 p-4 rounded border bg-red-900/20 border-red-500">
          <h4 className="text-sm font-bold tracking-widest uppercase mb-2">⚠️ ESCALATIONS</h4>
          {liveEscalations.map((e, idx) => (
            <div key={idx} className="flex gap-2 text-sm text-[#ddd] mb-1">
              <span className={`badge ${e.severity === "RED" ? "badge-red" : "badge-amber"}`}>{e.severity}</span>
              <strong>{e.track}:</strong> {e.issue}
            </div>
          ))}
        </div>
      )}

      {/* AI audit results */}
      {escalations !== null && (
        <div className={`mb-6 p-4 rounded border ${escalations.length > 0 ? "bg-red-900/20 border-red-500" : "bg-green-900/20 border-green-500"}`}>
          <h4 className="text-sm font-bold tracking-widest uppercase mb-2">
            {escalations.length > 0 ? "⚠️ AI AUDIT ESCALATIONS" : "✓ AI AUDIT CLEAR"}
          </h4>
          {escalations.map((e, idx) => (
            <div key={idx} className="flex gap-2 text-sm text-[#ddd] mb-1">
              <span className={`badge ${e.severity === "RED" ? "badge-red" : "badge-amber"}`}>{e.severity}</span>
              <strong>{e.track}:</strong> {e.issue}
            </div>
          ))}
          {escalations.length === 0 && <p className="text-sm text-[#888]">No immediate compliance risks found.</p>}
        </div>
      )}

      {/* Registration table — tappable status pills */}
      <div className="overflow-x-auto hide-scrollbar">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-[#2a2a2a] text-xs font-bold tracking-widest text-[#555] uppercase">
              <th className="py-3 px-2">Track</th>
              {REG_FIELDS.map(f => (
                <th key={f.key} className="py-3 px-2">{f.short}</th>
              ))}
              <th className="py-3 px-2 text-right">Release</th>
            </tr>
          </thead>
          <tbody>
            {releases.map((release) => (
              <tr key={release.title} className="border-b border-[#1a1a1a] hover:bg-[#111] transition-colors">
                <td className="py-3 px-2 font-bold max-w-[140px] truncate" title={release.title}>{release.title}</td>
                {REG_FIELDS.map(f => {
                  const value = release.contentDeliverables[f.key];
                  const isComplete = value === true;
                  return (
                    <td key={f.key} className="py-3 px-2">
                      <button
                        onClick={() => toggleField(release.title, f.key, isComplete)}
                        className={`badge transition-all active:scale-90 cursor-pointer ${isComplete ? "badge-green" : "badge-amber"}`}
                        title={`Tap to ${isComplete ? "unmark" : "mark"} ${f.label}`}
                      >
                        {isComplete ? "✓" : "PENDING"}
                      </button>
                    </td>
                  );
                })}
                <td className="py-3 px-2 text-right text-xs text-[#888]">{release.releaseDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-[#555] mt-6 px-2 text-center">
        Tap any PENDING status to mark complete. Changes sync with Kill List in real time.
      </p>
    </div>
  );
}
