# UPGRADE SCHEMATIC — April 4, 2026
## Sonnet Implementation Handoff

> Compiled by Opus after full audit of: Oracle Compass, Gorilla Geo, Core Drive Builder, Core Drive Engine, brain/, GLOBAL_BRAIN/, antigravity/, scratch/, Label OS/, and all Apr 1-4 handoff docs.
>
> **Instructions for Sonnet:** Execute these in priority order. Each item has the file path, what's wrong, and the exact fix. Skip nothing marked CRITICAL.

---

## TIER 1 — CRITICAL (Blocks current release cycle)

### 1.1 Release Dates Are Stale in releases.ts
**File:** `oracle-compass/lib/releases.ts`
**Problem:** Handoff_apr4 shows ESL upload Apr 7 → release Apr 14 (414 Day). The Apr 3 handoff shows ESL was already uploaded Mar 26 with release Apr 3. The Apr 4 handoff supersedes: ESL release is now Apr 14 (moved to 414 Day). SF release Apr 10, LID Apr 17, EP Apr 24. Verify RELEASE_DEFAULTS matches these dates exactly:

| Track | Upload | Release |
|-------|--------|---------|
| SEE ME | — | Mar 13 (LIVE) |
| East Side Love | Apr 7 (DistroKid) | Apr 14 |
| Sweet Frustration | (pending) | Apr 10 |
| Like I Did | (pending) | Apr 17 |
| ALL LOVE EP | Apr 14 | Apr 24 |

**Fix:** Read `releases.ts` lines 130-160, compare against this table, update any mismatches. Bump `RELEASE_DATA_VERSION` if changed.

**ALSO:** Distribution changed from **Amuse** to **DistroKid** per apr4 handoff. Grep all files for "Amuse" and update to "DistroKid" where it refers to the upload destination. Files to check: `releases.ts`, `killList.ts`, `lib/toolchain.ts`, any campaign docs.

### 1.2 sovereigntyStackStreak Hardcoded to 0
**File:** `oracle-compass/app/api/oracle/route.ts` (line ~309)
**Problem:** `sovereigntyStackStreak: 0, // TODO: compute from recent logs`
**Fix:** Read last 7 daily logs from IndexedDB, count consecutive days where `sovereigntyStack === true`. Replace hardcoded 0 with computed value. Pattern:
```typescript
const recentLogs = await getRecentLogs(7); // implement if not exists
const sovereigntyStackStreak = recentLogs
  .reverse()
  .reduce((streak, log) => log.sovereigntyStack ? streak + 1 : -1, 0);
// -1 sentinel breaks the chain; clamp to 0
```

### 1.3 DD Monthly Reset — Verify April Boundary
**File:** `oracle-compass/lib/db.ts`
**Problem:** Monthly auto-reset was deployed Apr 4. It's now Apr 4. Verify the month-boundary detection logic fires correctly when transitioning Mar→Apr. The `getDailyTelemetry()` function should have archived March data to `dd_history:2026-03` and reset `doordash_earned` to 0.
**Fix:** Read the function, trace the logic, confirm the month comparison works. Edge case: if user didn't open the app between Mar 31 and Apr 1, the archive might not have triggered. Add a catch-up check.

---

## TIER 2 — HIGH IMPACT (Improves daily execution quality)

### 2.1 Kill List: Compliance Phasing Fix
**File:** `oracle-compass/lib/killList.ts`
**Problem:** Per mar28 handoff: "Current Kill List treats compliance (ISRC, ASCAP, MLC) as pre-release blockers. They should be post-release Monday tasks." Registration requires a LIVE ISRC — can't register before release.
**Fix:** Find the registration task derivation block (section 4-5, ID prefix `reg-*`). Change the gating condition from pre-release to post-release:
```
// BEFORE: fires when release.status !== 'live' && uploadDate approaching
// AFTER: fires when release.status === 'live' && registration fields are incomplete
// Urgency: RED on T+3 (Monday after release), AMBER on T+7
```

