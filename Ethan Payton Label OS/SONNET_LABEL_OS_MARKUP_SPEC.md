# SONNET SPEC: LABEL_OS.html Markup Fixes
## Ethan's Apple Pencil Annotations → Actionable HTML Edits
*May 17, 2026 — Compiled by Opus from 17 annotated pages*

---

## TARGET FILE
`brain/LABEL_OS.html` (682 lines, the canonical operating system doc)

Also apply same changes to `brain/LABEL_OS_SOP.html` if it's a separate copy (it was pushed to `scratch/oracle-compass/Ethan Payton Label OS/LABEL_OS_SOP.html` too — keep them in sync or delete the duplicate).

---

## ANNOTATIONS FOUND (17 pages, ordered by page)

### PAGE 1 — Skill Grid
**Markup:** Checkmarks on the 17-skill quick reference grid.
**Interpretation:** Approval. No change needed.
**Action:** None.

---

### PAGE 3 — Session Opener
**Markup:** Handwritten "Distance Over Time Publishing" near the session opener.
**Action:** Add publisher AND label to the session opener block. After `DISTRIBUTOR: Amuse Pro (NEVER DistroKid).` add:

```html
LABEL: Ethan Payton LLC.<br>
PUBLISHER: Distance Over Time Publishing (ASCAP).<br>
```

Find this line (~line 211):
```
DISTRIBUTOR: Amuse Pro (NEVER DistroKid).<br>
```
Insert after it:
```
LABEL: Ethan Payton LLC.<br>
PUBLISHER: Distance Over Time Publishing (ASCAP).<br>
```

Also: throughout the document, replace any references to "past.El noir Records" as the public-facing label name with "Ethan Payton LLC." The names "past.El" and "past.El noir" are internal references only — not public-facing at this time. The session opener line that says "past.El / past.El noir Records" should become "Ethan Payton LLC."

---

### PAGE 4 — Phase 0: Creation

**Markup 1:** Red circle + "← WTF?" on `mastering_qc.py` reference.
**Problem:** Ethan doesn't know what this script does — and doesn't need it. He tests codec previews directly in Ozone during mastering.
**Action:** REMOVE the `mastering_qc.py` reference entirely. Find (~line 233):

```html
<p><strong>AI role in creation:</strong> ZERO during. After masters bounce: Cyanite upload for verification, encode QC simulation via <code>mastering_qc.py</code>.</p>
```

Replace with:

```html
<p><strong>AI role in creation:</strong> ZERO during recording/mixing/mastering. After masters bounce: upload master WAV to <a href="https://cyanite.ai">Cyanite</a> for mood/genre/BPM verification against catalog data. Codec QC happens in Ozone during mastering (codec preview), not via a separate script.</p>
```

**Markup 2:** "Pro Song Shot to collect" near Phase 0 table.
**Problem:** Ethan wants a reminder to capture a professional shot of himself during/after the recording session for content.
**Action:** Add a row to the Phase 0 table, after the Export row (~line 230):

```html
<tr><td>Pro session shot</td><td>Phone/camera</td><td>Capture at least 1 clean photo of you at the board/mic. Content fuel for release week.</td></tr>
```

**Markup 3:** "is which posts?" on the caption writing line.
**Problem:** The doc says "AI drafts hook + body + CTA per post" but doesn't specify WHICH posts get AI captions.
**Action:** Replace the caption-writer paragraph (~line 234):

```html
<p><strong>Caption writing:</strong> AI drafts hook + body + CTA per post. You approve or edit. 30 min for all 8 days.<br><span class="skill-pill">caption-writer</span></p>
```

With:

```html
<p><strong>Caption writing:</strong> AI drafts hook + body + CTA for these post types during the 8-day content sprint:</p>
<ul style="margin-top:4px;margin-bottom:8px;">
  <li><strong>Countdown posts</strong> (T-7 through T-1)</li>
  <li><strong>Release announcement</strong> (T-0)</li>
  <li><strong>Behind-the-scenes / studio posts</strong></li>
  <li><strong>Lyric highlight posts</strong></li>
  <li><strong>Fan reaction / reshare posts</strong></li>
</ul>
<p style="margin-top:0;">You approve or edit every caption before posting. Budget 30 min for all 8 days.<br>
<span class="skill-pill">caption-writer</span></p>
<p><strong>NOT AI-captioned:</strong> Personal moments, relationship posts, grief journaling, candid Stories. Those stay in your voice, unscripted.</p>
```

---

### PAGE 7 — Phase 1: Pre-Upload
**Markup:** "Does the Amuse Pre-Save Link count?" near Smart Link / Linkfire row.
**Problem:** Ethan wants to know if the Amuse built-in pre-save link is sufficient or if he needs Linkfire.
**Action:** Find the Smart Link row (~line 278):

```html
<tr><td>Smart Link</td><td><span class="lane-badge red-lane">🔴 You</span></td><td>Linkfire or Amuse built-in. Goes in bio.</td></tr>
```

Replace with:

```html
<tr><td>Smart Link</td><td><span class="lane-badge red-lane">🔴 You</span></td><td><strong>Yes, Amuse pre-save link counts.</strong> Use it as your default. Linkfire only if you need a multi-platform landing page (Apple Music + Spotify + YouTube). For now, Amuse pre-save → bio link is enough.</td></tr>
```

---

### PAGE 8 — Phase 2: Metadata & S4A Pitch
**Markup:** Annotations near metadata/primary artist section and S4A pitch structure.
**Interpretation:** Checking/confirming the metadata flow. No explicit question written.
**Action:** None required — structure looks approved.

---

### PAGE 9 — Phase 3: Content Sprint

**Markup 1:** "b HOW?" next to T-6 "AI processes footage."
**Problem:** Ethan doesn't know the mechanics of how AI processes raw footage. Also skeptical that Whisper transcript alone gives Claude enough context to pick the best moments.
**Action:** Find the T-6 row in the Content Sprint table and expand the notes. Current text says something like "AI processes footage." Replace with:

```html
<td>AI processes your raw footage into clips. <strong>HOW:</strong>
<ol style="margin:8px 0;">
  <li>You shoot raw video during sessions / content day</li>
  <li>Drop files into Content Factory folder (<code>scratch/content-factory-v4/</code>)</li>
  <li>Whisper transcribes audio → Claude reads transcript + you flag your top 3-5 moments (timestamp or description) → Claude picks the cuts</li>
  <li>FFmpeg renders: captions + branding (Deep Emerald / Gold / Navy, film grain, Georgia font)</li>
  <li>Output: ready-to-post clips in <code>output/</code></li>
</ol>
<strong>Your input matters at step 3.</strong> Don't rely on Whisper + Claude alone to pick moments — the transcript misses vibe, facial expressions, energy. You scrub the footage and flag the best moments. Claude handles the mechanical cut/caption/brand work.<br>
<em>If Content Factory isn't set up yet:</em> manually scrub footage in CapCut, pull 3-5 best moments, add captions yourself. 45 min.</td>
```

**Markup 2:** "don't make this marketable" near social proof line.
**Problem:** Ethan doesn't want the AI to over-produce or make social proof posts feel like ads.
**Action:** Add a note to whatever line discusses social proof content:

```html
<div class="note">Social proof posts (fan reactions, DM screenshots, playlist adds) should feel <strong>organic, not marketable</strong>. No polished graphics. Screenshot → crop → post. The rawness IS the proof.</div>
```

**Markup 3:** Day number correction.
**Action:** Verify all day numbers in the content sprint table match the 8-day sprint calendar (T-7 through T-0). Cross-reference with `content-sprint` skill's SPRINT_CALENDAR.md tool file.

---

### PAGE 10 — Aesthetic B-Roll
**Markup:** "COVER Wall Boundary style Entrance" and "Bumble (Book Open)"
**Interpretation:** Additional shoot concepts Ethan wants added to the B-roll ideas list.
**Action:** Find the aesthetic B-roll section and add these two concepts:

```html
<li><strong>Cover wall boundary entrance</strong> — framed in a doorway or against a textured wall, editorial style</li>
<li><strong>Bumble book open</strong> — casual reading pose, vulnerability angle, dating-app energy</li>
```

---

### PAGE 11 — DM Blitz & Content Setups
**Markup:** None visible — page appears clean/approved.
**Action:** None.

---

### PAGE 13 — SubmitHub/Groover & Phase 5: Compound

**Markup:** Handwritten "I fear paid playlist pitching" with a strikethrough/scribble near SubmitHub/Groover section.
**Problem:** Ethan is anxious about paying for playlist placement — worried it's a scam or waste.
**Action:** Add a reassurance note after the SubmitHub/Groover instructions:

```html
<div class="note"><strong>These are NOT payola.</strong> SubmitHub charges for guaranteed <em>listens</em> from real curators — not guaranteed placement. You pay $1 for a human to actually hear your track and respond yes/no within 48 hrs. Groover is the same model (€2/submission). Neither guarantees adds. Both guarantee ears. If a curator says no, you get written feedback. Budget: $15–25 per release max. This is the cheapest A&R feedback you'll ever get.</div>
```

---

### PAGE 14 — Phase 5: Trigger Evaluator & Meta Ads

**Markup 1:** "Meta vs Spotify Ads?" near trigger-evaluator / meta-ads-builder section.
**Problem:** Ethan wants to know the difference between Meta Ads and Spotify Ads and which to use.
**Action:** Add a comparison callout after the trigger-evaluator section:

```html
<div class="how-section">
  <h4>Meta Ads vs Spotify Ads — When to Use Which</h4>
  <table>
    <tr><th></th><th>Meta Ads (Instagram/Facebook)</th><th>Spotify Ads (Marquee)</th></tr>
    <tr><td><strong>What it does</strong></td><td>Drives new listeners TO Spotify via video/image ads on IG Reels</td><td>Full-screen pop-up INSIDE Spotify for users who already follow you or listened before</td></tr>
    <tr><td><strong>Best for</strong></td><td>Cold audience growth, visual artists, when you have good video content</td><td>Re-engaging existing listeners, release week boost, high save-rate tracks</td></tr>
    <tr><td><strong>Trigger</strong></td><td>sends/reach ≥ 3% → organic content is resonating → amplify with paid</td><td>Stream velocity 100+/day AND save rate ≥ 3% → algorithm is already working → pour fuel</td></tr>
    <tr><td><strong>Budget</strong></td><td>$50 test → kill at $0.10/stream after 48 hrs</td><td>$100 minimum, release week only, EP + first vault single only</td></tr>
    <tr><td><strong>Use FIRST</strong></td><td>✅ Meta Ads first (cheaper, broader reach, content doubles as organic)</td><td>Marquee second (only after organic proves the track works)</td></tr>
  </table>
  <p><strong>Default order:</strong> Organic content sprint → triggers hit → Meta Ads $50 test → if cost-per-stream &lt; $0.10 after 48 hrs, scale to $150 → if save rate ≥ 3% sustained 7+ days, activate Marquee.</p>
</div>
```

**Markup 2:** "Total Budget for year?" near $50 budget line.
**Problem:** Ethan wants a total annual ad spend number.
**Action:** Add after the Meta Ads setup section:

```html
<div class="note"><strong>Total annual ad budget (realistic):</strong> $600–$1,200/year. That's ~$50–100 per release × 12 releases. DoorDash income covers it. No ad spend until triggers confirm organic traction. If a track doesn't hit 3% sends/reach organically, you spend $0 on it — the content wasn't resonating and paid won't fix that.</div>
```

**Markup 3:** "isn't this for track?" near audience/geo targeting section.
**Problem:** Ethan is confused whether the geo targeting (Chicago, Denver, Minneapolis, etc.) is per-track or a blanket setting.
**Action:** Add clarifying note:

```html
<div class="note"><strong>Geo targeting is per-track.</strong> The cities listed (Chicago, Denver, Minneapolis, New York, Phoenix, Dallas) are your current top listener cities from S4A. Each track's ad set should target YOUR top cities at the time of that release — check S4A → Audience tab before each campaign. Cities shift as your audience grows.</div>
```

---

### PAGE 15 — Post-Release Content & Phase 6: Compliance

**Markup 1:** "CD files or reels?" near post-release content ideas.
**Problem:** Ethan wants clarity on whether post-release content means CD/physical files or social reels.
**Action:** Add clarifying note to the post-release content section:

```html
<div class="note"><strong>This is all social content (Reels/TikTok/Stories), not physical media.</strong> No CDs. These are the post-release content ideas to keep the algorithm fed after drop day: lyric breakdowns, BTS studio footage, fan reaction compilations, acoustic/stripped versions, meme account seeding. All digital, all short-form video or static posts.</div>
```

**Markup 2:** "No plan on this yet." near Spotify Marquee section.
**Problem:** Ethan acknowledges Marquee isn't planned yet.
**Action:** Add a note:

```html
<div class="note"><strong>Marquee status:</strong> Not activated yet. Requires Spotify for Artists access + $100 minimum + release week timing. Eligible: EP (May 29) + first vault single only. Decision happens AFTER organic data proves traction. No spend without trigger-evaluator green light.</div>
```

**Markup 3:** "Done thru Thursday after release" written over Phase 6 Compliance header (confirming the timing).
**Interpretation:** Ethan is confirming he understands compliance happens Thursday after release.
**Action:** None — this is approval of existing text. But make the header even clearer:

Change the Phase 6 header from:
```html
<h3>PHASE 6: COMPLIANCE (THURSDAY AFTER RELEASE)</h3>
```
To:
```html
<h3>PHASE 6: COMPLIANCE (DONE THE THURSDAY AFTER RELEASE — NOT BEFORE)</h3>
```

---

### PAGE 17 — Phase 7: Data & S4A Protocol

**Markup:** "is this dynamically compounding?" next to the S4A screenshot → catalog_snapshot_log.json flow and save rate interpretation section.
**Problem:** Ethan wants a concrete A-to-Z Sunday checklist he can just blast through — not a conceptual explanation of compounding.
**Action:** Add a full step-by-step checklist AFTER the S4A protocol section. This should be a standalone boxed section:

```html
<div class="how-section">
  <h4>SUNDAY DATA PULL — A to Z Checklist (~25 min)</h4>
  <p><em>Do this every Sunday at 12:00 PM. Same order, every time. Don't skip steps.</em></p>
  <ol>
    <li><strong>Open S4A → Overview tab.</strong> Screenshot the full page (monthly listeners, followers, streams). Save to <code>Desktop/s4a-screenshots/</code>.</li>
    <li><strong>S4A → Audience tab.</strong> Screenshot: age/gender breakdown, top cities, top countries, listener source (programmed vs organic vs other). Save.</li>
    <li><strong>S4A → Music tab → per track.</strong> For each ACTIVE release (anything in compound phase): click track → screenshot streams, listeners, saves, save rate, skip rate. Save each.</li>
    <li><strong>Open Oracle Compass → Kill List.</strong> Note the top 3 RED items. Write them down (phone notes or paper).</li>
    <li><strong>Run <code>weekly-data-synthesis</code>.</strong> Paste or drop your screenshots into the AI session. It reads them, extracts numbers, appends to <code>catalog_snapshot_log.json</code>, and gives you a plain-English summary: what's up, what's down, what needs attention.</li>
    <li><strong>Read the synthesis output.</strong> 2 minutes. Look for: any track with save rate dropping below 1.5%, any track with stream velocity spiking (potential trigger), follower growth rate.</li>
    <li><strong>Run <code>trigger-evaluator</code></strong> (if any track is in compound phase). It reads the latest data and tells you: go/no-go on paid channels. Green light = run <code>meta-ads-builder</code>. Red light = keep riding organic.</li>
    <li><strong>Meal prep at 2:00 PM.</strong> Data's done. Close the laptop. Cook.</li>
    <li><strong>3:00 PM — News-week scan.</strong> Open Oracle Compass Kill List again. Identify the 3 most important items for the coming week. Close the browser.</li>
  </ol>
  <div class="note"><strong>Yes, this compounds.</strong> Every Sunday pull appends to <code>catalog_snapshot_log.json</code> as a time-series. After 4+ weeks: trend lines, not just snapshots. The <code>weekly-data-synthesis</code> skill reads ALL history, not just this week. More data = better decisions = smarter trigger calls = less wasted ad money.</div>
</div>
```

