# Label OS System: A-Z Infrastructure Matrix

This matrix maps out the complete chain of logic connecting source data (A) to the specific executing endpoint and output (Z). It reveals exactly how the Master Asset Vault centralizes external data points and injects them as structured context directly into each AI agent, creating a unified intelligence layer.

Use this matrix to audit current connections or plug in **new** modules (e.g., adding an Advertising Agent, a Video Generation Agent, or a Fan-Community Route). 

## Primary A-Z Pathway Architecture

| Node | Domain / Layer | System Component | Definition & Role |
| :--- | :--- | :--- | :--- |
| **A** | **Static Input** | `lib/studioData.ts` (Cyanite) & `lib/brandVoice.ts` | The foundational truth. Contains sonic structures (BPM, key, mood scores) and brand identity (palette, voice rules). Hardcoded to prevent hallucination. |
| **B** | **Dynamic Input** | `components/label/VaultManager.tsx` | The UI layer for ingestion. Where user feeds track lyrics, uploads artist reference photos, and standardizes cover art URLs. |
| **C** | **Storage DB** | `IndexedDB` (Browser storage API) | **🚨 VULNERABILITY:** Persistent dynamic storage. Base64 strings for images, long-text block storage for lyrics. *Note: Vulnerable to browser history wipes (The Jenga block).* |
| **D** | **The Synthesizer** | `lib/assetVault.ts` | The core intelligence bridge. Reads **A** (static) and **C** (dynamic), merging them into typed objects: `TrackAssets` and `ArtistAssets`. |
| **E** | **Context Builders** | `buildSonicContext(assets)`, `buildLyricsContext()`, etc. | Formatting functions exported by **D**. Translates raw JSON arrays into human/LLM-readable text prompt blocks (e.g., `"BPM: 120, Key: B min"`). |
| **F** | **Agent Injection** | Front-end Panels (`ANRPanel.tsx`, `CopyVault.tsx`, `CreativeDept.tsx`) | Component logic pulls from **D** and **E**, constructing the payload request body before hitting the API. |
| **G** | **API Routing** | `app/api/label/[department]/route.ts` | The backend endpoint that handles the prompt. It marries the system prompt + user instructions + **E** (the Vault Context). |
| **H** | **AI Engine** | Claude (or active LLM) | Processes the merged context to execute domain-specific requests (analysis, copy, ideation) based on exact data points. |
| **I** | **Generative Output** | `app/api/label/image/route.ts` & DALL-E 3 | Generative endpoint. Creates cover art/graphics using **A** (Brand Palette), **A** (Mood), and **C** (Lyrics) as DALL-E 3 params. |
| **I.b** | **Curation Gateway** | UI Button ("Set as Canonical") | **🛡️ QUALITY FILTER:** Prevents database pollution. Generated assets sit in temporary memory until the human explicitly promotes the asset, saving it back to **C** (Vault DB). |
| **J** | **Action Output** | Rendered UI / Copied Text | The synthesized AI responses (e.g., PR bios mentioning actual lyric lines, A&R plans rooted in 120 BPM analysis). |
| **Z** | **Final Execution** | `lib/killList.ts` & `lib/toolchain.ts` | The specific mechanical action the artist must take. Maps the output (e.g., a music video treatment) directly to specific software routines (e.g., "Open After Effects, 720x1280", "Open Photoshop"). |

---

## Agent-Specific Logic Chains

### 1. A&R Intelligence Chain
*Logic: Analyze market positioning based on actual sonic data and lyrical themes.*
- **Step 1 (Source):** Cyanite (`BPM`, `key`, `moodScores` like sexy/chill) + Lyrics (IndexedDB).
- **Step 2 (Builder):** `getTrackAssets("Title")` → `buildSonicContext()`.
- **Step 3 (Panel):** `ANRPanel.tsx` fetches Vault and packages `sonicContext` and `lyricsContext`.
- **Step 4 (API):** `api/label/anr/route.ts` receives exact data. Claude receives structured prompt.
- **Step 5 (Output):** 100% accurate A&R analysis (no hallucinated sonic structures).
- **Step 6 (Execution Z):** User reviews strategy for timeline and release scheduling.

