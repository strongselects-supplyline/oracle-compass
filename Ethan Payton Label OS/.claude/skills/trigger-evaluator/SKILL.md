---
name: Paid Spend Trigger Evaluator
description: Given this week's data, evaluate ALL trigger criteria for Meta Ads, Marquee, Showcase, and Discovery Mode. Returns binary go/no-go for each channel with budget check. Use when user says "should I spend", "trigger check", "evaluate triggers", "can I run ads", or provides weekly performance data.
---

# Paid Spend Trigger Evaluator

## When to Use
When Ethan provides weekly performance data and asks whether to spend money on any paid channel. Also run proactively during weekly-data-synthesis if data is available.

## Dependency
This skill must run BEFORE meta-ads-builder. Never build a Meta campaign without a trigger evaluation first.

## Instructions

1. **Collect inputs** (ask if not provided):
   - Best reel sends-per-reach (%) — from IG Insights
   - Best reel watch-through rate (%) — from IG Insights
   - Track save rate (7-day, per track) — from Spotify for Artists
   - Daily stream velocity (per track) — from S4A
   - Monthly DoorDash income this month — from Ethan
   - Any playlist adds this week — from S4A

2. **Evaluate each channel against thresholds** from `tools/TRIGGER_THRESHOLDS.md`

3. **Output format:**

## TRIGGER EVALUATION — [Date]

### Meta Ads: [GO / NO-GO]
- Sends-per-reach: [X]% → [FIRES / DOES NOT FIRE] (threshold: ≥ 3%)
- Reasoning: [one line]
- If GO: promote [specific reel] with $[amount]

### Marquee: [GO / NO-GO]
- Stream velocity: [X]/day → [FIRES / DOES NOT FIRE] (threshold: 100+/day)
- If GO: $100 targeting Previously Engaged

### Discovery Mode: [GO / NO-GO]
- Save rate: [X]% on [track] → [FIRES / DOES NOT FIRE] (threshold: ≥ 3%)
- If GO: activate on [track name]

### Showcase: [GO / NO-GO]
- Week-over-week growth: [X]% → [FIRES / DOES NOT FIRE] (threshold: +50% WoW)

### Budget Check: [PASS / FAIL]
- DoorDash this month: $[X] → 15% cap = $[Y] max spend
- Total proposed spend: $[Z]
- Headroom: $[Y - Z]

### VERDICT: Spend $[total] on [channels]. Kill [channels]. Next eval: [date].

## Critical Rules
- Triggers are BINARY. They fire or they don't. No "maybe" or "borderline."
- Never recommend spending on a track with <2% save rate after 7 days.
- Never exceed 15% of monthly income on marketing.
- Cost-per-stream above $0.10 on any active campaign = KILL immediately.
- DoorDash below $1,800 target this month = HARD STOP on all paid spend.
- Emotional impulse with no data backing = HARD STOP. No exceptions.
