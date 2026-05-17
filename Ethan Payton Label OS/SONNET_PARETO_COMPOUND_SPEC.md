# SONNET EXECUTION SPEC: PARETO COMPOUND PIVOT
## Mechanical updates — no judgment calls required

**Written:** May 14, 2026 — Claude (Opus, Lead Architect)
**Purpose:** Every stale file identified in the 90-day audit, with exact old → new values. Sonnet executes top to bottom. No skipping. Bump version numbers where applicable.

**CRITICAL:** LIVE_STATE.md and CLAUDE.md already have correct May 29 dates. Do NOT touch those files — they are the source of truth. This spec fixes everything else.

---

## FILE 1: `scratch/oracle-compass/lib/releases.ts`

**Current state:** v38. Dates show May 11 upload / May 15 release. ESL shows May 9 instead of May 8.
**Target state:** v39. All dates match LIVE_STATE.md.

### Changes:

**Line 139 (comment):**
```
OLD: // Apr 29 EP BOMB PIVOT: Full 5-track EP drops May 15 (ICEMAN day).
NEW: // May 12 PARETO COMPOUND PIVOT: Full 5-track EP drops May 29.
```

**Line 140 (comment):**
```
OLD: // All tracks upload May 11. Post-EP vault waterfall starts May 30.
NEW: // GL/SF/WU2 upload May 19. Post-EP vault waterfall starts Jun 12.
```

**Line 155 (ESL release date):**
```
OLD: title: "East Side Love", uploadDate: "2026-04-30", releaseDate: "2026-05-09", status: "live", type: "waterfall_single",
NEW: title: "East Side Love", uploadDate: "2026-04-30", releaseDate: "2026-05-08", status: "live", type: "waterfall_single",
```

**Line 156 (ESL notes) — update "May 9" references to "May 8" and "May 15" to "May 29":**
```
OLD: ...notes: "ADVANCE SINGLE — uploaded Apr 30, releases May 9 (MSTR 2). Also EP track 4. Release Radar trigger #1 (May 9). EP carries it as track 4 on May 15. Cyanite: 104 BPM, C# minor, R&B 0.84, Sexy 0.85. Core Drive: 1,221 tracks / 20 playlists."
NEW: ...notes: "ADVANCE SINGLE — uploaded Apr 30, dropped May 8 (MSTR 2). Also EP track 4. Release Radar trigger #1 (May 8). EP carries it as track 4 on May 29. Cyanite: 104 BPM, C# minor, R&B 0.84, Sexy 0.85. Core Drive: 1,221 tracks / 20 playlists."
```

**Line 165 (Green Light):**
```
OLD: title: "Green Light", uploadDate: "2026-05-11", releaseDate: "2026-05-15", status: "unreleased", type: "ep_track",
NEW: title: "Green Light", uploadDate: "2026-05-19", releaseDate: "2026-05-29", status: "unreleased", type: "ep_track",
```

**Line 166 (GL notes):**
```
OLD: ...notes: "EP track 3. NOT a standalone single. Drops as part of EP bomb May 15."
NEW: ...notes: "EP track 1 (opens EP). NOT a standalone single. Drops as part of EP May 29."
```

**Line 170 (Sweet Frustration):**
```
OLD: title: "Sweet Frustration", uploadDate: "2026-05-11", releaseDate: "2026-05-15", status: "unreleased", type: "ep_track",
NEW: title: "Sweet Frustration", uploadDate: "2026-05-19", releaseDate: "2026-05-29", status: "unreleased", type: "ep_track",
```

**Line 171 (SF notes):**
```
OLD: ...notes: "EP track 4. KAYTRANADA lane. NOT a standalone single. Drops as part of EP bomb May 15."
NEW: ...notes: "EP track 2. KAYTRANADA lane. Editorial pitch target. NOT a standalone single. Drops as part of EP May 29."
```

