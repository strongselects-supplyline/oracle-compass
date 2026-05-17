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
- Musixmatch lyrics step is 🔴 HUMAN-EXECUTE: Claude cannot access lyric sheets.
- Target time: 45-60 minutes for all 5 platforms.
- Rights infrastructure is COMPLETE (Distance Over Time, ASCAP, Songtrust, SoundExchange, IP lawyer). This is maintenance, not setup.
