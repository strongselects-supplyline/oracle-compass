# CLAUDE HANDOFF — March 30, 2026
**Time of writing:** 2:53 PM CT  
**Written by:** Claude (current session, credits expiring tonight)  
**For:** Next Claude session — start here, audit everything, then act.

---

## WHO IS ETHAN PAYTON

**Artist name:** past.El  
**Label:** past.El noir Records (DIY sovereign, no outside label)  
**Genre:** Alt-R&B / Dark TrapSoul / OVO-influenced  
**Home city:** Milwaukee, WI (414 area code — "414 Day" is a branded cultural event Apr 14)  
**Income bridge:** DoorDash (funding operations while music builds)  
**Status:** Indie artist in active EP rollout. Sobriety active. Neurodivergent. Operating a full OS (Oracle Compass) to manage music + income + body + business simultaneously.  
**Stack:** Oracle Compass PWA (Next.js, deployed on Vercel) + Gorilla Geo push engine (local Node.js pipeline)

---

## WHAT WAS DONE TODAY (March 30, 2026)

### 1. Transcript Intelligence — COMPLETED
Extracted and synthesized 251-page transcript PDF (`Downloads/transcripts.pdf`).  
Three docs created at `oracle-compass/docs/transcripts_analysis/`:

| Doc | Source | Key Content |
|---|---|---|
| `creative_philosophy.md` | R&B Money — Kevin Hart x J Valentine (pp 1–54) | Sovereign creator, 3-things volume doctrine, Oakland test, pay-your-team-first, association architecture |
| `engine_optimization_protocols.md` | Huberman + Dr. Rena Malik + Rhonda Patrick (pp 55–251) | IF protocol, visceral fat (doubles mortality risk), BPA/phthalate T-drop, creatine 5g/20-25g sleep-dep, sulforaphane, pelvic floor |
| `neuro_cognitive_protocols.md` | Huberman psychology (pp 121–251) | Observer mode, NSDR/Yoga Nidra, emotional suppression tax, worst-case strategy, intrinsic vs extrinsic drive |

### 2. Oracle Compass UI Updates — COMPLETED
- `/studio` → Creator Code module (5 Kevin Hart principles)
- `/engine` → Engine Protocol Stack (IF, protein, lift, creatine, kill black plastic, visceral fat)
- `/brain` → 2 new philosophical anchors + NSDR Recovery Protocol card

### 3. BottomNav Bug Fix — COMPLETED
`components/BottomNav.tsx` had 6 missing `useState` declarations and orphaned brace from a previous interrupted session. Fixed. TypeScript compiles clean.

### 4. Apple Music Analytics — ANALYZED + BAKED INTO ORACLE
Processed `Downloads/songs_1322075123_2026-02-02_2026-03-28.csv` and `Downloads/city_1322075123_2026-02-02_2026-03-28.csv`

