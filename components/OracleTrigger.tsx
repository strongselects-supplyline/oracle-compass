"use client";

// components/OracleTrigger.tsx
// Fires the Oracle engine once per day on first app open.
// Silently assembles context, calls /api/oracle, and executes realignments.
// No UI — purely background. Errors are silent (non-blocking).

import { useEffect } from "react";
import { getStoreValue, getTodayISO } from "@/lib/db";
import { assembleContext } from "@/lib/oracle";
import { executeRealignment } from "@/lib/realign";
import type { OracleDecree } from "@/lib/oracle";

export default function OracleTrigger() {
  useEffect(() => {
    const run = async () => {
      try {
        // Skip if a decree already exists for today
        const existing = await getStoreValue<OracleDecree>(`oracle_decree:${getTodayISO()}`);
        if (existing) return;

        const context = await assembleContext();
        const res = await fetch("/api/oracle", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(context),
        });

        if (!res.ok) return; // Silent fail — Oracle page handles error display

        const decree: OracleDecree = await res.json();
        await executeRealignment(decree);
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
