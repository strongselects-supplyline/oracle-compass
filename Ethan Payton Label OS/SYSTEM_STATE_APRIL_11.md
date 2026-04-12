# SOVEREIGN SYSTEM STATE — April 11, 2026

**ATTN: CLAUDE / ANY FUTURE MODEL**
This is the canonical system state document for the Ethan Payton Label OS. Everything here is live and deployed. Read this entire document before responding to any request. Do not be generic. Do not speculate. Reference these files and systems directly.

---

## 0. WHO IS ETHAN PAYTON

- **Artist name:** past.El noir (solo R&B artist, Milwaukee)
- **Label:** past.El noir Records (self-operated, one-man)
- **Genre:** Atmospheric R&B — 40Hz sub-bass architecture, intimate vocals, dark/moody production
- **Distributor:** Amuse (always has been)
- **DAW:** FL Studio
- **Hardware chain:** TLM 103 → VT-737sp → CL 1B → C-Vox → Auto-Tune RT → Studer A800 emulation
- **Age:** 28 (turns 29 June 2026, born June 19, 1997)
- **Income:** DoorDash ($1,800/mo target) + music revenue
- **Sobriety date:** April 2, 2026 (Day 0). THIS IS TRACKED LIVE IN THE APP.
- **Current Rank:** JONIN (first of 6 tiers in the Sovereign Rank System)
- **Next Rank Gate:** ANBU — June 1, 2026 (12 benchmarks, 60-day sobriety requirement)

---

## 1. THE ORACLE COMPASS WEB APP

**Repo:** `github.com/strongselects-supplyline/oracle-compass`
**Local path:** `~/.gemini/antigravity/scratch/oracle-compass/`
**Stack:** Next.js 16.1.6, App Router, TailwindCSS, IndexedDB (lib/db.ts), Google Sheets API, PWA via next-pwa
**Deployed:** Vercel (auto-deploys on push to main)
**Latest commit:** `89a7761` — v2 rank engine (Apr 10, 2026)

### Architecture
```
app/
  page.tsx          — Home dashboard (streaks, daily log, DoorDash, session quality)
  brain/page.tsx    — The Brain: 6 Scrolls, Sovereignty Dashboard, Trajectory, 
                      Waking Mind Protocol, Mixing Codex, Vocal Codex, Mission Statement
  kill/page.tsx     — Kill List (derived task engine, ADHD-first, no stored tasks)
  studio/page.tsx   — Studio session logger
  engine/page.tsx   — Completion analytics
  geo/page.tsx      — Gorilla Geo outreach tracker
  geo/sprint/       — IG Community Sprint Terminal
  grind/page.tsx    — Daily log / sovereignty stack
  label/page.tsx    — AI Label agents (PR, A&R, Marketing, etc.)
  log/page.tsx      — Daily logging
  oracle/page.tsx   — Oracle decree engine
  planner/page.tsx  — Weekly planner
  sonic/page.tsx    — Sonic identity tracker
  velocity/page.tsx — Velocity/momentum metrics

lib/
  sovereignty.ts    — ★ RANK ENGINE (NEW) — All 6 ranks, IndexedDB-backed, benchmarks
  db.ts             — IndexedDB wrapper (DailyLog, StreakData, Telemetry, TaskCompletion)
  killList.ts       — Derived task engine (1712 lines, computes tasks from system state)
  oracle.ts         — Oracle decree system
  releases.ts       — Release pipeline tracker
  studioData.ts     — Project/track definitions (ALL LOVE, CREAM, etc.)
  audienceLedger.ts — Audience CRM for Gorilla Geo
  completionAnalytics.ts — Task completion intelligence
  sheets.ts         — Google Sheets integration
  + 15 more support files

components/
  ThemeProvider.tsx  — Auto/light/dark theme system (localStorage + data-theme attr)
  BottomNav.tsx      — Bottom navigation with theme toggle in "More" menu
  BrainDumpInput.tsx — Cognitive dump module (LLM-powered)
  + others

public/
  reference.html         — Mudra System & Breathwork reference (standalone HTML)
  scroll-body-codex.html — Barrett Body Budget / Body Codex (standalone HTML)
  scroll-rank.html       — The Sovereign Rank Scroll (standalone HTML, all 6 ranks)
  theme-sync.js          — Injects theme into standalone HTML pages (reads localStorage)
```

