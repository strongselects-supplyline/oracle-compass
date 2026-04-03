// lib/dayType.ts
// Core gating logic for Oracle Compass
//
// CURRENT SCHEDULE (EP sprint through Apr 24, 2026):
//   Mon/Wed/Fri: STUDIO + SAUNA DAY
//   Tue/Thu/Sat: STUDIO DAY
//   Sunday: SACRED
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
//
// BIZ DAY is disabled during the EP sprint. Business tasks (outreach, touches)
// still fire from the Kill List per-release checklist — they're not day-gated.
// Re-enable BIZ DAY post-EP by uncommenting the Tuesday/Thursday block below.

export type DayType = "STUDIO + SAUNA DAY" | "BIZ DAY" | "\u{1F6D1} SACRED \u2014 no building" | "STUDIO DAY";

export function getDayType(date: Date = new Date()): DayType {
    const dayIndex = date.getDay(); // 0=Sun, 1=Mon ... 6=Sat

    if (dayIndex === 0) {
        return "\u{1F6D1} SACRED \u2014 no building";
    }

    // POST-EP: Uncomment this block to restore Tue/Thu as BIZ DAY
    // if (dayIndex === 2 || dayIndex === 4) {
    //     return "BIZ DAY";
    // }

    if (dayIndex === 1 || dayIndex === 3 || dayIndex === 5) {
        return "STUDIO + SAUNA DAY"; // Mon, Wed, Fri
    }

    // Tue, Thu, Sat — all studio days during EP sprint
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
