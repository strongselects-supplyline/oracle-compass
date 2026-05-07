# SONNET BRIEF: Video Context Engine (`watch.mjs`)

*Copy-paste this entire file into a Claude Code session (Sonnet). Full build, ~45 min.*

---

## CONTEXT

The Video Context Engine is a CLI tool that downloads any video from the internet, extracts frames + audio, transcribes via Whisper, and feeds everything to Claude for structured analysis. It enables the Label OS to "see" any video — reference Reels, mastering tutorials, visualizers, screen recordings.

**This lives inside Content Studio** at `scratch/content-studio/scripts/watch.mjs`.

**Zero-cost stack:** yt-dlp (free) + FFmpeg (free) + Whisper via Groq ($0.006/min) + Claude Haiku ($0.003/analysis). A 60-second Reel costs ~$0.01 total.

**Integration:** Outputs to `/Volumes/LaCie/Content_Studio/calibration/reference_reels.json` (or local fallback `./calibration/reference_reels.json`). Content Studio already reads from `PATHS.calibrationRoot`.

---

## PREREQUISITES (already installed)

- `yt-dlp` — `brew install yt-dlp` (verify: `which yt-dlp`)
- `ffmpeg` — already in Content Studio deps via `ffmpeg-static`, but also available system-wide
- Node 20+
- `@anthropic-ai/sdk` — already in package.json
- `openai` — already in package.json (for Whisper/Groq)

## NEW DEPENDENCY

Add to `package.json` devDependencies:
```json
"@anthropic-ai/sdk": "^0.39.0"  // already present
```

No new deps needed. yt-dlp and ffmpeg are system tools called via `child_process`.

---

## FILE STRUCTURE

```
scratch/content-studio/
├── scripts/
│   └── watch.mjs              ← NEW (main CLI entry point)
├── lib/
│   └── video-engine/
│       ├── download.ts        ← NEW (yt-dlp wrapper)
│       ├── extract.ts         ← NEW (FFmpeg frame + audio extraction)
│       ├── transcribe.ts      ← NEW (Whisper via Groq)
│       ├── analyze.ts         ← NEW (Claude vision analysis)
│       ├── modes.ts           ← NEW (analysis mode prompts)
│       └── types.ts           ← NEW (VideoAnalysis interfaces)
├── calibration/
│   └── reference_reels.json   ← UPDATED by engine
```

---

## TASK 1: Create `lib/video-engine/types.ts`

```typescript
/**
 * Video Context Engine — Type Definitions
 */

export type AnalysisMode = 'viral' | 'heat' | 'brand' | 'debug' | 'calibrate';

export interface VideoMetadata {
  url: string;
  title: string;
  duration: number; // seconds
  resolution: string;
  uploader: string;
  uploadDate: string;
  thumbnailUrl: string | null;
}

export interface ExtractedFrames {
  dir: string;
  paths: string[];
  intervalSec: number;
  count: number;
}

export interface Transcription {
  text: string;
  segments: TranscriptSegment[];
  language: string;
  durationMinutes: number;
}

export interface TranscriptSegment {
  start: number;
  end: number;
  text: string;
}

export interface VideoAnalysisResult {
  url: string;
  metadata: VideoMetadata;
  mode: AnalysisMode;
  transcript: Transcription;
  frameCount: number;
  analysis: string; // Claude's structured analysis output
  structured: Record<string, unknown> | null; // Parsed JSON if mode outputs it
  cost: {
    whisperUsd: number;
    claudeUsd: number;
    totalUsd: number;
  };
  timestamp: string;
}

// For reference_reels.json calibration output
export interface ReelCalibration {
  url: string;
  title: string;
  artist: string;
  hookTimingSec: number;
  textPlacement: string;
  colorPalette: string[];
  cutRhythm: {
    avgShotLengthSec: number;
    totalCuts: number;
  };
  aspectRatio: string;
  visualStyle: string;
  musicSync: string;
  analyzedAt: string;
}

export interface ReferenceReelsData {
  version: number;
  lastUpdated: string;
  reels: ReelCalibration[];
}
```

---

## TASK 2: Create `lib/video-engine/download.ts`

