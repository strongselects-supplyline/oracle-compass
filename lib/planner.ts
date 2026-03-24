// lib/planner.ts
// Sprint planner data layer — weekly targets, track production status, Sunday ritual.
// All data stored in IndexedDB via the shared compass_store.

import { getStoreValue, setStoreValue } from '@/lib/db';
import { getWeekKey } from '@/lib/oracle';

// ── Types ───────────────────────────────────────────────────────────────────

export type TrackPhase = 'not_started' | 'track' | 'mix' | 'master' | 'instrumental' | 'done';

export type TrackProductionStatus = {
  name: string;
  phase: TrackPhase;
  notes: string;
};

export type SprintTarget = {
  weekKey: string;
  target: string; // free-text weekly focus
};

export type SundayChecklist = {
  weekKey: string;
  sprintReviewed: boolean;
  tracksUpdated: boolean;
  batchPrepSet: boolean;
  weekLoadedIntoOracle: boolean;
};

// ── Default track list ──────────────────────────────────────────────────────

// ALL LOVE EP — 4 tracks (updated March 24, 2026)
// Parked tracks (post-EP TBD): I LIKE GIRLS, WANT U BAD, GREEN LIGHT PATIENT, LUXURY, WORTH IT, JUST SAY SO, RECONNECT
const ALL_LOVE_TRACKS: string[] = [
  'SEE ME',
  'EAST SIDE LOVE',
  'SWEET FRUSTRATION',
  'LIKE I DID',
];

export const ALL_TRACKS: string[] = [...ALL_LOVE_TRACKS];

export const ALL_LOVE_TRACK_COUNT = ALL_LOVE_TRACKS.length;

function defaultTrackStatuses(): TrackProductionStatus[] {
  return ALL_TRACKS.map(name => ({
    name,
    phase: 'not_started',
    notes: '',
  }));
}

function defaultSundayChecklist(weekKey: string): SundayChecklist {
  return {
    weekKey,
    sprintReviewed: false,
    tracksUpdated: false,
    batchPrepSet: false,
    weekLoadedIntoOracle: false,
  };
}

// ── Storage keys ────────────────────────────────────────────────────────────

const TRACK_STATUS_KEY = 'planner_track_statuses';
const TRACK_STATUS_VERSION_KEY = 'planner_track_version';
const TRACK_DATA_VERSION = 3; // Bumped: EP model — 4 active tracks, 7 parked (Mar 24 2026)

// ── Track production status ─────────────────────────────────────────────────

export async function getTrackStatuses(): Promise<TrackProductionStatus[]> {
  const version = await getStoreValue<number>(TRACK_STATUS_VERSION_KEY);
  if (version !== TRACK_DATA_VERSION) {
    const defaults = defaultTrackStatuses();
    await setStoreValue(TRACK_STATUS_KEY, defaults);
    await setStoreValue(TRACK_STATUS_VERSION_KEY, TRACK_DATA_VERSION);
    return defaults;
  }

  const stored = await getStoreValue<TrackProductionStatus[]>(TRACK_STATUS_KEY);
  if (stored && stored.length > 0) {
    // Ensure any new tracks added since last save are included
    const names = new Set(stored.map(t => t.name));
    const missing = ALL_TRACKS.filter(n => !names.has(n)).map(name => ({
      name,
      phase: 'not_started' as TrackPhase,
      notes: '',
    }));
    return [...stored, ...missing];
  }

  const defaults = defaultTrackStatuses();
  await setStoreValue(TRACK_STATUS_KEY, defaults);
  await setStoreValue(TRACK_STATUS_VERSION_KEY, TRACK_DATA_VERSION);
  return defaults;
}

export async function saveTrackStatuses(statuses: TrackProductionStatus[]): Promise<void> {
  await setStoreValue(TRACK_STATUS_KEY, statuses);
}

export async function updateTrackPhase(name: string, phase: TrackPhase): Promise<void> {
  const statuses = await getTrackStatuses();
  const updated = statuses.map(t => t.name === name ? { ...t, phase } : t);
  await saveTrackStatuses(updated);
}

// ── Sprint target ───────────────────────────────────────────────────────────

export async function getSprintTarget(weekKey?: string): Promise<SprintTarget> {
  const key = weekKey || getWeekKey();
  const stored = await getStoreValue<SprintTarget>(`sprint_target:${key}`);
  return stored || { weekKey: key, target: '' };
}

export async function saveSprintTarget(target: string, weekKey?: string): Promise<void> {
  const key = weekKey || getWeekKey();
  await setStoreValue(`sprint_target:${key}`, { weekKey: key, target });
}

