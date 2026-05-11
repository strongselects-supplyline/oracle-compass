# INTEL LEDGER — Persistent Knowledge System
## Sonnet Execution Spec · May 10, 2026
**Author:** Opus (architecture) 
**For:** Sonnet via Antigravity terminal push
**Baseline:** Current brain/ state

---

## PROBLEM

Ethan feeds hundreds of hours of transcripts across fields (music industry, health, psychology, business strategy, production craft, fitness, neuroscience). Each transcript generates analysis in conversation → findings are derived → conversation compacts → findings evaporate. Next session starts from zero or worse, derives against stale/contradicted context.

Current state of brain/:
- `transcript_gems.md` — 282 lines from 4 podcasts (Mar 30). No updates since.
- `hormozi_leverage_playbook.md` — Applied Hormozi. No cross-reference to other strategy docs.
- `habits_sequencing_transcript.md` — Standalone. No link to health protocols.
- `sovereign_schematic_galloway.md`, `sovereign_schematic_quincy.md` — Standalone.
- UUID session dirs with duplicated/orphaned transcript analysis files.
- War Mode protocols in `e62eb080-*/` — partially overlapping with transcript_gems health section.
- No index. No contradiction tracking. No confidence levels. No "this finding was superseded by X."

**Result:** Every new transcript analysis ignores or contradicts prior work. Gems get re-derived at cost. Contradictions go unnoticed. The knowledge base doesn't compound.

---

## ARCHITECTURE

### New directory: `brain/intel/`

Seven topic ledgers covering all domains Ethan operates in:

```
brain/intel/
├── INTEL_INDEX.md              ← Master index. Quick scan of all ledgers + last updated dates.
├── industry_economics.md       ← Streaming economics, platform mechanics, revenue models, market structure
├── release_strategy.md         ← Release cadence, pitch tactics, editorial pathways, algorithmic triggers
├── audience_psychology.md      ← Who listens, why, retention, superfan dynamics, demographic patterns
├── brand_positioning.md        ← Competitive positioning, aesthetic lane, narrative, visual identity
├── production_craft.md         ← Recording, mixing, mastering, vocal chains, DAW workflows, Cyanite
├── business_operations.md      ← Distribution, rights, compliance, financial planning, infrastructure
├── health_performance.md       ← Body, mind, sobriety, ADHD, supplements, exercise, sleep, therapy
└── mindset_philosophy.md       ← Psychology, ego, motivation, creativity frameworks, spiritual practice
```

### Ledger file format

Every ledger follows this structure:

```markdown
# [TOPIC] — Intel Ledger
<!-- Last updated: YYYY-MM-DD | Entries: N | Sources: N -->

## ACTIVE FINDINGS

### [Finding title]
- **Finding:** [One-line statement of the insight]
- **Detail:** [2-5 lines of supporting detail, practical implication]
- **Source:** [Transcript/document name, speaker, date processed]
- **Confidence:** VERIFIED | STRONG | THEORETICAL | CONTESTED
- **Applied:** [How this has been / should be applied to Ethan's systems]
- **Cross-refs:** [Links to related findings in other ledgers]
- **Last touched:** YYYY-MM-DD

### [Next finding...]

---

## SUPERSEDED / CONTRADICTED

### [Old finding title]
- **Original finding:** [What we believed]
- **Superseded by:** [New finding title + source]
- **Date superseded:** YYYY-MM-DD
- **Note:** [Why the new finding wins — data, authority, direct experience]
```

### Confidence levels defined:
- **VERIFIED** — Confirmed by Ethan's direct experience or measured data (S4A numbers, session results)
- **STRONG** — From authoritative source + logically sound + no contradicting evidence
- **THEORETICAL** — Makes sense but untested in Ethan's context
- **CONTESTED** — Conflicting sources exist; both arguments documented

### Cross-referencing rules:
- When a finding in one ledger reinforces or contradicts a finding in another, both get `Cross-refs` entries
- When a new transcript is processed, the analyst MUST check existing ledgers for overlaps/contradictions before adding new entries
- Contradicted findings move to SUPERSEDED section with attribution, never deleted

---

## EXECUTION PLAN

### Commit 1: Create directory + INTEL_INDEX.md + all 8 empty ledger templates (scaffolding)

