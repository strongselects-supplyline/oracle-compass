# CONTENT FLOOD SYSTEM — Full Schematic
## past.El noir Records · Visual Content Pipeline (May 16, 2026)

> "I'm present. Even if I'm distant, I'm busy, I'm active, I'm creative. I'm creating till I'm 30 — no breaks."

---

## SYSTEM OVERVIEW

Three interlocking subsystems:

1. **Batch Capture Session** (3-hour focused block → 20-30 raw assets)
2. **Processing Pipeline** (Import → Transform → Output variants)
3. **AI Character System** (Seeded avatar for generative content between shoots)

Combined output target: **4-7 posts/week** minimum presence, scaling to daily during release sprints.

---

## SUBSYSTEM 1: BATCH CAPTURE SESSION (3 hours)

### Structure

| Block | Duration | Action |
|-------|----------|--------|
| 1. Mine | 45 min | Go through ALL existing photos/videos. Screenshot raw elements. Isolate textures, expressions, locations, moods. Save to `raw-elements/` |
| 2. Shoot | 60 min | Capture new content. Phone + ring light minimum. 5-7 distinct setups. BTS, direct-to-camera, aesthetic world-build, studio moments. |
| 3. Isolate | 30 min | Photopea: separate layers, remove backgrounds, create transparent PNGs of key elements (face, hands, silhouette, text). Save to `isolated/` |
| 4. Process | 45 min | Run pipeline (see Subsystem 2). Generate all output variants. Queue for posting. |

### Batch Session Rules
- Timer on each block. ADHD-proof: when timer hits, MOVE. No rabbit holes.
- Output > perfection. 80% quality at volume beats 100% quality at 1 post/week.
- Every session seeds the AI character system (Subsystem 3) with new reference material.

### Folder Structure
```
scratch/content-flood/
├── raw-elements/         # Screenshots, textures, unedited captures
├── isolated/             # Transparent PNGs, layer separations
├── shoots/               # Dated folders: 2026-05-16/, 2026-05-20/
├── processed/            # Pipeline output ready to post
├── character-seed/       # Reference images for AI character system
├── templates/            # CapCut/Photopea templates (reusable)
└── queue/                # Scheduled content with captions
    ├── ig-feed/
    ├── ig-story/
    ├── reels/
    ├── tiktok/
    └── shorts/
```

---

## SUBSYSTEM 2: PROCESSING PIPELINE

### Pipeline Stages

```
IMPORT ──→ CLASSIFY ──→ TRANSFORM ──→ OUTPUT ──→ QUEUE
  │            │              │            │          │
  │            │              │            │          └─ Schedule + caption
  │            │              │            └─ Format per platform
  │            │              └─ Apply look, crop, overlay, motion
  │            └─ Tag: type (photo/video/element), mood, usability
  └─ Ingest from shoots/, raw-elements/, isolated/
```

### Transform Options (expandable)

| Transform | Tool | What It Does |
|-----------|------|--------------|
| Signature Look | FFmpeg (test_looks.mjs) | Apply 4 color grades: Moody R&B, Warm Analog, Punchy Vibrant, Gritty Lofi |
| Parallax Motion | CapCut | Stack isolated layers, keyframe movement, 6-8 sec loop |
| Grain + Overlay | FFmpeg | Film grain texture + dust particles at 15-20% opacity |
| Text Overlay | Photopea/CapCut | Lyrics, dates, one-liners in Georgia/condensed sans |
| Aspect Crop | FFmpeg | 1:1 (feed), 4:5 (feed alt), 9:16 (story/reel), 16:9 (YouTube) |
| AI Restyle | Gemini Pro / Imagen 3 | Reference image → stylized variant (ink, watercolor, glitch, noir) |
| AI Motion | Higgsfield | Still image → 3-5 sec video with subtle movement |

### CLI Entry Point (Sonnet/Antigravity can execute)

```bash
# Process all new raw elements through default pipeline
node scratch/content-flood/pipeline.mjs --input raw-elements/ --output processed/

# Apply specific look to a batch
node scratch/content-flood/pipeline.mjs --input shoots/2026-05-16/ --look moody-rnb --format reel

# Generate AI variants from character seed
node scratch/content-flood/pipeline.mjs --mode ai-gen --seed character-seed/ --count 5
```

### pipeline.mjs Spec (for Sonnet/Antigravity to implement)

