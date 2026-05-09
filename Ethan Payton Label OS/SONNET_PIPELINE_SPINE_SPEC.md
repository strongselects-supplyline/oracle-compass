# ORACLE COMPASS — PIPELINE SPINE REWIRE
## Sonnet Execution Spec · May 9, 2026
**Author:** Opus (architecture decision + full schematic)
**For:** Sonnet via Antigravity terminal push
**Baseline:** Commit after `1fcdc93` (whatever HEAD is at push time)

---

## THESIS

Oracle Compass was built department-out (Health, Content, Social, Marketing, Revenue) and calendar-out (phaseMap.ts maps ISO dates to day plans). But the actual execution that impacts the real world is the **per-release pipeline**: idea → master → upload → sprint → compound → sync. The pipeline is the spine. Everything else hangs off it.

This spec adds the pipeline as Oracle's primary navigation paradigm. No rebuild. No fork. Wire the pipeline into the existing infrastructure.

---

## ARCHITECTURE DECISION

**Keep:** IndexedDB layer (db.ts), releases.ts data model, Kill List derivation engine, cloud sync, PWA manifest, Vercel deploy, War Room + doctrine scrolls, Body/grind page.

**Add:** `lib/pipeline.ts` (pipeline definition + state), `app/pipeline/page.tsx` (pipeline dashboard — new home page).

**Modify:** `components/BottomNav.tsx` (TODAY → PIPELINE), `lib/releases.ts` (add `pipelineState` to Release type + bump version), `lib/killList.ts` (add pipeline-derived tasks to existing derivation).

**Do NOT touch:** `lib/phaseMap.ts`, `lib/departments/*.ts`, `app/kill/page.tsx` UI, `app/grind/page.tsx`, War Room internals, `lib/doctrineContent.tsx`, `lib/streaks.ts`.

---

## FILE 1: `lib/pipeline.ts` (NEW — ~200 lines)

This is the pipeline definition and state manager. The pipeline is the same for every release. Per-release state is stored in `releases.ts` via a new `pipelineState` field.

