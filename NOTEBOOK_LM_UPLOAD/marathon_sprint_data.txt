// marathon-data.ts
// Source of truth for the 43-Track, 14-Week Sprint
// Updated March 24, 2026: Unified IndexedDB (uses OracleCompassDB via db.ts),
// sprint weeks updated to waterfall cadence (ESL May 9 → GL May 23 → SF Jun 6 → EP Jun 20).

import { getStoreValue, setStoreValue } from '@/lib/db';

export type Phase = 'ALL_LOVE' | 'DELUXE' | 'CREAM' | 'FREAKSHOW';
export type TrackStatus = 'not_started' | 'in_progress' | 'done';

export interface Track {
  id: string;
  name: string;
  phase: Phase;
  parked?: boolean; // true = not on critical path for EP
}

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

export const PHASE_CONFIG: Record<Phase | 'BUFFER', { label: string; badge: string; color: string }> = {
  ALL_LOVE:  { label: 'ALL LOVE',  badge: 'ALL LOVE',  color: '#C8952A' },
  DELUXE:    { label: 'DELUXE',    badge: 'DELUXE',    color: '#A07830' },
  CREAM:     { label: 'CREAM',     badge: 'CREAM',     color: '#9A9A9A' },
  FREAKSHOW: { label: 'FREAKSHOW', badge: 'FREAKSHOW', color: '#9A70C0' },
  BUFFER:    { label: 'BUFFER',    badge: 'BUFFER',    color: '#444444' },
};

export const ALL_TRACKS: Track[] = [
  // ── ALL LOVE EP — 5 active tracks (waterfall pivot Apr 28) ──
  { id: 'al-02', name: 'See Me',            phase: 'ALL_LOVE' },
  { id: 'al-03', name: 'East Side Love',    phase: 'ALL_LOVE' },
  { id: 'al-05', name: 'Green Light',       phase: 'ALL_LOVE' },
  { id: 'al-08', name: 'Sweet Frustration', phase: 'ALL_LOVE' },
  { id: 'al-04', name: 'WANT U 2',          phase: 'ALL_LOVE' },

  // ── ALL LOVE — 6 vault/parked tracks (post-EP waterfall + TBD) ──
  { id: 'al-09', name: 'Like I Did',    phase: 'ALL_LOVE', parked: true },
  { id: 'al-01', name: 'I Like Girls',  phase: 'ALL_LOVE', parked: true },
  { id: 'al-07', name: 'Worth It',      phase: 'ALL_LOVE', parked: true },
  { id: 'al-10', name: 'Just Say So',   phase: 'ALL_LOVE', parked: true },
  { id: 'al-11', name: 'Reconnect',     phase: 'ALL_LOVE', parked: true },
  { id: 'al-06', name: 'Luxury',        phase: 'ALL_LOVE', parked: true },

  // ── DELUXE — 12 tracks ──
  { id: 'dl-01', name: 'All My Love (intro flip)', phase: 'DELUXE' },
  { id: 'dl-02', name: 'ALL MY LOVE 138bpm Emix', phase: 'DELUXE' },
  { id: 'dl-03', name: 'Natural', phase: 'DELUXE' },
  { id: 'dl-04', name: 'Take A Chance', phase: 'DELUXE' },
  { id: 'dl-05', name: 'Coming Down (Night Ride Edition)', phase: 'DELUXE' },
  { id: 'dl-06', name: 'CANT LET YOU GO', phase: 'DELUXE' },
  { id: 'dl-07', name: 'Underneath It All', phase: 'DELUXE' },
  { id: 'dl-08', name: 'DEVASTATED', phase: 'DELUXE' },
  { id: 'dl-09', name: 'HOLD OF ME', phase: 'DELUXE' },
  { id: 'dl-10', name: 'VULNERABLE', phase: 'DELUXE' },
  { id: 'dl-11', name: 'KEEP COMING BACK', phase: 'DELUXE' },
  { id: 'dl-12', name: 'I-need-ya-mia-', phase: 'DELUXE' },

  // ── CREAM — 10 tracks ──
  { id: 'cr-01', name: 'Milagro (Intro)', phase: 'CREAM' },
  { id: 'cr-02', name: '(Balenciaga) Polaroid 101bpm.mp3', phase: 'CREAM' },
  { id: 'cr-03', name: 'AWESOME Flute brkdwn 106bpm_5', phase: 'CREAM' },
  { id: 'cr-04', name: 'RR dreamin 130bpm.mp3', phase: 'CREAM' },
  { id: 'cr-05', name: 'Need To Know 122bpm', phase: 'CREAM' },
  { id: 'cr-06', name: 'CANADA GOOSE', phase: 'CREAM' },
  { id: 'cr-07', name: 'BRAND NEW', phase: 'CREAM' },
  { id: 'cr-08', name: 'Its A Grind', phase: 'CREAM' },
  { id: 'cr-09', name: 'WHATS LIFE prod. MicKellogg', phase: 'CREAM' },
  { id: 'cr-10', name: 'KEEP GOING 94BPM', phase: 'CREAM' },

  // ── FREAKSHOW — 10 tracks ──
  { id: 'fs-01', name: 'elvis v2 (ethan, carson, spencer).wav', phase: 'FREAKSHOW' },
  { id: 'fs-02', name: 'TEAR ME DOWN 2022', phase: 'FREAKSHOW' },
  { id: 'fs-03', name: 'LITTLE SECRET V1 ETHAN CARSON SPENCER', phase: 'FREAKSHOW' },
  { id: 'fs-04', name: 'RHINESTONES Demo 2', phase: 'FREAKSHOW' },
  { id: 'fs-05', name: 'AMERICAN PAX 120bpm_2', phase: 'FREAKSHOW' },
  { id: 'fs-06', name: 'I-just-keep-going-thru-motions', phase: 'FREAKSHOW' },
  { id: 'fs-07', name: 'FREAK SHOW', phase: 'FREAKSHOW' },
  { id: 'fs-08', name: 'FREAKSHOW E-MIX', phase: 'FREAKSHOW' },
  { id: 'fs-09', name: 'TOP SHELF (SmokeShow) 112bpm', phase: 'FREAKSHOW' },
  { id: 'fs-10', name: 'Ride It 112bpm', phase: 'FREAKSHOW' },
];