```typescript
/**
 * Video Context Engine — Download Module
 * Wraps yt-dlp to download video + extract metadata.
 */

import { execSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import type { VideoMetadata } from './types';

const WORK_DIR = join(process.cwd(), '.video-engine-tmp');

export function ensureWorkDir(): string {
  if (!existsSync(WORK_DIR)) mkdirSync(WORK_DIR, { recursive: true });
  return WORK_DIR;
}

/**
 * Get video metadata without downloading.
 */
export function getMetadata(url: string): VideoMetadata {
  const raw = execSync(
    `yt-dlp --dump-json --no-download "${url}"`,
    { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 }
  );
  const info = JSON.parse(raw);
  return {
    url,
    title: info.title || 'Untitled',
    duration: info.duration || 0,
    resolution: `${info.width || 0}x${info.height || 0}`,
    uploader: info.uploader || info.channel || 'Unknown',
    uploadDate: info.upload_date || '',
    thumbnailUrl: info.thumbnail || null,
  };
}

/**
 * Download video to temp directory. Returns path to downloaded file.
 */
export function downloadVideo(url: string, sessionId: string): string {
  const dir = ensureWorkDir();
  const outPath = join(dir, `${sessionId}.mp4`);

  if (existsSync(outPath)) return outPath;

  execSync(
    `yt-dlp -f "bestvideo[height<=1080]+bestaudio/best[height<=1080]" --merge-output-format mp4 -o "${outPath}" "${url}"`,
    { encoding: 'utf8', stdio: 'pipe', maxBuffer: 50 * 1024 * 1024 }
  );

  if (!existsSync(outPath)) {
    throw new Error(`Download failed: ${url}`);
  }

  return outPath;
}

/**
 * Clean up temp files for a session.
 */
export function cleanup(sessionId: string): void {
  const dir = ensureWorkDir();
  try {
    execSync(`rm -rf "${join(dir, sessionId)}*"`, { stdio: 'pipe' });
  } catch {
    // Best effort
  }
}
```

---

## TASK 3: Create `lib/video-engine/extract.ts`

```typescript
/**
 * Video Context Engine — Frame + Audio Extraction
 * Uses FFmpeg to pull frames at intervals and extract audio track.
 */

import { execSync } from 'child_process';
import { existsSync, mkdirSync, readdirSync } from 'fs';
import { join } from 'path';
import type { ExtractedFrames } from './types';

/**
 * Determine frame interval based on video duration.
 * Short videos (< 30s): every 2 seconds
 * Medium videos (30s - 5min): every 5 seconds
 * Long videos (> 5min): every 10 seconds
 * Max 20 frames total (Claude vision context budget).
 */
function getInterval(durationSec: number): number {
  if (durationSec <= 30) return Math.max(2, Math.floor(durationSec / 10));
  if (durationSec <= 300) return 5;
  return Math.max(10, Math.floor(durationSec / 20));
}

/**
 * Extract frames from video at calculated intervals.
 */
export function extractFrames(
  videoPath: string,
  sessionId: string,
  durationSec: number,
  workDir: string
): ExtractedFrames {
  const framesDir = join(workDir, `${sessionId}_frames`);
  if (!existsSync(framesDir)) mkdirSync(framesDir, { recursive: true });

  const interval = getInterval(durationSec);

  // FFmpeg: extract one frame every N seconds as JPEG
  execSync(
    `ffmpeg -i "${videoPath}" -vf "fps=1/${interval}" -q:v 3 -frames:v 20 "${join(framesDir, 'frame_%03d.jpg')}" -y`,
    { stdio: 'pipe' }
  );

  const paths = readdirSync(framesDir)
    .filter(f => f.endsWith('.jpg'))
    .sort()
    .map(f => join(framesDir, f));

  return {
    dir: framesDir,
    paths,
    intervalSec: interval,
    count: paths.length,
  };
}

/**
 * Extract audio track as WAV for Whisper transcription.
 */
export function extractAudio(
  videoPath: string,
  sessionId: string,
  workDir: string
): string {
  const audioPath = join(workDir, `${sessionId}_audio.wav`);

  if (existsSync(audioPath)) return audioPath;

  execSync(
    `ffmpeg -i "${videoPath}" -vn -acodec pcm_s16le -ar 16000 -ac 1 "${audioPath}" -y`,
    { stdio: 'pipe' }
  );

  return audioPath;
}
```

