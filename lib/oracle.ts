// lib/oracle.ts
// Assembles the full daily context snapshot for the Oracle engine.
// Reads ALL IndexedDB state — music, grind, business, income, label — into one typed object.

import { getDailyLog, getStoreValue, getTodayISO, DailyLog } from "@/lib/db";
import { getSobrietyStreak } from "@/lib/streaks";
import { getDynamicReleases, Release, ALBUM_RELEASE_DATE } from "@/lib/releases";
import { REGISTRY } from "@/lib/registry";
import { fetchDashboardIncome } from "@/lib/dashboardBridge";

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
  doordashEarningsThisMonth: number; // rolling 4-week sum
  ssRevenueThisWeek: number;
};

export type LabelSnapshot = {
  complianceGaps: string[];
  nextReleaseTitle: string;
  daysUntilNextRelease: number;
};

export type OracleContext = {
  date: string;
  makeModeWeek: number;
  daysUntilAlbum: number;
  dailyLog: DailyLog;
  recentLogs: DailyLog[]; // Last 3 days for pattern detection
  releases: Release[];
  cycleTracks: CycleTrack[];
  weeklyStudioSessions: number;
  sobrietyStreak: number;
  lastDecree: OracleDecree | null;
  engine: EngineSnapshot;
  income: IncomeSnapshot;
  label: LabelSnapshot;
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
  realignments: Realignment[];
};

export type OracleFlag = {
  action: string;
  urgency: "RED" | "AMBER";
  reason: string;
};

const CYCLE_TRACKS = [
  { name: "RECONNECT", storageKey: "cycle_reconnect" },
  { name: "WANT U 2", storageKey: "cycle_wantu2" },
  { name: "WORTH IT", storageKey: "cycle_worthit" },
  { name: "JUST SAY SO", storageKey: "cycle_justsayso" },
];

function getMakeModeWeek(): number {
  const start = Date.UTC(2026, 1, 20);
  const now = Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
  const days = Math.floor((now - start) / (1000 * 60 * 60 * 24));
  return Math.min(Math.max(Math.ceil(days / 7), 1), 5);
}

// Exported so Engine page can use same key pattern
export function getWeekKey(offsetWeeks = 0): string {
  const now = new Date();
  if (offsetWeeks > 0) now.setDate(now.getDate() - offsetWeeks * 7);
  const d = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const year = d.getUTCFullYear();
  const week = Math.ceil(((d.getTime() - Date.UTC(year, 0, 1)) / 86400000 + 1) / 7);
  return `${year}-W${String(week).padStart(2, "0")}`;
}

