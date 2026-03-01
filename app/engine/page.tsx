"use client";

import { useEffect, useState, useRef } from "react";
import { getDayType, isBizDay, isSacredDay } from "@/lib/dayType";
import { getStoreValue, setStoreValue } from "@/lib/db";

type Account = { name: string; days: number };

const DEFAULT_ACCOUNTS: Account[] = [
  { name: "Account 1", days: 0 },
  { name: "Account 2", days: 0 },
  { name: "Account 3", days: 0 },
];

// ISO week key — same pattern as Studio, resets touches each week
function getWeekKey(): string {
  const now = new Date();
  const d = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const year = d.getUTCFullYear();
  const week = Math.ceil(((d.getTime() - Date.UTC(year, 0, 1)) / 86400000 + 1) / 7);
  return `${year}-W${String(week).padStart(2, '0')}`;
}

export default function EnginePage() {
  // null = not yet determined (prevents flash)
  const [dayState, setDayState] = useState<"biz" | "studio" | "sacred" | null>(null);
  const [override, setOverride] = useState(false);
  const [dailyMove, setDailyMove] = useState("");
  const [touches, setTouches] = useState(0);
  const [accounts, setAccounts] = useState<Account[]>(DEFAULT_ACCOUNTS);
  const [editingAccount, setEditingAccount] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchKey = `engine_touches:${getWeekKey()}`;

  useEffect(() => {
    const dt = getDayType();
    if (isSacredDay(dt)) setDayState("sacred");
    else if (isBizDay(dt)) setDayState("biz");
    else setDayState("studio");

    getStoreValue<string>("engine_daily_move").then(v => setDailyMove(v || ""));
    getStoreValue<number>(touchKey).then(v => setTouches(v || 0));
    getStoreValue<Account[]>("engine_accounts").then(v => {
      if (v && v.length === 3) setAccounts(v);
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
    // Long-press override disabled on sacred days
    if (dayState === "sacred") return;
    timerRef.current = setTimeout(() => setOverride(true), 500);
  };
  const endPress = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  // Null state — day type not yet determined, render nothing to prevent flash
  if (dayState === null) return null;

  // Sacred day — no override, no access
  if (dayState === "sacred") {
    return (
      <main className="page flex flex-col items-center justify-center text-center animate-fade-in">
        <div className="px-8 py-16 select-none">
          <div className="text-6xl mb-8 opacity-20">🛑</div>
          <h2 className="text-xl font-black tracking-tight mb-3">Sunday is sacred.</h2>
          <p className="text-[#555] text-sm">Rest. Zero building. No override.</p>
        </div>
      </main>
    );
  }

  // Studio day — long-press override available
  if (dayState === "studio" && !override) {
    return (
      <main className="page flex flex-col items-center justify-center text-center animate-fade-in">
        <div
          className="cursor-pointer select-none px-8 py-16"
          onPointerDown={startPress}
          onPointerUp={endPress}
          onPointerLeave={endPress}
        >
          <div className="text-6xl mb-8 opacity-20">⚙️</div>
          <h2 className="text-xl font-black tracking-tight mb-3">Studio Day.</h2>
          <p className="text-[#555] text-sm">Business resumes Tuesday.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="page animate-fade-in">
      <div className="page-inner">

        {/* ── Today's Move ── */}
        <div className="mb-6">
          <p className="text-[10px] font-black tracking-[0.18em] text-amber-500 uppercase mb-3">
            Today's Move
          </p>
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

        {/* ── Outreach Counter ── */}
        <div className="card mb-6 flex justify-between items-center">
          <div>
            <p className="text-[10px] font-black tracking-[0.18em] text-[#555] uppercase mb-1">Touches</p>
            <p className="text-3xl font-black leading-none">{touches}
              <span className="text-base font-bold text-[#555] ml-1">/ 15</span>
            </p>
          </div>
          <button
            onClick={logTouch}
            className="bg-[#222] border border-[#333] px-5 py-3 rounded-xl font-black text-sm tracking-widest hover:bg-[#2a2a2a] active:scale-95 transition-transform"
          >
            + TOUCH
          </button>
        </div>

        {/* ── Top 3 Accounts ── */}
        <div className="card">
          <p className="text-[10px] font-black tracking-[0.18em] text-[#555] uppercase mb-4">
            Top 3 Accounts
          </p>
          {accounts.map((acc, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center py-3 border-b border-[#1e1e1e] last:border-0"
            >
              {editingAccount === idx ? (
                <div className="flex gap-2 flex-1 mr-3 animate-slide-up">
                  <input
                    autoFocus
                    type="text"
                    className="oracle-input text-sm font-bold flex-1 py-2"
                    value={acc.name}
                    onChange={e => updateAccount(idx, { name: e.target.value })}
                    placeholder="Account name..."
                  />
                  <input
                    type="number"
                    className="num-input text-sm"
                    value={acc.days || ""}
                    onChange={e => updateAccount(idx, { days: parseInt(e.target.value) || 0 })}
                    placeholder="days"
                    style={{ width: "60px" }}
                  />
                </div>
              ) : (
                <button
                  className="text-sm font-bold text-left flex-1 -webkit-tap-highlight-color-transparent"
                  onClick={() => setEditingAccount(idx)}
                >
                  {acc.name === DEFAULT_ACCOUNTS[idx].name && acc.days === 0
                    ? <span className="text-[#444] italic">tap to set account {idx + 1}</span>
                    : acc.name}
                </button>
              )}

              {editingAccount === idx ? (
                <button
                  className="text-amber-500 text-sm font-black ml-2"
                  onClick={() => setEditingAccount(null)}
                >
                  DONE
                </button>
              ) : (
                acc.days > 0 && (
                  <span className={`badge flex-shrink-0 ${
                    acc.days > 14 ? "badge-red" :
                    acc.days > 7  ? "badge-amber" : "badge-green"
                  }`}>
                    {acc.days}d
                  </span>
                )
              )}
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