---

## TASK 4: Create `lib/video-engine/transcribe.ts`

```typescript
/**
 * Video Context Engine — Whisper Transcription
 * Uses Groq (free tier / $0.006/min) or OpenAI Whisper.
 */

import { readFileSync } from 'fs';
import { basename } from 'path';
import type { Transcription, TranscriptSegment } from './types';
import { recordSpend } from '../content-factory/budget';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

/**
 * Transcribe audio file via Groq's Whisper endpoint (cheapest).
 * Falls back to OpenAI if no Groq key.
 */
export async function transcribe(
  audioPath: string,
  durationMinutes: number,
  log: (emoji: string, msg: string) => void
): Promise<Transcription> {
  const apiKey = GROQ_API_KEY || OPENAI_API_KEY;
  const baseUrl = GROQ_API_KEY
    ? 'https://api.groq.com/openai/v1'
    : 'https://api.openai.com/v1';
  const model = GROQ_API_KEY ? 'whisper-large-v3' : 'whisper-1';

  if (!apiKey) {
    throw new Error('No GROQ_API_KEY or OPENAI_API_KEY set. Cannot transcribe.');
  }

  log('🎙️', `Transcribing ${durationMinutes.toFixed(1)} min via ${GROQ_API_KEY ? 'Groq' : 'OpenAI'}...`);

  const audioBuffer = readFileSync(audioPath);
  const blob = new Blob([audioBuffer], { type: 'audio/wav' });

  const formData = new FormData();
  formData.append('file', blob, basename(audioPath));
  formData.append('model', model);
  formData.append('response_format', 'verbose_json');
  formData.append('timestamp_granularities[]', 'segment');

  const response = await fetch(`${baseUrl}/audio/transcriptions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}` },
    body: formData,
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Whisper API error (${response.status}): ${err}`);
  }

  const result = await response.json();

  // Track cost
  const costUsd = durationMinutes * 0.006;
  recordSpend('whisper-per-minute', costUsd, log);

  const segments: TranscriptSegment[] = (result.segments || []).map((s: any) => ({
    start: s.start,
    end: s.end,
    text: s.text.trim(),
  }));

  return {
    text: result.text || segments.map(s => s.text).join(' '),
    segments,
    language: result.language || 'en',
    durationMinutes,
  };
}
```

---

## TASK 5: Create `lib/video-engine/modes.ts`

```typescript
/**
 * Video Context Engine — Analysis Mode Prompts
 * Each mode shapes how Claude interprets the frames + transcript.
 */

import type { AnalysisMode, VideoMetadata } from './types';

