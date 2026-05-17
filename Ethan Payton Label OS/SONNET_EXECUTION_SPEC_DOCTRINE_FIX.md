# SONNET EXECUTION SPEC — Doctrine Fix + Agent Roster Update + Vercel Push
## May 15, 2026 — Approved by Ethan, schemated by Opus

**CONTEXT FOR SONNET:** This spec contains every edit needed across the Label OS doctrine layer, Oracle Compass app, and agent graph. Execute file-by-file in the order listed. No judgment calls — every change is specified. If something seems wrong, flag it and move on; don't improvise.

**TWO REPOS IN PLAY:**
- **Oracle Compass:** `/Users/ethanpayton/Desktop/oracle-compass-full/` (Next.js app, deploys to Vercel)
- **Label OS brain/agents:** `/Users/ethanpayton/.gemini/antigravity/` (brain/, .claude/agents/, GLOBAL_BRAIN/)

---

## FILE 1: `_DOCTRINE.md` (Agent shared doctrine — CRITICAL)
**Path:** `/Users/ethanpayton/.gemini/antigravity/.claude/agents/_DOCTRINE.md`

### Edit 1A: §4 The Three Phases — FULL REPLACE
Find the entire §4 table and replace:

```
OLD:
| Phase | Window | Mode |
|-------|--------|------|
| 1 — SPRINT | Apr 6 → Apr 24 | Release sprint. Marketing only. ALL LOVE EP drops Apr 24. |
| 2 — COMPOUND | Apr 25 → May 31 | CREAM pre-production. Rhythm over intensity. Grief protocol begins. |
| 3 — SUMMER | Jun 1 → Jul 5 | CREAM launch cycle. |

NEW:
| Phase | Window | Mode |
|-------|--------|------|
| 1 — EP SPRINT | Apr 6 → May 29 | ALL LOVE EP (5-track). Recording sprint May 15-18. Upload May 19. EP drops May 29. |
| 2 — VAULT WATERFALL | May 30 → Aug 7 | 5 vault singles at 2-week cadence (ILG Jun 12 → LID Jun 26 → WI Jul 10 → JSS Jul 24 → RCN Aug 7). EP compound phase runs concurrently. |
| 3 — CREAM | Aug 8 → Oct 2026 | Tracklist locked Jul 24. Pre-production August. Data-sorted top 5 from waterfall performance. |
```

### Edit 1B: §5 Active Catalog — FULL REPLACE
```
OLD:
- **SEE ME** — live since Mar 13
- **Sweet Frustration** — live since Apr 10
- **East Side Love** — live since Apr 14 (414 Day — Milwaukee live set)
- **Like I Did** — live since Apr 17
- **ALL LOVE EP** — uploaded Apr 14, drops Apr 24 (T-5 as of today)

NEW:
- **SEE ME** — LIVE since Mar 13 ✓
- **East Side Love** — LIVE since May 8 ✓
- **Green Light** — uploading May 19, drops May 29 (EP track 1)
- **Sweet Frustration** — uploading May 19, drops May 29 (EP track 2)
- **Want U 2** — uploading May 19, drops May 29 (EP-exclusive track 5)
- **ALL LOVE EP** — 5 tracks, uploading May 19, global release May 29
```

### Edit 1C: §9 Anti-drift rule 7 — Update commit ref
```
OLD:
7. Oracle Compass `main` (commit 8cfee69+) is canonical; v2 is dead.

NEW:
7. Oracle Compass `main` (baselined at commit 56ba9d1, May 12, 2026) is canonical; v2 is dead.
```