### 2. Copy / PR Generation Chain
*Logic: Draft press releases, bios, and captions using established brand voice and literal track lyrics.*
- **Step 1 (Source):** `brandVoice.ts` + IndexedDB Lyrics + Cyanite `projectRole`.
- **Step 2 (Builder):** `getArtistAssets()` + `buildLyricsContext()`.
- **Step 3 (Panel):** `CopyVault.tsx` passes Voice rules and literal track lyrics to API.
- **Step 4 (API):** `api/label/pr/route.ts` replaces old hallucination behavior with literal lyrics blocks.
- **Step 5 (Output):** Press releases that directly quote the track; Bios aligned with brand voice.
- **Step 6 (Execution Z):** Pitch sent via **un:hurd** or **Groover** tool pipelines.

### 3. Creative / Visual Production Chain
*Logic: Generate visuals (cover art, treatments) strictly adhering to color palettes and song vibe.*
- **Step 1 (Source):** `brandVoice.ts` (Deep Emerald, Midnight Navy) + Cyanite Mood (Romantic/Energetic) + IndexedDB Lyrics snippet.
- **Step 2 (Builder):** `assetVault.ts` provides `TrackAssets` and `ArtistAssets.baselinePhotos`.
- **Step 3 (Panel):** `CreativeDept.tsx` packages sonic mood profile + forbidden colors list.
- **Step 4 (API/Engine):** 
  - For concepts: `api/label/creative/route.ts` -> Video treatments referencing song structure.
  - For Art: `api/label/image/route.ts` -> DALL-E 3 constructs prompt enforcing 35mm grain and brand palette.
- **Step 5 (Output Z):** Generated cover art saved back to Vault OR Treatment mapped to Kill List.
- **Step 6 (Execution Z):** User opens **Photoshop** (for cover touchups) or **After Effects** (for Canvas) exactly as dictated by `killList.ts`.

---

## Adding New Connectors (The Matrix Expansion)

When ready to add a new tool or agent (e.g., an automated TikTok Ad Script Generator), simply patch into the core framework at nodes **C** and **D**:
1. Check if required data (e.g., previous ad spend parameters) exists in **A** (static) or needs a new **B** intake in `VaultManager`.
2. Update **D** (`assetVault.ts`) to expose the new data points.
3. Build a new contextualizer in **E** (`buildAdContext()`).
4. Create the new Panel (**F**) and API (**G**) to inherit the exact logic pipeline.

---

## 🔁 The Z → A Feedback Loop (The Flywheel)

You asked if there is a way to **Z back into A**. The answer is yes—this is how the system becomes a self-improving **AI Flywheel**. 

When an output (Z) alters the foundational truth of the project, it must loop back to become a new input (A/C). 

### Current Z → A Loops in the System
1. **Generative Art → Vault Intake:** 
   - **Path:** API generates cover art (I) → Route automatically saves the `url` string back to `IndexedDB` (C) via `saveTrackCoverArt()`. 
   - **Result:** The output (Z) instantly becomes a new input constraint (A) for the Creative Dept making video treatments.
2. **Copywriting → Canonical Bio:**
   - **Path:** User generates a press release (J) → User copies the best one-liner and pastes it into Vault Manager (B) → Saves to `ArtistAssets` (C).
   - **Result:** Future copy generation inherits that literal one-liner as a brand rule.

### Future Z → A Automations to Build
To fully automate the flywheel, we need **Write-Back Connectors** at the API layer:

| Domain | The Output (Z) | The Write-Back Mechanism (Z → A) | Resulting Loop |
| :--- | :--- | :--- | :--- |
| **A&R** | Determines a track should shift from "Loosie" to "Lead Single" | API rewrites `projectRole` in `studioData.ts` (or IDB) via a Node.js file system update script. | PR and Creative instantly pivot strategy based on the new role. |
| **Kill List** | User checks off "Render Instrumental" task | UI updates IDB track status boolean `hasInstrumental = true`. | API automatically unlocks Sync/Licensing agent routes that require an instrumental. |
| **Data/Ads**| SongTools campaign finishes, returns ROAS & audience data | Webhook pushes demographics into `VaultManager` (B) / IDB (C). | Brand voice and PR copy automatically adjust tone to target the new converting demographic. |

**The ultimate goal mapping:** If you want Z to automatically update A without human copy-pasting, the Node.js API routes (G) need filesystem write permissions to update `studioData.ts` or `brandVoice.ts` directly, or purely rely on persistent server-side databases (like PostgreSQL/Vercel Postgres) instead of static `.ts` files.
