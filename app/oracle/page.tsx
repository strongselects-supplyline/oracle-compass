"use client";

import { useEffect, useState } from "react";
import { getStoreValue, getTodayISO } from "@/lib/db";
import type { OracleDecree, OracleFlag } from "@/lib/oracle";
import { assembleContext } from "@/lib/oracle";
import { executeRealignment } from "@/lib/realign";

export default function OraclePage() {
  const [decree, setDecree] = useState<OracleDecree | null>(null);
  const [flags, setFlags] = useState<OracleFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [firing, setFiring] = useState(false);
  const [fireError, setFireError] = useState<string | null>(null);

  const load = async () => {
    const today = getTodayISO();
    const [d, fl] = await Promise.all([
      getStoreValue<OracleDecree>("oracle_decree:" + today),
      getStoreValue<OracleFlag[]>("oracle_flags:" + today),
    ]);
    setDecree(d);
    setFlags(fl || []);
    setLoading(false);
  };

  const fireOracle = async () => {
    setFiring(true);
    setFireError(null);
    try {
      const context = await assembleContext();
      const res = await fetch("/api/oracle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(context),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Unknown error" }));
        setFireError(err.error || "Oracle engine failed.");
      } else {
        const decree: OracleDecree = await res.json();
        await executeRealignment(decree);
        await load();
      }
    } catch (e) {
      setFireError(String(e));
    } finally {
      setFiring(false);
    }
  };

  useEffect(() => { load(); }, []);

  const severityColor =
    decree?.severity === "GREEN" ? "text-green-400" :
    decree?.severity === "AMBER" ? "text-amber-400" :
    decree?.severity === "RED"   ? "text-red-400"   : "text-[#555]";

  const severityBorder =
    decree?.severity === "GREEN" ? "border-green-900/40" :
    decree?.severity === "AMBER" ? "border-amber-900/40" :
    decree?.severity === "RED"   ? "border-red-900/40"   : "border-[#2a2a2a]";

  const redFlags   = flags.filter(f => f.urgency === "RED");
  const amberFlags = flags.filter(f => f.urgency === "AMBER");

  return (
    <main className="page animate-fade-in">
      <div className="page-inner">

        <header className="mb-10">
          <h1 className="text-4xl font-black tracking-tight mb-1">Oracle</h1>
          <p className="text-[#555] text-xs font-bold tracking-widest uppercase">
            Daily decree — {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
          </p>
        </header>

        {loading ? (
          <div className="text-center py-20">
            <p className="text-[#444] text-sm animate-pulse">Reading the signal...</p>
          </div>
        ) : decree ? (
          <>
            <div className="text-center mb-8">
              <span className={"text-[11px] font-black tracking-[0.2em] uppercase " + severityColor}>
                {decree.severity}
              </span>
            </div>

            <div className={"border " + severityBorder + " rounded-2xl p-6 mb-10 bg-[#0f0f0f]"}>
              <p className="text-xl font-black leading-snug tracking-tight text-white text-center">
                {decree.oracle_message}
              </p>
            </div>

            <section className="mb-10">
              <p className="text-[10px] font-black tracking-[0.2em] text-[#555] uppercase mb-3">Assessment</p>
              <p className="text-sm text-[#888] leading-relaxed font-medium">
                {decree.assessment}
              </p>
            </section>

            {/* ── Flags ── */}
            {redFlags.length > 0 && (
              <section className="mb-8">
                <p className="text-[10px] font-black tracking-[0.2em] text-red-500 uppercase mb-3">Action Required</p>
                <div className="space-y-3">
                  {redFlags.map((f, i) => (
                    <div key={i} className="border border-red-900/40 rounded-xl p-4 bg-[#0f0f0f]">
                      <p className="text-sm font-bold text-white mb-1">{f.action}</p>
                      <p className="text-xs text-[#666]">{f.reason}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {amberFlags.length > 0 && (
              <section className="mb-8">
                <p className="text-[10px] font-black tracking-[0.2em] text-amber-500 uppercase mb-3">Watch</p>
                <div className="space-y-3">
                  {amberFlags.map((f, i) => (
                    <div key={i} className="border border-amber-900/30 rounded-xl p-4 bg-[#0f0f0f]">
                      <p className="text-sm font-bold text-white mb-1">{f.action}</p>
                      <p className="text-xs text-[#666]">{f.reason}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ── Realignments ── */}
            {decree.realignments.length > 0 && decree.realignments[0].type !== "no_change" && (
              <section className="mb-10">
                <p className="text-[10px] font-black tracking-[0.2em] text-[#555] uppercase mb-4">Auto-Realignments</p>
                <div className="space-y-3">
                  {decree.realignments.map((r, i) => {
                    if (r.type === "no_change") return null;

                    let label = "";
                    if (r.type === "shift_release")
                      label = `${r.target} shifted ${r.days > 0 ? "+" : ""}${r.days} days`;
                    else if (r.type === "update_cycle_status")
                      label = `${r.track} moved to ${r.new_status}`;
                    else if (r.type === "set_focus_requirement")
                      label = `Focus requirement: ${r.hours}h today`;
                    else if (r.type === "set_touch_target")
                      label = `Outreach target adjusted to ${r.target}/week`;
                    else if (r.type === "set_priority")
                      label = `Priority set: ${r.priority}`;
                    else if (r.type === "flag_action")
                      label = r.action;

                    const reason = "reason" in r ? r.reason : "";

                    return (
                      <div key={i} className="border border-[#2a2a2a] rounded-xl p-4 bg-[#0f0f0f]">
                        <p className="text-sm font-bold text-white mb-1">{label}</p>
                        <p className="text-xs text-[#666] font-medium">{reason}</p>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-5xl mb-6 opacity-20">◯</div>
            <h2 className="text-xl font-black mb-2 tracking-tight">No decree yet.</h2>
            <p className="text-[#555] text-sm leading-relaxed font-medium mb-8">
              Oracle fires automatically on first app open each day.
            </p>
            {fireError && (
              <p className="text-red-400 text-xs font-bold mb-4">{fireError}</p>
            )}
            <button
              onClick={fireOracle}
              disabled={firing}
              className="px-8 py-3 rounded-xl bg-[#1a1a1a] border border-[#333] text-sm font-black tracking-widest text-white hover:bg-[#222] active:scale-95 transition-all disabled:opacity-50"
            >
              {firing ? "FIRING..." : "🔮 FIRE ORACLE"}
            </button>
          </div>
        )}

      </div>
    </main>
  );
}
