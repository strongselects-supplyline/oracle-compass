"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { DailyLog, getDailyLog, saveDailyLog, getDailyTelemetry, saveDailyTelemetry, DailyTelemetry, getTodayISO, logLabelCost } from "@/lib/db";
import { useSovereignty } from "@/components/SovereigntyDashboard";

// ── Icons ────────────────────────────────────────────────────────
const CheckIcon = ({ size = 16, color = "#22c55e" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// ── Components ───────────────────────────────────────────────────

function SectionHeader({ title, open, onClick, isComplete }: { title: string, open: boolean, onClick: () => void, isComplete: boolean }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 transition-all active:scale-[0.99] border-b"
      style={{ borderColor: "rgba(255,255,255,0.05)", background: open ? "rgba(255,255,255,0.02)" : "transparent" }}
    >
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: open ? "var(--text-primary)" : "var(--text-muted)" }}>
          {title}
        </span>
        {isComplete && (
          <div className="w-4 h-4 rounded-full flex items-center justify-center bg-green-500/10" style={{ boxShadow: "0 0 8px rgba(34,197,94,0.3)" }}>
            <CheckIcon size={10} color="#22c55e" />
          </div>
        )}
      </div>
      <span className="text-[10px] text-muted transition-transform duration-200" style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>
    </button>
  );
}

function NumberInput({ label, value, onChange, placeholder = "0" }: { label: string, value: number | null | string, onChange: (v: string) => void, placeholder?: string }) {
  return (
    <div className="flex-1 rounded-xl p-3 flex flex-col justify-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
      <label className="text-[9px] font-black uppercase tracking-widest text-muted mb-2">{label}</label>
      <input
        type="number"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-xl font-black text-white outline-none"
      />
    </div>
  );
}

function BooleanToggle({ label, checked, onChange }: { label: string, checked: boolean | null, onChange: (v: boolean) => void }) {
  const isYes = checked === true;
  return (
    <div className="flex-1 rounded-xl p-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
      <label className="text-[9px] font-black uppercase tracking-widest text-muted block mb-3">{label}</label>
      <div className="flex gap-2">
        <button
          onClick={() => onChange(true)}
          className={`flex-1 py-2 rounded-lg text-[10px] font-black transition-all ${isYes ? "bg-amber-500/20 text-amber-500 border border-amber-500/30" : "bg-white/5 text-muted border border-transparent"}`}
        >
          YES
        </button>
        <button
          onClick={() => onChange(false)}
          className={`flex-1 py-2 rounded-lg text-[10px] font-black transition-all ${checked === false ? "bg-white/10 text-white border border-white/20" : "bg-white/5 text-muted border border-transparent"}`}
        >
          NO
        </button>
      </div>
    </div>
  );
}

// ── Main Modal ───────────────────────────────────────────────────