### Key Systems

**1. Kill List (`lib/killList.ts`)**
- Derives tasks dynamically from system state — nothing stored, everything computed
- ADHD-first design: every task has plain-language howTo[] instructions
- Task categories: Oracle flags, Fuel tracking, Sovereignty Stack, Release checklists, Content Sprint, IG Sprint, S3 Check-in, Vice Management, Movement program, DoorDash
- Content Sprint: 4-phase system counting down to Apr 24 ALL LOVE EP drop

**2. Sovereignty Dashboard (in `app/brain/page.tsx`)**
- Tabs: ⏱ Clock (sobriety counter) | 🎯 ANBU (benchmark checklist) | 📓 Journal (grief log) | 📊 Data (weekly metrics)
- All state persisted to IndexedDB via `lib/sovereignty.ts`
- Auto-migrates from old localStorage keys on first load
- Sobriety clock with RESET button (confirmation dialog, logs previous day count)
- Benchmark tab is DYNAMIC — shows current target rank's benchmarks, auto-labels tab
- PROMOTE button appears when all benchmarks are checked — advances rank in state + trajectory

**3. Rank Engine (`lib/sovereignty.ts`)**
- 6 ranks: JONIN → ANBU → KAGE → S-RANK → LEGENDARY SANNIN → GOD OF SHINOBI
- Each rank has: benchmarks[], targetDate, sobrietyDay requirement, color
- State includes: currentRankIndex, sobrietyStart, sobrietyResets[], benchmarkChecks{}, griefLog[], weeklyDataLog[], promotionLog[], s3Log[]
- Persists to IndexedDB key 'sovereignty_state'

**4. Theme System**
- `ThemeProvider.tsx`: Manages auto/light/dark modes, persists to localStorage ('theme-mode')
- `theme-sync.js`: Injected into standalone HTML files to sync theme across windows
- `globals.css`: Full light/dark CSS variable system with comprehensive overrides
- Toggle button in BottomNav "More" menu (☀️/🌙)

**5. Daily Log (`lib/db.ts`)**
- IndexedDB store 'OracleCompassDB'
- Tracks: sovereigntyStack, movement, sauna, sleep, pushups, fuel (pre/mid/post), hydration, caffeineCutoff, trataka, proteinAtMeals, sessionQuality, sessionType, personalTime, conditioningType, proteinQuality, batchPrepDone

---

## 2. THE 6 SOVEREIGN SCROLLS

These are the canonical reference documents. Accessible from the Brain page's "📜 The 6 Scrolls" grid.

| # | Scroll | Location | What It Contains |
|---|--------|----------|------------------|
| 1 | Waking Mind Protocol | `brain/page.tsx#waking-mind` | S3 metacognitive check-in, Captain's Chair Ignition, Barrett neuroscience integration |
| 2 | Mudras & Breathwork | `/reference.html` | Full mudra system, Nadi Shodhana, breathwork protocols, hand positions |
| 3 | Body Budget (Body Codex) | `/scroll-body-codex.html` | Barrett body budget, sleep/protein/hydration/movement rules, sobriety clock |
| 4 | Rank Scroll | `/scroll-rank.html` | All 6 ranks with benchmarks, training protocols, anti-drift warnings, promotion ceremony |
| 5 | Mixing Codex | `brain/page.tsx#mixing-ladder` | 9-stage mixing architecture, LUFS ladder, SSL 360° workflow, Cyanite targets |
| 6 | Vocal Codex | `brain/page.tsx#vocal-codex` | Bio-diagnostic vocal manual, Pre-Flight Somatic Matrix, emergency protocols |

---

## 3. THE RELEASE PIPELINE

