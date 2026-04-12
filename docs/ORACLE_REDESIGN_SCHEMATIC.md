# Oracle Compass — Full UX Redesign Schematic
### Through the Lens: "Does this reduce cognitive load and pull Ethan forward automatically?"
**Audit Date:** April 12, 2026 · **Auditor:** Claude Opus (Lead Architect)
**Codebase:** Oracle Compass v23 · Next.js PWA · 12 pages, 17 components, 27 lib modules

---

## EXECUTIVE SUMMARY

Oracle Compass has 12 navigable pages and 2 global overlays. The core problem isn't that any individual page is bad — most are well-built. The problem is **structural**: a person with ADHD opens this app and is presented with a 5-tab bottom nav plus an 8-item overflow menu (13 destinations), most of which contain logging inputs that overlap with each other across pages. The app currently asks Ethan to be his own project manager — to *decide which page to visit*, then *decide what to do on that page*. That's two executive-function decisions before any actual execution begins.

The redesign collapses the app into a **single-stream flow machine** with three operational modes:

1. **Morning Ignition** — Open app → see exactly what to do → tap through it like a checklist → done in 90 seconds
2. **Active Session** — Mid-day, tap the one thing that needs doing → it pulls up context + logging in one view
3. **Evening Closeout** — Review what happened → journal → sync → sleep

Everything else (Studio waterfall, Sonic Identity, Geo map, Label OS, Brain/scrolls, Planner, Velocity) becomes **reference material** accessible only through a "War Room" overflow — not competing for attention in the daily flow.

---

## STRUCTURAL DIAGNOSIS

### What Exists Today (13 destinations)

| # | Page | Nav Position | Primary Function |
|---|------|-------------|------------------|
| 1 | **Home** (`/`) | Bottom: Home | Morning protocol + lane dashboard + logging |
| 2 | **Log** (`/log`) | Bottom: Log | Quick logging (grind + fuel + studio + DD + recalibrate) |
| 3 | **Kill** (`/kill`) | Bottom: Kill | Derived task list with telemetry |
| 4 | **Oracle** (`/oracle`) | Bottom: Oracle | Decree display + action cards + velocity |
| 5 | **Planner** (`/planner`) | More: Plan | 14-week marathon tracker + lane heatmap |
| 6 | **Engine** (`/engine`) | More: Engine | Biz day touches + accounts + content queue |
| 7 | **Studio** (`/studio`) | More: Studio | Waterfall + cycle board + project tracker |
| 8 | **Velocity** (`/velocity`) | More: Flow | Streaming velocity + EP flywheel |
| 9 | **Label** (`/label`) | More: Label | Release queue + 8-tab agent workspace |
| 10 | **Geo** (`/geo`) | More: Geo | Gorilla Geo iframe map |
| 11 | **Grind** (`/grind`) | More: Grind | Sovereignty streak + conditioning + journal |
| 12 | **Brain** (`/brain`) | More: Brain | 6 Scrolls + sovereignty dashboard + phase bar |
| 13 | **Sonic** (`/sonic`) | Via Studio link | Sonic identity data (read-only) |
| — | **Geo Sprint** (`/geo/sprint`) | Via Home link | Audience ledger sprint terminal |
| — | **BrainDump** (overlay) | Floating 🧠 button | Cognitive dump → parse → task extraction |

### The Core Problems Through the ADHD Lens

**Problem 1: Duplicate Logging Surfaces (Willpower Tax)**
The same data entry appears on multiple pages. "One Thing" input exists on Home AND Log. Sovereignty Stack checkboxes exist on Home AND Log AND Grind. DoorDash logging exists on Home AND Log AND Kill List telemetry. Sleep/Pushups exist on Home AND Log AND Grind. This means Ethan has to *remember* where he already logged something, or wonder if he needs to do it again. Each duplicate is a micro-decision that burns executive function.

**Problem 2: 13 Destinations = Decision Paralysis**
The bottom nav has 4 items plus a "More" menu with 8 more items. For ADHD, this is a maze. The question "where do I go?" should never need to be asked. The app should *tell* Ethan where he is and what's next.

**Problem 3: Day-Type Gating is Inconsistent**
Engine locks out on studio days (good). But Home shows BIZ DAY widgets regardless. The protocol steps on Home are collapsed by default — the schedule that should be front and center requires a tap to reveal. Day-type should *shape the entire experience*, not just one page.