export const SPRINT_WEEKS: SprintWeek[] = [
  {
    wk: 1, dates: 'Mar 7\u201313', startDate: '2026-03-07', endDate: '2026-03-13',
    phase: 'ALL_LOVE', phaseBadge: 'ALL LOVE', target: 'SEE ME single launch', total: 1,
    keyEvents: ['SEE ME drops Mar 13'],
  },
  {
    wk: 2, dates: 'Mar 14\u201320', startDate: '2026-03-14', endDate: '2026-03-20',
    phase: 'ALL_LOVE', phaseBadge: 'ALL LOVE', target: 'EP conversion + SF/LID mixdown start', total: 1,
    keyEvents: ['ALL LOVE converted to 4-track EP Mar 21', 'SF + LID mixdown sprint begins'],
  },
  {
    wk: 3, dates: 'Mar 22\u201328', startDate: '2026-03-22', endDate: '2026-03-28',
    phase: 'ALL_LOVE', phaseBadge: 'ALL LOVE', target: 'Recording sprint + SF/LID mixdown', total: 1,
    keyEvents: ['ALL LOVE topline recording through Wed night', 'ESL upload to Amuse by Mar 30 (moved → Apr 7 for 414 Day)', 'DoorDash bridge: $1,000 target by Apr 3'],
  },
  {
    wk: 4, dates: 'Mar 29\u2013Apr 4', startDate: '2026-03-29', endDate: '2026-04-04',
    phase: 'ALL_LOVE', phaseBadge: 'ALL LOVE', target: 'Production sprint begins', total: 1,
    keyEvents: ['Apr 11 audit: EP expanded to 6 tracks', 'Production sprint active — masters not done', 'DoorDash morning block only during sprint'],
  },
  {
    wk: 5, dates: 'Apr 5\u201311', startDate: '2026-04-05', endDate: '2026-04-11',
    phase: 'ALL_LOVE', phaseBadge: 'ALL LOVE', target: 'Master all 5 EP tracks', total: 1,
    keyEvents: ['5 tracks × ~10 hrs = 50 hrs total', '~4 hrs/day studio after DoorDash', 'Upload each track as master locks (Amuse Pro = 48hr)'],
  },
  {
    wk: 6, dates: 'Apr 12\u201318', startDate: '2026-04-12', endDate: '2026-04-18',
    phase: 'ALL_LOVE', phaseBadge: 'ALL LOVE', target: 'Mastering completion sprint', total: 5,
    keyEvents: ['Finish all mastering sessions', 'ESL upload target: May 2 (Amuse 7-day review)', 'No content, no planning — studio only'],
  },
  {
    wk: 7, dates: 'Apr 19\u201325', startDate: '2026-04-19', endDate: '2026-04-25',
    phase: 'ALL_LOVE', phaseBadge: 'ALL LOVE', target: 'Production sprint + waterfall prep', total: 5,
    keyEvents: ['WATERFALL PIVOT: singles drip every 2 weeks', 'East Side Love drops May 9 🔥', 'Green Light drops May 23', 'Sweet Frustration drops Jun 6', 'ALL LOVE EP (5 tracks) drops Jun 20'],
  },
  {
    wk: 8, dates: 'Apr 26\u2013May 2', startDate: '2026-04-26', endDate: '2026-05-02',
    phase: 'ALL_LOVE', phaseBadge: 'ALL LOVE', target: 'ESL pre-release marketing + upload', total: 5,
    keyEvents: ['ESL upload to Amuse by May 2', 'Content sprint for ESL single launch', 'Spotify ad campaign prep ($50 ESL push)'],
  },
  {
    wk: 9, dates: 'May 3\u20139', startDate: '2026-05-03', endDate: '2026-05-09',
    phase: 'DELUXE', phaseBadge: 'DELUXE', target: '3 tracks', total: 10,
    keyEvents: [],
  },
  {
    wk: 10, dates: 'May 10\u201316', startDate: '2026-05-10', endDate: '2026-05-16',
    phase: 'DELUXE', phaseBadge: 'DELUXE / CREAM', target: '3 tracks', total: 13,
    keyEvents: [],
  },
  {
    wk: 11, dates: 'May 17\u201323', startDate: '2026-05-17', endDate: '2026-05-23',
    phase: 'CREAM', phaseBadge: 'CREAM', target: '3 tracks', total: 16,
    keyEvents: [],
  },
  {
    wk: 12, dates: 'May 24\u201330', startDate: '2026-05-24', endDate: '2026-05-30',
    phase: 'FREAKSHOW', phaseBadge: 'FREAKSHOW', target: '3 tracks', total: 19,
    keyEvents: [],
  },
  {
    wk: 13, dates: 'May 31\u2013Jun 6', startDate: '2026-05-31', endDate: '2026-06-06',
    phase: 'FREAKSHOW', phaseBadge: 'FREAKSHOW', target: '3 tracks', total: 22,
    keyEvents: ['Marathon phase 1 complete \uD83C\uDFC1'],
  },
  {
    wk: 14, dates: 'Jun 7\u201313', startDate: '2026-06-07', endDate: '2026-06-13',
    phase: 'BUFFER' as Phase | 'BUFFER', phaseBadge: 'BUFFER', target: '\u2014', total: 22,
    keyEvents: ['Overflow / flex window'],
  },
];

