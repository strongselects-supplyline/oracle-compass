// lib/studioLog.ts
// Per-track studio session logging.
// Stores granular session data: which track, how many hours, phase transitions.
// IndexedDB for Oracle context + Google Sheets for server-side persistence.

import { getStoreValue, setStoreValue, getAllWithPrefix, getTodayISO } from '@/lib/db';
import { TrackPhase, getTrackStatuses, saveTrackStatuses } from '@/lib/planner';

// ── Types ───────────────────────────────────────────────────────────────────

export type StudioSessionEntry = {
  id: string;           // unique ID: `session_${timestamp}`
  date: string;         // YYYY-MM-DD
  trackName: string;    // matches planner track name
  hours: number;        // hours spent this session
  sessionType: string;  // recording | mixing | mastering | writing
  phaseBefore: TrackPhase;
  phaseAfter: TrackPhase;
  quality: number | null; // 1-5
  notes: string;
  createdAt: string;    // ISO timestamp
};

export type TrackHoursSummary = {
  trackName: string;
  totalHours: number;
  sessionCount: number;
  currentPhase: TrackPhase;
};

// ── Storage ─────────────────────────────────────────────────────────────────

const SESSION_PREFIX = 'studio_session:';

export async function saveStudioSession(entry: StudioSessionEntry): Promise<void> {
  await setStoreValue(`${SESSION_PREFIX}${entry.id}`, entry);

  // Also update the running daily total in a quick-access key
  const dailyKey = `studio_hours:${entry.date}`;
  const current = (await getStoreValue<number>(dailyKey)) || 0;
  await setStoreValue(dailyKey, current + entry.hours);
}

export async function getTodaySessions(): Promise<StudioSessionEntry[]> {
  const all = await getAllWithPrefix<StudioSessionEntry>(SESSION_PREFIX);
  const today = getTodayISO();
  return Object.values(all)
    .filter(s => s.date === today)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function getSessionsForDateRange(startDate: string, endDate: string): Promise<StudioSessionEntry[]> {
  const all = await getAllWithPrefix<StudioSessionEntry>(SESSION_PREFIX);
  return Object.values(all)
    .filter(s => s.date >= startDate && s.date <= endDate)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function getAllSessions(): Promise<StudioSessionEntry[]> {
  const all = await getAllWithPrefix<StudioSessionEntry>(SESSION_PREFIX);
  return Object.values(all).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function getTodayStudioHours(): Promise<number> {
  const dailyKey = `studio_hours:${getTodayISO()}`;
  return (await getStoreValue<number>(dailyKey)) || 0;
}

// ── Track hours aggregation ─────────────────────────────────────────────────

export async function getTrackHoursSummaries(): Promise<TrackHoursSummary[]> {
  const sessions = await getAllSessions();
  const statuses = await getTrackStatuses();

  const hoursByTrack: Record<string, { totalHours: number; sessionCount: number }> = {};

  for (const session of sessions) {
    if (!hoursByTrack[session.trackName]) {
      hoursByTrack[session.trackName] = { totalHours: 0, sessionCount: 0 };
    }
    hoursByTrack[session.trackName].totalHours += session.hours;
    hoursByTrack[session.trackName].sessionCount += 1;
  }

  return statuses.map(t => ({
    trackName: t.name,
    totalHours: hoursByTrack[t.name]?.totalHours || 0,
    sessionCount: hoursByTrack[t.name]?.sessionCount || 0,
    currentPhase: t.phase,
  }));
}

// ── Session + Phase update (atomic) ─────────────────────────────────────────

export async function logStudioSessionAndAdvance(
  trackName: string,
  hours: number,
  newPhase: TrackPhase,
  sessionType: string,
  quality: number | null,
  notes: string = ''
): Promise<StudioSessionEntry> {
  // Get current phase
  const statuses = await getTrackStatuses();
  const track = statuses.find(t => t.name === trackName);
  const phaseBefore = track?.phase || 'not_started';

  // Create session entry
  const entry: StudioSessionEntry = {
    id: `session_${Date.now()}`,
    date: getTodayISO(),
    trackName,
    hours,
    sessionType,
    phaseBefore,
    phaseAfter: newPhase,
    quality,
    notes,
    createdAt: new Date().toISOString(),
  };

  // Save session to IndexedDB
  await saveStudioSession(entry);

  // Update planner track phase if changed
  if (newPhase !== phaseBefore) {
    const updated = statuses.map(t =>
      t.name === trackName ? { ...t, phase: newPhase } : t
    );
    await saveTrackStatuses(updated);
  }

  // Push to Google Sheets (fire-and-forget, don't block UI)
  pushSessionToSheets(entry).catch(err =>
    console.error('Failed to push studio session to Sheets:', err)
  );

  return entry;
}

// ── Sheets sync ─────────────────────────────────────────────────────────────

async function pushSessionToSheets(entry: StudioSessionEntry): Promise<void> {
  await fetch('/api/studio-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      date: entry.date,
      trackName: entry.trackName,
      hours: entry.hours,
      sessionType: entry.sessionType,
      phaseBefore: entry.phaseBefore,
      phaseAfter: entry.phaseAfter,
      quality: entry.quality,
      notes: entry.notes,
    }),
  });
}
