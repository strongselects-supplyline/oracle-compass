// lib/completionAnalytics.ts
// Pattern analytics derived from the task_completion_log.
// Powers: weekly lane heatmap, oracle velocity flags, export payload, pattern detection.

import { getCompletionLog, getDailyLog, TaskCompletionEntry } from "@/lib/db";
import { getLaneStatus } from "@/lib/lanes";

// ── Weekly Heatmap ────────────────────────────────────────────────────

export type HeatmapCell = {
    laneId: string;
    dateISO: string;
    touches: number; // 0 = untouched, 1 = dim, 2-3 = medium, 4+ = bright
};

export type WeeklyHeatmap = {
    days: string[]; // YYYY-MM-DD for Mon-Sun of current week
    laneIds: string[];
    cells: HeatmapCell[];
};

export async function getWeeklyLaneHeatmap(): Promise<WeeklyHeatmap> {
    const log = await getCompletionLog();
    const laneIds = ["money", "body", "music", "content", "life", "inner"];

    // Get Mon-Sun of current week
    const now = new Date();
    const day = now.getDay() || 7;
    const days: string[] = [];
    for (let i = 1; i <= 7; i++) {
        const d = new Date(now);
        d.setDate(now.getDate() - day + i);
        days.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`);
    }

    // Map pillar → lane
    const pillarToLane: Record<string, string> = {
        business: "money",
        creative: "music",
        body: "body",
        content: "content",
    };

    // Count completions per day per lane
    const cells: HeatmapCell[] = [];
    for (const dateISO of days) {
        const dayStart = new Date(dateISO + "T00:00:00").toISOString();
        const dayEnd   = new Date(dateISO + "T23:59:59").toISOString();
        const dayEntries = log.filter((e: TaskCompletionEntry) =>
            e.clearedAt >= dayStart && e.clearedAt <= dayEnd
        );

        // Also check DailyLog signals for body + inner + life lanes
        const dailyLog = await getDailyLog(dateISO);

        // Count body signals from DailyLog
        const bodySignals = [
            dailyLog.sovereigntyStack, dailyLog.movement, dailyLog.sauna,
            dailyLog.proteinAtMeals, dailyLog.caffeineCutoff,
        ].filter(Boolean).length;

        const innerSignals = [
            dailyLog.trataka, dailyLog.caffeineCutoff, dailyLog.eucalyptusStream,
        ].filter(Boolean).length;

        const lifeSignals = dailyLog.personalTime ? 1 : 0;

        for (const laneId of laneIds) {
            let touches = dayEntries.filter((e: TaskCompletionEntry) => {
                const mapped = pillarToLane[e.pillar] || e.pillar;
                if (laneId === "money") return mapped === "money" || e.taskId.startsWith("dd-");
                if (laneId === "content") return e.taskId.startsWith("content-sprint") ||
                    e.taskId.includes("reels") || e.taskId.includes("tiktok");
                return mapped === laneId;
            }).length;

            // Add DailyLog signals for body/inner/life
            if (laneId === "body") touches += bodySignals;
            if (laneId === "inner") touches += innerSignals;
            if (laneId === "life") touches += lifeSignals;

            cells.push({ laneId, dateISO, touches });
        }
    }

    return { days, laneIds, cells };
}

// ── Velocity Analysis (Oracle fuel) ─────────────────────────────────────

export type VelocityReport = {
    thisWeekCount: number;
    lastWeekCount: number;
    velocityDelta: number; // positive = more this week, negative = dropped
    neglectedLanes: { laneId: string; daysSince: number }[];
    avoidedRedTasks: { taskId: string; title: string; daysSeen: number }[];
    summary: string;
};

export async function analyzeCompletionVelocity(): Promise<VelocityReport> {
    const log = await getCompletionLog();
    const now = new Date();

    // This week boundary (Mon 00:00)
    const day = now.getDay() || 7;
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - day + 1);
    weekStart.setHours(0, 0, 0, 0);

    // Last week boundary
    const lastWeekStart = new Date(weekStart);
    lastWeekStart.setDate(weekStart.getDate() - 7);
    const lastWeekEnd = new Date(weekStart);
    lastWeekEnd.setMilliseconds(-1);

    const thisWeekEntries = log.filter((e: TaskCompletionEntry) =>
        new Date(e.clearedAt) >= weekStart
    );
    const lastWeekEntries = log.filter((e: TaskCompletionEntry) => {
        const d = new Date(e.clearedAt);
        return d >= lastWeekStart && d <= lastWeekEnd;
    });

    const thisWeekCount = thisWeekEntries.length;
    const lastWeekCount = lastWeekEntries.length;
    const velocityDelta = lastWeekCount > 0
        ? Math.round(((thisWeekCount - lastWeekCount) / lastWeekCount) * 100)
        : 0;

    // Check neglected lanes (no completions 3+ days)
    const laneIds = ["money", "body", "music", "content", "life", "inner"];
    const pillarToLane: Record<string, string> = {
        business: "money", creative: "music", body: "body", content: "content",
    };

    const neglectedLanes: { laneId: string; daysSince: number }[] = [];
    for (const laneId of laneIds) {
        const laneEntries = log.filter((e: TaskCompletionEntry) => {
            const mapped = pillarToLane[e.pillar] || e.pillar;
            if (laneId === "money") return mapped === "money" || e.taskId.startsWith("dd-");
            if (laneId === "content") return e.taskId.startsWith("content-sprint") ||
                e.taskId.includes("reels") || e.taskId.includes("tiktok");
            return mapped === laneId;
        });
        if (laneEntries.length === 0) {
            neglectedLanes.push({ laneId, daysSince: 7 });
            continue;
        }
        const lastTouch = new Date(laneEntries[laneEntries.length - 1].clearedAt);
        const daysSince = Math.floor((now.getTime() - lastTouch.getTime()) / 86400000);
        if (daysSince >= 3) {
            neglectedLanes.push({ laneId, daysSince });
        }
    }

    // Detect RED tasks appearing multiple days without being cleared
    // (can't fully detect—Kill List is ephemeral—but we can check RED tasks
    // that have zero completions in the log at all as a proxy)
    const avoidedRedTasks: { taskId: string; title: string; daysSeen: number }[] = [];

    // Build summary
    let summary = "";
    if (velocityDelta < -40) {
        summary = `Execution velocity dropped ${Math.abs(velocityDelta)}% this week (${thisWeekCount} vs ${lastWeekCount} last week). Something is blocking.`;
    } else if (neglectedLanes.length > 2) {
        const names = neglectedLanes.map(l => l.laneId).join(", ");
        summary = `${neglectedLanes.length} lanes untouched for 3+ days: ${names}. Rebalance today.`;
    } else if (velocityDelta > 20) {
        summary = `Velocity up ${velocityDelta}% vs last week. Keep the momentum.`;
    } else {
        summary = `Steady execution. ${thisWeekCount} tasks cleared this week.`;
    }

    return {
        thisWeekCount,
        lastWeekCount,
        velocityDelta,
        neglectedLanes,
        avoidedRedTasks,
        summary,
    };
}

// ── Pattern Detection ─────────────────────────────────────────────────
// Detects behavioral patterns in lane completions over time.
// Returns human-readable summaries for Oracle context.

export type LanePattern = {
    laneId: string;
    pattern: string;
    severity: "info" | "warning" | "critical";
};

const PILLAR_TO_LANE: Record<string, string> = {
    business: "money",
    creative: "music",
    body: "body",
    content: "content",
};

function laneFilter(laneId: string, e: TaskCompletionEntry): boolean {
    const mapped = PILLAR_TO_LANE[e.pillar] || e.pillar;
    if (laneId === "money") return mapped === "money" || e.taskId.startsWith("dd-");
    if (laneId === "content") return (
        e.taskId.startsWith("content-sprint") ||
        e.taskId.includes("reels") ||
        e.taskId.includes("tiktok")
    );
    return mapped === laneId;
}

export async function detectPatterns(): Promise<LanePattern[]> {
    const log = await getCompletionLog();
    const patterns: LanePattern[] = [];
    const laneIds = ["money", "body", "music", "content", "life", "inner"];

    // Pattern 1: Lane siloed to 1-2 days of week (not a daily habit)
    for (const laneId of laneIds) {
        const dowCounts: Record<number, number> = {};
        const laneEntries = log.filter(e => laneFilter(laneId, e));
        for (const entry of laneEntries) {
            dowCounts[entry.dayOfWeek] = (dowCounts[entry.dayOfWeek] || 0) + 1;
        }
        const activeDays = Object.keys(dowCounts).length;
        const totalTouches = Object.values(dowCounts).reduce((a, b) => a + b, 0);
        if (totalTouches >= 5 && activeDays <= 2) {
            patterns.push({
                laneId,
                pattern: `${laneId} only active on ${activeDays} day(s) of week — not yet a daily habit`,
                severity: "warning",
            });
        }
    }

    // Pattern 2: Music lane absent 3+ consecutive calendar days this week
    const now = new Date();
    const todayDow = now.getDay() || 7; // Mon=1…Sun=7
    let musicAbsentStreak = 0;
    for (let i = 1; i < todayDow; i++) {
        const d = new Date(now);
        d.setDate(now.getDate() - todayDow + i);
        const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        const dayStart = new Date(dateStr + "T00:00:00").toISOString();
        const dayEnd = new Date(dateStr + "T23:59:59").toISOString();
        const musicToday = log.filter(e =>
            laneFilter("music", e) && e.clearedAt >= dayStart && e.clearedAt <= dayEnd
        );
        if (musicToday.length === 0) musicAbsentStreak++;
        else musicAbsentStreak = 0;
    }
    if (musicAbsentStreak >= 3) {
        patterns.push({
            laneId: "music",
            pattern: `Music lane absent ${musicAbsentStreak} consecutive days this week — studio cadence at risk`,
            severity: "critical",
        });
    }

    // Pattern 3: Inner lane has zero completions ever logged
    const innerEntries = log.filter(e => laneFilter("inner", e));
    if (innerEntries.length === 0 && log.length > 10) {
        patterns.push({
            laneId: "inner",
            pattern: "Inner lane has zero completions in log — sovereignty stack tasks not being cleared",
            severity: "critical",
        });
    }

    // Pattern 4: Life lane absent entire week
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - (now.getDay() || 7) + 1);
    weekStart.setHours(0, 0, 0, 0);
    const lifeThisWeek = log.filter(e =>
        laneFilter("life", e) && new Date(e.clearedAt) >= weekStart
    );
    if (lifeThisWeek.length === 0 && todayDow >= 4) {
        patterns.push({
            laneId: "life",
            pattern: "Life lane untouched all week — no personal time logged since Monday",
            severity: "warning",
        });
    }

    return patterns;
}

export async function getPatternSummary(): Promise<string> {
    const patterns = await detectPatterns();
    if (patterns.length === 0) return "No behavioral patterns detected.";
    const criticals = patterns.filter(p => p.severity === "critical");
    const warnings = patterns.filter(p => p.severity === "warning");
    const parts: string[] = [];
    if (criticals.length > 0) parts.push(`CRITICAL: ${criticals.map(p => p.pattern).join("; ")}`);
    if (warnings.length > 0) parts.push(`Warning: ${warnings.map(p => p.pattern).join("; ")}`);
    return parts.join(" | ");
}

// ── Export Payload ────────────────────────────────────────────────────

export async function buildExportPayload(): Promise<object> {
    const log = await getCompletionLog();
    const { getDailyTelemetry, getDailyLog, getTodayISO } = await import("@/lib/db");
    const { getDynamicReleases } = await import("@/lib/releases");

    const [telemetry, todayLog, releases] = await Promise.all([
        getDailyTelemetry(),
        getDailyLog(getTodayISO()),
        getDynamicReleases(),
    ]);

    const velocity = await analyzeCompletionVelocity();

    return {
        exportedAt: new Date().toISOString(),
        completionLog: log,
        velocity,
        telemetry,
        todayLog,
        releases: releases.map(r => ({
            title: r.title,
            releaseDate: r.releaseDate,
            status: r.status,
            reelsPosted: r.contentDeliverables.reelsPosted,
            tiktoksPosted: r.contentDeliverables.tiktoksPosted,
            coreDriveComplete: r.contentDeliverables.coreDriveComplete,
        })),
    };
}