export function getSystemPrompt(mode: AnalysisMode, metadata: VideoMetadata): string {
  const base = `You are analyzing a video titled "${metadata.title}" by ${metadata.uploader} (${metadata.duration}s, ${metadata.resolution}). You have timestamped frames and a full transcript.`;

  switch (mode) {
    case 'viral':
      return `${base}

You are a viral content engineer. Deconstruct this video's mechanics:

1. HOOK (first 3 seconds): What's visually on screen? What are the exact words? What pattern interrupt is used?
2. RETENTION STRUCTURE: Where are the "open loops" or curiosity gaps? Time them.
3. PACING: Average shot length. Where do cuts land relative to beats or sentences?
4. TEXT/GRAPHICS: What on-screen text appears? Font style? Placement? Animation?
5. AUDIO: Music bed energy? Voice tone? Where does volume/energy shift?
6. CTA/ENDING: How does it end? Loop-friendly? Clear CTA?

Output as structured JSON with keys: hook, retention_loops, pacing, text_graphics, audio_analysis, ending, overall_score (1-10), key_takeaways.`;

    case 'heat':
      return `${base}

You are a production engineer / mastering analyst. Extract technical parameters from what you see:

1. If you see an EQ curve: document center frequency, Q width, gain (±dB) for every visible band.
2. If you see a compressor: threshold, ratio, attack, release, knee, makeup gain.
3. If you see a limiter: ceiling, release, true peak.
4. If you see waveforms: describe dynamic range, apparent LUFS, crest factor.
5. If you see DAW settings: BPM, key, time signature, plugin chain order.
6. Document the speaker's technique tips verbatim when they explain WHY they make a move.

Output as structured JSON with keys: eq_bands[], compressor_settings, limiter_settings, techniques[], key_quotes[], applicable_tracks (which of my tracks this applies to).`;

    case 'brand':
      return `${base}

You are a Visual Creative Director analyzing this artist's/creator's aesthetic DNA:

1. COLOR: Dominant palette (hex codes if possible). LUT style (warm, cold, desaturated, high-contrast). Shadows/highlights split toning.
2. LIGHTING: Key light direction. Ratio. Practicals? Motivated? Unmotivated? Color temp.
3. FRAMING: Lens focal length guess. Aspect ratio. Headroom. Rule of thirds or center-weighted.
4. CUT RHYTHM: Average shot length. Cut on action or cut on beat? Transition types (hard cut, dissolve, whip).
5. FASHION/SET: What is the subject wearing? Set design elements. Props. Texture.
6. TYPOGRAPHY: If any text — font weight, color, placement pattern, animation.
7. MOOD KEYWORDS: 5 words that capture the overall vibe.

Output as structured JSON with keys: color_palette, lighting, framing, cut_rhythm, fashion_set, typography, mood_keywords, production_budget_estimate, recreatability_score (1-10, how easily this could be replicated with iPhone + basic lighting).`;

    case 'debug':
      return `${base}

You are debugging a screen recording. The user recorded their screen to show you a problem.

1. Identify the application visible in each frame.
2. Note any error messages, console output, or UI state changes between frames.
3. Identify the exact moment something goes wrong (which frame transition).
4. Hypothesize root cause based on visual evidence.
5. Suggest specific code fix or configuration change.

Output: problem_identified, frames_of_interest, root_cause, suggested_fix.`;

    case 'calibrate':
      return `${base}

You are calibrating a content production system. Extract structured data for a reference_reels.json entry:

1. HOOK TIMING: Exact second the hook lands (visual + audio sync point).
2. TEXT PLACEMENT: Where on screen does text appear? (top-third, center, lower-third, none)
3. COLOR PALETTE: Top 5 hex colors visible across all frames.
4. CUT RHYTHM: Count total cuts. Divide by duration for average shot length.
5. ASPECT RATIO: 9:16, 16:9, 1:1, 4:5?
6. VISUAL STYLE: One phrase (e.g., "dark moody studio", "bright outdoor", "animated overlay", "split-screen")
7. MUSIC SYNC: How tightly do visual cuts sync to beat? (tight, loose, none)

Output ONLY valid JSON matching this schema:
{
  "hookTimingSec": number,
  "textPlacement": string,
  "colorPalette": string[],
  "cutRhythm": { "avgShotLengthSec": number, "totalCuts": number },
  "aspectRatio": string,
  "visualStyle": string,
  "musicSync": string
}`;
  }
}

export function getUserPrompt(transcript: string, frameCount: number): string {
  return `Here is the full transcript with timestamps:

${transcript}

I have attached ${frameCount} frames extracted at regular intervals from this video. Analyze them alongside the transcript to produce your structured output.`;
}
```

---

## TASK 6: Create `lib/video-engine/analyze.ts`

```typescript
/**
 * Video Context Engine — Claude Vision Analysis
 * Feeds frames + transcript to Claude and returns structured analysis.
 */

import Anthropic from '@anthropic-ai/sdk';
import { readFileSync } from 'fs';
import { basename } from 'path';
import type { AnalysisMode, ExtractedFrames, Transcription, VideoMetadata } from './types';
import { getSystemPrompt, getUserPrompt } from './modes';
import { recordSpend } from '../content-factory/budget';
import { MODEL_TIER_MAP } from '../constants';

const anthropic = new Anthropic();

/**
 * Run Claude analysis on extracted frames + transcript.
 */
