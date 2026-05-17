# SONNET AGENT & SKILL REBUILD SPEC — May 17, 2026
## Verified by Opus. Every change specified to line-level. No drift.

---

## EXECUTIVE SUMMARY

**What exists:** 10 agents (`.claude/agents/`), 5 skills (Label OS `.claude/skills/`), 2 slash commands (`.claude/commands/`).

**What's wrong:**
1. **Doctrine is stale** — references "May 15" dates, doesn't reflect May 21 upload shift or EP bomb → waterfall structure changes.
2. **Skills have no tools layer** — all 5 skills are prompt-only (instructions without scripts/reference files). This is the biggest leverage gap.
3. **Two agents need updates** — `data-analyst` and `streaming-strategy` reference outdated workflows.
4. **Missing skills** — DM blitz drafting, S4A pitch writing, compliance packet prep, and weekly data synthesis have no skills despite being repetitive AI tasks.
5. **No feedback loop** — skills don't improve between sessions (Rule 4 gap).

**What NOT to do:**
- Do NOT rebuild the agent architecture. Charter template, doctrine layer, roundtable patterns, CoS routing — all solid.
- Do NOT create new agents. 10 is already at the ceiling for token efficiency.
- Do NOT touch slash commands (`/mirror`, `/standup`). They work.

---

## PART 1: DOCTRINE UPDATE

**File:** `.claude/agents/_DOCTRINE.md`

### Change 1: Update Section 4 (Three Phases)

**OLD (lines 44-48):**
```
| 1 — EP SPRINT | Apr 6 → May 29 | ALL LOVE EP (5-track). Recording sprint May 15-18. Upload May 19. EP drops May 29. |
```

**NEW:**
```
| 1 — EP SPRINT | Apr 6 → May 29 | ALL LOVE EP (5-track). Recording sprint May 15-18. Upload Wed May 21 night. EP drops Thu May 29. |
```

### Change 2: Update Section 5 (Active Catalog)

**OLD (lines 53-57):**
```
- **Green Light** — uploading May 19, drops May 29 (EP track 1)
- **Sweet Frustration** — uploading May 19, drops May 29 (EP track 2)
- **Want U 2** — uploading May 19, drops May 29 (EP-exclusive track 5)
- **ALL LOVE EP** — 5 tracks, uploading May 19, global release May 29
```

**NEW:**
```
- **Green Light** — uploading May 21, drops May 29 (EP track 1)
- **Sweet Frustration** — uploading May 21, drops May 29 (EP track 2, editorial pitch target: KAYTRANADA lane)
- **Want U 2** — uploading May 21, drops May 29 (EP-exclusive track 5)
- **ALL LOVE EP** — 5 tracks, uploading May 21, global release May 29
```

### Change 3: Add Section 11 (Skill Improvement Protocol)

**APPEND after line 108 (end of file, before the closing italic line):**

```markdown
## 11. Skill improvement protocol

After every skill invocation that produces output Ethan corrects or refines:
1. Identify whether the correction is one-time or permanent.
2. If permanent: update the skill's instructions or reference files immediately.
3. Log the change in the skill's CHANGELOG section (add one if it doesn't exist).
4. Never let the same correction happen twice across sessions.

Skills are composable — each skill should do ONE thing well. If a skill grows past 100 lines, it's doing two jobs. Split it.

Skills have three layers: description (when to trigger), instructions (how to execute), tools (scripts/reference files). The tools layer is where leverage lives — invest there, not in longer prompts.
```

---

## PART 2: AGENT UPDATES (2 agents)

### Agent 1: `data-analyst.md`

**What's stale:** This agent was created Apr 19 when the catalog had different numbers and workflows.

**Find and update the "Owns" section** to include:
```markdown
## Owns

- Catalog refresh execution (run `brain/refresh-catalog.mjs`)
- Weekly data pull synthesis (S4A screenshots → structured insights)
- Popularity score tracking via Music Stax fallback when Spotify Dev mode blocks
- Save rate computation and gap-to-threshold reporting
- Content performance tracking: which post types drive profile visits → follows → streams
- Cross-referencing streaming data with content data to identify what converts (not just what gets views)
```

