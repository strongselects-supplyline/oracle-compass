// lib/oracle.ts
// Assembles the full daily context snapshot for the Oracle engine.
// Reads ALL IndexedDB state — music, grind, business, income, label, fuel — into one typed object.

import { getDailyLog, getStoreValue, getTodayISO, DailyLog, getDailyTelemetry } from "@/lib/db";
import { getSobrietyStreak } from "@/lib/streaks";
import { getDynamicReleases, Release, ALBUM_RELEASE_DATE, ContentDeliverables } from "@/lib/releases";
import { fetchDashboardIncome } from "@/lib/dashboardBridge";
import { getDayType } from "@/lib/dayType";
import { getSprintTarget, getTrackStatuses, getSundayChecklist, computeTrackProgress, isSundayChecklistComplete } from "@/lib/planner";
import { getSessionsForDateRange } from "@/lib/studioLog";

export type CycleTrack = {
  name: string;
  storageKey: string;
  status: string;
};

export type EngineSnapshot = {
  dailyMove: string;
  weeklyTouches: number;
  touchTarget: number;
  accounts: { name: string; daysSinceContact: number }[];
};

export type IncomeSnapshot = {
  doordashShiftsThisWeek: number;
  doordashEarningsThisWeek: number;
  doordashEarningsThisMonth: number;
};

export type LabelSnapshot = {
  complianceGaps: string[];
  nextReleaseTitle: string;
  daysUntilNextRelease: number;
};

export type FuelSnapshot = {
  todayScore: number;        // 0-3 (pre, mid, post)
  todayHydration: number | null;
  todayDairyFlag: boolean;
  recentAvgScore: number;    // avg of last 3 days
  missedPreCount: number;    // how many of last 3 days missed pre-session
};

export type ContentSnapshot = {
  nextRelease: {
    title: string;
    daysUntil: number;
    deliverables: ContentDeliverables;
    readinessScore: number;  // 0-100 based on deliverable completion
  } | null;
  totalReelsThisWeek: number;
  totalTiktoksThisWeek: number;
  coreDrive: {
    complete: boolean;
    campaignKit: boolean;
  } | null;
};

export type FanCaptureSnapshot = {
  linktreeSetup: boolean;
  mailchimpSetup: boolean;
};

export type LiveEventSnapshot = {
  setlistLocked: boolean;
  rehearsal1Done: boolean;
  rehearsal2Done: boolean;
  gearChecked: boolean;
  contentPlan: boolean;
  synesthesiaTested: boolean;
};

export type TimeSnapshot = {
  currentHour: number;       // 0-23
  currentBlock: string;      // 'pre-session' | 'studio' | 'post-studio' | 'evening' | 'dd-morning' | 'dd-evening'
  studioHoursRemaining: number; // hours left in 10AM-2PM block (0 if past 2PM)
};

export type SessionSnapshot = {
  todayQuality: number | null;   // 1-5
  todayType: string;             // recording/mixing/mastering/writing/''
  recentAvgQuality: number;      // avg of last 3 days with quality logged
  personalTimeDays: number;      // how many of last 7 days had personal time
  batchPrepThisWeek: boolean;    // did Sunday batch prep happen?
  consecutiveMaxDays: number;    // streak of days without personal time
};

export type PlannerSnapshot = {
  sprintTarget: string;          // this week's declared focus
  trackTotal: number;            // total tracks in production grid
  trackDone: number;             // tracks at 'done' status
  trackInProgress: number;       // tracks at an intermediate phase
  sundayChecklistComplete: boolean; // all 4 Sunday ritual items checked
};

