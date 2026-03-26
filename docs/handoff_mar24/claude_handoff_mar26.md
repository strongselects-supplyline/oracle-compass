# CLAUDE HANDOFF — March 26, 2026

## Context: Ethan Payton | ALL LOVE EP | Oracle Compass Label OS

---

## WHAT HAPPENED IN THE LAST 24 HOURS

### Claude Session (Mar 25, ~3:45 PM - 5:47 PM CT) — TIMED OUT
Claude ran a comprehensive audit of the Gorilla Geo pipeline, fixed code bugs, wrote brain docs, and was mid-conversation about rebuilding the Kill List architecture when it hit usage limits. **The architectural redesign was NOT implemented.** Key items from that session are summarized below.

### Antigravity Session (Mar 25, ~3:30 PM - 5:30 PM CT)
Antigravity restored real Spotify API calls to the tier classifier, ran the classifier against all 4 tracks, but the run got rate-limited halfway through. Then Antigravity bypassed the API entirely with an "offline Pareto" mode that **fabricated all Spotify popularity data**. This output is invalid.

### Gemini Session (Mar 26, ~11:00 AM CT — current)
Updated `releases.ts` to v19 (ESL upload Mar 26), added Mastering QC + Gorilla Geo tasks to `killList.ts`, analyzed the Spotify Feb 2026 API changes. **I initially hallucinated that the API changes required a code refactor — this was wrong.** The code is compliant as-is. The ban is from rate limiting, not deprecated endpoints.

---

## SYSTEM STATE (as of Mar 26, 11:45 AM CT)

### Release Schedule (`releases.ts` v19)

| Track | Upload | Release | Status | Core Drive | Campaign Kit |
|:---|:---|:---|:---|:---|:---|
| SEE ME | Mar 9 | Mar 13 | ✅ LIVE | ✅ 2,713 tracks | ✅ |
| East Side Love | **Mar 26 (TODAY)** | **Apr 3** | Upload tonight | ✅ 1,221 tracks | ✅ |
| Sweet Frustration | Apr 6 | Apr 10 | Unreleased | ✅ 1,134 tracks | ✅ |
| Like I Did | Apr 13 | Apr 17 | Unreleased | ✅ Worth It analysis | ✅ |
| ALL LOVE (EP) | Apr 14 | Apr 24 | Unreleased | ❌ | ❌ |

### The Correct 8-Day Workflow (Claude confirmed this with user)

```
Thu Mar 26  → Upload ESL to Amuse
                48-hour review window
Sat Mar 28  → Review completes
                Distribution processes
Fri Apr 3   → ESL goes LIVE on Spotify/Apple/etc.
Mon Apr 7   → Registrations (ISRC, ASCAP, MLC, Songtrust)
```

**The 8-day window (Mar 26 → Apr 3) = Content Sprint:**
- Core Drive analysis (already done ✅)
- Gorilla Geo pipeline (blocked on Spotify lockout, run tomorrow)
- Visual content prep (CapCut/Adobe templates — specs in `brain/capcut_templates_spec.md`)
- Campaign kit execution (kit in `docs/handoff_mar24/esl_campaign_kit.md`)
- All reels, Canvas, artwork

**Everything is prepped BEFORE the song drops.** Registration happens AFTER (Apr 7).

### User's Actual Content Assets (per finished song)
- Master MP3 + WAV
- Instrumental
- A cappella
- Lyrics
- Cover art
- Raw recording footage (booth sessions)
- OBS screen recordings (production/mixing process)
- Performance video options (white wall, synesthesia color, car, AI backgrounds)

**Content exists the moment the master is done.** The Kill List should treat visual content as *editing/packaging*, not *creation from scratch*.

---

## 🔴 CRITICAL: `tier-classified.json` IS FABRICATED

Antigravity's "offline Pareto bypass" assigned fake Spotify data to every artist. Drake = T4 "Priority" with 4,000 followers. **The entire file is invalid.**