### 2.2 Oracle Context: Add Lane Dashboard Data
**File:** `oracle-compass/lib/oracle.ts`
**Problem:** The Lane Dashboard (lanes.ts) and completion analytics (completionAnalytics.ts) were deployed Apr 4 but the Oracle context assembly doesn't include this data. The Oracle can't see which lanes are being neglected.
**Fix:** In `assembleContext()`, add:
```typescript
laneStatus: getLaneStatus(todayLog), // from lanes.ts
weeklyHeatmap: getWeeklyHeatmap(),   // from completionAnalytics.ts
velocityDelta: getVelocityDelta(),   // week-over-week change
neglectedLanes: lanes.filter(l => l.touched === false && l.lastTouched > 3), // 3+ days cold
```
This gives Oracle the ability to issue lane-specific realignment decrees.

### 2.3 Content Sprint Phase Detection — Verify Dates
**File:** `oracle-compass/lib/killList.ts` (section 2.7, `content-sprint-*`)
**Problem:** The 4-phase content sprint ("Its All Love") uses days-until-release to determine phase. With EP release Apr 24, current phases should be:
- Phase 1 (Ambient): >21 days out → already passed
- Phase 2 (414 Day): 10-20 days out → Apr 4-14 ← WE ARE HERE
- Phase 3 (Countdown): 3-9 days out → Apr 15-21
- Phase 4 (Drop Day): 0-2 days → Apr 22-24
**Fix:** Verify the date math uses `EP_RELEASE_DATE` (Apr 24) not individual single dates. Read the section and confirm phase boundaries match the above.

### 2.4 Core Drive Builder: Audio Features Pipeline
**File:** `core-drive-builder/lib/spotify.mjs`
**Problem:** `fetchAudioFeatures()` returns empty array `[]`. All avgTempo, avgEnergy, avgValence, avgDanceability are 0 across every output. Spotify's audio-features API is 403-blocked in 2026.
**Fix:** Since Cyanite data exists for all EP tracks (see handoff_april1), create a **local Cyanite fallback** file:
```
core-drive-builder/lib/cyanite-fallback.json
```
Map track names to their known Cyanite values (BPM, energy, valence from the april1 handoff table). When Spotify API returns empty, fall back to Cyanite data for tracks in the catalog. This restores parametric clustering in the markdown reports.

### 2.5 Gorilla Geo: IG Handles Bypass
**File:** `gorilla-geo/modules/2-ig-mapper.js`
**Problem:** Pipeline blocked at Module 2 because `ig-handles-filled.csv` requires manual IG handle entry for hundreds of artists. This manual step has been blocking the entire geo pipeline for weeks.
**Fix:** Two options (implement Option A, document Option B):
- **Option A (80% solution):** Write a script that auto-fills IG handles using a heuristic: lowercase artist name, remove spaces, check if `instagram.com/{handle}` returns 200. For artists with common names, flag for manual review. Output to `ig-handles-filled.csv`.
- **Option B (full bypass):** Skip IG scraping entirely. Use Spotify "Related Artists" + "Where People Listen" (available via embed scraper) as a proxy for geographic signal. This eliminates Modules 2-3 entirely and feeds directly into a modified Module 4.

---

## TIER 3 — STRUCTURAL IMPROVEMENTS (Quality of life)

### 3.1 Brain Cleanup: Stale Filenames & Dates
**Files in `brain/`:**
- `master_execution_checklist_apr17.md` → rename to `master_execution_checklist_apr24.md`
- Search all brain docs for "April 10" album date → update to Apr 24 EP date
- Search for "Amuse" → update to "DistroKid" where referring to current distribution
- `master_sop.md` references Strong Selects as active → add note: "SS: Saturday maintenance only, zero new business"

### 3.2 Core Drive Engine: Decide or Delete
**Dir:** `core-drive-engine/` (empty since Mar 28)
**Problem:** Placeholder directory with zero files. Creates confusion about architecture.
**Fix:** Either:
- Delete it (core-drive-builder handles everything including identity-sync)
- OR create a minimal README explaining it's reserved for future multi-project orchestration

