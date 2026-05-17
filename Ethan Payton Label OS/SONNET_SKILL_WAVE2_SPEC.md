# SONNET SKILL WAVE 2 SPEC — May 17, 2026
## 9 New Skills. Verified by Opus. Corrections applied. Tools layers added.

---

## CONTEXT FOR SONNET

You are creating skills for the Label OS Claude Code workspace.

**Skill directory:** `.claude/skills/` (inside the `Ethan Payton Label OS` project root)
**These are LOCAL files — no git push needed. They work the moment they're on disk.**

### What already shipped (Wave 1 — commit a1796f8):
```
.claude/skills/
├── catalog-refresh/     (SKILL.md + tools/quick-check.sh)
├── content-sprint/      (SKILL.md + tools/SPRINT_CALENDAR.md)
├── curator-pitch/       (SKILL.md + tools/CURATOR_TARGETS.md + tools/pitch-data.sh)
├── dm-blitz/            (SKILL.md)
├── handoff-generator/   (SKILL.md)
├── release-checklist/   (SKILL.md + tools/COMPLIANCE_CHECKLIST.md)
├── s4a-pitch/           (SKILL.md)
└── weekly-data-synthesis/ (SKILL.md)
```

### What this spec adds (Wave 2 — 9 new skills):
```
.claude/skills/
├── trigger-evaluator/   (SKILL.md + tools/TRIGGER_THRESHOLDS.md)
├── sync-one-sheet/      (SKILL.md + tools/SYNC_CATALOG_TEMPLATE.md)
├── compliance-packet/   (SKILL.md + tools/REGISTRATION_FIELDS.md)
├── caption-writer/      (SKILL.md + tools/CAPTION_EXAMPLES.md)
├── meta-ads-builder/    (SKILL.md + tools/AD_SET_TEMPLATE.md)
├── community-trace/     (SKILL.md + tools/TIER_TARGETS.md)
├── sync-master-checklist/ (SKILL.md)
├── apg-data-package/    (SKILL.md + tools/APG_GO_CRITERIA.md)
└── setlist-builder/     (SKILL.md + tools/ENERGY_ARC.md)
```

### Reference docs (read BEFORE writing skills that cite them):
- `MARKETING_PAID_STRATEGY.md` — trigger criteria §5, Meta Ads §4, budget rules
- `REVENUE_BUSINESS_ROADMAP.md` — sync §3, compliance §Registration Checklist, live §5
- `SOCIAL_COMMUNITY_PLAN.md` — Community Trace §2, tier lists
- `CONTENT_VISUAL_PLAYBOOK.md` — Talk to 'Em formula, caption doctrine §Caption Doctrine
- `SPOTIFY_GROWTH_STRATEGY.md` — algorithmic thresholds §III, APG activation

All paths are relative to the `Ethan Payton Label OS/` project root.

---

## OPUS CORRECTIONS TO ANTIGRAVITY'S SPEC

These are accuracy issues Opus found. Apply them when building each skill.

### Correction 1: `sync-one-sheet` — Missing data sources
Antigravity's spec sources only from `brain/catalog_intelligence_matrix.json`. It should ALSO source from:
- `brain/BRAND_ARCHITECTURE_V3.md` — Cyanite mood/energy scores and Core Drive neighbors
- The one-sheet header claims "3.4M+ all-time streams (Hollywood Fever)" — this is a legacy number from the old catalog. Current verified numbers are in `brain/LIVE_STATE.md`. Use whatever LIVE_STATE says; do NOT hardcode 3.4M.

### Correction 2: `compliance-packet` — Musixmatch lyrics are 🔴 Human-execute
The Musixmatch step requires pasting full lyrics. The skill should clearly mark this as:
`🔴 HUMAN-EXECUTE: Paste your lyrics into Musixmatch. Claude cannot access your lyric sheets.`

### Correction 3: `apg-data-package` — Go criteria source
The go criteria thresholds (popularity 30+, save rate 3%+, ML 40K+, etc.) come from `SPOTIFY_GROWTH_STRATEGY.md` §III and `brain/TURNAROUND_EVALUATION_MAY2026.md` §V.E. Cross-reference both when building the skill. The thresholds may evolve — that's why they go in `tools/APG_GO_CRITERIA.md` (updatable without editing SKILL.md).

### Correction 4: Source doc stale dates
`MARKETING_PAID_STRATEGY.md` §6 has "ALL LOVE EP May 23" and "Like I Did May 30" — these dates are STALE. Current dates: EP May 29, LID Jun 26. The skill specs themselves don't hardcode release dates (they reference calendar/catalog data), so this doesn't affect skills. But do NOT copy stale dates from the source doc into any skill.

---

## CROSS-SKILL DEPENDENCIES (Wire these into descriptions)

```
trigger-evaluator ──→ meta-ads-builder (Meta GO required before building campaign)
catalog-refresh   ──→ sync-one-sheet (fresh catalog data required)
catalog-refresh   ──→ apg-data-package (fresh catalog data required)
release-checklist ──→ compliance-packet (release must happen first)
sync-one-sheet    ──→ sync-master-checklist (one-sheet identifies what's missing)
```

---

## SKILL 1: `trigger-evaluator` — 🔴 BUILD NOW

**Priority:** Highest. EP data starts flowing May 29. Ethan needs this before first ad spend decision.

**Create:** `trigger-evaluator/SKILL.md`

