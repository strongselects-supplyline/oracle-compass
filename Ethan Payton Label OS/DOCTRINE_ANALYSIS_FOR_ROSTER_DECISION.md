# DOCTRINE ANALYSIS — What Oracle's Scrolls Reveal About the Agent Roster
## Before You Approve: What I Found When I Read Everything
### May 15, 2026

**Context:** You said "ingest and analyze entirely before I make any approval decision." I read all 988 lines of `doctrineContent.tsx` (14 doctrine pages), every agent charter, `phaseMap.ts`, `releases.ts`, `killList.ts`, `_DOCTRINE.md`, and `departments_index.md`. This is what I found.

---

## 1. STALE CONTENT IN THE DOCTRINES — What's Wrong Right Now

The scrolls wired into Oracle contain operational logic that Ethan opens and acts on. Some of it is **dangerously stale** — it will tell you to do things that don't apply anymore.

### CRITICAL (will cause wrong decisions if read today)

**RoadmapPage (lines 68-95 of doctrineContent.tsx):**
- Says "Thu May 15 — ALL LOVE EP drops (ICEMAN day)"
- Says "Wed May 20 — ALBUM DROPS"
- Says "Fri Jun 19 — DELUXE DROPS"
- **Reality:** EP drops May 29. Album concept retired. Deluxe concept retired. This page is 100% wrong.

**WartimePage — Phase 3 definition:**
- Says Phase 3 starts "Jun 1" with CREAM as the launch cycle
- References "Jul 10" as CREAM decision date
- **Reality:** CREAM tracklist lock is Jul 24. CREAM pre-production is August at earliest. Phase 3 framing needs updating.

**_DOCTRINE.md (agent shared doctrine) — §4 The Three Phases:**
- Phase 1 says "ALL LOVE EP drops Apr 24"
- Phase 2 says "Apr 25 → May 31"
- Phase 3 says "Jun 1 → Jul 5 — CREAM launch cycle"
- **Reality:** EP drops May 29. Phase 1 should run through May 29 + compound. CREAM isn't launching in the Jun 1–Jul 5 window — that's the vault waterfall. Every agent reading this doctrine file gets wrong phase context.

**_DOCTRINE.md — §5 Active Catalog:**
- Lists Sweet Frustration as "live since Apr 10" and East Side Love as "live since Apr 14"
- Lists ALL LOVE EP as "drops Apr 24"
- **Reality:** SF not yet uploaded. ESL dropped May 8. EP drops May 29. Every agent reading this gets wrong catalog state.

**RankScrollPage — Jonin→Anbu benchmarks:**
- References "Jun 20 — EP complete" and "3 waterfall singles"
- **Reality:** EP drops May 29, not Jun 20. There are 5 vault waterfall singles, not 3.

**SpotifyAdsPage — Budget Ladder:**
- References "Album Launch ($250)" as a tier
- **Reality:** Album concept retired. Budget ladder should reference EP + vault waterfall.

### MODERATE (outdated but won't cause immediate harm)

**ProtocolPage — Sobriety Phase Timeline:**
- "Week 1 Apr 17-24" labeled "THE HONEYMOON"
- Dates are stale by ~3 weeks. The phases are still conceptually valid (Honeymoon → Flatline → Emotions Return → Compounding) but the date anchors are off.
- Apr 2 sobriety restart → today is day 43. That's solidly in "Emotions Return" phase (weeks 5-12), not the dates shown.

**phaseMap.ts header comment:**
- Says "APR 29 EP BOMB PIVOT" with old waterfall order (LID May 30, ILG Jun 13)
- **Reality:** ILG Jun 12 → LID Jun 26 (reordered May 14). The DATA entries in phaseMap are correct locally — just the header comment is stale.

**WartimePage — "Mystique Protocol" reveal/protect table:**
- Solid concept (what to reveal vs. protect publicly). Content is evergreen. No update needed.

**WartimePage — Daily Architecture:**
- DoorDash blocks, caffeine cutoff, sleep protocol. All still valid. No update needed.

---

## 2. WHAT THE DOCTRINES ENCODE THAT THE ROSTER MISSED

The 14 scrolls contain deep operational logic. The agent roster proposal treated them as "content pages" without accounting for the fact that they're **execution systems** Ethan acts on daily. Here's what matters:

### A. The Sovereignty Stack Is a 10-Practice Daily System (SovereigntyStackPage)