### Edit 1D: §4 — Add note about date context
Change this line:
```
OLD:
- **Today's date context:** Label OS lives on a 90-day WARTIME RHYTHM cycle (Apr 6 → Jul 5, 2026). Always check `brain/SOVEREIGN_ACTION_PLAN_FINAL.md` for phase state.

NEW:
- **Today's date context:** Label OS lives on a rolling operational cycle. Current cycle: Apr 6 → Aug 7 (EP + vault waterfall). Always check `brain/LIVE_STATE.md` for current numbers and `brain/CHANGELOG.md` for state changes. `brain/SOVEREIGN_ACTION_PLAN_FINAL.md` is the strategic plan; LIVE_STATE is the tactical ground truth.
```

---

## FILE 2: `doctrineContent.tsx` — RoadmapPage (lines 68-95)
**Path:** `/Users/ethanpayton/Desktop/oracle-compass-full/lib/doctrineContent.tsx`

### Edit 2A: FULL REPLACE of RoadmapPage function
Replace the entire `function RoadmapPage()` (lines 68-95) with:

```tsx
function RoadmapPage() {
  return (
    <>
      <Header tag="The Plan · Phase 1→3" title="90-Day Roadmap" sub="April 6 → August 7, 2026. One EP. Five vault singles. One album. Compounding data." />
      <h2 className="scroll-h3">Overview — Three Phases</h2>
      <div className="scroll-table-wrap"><table className="scroll-table"><thead><tr><th>Phase</th><th>Dates</th><th>Release</th><th>Pop Target</th><th>Mode</th></tr></thead><tbody>
        <tr><td><span className="stp-badge badge-gold">Phase 1 — EP Sprint</span></td><td>Apr 6 – May 29</td><td>ALL LOVE EP (5 tracks) · May 29</td><td>24 → 28</td><td>Recording → Upload → Drop → Compound</td></tr>
        <tr><td><span className="stp-badge badge-green">Phase 2 — Vault Waterfall</span></td><td>May 30 – Aug 7</td><td>5 vault singles at 2-week cadence</td><td>28 → 35</td><td>Rhythm IS the system. Each single = Release Radar trigger.</td></tr>
        <tr><td><span className="stp-badge badge-blue">Phase 3 — CREAM</span></td><td>Aug 8 – Oct 2026</td><td>CREAM album (top 5 data-sorted)</td><td>35 → 45</td><td>Pre-production Aug. Data-driven tracklist locked Jul 24.</td></tr>
      </tbody></table></div>
      <Callout type="important" icon="⚡"><strong>The meta-pattern:</strong> EP drops as a bomb (5 tracks, 1 Release Radar). Then vault singles waterfall keeps feeding the algorithm every 2 weeks (5 more Release Radars). CREAM uses the best-performing tracks from the full cycle. One catalog, 11 events, compounding data.</Callout>
      <h2 className="scroll-h3">Key Dates</h2>
      <div className="scroll-table-wrap"><table className="scroll-table"><thead><tr><th>Date</th><th>Event</th></tr></thead><tbody>
        <tr><td>Mon May 19</td><td>Upload GL + SF + WU2 + EP entity to Amuse</td></tr>
        <tr><td style={{color:"#d4a843",fontWeight:700}}>Thu May 29</td><td><strong>ALL LOVE EP drops</strong> (5 tracks — global release)</td></tr>
        <tr><td>May 30 – Jun 11</td><td>EP compound phase (content sustain, sync pitching, meme seeding)</td></tr>
        <tr><td style={{color:"#3ecf71",fontWeight:700}}>Thu Jun 12</td><td><strong>I Like Girls</strong> (vault single #1)</td></tr>
        <tr><td style={{color:"#3ecf71",fontWeight:700}}>Thu Jun 26</td><td><strong>Like I Did</strong> (vault single #2)</td></tr>
        <tr><td style={{color:"#3ecf71",fontWeight:700}}>Thu Jul 10</td><td><strong>Worth It</strong> (vault single #3)</td></tr>
        <tr><td style={{color:"#4d9de0",fontWeight:700}}>Thu Jul 24</td><td><strong>Just Say So</strong> (vault #4) + <strong>CREAM tracklist lock</strong></td></tr>
        <tr><td style={{color:"#4d9de0",fontWeight:700}}>Thu Aug 7</td><td><strong>Reconnect</strong> (vault single #5 — waterfall complete)</td></tr>
        <tr><td style={{color:"#9b72cf",fontWeight:700}}>Aug 8+</td><td>CREAM pre-production begins</td></tr>
      </tbody></table></div>
    </>
  );
}
```

