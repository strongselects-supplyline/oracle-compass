# Claude Handoff: Master Asset Vault & Architecture Update (March 19, 2026)

**Context for Claude:** We have just completed a major architectural upgrade this morning for the Label OS platform. We built and fully integrated the **Master Asset Vault**, which serves as the centralized resource layer for all agents (A&R, Copy/PR, Creative) so they are no longer guessing or hallucinating data. This document outlines the current state of the application.

## 1. The Core Problem Solved
Previously, agents were siloed. A&R lacked actual sonic data (BPM, mood) and no agents had access to track lyrics, cover art, or artist baseline photos. The Master Asset Vault unifies static codebase data (`studioData.ts`, `brandVoice.ts`) with dynamic, user-provided data (lyrics, cover art, photos stored via IndexedDB).

## 2. New Architecture & Files Created
- **`lib/assetVault.ts`**: The central data layer. It natively marries Cyanite sonic data with IndexedDB storage (`getTrackAssets`, `getArtistAssets`, etc.). Also provides context builders like `buildSonicContext` and `buildLyricsContext` to format prompt-ready text blocks.
- **`components/label/VaultManager.tsx`**: The intake UI on the Label page where the user can paste lyrics, upload cover art (base64 IDB), add reference photos, and see missing vault items.
- **`lib/toolchain.ts`**: The Artist Toolchain Registry, statically storing exact software/tools the artist uses (e.g., Photoshop, After Effects, CapCut, OpusClip, Amuse, Masterchannel).
- **`app/api/label/image/route.ts`**: A dedicated DALL-E 3 route for generating generative cover art dynamically using the sonic mood profile, brand palette, and lyrics snippet.

## 3. Agents Wired to Real Data (Modified Files)
All major agent panels now pull from the Vault **before** hitting their API routes, drastically improving their contextual awareness:

- **A&R Dept**
  - `components/label/ANRPanel.tsx` & `app/api/label/anr/route.ts`: Now injects exact Cyanite data (`bpm`, `key`, `moodScores`) and lyrics instead of requesting Claude to hallucinate them.
- **PR / Copy Dept**
  - `components/label/CopyVault.tsx` & `app/api/label/pr/route.ts`: Vault context completely replaces the old `buildTrackContext()`. Copy now references actual track lyrics and sonic elements.
- **Creative Dept**
  - `components/label/CreativeDept.tsx` & `app/api/label/creative/route.ts`: Video treatments/cover prompts are now informed by true lyrics and mood profiles.

## 4. Kill List Tool Updates
- **`lib/killList.ts`**: We updated the `howTo` arrays to reference actual production tools based on our toolchain (e.g., specific instructions for **After Effects**, **Photoshop**, **CapCut**, **OpusClip**, **Amuse**, **Musixmatch**, etc.), so the user knows exactly what application to open for any given task.

## 5. Appended Documentation Models
I have structured the exact logic required for this architecture and the executing toolchain.
You must align closely with these two matrices:

### A-Z Logic Matrix & Flywheel Automation
We mapped out the Z → A Feedback Loop. The **Curation Gateway** (local temporary state) prevents pollution, and only upon "Save to Vault" does the DALL-E image/Copy string persist into IndexedDB. Future automations mean Node.js API writes will explicitly overwrite `studioData.ts` roles upon human selection.

### The Operator's Toolchain
The workflow strictly separates deliverables by tool logic:
- **Photoshop/GoDaddy Pro**: Core static aesthetic cover design.
- **After Effects**: Spotify Canvas and YouTube Visualizer 720x1280 8-sec loops.
- **CapCut & OpusClip**: OpusClip takes the primary Premiere Pro video and AI-cuts 15 viral shorts, finishing inside CapCut to mass-distribute.
- **SongTools & un:hurd**: Drives localized algorithmic priming. un:hurd data feeds the exact PR copy demographic context (Z inputting directly to A for PR APIs).

## Next Steps / State of the App
- The application now correctly saves dynamic assets (lyrics, cover art, artist baseline photos) client-side into IndexedDB.
- All AI API calls are correctly hydrated with rich contextual payloads (sonic structure + lyrics + brand voice).
- DALL-E 3 cover generation and image rendering are functional within the Creative Dept panel.

*You are now fully caught up. Use this architecture matrix to inform any copy, creative strategy, or generation prompts going forward.*