```markdown
---
name: Paid Spend Trigger Evaluator
description: Given this week's data, evaluate ALL trigger criteria for Meta Ads, Marquee, Showcase, and Discovery Mode. Returns binary go/no-go for each channel with budget check. Use when user says "should I spend", "trigger check", "evaluate triggers", "can I run ads", or provides weekly performance data.
---

# Paid Spend Trigger Evaluator

## When to Use
When Ethan provides weekly performance data and asks whether to spend money on any paid channel. Also run proactively during weekly-data-synthesis if data is available.

## Dependency
This skill must run BEFORE meta-ads-builder. Never build a Meta campaign without a trigger evaluation first.

## Instructions

1. **Collect inputs** (ask if not provided):
   - Best reel sends-per-reach (%) — from IG Insights
   - Best reel watch-through rate (%) — from IG Insights
   - Track save rate (7-day, per track) — from Spotify for Artists
   - Daily stream velocity (per track) — from S4A
   - Monthly DoorDash income this month — from Ethan
   - Any playlist adds this week — from S4A

2. **Evaluate each channel against thresholds** from `tools/TRIGGER_THRESHOLDS.md`

3. **Output format:**

## TRIGGER EVALUATION — [Date]

### Meta Ads: [GO / NO-GO]
- Sends-per-reach: [X]% → [FIRES / DOES NOT FIRE] (threshold: ≥ 3%)
- Reasoning: [one line]
- If GO: promote [specific reel] with $[amount]

### Marquee: [GO / NO-GO]
- Stream velocity: [X]/day → [FIRES / DOES NOT FIRE] (threshold: 100+/day)
- If GO: $100 targeting Previously Engaged

### Discovery Mode: [GO / NO-GO]
- Save rate: [X]% on [track] → [FIRES / DOES NOT FIRE] (threshold: ≥ 3%)
- If GO: activate on [track name]

### Showcase: [GO / NO-GO]
- Week-over-week growth: [X]% → [FIRES / DOES NOT FIRE] (threshold: +50% WoW)

### Budget Check: [PASS / FAIL]
- DoorDash this month: $[X] → 15% cap = $[Y] max spend
- Total proposed spend: $[Z]
- Headroom: $[Y - Z]

### VERDICT: Spend $[total] on [channels]. Kill [channels]. Next eval: [date].

## Critical Rules
- Triggers are BINARY. They fire or they don't. No "maybe" or "borderline."
- Never recommend spending on a track with <2% save rate after 7 days.
- Never exceed 15% of monthly income on marketing.
- Cost-per-stream above $0.10 on any active campaign = KILL immediately.
- DoorDash below $1,800 target this month = HARD STOP on all paid spend.
- Emotional impulse with no data backing = HARD STOP. No exceptions.
```

**Create:** `trigger-evaluator/tools/TRIGGER_THRESHOLDS.md`

```markdown
# Trigger Thresholds — Last verified May 17, 2026
# Source: MARKETING_PAID_STRATEGY.md §5

## Meta Ads Triggers
| Trigger | Metric | Threshold | Action |
|---------|--------|-----------|--------|
| Organic reel overperforms | Sends-per-reach | ≥ 3% (1.5x average) | Promote that reel with $50 test |
| Profile visits spike | Profile visits | 2x weekly average | Promote best recent reel |
| Release week (Day 3+) | Calendar | Active release | $50 test on best snippet |
| TikTok video pops | Views | 10K+ (5x average) | Promote similar on IG |

## Spotify Campaign Kit Triggers
| Trigger | Metric | Threshold | Action |
|---------|--------|-----------|--------|
| Strong release start | Day 3 stream velocity | 100+ streams/day | Marquee $100 (Previously Engaged) |
| Save rate confirms quality | 7-day save rate | ≥ 3% | Discovery Mode on that track |
| Weekly stream increase | WoW streams | +50% | Showcase $100 |
| Playlist add | Playlist followers | 1K+ follower playlist | Discovery Mode immediately |
| Combined signal | Save ≥ 3% AND velocity 100+ | Both simultaneously | Marquee + Discovery Mode |

## NEVER SPEND Conditions (any one = hard stop on ALL channels)
- Save rate below 2% after 7 days
- No organic content above 2% sends-per-reach
- DoorDash hasn't hit $1,800 monthly target
- Emotional impulse with no data backing

## Budget Rules
- Monthly marketing cap: 15% of monthly income
- Per-campaign cap: $50 test → scale only if CPC < $0.50 AND cost-per-stream < $0.10
- Total May–Jul range: $200–750 (depends on trigger frequency)

## Update Protocol
Update this file when thresholds change. SKILL.md references this file so thresholds stay current without editing the skill itself.
```

---

## SKILL 2: `sync-one-sheet` — 🟡 BUILD FOR JUNE

**Priority:** High leverage. Activates sync revenue stream ($500–$5,000 per placement).

**Create:** `sync-one-sheet/SKILL.md`

```markdown
---
name: Sync One-Sheet Generator
description: Generate a sync licensing one-sheet for a single track or the full catalog. Pulls BPM, key, mood, neighbors from catalog data. Use when user says "sync one-sheet", "sync pitch", "prepare for sync", "licensing setup", or asks about sync platforms.
---

# Sync One-Sheet Generator

## When to Use
When Ethan needs to submit tracks to sync platforms (Songtradr, Musicbed, Music Gateway) or pitch to sync supervisors.

## Data Sources (load in order)
1. `brain/catalog_intelligence_matrix.json` — BPM, key, duration, genre scores
2. `brain/BRAND_ARCHITECTURE_V3.md` — Cyanite mood/energy scores, Core Drive neighbors
3. `brain/LIVE_STATE.md` — current streaming numbers (do NOT hardcode old numbers)
4. `tools/SYNC_CATALOG_TEMPLATE.md` — output format template

## Instructions

1. **Load track data** from sources above.
2. **If single track:** Generate one entry using per-track format.
3. **If full catalog:** Generate all tracks with one-sheet header.
4. **Flag missing deliverables:** If instrumental, stems, or sync master (-14 LUFS) don't exist yet, flag them clearly.

## Per-Track Format
```
TRACK: [Title]
Artist: past.El (Ethan Payton)
Label: past.El noir Records
Publisher: Distance Over Time (ASCAP)

BPM: [from catalog] | Key: [from catalog] | Duration: [from catalog]
Genre: R&B / Alt-R&B
Mood Tags: [from Cyanite — e.g., Sexy 0.73, Chill 0.56, Romantic 0.45]
Core Drive Neighbors: [top 3 from BRAND_ARCHITECTURE_V3]

SYNC SUITABILITY:
- Ideal placement: [e.g., "Late-night driving scene, romantic montage, lifestyle brand"]
- Comparable sync'd artists: [from Core Drive neighbors who have sync placements]
- Instrumental available: [YES/NO — flag if NO]
- Stems available: [YES/NO — flag if NO]
- Sync master (-14 LUFS): [YES/NO — flag if NO]