export async function assembleContext(): Promise<OracleContext> {
  const today = getTodayISO();
  const yd = new Date();
  yd.setDate(yd.getDate() - 1);
  const yesterday = `${yd.getFullYear()}-${String(yd.getMonth() + 1).padStart(2, "0")}-${String(yd.getDate()).padStart(2, "0")}`;
  const weekKey = getWeekKey();

  // ── Music + Grind reads ─────────────────────────────────
  const [dailyLog, log1, log2, log3, releases, sessions, lastDecree] = await Promise.all([
    getDailyLog(today),
    getDailyLog(yesterday),
    getDailyLog(`${yd.getFullYear()}-${String(yd.getMonth() + 1).padStart(2, "0")}-${String(yd.getDate() - 1).padStart(2, "0")}`),
    getDailyLog(`${yd.getFullYear()}-${String(yd.getMonth() + 1).padStart(2, "0")}-${String(yd.getDate() - 2).padStart(2, "0")}`),
    getDynamicReleases(),
    getStoreValue<number>(`weekly_sessions:${weekKey}`),
    getStoreValue<OracleDecree>(`oracle_decree:${today}`),
  ]);

  const recentLogs = [log1, log2, log3].filter(l => l && (l.oneThing || l.sovereigntyStack || l.sleep !== null));

  const cycleTracks: CycleTrack[] = await Promise.all(
    CYCLE_TRACKS.map(async t => ({
      ...t,
      status: (await getStoreValue<string>(t.storageKey)) || "add",
    }))
  );

  // ── Engine reads ────────────────────────────────────────
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
    accounts: (rawAccounts || []).map(a => ({
      name: a.name,
      daysSinceContact: a.days,
    })),
  };

  // ── Income reads — try Dashboard API first, fall back to IndexedDB ──
  const dashboardIncome = await fetchDashboardIncome();

  let income: IncomeSnapshot;
  if (dashboardIncome) {
    income = dashboardIncome;
  } else {
    // Fallback: manual weekly totals from IndexedDB
    const [ddW0, ddW1, ddW2, ddW3, ssRevenue] = await Promise.all([
      getStoreValue<{ shifts: number; earnings: number }>(`doordash_week:${getWeekKey(0)}`),
      getStoreValue<{ shifts: number; earnings: number }>(`doordash_week:${getWeekKey(1)}`),
      getStoreValue<{ shifts: number; earnings: number }>(`doordash_week:${getWeekKey(2)}`),
      getStoreValue<{ shifts: number; earnings: number }>(`doordash_week:${getWeekKey(3)}`),
      getStoreValue<number>(`ss_revenue:${weekKey}`),
    ]);

    const monthlyDoorDash = [ddW0, ddW1, ddW2, ddW3]
      .filter(Boolean)
      .reduce((sum, w) => sum + (w?.earnings || 0), 0);

    income = {
      doordashShiftsThisWeek: ddW0?.shifts || 0,
      doordashEarningsThisWeek: ddW0?.earnings || 0,
      doordashEarningsThisMonth: monthlyDoorDash,
      ssRevenueThisWeek: ssRevenue || 0,
    };
  }

  // ── Label compliance — derived live from REGISTRY ───────
  const now = new Date();
  const upcomingReleases = releases.filter(r => r.status !== "live");
  const nextRelease = upcomingReleases[0] || null;
  const daysUntilNext = nextRelease
    ? Math.ceil((new Date(nextRelease.releaseDate).getTime() - now.getTime()) / 86400000)
    : 999;

  const registryEntry = nextRelease
    ? REGISTRY.find(t => t.title === nextRelease.title)
    : null;

  const complianceGaps: string[] = [];
  if (registryEntry) {
    if (!registryEntry.isrc) complianceGaps.push("ISRC not assigned");
    if (registryEntry.ascap !== "complete") complianceGaps.push(`ASCAP: ${registryEntry.ascap}`);
    if (registryEntry.mlc !== "complete") complianceGaps.push(`MLC: ${registryEntry.mlc}`);
    if (registryEntry.songtrust !== "complete") complianceGaps.push(`Songtrust: ${registryEntry.songtrust}`);
    if (!registryEntry.instrumentalRendered) complianceGaps.push("Instrumental not rendered");
    if (!registryEntry.splitSheetSigned && registryEntry.collaborators.length > 0)
      complianceGaps.push("Split sheet not signed");
  }

  const label: LabelSnapshot = {
    complianceGaps,
    nextReleaseTitle: nextRelease?.title || "none",
    daysUntilNextRelease: daysUntilNext,
  };

  // ── Meta ────────────────────────────────────────────────
  const declaredPriority = await getStoreValue<string>("oracle_priority");

  const albumDate = Date.UTC(
    parseInt(ALBUM_RELEASE_DATE.split("-")[0]),
    parseInt(ALBUM_RELEASE_DATE.split("-")[1]) - 1,
    parseInt(ALBUM_RELEASE_DATE.split("-")[2])
  );
  const nowUTC = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const daysUntilAlbum = Math.max(Math.ceil((albumDate - nowUTC) / 86400000), 0);

  return {
    date: today,
    makeModeWeek: getMakeModeWeek(),
    daysUntilAlbum,
    dailyLog,
    recentLogs,
    releases,
    cycleTracks,
    weeklyStudioSessions: sessions || 0,
    sobrietyStreak: getSobrietyStreak(),
    lastDecree: lastDecree || null,
    engine,
    income,
    label,
    declaredPriority: declaredPriority || null,
  };
}
