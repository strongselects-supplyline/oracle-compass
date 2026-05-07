# SONNET BRIEF: Wire Content Studio to LaCie SSD

*Audience: Sonnet (Claude Code execution model)*
*Prerequisite: Ethan has already run `setup_content_studio_ssd.sh` and the folders exist on /Volumes/LaCie/Content_Studio/*

---

## Task

Wire the Content Studio app at `scratch/content-studio/` to read/write session data from the LaCie SSD at `/Volumes/LaCie/Content_Studio/`.

## Step 1: Create .env.local

```bash
cd /path/to/scratch/content-studio/
```

Create `.env.local`:

```env
# Content Studio — SSD paths
SESSIONS_ROOT=/Volumes/LaCie/Content_Studio/sessions
PHONE_ROOT=/Volumes/LaCie/Content_Studio/phone
BROLL_ROOT=/Volumes/LaCie/Content_Studio/b-roll
EXPORTS_ROOT=/Volumes/LaCie/Content_Studio/exports
CACHE_ROOT=/Volumes/LaCie/Content_Studio/cache
CALIBRATION_ROOT=/Volumes/LaCie/Content_Studio/calibration
TEMPLATES_ROOT=/Volumes/LaCie/Content_Studio/templates

# Fallback for dev/testing without SSD
# SESSIONS_ROOT=./sessions
```

## Step 2: Update constants.ts

In `lib/constants.ts`, replace any hardcoded paths with env-var reads:

```typescript
export const PATHS = {
  sessionsRoot: process.env.SESSIONS_ROOT || './sessions',
  phoneRoot: process.env.PHONE_ROOT || './phone',
  brollRoot: process.env.BROLL_ROOT || './b-roll',
  exportsRoot: process.env.EXPORTS_ROOT || './exports',
  cacheRoot: process.env.CACHE_ROOT || './cache',
  calibrationRoot: process.env.CALIBRATION_ROOT || './calibration',
  templatesRoot: process.env.TEMPLATES_ROOT || './templates',
};
```

## Step 3: Update analyze.ts / palette.ts

Ensure all session reads use `PATHS.sessionsRoot` instead of relative paths. Grep for any hardcoded `./sessions` or `sessions/` references and replace with the PATHS constant.

## Step 4: Add SSD mount check utility

Create `lib/utils/ssd-check.ts`:

```typescript
import { existsSync } from 'fs';
import { PATHS } from '../constants';

export function isSSDMounted(): boolean {
  return existsSync(PATHS.sessionsRoot);
}

export function getSSDStatus(): { mounted: boolean; path: string; fallback: boolean } {
  const mounted = isSSDMounted();
  return {
    mounted,
    path: PATHS.sessionsRoot,
    fallback: PATHS.sessionsRoot === './sessions',
  };
}
```

This gets called by API routes to warn the user if the SSD is disconnected.

## Step 5: Verify

1. Check that `PATHS` resolves correctly with SSD mounted
2. Check that `PATHS` falls back gracefully without SSD
3. No hardcoded paths remain in any .ts file under lib/

## Do NOT

- Do not create the SSD directories (Ethan runs the shell script for that)
- Do not start Block 4 Next.js work in this session
- Do not modify process.mjs or palette.mjs