export async function analyzeVideo(
  mode: AnalysisMode,
  metadata: VideoMetadata,
  frames: ExtractedFrames,
  transcript: Transcription,
  log: (emoji: string, msg: string) => void
): Promise<{ analysis: string; structured: Record<string, unknown> | null; costUsd: number }> {
  const systemPrompt = getSystemPrompt(mode, metadata);

  // Build transcript with timestamps
  const timestampedTranscript = transcript.segments
    .map(s => `[${formatTime(s.start)}] ${s.text}`)
    .join('\n');

  const userText = getUserPrompt(timestampedTranscript, frames.count);

  // Build content blocks: text + images
  const content: Anthropic.MessageCreateParams['messages'][0]['content'] = [
    { type: 'text', text: userText },
  ];

  // Attach frames as base64 images (max 20)
  for (const framePath of frames.paths.slice(0, 20)) {
    const imageData = readFileSync(framePath).toString('base64');
    content.push({
      type: 'image',
      source: {
        type: 'base64',
        media_type: 'image/jpeg',
        data: imageData,
      },
    });
  }

  // Use Haiku for cost efficiency (vision-capable, $0.003/analysis estimate)
  const model = mode === 'brand' || mode === 'heat'
    ? MODEL_TIER_MAP.sonnet  // More nuanced modes get Sonnet
    : MODEL_TIER_MAP.haiku;  // Viral/calibrate/debug get Haiku

  log('🧠', `Analyzing with ${model} (${mode} mode, ${frames.count} frames)...`);

  const response = await anthropic.messages.create({
    model,
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: 'user', content }],
  });

  const analysis = response.content
    .filter(block => block.type === 'text')
    .map(block => (block as Anthropic.TextBlock).text)
    .join('\n');

  // Estimate cost based on model
  const costUsd = model.includes('haiku') ? 0.003 : 0.045;
  recordSpend(
    model.includes('haiku') ? 'claude-haiku-curation' : 'claude-sonnet-curation',
    costUsd,
    log
  );

  // Try to parse structured JSON from response
  let structured: Record<string, unknown> | null = null;
  try {
    const jsonMatch = analysis.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      structured = JSON.parse(jsonMatch[0]);
    }
  } catch {
    // Not all modes output clean JSON
  }

  return { analysis, structured, costUsd };
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}
```

---

## TASK 7: Create `scripts/watch.mjs` (CLI Entry Point)

```javascript
#!/usr/bin/env node
/**
 * watch.mjs — Video Context Engine CLI
 * =====================================
 * Usage:
 *   node scripts/watch.mjs <url> [--mode viral|heat|brand|debug|calibrate] [--artist "Name"]
 *
 * Examples:
 *   node scripts/watch.mjs "https://youtube.com/watch?v=..." --mode heat
 *   node scripts/watch.mjs "https://instagram.com/reel/..." --mode calibrate --artist "Brent Faiyaz"
 *   node scripts/watch.mjs "https://tiktok.com/..." --mode viral
 */

import { execSync } from 'child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';
import { randomUUID } from 'crypto';

// ── Arg parsing ──────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const url = args.find(a => !a.startsWith('--'));
const mode = args.includes('--mode') ? args[args.indexOf('--mode') + 1] : 'viral';
const artist = args.includes('--artist') ? args[args.indexOf('--artist') + 1] : '';

if (!url) {
  console.log(`
  Usage: node scripts/watch.mjs <url> [--mode viral|heat|brand|debug|calibrate] [--artist "Name"]

  Modes:
    viral     — Deconstruct hook, retention, pacing, CTA
    heat      — Extract EQ/compressor/limiter settings from tutorials
    brand     — Creative Director analysis (color, lighting, framing, fashion)
    debug     — Diagnose a screen recording
    calibrate — Output reference_reels.json entry for Content Studio

  Examples:
    node scripts/watch.mjs "https://youtube.com/shorts/abc123" --mode viral
    node scripts/watch.mjs "https://instagram.com/reel/xyz" --mode calibrate --artist "Brent Faiyaz"
  `);
  process.exit(0);
}