**Line 175 (WANT U 2):**
```
OLD: title: "WANT U 2", uploadDate: "2026-05-11", releaseDate: "2026-05-15", status: "unreleased", type: "ep_track",
NEW: title: "WANT U 2", uploadDate: "2026-05-19", releaseDate: "2026-05-29", status: "unreleased", type: "ep_track",
```

**Line 180 (ALL LOVE EP):**
```
OLD: title: "ALL LOVE (EP)", uploadDate: "2026-05-11", releaseDate: "2026-05-15", status: "unreleased", type: "ep",
NEW: title: "ALL LOVE (EP)", uploadDate: "2026-05-19", releaseDate: "2026-05-29", status: "unreleased", type: "ep",
```

**Line 181 (EP notes) — update all date references:**
```
OLD: ...notes: "5-track EP: Green Light → Sweet Frustration → SEE ME → East Side Love → WANT U 2. GL/SF open — 2.0 streams/listener means most bail after track 2, new tracks must hit first. ESL advance single May 9 (Release Radar #1). EP May 15 (Release Radar #2 via GL/SF/WU2). Editorial pitch: Sweet Frustration (KAYTRANADA lane, genre outlier). Needs: EP cover art (DONE), UPC, EP-level Spotify pitch."
NEW: ...notes: "5-track EP: Green Light → Sweet Frustration → SEE ME → East Side Love → WANT U 2. GL/SF open — 2.0 streams/listener means most bail after track 2, new tracks must hit first. ESL advance single May 8 (Release Radar #1). EP May 29 (Release Radar #2 via GL/SF/WU2). Editorial pitch: Sweet Frustration (KAYTRANADA lane, genre outlier). Needs: EP cover art (DONE), UPC, EP-level Spotify pitch."
```

**Line 185 (Like I Did):**
```
OLD: title: "Like I Did", uploadDate: "2026-05-23", releaseDate: "2026-05-30", status: "unreleased", type: "vault_single",
NEW: title: "Like I Did", uploadDate: "2026-06-05", releaseDate: "2026-06-12", status: "unreleased", type: "vault_single",
```

**Line 190 (I Like Girls):**
```
OLD: title: "I Like Girls", uploadDate: "2026-06-06", releaseDate: "2026-06-13", status: "unreleased", type: "vault_single",
NEW: title: "I Like Girls", uploadDate: "2026-06-19", releaseDate: "2026-06-26", status: "unreleased", type: "vault_single",
```

**Line 195 (Worth It):**
```
OLD: title: "Worth It", uploadDate: "2026-06-20", releaseDate: "2026-06-27", status: "unreleased", type: "vault_single",
NEW: title: "Worth It", uploadDate: "2026-07-03", releaseDate: "2026-07-10", status: "unreleased", type: "vault_single",
```

**Line 200 (Just Say So):**
```
OLD: title: "Just Say So", uploadDate: "2026-07-04", releaseDate: "2026-07-11", status: "unreleased", type: "vault_single",
NEW: title: "Just Say So", uploadDate: "2026-07-17", releaseDate: "2026-07-24", status: "unreleased", type: "vault_single",
```

**Line 205 (Reconnect):**
```
OLD: title: "Reconnect", uploadDate: "2026-07-18", releaseDate: "2026-07-25", status: "unreleased", type: "vault_single",
NEW: title: "Reconnect", uploadDate: "2026-07-31", releaseDate: "2026-08-07", status: "unreleased", type: "vault_single",
```

**Line 215 (version):**
```
OLD: const RELEASE_DATA_VERSION = 38;
NEW: const RELEASE_DATA_VERSION = 39;
```

**Lines 333-335 (exports):**
```
OLD: // Apr 29 EP BOMB PIVOT: Full EP drops May 15. Upload May 11. Post-EP vault waterfall starts May 30.
OLD: export const EP_UPLOAD_DATE = "2026-05-11";
NEW: // May 14 PARETO COMPOUND: Full EP drops May 29. Upload May 19. Post-EP vault waterfall starts Jun 12.
NEW: export const EP_UPLOAD_DATE = "2026-05-19";
```