**Add to "Anti-drift" section:**
```
- Save rate is the primary metric. Everything else is context for save rate.
- Track followers-per-1000-views and engagement rate on content, not just reach.
- The videos that get the most views aren't always the ones that convert. Track conversion, not vanity.
```

### Agent 2: `streaming-strategy.md`

**Find and update references to upload dates.** Any mention of "May 19" should become "May 21". Any mention of EP dropping "May 15" (from old plan) should be "May 29".

**Add to "Owns" section:**
```
- Post-EP vault waterfall cadence management (ILG Jun 12 → LID Jun 26 → WI Jul 10 → JSS Jul 24 → RCN Aug 7)
- Each vault single gets its own Release Radar trigger — this is the strategic reason for the waterfall
```

---

## PART 3: SKILL UPGRADES — ADD TOOLS LAYER (5 existing skills)

This is the highest-leverage work. Every existing skill is prompt-only. Adding tools (scripts + reference files) makes them deterministic where possible, cheaper to run, and more consistent.

### Skill 1: `catalog-refresh/SKILL.md`

**Add a tools directory:** Create `catalog-refresh/tools/` with:

**File: `catalog-refresh/tools/quick-check.sh`**
```bash
#!/bin/bash
# Quick catalog freshness check — run before any data-dependent decision
MATRIX="brain/catalog_intelligence_matrix.json"
if [ ! -f "$MATRIX" ]; then
  echo "ERROR: catalog_intelligence_matrix.json not found"
  exit 1
fi
SNAPSHOT=$(grep -o '"snapshot_date":"[^"]*"' "$MATRIX" | head -1 | cut -d'"' -f4)
echo "Last catalog refresh: $SNAPSHOT"
DAYS_OLD=$(( ($(date +%s) - $(date -d "$SNAPSHOT" +%s 2>/dev/null || date -j -f "%Y-%m-%d" "$SNAPSHOT" +%s)) / 86400 ))
echo "Days since last refresh: $DAYS_OLD"
if [ "$DAYS_OLD" -gt 14 ]; then
  echo "WARNING: Catalog is stale (>14 days). Run: node brain/refresh-catalog.mjs"
fi
```

**Add to SKILL.md instructions:**
```markdown
## Tools

### Quick freshness check
Before any data-dependent answer, run:
```bash
bash .claude/skills/catalog-refresh/tools/quick-check.sh
```
If stale (>14 days), run the full refresh before proceeding.
```

### Skill 2: `curator-pitch/SKILL.md`

**Add a tools directory:** Create `curator-pitch/tools/` with:

**File: `curator-pitch/tools/pitch-data.sh`**
```bash
#!/bin/bash
# Extract pitch-relevant data for a track from the catalog matrix
TRACK="$1"
if [ -z "$TRACK" ]; then
  echo "Usage: pitch-data.sh <track-slug>"
  echo "Examples: see-me, east-side-love, green-light, sweet-frustration, want-u-2"
  exit 1
fi
MATRIX="brain/catalog_intelligence_matrix.json"
echo "=== PITCH DATA FOR: $TRACK ==="
# Use node to parse JSON reliably
node -e "
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('$MATRIX', 'utf8'));
const tracks = data.tracks || data.catalog?.tracks || [];
const track = Array.isArray(tracks) ? tracks.find(t => t.slug === '$TRACK' || t.title?.toLowerCase().includes('$TRACK'.replace(/-/g,' '))) : null;
if (!track) { console.log('Track not found. Available:', tracks.map(t=>t.slug||t.title).join(', ')); process.exit(1); }
console.log('Title:', track.title);
console.log('BPM:', track.audio?.bpm || track.cyanite?.bpm || 'unknown');
console.log('Key:', track.audio?.key || track.cyanite?.key || 'unknown');
console.log('Mode:', track.audio?.mode || track.cyanite?.mode || 'unknown');
console.log('R&B score:', track.cyanite?.genre_tags?.rnb || track.audio?.rnb || 'unknown');
console.log('Sexy score:', track.cyanite?.mood_tags?.sexy || track.audio?.sexy || 'unknown');
console.log('Chill score:', track.cyanite?.mood_tags?.chill || track.audio?.chill || 'unknown');
console.log('Comparable artists:', JSON.stringify(track.core_drive?.top_neighbors || track.comparable_artists || []));
console.log('Lane:', track.lane || track.cluster || 'unknown');
console.log('Editorial targets:', JSON.stringify(track.editorial_targets || []));
"
```

