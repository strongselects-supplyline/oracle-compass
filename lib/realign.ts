// lib/realign.ts
// Receives an OracleDecree and executes each realignment command against IndexedDB.

import { setStoreValue, getTodayISO } from "@/lib/db";
import { shiftRelease } from "@/lib/releases";
import type { OracleDecree, Realignment } from "@/lib/oracle";

export async function executeRealignment(decree: OracleDecree): Promise<void> {
  for (const r of decree.realignments) {
    await applyRealignment(r);
  }
  // Persist the full decree — used by Oracle screen + next context assembly
  await setStoreValue(`oracle_decree:${getTodayISO()}`, decree);
}

async function applyRealignment(r: Realignment): Promise<void> {
  switch (r.type) {
    case "shift_release":
      await shiftRelease(r.target, r.days);
      break;

    case "update_cycle_status": {
      const keyMap: Record<string, string> = {
        "RECONNECT":   "cycle_reconnect",
        "WANT U 2":    "cycle_wantu2",
        "WORTH IT":    "cycle_worthit",
        "JUST SAY SO": "cycle_justsayso",
      };
      const key = keyMap[r.track.toUpperCase()];
      if (key) await setStoreValue(key, r.new_status);
      break;
    }

    case "set_focus_requirement":
      await setStoreValue("today_focus_hours", r.hours);
      break;

    case "no_change":
      break;
  }
}
