# ORACLE COMPASS — UX AUDIT + FIX SPEC
**Author:** Opus (source code pass, May 8, 2026)
**For:** Sonnet via Claude Code at `~/.gemini/antigravity/scratch/oracle-compass/`
**Commit baseline:** `824fd35`

---

## CRITICAL BUGS (Fix immediately)

### 1. DUPLICATE Kill List sections in TodayPlan.tsx

**File:** `components/TodayPlan.tsx` lines 153–226

Two separate "Kill List — RED" sections render back-to-back with identical data (`redTasks`):
- Lines 154–178: `🔥 Kill List — RED` (deliverable card style)
- Lines 188–226: `🔥 Live Kill List — RED` (summary list style)

Both show the same content. This is a merge artifact. **Delete the SECOND one** (lines 187–226 — the `stp-kill-summary` block). Keep the first one (the deliverable-card style) because it matches the visual language of the rest of the TodayPlan component.

```diff
- {/* Kill List cross-link — RED urgency only */}
- <h3 className="stp-section-title">🔥 Live Kill List — RED</h3>
- <div className="stp-kill-summary">
-   ... (lines 189-226)
- </div>
```

### 2. Wrong sobriety date on Grind page

**File:** `app/grind/page.tsx` line 52

```diff
- Days Sober &middot; since Mar 11, 2026
+ Days Sober &middot; since Apr 2, 2026
```

Project instructions explicitly state: "Sobriety restart Apr 2, 2026." Mar 11 is wrong.

Also verify that `lib/streaks.ts` uses Apr 2 as the start date for the calculation:
```bash
grep -n "Mar 11\|2026-03-11\|sobriety" lib/streaks.ts
```
If it uses Mar 11, change to `2026-04-02`.

### 3. DoorDash logged TWICE on /kill page

**File:** `app/kill/page.tsx`

Two separate DoorDash entry points:
- Lines 916–945: "Anti-Drift Telemetry" section with +$20/+$50/+$100 quick-tap buttons
- Lines 1076–1108: "Log DoorDash Shift" section with hours + revenue inputs

**Fix:** Remove the bottom "Log DoorDash Shift" section entirely (lines 1075–1108). The telemetry section's quick-tap buttons are faster for the use case (user comes home from a shift, taps +$50 or +$100). If the user wants exact logging with hours, the Kill List's DoorDash completion modal already handles that (lines 197–220 in CompletionModal).

---

## HIGH-PRIORITY UX IMPROVEMENTS

### 4. Hard-coded dark colors break light mode

**Files:** `app/page.tsx`, `app/kill/page.tsx`, `components/TodayPlan.tsx`

The CSS file (`globals.css`) defines semantic tokens:
```css
--text-primary, --text-secondary, --text-muted, --surface, --surface-2, --border
```

But page components are full of:
- `text-white`, `text-[#555]`, `bg-[#111]`, `border-[#222]`, `bg-[#0a0a0a]`
- `rgba(255,255,255,0.X)` everywhere

These render correctly in dark mode but look wrong in light mode.

**Fix pattern:** For each page, find-and-replace the 5 most common violations:

| Hard-coded | Replace with |
|---|---|
| `text-white` | `text-primary` (class) or `color: var(--text-primary)` |
| `text-[#555]` / `text-[#666]` | `text-muted` or `color: var(--text-muted)` |
| `bg-[#111]` / `bg-[#0a0a0a]` | `bg-surface-2` or `background: var(--surface-2)` |
| `border-[#222]` / `border-[#1a1a1a]` | `border-default` or `border-color: var(--border)` |
| `rgba(255,255,255,0.04)` | `var(--surface-2)` |

**Scope this to critical pages only:** `app/page.tsx`, `app/kill/page.tsx`, `app/grind/page.tsx`. Do NOT touch doctrine, studio, or War Room internals — those can wait.

### 5. Studio Timeline has expired date window

**File:** `app/studio/page.tsx` lines 49–50

```typescript
const yearStart = new Date("2026-03-01T00:00:00");
const yearEnd = new Date("2026-05-01T00:00:00");
```

May 1 is already past. The timeline is now fully elapsed — the "NOW" marker is off the right edge.

**Fix:** Extend to cover the active horizon:
```typescript
const yearStart = new Date("2026-04-01T00:00:00");
const yearEnd = new Date("2026-08-01T00:00:00");
```

This covers the EP (May 15) through the end of vault singles waterfall (Jul 25).

### 6. Telemetry shows stale track pairing

**File:** `app/kill/page.tsx` lines 920–930

Shows "SF Mixdown" and "LID Mixdown" with hours tracked against 11h target. But:
- SF (Sweet Frustration) is correct — it's an EP track due May 15
- LID (Like I Did) is a post-EP vault single (May 30) — not the current priority

**Fix:** Replace LID with GL (Green Light) or WU2 (Want U 2) — whichever has fewer hours logged. Better yet, make it dynamic:

```typescript
// Replace the hardcoded SF/LID pair with the 2 EP tracks closest to deadline that aren't LIVE
const epTracks = ["GREEN LIGHT", "SWEET FRUSTRATION", "WANT U 2"];
const activeTrackSummaries = trackSummaries
  .filter(t => epTracks.includes(t.trackName.toUpperCase()))
  .sort((a, b) => a.totalHours - b.totalHours)
  .slice(0, 2);
```