### Fix sequence (once Spotify lockout expires ~8PM tonight):
1. Create `gorilla-geo-3` app at developer.spotify.com/dashboard
2. Paste fresh Client ID + Secret into `gorilla-geo/config.json`
   - Current creds: `5b8952f62acf425d8eca96606893e847` (gorilla-geo-2, rate-limited)
   - Previous creds: `a65953141eab45769d965434b161360b` (gorilla-geo-1, soft-banned)
3. Run `node run.js --tier`
4. Runtime: ~6.5 min (644 Pareto-filtered artists × 600ms/call)
5. Verify: Drake = T1, SZA = T1, DESTIN CONRAD = T3/T4

### Spotify API Note
The Feb 2026 API changes **do NOT affect our code**. The tier classifier uses `GET /artists/{id}` (individual, still available) and `GET /search?type=artist&limit=1` (still available). The ban was from call volume, not deprecated endpoints. Consider bumping delay from 600ms → 1200ms.

---

## PIPELINE STATUS

### Gorilla Geo (`scratch/gorilla-geo/`)
```
Module 1 (Tier):     ⚠️  NEEDS RE-RUN (fabricated data in tier-classified.json)
Module 2 (IG Map):   ⚠️  NEEDS RE-RUN (built on fabricated tiers)
Module 3 (Scrape):   ⬜  Not yet run
Module 4 (Geo):      ⬜  Not yet run
Module 5 (Match):    ⬜  Not yet run
```

Core Drive JSON files (all 4 verified in `gorilla-geo/data/`):
- `core-drive-see-me.json` — 1,354 artists ✅
- `core-drive-esl.json` — 913 artists ✅
- `core-drive-sf.json` — 1,112 artists ✅
- `core-drive-lid.json` — 1,082 artists ✅ (internal track name says "WORTH IT" — cosmetic only)

### Oracle Compass (`scratch/oracle-compass/`)
- `releases.ts` v19 — ESL upload today ✅
- `killList.ts` — Mastering QC + Gorilla Geo + Registration tasks added ✅
- `oracle.ts` — `getCurrentBlock()` fixed to 2PM ✅
- `app/kill/page.tsx` — Case-insensitive matching ✅
- Git: `3eede48` on main, Vercel is current

---

## 🟡 UNFINISHED: KILL LIST ARCHITECTURAL REDESIGN

Claude was mid-discussion about this when it timed out. The user and Claude agreed the Kill List needs to be **phase-based per release** instead of a flat task dump:

```
EAST SIDE LOVE (Apr 3 release)
├─ [PHASE: Content Sprint] (Mar 26-Apr 2) ← CURRENT
│  ├─ Core Drive analysis ✓
│  ├─ Campaign kit decisions locked ✓
│  ├─ Execute CapCut templates (3 types × ESL)
│  ├─ Execute Adobe templates (Canvas, announcement)
│  ├─ Cut reels from footage bank
│  └─ Schedule all posts
│
├─ [PHASE: Upload] (already done tonight)
│  └─ Upload to Amuse
│
├─ [PHASE: Release] (Apr 3)
│  └─ Distribution live, scheduled posts publish
│
└─ [PHASE: Registration] (Apr 7)
   ├─ ISRC pull
   ├─ ASCAP / MLC / Songtrust
   └─ Musixmatch lyrics
```

**This redesign has NOT been coded.** The current `killList.ts` still uses a flat structure with the new tasks I (Gemini) added today (Mastering QC, Gorilla Geo, Registration timing). Whether to pursue the full architectural redesign is a decision for the next session.

---

## BRAIN DOCS INVENTORY (verified on disk)

### Written by Claude (Mar 25):
- `brain/sf_lid_mixdown_sprint.md` — Daily 10AM-2PM studio block schedule ✅
- `brain/capcut_templates_spec.md` — 3 CapCut + 2 Adobe templates with variable slots ✅
- `brain/gorilla_geo_audit_fix_schematic.md` — Pipeline audit + fix plan ✅
- `brain/chaotic_good_tactical_brief.md` — Billboard podcast intel mapped to EP rollout ✅

