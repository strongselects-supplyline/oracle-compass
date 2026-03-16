// lib/realign.ts
// Receives an OracleDecree and executes each realignment command against IndexedDB.
// Handles all realignment types — music shifts, business targets, priority flags.

import { setStoreValue, getStoreValue, getTodayISO } from "@/lib/db";
import { shiftRelease } from "@/lib/releases";
import type { OracleDecree, Realignment, OracleFlag } from "@/lib/oracle";

export async function executeRealignment(decree: OracleDecree): Promise<void> {
  for (const r of decree.realignments) {
    await applyRealignment(r);
  }
  // Persist full decree — read by Oracle page + next day's context assembly
  await setStoreValue(`oracle_decree:${getTodayISO()}`, decree);
}

async function applyRealignment(r: Realignment): Promise<void> {
  switch (r.type) {

    // ── Music ──────────────────────────────────────────────
    case "shift_release":
      await shiftRelease(r.target, r.days);
      break;

    case "update_cycle_status": {
      // Cycle 4 removed Mar 15, 2026 — all tracks are on ALL LOVE.
      // Handler retained for type safety but Oracle no longer generates this realignment.
      break;
    }

    case "set_focus_requirement":
      await setStoreValue("today_focus_hours", r.hours);
      break;

    // ── Business ───────────────────────────────────────────
    case "set_touch_target":
      // Updates the weekly outreach target — Engine page reads this key
      await setStoreValue("engine_touch_target", r.target);
      break;

    // ── Priority ───────────────────────────────────────────
    case "set_priority":
      // Sets today's declared pillar priority — shown as banner on Engine page
      await setStoreValue("oracle_priority", r.priority);
      break;

    // ── Flags ──────────────────────────────────────────────
    case "flag_action": {
      // Appends to today's flag list — shown on Oracle page + Engine page
      const today = getTodayISO();
      const existing = await getStoreValue<OracleFlag[]>(`oracle_flags:${today}`);
      const flags: OracleFlag[] = existing || [];
      flags.push({ action: r.action, urgency: r.urgency, reason: r.reason });
      await setStoreValue(`oracle_flags:${today}`, flags);
      break;
    }

    case "no_change":
      break;
  }
}