// ── Preflight checks ─────────────────────────────────────────────────────────
function checkDep(cmd, name) {
  try {
    execSync(`which ${cmd}`, { stdio: 'pipe' });
  } catch {
    console.error(`❌ ${name} not found. Install: brew install ${cmd}`);
    process.exit(1);
  }
}

checkDep('yt-dlp', 'yt-dlp');
checkDep('ffmpeg', 'FFmpeg');

if (!process.env.GROQ_API_KEY && !process.env.OPENAI_API_KEY) {
  console.error('❌ Set GROQ_API_KEY or OPENAI_API_KEY for Whisper transcription.');
  process.exit(1);
}
if (!process.env.ANTHROPIC_API_KEY) {
  console.error('❌ Set ANTHROPIC_API_KEY for Claude analysis.');
  process.exit(1);
}

// ── Logger ───────────────────────────────────────────────────────────────────
function log(emoji, msg) {
  console.log(`${emoji} ${msg}`);
}

// ── Main pipeline ────────────────────────────────────────────────────────────
async function main() {
  const sessionId = randomUUID().slice(0, 8);
  const workDir = join(process.cwd(), '.video-engine-tmp');
  if (!existsSync(workDir)) mkdirSync(workDir, { recursive: true });

  log('📥', `Downloading: ${url}`);

  // Step 1: Get metadata
  const metaRaw = execSync(`yt-dlp --dump-json --no-download "${url}"`, {
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024,
  });
  const info = JSON.parse(metaRaw);
  const metadata = {
    url,
    title: info.title || 'Untitled',
    duration: info.duration || 0,
    resolution: `${info.width || 0}x${info.height || 0}`,
    uploader: info.uploader || info.channel || 'Unknown',
    uploadDate: info.upload_date || '',
    thumbnailUrl: info.thumbnail || null,
  };

  log('📋', `"${metadata.title}" by ${metadata.uploader} (${metadata.duration}s)`);

  // Step 2: Download video
  const videoPath = join(workDir, `${sessionId}.mp4`);
  execSync(
    `yt-dlp -f "bestvideo[height<=1080]+bestaudio/best[height<=1080]" --merge-output-format mp4 -o "${videoPath}" "${url}"`,
    { stdio: 'pipe', maxBuffer: 100 * 1024 * 1024 }
  );
  log('✅', `Downloaded to ${videoPath}`);

  // Step 3: Extract frames
  const framesDir = join(workDir, `${sessionId}_frames`);
  mkdirSync(framesDir, { recursive: true });

  const interval = metadata.duration <= 30 ? 2 : metadata.duration <= 300 ? 5 : 10;
  execSync(
    `ffmpeg -i "${videoPath}" -vf "fps=1/${interval}" -q:v 3 -frames:v 20 "${join(framesDir, 'frame_%03d.jpg')}" -y`,
    { stdio: 'pipe' }
  );

  const { readdirSync } = await import('fs');
  const framePaths = readdirSync(framesDir)
    .filter(f => f.endsWith('.jpg'))
    .sort()
    .map(f => join(framesDir, f));

  log('🎞️', `Extracted ${framePaths.length} frames (every ${interval}s)`);

  // Step 4: Extract audio + transcribe
  const audioPath = join(workDir, `${sessionId}_audio.wav`);
  execSync(
    `ffmpeg -i "${videoPath}" -vn -acodec pcm_s16le -ar 16000 -ac 1 "${audioPath}" -y`,
    { stdio: 'pipe' }
  );

  const durationMinutes = metadata.duration / 60;
  log('🎙️', `Transcribing ${durationMinutes.toFixed(1)} min...`);

  const apiKey = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;
  const baseUrl = process.env.GROQ_API_KEY
    ? 'https://api.groq.com/openai/v1'
    : 'https://api.openai.com/v1';
  const whisperModel = process.env.GROQ_API_KEY ? 'whisper-large-v3' : 'whisper-1';

  const audioBuffer = readFileSync(audioPath);
  const blob = new Blob([audioBuffer], { type: 'audio/wav' });
  const formData = new FormData();
  formData.append('file', blob, 'audio.wav');
  formData.append('model', whisperModel);
  formData.append('response_format', 'verbose_json');
  formData.append('timestamp_granularities[]', 'segment');

  const whisperResp = await fetch(`${baseUrl}/audio/transcriptions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}` },
    body: formData,
  });

  if (!whisperResp.ok) {
    const errText = await whisperResp.text();
    throw new Error(`Whisper error (${whisperResp.status}): ${errText}`);
  }

  const whisperResult = await whisperResp.json();
  const segments = (whisperResult.segments || []).map(s => ({
    start: s.start,
    end: s.end,
    text: s.text.trim(),
  }));
  const fullTranscript = whisperResult.text || segments.map(s => s.text).join(' ');
  log('✅', `Transcribed: ${fullTranscript.slice(0, 80)}...`);

  // Step 5: Claude analysis
  const { default: Anthropic } = await import('@anthropic-ai/sdk');
  const anthropic = new Anthropic();

  // Import mode prompt
  const { getSystemPrompt, getUserPrompt } = await import('../lib/video-engine/modes.ts');

  const systemPrompt = getSystemPrompt(mode, metadata);
  const timestampedTranscript = segments
    .map(s => `[${Math.floor(s.start / 60)}:${String(Math.floor(s.start % 60)).padStart(2, '0')}] ${s.text}`)
    .join('\n');
  const userText = getUserPrompt(timestampedTranscript, framePaths.length);

  // Build message content with images
  const content = [{ type: 'text', text: userText }];
  for (const fp of framePaths.slice(0, 20)) {
    const imgData = readFileSync(fp).toString('base64');
    content.push({
      type: 'image',
      source: { type: 'base64', media_type: 'image/jpeg', data: imgData },
    });
  }

  const claudeModel = (mode === 'brand' || mode === 'heat')
    ? 'claude-sonnet-4-6'
    : 'claude-haiku-4-5';

  log('🧠', `Analyzing with ${claudeModel} (${mode} mode)...`);

  const response = await anthropic.messages.create({
    model: claudeModel,
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: 'user', content }],
  });

  const analysis = response.content
    .filter(b => b.type === 'text')
    .map(b => b.text)
    .join('\n');

  // Step 6: Output
  const costWhisper = durationMinutes * 0.006;
  const costClaude = claudeModel.includes('haiku') ? 0.003 : 0.045;
  const totalCost = costWhisper + costClaude;

  log('💰', `Total cost: $${totalCost.toFixed(4)} (Whisper: $${costWhisper.toFixed(4)}, Claude: $${costClaude.toFixed(4)})`);

  // Save full result
  const result = {
    url,
    metadata,
    mode,
    transcript: { text: fullTranscript, segments, language: whisperResult.language || 'en', durationMinutes },
    frameCount: framePaths.length,
    analysis,
    cost: { whisperUsd: costWhisper, claudeUsd: costClaude, totalUsd: totalCost },
    timestamp: new Date().toISOString(),
  };

  const outputDir = join(process.cwd(), 'calibration');
  if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });

  const outputFile = join(outputDir, `watch_${sessionId}.json`);
  writeFileSync(outputFile, JSON.stringify(result, null, 2));
  log('📄', `Full result saved: ${outputFile}`);

  // If calibrate mode: append to reference_reels.json
  if (mode === 'calibrate') {
    const reelsPath = join(outputDir, 'reference_reels.json');
    let reelsData = { version: 1, lastUpdated: '', reels: [] };

    if (existsSync(reelsPath)) {
      try { reelsData = JSON.parse(readFileSync(reelsPath, 'utf8')); } catch {}
    }

    // Parse structured data from analysis
    let structured = {};
    try {
      const jsonMatch = analysis.match(/\{[\s\S]*\}/);
      if (jsonMatch) structured = JSON.parse(jsonMatch[0]);
    } catch {}

    const reelEntry = {
      url,
      title: metadata.title,
      artist: artist || metadata.uploader,
      hookTimingSec: structured.hookTimingSec || 0,
      textPlacement: structured.textPlacement || 'unknown',
      colorPalette: structured.colorPalette || [],
      cutRhythm: structured.cutRhythm || { avgShotLengthSec: 0, totalCuts: 0 },
      aspectRatio: structured.aspectRatio || '9:16',
      visualStyle: structured.visualStyle || '',
      musicSync: structured.musicSync || '',
      analyzedAt: new Date().toISOString(),
    };

    reelsData.reels.push(reelEntry);
    reelsData.lastUpdated = new Date().toISOString();
    writeFileSync(reelsPath, JSON.stringify(reelsData, null, 2));
    log('📐', `Added to reference_reels.json (${reelsData.reels.length} total reels)`);
  }

  // Print analysis to stdout
  console.log('\n' + '═'.repeat(60));
  console.log(`MODE: ${mode.toUpperCase()} | "${metadata.title}"`);
  console.log('═'.repeat(60) + '\n');
  console.log(analysis);
  console.log('\n' + '═'.repeat(60));

  // Cleanup
  try {
    execSync(`rm -rf "${join(workDir, sessionId)}*"`, { stdio: 'pipe' });
    execSync(`rm -f "${videoPath}"`, { stdio: 'pipe' });
  } catch {}

  log('🧹', 'Cleaned up temp files.');
  log('✅', 'Done.');
}

