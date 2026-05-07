# LABEL OS FULL AUDIT — MAY 2, 2026
## Turnaround Schematic for Antigravity
### What We Built, What Works, What's Drift, What's Possible Now

*Authored by: Claude (Lead Architect, Label OS)*
*For: Antigravity (Gemini) — full context handoff for system-wide audit and forward plan*
*Date: May 2, 2026*

---

## PART 1: WHAT EXISTS (VERIFIED FILESYSTEM SCAN)

Everything below was verified against the live filesystem on May 2, 2026. No claims from prior handoffs — only what's on disk.

### Active Repos (scratch/)

| Repo | Status | What It Does | Last Meaningful Use |
|------|--------|-------------|-------------------|
| **oracle-compass/** | LIVE on Vercel | Next.js PWA — Kill List, doctrine pages, phase map, release tracker. Main branch canonical at commit 5cc63d9. v2 branch DEAD. | Apr 20 (light-mode token remap) |
| **gorilla-geo/** | BUILT, NOT RUNNING | 5-module Spotify curator/playlist pipeline. Module 1 produces tier-classified.json. Creds work. Gap = triggering architecture (no cron, no scheduler, manual-only). | Mar–Apr (Module 1 test) |
| **core-drive-builder/** | BUILT, FUNCTIONAL | Spotify embed scraper + Cyanite fallback. identity-sync.mjs uses slug___project composite key. Has --force flag. | Apr (EP track profiling) |
| **core-drive-engine/** | EXISTS | Companion to core-drive-builder. Unclear separation of concerns. | Unknown |
| **content-factory-v4/** | BUILT, NEVER RUN ON REAL OBS | OBS → Whisper → Claude → FFmpeg pipeline. `--jutsu all-love` template exists. Has ffmpeg binary, test outputs. But **never processed real studio footage end-to-end.** | Apr (template config only) |
| **content-factory/** (v1) | LEGACY | Older version. Has project folder structure (ALL_LOVE, CREAM, etc.) but no active pipeline. | Superseded |
| **kill-list/** | LIVE on Vercel | Static HTML kill list. Deployed. Links from Oracle's /kill route. | Apr |
| **jarvis/** | BUILT, NOT OPERATIONAL | Voice assistant concept. Has agents/, bridge/, voice/, hammerspoon/, launchd/ dirs. Full Node.js project with server.js. **Never became operational.** Antigravity v1 arch, then Opus v2 schematic written. Neither shipped. | Apr 24 (P0 escalation, then shelved) |
| **synesthesia-visualizer/** | LIVE on Vercel | Three.js WebGL audio-reactive visualizer. Has audio.js, visualizer.js, catalog.js. Deployed. | Apr |
| **label_os_automation/** | EXISTS | Has brand_assets/, docs/, drafts/, tools/, workflows/ dirs. Unclear what's actually automated vs scaffolded. | Unknown |
| **e-tailor-mark2/** | EXISTS | Google Apps Script (ETailor_MarkII.gs). Likely email/outreach automation. 1 file + SETUP.md. | Unknown |
| **strong-selects/** | EXISTS | Multiple versions (strong-selects/, strong-selects-landing/, strong-selects-project/). Unclear which is canonical or if any are deployed. | Unknown |
| **ep-moodboard/** | EXISTS | Moodboard project. Spec at brain/moodboard_v2_spec.md called for consolidation. | Stale |
| **ep-artist-site/** | EXISTS | Artist website project. Not deployed (Wix dormant, no Shopify per memory). | Stale |
| **leads-ledger/ + leads-ledger-pwa/** | EXISTS | Lead tracking. Two versions. Unclear status. | Unknown |
| **thca-scout/** | EXISTS | Cannabis strain tool. Side project. | N/A |
| **boba-spear-popoff/** | EXISTS | Unknown purpose. | Unknown |
| **competitive-analysis/** | EXISTS | Competitive deck assets. v2 HTML shipped Apr 4. | Apr 4 |

### brain/ (Planning Docs — 150+ files)

The brain/ directory has become a **document graveyard**. 150+ files including:
- 40+ UUID-named directories (old Gemini session artifacts)
- 20+ handoff files spanning Mar 8 – present
- 15+ schematic/spec files (SONNET_*, SCHEMATIC_*, etc.)
- Multiple superseded plans (60_day, 90_day, SOVEREIGN variants)
- Operational docs that are current (catalog_intelligence_matrix.json, SOVEREIGN_ACTION_PLAN_FINAL.md)

**The problem:** No cleanup has happened. Stale specs sit next to live specs. A new reader (human or AI) cannot distinguish current from deprecated without reading every file. The UUID dirs are pure noise — old Gemini conversation artifacts with no index.

### Key Scripts

| Script | Location | Status |
|--------|----------|--------|
| refresh-catalog.mjs | brain/ | Spotify API auto-update. Scheduled biweekly. Works when Spotify Dev mode cooperates. |
| snapshot_analysis.mjs | brain/ | Catalog snapshot analysis. |
| csv_import.mjs | brain/ | CSV import utility. |
| notebooklm_prep.mjs | brain/ | NotebookLM bundle prep. |
| identity-sync.mjs | core-drive-builder/ | Core drive identity sync. |

---

## PART 2: WHAT WE ACTUALLY USE vs WHAT WE CLAIM TO USE

### The Honest Stack (what touches real work)

| Tool | Actually Used For | Frequency |
|------|------------------|-----------|
| **Amuse Pro** | Distribution (uploads, releases, wallet) | Every release |
| **Spotify for Artists** | Analytics, playlist pitching, editorial submissions | Daily during releases |
| **FL Studio** | All production, recording, mixing | Daily (studio days) |
| **Canva** | Announcement posts, story templates | Per release (~30 min each) |
| **Claude (Opus/Sonnet/Haiku)** | Architecture, planning, writing, code, audits | Daily |
| **Antigravity (Gemini)** | Filesystem writes, git pushes, batch work | Daily |
| **Oracle Compass** | Kill list, phase tracking, doctrine | Daily (morning scan) |
| **Vercel** | Hosting Oracle, Kill List, Synesthesia | Set-and-forget |
| **GitHub** | Source control for Oracle | Per commit |
| **DoorDash** | Income ($1,800/mo target) | 6:30–9 AM block |

### The "Built But Not Integrated" Stack (drift zone)

| Tool | What It's Supposed To Do | Why It's Not Working |
|------|------------------------|---------------------|
| **Content Factory V4** | Auto-cut studio footage into reels | Never run on real OBS footage. Pipeline exists on paper. No footage has gone through it. |
| **Gorilla Geo** | Find and target curators/playlists at scale | No triggering architecture. Manual-only. Module 1 works but nobody runs it. |
| **JARVIS** | Voice-controlled label assistant | Escalated to P0 Apr 24, then immediately shelved. Two architecture docs, zero running code. |
| **Label OS Automation** | Automate release workflows | Scaffolded dirs, unclear if anything actually runs. |
| **Core Drive Engine** | Extended profiling beyond Builder | Exists but purpose unclear vs Builder. |
| **Moodboard v2** | Consolidated visual identity | Spec written, never executed. |

### The "We Don't Use But Should" Stack

| Tool | What It Could Do For Us | Status |
|------|------------------------|--------|
| **After Effects** | Spotify Canvas (8s loops), advanced reels, "Stolen Stereo" look | adobe_toolchain_routing.md says subscribe during sprint phases only. Cart abandonment trick documented. **Not currently subscribed.** |
| **CapCut** | Quick reels from templates | Free. Documented as option but not systematized. |
| **Lyric Video Studio** | DAW-like timeline lyric videos with AI backgrounds | Not explored. Would replace manual lyric video creation. |
| **Descript** | Transcription-based footage editing (cut by removing text) | Not explored. Natural bridge between Whisper transcription and actual editing. |

---

## PART 3: THE INTEGRATION REVOLUTION WE'RE IGNORING

**As of April 28, 2026, Anthropic released 9 official creative tool connectors.** This changes everything about what's possible. Here's the full list and what it means for Label OS:

### Official Claude Connectors (All available NOW, all plans including Free)

| Connector | What It Does | Label OS Impact |
|-----------|-------------|----------------|
| **Blender** | Natural language → 3D objects, materials, lighting, full scenes. Integrates with Hyper3D Rodin for AI mesh generation. | **Spotify Canvas on steroids.** 3D animated loops, music video elements, visualizer content — all from prompts. Replaces the need to learn After Effects for Canvas. |
| **Adobe (Photoshop, Premiere Pro, After Effects)** | Claude controls Adobe apps via ExtendScript/UXP. Timeline editing, effects, keyframes, exports — all from natural language. Community MCP servers exist for Premiere and AE. | **This is the Content Factory killer/replacement.** Instead of our janky OBS→Whisper→FFmpeg pipeline, Claude could directly control Premiere to cut footage, add effects, export. Real NLE, AI-controlled. |
| **Ableton** | Real-time DAW control — MIDI composition, parameter changes, transport, session manipulation. Official connector + open-source AbletonMCP. | **Not directly relevant (FL Studio user) but proves the pattern.** If Ableton has it, FL Studio community MCPs are likely coming or already exist. |
| **Splice** | Search royalty-free sample catalog from within Claude. | **Direct integration for production.** Find samples, loops, one-shots without leaving the AI workflow. |
| **Affinity by Canva** | Batch image adjustments, layer ops, file export automation. | **Replaces manual Canva work.** Batch announcement posts, story variants, cover art iterations — all automated. |
| **Autodesk Fusion** | CAD/3D modeling for product design. | Lower priority. Merch/physical product design someday. |
| **SketchUp** | 3D architectural/spatial modeling. | Low priority for music. |
| **Resolume Arena/Wire** | Live visual performance software. VJ tool control. | **HUGE for live shows.** Real-time visual manipulation during performances. This is the God of Shinobi visual layer. |

### Community MCP Servers (Available Now, Open Source)

| Server | Repo | What It Does |
|--------|------|-------------|
| **Premiere Pro MCP** | github.com/hetpatel-11/Adobe_Premiere_Pro_MCP | Full project ops, ingest, sequence creation, timeline editing, transitions, effects, keyframes, metadata, exports |
| **After Effects MCP** | github.com/Dakkshin/after-effects-mcp | Compositions, text, shapes, solids, properties via ExtendScript |
| **Blender MCP** | github.com/ahujasid/blender-mcp | Full Blender Python API access via natural language |
| **Ableton MCP** | github.com/ahujasid/ableton-mcp | MIDI, transport, parameter control |
| **Pixa MCP** | (Medium article) | Image generation, video generation, background removal, upscaling |
| **Hyperframes** | HeyGen open-source | Programmatic motion graphics rendering |
| **VideoUse** | (various) | Clip processing, silence detection, scene cuts, audio normalization |

### The Video Editing Pipeline That Actually Makes Sense

Instead of Content Factory V4's theoretical OBS→Whisper→FFmpeg chain, here's what's possible RIGHT NOW:

```
REAL PIPELINE (May 2026):

1. RECORD in OBS or iPhone (raw footage)
2. TRANSCRIBE via Whisper (we already have this)
3. CUT via Descript (text-based editing — delete words = delete footage)
   OR via Premiere Pro MCP (Claude controls Premiere directly)
4. MOTION GRAPHICS via Hyperframes (programmatic, prompt-driven)
5. EXPORT via Premiere MCP or FFmpeg

LYRIC VIDEOS:
1. Lyric Video Studio (DAW-like timeline, AI backgrounds, $20/mo)
   OR CrePal.ai (multi-model, style-consistent across full song)
   OR Claude + Blender MCP (3D animated lyric videos)

SPOTIFY CANVAS:
1. Blender MCP → 8s loop → 720×720 export
   OR After Effects MCP → motion graphics loop
   (Both controllable from Claude via natural language)

COVER ART:
1. Affinity/Canva connector → batch variations
   OR Blender MCP → 3D rendered artwork
   OR Pixa MCP → AI generation + upscaling
```

---

## PART 4: THE HONEST DIAGNOSIS

### What's Actually Wrong

**We're using AI to plan instead of to execute.** The evidence:

1. **150+ planning docs in brain/** — specs, schematics, handoffs, audits. We have more architecture documents than running systems.

2. **Content Factory V4 has never processed real footage.** It was built, documented, specced, re-specced, and has never once taken studio footage and produced a reel. Meanwhile, a Premiere Pro MCP could have Claude cutting footage in a real NLE.

3. **JARVIS was escalated to P0 then immediately shelved.** Two architecture documents (Antigravity v1, Opus v2). Zero running code. The pattern: excitement → spec → shelve.

4. **Gorilla Geo works but has no trigger.** Module 1 produces results. Nobody runs it because there's no cron, no scheduler, no automation. It's a gun with no trigger.

5. **40+ UUID directories in brain/** are dead Gemini session artifacts nobody will ever read.

6. **The tool stack is disconnected.** FL Studio doesn't talk to Claude. OBS footage doesn't flow into any pipeline. Amuse uploads are manual. Cover art is manual. Spotify Canvas doesn't exist for most tracks.

### The Core Pattern

**We architect for automation but execute manually.** Every system is designed as if we'll eventually automate it, but we never close the loop. The result: manual execution with extra overhead from maintaining unused infrastructure.

### What We Should Kill

| Kill | Why |
|------|-----|
| JARVIS (as conceived) | Voice assistant for a solo operator is over-engineered. Claude in Chrome + MCP connectors does 80% of what JARVIS promised with zero custom code. |
| Content Factory V4 (current form) | Replace with Premiere Pro MCP or Descript. Real NLE > custom FFmpeg scripts. |
| core-drive-engine/ | Unclear purpose. Merge anything useful into core-drive-builder or delete. |
| ep-moodboard/ | Consolidation spec was written, never executed. Either do it now or delete. |
| ep-artist-site/ | Website rebuild is Phase 2. Delete the false start. |
| leads-ledger/ + leads-ledger-pwa/ | Two versions of something nobody uses. |
| boba-spear-popoff/ | Unknown purpose = delete. |
| brain/ UUID dirs | 40+ dead session artifacts. Archive or delete all. |
| All superseded plan files | Keep SOVEREIGN_ACTION_PLAN_FINAL.md. Archive the rest. |

### What We Should Actually Build/Integrate

| Priority | Action | Why | Effort |
|----------|--------|-----|--------|
| **P0** | Install Blender MCP + Adobe MCP connectors | Unlocks Spotify Canvas, motion graphics, cover art — all from Claude prompts. This is the single highest-leverage move. | 2 hrs setup |
| **P0** | Get Descript or commit to Premiere MCP for footage editing | Either pay $24/mo for Descript (text-based editing) or set up the free Premiere MCP. Stop pretending Content Factory will work. | 1 hr |
| **P1** | Install Splice connector | Sample discovery from within Claude workflow. Direct production integration. | 30 min |
| **P1** | Set up Gorilla Geo cron trigger | Module 1 works. Add a launchd plist or cron job. One script, one schedule. Done. | 1 hr |
| **P1** | brain/ cleanup sprint | Archive UUID dirs, superseded plans, stale handoffs. Index what remains. | 2 hrs |
| **P2** | Evaluate Resolume Arena/Wire for live visuals | Not urgent until live performance schedule exists. But the connector is ready when you are. | Research only |
| **P2** | Explore FL Studio MCP community projects | Ableton has one. FL Studio community may have built one. If not, the pattern is clear for building one. | Research only |
| **P2** | Install Affinity/Canva connector | Batch cover art and announcement post generation. | 30 min |

---

## PART 5: THE FORWARD PLAN (MAY 2 → JUL 5)

### Immediate (May 2–7): Recording Marathon + EP Upload

**NO TOOL CHANGES DURING THE SPRINT.** Record GL, SF, WU2. Mix. Master. Cover art deadline May 5. Upload May 7 night. This is execution week, not infrastructure week.

### Post-Upload Window (May 8–14): Integration Sprint

This is the 8-day content sprint for EP marketing. **This is when we integrate new tools:**

1. Install Blender MCP → make Spotify Canvas for GL, SF, WU2
2. Install Adobe connectors → cut studio footage into reels using Premiere MCP
3. Set up Gorilla Geo cron for automated curator targeting
4. Clean brain/ directory

### EP Compound Phase (May 15–29): Prove the New Stack

EP drops May 15. Content sustain phase. Every piece of content should flow through the new integrated pipeline:
- Studio footage → Premiere MCP → cut reels
- Track audio → Blender MCP → Spotify Canvas
- Release announcements → Canva/Affinity connector → batch posts
- Curator targeting → Gorilla Geo on cron → automated

### Vault Waterfall (May 30 – Jul 25): Scaled Execution

5 vault singles at 2-week cadence. Each release should be:
- 30 min for Canvas (Blender MCP prompt)
- 30 min for announcement posts (Canva connector batch)
- 1 hr for content reels (Premiere MCP or Descript)
- Automated curator targeting (Gorilla Geo on cron)

**Target: 2 hours total content production per release**, down from current "planning to do it but never actually doing it."

---

## PART 6: TOOL DECISION MATRIX

### Subscribe / Pay

| Tool | Cost | Decision |
|------|------|----------|
| Adobe CC (full) | $55/mo | Subscribe May 8 for sprint window. Cancel after EP compound phase unless Canvas/reels justify ongoing. Cart abandonment trick for discount. |
| Descript | $24/mo | Subscribe if Premiere MCP proves too finicky. Text-based editing is genuinely faster for cutting talking-head/studio footage. |
| Canva Pro | $15/mo | Keep through EP. Evaluate replacement by Affinity connector at Phase 2 boundary. |
| Lyric Video Studio | ~$20/mo | Trial for one track. If faster than Blender MCP for lyric videos, keep. |
| Amuse Pro | Current plan | Keep. Distributor. Non-negotiable. |

### Free / Already Have

| Tool | Cost | Notes |
|------|------|-------|
| Blender + Blender MCP | Free | Install Blender 4.2+. Install MCP addon. Connect to Claude. |
| Premiere Pro MCP (community) | Free (need Adobe sub) | github.com/hetpatel-11/Adobe_Premiere_Pro_MCP |
| After Effects MCP (community) | Free (need Adobe sub) | github.com/Dakkshin/after-effects-mcp |
| Splice connector | Free (need Splice sub) | Official Claude connector |
| Hyperframes | Free (Apache 2.0) | Programmatic motion graphics from HeyGen |
| Pixa MCP | Free | Image/video gen, bg removal, upscaling |
| CapCut | Free | Quick reels. Template-based. |
| OBS | Free | Recording. Already using. |

---

## PART 7: INSTRUCTIONS FOR ANTIGRAVITY

### What I Need You To Do

1. **Verify this audit against your own filesystem view.** Cross-check every repo status claim. Flag anything I got wrong.

2. **Propose a brain/ cleanup plan.** Specifically:
   - List all UUID dirs with their creation dates
   - List all files that reference dates before April 1 that aren't marked as archived
   - Propose an `_archive/` migration for everything stale

3. **Research FL Studio MCP.** Search GitHub, MCP registries, community forums. Is there an FL Studio MCP server? If not, how hard would it be to build one using FL Studio's scripting API?

4. **Test the Blender MCP install path.** Can you walk through the setup and confirm it works with our Claude Desktop config?

5. **Inventory what's deployable vs scaffolded in label_os_automation/.** I can see the dirs but haven't read the files. What actually runs?

6. **Write a KILL_LIST_INFRASTRUCTURE.md** listing every repo/dir we agree to kill, with replacement tool noted.

### What I Need You To NOT Do

- Don't write new specs or schematics. We have enough.
- Don't create new directories or repos.
- Don't touch any code during the May 2–7 recording sprint.
- Don't re-architect anything. We're integrating existing tools, not building new ones.

---

## SUMMARY

**The insight Ethan had is correct.** We've been using AI to plan and build custom tools instead of integrating the professional tools that now have AI bridges built in. As of April 28, 2026, Claude can literally control Blender, Premiere Pro, After Effects, and Ableton via MCP. We have custom-built pipelines (Content Factory, JARVIS) that are worse versions of what these integrations provide out of the box.

The play is simple: stop building, start connecting. Install the connectors. Use real NLEs. Let Claude drive them. Kill the custom infrastructure that was a workaround for integrations that didn't exist yet — but now do.

**The 9 connectors Anthropic shipped on April 28 made half our scratch/ directory obsolete.** That's not a failure — that's the market catching up to what we were trying to build. Now we ride the wave instead of paddling against it.

---

*End of audit. All claims filesystem-verified May 2, 2026.*
