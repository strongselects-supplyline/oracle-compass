// marathon-data.ts
// Source of truth for the 43-Track, 14-Week Sprint
// Last updated: March 22, 2026

export type Phase = 'ALL_LOVE' | 'DELUXE' | 'CREAM' | 'FREAKSHOW';
export type TrackStatus = 'not_started' | 'in_progress' | 'done';

export interface Track {
  id: string;
  name: string;
  phase: Phase;
  parked?: boolean; // true = not on critical path for EP; system does NOT surface tasks for these
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

export const PHASE_CONFIG: Record<Phase, { label: string; badge: string; color: string }> = {
  ALL_LOVE:  { label: 'ALL LOVE',  badge: 'ALL LOVE',  color: '#C8952A' },
  DELUXE:    { label: 'DELUXE',    badge: 'DELUXE',    color: '#A07830' },
  CREAM:     { label: 'CREAM',     badge: 'CREAM',     color: '#9A9A9A' },
  FREAKSHOW: { label: 'FREAKSHOW', badge: 'FREAKSHOW', color: '#9A70C0' },
};

export const ALL_TRACKS: Track[] = [
  // ── ALL LOVE EP — 4 active tracks ──
  { id: 'al-02', name: 'See Me',             phase: 'ALL_LOVE' },
  { id: 'al-03', name: 'East Side Love',     phase: 'ALL_LOVE' },
  { id: 'al-08', name: 'Sweet Frustration',  phase: 'ALL_LOVE' },
  { id: 'al-09', name: 'Like I Did',         phase: 'ALL_LOVE' },

  // ── ALL LOVE — 7 parked tracks (post-EP release TBD) ──
  // System does NOT surface Kill List tasks for these. Stretch goal only.
  { id: 'al-01', name: 'I Like Girls',        phase: 'ALL_LOVE', parked: true },
  { id: 'al-04', name: 'Want U Bad',          phase: 'ALL_LOVE', parked: true },
  { id: 'al-05', name: 'Green Light Patient', phase: 'ALL_LOVE', parked: true },
  { id: 'al-06', name: 'Luxury',              phase: 'ALL_LOVE', parked: true },
  { id: 'al-07', name: 'Worth It',            phase: 'ALL_LOVE', parked: true },
  { id: 'al-10', name: 'Just Say So',         phase: 'ALL_LOVE', parked: true },
  { id: 'al-11', name: 'Reconnect',           phase: 'ALL_LOVE', parked: true },

  // ── DELUXE — 12 tracks (pull names from catalog_marathon_tracker.md) ──
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

  // ── CREAM — 10 tracks (pull names from catalog_marathon_tracker.md) ──
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

  // ── FREAKSHOW — 10 tracks (pull names from catalog_marathon_tracker.md) ──
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
    wk: 1, dates: 'Mar 7–13', startDate: '2026-03-07', endDate: '2026-03-13',
    phase: 'ALL_LOVE', phaseBadge: 'ALL LOVE', target: '4 tracks', total: 4,
    keyEvents: ['SEE ME drops Mar 13'],
  },
  {
    wk: 2, dates: 'Mar 14–20', startDate: '2026-03-14', endDate: '2026-03-20',
    phase: 'ALL_LOVE', phaseBadge: 'ALL LOVE', target: '7 tracks — close ALL LOVE', total: 11,
    keyEvents: ['East Side Love upload deadline Mar 30', 'ALL LOVE front-load window closes Mar 28'],
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
  { label: 'Session Length',   value: '6 hours / day' },
  { label: 'Track Structure',  value: 'Dual-track per session' },
  { label: 'Efficiency Curve', value: '8% compounding per week' },
  { label: 'Track Floor',      value: '10 hrs minimum per track' },
  { label: 'Sundays',          value: 'SACRED — no sessions' },
  { label: 'Studio Block',     value: '10 AM – 2 PM (inviolable)' },
];

export const TOTAL_TRACKS = 43;
export const IDB_STORE = 'data';
export const IDB_DB = 'oracle-compass';
export const IDB_KEY = 'marathon_track_statuses';
