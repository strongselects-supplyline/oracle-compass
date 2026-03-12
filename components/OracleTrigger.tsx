"use client";

// components/OracleTrigger.tsx
// Fires the Oracle engine once per day on first app open.
// Silently assembles context, calls /api/oracle, and executes realignments.
// No UI — purely background. Errors are silent (non-blocking).
// On-demand recalibration is handled by lib/recalibrate.ts.

import { useEffect } from "react";
import { getStoreValue, getTodayISO } from "@/lib/db";
import { recalibrateOracle } from "@/lib/recalibrate";
import type { OracleDecree } from "@/lib/oracle";

export default function OracleTrigger() {
  useEffect(() => {
    const run = async () => {
      try {
        // Skip if a decree already exists for today
        const existing = await getStoreValue<OracleDecree>(`oracle_decree:${getTodayISO()}`);
        if (existing) return;

        // Force true on morning trigger — cooldown doesn't apply to the first daily fire
        await recalibrateOracle(true);
      } catch {
        // Non-blocking — app works fine without Oracle
      }
    };

    // Small delay so the app renders first, then Oracle fires in background
    const timer = setTimeout(run, 2000);
    return () => clearTimeout(timer);
  }, []);

  return null; // No UI
}
