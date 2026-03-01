// lib/dayType.ts
// Core gating logic for Oracle Compass

export type DayType = "STUDIO + SAUNA DAY" | "BIZ DAY" | "🛑 SACRED — no building" | "STUDIO DAY";

export function getDayType(date: Date = new Date()): DayType {
    const dayIndex = date.getDay(); // 0 is Sunday, 1 is Monday...

    if (dayIndex === 0) {
        return "🛑 SACRED — no building"; // Sunday
    }
    if (dayIndex === 2 || dayIndex === 4) {
        return "BIZ DAY"; // Tuesday, Thursday
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
