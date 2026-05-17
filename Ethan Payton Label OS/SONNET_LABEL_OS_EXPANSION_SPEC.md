# SPEC: Expand LABEL_OS.html Into Full Operating Manual

## FOR: Claude Sonnet
## INPUT: brain/LABEL_OS.html (current version — routing map only)
## OUTPUT: brain/LABEL_OS.html (expanded — full step-by-step instructions per phase)
## CONSTRAINT: Keep the same HTML structure, CSS, and visual design. Add expandable HOW sections beneath each phase table.

---

## WHAT'S MISSING

The current HTML tells Ethan WHAT to do and WHO does it. It does NOT tell him HOW to do each step. An ADHD brain opening this document at 10 AM should be able to follow it like a recipe — no second document needed, no "go read the codex," no context switching.

---

## EXPANSION INSTRUCTIONS (Phase by Phase)

### PHASE 0: CREATION — Add beneath the table:

**Mastering Chain (exact order, exact settings):**
1. Parametric EQ → High-pass at 30-40 Hz (remove sub-rumble)
2. M/S EQ → Hard cut SIDE channel below 120 Hz (mono the bass)
3. G-Clip → 0% softness, placed BEFORE compressor (catches transient peaks)
4. Multiband compression → gentle 2-3 dB on each band, slow attack
5. Multi-limiter sequence → 3-4 limiters in series, each doing 0.5-1 dB reduction (NOT one limiter doing 4 dB)
6. True Peak limiter → -0.3 dB ceiling (final stage, prevents inter-sample peaks)
7. Target: -9 to -11 LUFS integrated (streaming) | -14 LUFS (sync/broadcast)
8. DO NOT close FL Studio session until all exports complete

**Export Checklist (while session is OPEN):**
- [ ] Master WAV (streaming: -9 to -11 LUFS)
- [ ] Master WAV (sync: -14 LUFS — bypass final limiter, reset ceiling)
- [ ] Instrumental (mute all vocal channels, bounce)
- [ ] Acapella (solo all vocal channels, bounce)
- [ ] Stems: drums bus, bass bus, melody/chords bus, lead vocal, background vocals
- [ ] Verify: all files 44.1kHz/24-bit WAV minimum