**Add reference file: `curator-pitch/tools/CURATOR_TARGETS.md`**
```markdown
# Curator Target Reference

## Editorial Playlists by Lane
### Cluster A (TrapSoul / Dark R&B)
- Are & Be, TrapSoul, Late Night R&B, Chill R&B, Bedroom Pop
- Curators: Spotify editorial team (submit via S4A only)

### Cluster B (Smooth / Romantic)  
- Smooth R&B, Love Pop, Romance, Mood Booster
- Curators: Spotify editorial + independent

### Sweet Frustration (Genre Outlier)
- Dance & R&B, Electronic Rising, Mood Booster, KAYTRANADA lane
- DIFFERENT curator set than TrapSoul tracks — flag explicitly

## Independent Curator Platforms
- SubmitHub: $1-3 per submission, 48hr response
- Groover: $2 per submission, guaranteed feedback
- PlaylistPush: campaign-based, $150+ minimum

## French R&B Market Note
Strong for TrapSoul tracks. Mention in Groover submissions for ESL and LID.
```

**Update SKILL.md** to reference both tools:
```markdown
## Tools

### Auto-extract pitch data
Before writing any pitch, run:
```bash
bash .claude/skills/curator-pitch/tools/pitch-data.sh <track-slug>
```
This pulls BPM, key, mood scores, comparable artists, and lane assignment from the catalog matrix. Use these numbers directly — never guess or approximate.

### Curator target reference
Read `.claude/skills/curator-pitch/tools/CURATOR_TARGETS.md` for playlist targets by lane and platform-specific submission notes.
```

### Skill 3: `content-sprint/SKILL.md`

**Add reference file: `content-sprint/tools/SPRINT_CALENDAR.md`**
```markdown
# Content Sprint Calendar Reference

## Canonical release dates (from releases.ts v40)
| Track | Upload | Release | Sprint window |
|-------|--------|---------|---------------|
| ALL LOVE EP | May 21 | May 29 | May 22-29 |
| I Like Girls | ~Jun 5 | Jun 12 | Jun 5-12 |
| Like I Did | ~Jun 19 | Jun 26 | Jun 19-26 |
| Worth It | ~Jul 3 | Jul 10 | Jul 3-10 |
| Just Say So | ~Jul 17 | Jul 24 | Jul 17-24 |
| Reconnect | ~Jul 31 | Aug 7 | Jul 31-Aug 7 |

## Content ratio per sprint (from brand architecture)
- 70% music-first content (snippets, visuals, world-building, Milwaukee aesthetic)
- 30% builder/artist journey (studio process, behind-the-scenes)
- Never lead listener-facing content with the operator narrative

## Jutsu template for ALL LOVE
- Deep Emerald / Gold / Navy palette
- Film grain overlay
- Georgia font
- Command: `--jutsu all-love`

## Post types mapped to pipeline days
| Sprint Day | Post Type | Content Pillar |
|-----------|-----------|---------------|
| T-7 | Batch shoot | — (creation day) |
| T-6 | AI processes footage | — (prep day) |
| T-5 | Teaser (mystery, no title) | Cinematic Visual |
| T-3 | World-build (2AM drive, Milwaukee) | World-Building |
| T-1 | Announce (cover art + date + pre-save) | The Release |
| T-0 | DROP DAY multi-post sequence | The Release + Talk to 'Em |
```