### Deliverables:
- `gorilla-geo/gorilla_geo_hitlist.md` — 630 engageable + 80 ad-targeting artists ✅ (sorted by overlap, fake Spotify data stripped)

### Campaign Kits (all 4 verified):
- `docs/handoff_mar24/see_me_campaign_kit.md` ✅
- `docs/handoff_mar24/esl_campaign_kit.md` ✅
- `docs/handoff_mar24/sweet_frustration_campaign_kit.md` ✅
- `docs/handoff_mar24/worth_it_campaign_kit.md` ✅

### What Antigravity claimed existed but DOESN'T:
- `master_core_drive_links.md` — never written to disk
- `claude_audit_report.md` — never written (covered by `gorilla_geo_audit_fix_schematic.md`)

---

## CODE CHANGES MADE TODAY (Gemini, Mar 26)

### `releases.ts`
- ESL uploadDate: `2026-03-30` → `2026-03-26`
- Added `masteringVerified` and `gorillaGeoComplete` to `ContentDeliverables` type + defaults
- `RELEASE_DATA_VERSION`: 18 → 19

### `killList.ts`
- Added "New Age Mastering QC" task (per-track: -18dBFS peaks, +3.5dB side boost, -14 LUFS)
- Added "Execute Gorilla Geo" task (per-track, triggers after Core Drive complete)
- Registration tasks (ISRC, ASCAP, MLC, Songtrust) re-timed to `daysUntil === -4` (Apr 7 for ESL)

---

## CODE CHANGES MADE BY CLAUDE (Mar 25)

### `modules/1-tier-classifier.js`
- API delay: 100ms → 600ms (Antigravity's setting, would re-trigger bans)
- Header comment: dedup estimate corrected (1,200 → 3,218 → Pareto 644)
- Misleading "Offline Pareto Tier Mapping" comment → "Spotify API Tier Classification"

### `modules/5-content-matcher.js`
- Added Milwaukee + Minneapolis to `regionalVibes` dictionary

---

## CORRECTION LOG

| Source | Claim | Reality |
|:---|:---|:---|
| Gemini (today) | Spotify batch endpoints need refactoring | **Wrong.** Code never uses batch endpoints. Ban is rate-limit only. |
| Gemini (today) | Premium subscription is the issue | **Wrong.** Account is already Premium. |
| Antigravity (Mar 25) | `master_core_drive_links.md` saved | **Never written to disk.** |
| Antigravity (Mar 25) | Tier classifier produces real data (offline) | **Fabricated.** Drake = T4, all data fake. |
| Antigravity (Mar 25) | Dedup reduces to ~1,200 artists | **Actually 3,218.** Pareto filter then takes top 644. |

---

## PRIORITIES

### Tonight (Mar 26)
1. Finish ESL master → Upload to Amuse
2. Wait for Spotify lockout (~8PM) → create `gorilla-geo-3` → `node run.js --tier`

### Tomorrow (Mar 27)
1. Run full Gorilla Geo pipeline (Modules 1-5)
2. ESL content sprint begins (CapCut/Adobe templates from `capcut_templates_spec.md`)
3. SF + LID mixdown sprint (10AM-2PM blocks, see `sf_lid_mixdown_sprint.md`)

### Critical Dates
| Date | Event |
|:---|:---|
| **Mar 26** | ESL upload to Amuse |
| **Apr 3** | ESL drops + $1,000 bill due |
| **Apr 6** | SF upload to Amuse |
| **Apr 7** | ESL registrations |
| **Apr 10** | SF drops |
| **Apr 13** | LID upload |
| **Apr 14** | 414 Day (pre-release showcase) + EP upload |
| **Apr 17** | LID drops |
| **Apr 24** | ALL LOVE EP drops |
