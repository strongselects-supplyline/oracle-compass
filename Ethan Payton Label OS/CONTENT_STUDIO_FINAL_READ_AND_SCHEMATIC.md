# Content Studio: Final Read + Sonnet Execution Schematic
*May 4, 2026 | Opus synthesis for handoff to Claude Code / new session*

---

## PART 1: THE FINAL READ (Where Everything Stands)

### Artifacts Ingested → brain/ (6 of 7 saved)

| Artifact | Saved To | Primary Application |
|----------|----------|-------------------|
| Mastering Technical Breakdown | `brain/mastering_technical_breakdown.md` | Recording marathon May 1–5. LUFS gating, -18 dBFS staging, asymmetrical EQ for width. |
| JARVIS Video Context Engine | `brain/VIDEO_CONTEXT_ENGINE_SPEC.md` | Content Studio's reference_reels.json population workflow + viral deconstruction pipeline. |
| Quincy Jones Codex | `brain/sovereign_schematic_quincy.md` | Operating philosophy. 80/20 magic rule, completion > perfection, alpha state for melodies. |
| Galloway Empire Gems | `brain/sovereign_schematic_galloway.md` | Business mindset. One-man empire validation, storytelling over code, "No" muscle. |
| ClaudeCode Plugin Roadmap | `brain/CLAUDECODE_PLUGIN_ROADMAP.md` | Tooling priority order. Skill Creator NOW, GSD+ClaudeMem POST-EP. |
| Hormozi 120X Playbook | `brain/hormozi_leverage_playbook.md` | Validates Content Studio IS the Hormozi prompt chain architecturally. |
| War Mode Mindset Gems | *(not accessible this session — save when available)* | Psychological framework (impulse gap, environment wipe). |

### Cross-Alignment: What Connects to What

**Content Studio ←→ JARVIS Video Context Engine:**
These are the SAME underlying architecture (yt-dlp + FFmpeg + Whisper + Claude). The Video Context Engine's "Application D: Brand Architecture" use case is literally Content Studio's reference reel calibration pipeline. When `watch.mjs` runs on a reference Reel, its output populates `calibration/reference_reels.json` — which Content Studio uses as its taste model for moment detection.

**Content Studio ←→ Hormozi Prompt Chain:**
Content Studio's Palette Prep mode IS the three-prompt chain made real: Whisper = data extraction → Claude analysis = hook/moment detection (Prompt 1) → Composition templates = visual script generation (Prompt 2) → FFmpeg render = automated editing (Prompt 3). This is not theoretical; it's architected and partially built.

**Mastering Breakdown ←→ Recording Marathon (RIGHT NOW):**
The -18 dBFS gain staging, LUFS gate awareness, and asymmetrical EQ techniques apply to Green Light, Sweet Frustration, and Want U 2 being recorded this week. This is immediately actionable during mix/master.

**Plugin Roadmap ←→ Content Studio:**
Skill Creator is the highest-priority plugin because it packages the Content Studio Palette Prep workflow into a permanent skill (`/run palette-prep`). Once packaged, any session can invoke it without re-explaining the pipeline.

---

## PART 2: CONTENT STUDIO STATE ASSESSMENT

### What's Done
- **CONTENT_STUDIO_SPEC.md v3** — canonical architecture (brain/)
- **CONTENT_JET_SONNET_BRIEF.md** — 8-block execution plan (brain/)
- **Block 2 (Palette Engine)** — VERIFIED DONE. palette.mjs works, composition engine wired, calibration schema exists.
- **Block 3 (Modular Refactor)** — PARTIAL. analyze.ts, palette.ts, jutsus.ts, budget.ts exist. render.ts incomplete (78 lines). types.ts and constants.ts NOT created yet.

### What's Blocking
1. **types.ts + constants.ts** — Must exist before any Block 4 work. Full interfaces provided in the Sonnet brief.
2. **render.ts completion** — 6 missing functions (composeSources, renderSegment, renderAssembly, renderProxy, mixAudioTracks, buildFilterGraph).
3. **Next.js install** — DNS error killed create-next-app. Three fallback paths documented.
4. **reference_reels.json** — Template only. Ethan must populate 5 real Reels. Non-Sonnet task.

### What's NOT Blocking (But Flagged)
- OBS Source Record setup (30-min one-time, before next recording)
- War Mode artifact save (when file accessible)

---

## PART 3: SONNET EXECUTION SCHEMATIC

### Session Prompt for Claude Code

Copy this into a new Claude Code session (Sonnet model):

---

