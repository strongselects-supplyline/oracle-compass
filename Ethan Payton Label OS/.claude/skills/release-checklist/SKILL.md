---
name: Release Cycle Checklist
description: Generate the full release lifecycle checklist for a track from master-done through post-release registration. Use when user says "release checklist" or asks about release workflow.
---

# Release Cycle Checklist

## When to Use
When Ethan asks for a "release checklist", "what's left for [Track]", or needs the full lifecycle view of a release.

## The Canonical Release Cycle

This is how Ethan works. All tooling serves this rhythm:

### Phase 0: Master Done
- [ ] Master MP3 + WAV exported
- [ ] Instrumental exported
- [ ] A cappella exported (if applicable)
- [ ] Lyrics finalized
- [ ] Cover art locked
- [ ] Raw recording footage organized
- [ ] OBS screen recordings saved

### Phase 1: Upload (Thursday, 8 days before release)
- [ ] Upload to **Amuse** (NOT DistroKid — Ethan uses Amuse)
- [ ] 48hr review window begins
- [ ] Spotify for Artists editorial pitch submitted (if eligible)
- [ ] Content sprint begins (see content-sprint skill)

### Phase 2: Content Sprint (8 days — Upload → Release)
- [ ] Core Drive analysis complete
- [ ] Gorilla Geo pipeline data loaded
- [ ] Visual content created from existing footage bank
- [ ] Adobe/CapCut templates executed
- [ ] Campaign kit assets built
- [ ] Ad targeting configured
- [ ] Curator pitches drafted
- [ ] Everything scheduled and ready to publish

### Phase 3: Release Day (Friday)
- [ ] Hit publish on all pre-made content
- [ ] Song live on all platforms — verify each DSP
- [ ] Presave link swapped to streaming link
- [ ] Ad campaigns activated
- [ ] Secondary account posts published
- [ ] Comment narrative deployed (positive sentiment)
- [ ] Monitor first-hour metrics

### Phase 4: Registration Monday (3 days post-release)
- [ ] Pull ISRC from live Amuse distribution
- [ ] ASCAP work registration
- [ ] MLC registration (mechanical licensing)
- [ ] Songtrust registration
- [ ] Sound Exchange (if not already registered)
- [ ] Musixmatch lyrics submission
- [ ] Update `catalog_intelligence_matrix.json` compliance fields

## Instructions
1. Identify which track from the request.
2. Check `catalog_intelligence_matrix.json` for current status and compliance state.
3. Generate the checklist with completed items marked `[x]` based on known status.
4. Flag any blocking items or upcoming deadlines prominently.

## Critical Rules
- **Distributor is always Amuse.** Never reference DistroKid.
- **Compliance happens AFTER release**, not before. Never block a release for registration tasks.
- **Content creation is NOT post-release.** It happens during the 8-day sprint window using existing footage.
