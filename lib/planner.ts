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
  await setStoreValue(`sunday_checklist:${checklist.weekKey}`, checklist);
}

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