```typescript
// lib/pipeline.ts
// Per-release pipeline definition. Every release goes through these phases.
// State is stored per-release in releases.ts pipelineState field.

import { getDynamicReleases, saveDynamicReleases, Release } from "@/lib/releases";

// ── Pipeline Definition ──────────────────────────────────────────────

export type PipelineStep = {
  id: string;         // "0.1", "1.3", etc.
  label: string;      // Short action label
  doneWhen: string;   // Completion criteria
  tools?: string;     // Tools used (display only)
};

export type PipelinePhase = {
  id: number;
  name: string;
  color: string;       // Phase accent color
  icon: string;        // Emoji
  steps: PipelineStep[];
};

export const PIPELINE_PHASES: PipelinePhase[] = [
  {
    id: 0, name: "CREATION", color: "#C9A84C", icon: "🎹",
    steps: [
      { id: "0.1", label: "Idea capture", doneWhen: "Idea exists in any form", tools: "Voice memo / FL Studio" },
      { id: "0.2", label: "Production topline", doneWhen: "Instrumental plays start to finish", tools: "FL Studio" },
      { id: "0.3", label: "Re-production (refine)", doneWhen: "Beat is release quality", tools: "FL Studio" },
      { id: "0.4", label: "Recording", doneWhen: "All vocal takes captured", tools: "FL Studio" },
      { id: "0.5", label: "Rough vocal mix", doneWhen: "Clean vocal comp baked (de-breath, AT Pro graph, comp)", tools: "FL Studio + Auto-Tune Pro" },
      { id: "0.6", label: "Rough mixing", doneWhen: "Plays well on phone + car", tools: "FL Studio" },
      { id: "0.7", label: "Cyanite analysis", doneWhen: "Genre/mood scores logged", tools: "Cyanite" },
      { id: "0.8", label: "Second draft", doneWhen: "Adjustments applied or rejected", tools: "FL Studio" },
      { id: "0.9", label: "Final mix / polish", doneWhen: "Mix is final", tools: "FL Studio" },
      { id: "0.10", label: "Master", doneWhen: "-6 LUFS streaming + -14 LUFS sync exported", tools: "FL Studio (Illangelo chain)" },
    ],
  },
  {
    id: 1, name: "PRE-UPLOAD", color: "#22c55e", icon: "📦",
    steps: [
      { id: "1.1", label: "Cover art", doneWhen: "Final PNG exported (3000x3000+)", tools: "Photopea" },
      { id: "1.2", label: "Spotify Canvas", doneWhen: "MP4 under 20MB, loops clean", tools: "Photopea → CapCut" },
      { id: "1.3", label: "Metadata prep", doneWhen: "Title, genre (R&B not Pop), ISRC, date ready", tools: "—" },
      { id: "1.4", label: "Upload to Amuse", doneWhen: "Amuse confirms Processing", tools: "Amuse" },
      { id: "1.5", label: "Pull ISRC", doneWhen: "ISRC saved to releases.ts + catalog matrix", tools: "Amuse → Oracle" },
      { id: "1.6", label: "Update Oracle", doneWhen: "releases.ts status = upload_pending, dates verified", tools: "Oracle Compass" },
    ],
  },
  {
    id: 2, name: "PRE-RELEASE", color: "#8B5CF6", icon: "📡",
    steps: [
      { id: "2.1", label: "Batch content prep", doneWhen: "5-7 content pieces shot/captured", tools: "Phone + CapCut" },
      { id: "2.2", label: "Editorial pitch", doneWhen: "Submitted via Spotify for Artists", tools: "Spotify for Artists" },
      { id: "2.3", label: "Pre-save link", doneWhen: "Link live, in IG bio", tools: "Amuse / linkfire" },
      { id: "2.4", label: "Teaser post (T-5)", doneWhen: "15-sec clip posted IG + TikTok + Shorts", tools: "CapCut → IG" },
      { id: "2.5", label: "World build post (T-3)", doneWhen: "Aesthetic post live", tools: "IG" },
      { id: "2.6", label: "Announce + cover reveal (T-1)", doneWhen: "Cover art + date + pre-save CTA posted", tools: "IG" },
      { id: "2.7", label: "DM blitz prep", doneWhen: "Core 50 / Warm 100 / Cold 50 messages drafted", tools: "Notes" },
    ],
  },
  {
    id: 3, name: "RELEASE DAY", color: "#FF2D2D", icon: "🔥",
    steps: [
      { id: "3.1", label: "Release announcement", doneWhen: "Reel or carousel posted", tools: "IG" },
      { id: "3.2", label: "Upload Canvas", doneWhen: "Canvas live on Spotify", tools: "Spotify for Artists" },
      { id: "3.3", label: "DM blitz", doneWhen: "All 3 tiers sent", tools: "IG DMs" },
      { id: "3.4", label: "Story blitz", doneWhen: "3-5 stories posted throughout day", tools: "IG Stories" },
      { id: "3.5", label: "Update IG bio link", doneWhen: "Bio link points to new release", tools: "IG" },
      { id: "3.6", label: "Oracle status → live", doneWhen: "releases.ts status = live", tools: "Oracle Compass" },
    ],
  },
  {
    id: 4, name: "COMPOUND", color: "#3ECF71", icon: "📈",
    steps: [
      { id: "4.1", label: "T+1 momentum post", doneWhen: "Second content piece posted (different angle)", tools: "IG" },
      { id: "4.2", label: "T+1 community trace", doneWhen: "Replied to comments, DM'd sharers (15 min timer)", tools: "IG" },
      { id: "4.3", label: "T+3 compound post", doneWhen: "Third content piece posted", tools: "IG" },
      { id: "4.4", label: "T+3 data pull", doneWhen: "72-hr streams, saves, save rate, playlists logged", tools: "Spotify for Artists" },
      { id: "4.5", label: "Paid trigger check", doneWhen: "Meta/Marquee/Discovery decision made based on data", tools: "Meta Ads / Spotify" },
      { id: "4.6", label: "Compliance Thursday", doneWhen: "ASCAP + MLC + Songtrust registered", tools: "ASCAP / MLC / Songtrust" },
      { id: "4.7", label: "T+7 data review", doneWhen: "Week 1 full data pull. Save rate assessed.", tools: "Spotify for Artists" },
      { id: "4.8", label: "Catalog refresh", doneWhen: "refresh-catalog.mjs run, matrix updated", tools: "Oracle / brain" },
    ],
  },
  {
    id: 5, name: "SYNC PREP", color: "#60A5FA", icon: "🎬",
    steps: [
      { id: "5.1", label: "Export stems", doneWhen: "Vocals, drums, bass, melodic, FX exported at -14 LUFS", tools: "FL Studio" },
      { id: "5.2", label: "Instrumental render", doneWhen: "Full instrumental mastered", tools: "FL Studio" },
      { id: "5.3", label: "One-sheet", doneWhen: "PDF/PNG with BPM, key, mood, genre, contact, PRO", tools: "Photopea" },
      { id: "5.4", label: "Platform submission", doneWhen: "Uploaded to Songtradr / Musicbed / Artlist", tools: "Sync platforms" },
    ],
  },
];

// ── Total step count (for progress bars) ──
export const TOTAL_PIPELINE_STEPS = PIPELINE_PHASES.reduce((sum, p) => sum + p.steps.length, 0);

// ── State helpers ─────────────────────────────────────────────────────

export type PipelineState = Record<string, boolean>; // step ID → done

export function getCompletedCount(state: PipelineState): number {
  return Object.values(state).filter(Boolean).length;
}

export function getCurrentPhase(state: PipelineState): PipelinePhase {
  for (const phase of PIPELINE_PHASES) {
    const allDone = phase.steps.every(s => state[s.id] === true);
    if (!allDone) return phase;
  }
  return PIPELINE_PHASES[PIPELINE_PHASES.length - 1]; // all complete
}

export function getNextStep(state: PipelineState): PipelineStep | null {
  for (const phase of PIPELINE_PHASES) {
    for (const step of phase.steps) {
      if (!state[step.id]) return step;
    }
  }
  return null; // all done
}

export function isPhaseComplete(state: PipelineState, phaseId: number): boolean {
  const phase = PIPELINE_PHASES.find(p => p.id === phaseId);
  if (!phase) return false;
  return phase.steps.every(s => state[s.id] === true);
}

// ── Persistence (writes through to releases.ts) ──────────────────────

export async function togglePipelineStep(releaseTitle: string, stepId: string): Promise<void> {
  const releases = await getDynamicReleases();
  const idx = releases.findIndex(r => r.title === releaseTitle);
  if (idx === -1) return;

  const release = releases[idx];
  const state = release.pipelineState || {};
  state[stepId] = !state[stepId];
  releases[idx] = { ...release, pipelineState: state };
  await saveDynamicReleases(releases);
}

export async function markPipelineStep(releaseTitle: string, stepId: string, done: boolean): Promise<void> {
  const releases = await getDynamicReleases();
  const idx = releases.findIndex(r => r.title === releaseTitle);
  if (idx === -1) return;

  const release = releases[idx];
  const state = release.pipelineState || {};
  state[stepId] = done;
  releases[idx] = { ...release, pipelineState: state };
  await saveDynamicReleases(releases);
}
```

