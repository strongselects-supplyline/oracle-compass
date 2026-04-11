// lib/sovereignty.ts
// ═══════════════════════════════════════════════════════════════════
// SOVEREIGN RANK ENGINE — Dynamic progression from Jonin → God of Shinobi
// Persists to IndexedDB via lib/db.ts — survives cache clears
// ═══════════════════════════════════════════════════════════════════

import { getStoreValue, setStoreValue } from './db';

// ── Rank Definitions ──────────────────────────────────────────────

export type RankId = 'JONIN' | 'ANBU' | 'KAGE' | 'S_RANK' | 'SANNIN' | 'GOD_OF_SHINOBI';

export interface RankDef {
  id: RankId;
  tier: string;        // Display name
  label: string;       // Subtitle
  desc: string;        // One-line description
  color: string;       // Theme color
  targetDate: string;  // ISO date for the promotion gate
  sobrietyDay: number; // Required sobriety day count
  benchmarks: string[];
}

export const RANKS: RankDef[] = [
  {
    id: 'JONIN',
    tier: 'JONIN',
    label: 'Elite Operator',
    desc: 'Cross-functional mastery. Production, mixing, writing, marketing. Oracle + Gorilla Geo + Content Factory running.',
    color: '#555',
    targetDate: '2026-04-08',
    sobrietyDay: 0,
    benchmarks: [], // Already earned — starting rank
  },
  {
    id: 'ANBU',
    tier: 'ANBU',
    label: 'Black Ops Specialist',
    desc: 'Execute in silence while the system compounds. ALL LOVE launches. Gorilla Geo activates. The grief protocol begins.',
    color: '#d97706',
    targetDate: '2026-06-01',
    sobrietyDay: 60,
    benchmarks: [
      'ALL LOVE EP Released — Apr 24 data logged',
      '3 tracks Live on Spotify — SF, ESL, Like I Did',
      'Save Rate 3%+ on at least 1 track',
      'Gorilla Geo Activated — 3–5 DMs/day consistent',
      'Sobriety Day 60 — clock not reset',
      'Content Factory — 3+ assets/week consistent',
      'DoorDash $1,800/mo — April confirmed',
      'DoorDash $1,800/mo — May confirmed',
      'S3 Check-in running every studio day',
      'Grief Protocol — first journal entry by Apr 27',
      'ALL LOVE Deluxe decision logged by Apr 27',
      'Instagram bio updated and verified',
    ],
  },
  {
    id: 'KAGE',
    tier: 'KAGE',
    label: 'Sovereign Leader',
    desc: 'Zero external dependency. The codex IS the coach. CREAM mixed, mastered, uploaded. Algorithm recognition begins.',
    color: '#10b981',
    targetDate: '2026-07-05',
    sobrietyDay: 94,
    benchmarks: [
      'CREAM: 4 tracks mixed & mastered — Cyanite verified',
      'Song Structure Study: 5+ sessions complete',
      'CREAM Uploaded to Amuse — all ISRCs verified',
      'CREAM Editorial Pitch Submitted',
      'Gorilla Geo Re-Run — ALL LOVE data re-segmented',
      'Spotify Followers: 1,800+',
      'God Tier DM Responses: 10+',
      'Sobriety Day 94 — stabilization phase',
      'Grief Journal: 8+ entries logged',
      'CREAM Geo Ads Live — targeting 4 cities',
      'Instagram Unfollow Audit Started',
      'DoorDash Revenue: $1,800+ for June',
    ],
  },
  {
    id: 'S_RANK',
    tier: 'S-RANK',
    label: 'The Disruptor',
    desc: 'Engineering placement, not asking. CREAM released. FREAKSHOW pre-production. Hearing In Color documented.',
    color: '#6366f1',
    targetDate: '2026-10-01',
    sobrietyDay: 183,
    benchmarks: [
      'CREAM Released — first-week streams 1,000+',
      'Editorial Placements: 5+ across ALL LOVE + CREAM',
      'Spotify Popularity Score: 35+',
      'Spotify Followers: 2,500+',
      'CREAM Save Rate: 4%+ on 2+ tracks',
      'FREAKSHOW Pre-Production Started',
      'Hearing In Color Methodology Documented',
      'God Tier DM Responses: 30+',
      'DoorDash Revenue or Music Replacement',
      'Instagram Ratio: 3:1–4:1',
      'Content Cadence: 3/week launch, 2/week sustained',
    ],
  },
  {
    id: 'SANNIN',
    tier: 'LEGENDARY SANNIN',
    label: 'Cultural Pillar',
    desc: 'Multi-era track record. Trilogy complete. Forbidden jutsu documented and proven.',
    color: '#c9a227',
    targetDate: '2027-04-01',
    sobrietyDay: 365,
    benchmarks: [
      'FREAKSHOW Released — trilogy complete',
      '3 Full Release Cycles with Data',
      'Hearing In Color Methodology Publishable',
      'Waking Mind Protocol: 12+ months of data',
      'Mudra System + Stack Operational 12 Months',
      'Spotify Followers: 5,000+',
      '1 Collaboration with Publishing Protocol Enforced',
      'Grief Protocol: Consistent Journaling OR Therapy',
      'DoorDash Exit Planning Underway',
      '30th Birthday Milestone: 44+ Tracks in Catalog',
      'Content Identity Established — brand consistency',
    ],
  },
  {
    id: 'GOD_OF_SHINOBI',
    tier: 'GOD OF SHINOBI',
    label: 'Paradigm Shifter',
    desc: "You don't operate in the ecosystem. You BUILD it. Label OS is methodology. Hearing In Color is curriculum.",
    color: '#c9a227',
    targetDate: '2027-12-01',
    sobrietyDay: 609,
    benchmarks: [
      'Label OS Documented & Publishable',
      'Hearing In Color as Standalone Brand/Curriculum',
      '1+ Artist Influenced by Label OS',
      'Catalog: 44+ Tracks Across 3+ Release Cycles',
      'Financial Independence from DoorDash',
      'past.El noir Records Brand Recognition',
      'Sonic Frameworks Documented & Replicable',
      'Creative Output Feels Like Play',
      'S3 Metacognition is the Default Mode',
    ],
  },
];

