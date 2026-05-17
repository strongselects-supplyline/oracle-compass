# LABEL OS — THE OPERATING SYSTEM
## past.El noir Records | Single Document | May 16, 2026

---

## THE RULE

AI preps. You execute. The moment you ask AI to execute in your name, you get drift.

**Before any AI interaction, run this filter:**

```
Does this require logging into a website?
  YES → AI preps the deliverable, you paste/submit/upload (<30 min)

Does the final output require human taste?
  YES → AI preps the palette, you paint (<30 min)

Is this generating/transforming data or documents?
  YES → AI runs autonomously (you never touch it)

Is this physical or relationship-based?
  YES → Just do it yourself. No AI.
```

---

## SESSION OPENER (Paste This First, Every Time)

```
You are an AI operations partner for Ethan Payton (past.El / past.El noir Records),
an independent R&B artist running a one-person label out of Milwaukee.

RULES:
1. NEVER attempt tasks requiring auth to external platforms (Spotify, Wix, IG, Amuse).
   Prepare the EXACT deliverable + a <30 min checklist I execute.
2. NEVER generate outputs that need further processing. If it's not ready to use, say so first.
3. Classify every task before starting: 🟢 AI-autonomous / 🟡 AI-prep + Human-execute / 🔴 Human-only
4. If you hit a wall (API, auth, capability gap): STOP. State the limitation. Hand me the remaining checklist.
5. No speculative architecture. No new tools. Execute within existing systems.

CURRENT STATE: Read LIVE_STATE.md first.
DISTRIBUTOR: Amuse Pro (NEVER DistroKid).
GENRE: R&B / Alt-R&B (NEVER Pop).
PHASE: Execution mode. Ship what exists.
```

---

## THE FULL PIPELINE

### PHASE 0: CREATION (100% You)

| Step | Tool | Notes |
|------|------|-------|
| Idea capture | Phone/FL | Voice memo, melody, chord prog |
| Production | FL Studio | Beat, arrangement, sound selection |
| Recording | FL Studio + mic | All takes, comps, processing |
| Auto-Tune | AT Pro (graph mode) | Pitch correction |
| Rough mix | FL Studio | Levels, panning, FX |
| Reference check | Phone, AirPods, car, laptop | If it translates across all 4, it's right |
| Final mix | FL Studio | Automation, ear candy |
| Master | FL Studio (Illangelo chain) | Low cut → M/S EQ → G-Clip → multiband → multi-limiter → TP limiter |
| Target | Streaming: -9 to -11 LUFS, -0.3 TP | Sync: -14 LUFS |
| Export | FL Studio (session OPEN) | Master WAV, sync WAV, instrumental, acapella, stems |

**Batch rule:** Record everything → mix everything → master everything. Don't interleave.

**AI role in creation:** ZERO during. After masters bounce: Cyanite upload for verification (Sexy >0.76, Chill >0.56 targets), encode QC simulation via `mastering_qc.py`.

---

### PHASE 1: PRE-UPLOAD (2-3 days before upload)

| Step | Lane | What happens |
|------|------|-------------|
| Cover art (3000x3000) | 🔴 You | Photopea or commissioned |
| Spotify Canvas | 🔴 You | Photopea layers → CapCut parallax → MP4 |
| Metadata prep | 🟡 Hybrid | AI preps: title, ISRC handling, genre, date. You verify. |
| Smart Link | 🔴 You | Linkfire or Amuse built-in. Goes in bio. |

---

### PHASE 2: UPLOAD + PITCH

| Step | Lane | What happens |
|------|------|-------------|
| Amuse upload | 🔴 You | Upload WAV + art + metadata. Genre: R&B. Date: 7+ days out. |
| ISRC capture | 🔴 You → 🟢 AI | You copy from Amuse. AI routes to catalog matrix + releases.ts. |
| S4A pitch writing | 🟡 Hybrid | AI writes 500-char pitch using Cyanite data. You review + submit. |
| S4A pitch submission | 🔴 You | ONE SHOT. Cannot re-pitch. 7+ days before release. |
| Oracle Compass update | 🟢 AI | releases.ts, phaseMap.ts, studioData.ts → git push → auto-deploy |

---

### PHASE 3: 8-DAY CONTENT SPRINT (T-7 to T-0)

| Day | Action | Lane |
|-----|--------|------|
| T-7 | Batch content shoot (5-7 setups, 3hr block) | 🔴 You + GF |
| T-6 | AI processes footage (transcribe, find moments, grade variants) | 🟢 AI |
| T-5 | Teaser post (mystery, no title yet) | 🔴 You post |
| T-3 | World-build post (2AM drive, Milwaukee, studio aesthetic) | 🔴 You post |
| T-1 | Announce post (cover art + date + pre-save link) | 🔴 You post |
| T-1 | DM blitz prep (Core 50 / Warm 100 / Cold 50) | 🟡 AI drafts all 200, you review |
| T-0 | DROP DAY (see below) | 🔴 You |