export const SPRINT_RULES = [
  { label: 'DoorDash',         value: '6:30\u20139 AM only (Phase 1). Protect studio.' },
  { label: 'Studio Block',     value: '9:30 AM onward. One track. Closest to done first.' },
  { label: 'On Master Lock',   value: 'Upload to Amuse same hour. Pitch same hour. Close project.' },
  { label: 'Track Floor',      value: '~10 hrs per track remaining' },
  { label: 'Amuse Pro',        value: '48hr review. EP upload by Apr 22.' },
  { label: 'Sundays',          value: 'SACRED \u2014 no sessions' },
  { label: 'EP Tracks',        value: '6 active / 5 parked. Sequence via Cyanite post-mastering.' },
];

export const TOTAL_TRACKS = 43;

// ── Unified IndexedDB access via db.ts ──
// Previously used a separate 'oracle-compass' DB. Now unified with OracleCompassDB.
export const IDB_STORE = 'compass_store'; // matches db.ts
export const IDB_DB = 'OracleCompassDB';  // matches db.ts
export const IDB_KEY = 'marathon_track_statuses';

// Migration: on first load, attempt to read from old DB and port data over
let migrationAttempted = false;

export async function migrateFromOldDB(): Promise<Record<string, TrackStatus> | null> {
  if (migrationAttempted) return null;
  migrationAttempted = true;

  try {
    // Check if old DB exists and has data
    const oldDb = await new Promise<IDBDatabase>((resolve, reject) => {
      const req = indexedDB.open('oracle-compass', 1);
      req.onupgradeneeded = () => {
        // Old DB doesn't exist, abort
        req.transaction?.abort();
        reject(new Error('no old db'));
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });

    if (!oldDb.objectStoreNames.contains('data')) {
      oldDb.close();
      return null;
    }

    const data = await new Promise<Record<string, TrackStatus> | null>((resolve) => {
      const tx = oldDb.transaction('data', 'readonly');
      const req = tx.objectStore('data').get('marathon_track_statuses');
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });

    oldDb.close();
    return data;
  } catch {
    return null;
  }
}
