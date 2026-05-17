---
name: Meta Ads Campaign Builder
description: Generate a ready-to-execute Meta Ads campaign config using the $50 test protocol. ONLY runs after trigger-evaluator returns GO for Meta. Use when user says "set up ads", "Meta campaign", "run ads for [track]", "build ad", or when trigger-evaluator fires a Meta trigger.
---

# Meta Ads Campaign Builder

## When to Use
ONLY after `trigger-evaluator` returns GO for Meta Ads. Never on impulse. If trigger-evaluator hasn't been run, run it first.

## Dependency
REQUIRES: trigger-evaluator → Meta GO verdict. Do not skip this step.

## Instructions

1. **Confirm trigger-evaluator returned GO.** If not, stop and run trigger-evaluator first.
2. **Identify the winning reel** (highest sends-per-reach from past 2 weeks).
3. **Generate two ad set configs** using `tools/AD_SET_TEMPLATE.md`.
4. **Output the campaign spec** Ethan can copy into Meta Business Suite.
5. **Include kill rules and Day 3/Day 7 checkpoints.**

## Output Format
See `tools/AD_SET_TEMPLATE.md` for the complete campaign structure.

## Critical Rules
- NEVER link directly to Spotify. Always use smart link with Meta Pixel (feature.fm or similar).
- Never promote a reel that performed below 2% sends-per-reach organically.
- Budget hard cap: 15% of monthly income. Check against trigger-evaluator's budget check.
- This is 🟡 AI-prep + 🔴 Human-execute. Ethan creates the campaign in Meta Business Suite.
- Day 3: Kill underperforming ad set. Double budget on winner.
- Day 7: Campaign ends. Log results to weekly-data-synthesis.
- Cost-per-stream > $0.10: Kill entire campaign immediately. No exceptions.
