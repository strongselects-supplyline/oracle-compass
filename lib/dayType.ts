// lib/dayType.ts
// Core gating logic for Oracle Compass
//
// CURRENT SCHEDULE (EP sprint through Apr 24, 2026):
//   Mon/Wed/Fri: STUDIO + SAUNA DAY (10AM-2PM studio, sauna reset, DD 2-8:30PM through Apr 3)
//   Tue/Thu/Sat: STUDIO DAY (10AM-2PM studio, DD 2-8:30PM through Apr 3)
//   Sunday: SACRED
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