ISRC: [from Amuse — ask Ethan if not in catalog]
```

## One-Sheet Header (for full catalog)
```
PAST.EL — SYNC CATALOG
Contact: strongselects@gmail.com
Distributor: Amuse
Publisher: Distance Over Time (ASCAP)
Writer: Ethan Payton (ASCAP)
Catalog: [N] tracks | R&B, Alt-R&B, TrapSoul
Notable: Fresh Finds alumni | [current all-time streams from LIVE_STATE] all-time
Full ownership: Masters + Publishing (no clearance needed, no samples)
```

## Critical Rules
- Genre is R&B / Alt-R&B. NEVER say Pop.
- Streaming masters are -9 to -11 LUFS. Sync masters must be -14 LUFS / -1dB True Peak. Always flag the difference.
- Full ownership is the #1 selling point. Lead with it.
- Always mention Fresh Finds and Hollywood Fever — credibility markers.
- Pull streaming numbers from LIVE_STATE.md, never hardcode.
- If instrumental or stems don't exist, output includes: "⚠️ ACTION NEEDED: [what to bounce]"
```

**Create:** `sync-one-sheet/tools/SYNC_CATALOG_TEMPLATE.md`

```markdown
# Sync Catalog Assessment Template
# Source: REVENUE_BUSINESS_ROADMAP.md §3

## Sync-Friendly Ranking Criteria
| Factor | Weight | Notes |
|--------|--------|-------|
| Mood clarity (single dominant mood) | HIGH | Supervisors search by mood |
| Instrumental availability | HIGH | Many placements need instrumental-only |
| Clean vocals (no features/samples) | HIGH | No clearance = instant green light |
| BPM range (90-120 sweet spot) | MEDIUM | Mid-tempo fits more scenes |
| Duration (2:30-3:30 ideal) | MEDIUM | Standard TV/ad slot lengths |

## Platform Registration Targets
| Platform | Type | Cost | Best For |
|----------|------|------|----------|
| Songtradr | Marketplace + AI matching | Free tier | Volume placements, micro-sync |
| Musicbed | Curated, premium | $99/year | Film/TV, higher per-placement |
| Music Gateway | Marketplace | Free tier | Gaming sync ($1.91B market 2026) |
| Freelance sync agent | Representative | 15-25% commission | Premium placements (at 50K+ ML) |

## Timeline
- June: Write sync one-sheet. Register Songtradr + Musicbed. Upload catalog.
- July: Add EP tracks. Submit to Music Gateway gaming briefs.
- Aug-Sep: Follow up. Pitch supervisors directly if traction.
- Oct-Dec: Expect first placement responses.
```

---

## SKILL 3: `compliance-packet` — 🟡 BUILD FOR JUNE

**Priority:** High. 7 releases in 14 weeks = 7 compliance runs. Currently 45-60 min manual per track.

**Create:** `compliance-packet/SKILL.md`

```markdown
---
name: Compliance Registration Packet
description: Generate pre-filled registration fields for ASCAP, MLC, Songtrust, SoundExchange, and Musixmatch for a newly released track. Use when user says "compliance", "register [track]", "ASCAP registration", "registration packet", or on the Thursday after any release day.
---

# Compliance Registration Packet

## When to Use
The THURSDAY after any release. Never before release day (ISRCs aren't final until Amuse confirms delivery).

## Dependency
Requires: release-checklist Phase 3 (release day) to be complete first.

## Instructions

1. **Identify the track** from the request or from the current release calendar.
2. **Get ISRC** — 🔴 HUMAN-EXECUTE: Ethan pulls ISRC from Amuse dashboard.
3. **Load track data** from `brain/catalog_intelligence_matrix.json`.
4. **Generate the packet** using `tools/REGISTRATION_FIELDS.md` template.
5. **Output as ordered checklist** — Ethan works through platforms in order (ASCAP → MLC → Songtrust → SoundExchange → Musixmatch).

## Pre-filled Constants (never change without Ethan's explicit instruction)
- Publisher: Distance Over Time
- PRO: ASCAP
- Label: past.El noir Records
- Distributor: Amuse
- Writer: Ethan Payton
- Writer Share: 50%
- Publisher Share: 50%
- Territory: Worldwide

## Critical Rules
- Compliance happens THURSDAY after release. Not Monday. Not before release.
- Never guess ISRCs — they must come from the live Amuse dashboard.
- Musixmatch lyrics step is 🔴 HUMAN-EXECUTE (paste own lyrics).
- Target time: 45-60 minutes for all 5 platforms.
- Rights infrastructure is COMPLETE (Distance Over Time, ASCAP, Songtrust, SoundExchange, IP lawyer). This is maintenance, not setup.
```

**Create:** `compliance-packet/tools/REGISTRATION_FIELDS.md`

```markdown
# Registration Fields Per Platform
# Source: REVENUE_BUSINESS_ROADMAP.md §Registration Checklist

## Order of Operations
Work through these in order. Each takes ~10 minutes.

## 1. ASCAP (Work Registration) — ascap.com/members
- Work Title: [TRACK TITLE — exact as released on Spotify]
- Writer: Ethan Payton
- Writer IPI#: [ask Ethan — stored in 1Password]
- Publisher: Distance Over Time
- Publisher IPI#: [ask Ethan — stored in 1Password]
- Writer Share: 50%
- Publisher Share: 50%
- ISRC: [from Amuse dashboard]
- Duration: [from catalog_intelligence_matrix.json]
- Alternative Titles: [if any — e.g., working title]

## 2. MLC (Mechanical Licensing Collective) — portal.themlc.com
- Song Title: [TRACK TITLE]
- Writer: Ethan Payton
- ISRC: [from Amuse]
- HFA Song Code: [if available from prior registration, otherwise leave blank]
- Release Date: [exact release date]
- Note: MLC handles US mechanical royalties from interactive streaming (Spotify, Apple Music, etc.)

## 3. Songtrust — app.songtrust.com
- Verify admin is active for: [TRACK TITLE]
- Confirm ISRC matches: [from Amuse]
- Territory: Worldwide
- Note: Songtrust handles global publishing admin (60+ countries). Verify the song appears in their catalog within 48 hours of registration.

## 4. SoundExchange — soundexchange.com/artist-portal
- Track Title: [TRACK TITLE]
- Featured Artist: past.El
- ISRC: [from Amuse]
- Label: past.El noir Records
- Release Date: [exact release date]
- Note: SoundExchange handles non-interactive digital performance royalties (Pandora, SiriusXM, internet radio).

## 5. Musixmatch — studio.musixmatch.com
- 🔴 HUMAN-EXECUTE: This step requires Ethan to paste full lyrics.
- Track Title: [TRACK TITLE]
- Search for the track via Spotify URI
- Lyrics: [Ethan pastes — Claude cannot access lyric sheets]
- Language: English
- Synced timing: No (unless Ethan has timed lyrics from CapCut/studio)
- Note: Musixmatch lyrics appear on Spotify, Apple Music, Instagram Stories. Worth the 5 minutes.

## Verification
After all 5 platforms:
- [ ] ASCAP shows new work in "My Works" (may take 24-48 hours)
- [ ] MLC confirms receipt
- [ ] Songtrust shows song in catalog
- [ ] SoundExchange shows recording
- [ ] Musixmatch shows lyrics on Spotify (may take 1-2 weeks)
```

