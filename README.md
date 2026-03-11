# Oracle Compass

Sovereign creator daily command center. Next.js 16 PWA, deployed on Vercel.

**Live:** oracle-compass-ni8g.vercel.app

## Stack

- Next.js 16 + TypeScript
- IndexedDB (client-side persistence, Phase 1)
- Google Sheets sync via `googleapis`
- Claude Sonnet 4 (Oracle engine) + Haiku 4.5 (7 label agents)
- Vercel Crons (compliance + briefing)

## Pillars

| Page | Purpose |
|------|---------|
| `/` | Morning Mode — daily ignition ritual |
| `/grind` | Sobriety, sovereignty stack, fuel tracking |
| `/studio` | Release waterfall, cycle board, sessions |
| `/engine` | Business pipeline, income bridge |
| `/brain` | Phase bar, anchors, mode declaration |
| `/oracle` | Decree history, manual fire |

## AI Agents

| Route | Model | Purpose |
|-------|-------|---------|
| `/api/oracle` | Claude Sonnet 4 | Full empire intelligence + realignments |
| `/api/label/anr` | Claude Haiku 4.5 | Sonic positioning |
| `/api/label/creative` | Claude Haiku 4.5 | Visual treatments |
| `/api/label/pr` | Claude Haiku 4.5 | Social copy (3 variants) |
| `/api/label/guardian` | Claude Haiku 4.5 | Brand compliance scoring |
| `/api/label/marketing` | Claude Haiku 4.5 | 21-day rollout schedule |
| `/api/label/ops` | Claude Haiku 4.5 | Compliance checks |

## Crons

| Path | Schedule | Purpose |
|------|----------|---------|
| `/api/label/cron/briefing` | 7am CT (0 12 UTC) | Morning briefing digest |
| `/api/label/cron/compliance` | 8am CT (0 13 UTC) | Registration gap escalations |

## Setup

```bash
cp .env.example .env.local
# Fill in API keys
npm install
npm run dev
```

## Source of Truth

- **Release schedule:** `lib/releases.ts` (4 singles, data version 5)
- **Track compliance:** `lib/registry.ts` (5 tracks including album-only)
- **Studio data:** `lib/studioData.ts` (projects, timeline, mood scores)
- **Brain docs:** `~/.gemini/antigravity/brain/oracle-compass-v2-state.md`