---

## FILE 3: `doctrineContent.tsx` — WartimePage Phase Arc (around line 146-151)
**Path:** Same file as above.

### Edit 3A: Replace the Phase 1/2/3 grid cards
Find the `scroll-grid-3` div containing the three phase cards and replace:

```tsx
OLD (approx lines 147-151):
        <div className="scroll-grid-card" style={{borderTop:"3px solid #e05545"}}><div className="scroll-gc-title" style={{color:"#e05545"}}>Phase 1 · THE SPRINT</div><div className="scroll-gc-desc">Apr 6–May 8 (32 days). 4 actions/day. Hard time limits. Production mastering + waterfall prep.</div></div>
        <div className="scroll-grid-card" style={{borderTop:"3px solid #3ecf71"}}><div className="scroll-gc-title" style={{color:"#3ecf71"}}>Phase 2 · VAULT WATERFALL</div><div className="scroll-gc-desc">May 30–Jul 25 (57 days). Vault singles biweekly. Content sprint per release. Rhythm IS the system.</div></div>
        <div className="scroll-grid-card" style={{borderTop:"3px solid #4d9de0"}}><div className="scroll-gc-title" style={{color:"#4d9de0"}}>Phase 3 · THE SUMMER</div><div className="scroll-gc-desc">Jun 1–Jul 5 (35 days). Data-informed launch. CREAM executes what ALL LOVE proved.</div></div>

NEW:
        <div className="scroll-grid-card" style={{borderTop:"3px solid #e05545"}}><div className="scroll-gc-title" style={{color:"#e05545"}}>Phase 1 · EP SPRINT</div><div className="scroll-gc-desc">Apr 6 – May 29. Recording sprint May 15-18. Upload May 19. EP drops May 29. Content sprint T-7 through T+7.</div></div>
        <div className="scroll-grid-card" style={{borderTop:"3px solid #3ecf71"}}><div className="scroll-gc-title" style={{color:"#3ecf71"}}>Phase 2 · VAULT WATERFALL</div><div className="scroll-gc-desc">May 30 – Aug 7. 5 vault singles at 2-week cadence (ILG → LID → WI → JSS → RCN). Each gets 8-day content sprint. Rhythm IS the system.</div></div>
        <div className="scroll-grid-card" style={{borderTop:"3px solid #4d9de0"}}><div className="scroll-gc-title" style={{color:"#4d9de0"}}>Phase 3 · CREAM</div><div className="scroll-gc-desc">Aug 8+. Tracklist locked Jul 24. Data-sorted top 5 from waterfall performance. Pre-production August.</div></div>
```

### Edit 3B: WartimePage — Anti-Drift Rule 10 (line ~249)
```
OLD:
<li className="scroll-p"><strong>ALL LOVE Deluxe is data-dependent.</strong> Decide Apr 27 after reviewing EP first-week numbers.</li>

NEW:
<li className="scroll-p"><strong>Deluxe concept retired.</strong> Focus is EP → vault waterfall → CREAM. No deluxe.</li>
```

### Edit 3C: WartimePage — Active Tools table (around line 292)
Update Oracle Compass version:
```
OLD:
<tr><td><strong>Oracle Compass</strong></td><td>v24 · Vercel</td><td>Daily OS. Kill List, Oracle decrees, Lane Dashboard, Brain page.</td></tr>

NEW:
<tr><td><strong>Oracle Compass</strong></td><td>Baselined 56ba9d1 · Vercel</td><td>Daily OS. Pipeline / Execute / Log / War Room. Kill List cross-link.</td></tr>
```