**Update SKILL.md** to add:
```markdown
## Tools

### Sprint calendar reference
Read `.claude/skills/content-sprint/tools/SPRINT_CALENDAR.md` for canonical dates, content ratio rules, and post-type mapping. Never guess dates — they change; this file is the reference.

### Jutsu template check
Before generating any visual content spec, verify the active jutsu template:
- ALL LOVE: `--jutsu all-love` (Deep Emerald / Gold / Navy, film grain, Georgia)
- Post-EP singles may get different templates — check with Ethan before assuming
```

### Skill 4: `release-checklist/SKILL.md`

**Update lines referencing "Registration Monday"** — compliance happens THURSDAY after release, not Monday. This is wrong in the current skill.

**Find:**
```
### Phase 4: Registration Monday (3 days post-release)
```
**Replace with:**
```
### Phase 4: Compliance Thursday (Thursday after release)
```

**Find:**
```
## DAY 8 (Release Day — Friday)
```
Note: releases are on THURSDAYS (May 29 is a Thursday), not Fridays. Update all day-of-week references.

**Add reference file: `release-checklist/tools/COMPLIANCE_CHECKLIST.md`**
```markdown
# Compliance Registration Checklist

## Timing
Compliance happens the THURSDAY AFTER release day. Never before release.
Total time: 45-60 minutes.

## Registration Order (most important first)
1. **ASCAP** — Work registration. Need: title, ISRC, writers, publishers (Distance Over Time)
2. **MLC** — Mechanical licensing. Need: title, ISRC, HFA song code if available
3. **Songtrust** — Verify admin active. Need: title, ISRC
4. **SoundExchange** — Verify track registered. Need: title, ISRC, label (past.El noir Records)
5. **Musixmatch** — Lyrics submission. Need: lyrics text, Spotify URI

## Data needed from Amuse
- ISRC (copy from Amuse dashboard after release goes live)
- UPC (for EP/album registrations)

## Standing rule
Do NOT attempt compliance before release day. ISRCs aren't final until Amuse confirms distribution.
```

### Skill 5: `handoff-generator/SKILL.md`

This skill is solid as-is. One addition:

**Append to Instructions section:**
```markdown
6. Update `brain/LIVE_STATE.md` with any numbers or dates that changed during the session.
7. Update `brain/CHANGELOG.md` with an append-only entry for what changed and when.
8. If any skill was corrected during the session, update that skill's instructions per the Skill Improvement Protocol (Doctrine §11).
```

---

## PART 4: NEW SKILLS (3)

### New Skill 1: `dm-blitz/SKILL.md`

**Create:** `.claude/skills/dm-blitz/SKILL.md`