---

## FILE 2: `app/pipeline/page.tsx` (NEW — ~350 lines)

The pipeline dashboard. This replaces TODAY as the home page. Shows all active releases as cards, each displaying current phase + progress. Tap a release to expand and see the full pipeline with tappable checkboxes.

### Design spec:

**Layout:**
- Top: "PIPELINE" title + total progress across all releases
- Per-release cards: title, phase badge (colored), progress bar, next step preview
- Tapping a card expands it inline to show all phases with checkboxes
- Completed phases collapse to a single green line (same pattern as TrackCards.tsx)
- Active phase shows full checklist
- Future phases show as locked/dimmed

**Visual language:** Match existing Oracle aesthetic — dark surface cards, gold/green/purple/red phase colors, tracking-widest uppercase section labels, 44px min touch targets.

**State:** Reads from `getDynamicReleases()` → each release's `pipelineState`. Writes via `togglePipelineStep()`.

**Which releases show:** All non-`ep` type releases where `status !== "live"` OR where pipeline is not 100% complete (so a just-released track still shows until you finish the compound + sync phases).

```typescript
// app/pipeline/page.tsx
"use client";

// Pipeline Dashboard — the spine of Oracle Compass.
// Shows every active release's position in the per-release pipeline.
// Tapping a release expands it to show the full checklist.
// This is the home page. The pipeline IS the work.

import { useState, useEffect, useCallback } from "react";
import { getDynamicReleases, Release } from "@/lib/releases";
import {
  PIPELINE_PHASES,
  TOTAL_PIPELINE_STEPS,
  getCurrentPhase,
  getNextStep,
  getCompletedCount,
  isPhaseComplete,
  togglePipelineStep,
  PipelineState,
} from "@/lib/pipeline";

// ... (Sonnet implements full component — spec below)
```

