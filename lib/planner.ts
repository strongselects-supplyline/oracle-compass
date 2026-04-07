// lib/planner.ts
// Sprint planner data layer — weekly targets, track production status, Sunday ritual.
// All data stored in IndexedDB via the shared compass_store (OracleCompassDB).
// Updated Mar 24, 2026: EP model (4 active, 7 parked), unified DB.

import { getStoreValue, setStoreValue } from '@/lib/db';
import { getWeekKey } from '@/lib/oracle';

// ── Types ───────────────────────────────────────────────────────────────────

export type TrackPhase = 'not_started' | 'track' | 'mix' | 'master' | 'instrumental' | 'done';

export type TrackProductionStatus = {
  name: string;
  phase: TrackPhase;
  notes: string;
  parked?: boolean; // parked tracks are stretch goals only
};

export type SprintTarget = {
  weekKey: string;
  target: string;
};

export type SundayChecklist = {
  weekKey: string;
  sprintReviewed: boolean;
  tracksUpdated: boolean;
  batchPrepSet: boolean;
  weekLoadedIntoOracle: boolean;
  // Grief protocol — committed post-EP (starts Apr 27, 2026).
  // 20-min journaling session. Write to your father. Controlled exposure, not floodgates.
  // Only shown on Sundays on or after Apr 27.
  griefJournalDone?: boolean;
};

// ── Track list — EP model ───────────────────────────────────────────────────

// 4 EP tracks (active) + 7 parked tracks
const EP_ACTIVE_TRACKS: string[] = [
  'SEE ME',
  'EAST SIDE LOVE',
  'SWEET FRUSTRATION',
  'LIKE I DID',
];

const PARKED_TRACKS: string[] = [
  'I LIKE GIRLS',
  'WANT U BAD',
  'GREEN LIGHT PATIENT',
  'LUXURY',
  'WORTH IT',
  'JUST SAY SO',
  'RECONNECT',
];

export const ALL_TRACKS: string[] = [...EP_ACTIVE_TRACKS, ...PARKED_TRACKS];
export const ALL_LOVE_TRACK_COUNT = ALL_TRACKS.length;

function defaultTrackStatuses(): TrackProductionStatus[] {
  return [
    ...EP_ACTIVE_TRACKS.map(name => ({ name, phase: 'not_started' as TrackPhase, notes: '' })),
    ...PARKED_TRACKS.map(name => ({ name, phase: 'not_started' as TrackPhase, notes: '', parked: true })),
  ];
}

// Grief protocol starts Apr 27, 2026 (first Sunday after EP drops)
const GRIEF_PROTOCOL_START = new Date("2026-04-27T00:00:00");

export function isGriefProtocolActive(date: Date = new Date()): boolean {
  return date >= GRIEF_PROTOCOL_START;
}

function defaultSundayChecklist(weekKey: string): SundayChecklist {
  return {
    weekKey,
    sprintReviewed: false,
    tracksUpdated: false,
    batchPrepSet: false,
    weekLoadedIntoOracle: false,
    griefJournalDone: false,
  };
}

// ── Storage keys ────────────────────────────────────────────────────────────

const TRACK_STATUS_KEY = 'planner_track_statuses';
const TRACK_STATUS_VERSION_KEY = 'planner_track_version';
const TRACK_DATA_VERSION = 3; // v3: EP model (4 active + 7 parked), unified DB

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
    // Ensure parked flags are set correctly
    const patched = stored.map(t => ({
      ...t,
      parked: PARKED_TRACKS.includes(t.name) ? true : undefined,
    }));
    // Add any missing tracks
    const names = new Set(patched.map(t => t.name));
    const missing = ALL_TRACKS.filter(n => !names.has(n)).map(name => ({
      name,
      phase: 'not_started' as TrackPhase,
      notes: '',
      parked: PARKED_TRACKS.includes(name) ? true : undefined,
    }));
    return [...patched, ...missing];
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
  activeTotal: number;
  activeDone: number;
} {
  const active = statuses.filter(t => !t.parked);
  const total = statuses.length;
  const done = statuses.filter(t => t.phase === 'done').length;
  const inProgress = statuses.filter(t => t.phase !== 'not_started' && t.phase !== 'done').length;
  return {
    total,
    done,
    inProgress,
    activeTotal: active.length,
    activeDone: active.filter(t => t.phase === 'done').length,
  };
}

export function isSundayChecklistComplete(checklist: SundayChecklist, date: Date = new Date()): boolean {
  const baseComplete = (
    checklist.sprintReviewed &&
    checklist.tracksUpdated &&
    checklist.batchPrepSet &&
    checklist.weekLoadedIntoOracle
  );
  // Grief protocol required after Apr 27
  if (isGriefProtocolActive(date)) {
    return baseComplete && (checklist.griefJournalDone ?? false);
  }
  return baseComplete;
}

// Phase display helpers
export const PHASE_LABELS: Record<TrackPhase, string> = {
  not_started: '\u2014',
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