**Reference Check Protocol:**
- Play on studio monitors (your mixing position)
- Play on phone speaker (held at arm's length)
- Play on AirPods
- Play in car (parked, engine off, moderate volume)
- If the vocal disappears on phone: mid-range needs boost
- If the bass sounds wrong in car: low-end balance needs adjustment
- If it sounds harsh on AirPods: 2-5kHz needs taming

---

### PHASE 1: PRE-UPLOAD — Add HOW sections:

**Cover Art (Photopea workflow):**
1. New document: 3000 x 3000 px, 300 DPI, RGB
2. Background layer: gradient, texture, or photo base
3. Subject layer: your photo isolated (use Photopea's "Select Subject" or manual pen tool)
4. Typography: track/EP title, artist name. Readable at thumbnail size (300x300 test).
5. Export: PNG (lossless) for Amuse upload. JPEG backup.
6. Test: shrink to 300x300 in preview. Can you read the title? If no, increase font weight or contrast.

**Spotify Canvas (CapCut workflow):**
1. Open cover art in Photopea
2. Isolate layers: subject, background, any text/graphic elements → Content-Aware Fill gaps
3. Export each layer as transparent PNG (File → Export As → PNG, transparency checked)
4. Open CapCut Desktop → New Project → 1080x1920 (9:16 vertical)
5. Import all layer PNGs as separate tracks (stacked)
6. Keyframe each layer:
   - Background: slow zoom in (105% over 8 seconds) OR slow pan
   - Subject: subtle scale pulse (100% → 102% → 100%, loop) OR slight float
   - Foreground elements: faster movement than background (parallax = depth)
7. Add atmosphere overlay: download dust/fog clip from Pexels → screen blend mode → 15-20% opacity
8. Duration: 3-8 seconds, MUST loop seamlessly (last frame = first frame)
9. Export: MP4, 1080x1920, 30fps

**Smart Link Creation:**
1. Go to linkfire.com (or use Amuse's built-in link feature)
2. Create new link → type: Pre-save (before release) or Multi-platform (after release)
3. Paste Spotify URI once available from Amuse confirmation
4. Add Apple Music, YouTube Music, Amazon Music links (auto-detected by most services)
5. Customize URL slug: linkfire.com/pastel-[trackname]
6. Copy link → paste into IG bio immediately

---

### PHASE 2: UPLOAD + PITCH — Add HOW sections:

**Amuse Upload Step-by-Step:**
1. Log into amuse.io → Dashboard → New Release
2. Upload WAV file(s) — streaming master (-9 to -11 LUFS version)
3. Upload cover art (3000x3000 PNG)
4. Fill metadata:
   - Song title (exact spelling, caps as intended)
   - Primary artist: Ethan Payton
   - Genre: R&B (primary) / Alternative R&B (secondary) — NEVER select Pop
   - Language: English
   - Explicit: Yes/No per track
   - ISRC: Leave blank for new tracks (Amuse assigns). Enter existing ISRC if track was previously released.
5. Set release date: minimum 7 days from today, 10+ preferred
6. For EP: select "Album/EP" type, link all tracks, set tracklist order
7. Submit → wait for "Processing" confirmation screen
8. SCREENSHOT the confirmation (includes assigned ISRCs)

**S4A Pitch Structure (500 characters):**
```
[Line 1: What the song IS — genre + mood + sonic reference]
[Line 2: What it's ABOUT — emotional core in one sentence]
[Line 3: Production details — BPM, key instruments, sonic texture]
[Line 4: Why NOW — timeliness, momentum, or connection to current moment]
[Line 5: Social proof — Fresh Finds alumni, stream count, save rate if strong]
```

Example template:
"[Track] is a dark, sensual R&B track at [BPM] BPM in [key]. Built on [instrument description], it explores [emotional theme]. The production draws from [reference artists] while maintaining [unique element]. Previously featured on Fresh Finds, Ethan Payton brings [X] monthly listeners and a [X]% save rate on recent releases."

**Pitch submission checklist:**
- [ ] Pitch written and reviewed (sleep on it if possible)
- [ ] Selected correct track in S4A → Upcoming Music
- [ ] Filled: Genre (R&B), Mood (select 3), Instruments (select all that apply), Culture (select if applicable)
- [ ] Pasted description (500 char max — count before pasting)
- [ ] Submitted — THIS IS FINAL. No edits possible.

---

### PHASE 3: 8-DAY SPRINT — Add HOW sections:

**Batch Content Shoot (T-7, 3-hour block):**

Setup 1: Talk to 'Em (direct-to-camera)
- Ring light, eye level, plain dark background
- Look directly into lens. Speak like you're talking to one person.
- Topics: "why I wrote this," "what this EP means," "something nobody knows about this track"
- Shoot 3-5 takes per topic. Best one wins.

Setup 2: Studio BTS
- OBS screen recording of FL Studio (production or mix session)
- Phone on tripod: wide shot of you at the desk, headphones on
- Close-up: hands on keys/mouse, monitor reflections

Setup 3: Aesthetic B-roll
- 2 AM drive footage (phone mounted on dash, city lights)
- Milwaukee landmarks (not tourist — YOUR Milwaukee)
- Studio details: mic close-up, monitor glow, coffee cup, dim lighting

Setup 4: Performance/Vibe
- Lip-sync or live vocal to the track (no playback visible)
- Movement: subtle head nod, walking, leaning against wall
- Best done in natural light (golden hour) or dramatic single-source lighting

Setup 5-7: Variations
- Different outfit/location combos of the above
- GF camera work: you from her POV (walking ahead, studio doorway, car passenger seat)
- Phone-in-hand selfie style for Stories (raw, unpolished, authentic)

**Rule:** Shoot MORE than you need. 50 clips → pick 7. Abundance removes pressure from any single piece.

**DM Blitz Tiers (T-1 prep, T-0 send):**

Core 50 (your actual people — they've saved 3+ posts, DM'd you, commented consistently):
```
"hey [name] — new one drops tomorrow. you've been riding with me through [specific thing they did]. 
wanted you to hear it first: [pre-save link]. means a lot. 🖤"
```
Personalize EVERY one. Reference something real about them.

Warm 100 (story viewers, regular likers, mutual followers who engage):
```
"hey — dropping something new tomorrow. [one sentence about the track]. 
would love if you checked it out: [link]. appreciate you 🙏"
```
Light personalization. Their name + one real detail.

Cold 50 (curators, mutual followers you haven't talked to, potential fans):
```
"hey [name] — I'm an R&B artist from Milwaukee, just dropped [track name]. 
[one sentence pitch]. thought it might be up your alley: [link]. no pressure either way."
```
Professional, warm, no desperation. One shot.

---

### PHASE 4: RELEASE DAY — Add:

**Chaotic Good Comment Strategy:**
- Brief 5-8 people in your inner circle BEFORE release day
- Give them: (1) the exact post time, (2) 2-3 pre-written comments each that reference SPECIFIC details about the track ("that switch at 1:45 is crazy" / "the way the bass hits different in headphones")
- They deploy within 5 minutes of your post going live
- This seeds the algorithm: early engagement velocity signals "this is worth showing to more people"
- NEVER fake it — these are real people with real accounts who actually listened

**SubmitHub/Groover (same day or T+1):**
- SubmitHub: use free credits first, then $1-2 paid for 10-15 indie R&B/chill playlist curators
- Groover: €2/submission, guaranteed listen within 7 days, 3-5 submissions per release
- Write a 2-sentence pitch (different from S4A — more casual, curator-to-curator tone)
- Track all submissions in a simple spreadsheet: curator name, date sent, result (added/passed/no response)

---

### PHASE 5: COMPOUND — Add:

**Meta Ads Setup (when sends/reach ≥ 3%):**
1. Open Meta Ads Manager (business.facebook.com)
2. Campaign objective: Traffic (NOT engagement, NOT awareness)
3. Ad set:
   - Budget: $50 total, 3-day duration
   - Audience: Lookalike 1% based on your IG engagement (or interest targeting: Brent Faiyaz, Bryson Tiller, PARTYNEXTDOOR, 6LACK)
   - Placement: Instagram Reels ONLY (deselect all others)
   - Locations: moat cities (Chicago, Denver, Minneapolis, Milwaukee) + US broad if budget allows
4. Ad creative: your best-performing Reel (the one with ≥3% sends/reach — PROVEN content)
5. Destination: Smart Link → Spotify
6. Launch → check at 48 hours: if cost-per-stream > $0.10, KILL immediately

**Discovery Mode Activation (when 7-day save rate > 3%):**
1. Open S4A → Campaigns tab
2. Select track → Toggle Discovery Mode ON
3. This is $0 upfront — Spotify takes 30% royalty reduction on Discovery Mode streams
4. Historical results: +50% saves, +44% playlist adds (per Spotify documentation)
5. Only activate on tracks with PROVEN save rate (>3% sustained 7+ days). Never on launch day.

---

### PHASE 6: COMPLIANCE — Add:

**Registration Data Packet (AI preps this before you sit down):**
```
Track Title: [exact]
Artist: Ethan Payton
Publisher: Distance Over Time (your pub company)
ASCAP IPI#: [your IPI number]
ISRC: [from Amuse confirmation]
UPC: [from Amuse confirmation, EP-level]
Release Date: [actual release date]
Writers: Ethan Payton (100% unless collab)
Duration: [MM:SS]
```

**Site-by-site (do in this order, total ~45 min):**

1. ASCAP (ascap.com → Member Access → Register a Work)
   - Enter: title, writers, publisher, % splits
   - ~5 min per song

2. MLC (themlc.com → Portal → Register Works)
   - Enter: title, ISRC, writer info, publisher
   - ~5 min per song

3. Songtrust (app.songtrust.com → Songs)
   - Verify the song appears (it should auto-populate from your ASCAP registration)
   - If missing: add manually
   - ~3 min per song

4. SoundExchange (soundexchange.com → Portal → Repertoire)
   - Search by ISRC to verify registration
   - If missing: submit new recording (title, ISRC, artist, label: past.El noir Records)
   - ~3 min per song

5. Musixmatch (artists.musixmatch.com)
   - Search your track → Claim → Submit lyrics
   - Paste full lyrics (AI can have these ready in a text file)
   - ~5 min per song

---

### PHASE 7: DATA — Add:

**Sunday S4A Screenshot Protocol (exactly what to capture):**

Screenshot 1: Overview tab
- Open S4A → Home/Overview
- Capture: monthly listeners number, follower count, 28-day streams graph

Screenshot 2: Audience tab
- S4A → Audience
- Capture: age/gender breakdown, top cities (top 10), listener source (programmed vs. organic vs. other)

Screenshot 3: Music → per track (for each active release)
- Select track → scroll to engagement section
- Capture: streams, listeners, saves, save rate, skip rate
- Do this for: latest release + any track in compound phase

**Where the numbers go:**
- Send screenshots to Claude/Antigravity → they extract and write to catalog_snapshot_log.json
- OR manually record in Google Sheet columns: Date | Track | Streams | Saves | Save Rate | ML | Followers | Top City

---

### PHASE 8: SYNC — Add:

**One-Sheet Template (AI generates, you verify):**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[TRACK TITLE]
Ethan Payton | past.El noir Records
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

GENRE: Contemporary R&B / Alternative R&B
BPM: [X] | KEY: [X] | DURATION: [M:SS]
MOOD: [3-4 descriptors: sensual, dark, atmospheric, introspective]
INSTRUMENTATION: [drums, bass, synth pads, guitar, vocal layers]

CLEARANCE: One-stop. 100% master + publishing controlled.
STEMS: Available immediately upon request.
FORMATS: WAV 44.1/24 (streaming + broadcast masters)

COMPARABLE PLACEMENTS:
- [Show/film]: [specific scene type where this fits]
- [Show/film]: [specific scene type]

CONTACT: [email] | [phone]
LISTEN: [Spotify link] | [direct WAV link if available]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Sync Pitch Email (4 sentences, no more):**
```
Subject: One-stop R&B track for [show name] — [mood descriptor]

Hi [supervisor first name],

I have a track that fits [specific scene type] on [show name] — dark, 
atmospheric R&B at [BPM] BPM with [key sonic element]. One-stop clearance, 
stems available immediately. 

Streaming link: [URL]
One-sheet attached.

Best,
Ethan Payton
```

---

### WEEKLY RHYTHM — Expand each day with exact time blocks:

(Keep current format but add the S-Tier morning stack detail):

**S-Tier Morning (non-negotiable daily, ~25 min):**
1. 16oz water + electrolytes immediately on waking (2 min)
2. Morning sunlight: step outside, no sunglasses, 2-10 min face toward sun
3. Breathwork: Nadi Shodhana (alternate nostril) OR Box breathing (4-4-4-4), 5 min
4. Pelvic floor release: 90/90 position or deep squat hold, 3 min
5. Protein within 30 min of waking (eggs, shake, whatever's fast)
6. 90-second Kill List scan: open Oracle Compass, read RED items, close browser

**After morning stack → DoorDash OR studio (never both in AM unless monthly target unmet)**

---

## FORMATTING INSTRUCTIONS FOR SONNET

1. Keep the existing HTML/CSS structure exactly as-is
2. Add a new CSS class for expandable HOW sections:
```css
.how-section {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 20px 24px;
    margin-top: 16px;
    margin-bottom: 30px;
}
.how-section h4 {
    color: #475569;
    font-size: 0.95em;
    margin-top: 0;
    margin-bottom: 12px;
    text-transform: uppercase;
    letter-spacing: 0.03em;
}
.how-section ol, .how-section ul {
    margin-bottom: 16px;
    padding-left: 20px;
}
.how-section li {
    margin-bottom: 6px;
    line-height: 1.5;
}
.how-section code {
    display: block;
    background: #1e293b;
    color: #e2e8f0;
    padding: 16px;
    border-radius: 6px;
    font-size: 0.85em;
    overflow-x: auto;
    white-space: pre;
    margin: 12px 0;
}
.checklist {
    list-style: none;
    padding-left: 0;
}
.checklist li::before {
    content: "☐ ";
    font-size: 1.1em;
}
```

3. Place each HOW section DIRECTLY beneath its corresponding phase table
4. Use `<div class="how-section">` wrapper for each
5. Keep checklists as `<ul class="checklist">`
6. Keep code blocks (templates, prompts) in `<code>` with the dark background
7. The document should remain ONE scrollable page — no tabs, no JavaScript, no interactivity needed
8. Total expanded doc will be ~800-1000 lines of HTML. That's fine.

---

## SOURCE MATERIAL FOR SONNET TO REFERENCE

All HOW content above is verified against:
- brain/departments_index.md (department protocols)
- brain/mixing_checklist_codex.html (mastering chain)
- brain/CONTENT_VISUAL_PLAYBOOK.md (content creation workflows, referenced in departments_index)
- brain/SOCIAL_COMMUNITY_PLAN.md (DM blitz tiers, community trace)
- brain/MARKETING_PAID_STRATEGY.md (Meta Ads setup, Discovery Mode, budget rules)
- brain/PER_RELEASE_PIPELINE.md (phase-by-phase pipeline spec)
- brain/SONIC_ASSET_LIFECYCLE.md (export checklist, deliverables)
- The human-only pipeline doc (HUMAN_ONLY_PIPELINE.md — detailed HOW instructions per phase)

Sonnet should read departments_index.md and PER_RELEASE_PIPELINE.md before starting to catch anything I missed in this spec.

---

## FINAL CHECK

When complete, the expanded LABEL_OS.html should pass this test:

> Ethan opens this ONE file on a Tuesday morning. He can follow it from "open FL Studio" through "bounce master" through "upload to Amuse" through "pitch to S4A" through "post content" through "register at ASCAP" without opening any other document, asking any AI for clarification, or context-switching to another file.

That's the bar. One doc. Complete instructions. No second brain needed.