---

### PAGE 18 — Phase 8: Sync
**Markup:** Question mark / checkmark near "Platform submission — Songtradr/Musicbed/Artlist" row.
**Problem:** Ethan wants clarity on what these platforms are or which to prioritize.
**Action:** Expand the Platform submission notes:

```html
<tr><td>Platform submission</td><td><span class="lane-badge red-lane">🔴 You</span></td><td><strong>Songtradr</strong> (largest sync marketplace, free tier), <strong>Musicbed</strong> (curated, application required — higher payouts), <strong>Artlist</strong> (subscription model, less per-track payout). <strong>Start with Songtradr</strong> — free to upload, broadest reach. Add Musicbed after 5+ tracks with sync masters ready. Artlist is optional/last.</td></tr>
```

---

### PAGE 20 — Agent/Skill Table & Weekly Rhythm
**Markup:** Checkmarks next to agent descriptions.
**Interpretation:** Approval. No changes needed.
**Action:** None.

---

### PAGE 22 — Standing Rules

**Markup:** "How" with a question mark next to rule #10 "Oracle main baselined at 56ba9d1. v2 is dead."
**Problem:** Ethan doesn't understand what this means technically.
**Action:** Replace rule #10:

From:
```html
<li>Oracle main baselined at <strong>56ba9d1</strong>. v2 is dead.</li>
```

To:
```html
<li>Oracle Compass app: only the <code>main</code> branch matters. There was an experimental <code>v2</code> branch — it's abandoned. If AI references v2, ignore it. The live app at oracle-compass-ni8g.vercel.app runs from main, last verified working at commit 56ba9d1 (May 12).</li>
```

---

## ADDITIONAL IMPROVEMENTS (not from markups, but making it better)

### A. Add page break hints for print
Add `page-break-before: always` to each Phase header `<h3>` in the CSS so the PDF prints cleanly.

### B. Add a "Last Updated" auto-date
Add to the `<p class="meta">` block:
```html
Last updated: <span id="lastmod"></span>
<script>document.getElementById('lastmod').textContent = new Date().toLocaleDateString('en-US', {year:'numeric',month:'long',day:'numeric'});</script>
```

### C. Link skill pills to skill files
Each `<span class="skill-pill">` should link to its SKILL.md for quick reference:
```html
<a href=".claude/skills/caption-writer/SKILL.md" style="text-decoration:none;"><span class="skill-pill">caption-writer</span></a>
```

(Low priority — nice to have but not blocking.)

---

## EXECUTION INSTRUCTIONS FOR SONNET

1. Open `brain/LABEL_OS.html`
2. Apply each change above in order (Page 3 → Page 4 → Page 7 → ... → Page 22)
3. After all changes, verify the file still renders correctly by checking HTML validity
4. If `scratch/oracle-compass/Ethan Payton Label OS/LABEL_OS_SOP.html` is a separate file, apply the same changes there OR delete it and note that `brain/LABEL_OS.html` is canonical
5. Commit with message: `fix: LABEL_OS.html — resolve all Ethan markup annotations (17 pages)`

## WHAT NOT TO CHANGE
- Do NOT restructure the document layout
- Do NOT change the CSS theme/colors
- Do NOT add new phases or remove existing ones
- Do NOT change any skill names or agent names
- Do NOT touch the Standing Rules content (except rule #10 as specified)
- Do NOT change the mastering chain order or specs
