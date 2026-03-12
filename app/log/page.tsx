"use client";

// app/log/page.tsx
// Quick-Log — mobile-first real-time data entry with on-demand Oracle recalibration.
// Bookmark this page to your iPhone home screen for instant access.

import { useEffect, useState, useCallback } from "react";
import { getDailyLog, saveDailyLog, DailyLog, getStoreValue, setStoreValue, getTodayISO } from "@/lib/db";
import { getDayType, isStudioDay } from "@/lib/dayType";
import { recalibrateOracle, getCooldownRemaining } from "@/lib/recalibrate";
import type { OracleDecree } from "@/lib/oracle";
import { getWeekKey } from "@/lib/oracle";
import CheckItem from "@/components/CheckItem";

function fmt(ms: number): string {
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function HydrationSelector({ value, onChange }: { value: number | null; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          onClick={() => onChange(n)}
          className={`flex-1 h-11 rounded-xl text-sm font-black transition-all active:scale-95 ${
            value === n ? "bg-blue-500 text-white" : "bg-[#111] text-[#555] border border-[#222]"
          }`}
        >
          {n}
        </button>
      ))}
    </div>
  );
}

function TogglePill({
  label,
  checked,
  onChange,
  warn,
  dimmed,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  warn?: boolean;
  dimmed?: boolean;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border transition-all active:scale-[0.98] ${
        dimmed && !checked
          ? "border-[#1a1a1a] bg-transparent text-[#333]"
          : checked
          ? warn
            ? "border-red-500/50 bg-red-500/10 text-red-400"
            : "border-green-500/40 bg-green-500/8 text-white"
          : "border-[#222] bg-[#0d0d0d] text-[#888]"
      }`}
    >
      <span className="text-sm font-bold">{label}</span>
      <span
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
          checked
            ? warn
              ? "border-red-500 bg-red-500"
              : "border-green-500 bg-green-500"
            : "border-[#333]"
        }`}
      >
        {checked && <span className="text-[10px] font-black text-black">✓</span>}
      </span>
    </button>
  );
}