export default function DataCenterModal({ onClose }: { onClose: () => void }) {
  const [activeSection, setActiveSection] = useState<number>(0);
  const [log, setLog] = useState<DailyLog | null>(null);
  const [telemetry, setTelemetry] = useState<DailyTelemetry | null>(null);
  const { state: sovState, save: saveSovState } = useSovereignty();

  // Local state for shift inputs (don't autosave immediately to avoid partial DB entries)
  const [ddHours, setDdHours] = useState("");
  const [ddRev, setDdRev] = useState("");
  const [labelCost, setLabelCost] = useState("");
  const [shiftStatus, setShiftStatus] = useState("");

  const saveTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function init() {
      const currentLog = await getDailyLog();
      const currentTel = await getDailyTelemetry();
      setLog(currentLog);
      setTelemetry(currentTel);
    }
    init();
  }, []);

  // Debounced auto-save for DailyLog
  const updateLog = (updates: Partial<DailyLog>) => {
    if (!log) return;
    const newLog = { ...log, ...updates };
    setLog(newLog);
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => saveDailyLog(newLog), 500);
  };

  const handleLogShift = async () => {
    if (!ddHours && !ddRev && !labelCost) return;
    setShiftStatus("SYNCING...");
    try {
      if (ddHours || ddRev) {
        await fetch("/api/doordash", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date: getTodayISO(),
            hours: parseFloat(ddHours || "0"),
            revenue: parseFloat(ddRev || "0"),
            gas: 0, tips: 0, miles: 0,
          }),
        });
        const tel = await getDailyTelemetry();
        tel.doordash_earned += parseFloat(ddRev || "0");
        await saveDailyTelemetry(tel);
        setTelemetry(tel);
      }
      if (labelCost) {
        await logLabelCost(parseFloat(labelCost));
      }
      setShiftStatus("LOCKED IN ✓");
      setTimeout(() => {
        setShiftStatus("");
        setDdHours("");
        setDdRev("");
        setLabelCost("");
      }, 2000);
    } catch (e) {
      setShiftStatus("FAILED");
    }
  };

  const updateSov = async (key: string, value: string) => {
    if (!sovState) return;
    const newLog = [...sovState.weeklyDataLog];
    const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });
    
    // Find or create this week's entry
    let entry = newLog.find(e => e.date === today);
    if (!entry) {
      entry = { date: today, data: { spotify: "", saves: "", doordash: "", geo: "" } };
      newLog.unshift(entry);
    }
    entry.data = { ...entry.data, [key]: value };
    await saveSovState({ ...sovState, weeklyDataLog: newLog });
  };

  if (!log || !telemetry || !sovState) return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0a]/90 backdrop-blur-md">
      <div className="w-8 h-8 rounded-full border-2 border-amber-500/20 border-t-amber-500 animate-spin" />
    </div>
  );

  const vesselComplete = log.sleep !== null && log.pushups !== null && log.squats !== null;
  const craftComplete = log.sessionQuality !== null && log.mudraSystem !== null && log.vocalTraining !== null;
  const weeklyEntry = sovState.weeklyDataLog[0]?.data || { spotify: "", saves: "", geo: "" };
  const algoComplete = !!(weeklyEntry.spotify || weeklyEntry.saves || weeklyEntry.geo);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0a0a0a] animate-fade-in">
      {/* ── Header ── */}
      <div className="pt-12 pb-4 px-6 flex items-center justify-between border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
        <h2 className="text-sm font-black tracking-[0.2em] text-white uppercase">Data Center</h2>
        <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center active:scale-95">
          <span className="text-white font-bold opacity-60">✕</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">

        {/* ── 1. The Vessel (Physical) ── */}
        <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.05)" }}>
          <SectionHeader title="The Vessel" open={activeSection === 0} onClick={() => setActiveSection(0)} isComplete={vesselComplete} />
          {activeSection === 0 && (
            <div className="p-4 flex gap-3 animate-fade-in">
              <NumberInput label="Sleep (h)" value={log.sleep} onChange={v => updateLog({ sleep: parseFloat(v) || null })} />
              <NumberInput label="Pushups" value={log.pushups} onChange={v => updateLog({ pushups: parseInt(v) || null })} />
              <NumberInput label="Squats" value={log.squats} onChange={v => updateLog({ squats: parseInt(v) || null })} />
            </div>
          )}
        </div>

        {/* ── 2. The Craft (Music) ── */}
        <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.05)" }}>
          <SectionHeader title="The Craft" open={activeSection === 1} onClick={() => setActiveSection(1)} isComplete={craftComplete} />
          {activeSection === 1 && (
            <div className="p-4 space-y-4 animate-fade-in">
              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-muted block mb-3">Session Quality (1-5)</label>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(n => (
                    <button
                      key={n}
                      onClick={() => updateLog({ sessionQuality: n })}
                      className={`flex-1 py-3 rounded-lg text-sm font-black transition-all ${log.sessionQuality === n ? "bg-amber-500 text-black shadow-[0_0_12px_rgba(245,158,11,0.4)]" : "bg-white/5 text-muted border border-white/5"}`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <BooleanToggle label="Mudra System" checked={log.mudraSystem} onChange={v => updateLog({ mudraSystem: v })} />
                <BooleanToggle label="Vocal Train" checked={log.vocalTraining} onChange={v => updateLog({ vocalTraining: v })} />
              </div>
            </div>
          )}
        </div>

        {/* ── 3. The Engine (Financial) ── */}
        <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.05)" }}>
          <SectionHeader title="The Engine" open={activeSection === 2} onClick={() => setActiveSection(2)} isComplete={false} />
          {activeSection === 2 && (
            <div className="p-4 space-y-4 animate-fade-in">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-500/70">Month Revenue</span>
                <span className="text-lg font-black text-amber-500">${telemetry.doordash_earned}</span>
              </div>
              
              <div className="flex gap-3">
                <NumberInput label="Shift Rev ($)" value={ddRev} onChange={setDdRev} placeholder="0" />
                <NumberInput label="Shift Hours" value={ddHours} onChange={setDdHours} placeholder="0" />
              </div>
              <div className="flex gap-3">
                <NumberInput label="Label Costs ($)" value={labelCost} onChange={setLabelCost} placeholder="0" />
                <button
                  onClick={handleLogShift}
                  disabled={!!shiftStatus || (!ddRev && !ddHours && !labelCost)}
                  className="flex-1 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all disabled:opacity-50"
                  style={{ background: shiftStatus === "LOCKED IN ✓" ? "rgba(34,197,94,0.2)" : "rgba(212,168,83,0.15)", color: shiftStatus === "LOCKED IN ✓" ? "#22c55e" : "#d4a853", border: `1px solid ${shiftStatus === "LOCKED IN ✓" ? "rgba(34,197,94,0.3)" : "rgba(212,168,83,0.3)"}` }}
                >
                  {shiftStatus || "LOG SHIFT"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── 4. The Algorithm (Weekly) ── */}
        <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.05)" }}>
          <SectionHeader title="The Algorithm" open={activeSection === 3} onClick={() => setActiveSection(3)} isComplete={algoComplete} />
          {activeSection === 3 && (
            <div className="p-4 space-y-3 animate-fade-in">
              <div className="flex gap-3">
                <NumberInput label="Spotify Flwrs" value={weeklyEntry.spotify} onChange={v => updateSov("spotify", v)} placeholder="e.g. 1500" />
                <NumberInput label="Save Rate %" value={weeklyEntry.saves} onChange={v => updateSov("saves", v)} placeholder="e.g. 4.2" />
              </div>
              <div className="w-1/2 pr-1.5">
                <NumberInput label="Geo Hits" value={weeklyEntry.geo} onChange={v => updateSov("geo", v)} placeholder="e.g. 3" />
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