**Caption writing:** AI drafts hook + body + CTA per post. You approve or edit. 30 min for all 8 days.

**Hashtag sets:** 🟢 AI generates per-track sets. You paste.

---

### PHASE 4: RELEASE DAY (T-0)

| Time | Action | Lane |
|------|--------|------|
| 9:15 AM | IG Post #1 — release announcement | 🔴 You |
| 9:30 AM | Story + link sticker + Canvas upload to S4A | 🔴 You |
| 10:00 AM | DM Blitz Round 1 — Core 50 (personal) | 🔴 You |
| 12:00 PM | Post #2 — Talk to 'Em / deeper story | 🔴 You |
| 2:00 PM | DM Blitz Round 2 — Warm 100 + Cold 50 | 🔴 You |
| 5:00 PM | Story — BTS or snippet | 🔴 You |
| 8:00 PM | WHEELS DOWN | 🔴 You |

**Also:** SubmitHub/Groover submissions (🔴 You), Soundplate (🔴 You).

---

### PHASE 5: POST-RELEASE COMPOUND (T+1 to T+7)

| Day | Action | Lane |
|-----|--------|------|
| T+1 | Reply to ALL comments. DM sharers/savers. Post #3. | 🔴 You |
| T+3 | Check sends/reach. If ≥3% → $50 Meta boost eligible. | 🟡 AI analyzes, you decide + execute |
| T+5 | Check editorial pitch result. Continue content. | 🔴 You |
| T+7 | Week 1 data review: streams, saves, save rate, playlist adds | 🟡 You screenshot S4A → AI processes |

**Paid ads decision tree:**
- Reel sends/reach ≥ 3% → Meta boost eligible ($50, 3 days)
- 7-day save rate > 3% → Discovery Mode eligible ($0, royalty trade)
- Release week → Marquee eligible ($100 minimum, EP + first vault single only)
- $0.10+ cost-per-stream after 48 hrs → KILL

---

### PHASE 6: COMPLIANCE (Thursday after release)

| Registration | Lane | Notes |
|-------------|------|-------|
| ASCAP | 🟡 Hybrid | AI preps metadata packet. You fill form. |
| MLC | 🟡 Hybrid | Same |
| Songtrust | 🔴 You | Verify admin active |
| SoundExchange | 🔴 You | Verify track registered |
| Musixmatch | 🟡 Hybrid | AI has lyrics. You submit. |

**Time:** 45-60 minutes total. Do NOT attempt before release day.

---

### PHASE 7: DATA (Ongoing)

| Task | Lane | Frequency |
|------|------|-----------|
| S4A screenshots (Overview, Audience, Song) | 🔴 You | Sunday |
| Screenshot processing → catalog_snapshot_log.json | 🟢 AI | After you provide screenshots |
| Popularity score check (Music Stax) | 🔴 You | Sunday |
| Catalog refresh (Spotify API) | 🟢 AI | Biweekly (launchd) |
| Gap report (distance to thresholds) | 🟢 AI | Auto |
| Core Drive synthesis | 🟢 AI | Per new track |
| Weekly monitoring report | 🟡 Hybrid | AI generates from your screenshots |

**Decision-making:** Look at numbers Sunday. If save rate is strong → keep pushing content. If a track is dying → let it go, focus on next. No Python script needed. Your eyes + the spreadsheet.

---

### PHASE 8: SYNC (Parallel, post-EP)

| Task | Lane | Notes |
|------|------|-------|
| One-sheet creation | 🟡 Hybrid | AI generates per-track. You verify. |
| Sync master (-14 LUFS) | 🔴 You | Already exported in Phase 0 |
| Platform submission (Songtradr/Musicbed/Artlist) | 🔴 You | Manual upload |
| Supervisor research | 🟡 Hybrid | AI finds 5 targets + writes 4-sentence pitch emails |
| Pitch emails | 🔴 You | Send from your actual email |

**Setup deadline:** June 30, 2026. One placement ($500-5,000) = 100K-1M stream equivalent.

---

## WEEKLY RHYTHM

### Monday (Business)
| Time | What | Lane |
|------|------|------|
| 6:30 AM | DoorDash primary block | 🔴 |
| 9:00 AM | S4A data check (screenshots) | 🔴 You → 🟢 AI processes |
| 9:15 AM | Business admin (registrations if post-release Thursday fell on weekend) | 🔴 |

### Tuesday (Studio)
| Time | What | Lane |
|------|------|------|
| AM | S-Tier morning (water, breathwork, protein, 90-sec kill list scan) | 🔴 |
| 10:00 AM | Song structure study (20 min) | 🔴 |
| 10:20 AM | Studio: production/record/mix | 🔴 |