**Problem 4: Oracle/Kill List Separation Creates a Loop**
Oracle shows action cards → you clear them → Oracle says "go to Kill List." Kill List shows derived tasks → you clear RED ones → Kill List says "Oracle recalibrating." This back-and-forth between two pages is a classic ADHD trap — context-switching between two views of the same priority system.

**Problem 5: Reference Pages Compete with Action Pages**
Studio, Sonic, Brain, Planner, Velocity, and Geo are primarily *reference* — you read them, you don't *do* things that advance the day. But they sit alongside Kill List and Log in the same nav hierarchy, creating an illusion that visiting them is "doing work." For ADHD, this is a procrastination vector disguised as productivity.

**Problem 6: No Automatic "What's Next?" Transitions**
When you complete the morning protocol, the app doesn't say "protocol done → here's your Kill List." When you finish a Kill List task, it doesn't automatically surface the next one in a focused view. Every transition requires Ethan to *choose* what to do next.

---

## THE REDESIGN SCHEMATIC

### I. NAVIGATION — Collapse to 3 + War Room

**Current:** 4 primary + 8 overflow = 12 visible destinations
**New:** 3 primary + War Room = 3 visible destinations (everything else is tucked away)

```
BOTTOM NAV (3 items):
  [🏠 Today]    [🎯 Execute]    [📊 War Room]
```

#### `Today` (replaces Home)
The single morning view. No navigation decisions. Open app → this is it.

#### `Execute` (merges Kill List + Oracle)
The single "do the work" view. One unified priority stream. No separate Oracle page.

#### `War Room` (replaces "More" menu)
Grid of reference pages. Clearly labeled as "reference, not action." Studio, Velocity, Label, Planner, Geo, Brain, Sonic, Grind — all here, but visually deprioritized.

**Files to edit:**
- `components/BottomNav.tsx` — Rebuild nav to 3 items + War Room overlay
- Remove `/oracle/page.tsx` as standalone page (merge into Execute)
- Remove `/log/page.tsx` as standalone page (merge logging into Today)

---

### II. TODAY PAGE (`/` → `page.tsx`) — The 90-Second Ignition

**Philosophy:** Open the app. See 3 things: (1) your One Thing, (2) the morning checklist, (3) a single CTA to move to Execute. That's it.

#### Section-by-Section Redesign:

**A. REMOVE: "MAKE MODE · Wk X of 5" header**
- Why: Week number is background noise. It doesn't answer "what do I do now?"
- Replace with: Dynamic day-type header that *tells* Ethan what today is. E.g., "STUDIO DAY — April 12" in large, bold text. The day type IS the instruction.

**B. KEEP but ELEVATE: "Today's One Thing"**
- Currently: A card you tap to edit.
- Change: Make it the largest element on the page. If empty, it should feel like the *only* thing on the page — a single input field with the prompt "What's the ONE thing today?" No other content visible until this is set. This is the ignition key.

**C. REMOVE: KPI row (Streak / Release / Fuel)**
- Why: Three numbers that require interpretation. Streak is a glance stat (move to War Room brain page). Release countdown is useful but belongs in Execute context. Fuel score is derived from checkboxes below — showing it before the checkboxes creates cognitive overhead.
- Migrate Streak → Brain/Grind. Release countdown → Execute header. Fuel → implicit from checkbox state.

**D. REMOVE: Weekly Mirror (collapsed by default)**
- Why: It's collapsed. If it's collapsed, Ethan is telling you he doesn't look at it. Historical data is reference, not action. Move to War Room.

**E. REMOVE: Lane Dashboard (6 circles)**
- Why: "Lanes Touched Today" is a monitoring widget, not an action driver. It answers "how am I doing?" not "what do I do next?" For ADHD, monitoring ≠ momentum. It becomes a passive satisfaction widget (or worse, a shame widget when lanes are dim).
- Migrate to: Planner page in War Room.

**F. REMOVE: Audience Ledger Widget (BIZ DAY)**
- Why: Too specific for the daily landing page. Move to Engine or Geo Sprint.

**G. KEEP but REDESIGN: "Need Direction?" Kill List Link**
- Change: Remove the passive question. Replace with an auto-computed CTA: If there are RED tasks, show "3 RED TASKS → EXECUTE" as a full-width button. If no RED, show "KILL LIST CLEAR ✓" as a subtle green banner. No decision needed — the button either exists or it doesn't.

