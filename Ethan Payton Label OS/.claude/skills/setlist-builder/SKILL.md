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