### Edit 3D: WartimePage — Platform Roles table — TikTok (around line 143)
```
OLD:
<tr><td>TikTok</td><td>Phase 3 consideration only</td><td>Not now. IG first.</td></tr>

NEW:
<tr><td>TikTok</td><td>Secondary distribution</td><td>Export IG native → upload TikTok. Never reverse the creation order. No TikTok-first content.</td></tr>
```

### Edit 3E: WartimePage — The Horizon table (around line 258-262)
```
OLD:
<tr><td>Oct 23, 2026</td><td><strong>FREAKSHOW.</strong> The fourth album. Architecture begins Jul 6. CREAM first.</td></tr>

NEW:
<tr><td>Oct 2026+</td><td><strong>CREAM.</strong> Tracklist locked Jul 24 (data-sorted top 5). Pre-production August. FREAKSHOW is after CREAM.</td></tr>
```

---

## FILE 4: `doctrineContent.tsx` — ProtocolPage (around lines 309-331)
**Path:** Same file.

### Edit 4A: Phase Timeline dates
```
OLD:
<div className="scroll-stack-level"><div className="scroll-stack-title"><span>Week 1 (Apr 17–24) · THE HONEYMOON</span><span className="stp-badge badge-green">Now</span></div>

NEW:
<div className="scroll-stack-level"><div className="scroll-stack-title"><span>Days 1–14 (Apr 2–16) · THE HONEYMOON</span></div>
```

```
OLD:
<div className="scroll-stack-level"><div className="scroll-stack-title"><span>Weeks 2–4 (Apr 25–May 8) · THE FLATLINE</span><span className="stp-badge badge-red">Critical</span></div>

NEW:
<div className="scroll-stack-level"><div className="scroll-stack-title"><span>Days 15–42 (Apr 16–May 14) · THE FLATLINE</span></div>
```

```
OLD:
<div className="scroll-stack-level"><div className="scroll-stack-title">Weeks 4–6 (May 8–28) · EMOTIONS RETURN</div>

NEW:
<div className="scroll-stack-level"><div className="scroll-stack-title"><span>Days 43–84 (May 15–Jun 25) · EMOTIONS RETURN</span><span className="stp-badge badge-green">Now (Day 43)</span></div>
```

```
OLD:
<div className="scroll-stack-level sc-highlight"><div className="scroll-stack-title">Weeks 7–12 (Jun – mid Jul) · COMPOUNDING</div>

NEW:
<div className="scroll-stack-level sc-highlight"><div className="scroll-stack-title">Days 85–180+ (Jun 26+) · COMPOUNDING</div>
```

---

## FILE 5: `doctrineContent.tsx` — RankScrollPage
**Path:** Same file. Find the RankScrollPage function.

### Edit 5A: Find and replace stale benchmarks
Search for "Jun 20" in the RankScrollPage and replace with "May 29" (EP date).
Search for "3 waterfall singles" and replace with "5 vault waterfall singles (ILG → LID → WI → JSS → RCN)".

---

## FILE 6: `doctrineContent.tsx` — SpotifyAdsPage Budget Ladder
**Path:** Same file. Around lines 774-783.

### Edit 6A: Replace "Album Launch" header
```
OLD:
<h3 className="scroll-h3" style={{fontSize: 16, marginTop: 16}}>Album Launch ($250 total · Expand to 10 cities)</h3>

NEW:
<h3 className="scroll-h3" style={{fontSize: 16, marginTop: 16}}>Vault Waterfall ($250 total across 5 singles · Expand to 10 cities)</h3>
```

### Edit 6B: Replace Marquee reference
```
OLD:
<p className="scroll-p"><strong>Marquee ($100–150):</strong> Full-screen notification to entire listener base. Album release day. One shot.

NEW:
<p className="scroll-p"><strong>Marquee ($100–150):</strong> Full-screen notification to entire listener base. EP release day (May 29). One shot.
```