Also find and update:
```
OLD: export const EP_RELEASE_DATE = "2026-05-15";
NEW: export const EP_RELEASE_DATE = "2026-05-29";
```

---

## FILE 2: `scratch/oracle-compass/lib/killList.ts`

**Lines 1329-1331:**
```
OLD: // Hard deadlines — EP upload by May 11, EP release May 15
OLD: const epUploadDeadline = new Date("2026-05-11T00:00:00");
OLD: const epReleaseDeadline = new Date("2026-05-15T00:00:00");
NEW: // Hard deadlines — EP upload by May 19, EP release May 29
NEW: const epUploadDeadline = new Date("2026-05-19T00:00:00");
NEW: const epReleaseDeadline = new Date("2026-05-29T00:00:00");
```

**Line 1447 (subtitle reference):**
```
OLD: subtitle: `Sweet Frustration: ${sfHours} / 10 hrs logged. ${daysToUpload} days to EP upload (May 11).`,
NEW: subtitle: `Sweet Frustration: ${sfHours} / 10 hrs logged. ${daysToUpload} days to EP upload (May 19).`,
```

---

## FILE 3: `scratch/oracle-compass/lib/phaseMap.ts`

**Lines 5-11 (header comment):**
```
OLD:
// APR 29 EP BOMB PIVOT:
//   Phase 1a: Recording Marathon (Apr 30 → May 6)
//   Phase 1b: EP Upload + Pre-Release (May 11 → May 14)
//   Phase 1c: EP Release Day + Post-Release (May 15 → May 29)
//   Phase 2: Vault Singles Waterfall (May 30 → Sep 26)
//     LID May 30, ILG Jun 13, WI Jun 27, JSS Jul 11, RCN Jul 25
//   Phase 3: Compound + CREAM Decision (Jul 10)

NEW:
// MAY 14 PARETO COMPOUND:
//   Phase 1a: Recording Marathon (Apr 30 → May 18)
//   Phase 1b: EP Upload + Pre-Release (May 19 → May 28)
//   Phase 1c: EP Release Day + Post-Release (May 29 → Jun 11)
//   Phase 2: Vault Singles Waterfall (Jun 12 → Aug 7)
//     LID Jun 12, ILG Jun 26, WI Jul 10, JSS Jul 24, RCN Aug 7
//   Phase 3: Decision + APG (Jul 24 CREAM go/no-go, Aug 15 APG mark)
```

**All PHASE_MAP entries from May 7-14 that reference "Days to Upload" with dropDate "2026-05-11":**
Change `dropDate: "2026-05-11"` → `dropDate: "2026-05-19"` and update deliverable text accordingly.

**All entries referencing "May 15" as EP release day:**
Change to "May 29". This affects the Phase 1c section header and all entries May 15-29.

**Vault single entries (Phase 2):**
Shift all dates by +13 days to match new waterfall calendar:
- LID: May 30 → Jun 12
- ILG: Jun 13 → Jun 26
- WI: Jun 27 → Jul 10
- JSS: Jul 11 → Jul 24
- RCN: Jul 25 → Aug 7

**CREAM decision entry:**
```
OLD: "2026-07-10" CREAM GO/NO-GO
NEW: "2026-07-24" CREAM GO/NO-GO (aligns with JSS drop — more data points)
```

> **NOTE:** phaseMap.ts is 190+ lines of date-keyed entries. A full rewrite is more efficient than 50+ individual edits. Sonnet should generate the entire PHASE_MAP object fresh using the new dates from LIVE_STATE.md as source of truth. Structure and field schema stay identical — only dates and deliverable text change.

---

## FILE 4: `scratch/oracle-compass/lib/dayType.ts`

