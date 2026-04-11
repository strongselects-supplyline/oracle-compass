// lib/dayType.ts
// Core gating logic for Oracle Compass
//
// PHASE 1 — THE SPRINT (through Apr 24, 2026):
//   Mon-Sat: STUDIO DAY — single-mode days, no multitasking
//   Sunday: SACRED
//   Daily structure: DoorDash 6:30-9 AM → Studio 9:30 AM onward → Wheels down 8:30 PM
//   No content, no planning, no system building. Production only.
//
// PHASE 2 — THE COMPOUND (Apr 25 onward):
//   Mon/Wed/Fri: STUDIO + SAUNA DAY
//   Tue/Thu: BIZ DAY (registration, Amuse Insights, Gorilla Geo outreach)
//   Sat: STUDIO DAY
//   Sunday: SACRED
//
// Switch is automatic — no deploy needed. Triggered by EP_SPRINT_END date.
//
// PHASE 1 DAILY BLOCK MAP (Apr 11-24):
//   6:30-9 AM → DoorDash (morning surge only)
//   9:30 AM   → S3 Check-in + DAW open
//   9:35 AM+  → Studio (one track, closest to done)
//   8:30 PM   → Wheels down
//   10:30 PM  → Lights out
//
// PHASE 2 DAILY BLOCK MAP (Apr 25+):
//   Same as before — multi-block DD schedule returns
//
// DD TARGET: $1,800/mo @ $25/hr net = ~72 hrs/mo
// Phase 1: morning block only. Phase 2: 2-3 sprints/day.

// EP sprint ends after Apr 24. Phase 2 (COMPOUND) begins Apr 25.
const EP_SPRINT_END = new Date("2026-04-25T00:00:00");

export type DayType = "STUDIO + SAUNA DAY" | "BIZ DAY" | "\u{1F6D1} SACRED \u2014 no building" | "STUDIO DAY";

export function getDayType(date: Date = new Date()): DayType {
    const dayIndex = date.getDay(); // 0=Sun, 1=Mon ... 6=Sat
    const isPostEP = date >= EP_SPRINT_END;

    if (dayIndex === 0) {
        return "\u{1F6D1} SACRED \u2014 no building";
    }

    // Phase 1 (through Apr 24): every day is a studio day. No BIZ days. Production only.
    if (!isPostEP) {
        return "STUDIO DAY";
    }

    // Phase 2+: Tue/Thu become BIZ DAY for registration, outreach, analytics
    if (dayIndex === 2 || dayIndex === 4) {
        return "BIZ DAY";
    }

    if (dayIndex === 1 || dayIndex === 3 || dayIndex === 5) {
        return "STUDIO + SAUNA DAY"; // Mon, Wed, Fri
    }

    // Sat — studio day
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
