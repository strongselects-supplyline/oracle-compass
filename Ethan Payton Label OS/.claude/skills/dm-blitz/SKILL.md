---
name: DM Blitz Drafter
description: Draft personalized DM messages for release day blitz across Core 50, Warm 100, and Cold 50 tiers. Use when user says "DM blitz", "draft DMs", or "release day messages".
---

# DM Blitz Drafter

## When to Use
When Ethan says "DM blitz for [Track]", "draft DMs", or needs release-day direct messages prepared.

## Instructions

1. **Identify the track** from the request.
2. **Load track data** from `brain/catalog_intelligence_matrix.json`.
3. **Generate 3 tiers of DMs:**

### Tier 1: Core 50 (Most Personal)
These are Ethan's closest supporters. Messages should feel like a personal text, not marketing.

Template:
```
hey [name] — new one just dropped. [1 sentence about what this track means to him]. would mean a lot if you gave it a spin + saved it. [spotify link]
```

Rules:
- First name only
- Lowercase, conversational
- Reference something specific about the relationship if possible
- ONE call to action: stream + save
- No hashtags, no "check it out!", no corporate language

### Tier 2: Warm 100 (Engaged Followers)
People who've engaged with content but aren't inner circle.

Template:
```
hey — just dropped [Track Title]. [1 sentence hook from the track's sonic identity]. here if you want to check it: [spotify link]
```

Rules:
- Slightly less personal but still human
- Use a hook that creates curiosity about the music
- ONE link, no multiple CTAs
- Can reference their engagement ("saw you vibing with [previous track]")

### Tier 3: Cold 50 (Strategic Outreach)
Curators, peers, micro-influencers, music bloggers.

Template:
```
hey [name] — I'm an R&B artist out of Milwaukee. just dropped [Track Title] — [BPM] BPM, [key], think [comparable artist 1] meets [comparable artist 2]. thought it might fit your vibe. [spotify link]
```

Rules:
- Include credibility marker (Milwaukee, catalog size, or specific comparable)
- Reference THEIR work/playlist/content specifically
- Professional but not corporate
- No "I'd love if you could..." — just present the work

## Output Format
Generate all 200 messages as a markdown file with three sections. Ethan reviews, edits, and sends manually (🔴 Human-execute).

## Critical Rules
- Genre is R&B / Alt-R&B. NEVER say Pop.
- Comparable artists come from catalog matrix, not guesses.
- Messages must pass the "would I send this to a friend" test.
- No emojis unless Ethan specifically uses them in that relationship.
- DM blitz happens on release day (T-0), not before.