---

## FILE 7: `phaseMap.ts` — Header comment only
**Path:** `/Users/ethanpayton/Desktop/oracle-compass-full/lib/phaseMap.ts`

### Edit 7A: Update header comment
Find the header comment block and replace the first line:
```
OLD:
// APR 29 EP BOMB PIVOT — ...

NEW:
// MAY 29 EP + VAULT WATERFALL — ILG Jun 12 → LID Jun 26 → WI Jul 10 → JSS Jul 24 → RCN Aug 7
```

---

## FILE 8: Agent Charter — Performance Coach
**Path:** `/Users/ethanpayton/.gemini/antigravity/.claude/agents/performance-coach.md`

### Edit 8A: Add Mudra System + Sovereignty Stack to canonical reads
In the `## Canonical reads (in order)` section, ADD after the existing entries:
```
6. `doctrineContent.tsx` MudraPage — 5 states (Lethargy/Lust/Fear/Rage/Flow) → mudra + breathwork + gaze protocols. USE ACTIVELY as diagnostic toolkit.
7. `doctrineContent.tsx` SovereigntyStackPage — Practices 5-6 (Pre-Flight Somatic Matrix, Post-Session Cool-Down). Enforce before/after studio.
8. Huberman/Fujita findings (brain/intel/ MP-18 through MP-22 once approved) — Trust prerequisite, willpower narrative, force-the-why, neural warm-up, strategic disengagement, ikigai framing.
```

### Edit 8B: Add Mudra diagnostic to the Voice section
Add to the voice section:
```
When Ethan reports low state, diagnose using the Mudra System's 5 states:
- Lethargy → Prana Mudra + Breath of Fire + upward gaze
- Lust/craving → Yoni Mudra + Ocean Breath + downward gaze
- Fear → Abhaya Mudra + 4-7-8 breathing + horizon gaze
- Rage → Shuni Mudra + alternate nostril + soft gaze
- Flow → Dhyana Mudra + natural breath + maintain (don't interrupt)
Prescribe the matching protocol, not generic advice.
```

---

## FILE 9: Agent Charter — Body/Health Coach
**Path:** `/Users/ethanpayton/.gemini/antigravity/.claude/agents/body-health-coach.md`

### Edit 9A: Add War Room + Sovereignty Stack to canonical reads
In the canonical reads section, ADD:
```
- `doctrineContent.tsx` WarRoomPage — Four Zones (A: Recording, B: Mixing, C: Movement, D: Rest). Somatic recommendations should be zone-aware.
- `doctrineContent.tsx` SovereigntyStackPage — Practices 7-10 (Barrett Body Budget Rules, Lower Chain Activation, Upper Chain Posture Reset, 30-Min Movement Block). These are your primary prescription toolkit.
- `doctrineContent.tsx` FrequencyPage — Brainwave states mapped to production phases. Prescribe frequency-matched warmups: Theta (4-8 Hz) for songwriting, Alpha (8-12 Hz) for mixing, Beta (12-30 Hz) for editing.
```

---

## FILE 10: Agent Charter — Creative Director
**Path:** `/Users/ethanpayton/.gemini/antigravity/.claude/agents/creative-director.md`

### Edit 10A: Add Bedroom ILM pipeline context to canonical reads
In canonical reads, ADD:
```
- `doctrineContent.tsx` VisualBiblePage — Bedroom ILM 7-Stage Pipeline (Capture → Mask → Generate → Composite → Relight → Grade → Multiply). AI skills (past-el-image-director, past-el-cinema-director) are Stage 3-5 upgrades, NOT standalone tools. Gate output within pipeline context.
- `doctrineContent.tsx` FrequencyPage — reference context only. When Ethan references frequency or brainwave state in a mixing/creative decision, understand the context.
```