**Key findings now in Oracle system prompt (`app/api/oracle/route.ts`):**
- Hollywood Fever = 63% of catalog plays, 16 Shazams — CATALOG ANCHOR
- See Me = 0 Shazams in first 17 days — only hitting existing network, not cold discovery
- Milwaukee = home base (#5 city, 71 plays). Midwest cluster = 36.8% of all plays
- **4 cold discovery cities** (Shazam density = strangers finding HF independently):
  - Albuquerque: 2 Shazams / 7 plays (hottest ratio)
  - Miami: 2 Shazams / 15 plays
  - Portland: 2 Shazams / 23 plays
  - Pittsburgh: 2 Shazams / 35 plays
- If/when budget exists: geo-target these 4 first. Not the Midwest home network.

### 5. Intelligence Artifacts Written
All in `brain/1a83aa94-108e-4cf2-aa60-c324c84fb336/`:
- `spotify_intel_and_ads_guide.md`
- `90_180_day_pressure_test.md`
- `apple_music_analytics_mar30.md`

---

## SYSTEM STATE AS OF MARCH 30

### Release Schedule (`releases.ts` v20)

| Track | Upload | Release | Status |
|---|---|---|---|
| SEE ME | Mar 9 | Mar 13 | LIVE |
| **East Side Love** | **Mar 31 TOMORROW** | Apr 3 | UPLOAD TOMORROW |
| Sweet Frustration | Apr 6 | Apr 10 | Unreleased |
| Like I Did | Apr 13 | Apr 17 | Unreleased |
| ALL LOVE (EP) | Apr 14 | Apr 24 | Unreleased |

> [!CAUTION]
> ESL uploads to Amuse TOMORROW March 31. P0 priority. If this slips, Apr 3 drop is at risk.

### Critical Dates — Next 25 Days

```
Mar 31  Upload ESL to Amuse
Apr 3   ESL DROPS | $1,000 bill due
Apr 6   Upload SF to Amuse
Apr 7   ESL registrations (ISRC, ASCAP, MLC, Songtrust, Musixmatch)
Apr 10  SF DROPS
Apr 13  Upload LID to Amuse
Apr 14  414 DAY (Milwaukee live performance) + EP upload to Amuse
Apr 17  LID DROPS
Apr 24  ALL LOVE EP DROPS ← NORTH STAR
Apr 28  ALL LOVE DELUXE (birthday drop)
```

### Oracle Compass Build State
- TypeScript: clean (`tsc --noEmit` zero errors as of today)
- `releases.ts` version: v20
- Git: last confirmed commit `3eede48` (Mar 26). Run `git log --oneline -5` to check current state.

### Gorilla Geo Pipeline — FIXED (Overlap-Based)

```
Module 1 (Tier):   COMPLETED (Pivoted to overlap-based tiering. T1: 5+ overlaps, T4: 1 overlap)
Module 2 (IG Map): COMPLETED (ig-handles-template.csv exported)
Module 3-5:        PENDING  (Waiting on IG_HANDLE fill)
```

**What changed today:**
Spotify restricted `popularity` and `followers` fields in Development mode, returning 0 for all artists. The tier classifier (`modules/1-tier-classifier.js`) was re-engineered today to bypass popularity entirely and instead tier artists based on **Core Drive overlap track count**. This is actually far more musically relevant: it directly scores how many of *your* tracks share this artist's fanbase.

**Status:**
`./run-all.sh --tier` was executed successfully. `data/ig-handles-template.csv` was generated.

**Next step for Ethan:**
1. Open `gorilla-geo/data/ig-handles-template.csv`
2. Fill the `IG_HANDLE` column for priority artists
3. Save as `gorilla-geo/data/ig-handles-filled.csv`
4. Set credentials in terminal: `export IG_USER=your_handle && export IG_PASS=your_pass`
5. Run the rest of the chain: `cd scratch/gorilla-geo && ./run-all.sh --post-ig`

Note: `gorilla_geo_hitlist.md` (630 engageable + 80 ad-targeting artists sorted by overlap count) is valid — it uses actual Core Drive overlap data, not the fake tier scores.

---

## AUDIT CHECKLIST FOR NEXT SESSION

Run these first before touching anything:

```bash
# 1. Git state
cd /Users/ethanpayton/.gemini/antigravity/scratch/oracle-compass
git log --oneline -5
git status

# 2. TypeScript clean?
npx tsc --noEmit 2>&1 | grep -v "npm notice"

# 3. Gorilla Geo tier data still fake?
python3 -c "
import json
data = json.load(open('/Users/ethanpayton/.gemini/antigravity/scratch/gorilla-geo/data/tier-classified.json'))
t = list(data.keys())[0]
print('Track:', t, '| Summary:', data[t]['summary'])
print('Drake check:', [a for a in data[t]['tiers']['T4'] if 'Drake' in a.get('name','')][:1])
"

# 4. ESL uploaded? (ask Ethan)
# ESL should be uploaded to Amuse by now if it's March 31+
```

---

## EVERYTHING CLAUDE KNOWS ABOUT ETHAN

**Background:**
- Milwaukee native (414). Midwest is home base network.
- Salt Lake City is his #1 Apple Music city (105 plays) — likely family/church/military base network connection there.
- Neurodivergent. Active sobriety. DoorDash = income bridge, not identity.
- 3 years of GPT conversation history was analyzed in building Oracle Compass architecture.

**Music fingerprint:**
- Sonic lane: Dark TrapSoul / OVO. Permanent algorithmic anchors across all 4 analyzed tracks: Drake, PARTYNEXTDOOR, Blxst, Ty Dolla $ign, The Weeknd, Brent Faiyaz, SZA, Tems, Wizkid, Roy Woods.
- Hollywood Fever = catalog anchor (older track). See Me = newest single (Mar 13).
- 5,912 tracks analyzed across Cyanite/Core Drive for sonic placement.
- Content assets per track: MP3/WAV, instrumental, a cappella, lyrics, cover art, raw booth footage, OBS screen recordings.

**Finances:**
- DoorDash tracking: $0/$1,000 monthly target in Kill List
- $1,000 bill due April 3
- Ad budget: ~$0. No Marquee/Showcase until income improves. At $20, boost one IG Reel only (IG, not TikTok, not Facebook).

**Projects planned 2026:**
- ALL LOVE EP — Apr 24 (4 tracks: SEE ME, ESL, SF, LID)
- ALL LOVE DELUXE — Apr 28 (birthday drop)
- CREAM — Jul 10 (valid only if tracks 70%+ done by June 1)
- FREAKSHOW — Oct 23 (push to Q1-2027 if CREAM slips)
- 6 loosie singles throughout

---

## STRATEGIC POSITIONS (locked as of March 30)

**Ads:** $0 until See Me or ESL hits 25+ avg daily listeners on Apple Music. Then $20 max on best organic Reel, geo-target Albuquerque/Miami/Portland/Pittsburgh only.

**Meta/Instagram ad ratio when budget exists:**
- $20-100: 100% IG Reels boost
- $200: $100 IG + $100 Spotify Showcase
- $400+: Add TikTok Spark ads
- Never Facebook at this stage

**Release waterfall:** Don't touch it. Execute it. SF upload Apr 6, LID upload Apr 13. Mixes must be locked before those dates.

**Gorilla Geo hitlist:** Use it now (630 artists to DM/engage). Tier system is broken but overlap rankings are real.

**Kill List redesign:** Phase-based per release (Content Sprint → Upload → Release → Registration) was agreed upon but not coded. Medium priority post-ESL drop.

---

## KEY FILES

| File | Purpose |
|---|---|
| `oracle-compass/docs/handoff_mar24/claude_handoff_mar25.md` | Gorilla Geo pipeline architecture + bug history |
| `oracle-compass/docs/handoff_mar24/claude_handoff_mar26.md` | Release schedule, kill list redesign discussion |
| `oracle-compass/docs/handoff_mar24/SONIC_IDENTITY_MAP.md` | Full sonic identity + algorithmic anchors |
| `oracle-compass/docs/handoff_mar24/esl_campaign_kit.md` | ESL campaign execution kit |
| `oracle-compass/docs/transcripts_analysis/creative_philosophy.md` | Kevin Hart philosophy |
| `oracle-compass/docs/transcripts_analysis/engine_optimization_protocols.md` | Huberman body protocols |
| `oracle-compass/docs/transcripts_analysis/neuro_cognitive_protocols.md` | Huberman psychology |
| `brain/1a83aa94-.../90_180_day_pressure_test.md` | Honest 90-180 day strategy |
| `brain/1a83aa94-.../apple_music_analytics_mar30.md` | Apple Music data analysis |

---

## FIRST PRIORITY TOMORROW

**P0: ESL uploaded to Amuse?** Ask Ethan immediately. If not, that's the only task.  
**P1: Retrieve and confirm filled IG Handles mapping** — once Ethan populates `ig-handles-filled.csv`, run `./run-all.sh --post-ig` in scratch/gorilla-geo.  
**P2: Check Kill List** — derive what's next based on completion state  
**P3: Content sprint for ESL** — CapCut/Adobe templates, reels, Canvas (see `brain/capcut_templates_spec.md`)
