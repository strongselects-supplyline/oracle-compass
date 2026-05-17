# SONNET ORACLE FIX SPEC — May 17, 2026
## Verified by Opus. Only contains REMAINING work.

---

## CONTEXT FOR SONNET

You are editing the Oracle Compass codebase. The repo lives at:
`/Users/ethanpayton/Desktop/oracle-compass-full/`
(or wherever Ethan has it checked out — confirm before editing)

Remote: `github.com/strongselects-supplyline/oracle-compass`
Branch: `main` (baselined at 56ba9d1, May 12)

**Canonical release dates** (from `lib/releases.ts` v40 — DO NOT CHANGE releases.ts):

| Track | Drop Date | RELEASE_DATA |
|-------|-----------|-------------|
| SEE ME | Mar 13 (LIVE) | Line ~172 |
| East Side Love | May 8 (LIVE) | Line ~177 |
| ALL LOVE EP | **May 29** | Line ~182 |
| I Like Girls | **Jun 12** | Line ~187 |
| Like I Did | **Jun 26** | Line ~192 |
| Worth It | **Jul 10** | Line ~197 |
| Just Say So | **Jul 24** | Line ~202 |
| Reconnect | **Aug 7** | Line ~207 |

---

## TASK 1: REBUILD phaseMap.ts LIFECYCLE BLOCKS (CRITICAL)

**File:** `lib/phaseMap.ts`
**Lines:** ~101–179 (everything after EP release day entries)
**Status:** BROKEN — verified by Opus

### What's Wrong

The phaseMap has **4 vault singles** (ILG → WI → JSS → RCN) at 14-day cadence starting Jun 13.

It should have **5 vault singles** (ILG → LID → WI → JSS → RCN) at 14-day cadence starting Jun 12.

Specific errors:
1. **LID is completely missing** from the waterfall. No Jun 26 release day entry exists.
2. **ILG drops Jun 13** in phaseMap but **Jun 12** in releases.ts (off by 1 day).
3. **"Like I Did Live" phase label at May 31** is misnamed — this is actually EP compound / ILG pre-release period. LID doesn't drop until Jun 26.
4. **WI drops Jun 27** — should be **Jul 10** (off by 13 days).
5. **JSS drops Jul 11** — should be **Jul 24** (off by 13 days).
6. **RCN drops Jul 25** — should be **Aug 7** (off by 13 days).
7. All `dropDate` references in lifecycle entries point to wrong next-release dates.

### What To Do

**Approach: Manual rewrite of lifecycle blocks.** Same flat-object architecture. Do NOT build a dynamic phase engine — that's post-EP work.

Rebuild lines ~101–179+ with correct 14-day lifecycle blocks for each vault single. Each lifecycle follows this 14-day template:

```
Day 0:  RELEASE DAY (badge: Release, red)
Day 1:  POST-RELEASE (badge: Momentum, red)
Day 2:  SUNDAY DATA (badge: Data, blue) — or appropriate day label
Day 3:  DM FOLLOW-UP (badge: Data, blue)
Day 4:  DATA PULL (badge: Data, blue) — 3-day save rate check
Day 5:  COMPOUND (badge: Sustain, gold)
Day 6:  COMPLIANCE (badge: Compliance, purple) — Thursday registrations
Day 7:  SYNC (badge: Sustain, gold)
Day 8:  PRE-SAVE PREP (badge: Content, gold) — overlap with next pre-release
Day 9:  SUNDAY (badge: Sunday, purple) — grief journal
Day 10: PITCH (badge: Pitch, blue) — editorial pitch
Day 11: WORLD-BUILDING (badge: Content, gold)
Day 12: CONTENT (badge: Content, gold) — DM prep
Day 13: EVE OF RELEASE (badge: Eve, orange)
```

**Correct sequence to build:**

| Block | Start Date | Release Day | `dropLabel` points to | `dropDate` |
|-------|-----------|-------------|----------------------|-----------|
| EP compound / ILG pre-release | May 30 | — | "Days to ILG" | 2026-06-12 |
| ILG lifecycle | Jun 12 | Jun 12 | "Days to LID" | 2026-06-26 |
| LID lifecycle | Jun 26 | Jun 26 | "Days to WI" | 2026-07-10 |
| WI lifecycle | Jul 10 | Jul 10 | "Days to JSS" | 2026-07-24 |
| JSS lifecycle | Jul 24 | Jul 24 | "Days to RCN" | 2026-08-07 |
| RCN lifecycle | Aug 7 | Aug 7 | "Days to CREAM" | 2026-10-23 |

**Phase naming:**
- May 30 – Jun 11: phase = "EP Compound" (NOT "Like I Did Live")
- Jun 12: phase = "I Like Girls Drops"
- Jun 13–25: phase = "I Like Girls Live" then "Next Single Pre-Release"
- Jun 26: phase = "Like I Did Drops"
- Jun 27 – Jul 9: phase = "Like I Did Live" then "Next Single Pre-Release"
- Jul 10: phase = "Worth It Drops"
- (continue pattern through RCN)

**Arc assignments:**
- May 30 – Jun 25: arc = "2" (ILG cycle)
- Jun 26 – Jul 9: arc = "2" (LID cycle — still vault singles era)
- Jul 10+: arc = "3" (latter half of waterfall)

**NN assignments:** Keep existing pattern — `ARC2_NN` for active days, `FLATLINE_NN` for rest/transition days, `ARC3_NN` for arc 3.

**Deliverable text in each entry:** Match the existing pattern but update track names. Example for LID Day 4: `"3-day save rate check (target 3%+). Record Worth It"` — the "Record [next track]" portion should reference the NEXT track in the waterfall.