### Edit 10B: Add cost transparency to AI review protocol
In the `## Owns` section, ADD:
```
- **Cost transparency on every visual asset.** Before approving any AI-generated visual, attach "cost to produce" (tool subscription cost + generation credits). Compare to $0 baseline (CapCut Desktop + Photopea). No asset approved without cost visible. This includes:
  - CapCut Desktop: $0 (parallax animations, Canvas loops — proven on Canada Goose, ESL, SEE ME)
  - Photopea: $0 (composites, overlays — proven)
  - Higgsfield: verify current pricing before recommending
  - SwitchLight Pro: verify current pricing before recommending
  - Dehancer Pro: ~$99-199 one-time (DaVinci plugin)
  - Seedance: verify current pricing before recommending
```

### Edit 10C: Update AI review framing
In the Owns section, CHANGE the AI Image Review and AI Video Review bullets to reference pipeline stages:
```
- **AI Image Review (Bedroom ILM Stage 3 gate):** When past-el-image-director generates a prompt, review against locked appearance + Cluster A palette. Output feeds Stage 4 (Composite) → Stage 6 (Grade) → Stage 7 (Multiply). Cost comparison to CapCut/Photopea baseline required.
- **AI Video Review (Bedroom ILM Stage 3-5 gate):** When past-el-cinema-director generates a video prompt, review cinema mode + palette + geography. Same pipeline flow. Cost comparison required.
```

---

## FILE 11: Agent Charter — Marketing Director
**Path:** `/Users/ethanpayton/.gemini/antigravity/.claude/agents/marketing-director.md`

### Edit 11A: Add Spotify Ads doctrine to canonical reads
In canonical reads, ADD:
```
- `doctrineContent.tsx` SpotifyAdsPage — Complete campaign system (Auction mode, CPMs, Streams delivery goal, targeting fields, budget ladder, ad script template). Load this before any paid campaign recommendation.
```

### Edit 11B: Add Streaming Strategy responsibilities
In the `## Owns` section, ADD:
```
- Editorial pitch protocol (previously Streaming Strategy agent)
- Save-rate monitoring + Discovery Mode trigger decisions
- Music Stax ops + catalog refresh oversight
- Amuse upload coordination + DSP compliance
```

---

## FILE 12: Agent Charter — Chief of Staff
**Path:** `/Users/ethanpayton/.gemini/antigravity/.claude/agents/chief-of-staff.md`

### Edit 12A: Update canonical reads
Replace or update the canonical reads to include:
```
1. `_DOCTRINE.md` (always first)
2. `brain/LIVE_STATE.md` — current numbers, anti-compaction shield
3. `brain/CHANGELOG.md` — chronological state changes
4. `brain/PER_RELEASE_PIPELINE.md` — release process A-to-Z
5. Latest `brain/handoffs/handoff_*.md`
```

### Edit 12B: Update routing table
Update the routing table to reflect 6 agents (not 10):
- Remove Finance/CFO (→ protocol in departments_index)
- Remove Data Analyst (→ data-pull skill)
- Remove Streaming Strategy (→ merged into Marketing Director)
- Remove Community Manager (→ dm-blitz skill + Community Trace protocol)
- Add state-diagnosis routing: "If Ethan's message signals low state (frustration, lethargy, creative block), route to Performance Coach with mudra context."

---

## FILE 13: Oracle Compass — Git commit + push
**Path:** `/Users/ethanpayton/Desktop/oracle-compass-full/`

After ALL edits to `doctrineContent.tsx`, `phaseMap.ts`, and any other Oracle files:

```bash
cd /Users/ethanpayton/Desktop/oracle-compass-full/
git add -A
git commit -m "fix: update all doctrine pages to May 29 EP + vault waterfall reality

- RoadmapPage: complete rewrite (retire Album/Deluxe, correct all dates)
- WartimePage: fix phase arc, platform roles, anti-drift rules, horizon
- ProtocolPage: fix sobriety phase dates (day 43 = Emotions Return)
- RankScrollPage: fix EP date + waterfall count
- SpotifyAdsPage: update budget ladder (Album → Vault Waterfall)
- phaseMap header: fix waterfall order comment"
git push origin main
```

