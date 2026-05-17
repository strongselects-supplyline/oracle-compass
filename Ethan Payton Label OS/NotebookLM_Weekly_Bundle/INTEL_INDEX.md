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
| [industry_economics.md](industry_economics.md) | 12 | 2026-05-10 | Brian Johnson (Spotify), May 10 2026 |
| [release_strategy.md](release_strategy.md) | 9 | 2026-05-13 | S4A data, Spotify docs, Johnson interview, core_drive_matrix.md, Antonoff transcript |
| [audience_psychology.md](audience_psychology.md) | 5 | 2026-05-10 | S4A May 2 2026, BRAND_ARCHITECTURE_V3 |
| [brand_positioning.md](brand_positioning.md) | 7 | 2026-05-10 | BRAND_ARCHITECTURE_V3, Cyanite 21-track, Core Drive, War_Mode_Content_Archetypes.md |
| [production_craft.md](production_craft.md) | 9 | 2026-05-13 | sovereign_schematic_quincy.md, production_mixing_session_transcript.md, mastering_technical_breakdown.md, mastering_feedback_loop_sop.md, acusonic_codex.md, sonic_architecture_notes.md, Antonoff transcript |
| [business_operations.md](business_operations.md) | 3 | 2026-05-10 | sovereign_schematic_galloway.md, Hormozi_Label_OS_Playbook.md |
| [health_performance.md](health_performance.md) | 13 | 2026-05-10 | Dr. Rhonda Patrick, Dr. Reena Malik, transcript_gems.md, sovereign_fuel_protocol.md, War_Mode_Biological_Foundation.md |
| [mindset_philosophy.md](mindset_philosophy.md) | 17 | 2026-05-13 | Dr. K, David Eagleman, Quincy Jones, James Hollis, Rick Rubin, habits_sequencing_transcript.md, Antonoff transcript |

**Total active findings: 75**

## Standing Rules
1. Findings are PROCESSED intelligence, not raw quotes. Raw quotes stay in source transcripts.
2. Every finding has a confidence level. VERIFIED > STRONG > THEORETICAL > CONTESTED.
3. Contradicted findings are NEVER deleted — they move to SUPERSEDED with full attribution.
4. Cross-references use relative Markdown links — click to navigate.
5. The index table entry counts and dates stay current after every session.

## What the Ledger System Never Touches
- `catalog_intelligence_matrix.json` — per-track data. Updated via refresh-catalog.mjs only.
- `scratch/core-drive-builder/` — Spotify embed scraper pipeline.
- `scratch/gorilla-geo/` — geo targeting pipeline.
- `lib/releases.ts` — release dates and pipeline state. Code changes only.
- `lib/pipeline.ts` — pipeline phases. Code changes only.
- `LIVE_STATE.md` — current numbers and dates. Updated directly from Ethan's data, not derived from ledger analysis.

Data flows one direction: source systems → ledger. **Never ledger → source systems.**

## Unseeded Sources (Future Work)
- `War_Mode_Content_Archetypes.md` (33KB) — social media archetypes → may seed future `content_strategy.md` or `brand_positioning.md`
- `Huberman_Galpin_Fitness_Protocol.md` (40KB) — detailed exercise programming → `health_performance.md` tactical layer
- `AMUSE_UPLOAD_CHECKLIST_APR20.md` + rights infrastructure docs → `business_operations.md`
- `mastering_feedback_loop_sop.md`, `mixing_checklist_codex.md` → `production_craft.md`
- Dr. K Love & Connection framework (transcript_gems.md lines 80-133) → `mindset_philosophy.md`