export default function QuickLogPage() {
  const [log, setLog] = useState<DailyLog | null>(null);
  const [dayType, setDayType] = useState("");
  const [ddHours, setDdHours] = useState("");
  const [ddRevenue, setDdRevenue] = useState("");
  const [ddStatus, setDdStatus] = useState("");
  const [oneThingInput, setOneThingInput] = useState("");

  // Recalibration state
  const [recalibStatus, setRecalibStatus] = useState<"idle" | "loading" | "done" | "cooldown" | "error">("idle");
  const [recalibDecree, setRecalibDecree] = useState<OracleDecree | null>(null);
  const [recalibMessage, setRecalibMessage] = useState("");
  const [cooldownMs, setCooldownMs] = useState(0);
  const [cooldownDisplay, setCooldownDisplay] = useState("");

  useEffect(() => {
    const init = async () => {
      const todayLog = await getDailyLog();
      setLog(todayLog);
      setOneThingInput(todayLog.oneThing);
      setDayType(getDayType());
      const remaining = await getCooldownRemaining();
      if (remaining > 0) {
        setCooldownMs(remaining);
        setRecalibStatus("cooldown");
      }
    };
    init();
  }, []);

  // Countdown timer for cooldown
  useEffect(() => {
    if (cooldownMs <= 0) return;
    setCooldownDisplay(fmt(cooldownMs));
    const interval = setInterval(() => {
      setCooldownMs((prev) => {
        const next = prev - 1000;
        if (next <= 0) {
          clearInterval(interval);
          setRecalibStatus("idle");
          setCooldownDisplay("");
          return 0;
        }
        setCooldownDisplay(fmt(next));
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldownMs]);

  const updateLog = useCallback(
    async (updates: Partial<DailyLog>) => {
      if (!log) return;
      const updated = { ...log, ...updates };
      setLog(updated);
      await saveDailyLog(updated);
    },
    [log]
  );

  const saveOneThing = useCallback(async () => {
    if (!log) return;
    await updateLog({ oneThing: oneThingInput });
  }, [log, oneThingInput, updateLog]);

  const submitDoorDash = async () => {
    if (!ddHours || !ddRevenue) return;
    setDdStatus("logging...");
    try {
      const res = await fetch("/api/doordash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: getTodayISO(),
          hours: parseFloat(ddHours),
          revenue: parseFloat(ddRevenue),
          gas: 0,
          tips: 0,
          miles: 0,
        }),
      });
      if (res.ok) {
        setDdStatus("logged ✓");
        setTimeout(() => {
          setDdStatus("");
          setDdHours("");
          setDdRevenue("");
        }, 2000);
      } else {
        setDdStatus("failed ✗");
      }
    } catch {
      setDdStatus("failed ✗");
    }
  };

  const handleRecalibrate = async () => {
    setRecalibStatus("loading");
    setRecalibDecree(null);
    setRecalibMessage("");

    const result = await recalibrateOracle();

    if (result.ok) {
      setRecalibDecree(result.decree);
      setRecalibStatus("done");
    } else if (result.reason === "cooldown") {
      setCooldownMs(result.cooldownRemaining);
      setRecalibStatus("cooldown");
    } else {
      setRecalibMessage(result.message);
      setRecalibStatus("error");
    }
  };

  if (!log) return null;
  const studioDay = isStudioDay(dayType as any);

  const severityColor =
    recalibDecree?.severity === "RED"
      ? "#ef4444"
      : recalibDecree?.severity === "AMBER"
      ? "#f59e0b"
      : "#22c55e";

  return (
    <main className="page animate-fade-in pb-28">
      <div className="page-inner">

        <header className="mb-8 text-center">
          <p className="text-[10px] font-black tracking-[0.2em] text-amber-500 uppercase mb-1">⚡ Quick Log</p>
          <p className="text-xs text-[#555] font-medium">tap what's done. recalibrate when ready.</p>
        </header>

        {/* ONE THING */}
        <section className="mb-4">
          <p className="text-[9px] font-black tracking-[0.2em] text-[#444] uppercase mb-2 px-1">Today's One Thing</p>
          <div className="card !py-3 !px-4">
            <input
              type="text"
              className="w-full bg-transparent text-base font-bold text-white outline-none placeholder-[#333]"
              value={oneThingInput}
              onChange={(e) => setOneThingInput(e.target.value)}
              onBlur={saveOneThing}
              onKeyDown={(e) => e.key === "Enter" && saveOneThing()}
              placeholder="the single move..."
            />
          </div>
        </section>

        {/* GRIND */}
        <section className="mb-4">
          <p className="text-[9px] font-black tracking-[0.2em] text-[#444] uppercase mb-2 px-1">Grind</p>
          <div className="space-y-2">
            <TogglePill
              label="Sovereignty Stack"
              checked={log.sovereigntyStack}
              onChange={(v) => updateLog({ sovereigntyStack: v })}
            />
            <TogglePill
              label="Movement"
              checked={log.movement}
              onChange={(v) => updateLog({ movement: v })}
            />
            <TogglePill
              label="Eucalyptus Steam"
              checked={log.eucalyptusStream}
              onChange={(v) => updateLog({ eucalyptusStream: v })}
              dimmed={!studioDay}
            />
            <TogglePill
              label="Sauna"
              checked={log.sauna}
              onChange={(v) => updateLog({ sauna: v })}
              dimmed={dayType !== "STUDIO + SAUNA DAY"}
            />
          </div>
          <div className="flex gap-2 mt-2">
            <div className="card flex-1 flex items-center justify-between p-3">
              <span className="text-[10px] font-black tracking-widest text-[#555] uppercase">Sleep</span>
              <input
                type="number"
                className="w-14 bg-transparent text-right font-black text-lg outline-none text-white"
                value={log.sleep || ""}
                onChange={(e) => updateLog({ sleep: parseFloat(e.target.value) || null })}
                placeholder="hrs"
              />
            </div>
            <div className="card flex-1 flex items-center justify-between p-3">
              <span className="text-[10px] font-black tracking-widest text-[#555] uppercase">Pushups</span>
              <input
                type="number"
                className="w-14 bg-transparent text-right font-black text-lg outline-none text-white"
                value={log.pushups || ""}
                onChange={(e) => updateLog({ pushups: parseInt(e.target.value) || null })}
                placeholder="0"
              />
            </div>
          </div>
        </section>

        {/* FUEL */}
        <section className="mb-4">
          <p className="text-[9px] font-black tracking-[0.2em] text-[#444] uppercase mb-2 px-1">Fuel</p>
          <div className="space-y-2">
            <TogglePill
              label="Pre-Session Fuel"
              checked={log.fuelPreSession}
              onChange={(v) => updateLog({ fuelPreSession: v })}
            />
            <TogglePill
              label="Mid-Session Fuel"
              checked={log.fuelMidSession}
              onChange={(v) => updateLog({ fuelMidSession: v })}
            />
            <TogglePill
              label="Post-Session Fuel"
              checked={log.fuelPostSession}
              onChange={(v) => updateLog({ fuelPostSession: v })}
            />
            <TogglePill
              label="Dairy Before Vocals"
              checked={log.fuelDairyFlag}
              onChange={(v) => updateLog({ fuelDairyFlag: v })}
              warn={true}
              dimmed={!studioDay}
            />
          </div>
          <div className="card flex items-center justify-between p-3 mt-2">
            <span className="text-[10px] font-black tracking-widest text-[#555] uppercase">Hydration</span>
            <HydrationSelector value={log.fuelHydration} onChange={(v) => updateLog({ fuelHydration: v })} />
          </div>
        </section>

        {/* DOORDASH */}
        <section className="mb-6">
          <div className="flex justify-between items-center mb-2 px-1">
            <p className="text-[9px] font-black tracking-[0.2em] text-[#444] uppercase">DoorDash</p>
            {ddStatus && (
              <span
                className={`text-[10px] font-black tracking-widest ${
                  ddStatus.includes("✓") ? "text-green-500" : ddStatus.includes("✗") ? "text-red-500" : "text-amber-500"
                }`}
              >
                {ddStatus.toUpperCase()}
              </span>
            )}
          </div>
          <div className="card flex gap-2 p-2">
            <input
              type="number"
              placeholder="Hrs"
              className="flex-1 bg-[#111] rounded-xl p-3 text-center text-sm font-black outline-none border border-transparent focus:border-[#333] text-white"
              value={ddHours}
              onChange={(e) => setDdHours(e.target.value)}
            />
            <input
              type="number"
              placeholder="$ Rev"
              className="flex-1 bg-[#111] rounded-xl p-3 text-center text-sm font-black outline-none border border-transparent focus:border-[#333] text-white"
              value={ddRevenue}
              onChange={(e) => setDdRevenue(e.target.value)}
            />
            <button
              onClick={submitDoorDash}
              disabled={!!ddStatus}
              className="w-12 flex items-center justify-center rounded-xl bg-amber-500 text-black font-black active:scale-95 transition-all text-xl disabled:opacity-40"
            >
              +
            </button>
          </div>
        </section>

        {/* RECALIBRATE */}
        <section className="mb-6">
          <p className="text-[9px] font-black tracking-[0.2em] text-[#444] uppercase mb-3 px-1">Oracle</p>

          <button
            onClick={handleRecalibrate}
            disabled={recalibStatus === "loading" || recalibStatus === "cooldown"}
            className={`w-full py-4 rounded-2xl font-black tracking-widest text-sm uppercase transition-all active:scale-[0.98] ${
              recalibStatus === "done"
                ? "bg-green-500/15 border border-green-500/40 text-green-400"
                : recalibStatus === "cooldown"
                ? "bg-[#111] border border-[#222] text-[#444] cursor-not-allowed"
                : recalibStatus === "error"
                ? "bg-red-500/10 border border-red-500/30 text-red-400"
                : recalibStatus === "loading"
                ? "bg-amber-500/10 border border-amber-500/30 text-amber-400"
                : "bg-amber-500 text-black hover:bg-amber-400"
            }`}
          >
            {recalibStatus === "loading"
              ? "⚡ Recalibrating..."
              : recalibStatus === "done"
              ? "✓ Recalibrated"
              : recalibStatus === "cooldown"
              ? `cooldown ${cooldownDisplay}`
              : recalibStatus === "error"
              ? "retry recalibrate"
              : "⚡ Recalibrate Now"}
          </button>

          {recalibStatus === "error" && recalibMessage && (
            <p className="text-[11px] text-red-500/70 text-center mt-2 px-2">{recalibMessage}</p>
          )}

          {recalibDecree && recalibStatus === "done" && (
            <div
              className="mt-4 card !p-4 border"
              style={{ borderColor: `${severityColor}30`, backgroundColor: `${severityColor}08` }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="text-[9px] font-black tracking-[0.15em] uppercase px-2 py-0.5 rounded"
                  style={{ color: severityColor, backgroundColor: `${severityColor}20` }}
                >
                  {recalibDecree.severity}
                </span>
                <span className="text-[10px] font-black tracking-widest text-[#555] uppercase">
                  Oracle Decree
                </span>
              </div>
              <p className="text-sm font-bold text-[#ccc] leading-relaxed mb-2">{recalibDecree.oracle_message}</p>
              {recalibDecree.realignments.filter((r) => r.type !== "no_change").length > 0 && (
                <div className="mt-3 pt-3 border-t border-[#1a1a1a]">
                  <p className="text-[9px] font-black tracking-[0.15em] text-[#555] uppercase mb-2">Realignments</p>
                  <div className="space-y-1">
                    {recalibDecree.realignments
                      .filter((r) => r.type !== "no_change")
                      .map((r, i) => (
                        <p key={i} className="text-[11px] text-[#777]">
                          {"reason" in r ? `→ ${r.reason}` : ""}
                        </p>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

      </div>
    </main>
  );
}
