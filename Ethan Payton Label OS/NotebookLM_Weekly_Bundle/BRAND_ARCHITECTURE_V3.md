# BRAND ARCHITECTURE v3 — WHO IS ETHAN PAYTON?
*May 3, 2026 | Opus synthesis of v1 (Claude, May 2) + v2 (Antigravity, May 2) + full Cyanite corpus (21 tracks) + 8-track Core Drive + S4A demographics*

*This document supersedes both `BRAND_ARCHITECTURE_DIAGNOSIS.md` (v1) and `EP_AG_ARTIST_REEVALUATION_V2.md` (v2). It is the canonical brand architecture reference going forward.*

---

## 1. DATA FOUNDATION

**What we have:**
- 21 tracks with Cyanite audio analysis (BPM, key, genre confidence, mood scores, instruments, voice)
- 8-track Core Drive synthesis from gorilla-geo (SEE ME, ESL, SF, Dance With Him, Like I Did, Origami, Just Say So, I Like Girls)
- S4A artist-level demographics, segments, and geographic data (May 2, 2026 snapshot)
- S4A per-track 12-month streaming numbers for all 13 released tracks
- Per-track source breakdown (active vs. programmed %) for top 5 streamers

**What we don't have:**
- Cyanite for 3 released tracks: Difficult, 2 On, Distance (lowest streamers — combined 2,347 streams/year)
- Cyanite for 2 unrecorded EP tracks: Green Light, Want U 2
- Per-track demographics (S4A only shows artist-level; can't isolate Hollywood Fever audience from EP audience)
- Shazam data beyond anecdotal
- Core Drive data for any track released before 2022 (Hollywood Fever, On The Move, Roll With It, etc.)

---

## 2. ALGORITHMIC IDENTITY

### Two valid views of who Spotify thinks you are

v1 used **total playlist co-occurrences** across 4 tracks. v2 used **breadth** (present across all 7 analyzed tracks). These answer different questions and both matter:

**Volume view (who shows up most often in your playlists):**
Drake, Bryson Tiller, PARTYNEXTDOOR, The Weeknd, Summer Walker — the OVO/TrapSoul constellation. This is v1's finding and it holds: Drake has the single highest co-occurrence count.

**Breadth view (who shows up consistently across every track):**
SZA, XXXTENTACION, Majid Jordan, Brent Faiyaz, Lil Wayne, Future, Wizkid, 21 Savage, The Weeknd, H.E.R. — a wider R&B/hip-hop spectrum. This is v2's finding using 7 of 8 available Core Drive files.

**What this means:** You are not an OVO satellite. You are not a pure TrapSoul artist. You sit in a **crossover zone** where R&B, TrapSoul, melodic trap, and hip-hop playlists all claim you as filler between their core artists. The algorithm doesn't put you in a box — it puts you between boxes.

**The Faiyaz correction:** v1 flagged Faiyaz at rank ~20 as a major gap. v2 with more data elevated him to rank 4 by breadth. The gap was a sampling artifact from only having 4 Core Drive outputs. With 7-8 tracks, the aspirational comp pool is validated: Faiyaz (#4), Weeknd (#9), Tiller (#12), PND (#13) all confirmed. 6LACK dropped lower but is still present.

**Note:** v2 excluded Like I Did from its 7-track analysis. The gorilla-geo folder has 8 Core Drive files including `core-drive-lid.json`. Sonnet should run the full 8-track synthesis for Task 9 and note any ranking changes.

---

## 3. SONIC FINGERPRINT — THE FULL CATALOG

### 36-track Cyanite analysis summary (vault audit May 14)

| Stat | Value |
|------|-------|
| Median BPM | **108** |
| BPM range | 82 (Reconnect) — 145 (Turn Me Down) |
| Mean R&B confidence | **0.67** |
| Mean Sexy score | **0.73** |
| Key signature | **15 minor / 6 major** (71% minor) |
| Emotional profile | 20 of 21 = Positive |
| Energy level | 20 of 21 = Medium |
| Voice | 21 of 21 = Male, predominantly High presence |

### The three sonic clusters

Clustering by BPM + key + R&B confidence + Sexy score reveals three distinct production pockets:

**Cluster A — "The Core" (12 tracks)**
104-122 BPM, minor key, R&B 0.60-0.85, Sexy 0.70-0.91.
*Tracks: SEE ME, ESL, Dance With Him, Advance, Origami, Supposed To Know, I Like Girls, Same Time, Like I Did, Just Say So, Roll With It, Little Secret.*
This is the sonic center of gravity. Dark, mid-tempo, high-sexy R&B. Every self-identified comp (Tiller, Faiyaz, PND, Weeknd) lives here. If you had to describe your sound in one sentence, this cluster IS it.

**Cluster B — "The Warm Ones" (5 tracks)**
107-122 BPM, major key, R&B 0.56-0.85, Sexy 0.58-0.74.
*Tracks: Hollywood Fever, On The Move, Ride With Me, Reconnect, Freakshow.*
These are the accessible tracks — warmer, brighter, less intense. Hollywood Fever and On The Move are both here. **This is the cluster that actually generates streams.** More on this below.

**Cluster C — "The Outliers" (4 tracks)**
82-145 BPM spread, genre-ambiguous.
*Tracks: Sweet Frustration (house-R&B, R&B 0.25), Turn Me Down (145 BPM, Rap/Hip-Hop 0.51), Worth It (Rap/Hip-Hop 0.60 primary — not even R&B-primary), Reconnect (82 BPM — slowest in catalog).*
These prove range but confuse the algorithm. Sweet Frustration barely registers as R&B. Worth It is classified as rap first. Turn Me Down is almost double the tempo of your median.

### The Hollywood Fever revelation

Now that we have Hollywood Fever's Cyanite data (122 BPM, **F major**, R&B 0.76, Sexy 0.68, Romantic 0.57, Chill 0.50), we can see exactly why the algorithm loves it:

- **F major** — one of only 6 major-key tracks in the catalog. Warm, accessible.
- **Sexy 0.68** — BELOW your catalog average of 0.73. Less intense than most of your catalog.
- **Romantic 0.57** — the highest Romantic score of any fully-extracted track. It's not "sexy" — it's "romantic." Different energy entirely.
- **Chill 0.50** — moderate. Not demanding.
- **Lo-fi Rap** free genre tag — Cyanite sees it as lo-fi. That puts it in lo-fi/chill playlists, not just R&B.

**Hollywood Fever works because it's the least intense track in your catalog.** It's the major-key, moderate-mood, romantic-leaning outlier in a catalog dominated by dark, minor-key, high-sexy material. The algorithm uses it as connective tissue in mellow playlists because it doesn't demand attention.

On The Move confirms this: A major, Happy 0.62 (the ONLY track where Happy is the lead mood), Sexy 0.58 (below average). Your #2 streamer is also your warmest, brightest track.

**The implication:** Your two commercial successes are your two most accessible, warm, major-key tracks. Your artistic center (Cluster A — dark, minor, intense) is where you WANT to live but it's not what converts at scale. This is the core tension in the catalog.

---

## 4. AUDIENCE

### Demographics (S4A, May 2, 2026)

| Dimension | Value | R&B Industry Norm |
|-----------|-------|-------------------|
| Gender | 60% male / 38% female | 55-65% female |
| Core age | 61% are 25-34 | More distributed |
| Secondary age | 27% are 35-44 | Smaller tail |
| Under 25 | 7% | 25-40% |
| 2-year reach | 241,752 | — |
| Monthly active | 4% (~9,700) | 15-25% for healthy catalogs |
| Programmed | 76% | 40-60% typical |
| Follower growth | 0.6% despite 52.6% listener growth | — |

### Geographic moat

| City | Listeners (28d) |
|------|----------------|
| Chicago | 598 |
| Denver | 455 |
| Minneapolis | 352 |
| New York | 343 |
| Phoenix | 284 |
| Dallas | 275 |
| Milwaukee | 222 (#14) |

The Midwest/Mountain West/Canadian corridor (Chicago → Denver → Minneapolis → Toronto → Calgary → Seattle) is unclaimed territory in the OVO/TrapSoul lane. Drake and PND own Toronto/Atlanta. Tiller owns Louisville/Atlanta. You own Chicago-Denver-Minneapolis. Nobody else does.

### The three listener types (refined from v1)

**The Algorithmic Passenger (est. 70% of streams, 40% of unique listeners)**
Male, 27-33, professional, commutes. Hollywood Fever/On The Move delivered via Discover Weekly, Radio, or auto-generated playlists. Streams without saving, following, or even registering the artist name. This person IS your streaming numbers but is NOT your audience in any meaningful sense. They are the algorithm's audience, and your music is the vehicle.

**The Curator (est. 15% of streams, 25% of unique listeners)**
Female or male, 25-32, active playlist builder. Found a deep cut through a user-curated playlist or related-artist browse. Knows Che Ecru, Sonder, Chase Shakur, NO1-NOAH — the mid-tier ecosystem. Higher save rate, actually follows. Pickiest about production quality. This is the audience that can grow.

**The Legacy Listener (est. 15% of streams, 35% of unique listeners)**
Male, 36-43, Midwest. Bridged from Chris Brown/Trey Songz/Usher era via algorithm. Passive but high-volume — plays background music for hours. Doesn't save, doesn't follow, doesn't visit profile. Responsible for disproportionate stream count relative to engagement. Turn Me Down's 90% active / 9% programmed split suggests a small but real pocket of these listeners who deliberately seek out that track.

---

## 5. COMMERCIAL REALITY

### The streaming tiers

| Tier | Track | 12mo Streams | Save Rate | Active % | Programmed % |
|------|-------|-------------|-----------|----------|-------------|
| **Algorithmic engine** | Hollywood Fever | 518,867 (74.7%) | 1.16% | 22% | 84% |
| **Algorithmic engine** | On The Move | 147,766 (21.3%) | 1.66% | 35% | 66% |
| **Mid catalog** | Roll With It | 19,657 (2.8%) | 1.10% | 46% | 51% |
| **Organic core** | Ride With Me | 2,141 | 2.83% | 69% | 30% |
| **Organic core** | Turn Me Down | 1,160 | 1.98% | 90% | 9% |
| **Organic core** | SEE ME | 504 | **6.55%** | — | — |
| **Tail** | 7 other tracks | 4,821 combined | ~1.5% avg | — | — |

### The retention crisis — reframed

v1 and v2 both diagnosed a "retention crisis." The data supports it: 241K reach, 4% monthly active, 1.28% catalog save rate. But the v3 insight is **the crisis has a specific cause:**

**Hollywood Fever attracts the wrong audience for the rest of the catalog.**

HF is major-key, romantic, moderate-intensity, lo-fi-tagged. It delivers listeners who want warm, chill, background R&B. The rest of the catalog (71% minor key, Sexy avg 0.73, dark mood) is tonally alien to what HF promised them. They hear HF via algorithm → the algorithm serves them SEE ME or Dance With Him → the mood shift is jarring → they don't save, don't follow, don't return.

Evidence: Ride With Me (R&B 0.85, 69% active, save rate 2.83%) and SEE ME (save rate 6.55%) show that when listeners CHOOSE to engage with the catalog, they convert at healthy rates. The save rate problem is concentrated in the algorithmically-delivered segment, not the organic one.

**This reframes the EP strategy.** The EP doesn't need to "fix" retention broadly — it needs to either (a) attract a new listener cohort that matches the catalog's actual sonic identity, or (b) include a warm, accessible track that serves as a new on-ramp for HF listeners.

---

## 6. SELF-ASSESSMENT AUDIT

### What Ethan gets right

**The aspirational comps.** Faiyaz (#4), Weeknd (#9), Tiller (#12), PND (#13) — all confirmed by 7-8 track Core Drive. Most indie artists are delusional about their comps. Ethan is not. His self-awareness is unusually accurate.

**The "2AM drive" positioning.** 60% male, 25-34, programmed listening, 108 BPM median, minor-key dominant, high-sexy. He arrived at this instinctively and the data confirms it exactly.

**The sonic range.** BPM 82-145, R&B confidence 0.25-0.85. The range is measured, not claimed. He can credibly operate from house (SF) through classic R&B (Ride With Me/DWH) through near-rap (Turn Me Down/Worth It).

**The Midwest moat.** Chicago-Denver-Minneapolis is genuinely unclaimed in this lane.

**The performance archetype.** Atmospheric/presence, not choreography. Don Toliver/Faiyaz/Weeknd school. The Cyanite profile (high danceability + low energy = "cocktail hour pocket") confirms this is the right instinct for live performance.

### What Ethan gets wrong

**"Alt-R&B" is the wrong genre label.** Average R&B confidence 0.67 is solidly mainstream R&B. The algorithm sees R&B/Trap crossover, not alt-R&B. Alt-R&B implies KAYTRANADA, Frank Ocean, Steve Lacy — experimental, genre-defiant. Only Sweet Frustration (R&B 0.25) qualifies. The correct label is **R&B** or **contemporary R&B** — the "alternative" part is his infrastructure and his independence, not his sound.

**The builder narrative is internal, not audience-facing.** Oracle Compass, Core Drive Builder, the dual-AI system — none of this is visible to listeners. The 150K people who heard HF last year experienced "a song during my commute." The Sovereign Builder archetype matters for Ethan's identity but it's not a marketing message. It's a behind-the-scenes documentary pitch, not a Spotify bio.

**The EP narrative arc needs rewriting.** brand_story_core.md describes a 4-track arc (SEE ME → ESL → SF → LID). The actual EP is 5 tracks in different order (GL → SF → SEE ME → ESL → WU2) and LID isn't on it.

### What changed from v1 to v3

| Finding | v1 (4-track, May 2) | v2 (7-track, May 2) | v3 (this doc) |
|---------|--------------------|--------------------|---------------|
| Faiyaz gap | "Rank ~20. Gap is real." | "Rank 4. Gap was sampling artifact." | **Confirmed resolved. Faiyaz adjacency is real.** |
| Primary neighbor | Drake (#1 by volume) | SZA (#1 by breadth) | **Both valid. Drake = highest volume. SZA = widest breadth. You're a bridge, not a satellite.** |
| Lane | "OVO/TrapSoul satellite" | "R&B/Trap crossover" | **R&B crossover with trap production DNA. Bridge artist between genres.** |
| Retention diagnosis | "Catalog isn't holding them" | "He's filler between bigger artists" | **Hollywood Fever attracts a mismatched audience. Organic listeners convert fine.** |
| Key insight | Brent Faiyaz gap | Bridge artist framing | **The warm/dark split: commercial success lives in Cluster B, artistic identity lives in Cluster A** |

---

## 7. THE REAL BRAND POSITION

### v1 position (May 2):
> "Ethan Payton makes the music that 28-year-old men in Chicago play on repeat at 2AM without saving, following, or telling anyone about it. The EP is the bet that they start saving."

### v2 position (May 2):
> "Ethan Payton is a correctly self-aware R&B artist with elite infrastructure and a retention problem. The algorithm agrees with his identity — the gap isn't who he is, it's that nobody stays long enough to find out."

### v3 position (May 3):
> **Ethan Payton is a dark, minor-key R&B artist whose biggest commercial asset is his warmest, brightest song. The 150K people the algorithm delivered via Hollywood Fever want something he doesn't usually make. The 500 people who found SEE ME and saved it at 6.5% want exactly what he does make. The EP is the bet that the second group can outgrow the first.**

---

## 8. STRATEGIC FRAMEWORK — 2026 AND BEYOND

### Phase 1: EP Launch (May 8-31)

**ESL drops May 8** as advance single. First test of Release Radar with new material since SEE ME (Mar 13). The metric to watch is **ESL's 7-day save rate**. If it holds above 3%, the new material converts. If it regresses to 1-2%, the HF-era pattern persists.

**EP drops May 29** (Green Light, Sweet Frustration, SEE ME, ESL, Want U 2). Piggybacks ICEMAN release day. Goal: move streams-per-listener above 4.0 (currently 2.6). Secondary goal: shift 28-day stream share so HF drops below 60%.

**Sweet Frustration is the calculated swing.** R&B confidence 0.25, house-R&B lane. It will attract a different curator set and potentially a different audience segment. Do NOT pitch SF to the same curators as ESL/SEE ME. It's a separate editorial pitch targeting house/electronic-R&B playlists (KAYTRANADA lane). If it works, it opens a second algorithmic channel. If it doesn't, it's one track out of five.

### Phase 2: Waterfall (Jun 12 — Aug 7)

Post-EP vault waterfall (reorder approved May 14):
- **Jun 12**: I Like Girls (107 BPM, F# minor — leads, strongest Cluster A opener)
- **Jun 26**: Like I Did (110 BPM, D minor — Cluster A core track)
- **Jul 10**: Worth It (97 BPM, F minor — Cluster C outlier, rap-leaning)
- **Jul 24**: Just Say So (122 BPM, Bb minor — Cluster A; CREAM tracklist lock)
- **Aug 7**: Reconnect (82 BPM, D major — Cluster B warm track, slowest in catalog)

Worth It (rap-primary at 0.60) and Reconnect (D major, warm, low vocal presence) are the two wildcard releases. Worth It tests the hip-hop lane. Reconnect tests the warm/chill lane that HF proved works commercially.

### Phase 3: CREAM Tracklist Lock (Jul 24)

Go/no-go criteria should include:
1. **EP save rate** — did any EP track sustain above 3%?
2. **Streams-per-listener** — did it move above 4.0?
3. **HF share shift** — did the EP + waterfall reduce HF's 28-day dominance below 50%?
4. **New follower trajectory** — did the waterfall produce measurable follower growth?
5. **Live traction** — did the 414 Day set or any other performance convert?

CREAM is confirmed. Jul 24 = tracklist lock (data decides which 5 tracks, not whether to proceed). CREAM pre-production starts August.

### Phase 4: The Warm/Dark Bridge — What 3,125 Artists Teach Us

The v3 data initially framed this as a choice: stay dark or go warm. **The 3,125-artist overlap matrix says there is no choice to make. The bridge already exists.**

#### The algorithm doesn't see the gap

We ran the warm/dark split against the full gorilla-geo matrix (3,125 named artists across 8 Core Drive tracks). Result: **zero artists are unique to Sweet Frustration's T1 neighborhood.** Every single SF neighbor also appears in the dark-core tracks. The playlist ecosystem doesn't separate "house-R&B Ethan" from "dark TrapSoul Ethan" — to the algorithm, they're the same artist.

This means the warm/dark tension is audible in the Cyanite data but invisible to Spotify's recommendation engine. Listeners who encounter SF in an electronic-R&B playlist are being served by the same algorithmic graph that delivers SEE ME and Dance With Him.

#### The artists who prove it

**T1 triple-bridge artists** — present as top-tier neighbors in ILG (darkest sexy), DWH (darkest sexy), AND SF (house outlier) simultaneously:

| Artist | Why they matter |
|--------|----------------|
| **Brent Faiyaz** | 6/8 tracks, dark + SF. Operates from "Dead Man Walking" (dark, detached) to "Gravity" (warm groove) without identity crisis. The vocal thread is the bridge — the voice never changes, only the production does. |
| **Miguel** | 6/8 tracks, dark + SF. THE blueprint. "Adorn" is simultaneously warm AND sexy — major key, groove-forward, but intimate vocal, high-sexy mood. He doesn't choose between warm and sexy. He makes warmth feel sexy. |
| **Kali Uchis** | 5/8 tracks, dark + SF. Moves from "Telepatía" (warm, dreamy) to "After the Storm" (darker, textured) through consistent aesthetic vision. The VISUAL identity bridges the sonic range. |
| **Jhené Aiko** | 6/8 tracks, dark + SF. "Sativa" is dark and heavy. "While We're Young" is warm and light. Same voice, same spaciousness, same intimacy level throughout. |

**T2 bridge artists at reachable scale:**

| Artist | Tracks | The lesson |
|--------|--------|------------|
| **Anderson .Paak** | 7/8 (all T2) | Bridges through GROOVE. "Come Down" is warm and energetic, "Room in Here" is dark and sexy. The drumming and cadence are the constant. |
| **KAYTRANADA** | 4/8 (T2 in dark + SF) | Literally the SF reference artist. "10%" is sexy and dark, "GLOWED UP" is warm and danceable. Production texture is the bridge. |
| **Sabrina Claudio** | 4/8 (T2 in dark + SF) | Dark-sexy vocal identity over both intimate and upbeat production. The Spanish-language tracks add warmth without sacrificing mood. |
| **Xavier Omär** | 4/8 (T2 in dark + SF) | Mid-tier R&B bridge. "Blind Man" is dark, "So Much More" is warm. Falsetto delivery stays consistent. |
| **bLAck pARty** | 4/8 (T2 in dark + SF) | Alt-R&B with consistent psychedelic production across moods. |
| **Majid Jordan** | 3/8 (T2 in dark + SF) | OVO-signed. "Gave Your Love Away" is dark R&B, "Wildest Dreams" leans warm electronic. Production palette bridges both. |
| **Frank Ocean** | 4/8 (T2 in dark + SF) | The emotional authenticity IS the bridge. Mood shifts feel intentional, not confused, because the songwriting is confessional regardless of production. |

#### What these artists do that Ethan already does

The bridge artists share three traits:

**1. Consistent vocal identity across production shifts.** The voice is the brand, not the beat. When the production moves from 808 trap to house to stripped R&B, the vocal approach (tone, texture, register, intimacy level) stays recognizable. Ethan already does this — his vocal signature (intimate, textured, mixed-voice, unhurried) is consistent from Dance With Him (0.91 sexy, C# minor) through Hollywood Fever (0.68 sexy, F major). The voice doesn't change. The instrument around it does.

**2. "Warm" means "romantic + sexy in a major key," not "happy."** The artists who bridge successfully never go *happy*. They go *warm-sexy* — major key, groove-forward, romantic mood, but still intimate and slightly dark in vocal delivery. Hollywood Fever already hits this formula: F major + Romantic 0.57 + Sexy 0.68 = warm without losing the identity. On The Move is the only track where Happy actually leads (0.62) — and it's also the most generic-sounding in the catalog. The lesson: romantic warmth converts. Generic happiness doesn't.

**3. One warm track per project, sequenced as an on-ramp.** The Weeknd puts "Blinding Lights" on After Hours. Drake puts "Passionfruit" on More Life. Don Toliver puts "No Idea" on Heaven or Hell. The warm track isn't a concession — it's an entry point. It catches the casual listener and funnels them into the dark core where the real identity lives.

#### The prescription for Ethan

**You don't have a warm/dark gap. You have a warm/dark range that the algorithm already recognizes as one artist.** The artists most adjacent to you across 3,125 names all do exactly what you do — move between moods while keeping vocal identity constant.

The fix isn't strategic — it's intentional sequencing:

**For the EP (May 29):** The track order already leads with new material (GL, SF) into the dark core (SEE ME, ESL) into EP-exclusive (WU2). If Green Light lands as a warm-sexy opener (we'll know once it's recorded and Cyanite-analyzed), the EP already has the on-ramp → core → reward structure.

**For the waterfall:** Reconnect (D major, warm, Aug 7) is correctly sequenced LAST. After four dark-core singles prime the algorithm for who you are, the warm closer tests whether those listeners can follow you into a different register.

**For CREAM (if greenlit):** The album should contain 1-2 tracks in the Hollywood Fever zone — major key, 105-120 BPM, Sexy 0.65-0.75, Romantic 0.45+. Not because you're compromising, but because those tracks serve as algorithmic on-ramps to the dark tracks that ARE the artistic statement. The Miguel model: make warmth feel sexy instead of choosing between them.

**The formula:** major key + moderate sexy (0.65-0.75) + high romantic (0.45+) + same vocal texture as the dark tracks = a warm song that still sounds like Ethan Payton. HF already proves this works commercially. Do it on purpose next time.

#### What you'd lose by going ALL warm

The dark-only cohort — artists who appear in the dark tracks but NOT in SF:

**Summer Walker, 6LACK, Chase Shakur, NO1-NOAH, Che Ecru, FRVRFRIDAY, Khalid, Kaash Paige, Isaiah Falls, Ryan Trey, Avenoir, Samaria.**

These are the mid-tier indie R&B artists — the organic-growth ecosystem where curators discover you. Going all-warm would drift you away from this neighborhood and toward the Pop/mainstream pool where you'd compete with vastly larger budgets. The dark core is your competitive moat at the indie level. Don't abandon it. Complement it.

#### What you'd lose by going ALL dark

The warm-adjacent cohort — the KAYTRANADA, Majid Jordan, Anderson .Paak, Frank Ocean, Sabrina Claudio T2 neighborhood. These artists bring you into electronic-R&B and alternative playlists that your dark-core tracks alone don't access. Sweet Frustration is the track that opens this door. Losing this lane means losing the editorial-playlist angle that SF uniquely provides.

**Bottom line: own both. The data says you already do.**

### The FREAKSHOW Project

Four tracks (Freakshow, Little Secret, Same Time, Tear Me Down) form a cohesive vault collection — a working project, not random deep cuts. Cyanite profiles: 106-114 BPM, mixed keys, R&B 0.49-0.78. Freakshow is the genre outlier (R&B 0.49 — below threshold).

As a project, FREAKSHOW sits in Cluster A/C overlap — darker than the catalog average, genre-ambiguous enough to experiment with. Potential uses: post-CREAM palette cleanser, SoundCloud/Bandcamp-only experimental release, or a bridge into a more rap-forward lane if Worth It's waterfall performance (Rap/Hip-Hop 0.60 primary) signals demand.

---

## 9. WHAT'S STILL MISSING

| Gap | Priority | How to Close |
|-----|----------|-------------|
| Cyanite for Difficult, 2 On, Distance | Low (combined 2,347 streams/yr) | Upload to Cyanite when free credits reset |
| Cyanite for Green Light, Want U 2 | High (EP tracks) | Run after recording (May 1-5 marathon) |
| Per-track demographics | High (need to isolate HF audience from EP) | S4A individual song pages, check 30 days post-EP |
| Core Drive for pre-2022 catalog | Medium (HF, OTM, RWI have no co-occurrence data) | Run Core Drive Builder on these tracks |
| Shazam data | Low | Check Shazam for Artists dashboard |
| Content performance correlation | Medium | IG Insights cross-referenced with S4A after EP launch |

---

## 10. SINGLE-LINE REFERENCE

**For marketing:** "The 2AM drive from Milwaukee. Dark R&B for men who don't share their playlists."

**For playlist pitching:** "Contemporary R&B with trap production. Fits between Bryson Tiller and Brent Faiyaz. Male 25-34 core demo."

**For editorial pitch (SF only):** "House-R&B in the KAYTRANADA lane. The outlier from an otherwise TrapSoul-leaning EP."

**For internal strategy:** "The algorithm already sees one artist across both lanes. The voice is the brand, not the mood. Own both: dark core for identity, warm-sexy for on-ramps. Miguel model: make warmth feel sexy instead of choosing."

**The warm-track formula (for CREAM):** Major key + 105-120 BPM + Sexy 0.65-0.75 + Romantic 0.45+ + same vocal texture = Hollywood Fever on purpose.

---

*This document lives at `brain/BRAND_ARCHITECTURE_V3.md`. Update after EP has 30 days of data (June 15). Update again after waterfall complete (August). Final review at CREAM tracklist lock (Jul 24).*

*Predecessor docs: `BRAND_ARCHITECTURE_DIAGNOSIS.md` (v1, May 2), `EP_AG_ARTIST_REEVALUATION_V2.md` (v2, May 2). Both remain for audit trail but are superseded by this document.*