main().catch(err => {
  console.error('❌ Fatal error:', err.message);
  process.exit(1);
});
```

---

## TASK 8: Add `.env.local` entries

Append to `scratch/content-studio/.env.local` (create if not exists):

```env
# Video Context Engine
GROQ_API_KEY=gsk_PLACEHOLDER
ANTHROPIC_API_KEY=sk-ant-PLACEHOLDER
```

Ethan will fill in real keys. The ANTHROPIC_API_KEY may already be set system-wide — check `echo $ANTHROPIC_API_KEY` first.

---

## TASK 9: Add npm script

In `package.json`, add to `"scripts"`:

```json
"watch": "node scripts/watch.mjs"
```

So usage becomes: `npm run watch -- "https://..." --mode viral`

---

## TASK 10: Verify

```bash
cd scratch/content-studio

# 1. Check TypeScript compiles (the .ts library files)
npx tsc --noEmit

# 2. Check watch.mjs has correct shebang and is executable
head -1 scripts/watch.mjs  # should be #!/usr/bin/env node

# 3. Check help output
node scripts/watch.mjs

# 4. Verify calibration dir exists
ls calibration/
```

Do NOT run an actual video analysis (needs real API keys). Just verify structure.

---

## IMPORTANT NOTES

1. `watch.mjs` is an ES module (`.mjs`). It imports from `../lib/video-engine/modes.ts` — this requires either:
   - A build step (compile .ts to .js first), OR
   - Use `tsx` as the runner: change shebang to `#!/usr/bin/env npx tsx` and rename to `watch.ts`
   
   **Recommended: rename to `watch.ts` and use `tsx`.** Add `tsx` to devDependencies:
   ```json
   "tsx": "^4.0.0"
   ```
   And update the npm script:
   ```json
   "watch": "npx tsx scripts/watch.ts"
   ```

2. The `.video-engine-tmp/` directory should be added to `.gitignore`.

3. Budget tracking uses the existing `budget.ts` system — all API calls go through the Steel Dome.

4. Frame count is capped at 20 to stay within Claude's vision context window efficiently.

5. The `calibrate` mode writes directly to `reference_reels.json` — this is how Content Studio gets its taste model populated.

---

## COMMIT MESSAGE

```
feat(video-engine): add watch CLI for video analysis pipeline

- scripts/watch.ts: CLI entry (yt-dlp → FFmpeg → Whisper → Claude)
- lib/video-engine/: types, download, extract, transcribe, analyze, modes
- 5 analysis modes: viral, heat, brand, debug, calibrate
- calibrate mode writes to reference_reels.json for Content Studio
- Budget tracked via existing Steel Dome system
- Cost: ~$0.01 per 60s video (Groq Whisper + Claude Haiku)
```

## RULES
- Distributor is Amuse. Do not change.
- Do NOT touch any existing Content Studio files except package.json (add script + tsx dep).
- Do NOT touch oracle-compass, brain/, or any other repo.
- All new files go in `scratch/content-studio/scripts/` and `scratch/content-studio/lib/video-engine/`.
- Add `.video-engine-tmp/` to `.gitignore`.