```
# CONTENT STUDIO — BLOCK 3.5 COMPLETION

## Context
Read these files first:
1. brain/CONTENT_JET_SONNET_BRIEF.md (full execution plan)
2. brain/CONTENT_STUDIO_SPEC.md (architecture spec)
3. scratch/content-studio/lib/content-factory/ (all .ts files — current state)

## Your Task: Complete Block 3.5

You are completing the backend foundation for a private content production tool. Block 2 (palette engine) is done. Block 3 modular refactor is partial. Your job is to finish it.

### Step 1: Create types.ts
Path: scratch/content-studio/lib/content-factory/types.ts
Full interfaces are specified in CONTENT_JET_SONNET_BRIEF.md under "BLOCK 3.5 — Step 1". Copy them exactly.

### Step 2: Create constants.ts
Path: scratch/content-studio/lib/content-factory/constants.ts
Specification in CONTENT_JET_SONNET_BRIEF.md under "BLOCK 3.5 — Step 2".

### Step 3: Complete render.ts
Path: scratch/content-studio/lib/content-factory/render.ts
Currently has 78 lines with only generateASS and buildZoompanExpr.
Add these missing exports:
- composeSources(sources, layout, moment, jutsuName) → wraps palette.mjs composeMoment
- renderSegment(composedPath, options) → single segment render
- renderAssembly(segments[], options) → concatenate into final reel
- renderProxy(segments[], options) → 720p, ultrafast preset, CRF 28
- mixAudioTracks(micPath, dawPath, mixRatio) → per-moment audio balance
- buildFilterGraph(jutsu, assFilter, options) → complete FFmpeg filter graph

All functions use child_process.execFile to call FFmpeg. All return Promise<string> (output path).

### Step 4: Wire reference_reels.json read
In analyze.ts (or wherever the narrative agent prompt is constructed), load calibration/reference_reels.json. If all examples have _fill_in: true, log warning. Otherwise inject populated examples as few-shot prompts for the moment detection pass.

### Step 5: Verify
Run: tsc --noEmit (install typescript devDep if needed)
All files must compile cleanly. Fix any type errors before declaring done.

## Rules
- Do NOT start Block 4 (Next.js/UI). Backend only.
- Do NOT modify palette.mjs or process.mjs (those are production).
- Import from types.ts and constants.ts throughout — no magic strings.
- Use the existing file patterns in analyze.ts and palette.ts as style guide.
```

---

### After Block 3.5: Next Session Prompt (Block 4)

```
# CONTENT STUDIO — BLOCK 4: NEXT.JS + LIBRARY + ANALYSIS UI

Read brain/CONTENT_JET_SONNET_BRIEF.md "BLOCK 4" section completely.

## Step 1: Install Next.js
cd scratch/content-studio
npm cache clean --force
npx create-next-app@14 . --typescript --app --tailwind --eslint --no-src-dir --import-alias "@/*"
(If DNS fails: npm config set registry https://registry.npmjs.org/ and retry)
(If still fails: manual scaffold per brief)

## Step 2: Install deps
npm install video.js wavesurfer.js zustand
npm install -D @types/node @types/video.js

## Step 3: Build API routes (7 endpoints per brief)
## Step 4: Build Screen 1 — Library (session grid + import)
## Step 5: Build Screen 2 — Analysis (waveform + moment cards + transcript)

Done condition: Ethan can drag OBS folder in, see it, click Analyze, watch pipeline run, see waveform with clickable moment regions.
```

---

### Recommended Schedule

| Window | Block | What Gets Built |
|--------|-------|----------------|
| May 5–7 (pre-upload) | 3.5 | types.ts, constants.ts, render.ts complete, tsc clean |
| May 8–14 (ESL drops, EP pending) | 4 | Next.js install, API routes, Library + Analysis UI |
| May 16–21 (post-EP launch) | 5 | Edit Bay + Preview (creative judgment UI) |
| May 22–29 | 6 | Export + Final Render |
| May 30 (LID content cycle) | **DOGFOOD** | First real use: produce LID vault single content through Content Studio |
| Jun+ | 7–8 | Templates, keyboard shortcuts, cloud integration |

---

## PART 4: IMMEDIATE ACTION ITEMS (Ethan)

1. **Recording marathon (May 1–5):** Use mastering_technical_breakdown.md rules. -18 dBFS into vocal chain. Check LUFS gate on quiet sections. Asymmetrical M/S on final mix bus.

2. **Populate reference_reels.json:** Before May 30, add 5 real reference Reels to `scratch/content-factory-v4/calibration/reference_reels.json`. Pick Reels whose editing style you want to replicate.

3. **OBS Source Record:** Install the Source Record plugin (30 min). Configure: webcam.mkv, screen.mkv, audio.wav as separate outputs. Test with one short session before next real recording.

4. **Cover art deadline May 5.** Non-software, non-Claude task. Just flagging it per the mission timeline.

5. **Upload GL + SF + WU2 + EP entity to Amuse:** May 7 by 11:30pm. Non-software.

---

*This document is self-contained. Hand it to any new Claude session and it has full context to continue execution.*
