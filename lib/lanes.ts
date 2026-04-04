// lib/lanes.ts
// Lane status engine — computes which life domains were "touched" today.
// Feeds the morning Lane Dashboard on the home page.

import { getDailyLog, getStoreValue, getTodayISO, getCompletionLog, TaskCompletionEntry } from "@/lib/db";

export type Lane = {
    id: string;
    label: string;
    icon: string;
    color: string;     // tailwind text color
    bgColor: string;   // tailwind bg for active state
    touched: boolean;
    touchCount: number; // how many signals fired today
};

export async function getLaneStatus(): Promise<Lane[]> {
    const today = getTodayISO();
    const dailyLog = await getDailyLog(today);
    const completionLog = await getCompletionLog();

    // Filter today's completions
    const todayStart = new Date(today + "T00:00:00").toISOString();
    const todayCompletions = completionLog.filter(
        (e: TaskCompletionEntry) => e.clearedAt >= todayStart
    );

    // Helper: count completions matching a filter
    const countMatching = (filter: (e: TaskCompletionEntry) => boolean) =>
        todayCompletions.filter(filter).length;

    // Check store keys for DD sprints
    const ddMorn = await getStoreValue(`dd_morning:${today}`);
    const ddMid = await getStoreValue(`dd_midday:${today}`);
    const ddEve = await getStoreValue(`dd_evening:${today}`);

    // ── MONEY ──
    const moneyTouches = (ddMorn ? 1 : 0) + (ddMid ? 1 : 0) + (ddEve ? 1 : 0)
        + countMatching(e => e.pillar === "business");

    // ── BODY ──
    const bodySignals = [
        dailyLog.sovereigntyStack,
        dailyLog.movement,
        dailyLog.sauna,
        dailyLog.proteinAtMeals,
        dailyLog.fuelPreSession,
        dailyLog.fuelMidSession,
        dailyLog.fuelPostSession,
        dailyLog.caffeineCutoff,
    ].filter(Boolean).length;
    const bodyTaskTouches = countMatching(e => e.pillar === "body");

    // ── MUSIC ──
    const musicSignals = (dailyLog.sessionType ? 1 : 0)
        + (dailyLog.sessionQuality !== null ? 1 : 0);
    const musicTaskTouches = countMatching(e =>
        e.pillar === "creative" && !e.taskId.startsWith("content-sprint")
    );

    // ── CONTENT ──
    const contentTaskTouches = countMatching(e =>
        e.taskId.startsWith("content-sprint") ||
        e.taskId.includes("reels") ||
        e.taskId.includes("tiktok") ||
        e.taskId.includes("teaser") ||
        e.taskId.includes("story") ||
        e.taskId.includes("announce")
    );

    // ── LIFE ──
    const lifeSignals = (dailyLog.personalTime ? 1 : 0);

    // ── INNER ──
    const innerSignals = [
        dailyLog.trataka,
        dailyLog.caffeineCutoff,
        dailyLog.eucalyptusStream,
    ].filter(Boolean).length;
    const viceCleared = await getStoreValue(`vice_clear:${today}`);
    const mudraCleared = await getStoreValue(`mudra_flow_clear:${today}`);
    const innerTouches = innerSignals + (viceCleared ? 1 : 0) + (mudraCleared ? 1 : 0);

    return [
        {
            id: "money",
            label: "Money",
            icon: "💰",
            color: "text-green-400",
            bgColor: "bg-green-500/20",
            touched: moneyTouches > 0,
            touchCount: moneyTouches,
        },
        {
            id: "body",
            label: "Body",
            icon: "🏋️",
            color: "text-orange-400",
            bgColor: "bg-orange-500/20",
            touched: bodySignals + bodyTaskTouches > 0,
            touchCount: bodySignals + bodyTaskTouches,
        },
        {
            id: "music",
            label: "Music",
            icon: "🎹",
            color: "text-blue-400",
            bgColor: "bg-blue-500/20",
            touched: musicSignals + musicTaskTouches > 0,
            touchCount: musicSignals + musicTaskTouches,
        },
        {
            id: "content",
            label: "Content",
            icon: "📱",
            color: "text-pink-400",
            bgColor: "bg-pink-500/20",
            touched: contentTaskTouches > 0,
            touchCount: contentTaskTouches,
        },
        {
            id: "life",
            label: "Life",
            icon: "🏠",
            color: "text-yellow-400",
            bgColor: "bg-yellow-500/20",
            touched: lifeSignals > 0,
            touchCount: lifeSignals,
        },
        {
            id: "inner",
            label: "Inner",
            icon: "🧘",
            color: "text-purple-400",
            bgColor: "bg-purple-500/20",
            touched: innerTouches > 0,
            touchCount: innerTouches,
        },
    ];
}
