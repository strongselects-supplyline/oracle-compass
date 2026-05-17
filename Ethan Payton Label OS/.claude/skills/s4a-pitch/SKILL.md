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