```markdown
---
name: DM Blitz Drafter
description: Draft personalized DM messages for release day blitz across Core 50, Warm 100, and Cold 50 tiers. Use when user says "DM blitz", "draft DMs", or "release day messages".
---

# DM Blitz Drafter

## When to Use
When Ethan says "DM blitz for [Track]", "draft DMs", or needs release-day direct messages prepared.

## Instructions

1. **Identify the track** from the request.
2. **Load track data** from `brain/catalog_intelligence_matrix.json`.
3. **Generate 3 tiers of DMs:**

### Tier 1: Core 50 (Most Personal)
These are Ethan's closest supporters. Messages should feel like a personal text, not marketing.

Template:
```
hey [name] — new one just dropped. [1 sentence about what this track means to him]. would mean a lot if you gave it a spin + saved it. [spotify link]
```

Rules:
- First name only
- Lowercase, conversational
- Reference something specific about the relationship if possible
- ONE call to action: stream + save
- No hashtags, no "check it out!", no corporate language

### Tier 2: Warm 100 (Engaged Followers)
People who've engaged with content but aren't inner circle.

Template:
```
hey — just dropped [Track Title]. [1 sentence hook from the track's sonic identity]. here if you want to check it: [spotify link]
```

Rules:
- Slightly less personal but still human
- Use a hook that creates curiosity about the music
- ONE link, no multiple CTAs
- Can reference their engagement ("saw you vibing with [previous track]")

### Tier 3: Cold 50 (Strategic Outreach)
Curators, peers, micro-influencers, music bloggers.

Template:
```
hey [name] — I'm an R&B artist out of Milwaukee. just dropped [Track Title] — [BPM] BPM, [key], think [comparable artist 1] meets [comparable artist 2]. thought it might fit your vibe. [spotify link]
```

Rules:
- Include credibility marker (Milwaukee, catalog size, or specific comparable)
- Reference THEIR work/playlist/content specifically
- Professional but not corporate
- No "I'd love if you could..." — just present the work

## Output Format
Generate all 200 messages as a markdown file with three sections. Ethan reviews, edits, and sends manually (🔴 Human-execute).

## Critical Rules
- Genre is R&B / Alt-R&B. NEVER say Pop.
- Comparable artists come from catalog matrix, not guesses.
- Messages must pass the "would I send this to a friend" test.
- No emojis unless Ethan specifically uses them in that relationship.
- DM blitz happens on release day (T-0), not before.
```

### New Skill 2: `s4a-pitch/SKILL.md`

**Create:** `.claude/skills/s4a-pitch/SKILL.md`

```markdown
---
name: S4A Editorial Pitch Writer
description: Write the Spotify for Artists editorial pitch for a track. ONE SHOT — cannot re-pitch. Use when user says "S4A pitch", "editorial pitch", "Spotify pitch", or asks about pitching to Spotify playlists.
---

# S4A Editorial Pitch Writer

## When to Use
When Ethan says "write S4A pitch for [Track]", "editorial pitch", or needs to submit a Spotify for Artists pitch.

## CRITICAL WARNING
**S4A editorial pitch is ONE SHOT. You cannot re-pitch a track.** This must be reviewed by Ethan before submission. Classification: 🟡 AI-prep + Human-execute.

## Instructions

1. **Identify the track.**
2. **Load track data:**
   - `brain/catalog_intelligence_matrix.json` for audio profile + Cyanite mood scores
   - Core Drive synthesis if available (`brain/core-drives/core-drive-[track].json`)
3. **Generate the 500-character pitch** (S4A limit is 500 chars).

## Pitch Structure (500 chars max)

```
[Track Title] is [genre descriptor] at [BPM] BPM in [key]. [One sentence on sonic identity using Cyanite data — mood scores, instrumentation, vibe]. [One sentence positioning — what editorial playlist this fits and why]. [One sentence on artist momentum — recent releases, save rate, growing catalog].
```

## Reference: What works in S4A pitches
- Mention specific playlists by name (Are & Be, TrapSoul, Late Night R&B)
- Include hard data: BPM, key, mood descriptors
- Reference comparable artists Spotify already playlists
- Mention any notable streaming milestones (Hollywood Fever 3.4M+)
- Keep it factual — curators read hundreds of these

## Reference: What doesn't work
- Sob stories or personal narrative (save for interviews)
- "This is my best work yet" (everyone says this)
- Mentioning streams you can't verify
- Genre-tagging as Pop (Ethan is R&B / Alt-R&B, always)

## Sweet Frustration Special Case
SF is a genre outlier — House-R&B / KAYTRANADA lane. Pitch targets:
- Dance & R&B, Electronic Rising, Mood Booster
- NOT the same playlist targets as TrapSoul tracks
- Mention KAYTRANADA, Disclosure, Channel Tres as comparables

## Output Format
Return EXACTLY the 500-char pitch text, a character count, and a checklist:
- [ ] Pitch text (500 chars max): [text]
- [ ] Character count: [N]/500
- [ ] Target playlists mentioned: [list]
- [ ] Ethan has reviewed and approved: [ ]
- [ ] Submit via S4A dashboard: [ ] (🔴 Human-execute)

## Critical Rules
- 500 characters MAXIMUM. Count them.
- ONE SHOT — Ethan must approve before submitting.
- 7+ days before release or the pitch is wasted.
- Never claim unverified stream counts.
```

### New Skill 3: `weekly-data-synthesis/SKILL.md`

**Create:** `.claude/skills/weekly-data-synthesis/SKILL.md`

```markdown
---
name: Weekly Data Synthesis
description: Process Ethan's Sunday S4A screenshots and Music Stax checks into structured insights and decisions. Use when user says "Sunday data", "process screenshots", "weekly numbers", or provides S4A screenshots.
---

# Weekly Data Synthesis

## When to Use
When Ethan provides Sunday S4A screenshots, says "Sunday data", "process my numbers", or asks for weekly streaming analysis.

## Instructions

1. **Receive screenshots** from Ethan (S4A Overview, Audience, Song tabs).
2. **Load current state** from `brain/LIVE_STATE.md`.
3. **Extract and compare:**
   - Monthly listeners (vs. last week)
   - Followers (vs. last week)
   - Per-track streams (vs. last week)
   - Save rate per track (saves / streams)
   - Top cities
   - Audience demographics shifts
4. **Check Music Stax** for popularity scores: `musicstax.com/artist/past-el`
5. **Generate the synthesis** using format below.

## Output Format

```markdown
# WEEKLY DATA — [Date]

## Headline numbers
| Metric | This week | Last week | Delta |
|--------|-----------|-----------|-------|
| Monthly listeners | X | Y | +/-Z |
| Followers | X | Y | +/-Z |
| Artist popularity | X | Y | +/-Z |

## Per-track performance
| Track | 7d streams | Save rate | Popularity | Trend |
|-------|-----------|-----------|------------|-------|
| [Track] | X | X% | X | up/down/flat |

## Decision triggers
- [ ] Any track save rate > 3%? → Discovery Mode eligible
- [ ] Any reel sends/reach > 3%? → Meta boost eligible ($50)
- [ ] Any track save rate declining 2+ weeks? → Content pivot needed
- [ ] Cost-per-stream > $0.10 on any active ad? → KILL the ad

## What to do this week
1. [Action based on data]
2. [Action based on data]
3. [Action based on data]
```

6. **Update `brain/LIVE_STATE.md`** with new numbers.
7. **Append to `brain/CHANGELOG.md`**: `[Date] — Weekly data pull: [headline change]`.

## Critical Rules
- Never fabricate numbers. If screenshots don't show a metric, mark it "not visible".
- Save rate is THE metric. Everything else is context.
- Decision triggers are binary — they either fire or they don't. No "maybe".
- If a track is dying (declining saves 2+ weeks), say so. Don't soften it.
- Content performance matters: note which posts drove profile visits if visible in screenshots.
```

---

## PART 5: FILE STRUCTURE AFTER ALL CHANGES

```
.claude/
  agents/
    _DOCTRINE.md           ← UPDATED (upload date, skill protocol)
    _ROUNDTABLE.md         ← NO CHANGE
    _CHARTER_TEMPLATE.md   ← NO CHANGE
    _FIRST_RUN.md          ← NO CHANGE
    README.md              ← UPDATE skills section below
    chief-of-staff.md      ← NO CHANGE
    ar-catalog.md          ← NO CHANGE
    marketing-director.md  ← NO CHANGE
    creative-director.md   ← NO CHANGE
    streaming-strategy.md  ← UPDATED (dates, waterfall)
    community-manager.md   ← NO CHANGE
    finance-cfo.md         ← NO CHANGE
    performance-coach.md   ← NO CHANGE
    data-analyst.md        ← UPDATED (content tracking, conversion)
    body-health-coach.md   ← NO CHANGE
  commands/
    mirror.md              ← NO CHANGE
    standup.md             ← NO CHANGE

scratch/oracle-compass/Ethan Payton Label OS/.claude/
  skills/
    catalog-refresh/
      SKILL.md             ← UPDATED (tools reference)
      tools/
        quick-check.sh     ← NEW
    content-sprint/
      SKILL.md             ← UPDATED (tools reference)
      tools/
        SPRINT_CALENDAR.md ← NEW
    curator-pitch/
      SKILL.md             ← UPDATED (tools reference)
      tools/
        pitch-data.sh      ← NEW
        CURATOR_TARGETS.md ← NEW
    handoff-generator/
      SKILL.md             ← UPDATED (LIVE_STATE + CHANGELOG step)
    release-checklist/
      SKILL.md             ← UPDATED (Thursday not Monday, tools reference)
      tools/
        COMPLIANCE_CHECKLIST.md ← NEW
    dm-blitz/              ← NEW SKILL
      SKILL.md
    s4a-pitch/             ← NEW SKILL
      SKILL.md
    weekly-data-synthesis/  ← NEW SKILL
      SKILL.md
```

---

## PART 6: README UPDATE

**File:** `.claude/agents/README.md`

**Append after line 88 (before closing italic):**

```markdown
## Skills (in Label OS `.claude/skills/`)

Skills are composable task-completion units with three layers: description, instructions, tools. They live in the Label OS workspace, not the agents directory.

### Existing (upgraded with tools layer)
- `catalog-refresh` — Run Spotify API refresh + staleness check
- `content-sprint` — Generate 8-day content sprint checklist with calendar reference
- `curator-pitch` — Generate playlist curator pitches with auto-extracted track data
- `handoff-generator` — Session handoff document with LIVE_STATE/CHANGELOG update
- `release-checklist` — Full release lifecycle checklist with compliance reference

### New (May 17, 2026)
- `dm-blitz` — Draft 200 personalized DMs across Core 50 / Warm 100 / Cold 50 tiers
- `s4a-pitch` — Write the ONE-SHOT S4A editorial pitch (500 chars, 🟡 human-execute)
- `weekly-data-synthesis` — Process Sunday S4A screenshots into structured decisions

### Skill improvement protocol
After every skill use where output is corrected: update the skill permanently. See Doctrine §11.
```

---

## EXECUTION ORDER FOR SONNET

1. **Doctrine update** (Part 1) — 3 changes to `_DOCTRINE.md`
2. **Agent updates** (Part 2) — 2 agents, targeted section edits only
3. **Existing skill upgrades** (Part 3) — add tools directories and reference files to 5 skills
4. **New skills** (Part 4) — create 3 new skill directories with SKILL.md files
5. **README update** (Part 6) — append skills section

**Verification after all changes:**
```bash
# Check all new files exist
ls -la .claude/skills/dm-blitz/SKILL.md
ls -la .claude/skills/s4a-pitch/SKILL.md
ls -la .claude/skills/weekly-data-synthesis/SKILL.md
ls -la .claude/skills/catalog-refresh/tools/quick-check.sh
ls -la .claude/skills/curator-pitch/tools/pitch-data.sh
ls -la .claude/skills/curator-pitch/tools/CURATOR_TARGETS.md
ls -la .claude/skills/content-sprint/tools/SPRINT_CALENDAR.md
ls -la .claude/skills/release-checklist/tools/COMPLIANCE_CHECKLIST.md

# Check doctrine has new section 11
grep "Skill improvement protocol" .claude/agents/_DOCTRINE.md

# Check upload date corrected
grep "May 21" .claude/agents/_DOCTRINE.md

# Check compliance is Thursday not Monday
grep "Thursday" .claude/skills/release-checklist/SKILL.md
```

**Git:**
```bash
git add -A
git commit -m "feat: upgrade 5 skills with tools layer, add 3 new skills (dm-blitz, s4a-pitch, weekly-data), update doctrine + 2 agents"
git push
```

---

## DO NOT

- Rebuild agent architecture (it's solid)
- Create new agents (10 is the ceiling)
- Touch slash commands (they work)
- Add Supabase, cloud sync, or new infrastructure
- Change any release dates (those come from releases.ts)
- Touch the Oracle Compass codebase (separate spec handles that)
- Build a "dynamic skill engine" or any meta-system — just write the files
