---
name: Weekly Data Synthesis
description: Process Ethan's Sunday S4A screenshots and Music Stax checks into structured insights and decisions. Use when user says "Sunday data", "process screenshots", "weekly numbers", or provides S4A screenshots.
---

# Weekly Data Synthesis

## When to Use
When Ethan provides Sunday S4A screenshots, says "Sunday data", "process my numbers", or asks for weekly streaming analysis.

## Instructions

1. **Receive screenshots** from Ethan (S4A Overview, Audience, Song tabs).
2. **Load current state** from `brain/LIVE_STATE.md`.
3. **Extract and compare:**
   - Monthly listeners (vs. last week)
   - Followers (vs. last week)
   - Per-track streams (vs. last week)
   - Save rate per track (saves / streams)
   - Top cities
   - Audience demographics shifts
4. **Check Music Stax** for popularity scores: `musicstax.com/artist/past-el`
5. **Generate the synthesis** using format below.

## Output Format

```markdown
# WEEKLY DATA — [Date]

## Headline numbers
| Metric | This week | Last week | Delta |
|--------|-----------|-----------|-------|
| Monthly listeners | X | Y | +/-Z |
| Followers | X | Y | +/-Z |
| Artist popularity | X | Y | +/-Z |

## Per-track performance
| Track | 7d streams | Save rate | Popularity | Trend |
|-------|-----------|-----------|------------|-------|
| [Track] | X | X% | X | up/down/flat |

## Decision triggers
- [ ] Any track save rate > 3%? → Discovery Mode eligible
- [ ] Any reel sends/reach > 3%? → Meta boost eligible ($50)
- [ ] Any track save rate declining 2+ weeks? → Content pivot needed
- [ ] Cost-per-stream > $0.10 on any active ad? → KILL the ad

## What to do this week
1. [Action based on data]
2. [Action based on data]
3. [Action based on data]
```

6. Update `brain/LIVE_STATE.md` with new numbers.
7. Append to `brain/CHANGELOG.md`: `[Date] — Weekly data pull: [headline change]`.

## Critical Rules
- Never fabricate numbers. If screenshots don't show a metric, mark it "not visible".
- Save rate is THE metric. Everything else is context.
- Decision triggers are binary — they either fire or they don't. No "maybe".
- If a track is dying (declining saves 2+ weeks), say so. Don't soften it.
- Content performance matters: note which posts drove profile visits if visible in screenshots.
