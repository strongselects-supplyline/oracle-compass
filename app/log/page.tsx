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
import { ALL_TRACKS, PHASE_LABELS, PHASE_ORDER, TrackPhase, getTrackStatuses, TrackProductionStatus } from "@/lib/planner";
import { logStudioSessionAndAdvance, getTodaySessions, StudioSessionEntry } from "@/lib/studioLog";

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
            : "border-green-500/40 bg-green-500/[0.08] text-white"
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

  // Studio track logging state
  const [trackStatuses, setTrackStatuses] = useState<TrackProductionStatus[]>([]);
  const [todaySessions, setTodaySessions] = useState<StudioSessionEntry[]>([]);
  const [activeTrack, setActiveTrack] = useState<string | null>(null);
  const [trackHours, setTrackHours] = useState("");
  const [trackPhase, setTrackPhase] = useState<TrackPhase>("not_started");
  const [studioLogStatus, setStudioLogStatus] = useState<"" | "saving" | "saved" | "error">("");

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
      // Load track statuses + today's sessions
      const statuses = await getTrackStatuses();
      setTrackStatuses(statuses);
      const sessions = await getTodaySessions();
      setTodaySessions(sessions);
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
        // Sync to DailyTelemetry so Kill List telemetry panel stays coherent
        const { getDailyTelemetry, saveDailyTelemetry } = await import("@/lib/db");
        const tel = await getDailyTelemetry();
        tel.doordash_earned += parseFloat(ddRevenue) || 0;
        await saveDailyTelemetry(tel);
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

  const handleTrackSelect = (trackName: string) => {
    if (activeTrack === trackName) {
      setActiveTrack(null);
      setTrackPhase("not_started");
      return;
    }
    setActiveTrack(trackName);
    const status = trackStatuses.find(t => t.name === trackName);
    setTrackPhase(status?.phase || "not_started");
    setTrackHours("");
    setStudioLogStatus("");
  };

  const submitStudioSession = async () => {
    if (!activeTrack || !trackHours) return;
    setStudioLogStatus("saving");
    try {
      const entry = await logStudioSessionAndAdvance(
        activeTrack,
        parseFloat(trackHours),
        trackPhase,
        log?.sessionType || "",
        log?.sessionQuality || null
      );
      // Refresh local state
      const updatedStatuses = await getTrackStatuses();
      setTrackStatuses(updatedStatuses);
      setTodaySessions(prev => [...prev, entry]);
      setStudioLogStatus("saved");
      setTimeout(() => {
        setActiveTrack(null);
        setTrackHours("");
        setStudioLogStatus("");
      }, 2000);
    } catch {
      setStudioLogStatus("error");
    }
  };

  const todayTotalHours = todaySessions.reduce((sum, s) => sum + s.hours, 0);

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

        {/* SESSION INTELLIGENCE */}
        {studioDay && (
          <section className="mb-4">
            <p className="text-[9px] font-black tracking-[0.2em] text-[#444] uppercase mb-2 px-1">Session</p>
            <div className="card flex items-center justify-between p-3 mb-2">
              <span className="text-[10px] font-black tracking-widest text-[#555] uppercase">Quality</span>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => updateLog({ sessionQuality: n })}
                    className={`w-9 h-9 rounded-xl text-sm font-black transition-all active:scale-95 ${
                      log.sessionQuality === n
                        ? n <= 2 ? "bg-red-500 text-white" : n <= 3 ? "bg-amber-500 text-black" : "bg-green-500 text-black"
                        : "bg-[#111] text-[#555] border border-[#222]"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              {(["recording", "mixing", "mastering", "writing"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => updateLog({ sessionType: log.sessionType === t ? "" : t })}
                  className={`flex-1 py-2.5 rounded-xl text-[9px] font-black tracking-wider uppercase transition-all active:scale-95 ${
                    log.sessionType === t
                      ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20"
                      : "bg-[#0d0d0d] text-[#555] border border-[#222]"
                  }`}
                >
                  {t.slice(0, 3)}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* STUDIO TRACK LOG */}
        <section className="mb-4">
          <div className="flex justify-between items-center mb-2 px-1">
            <p className="text-[9px] font-black tracking-[0.2em] text-[#444] uppercase">Track Log</p>
            {todayTotalHours > 0 && (
              <span className="text-[10px] font-black tracking-widest text-amber-500">
                {todayTotalHours}h today
              </span>
            )}
          </div>

          {/* Track selector grid */}
          <div className="grid grid-cols-3 gap-1.5 mb-3">
            {trackStatuses.map((t) => (
              <button
                key={t.name}
                onClick={() => handleTrackSelect(t.name)}
                className={`py-2.5 px-1 rounded-xl text-[8px] font-black tracking-wider uppercase transition-all active:scale-95 leading-tight ${
                  activeTrack === t.name
                    ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20"
                    : t.phase === "done"
                    ? "bg-green-500/15 border border-green-500/30 text-green-500"
                    : t.phase !== "not_started"
                    ? "bg-[#1a1a1a] border border-amber-500/30 text-amber-400"
                    : "bg-[#0d0d0d] text-[#555] border border-[#222]"
                }`}
              >
                <span className="block truncate">{t.name}</span>
                <span className="block text-[7px] mt-0.5 opacity-60">{PHASE_LABELS[t.phase]}</span>
              </button>
            ))}
          </div>

          {/* Active track input panel */}
          {activeTrack && (
            <div className="card !p-3 border border-amber-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-400 uppercase tracking-wider">{activeTrack}</span>
                {studioLogStatus && (
                  <span className={`text-[10px] font-black tracking-widest ${
                    studioLogStatus === "saved" ? "text-green-500" : studioLogStatus === "error" ? "text-red-500" : "text-amber-500"
                  }`}>
                    {studioLogStatus === "saving" ? "SAVING..." : studioLogStatus === "saved" ? "LOGGED ✓" : "FAILED ✗"}
                  </span>
                )}
              </div>

              {/* Hours input */}
              <div className="flex items-center gap-3">
                <span className="text-[9px] font-black tracking-widest text-[#555] uppercase w-14">Hours</span>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="6"
                  className="flex-1 bg-[#111] rounded-xl p-3 text-center text-sm font-black outline-none border border-transparent focus:border-amber-500/30 text-white"
                  value={trackHours}
                  onChange={(e) => setTrackHours(e.target.value)}
                  placeholder="0.0"
                />
              </div>

              {/* Phase selector */}
              <div>
                <span className="text-[9px] font-black tracking-widest text-[#555] uppercase block mb-1.5">Phase</span>
                <div className="flex gap-1.5">
                  {PHASE_ORDER.filter(p => p !== "not_started").map((p) => (
                    <button
                      key={p}
                      onClick={() => setTrackPhase(p)}
                      className={`flex-1 py-2 rounded-xl text-[8px] font-black tracking-wider uppercase transition-all active:scale-95 ${
                        trackPhase === p
                          ? p === "done" ? "bg-green-500 text-black" : "bg-amber-500 text-black"
                          : "bg-[#111] text-[#555] border border-[#222]"
                      }`}
                    >
                      {PHASE_LABELS[p]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button
                onClick={submitStudioSession}
                disabled={!trackHours || studioLogStatus === "saving"}
                className="w-full py-3 rounded-xl bg-amber-500 text-black font-black tracking-widest text-xs uppercase transition-all active:scale-[0.98] disabled:opacity-30"
              >
                Log Session
              </button>
            </div>
          )}

          {/* Today's session feed */}
          {todaySessions.length > 0 && !activeTrack && (
            <div className="mt-2 space-y-1">
              {todaySessions.map((s) => (
                <div key={s.id} className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#0a0a0a] border border-[#1a1a1a]">
                  <span className="text-[10px] font-bold text-[#888]">{s.trackName}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black text-[#555] uppercase">{PHASE_LABELS[s.phaseAfter]}</span>
                    <span className="text-[10px] font-black text-amber-500">{s.hours}h</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* LIFE BALANCE */}
        <section className="mb-4">
          <p className="text-[9px] font-black tracking-[0.2em] text-[#444] uppercase mb-2 px-1">Balance</p>
          <div className="space-y-2">
            <TogglePill
              label="Personal / Recovery Time"
              checked={log.personalTime}
              onChange={(v) => updateLog({ personalTime: v })}
            />
            <TogglePill
              label="Sunday Batch Prep"
              checked={log.batchPrepDone}
              onChange={(v) => updateLog({ batchPrepDone: v })}
              dimmed={new Date().getDay() !== 0}
            />
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
        <div className="mt-12 mb-6 pt-10 border-t border-[#1a1a1a]">
          <p className="text-[10px] font-black tracking-[0.3em] text-[#555] text-center uppercase mb-6 px-1">Oracle Recalibration</p>

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
        </div>
      </div>
    </main>
  );
}