**Lines 4, 18, 31, 44 (comments):**
```
OLD: // PHASE 1 — PRODUCTION SPRINT (through May 11, 2026):
NEW: // PHASE 1 — PRODUCTION SPRINT (through May 19, 2026):

OLD: // PHASE 1 DAILY BLOCK MAP (through May 11):
NEW: // PHASE 1 DAILY BLOCK MAP (through May 19):

OLD: // EP drops May 15. Phase 2 (VAULT WATERFALL) begins May 30 with Like I Did.
NEW: // EP drops May 29. Phase 2 (VAULT WATERFALL) begins Jun 12 with Like I Did.

OLD: // Phase 1 (through May 11): every day is a studio day.
NEW: // Phase 1 (through May 19): every day is a studio day.
```

---

## FILE 5: `scratch/oracle-compass/lib/marathon-data.ts`

**Line 4 (comment):**
```
OLD: // EP BOMB May 15. Vault waterfall: LID May 30 → ILG Jun 13 → WI Jun 27 → JSS Jul 11 → RCN Jul 25.
NEW: // EP May 29. Vault waterfall: LID Jun 12 → ILG Jun 26 → WI Jul 10 → JSS Jul 24 → RCN Aug 7.
```

**Line 8 (Phase type) — remove DELUXE:**
```
OLD: export type Phase = 'ALL_LOVE' | 'DELUXE' | 'CREAM' | 'FREAKSHOW';
NEW: export type Phase = 'ALL_LOVE' | 'CREAM' | 'FREAKSHOW';
```

**Lines 130-131 (Week 10 keyEvents):**
```
OLD: keyEvents: ['ALL LOVE EP uploads May 11', 'ALL LOVE EP drops May 15 (ICEMAN day)'],
NEW: keyEvents: ['ALL LOVE EP uploads May 19', 'ALL LOVE EP drops May 29'],
```

**Lines 133-153 (Weeks 11-14):**
These weeks reference CREAM and FREAKSHOW production targets (3 tracks each). Replace with vault waterfall cadence:

```typescript
// Week 11: May 17-23 — Post-upload, vault topline sprint
{ wk: 11, dates: 'May 17–23', startDate: '2026-05-17', endDate: '2026-05-23',
  phase: 'ALL_LOVE', phaseBadge: 'EP PRE-RELEASE', target: 'Vault topline sprint', total: 13,
  keyEvents: ['Topline LID/ILG/WI/JSS/RCN masters'],
},
// Week 12: May 24-30 — EP week
{ wk: 12, dates: 'May 24–30', startDate: '2026-05-24', endDate: '2026-05-30',
  phase: 'ALL_LOVE', phaseBadge: 'EP RELEASE', target: 'EP drops May 29', total: 13,
  keyEvents: ['ALL LOVE EP drops May 29'],
},
// Week 13: May 31-Jun 6 — Compound + LID upload prep
{ wk: 13, dates: 'May 31–Jun 6', startDate: '2026-05-31', endDate: '2026-06-06',
  phase: 'ALL_LOVE', phaseBadge: 'COMPOUND', target: 'EP compound + LID upload', total: 13,
  keyEvents: ['Like I Did uploads Jun 5'],
},
// Week 14: Jun 7-13 — LID drops
{ wk: 14, dates: 'Jun 7–13', startDate: '2026-06-07', endDate: '2026-06-13',
  phase: 'ALL_LOVE', phaseBadge: 'WATERFALL', target: 'LID drops Jun 12', total: 14,
  keyEvents: ['Like I Did drops Jun 12'],
},
```

---

## FILE 6: `scratch/oracle-compass/lib/studioData.ts`

**Line 73:**
```
OLD: role: 'EP — 5-track bomb May 15. Post-EP vault waterfall: LID May 30 → ILG Jun 13 → WI Jun 27 → JSS Jul 11 → RCN Jul 25.',
     trackCount: 5, targetDate: '2026-05-15',
NEW: role: 'EP — 5-track release May 29. Post-EP vault waterfall: LID Jun 12 → ILG Jun 26 → WI Jul 10 → JSS Jul 24 → RCN Aug 7.',
     trackCount: 5, targetDate: '2026-05-29',
```

