---
name: Curator Pitch Generator
description: Generate playlist curator pitch emails for a specific track. Use when user says "pitch [Track] to curators", "curator pitch", or asks about playlist placement outreach.
---

# Curator Pitch Generator

## When to Use
When Ethan says "pitch [Track] to curators", "curator pitch for [Track]", or asks about playlist outreach strategy.

## Instructions

1. **Identify the track** from the request.
2. **Load the campaign kit** (check `docs/handoff_mar24/` for `[track]_campaign_kit.md`).
3. **Load the catalog matrix** entry from `brain/catalog_intelligence_matrix.json` for:
   - Audio profile (BPM, key, mode)
   - Mood scores (sexy, chill, romantic, etc.)
   - Comparable artists
   - Lane assignment
   - Editorial playlist targets
4. **Generate 3 pitch templates** (see below).

## Pitch Types

### Type 1: Editorial Playlist Pitch
For Spotify editorial playlists (Are & Be, TrapSoul, Late Night R&B, etc.)

```text
Subject: [Track Title] — [Artist] / [Genre Lane] / [BPM] BPM [Key]

Hi [Curator],

[Track Title] is a [genre descriptor] track at [BPM] BPM in [Key] [mode]. [One sentence on sonic identity — use comparable artists and mood scores].

[One sentence on artist context — past.El, Milwaukee, catalog size, streaming highlight].

[One sentence on why this fits their specific playlist — reference playlist vibe].

Spotify: [link]
Press kit: [link if available]

Best,
Ethan Payton
past.El noir Records
```

### Type 2: Independent Curator Pitch
For SubmitHub, PlaylistPush, or direct outreach to independent curators.

```text
Subject: [Track Title] for [Playlist Name]

Hey [Name],

Love what you've built with [Playlist Name]. [Track Title] fits the vibe — [specific mood/genre match].

[BPM] BPM, [Key] [mode]. Think [Comparable Artist 1] meets [Comparable Artist 2].

[Spotify link]

Thanks for listening,
Ethan
```

### Type 3: Groover Submission
For paid Groover submissions — structured data format.

```text
Genre: [From catalog matrix genres field]
Sub-genre: [Lane assignment]
Mood: [Top 3 mood scores with percentages]
BPM: [BPM]
Key: [Key] [mode]
Similar artists: [Comparable artists list]
Story: [1-2 sentences — artist context + track positioning]
Target playlists: [Editorial targets from catalog matrix]
```

## Critical Rules
- **Sweet Frustration is a GENRE OUTLIER.** It targets Dance & R&B, Electronic Rising, Mood Booster — NOT the same curators as the TrapSoul tracks. Flag this explicitly.
- **Never claim stream counts you can't verify.** Use "growing catalog" or reference Hollywood Fever's 3.4M+ if needed.
- **Groover note:** French R&B market is strong for TrapSoul. Mention this for ESL and LID.
- **Keep pitches SHORT.** 3-5 sentences max. Curators read hundreds.
