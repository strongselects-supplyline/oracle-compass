"use client";

import { useEffect, useState, useRef } from "react";
import { getDayType, isBizDay, isSacredDay } from "@/lib/dayType";
import { getStoreValue, setStoreValue, getDailyTelemetry, DailyTelemetry } from "@/lib/db";
import { getWeekKey } from "@/lib/oracle";
import type { OracleFlag } from "@/lib/oracle";
import ContentQueue from "@/components/engine/ContentQueue";

type Account = { name: string; days: number };

const DEFAULT_ACCOUNTS: Account[] = [
  { name: "Account 1", days: 0 },
  { name: "Account 2", days: 0 },
  { name: "Account 3", days: 0 },
];

export default function EnginePage() {
  const [dayState, setDayState] = useState<"biz" | "studio" | "sacred" | null>(null);
  const [override, setOverride] = useState(false);

  const [dailyMove, setDailyMove] = useState("");
  const [touches, setTouches] = useState(0);
  const [touchTarget, setTouchTarget] = useState(15);
  const [accounts, setAccounts] = useState<Account[]>(DEFAULT_ACCOUNTS);
  const [editingAccount, setEditingAccount] = useState<number | null>(null);

  const [telemetry, setTelemetry] = useState<DailyTelemetry>({ sf_hours_logged: 0, lid_hours_logged: 0, doordash_earned: 0 });

  const [priority, setPriority] = useState<string | null>(null);
  const [flags, setFlags] = useState<OracleFlag[]>([]);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const weekKey = getWeekKey();
  const touchKey = "engine_touches:" + weekKey;

  useEffect(() => {
    const dt = getDayType();
    if (isSacredDay(dt)) setDayState("sacred");
    else if (isBizDay(dt)) setDayState("biz");
    else setDayState("studio");

    const today = new Date().toISOString().split("T")[0];

    Promise.all([
      getStoreValue<string>("engine_daily_move"),
      getStoreValue<number>(touchKey),
      getStoreValue<number>("engine_touch_target"),
      getStoreValue<Account[]>("engine_accounts"),
      getDailyTelemetry(),
      getStoreValue<string>("oracle_priority"),
      getStoreValue<OracleFlag[]>("oracle_flags:" + today),
    ]).then(([move, t, tt, accs, tel, pri, fl]) => {
      setDailyMove(move || "");
      setTouches(t || 0);
      setTouchTarget(tt || 15);
      if (accs && accs.length === 3) setAccounts(accs);
      if (tel) setTelemetry(tel);
      setPriority(pri || null);
      setFlags(fl || []);
    });
  }, [touchKey]);

  const handleSaveMove = async (val: string) => {
    setDailyMove(val);
    await setStoreValue("engine_daily_move", val);
  };

  const logTouch = async () => {
    const next = touches + 1;
    setTouches(next);
    await setStoreValue(touchKey, next);
  };

  const updateAccount = async (idx: number, patch: Partial<Account>) => {
    const updated = accounts.map((a, i) => i === idx ? { ...a, ...patch } : a);
    setAccounts(updated);
    await setStoreValue("engine_accounts", updated);
  };

  const startPress = () => {
    if (dayState === "sacred") return;
    timerRef.current = setTimeout(() => setOverride(true), 500);
  };
  const endPress = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  if (dayState === null) return null;

  if (dayState === "sacred") {
    return (
      <main className="page flex flex-col items-center justify-center text-center animate-fade-in">
        <div className="px-8 py-16 select-none">
          <div className="text-6xl mb-8 opacity-20">{"🛑"}</div>
          <h2 className="text-xl font-black tracking-tight mb-3">Sunday is sacred.</h2>
          <p className="text-[#555] text-sm">Rest. Zero building. No override.</p>
        </div>
      </main>
    );
  }

  if (dayState === "studio" && !override) {
    return (
      <main className="page flex flex-col items-center justify-center text-center animate-fade-in">
        <div
          className="cursor-pointer select-none px-8 py-16"
          onPointerDown={startPress}
          onPointerUp={endPress}
          onPointerLeave={endPress}
        >
          <div className="text-6xl mb-8 opacity-20">{"⚙️"}</div>
          <h2 className="text-xl font-black tracking-tight mb-3">Studio Day.</h2>
          <p className="text-[#555] text-sm">Business resumes Tuesday.</p>
          <p className="text-[#333] text-xs mt-4">hold to override</p>
        </div>
      </main>
    );
  }

  const touchPct = Math.min((touches / touchTarget) * 100, 100);
  const redFlags = flags.filter(f => f.urgency === "RED");
  const amberFlags = flags.filter(f => f.urgency === "AMBER");

  return (
    <main className="page animate-fade-in">
      <div className="page-inner">

        {priority && (
          <div className="mb-5 px-4 py-3 rounded-xl border border-amber-900/40 bg-[#0f0f0f] flex items-center gap-3">
            <span className="text-amber-400 text-xs font-black tracking-widest uppercase">Oracle</span>
            <span className="text-amber-400 text-xs font-bold capitalize">Priority today: {priority}</span>
          </div>
        )}

        {redFlags.length > 0 && (
          <div className="mb-4 space-y-2">
            {redFlags.map((f, i) => (
              <div key={i} className="px-4 py-3 rounded-xl border border-red-900/40 bg-[#0f0f0f]">
                <p className="text-red-400 text-xs font-black tracking-widest uppercase mb-1">Action Required</p>
                <p className="text-white text-sm font-bold">{f.action}</p>
                <p className="text-[#666] text-xs mt-1">{f.reason}</p>
              </div>
            ))}
          </div>
        )}

        {amberFlags.length > 0 && (
          <div className="mb-4 space-y-2">
            {amberFlags.map((f, i) => (
              <div key={i} className="px-4 py-3 rounded-xl border border-amber-900/30 bg-[#0f0f0f]">
                <p className="text-amber-400 text-xs font-black tracking-widest uppercase mb-1">Watch</p>
                <p className="text-white text-sm font-bold">{f.action}</p>
                <p className="text-[#666] text-xs mt-1">{f.reason}</p>
              </div>
            ))}
          </div>
        )}

        <div className="mb-6">
          <p className="text-[10px] font-black tracking-[0.18em] text-amber-500 uppercase mb-3">Today's Move</p>
          <input
            type="text"
            className="oracle-input text-lg font-bold"
            placeholder="Commit to the move..."
            value={dailyMove}
            onChange={e => setDailyMove(e.target.value)}
            onBlur={() => handleSaveMove(dailyMove)}
            onKeyDown={e => e.key === "Enter" && handleSaveMove(dailyMove)}
          />
        </div>

        <div className="card mb-3">
          <div className="flex justify-between items-center mb-3">
            <div>
              <p className="text-[10px] font-black tracking-[0.18em] text-[#555] uppercase mb-1">Touches</p>
              <p className="text-3xl font-black leading-none">
                {touches}
                <span className="text-base font-bold text-[#555] ml-1">/ {touchTarget}</span>
              </p>
            </div>
            <button
              onClick={logTouch}
              className="bg-[#222] border border-[#333] px-5 py-3 rounded-xl font-black text-sm tracking-widest hover:bg-[#2a2a2a] active:scale-95 transition-transform"
            >
              + TOUCH
            </button>
          </div>
          <div className="h-1 bg-[#1e1e1e] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: touchPct + "%",
                backgroundColor: touchPct >= 100 ? "#22c55e" : touchPct >= 60 ? "#f59e0b" : "#555",
              }}
            />
          </div>
        </div>

        <ContentQueue />

        <div className="card mb-6">
          <p className="text-[10px] font-black tracking-[0.18em] text-[#555] uppercase mb-4">Top 3 Accounts</p>
          {accounts.map((acc, idx) => (
            <div key={idx} className="flex justify-between items-center py-3 border-b border-[#1e1e1e] last:border-0">
              {editingAccount === idx ? (
                <div className="flex gap-2 flex-1 mr-3">
                  <input
                    autoFocus
                    type="text"
                    className="oracle-input text-sm font-bold flex-1 py-2"
                    value={acc?.name || ""}
                    onChange={e => updateAccount(idx, { name: e.target.value })}
                    placeholder="Account name..."
                  />
                  <input
                    type="number"
                    className="num-input text-sm"
                    value={acc?.days || ""}
                    onChange={e => updateAccount(idx, { days: parseInt(e.target.value) || 0 })}
                    placeholder="days"
                    style={{ width: "60px" }}
                  />
                </div>
              ) : (
                <button className="text-sm font-bold text-left flex-1" onClick={() => setEditingAccount(idx)}>
                  {acc?.name === DEFAULT_ACCOUNTS[idx].name && (!acc?.days || acc.days === 0)
                    ? <span className="text-[#444] italic">tap to set account {idx + 1}</span>
                    : acc?.name || `Account ${idx + 1}`}
                </button>
              )}
              {editingAccount === idx ? (
                <button className="text-amber-500 text-sm font-black ml-2" onClick={() => setEditingAccount(null)}>DONE</button>
              ) : (
                (acc?.days ?? 0) > 0 && (
                  <span className={"badge flex-shrink-0 " + (acc!.days > 14 ? "badge-red" : acc!.days > 7 ? "badge-amber" : "badge-green")}>
                    {acc?.days}d
                  </span>
                )
              )}
            </div>
          ))}
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <p className="text-[10px] font-black tracking-[0.18em] text-[#555] uppercase">Income Bridge</p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[9px] text-[#444] uppercase tracking-widest mb-1">DoorDash</p>
                <p className="text-lg font-black text-amber-500">${telemetry.doordash_earned} <span className="text-[11px] font-bold text-[#555]">/ $1,000</span></p>
              </div>
              <p className="text-[10px] font-black tracking-widest text-[#444] uppercase">(log on Kill tab)</p>
            </div>
            {telemetry.doordash_earned < 1000 && (
              <div className="h-1 bg-[#1e1e1e] rounded-full overflow-hidden mt-3">
                <div
                  className="h-full rounded-full transition-all duration-500 bg-amber-500"
                  style={{ width: `${Math.min((telemetry.doordash_earned / 1000) * 100, 100)}%` }}
                />
              </div>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}
