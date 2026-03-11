// lib/useCloudSync.ts
// Shared hook for syncing IndexedDB daily logs to Google Sheets via native API routes.

"use client";

import { useState } from "react";
import { DailyLog, getTodayISO } from "@/lib/db";
import { isStudioDay } from "@/lib/dayType";

type SyncStatus = "" | "SYNCING..." | "SYNCED" | "FAILED";

export function useCloudSync() {
    const [syncStatus, setSyncStatus] = useState<SyncStatus>("");

    const sync = async (log: DailyLog, dayType: string) => {
        setSyncStatus("SYNCING...");
        const date = getTodayISO();
        try {
            await Promise.all([
                fetch("/api/journal", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        date,
                        winProcess: log.movement,
                        winRest: log.sauna,
                        winMusic: isStudioDay(dayType as any),
                        winGrowth: !!log.journalLine,
                        notes: log.journalLine,
                        highlights: log.oneThing,
                    }),
                }),
                fetch("/api/health", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        date,
                        pushups: log.pushups || 0,
                        sleepHours: log.sleep || 0,
                        workout: log.movement,
                        vocal: log.eucalyptusStream,
                        protein: false, // Legacy field — fuel tracking now handles nutrition
                        notes: log.journalLine,
                        fuelPre: log.fuelPreSession,
                        fuelMid: log.fuelMidSession,
                        fuelPost: log.fuelPostSession,
                        hydration: log.fuelHydration,
                        dairyFlag: log.fuelDairyFlag,
                    }),
                }),
            ]);
            setSyncStatus("SYNCED");
            setTimeout(() => setSyncStatus(""), 2000);
        } catch {
            setSyncStatus("FAILED");
        }
    };

    return { syncStatus, sync };
}
