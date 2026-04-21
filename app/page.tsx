"use client";

// app/page.tsx — TODAY
// 90-second morning ignition. One Thing → Protocol → 4-step Morning Stack → Execute CTA.
// Progressive flow: each section auto-collapses when complete, revealing the next.
// Sync fires automatically after Journal LOCK IN — no separate tap needed.
//
// v24 redesign (Apr 12, 2026):
//   - Removed KPI row, Weekly Mirror, Lane Dashboard, Audience Ledger, DoorDash Quick-Add
//   - Protocol auto-expands before 11 AM
//   - Morning logging is now a 4-step progressive flow
//   - Kill List CTA is auto-computed (red count drives urgency)

import { useEffect, useState, useCallback } from "react";
import { getDayType, isSacredDay, isStudioDay } from "@/lib/dayType";
import { getDailyLog, saveDailyLog, DailyLog } from "@/lib/db";
import { getDynamicReleases, Release, EP_RELEASE_DATE, EP_HONEYMOON_DAYS } from "@/lib/releases";
import { useCloudSync } from "@/lib/useCloudSync";
import type { OracleDecree } from "@/lib/oracle";
import { getStoreValue, getTodayISO } from "@/lib/db";
import { useKillList } from "@/components/KillListProvider";
import { getSundayChecklist, saveSundayChecklist, isGriefProtocolActive } from "@/lib/planner";
import { getWeekKey } from "@/lib/oracle";
import CheckItem from "@/components/CheckItem";
import TodayPlan from "@/components/TodayPlan";
import Link from "next/link";

type ProtocolStep = { icon: string; action: string; tab?: string };

function getProtocolSteps(dayType: string): { tagline: string; steps: ProtocolStep[] } {
  if (dayType === "STUDIO + SAUNA DAY") return {
    tagline: "Split-Block Studio + Thermal Reset + DD Sprints.",
    steps: [
      { icon: "🚗", action: "6 AM → DD Morning Sprint (1hr)" },
      { icon: "☀️", action: "7 AM → Sovereignty Stack → log below" },
      { icon: "🎹", action: "10 AM → Studio Block 1 (mix/vocals)" },
      { icon: "🚗", action: "12 PM → DD Midday Sprint (2hrs)" },
      { icon: "🎤", action: "2 PM → Studio Block 2" },
      { icon: "🔥", action: "4 PM → Sauna (thermal reset)" },
      { icon: "🚗", action: "5:30 PM → DD Evening Sprint (2-3hrs)" },
      { icon: "📱", action: "Post content from STUDIO queue", tab: "studio" },
    ],
  };
  if (dayType === "STUDIO DAY") return {
    tagline: "Split-Block Studio + DD Sprints. No Distractions.",
    steps: [
      { icon: "🚗", action: "6 AM → DD Morning Sprint (1hr)" },
      { icon: "☀️", action: "7 AM → Sovereignty Stack → log below" },
      { icon: "🎹", action: "10 AM → Studio Block 1 (mix/vocals)" },
      { icon: "🚗", action: "12 PM → DD Midday Sprint (2hrs)" },
      { icon: "🎤", action: "2 PM → Studio Block 2" },
      { icon: "🚗", action: "5:30 PM → DD Evening Sprint (2-3hrs)" },
      { icon: "📱", action: "Post content from STUDIO queue", tab: "studio" },
    ],
  };
  if (dayType === "BIZ DAY") return {
    tagline: "Pipeline moves + DD Sprints. ENGINE is Track 1.",
    steps: [
      { icon: "🚗", action: "6 AM → DD Morning Sprint (1hr)" },
      { icon: "☀️", action: "7 AM → Sovereignty Stack → log below" },
      { icon: "⚙️", action: "9 AM → ENGINE: pipeline tasks", tab: "engine" },
      { icon: "📱", action: "9:30 AM → IG Community Sprint — 20 min", tab: "kill" },
      { icon: "🚗", action: "12 PM → DD Midday Sprint (2hrs)" },
      { icon: "📤", action: "3 PM → Push content to IG/TikTok/YouTube" },
      { icon: "🚗", action: "5:30 PM → DD Evening Sprint (2-3hrs)" },
    ],
  };
  return { tagline: "", steps: [] };
}