**Special date overrides to preserve:**
- Jul 10 = CREAM DECISION (line ~152 comment — keep this)
- Jul 17 = 90-DAY REVIEW (line ~161 comment — keep this)

### Verification

After rebuilding, grep for every canonical date and confirm:
```bash
grep "2026-06-12" lib/phaseMap.ts  # ILG drops
grep "2026-06-26" lib/phaseMap.ts  # LID drops (MUST EXIST — currently missing)
grep "2026-07-10" lib/phaseMap.ts  # WI drops
grep "2026-07-24" lib/phaseMap.ts  # JSS drops
grep "2026-08-07" lib/phaseMap.ts  # RCN drops
```

All five must return release day entries. Currently only ILG has one (and it's wrong by 1 day).

---

## TASK 2: REMOVE isPhase1 DEAD CODE

**Status:** STILL BROKEN — verified by Opus

### killList.ts

**File:** `lib/killList.ts`
**Line 1365:** `const isPhase1 = now < new Date("2026-05-15T00:00:00");`

This is permanently `false` (May 15 has passed). It gates DoorDash sprint logic.

**What to do:**
1. Delete line 1365 (`const isPhase1 = ...`)
2. Line 1373: Replace `isPhase1 ? \`DD Morning Sprint — 6:30-9 AM (only block today)\` : \`DD Morning Sprint — 6:30-9 AM\`` with just `\`DD Morning Sprint — 6:30-9 AM\``
3. Line 1374: Replace `ddDailyTarget * (isPhase1 ? 1.0 : 0.2)` with `ddDailyTarget * 0.2`
4. Lines 1375-1385: Delete the `isPhase1 ? [...]` branch entirely, keep only the `else` array:
   ```typescript
   howTo: [
     "Quick 1-hour burst before your stack. ~$25 net.",
     "Breakfast rush = high tips. Stay in a tight radius.",
     "You only need 2 of 3 sprints to hit daily pace.",
     "Tap ✓ when this sprint is done.",
   ],
   ```
5. Line 1394: Change `if (!isPhase1) {` to remove the conditional — the midday sprint block should always be included (unwrap the if block, keep the contents)
6. Line 1417: Same — unwrap `if (!isPhase1) {` for evening sprint block
7. Delete corresponding closing braces for both unwrapped if blocks
8. Update the comment at line 1363-1364 — delete both Phase 1/Phase 2 comment lines

### page.tsx

**File:** `app/page.tsx`
**Line 62:** `...(!isPhase1 ? [{ icon: "📱", action: "Post content from STUDIO queue", tab: "studio" }] : []),`

`isPhase1` is **never defined** in this file — it's `undefined`, so `!isPhase1` is always `true`. The content step always shows. This is dead conditional logic.

**What to do:**
Replace line 62 with:
```typescript
{ icon: "📱", action: "Post content from STUDIO queue", tab: "studio" },
```

No spread, no ternary. Just the object directly in the array.

---

## TASK 3: REPO HYGIENE (LOW PRIORITY)

### NOTEBOOK_LM_UPLOAD directory

**Location:** Root-level `NOTEBOOK_LM_UPLOAD/` folder
**Status:** Contains `kill_list_logic.txt` — a stale copy of killList.ts with old isPhase1 date ("2026-05-09")
**Action:** Delete the entire `NOTEBOOK_LM_UPLOAD/` directory. It's a one-time export that's now stale and shouldn't be in the repo.

### _git_push.sh

**Location:** Root-level `_git_push.sh`
**Status:** References isPhase1 in its commit message (line 33). If this is a one-time push script, delete it. If it's a reusable helper, update the commit message.

### "Ethan Payton Label OS" directory in repo

**Location:** Root-level `Ethan Payton Label OS/` inside the Oracle repo
**Status:** Contains specs and audit docs (like `SONNET_PIPELINE_SPINE_SPEC.md`, `SONNET_UX_AUDIT_MAY8.md`). These are operational docs, not app code.
**Action:** Move to `docs/specs/` or delete from repo (they live in the brain/ filesystem anyway).

---

## WHAT ANTIGRAVITY CLAIMED THAT IS ALREADY FIXED

Do NOT re-do these — they are already correct in the codebase:

1. **killList.ts contentSprintDates** — ALREADY CORRECT. EP May 29, ILG Jun 12, LID Jun 26, WI Jul 10, JSS Jul 24, RCN Aug 7. Lines 397-405 match releases.ts.

2. **phaseMap.ts duplicate keys for May 17-30** — ALREADY REMOVED. Lines 104-107 are now comments noting the cleanup. No duplicate key collision exists.

3. **"Ghost folder"** — DOES NOT EXIST. No `/ghost/` directory found anywhere in the repo.

4. **public/crm/ directory** — Grep found a reference but glob found no files. May have already been cleaned. Verify before acting.

---

## EXECUTION ORDER

1. **Task 1 first** (phaseMap rebuild) — this is the highest-impact fix. The app shows wrong dates and wrong release sequence for the next 3 months.
2. **Task 2 second** (isPhase1 cleanup) — dead code removal, lower risk.
3. **Task 3 last** (repo hygiene) — nice-to-have, no user impact.

## GIT

After all changes:
```bash
git add -A
git commit -m "fix: rebuild phaseMap lifecycle to match releases.ts waterfall, remove isPhase1 dead code"
git push origin main
```

Vercel auto-deploys on push.

---

## DO NOT

- Touch `lib/releases.ts` — it is correct
- Touch `lib/killList.ts` contentSprintDates (lines 397-405) — already correct
- Build a dynamic phase engine — same architecture, just correct data
- Add Supabase, cloud sync, or any new infrastructure
- Create new routes or components