Create `brain/intel/` directory. Create `INTEL_INDEX.md`:

```markdown
# Intel Ledger — Master Index
<!-- 
  This is the quick-reference for all processed intelligence.
  Read this to know what exists and when it was last updated.
  Each ledger contains findings, sources, confidence levels, and contradiction tracking.
  
  UPDATE PROTOCOL:
  1. After EVERY transcript analysis → PRESENT change manifest to Ethan for approval
  2. Check existing findings for contradictions before proposing additions
  3. Move contradicted findings to SUPERSEDED section (with Ethan's approval)
  4. Update this index with new entry count + last updated date
  5. NEVER write to ledgers without explicit approval
-->

| Ledger | Entries | Last Updated | Key Sources |
|--------|---------|-------------|-------------|
| [Industry Economics](industry_economics.md) | 0 | — | — |
| [Release Strategy](release_strategy.md) | 0 | — | — |
| [Audience Psychology](audience_psychology.md) | 0 | — | — |
| [Brand Positioning](brand_positioning.md) | 0 | — | — |
| [Production Craft](production_craft.md) | 0 | — | — |
| [Business Operations](business_operations.md) | 0 | — | — |
| [Health & Performance](health_performance.md) | 0 | — | — |
| [Mindset & Philosophy](mindset_philosophy.md) | 0 | — | — |

## Standing Rules
1. Findings are PROCESSED intelligence, not raw quotes. Raw quotes stay in source transcripts.
2. Every finding has a confidence level. VERIFIED > STRONG > THEORETICAL > CONTESTED.
3. Contradicted findings are NEVER deleted — they move to SUPERSEDED with full attribution.
4. Cross-references link related findings across ledgers.
5. The index table entry counts and dates stay current.
```

Create all 8 ledger files with the template structure (ACTIVE FINDINGS + SUPERSEDED sections, empty).

### Commit 2: Seed industry_economics.md from Spotify interview (Brian Johnson, May 10, 2026)

Findings to add (all STRONG confidence — executive source, hard numbers):

1. **No per-stream rate exists** — Stream share of monthly revenue pool. Earnings vary by listener country ARPU, subscription tier, and month.
2. **100,000th artist earns $7,300/year** — 20x increase from $350 in 2015. The economic floor for serious artists is rising.
3. **13,800 artists at $100K+** — Growing ~1,500/year. Middle class expanding.
4. **1/3+ of $10K+ tier are DIY or DIY-origin** — Label system not required for sustainability.
5. **225,000 "emerging professional" artists** — The real denominator, not millions of uploaders.
6. **Spotify = ~1/3 global streaming revenue** — Multiply Spotify earnings by ~3 for total streaming. BUT: for Ethan specifically, Spotify is primary (apply multiplier cautiously).
7. **$1.5B concert ticket sales facilitated, 0% commission** — Platform invests in live discovery. List live dates on S4A for local algorithmic boost.
8. **AI: 75M spammy tracks removed, <1% artificial streams** — Opt-in framework for derivatives. Human artistry is the moat.
9. **Release Radar is guaranteed via pitch tool** — Not editorial. Algorithmic + automatic for existing followers.
10. **Pitch tool context feeds editorial** — "Tell us about the song" = metadata for editorial consideration. Cyanite data = pitch weapon.
11. **1 in 10 at $100K+ started on Fresh Finds** — Editorial pathway for emerging independents. Ethan is Fresh Finds alumni.
12. **Genre growth: Brazilian funk +36%, K-pop +31%, Trap Latino +29%** — Algorithm increasingly genre-precise. Correct tagging critical.

### Commit 3: Seed health_performance.md from transcript_gems.md (4 podcasts, Mar 30)

Migrate the health/supplements/exercise findings from `transcript_gems.md` into structured ledger entries. Keep transcript_gems.md as-is (raw archive). Structured entries go into the ledger with proper confidence levels. Key entries:

- Omega-3 as #1 supplement (STRONG — Dr. Rhonda Patrick)
- Exercise snacks protocol (STRONG — accelerometer data)
- Vigorous exercise multiplier (STRONG — new accelerometer studies)
- Endocrine disruptors list (STRONG — Dr. Patrick)
- Samskar/yoga nidra rewriting (THEORETICAL — needs Ethan's direct experience)
- Shunya meditation (THEORETICAL — untested by Ethan)
- Supplement stack ranked (STRONG — Dr. Patrick)

### Commit 4: Seed mindset_philosophy.md from transcript_gems.md + War Mode docs

Migrate the psychology/ego/motivation findings:

- Avidya → Duka framework (STRONG — Dr. K)
- Charisma architecture ranking (STRONG — Dr. K)
- Tiredness as diagnostic signal (STRONG — Dr. K)
- Pre-fame contamination window (STRONG — Rick Rubin via Dr. K)
- Social media 3-rule protocol (STRONG — Dr. K)
- James Hollis formula (STRONG — Dr. K)
- AI cognitive debt (STRONG — study cited by Dr. Patrick)
- Upstream habits framework (STRONG — habits transcript)
- Antenna effect for creativity (STRONG — habits transcript)
- Cortisol wave timing (STRONG — habits transcript)

Cross-ref the ADHD entries to health_performance.md.

### Commit 5: Seed release_strategy.md from existing brain/ docs

Pull from:
- `ESL_editorial_pitch.md` / `esl_spotify_editorial_pitch.md`
- `all_love_playlist_targeting_matrix.md`
- `spotify_routing_playbook_mar26.md`
- `spotify_popularity_score_trigger_framework.md`
- `per_song_content_playbook_v1.md`

Key entries:
- Popularity score 21 = Release Radar threshold crossed (VERIFIED — S4A data)
- Genre tagging fix: R&B/Alt-R&B, never Pop (VERIFIED — corrected on Amuse)
- Waterfall cadence for algorithmic compounding (STRONG — Johnson interview + S4A observation)
- Pitch tool 7-day advance window (STRONG — Spotify docs + Johnson)
- Fresh Finds alumni status as editorial precedent (VERIFIED — Ethan direct)
- Two Release Radar triggers via stagger (STRONG — architecture decision, untested at scale)

Cross-ref to industry_economics.md for the streaming math.

### Commit 6: Seed audience_psychology.md + brand_positioning.md from BRAND_ARCHITECTURE_V3.md

Pull from v3 architecture + S4A data:
- 60% male 25-34 primary demo (VERIFIED — S4A May 2)
- 76% programmed = algorithm is primary discovery (VERIFIED — S4A)
- 4% monthly active = retention problem (VERIFIED — S4A + Ethan May 10)
- Drake #1 neighbor but Faiyaz gap is real (STRONG — Core Drive analysis)
- Warm/dark bridge model (STRONG — Cyanite + Core Drive)
- Three sonic clusters (STRONG — Cyanite 21-track analysis)
- Save rate 1.2% (VERIFIED — S4A)

### Commit 7: Update INTEL_INDEX.md with actual entry counts + dates

After all seeding commits, update the master index table with real numbers.

### Commit 8: Add intel/ to CLAUDE.md + LIVE_STATE.md priority reads

Add `brain/intel/INTEL_INDEX.md` to CLAUDE.md priority reads (position 3, after LIVE_STATE and CHANGELOG, before catalog matrix).

Add to LIVE_STATE.md under a new KNOWLEDGE BASE section:
```
## KNOWLEDGE BASE (Intel Ledger)
| Ledger | Entries | Last Updated |
| ... | ... | ... |
```

---

## ONGOING PROTOCOL (post-build)

### CRITICAL: Human-in-the-loop. NOTHING writes to ledgers without Ethan's approval.

The ledger system is NOT automated. It is ANALYST-ASSISTED, HUMAN-APPROVED.

### When a new transcript is analyzed:

1. **Process the transcript** — derive findings as normal in conversation
2. **Check existing ledgers** — scan relevant ledgers for overlaps/contradictions
3. **PRESENT A CHANGE MANIFEST** — before writing anything, show Ethan:
   ```
   ## Proposed Intel Ledger Updates
   
   ### NEW FINDINGS (to add):
   - [Ledger] → [Finding title] — [one-liner] (Confidence: X)
   - [Ledger] → [Finding title] — [one-liner] (Confidence: X)
   
   ### REINFORCED (confidence upgrade):
   - [Ledger] → [Existing finding] — upgrading from THEORETICAL → STRONG because [reason]
   
   ### CONTRADICTED (proposed supersede):
   - [Ledger] → [Existing finding] — contradicted by [new finding] because [reason]
     Old: "[what we believed]"
     New: "[what we now know]"
   
   ### CROSS-REFS (new links between ledgers):
   - [Ledger A finding] ←→ [Ledger B finding] — [why linked]
   
   ### NO CHANGES to: catalog_intelligence_matrix.json, Core Drive, Gorilla Geo, releases.ts, pipeline.ts
   ```
4. **Wait for Ethan's approval** — he may accept all, reject some, modify confidence levels, or add context
5. **Write approved changes only** — add findings, move contradicted entries, update cross-refs
6. **Update INTEL_INDEX.md** — entry counts and last updated dates
7. **Update CHANGELOG.md** — append what was added/changed with "Approved by Ethan" note

### When reviewing strategy decisions:

1. **Read relevant ledger(s)** — not the raw transcripts
2. **Check confidence levels** — VERIFIED findings > THEORETICAL
3. **Check SUPERSEDED section** — know what was contradicted and why
4. **Cross-reference** — follow cross-ref links to related domains

### When Ethan provides new direct experience data:

1. **Propose the change** — "Based on your experience with X, I'd upgrade [finding] from THEORETICAL → VERIFIED. Approve?"
2. **Wait for approval** — same as transcript protocol
3. **Write approved change** — upgrade/downgrade/supersede with "Verified by Ethan on [date]: [result]"

### What the ledger system NEVER touches:
- `catalog_intelligence_matrix.json` — per-track Cyanite/S4A/streaming data. Updated separately via refresh-catalog.mjs or manual S4A ingestion.
- `scratch/core-drive-builder/` — Spotify embed scraper, identity-sync, cyanite-fallback.json. Separate pipeline.
- `scratch/gorilla-geo/` — geo targeting pipeline, tier classification. Separate pipeline.
- `lib/releases.ts` — release dates, pipeline state, content deliverables. Updated via Oracle Compass code changes.
- `lib/pipeline.ts` — pipeline phases and steps. Code changes only.
- `LIVE_STATE.md` — numbers and dates. Updated directly when Ethan provides new data, NOT derived from ledger analysis.

The ledger READS from these systems to cite data. It never WRITES to them. Data flows one direction: source systems → ledger. Never ledger → source systems.

---

## WHAT THIS REPLACES

This does NOT replace existing files. Existing transcript analysis files (`transcript_gems.md`, `hormozi_leverage_playbook.md`, etc.) remain as raw archives. The intel ledgers are the PROCESSED, indexed, cross-referenced, contradiction-tracked layer on top.

Think of it as:
- **Raw transcripts / analysis files** = primary sources (keep forever, never edit)
- **Intel ledgers** = secondary sources (processed, maintained, living documents)
- **LIVE_STATE.md** = current numbers and dates (operational state)
- **CHANGELOG.md** = audit trail (what changed when)

Together these four layers ensure nothing evaporates on conversation compaction.

---

## VERIFICATION CHECKLIST

After all commits:
- [ ] `brain/intel/` directory exists with 9 files (index + 8 ledgers)
- [ ] INTEL_INDEX.md table has correct entry counts
- [ ] Every finding has: title, one-liner, detail, source, confidence, applied, cross-refs, last-touched
- [ ] Contradictions from Spotify interview vs older assumptions are in SUPERSEDED sections
- [ ] CLAUDE.md priority reads updated (intel index at position 3)
- [ ] LIVE_STATE.md has KNOWLEDGE BASE section
- [ ] transcript_gems.md is UNTOUCHED (raw archive preserved)
- [ ] No UUID session dir content was deleted (those are archives too)

---

## PARALLELISM MAP

```
Commit 1 (scaffolding) ──────────────────────────────┐
  ├── Commit 2 (industry economics) ──┐               │
  ├── Commit 3 (health performance) ──┤  PARALLEL     │
  ├── Commit 4 (mindset philosophy) ──┤  (all seed    │
  ├── Commit 5 (release strategy) ────┤   from        │
  └── Commit 6 (audience + brand) ────┘   different   │
                                          sources)    │
Commit 7 (index update) ─── depends on 2-6 ──────────┘
Commit 8 (CLAUDE.md + LIVE_STATE) ─── depends on 7
```

Commits 2–6 can be done in parallel or any order. They touch different files with different source material.