**Line 117 (comment):**
```
OLD: // EP BOMB PIVOT (Apr 29): Full EP drops May 15. Vault singles waterfall starts May 30.
NEW: // PARETO COMPOUND (May 14): Full EP drops May 29. Vault singles waterfall starts Jun 12.
```

**Lines 128-136 (timeline entries for CREAM/FREAKSHOW):**
Remove or comment out the CREAM S1/S2/album and FREAKSHOW entries. Replace with vault waterfall dates:
```typescript
{ date: '2026-06-12', label: 'Like I Did', project: 'all-love', type: 'single' },
{ date: '2026-06-26', label: 'I Like Girls', project: 'all-love', type: 'single' },
{ date: '2026-07-10', label: 'Worth It', project: 'all-love', type: 'single' },
{ date: '2026-07-24', label: 'Just Say So', project: 'all-love', type: 'single' },
{ date: '2026-08-07', label: 'Reconnect', project: 'all-love', type: 'single' },
// CREAM: go/no-go Jul 24. If greenlit, Oct/Nov 2026. Dates TBD.
// FREAKSHOW: deferred to 2027.
```

---

## FILE 7: `brain/context_brief.md`

This entire file is stale (last verified Apr 29). It references May 15 release, May 7 upload, old ESL status, old commit hash, old priority reads order.

**Action:** Sonnet should regenerate this file using CLAUDE.md as the template (CLAUDE.md is current). context_brief.md is a downstream copy that Antigravity reads — it must mirror CLAUDE.md's mission section, key systems, and dates.

Key changes:
- Line 22: "May 15 release" → "May 29 release"
- Line 24: "Apr 29, 2026" → "May 14, 2026"
- Line 26: "upload May 7, release May 15" → "upload May 19, release May 29"
- Line 28: ESL status → "LIVE since May 8"
- Line 40-44: Vault waterfall dates per LIVE_STATE.md
- Line 65: Oracle commit hash → `56ba9d1` (May 12 baseline)
- Remove ICEMAN day references entirely

---

## FILE 8: `brain/SONNET_EP_BOMB_SPEC.md`

**Action:** Archive to `brain/archive/SONNET_EP_BOMB_SPEC.md`. This spec was for the old May 15 dates and is fully superseded. It should not be read by any future session.

---

## FILE 9: `brain/SONNET_WATERFALL_PIVOT_SPEC.md`

**Action:** Archive to `brain/archive/SONNET_WATERFALL_PIVOT_SPEC.md`. Same reason — old dates, old scope.

---

## FILE 10: `brain/SONNET_STAGGER_AMENDMENT.md`

**Action:** Archive to `brain/archive/SONNET_STAGGER_AMENDMENT.md`. Superseded.

---

## FILE 11: `brain/SOVEREIGN_ACTION_PLAN_FINAL.md`

**Action:** Add a header note pointing to the new schematic. Do NOT rewrite the plan — it's a historical document.

**Add after line 1:**
```markdown
> **⚠️ SUPERSEDED May 14, 2026.** This plan's dates and 3-album scope are stale. The canonical forward plan is `90_DAY_SCHEMATIC_MAY14.md` (PARETO COMPOUND). This file is preserved for historical reference — the lifestyle architecture sections (sleep, morning protocol, nutrition, sobriety, grief protocol) remain valid and carry forward unchanged.
```

---

## FILE 12: `brain/catalog_intelligence_matrix.json`

**Stale entries (5 records with "2026-05-15" release dates):**

Update the following records' `release_date` and `pivot_note` fields:
- Sweet Frustration: `"release_date": "2026-05-15"` → `"2026-05-29"`, update pivot_note
- Green Light: `"release_date": "2026-05-15"` → `"2026-05-29"`, update pivot_note
- WANT U 2: `"release_date": "2026-05-15"` → `"2026-05-29"`, update pivot_note
- ALL LOVE EP: `"release_date": "2026-05-15"` → `"2026-05-29"`, update pivot_note
- East Side Love: update pivot_note "May 9" → "May 8" and "May 15" → "May 29"

