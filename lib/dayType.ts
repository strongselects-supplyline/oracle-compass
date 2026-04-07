// lib/dayType.ts
// Core gating logic for Oracle Compass
//
// PHASE 1 — THE SPRINT (through Apr 24, 2026):
//   Mon/Wed/Fri: STUDIO + SAUNA DAY
//   Tue/Thu/Sat: STUDIO DAY
//   Sunday: SACRED
//
// PHASE 2 — THE COMPOUND (Apr 25 onward):
//   Mon/Wed/Fri: STUDIO + SAUNA DAY
//   Tue/Thu: BIZ DAY (registration, Amuse Insights, Gorilla Geo outreach)
//   Sat: STUDIO DAY
//   Sunday: SACRED
//
// Switch is automatic — no deploy needed. Triggered by EP_SPRINT_END date.
//
// DAILY BLOCK MAP:
//   6-7 AM    → DD Morning Sprint (1hr ~$25)
//   7-9 AM    → Sovereignty Stack + Movement
//   10 AM-12  → Studio Block 1
//   12-2 PM   → DD Midday Sprint (2hrs ~$50)
//   2-4 PM    → Studio Block 2
//   5:30-8:30 → DD Evening Sprint (2-3hrs ~$50-75)
//   9 PM+     → Wind-down, Trataka
//
// DD TARGET: $1,800/mo @ $25/hr net = ~72 hrs/mo = ~2.8 hrs/day
// Only need 2 of 3 sprints most days to hit target.

// EP sprint ends after Apr 24. Phase 2 (COMPOUND) begins Apr 25.
const EP_SPRINT_END = new Date("2026-04-25T00:00:00");

export type DayType = "STUDIO + SAUNA DAY" | "BIZ DAY" | "\u{1F6D1} SACRED \u2014 no building" | "STUDIO DAY";

export function getDayType(date: Date = new Date()): DayType {
    const dayIndex = date.getDay(); // 0=Sun, 1=Mon ... 6=Sat
    const isPostEP = date >= EP_SPRINT_END;

    if (dayIndex === 0) {
        return "\u{1F6D1} SACRED \u2014 no building";
    }

    // Phase 2+: Tue/Thu become BIZ DAY for registration, outreach, analytics
    if (isPostEP && (dayIndex === 2 || dayIndex === 4)) {
        return "BIZ DAY";
    }

    if (dayIndex === 1 || dayIndex === 3 || dayIndex === 5) {
        return "STUDIO + SAUNA DAY"; // Mon, Wed, Fri
    }

    // Tue, Thu (sprint) + Sat — studio days
    return "STUDIO DAY";
}

export function isStudioDay(dayType: DayType): boolean {
    return dayType === "STUDIO + SAUNA DAY" || dayType === "STUDIO DAY";
}

export function isBizDay(dayType: DayType | string): boolean {
    return dayType === "BIZ DAY";
}

export function isSacredDay(dayType: DayType | string): boolean {
    return dayType === "\u{1F6D1} SACRED \u2014 no building";
}