| Release | Type | Date | Status |
|---------|------|------|--------|
| Sweet Frustration | Single | Mar 28, 2026 | LIVE on Spotify |
| East Side Love (ESL) | Single | Apr 14, 2026 | Uploading/uploaded |
| Like I Did | Single | TBD (before Apr 24) | In progress |
| ALL LOVE EP | EP (4 tracks) | Apr 24, 2026 | THE MILESTONE — anchors ANBU gate |
| CREAM | EP | ~June-July 2026 | Pre-production (KAGE gate) |
| FREAKSHOW | EP | ~Oct 2026+ | Conceptual (S-RANK gate) |

**Sonic identity:** "Hearing In Color" — 40Hz sub-bass, atmospheric/cinematic R&B, Cyanite targets: Sexy >0.76, Chill >0.56

---

## 4. THE RANK PROGRESSION

```
JONIN (★ CURRENT — Apr 8, 2026)
  └→ ANBU (June 1, 2026 — 12 benchmarks, 60-day sobriety)
       └→ KAGE (July 5, 2026 — CREAM shipped, 94 days sober)
            └→ S-RANK (Oct 2026 — CREAM data, FREAKSHOW pre-prod)
                 └→ LEGENDARY SANNIN (Apr 2027 — trilogy complete)
                      └→ GOD OF SHINOBI (Dec 2027 — Label OS is curriculum)
```

### ANBU Benchmarks (Current Target — June 1)
1. ALL LOVE EP Released — Apr 24 data logged
2. 3 tracks Live on Spotify — SF, ESL, Like I Did
3. Save Rate 3%+ on at least 1 track
4. Gorilla Geo Activated — 3–5 DMs/day consistent
5. Sobriety Day 60 — clock not reset
6. Content Factory — 3+ assets/week consistent
7. DoorDash $1,800/mo — April confirmed
8. DoorDash $1,800/mo — May confirmed
9. S3 Check-in running every studio day
10. Grief Protocol — first journal entry by Apr 27
11. ALL LOVE Deluxe decision logged by Apr 27
12. Instagram bio updated and verified

---

## 5. LABEL OS REFERENCE DOCUMENTS

Located in `oracle-compass/Ethan Payton Label OS/`:

| File | Purpose |
|------|---------|
| `SOVEREIGN_ACTION_PLAN_FINAL.html` | 90-day execution matrix (Apr 2 – Jul) |
| `WARTIME_RHYTHM_SCHEMATIC_APR7.html` | Daily/weekly rhythm and scheduling |
| `S_RANK_VOCAL_CODEX.html` | Bio-diagnostic vocal manual (replaces $500/hr coach) |
| `SOVEREIGN_RANK_SCROLL.html` | Full rank system (source of truth, also at /scroll-rank.html) |
| `SOVEREIGN_BODY_CODEX.html` | Body budget protocols (also at /scroll-body-codex.html) |
| `SOVEREIGNTY_STACK_MANUAL.html` | Full Sovereignty Stack guide |
| `MUDRA_SYSTEM.html` | Complete mudra reference |
| `FREQUENCY_KEY_MATRIX.html` | Frequency/key targeting for production |
| `FREQUENCY_SCIENCE_SCROLL.html` | Science behind 40Hz architecture |
| `SPOTIFY_ADS_MASTERY.html` | Spotify advertising guide |
| `competitive_analysis_apr4_2026.html` | Market positioning analysis |
| `esl_campaign_brief_apr2026.html` | ESL release campaign brief |
| `TRANSCRIPT_INSIGHTS_EXTRACTION.html` | Mentor transcript codified insights |

---

## 6. DESIGN SYSTEM & PREFERENCES