Also update `spotify_anomaly_note` on Hollywood Fever: "replicate for May 15" → "replicate for May 29"

---

## FILE 13: `brain/cream_preprod.md`

**Line 3:**
```
OLD: > Phase 2 start: April 25, 2026. CREAM target: July 10, 2026. 76 days.
NEW: > Phase 2 start: Contingent on Jul 24 go/no-go. CREAM target: Oct/Nov 2026 if greenlit.
```

**Line 9:**
```
OLD: CREAM is the full-length album. Alt-R&B. The machine ALL LOVE built data for. Target 10 tracks. Release Jul 10 — 13 months before EP turns 30.
NEW: CREAM is the full-length album. Alt-R&B. The machine ALL LOVE built data for. Target 10 tracks. Go/no-go decision Jul 24 based on EP + waterfall data. If greenlit, release Oct/Nov 2026.
```

---

## FILE 14: `brain/intel/release_strategy.md`

**Line 44:**
```
OLD: For the May 11 upload → May 15 release: pitch on May 11 immediately after upload confirmation.
NEW: For the May 19 upload → May 29 release: pitch on May 19 immediately after upload confirmation.
```

**Line 66:**
```
OLD: EP uploads May 11. No further action needed—monitor Release Radar reach in S4A after May 15
NEW: EP uploads May 19. No further action needed—monitor Release Radar reach in S4A after May 29
```

---

## FILE 15: `core-drive-builder/lib/cyanite-fallback.json`

**Current state:** 21 tracks (May 2 data). Missing 19 newly analyzed tracks from May 14 Cyanite vault audit.
**Target state:** Add all 19 new tracks to appropriate sections.

### Add to `vaultWaterfall` (Like I Did update — replace DAW-only entry):
```json
"like_i_did": {
  "title": "Like I Did",
  "tempo": 110,
  "key": "D minor",
  "key_numeric": 2,
  "mode": 0,
  "rb_confidence": 0.57,
  "sexy": 0.60,
  "chill": 0.73,
  "romantic": 0.63,
  "happy": 0.69,
  "waterfall_date": "2026-06-12",
  "source": "Cyanite PDF May 14, 2026 — replaces DAW estimate"
}
```