Vercel auto-deploys from main. Live within ~60 seconds.

---

## FILE 14: Update INFRASTRUCTURE_XRAY_AND_AGENT_ROSTER.md
**Path:** `/Users/ethanpayton/.gemini/antigravity/scratch/oracle-compass/Ethan Payton Label OS/INFRASTRUCTURE_XRAY_AND_AGENT_ROSTER.md`

### Edit 14A: Add cost transparency to Visual section (Part 2, Section B)
After the "Gaps" list in Section B (Visual Content), ADD:

```markdown
**Cost Baseline (proven $0 tools Ethan already uses):**
- CapCut Desktop: $0 — parallax animations (Canada Goose, ESL, SEE ME Canvas), motion graphics, basic composites
- Photopea: $0 — image composites, overlays, text design, export formats
- DaVinci Resolve (free tier): $0 — Magic Mask, Fusion compositing, color grading

**AI Pipeline Upgrade Costs (verify before committing):**
- Higgsfield Cinema Studio: [VERIFY CURRENT PRICING — free tier limited]
- SwitchLight Pro: [VERIFY CURRENT PRICING — subscription]
- Dehancer Pro: ~$99-199 one-time (DaVinci plugin for film grain/halation)
- Seedance: [VERIFY CURRENT PRICING]

**Decision rule:** Any AI tool recommendation must show cost delta vs. $0 baseline. If CapCut + Photopea can produce 80% quality at $0, the AI upgrade needs to justify its cost with either (a) 10× speed improvement or (b) quality that unlocks a revenue stream (sync licensing, visual content that drives measurable saves/shares increase).
```

### Edit 14B: Update Frequency Key recommendation
Find the section about FrequencyPage and replace:
```
OLD:
Recommendation: No roster change needed. Just noting that the doctrine pages create a context layer that agents should be aware of even if they don't directly use it.

NEW:
Recommendation: Body/Health Coach actively prescribes frequency-matched warmups (Theta for songwriting, Alpha for mixing, Beta for editing). Performance Coach uses Mudra System as primary diagnostic (5 states → 5 protocols). Creative Director loads FrequencyPage as reference context for mixing/creative decisions. These doctrines are operational tools, not decoration — agents that touch production or state management USE them actively.
```

---

## EXECUTION ORDER FOR SONNET

1. **Files 1** (_DOCTRINE.md) — foundation, everything depends on this
2. **Files 2-6** (doctrineContent.tsx — all 5 page edits) — batch these, they're all in the same file
3. **File 7** (phaseMap.ts header) — quick fix
4. **Files 8-12** (agent charters — 5 files) — batch these, independent of each other
5. **File 13** (git commit + push) — ONLY after verifying Files 2-7 are saved
6. **File 14** (roster doc updates) — can happen anytime

**Estimated Sonnet time:** 15-20 minutes for all edits. The edits are mechanical — find/replace with specified strings. No creative judgment needed.

**WHAT OPUS DID (so Sonnet doesn't redo it):**
- Read all 988 lines of doctrineContent.tsx
- Analyzed all 14 doctrine pages for stale content
- Cross-referenced doctrine content against proposed agent roster
- Identified 6 roster gaps from doctrine analysis
- Wrote the replacement content for every stale section
- Designed the cost transparency framework
- Made the Mudra/Frequency active-use decision (Ethan's pushback incorporated)

**WHAT SONNET DOES:**
- Execute every edit specified above, file by file
- Run the git commit + push
- Verify Vercel deployment shows correct dates after push
- Flag anything that doesn't match the spec (don't improvise, just flag)

---

*This spec is complete. Every line that needs changing is specified. Execute in order.*