function HydrationSelector({ value, onChange }: { value: number | null; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1.5">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          onClick={() => onChange(n)}
          className={`flex-1 h-10 rounded-lg text-sm font-black transition-all active:scale-95 ${
            value === n ? "bg-blue-500 text-white" : "bg-[#111] text-[#555] border border-[#222]"
          }`}
        >
          {n}
        </button>
      ))}
    </div>
  );
}

// Step completion indicator
function StepCheck({ done }: { done: boolean }) {
  return (
    <div
      className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
        done ? "bg-green-500 border-green-500" : "border-2 border-[#333]"
      }`}
    >
      {done && <span className="text-black text-[10px] font-black">✓</span>}
    </div>
  );
}

export default function TodayPage() {
  const [log, setLog] = useState<DailyLog | null>(null);
  const [decree, setDecree] = useState<OracleDecree | null>(null);
  const [dayType, setDayType] = useState<string>("");
  const [dateStr, setDateStr] = useState<string>("");
  const [isEditingOneThing, setIsEditingOneThing] = useState(false);
  const [oneThingInput, setOneThingInput] = useState("");
  const [nextRelease, setNextRelease] = useState<Release | null>(null);
  const [daysUntilRelease, setDaysUntilRelease] = useState<number>(0);
  const [isPostRelease, setIsPostRelease] = useState(false);
  const [honeymoonDaysIn, setHoneymoonDaysIn] = useState(0);
  const { syncStatus, sync: handleSync } = useCloudSync();
  const { killStats } = useKillList();
  const killRedCount = killStats?.redRemaining ?? 0;
  const killTotalRemaining = (killStats?.total ?? 0) - (killStats?.cleared ?? 0);

  // Grief protocol
  const [griefJournalDone, setGriefJournalDone] = useState(false);
  const [griefProtocolActive, setGriefProtocolActive] = useState(false);

  // Morning step — 0=sovereign, 1=fuel, 2=numbers, 3=journal, 4=done
  const [morningStep, setMorningStep] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [lockInStatus, setLockInStatus] = useState<"idle" | "syncing" | "done">("idle");

  useEffect(() => {
    const init = async () => {
      const todayLog = await getDailyLog();
      setLog(todayLog);
      setOneThingInput(todayLog.oneThing || "");
      setDayType(getDayType());

      const d = new Date();
      setDateStr(d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }));

      const releases = await getDynamicReleases();
      const now = new Date();
      const epDate = new Date(EP_RELEASE_DATE);
      const daysSinceEP = Math.floor((now.getTime() - epDate.getTime()) / 86400000);

      if (daysSinceEP >= 0) {
        // EP has dropped — enter honeymoon state
        setIsPostRelease(true);
        setHoneymoonDaysIn(daysSinceEP);
      } else {
        // Pre-release — prefer ALL LOVE (EP) entity for the banner
        const epRelease = releases.find(r => r.title === "ALL LOVE (EP)") || null;
        const fallback = releases.find(r => new Date(r.releaseDate) >= now && r.status !== "live") || releases[releases.length - 1];
        const next = epRelease?.status !== "live" ? epRelease : fallback;
        setNextRelease(next ?? null);
        if (next) setDaysUntilRelease(Math.max(Math.ceil((new Date(next.releaseDate).getTime() - now.getTime()) / 86400000), 0));
      }

      setDecree(await getStoreValue<OracleDecree>(`oracle_decree:${getTodayISO()}`));

      // Grief protocol
      const griefNow = new Date();
      setGriefProtocolActive(isGriefProtocolActive(griefNow));
      if (isGriefProtocolActive(griefNow)) {
        const checklist = await getSundayChecklist(getWeekKey());
        setGriefJournalDone(checklist.griefJournalDone ?? false);
      }

      // Restore morning step from existing log state
      if (todayLog.journalLine) {
        setMorningStep(4);
      } else if (todayLog.sleep || todayLog.pushups) {
        setMorningStep(3);
      } else if (todayLog.fuelPreSession || todayLog.fuelMidSession || todayLog.fuelPostSession) {
        setMorningStep(2);
      } else if (todayLog.sovereigntyStack || todayLog.movement) {
        setMorningStep(1);
      }
    };
    init();
  }, []);

  const updateLog = useCallback(async (updates: Partial<DailyLog>) => {
    if (!log) return;
    const updated = { ...log, ...updates };
    setLog(updated);
    await saveDailyLog(updated);
  }, [log]);

  const handleSaveOneThing = async () => {
    if (!log) return;
    const updated = { ...log, oneThing: oneThingInput };
    await saveDailyLog(updated);
    setLog(updated);
    setIsEditingOneThing(false);
  };

  const handleLockIn = async () => {
    if (!log) return;
    setMorningStep(4);
    setLockInStatus("syncing");
    try {
      await handleSync(log, dayType);
      setLockInStatus("done");
    } catch {
      setLockInStatus("done");
    }
  };

  if (!log) return null;

  const isSacred = isSacredDay(dayType as any);
  const studioDay = isStudioDay(dayType as any);
  const hour = new Date().getHours();
  const protocol = getProtocolSteps(dayType);
  const showProtocolExpanded = hour < 11;

  const fuelLabels = decree?.dietary_alignment ? decree.dietary_alignment : {
    pre: { label: "Pre-Session Fuel", desc: "Breakfast protocol not set by Oracle." },
    mid: { label: "Mid-Session Fuel", desc: "Mid-day protocol not set by Oracle." },
    post: { label: "Post-Session Fuel", desc: "Evening protocol not set by Oracle." },
    warning: null,
  };

  // Step completion checks
  const sovereigntyDone = !!(log.sovereigntyStack && log.movement);
  const fuelDone = !!(log.fuelPreSession && log.fuelMidSession && log.fuelPostSession);
  const numbersDone = !!(log.sleep && log.pushups);
  const journalDone = !!(log.journalLine && log.journalLine.trim().length > 0);

  // Auto-advance logic
  const autoAdvance = (checkDone: boolean, nextStep: 0 | 1 | 2 | 3 | 4, currentStep: 0 | 1 | 2 | 3 | 4) => {
    if (checkDone && morningStep === currentStep) {
      setTimeout(() => setMorningStep(nextStep), 600);
    }
  };

  const updateLogAndCheck = async (updates: Partial<DailyLog>, afterStep?: () => void) => {
    await updateLog(updates);
    if (afterStep) afterStep();
  };

  return (
    <main className="page animate-fade-in pb-20">
      <div className="page-inner">

        {/* Release banner — pre/post release states */}
        {isPostRelease && honeymoonDaysIn <= EP_HONEYMOON_DAYS ? (
          <div className="alert-banner mb-6 !p-3" style={{ borderColor: "rgba(212,168,83,0.4)", background: "rgba(212,168,83,0.04)" }}>
            <span className="mr-2">✨</span>
            <div className="flex-1">
              <span className="font-black text-sm" style={{ color: "#d4a853" }}>ALL LOVE — LIVE</span>
              {" — "}
              <span className="text-[11px]" style={{ color: "rgba(212,168,83,0.7)" }}>Honeymoon Phase · Day {honeymoonDaysIn + 1} of {EP_HONEYMOON_DAYS}</span>
            </div>
          </div>
        ) : !isPostRelease && daysUntilRelease <= 7 && nextRelease && nextRelease.status !== "live" ? (
          <div className="alert-banner alert-banner-red mb-6 !p-3">
            <span className="animate-pulse-glow mr-2">🔴</span>
            <div className="flex-1">
              <span className="font-black text-sm">{nextRelease.title}</span>{" — "}
              {daysUntilRelease === 0 ? "OUT TODAY" : `${daysUntilRelease}d OUT`}
            </div>
          </div>
        ) : null}

        {/* Day-type header */}
        <header className="mb-6 text-center">
          <p className="text-lg font-black tracking-tight text-white uppercase">{dayType || dateStr}</p>
          <p className="text-[10px] font-bold tracking-[0.15em] text-[#555] uppercase mt-1">{dateStr}</p>
        </header>

        {/* Sovereign Scroll — TodayPlan */}
        <TodayPlan />

        {isSacred ? (
          /* ── SUNDAY — sacred gate ── */
          <div className="text-center mt-12">
            <div className="text-6xl mb-6">🛑</div>
            <h2 className="text-xl font-black mb-2">Sunday is sacred.</h2>
            <p className="text-[#666] text-sm leading-relaxed">Zero building.<br />Nadi Shodhana. Rest.<br />The week depends on this.</p>

            {griefProtocolActive && (
              <div className="mt-8 mx-auto max-w-xs text-left">
                <p className="text-[10px] font-black tracking-[0.2em] text-[#444] uppercase mb-3">Grief Protocol</p>
                <button
                  onClick={async () => {
                    const next = !griefJournalDone;
                    setGriefJournalDone(next);
                    const checklist = await getSundayChecklist(getWeekKey());
                    await saveSundayChecklist({ ...checklist, griefJournalDone: next });
                  }}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                    griefJournalDone ? "border-green-500/30 bg-green-500/5" : "border-[#222] bg-[#0a0a0a]"
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${griefJournalDone ? "border-green-500 bg-green-500" : "border-[#444]"}`}>
                    {griefJournalDone && <span className="text-black text-xs font-black">✓</span>}
                  </span>
                  <div>
                    <p className={`text-sm font-bold ${griefJournalDone ? "text-green-400" : "text-white"}`}>Write to your father — 20 min</p>
                    <p className="text-[11px] text-[#555] mt-0.5">What you'd say. What you'd ask. What you grieve.</p>
                  </div>
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* ── ONE THING — ignition key ── */}
            <section
              className={`mb-6 card !py-6 text-center transition-all active:scale-[0.98] cursor-pointer ${!log.oneThing ? "border-dashed border-amber-500/30 bg-amber-500/[0.02]" : ""}`}
              onClick={() => !isEditingOneThing && setIsEditingOneThing(true)}
              aria-label="Set today's one thing"
            >
              <p className="text-[10px] font-black tracking-[0.2em] text-amber-500 uppercase mb-3">Today's One Thing</p>
              {isEditingOneThing ? (
                <input
                  autoFocus
                  type="text"
                  className="w-full bg-transparent text-xl font-black text-center text-white outline-none placeholder-[#333]"
                  value={oneThingInput}
                  onChange={e => setOneThingInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSaveOneThing()}
                  onBlur={handleSaveOneThing}
                  placeholder="The single move..."
                />
              ) : (
                <p className={`text-xl font-black leading-tight tracking-tight px-4 ${log.oneThing ? "text-white" : "text-[#555] opacity-60"}`}>
                  {log.oneThing || "Tap to define the single move →"}
                </p>
              )}
            </section>

            {/* ── PROTOCOL — auto-expanded before 11 AM ── */}
            {protocol.steps.length > 0 && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3 px-1">
                  <h3 className="text-[10px] font-black tracking-[0.2em] text-[#555] uppercase">{dayType}</h3>
                  <span className="text-[10px] text-[#444] font-bold">{protocol.tagline}</span>
                </div>
                {showProtocolExpanded && (
                  <div className="card !p-0 overflow-hidden divide-y divide-[#1a1a1a] animate-fade-in">
                    {protocol.steps.map((step, i) => (
                      <div key={i} className="flex items-center gap-3 px-4 py-3.5">
                        <span className="text-lg">{step.icon}</span>
                        <span className="text-[12px] font-bold text-[#ccc] leading-snug flex-1">{step.action}</span>
                        {step.tab && (
                          <span className="text-[8px] font-black tracking-widest text-amber-500/70 uppercase bg-amber-500/10 px-1.5 py-0.5 rounded">
                            {step.tab}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── EXECUTE CTA — auto-computed from kill stats ── */}
            <Link href="/kill" className="block mb-6">
              <div className={`card !p-4 text-center transition-all active:scale-[0.98] ${
                killRedCount > 0
                  ? "border-red-500/40 bg-red-500/[0.03] hover:border-red-500/60"
                  : killTotalRemaining > 0
                  ? "border-amber-500/30 hover:border-amber-500/50"
                  : "border-green-500/20 hover:border-green-500/30"
              }`}>
                {killRedCount > 0 ? (
                  <>
                    <p className="text-sm font-black text-red-400">{killRedCount} RED TASK{killRedCount > 1 ? "S" : ""} → EXECUTE</p>
                    <p className="text-[10px] text-[#555] mt-0.5">Urgent items on the kill list</p>
                  </>
                ) : killTotalRemaining > 0 ? (
                  <>
                    <p className="text-sm font-black text-amber-400">{killTotalRemaining} TASK{killTotalRemaining > 1 ? "S" : ""} → EXECUTE</p>
                    <p className="text-[10px] text-[#555] mt-0.5">Open the kill list</p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-black text-green-400">KILL LIST CLEAR ✓</p>
                    <p className="text-[10px] text-[#555] mt-0.5">Execute freely</p>
                  </>
                )}
              </div>
            </Link>

            {/* ── MORNING STACK — 4-step progressive flow ── */}
            <div className="mb-8">
              <h3 className="text-[10px] font-black tracking-[0.2em] text-[#555] uppercase mb-4 px-1">Morning Stack</h3>

              {/* Step progress row — aria-live so screen readers announce completion */}
              <div className="flex items-center gap-2 mb-5 px-1" aria-live="polite" aria-label="Morning stack progress">
                {[
                  { label: "Sovereign", done: sovereigntyDone },
                  { label: "Fuel", done: fuelDone },
                  { label: "Numbers", done: numbersDone },
                  { label: "Journal", done: journalDone },
                ].map((s, i) => (
                  <div
                    key={i}
                    className={`flex-1 flex flex-col items-center gap-1 cursor-pointer transition-all active:scale-95`}
                    onClick={() => setMorningStep(i as 0 | 1 | 2 | 3)}
                    role="button"
                    aria-label={`${s.label} step — ${s.done ? "complete" : "incomplete"}`}
                    tabIndex={0}
                    onKeyDown={e => e.key === "Enter" && setMorningStep(i as 0 | 1 | 2 | 3)}
                  >
                    <StepCheck done={s.done} />
                    <span
                      className="text-[8px] font-black tracking-wider uppercase"
                      style={{ color: s.done ? "#22c55e" : morningStep === i ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.2)" }}
                    >
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* ── STEP 0: Sovereignty Stack ── */}
              {morningStep === 0 && (
                <div className="animate-fade-in">
                  <div className="card !p-1.5 mb-3">
                    <CheckItem
                      label="Sovereignty Stack"
                      description="Trataka, breathwork, mullein tea, cold shower."
                      checked={log.sovereigntyStack}
                      onChange={async v => {
                        await updateLog({ sovereigntyStack: v });
                        if (v && log.movement) autoAdvance(true, 1, 0);
                      }}
                    />
                    <CheckItem
                      label="Movement (Pre-DAW)"
                      description="Lift, run, or deep stretch — sweat required."
                      checked={log.movement}
                      onChange={async v => {
                        await updateLog({ movement: v });
                        if (v && log.sovereigntyStack) autoAdvance(true, 1, 0);
                      }}
                    />
                    <CheckItem
                      label="Eucalyptus Steam"
                      description="Clear the lungs for vocal performance."
                      dimmed={!studioDay}
                      checked={log.eucalyptusStream}
                      onChange={v => updateLog({ eucalyptusStream: v })}
                    />
                    <CheckItem
                      label="Sauna"
                      dimmed={dayType !== "STUDIO + SAUNA DAY"}
                      checked={log.sauna}
                      onChange={v => updateLog({ sauna: v })}
                    />
                  </div>
                  <button
                    onClick={() => setMorningStep(1)}
                    className="w-full py-3 rounded-xl text-[11px] font-black tracking-widest uppercase transition-all active:scale-95"
                    style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    NEXT — FUEL →
                  </button>
                </div>
              )}

              {/* Completed step 0 summary */}
              {morningStep > 0 && (
                <button
                  onClick={() => setMorningStep(0)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border mb-2 transition-all ${
                    sovereigntyDone ? "border-green-500/20 bg-green-500/[0.03]" : "border-[#1a1a1a]"
                  }`}
                >
                  <StepCheck done={sovereigntyDone} />
                  <span className="text-[11px] font-bold" style={{ color: sovereigntyDone ? "#22c55e" : "rgba(255,255,255,0.4)" }}>
                    Sovereignty Stack {sovereigntyDone ? "✓" : "— tap to complete"}
                  </span>
                </button>
              )}

              {/* ── STEP 1: Fuel ── */}
              {morningStep === 1 && (
                <div className="animate-fade-in">
                  {fuelLabels.warning && (
                    <div className="mb-3 p-2 bg-red-500/10 border border-red-500/20 rounded-lg text-xs font-bold text-red-500 flex items-center gap-2">
                      <span>⚠️</span> {fuelLabels.warning}
                    </div>
                  )}
                  <div className="card !p-1.5 mb-3">
                    <CheckItem
                      label={fuelLabels.pre.label}
                      description={fuelLabels.pre.desc}
                      checked={log.fuelPreSession}
                      onChange={async v => {
                        await updateLog({ fuelPreSession: v });
                        if (v && log.fuelMidSession && log.fuelPostSession) autoAdvance(true, 2, 1);
                      }}
                    />
                    <CheckItem
                      label={fuelLabels.mid.label}
                      description={fuelLabels.mid.desc}
                      checked={log.fuelMidSession}
                      onChange={async v => {
                        await updateLog({ fuelMidSession: v });
                        if (v && log.fuelPreSession && log.fuelPostSession) autoAdvance(true, 2, 1);
                      }}
                    />
                    <CheckItem
                      label={fuelLabels.post.label}
                      description={fuelLabels.post.desc}
                      checked={log.fuelPostSession}
                      onChange={async v => {
                        await updateLog({ fuelPostSession: v });
                        if (v && log.fuelPreSession && log.fuelMidSession) autoAdvance(true, 2, 1);
                      }}
                    />
                    <CheckItem
                      label="Dairy Before Vocals"
                      description="Thickens mucus on cords. Flag if yes."
                      checked={log.fuelDairyFlag}
                      onChange={v => updateLog({ fuelDairyFlag: v })}
                      warn={true}
                      dimmed={!studioDay}
                    />
                  </div>
                  <div className="card flex items-center justify-between p-3 mb-3">
                    <span className="text-[10px] font-black tracking-widest text-[#555] uppercase">Hydration</span>
                    <HydrationSelector value={log.fuelHydration} onChange={v => updateLog({ fuelHydration: v })} />
                  </div>
                  <button
                    onClick={() => setMorningStep(2)}
                    className="w-full py-3 rounded-xl text-[11px] font-black tracking-widest uppercase transition-all active:scale-95"
                    style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    NEXT — NUMBERS →
                  </button>
                </div>
              )}

              {morningStep > 1 && (
                <button
                  onClick={() => setMorningStep(1)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border mb-2 transition-all ${
                    fuelDone ? "border-green-500/20 bg-green-500/[0.03]" : "border-[#1a1a1a]"
                  }`}
                >
                  <StepCheck done={fuelDone} />
                  <span className="text-[11px] font-bold" style={{ color: fuelDone ? "#22c55e" : "rgba(255,255,255,0.4)" }}>
                    Fuel {fuelDone ? "✓" : "— tap to complete"}
                  </span>
                </button>
              )}

              {/* ── STEP 2: Numbers ── */}
              {morningStep === 2 && (
                <div className="animate-fade-in">
                  <div className="flex gap-2 mb-3">
                    <div className="card flex-1 flex items-center justify-between p-3">
                      <span className="text-[10px] font-black tracking-widest text-[#555] uppercase">Sleep (h)</span>
                      <input
                        type="number"
                        className="w-14 bg-transparent text-right font-black text-lg outline-none"
                        value={log.sleep || ""}
                        onChange={async e => {
                          await updateLog({ sleep: parseFloat(e.target.value) || null });
                          if (e.target.value && log.pushups) autoAdvance(true, 3, 2);
                        }}
                        placeholder="0"
                      />
                    </div>
                    <div className="card flex-1 flex items-center justify-between p-3">
                      <span className="text-[10px] font-black tracking-widest text-[#555] uppercase">Pushups</span>
                      <input
                        type="number"
                        className="w-14 bg-transparent text-right font-black text-lg outline-none"
                        value={log.pushups || ""}
                        onChange={async e => {
                          await updateLog({ pushups: parseInt(e.target.value) || null });
                          if (e.target.value && log.sleep) autoAdvance(true, 3, 2);
                        }}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => setMorningStep(3)}
                    className="w-full py-3 rounded-xl text-[11px] font-black tracking-widest uppercase transition-all active:scale-95"
                    style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    NEXT — JOURNAL →
                  </button>
                </div>
              )}

              {morningStep > 2 && (
                <button
                  onClick={() => setMorningStep(2)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border mb-2 transition-all ${
                    numbersDone ? "border-green-500/20 bg-green-500/[0.03]" : "border-[#1a1a1a]"
                  }`}
                >
                  <StepCheck done={numbersDone} />
                  <span className="text-[11px] font-bold" style={{ color: numbersDone ? "#22c55e" : "rgba(255,255,255,0.4)" }}>
                    Numbers {numbersDone ? `— ${log.sleep}h sleep · ${log.pushups} pushups ✓` : "— tap to complete"}
                  </span>
                </button>
              )}

              {/* ── STEP 3: Journal ── */}
              {morningStep === 3 && (
                <div className="animate-fade-in">
                  <div className="card p-3 mb-3">
                    <textarea
                      autoFocus
                      className="w-full bg-transparent outline-none text-sm font-semibold placeholder-[#333] resize-none h-20"
                      placeholder="WINS / GRATITUDE / TOMORROW'S ONE THING..."
                      value={log.journalLine || ""}
                      onChange={e => updateLog({ journalLine: e.target.value })}
                    />
                  </div>
                  <button
                    onClick={handleLockIn}
                    disabled={lockInStatus === "syncing"}
                    className="w-full py-4 rounded-xl font-black tracking-widest uppercase transition-all active:scale-95 disabled:opacity-50"
                    style={{
                      background: lockInStatus === "done" ? "rgba(34,197,94,0.1)" : "rgba(212,168,83,0.1)",
                      color: lockInStatus === "done" ? "#22c55e" : "#d4a853",
                      border: `1px solid ${lockInStatus === "done" ? "rgba(34,197,94,0.3)" : "rgba(212,168,83,0.3)"}`,
                    }}
                  >
                    {lockInStatus === "syncing" ? "SYNCING..." : lockInStatus === "done" ? "LOCKED IN ✓" : "LOCK IN"}
                  </button>
                </div>
              )}

              {morningStep > 3 && (
                <button
                  onClick={() => setMorningStep(3)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border mb-2 transition-all ${
                    journalDone ? "border-green-500/20 bg-green-500/[0.03]" : "border-[#1a1a1a]"
                  }`}
                >
                  <StepCheck done={journalDone} />
                  <span className="text-[11px] font-bold" style={{ color: journalDone ? "#22c55e" : "rgba(255,255,255,0.4)" }}>
                    Journal {journalDone ? "✓" : "— tap to complete"}
                  </span>
                </button>
              )}

              {/* ── Stack complete ── */}
              {morningStep === 4 && (
                <div
                  className="text-center py-6 rounded-xl mt-2"
                  style={{ background: "rgba(34,197,94,0.04)", border: "1px solid rgba(34,197,94,0.12)" }}
                  role="status"
                  aria-live="polite"
                >
                  <p className="text-sm font-black text-green-400 mb-1">Morning stack complete ✓</p>
                  <p className="text-[10px] text-[#555]">
                    {[sovereigntyDone, fuelDone, numbersDone, journalDone].filter(Boolean).length}/4 steps logged
                  </p>
                  <Link href="/kill">
                    <div className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-[11px] tracking-widest uppercase transition-all active:scale-95" style={{ background: "rgba(212,168,83,0.1)", color: "#d4a853", border: "1px solid rgba(212,168,83,0.25)" }}>
                      EXECUTE →
                    </div>
                  </Link>
                </div>
              )}
            </div>

          </>
        )}

      </div>
    </main>
  );
}