### Add new section `creamCandidates`:
```json
"creamCandidates": {
  "coming_down": { "title": "Coming Down", "tempo": 103, "key": "D minor", "mode": 0, "rb_confidence": 0.68, "sexy": 0.81, "chill": 0.78, "romantic": 0.62, "happy": 0.60, "source": "Cyanite PDF May 14" },
  "keep_coming_back": { "title": "Keep Coming Back", "tempo": 115, "key": "D minor", "mode": 0, "rb_confidence": 0.64, "sexy": 0.78, "chill": 0.71, "romantic": 0.50, "happy": 0.53, "source": "Cyanite PDF May 14" },
  "hold_of_me": { "title": "Hold of Me", "tempo": 106, "key": "B minor", "mode": 0, "rb_confidence": 0.63, "rap_hiphop_confidence": 0.44, "sexy": 0.71, "chill": 0.54, "romantic": 0.52, "happy": 0.36, "source": "Cyanite PDF May 14" },
  "underneath_it_all": { "title": "Underneath It All", "tempo": 110, "key": "F minor", "mode": 0, "rb_confidence": 0.74, "sexy": 0.72, "romantic": 0.61, "chill": 0.59, "happy": 0.29, "source": "Cyanite PDF May 14" },
  "cant_let_you_go": { "title": "Can't Let You Go", "tempo": 114, "key": "C# minor", "mode": 0, "rb_confidence": 0.70, "sexy": 0.76, "uplifting": 0.48, "romantic": 0.50, "chill": 0.44, "happy": 0.40, "source": "Cyanite PDF May 14" },
  "canada_goose": { "title": "Canada Goose", "tempo": 118, "key": "D minor", "mode": 0, "rb_confidence": 0.51, "sexy": 0.65, "chill": 0.29, "romantic": 0.36, "happy": 0.30, "source": "Cyanite PDF May 14" },
  "elvis_v2": { "title": "Elvis V2", "tempo": 118, "key": "D# minor", "mode": 0, "rb_confidence": 0.51, "rap_hiphop_confidence": 0.44, "sexy": 0.60, "chill": 0.39, "romantic": 0.34, "happy": 0.46, "source": "Cyanite PDF May 14" },
  "only_natural": { "title": "Only Natural", "tempo": 111, "key": "Db major", "mode": 1, "rb_confidence": 0.94, "sexy": 0.87, "romantic": 0.64, "chill": 0.57, "happy": 0.40, "_note": "SPECIAL: highest R&B + Sexy in vault but major key. If darkened to Bb minor → centerpiece.", "source": "Cyanite PDF May 14" },
  "all_my_love_flip": { "title": "All My Love (Flip OG)", "tempo": 132, "key": "C# minor", "mode": 0, "rb_confidence": 0.90, "sexy": 0.66, "romantic": 0.62, "chill": 0.60, "happy": 0.29, "_note": "1:00 demo. Flip >> 138bpm version (R&B 0.90 vs 0.34).", "source": "Cyanite PDF May 14" },
  "devastated": { "title": "Devastated", "tempo": 109, "key": "D major", "mode": 1, "rb_confidence": 0.78, "sexy": 0.64, "romantic": 0.58, "chill": 0.55, "happy": 0.35, "_note": "1:10 demo. Major key — borderline.", "source": "Cyanite PDF May 14" }
}
```

### Add new section `instrumentals` (need vocals before final sort):
```json
"instrumentals": {
  "balenciaga": { "title": "Balenciaga", "tempo": 101, "key": "D# minor", "mode": 0, "pop_confidence": 0.23, "sexy": 0.61, "happy": 0.73, "chill": 0.67, "_note": "Reads Pop not R&B. Vocals will shift.", "source": "Cyanite PDF May 14 (instrumental)" },
  "brand_new": { "title": "BRAND NEW", "tempo": 144, "key": "G# minor", "mode": 0, "rap_hiphop_confidence": 0.21, "rb_confidence": 0.20, "sexy": 0.27, "energetic": 0.41, "aggressive": 0.34, "_note": "Furthest from Cluster A. Trap/EDM.", "source": "Cyanite PDF May 14 (instrumental)" },
  "keep_going": { "title": "Keep Going", "tempo": 94, "key": "F minor", "mode": 0, "rap_hiphop_confidence": 0.24, "sexy": 0.56, "happy": 0.60, "chill": 0.55, "_note": "Under threshold. Vocals may shift.", "source": "Cyanite PDF May 14 (instrumental)" },
  "need_to_know": { "title": "Need To Know", "tempo": 122, "key": "G# minor", "mode": 0, "rap_hiphop_confidence": 0.40, "rb_confidence": 0.33, "sexy": 0.50, "happy": 0.42, "_note": "Drill/Trap sub-genre.", "source": "Cyanite PDF May 14 (instrumental)" }
}
```

### Add to `freakshowProject`:
```json
"its_a_grind": { "title": "Its A Grind", "tempo": 122, "key": "A major", "mode": 1, "rb_confidence": 0.40, "sexy": 0.66, "chill": 0.68, "romantic": 0.65, "_note": "Major + low R&B. Outside lane.", "source": "Cyanite PDF May 14" },
"all_my_love_138": { "title": "All My Love (138bpm)", "tempo": 138, "key": "C# minor", "mode": 0, "rb_confidence": 0.34, "sexy": 0.61, "uplifting": 0.50, "_note": "Reads Dream Pop/Chillwave. Use Flip OG version.", "source": "Cyanite PDF May 14" },
"coming_down_vocal": { "title": "Coming Down", "tempo": 103, "key": "D minor", "mode": 0, "rb_confidence": 0.68, "sexy": 0.81, "_note": "MOVED to creamCandidates — listed here for Freakshow exclusion tracking", "source": "Cyanite PDF May 14" }
```

