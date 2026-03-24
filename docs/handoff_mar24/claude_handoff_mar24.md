# Claude Handoff: Full Context Update — March 24, 2026
**Project:** Oracle Compass (Label OS) & Core Drive Builder Pipeline
**Remote:** `oracle-compass` on GitHub (auto-deploys to Vercel)

---

## 1. System State

### Oracle Compass OS
- **EP Model:** 4-track ALL LOVE EP. IndexedDB consolidated to single `compass_store`. Version 18 (forces re-seed).
- **Health Check:** `/api/health` — Node runtime (not Edge). Verifies env var presence.
- **Oracle Engine:** `/api/oracle/route.ts` — accepts both `ANTHROPIC_API_KEY` and `ANTHROPIC_API_KEY_ORACLE` env vars. JSON parse safety with explicit 502 logging.
- **Label OS Routes:** All 6 agent routes (`marketing`, `anr`, `creative`, `pr`, `ops`, `guardian`) have JSON parse try/catch. `ops/route.ts` was rebuilt after it imported the deleted `registry.ts`.
- **Content Factory:** `ContentFactoryAsset` types were scaffolded but lost in a commit — need re-addition when UI work begins.
- **DoorDash Telemetry:** Both Home page and Log page sync to `DailyTelemetry`.

### Vercel Env Vars (verified)
| Variable | Status |
|---|---|
| `ANTHROPIC_API_KEY` (or `_ORACLE`) | ✅ Set |
| `GOOGLE_SHEET_ID` | ✅ Set |
| `GOOGLE_PRIVATE_KEY` | ✅ Set |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | ✅ Set |

### brandVoice.ts (v4)
`references.sonic` is now a structured object with:
- `permanentAnchors`: Drake, Bryson Tiller, PARTYNEXTDOOR, The Weeknd (3+ analyses)
- `recurring`: 7 artists across 2+ analyses
- `perTrack`: lane classification + BPM for each EP single
- Flywheel philosophy (Global 2% / US 20%) embedded as first-class field

### releases.ts (v18)
All 4 EP singles have `coreDriveComplete: true` and `campaignKitGenerated: true`. Kill List no longer generates redundant Core Drive tasks.

---

## 2. Core Drive Analyses Complete

| Track | Tracks Processed | Primary Anchors | Lane |
|---|---|---|---|
| **SEE ME** | 1,534 | Bryson Tiller, Drake, PND | Dark TrapSoul / OVO |
| **East Side Love** | 1,221 | Bryson Tiller, Chris Brown, 6LACK | Classic R&B Crossover |
| **WORTH IT** | 1,373 | Summer Walker, T-Pain, Ty Dolla $ign | Modern TrapSoul Bounce |
| **Sweet Frustration** | 1,134 | KAYTRANADA, GoldLink, Syd | House-R&B / Electronic Soul |

**Total: 5,912 tracks across 72+ playlists.**

---

## 3. Dynamic Identity-Sync Pipeline (NEW)

A fully automated post-processor (`core-drive-builder/identity-sync.mjs`) now runs after every Core Drive Matrix build. It supports **three analytical lenses**:

1. **Per-Release** — Individual track sonic pocket (campaign kits)
2. **Per-Project** — Project-level identity (e.g., ALL LOVE EP vs future albums)
3. **Overall Artist** — Cross-project identity (Ethan Payton holistic)

### Usage:
```bash
# Run matrix + auto-sync identity:
node index.mjs --input input/track.txt --track "Track Name" --sync --project "ALL LOVE EP"

# Run identity sync standalone:
node identity-sync.mjs --project "ALL LOVE EP"

# Future project:
node identity-sync.mjs --project "DELUXE"
```

### Outputs:
- `output/SONIC_IDENTITY_MAP.md` — Living framework with all 3 lenses (auto-syncs to oracle-compass)
- `output/brandVoice.patch.json` — Structured data for updating `brandVoice.ts`
- `output/track_registry.json` — Maps each analysis to its project
- `output/projects/<project>/identity.json` — Per-project computed identity

### Latest Run (v4):
- 52 permanent anchors (3+ analyses)
- 73 recurring overlaps (2+ analyses)
- All 4 EP tracks tagged to "ALL LOVE EP" project

---

## 4. Shared Files (docs/handoff_mar24/)

All files are in `oracle-compass/docs/handoff_mar24/` on `main`:

| File | Purpose |
|---|---|
| `SONIC_IDENTITY_MAP.md` | Auto-generated 3-lens identity framework |
| `see_me_campaign_kit.md` | SEE ME campaign strategy |
| `esl_campaign_kit.md` | East Side Love campaign strategy |
| `worth_it_campaign_kit.md` | WORTH IT campaign strategy |
| `sweet_frustration_campaign_kit.md` | Sweet Frustration campaign strategy |
| `*_core_drive.md` | Raw matrix data (4 files) |
| `claude_handoff_mar24.md` | This document |
| `deodorant_concept.md` | Brand incubation — premium natural deodorant |

---

## 5. Precedent for Cross-Platform Operations

To reduce friction between Antigravity and Claude sessions:
1. **All shared documents live in `oracle-compass/docs/`** — both platforms read from the same GitHub repo
2. **Code changes must always be `git add -A && git commit && git push`** before switching platforms
3. **Identity sync runs automatically** with `--sync` flag — no manual cross-release computation needed
4. **`brandVoice.patch.json`** is the machine-readable bridge — Claude can read it to update `brandVoice.ts` without re-analyzing raw data
5. **`track_registry.json`** tracks which analyses belong to which project — future projects auto-separate
