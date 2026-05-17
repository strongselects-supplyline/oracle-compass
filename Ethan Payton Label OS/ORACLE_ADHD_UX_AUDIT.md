# Oracle Compass — ADHD/UX Audit

**Date:** May 11, 2026
**Auditor:** Claude (Opus), Lead Architect
**Trigger:** Ethan: "we should audit the ways that oracle is confusing for audhd purposes/duplicate purposes within the UI and schematic... i just feel its still too much of a maze for Ethan to use"
**Goal:** Make it more functional and less cluttered WITHOUT gutting the substance of the documents referenced.

---

## CURRENT STATE: 11 SCREENS, 15+ DOCTRINE SCROLLS

### Bottom Nav (4 tabs)

| Tab | Route | Purpose |
|-----|-------|---------|
| Pipeline | `/` → `/pipeline` | Daily command center. EP status, countdown, upload task, non-negotiables, morning stack |
| Execute | `/kill` | Track status cards, references, focus setter, anti-drift, DoorDash tracker |
| Body | `/grind` | Sobriety counter, conditioning buttons, recovery protocol |
| War Room | modal | Gateway to 7 sub-pages |

### War Room Sub-Pages (7 routes)

| Page | Route | Purpose |
|------|-------|---------|
| Studio | `/studio` | Release timeline, EP cycle board, project cards, track detail |
| Label | `/label` | Per-release content/ops/sync tracker, video production, content volume |
| Planner | `/planner` | Sprint view, marathon stats, track inventory |
| Brain | `/brain` | Scrolls grid, sovereignty dashboard, trajectory table, recovery protocol |
| Doctrine | `/doctrine` | 15 doctrine entries across 6 categories, each clickable to full scroll page |
| Analytics | `/analytics` | S4A monthly intake form (per-track streaming data) |
| Settings | `/settings` | Theme, export, wipe cache, timezone |

### Doctrine Sub-Pages (15 scroll pages via `/doctrine/[slug]`)

Total reachable screens: **11 pages + 15 doctrine scrolls + `/log` + `/oracle` (orphan routes) = 28 screens**

---

## PROBLEM 1: DUPLICATED WIDGETS

These widgets appear in multiple locations with identical or near-identical functionality.

### Sobriety Counter (2 instances)

- **Body** (`/grind`): Large "39" counter with "Days Sober" label. Source: `getSobrietyDays()` from `lib/sovereignty.ts`
- **Brain** (`/brain`): Identical counter inside Sovereignty Dashboard, same source function. Also has reset button, progress bar, and sobriety reset history.

**Verdict:** Brain's version is the full-featured one (reset, progress, history). Body's is display-only. The ADHD brain sees "39" on Body, taps into Brain, sees "39" again — feels like a maze loop, not progress.

### Recovery Protocol (2 instances)

- **Body** (`/grind`): 6-item checklist (Hydration Reset, NSDR/Yoga Nidra, Off-Grid Window, Nadi Shodhana, Movement Reset, Power Nap)
- **Brain** (`/brain`): Identical "Recovery Protocol" section with same items.

**Verdict:** Pure duplication. No reason for it to exist in both places.

### Track Status (5 locations)

Track phase/status information appears in:

1. **Execute** (`/kill`): Track cards showing phase (MASTER) + checkboxes
2. **Studio** (`/studio`): EP Cycle Board with per-track phase badges (RECORDING/MIXING/DONE)
3. **Planner** (`/planner`): Track Inventory list under ALL LOVE
4. **Label** (`/label`): Track rows with LIVE/LOCKED status badges
5. **Brain** (`/brain`): References track data in sovereignty calculations

**Verdict:** Five views of the same data. Studio is the most useful (visual cycle board). Execute adds actionable checkboxes. The others are redundant for daily use.

---

## PROBLEM 2: MAZE DEPTH

### War Room as Bottleneck

The War Room modal presents 7 equally-weighted icons. For an ADHD user, this creates a **choice paralysis gate**: "Which icon do I need?" There are no descriptions, no indicators of what's inside, no "you should be here" guidance.

Getting from Analytics to Studio requires remembering the War Room exists, opening the modal, then choosing. There's no breadcrumb or "you are here" indicator on any sub-page.

### Doctrine Depth

Doctrine page presents 15 cards. Each card opens a full scroll page. That's a library, not a tool. For reference reading it's fine, but it competes for space in the War Room alongside action-oriented pages (Studio, Label, Analytics).

### Orphan Routes

`/log` and `/oracle` exist as routes but aren't in the nav. Dead ends if bookmarked or linked.

---

## PROBLEM 3: INFORMATION OVERLOAD

### Pipeline Tab (Home)