### 3.3 Oracle Compass: Session Type Aggregation
**File:** `oracle-compass/lib/db.ts` or new `lib/sessionAnalytics.ts`
**Problem:** `dailyLog.sessionType` is stored but never aggregated. Can't tell Oracle "you did 3 recording days and 1 mixing day this week."
**Fix:** Add a `getWeeklySessionBreakdown()` function:
```typescript
function getWeeklySessionBreakdown(): Record<string, number> {
  // Read last 7 daily logs
  // Count occurrences of each sessionType
  // Return { recording: 3, mixing: 1, mastering: 0 }
}
```
Wire into Oracle context assembly.

### 3.4 Fuel Tracking: Add Protein Quality Signal
**File:** `oracle-compass/lib/db.ts` (DailyLog type)
**Problem:** Fuel tracking is binary (ate/didn't eat). Day One protocol emphasizes protein at meals for dopamine regulation, but Oracle can't assess protein quality.
**Fix:** Add `proteinQuality: number | null` (1-3 scale: 1=minimal, 2=adequate, 3=high). Show on home page fuel section. Wire into Oracle context for better dietary guidance.

### 3.5 Content Factory V4: Add ALL LOVE Jutsu Preset
**File:** `scratch/content-factory-v4/scripts/process.mjs`
**Problem:** 5 color grade jutsus exist but none are tuned for the ALL LOVE visual world. The EP needs a consistent look.
**Fix:** Add a 6th jutsu: `all-love` — warm gold tones, slight grain, emerald accent in shadows. Based on the color world defined in handoff_apr4:
```
Deep Emerald/Forest Green (primary) · Warm Gold/Amber (accent) · Deep Navy/Midnight Blue (background)
```
FFmpeg color grading params: curves for gold midtones, slight green in shadows, navy crush in blacks, grain overlay.

### 3.6 Completion Analytics: Pattern Detection
**File:** `oracle-compass/lib/completionAnalytics.ts`
**Problem:** Currently tracks raw completion counts. Doesn't detect patterns like "always skips Body lane on studio days" or "Money lane only gets touched during DD sprints."
**Fix:** Add `detectPatterns()`:
```typescript
function detectPatterns(heatmap: WeeklyHeatmap[]): Pattern[] {
  // Correlate lane neglect with dayType
  // Flag lanes that haven't been touched 3+ consecutive days
  // Detect if specific lanes only activate on certain day types
  // Return human-readable pattern descriptions for Oracle
}
```

### 3.7 Error Handling: Core Drive Builder Silent Failures
**File:** `core-drive-builder/index.mjs`
**Problem:** If a playlist embed scrape fails, returns `[]` silently. If ALL playlists fail, the entire run produces an empty report with no warning.
**Fix:** Add validation after scrape:
```javascript
const tracks = await client.fetchPlaylistTracks(url);
if (tracks.length === 0) {
  console.warn(`⚠️ ZERO TRACKS from ${url} — scrape may have failed`);
  failedUrls.push(url);
}
// After all playlists:
if (failedUrls.length > 0) {
  console.error(`\n❌ ${failedUrls.length} playlists returned 0 tracks:`);
  failedUrls.forEach(u => console.error(`  - ${u}`));
}
```

### 3.8 Gorilla Geo: Config Credential Cleanup
**File:** `gorilla-geo/config.json`
**Problem:** Spotify clientId and clientSecret stored in plaintext in the config file. IG credentials also referenced.
**Fix:** Move all credentials to `.env` file. Update config.json to read from `process.env.SPOTIFY_CLIENT_ID` etc. Add `.env` to `.gitignore` if not already there.

---

## TIER 4 — KNOWLEDGE BASE HYGIENE

### 4.1 Archive UUID Brain Directories
**Dir:** `brain/` contains ~80 UUID-named subdirectories (old session transcripts)
**Fix:** Create `brain/_archive/` and move all UUID dirs into it. Keep the named strategy docs at root level. This makes brain/ navigable.

### 4.2 GLOBAL_BRAIN: Add April State Snapshot
**File:** `GLOBAL_BRAIN/00_MASTER_CONTEXT.md`
**Problem:** Last updated around Mar 22. Missing: Lane Dashboard, Kill List safety-net philosophy, DistroKid switch, content sprint phases, Day One sobriety restart (Apr 2).
**Fix:** Add an "April 2026 State" section capturing the philosophy shift ("Kill List as safety net, not boss"), Lane Dashboard architecture, and updated release calendar.

### 4.3 Handoff Chain: Establish Single Source
**Problem:** Handoff docs exist in brain/, Downloads/, and various conversation artifacts. No canonical location.
**Fix:** Designate `brain/handoffs/` as the single location. Copy `handoff_apr4.md` there. Add a symlink or note in GLOBAL_BRAIN pointing to it. Future handoffs go here only.

### 4.4 brain/master_sop.md: Sync to Current Reality
**Problem:** SOP references Amuse (now DistroKid), Strong Selects as active, and pre-Apr 2 schedule.
**Fix:** Update distribution references, add note about SS status, verify upload timelines match DistroKid's processing window (may differ from Amuse's 48hr).