// ── Sunday checklist ────────────────────────────────────────────────────────

export async function getSundayChecklist(weekKey?: string): Promise<SundayChecklist> {
  const key = weekKey || getWeekKey();
  const stored = await getStoreValue<SundayChecklist>(`sunday_checklist:${key}`);
  return stored || defaultSundayChecklist(key);
}

export async function saveSundayChecklist(checklist: SundayChecklist): Promise<void> {
  const key = checklist.weekKey || getWeekKey();
  await setStoreValue(`sunday_checklist:${key}`, checklist);
}

// ── Marathon Data Migration (from deleted marathon-data.ts) ──────────────────

export type Phase = 'ALL_LOVE' | 'DELUXE' | 'CREAM' | 'FREAKSHOW' | 'BUFFER';

export interface SprintWeek {
  wk: number;
  dates: string;
  startDate: string;
  endDate: string;
  phase: Phase | 'BUFFER';
  phaseBadge: string;
  target: string;
  total: number;
  keyEvents: string[];
}

export const PHASE_CONFIG: Record<Phase, { label: string; badge: string; color: string }> = {
  ALL_LOVE:  { label: 'ALL LOVE',  badge: 'ALL LOVE',  color: '#C8952A' },
  DELUXE:    { label: 'DELUXE',    badge: 'DELUXE',    color: '#A07830' },
  CREAM:     { label: 'CREAM',     badge: 'CREAM',     color: '#9A9A9A' },
  FREAKSHOW: { label: 'FREAKSHOW', badge: 'FREAKSHOW', color: '#9A70C0' },
  BUFFER:    { label: 'BUFFER',    badge: 'BUFFER',    color: '#666666' },
};

export const SPRINT_WEEKS: SprintWeek[] = [
  {
    wk: 1, dates: 'Mar 7–13', startDate: '2026-03-07', endDate: '2026-03-13',
    phase: 'ALL_LOVE', phaseBadge: 'ALL LOVE', target: '4 tracks', total: 4,
    keyEvents: ['SEE ME drops Mar 13'],
  },
  {
    wk: 2, dates: 'Mar 14–20', startDate: '2026-03-14', endDate: '2026-03-20',
    phase: 'ALL_LOVE', phaseBadge: 'ALL LOVE', target: '4 tracks — close EP', total: 4,
    keyEvents: ['East Side Love upload deadline Mar 30', 'ALL LOVE EP front-load window closes Mar 28'],
  },
  {
    wk: 3, dates: 'Mar 22–28', startDate: '2026-03-22', endDate: '2026-03-28',
    phase: 'DELUXE', phaseBadge: 'DELUXE', target: '3 tracks', total: 14,
    keyEvents: ['East Side Love drops Apr 3', 'Upload ESL to Amuse by Mar 30', 'Every CTA: "save East Side Love"', '$50 Spotify Ad Studio (Denver, Minneapolis, Dallas, Calgary)'],
  },
  {
    wk: 4, dates: 'Mar 29–Apr 4', startDate: '2026-03-29', endDate: '2026-04-04',
    phase: 'DELUXE', phaseBadge: 'DELUXE', target: '3 tracks', total: 17,
    keyEvents: ['ESL Amuse upload deadline Mar 30', 'East Side Love drops Apr 3 🔥', 'SF mix/master close target Apr 1', 'LID mix/master close target Apr 1', '$50 ad push — Denver, Minneapolis, Dallas, Calgary', 'First 414 Day rehearsal (timed, recorded)'],
  },
  {
    wk: 5, dates: 'Apr 5–11', startDate: '2026-04-05', endDate: '2026-04-11',
    phase: 'DELUXE', phaseBadge: 'DELUXE', target: '3 tracks + album upload', total: 20,
    keyEvents: ['SF Amuse upload deadline Apr 6', 'Sweet Frustration drops Apr 10 🔥', 'LID Amuse upload deadline Apr 13', '$50 ad push', 'CTAs: "save Sweet Frustration" + "pre-save ALL LOVE"', 'Second 414 Day rehearsal + gear check', 'Compliance done for all four singles'],
  },
  {
    wk: 6, dates: 'Apr 12–18', startDate: '2026-04-12', endDate: '2026-04-18',
    phase: 'DELUXE', phaseBadge: 'DELUXE / CREAM', target: '3 tracks', total: 23,
    keyEvents: ['LID Amuse upload deadline Apr 13', 'EP Amuse upload deadline Apr 14', '414 Day performance Apr 14 🎤 (GF filming)', 'QR code at venue → Spotify pre-save', 'Like I Did drops Apr 17', '$50 ad push (LID)', 'All CTAs shift to "pre-save ALL LOVE EP"'],
  },
  {
    wk: 7, dates: 'Apr 19–25', startDate: '2026-04-19', endDate: '2026-04-25',
    phase: 'CREAM', phaseBadge: 'CREAM', target: '3 tracks', total: 26,
    keyEvents: ['ALL LOVE EP drops Apr 24 🔥', '$75 Spotify ad push (EP — all markets)', 'First week stream check (target score 20→ 25+)', 'Deploy 414 Day performance footage', 'DELUXE planning begins'],
  },
  {
    wk: 8, dates: 'Apr 26–May 2', startDate: '2026-04-26', endDate: '2026-05-02',
    phase: 'CREAM', phaseBadge: 'CREAM', target: '3 tracks', total: 29,
    keyEvents: [],
  },
  {
    wk: 9, dates: 'May 3–9', startDate: '2026-05-03', endDate: '2026-05-09',
    phase: 'CREAM', phaseBadge: 'CREAM', target: '3 tracks', total: 32,
    keyEvents: [],
  },
  {
    wk: 10, dates: 'May 10–16', startDate: '2026-05-10', endDate: '2026-05-16',
    phase: 'FREAKSHOW', phaseBadge: 'FREAKSHOW', target: '3 tracks', total: 35,
    keyEvents: [],
  },
  {
    wk: 11, dates: 'May 17–23', startDate: '2026-05-17', endDate: '2026-05-23',
    phase: 'FREAKSHOW', phaseBadge: 'FREAKSHOW', target: '3 tracks', total: 38,
    keyEvents: [],
  },
  {
    wk: 12, dates: 'May 24–30', startDate: '2026-05-24', endDate: '2026-05-30',
    phase: 'FREAKSHOW', phaseBadge: 'FREAKSHOW', target: '2 tracks', total: 40,
    keyEvents: [],
  },
  {
    wk: 13, dates: 'May 31–Jun 6', startDate: '2026-05-31', endDate: '2026-06-06',
    phase: 'FREAKSHOW', phaseBadge: 'FREAKSHOW', target: '3 tracks', total: 43,
    keyEvents: ['Marathon complete 🏁'],
  },
  {
    wk: 14, dates: 'Jun 7–13', startDate: '2026-06-07', endDate: '2026-06-13',
    phase: 'BUFFER', phaseBadge: 'BUFFER', target: '—', total: 43,
    keyEvents: ['Overflow / flex window'],
  },
];