export type OracleContext = {
  date: string;
  dayType: string;
  makeModeWeek: number;
  daysUntilAlbum: number;
  dailyLog: DailyLog;
  recentLogs: DailyLog[];
  releases: Release[];
  cycleTracks: CycleTrack[];
  weeklyStudioSessions: number;
  sobrietyStreak: number;
  lastDecree: OracleDecree | null;
  engine: EngineSnapshot;
  income: IncomeSnapshot;
  label: LabelSnapshot;
  fuel: FuelSnapshot;
  content: ContentSnapshot;
  time: TimeSnapshot;
  session: SessionSnapshot;
  planner: PlannerSnapshot;
  fanCapture: FanCaptureSnapshot;
  livePhase: LiveEventSnapshot;
  declaredPriority: string | null;
};

export type Realignment =
  | { type: "shift_release"; target: string; days: number; reason: string }
  | { type: "update_cycle_status"; track: string; new_status: string; reason: string }
  | { type: "set_focus_requirement"; hours: number; reason: string }
  | { type: "set_touch_target"; target: number; reason: string }
  | { type: "set_priority"; priority: "music" | "business" | "income"; reason: string }
  | { type: "flag_action"; action: string; urgency: "RED" | "AMBER"; reason: string }
  | { type: "no_change" };

export type OracleDecree = {
  assessment: string;
  severity: "GREEN" | "AMBER" | "RED";
  oracle_message: string;
  dietary_alignment?: {
    pre: { label: string; desc: string };
    mid: { label: string; desc: string };
    post: { label: string; desc: string };
    warning?: string | null;
  };
  realignments: Realignment[];
};

export type OracleFlag = {
  action: string;
  urgency: "RED" | "AMBER";
  reason: string;
};

// Cycle 4 removed March 15, 2026 — all tracks are on ALL LOVE. No separate pipeline.
const CYCLE_TRACKS: { name: string; storageKey: string }[] = [];

export function getMakeModeWeek(): number {
  const start = Date.UTC(2026, 1, 20);
  const now = Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
  const days = Math.floor((now - start) / (1000 * 60 * 60 * 24));
  return Math.min(Math.max(Math.ceil(days / 7), 1), 5);
}

export function getWeekKey(offsetWeeks = 0): string {
  const now = new Date();
  if (offsetWeeks > 0) now.setDate(now.getDate() - offsetWeeks * 7);
  const d = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const year = d.getUTCFullYear();
  const week = Math.ceil(((d.getTime() - Date.UTC(year, 0, 1)) / 86400000 + 1) / 7);
  return `${year}-W${String(week).padStart(2, "0")}`;
}

function fuelScoreFromLog(l: DailyLog): number {
  return [l.fuelPreSession, l.fuelMidSession, l.fuelPostSession].filter(Boolean).length;
}

function computeContentReadiness(d: ContentDeliverables): number {
  let score = 0;
  // primary video: 25 pts
  const pvMap: Record<string, number> = { none: 0, planned: 5, shot: 12, edited: 20, done: 25 };
  score += pvMap[d.primaryVideo] || 0;
  // lyric video: 10 pts
  const lvMap: Record<string, number> = { none: 0, planned: 3, edited: 7, done: 10 };
  score += lvMap[d.lyricVideo] || 0;
  // reels: 25 pts (proportional to goal)
  score += d.reelsGoal > 0 ? Math.min(25, Math.round((d.reelsPosted / d.reelsGoal) * 25)) : 0;
  // tiktoks: 15 pts
  score += d.tiktoksGoal > 0 ? Math.min(15, Math.round((d.tiktoksPosted / d.tiktoksGoal) * 15)) : 0;
  // b-roll: 10 pts (3+ clips = full marks)
  score += Math.min(10, Math.round((d.brollClips / 3) * 10));
  // visual idea: 15 pts
  score += d.visualIdea.trim().length > 0 ? 15 : 0;
  return Math.min(100, score);
}