---

## TIER 5 — STRETCH (Post-Apr 24)

### 5.1 Oracle Compass: Audit Trail for Realignments
When Oracle shifts a release date or sets a priority, log `{ action, reason, previousValue, newValue, timestamp }` to an append-only store. Enables debugging "why did this date move?"

### 5.2 Gorilla Geo: Option B Full Bypass (Spotify-Only Geo)
If IG scraping remains blocked, build a pure-Spotify geographic intelligence module using "Where People Listen" data from Spotify for Artists CSV exports.

### 5.3 Oracle Compass: Test Suite
No test coverage exists. Priority files for unit tests:
1. `lib/killList.ts` — task derivation logic (RED/AMBER/GREEN thresholds)
2. `lib/derived-intelligence.ts` — severity scoring
3. `lib/lanes.ts` — lane touch computation
4. `lib/completionAnalytics.ts` — heatmap and velocity

### 5.4 Core Drive Builder: Registry Deduplication
`identity-sync.mjs` appends duplicate entries on re-runs. Add idempotency check using track slug + project name as composite key.

### 5.5 Oracle Compass: Personal Time Quality Signal
Currently only tracks boolean `personalTime`. Add `personalTimeQuality: number | null` (1-3) to differentiate "scrolled phone for 20 minutes" from "went for a walk with GF."

### 5.6 Content Factory V4: Batch Processing Mode
Currently processes one video at a time. Add `--batch` flag that processes all `.mov` files in an input directory, applying the same jutsu and mode to each.

---

## IMPLEMENTATION NOTES FOR SONNET

1. **Software freeze is still ON** except Oracle Compass maintenance and active pipeline tools. Tier 1 and 2 items qualify as maintenance. Tier 3+ items that touch oracle-compass are maintenance. Gorilla Geo and Core Drive Builder are active pipeline tools.

2. **Don't touch:** Synesthesia Visualizer, Greenbook, THCa Scout, E-Tailor Mark II, Strong Selects, ep-artist-site — all parked until post-Apr 24.

3. **Verify every file claim.** Read the actual file before editing. Antigravity hallucination history is documented.

4. **Token efficiency:** Batch file reads (6-9 per call via read_multiple_files). Use write_file over edit_file for files with template literals.

5. **Test on Vercel:** Local `next build` fails with EPERM. Push to main and let Vercel build. Check deployment logs.

6. **Priority order:** 1.1 → 1.2 → 2.1 → 2.2 → 2.3 → 2.4 → 2.5 → 3.1 → everything else as time permits.

---

*Compiled: April 4, 2026 by Opus*
*Source: Full filesystem audit + handoff_apr1 + handoff_apr3 + handoff_apr4 + mirror_doc + 7 parallel agent scans*
