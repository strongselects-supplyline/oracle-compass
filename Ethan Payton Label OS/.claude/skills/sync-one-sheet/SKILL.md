---
name: Sync One-Sheet Generator
description: Generate a sync licensing one-sheet for a single track or the full catalog. Pulls BPM, key, mood, neighbors from catalog data. Use when user says "sync one-sheet", "sync pitch", "prepare for sync", "licensing setup", or asks about sync platforms.
---

# Sync One-Sheet Generator

## When to Use
When Ethan needs to submit tracks to sync platforms (Songtradr, Musicbed, Music Gateway) or pitch to sync supervisors.

## Dependency
Requires fresh catalog data. Run catalog-refresh first if matrix is >14 days old.

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