The Sovereignty Stack isn't philosophical — it's a literal 10-step checklist:
1. Jnana Mudra + OM (60 sec)
2. Nadi Shodhana (5 min)
3. S3 Check-In (somatic/state/story)
4. Kill List Scan
5. Pre-Flight Somatic Matrix (body scan before studio)
6. Post-Session Cool-Down
7. Barrett Body Budget Rules
8. Lower Chain Activation
9. Upper Chain Posture Reset
10. 30-Min Movement Block

**What the roster missed:** The `morning-standup` skill (#11 in the roster) only proposes "Pull Kill List + LIVE_STATE + one mindset prompt." It should incorporate practices 1-4 of the Sovereignty Stack as the warm-up layer. The Performance Coach agent should enforce practices 5-6 (pre/post studio). Body/Health Coach should own practices 7-10.

**Recommendation:** The morning-standup skill needs the Sovereignty Stack baked in, not as optional. The 90-second exit signal from ADHD protocol should cap it. "Here are your 4 morning practices (2 min), here are your top 3 Kill List items (30 sec), here's your mindset frame (20 sec). Go."

### B. The Mixing Codex Is an 18-Day Batch Production Engine (MixingPage)

This isn't just mixing tips. It's a complete production scheduling system:
- 18-Day Batch = 6 tracks × 3 days each
- 3-Hour Studio Block structure (warm-up → work → cool-down)
- 9-stage mixing protocol (gain staging → compression → EQ → saturation → spatial → automation → master chain)
- Cyanite verification targets (Sexy >0.76, Chill >0.56, Happy >0.49)
- Bus architecture: DRUMS / BASS / LEAD VOX / BG VOX / INSTRUMENTS / FX
- Hardware chain: TLM 103 → VT-737sp → CL 1B → C-Vox → Auto-Tune RT → Studer A800

**What the roster missed:** No agent or skill accounts for production scheduling. The recording sprint calendar (May 15-18) was built ad hoc. The Mixing Codex already defines the batch structure — a `production-scheduler` skill could derive sprint calendars from it automatically.

**Recommendation:** Add a `production-scheduler` skill that takes the number of tracks + available days and outputs a Mixing Codex-compliant sprint calendar. Not high priority (manual works), but it's a natural extract from existing doctrine. Phase 2.

### C. The Visual Bible Already Has a 7-Stage Pipeline (VisualBiblePage)

The Bedroom ILM pipeline is already defined:
1. **Capture** (iPhone 15 Pro Max, 4K60 ProRes, natural/practical lighting)
2. **Mask** (DaVinci Resolve Magic Mask → isolate subject)
3. **Generate Background** (Higgsfield Cinema Studio 2.5 → AI background)
4. **Composite** (DaVinci Fusion → layer subject on AI background)
5. **Relight** (SwitchLight Pro → consistent lighting)
6. **Grade + Grain** (Dehancer Pro → film stock emulation, grain, halation)
7. **Multiply** (9 exports: IG 1080×1350, Story 1080×1920, TikTok, YouTube, Spotify Canvas, etc.)

**What the roster missed:** Joey's banana-pro-director and cinema-worldbuilder don't replace this pipeline — they UPGRADE stages 3-5. The `past-el-image-director` skill should be framed as a Stage 3 replacement (Generate Background), and the `past-el-cinema-director` skill should target Stage 3-4 (Generate + Composite for video). The roster treats them as standalone new capabilities when they're actually pipeline upgrades.

**Recommendation:** Reframe both skills as "Bedroom ILM Stage 3-5 upgrades" in their documentation. The Creative Director agent's AI review protocol should reference the full 7-stage pipeline, not just the AI generation step. The pipeline context ensures the output gets graded (Stage 6) and multiplied (Stage 7) properly.

### D. The Mudra System Is a State-Diagnosis Protocol (MudraPage)

5 states → 5 response protocols:
- **Lethargy** → Prana Mudra + Breath of Fire + upward gaze
- **Lust** → Yoni Mudra + Ocean Breath + downward gaze (energy redirect)
- **Fear** → Abhaya Mudra + 4-7-8 breathing + horizon gaze
- **Rage** → Shuni Mudra + alternate nostril + soft gaze
- **Flow** → Dhyana Mudra + natural breath + maintain

**What the roster missed:** The Performance Coach agent's charter doesn't reference the Mudra System at all. The Huberman/Fujita "neural warm-up" finding maps directly to the Lethargy protocol. The "abstinence monitoring" maps to the Lust protocol (substance craving = energy that needs redirecting). The Performance Coach should have Mudra System as a canonical read and use it as a diagnostic tool.

**Recommendation:** Add `GLOBAL_BRAIN/` or doctrine reference for Mudra System to Performance Coach's canonical reads. When Performance Coach detects low state, it should prescribe the matching mudra protocol, not generic advice.

### E. The Spotify Ads Scroll Has a Complete Campaign System (SpotifyAdsPage)

This isn't "run some ads." It's a fully spec'd system:
- Auction mode + $18/day minimum
- Audio CPM: $8.43-$9.38 (verified)
- Streams delivery goal (most efficient; requires linking artist content first)
- Targeting: US, 18-34, R&B/Soul interests, 6LACK/Tiller/PND fan bases
- Budget Ladder: $50 EP / $250 Album (needs updating to EP + waterfall)
- 30-second ad script template with actual structure
- KPIs: CPM, completion rate, CTR, new listener rate
- Waterfall integration rules

**What the roster missed:** The roster proposes merging Streaming Strategy into Marketing Director. The Spotify Ads doctrine is deep enough that the merged Marketing Director needs it as a canonical read — it's not intuitive knowledge. The `editorial-pitch` skill should also reference the Spotify Ads targeting fields (they share audience data logic).

**Recommendation:** When Marketing Director absorbs Streaming Strategy, its canonical reads must include the SpotifyAds doctrine content. The skill docs for editorial-pitch and any future ad-campaign skill should cross-reference the same targeting logic.

### F. The War Room Is Physical Infrastructure Design (WarRoomPage)

Six structural failures in Ethan's physical space → Four Zones proposal:
- **Zone A:** Recording (vocal booth area, acoustic treatment)
- **Zone B:** Mixing (monitor position, desk setup)
- **Zone C:** Movement (floor space for pelvic floor work, dance)
- **Zone D:** Rest (deliberate separation from screens)

Plus a lighting system (warm during creation, cool during analysis) and a 3-weekend build plan.

**What the roster missed:** Body/Health Coach references vocal tension and pre-recording warm-up, but doesn't reference the War Room spatial design. The Zone system matters because physical environment affects somatic state (which the Body/Health Coach is supposed to manage). If Ethan is mixing in Zone A instead of Zone B, his body position is wrong.

**Recommendation:** Add War Room as a canonical read for Body/Health Coach. Not because it needs to design rooms, but because its somatic recommendations should be zone-aware.

### G. The Frequency Key Maps Brainwave States to Production (FrequencyPage)

Solfeggio frequencies mapped to production phases:
- 396 Hz (Root) → bass design, kick selection
- 528 Hz (Heart) → melody, chord voicings
- 741 Hz (Throat) → vocal processing
- Binaural beats: Theta (4-8 Hz) for songwriting, Alpha (8-12 Hz) for mixing, Beta (12-30 Hz) for editing

**What the roster missed:** This is esoteric but it's IN the app. If Ethan opens Oracle and reads the Frequency Key, then asks the Creative Director about a mixing decision, the Creative Director has no context on what Ethan just read. This is an edge case — not worth restructuring for — but the doctrine layer should at minimum be in the agent's canonical reads path.

**Recommendation:** No roster change needed. Just noting that the doctrine pages create a context layer that agents should be aware of even if they don't directly use it.

---

## 3. THE _DOCTRINE.md FILE IS THE BIGGEST PROBLEM

Every agent loads `_DOCTRINE.md` first. It's their shared reality. Right now it says:

- EP drops Apr 24 (wrong — May 29)
- Phase 1 ends Apr 24 (wrong — May 29 at earliest)
- Phase 3 is "CREAM launch cycle Jun 1 → Jul 5" (wrong — that's vault waterfall)
- Active catalog lists 4 tracks as live that aren't all live yet
- Canonical commit reference is 8cfee69 (stale — current baseline is 56ba9d1)

**This means:** If you approved the roster tomorrow and we built all 6 agents, every single one would load incorrect phase context, incorrect catalog state, and incorrect release dates on first invocation. The agents would give bad advice from the jump.

**Before approving the roster, _DOCTRINE.md must be updated.** This is not optional. It's the foundation every agent reads.

---

## 4. WHAT SHOULD CHANGE IN THE ROSTER BASED ON THIS ANALYSIS

### Changes to proposed agents:

| Agent | Doctrine-Informed Change |
|-------|------------------------|
| **Chief of Staff** | Canonical reads must include LIVE_STATE.md (anti-compaction) + CHANGELOG.md + PER_RELEASE_PIPELINE.md. _DOCTRINE.md §4 phases must be rewritten to current reality. |
| **Creative Director** | AI review protocol must reference the full 7-stage Bedroom ILM pipeline (VisualBiblePage), not just "review the prompt." Stage context ensures proper grading + multiplication. |
| **Marketing Director** | When absorbing Streaming Strategy, must add SpotifyAds doctrine as canonical read. Budget Ladder must be updated (no Album tier). |
| **Performance Coach** | Must add Mudra System + Sovereignty Stack (practices 5-6) as canonical reads. Huberman/Fujita findings should map to existing mudra states, not replace them. |
| **Body/Health Coach** | Must add War Room (Zone system) + Sovereignty Stack (practices 7-10) as canonical reads. Somatic recommendations should be zone-aware. |
| **A&R / Catalog** | No doctrine-driven changes needed. Catalog data is correctly sourced from LIVE_STATE + catalog_intelligence_matrix.json. |

### Changes to proposed skills:

| Skill | Doctrine-Informed Change |
|-------|------------------------|
| **morning-standup** | Must incorporate Sovereignty Stack practices 1-4 as the warm-up layer, not just Kill List + mindset. 90-sec exit signal caps the whole thing. |
| **past-el-image-director** | Reframe as "Bedroom ILM Stage 3 upgrade." Output feeds into Stage 4 (Composite) → Stage 6 (Grade) → Stage 7 (Multiply). Document the pipeline context. |
| **past-el-cinema-director** | Reframe as "Bedroom ILM Stage 3-5 upgrade for video." Same pipeline framing. |
| **editorial-pitch** | Cross-reference SpotifyAds targeting logic (audience fields overlap). |

### New skill consideration:

| Potential Skill | Source | Priority |
|----------------|--------|----------|
| **production-scheduler** | Mixing Codex 18-Day Batch Engine | LOW (Phase 2) — manual sprint calendars work, but doctrine already defines the template |

### Stale doctrine that MUST be fixed regardless of roster decision:

1. **_DOCTRINE.md** — Rewrite §4 (phases), §5 (active catalog), §9.7 (commit reference)
2. **doctrineContent.tsx RoadmapPage** — Complete rewrite with correct dates + retire Album/Deluxe references
3. **doctrineContent.tsx WartimePage** — Update Phase 3 definition + CREAM date
4. **doctrineContent.tsx RankScrollPage** — Update benchmarks (EP date, waterfall count)
5. **doctrineContent.tsx SpotifyAdsPage** — Update Budget Ladder (remove Album tier)
6. **doctrineContent.tsx ProtocolPage** — Update sobriety date anchors

---

## 5. SEPARATE ISSUE: ORACLE VERCEL DEPLOYMENT

Your phone shows "ALL LOVE EP DROPS" for May 15. That's the deployed Vercel build running old code. The LOCAL repo at `/Users/ethanpayton/Desktop/oracle-compass-full/` has the correct May 29 dates in `releases.ts` and `phaseMap.ts`. What's needed:

1. `git add . && git commit -m "fix: correct all dates to May 29 EP drop"` in the Oracle repo
2. `git push origin main`
3. Vercel auto-deploys from main — the live site updates within ~60 seconds

This is independent of the roster decision. It should happen regardless — the app is currently lying to you.

**However:** The stale doctrine content in `doctrineContent.tsx` (Section 1 above) means even after a push, the RoadmapPage will still show wrong dates unless those lines are also fixed in the same commit.

---

## BOTTOM LINE

The roster design (6 agents, 12 skills) is **structurally sound** but has 6 specific gaps revealed by the doctrine analysis. The bigger problem is that `_DOCTRINE.md` — the file every agent reads first — is factually wrong on dates, phases, and catalog state. Fix the doctrine foundation first, then approve the roster with the adjustments above.

**Recommended sequence:**
1. Fix `_DOCTRINE.md` (phases, catalog, commit ref) — required regardless
2. Fix `doctrineContent.tsx` stale pages (RoadmapPage, etc.) — required regardless  
3. Push to Vercel — required regardless
4. Approve roster with doctrine-informed adjustments from §4 above
5. Build skills in priority order from the matrix

The doctrine fixes (#1-3) are not blocked by your approval. They're maintenance. The roster (#4-5) is blocked by your review of this analysis.

---

*Your call, Ethan. Read this, mark it up, tell me what's wrong. The roster doesn't move until you say go.*