function getCurrentBlock(hour: number, dayType: string): string {
  const isWeekend = dayType === 'STUDIO DAY';
  if (isWeekend && hour >= 7 && hour < 10) return 'dd-morning';
  if (hour < 10) return 'pre-session';
  if (hour >= 10 && hour < 14) return 'studio';
  if (hour >= 14 && hour < 15) return 'post-studio';
  if (isWeekend && hour >= 15 && hour < 22) return 'dd-evening';
  if (hour >= 15) return 'evening';
  return 'pre-session';
}

export async function assembleContext(): Promise<OracleContext> {
  const today = getTodayISO();
  const yd = new Date();
  yd.setDate(yd.getDate() - 1);
  const yesterday = `${yd.getFullYear()}-${String(yd.getMonth() + 1).padStart(2, "0")}-${String(yd.getDate()).padStart(2, "0")}`;

  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  const twoDaysAgoStr = `${twoDaysAgo.getFullYear()}-${String(twoDaysAgo.getMonth() + 1).padStart(2, "0")}-${String(twoDaysAgo.getDate()).padStart(2, "0")}`;

  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  const threeDaysAgoStr = `${threeDaysAgo.getFullYear()}-${String(threeDaysAgo.getMonth() + 1).padStart(2, "0")}-${String(threeDaysAgo.getDate()).padStart(2, "0")}`;

  const weekKey = getWeekKey();

  const now = new Date();
  const day = now.getDay() || 7;
  const start = new Date(now); start.setDate(now.getDate() - day + 1);
  const end = new Date(now); end.setDate(now.getDate() - day + 7);
  const toISO = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  const [dailyLog, log1, log2, log3, releases, weekSessions, lastDecree, telemetry] = await Promise.all([
    getDailyLog(today),
    getDailyLog(yesterday),
    getDailyLog(twoDaysAgoStr),
    getDailyLog(threeDaysAgoStr),
    getDynamicReleases(),
    getSessionsForDateRange(toISO(start), toISO(end)),
    getStoreValue<OracleDecree>(`oracle_decree:${today}`),
    getDailyTelemetry()
  ]);

  const recentLogs = [log1, log2, log3].filter(l => l && (l.oneThing || l.sovereigntyStack || l.sleep !== null));

  const cycleTracks: CycleTrack[] = await Promise.all(
    CYCLE_TRACKS.map(async t => ({
      ...t,
      status: (await getStoreValue<string>(t.storageKey)) || "add",
    }))
  );

  // Engine reads
  const [engineMove, weeklyTouches, touchTarget, rawAccounts] = await Promise.all([
    getStoreValue<string>("engine_daily_move"),
    getStoreValue<number>(`engine_touches:${weekKey}`),
    getStoreValue<number>("engine_touch_target"),
    getStoreValue<{ name: string; days: number }[]>("engine_accounts"),
  ]);

  const engine: EngineSnapshot = {
    dailyMove: engineMove || "(not set)",
    weeklyTouches: weeklyTouches || 0,
    touchTarget: touchTarget || 15,
    accounts: (rawAccounts || []).map((a: any) => ({
      name: a?.name || "",
      daysSinceContact: a?.days || 0,
    })),
  };

  // Income reads
  const dashboardIncome = await fetchDashboardIncome();

  let income: IncomeSnapshot;
  if (dashboardIncome) {
    income = dashboardIncome;
  } else {
    income = {
      doordashShiftsThisWeek: 0,
      doordashEarningsThisWeek: telemetry.doordash_earned,
      doordashEarningsThisMonth: telemetry.doordash_earned,
    };
  }

  // Label compliance
  const upcomingReleases = releases.filter(r => r.status !== "live");
  const nextRelease = upcomingReleases[0] || null;
  const daysUntilNext = nextRelease
    ? Math.ceil((new Date(nextRelease.releaseDate).getTime() - now.getTime()) / 86400000)
    : 999;

  // Compliance gaps derived from contentDeliverables (single source of truth)
  const complianceGaps: string[] = [];
  if (nextRelease) {
    const d = nextRelease.contentDeliverables;
    if (!d.isrcPulled) complianceGaps.push("ISRC not pulled");
    if (!d.ascapRegistered) complianceGaps.push("ASCAP not registered");
    if (!d.mlcRegistered) complianceGaps.push("MLC not registered");
    if (!d.songtrustRegistered) complianceGaps.push("Songtrust not registered");
    if (!d.instrumentalRendered) complianceGaps.push("Instrumental not rendered");
    if (!d.musixmatchSubmitted) complianceGaps.push("Musixmatch lyrics not submitted");
  }

  const label: LabelSnapshot = {
    complianceGaps,
    nextReleaseTitle: nextRelease?.title || "none",
    daysUntilNextRelease: daysUntilNext,
  };

  // Fuel snapshot
  const recentFuelScores = recentLogs.map(fuelScoreFromLog);
  const recentAvg = recentFuelScores.length > 0
    ? recentFuelScores.reduce((a, b) => a + b, 0) / recentFuelScores.length
    : 0;
  const missedPre = recentLogs.filter(l => !l.fuelPreSession).length;

  const fuel: FuelSnapshot = {
    todayScore: fuelScoreFromLog(dailyLog),
    todayHydration: dailyLog.fuelHydration,
    todayDairyFlag: dailyLog.fuelDairyFlag,
    recentAvgScore: Math.round(recentAvg * 10) / 10,
    missedPreCount: missedPre,
  };

  // Content pipeline snapshot
  const upcomingForContent = releases.filter(r => r.status !== 'live');
  const nextForContent = upcomingForContent[0] || null;
  const daysUntilContent = nextForContent
    ? Math.ceil((new Date(nextForContent.releaseDate).getTime() - now.getTime()) / 86400000)
    : 999;

  const content: ContentSnapshot = {
    nextRelease: nextForContent ? {
      title: nextForContent.title,
      daysUntil: daysUntilContent,
      deliverables: nextForContent.contentDeliverables,
      readinessScore: computeContentReadiness(nextForContent.contentDeliverables),
    } : null,
    totalReelsThisWeek: upcomingForContent.reduce((sum, r) => sum + r.contentDeliverables.reelsPosted, 0),
    totalTiktoksThisWeek: upcomingForContent.reduce((sum, r) => sum + r.contentDeliverables.tiktoksPosted, 0),
    coreDrive: nextForContent ? {
      complete: nextForContent.contentDeliverables.coreDriveComplete,
      campaignKit: nextForContent.contentDeliverables.campaignKitGenerated,
    } : null,
  };

  // Time architecture snapshot
  const currentHour = now.getHours();
  const todayDayType = getDayType();
  const studioEnd = 14; // 2 PM
  const studioStart = 10;
  const studioHoursRemaining = currentHour < studioStart
    ? studioEnd - studioStart
    : currentHour < studioEnd
    ? studioEnd - currentHour
    : 0;

  const time: TimeSnapshot = {
    currentHour,
    currentBlock: getCurrentBlock(currentHour, todayDayType),
    studioHoursRemaining,
  };

  // Session intelligence snapshot
  // Get last 7 days of logs for personal time analysis
  const last7Logs: DailyLog[] = [];
  for (let i = 1; i <= 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const l = await getDailyLog(dStr);
    if (l && (l.oneThing || l.sovereigntyStack || l.sleep !== null)) last7Logs.push(l);
  }

  const qualityLogs = [...recentLogs, ...last7Logs.slice(0, 3)]
    .filter(l => l.sessionQuality !== null && l.sessionQuality !== undefined);
  const recentAvgQuality = qualityLogs.length > 0
    ? qualityLogs.reduce((sum, l) => sum + (l.sessionQuality || 0), 0) / qualityLogs.length
    : 0;

  const personalTimeDays = last7Logs.filter(l => l.personalTime).length;

  // Consecutive days without personal time (streak counter)
  let consecutiveMaxDays = 0;
  for (const l of last7Logs) {
    if (!l.personalTime) consecutiveMaxDays++;
    else break;
  }
  if (!dailyLog.personalTime) consecutiveMaxDays++;

  // Check if Sunday batch prep happened this week
  const lastSunday = new Date();
  lastSunday.setDate(lastSunday.getDate() - lastSunday.getDay());
  const sundayStr = `${lastSunday.getFullYear()}-${String(lastSunday.getMonth() + 1).padStart(2, '0')}-${String(lastSunday.getDate()).padStart(2, '0')}`;
  const sundayLog = await getDailyLog(sundayStr);

  const session: SessionSnapshot = {
    todayQuality: dailyLog.sessionQuality,
    todayType: dailyLog.sessionType || '',
    recentAvgQuality: Math.round(recentAvgQuality * 10) / 10,
    personalTimeDays,
    batchPrepThisWeek: sundayLog?.batchPrepDone || false,
    consecutiveMaxDays,
  };

  // Meta
  const declaredPriority = await getStoreValue<string>("oracle_priority");

  const albumDate = Date.UTC(
    parseInt(ALBUM_RELEASE_DATE.split("-")[0]),
    parseInt(ALBUM_RELEASE_DATE.split("-")[1]) - 1,
    parseInt(ALBUM_RELEASE_DATE.split("-")[2])
  );
  const nowUTC = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const daysUntilAlbum = Math.max(Math.ceil((albumDate - nowUTC) / 86400000), 0);

  // Planner snapshot
  const [sprintTargetData, trackStatuses, sundayChecklistData] = await Promise.all([
    getSprintTarget(weekKey),
    getTrackStatuses(),
    getSundayChecklist(weekKey),
  ]);
  const trackProgress = computeTrackProgress(trackStatuses);
  const planner: PlannerSnapshot = {
    sprintTarget: sprintTargetData.target,
    trackTotal: trackProgress.total,
    trackDone: trackProgress.done,
    trackInProgress: trackProgress.inProgress,
    sundayChecklistComplete: isSundayChecklistComplete(sundayChecklistData),
  };

  // Fan Capture & Live Event reads
  const [
    linktreeSetup, mailchimpSetup,
    setlistLocked, rehearsal1, rehearsal2, gear, contentPlan, synesthesia
  ] = await Promise.all([
    getStoreValue<boolean>("fan_capture_linktree"),
    getStoreValue<boolean>("fan_capture_mailchimp"),
    getStoreValue<boolean>("414day_setlist_locked"),
    getStoreValue<boolean>("414day_rehearsal_1"),
    getStoreValue<boolean>("414day_rehearsal_2"),
    getStoreValue<boolean>("414day_gear_checked"),
    getStoreValue<boolean>("414day_content_capture_plan"),
    getStoreValue<boolean>("414day_synesthesia_tested")
  ]);

  const fanCapture: FanCaptureSnapshot = {
    linktreeSetup: linktreeSetup || false,
    mailchimpSetup: mailchimpSetup || false,
  };

  const livePhase: LiveEventSnapshot = {
    setlistLocked: setlistLocked || false,
    rehearsal1Done: rehearsal1 || false,
    rehearsal2Done: rehearsal2 || false,
    gearChecked: gear || false,
    contentPlan: contentPlan || false,
    synesthesiaTested: synesthesia || false,
  };

  return {
    date: today,
    dayType: todayDayType,
    makeModeWeek: getMakeModeWeek(),
    daysUntilAlbum,
    dailyLog,
    recentLogs,
    releases,
    cycleTracks,
    weeklyStudioSessions: weekSessions.length,
    sobrietyStreak: getSobrietyStreak(),
    lastDecree: lastDecree || null,
    engine,
    income,
    label,
    fuel,
    content,
    time,
    session,
    planner,
    fanCapture,
    livePhase,
    declaredPriority: declaredPriority || null,
  };
}
