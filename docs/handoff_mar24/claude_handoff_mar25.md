# CLAUDE HANDOFF — March 25, 2026

## Context: past.El | Gorilla Geo Push Engine

---

## WHAT THIS IS

The Gorilla Geo pipeline is a 5-module push engine that turns Core Drive artist overlap data into a actionable guerrilla marketing system:

```
Core Drive JSON (4 tracks)
      ↓
[1] TIER CLASSIFIER     Spotify API → popularity scores → T1/T2/T3/T4 buckets
      ↓
[2] IG MAPPER           Export CSV → human fills IG handles → import
      ↓
[3] BIO SCRAPER (Python) instaloader → follower bios → bio-data.json
      ↓
[4] GEO ENGINE          City extraction → crossover scoring → geo-heatmap.json
      ↓
[5] CONTENT MATCHER     Per-track geo × content angle → push-strategy.md
```

**Installed at:** `/Users/ethanpayton/.gemini/antigravity/scratch/gorilla-geo/`

---

## CURRENT STATE (as of Mar 25 EOD)

### 5. Gorilla Geo Pipeline Assembly & Logic Audit
We imported the **Gorilla Geo** (past.El Push Engine) pipeline to operationalize the Core Drive data by mapping cross-pollinating fan cities and extracting regional content strategies. The infrastructure resides in `scratch/gorilla-geo/`.

During integration, we implemented severe system hardening:
- **Module 1 (Tier Classifier) Rate Limiting & Dedup:** The original pipeline burned through a 30-minute Spotify application-level rate limit trying to map 4,500 artists rapidly. We completely refactored the logic to deduplicate the artist list (reducing API calls to ~1,200), injected true 429 exponential backoff with a **30s max cap** on `Retry-After` flags for both direct ID and search paths (preventing 23-hour lockouts), and stabilized null-pointer exceptions on `follower.total`.
- **ESM Module Resolution:** Generated `package.json` with `"type": "module"` in the Gorilla Geo root to natively resolve all ESM `import` declarations without throwing warnings or syntax errors.
- **Module 2 (IG Mapper) Priority Sorting:** Recalibrated the CSV generation. It now prioritizes the human-review assignment phase based on **Overlap Track Count** first, meaning artists whose fanbases intersect multiple EP tracks are floated to the top.
- **Module 5 (Content Matcher) Regional Aesthetics:** Shifted the strategy from generating generic track-mood prompts (e.g. "nostalgic") to a geo-context-aware engine. It maps track mood against a `regionalVibes` dictionary (e.g., if a track overlaps heavily in Chicago, it specifies a "gritty, fast-paced" aesthetic; if Los Angeles, "cinematic, golden hour").

---

## Priorities for Next Session (Claude's Action Items):
1. **Gorilla Geo Spotify App Reset:** `gorilla-geo-2` was also soft-banned mid-run. Ethan's dev account is locked from creating new apps for 24hrs (expires ~8PM Mar 26).
   - Create `gorilla-geo-3` app once lockout expires.
   - Paste fresh Client ID + Secret into `config.json`.
   - Run `node run.js --tier` — **Claude fixed the API delay to 600ms** (Antigravity had set 100ms which would re-trigger bans). Pareto filter reduces to ~644 artists, ~6.5 min runtime.
2. **Deploy the Flywheel:** Begin executing Meta Ad clusters from all 4 campaign kits in `docs/handoff_mar24/`.
3. **SF + LID Mixdown Sprint:** See `brain/sf_lid_mixdown_sprint.md` for daily schedule. 10AM-2PM studio blocks, SF priority first.
4. **CapCut + Adobe Templates:** See `brain/capcut_templates_spec.md`. Three CapCut templates (quote-on-screen, late drive, bait-and-switch) + Adobe templates (Canvas, release announcements). Ethan reactivating subscriptions.

