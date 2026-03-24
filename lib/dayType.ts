// lib/dayType.ts
// Core gating logic for Oracle Compass

export type DayType = "STUDIO + SAUNA DAY" | "BIZ DAY" | "🛑 SACRED — no building" | "STUDIO DAY";

// Phase end: After Apr 3, Tue/Thu revert to BIZ DAY.
// Through Apr 3, every non-Sunday day is a studio day (DoorDash 2PM-8:30PM after).
const SPRINT_PHASE_END = new Date("2026-04-03T23:59:59");

export function getDayType(date: Date = new Date()): DayType {
    const dayIndex = date.getDay(); // 0 is Sunday, 1 is Monday...

    if (dayIndex === 0) {
        return "🛑 SACRED — no building"; // Sunday
    }

    // During sprint phase (through Apr 3), Tue/Thu are studio days too
    const inSprintPhase = date <= SPRINT_PHASE_END;

    if (dayIndex === 2 || dayIndex === 4) {
        return inSprintPhase ? "STUDIO DAY" : "BIZ DAY";
    }
    if (dayIndex === 6) {
        return "STUDIO DAY"; // Saturday
    }
    // Monday, Wednesday, Friday
    return "STUDIO + SAUNA DAY";
}

export function isStudioDay(dayType: DayType): boolean {
    return dayType === "STUDIO + SAUNA DAY" || dayType === "STUDIO DAY";
}

export function isBizDay(dayType: DayType): boolean {
    return dayType === "BIZ DAY";
}

export function isSacredDay(dayType: DayType): boolean {
    return dayType === "🛑 SACRED — no building";
}