export const SPRINT_RULES = [
  { label: 'Session Length',   value: '4 hours / day (10 AM – 2 PM)' },
  { label: 'Track Structure',  value: 'Dual-track per session' },
  { label: 'Efficiency Curve', value: '8% compounding per week' },
  { label: 'Track Floor',      value: '10 hrs minimum per track' },
  { label: 'Sundays',          value: 'SACRED — no sessions' },
  { label: 'Studio Block',     value: '10 AM – 2 PM (inviolable)' },
];

export const TOTAL_TRACKS = 43;

// ── Computed helpers ────────────────────────────────────────────────────────

export function computeTrackProgress(statuses: TrackProductionStatus[]): {
  total: number;
  done: number;
  inProgress: number;
} {
  const total = statuses.length;
  const done = statuses.filter(t => t.phase === 'done').length;
  const inProgress = statuses.filter(t => t.phase !== 'not_started' && t.phase !== 'done').length;
  return { total, done, inProgress };
}

export function isSundayChecklistComplete(checklist: SundayChecklist): boolean {
  return (
    checklist.sprintReviewed &&
    checklist.tracksUpdated &&
    checklist.batchPrepSet &&
    checklist.weekLoadedIntoOracle
  );
}

// Phase display helpers
export const PHASE_LABELS: Record<TrackPhase, string> = {
  not_started: '—',
  track: 'TRK',
  mix: 'MIX',
  master: 'MAS',
  instrumental: 'INST',
  done: 'DONE',
};

export const PHASE_ORDER: TrackPhase[] = [
  'not_started',
  'track',
  'mix',
  'master',
  'instrumental',
  'done',
];

export function nextPhase(current: TrackPhase): TrackPhase {
  const idx = PHASE_ORDER.indexOf(current);
  if (idx < PHASE_ORDER.length - 1) return PHASE_ORDER[idx + 1];
  return current;
}
