"use client";

import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { deriveKillList, getKillStats, type KillTask } from "@/lib/killList";

type KillStats = { total: number; cleared: number; redRemaining: number };

interface KillListContextType {
  killList: KillTask[];
  killStats: KillStats | null;
  loading: boolean;
  error: boolean;
  refresh: () => Promise<void>;
}

const KillListContext = createContext<KillListContextType>({
  killList: [],
  killStats: null,
  loading: true,
  error: false,
  refresh: async () => {},
});

export function useKillList() {
  return useContext(KillListContext);
}

const STALE_MS = 10_000; // 10 second cache

export default function KillListProvider({ children }: { children: React.ReactNode }) {
  const [killList, setKillList] = useState<KillTask[]>([]);
  const [killStats, setKillStats] = useState<KillStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const lastFetchRef = useRef<number>(0);

  const refresh = useCallback(async () => {
    const now = Date.now();
    if (now - lastFetchRef.current < STALE_MS) return;
    lastFetchRef.current = now;

    try {
      const [list, stats] = await Promise.all([deriveKillList(), getKillStats()]);
      setKillList(list);
      setKillStats(stats);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <KillListContext.Provider value={{ killList, killStats, loading, error, refresh }}>
      {children}
    </KillListContext.Provider>
  );
}
