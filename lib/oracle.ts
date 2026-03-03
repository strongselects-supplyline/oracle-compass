// lib/oracle.ts
// Assembles the full daily context snapshot for the Oracle engine.
// Reads all IndexedDB state into a single typed object sent to /api/oracle.

import { getDailyLog, getStoreValue, getTodayISO, DailyLog } from "@/lib/db";
import { getSobrietyStreak } from "@/lib/streaks";
import { getDynamicReleases, Release, ALBUM_RELEASE_DATE } from "@/lib/releases";

export type CycleTrack = {
  name: string;
  storageKey: string;
  status: string;
};

export type OracleContext = {
  date: string;
  makeModeWeek: number;
  daysUntilAlbum: number;
  dailyLog: DailyLog;
  previousLog: DailyLog | null;
  releases: Release[];
  cycleTracks: CycleTrack[];
  weeklyStudioSessions: number;
  sobrietyStreak: number;
  lastDecree: OracleDecree | null;
};

export type Realignment =
  | { type: "shift_release"; target: string; days: number; reason: string }
  | { type: "update_cycle_status"; track: string; new_status: string; reason: string }
  | { type: "set_focus_requirement"; hours: number; reason: string }
  | { type: "no_change" };

export type OracleDecree = {
  assessment: string;
  severity: "GREEN" | "AMBER" | "RED";
  oracle_message: string;
  realignments: Realignment[];
};

const CYCLE_TRACKS = [
  { name: "RECONNECT",  storageKey: "cycle_reconnect" },
  { name: "WANT U 2",   storageKey: "cycle_wantu2" },
  { name: "WORTH IT",   storageKey: "cycle_worthit" },
  { name: "JUST SAY SO", storageKey: "cycle_justsayso" },
];

function getMakeModeWeek(): number {
  const start = Date.UTC(2026, 1, 20);
  const now = Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
  const days = Math.floor((now - start) / (1000 * 60 * 60 * 24));
  return Math.min(Math.max(Math.ceil(days / 7), 1), 5);
}

function getWeekKey(): string {
  const now = new Date();
  const d = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const year = d.getUTCFullYear();
  const week = Math.ceil(((d.getTime() - Date.UTC(year, 0, 1)) / 86400000 + 1) / 7);
  return `${year}-W${String(week).padStart(2, "0")}`;
}

export async function assembleContext(): Promise<OracleContext> {
  const today = getTodayISO();

  // Yesterday ISO
  const yd = new Date();
  yd.setDate(yd.getDate() - 1);
  const yesterday = `${yd.getFullYear()}-${String(yd.getMonth() + 1).padStart(2, "0")}-${String(yd.getDate()).padStart(2, "0")}`;

  const [dailyLog, previousLog, releases, sessions, lastDecree] = await Promise.all([
    getDailyLog(today),
    getDailyLog(yesterday),
    getDynamicReleases(),
    getStoreValue<number>(`weekly_sessions:${getWeekKey()}`),
    getStoreValue<OracleDecree>(`oracle_decree:${today}`),
  ]);

  const cycleTracks: CycleTrack[] = await Promise.all(
    CYCLE_TRACKS.map(async t => ({
      ...t,
      status: (await getStoreValue<string>(t.storageKey)) || "add",
    }))
  );

  const albumDate = Date.UTC(
    parseInt(ALBUM_RELEASE_DATE.split("-")[0]),
    parseInt(ALBUM_RELEASE_DATE.split("-")[1]) - 1,
    parseInt(ALBUM_RELEASE_DATE.split("-")[2])
  );
  const nowUTC = Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
  const daysUntilAlbum = Math.max(Math.ceil((albumDate - nowUTC) / 86400000), 0);

  return {
    date: today,
    makeModeWeek: getMakeModeWeek(),
    daysUntilAlbum,
    dailyLog,
    previousLog: previousLog?.oneThing || previousLog?.sovereigntyStack ? previousLog : null,
    releases,
    cycleTracks,
    weeklyStudioSessions: sessions || 0,
    sobrietyStreak: getSobrietyStreak(),
    lastDecree: lastDecree || null,
  };
}