Update `_updated` to `"2026-05-14"` and `_note` to reflect 36-track coverage.

---

## FILE 16: `brain/catalog_intelligence_matrix.json`

**Current state:** Contains released catalog + EP tracks + vault waterfall singles. Missing CREAM candidates and extended vault.
**Target state:** Add entries for all 19 newly Cyanite-analyzed tracks with BPM, key, R&B confidence, Sexy score, and Cluster A classification.

Sonnet: Read current file structure, then add entries following existing format for each of the 19 tracks listed in File 15 above. Include `cyanite_cluster_a` field (values: "YES", "STRONG", "BORDER", "NO", "SPECIAL", "INSTRUMENTAL") and `cyanite_date: "2026-05-14"`.

---

## FILES 17-19: Archive-only (no edits, just move)

These are `.BAK` files and old HTML decks. No action needed — they're already marked as historical:
- `scratch/sovereign_scroll.BAK_20260418_post_deploy.html` — already .BAK
- `brain/TURNAROUND_DECK.html` — leave as-is (references are contextual)
- `brain/TURNAROUND_EVALUATION_P2.html` — leave as-is

---

## VERIFICATION CHECKLIST (run after all edits)

```bash
# No remaining May 15 EP references in active code
grep -rn "2026-05-15" scratch/oracle-compass/lib/ --include="*.ts"
# Should return 0 results

# No remaining May 11 upload references in active code
grep -rn "2026-05-11" scratch/oracle-compass/lib/ --include="*.ts"
# Should return 0 results (except maybe in PHASE_MAP historical entries before May 11)

# EP dates match LIVE_STATE
grep -n "EP_RELEASE_DATE" scratch/oracle-compass/lib/releases.ts
# Should show "2026-05-29"

grep -n "EP_UPLOAD_DATE" scratch/oracle-compass/lib/releases.ts
# Should show "2026-05-19"

# ESL date correct
grep -n "East Side Love" scratch/oracle-compass/lib/releases.ts
# Should show releaseDate: "2026-05-08"

# Version bumped
grep -n "RELEASE_DATA_VERSION" scratch/oracle-compass/lib/releases.ts
# Should show 39

# Archives exist
ls brain/archive/SONNET_EP_BOMB_SPEC.md
ls brain/archive/SONNET_WATERFALL_PIVOT_SPEC.md
ls brain/archive/SONNET_STAGGER_AMENDMENT.md

# SOVEREIGN_ACTION_PLAN has superseded note
head -5 brain/SOVEREIGN_ACTION_PLAN_FINAL.md
# Should show ⚠️ SUPERSEDED header
```

---

## COMMIT MESSAGE

```
feat(oracle): Pareto Compound pivot — EP May 29, vault waterfall Jun 12–Aug 7

- releases.ts v39: EP upload May 19, release May 29. Vault singles shifted.
- killList.ts: deadline dates corrected to May 19/May 29
- phaseMap.ts: full rebuild for new dates + Jul 24 CREAM go/no-go
- dayType.ts: phase boundaries updated
- marathon-data.ts: removed DELUXE phase, updated keyEvents
- studioData.ts: timeline + role text updated, CREAM/FREAKSHOW deferred
- context_brief.md: regenerated from CLAUDE.md (May 14 source of truth)
- catalog_intelligence_matrix.json: 5 records updated to May 29
- cream_preprod.md: Jul 10 → Jul 24 go/no-go, Oct/Nov target
- release_strategy.md: upload/release date references corrected
- Archived: SONNET_EP_BOMB_SPEC, WATERFALL_PIVOT_SPEC, STAGGER_AMENDMENT
- SOVEREIGN_ACTION_PLAN: superseded header added (lifestyle sections carry forward)
```