```javascript
// Core pipeline script
// Dependencies: ffmpeg-static, sharp, node-fetch (for AI APIs)
// Modes: batch, single, ai-gen
// Config: pipeline.config.json (looks, formats, AI endpoints)

const MODES = {
  batch: "Process all files in input dir through full pipeline",
  single: "Process one file with specified transforms",
  "ai-gen": "Generate new content from character seed via AI"
};

const FORMATS = {
  "ig-feed": { width: 1080, height: 1080, ext: "jpg" },
  "ig-feed-45": { width: 1080, height: 1350, ext: "jpg" },
  "reel": { width: 1080, height: 1920, ext: "mp4" },
  "story": { width: 1080, height: 1920, ext: "jpg" },
  "tiktok": { width: 1080, height: 1920, ext: "mp4" },
  "shorts": { width: 1080, height: 1920, ext: "mp4" },
  "canvas": { width: 1080, height: 1920, ext: "mp4", maxDuration: 8 }
};

const LOOKS = {
  "moody-rnb": "eq=contrast=1.15:brightness=-0.05:saturation=1.2:gamma=0.9,colorbalance=rs=-.1:bs=.15:gs=-.1:rm=.05:bm=.1:gm=0",
  "warm-analog": "eq=contrast=0.95:saturation=0.8:gamma=1.1,colorbalance=rs=.15:bs=-.1:rm=.10:bm=-.1:gm=0",
  "punchy": "eq=contrast=1.25:saturation=1.3:brightness=0.05,unsharp=5:5:1.0:5:5:0.0",
  "gritty-lofi": "eq=contrast=1.3:saturation=0.3:gamma=0.8",
  "all-love": "Deep Emerald/Gold/Navy + film grain + Georgia font (jutsu template)"
};
```

---

## SUBSYSTEM 3: AI CHARACTER SYSTEM

### Concept
A persistent, evolving digital representation of past.El that can generate content between physical shoots. NOT a deepfake — a stylized character that captures essence without pretending to be a photo.

### Character Sheet (Seed Document)

```yaml
name: past.El
physical:
  height: 6'2"
  build: athletic, ~200lb
  head: bald
  skin: fair
  eyes: light (blue-green)
  facial_hair: brown/dark-blonde beard, trimmed
  glasses: gold wire frames
  distinguishing: strong jaw, broad shoulders

aesthetic_modes:
  urban_editorial:
    palette: black, charcoal, white, gold accents
    pieces: fitted turtleneck, tailored coat, slim pants, clean sneakers
    mood: nighttime Milwaukee, 2 AM drive, amber streetlights
  soft_editorial:
    palette: cream, sage, muted earth tones
    pieces: oversized knit, linen, layered neutrals
    mood: golden hour, studio morning, intimate
  color_performer:
    palette: deep emerald, burgundy, navy, forest green
    pieces: statement jacket, textured fabric, bold single color
    mood: stage presence, confidence, movement

environments:
  - Milwaukee skyline at night (Third Ward, lakefront, bridges)
  - Studio (dim, warm, equipment visible, creative mess)
  - 2 AM drive (dashboard glow, empty roads, rain optional)
  - Rooftop / fire escape (urban elevation, city below)
  - Lake Geneva (water, trees, isolation, daytime contrast)

poses_and_energy:
  - Looking away from camera (3/4 profile, contemplative)
  - Direct eye contact (rare, impactful when used)
  - Hands in frame (rings, gestures, holding objects)
  - Silhouette (backlit, outline only)
  - Movement blur (walking, turning, mid-motion)

style_references:
  - Brent Faiyaz album art direction
  - 6LACK minimal aesthetic
  - Daniel Caesar softness
  - The Weeknd Trilogy-era darkness
  - PND moody night vibes
```

### AI Tools for Character Generation

| Tool | Use Case | Cost | Quality |
|------|----------|------|---------|
| **Gemini Pro (Imagen 3)** | Still images from character sheet + prompt | Free tier / Pro sub | High for stills |
| **Higgsfield** | Image → video (3-5 sec motion) | Free tier limited | Good for subtle motion |
| **Runway Gen-3** | More complex video gen | Paid | Highest quality |
| **Midjourney** | Stylized/artistic interpretations | Paid | Great for feed art |
| **CapCut AI** | Quick edits, background removal, effects | Free | Good enough for stories |

