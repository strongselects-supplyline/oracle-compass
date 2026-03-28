// lib/streaming.ts
// Streaming velocity tracker — manual daily entry, algorithmic projection.
// Feeds Kill List tasks, Oracle severity, and the /velocity page.
// Built March 28, 2026.

import { getStoreValue, setStoreValue, getTodayISO } from "@/lib/db";

// ── Types ─────────────────────────────────────────────────────────────

export type StreamEntry = {
  date: string;        // YYYY-MM-DD
  streams: number;     // total streams for that day (from Spotify for Artists)
  saves: number;       // saves count (0 if not logged)
  completions: number; // completions (0 if not logged)
};

export type PopularityTier =
  | "none"        // <500/day — below algorithmic threshold
  | "emerging"    // 500-3K/day — editorial consideration range
  | "algorithmic" // 3K-10K/day — Release Radar + Discover Weekly pull
  | "viral";      // 10K+/day

export type VelocityTrend = "new" | "up" | "flat" | "down";

export type TrackVelocity = {
  title: string;
  releaseDate: string;
  entries: StreamEntry[];
  derived: {
    totalStreams: number;
    sevenDayAvg: number;      // streams/day avg over last 7 days with entries
    saveRate: number;         // saves / streams as %
    completionRate: number;   // completions / streams as %
    trending: VelocityTrend;
    projectedDay28: number;   // extrapolated 28-day total at current pace
    popularityTier: PopularityTier;
    daysSinceRelease: number;
  };
};

// Spotify popularity score thresholds (from routing playbook)
export const POPULARITY_THRESHOLDS = {
  viral: 10000,      // 10K+/day sustained
  algorithmic: 3000, // 3K+/day → Release Radar + Discover Weekly
  emerging: 500,     // 500+/day → editorial consideration
};

export const TIER_COLORS: Record<PopularityTier, string> = {
  none: "#555555",
  emerging: "#f59e0b",
  algorithmic: "#22c55e",
  viral: "#8b5cf6",
};

export const TIER_LABELS: Record<PopularityTier, string> = {
  none: "SUB-THRESHOLD",
  emerging: "EMERGING",
  algorithmic: "ALGORITHMIC",
  viral: "VIRAL",
};

// ── Storage Keys ──────────────────────────────────────────────────────

function trackSlug(title: string): string {
  return title.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
}

function streamKey(title: string, date: string): string {
  return `stream:${trackSlug(title)}:${date}`;
}

function entryDatesKey(title: string): string {
  return `stream_dates:${trackSlug(title)}`;
}

// ── Write ─────────────────────────────────────────────────────────────

export async function logStreamEntry(
  title: string,
  entry: { streams: number; saves?: number; completions?: number }
): Promise<void> {
  const date = getTodayISO();
  const full: StreamEntry = {
    date,
    streams: entry.streams,
    saves: entry.saves ?? 0,
    completions: entry.completions ?? 0,
  };
  await setStoreValue(streamKey(title, date), full);

  // Maintain sorted date index
  const dates = (await getStoreValue<string[]>(entryDatesKey(title))) ?? [];
  if (!dates.includes(date)) {
    const updated = [...dates, date].sort();
    await setStoreValue(entryDatesKey(title), updated);
  }
}

// ── Read ──────────────────────────────────────────────────────────────

export async function getTodayStreamEntry(
  title: string
): Promise<StreamEntry | null> {
  return getStoreValue<StreamEntry>(streamKey(title, getTodayISO()));
}

export async function getStreamHistory(
  title: string,
  days = 30
): Promise<StreamEntry[]> {
  const allDates = (await getStoreValue<string[]>(entryDatesKey(title))) ?? [];
  const recentDates = allDates.slice(-days);
  const entries = await Promise.all(
    recentDates.map((d) => getStoreValue<StreamEntry>(streamKey(title, d)))
  );
  return entries.filter(Boolean) as StreamEntry[];
}

// ── Compute ───────────────────────────────────────────────────────────

