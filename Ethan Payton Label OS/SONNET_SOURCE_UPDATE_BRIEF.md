# SONNET BRIEF: Update Sources to Match Ethan's Real OBS Setup

*5-minute task. Do this before any Block 5 work.*

## Context

The types and layouts were built assuming generic `webcam` + `screen` sources. Ethan's actual OBS setup is:

| Source | File | Old Name |
|--------|------|----------|
| Facecam | `sources/facecam.mkv` | was `webcam` |
| FL Playlist window | `sources/playlist.mkv` | was `screen` |
| FL Mixer window | `sources/mixer.mkv` | **NEW — didn't exist** |
| Composite audio | `audio.wav` | same |

## Changes Required

### 1. Update `lib/types.ts` — SessionSources

Replace:
```typescript
export interface SessionSources {
  mode: 'source-first' | 'composite' | 'phone-vertical' | 'phone-horizontal';
  sessionPath: string;
  composite: string | null;
  webcam: string | null;
  screen: string | null;
  audio: string | null;
  hasWebcam: boolean;
  hasScreen: boolean;
  hasSeparateAudio: boolean;
}
```

With:
```typescript
export interface SessionSources {
  mode: 'source-first' | 'composite' | 'phone-vertical' | 'phone-horizontal';
  sessionPath: string;
  composite: string | null;
  facecam: string | null;
  playlist: string | null;
  mixer: string | null;
  audio: string | null;
  hasFacecam: boolean;
  hasPlaylist: boolean;
  hasMixer: boolean;
  hasSeparateAudio: boolean;
}
```

### 2. Update `lib/types.ts` — LayoutTemplate

Replace:
```typescript
export type LayoutTemplate =
  | 'face_dominant'
  | 'screen_dominant'
  | 'split'
  | 'face_only'
  | 'screen_only'
  | 'phone_native';
```

With:
```typescript
export type LayoutTemplate =
  | 'face_dominant'
  | 'playlist_dominant'
  | 'mixer_dominant'
  | 'face_only'
  | 'playlist_only'
  | 'mixer_only'
  | 'split_3way'
  | 'phone_native';
```

### 3. Update `lib/constants.ts` — LAYOUT_TEMPLATES

```typescript
export const LAYOUT_TEMPLATES = [
  'face_dominant',
  'playlist_dominant',
  'mixer_dominant',
  'face_only',
  'playlist_only',
  'mixer_only',
  'split_3way',
  'phone_native',
] as const;
```

### 4. Update `lib/constants.ts` — PATHS

Add SSD paths:
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

### 5. Create `.env.local` at `scratch/content-studio/.env.local`

```env
SESSIONS_ROOT=/Volumes/LaCie/Content_Studio/sessions
PHONE_ROOT=/Volumes/LaCie/Content_Studio/phone
BROLL_ROOT=/Volumes/LaCie/Content_Studio/b-roll
EXPORTS_ROOT=/Volumes/LaCie/Content_Studio/exports
CACHE_ROOT=/Volumes/LaCie/Content_Studio/cache
CALIBRATION_ROOT=/Volumes/LaCie/Content_Studio/calibration
TEMPLATES_ROOT=/Volumes/LaCie/Content_Studio/templates
```

### 6. Grep and fix all references

Search all .ts/.tsx files for `webcam`, `screen`, `hasWebcam`, `hasScreen`, `screen_dominant`, `screen_only`, `split` and update to the new names. Key files:
- `lib/content-factory/analyze.ts`
- `lib/content-factory/palette.ts`
- `lib/content-factory/render.ts`
- Any UI components referencing layout templates

### 7. Verify

`tsc --noEmit` must pass. `npm run build` must pass.

## Do NOT
- Do not touch process.mjs or palette.mjs (legacy pipeline)
- Do not start Block 5 in this session
