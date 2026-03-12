// lib/recalibrate.ts
// On-demand Oracle recalibration — callable from Quick-Log page.
// Enforces a 30-minute cooldown to prevent API cost spam.
// The morning OracleTrigger uses this same function.

import { getStoreValue, setStoreValue } from "@/lib/db";
import { assembleContext } from "@/lib/oracle";
import { executeRealignment } from "@/lib/realign";
import type { OracleDecree } from "@/lib/oracle";

const COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes
const COOLDOWN_KEY = "recalibrate_last_ts";

export type RecalibrateResult =
  | { ok: true; decree: OracleDecree }
  | { ok: false; cooldownRemaining: number; reason: "cooldown" }
  | { ok: false; cooldownRemaining: 0; reason: "error"; message: string };

/** Returns how many milliseconds remain in the cooldown (0 if clear). */
export async function getCooldownRemaining(): Promise<number> {
  const last = await getStoreValue<number>(COOLDOWN_KEY);
  if (!last) return 0;
  const elapsed = Date.now() - last;
  return elapsed >= COOLDOWN_MS ? 0 : COOLDOWN_MS - elapsed;
}

/**
 * Fire the Oracle engine on-demand and write the new decree back to IndexedDB.
 * Respects the 30-minute cooldown unless `force` is true.
 */
export async function recalibrateOracle(force = false): Promise<RecalibrateResult> {
  const remaining = await getCooldownRemaining();
  if (!force && remaining > 0) {
    return { ok: false, cooldownRemaining: remaining, reason: "cooldown" };
  }

  try {
    const context = await assembleContext();
    const res = await fetch("/api/oracle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(context),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "Unknown error");
      return { ok: false, cooldownRemaining: 0, reason: "error", message: `Oracle API error (${res.status}): ${errText.slice(0, 120)}` };
    }

    const decree: OracleDecree = await res.json();
    await executeRealignment(decree);
    await setStoreValue(COOLDOWN_KEY, Date.now());

    return { ok: true, decree };
  } catch (e: any) {
    return { ok: false, cooldownRemaining: 0, reason: "error", message: e?.message || "Recalibration failed" };
  }
}