### Character Evolution Protocol
1. Every batch session → 3-5 new reference photos added to `character-seed/`
2. Monthly: regenerate character sheet with updated references
3. AI outputs get A/B tested — what performs goes into the "approved styles" bank
4. Character style evolves WITH the music (EP era = emerald/gold; vault era = darker palette)

### Storyboard Workflow (Joey Method)
1. Write scene description (1-2 sentences per frame)
2. Generate still frames via Gemini/Midjourney with character consistency
3. Sequence in CapCut with transitions + track audio
4. Use as pre-vis for actual video shoots OR post directly as artistic content

---

## SUBSYSTEM 4: MUDRAS & TECHNIQUES REFERENCE (Zero-Friction Access)

### Implementation: Single HTML file, saved to phone home screen as PWA

**File:** `scratch/content-flood/mudras-reference.html`

Contents:
- All mudras with images/descriptions (expandable cards)
- Breathing techniques (box breathing, 4-7-8, wim hof)
- Vocal warmup routine (5 min)
- Pre-session grounding ritual
- Body awareness check (pelvic floor, jaw, shoulders)

**Key requirement:** Opens instantly. No login. No scrolling past irrelevant stuff. Cards expand on tap. Works offline. Searchable.

---

## RATE LIMIT STRATEGY

| Task Type | Model | Why |
|-----------|-------|-----|
| Architecture decisions, strategy, audits | Opus | Needs deep reasoning |
| Pipeline implementation, file writes, git | Sonnet / Antigravity | Mechanical execution |
| Caption generation, hashtag sets, quick edits | Haiku | High volume, low complexity |
| Batch processing scripts, CLI tools | Antigravity (Gemini) | Filesystem-heavy, no reasoning needed |

**Rule:** Never burn Opus on work Sonnet can handle. Content pipeline implementation = Sonnet. Character sheet iteration = Sonnet. Only come to Opus for system design and strategic pivots.

---

## IMPLEMENTATION ORDER (for Sonnet/Antigravity push)

### Phase A — Immediate (today)
1. Create folder structure: `scratch/content-flood/` with all subdirs
2. Create `pipeline.config.json` with looks, formats, output paths
3. Create `pipeline.mjs` (core script — batch mode first, single mode, then ai-gen)
4. Migrate relevant code from `content-factory-v4/scripts/test_looks.mjs`
5. Create `mudras-reference.html` (PWA-ready, offline-capable)

### Phase B — This week
6. Create `character-sheet.yaml` in `character-seed/`
7. First batch capture session (Ethan executes, pipeline processes)
8. Test Gemini Pro with character sheet for first AI-generated stills
9. Test Higgsfield with reference images for first motion pieces

### Phase C — Ongoing
10. A/B test AI outputs vs real photos (track engagement)
11. Build approved-styles bank from winners
12. Monthly character evolution update

---

## TERMINAL COMMAND (Antigravity/Sonnet execution)

```bash
# FULL SETUP — run this in one push
cd /Users/ethanpayton/.gemini/antigravity/scratch

# 1. Create directory structure
mkdir -p content-flood/{raw-elements,isolated,shoots,processed,character-seed,templates,queue/{ig-feed,ig-story,reels,tiktok,shorts}}

# 2. Initialize node project
cd content-flood && npm init -y && npm install ffmpeg-static sharp

# 3. Copy signature looks from content-factory-v4
cp ../content-factory-v4/scripts/test_looks.mjs ./scripts/

# 4. Pipeline script, config, character sheet, mudras reference
# → Sonnet generates these files from this spec
```

---

## SUCCESS METRICS

| Metric | Target | Timeframe |
|--------|--------|-----------|
| Posts per week | 4-7 minimum | Starting May 19 |
| Content pieces per batch session | 20-30 raw, 10-15 processed | Per session |
| AI-generated posts in mix | 20-30% of total | By Jun 1 |
| Engagement rate on AI vs real | Track separately | Ongoing |
| Time from capture to posted | < 24 hours | Standard |
| Opus tokens burned on content work | 0 | Always |

---

## PHILOSOPHY

This isn't about being perfect. It's about being PRESENT. The algorithm rewards consistency over quality thresholds. A mid photo posted today beats a perfect photo posted next week. The character system means you're never truly "off" — even when DoorDashing, recording, or sleeping, your digital presence keeps feeding the machine.

Create till 30. No breaks. The system makes that sustainable.