On first load, the user sees:
- EP status banner + "STUDIO DAY MON. MAY 11"
- Hero upload task
- 4 stat boxes (sovereignty days, days to EP, week number, campaign phase)
- ISRC carry checkbox
- 3 Non-Negotiables (DoorDash, Calisthenics, Tomorrow's task)
- Vocal Codex principle
- Today's One Thing
- Studio Day sequence
- Kill List Clear
- Morning Stack (4 sub-sections: Sovereign, Fuel, Numbers, Journal + 4 checkboxes)

That's **12+ distinct attention targets** on the home screen. The ADHD brain scans them all, processes none, and exits.

### Brain Page

6 Scrolls grid + Sovereignty Dashboard (4 tabs) + Sovereign Trajectory table (6 ranks) + Recovery Protocol = **4 major sections** competing for attention, none of which answer "what do I do right now?"

---

## PROBLEM 4: ADHD-HOSTILE PATTERNS

1. **No clear "DO THIS NOW" dominance.** Pipeline shows many things at equal visual weight. "Today's One Thing" exists but doesn't visually dominate — it's just another card in a stack.

2. **Visible zeros create shame.** Label page shows Content Volume counters at 0/20 (IG Reels), 0/30 (TikToks), 0 (B-Roll). For an ADHD brain already fighting executive function, visible zeros are punishment, not motivation.

3. **No "I'm done" signal.** After completing morning stack or non-negotiables, there's no celebration, no state change, no visual shift. The page looks the same whether you've done everything or nothing.

4. **Sprint Mirror is data noise.** Planner's sprint view shows marathon stats and inventory. This is analyst data, not "what do I do next?" data.

5. **War Room modal blocks flow.** Every time Ethan needs a sub-page, the modal animation is a context-switch tax. ADHD brains lose the thread during transitions.

---

## RECOMMENDATIONS

### TIER 1 — Deduplication (Sonnet-level, immediate)

| # | Change | Files | Impact |
|---|--------|-------|--------|
| 1 | **Remove sobriety counter from Brain.** Keep the full-featured version on Body only. On Brain, replace with a single-line "Day 39" text link to `/grind`. | `app/brain/page.tsx` | Eliminates duplicate, preserves reset functionality on Body |
| 2 | **Remove Recovery Protocol from Brain.** Keep on Body only. Brain should not be an emergency toolkit — Body is. | `app/brain/page.tsx` | Removes ~40 lines of duplicated JSX |
| 3 | **Remove track status from Planner and Label.** Studio's EP Cycle Board is the canonical visual. Execute's checkboxes are the canonical action view. Planner and Label should link to Studio, not repeat it. | `app/planner/page.tsx`, `app/label/page.tsx` | Reduces 5 track-status views to 2 |

### TIER 2 — Hierarchy (design thinking required)

| # | Change | Rationale |
|---|--------|-----------|
| 4 | **Make "Today's One Thing" the HERO on Pipeline.** 3x font size, top of page, everything else below the fold. The ADHD brain gets one clear target on open. | Reduces 12 attention targets to 1 dominant + supporting |
| 5 | **Add 1-line descriptions to War Room icons.** "Studio — track status + cycle board" / "Label — content & ops per release" etc. | Eliminates choice paralysis at the modal |
| 6 | **Collapse Morning Stack into a single expandable section.** Show "Morning Stack (0/4)" as one line. Tap to expand. | Reduces visual noise on Pipeline |
| 7 | **Hide Content Volume counters until content sprint window.** Show only during T-7 to T+7 of a release. Outside that window, show "Content sprint starts [date]" instead of zeros. | Eliminates shame-zeros |

### TIER 3 — Maze Reduction (architecture changes)

| # | Change | Result |
|---|--------|--------|
| 8 | **Merge Studio + Label into one "RELEASE" page.** Studio's cycle board at top, Label's content/ops tracker below. They track the same releases. | War Room: 7 → 6 sub-pages |
| 9 | **Merge Brain into Body + Doctrine.** Brain's 6 Scrolls are doctrine entries (move to Doctrine). Brain's Sovereignty Dashboard is a Body tracker (move to Body). Brain's Trajectory table is a sovereignty metric (move to Body). | War Room: 6 → 5 sub-pages. Brain route becomes redirect to Body. |
| 10 | **Delete orphan routes.** Remove `/log` and `/oracle` pages or redirect to canonical locations. | Eliminates dead ends |
| 11 | **Add breadcrumbs on all War Room sub-pages.** "War Room > Studio" at top of every sub-page, clickable back to the modal or parent. | Reduces "where am I" disorientation |

### TIER 4 — ADHD-Friendly Patterns (enhancement)

| # | Change | Why |
|---|--------|-----|
| 12 | **"Done for Today" button on Pipeline.** When all non-negotiables + morning stack complete, show a green banner: "ALL CLEAR. Go make music." Collapses the checklist section. | Provides completion dopamine hit |
| 13 | **90-second timer on Morning Stack.** Per user's own ADHD protocol: exit signal prevents hyperfocus rabbit holes. Show countdown, gentle pulse at 0. | Already in departments_index.md, not yet in app |
| 14 | **Completion animations on checkboxes.** Brief haptic + visual feedback when checking items. PWA supports this. | Dopamine micro-reward per action |
| 15 | **"You should be here" indicator.** Based on time of day and phase, highlight the War Room icon that's most relevant. Morning → Pipeline. Studio day → Studio. Release week → Label. | Eliminates "which icon?" paralysis |

---

## IMPLEMENTATION PRIORITY

**Do first (Tier 1):** Deduplication. Pure subtraction, no design decisions. Sonnet can execute in one session. Removes the "maze loop" feeling immediately.

**Do second (Tier 2):** Hierarchy changes. Requires reviewing the Pipeline component and making "Today's One Thing" dominant. High impact, moderate effort.

**Do third (Tier 3):** Merge pages. This is architecture work — moving components between routes, updating nav. Worth doing but not urgent.

**Do last (Tier 4):** Enhancements. Nice-to-have dopamine engineering. CREAM phase work.

---

## WHAT NOT TO CUT

The substance is strong. The 15 doctrine scrolls, the sovereignty system, the mixing/vocal codex, the S4A intake form — all of this is valuable. The problem isn't the content; it's that everything is presented at equal volume on equal-depth pages with no hierarchy telling the ADHD brain "this one first."

The goal is: **Ethan opens Oracle → sees ONE thing to do → does it → gets feedback → sees the next thing.** Everything else is reference material that should be 1–2 taps away but never competing with the action.
