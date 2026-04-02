export function getSobrietyStreak(): number {
    const start = new Date("2026-04-02");
    const today = new Date();

    // Normalize both to midnight UTC to prevent Daylight Saving Time diff bugs
    const utcStart = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
    const utcToday = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());

    return Math.floor((utcToday - utcStart) / (1000 * 60 * 60 * 24));
}