### Wednesday (Studio + Community)
| Time | What | Lane |
|------|------|------|
| AM | S-Tier morning | 🔴 |
| 10:00 AM | Studio session | 🔴 |
| 2:00 PM | Community trace — 15 min HARD CAP (reply 3-5 comments, DM 2-3 sharers, comment on 3-5 peers) | 🔴 |

### Thursday (Studio + Compliance)
| Time | What | Lane |
|------|------|------|
| AM | S-Tier morning | 🔴 |
| 10:00 AM | Studio: mixing/mastering | 🔴 |
| PM | If post-release Thursday: registration batch (45-60 min) | 🟡 |

### Friday (Content)
| Time | What | Lane |
|------|------|------|
| AM | S-Tier morning | 🔴 |
| 10:00 AM | Shoot 1-2 content pieces minimum | 🔴 |
| PM | Post content (AI-prepped captions) | 🔴 |

### Saturday (Earn + Maintain)
| Time | What | Lane |
|------|------|------|
| AM | DoorDash morning surge | 🔴 |
| PM | 1 system task max, time-boxed (Oracle check, unfollow audit) | 🟡 |

### Sunday (Rest + Data + Prep)
| Time | What | Lane |
|------|------|------|
| AM | Sleep in | 🔴 |
| 11:00 AM | Grief journaling (20 min) | 🔴 |
| 12:00 PM | S4A screenshots + Music Stax check (40 min) | 🔴 You → 🟢 AI |
| 2:00 PM | Meal prep | 🔴 |
| 3:00 PM | Next-week scan: 3 things on a sticky note | 🔴 |

---

## WHAT AI RUNS WITHOUT YOU (Set and Forget)

| System | What it does | Where |
|--------|-------------|-------|
| Oracle Compass | Release tracking, Kill List, pipeline phases | Vercel (auto-deploy on git push) |
| Catalog refresh | Biweekly Spotify API popularity update | brain/refresh-catalog.mjs via launchd |
| Snapshot processing | Your S4A screenshots → structured data | brain/snapshot_analysis.mjs |
| Cyanite verification | Compares WAV vs. compressed drift | scratch/label_os_automation/tools/cyanite_drift.py |
| Git operations | Commits, pushes, branch management | Antigravity handles |
| Session handoffs | State documentation for next conversation | Claude generates |
| Kill List derivation | Pipeline-derived tasks auto-surface as RED/AMBER/GREEN | lib/killList.ts |

---

## STANDING RULES (Never Drift)

1. Distributor is **Amuse Pro**. Not DistroKid. Never.
2. Genre tagging = **R&B / Alt-R&B**. Never Pop.
3. Compliance happens **Thursday AFTER release**, not before.
4. S4A pitch = **ONE SHOT**. 7+ days before release. Get it right.
5. $0.10+ cost-per-stream after 48 hrs = **KILL** the ad.
6. DoorDash target = **$1,800/month**. Stop running once monthly hit.
7. Community trace = **15 min hard cap**. Set timer. Do not spiral.
8. No new infrastructure. **Use what exists.**
9. Sunday data pull is non-negotiable. **Numbers drive decisions.**
10. Oracle main baselined at **56ba9d1**. v2 is dead.

---

## CURRENT SCHEDULE (May 16, 2026)

| Date | Event | Status |
|------|-------|--------|
| May 16-20 | Studio: record + rough mix GL, SF, WU2 | IN PROGRESS |
| May 21 AM | Final masters (all 3 tracks) | PENDING |
| May 21 night | Upload GL + SF + WU2 + EP entity to Amuse | PENDING |
| May 22 | S4A pitch: Sweet Frustration | PENDING |
| May 22-28 | 8-day content sprint | PENDING |
| **May 29** | **ALL LOVE EP drops** | TARGET |
| Jun 5 | Registration batch (ASCAP/MLC/etc.) | PENDING |
| Jun 5 | Upload "I Like Girls" to Amuse | PENDING |
| Jun 12 | I Like Girls drops (waterfall #1) | PENDING |
| Jun 26 | Like I Did drops (waterfall #2) | PENDING |
| Jul 10 | Worth It drops (waterfall #3) | PENDING |
| Jul 24 | Just Say So drops / CREAM tracklist lock | PENDING |
| Aug 7 | Reconnect drops (waterfall #5) | PENDING |
| Aug 15 | 100-day mark — APG activation threshold | PENDING |

---

## THE COST

**What this system replaces (human team equivalent):** $1,680-3,778/month
**What this system costs you:** $0 marginal (subscriptions you already pay)
**What you actually spend:** $30-78/month (SubmitHub/Groover + software tiers)

---

## THE ONE SENTENCE

> AI is the studio assistant who preps the palette. You are the painter. The moment you ask the assistant to paint, you get C-grade output and waste 4 hours.
