// components/CheckItem.tsx
// Shared check-row component used across page.tsx and grind/page.tsx

"use client";

import { useState } from "react";

interface CheckItemProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  dimmed?: boolean;
  warn?: boolean;
}

export default function CheckItem({ label, description, checked, onChange, dimmed, warn }: CheckItemProps) {
  const [flashing, setFlashing] = useState(false);

  const handleTap = () => {
    if (!checked) {
      setFlashing(true);
      setTimeout(() => setFlashing(false), 500);
    }
    onChange(!checked);
  };

  return (
    <div
      className={`flex items-start gap-3 p-3 transition-all cursor-pointer rounded-xl ${dimmed ? "opacity-30 pointer-events-none" : "active:bg-white/[0.02]"}`}
      style={{ background: "transparent" }}
      onClick={handleTap}
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      tabIndex={dimmed ? -1 : 0}
      onKeyDown={e => e.key === " " && handleTap()}
    >
      <div
        className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-200 ${
          checked ? (warn ? "bg-red-500 border-red-500" : "bg-amber-500 border-amber-500") : ""
        } ${flashing ? "scale-125 shadow-[0_0_12px_rgba(212,168,83,0.6)]" : "scale-100"}`}
        style={!checked ? { borderColor: "var(--border-2)" } : {}}
      >
        {checked && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={warn ? "#fff" : "#000"} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>
      <div className="flex-1 flex flex-col justify-center min-h-[24px]">
        <span
          className={`text-sm font-bold transition-all duration-300 ${checked ? (warn ? "text-red-400" : "line-through") : ""}`}
          style={{ color: checked ? (warn ? undefined : "var(--text-muted)") : "var(--text-primary)" }}
        >
          {label}
        </span>
        {description && (
          <span
            className="text-[10px] leading-tight font-medium mt-1"
            style={{ color: checked ? "var(--text-muted)" : "var(--text-secondary)" }}
          >
            {description}
          </span>
        )}
      </div>
    </div>
  );
}