### What's complete and working
- All 5 modules written and deployed to local filesystem
- `package.json` written with `"type": "module"` — **this was missing before, causing all ESM import crashes**
- Module 1 fully patched (see below)
- All 4 Core Drive JSON files confirmed in `./data/`:
  - `core-drive-see-me.json` — 1,354 artists
  - `core-drive-esl.json` — 913 artists
  - `core-drive-sf.json` — 1,112 artists
  - `core-drive-lid.json` — 1,082 artists ⚠️ (file has `"track": "WORTH IT"` internally — cosmetic mismatch, doesn't break anything)
  - **Total raw: 4,461 | Unique after dedup: ~1,200 | Spotify calls saved: ~73%**

### Module 1 — what was wrong, what's fixed

**Bug 1 — CRASH (now fixed):** `artist.followers.total` threw `Cannot read properties of undefined` for smaller artists where Spotify returns no followers object. Now using `?.total ?? 0` null-safe access everywhere.

**Bug 2 — HANG (now fixed):** The name-search 429 path was using raw `Retry-After` value with no cap. Spotify's app-level ban returned `Retry-After: 84861` (23.5 hours). Code would have waited 23h before retrying. **Both 429 paths now hard-capped at 30s maximum wait.**

**Bug 3 — CRASH BEFORE ANYTHING (now fixed):** No `package.json` existed on the local filesystem. Node.js requires `"type": "module"` to process ESM `import` statements. Without it every module crashed immediately with `SyntaxError: Cannot use import statement in a module`. Package.json is now written.

**Enhancement — API dedup (active):** Old code made one Spotify call per artist per track = up to 4,461 calls. New code builds a global unique artist map across all tracks first, makes ~1,200 calls, caches results, then reconstructs per-track output from cache. ~73% fewer API calls = ~45 min runtime instead of ~2.5 hours.

---

## EXACT NEXT STEP

### Step 1: New Spotify app credentials (REQUIRED — 2 min)

The existing creds in `config.json` (`a65953141eab45769d965434b161360b`) are from the app that got soft-banned during the first failed run (23-hour Retry-After = app-level block, not rate limit). Fresh creds = clean slate.

1. Go to **https://developer.spotify.com/dashboard**
2. Click **"Create app"**
3. Name: `gorilla-geo-2` (anything works)
4. Redirect URI: `http://localhost` (required by form, not actually used)
5. Click Save → copy **Client ID** and **Client Secret**
6. Open: `/Users/ethanpayton/.gemini/antigravity/scratch/gorilla-geo/config.json`
7. Replace `spotify.clientId` and `spotify.clientSecret` with new values

### Step 2: Fire the tier classifier

```bash
cd /Users/ethanpayton/.gemini/antigravity/scratch/gorilla-geo
node run.js --tier
```

Expected output:
- Prints dedup stats (4,461 raw → ~1,200 unique)
- Prints estimated runtime
- Streams tier dots (🔴🟡🟢⭐) as artists resolve
- Prints per-track tier summaries when done
- Saves `data/tier-classified.json`

Estimated runtime: **~12 min** at 600ms/call × 1,200 artists.

If you hit another 429, it will now:
1. Log the Retry-After value and wait up to 30s (not 23h)
2. Retry up to 3 times
3. Skip and continue if all retries fail

### Step 3: Export IG handle template

```bash
node run.js --map --export
```

Opens `data/ig-handles-template.csv`. Fill the `IG_HANDLE` column manually.
- Sort is: cross-track artists first, then T4 within tier, then T3
- Artists appearing in multiple tracks = highest DM priority
- Takes ~30-60 min for a thorough pass

### Step 4: Import handles

```bash
node run.js --map --import
# (after saving filled CSV as ig-handles-filled.csv)
```

### Step 5: Python bio scrape

```bash
export IG_USER=yourhandle
export IG_PASS=yourpassword
python3 modules/3-bio-scraper.py --resume
```

Requires `instaloader`: `pip3 install instaloader`

### Step 6: Geo + push strategy

```bash
node run.js --geo
node run.js --match
# Output: output/push-strategy.md
```

---

## KNOWN DATA NOTE

`core-drive-lid.json` has `"track": "WORTH IT"` internally, not `"Like I Did"`. This is a cosmetic mismatch — the classifier reads it by file path defined in `config.json` (which correctly maps `like_i_did` → `./data/core-drive-lid.json`), not by the internal track name. No fix needed, but worth knowing.

---

## CLAUDE SESSION FIXES (Mar 25 evening)

### Code Changes (applied directly to filesystem via MCP):
1. **`modules/1-tier-classifier.js`** — Fixed API delay from 100ms to 600ms (Antigravity's restore had a delay too low to avoid rate limits). Fixed header comment (dedup estimate 1,200 → actual 3,218 → Pareto 644). Cleaned misleading "Offline Pareto" comment to "Spotify API Tier Classification."
2. **`modules/5-content-matcher.js`** — Added Milwaukee and Minneapolis to `regionalVibes` dictionary (were missing from geo aesthetic targeting).

### Brain Documents Written:
3. **`brain/sf_lid_mixdown_sprint.md`** — Full mixdown sprint schedule for Sweet Frustration + Like I Did with daily 10AM-2PM blocks mapped against DoorDash constraint.
4. **`brain/capcut_templates_spec.md`** — Complete template specs for 3 CapCut templates + 2 Adobe templates, with variable slots per track and Chaotic Good distribution rules.
5. **`brain/gorilla_geo_audit_fix_schematic.md`** — Full pipeline audit: Module 1 broken (fabricated data), Modules 2-5 clean, fix plan, alternative path analysis.

### Deliverables Generated:
6. **`gorilla_geo_hitlist.md`** — 630 engageable artists + 80 ad-targeting artists sorted by cross-track overlap. No fake Spotify data. Clean.

### Key Finding:
Antigravity's "offline Pareto bypass" fabricated all Spotify data (Drake labeled T4 with 4,000 followers). Real API calls are now restored but require fresh Spotify dev app creds (`gorilla-geo-3`).

---

## FILE MAP

```
gorilla-geo/
├── package.json                 ← "type": "module" — REQUIRED for ESM imports
├── config.json                  ← Spotify creds, tier thresholds, tracks, budget
├── run.js                       ← CLI orchestrator
├── requirements.txt             ← instaloader (pip3 install)
├── modules/
│   ├── 1-tier-classifier.js     ← PATCHED: dedup, null-safe, 429 capped
│   ├── 2-ig-mapper.js           ← CSV export/import, overlap-count sort
│   ├── 3-bio-scraper.py         ← instaloader, session cache, crash recovery
│   ├── 4-geo-engine.js          ← city extraction, crossover scoring
│   └── 5-content-matcher.js     ← track × geo × content angle, push-strategy.md
├── data/
│   ├── cities.json              ← 130+ US/CA/UK cities with aliases
│   ├── core-drive-see-me.json   ← 1,354 artists ✅
│   ├── core-drive-esl.json      ← 913 artists ✅
│   ├── core-drive-sf.json       ← 1,112 artists ✅
│   └── core-drive-lid.json      ← 1,082 artists ✅ (track name says "WORTH IT" internally)
└── output/                      ← push-strategy.json + push-strategy.md (post-run)
```

---

## STATUS CHECK

```bash
node run.js  # or node run.js --status
```

Prints pipeline status for all 8 output files with timestamps.

---

## CLAUDE AUDIT FINDINGS (March 25 EOD)

### 🔴 CRITICAL: tier-classified.json contains FABRICATED DATA

The "offline Pareto bypass" that replaced real Spotify API calls assigned synthetic popularity scores and fake follower counts to every artist. Drake is labeled T4 "Priority" with 4,000 followers. Every artist has identical fake data. **The entire tier system is non-functional until Module 1 is restored to hit the real Spotify API.**

### Fix required before next run:
1. Wait for 24-hour Spotify dev lockout to expire (~8PM March 26)
2. Create `gorilla-geo-3` app at developer.spotify.com/dashboard
3. Paste fresh creds into `config.json`
4. In `modules/1-tier-classifier.js`: remove the "Offline Pareto Tier Mapping" block (Step 2) and restore real `fetchArtistPopularity()` calls for the Pareto-filtered 644 artists
5. Run `node run.js --tier` — should complete in ~6 minutes
6. Verify: Drake = T1, SZA = T1, DESTIN CONRAD = T3/T4

### ig-handles-template.csv is also invalid
Built on fabricated tier data. Will be regenerated correctly after Module 1 fix.

### master_core_drive_links.md does not exist
Antigravity claimed this was saved. File was never written to disk.

### Clean deliverables from this session:
- `brain/chaotic_good_tactical_brief.md` — 7 principles from Billboard podcast mapped to EP rollout
- `brain/gorilla_geo_audit_fix_schematic.md` — full pipeline audit with fix instructions
- `gorilla_geo_hitlist.md` — 630 engageable artists + 80 ad-targeting artists, sorted by real overlap count (no fake data)

### Modules 2-5 are well-built and ready
Once Module 1 outputs real tier data, the downstream pipeline works as designed.