---

## SKILL 4: `caption-writer` — 🟡 BUILD FOR JUNE

**Priority:** Medium. Saves 15-20 min per post. Content volume doubles during waterfall.

**Create:** `caption-writer/SKILL.md`

```markdown
---
name: Caption Writer
description: Generate Instagram captions for Talk to 'Em videos, release announcements, world-building posts, and cinematic content using the Content Playbook formula. Use when user says "write caption", "caption for [track]", "Talk to 'Em caption", "IG caption", or "post caption".
---

# Caption Writer

## When to Use
When Ethan needs an IG caption for any of the 5 content pillars.

## Instructions

1. **Identify the pillar:** Talk to 'Em, World-Building, Release, Cinematic, or Community.
2. **Identify the track** (if release-related).
3. **Identify the emotion** (what's the feeling? what's the 2AM conversation?).
4. **Generate caption** using the formula for that pillar.
5. **Generate 3 hashtags** from the approved low-competition list.

## Talk to 'Em Formula (highest priority pillar)
```
Line 1: [Emotional hook — stops the scroll, UNDER 125 chars]
Line 2: [empty]
Lines 3-6: [The deeper thought — what you'd say to a friend at 2AM. Intimate, unhurried.]
Line 7: [empty]
Line 8: [Track name] — [date or "out now"]
```

## Release Announcement Formula
```
Line 1: [Track title in caps or one-line hook, under 125 chars]
Line 2: [empty]
Line 3: [One sentence about the FEELING, not the sound]
Line 4: [empty]
Line 5: [Date + "pre-save link in bio" or "out now — link in bio"]
```

## World-Building Formula
```
Line 1: [Atmospheric observation — no music reference]
Lines 2-3: [The mood, the city, the time of night]
Line 4: [empty]
Line 5: [Optional soft CTA or let it breathe — no hard sell]
```

## Cinematic Formula
```
Line 1: [One-line scene-setting, filmic]
Line 2: [empty]
Line 3: [Let the visual do the work. Minimal text.]
```

## Hashtag Rules (2026 — IG search is AI-powered now)
- 3-5 niche tags IN the caption (not first comment)
- Approved tags: #altrnb #darkrnb #milwaukeeartist #2amvibes #hearingincolor #altrnbsingles #trapsoul
- Low-competition only (<500K posts)
- Hashtags are for SEARCH, not distribution
- Keyword-rich captions matter more than hashtags now

## Critical Rules
- Line 1 must hook BEFORE the "...more" cutoff (~125 characters). This is non-negotiable.
- Never use "link in bio" as the hook — it's a CTA, not a hook.
- Voice: intimate, unhurried, peer energy. Never salesy. Never hype-bro.
- Genre is R&B. Never say Pop.
- Reference the EMOTION, not the production process. Nobody cares about your EQ settings.
- The Portfolio Test: "Would someone send this to a friend who doesn't follow me yet?" If no, rewrite the hook.
- See `tools/CAPTION_EXAMPLES.md` for reference examples.
```

**Create:** `caption-writer/tools/CAPTION_EXAMPLES.md`

```markdown
# Caption Examples — Reference Only
# Update this file with Ethan's actual best-performing captions as data comes in.

## Talk to 'Em — Template Examples
Hook: "some songs write themselves. this one fought me for three months."
Hook: "I almost didn't finish this one."
Hook: "the version of me that started this song isn't the one who finished it."

## World-Building — Template Examples
Hook: "Milwaukee at 2 AM hits different when you're sober."
Hook: "drove past the old apartment. windows were dark."
Hook: "lake geneva in the off-season is just empty docks and your own thoughts."

## Release — Template Examples
Hook: "EAST SIDE LOVE"
Hook: "this is the one I kept going back to."
Hook: "GREEN LIGHT. May 29."

## Anti-Patterns (never do this)
- "New music dropping soon! 🔥🔥🔥 Link in bio!" ← hype-bro, zero emotion
- "Check out my latest single!" ← generic, no hook
- "I worked so hard on this track" ← production focus, not emotion focus
- "Like and share if you feel this!" ← begging for engagement

## Performance Notes
(Update this section as posts go live and data comes in)
- Best sends-per-reach caption: [TBD]
- Best save-driving caption: [TBD]
- Best DM-generating caption: [TBD]
```

---

## SKILL 5: `meta-ads-builder` — 🟡 BUILD FOR JUNE

**Priority:** Medium. First ad spend decisions happen post-EP data.

**Create:** `meta-ads-builder/SKILL.md`

```markdown
---
name: Meta Ads Campaign Builder
description: Generate a ready-to-execute Meta Ads campaign config using the $50 test protocol. ONLY runs after trigger-evaluator returns GO for Meta. Use when user says "set up ads", "Meta campaign", "run ads for [track]", "build ad", or when trigger-evaluator fires a Meta trigger.
---

# Meta Ads Campaign Builder

## When to Use
ONLY after `trigger-evaluator` returns GO for Meta Ads. Never on impulse. If trigger-evaluator hasn't been run, run it first.

## Dependency
REQUIRES: trigger-evaluator → Meta GO verdict. Do not skip this step.

## Instructions

1. **Confirm trigger-evaluator returned GO.** If not, stop and run trigger-evaluator first.
2. **Identify the winning reel** (highest sends-per-reach from past 2 weeks).
3. **Generate two ad set configs** using `tools/AD_SET_TEMPLATE.md`.
4. **Output the campaign spec** Ethan can copy into Meta Business Suite.
5. **Include kill rules and Day 3/Day 7 checkpoints.**

## Output Format
See `tools/AD_SET_TEMPLATE.md` for the complete campaign structure.

## Critical Rules
- NEVER link directly to Spotify. Always use smart link with Meta Pixel (feature.fm or similar).
- Never promote a reel that performed below 2% sends-per-reach organically.
- Budget hard cap: 15% of monthly income. Check against trigger-evaluator's budget check.
- This is 🟡 AI-prep + 🔴 Human-execute. Ethan creates the campaign in Meta Business Suite.
- Day 3: Kill underperforming ad set. Double budget on winner.
- Day 7: Campaign ends. Log results to weekly-data-synthesis.
- Cost-per-stream > $0.10: Kill entire campaign immediately. No exceptions.
```

**Create:** `meta-ads-builder/tools/AD_SET_TEMPLATE.md`

```markdown
# Meta Ads Campaign Template
# Source: MARKETING_PAID_STRATEGY.md §4

## Campaign Structure

CAMPAIGN: [Track Name] — [Release/Sustain] Promote
Objective: Traffic (Link Clicks)
Budget: $50 total ($5/day × 5 days × 2 ad sets)
Placement: Instagram Reels + Instagram Feed
Duration: 5 days (with Day 3 optimization checkpoint)

### AD SET A — Lookalike 1% ($25)
- Source: IG Engagers (last 30 days)
- Geo: Chicago, Denver, Minneapolis, New York, Phoenix, Dallas
- Age: 25-34
- Gender: All (weight male 60%)
- Placement: IG Reels (primary), IG Feed (secondary)

### AD SET B — Interest-Based ($25)
- Interests: Brent Faiyaz, Bryson Tiller, PARTYNEXTDOOR, The Weeknd, R&B
- Geo: Chicago, Denver, Minneapolis, New York, Phoenix, Dallas
- Age: 25-34
- Gender: All (weight male 60%)
- Placement: IG Reels (primary), IG Feed (secondary)

### Creative
- Asset: [Best-performing organic reel — download without watermark]
- CTA Button: "Listen Now"
- Link: [Smart link with Meta Pixel — feature.fm or similar, NOT direct Spotify URL]

### Kill Rules
| Checkpoint | Condition | Action |
|-----------|-----------|--------|
| Day 3 | Ad Set A or B has CPC > $0.50 | Kill that ad set. Move $remaining to winner. |
| Day 3 | Both ad sets CPC > $0.50 | Kill entire campaign. |
| Any day | Cost-per-stream > $0.10 | Kill entire campaign immediately. |
| Day 7 | Campaign ends | Log results. Calculate CPC, CPM, cost-per-stream. |

### Post-Campaign Logging
After Day 7, record:
- Total spend: $[X]
- Link clicks: [N]
- CPC: $[X]
- Estimated streams driven: [N] (clicks × estimated conversion rate ~40%)
- Cost-per-stream: $[X]
- Winner: Ad Set [A/B]
- Learning: [one sentence — what worked, what to change next time]

## Geo Targeting Notes
Cities are from S4A top listener cities. Update if S4A data shifts significantly.
Current top cities (verified May 2026): Chicago, Denver, Minneapolis, New York, Phoenix, Dallas.
```

---

## SKILL 6: `community-trace` — 🟢 BUILD LATER

**Priority:** Low urgency but compounds daily.

**Create:** `community-trace/SKILL.md`

```markdown
---
name: Community Trace Daily Targets
description: Generate today's Community Trace engagement targets — which pages to comment on, comment quality templates, and 15-minute time budget. Use when user says "community trace", "who should I engage with", "daily engagement", "comment targets".
---

# Community Trace

## When to Use
Daily — generates the 15-minute engagement protocol. Best triggered during DoorDash breaks or morning routine.

## Instructions

1. **Load tier targets** from `tools/TIER_TARGETS.md`.
2. **Select 3 target pages** for today (rotate across tiers).
3. **Generate 3 specific comment drafts** (10-25 words each, peer energy).
4. **Output the 15-min schedule.**

## Output Format

### Community Trace — [Date]

**Today's targets:**
1. [Artist name] — [their most recent post] — Comment: "[specific, 10-25 word comment]"
2. [Artist name] — [their most recent post] — Comment: "[specific comment]"
3. [Curator/playlist page] — Comment: "[specific comment]"

**Schedule:**
| Time | Action | Duration |
|------|--------|----------|
| Morning (DD breaks) | Reply to overnight comments + DMs | 5 min |
| Midday | 3 thoughtful comments on today's targets | 5 min |
| Evening (<8 PM) | Reply to day's comments, react to peer stories | 5 min |

## Comment Rules
- NEVER: "Fire 🔥" or "Love this" or any single-emoji comment (spam signal)
- ALWAYS: Reference something SPECIFIC ("the way that bridge hits at 2:03 is exactly what I needed today")
- Length: 10-25 words minimum
- Voice: Peer energy, not fan energy. You're a fellow artist, not a groupie.
- No self-promotion in comments. Ever. Your profile does that work.

## Critical Rules
- 15 minutes total. Set a timer. Do not rabbit-hole.
- Quality over quantity. 3 thoughtful comments > 20 "🔥" comments.
- Rotate targets so you're not always hitting the same pages.
```

**Create:** `community-trace/tools/TIER_TARGETS.md`

```markdown
# Community Trace Target Tiers
# Source: SOCIAL_COMMUNITY_PLAN.md §2
# Update this file as relationships develop or tiers shift.

## T2 — Engage 2-3x/week (peer-level artists in your lane)
- Xavier Omär
- bLAck pARty
- Sabrina Claudio
- 6LACK

## T3 — DM within 30 days of their release (emerging peers)
- Arin Ray
- Eli Sostre
- Destin Conrad
- Che Ecru
- Chase Shakur

## Micro-Curators — Engage when they post playlist updates
- User playlists with 500-5K followers in R&B/TrapSoul/Alt-R&B
- (Add specific playlist curator handles here as you discover them)

## Rotation Logic
- Monday/Wednesday/Friday: 1 T2 + 1 T3 + 1 micro-curator
- Tuesday/Thursday: 2 T3 + 1 micro-curator
- Saturday/Sunday: Light — reply to comments only, no outbound

## Graduation Rules
- T3 → T2: When they follow back or respond to a DM
- T2 → T1 (real relationship): When you've had an actual conversation
- Remove: If they haven't posted in 60 days
```

---

## SKILL 7: `sync-master-checklist` — 🟢 BUILD LATER

**Priority:** One-time per track but 23+ tracks in catalog.

**Create:** `sync-master-checklist/SKILL.md`

```markdown
---
name: Sync Master Prep Checklist
description: Per-track checklist for sync-readiness — instrumental bounce, -14 LUFS sync master, stem exports, one-sheet update, file naming. Use when user says "prep [track] for sync", "sync masters", "stem export", "instrumental bounce", or "sync ready".
---

# Sync Master Prep Checklist

## When to Use
When preparing individual tracks for sync platform submission. Run sync-one-sheet first to identify which tracks need prep.

## Dependency
Run sync-one-sheet first → it identifies which tracks are missing instrumentals/stems/sync masters.

## Per-Track Checklist

### 1. Instrumental Bounce
- [ ] Open FL Studio session for [track]
- [ ] Mute/remove vocal bus (all vocal tracks, ad-libs, doubles)
- [ ] Export WAV: same sample rate as original session, 24-bit
- [ ] A/B against vocal version — arrangement must be IDENTICAL minus vocals
- [ ] File name: `pastEl_[TrackTitle]_instrumental.wav`

### 2. Sync Master (-14 LUFS)
- [ ] Duplicate the master bus chain
- [ ] Reduce limiter ceiling. Target: -14 LUFS integrated / -1dB True Peak
- [ ] Do NOT just turn down the streaming master — the dynamic range should open up
- [ ] Export WAV: same sample rate, 24-bit
- [ ] Verify with LUFS meter (Youlean or similar)
- [ ] File name: `pastEl_[TrackTitle]_syncmaster.wav`

### 3. Stem Exports
- [ ] Vocals (lead + backing, wet with effects)
- [ ] Drums (full drum bus)
- [ ] Bass (all bass elements)
- [ ] Melody/Keys (harmonic instruments)
- [ ] FX (atmospheric, transitions, ear candy)
- [ ] All stems: WAV, session sample rate, 24-bit, DRY (no master bus processing)
- [ ] File naming: `pastEl_[TrackTitle]_stem_[type].wav`

### 4. Update Sync One-Sheet
- [ ] Run sync-one-sheet skill for this track
- [ ] Confirm: Instrumental available = YES
- [ ] Confirm: Stems available = YES
- [ ] Confirm: Sync master (-14 LUFS) = YES

### 5. File Organization
```
/sync-masters/[TrackTitle]/
├── pastEl_[TrackTitle]_syncmaster.wav
├── pastEl_[TrackTitle]_instrumental.wav
└── stems/
    ├── pastEl_[TrackTitle]_stem_vocals.wav
    ├── pastEl_[TrackTitle]_stem_drums.wav
    ├── pastEl_[TrackTitle]_stem_bass.wav
    ├── pastEl_[TrackTitle]_stem_melody.wav
    └── pastEl_[TrackTitle]_stem_fx.wav
```

## Critical Rules
- Streaming masters (-9 to -11 LUFS) are NOT sync masters. Sync needs -14 LUFS.
- Never compress stems. Export dry, full dynamic range.
- Instrumental must be IDENTICAL to vocal version minus vocals (same master chain, same effects on everything except vocal bus).
- This is 🔴 HUMAN-EXECUTE (FL Studio work). Claude preps the checklist, Ethan does the bouncing.
```

---

## SKILL 8: `apg-data-package` — 🟢 BUILD LATER (AUG)

**Priority:** Single use but high stakes. Aug 15 = APG activation threshold.

**Create:** `apg-data-package/SKILL.md`

```markdown
---
name: APG Manager Data Package
description: Generate the data package to activate the dormant APG manager relationship. Compiles popularity trajectory, save rates, DW evidence, geographic moats, release cadence proof, and CREAM plan. Use when user says "APG package", "manager data", "activate APG", or at the Aug 15 threshold.
---

# APG Manager Activation Package

## When to Use
At the Aug 15 100-day mark, IF go criteria in `tools/APG_GO_CRITERIA.md` are met. Can also be run earlier for a progress check.

## Data Sources
1. `brain/LIVE_STATE.md` — current numbers
2. `brain/catalog_intelligence_matrix.json` — per-track data
3. `brain/BRAND_ARCHITECTURE_V3.md` — audience demographics, sonic positioning
4. `brain/TURNAROUND_EVALUATION_MAY2026.md` §V.E — go criteria
5. S4A screenshots — Ethan provides (🔴 Human-execute to capture)

## Instructions

1. **Check go criteria** from `tools/APG_GO_CRITERIA.md`. If ANY criterion is not met, output a gap report instead of the full package.
2. **If all criteria met**, generate the full package below.
3. **Format as a document** Ethan can send or present.

## Package Contents

### Section 1: The Numbers (opens the conversation)
- Monthly listeners: [current] (trajectory: [trend])
- Popularity score: [current] (14-day sustained above 30? [YES/NO])
- Follower growth: [net gain since May 1]
- Save rate (best track): [%] over [N] days

### Section 2: Algorithmic Proof
- Discover Weekly placements: [list tracks + dates]
- Release Radar triggers: [N releases, N RR triggers]
- Radio placements: [if any]

### Section 3: Release Cadence Evidence
- May 29: ALL LOVE EP (5 tracks)
- Jun 12 – Aug 7: 5 vault singles at 2-week cadence (all Release Radar triggered)
- Total: 10 new releases in 10 weeks
- "This is what consistent execution looks like with no team."

### Section 4: Geographic Moats
- Top 10 cities with listener counts
- Emerging markets (cities growing fastest)
- Milwaukee home-base advantage

### Section 5: CREAM Pre-Production Plan (if GO)
- Tracklist lock: Jul 24 (data-driven selection)
- Pre-production: Aug–Sep
- Target release: Q4 2026
- "Here's the project. Here's the data behind the track selection. Here's what I need from management to execute at the next level."

### Section 6: The Ask
- Specific, concrete requests (not vague "let's work together")
- What APG can unlock that Ethan can't do alone
- Timeline for activation

## Critical Rules
- Lead with NUMBERS, not narrative. APG is a business, not a charity.
- Every claim must be backed by a screenshot or data point.
- Don't oversell. Undersell the story, oversell the trajectory.
- The ask must be SPECIFIC. "I need playlist pitching support for CREAM" > "I'd love to work together more."
```

**Create:** `apg-data-package/tools/APG_GO_CRITERIA.md`

```markdown
# APG Activation Go Criteria
# Source: SPOTIFY_GROWTH_STRATEGY.md §III + TURNAROUND_EVALUATION_MAY2026.md §V.E
# All criteria must be met simultaneously. Partial = wait.

## Hard Criteria (all required)
| Metric | Threshold | Measurement Window | Source |
|--------|-----------|-------------------|--------|
| Popularity score | 30+ sustained | 14 consecutive days | S4A |
| Save rate (best track) | >3% | 30 days | S4A |
| Monthly listeners | 40,000+ | Current | S4A |
| Follower growth | +200 net since May 1 | Cumulative | S4A |
| Discover Weekly | Confirmed placement | Any track, any week | S4A |

## Soft Criteria (strengthen the case but not required)
| Metric | Target | Notes |
|--------|--------|-------|
| Release Radar triggers | 7/7 releases | Shows consistency |
| Playlist adds (editorial) | 1+ | Proves editorial interest |
| Geographic diversity | 5+ cities with 100+ listeners | Proves non-local audience |
| Content engagement | 3%+ sends-per-reach on best reel | Proves marketing capability |

## If Criteria NOT Met
Output a gap report:
- Which criteria are met ✅
- Which are not met ❌ with current value vs. threshold
- Estimated time to close each gap based on current trajectory
- Recommendation: wait until [date] and re-evaluate

## Update Protocol
These thresholds come from two source docs. If either doc updates, update this file.
- SPOTIFY_GROWTH_STRATEGY.md §III
- TURNAROUND_EVALUATION_MAY2026.md §V.E
```

---

## SKILL 9: `setlist-builder` — 🟢 BUILD LATER (OCT)

**Priority:** Lowest. Live dates don't start until Oct 2026.

**Create:** `setlist-builder/SKILL.md`

```markdown
---
name: Setlist Builder
description: Generate an optimized 45-minute setlist from the catalog with energy arc, cluster mixing, and opener/closer logic. Use when user says "build setlist", "set list", "live set", "live performance prep", or asks about show preparation.
---

# Setlist Builder

## When to Use
When Ethan is preparing for a live performance (Oct 2026 earliest).

## Data Sources
1. `brain/catalog_intelligence_matrix.json` — BPM, key, energy, mood per track
2. `brain/BRAND_ARCHITECTURE_V3.md` — cluster assignments (A = dark core, B = warm)
3. `tools/ENERGY_ARC.md` — energy curve template

## Instructions

1. **Load full catalog** from sources above.
2. **Filter to performance-ready tracks** (released, rehearsed, backing tracks exist).
3. **Build 45-min set** (15-18 songs × 2.5-3 min each).
4. **Apply energy arc** from `tools/ENERGY_ARC.md`.
5. **Check cluster mixing** — don't stack all Cluster A (dark) or all Cluster B (warm) together.
6. **Check key transitions** — avoid jarring key clashes between adjacent songs.
7. **Output the setlist** with BPM, key, energy level, and transition notes.

## Output Format
| # | Track | BPM | Key | Energy | Cluster | Transition Note |
|---|-------|-----|-----|--------|---------|-----------------|
| 1 | [opener] | [X] | [X] | HIGH | [A/B] | [open strong] |
| ... | | | | | | |
| 15 | [closer] | [X] | [X] | EMOTIONAL | [A/B] | [memorable exit] |

## Critical Rules
- Hollywood Fever goes in peak position (tracks 12-14), never as opener.
- Mix Cluster A and Cluster B — don't cluster all darks together.
- Performance archetype: Don Toliver / Faiyaz school — atmospheric presence, unhurried. NOT choreography.
- Include 1-2 unreleased previews if available (builds anticipation for next release).
- BPM flow matters: avoid >20 BPM jumps between adjacent tracks unless there's a planned energy shift.
```

**Create:** `setlist-builder/tools/ENERGY_ARC.md`

```markdown
# Setlist Energy Arc Template
# Source: REVENUE_BUSINESS_ROADMAP.md §5

## 45-Minute Set Structure (15-18 tracks)

| Position | Energy Level | Purpose | Track Type |
|----------|-------------|---------|------------|
| 1-2 | HIGH | Grab attention, establish energy | Uptempo crowd-grabbers |
| 3-5 | MEDIUM | Build familiarity, let audience settle | Core catalog, mid-energy |
| 6-8 | LOW-MEDIUM | Intimate moment, slow burn | Ballads, vulnerable tracks |
| 9-11 | BUILD | Rising intensity toward peak | Increasing energy, newer material |
| 12-14 | PEAK | Best tracks, crowd favorites | Highest-energy, most recognized |
| 15 | CLOSER | Emotional landing, memorable exit | Emotional anchor, leave them wanting more |

## BPM Flow Guidelines
- Opening pair: 100-120 BPM range (energetic but not frantic)
- Dip section (6-8): 80-95 BPM (intimate, atmospheric)
- Build section (9-11): 95-115 BPM (rising)
- Peak section (12-14): 100-125 BPM (highest energy)
- Closer: Any BPM — energy level matters more than tempo here

## Key Transition Rules
- Adjacent songs in the same key or relative major/minor = smooth
- Adjacent songs a 4th or 5th apart = solid
- Adjacent songs a half-step apart = jarring (avoid unless intentional)
- Use the dip section (6-8) as a reset point — key transitions matter less when energy drops

## Cluster Mixing
- Never stack 3+ Cluster A (dark) tracks in a row — audience needs warmth
- Never stack 3+ Cluster B (warm) tracks in a row — loses the edge
- Ideal: A-B-A-B with occasional A-A or B-B at energy shift points
```

---

## EXECUTION ORDER FOR SONNET

### Phase 1: Create all 9 skill directories and SKILL.md files
```bash
# From the Ethan Payton Label OS project root:
mkdir -p .claude/skills/trigger-evaluator/tools
mkdir -p .claude/skills/sync-one-sheet/tools
mkdir -p .claude/skills/compliance-packet/tools
mkdir -p .claude/skills/caption-writer/tools
mkdir -p .claude/skills/meta-ads-builder/tools
mkdir -p .claude/skills/community-trace/tools
mkdir -p .claude/skills/sync-master-checklist
mkdir -p .claude/skills/apg-data-package/tools
mkdir -p .claude/skills/setlist-builder/tools
```

### Phase 2: Write each SKILL.md + tools files
Write files in this order (matches priority):
1. trigger-evaluator/SKILL.md + tools/TRIGGER_THRESHOLDS.md
2. sync-one-sheet/SKILL.md + tools/SYNC_CATALOG_TEMPLATE.md
3. compliance-packet/SKILL.md + tools/REGISTRATION_FIELDS.md
4. caption-writer/SKILL.md + tools/CAPTION_EXAMPLES.md
5. meta-ads-builder/SKILL.md + tools/AD_SET_TEMPLATE.md
6. community-trace/SKILL.md + tools/TIER_TARGETS.md
7. sync-master-checklist/SKILL.md (no tools needed)
8. apg-data-package/SKILL.md + tools/APG_GO_CRITERIA.md
9. setlist-builder/SKILL.md + tools/ENERGY_ARC.md

### Phase 3: Verification
```bash
# Verify all 9 SKILL.md files exist
for skill in trigger-evaluator sync-one-sheet compliance-packet caption-writer meta-ads-builder community-trace sync-master-checklist apg-data-package setlist-builder; do
  if [ -f ".claude/skills/$skill/SKILL.md" ]; then
    echo "✅ $skill/SKILL.md"
  else
    echo "❌ MISSING: $skill/SKILL.md"
  fi
done

# Verify all tools files exist
for tool in \
  "trigger-evaluator/tools/TRIGGER_THRESHOLDS.md" \
  "sync-one-sheet/tools/SYNC_CATALOG_TEMPLATE.md" \
  "compliance-packet/tools/REGISTRATION_FIELDS.md" \
  "caption-writer/tools/CAPTION_EXAMPLES.md" \
  "meta-ads-builder/tools/AD_SET_TEMPLATE.md" \
  "community-trace/tools/TIER_TARGETS.md" \
  "apg-data-package/tools/APG_GO_CRITERIA.md" \
  "setlist-builder/tools/ENERGY_ARC.md"; do
  if [ -f ".claude/skills/$tool" ]; then
    echo "✅ $tool"
  else
    echo "❌ MISSING: $tool"
  fi
done

# Count total skills (should be 17: 8 Wave 1 + 9 Wave 2)
echo "Total skills: $(ls -d .claude/skills/*/SKILL.md | wc -l)"
```

---

## DO NOT

- Touch any Wave 1 skills (catalog-refresh, content-sprint, curator-pitch, dm-blitz, handoff-generator, release-checklist, s4a-pitch, weekly-data-synthesis) — they're already shipped
- Touch any agent files (`.claude/agents/`) — architecture is solid, no changes needed
- Touch `lib/releases.ts` or any Oracle Compass app code — that's a separate spec
- Hardcode release dates in any skill — use calendar references or catalog data
- Hardcode streaming numbers — always reference LIVE_STATE.md
- Say "Pop" anywhere — genre is always R&B / Alt-R&B
- Say "DistroKid" anywhere — distributor is always Amuse
- Build infrastructure, databases, APIs, or new routes — these are markdown files on disk
- Create agents for any of these — skills under existing agents is the correct architecture

---

## FINAL STATE AFTER WAVE 2

```
.claude/
├── agents/          (10 agents — unchanged)
│   ├── chief-of-staff.md
│   ├── ar-catalog.md
│   ├── marketing-director.md
│   ├── creative-director.md
│   ├── streaming-strategy.md
│   ├── community-manager.md
│   ├── finance-cfo.md
│   ├── performance-coach.md
│   ├── data-analyst.md
│   ├── body-health-coach.md
│   ├── _DOCTRINE.md
│   ├── _ROUNDTABLE.md
│   ├── _CHARTER_TEMPLATE.md
│   ├── _FIRST_RUN.md
│   └── README.md
├── commands/        (2 commands — unchanged)
│   ├── mirror.md
│   └── standup.md
└── skills/          (17 skills — 8 Wave 1 + 9 Wave 2)
    ├── catalog-refresh/        ✅ Wave 1
    ├── content-sprint/         ✅ Wave 1
    ├── curator-pitch/          ✅ Wave 1
    ├── dm-blitz/               ✅ Wave 1
    ├── handoff-generator/      ✅ Wave 1
    ├── release-checklist/      ✅ Wave 1
    ├── s4a-pitch/              ✅ Wave 1
    ├── weekly-data-synthesis/  ✅ Wave 1
    ├── trigger-evaluator/      🆕 Wave 2
    ├── sync-one-sheet/         🆕 Wave 2
    ├── compliance-packet/      🆕 Wave 2
    ├── caption-writer/         🆕 Wave 2
    ├── meta-ads-builder/       🆕 Wave 2
    ├── community-trace/        🆕 Wave 2
    ├── sync-master-checklist/  🆕 Wave 2
    ├── apg-data-package/       🆕 Wave 2
    └── setlist-builder/        🆕 Wave 2
```

**Coverage after Wave 2:**
- 10 agents → 10 departments covered (2 formerly dark zones now covered by skills under existing agents)
- 17 skills → 13 of 13 departments have execution tools
- 0 dark zones
- Cross-skill dependencies wired
- Every skill has a tools layer (updatable reference files) except sync-master-checklist (pure checklist, no external data needed)
