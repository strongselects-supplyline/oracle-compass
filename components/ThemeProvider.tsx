"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

type ThemeMode = "auto" | "light" | "dark";
type ResolvedTheme = "light" | "dark";

interface ThemeContextType {
  mode: ThemeMode;
  resolved: ResolvedTheme;
  cycle: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: "auto",
  resolved: "dark",
  cycle: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

function resolveAuto(): ResolvedTheme {
  const hour = new Date().getHours();
  // Light from 6 AM to 6 PM, dark otherwise
  return hour >= 6 && hour < 18 ? "light" : "dark";
}

function getStoredMode(): ThemeMode {
  if (typeof window === "undefined") return "auto";
  const stored = localStorage.getItem("theme-mode");
  if (stored === "light" || stored === "dark" || stored === "auto") return stored;
  return "auto";
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("auto");
  const [resolved, setResolved] = useState<ResolvedTheme>("dark");

  const apply = useCallback((m: ThemeMode) => {
    const r = m === "auto" ? resolveAuto() : m;
    setResolved(r);
    document.documentElement.setAttribute("data-theme", r);
    // Sync to localStorage so standalone HTML pages can read it
    localStorage.setItem("theme-resolved", r);
  }, []);

  // Initialize on mount
  useEffect(() => {
    const stored = getStoredMode();
    setMode(stored);
    apply(stored);
  }, [apply]);

  // In auto mode, re-check every 60 seconds
  useEffect(() => {
    if (mode !== "auto") return;
    const interval = setInterval(() => apply("auto"), 60_000);
    return () => clearInterval(interval);
  }, [mode, apply]);

  const cycle = useCallback(() => {
    const next: ThemeMode = mode === "auto" ? "light" : mode === "light" ? "dark" : "auto";
    setMode(next);
    localStorage.setItem("theme-mode", next);
    apply(next);
  }, [mode, apply]);

  return (
    <ThemeContext.Provider value={{ mode, resolved, cycle }}>
      {children}
    </ThemeContext.Provider>
  );
}
