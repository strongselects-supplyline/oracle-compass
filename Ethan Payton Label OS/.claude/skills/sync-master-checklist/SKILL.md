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
