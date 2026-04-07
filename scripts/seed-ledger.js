#!/usr/bin/env node
// scripts/seed-ledger.js
// Reads gorilla-geo/data/tier-classified.json
// Writes oracle-compass/public/geo/audience-ledger.json
//
// Pre-populates the artist skeleton so Sprint Queue is ready from day one.
// Run: node scripts/seed-ledger.js
// Safe to re-run — idempotent (skips existing artists, merges tracks).

const fs = require('fs');
const path = require('path');

const TIER_INPUT  = path.resolve(__dirname, '../../gorilla-geo/data/tier-classified.json');
const LEDGER_OUT  = path.resolve(__dirname, '../public/geo/audience-ledger.json');
const GEO_DIR     = path.dirname(LEDGER_OUT);

// Ensure public/geo/ exists
if (!fs.existsSync(GEO_DIR)) {
  fs.mkdirSync(GEO_DIR, { recursive: true });
  console.log('Created directory:', GEO_DIR);
}

// Load tier data
if (!fs.existsSync(TIER_INPUT)) {
  console.error('❌  tier-classified.json not found at:', TIER_INPUT);
  console.error('   Run: cd gorilla-geo && node run.js --tier   first.');
  process.exit(1);
}

const tierData = JSON.parse(fs.readFileSync(TIER_INPUT, 'utf8'));

// Load existing ledger or start fresh
let ledger = { version: 1, lastUpdated: new Date().toISOString().split('T')[0], artists: [] };
if (fs.existsSync(LEDGER_OUT)) {
  try {
    ledger = JSON.parse(fs.readFileSync(LEDGER_OUT, 'utf8'));
    console.log(`Loaded existing ledger: ${ledger.artists.length} artists`);
  } catch {
    console.log('Existing ledger corrupt — starting fresh.');
  }
}

// Index existing artists by name (lowercase) for dedup
const existing = new Map(ledger.artists.map(a => [a.name.toLowerCase(), a]));

let added = 0;
let merged = 0;
let skipped = 0;

// Walk every track and every tier
for (const [trackId, trackData] of Object.entries(tierData)) {
  const tiers = ['T1', 'T2', 'T3', 'T4'];
  for (const tier of tiers) {
    const artists = (trackData.tiers || {})[tier] || [];
    for (const artist of artists) {
      if (!artist.name || !artist.name.trim() || /^\d+$/.test(artist.name.trim())) {
        skipped++;
        continue; // Skip numeric-only or empty names
      }
      const key = artist.name.toLowerCase();

      if (existing.has(key)) {
        // Merge track into existing entry
        const entry = existing.get(key);
        if (!entry.tracks.includes(trackId)) {
          entry.tracks.push(trackId);
          merged++;
        }
        // Upgrade tier if this track gives a higher priority
        const tierRank = { T4: 0, T3: 1, T2: 2, T1: 3 };
        if (tierRank[tier] < tierRank[entry.tier]) {
          entry.tier = tier;
        }
      } else {
        const entry = {
          name: artist.name.trim(),
          tier,
          tracks: [trackId],
          fans: [],
          spotifyId: artist.spotifyId || undefined,
          igHandle: undefined,
          city: undefined,
          lastSprinted: undefined,
        };
        existing.set(key, entry);
        ledger.artists.push(entry);
        added++;
      }
    }
  }
}

// Sort: T4 first, then T3, T2, T1, alphabetical within tier
const tierRank = { T4: 0, T3: 1, T2: 2, T1: 3 };
ledger.artists.sort((a, b) => {
  const rankDiff = tierRank[a.tier] - tierRank[b.tier];
  if (rankDiff !== 0) return rankDiff;
  return a.name.localeCompare(b.name);
});

ledger.lastUpdated = new Date().toISOString().split('T')[0];

fs.writeFileSync(LEDGER_OUT, JSON.stringify(ledger, null, 2));

console.log('');
console.log('✅  Ledger seeded successfully');
console.log(`   Added:  ${added} new artists`);
console.log(`   Merged: ${merged} track references into existing artists`);
console.log(`   Skipped: ${skipped} invalid entries`);
console.log(`   Total:  ${ledger.artists.length} artists in ledger`);
console.log(`   Output: ${LEDGER_OUT}`);
console.log('');
console.log('Next: npm run dev in oracle-compass → open /geo to start sprinting.');
