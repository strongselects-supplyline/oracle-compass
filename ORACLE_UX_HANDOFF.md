# Oracle UX Handoff — Execute Page Layout + Inline Actionability

**Date:** 2026-05-18  
**Author:** Claude (Opus 4.6, Lead Architect)  
**For:** Sonnet execution  
**Repo:** `/Users/ethanpayton/.gemini/antigravity/scratch/oracle-compass`  
**Desktop backup:** `/Users/ethanpayton/Desktop/oracle-compass-full` (stale, don't use)

---

## Problem

Ethan's ADHD brain opens the Execute tab and sees:
1. TodayPlan (overview: sovereignty days, days to EP, week, phase, deliverable card, non-negotiables, kill list summary)
2. "One Thing" hero section
3. Protocol / Studio Day calendar (THE MOST ACTIONABLE THING)
4. Kill List CTA
5. Morning Stack (4-step progressive)

The Studio Day calendar is buried below the fold. That's the thing that tells him what to do RIGHT NOW. Also, protocol items like "Breathwork: Nadi Shodhana" are just text — he has to leave the app to look up what Nadi Shodhana is, which creates drift.

## Fix 1: Reorder — Move Protocol Up

In `app/page.tsx`, move the Protocol section (lines ~411-434) to render IMMEDIATELY AFTER the TodayPlan component (line 343), BEFORE the "One Thing" section.

Current order:
```
<TodayPlan />
{/* One Thing hero */}
{/* Protocol */}
{/* Kill List CTA */}
{/* Morning Stack */}
```

New order:
```
<TodayPlan />
{/* Protocol — NOW SECOND */}
{/* Kill List CTA */}
{/* One Thing hero */}
{/* Morning Stack */}
```

Rationale: When Ethan opens the app, he sees (1) the day context cards, then (2) his actual schedule with times. The "One Thing" is something he sets once and doesn't need above-the-fold real estate all day. Kill List CTA stays prominent because it drives execution.

## Fix 2: Inline Expandable HowTo on Protocol Steps

The data already exists. `lib/departments/health.ts` exports `MORNING_STACK` with `howTo: string[]` arrays for each protocol item (hydration, sunlight, breathwork, pelvic release). The `TRAINING_PROGRAM` has similar `howTo` arrays.

### Implementation

1. **In `app/page.tsx`, modify `getProtocolSteps()`** to return the `howTo` array alongside each step:

```typescript
type ProtocolStep = { icon: string; action: string; tab?: string; howTo?: string[] };
```

Map morning stack items to their howTo data:

```typescript
import { MORNING_STACK } from "@/lib/departments/health";

// In getProtocolSteps():
const base: ProtocolStep[] = [
  { icon: "🚗", action: "6:30 AM → DD Morning Sprint (90 min target)" },
  { icon: "💧", action: "Wake: 16oz water + electrolytes", howTo: MORNING_STACK[0].howTo },
  { icon: "☀️", action: "2-10 min morning sunlight (no sunglasses)", howTo: MORNING_STACK[1].howTo },
  { icon: "🫁", action: "Breathwork: Nadi Shodhana or Box (5 min)", howTo: MORNING_STACK[2].howTo },
];
```

2. **Add expand/collapse state** to the Protocol rendering:

```typescript
const [expandedStep, setExpandedStep] = useState<number | null>(null);
```

3. **Modify the Protocol step rendering** (the `.card !p-0 overflow-hidden` div):

```tsx
{protocol.steps.map((step, i) => (
  <div key={i}>
    <div 
      className="flex items-center gap-3 px-4 py-3.5 cursor-pointer"
      onClick={() => step.howTo && setExpandedStep(expandedStep === i ? null : i)}
    >
      <span className="text-lg">{step.icon}</span>
      <span className="text-[12px] font-bold text-secondary leading-snug flex-1">{step.action}</span>
      {step.howTo && (
        <span className="text-[10px] text-muted">{expandedStep === i ? "▲" : "▼"}</span>
      )}
    </div>
    {expandedStep === i && step.howTo && (
      <div className="px-4 pb-3 pt-0 animate-fade-in">
        <div className="pl-8 border-l-2 border-amber-500/30 space-y-1.5">
          {step.howTo.map((line, j) => (
            <p key={j} className="text-[11px] text-muted leading-relaxed">{line}</p>
          ))}
        </div>
      </div>
    )}
  </div>
))}
```

This gives tap-to-expand behavior. Tap "Breathwork: Nadi Shodhana" → inline expansion shows:
- "Sit spine tall. Close eyes."
- "Option A: Nadi Shodhana (alternate nostril) — 5 rounds."
- "Option B: Box breathing — 4 in, 4 hold, 4 out, 4 hold — 5 rounds."
- etc.

No leaving the app. No drift.

## Fix 3: Training Program HowTo

Same pattern for the workout step. `TRAINING_PROGRAM` entries have `howTo` arrays. Wire them the same way:

```typescript
if (workout) {
  base.push({ 
    icon: "🏋️", 
    action: `${workout.title} (${workout.duration})`,
    howTo: workout.howTo 
  });
}
```

## Testing

1. `npm run dev` in the oracle-compass directory
2. Open on phone (PWA) or localhost
3. Verify Protocol section appears right after TodayPlan
4. Tap breathwork → howTo expands inline
5. Tap again → collapses
6. Verify morning stack still works below

## Do NOT touch

- TodayPlan.tsx — leave as-is
- phaseMap.ts — leave as-is  
- killList.ts — leave as-is
- Any lib/ files except the imports in page.tsx