// ── Persisted State Types ─────────────────────────────────────────

export interface SovereigntyState {
  currentRankIndex: number;           // 0=JONIN, 1=ANBU, ...
  sobrietyStart: string;              // ISO date — resettable
  sobrietyResets: { date: string; previousDay: number }[]; // Accountability log
  benchmarkChecks: Record<string, boolean[]>;  // key=rankId, value=bool array
  griefLog: { date: string; text: string }[];
  weeklyDataLog: { date: string; data: WeeklyData }[];
  promotionLog: { rankId: RankId; date: string; note: string }[];
  s3Log: string[];  // ISO dates of S3 check-ins
}

export interface WeeklyData {
  spotify: string;
  saves: string;
  doordash: string;
  geo: string;
}

const STORE_KEY = 'sovereignty_state';

// ── Default State ─────────────────────────────────────────────────

function getDefaultState(): SovereigntyState {
  return {
    currentRankIndex: 0,
    sobrietyStart: '2026-04-02',
    sobrietyResets: [],
    benchmarkChecks: {},
    griefLog: [],
    weeklyDataLog: [],
    promotionLog: [],
    s3Log: [],
  };
}

// ── Load / Save ───────────────────────────────────────────────────

export async function loadSovereigntyState(): Promise<SovereigntyState> {
  try {
    const stored = await getStoreValue<SovereigntyState>(STORE_KEY);
    if (stored) {
      // Migrate: merge with defaults so new fields are always present
      return { ...getDefaultState(), ...stored };
    }

    // First load: migrate from localStorage if available
    if (typeof window !== 'undefined') {
      const migrated = migrateFromLocalStorage();
      if (migrated) {
        await setStoreValue(STORE_KEY, migrated);
        return migrated;
      }
    }

    return getDefaultState();
  } catch {
    return getDefaultState();
  }
}

export async function saveSovereigntyState(state: SovereigntyState): Promise<void> {
  await setStoreValue(STORE_KEY, state);
}

// ── Migration from old localStorage keys ──────────────────────────

function migrateFromLocalStorage(): SovereigntyState | null {
  try {
    const checks = localStorage.getItem('anbu-checks');
    const grief = localStorage.getItem('grief-log');
    const weekly = localStorage.getItem('weekly-data-log');

    if (!checks && !grief && !weekly) return null;

    const state = getDefaultState();

    if (checks) {
      state.benchmarkChecks['ANBU'] = JSON.parse(checks);
    }
    if (grief) {
      state.griefLog = JSON.parse(grief);
    }
    if (weekly) {
      state.weeklyDataLog = JSON.parse(weekly);
    }

    // Clean up old keys after migration
    localStorage.removeItem('anbu-checks');
    localStorage.removeItem('grief-log');
    localStorage.removeItem('weekly-data-log');

    return state;
  } catch {
    return null;
  }
}

// ── Computed Helpers ──────────────────────────────────────────────

export function getSobrietyDays(startDate: string): number {
  const start = new Date(startDate + 'T00:00:00');
  const now = new Date();
  return Math.max(0, Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
}

export function getCurrentRank(state: SovereigntyState): RankDef {
  return RANKS[state.currentRankIndex];
}

export function getNextRank(state: SovereigntyState): RankDef | null {
  if (state.currentRankIndex >= RANKS.length - 1) return null;
  return RANKS[state.currentRankIndex + 1];
}

export function getChecksForRank(state: SovereigntyState, rankId: RankId): boolean[] {
  const rank = RANKS.find(r => r.id === rankId);
  if (!rank) return [];
  const stored = state.benchmarkChecks[rankId];
  if (stored && stored.length === rank.benchmarks.length) return stored;
  return Array(rank.benchmarks.length).fill(false);
}

export function getDaysToRank(rank: RankDef): number {
  return Math.max(0, Math.ceil((new Date(rank.targetDate).getTime() - Date.now()) / 86400000));
}

export function canPromote(state: SovereigntyState): boolean {
  const next = getNextRank(state);
  if (!next) return false;
  const checks = getChecksForRank(state, next.id);
  return checks.every(Boolean) && checks.length > 0;
}