- **Aesthetic:** "Cream/Gold Brutalism" — light mode: off-white (#f8f6f0), dark charcoal text, emerald (#1e6b4a), gold (#c9a227) accents
- **Dark mode:** High-contrast dark palette, synced across all pages including standalone HTML windows
- **Typography:** System defaults (Georgia for scrolls, sans-serif for app)
- **Principle:** Brutalist, functional, no decoration. Every element serves a purpose.
- **CRITICAL:** Do not attempt to re-write React logic. Only manipulate CSS `--var()` tokens for aesthetic changes. The UI structure is pristine.

---

## 7. KEY TECHNICAL NOTES

1. **IndexedDB is the persistence layer** — not localStorage. `lib/db.ts` wraps IndexedDB with `getStoreValue`/`setStoreValue`. The sovereignty engine, daily logs, streaks, telemetry, and task completion all use this.

2. **The Kill List is derived, not stored** — `lib/killList.ts` computes tasks from system state every time. Clearing a task mutates the underlying data source.

3. **Google Sheets API** is used for journal entries and some data logging (`lib/sheets.ts`). API keys are in `.env.local`.

4. **The `Ethan Payton Label OS/` directory** has strict OS-level permission restrictions. Use `view_file` and `write_to_file` tools rather than terminal commands.

5. **theme-sync.js** is the source of truth for standalone page styling. Any new standalone HTML page must include `<script src="/theme-sync.js"></script>` in the `<head>`.

6. **Vercel auto-deploys** on push to main branch. Build command: `npm run build` (uses `next build --webpack`).

7. **There is a lockfile warning** about multiple lockfiles (scratch/ and oracle-compass/). This is cosmetic — does not affect builds.

---

## 8. CURRENT PRIORITIES (April 11, 2026)

1. **ESL upload + release prep** — East Side Love drops Apr 14 (414 Day / Milwaukee)
2. **Content Sprint Phase 1** — "Its All Love" sip videos, ambient awareness
3. **Like I Did** — needs to be finished and uploaded before Apr 24
4. **ALL LOVE EP** — Apr 24 drop. THE milestone. Everything bends toward this.
5. **DoorDash** — hit $1,800 for April
6. **Grief Journal** — first entry due by Apr 27
7. **Gorilla Geo** — 3-5 DMs/day once content flywheel is running

---

## 9. ANTI-DRIFT PROTOCOLS

These are system-level rules. Do not violate them:

- **Don't rebuild for elegance. Use what exists.** Software phase is open ONLY to unblock active work.
- **Lane 1 before Lane 2.** Community Trace (organic) before Gorilla Geo (outreach).
- **The conscious brain is the press office, not the Oval Office.** When the mind says "pivot" or "this isn't working" — that's the narrative engine, not the signal. Run the S3 check-in.
- **Builder-Avoidance is neurochemical.** The resistance to building new infrastructure is a real dopamine gap. Acknowledge it. Don't fight it. Execute the existing system.
- **Quality creates a floor and ceiling. Within that range, pure randomness.** You can't control luck. You control surface area — how many times luck can touch you.
- **The data is the judge.** Not feelings, not hunches. Pull numbers every Sunday.

---

## 10. CONVERSATION THREADS (Last 3 Days)

For full context on decisions made, reference these conversation IDs:

1. `827d54f7` — Deployed 6 Scrolls + light/dark theme + Sovereignty Dashboard v2 + Rank Engine (THIS CONVERSATION)
2. `41a078bb` — Improving Sovereign Schematic readability
3. `05a76d7f` — Managing burnout and momentum (48-hour recovery schematic, body budget)
4. `7c15210f` — Reference Library deployment, cream/gold aesthetic, dark-mode fail-safe
5. `99f1b186` — Defining Sovereign Naruto Hierarchy (rank system formalization)
6. `46da0523` — Integrating transcript into Sovereign System (vocal codex upgrade)
7. `e3186fad` — Finalizing Sovereign System deployments (Waking Mind + Mixing Codex)
8. `ccfbcf84` — Neuroscience for Sovereign Systems (Barrett body budget integration)
9. `c628f8f9` — Building 90-Day Sovereign Schematic

---

**END OF SYSTEM STATE**

*Last updated: April 11, 2026, 09:13 CDT*
*Updated by: Antigravity (conversation 827d54f7)*