export function computeVelocity(
  title: string,
  releaseDate: string,
  entries: StreamEntry[]
): TrackVelocity {
  if (entries.length === 0) {
    return {
      title, releaseDate, entries,
      derived: {
        totalStreams: 0, sevenDayAvg: 0, saveRate: 0, completionRate: 0,
        trending: "new", projectedDay28: 0, popularityTier: "none",
        daysSinceRelease: 0,
      },
    };
  }

  const totalStreams = entries.reduce((s, e) => s + e.streams, 0);
  const totalSaves = entries.reduce((s, e) => s + e.saves, 0);
  const totalCompletions = entries.reduce((s, e) => s + e.completions, 0);

  const last7 = entries.slice(-7);
  const prev7 = entries.slice(-14, -7);

  const sevenDayAvg =
    last7.length > 0
      ? last7.reduce((s, e) => s + e.streams, 0) / last7.length
      : 0;

  const prev7Avg =
    prev7.length > 0
      ? prev7.reduce((s, e) => s + e.streams, 0) / prev7.length
      : 0;

  let trending: VelocityTrend = "new";
  if (entries.length >= 3) {
    if (sevenDayAvg > prev7Avg * 1.1) trending = "up";
    else if (sevenDayAvg < prev7Avg * 0.9) trending = "down";
    else trending = "flat";
  }

  const saveRate = totalStreams > 0 ? (totalSaves / totalStreams) * 100 : 0;
  const completionRate =
    totalStreams > 0 ? (totalCompletions / totalStreams) * 100 : 0;

  // 28-day projection: current total + (7-day avg × remaining days in 28-day window)
  const daysSinceRelease = entries.length;
  const remainingDays = Math.max(0, 28 - daysSinceRelease);
  const projectedDay28 = Math.round(totalStreams + sevenDayAvg * remainingDays);

  const popularityTier: PopularityTier =
    sevenDayAvg >= POPULARITY_THRESHOLDS.viral ? "viral" :
    sevenDayAvg >= POPULARITY_THRESHOLDS.algorithmic ? "algorithmic" :
    sevenDayAvg >= POPULARITY_THRESHOLDS.emerging ? "emerging" : "none";

  return {
    title, releaseDate, entries,
    derived: {
      totalStreams,
      sevenDayAvg: Math.round(sevenDayAvg),
      saveRate: Math.round(saveRate * 10) / 10,
      completionRate: Math.round(completionRate * 10) / 10,
      trending,
      projectedDay28,
      popularityTier,
      daysSinceRelease,
    },
  };
}

export async function getTrackVelocity(
  title: string,
  releaseDate: string
): Promise<TrackVelocity> {
  const entries = await getStreamHistory(title, 30);
  return computeVelocity(title, releaseDate, entries);
}

export async function getAllVelocities(
  releases: { title: string; releaseDate: string; status: string }[]
): Promise<TrackVelocity[]> {
  const tracked = releases.filter(
    (r) => r.status === "live" || r.status === "upload_pending"
  );
  return Promise.all(tracked.map((r) => getTrackVelocity(r.title, r.releaseDate)));
}

// ── Save Rate Quality Signal ──────────────────────────────────────────
// Target: 3-5%+ save rate = strong algorithmic signal per the playbook

export function saveRateSignal(rate: number): {
  label: string;
  color: string;
  advisory: string;
} {
  if (rate >= 5)
    return { label: "EXCELLENT", color: "#22c55e", advisory: "Algorithm is noticing. Keep the content pressure on." };
  if (rate >= 3)
    return { label: "STRONG", color: "#22c55e", advisory: "On target. Save CTAs are working." };
  if (rate >= 1.5)
    return { label: "BUILDING", color: "#f59e0b", advisory: "Push harder on 'Save this track' CTAs in every post." };
  if (rate > 0)
    return { label: "WEAK", color: "#ef4444", advisory: "Save rate is critical. Every post needs 'SAVE [track]' as first CTA." };
  return { label: "NO DATA", color: "#555", advisory: "Log saves from Spotify for Artists to activate this signal." };
}