**Sonnet: implement the full page component with these requirements:**

1. **Release card (collapsed):** Shows title, current phase name + color badge, progress bar (completed/total steps), and the label of the next incomplete step. Tap to expand.

2. **Release card (expanded):** Shows all 6 pipeline phases vertically. Each phase has a header (icon + name + color) and its steps as tappable checkboxes. Completed phases show collapsed (single green line with checkmark, like TrackCards COMPLETE state). Active phase shows full checklist. Future phases (all prior phases not complete) show dimmed with step count.

3. **Checkbox behavior:** Tap a step → calls `togglePipelineStep(release.title, step.id)` → re-reads state → updates UI. Only allow checking forward (no unchecking completed steps — same pattern as TrackCards).

4. **Progress header:** At the top of the page, show aggregate stats:
   - Total active releases count
   - Overall completion percentage
   - "Next up:" label showing the most urgent next step across all releases (closest to release date)

5. **Release ordering:** Sort by release date ascending (closest deadline first).

6. **Filter:** Only show releases where:
   - `type !== "ep"` (don't show the EP aggregate entity)
   - Either `status !== "live"` OR `getCompletedCount(pipelineState) < TOTAL_PIPELINE_STEPS`
   - This keeps a release visible until ALL pipeline phases (including compound + sync) are done

7. **Styling:** Use existing Oracle CSS classes: `page`, `page-inner`, `card`, `animate-fade-in`. Use inline styles for phase colors (same pattern as TrackCards.tsx). Minimum 44px touch targets. Use `var(--text-primary)`, `var(--text-muted)`, `var(--surface-2)`, `var(--border)` tokens — NO hard-coded rgba values.

8. **Animation:** Use the same `killFadeIn` keyframe pattern for card entrance. Checkbox check animation: 200ms scale bounce.

---

## MODIFICATION 1: `lib/releases.ts`

### Add `pipelineState` to Release type:

```diff
  export type Release = {
    title: string;
    uploadDate: string;
    releaseDate: string;
    status: "live" | "upload_pending" | "unreleased";
    type: ReleaseType;
    projectTarget?: string | null;
    pitchDeadline?: string | null;
    contentDeliverables: ContentDeliverables;
+   pipelineState: Record<string, boolean>;
  };
```

### Add default pipelineState to RELEASE_DEFAULTS:

For each release in `RELEASE_DEFAULTS`, add `pipelineState: {}` (empty = no steps completed).

**Exception — SEE ME and East Side Love:** These are already live/uploaded. Pre-seed their pipelineState with creation + upload steps marked done:

```typescript
// SEE ME — LIVE since Mar 13. Creation + upload + release all done.
pipelineState: {
  "0.1": true, "0.2": true, "0.3": true, "0.4": true, "0.5": true,
  "0.6": true, "0.7": true, "0.8": true, "0.9": true, "0.10": true,
  "1.1": true, "1.2": true, "1.3": true, "1.4": true, "1.5": true, "1.6": true,
  "2.1": true, "2.2": true, "2.3": true, "2.4": true, "2.5": true, "2.6": true, "2.7": true,
  "3.1": true, "3.2": true, "3.3": true, "3.4": true, "3.5": true, "3.6": true,
},

// East Side Love — uploaded Apr 30, drops May 9. Creation + upload done. Pre-release in progress.
pipelineState: {
  "0.1": true, "0.2": true, "0.3": true, "0.4": true, "0.5": true,
  "0.6": true, "0.7": true, "0.8": true, "0.9": true, "0.10": true,
  "1.1": true, "1.2": true, "1.3": true, "1.4": true, "1.5": true, "1.6": true,
},
```

All other releases: `pipelineState: {}`.

### Bump RELEASE_DATA_VERSION:

```diff
- const RELEASE_DATA_VERSION = 37;
+ const RELEASE_DATA_VERSION = 38; // v38: May 9 — pipeline state added to Release type
```

### Fix migration in getDynamicReleases:

The existing migration already preserves loosies. Add pipelineState back-fill for existing stored releases that lack it:

In the `patched` map inside `getDynamicReleases()`, add:

```typescript
const patched = stored.map(r => ({
  ...r,
  pipelineState: r.pipelineState || {},
  // ... existing back-fill logic
}));
```

---

## MODIFICATION 2: `components/BottomNav.tsx`

Replace TODAY with PIPELINE:

```diff
  {/* TODAY → PIPELINE */}
- <Link href="/" className={`nav-item ${isToday ? "active" : ""}`} style={{ flex: 1 }}>
-   <div className="text-2xl">🏠</div>
-   <span>TODAY</span>
+ <Link href="/pipeline" className={`nav-item ${pathname === "/pipeline" ? "active" : ""}`} style={{ flex: 1 }}>
+   <div className="text-2xl">🔗</div>
+   <span>PIPELINE</span>
  </Link>
```

Also update the `isToday` variable or replace it:

```diff
- const isToday = pathname === "/";
+ const isPipeline = pathname === "/pipeline";
```

**Keep the old `/` route working** — add a redirect in `app/page.tsx`:

```typescript
// app/page.tsx — redirect to pipeline (new home)
import { redirect } from "next/navigation";
export default function Home() {
  redirect("/pipeline");
}
```

Wait — `app/page.tsx` currently has the TodayPlan component. **Don't delete it.** Instead:

**Option chosen:** Keep `app/page.tsx` as-is (TodayPlan still accessible at `/`). Change BottomNav to point to `/pipeline` as the first tab. Users who manually navigate to `/` still get TodayPlan. The nav just defaults to pipeline now.

Actually, simpler: **Make `/pipeline` the first nav item but keep `/` as TodayPlan.** No redirect needed. The pipeline is the default action, TodayPlan is still there if you type the URL. Clean.

---

## MODIFICATION 3: `lib/killList.ts`

Add a new section to `deriveKillList()` that reads pipeline state and surfaces the next incomplete step as a Kill List task.

**Insert after the existing department-derived tasks (before the final sort/return).** This is additive — don't remove any existing derivation logic.

```typescript
// ── PIPELINE-DERIVED TASKS ──────────────────────────────────────────
// Surface the next incomplete pipeline step for each active release
// as a Kill List task. Pipeline tasks are AMBER by default, RED if
// the release date is within 3 days.

import { PIPELINE_PHASES, getCurrentPhase, getNextStep } from "@/lib/pipeline";

const activeReleases = releases.filter(r =>
  r.type !== "ep" && r.status !== "live"
);

for (const release of activeReleases) {
  const state = release.pipelineState || {};
  const nextStep = getNextStep(state);
  if (!nextStep) continue; // all done

  const currentPhase = getCurrentPhase(state);
  const daysToRelease = Math.ceil(
    (new Date(release.releaseDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  const pipelineTaskKey = `pipeline_step_clear:${today}:${release.title}:${nextStep.id}`;
  const alreadyCleared = await getStoreValue<boolean>(pipelineTaskKey);
  if (alreadyCleared) continue;

  tasks.push({
    id: `pipeline-${release.title}-${nextStep.id}`,
    title: `${release.title} → ${nextStep.label}`,
    subtitle: `${currentPhase.icon} ${currentPhase.name} · Step ${nextStep.id} · ${nextStep.doneWhen}`,
    howTo: [
      `Phase: ${currentPhase.name}`,
      `Step: ${nextStep.id} — ${nextStep.label}`,
      `Done when: ${nextStep.doneWhen}`,
      nextStep.tools ? `Tools: ${nextStep.tools}` : "",
      "Tap ✓ when complete. This advances the pipeline.",
    ].filter(Boolean),
    urgency: daysToRelease <= 3 ? "RED" : daysToRelease <= 7 ? "AMBER" : "GREEN",
    pillar: "ops" as const,
    timeBlock: "any" as const,
    action: async () => {
      await markPipelineStep(release.title, nextStep.id, true);
      await setStoreValue(pipelineTaskKey, true);
    },
  });
}
```

**Import at top of killList.ts:**
```typescript
import { getCurrentPhase, getNextStep, markPipelineStep } from "@/lib/pipeline";
```

---

## WHAT STAYS UNCHANGED

| Component | Why |
|-----------|-----|
| `app/page.tsx` (TodayPlan) | Still accessible at `/`. Phase map, non-negotiables, vocal codex still useful. Just not the nav default anymore. |
| `app/kill/page.tsx` | Kill List UI unchanged. It now also shows pipeline-derived tasks alongside department tasks. |
| `app/grind/page.tsx` | Body/recovery page. No pipeline dependency. |
| War Room | Doctrine scrolls, sovereignty dashboard, studio timeline. Reference material. Stays. |
| `components/TrackCards.tsx` | Still renders on /kill page. Shows the MASTER→UPLOAD→PRE-RELEASE→COMPLIANCE→COMPLETE phase gates. This is a SUBSET of the pipeline — it'll naturally align because the same deliverable booleans drive both. |
| `lib/phaseMap.ts` | Calendar system. Still drives TodayPlan. Not deprecated — just not the spine anymore. |
| `lib/departments/*.ts` | Department protocols. Still derive Kill List tasks. Pipeline tasks are additive. |

---

## P0 FIXES — DATA INTEGRITY (execute BEFORE pipeline work)

These fix live bugs found during full-screen UX audit. They have zero dependency on pipeline code and should be committed first.

### P0-A: Sobriety dual-state fix (`app/grind/page.tsx` + `lib/streaks.ts`)

**Problem:** Two sobriety counters exist. Body page (`/grind`) uses `getSobrietyStreak()` from `lib/streaks.ts` which is HARDCODED to count from Apr 2, 2026. Brain page (`/brain`) uses `getSobrietyDays(state.sobrietyStart)` from `lib/sovereignty.ts` which reads the actual start date from IndexedDB (and has a working reset button + reset history). After a reset on May 6, Body shows "38 DAYS SOBER" while Brain correctly shows "2 DAYS CLEAN - SINCE MAY 7." One system lies.

**Fix:** Make Body page read from the same sovereignty state as Brain page.

**In `app/grind/page.tsx`:**

1. Add imports:
```typescript
import { loadSovereigntyState, getSobrietyDays } from "@/lib/sovereignty";
```

2. Add state for sobriety start date:
```typescript
const [sobrietyStart, setSobrietyStart] = useState<string>("2026-04-02");
```

3. Replace the init function (lines 26-31):
```typescript
useEffect(() => {
  const init = async () => {
    setLog(await getDailyLog());
    setDayType(getDayType());
    // Read sobriety from sovereignty state (same source as Brain page)
    const sovState = await loadSovereigntyState();
    setStreak(getSobrietyDays(sovState.sobrietyStart));
    setSobrietyStart(sovState.sobrietyStart);
  };
  init();
}, []);
```

4. Remove the import of `getSobrietyStreak` from `@/lib/streaks` (line 14). If streaks.ts has no other exports used here, the import line can be deleted entirely.

5. Replace the hardcoded date display (line 50-52):
```typescript
<div className="text-xs font-bold tracking-widest text-muted uppercase">
  Days Sober &middot; since {new Date(sobrietyStart + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
</div>
```

**Result:** Both Body and Brain pages now read from IndexedDB sovereignty state. Reset button on Brain page updates both displays. Single source of truth.

**DO NOT delete `lib/streaks.ts`** — other files may import it. Just stop using it in grind.

---

### P0-B: Delete deluxe ghost from `lib/studioData.ts`

**Problem:** "ALL LOVE OUT DELUXE" project card still renders on the Studio War Room page. Deluxe concept was RETIRED per CLAUDE.md. It shows "Apr 29" with "0/11" — pure ghost data causing visual noise.

**Fix:** Remove lines 90-94 from `lib/studioData.ts`:

```diff
-    {
-        id: 'all-love-deluxe', name: 'ALL LOVE DELUXE', color: '#fbbf24', emoji: '🎂',
-        role: 'Companion / Disc 2, birthday drop', trackCount: 11, targetDate: '2026-04-28',
-        tracks: placeholderTracks('Deluxe', 11),
-    },
```

Also remove the color reference in `app/studio/page.tsx` line 45:
```diff
  const projectColors: Record<string, string> = {
-     "all-love": "#6ee7b7", "all-love-deluxe": "#fbbf24",
+     "all-love": "#6ee7b7",
      "cream": "#f472b6", "freakshow": "#c084fc", "loosies": "#60a5fa",
  };
```

---

### P0-C: Fix marathon-data deluxe phase mapping (`lib/marathon-data.ts`)

**Problem:** Weeks 9-10 in MARATHON_WEEKS are mapped to the retired `DELUXE` phase. These are the current weeks (May 3-16) which should now be `ALL_LOVE` phase since the EP drops May 15.

**Fix:** In `lib/marathon-data.ts`:

1. Week 9 (lines ~135-138): Change `phase: 'DELUXE'` → `phase: 'ALL_LOVE'`, `phaseBadge: 'DELUXE'` → `phaseBadge: 'ALL LOVE'`, update target to `'EP upload + ESL release day'`.

2. Week 10 (lines ~140-143): Change `phase: 'DELUXE'` → `phase: 'ALL_LOVE'`, `phaseBadge: 'DELUXE / CREAM'` → `phaseBadge: 'ALL LOVE / EP RELEASE'`, update target to `'EP drops May 15 + compound phase'`.

3. Remove `'DELUXE'` from the Phase type union ONLY IF no other weeks reference it. If the type is `'ALL_LOVE' | 'DELUXE' | 'CREAM' | 'FREAKSHOW'`, keep it for now since removing it may break things if the PHASE_META object references it. Safer: keep the type and meta entry, just don't assign any weeks to it.

---

## COMMIT STRATEGY

```
fix: P0 data integrity — sobriety single source, deluxe ghost removal, marathon phase fix
feat: pipeline spine — lib/pipeline.ts (pipeline definition + state manager)
refactor: releases.ts v38 — add pipelineState to Release type, pre-seed SEE ME + ESL
feat: pipeline dashboard — app/pipeline/page.tsx
feat: kill list pipeline integration — derive tasks from pipeline state
refactor: nav — PIPELINE replaces TODAY as first tab
```

6 commits. P0 fix goes FIRST — it has zero dependency on pipeline code and cleans up data integrity before the spine ships. Pipeline commits follow in dependency order.

---

## EXECUTION ORDER FOR SONNET

### Phase A: Data integrity (no pipeline dependency — can parallel with Phase B step 1)

**A1. Fix sobriety dual-state** (`app/grind/page.tsx`) — per P0-A above.

**A2. Delete deluxe ghost** (`lib/studioData.ts` + `app/studio/page.tsx`) — per P0-B above.

**A3. Fix marathon-data** (`lib/marathon-data.ts`) — per P0-C above.

**Commit A:** `fix: P0 data integrity — sobriety single source, deluxe ghost removal, marathon phase fix`

### Phase B: Pipeline spine (sequential — each step depends on the previous)

**B1. Create `lib/pipeline.ts`** — copy the full implementation from FILE 1 above. This has zero dependencies on new code (only imports from existing releases.ts). **Can run parallel with Phase A.**

**B2. Modify `lib/releases.ts`** — add `pipelineState` field to Release type, add `pipelineState: {}` to all RELEASE_DEFAULTS (with SEE ME + ESL pre-seeded), bump version to 38, add back-fill in getDynamicReleases patched map. **Depends on B1** (pipeline.ts must exist for type references, though releases.ts doesn't actually import it — the type alignment matters).

**Commit B1+B2:** `feat: pipeline spine — lib/pipeline.ts + releases.ts v38 pipelineState`

**B3. Create `app/pipeline/page.tsx`** — implement the full pipeline dashboard per the design spec in FILE 2. Follow the 8 requirements listed. **Depends on B1 + B2.**

**Commit B3:** `feat: pipeline dashboard — app/pipeline/page.tsx`

**B4. Modify `lib/killList.ts`** — add the pipeline-derived tasks section per MODIFICATION 3. Add import at top. Insert before final sort/return. **Depends on B1.**

**Commit B4:** `feat: kill list pipeline integration — derive tasks from pipeline state`

**B5. Modify `components/BottomNav.tsx`** — replace TODAY with PIPELINE per MODIFICATION 2. **Depends on B3** (the /pipeline route must exist).

**Commit B5:** `refactor: nav — PIPELINE replaces TODAY as first tab`

### Phase C: Verify

**C1. `npm run build`** must pass with zero errors.

**C2. `git push origin main`** — all commits in sequence.

### Parallelism map:
```
A1 ──┐
A2 ──┤── Commit A ─────────────────────────────────┐
A3 ──┘                                              │
                                                     ├── C1 (build) → C2 (push)
B1 ──┬── B2 ── Commit B1+B2 ── B3 (Commit) ──┐     │
     │                                        ├─────┘
     └── B4 (Commit) ── B5 (Commit) ──────────┘
```

Phase A and B1 can run in parallel. B2 follows B1. B3 follows B2. B4 can run parallel with B3 (both only need B1). B5 follows B3. Build verify follows all.

---

## VERIFICATION CHECKLIST (post-push)

### P0 fixes:
- [ ] `/grind` shows sobriety days matching `/brain` sovereignty dashboard (both should show same count from same start date)
- [ ] `/grind` sobriety label shows dynamic date, not hardcoded "Apr 2, 2026"
- [ ] Studio War Room no longer shows "ALL LOVE DELUXE" project card
- [ ] Planner War Room weeks 9-10 show "ALL LOVE" phase badge, not "DELUXE"

### Pipeline:
- [ ] `/pipeline` loads and shows all non-EP unreleased tracks as cards
- [ ] Tapping a release card expands to show all 6 phases with checkboxes
- [ ] Tapping a checkbox calls togglePipelineStep and updates UI
- [ ] SEE ME shows with creation + upload + pre-release + release phases complete
- [ ] ESL shows with creation + upload phases complete
- [ ] GL, SF, WU2 show with empty pipeline (all steps incomplete)
- [ ] Vault singles (LID, ILG, etc.) show with empty pipeline
- [ ] Bottom nav first item is PIPELINE with 🔗 icon
- [ ] `/kill` still loads, Kill List still derives, pipeline tasks appear alongside department tasks
- [ ] `/` still loads TodayPlan (not broken, just not in nav)
- [ ] `/grind` still works (sobriety + conditioning + recovery)
- [ ] War Room still works (minus deluxe ghost)
- [ ] `npm run build` passes
- [ ] Vercel deploy succeeds

---

## POST-DEPLOY: FUTURE ITERATIONS (do NOT build now)

These are Phase 2 ideas. Do NOT include in this push.

1. **Pipeline → TrackCards sync:** Make TrackCards.tsx read from pipelineState instead of contentDeliverables. Eliminates dual state.
2. **Auto-advance:** When pipeline step 1.4 (upload to Amuse) is checked, auto-set `release.status = "upload_pending"`.
3. **Pipeline history:** Log timestamps for each step completion. Enables per-release cycle time analytics.
4. **Pipeline templates:** Different pipelines for EP vs single vs vault single (some steps don't apply to all types).
5. **Deprecate phaseMap.ts:** Once pipeline is proven, the calendar-based system becomes redundant. TodayPlan can derive from pipeline state instead of ISO date lookups.
6. **Light theme parity:** Grep for hardcoded hex colors (`#333`, `#555`, `#666`, `#fbbf24`, etc.) across all components and map to semantic CSS tokens (`var(--border)`, `var(--text-muted)`, etc.). ~15 files, mechanical Sonnet pass.
7. **War Room consolidation:** Post-pipeline, Studio/Label/Planner track the same things the pipeline tracks. Consider hiding or archiving those sub-pages, keeping only Brain (sovereignty + scrolls), Doctrine (reference), Analytics (S4A intake), Settings.
8. **Kill List / Today reconciliation:** The "KILL LIST CLEAR ✓" badge on TodayPlan and the Execute page's actual derivation must read the same state. If derivation throws, Today shouldn't claim clear.