**H. KEEP but AUTO-EXPAND: Protocol Steps**
- Currently: Collapsed behind "show schedule" toggle.
- Change: **Always expanded on morning load** (before 11 AM). Collapsed after 11 AM. The schedule IS the morning. Hiding it behind a toggle means Ethan has to decide to look at his schedule — that's the exact willpower expenditure the app is supposed to eliminate.

**I. REDESIGN: Morning & Grind Logging → "Morning Stack"**
- Currently: CheckItem list with descriptions, sleep/pushups inputs, journal textarea, fuel section, hydration, sync button — all in one massive scrollable section.
- Change: Convert to a **progressive flow**. Show one section at a time with a "Next" button:
  1. **Sovereignty Stack** (4 checkboxes) → tap through → auto-advance
  2. **Fuel** (3 checkboxes + hydration) → tap through → auto-advance
  3. **Numbers** (sleep + pushups in one row) → enter → auto-advance
  4. **Journal** (one textarea) → write → "LOCK IN" button
- Each section auto-collapses when complete and shows a green ✓. This turns the morning from "scroll through a wall of inputs" into "walk through 4 doors."
- Sync to Cloud button fires automatically after "LOCK IN" rather than requiring a separate tap.

**J. MOVE: DoorDash Quick-Add**
- Currently: At the bottom of Home page.
- Move to: Execute page (it's a task, not a morning ritual). Or make it a floating quick-action accessible from any page.

**K. REMOVE: Build stamp**
- Why: Developer metadata. Not for the user. Move to a hidden settings/debug area.

**Files to edit:**
- `app/page.tsx` — Full rewrite
- `components/WeeklyMirror.tsx` — Move to Planner
- `components/CheckItem.tsx` — Keep (reuse in progressive flow)

---

### III. EXECUTE PAGE (`/kill` → replaces Kill + Oracle) — The Unified Priority Stream

**Philosophy:** One page. One question answered: "What do I do next?" The Oracle decree, the Kill List tasks, and the telemetry panel all live here in a single vertical stream.

#### Section-by-Section Redesign:

**A. MERGE: Oracle Decree into Execute Header**
- Currently: Oracle is a separate page showing decree + pillar status + action cards + velocity.
- Change: The decree lives as a **collapsed banner at the top of Execute**. Show severity badge (RED/AMBER/GREEN) + one-line decree message. Tappable to expand full assessment. The Oracle is now the *voice* of the Execute page, not a separate destination.
- Delete: Oracle's "Action Cards" (they duplicate Kill List tasks). Oracle's "Reset" button (creates busywork). Oracle's "Export" button (developer tool, not daily driver).

**B. KEEP: Daily Focus**
- Currently: "What's the one thing?" at top of Kill page.
- Change: If "Today's One Thing" was set on the Today page, **auto-populate** Daily Focus from it. No second input. One source of truth.

**C. KEEP but SIMPLIFY: Anti-Drift Telemetry**
- Currently: SF Mixdown hours, LID Mixdown hours, DoorDash earned — hardcoded to specific tracks.
- Change: Make telemetry **dynamic** — show whatever the current release's key metrics are. After the EP drops, these hardcoded SF/LID references become stale. Pull from `releases.ts` dynamically.
- Also: Move DoorDash "+$20 / +$50 / +$100" buttons here (from Home page). This is where income tracking lives.

**D. KEEP: Needle Tasks ("The Work")**
- This is the best-designed section in the app. Grouped by release, color-coded urgency, expandable how-to instructions. No changes needed except:
- Change: When a Needle group has only 1 remaining task, **auto-expand** that task's how-to. Remove the decision to tap.
- Change: When all Needle tasks are cleared, don't show an empty section — immediately surface Infrastructure with a "maintenance items remaining" callout.

**D2. ADD: Inline Completion Modals (Critical ADHD Pattern)**
- **Problem:** Some Kill List tasks require user input before they can be marked complete (e.g., "Rate today's session quality," "Log DoorDash hours," "Set today's focus"). Currently these tasks have a completion circle that marks them done *without* capturing the data, or worse, they require navigating to a different page to enter the data first. Both are broken flows — one loses data, the other requires context-switching.
- **New Pattern:** Any task that requires input before completion must trigger an **inline modal** when the completion circle is tapped. The modal contains the minimum required inputs (e.g., a 1-5 quality rating, or hours + revenue fields). Submitting the modal does two things in one gesture: (1) logs the data to the appropriate store, and (2) marks the task complete with the clearing animation. One tap → one modal → one submit → done.
- **Implementation:** Add a `completionInput` field to `KillTask` in `lib/killList.ts`. When present, it defines the modal type (`rating`, `number`, `doordash`, `text`, etc.) and the store target. The `TaskRow` component in `app/kill/page.tsx` checks for `completionInput` — if present, tapping the completion circle opens the modal instead of immediately completing. The modal's submit handler calls the task's `completeTask()` AND writes the input data.
- **Examples of tasks that need this:**
  - "Rate session quality" → 1-5 tap rating modal
  - "Log DoorDash shift" → hours + revenue modal (same as current DD quick-add)
  - "Log studio hours" → track selector + hours + phase modal
  - "Set today's focus" → text input modal
  - Any telemetry-linked task (DD earned, mixdown hours) → number input modal

**Files to edit (for D2):**
- `lib/killList.ts` — Add `completionInput?: { type: string; storeTarget: string; label: string }` to `KillTask` type. Populate on derivation for input-requiring tasks.
- `app/kill/page.tsx` — Add `CompletionModal` component. Modify `TaskRow` to check for `completionInput` and route tap accordingly. Modal submit calls `completeTask()` + writes data.

**E. KEEP but ENHANCE: Infrastructure (collapsed)**
- Good that it's collapsed. Add: a count of "quick wins" (tasks with ≤2 how-to steps) to encourage clearing them.

**F. ADD: "What's Next?" Auto-Routing**
- When all tasks are cleared, instead of the current "Kill list clear / Execute freely" message, show:
  - If there are unlogged studio sessions → "Log your studio session" CTA
  - If it's past 5 PM and DoorDash hasn't been logged → "Log DoorDash" CTA
  - If morning protocol isn't done → "Complete morning stack" CTA (link back to Today)
  - If nothing → "All clear. Rest or create freely." (the only acceptable dead-end)

**G. MERGE: Oracle Velocity Summary into Execute**
- Currently: On Oracle page as "Execution Velocity."
- Move to: Bottom of Execute page, collapsed. Shows week-over-week task completion trend.

**H. MERGE: Oracle System Snapshot into Execute**
- Currently: On Oracle page as "System Snapshot" (Core Drive, Income Bridge, Campaign Kit, Mixdown Engine).
- Move to: Bottom of Execute page, collapsed. Only show items that are NOT complete (filter out green ✓ items — they're noise once done).

**Files to edit:**
- `app/kill/page.tsx` — Expand to absorb Oracle decree + telemetry merge
- `app/oracle/page.tsx` — **Delete or redirect to /kill**
- `lib/killList.ts` — Add "quick win" count derivation
- `components/BottomNav.tsx` — Route "Execute" to /kill

---

### IV. WAR ROOM (`/warroom` or overlay) — Reference Grid

**Philosophy:** Everything that isn't "what do I do right now?" lives here. Clearly labeled. No urgency signals. No notification dots.

#### Layout:
A full-screen grid of cards, each with an icon, name, and one-line description. Grouped into two rows:

**Row 1: Creative Intelligence**
- 🎤 Studio (waterfall + cycles + sessions)
- 📈 Velocity (streaming momentum)
- 🎧 Sonic (identity data)
- 🏷️ Label (release ops)

**Row 2: Systems & Reference**
- 📋 Planner (marathon tracker + lane heatmap + Weekly Mirror)
- ⚙️ Engine (biz touches + content queue)
- 💪 Grind (streak + conditioning + recovery)
- 🧠 Brain (scrolls + sovereignty + metacognition)
- 🗺️ Geo (map)

**Key change:** Remove ALL notification dots from War Room items. These dots on Engine, Plan, and Label currently create false urgency that pulls attention away from Execute.

**Files to edit:**
- `components/BottomNav.tsx` — Replace "More" menu with War Room grid
- No page changes needed — War Room just re-routes to existing pages

---

### V. LOG PAGE (`/log`) — DEPRECATE AS STANDALONE

**Problem:** Log duplicates almost everything from Home (One Thing, Grind checkboxes, Fuel, Sleep, Pushups, DoorDash) and adds studio track logging + Oracle recalibration. It exists because Home was getting too long.

**Solution:** The progressive flow on Today (see section II.I) eliminates the need for a separate Log page. Studio track logging moves to the Studio page in War Room. Oracle recalibration moves to Execute page (replaces the manual button with automatic background recalibration — which OracleTrigger.tsx already does on app open).

**What to preserve:**
- The **Recalibrate** button concept — but move it to Execute page as a "🔮 Ask Oracle" button at the bottom. Not prominent. Used only when Ethan actively wants a re-read.
- **Studio Track Log** — move to Studio page.

**Files to edit:**
- `app/log/page.tsx` — **Delete or redirect to /**
- Move studio session logging to `app/studio/page.tsx`
- Move recalibrate button to `app/kill/page.tsx` (Execute)

---

### VI. GRIND PAGE (`/grind`) — KEEP but REFOCUS

**Current state:** Duplicate of morning logging + conditioning types + recovery protocol.
**New role:** **Recovery & Performance** page in War Room. Strip all duplicate logging (sovereignty stack, sleep, pushups, journal — all now on Today). Keep:
- Sobriety streak (large, motivational)
- Performance Conditioning type selector + minutes
- Recovery Protocol checklist (valuable when depleted)
- Sync to Cloud

This page becomes the "I'm depleted, what do I do?" emergency reference.

**Files to edit:**
- `app/grind/page.tsx` — Remove duplicate logging, keep conditioning + recovery

---

### VII. ENGINE PAGE (`/engine`) — KEEP but CLEAN

**Current state:** Biz-day gated. Touches counter, top 3 accounts, content queue, protocol stack (hardcoded health tips).

**Changes:**
- REMOVE: "Engine Protocol Stack" (hardcoded health advice about creatine, BPA, visceral fat). This is static reference material that doesn't change. It's filling space. Move to Brain page or remove entirely.
- KEEP: Touches counter, accounts, content queue — these are active biz-day tools.
- ADD: DoorDash quick-add here (for biz days when the income grind is Track 1).

**Files to edit:**
- `app/engine/page.tsx` — Remove protocol stack, add DD quick-add

---

### VIII. STUDIO PAGE (`/studio`) — KEEP + ADD SESSION LOGGING

**Current state:** Great reference page. Waterfall, cycle board, project blocks, track list, session counter, creator code, sonic identity link.

**Changes:**
- ADD: Studio session logging (moved from Log page). The track selector + hours + phase selector + submit button. This is where it belongs — in the context of the studio view.
- REMOVE: "Creator Code" section (hardcoded motivational quotes from R&B Money). This is Brain page material. On Studio, it's a scroll trap.
- KEEP everything else.

**Files to edit:**
- `app/studio/page.tsx` — Add studio session logging, remove Creator Code

---

### IX. BRAIN PAGE (`/brain`) — KEEP AS-IS

The Brain page is correctly positioned as deep reference. The 6 Scrolls, Sovereignty Dashboard, phase bar, mixing ladder, vocal codex, and metacognition panel are all read-only reference materials. No changes needed. This is a page Ethan visits with intention, not one the app should push him toward.

---

### X. LABEL PAGE (`/label`) — KEEP but HIDE UNTIL NEEDED

**Current state:** Release queue with per-track agent workspace (8 tabs: Rollout, Content, Subs, Copy, Ops, Creative, A&R, Vault).

**Problem:** The 8-tab system within each expanded release is a cognitive maze. Most of these tabs are relevant only during specific sprint phases.

**Changes:**
- DEFAULT STATE: Only show Content and Ops tabs (the two most frequently needed). Other tabs accessible through a "More Tools" expander.
- SMART DEFAULT TAB: Auto-select the tab most relevant to the current sprint phase. During upload week → Subs. During content sprint → Content. During compliance window → Ops.

**Files to edit:**
- `app/label/page.tsx` — Reduce default-visible tabs, add smart tab selection

---

### XI. VELOCITY PAGE (`/velocity`) — KEEP AS-IS

Well-designed reference page. EP Flywheel visualization is excellent. Stream logging modal is clean. No changes needed. This is a page Ethan visits with intention after checking Spotify for Artists.

---

### XII. PLANNER PAGE (`/planner`) — ABSORB WEEKLY MIRROR + LANE HEATMAP

**Changes:**
- ADD: Weekly Mirror widget (moved from Home). This is where historical performance review belongs.
- KEEP: Lane Heatmap (already here). Marathon tracker. Sprint plan matrix.
- This becomes the "how am I doing over time?" reference page.

**Files to edit:**
- `app/planner/page.tsx` — Add WeeklyMirror component

---

### XIII. GEO + GEO SPRINT — KEEP AS-IS

Geo is an iframe to the Gorilla Geo map. Sprint terminal is the audience ledger. Both are specialized tools accessed with intention. No changes needed.

---

### XIV. GLOBAL COMPONENTS

#### A. BrainDumpInput (Floating 🧠 Button)
**KEEP.** This is excellent ADHD design — a single button that captures unstructured thought and converts it to actionable tasks. No changes needed.

#### B. OracleTrigger (Background Auto-Fire)
**KEEP.** Silent background Oracle calibration on first daily open. Works perfectly. No changes needed.

#### C. ThemeProvider
**KEEP.** Light/dark/auto mode. No changes needed.

---

### XV. DATA FLOW CHANGES

#### A. One Thing → Single Source of Truth
Currently: `page.tsx` sets `log.oneThing`, Kill page has a separate `daily_focus` store value.
Change: Kill page reads `log.oneThing` directly. One input, one value, one truth.

**Files to edit:**
- `app/kill/page.tsx` — Read `oneThing` from `getDailyLog()` instead of separate store
- `lib/db.ts` — No changes needed (DailyLog already has `oneThing`)

#### B. Oracle Auto-Recalibration on Task Clear
Currently: Kill page triggers `recalibrateOracle(true)` when all RED tasks clear.
Change: Also trigger recalibration when the *last* task of any urgency clears (full Kill List clear). And surface the decree inline rather than requiring navigation to Oracle page.

**Files to edit:**
- `app/kill/page.tsx` — Show decree inline after recalibration

#### C. Lane Dashboard → Planner Only
Currently: Lanes are computed and shown on Home.
Change: Remove from Home. Lanes still compute (for Oracle context) but only display on Planner.

**Files to edit:**
- `app/page.tsx` — Remove lane dashboard section
- `app/planner/page.tsx` — Add lane dashboard display

---

## IMPLEMENTATION PRIORITY ORDER

Execute in this order. Each step is independently deployable.

### Phase 1: Kill the Duplicates (Highest Impact, Lowest Risk)
1. **Merge One Thing**: Kill page reads from `log.oneThing` instead of separate `daily_focus` store
2. **Remove duplicate logging from Home**: Strip grind checkboxes, fuel section, sleep/pushups from Home's current flat layout. Replace with progressive flow.
3. **Remove Log page**: Redirect `/log` to `/`. Move studio session logging to Studio page. Move recalibrate button to Kill page.

### Phase 2: Inline Completion Modals + Restructure Navigation
4. **Inline Completion Modals**: Add `completionInput` to KillTask. Build CompletionModal component. Wire TaskRow to open modal on tap for input-requiring tasks. One gesture → data logged + task cleared.
5. **Collapse BottomNav**: 3 items (Today / Execute / War Room). War Room replaces "More" menu.
6. **Merge Oracle into Execute**: Decree as collapsible header on Kill page. Delete Oracle standalone page.
7. **Remove notification dots from War Room items**: Engine, Plan, Label lose their nav dots.

### Phase 3: Progressive Morning Flow
8. **Rebuild Home as progressive flow**: 4-step morning stack (Sovereignty → Fuel → Numbers → Journal) with auto-advance.
9. **Auto-expand protocol steps before 11 AM**: Remove collapsed default.
10. **Remove Weekly Mirror, Lane Dashboard, KPI row from Home**: Move to Planner.

### Phase 4: Polish
11. **Label tab reduction**: Default to Content + Ops. Smart tab selection.
12. **Engine cleanup**: Remove protocol stack, add DD quick-add.
13. **Studio enhancement**: Add session logging, remove Creator Code.
14. **Grind refocus**: Strip duplicate logging, keep conditioning + recovery.

---

## METRICS OF SUCCESS

After this redesign:

- **Decision points to start the day**: Currently ~5 (which page? what section? what to log first? where did I already log this?). Target: **0** (open app → progressive flow starts automatically).
- **Pages in primary nav**: Currently 4 + 8 overflow. Target: **3** (Today, Execute, War Room).
- **Duplicate logging surfaces**: Currently 3-4 copies of morning data. Target: **1** (Today page only).
- **Taps to reach "what should I do next?"**: Currently 2-3 (open app → navigate to Kill or Oracle → scan). Target: **1** (open app → if morning done, auto-shows Execute CTA).
- **Time from app open to first productive action**: Currently undefined (depends on navigation choices). Target: **under 90 seconds** (progressive flow completes morning stack, then Execute CTA appears).

---

*This schematic covers every page, every component, every flow, and every data dependency. Ready for Sonnet execution on your approval.*
