---
name: Content Sprint Planner
description: Generate the 8-day content sprint checklist for a track release. Use when user says "start content sprint for [Track]" or "content sprint" or asks about release content planning.
---

# Content Sprint Planner

## When to Use
When Ethan says "start content sprint for [Track]", "content sprint", or asks what content needs to be created for an upcoming release.

## Context
The content sprint is the 8-day window between uploading a track to Amuse and its release day (Friday). ALL marketing/content work happens in this window — not before, not after.

## Instructions

1. **Identify the track** from the request or ask Ethan which track.
2. **Load the campaign kit** if available (check `docs/handoff_mar24/` or brain docs for `[track]_campaign_kit.md`).
3. **Load the catalog matrix** entry from `brain/catalog_intelligence_matrix.json` for audio profile, mood tags, and comparable artists.
4. **Generate the sprint checklist** using the template below.

## Sprint Checklist Template

```markdown
# CONTENT SPRINT: [TRACK TITLE]
Upload: [Date] → Release: [Date] ([X] days remaining)

## DAY 1 (Upload Day)
- [ ] Confirm Amuse upload accepted (check email)
- [ ] Spotify for Artists pitch submitted (if eligible)
- [ ] Core Drive analysis run (or verify existing: core-drive-[track].json)
- [ ] Campaign kit loaded and reviewed

## DAYS 2-4 (Asset Creation)
- [ ] Spotify Canvas — 8s loop, 720×720, [track color palette]
- [ ] Quote-on-screen reel × 3 (pastel talk format, secondary accounts)
- [ ] Late drive / night aesthetic reel × 2 (12-15s, dashcam, 35mm grain)
- [ ] Performance video cut (white wall / synesthesia / car / AI background)
- [ ] Release announcement graphic — feed (1080×1080) + story (1080×1920)
- [ ] IG story teaser sequence (3-5 slides)

## DAYS 5-6 (Distribution Prep)
- [ ] Curator pitch emails drafted (3 templates per curator type)
- [ ] Groover submission prepared (if budget allows)
- [ ] Meta ad campaigns configured (3 campaigns from campaign kit)
- [ ] TikTok concepts scripted (3-5 from campaign kit)
- [ ] Presave link generated and tested

## DAY 7 (Pre-Release)
- [ ] All content scheduled for release day
- [ ] Ad campaigns set to launch on release day
- [ ] Secondary account posts queued
- [ ] Comment narrative templates ready (positive sentiment flood)

## DAY 8 (Release Day — Friday)
- [ ] Hit publish on all pre-made assets
- [ ] Song goes live on all platforms — verify
- [ ] Share presave → streaming link swap
- [ ] Monitor first-hour engagement

## REGISTRATION MONDAY (3 days post-release)
- [ ] Pull ISRC from Amuse
- [ ] ASCAP registration
- [ ] MLC registration
- [ ] Songtrust registration
- [ ] Musixmatch lyrics submission
```

## Customization Rules
- **Sweet Frustration** is a genre outlier (House-R&B / KAYTRANADA pocket). Use DIFFERENT curator set than TrapSoul tracks. Flag this explicitly.
- Pull mood tags and comparable artists from the catalog matrix entry.
- Reference the Jutsu playbook (`brain/jutsu_playbook.md`) for content format specs.
- If the track has an `event_note` in the catalog matrix (e.g., ESL → 414 Day), flag it prominently.
