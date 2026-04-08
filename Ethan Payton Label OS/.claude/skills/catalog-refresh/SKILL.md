---
name: Catalog Intelligence Refresh
description: Refresh the catalog intelligence matrix with latest Spotify API data and guide manual CSV imports. Use when user says "refresh catalog", "update catalog", or asks about current streaming numbers.
---

# Catalog Intelligence Refresh

## When to Use
When Ethan says "refresh catalog", "update catalog", "what are my numbers", or needs current streaming/popularity data.

## What This Does

### Automated (Spotify API — run anytime)
Run the refresh script:
```bash
node brain/refresh-catalog.mjs
```

This updates in `catalog_intelligence_matrix.json`:
- Artist popularity score (0-100, updated ~daily by Spotify)
- Follower count
- Per-track popularity scores
- Resolves Spotify URIs (first run, then cached)
- Writes `snapshot_date` timestamp

**Dry run first:**
```bash
node brain/refresh-catalog.mjs --dry-run
```

### Manual (requires Ethan to export CSVs)
The script CANNOT fetch these — they require manual platform exports:

| Data | Source | How to Export |
|------|--------|--------------|
| Stream counts | Amuse Insights | Login → Insights → Download CSV |
| Audience demographics | Spotify for Artists | Audience tab → Export |
| City-level data | Spotify for Artists | Audience → Cities → Export |
| Apple Music streams | Apple Music for Artists | Overview → Export |
| Save counts | Spotify for Artists | Songs tab → sort by saves |

### After CSV Import
1. Open `brain/catalog_intelligence_matrix.json`
2. Update the relevant `streaming` block fields for each track
3. Set `snapshot_date` to today's date
4. Verify: `artist.all_time_spotify_streams`, per-track `spotify_12mo`, `apple_12mo`, etc.

## Prerequisites
- Spotify API creds in `scratch/gorilla-geo/.env` (SPOTIFY_CLIENT_ID + SPOTIFY_CLIENT_SECRET)
- If creds not set: `cp scratch/gorilla-geo/.env.example scratch/gorilla-geo/.env` then edit

## Critical Rules
- **The catalog matrix is the single source of truth.** All analytics should read from and write to this file.
- **Never fabricate streaming numbers.** If data isn't available, leave fields as `null`.
- **Popularity score ≠ stream count.** Popularity is Spotify's algorithmic proxy (0-100), not raw streams.