Then render dynamically instead of the hardcoded SF/LID cards.

---

## MEDIUM-PRIORITY IMPROVEMENTS

### 7. Bottom Nav "LOG" name is misleading

**File:** `components/BottomNav.tsx` line 142–145

The "LOG" button (📓) goes to `/grind` which is the Recovery & Performance page — sobriety streak + conditioning + recovery protocol. It's not a "log" in the traditional sense.

**Options (pick one):**
- **A)** Rename to "RECOVER" with icon 🔋 — accurately describes the page's purpose
- **B)** Rename to "BODY" with icon 💪 — aligns with the Health department naming

Recommendation: **B** — it matches the department system (Health & Foundation) and sets up Phase 2 where the page absorbs more health tracking.

```diff
- <div className="text-2xl">📓</div>
- <span>LOG</span>
+ <div className="text-2xl">💪</div>
+ <span>BODY</span>
```

### 8. Protocol steps don't respect Phase 1 rules

**File:** `app/page.tsx` lines 55–59

During Phase 1 (through May 11), the STUDIO DAY protocol shows:
```
📱 Post content from STUDIO queue
```

But Phase 1 doctrine says: "No content, no planning, no system building. Production only."

**Fix:** Check Phase 1 status and suppress content tasks:
```typescript
const isPhase1 = new Date() < new Date("2026-05-12T00:00:00");

// In the STUDIO DAY return block:
if (isStudioDay(dayType as any)) return {
  tagline: "Hydrate → Sunlight → Breathe → Move → Create.",
  steps: [
    ...base,
    { icon: "🎹", action: "10 AM → Studio Block 1 (mix/vocals)" },
    { icon: "🎤", action: "2 PM → Studio Block 2" },
    ...(!isPhase1 ? [{ icon: "📱", action: "Post content from STUDIO queue", tab: "studio" }] : []),
  ],
};
```

### 9. TrackCards uses hardcoded track list

**File:** `components/TrackCards.tsx` line 77

```typescript
const EP_TRACK_TITLES = ["East Side Love", "Green Light", "Sweet Frustration", "WANT U 2", "SEE ME"];
```

This requires manual updates if tracks change. Better to derive from releases.ts:

```typescript
// Replace hardcoded list with dynamic filter
const unreleased = all.filter(
  (r) => r.status !== "live" && r.type !== "ep" && r.type !== "vault_single" && r.type !== "loosie"
);
```

This automatically picks up any `ep_track` or `waterfall_single` that isn't live yet, excluding the EP aggregate entity and vault singles.

### 10. TodayPlan "Active Arc" stat is redundant

**File:** `components/TodayPlan.tsx` lines 107–109

The tag above the title already shows "Arc {data.arc}" — then the stats strip shows "Arc {data.arc}" again. Wastes a stat slot on mobile.

**Replace with something actionable:**
```typescript
<div className="stp-stat">
  <div className="stp-stat-num">${ddEarned || 0}</div>
  <div className="stp-stat-lbl">DD This Month</div>
</div>
```

Or track count:
```typescript
<div className="stp-stat">
  <div className="stp-stat-num">{tracksComplete}/{tracksTotal}</div>
  <div className="stp-stat-lbl">Tracks Done</div>
</div>
```

---

## LOW-PRIORITY / PHASE 2

### 11. Check if /oracle page is orphaned

```bash
cat app/oracle/page.tsx | head -20
```

If it's not a redirect, it should be. The May 6 rework merged Oracle into /kill. Any remaining standalone Oracle page is dead weight.

### 12. Planner page audit needed

`app/planner/page.tsx` was not read this pass. Verify it hasn't drifted from the new Phase 1/Phase 2 system.

### 13. haptic/animation polish

The Kill List task clear animation (`killClearOut`) collapses height to 0 in 350ms — could feel snappier at 250ms. The War Room slide-up is 200ms which is good. No urgent changes.

---

## EXECUTION ORDER

| Priority | Fix | Est. Time |
|---|---|---|
| P0 | #1 Remove duplicate Kill List in TodayPlan | 2 min |
| P0 | #2 Fix sobriety date (Apr 2) | 2 min |
| P0 | #3 Remove duplicate DoorDash section | 2 min |
| P1 | #5 Extend Studio Timeline window | 2 min |
| P1 | #6 Dynamic telemetry tracks | 10 min |
| P1 | #8 Suppress content tasks in Phase 1 | 5 min |
| P2 | #4 Theme token migration (3 pages) | 20 min |
| P2 | #7 Rename LOG → BODY | 2 min |
| P2 | #9 Dynamic TrackCards filter | 5 min |
| P2 | #10 Replace redundant Arc stat | 5 min |

**Total:** ~55 minutes for Sonnet. P0s take 6 minutes.

---

## COMMIT STRATEGY

```
fix: UX audit P0 — remove duplicate Kill List, fix sobriety date, deduplicate DoorDash
feat: extend studio timeline, dynamic telemetry, suppress Phase 1 content tasks
refactor: theme token migration for critical pages
chore: rename LOG → BODY nav, dynamic TrackCards, replace redundant Arc stat
```

4 commits, one per priority tier.
